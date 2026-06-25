/// <reference types="vite/client" />

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase, ref, get, child, push, set } from 'firebase/database';
import { SemanaProgramacao } from './types';
import appletConfig from '../firebase-applet-config.json';

const projId = appletConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Fetch credentials from config file with environment variable fallback
const firebaseConfig = {
  apiKey: appletConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: appletConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: (appletConfig as any).databaseURL || import.meta.env.VITE_FIREBASE_DATABASE_URL || (projId ? `https://${projId}-default-rtdb.firebaseio.com` : ""),
  projectId: projId,
  storageBucket: appletConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: appletConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: appletConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if variables are populated
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId
);

// Initialize standard Firebase app if configured
if (isFirebaseConfigured && getApps().length === 0) {
  try {
    initializeApp(firebaseConfig);
  } catch (error) {
    console.warn("Failed to initialize central Firebase app:", error);
  }
}

let dbInstance: any = null;

export function getFbDatabase() {
  if (!isFirebaseConfigured) {
    return null;
  }
  
  try {
    if (getApps().length === 0) {
      const app = initializeApp(firebaseConfig);
      dbInstance = getDatabase(app);
    } else {
      const app = getApp();
      dbInstance = getDatabase(app);
    }
    return dbInstance;
  } catch (error) {
    console.warn("Failed to initialize Firebase Realtime Database:", error);
    return null;
  }
}

/**
 * Fetches schedules by combining separate Tuesday, Saturday, and Mechanical trunks
 * from the Firebase Realtime Database, matching the data model saved by AppVM.
 */
