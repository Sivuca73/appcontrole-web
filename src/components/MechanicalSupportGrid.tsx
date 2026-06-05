/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Monitor, CalendarDays, Trash2, Shield, Radio, Users2, Layers, HelpCircle } from 'lucide-react';
import { DesignacoesMecanicas, SemanaProgramacao } from '../types';

// ============================================================================
// 1. WEEKLY SUPPORT GRID (For MeetingMidweek.tsx and MeetingWeekend.tsx)
// ============================================================================
interface MechanicalSupportGridProps {
  designacoes?: DesignacoesMecanicas;
}

export function MechanicalSupportGrid({ designacoes }: MechanicalSupportGridProps) {
  if (!designacoes) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 text-center mt-6">
        <p className="text-gray-400 text-xs font-sans">Apoio técnico da reunião não publicado para esta semana.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-150/60 rounded-2xl p-5.5 mt-8 space-y-4" id="weekly-support-grid">
      <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2.5">
        <Shield className="w-4 h-4 text-slate-700" />
        <h4 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase font-sans">
          Apoio Técnico da Reunião
        </h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/50 shadow-2xs flex flex-col justify-between">
          <span className="text-gray-400 font-mono block mb-1 text-[9px] font-bold uppercase tracking-wider">Mídias (Áudio/Vídeo)</span>
          <strong className="text-slate-900 font-bold text-sm block tracking-tight truncate">{designacoes.midias || "—"}</strong>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/50 shadow-2xs flex flex-col justify-between">
          <span className="text-gray-400 font-mono block mb-1 text-[9px] font-bold uppercase tracking-wider">Indicador</span>
          <strong className="text-slate-900 font-bold text-sm block tracking-tight truncate">{designacoes.indicador || "—"}</strong>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/50 shadow-2xs flex flex-col justify-between">
          <span className="text-gray-400 font-mono block mb-1 text-[9px] font-bold uppercase tracking-wider">Microfonistas</span>
          <strong className="text-slate-900 font-bold text-sm block tracking-tight truncate">
            {designacoes.microfonista || "—"}
            {designacoes.microfonista2 ? ` e ${designacoes.microfonista2}` : ''}
          </strong>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/50 shadow-2xs flex flex-col justify-between">
          <span className="text-gray-400 font-mono block mb-1 text-[9px] font-bold uppercase tracking-wider">Palco</span>
          <strong className="text-slate-900 font-bold text-sm block tracking-tight truncate">{designacoes.palco || "—"}</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. MONTHLY SUPPORT GRID (For App.tsx 'mecanica' Tab)
// ============================================================================
interface MonthlySupportGridProps {
  key?: string;
  mecanicaMensal?: SemanaProgramacao['mecanicaMensal'];
}

export function MonthlySupportGrid({ mecanicaMensal }: MonthlySupportGridProps) {
  if (!mecanicaMensal || !mecanicaMensal.semanas || mecanicaMensal.semanas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-100 min-h-[300px] shadow-xs">
        <Monitor className="w-12 h-12 text-purple-700/40 mb-4" />
        <h3 className="text-base font-bold text-gray-700 font-sans">Apoio Técnico & Quadro Mecânico</h3>
        <p className="text-[#820ad1] font-medium max-w-sm mt-3 text-sm font-sans bg-[#820ad1]/5 px-4 py-2.5 rounded-xl border border-[#820ad1]/10">
          Escala mensal de apoio técnico e limpeza não publicada para este período.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="quadro-mecanico-mensal-view">
      {/* CABEÇALHO DO MÊS */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">PROGRAMAÇÃO MENSAL</span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-sans text-white">{mecanicaMensal.mesLabel}</h2>
        </div>
        <CalendarDays className="w-8 h-8 text-slate-400 opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA: APOIO TÉCNICO E MECÂNICA */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-2.5 h-6 bg-[#820ad1] rounded-xs" />
            <h3 className="text-lg font-bold text-slate-800 tracking-tight font-sans">Apoio Técnico e Mecânica</h3>
          </div>

          <div className="bg-[#820ad1]/5 border border-[#820ad1]/15 rounded-xl p-4 flex items-start gap-2.5 text-xs text-[#820ad1] font-sans">
            <HelpCircle className="w-4.5 h-4.5 text-[#820ad1] shrink-0 mt-0.5" />
            <div>
              <strong>Designações Separadas:</strong> Os dados de apoio técnico abaixo refletem as designações completas e independentes para as reuniões de Meio de Semana e Fim de Semana.
            </div>
          </div>

          <div className="space-y-6">
            {mecanicaMensal.semanas.map((semana, idx) => (
              <div key={idx} className="bg-white border border-slate-150/80 rounded-2xl p-5 hover:shadow-xs transition duration-350">
                <div className="bg-[#820ad1]/10 text-[#820ad1] font-mono text-xs font-extrabold px-3 py-1.5 rounded-lg inline-block mb-4.5">
                  Semana: {semana.labelSemana}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* MEIO DE SEMANA (TERÇA) */}
                  <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                    <h5 className="text-xs font-extrabold text-slate-700 tracking-wider uppercase font-mono border-b border-slate-200/60 pb-1.5 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600/80 block" />
                      Meio de Semana (Terça)
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-slate-150/65 shadow-3xs flex flex-col justify-between">
                        <span className="text-gray-400 font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Mídias (A/V)</span>
                        <strong className="text-slate-900 font-semibold text-xs sm:text-sm truncate">{semana.audioVideo || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-150/65 shadow-3xs flex flex-col justify-between">
                        <span className="text-gray-400 font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Indicador</span>
                        <strong className="text-slate-900 font-semibold text-xs sm:text-sm truncate">{semana.indicador1 || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-150/65 shadow-3xs flex flex-col justify-between">
                        <span className="text-gray-400 font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Microfonista</span>
                        <strong className="text-slate-900 font-semibold text-xs sm:text-sm truncate">{semana.volante1 || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-150/65 shadow-3xs flex flex-col justify-between">
                        <span className="text-gray-400 font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Palco</span>
                        <strong className="text-slate-900 font-semibold text-xs sm:text-sm truncate">{semana.palco || "—"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* FIM DE SEMANA (SÁBADO) */}
                  <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                    <h5 className="text-xs font-extrabold text-slate-700 tracking-wider uppercase font-mono border-b border-slate-200/60 pb-1.5 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600/80 block" />
                      Fim de Semana (Sábado)
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-slate-150/65 shadow-3xs flex flex-col justify-between">
                        <span className="text-gray-400 font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Mídias (A/V)</span>
                        <strong className="text-slate-900 font-semibold text-xs sm:text-sm truncate">{semana.audioVideoFimSemana || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-150/65 shadow-3xs flex flex-col justify-between">
                        <span className="text-gray-400 font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Indicador</span>
                        <strong className="text-slate-900 font-semibold text-xs sm:text-sm truncate">{semana.indicadorFimSemana || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-150/65 shadow-3xs flex flex-col justify-between">
                        <span className="text-gray-400 font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Microfonista</span>
                        <strong className="text-slate-900 font-semibold text-xs sm:text-sm truncate">{semana.volanteFimSemana || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-150/65 shadow-3xs flex flex-col justify-between">
                        <span className="text-gray-400 font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Palco</span>
                        <strong className="text-slate-900 font-semibold text-xs sm:text-sm truncate">{semana.palcoFimSemana || "—"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA: LIMPEZA DO SALÃO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-2.5 h-6 bg-emerald-600 rounded-xs" />
            <h3 className="text-lg font-bold text-slate-800 tracking-tight font-sans">Limpeza do Salão do Reino</h3>
          </div>

          <div className="space-y-3">
            {mecanicaMensal.limpeza && mecanicaMensal.limpeza.length > 0 ? (
              mecanicaMensal.limpeza.map((item, idx) => (
                <div key={idx} className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between hover:bg-emerald-50 transition duration-200">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-emerald-700/80 uppercase">SEMANA {item.labelSemana}</span>
                    <strong className="text-slate-900 font-bold text-sm font-sans truncate">{item.grupo || "Grupo a definir"}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl text-emerald-600 border border-emerald-100 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs italic">Escala de limpeza não disponível.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
