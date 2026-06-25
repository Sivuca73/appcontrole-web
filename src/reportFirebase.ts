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

// Helper to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
};

// Initialize localStorage with empty array if needed
const initLocalData = () => {
  if (!isLocalStorageAvailable()) return;
  if (!localStorage.getItem('reduto_publishers')) {
    localStorage.setItem('reduto_publishers', JSON.stringify([]));
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
    console.log("[FieldReports] Firebase not configured. Loading from localStorage.");
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_publishers');
      return local ? JSON.parse(local) : [];
    }
    return [];
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
      console.log("[FieldReports] No publishers found in Realtime Database.");
      return [];
    }
  } catch (err) {
    console.error("Error fetching publishers from Realtime DB:", err);
    if (isLocalStorageAvailable()) {
      const local = localStorage.getItem('reduto_publishers');
      return local ? JSON.parse(local) : [];
    }
    return [];
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
      let list: Publisher[] = local ? JSON.parse(local) : [];
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
      let list: Publisher[] = local ? JSON.parse(local) : [];
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
