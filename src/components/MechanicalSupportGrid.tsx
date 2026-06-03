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
    <div className="space-y-8" id="quadro-mecanico-mensal-view">
      {/* CABEÇALHO DO MÊS */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">PROGRAMAÇÃO MENSAL</span>
          <h2 className="text-2xl font-bold tracking-tight font-sans text-white">{mecanicaMensal.mesLabel}</h2>
        </div>
        <CalendarDays className="w-8 h-8 text-slate-400 opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA: APOIO TÉCNICO E MECÂNICA */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-2.5 h-6 bg-[#820ad1] rounded-xs" />
            <h3 className="text-lg font-bold text-slate-800 tracking-tight font-sans">Apoio Técnico e Mecânica</h3>
          </div>

          <div className="space-y-4">
            {mecanicaMensal.semanas.map((semana, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-xs transition duration-300">
                <div className="bg-[#820ad1]/10 text-[#820ad1] font-mono text-xs font-bold px-3 py-1.5 rounded-lg inline-block mb-4">
                  Semana: {semana.labelSemana}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-gray-400 font-mono block mb-1 uppercase tracking-wider text-[9px] font-bold">Áudio e Vídeo</span>
                    <strong className="text-slate-900 font-bold text-base">{semana.audioVideo || "—"}</strong>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-gray-400 font-mono block mb-1 uppercase tracking-wider text-[9px] font-bold">Indicador</span>
                    <strong className="text-slate-900 font-bold text-base block">{semana.indicador1 || "—"}</strong>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-gray-400 font-mono block mb-1 uppercase tracking-wider text-[9px] font-bold">Volante</span>
                    <strong className="text-slate-900 font-bold text-base block">{semana.volante1 || "—"}</strong>
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
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-700/80 uppercase">SEMANA {item.labelSemana}</span>
                    <strong className="text-slate-900 font-bold text-sm font-sans">{item.grupo || "Grupo a definir"}</strong>
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
