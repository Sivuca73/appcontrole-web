/// <reference types="vite/client" />

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase, ref, get, child, push, set } from 'firebase/database';
import { SemanaProgramacao } from './types';
import { DEMO_WEEKS } from './demoData';
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

// Como o appVM já está integrado, pegamos a instância ativa do Realtime Database de forma segura
/**
 * Função que recebe a estrutura exata do AI Studio
 * e lança na árvore JSON do Realtime Database.
 */
export async function lancarNoQuadroVirtual(dadosEstruturados: any) {
    try {
        const db = getFbDatabase();
        if (!db) {
            console.warn("[appControle] Realtime Database não configurado/inicializado.");
            return { cadastrado: false, id: "demo-id-rtdb" };
        }
        
        // 1. Criamos uma referência para o nó onde os quadros ficam salvos
        const listaQuadrosRef = ref(db, "quadros_virtuais");
        
        // 2. Geramos uma nova chave única (equivalente a um novo ID de documento)
        const novoQuadroRef = push(listaQuadrosRef);
        
        // 3. Salvamos a estrutura exata fornecida pela IA nesse novo nó
        await set(novoQuadroRef, {
            tituloQuadro: dadosEstruturados.tituloQuadro,
            colunas: dadosEstruturados.colunas, // Mantém o array/objeto de colunas e cartões
            origem: "AppVM_AI_Studio",
            atualizadoEm: new Date().toISOString()
        });
        
        console.log(`[appControle] Dados integrados no Realtime Database! ID: ${novoQuadroRef.key}`);
        return { cadastrado: true, id: novoQuadroRef.key };
    } catch (erro) {
        console.error("[appControle] Erro ao lançar dados no Realtime Database:", erro);
        throw erro;
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
 * Fetches all schedules from the /programacoes path of the Realtime Database.
 * Pulls strictly from the Realtime Database to fill the board.
 */
export async function fetchSchedulesFromDB(): Promise<{ weeks: SemanaProgramacao[]; isDemo: boolean }> {
  const db = getFbDatabase();
  
  if (!db) {
    console.log("Firebase not configured. Returning empty schedule list.");
    return { weeks: [], isDemo: false };
  }
  
  try {
    const dbRef = ref(db);
    // Standard table/path is '/programacoes' (matching standard administrative VM apps)
    const snapshot = await get(child(dbRef, 'programacoes'));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      
      // The data can be represented as an array or a key-value object of weeks (keyed by ID like "2026-06-01")
      let weeksList: SemanaProgramacao[] = [];
      
      if (Array.isArray(data)) {
        weeksList = data.filter(Boolean); // Filter any null indexes
      } else if (typeof data === 'object' && data !== null) {
        weeksList = Object.entries(data).map(([key, value]: [string, any]) => {
          return {
            id: key,
            ...value,
          } as SemanaProgramacao;
        });
      }
      
      // Sort weeks chronologically by ID/Date
      weeksList.sort((a, b) => a.id.localeCompare(b.id));
      
      if (weeksList.length > 0) {
        return { weeks: weeksList, isDemo: false };
      }
    }
    
    console.log("No data found at /programacoes path.");
    return { weeks: [], isDemo: false };
  } catch (error) {
    console.error("Error fetching from Realtime Database:", error);
    return { weeks: [], isDemo: false };
  }
}
