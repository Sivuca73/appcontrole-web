/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getDatabase, ref, get, child, set, update, push } from 'firebase/database';
import { getFbDatabase } from './firebase';

export interface Publisher {
  id: string;
  nome: string;
  sexo: 'masculino' | 'feminino';
  tipo: 'publicador' | 'pioneiro_auxiliar' | 'pioneiro_regular';
  telefone?: string;
  email?: string;
  codigo: string; // 6-digit access code
  ativo: boolean;
}

export interface FieldReport {
  id: string; // unique key e.g. publisherId_mesAno or random push key
  publisherId: string;
  nome: string;
  tipo: 'publicador' | 'pioneiro_auxiliar' | 'pioneiro_regular';
  mesAno: string; // "YYYY-MM" format
  atividade?: boolean; // for publicadores
  horas?: number;      // for pioneers
  estudos?: number;    // for pioneers
  dataEnvio: number;   // timestamp
}

// Default initial publishers to seed if the database is empty, using names from congregations
const DEMO_PUBLISHERS: Publisher[] = [
  {
    id: "pub_1",
    nome: "Carlos Albuquerque",
    sexo: "masculino",
    tipo: "pioneiro_regular",
    telefone: "(81) 98888-7711",
    email: "carlos.albuquerque@reduto.org",
    codigo: "123456",
    ativo: true
  },
  {
    id: "pub_2",
    nome: "Antônio Silva",
    sexo: "masculino",
    tipo: "publicador",
    telefone: "(81) 99111-2233",
    email: "antonio.silva@reduto.org",
    codigo: "654321",
    ativo: true
  },
  {
    id: "pub_3",
    nome: "Larissa Silva",
    sexo: "feminino",
    tipo: "pioneiro_auxiliar",
    telefone: "(81) 99777-6655",
    email: "larissa.silva@reduto.org",
    codigo: "111222",
    ativo: true
  }
];

// Helper to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
};

// Initialize localStorage with mockup publishers if needed
const initLocalData = () => {
  if (!isLocalStorageAvailable()) return;
  if (!localStorage.getItem('reduto_publishers')) {
    localStorage.setItem('reduto_publishers', JSON.stringify(DEMO_PUBLISHERS));
  }
  if (!localStorage.getItem('reduto_reports')) {
    localStorage.setItem('reduto_reports', JSON.stringify([]));
  }
};

initLocalData();

/**
 * Fetch all publishers from Firebase or localStorage fallback
 */
export async function getPublishersFromDB(): Promise<Publisher[]> {
  const db = getFbDatabase();

  if (!db) {
    // Demo Fallback
    console.log("[FieldReports] Firebase not configured or in demo mode. Loading from localStorage.");
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_publishers');
      return local ? JSON.parse(local) : DEMO_PUBLISHERS;
    }
    return DEMO_PUBLISHERS;
  }

  try {
    const dbRef = ref(db);
    const snap = await get(child(dbRef, 'publicadores'));

    if (snap.exists()) {
      const data = snap.val();
      const list: Publisher[] = [];
      Object.keys(data).forEach((key) => {
        list.push({
          id: key,
          ...data[key]
        });
      });
      return list;
    } else {
      // Seed initial publishers in Realtime Database so the secretary doesn't start from an empty database!
      console.log("[FieldReports] No publishers found in Realtime Database. Seeding default publishers.");
      const updates: Record<string, any> = {};
      DEMO_PUBLISHERS.forEach((pub) => {
        updates[`publicadores/${pub.id}`] = {
          nome: pub.nome,
          sexo: pub.sexo,
          tipo: pub.tipo,
          telefone: pub.telefone || "",
          email: pub.email || "",
          codigo: pub.codigo,
          ativo: pub.ativo
        };
      });
      await update(ref(db), updates);
      return DEMO_PUBLISHERS;
    }
  } catch (err) {
    console.error("Error fetching publishers from Realtime DB:", err);
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_publishers');
      return local ? JSON.parse(local) : DEMO_PUBLISHERS;
    }
    return DEMO_PUBLISHERS;
  }
}

/**
 * Save / update a publisher in Firebase or localStorage fallback
 */
export async function savePublisherToDB(pub: Partial<Publisher> & { id: string }): Promise<void> {
  const db = getFbDatabase();

  if (!db) {
    // Local Fallback
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_publishers');
      let list: Publisher[] = local ? JSON.parse(local) : [...DEMO_PUBLISHERS];
      const index = list.findIndex(p => p.id === pub.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...pub } as Publisher;
      } else {
        list.push(pub as Publisher);
      }
      localStorage.setItem('reduto_publishers', JSON.stringify(list));
    }
    return;
  }

  try {
    const pubRef = ref(db, `publicadores/${pub.id}`);
    const cleanPubObj = { ...pub };
    delete cleanPubObj.id; // Firebase ID is key in collection
    await set(pubRef, cleanPubObj);
  } catch (err) {
    console.error("Error saving publisher to Realtime DB:", err);
    // Local Fallback
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_publishers');
      let list: Publisher[] = local ? JSON.parse(local) : [...DEMO_PUBLISHERS];
      const index = list.findIndex(p => p.id === pub.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...pub } as Publisher;
      } else {
        list.push(pub as Publisher);
      }
      localStorage.setItem('reduto_publishers', JSON.stringify(list));
    }
  }
}

/**
 * Generate a cryptographically simple and unique 6-digit access code
 */
export function generateAccessCode(existingPublishers: Publisher[]): string {
  let isUnique = false;
  let code = "000000";
  
  while (!isUnique) {
    const num = Math.floor(100000 + Math.random() * 900000);
    code = String(num);
    const found = existingPublishers.some(p => p.codigo === code);
    if (!found) {
      isUnique = true;
    }
  }
  
  return code;
}

/**
 * Fetch all service reports from Firebase or localStorage fallback
 */
export async function getFieldReportsFromDB(): Promise<FieldReport[]> {
  const db = getFbDatabase();

  if (!db) {
    // Local Fallback
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_reports');
      return local ? JSON.parse(local) : [];
    }
    return [];
  }

  try {
    const dbRef = ref(db);
    const snap = await get(child(dbRef, 'relatorios_campo'));

    if (snap.exists()) {
      const data = snap.val();
      const list: FieldReport[] = [];
      Object.keys(data).forEach((key) => {
        list.push({
          id: key,
          ...data[key]
        });
      });
      return list;
    }
    return [];
  } catch (err) {
    console.error("Error fetching field reports from Realtime DB:", err);
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_reports');
      return local ? JSON.parse(local) : [];
    }
    return [];
  }
}

/**
 * Save / Update field report in Firebase or localStorage fallback
 */
export async function saveFieldReportToDB(report: FieldReport): Promise<void> {
  const db = getFbDatabase();

  if (!db) {
    // Local Fallback
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_reports');
      let list: FieldReport[] = local ? JSON.parse(local) : [];
      const index = list.findIndex(r => r.id === report.id);
      if (index !== -1) {
        list[index] = report;
      } else {
        list.push(report);
      }
      localStorage.setItem('reduto_reports', JSON.stringify(list));
    }
    return;
  }

  try {
    const repRef = ref(db, `relatorios_campo/${report.id}`);
    await set(repRef, report);
  } catch (err) {
    console.error("Error saving field report to Realtime DB:", err);
    // Local Fallback
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_reports');
      let list: FieldReport[] = local ? JSON.parse(local) : [];
      const index = list.findIndex(r => r.id === report.id);
      if (index !== -1) {
        list[index] = report;
      } else {
        list.push(report);
      }
      localStorage.setItem('reduto_reports', JSON.stringify(list));
    }
  }
}
