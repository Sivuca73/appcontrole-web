/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ComponenteReuniao {
  tema: string;
  tempo?: string; // e.g. "10 min" or "5 min"
  orador: string;
  ajudante?: string;
  referencia?: string;
  tipo?: string; // Optional discriminator if helpful
}

export interface SecaoVidaMinisterio {
  temaGeral?: string;
  presidente: string;
  oracaoInicial: string;
  oracaoFinal: string;
  canticoInicial: string;
  canticoIntermediario: string;
  canticoFinal: string;
  
  // Tesouros da Palavra de Deus
  tesouros: ComponenteReuniao[];
  
  // Faça Seu Melhor no Ministério
  facaSeuMelhor: ComponenteReuniao[];
  
  // Nossa Vida Cristã
  vidaCrista: ComponenteReuniao[];
  
  // Estudo Bíblico de Congregação (frequentemente parte de Nossa Vida Cristã)
  estudoBiblico?: {
    dirigente: string;
    leitor: string;
    tema?: string;
  };
}

export interface SecaoFimSemana {
  presidente: string;
  orador: string;
  congregaçãoOrador: string; // "Congregação de origem" ou "Local"
  temaDiscurso: string;
  oradorSubstituto?: string;
  temaSubstituto?: string;
  dirigenteSentinela: string;
  leitorSentinela: string;
  canticoInicial: string;
  canticoIntermediario: string;
  canticoFinal: string;
  oracaoInicial?: string;
  oracaoFinal: string;
}

export interface DesignacoesMecanicas {
  indicador: string;
  microfonista: string; // Can support multiple names like "João e Pedro"
  microfonista2?: string; // Optional second microfonista
  palco: string;
  midias: string; // e.g. "Som/Vídeo" operator
}

export interface SemanaProgramacao {
  id: string; // e.g., "2026-06-01" (start date of the week)
  labelSemana: string; // e.g. "01 a 07 de Junho, 2026"
  temaMensal?: string;
  
  // Meeting schedules
  meioSemana?: SecaoVidaMinisterio;
  fimSemana?: SecaoFimSemana;
  
  // Mechanical support for each event
  mecanicasMeioSemana?: DesignacoesMecanicas;
  mecanicasFimSemana?: DesignacoesMecanicas;
  
  publicadoMeioSemana: boolean;
  publicadoFimSemana: boolean;
  
  timestampAtualizacao?: number;
}