export async function fetchSchedulesFromDB(): Promise<{ weeks: SemanaProgramacao[]; isDemo: boolean }> {
  const db = getFbDatabase();
  
  if (!db) {
    console.log("Firebase not configured. Returning empty schedules list.");
    return { weeks: [], isDemo: false };
  }
  
  try {
    const dbRef = ref(db);
    
    // Fetch Tuesday, Saturday and Support trunks in parallel
    const [snapSemana, snapFimSemana, snapMecanica] = await Promise.all([
      get(child(dbRef, 'designacoes_semana')),
      get(child(dbRef, 'designacoes_fim_semana')),
      get(child(dbRef, 'apoio_mecanica'))
    ]);
    
    const valSemana = snapSemana.exists() ? snapSemana.val() : {};
    const valFimSemana = snapFimSemana.exists() ? snapFimSemana.val() : {};
    const valMecanica = snapMecanica.exists() ? snapMecanica.val() : {};
    
    // Check if we retrieved any data at all across all three trunks
    const databaseIsEmpty = 
      Object.keys(valSemana).length === 0 && 
      Object.keys(valFimSemana).length === 0 && 
      Object.keys(valMecanica).length === 0;
      
    if (databaseIsEmpty) {
      console.log("No data found in Firebase under new trunks. Returning empty schedules list.");
      return { weeks: [], isDemo: false };
    }
    
    const weeksMap: Record<string, any> = {};
    
    // Month translation map
    const mesesNomes: Record<string, string> = {
      "1": "Janeiro", "01": "Janeiro",
      "2": "Fevereiro", "02": "Fevereiro",
      "3": "Março", "03": "Março",
      "4": "Abril", "04": "Abril",
      "5": "Maio", "05": "Maio",
      "6": "Junho", "06": "Junho",
      "7": "Julho", "07": "Julho",
      "8": "Agosto", "08": "Agosto",
      "9": "Setembro", "09": "Setembro",
      "10": "Outubro",
      "11": "Novembro",
      "12": "Dezembro"
    };
    
    // Build canonical ID (YYYY-MM-DD format based on Monday offset)
    const buildIdFromWeek = (semanaVal: string): string => {
      if (!semanaVal) return "2026-06-01";
      const parts = semanaVal.split('-');
      if (parts.length >= 3) {
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const wStr = parts[2].replace('w', '');
        const wNum = parseInt(wStr) || 1;
        const days = ["01", "08", "15", "22", "29"];
        const day = days[wNum - 1] || "01";
        return `${year}-${month}-${day}`;
      }
      return semanaVal;
    };
    
    // Generate beautiful week title
    const getWeekLabel = (weekKey: string, monthNum: string, yearStr: string) => {
      const match = weekKey.match(/w(\d+)/i);
      const wNum = match ? match[1] : "1";
      const monthLabel = mesesNomes[monthNum] || "Junho";
      
      const ranges: Record<string, string> = {
        "1": "01 a 07",
        "2": "08 a 14",
        "3": "15 a 21",
        "4": "22 a 28",
        "5": "29 a 31"
      };
      
      const days = ranges[wNum] || "01 a 07";
      return `${days} de ${monthLabel}, ${yearStr}`;
    };
    
    // Generate week range formatted (e.g. "01/05 a 07/05")
    const getWeekLabelSimple = (weekKey: string, monthNum: string) => {
      const match = weekKey.match(/w(\d+)/i);
      const wNum = match ? match[1] : "1";
      
      const monthPadded = monthNum.padStart(2, '0');
      const ranges: Record<string, string> = {
        "1": `01/${monthPadded} a 07/${monthPadded}`,
        "2": `08/${monthPadded} a 14/${monthPadded}`,
        "3": `15/${monthPadded} a 21/${monthPadded}`,
        "4": `22/${monthPadded} a 28/${monthPadded}`,
        "5": `29/${monthPadded} a 31/${monthPadded}`
      };
      
      return ranges[wNum] || `01/${monthPadded} a 07/${monthPadded}`;
    };
    
    // Parsers for midweek (Terça)
    const mapMeioSemana = (meioData: any): any => {
      if (!meioData) return undefined;
      
      const facaSeuMelhorList: any[] = [];
      if (meioData.facaMelhor && typeof meioData.facaMelhor === 'object') {
        const sortedParts = Object.keys(meioData.facaMelhor).sort();
        sortedParts.forEach((partKey) => {
          const partVal = meioData.facaMelhor[partKey];
          if (partVal) {
            facaSeuMelhorList.push({
              tema: partVal.tema || "Designação de Estudante",
              tempo: partVal.tempo || "5 min",
              orador: partVal.estudante || "—",
              ajudante: partVal.ajudante || "",
              referencia: partVal.referencia || ""
            });
          }
        });
      }
      
      const vidaCristaList: any[] = [];
      if (meioData.vidaCrista && typeof meioData.vidaCrista === 'object') {
        const sortedVida = Object.keys(meioData.vidaCrista).sort();
        sortedVida.forEach((partKey) => {
          const partVal = meioData.vidaCrista[partKey];
          if (partVal) {
            vidaCristaList.push({
              tema: partVal.tema || "Tema de Vida Cristã",
              tempo: partVal.tempo || "15 min",
              orador: partVal.designado || "—"
            });
          }
        });
      }

      const tesourosList = [
        {
          tema: "Tesouros da Palavra de Deus",
          tempo: "10 min",
          orador: meioData.tesourosDiscurso || "—"
        },
        {
          tema: "Encontre joias espirituais",
          tempo: "10 min",
          orador: meioData.tesourosJoias || "—"
        },
        {
          tema: "Leitura da Bíblia",
          tempo: "4 min",
          orador: meioData.tesourosLeitura || "—"
        }
      ];

      return {
        presidente: meioData.presidente || "—",
        oracaoInicial: meioData.oracaoInicial || "—",
        oracaoFinal: meioData.oracaoFinal || "—",
        canticoInicial: "—",
        canticoIntermediario: "—",
        canticoFinal: "—",
        tesouros: tesourosList,
        facaSeuMelhor: facaSeuMelhorList,
        vidaCrista: vidaCristaList,
        estudoBiblico: meioData.estudoBiblico ? {
          dirigente: meioData.estudoBiblico.dirigente || "—",
          leitor: meioData.estudoBiblico.leitor || "—",
          tema: meioData.estudoBiblico.tema || "Estudo Bíblico de Congregação"
        } : undefined
      };
    };
    
    // Parsers for weekend (Sábado)
    const mapFimSemana = (fimData: any): any => {
      if (!fimData) return undefined;
      return {
        presidente: fimData.presidente || "—",
        orador: fimData.orador || "—",
        congregaçãoOrador: fimData.congregacaoVisitante || "Local",
        temaDiscurso: fimData.discursoTema || "Tema do discurso público",
        dirigenteSentinela: fimData.presidente || "—",
        leitorSentinela: fimData.leitorSentinela || "—",
        canticoInicial: "—",
        canticoIntermediario: "—",
        canticoFinal: "—",
        oracaoInicial: fimData.oracaoInicial || "—",
        oracaoFinal: fimData.presidente || "—"
      };
    };
    
    // Parsers for support mechanics
    const mapMecanicas = (reuniaoData: any): any => {
      if (!reuniaoData) return undefined;
      return {
        indicador: reuniaoData.indicador || "—",
        microfonista: reuniaoData.microfonista || "—",
        palco: reuniaoData.palco || "—",
        midias: reuniaoData.midias || "—"
      };
    };

    // 1. Traverse designacoes_semana (Tuesday Reunião)
    if (valSemana && typeof valSemana === 'object') {
      for (const [year, months] of Object.entries(valSemana)) {
        if (months && typeof months === 'object') {
          for (const [month, weeks] of Object.entries(months as any)) {
            if (weeks && typeof weeks === 'object') {
              for (const [weekKey, weekData] of Object.entries(weeks as any)) {
                if (weekData && typeof weekData === 'object') {
                  const semanaVal = (weekData as any).semana || `${year}-${month}-${weekKey}`;
                  const mappedId = buildIdFromWeek(semanaVal);
                  
                  if (!weeksMap[mappedId]) {
                    weeksMap[mappedId] = {
                      id: mappedId,
                      labelSemana: getWeekLabel(weekKey, month, year),
                      publicadoMeioSemana: true,
                      publicadoFimSemana: false,
                      originalWeekKey: weekKey,
                      originalMonth: month,
                      originalYear: year
                    };
                  } else {
                    weeksMap[mappedId].publicadoMeioSemana = true;
                  }
                  
                  weeksMap[mappedId].meioSemana = mapMeioSemana(weekData);
                }
              }
            }
          }
        }
      }
    }

    // 2. Traverse designacoes_fim_semana (Saturday Reunião)
    if (valFimSemana && typeof valFimSemana === 'object') {
      for (const [year, months] of Object.entries(valFimSemana)) {
        if (months && typeof months === 'object') {
          for (const [month, weeks] of Object.entries(months as any)) {
            if (weeks && typeof weeks === 'object') {
              for (const [weekKey, weekData] of Object.entries(weeks as any)) {
                if (weekData && typeof weekData === 'object') {
                  const semanaVal = (weekData as any).semana || `${year}-${month}-${weekKey}`;
                  const mappedId = buildIdFromWeek(semanaVal);
                  
                  if (!weeksMap[mappedId]) {
                    weeksMap[mappedId] = {
                      id: mappedId,
                      labelSemana: getWeekLabel(weekKey, month, year),
                      publicadoMeioSemana: false,
                      publicadoFimSemana: true,
                      originalWeekKey: weekKey,
                      originalMonth: month,
                      originalYear: year
                    };
                  } else {
                    weeksMap[mappedId].publicadoFimSemana = true;
                  }
                  
                  weeksMap[mappedId].fimSemana = mapFimSemana(weekData);
                }
              }
            }
          }
        }
      }
    }

    // 3. Traverse apoio_mecanica (Support)
    if (valMecanica && typeof valMecanica === 'object') {
      for (const [year, months] of Object.entries(valMecanica)) {
        if (months && typeof months === 'object') {
          for (const [month, weeks] of Object.entries(months as any)) {
            if (weeks && typeof weeks === 'object') {
              for (const [weekKey, weekData] of Object.entries(weeks as any)) {
                if (weekData && typeof weekData === 'object') {
                  const semanaVal = (weekData as any).semana || `${year}-${month}-${weekKey}`;
                  const mappedId = buildIdFromWeek(semanaVal);
                  
                  if (!weeksMap[mappedId]) {
                    weeksMap[mappedId] = {
                      id: mappedId,
                      labelSemana: getWeekLabel(weekKey, month, year),
                      publicadoMeioSemana: false,
                      publicadoFimSemana: false,
                      originalWeekKey: weekKey,
                      originalMonth: month,
                      originalYear: year
                    };
                  }
                  
                  const reuniaoSemanaObj = (weekData as any)["reunião_semana"] || (weekData as any).reuniao_semana;
                  const reuniaoFimSemanaObj = (weekData as any)["reunião_fim_semana"] || (weekData as any).reuniao_fim_semana;

                  weeksMap[mappedId].mecanicasMeioSemana = mapMecanicas(reuniaoSemanaObj);
                  weeksMap[mappedId].mecanicasFimSemana = mapMecanicas(reuniaoFimSemanaObj);

                  // Extract cleaning crew
                  let equipeLimpeza = (weekData as any)["equipe_limpeza"] || (weekData as any).equipe_limpeza || (weekData as any)["equipeLimpeza"];
                  if (!equipeLimpeza) {
                    const limpStr = (reuniaoSemanaObj as any)?.limpeza || (reuniaoFimSemanaObj as any)?.limpeza;
                    if (limpStr) {
                      const match = limpStr.match(/^([^\(]+)\((.+)\)$/);
                      if (match) {
                        const nome = match[1].trim();
                        const integrantes = match[2].split(',').map((s: string) => s.trim());
                        equipeLimpeza = { nome, integrantes };
                      } else {
                        equipeLimpeza = { nome: limpStr, integrantes: [] };
                      }
                    }
                  }
                  
                  if (equipeLimpeza) {
                    weeksMap[mappedId].equipeLimpeza = {
                      nome: equipeLimpeza.nome || equipeLimpeza.grupo || (equipeLimpeza.numero ? `Equipe ${equipeLimpeza.numero}` : "Equipe de Limpeza"),
                      integrantes: Array.isArray(equipeLimpeza.integrantes) ? equipeLimpeza.integrantes : []
                    };
                  }
                }
              }
            }
          }
        }
      }
    }

    // Compile list of final weeks sorted chronologically
    const weeksList = Object.values(weeksMap) as SemanaProgramacao[];
    weeksList.sort((a, b) => a.id.localeCompare(b.id));

    // Compile dynamic mecanicaMensal for each week based on month mapping
    weeksList.forEach((week: any) => {
      const parentYear = week.originalYear || "2026";
      const parentMonthStr = week.originalMonth || "5";
      const parentMonthName = mesesNomes[parentMonthStr] || "Junho";
      
      // Select all weeks from the same year and month
      const sameMonthWeeks = weeksList.filter((w: any) => 
        w.originalYear === parentYear && w.originalMonth === parentMonthStr
      );

      week.mecanicaMensal = {
        mesLabel: `${parentMonthName} de ${parentYear}`,
        semanas: sameMonthWeeks.map((sw: any) => ({
          labelSemana: getWeekLabelSimple(sw.originalWeekKey || "w1", sw.originalMonth || "5"),
          audioVideo: sw.mecanicasMeioSemana?.midias || "—",
          indicador1: sw.mecanicasMeioSemana?.indicador || "—",
          volante1: sw.mecanicasMeioSemana?.microfonista || "—",
          palco: sw.mecanicasMeioSemana?.palco || "—",
          audioVideoFimSemana: sw.mecanicasFimSemana?.midias || "—",
          indicadorFimSemana: sw.mecanicasFimSemana?.indicador || "—",
          volanteFimSemana: sw.mecanicasFimSemana?.microfonista || "—",
          palcoFimSemana: sw.mecanicasFimSemana?.palco || "—"
        })),
        limpeza: sameMonthWeeks.map((sw: any, idx: number) => {
          const eq = sw.equipeLimpeza;
          return {
            labelSemana: getWeekLabelSimple(sw.originalWeekKey || "w1", sw.originalMonth || "5"),
            grupo: eq?.nome || `Equipe ${idx + 1} de Limpeza`,
            integrantes: eq?.integrantes || []
          };
        })
      };
    });

    if (weeksList.length > 0) {
      console.log(`[appControle] Correctly fetched and fused ${weeksList.length} weeks from database!`);
      return { weeks: weeksList, isDemo: false };
    }
    
    console.log("Database fetch retrieved empty weeks list. Returning empty list.");
    return { weeks: [], isDemo: false };
  } catch (error) {
    console.error("Error fetching and/or fusing from Realtime Database:", error);
    return { weeks: [], isDemo: false };
  }
}
