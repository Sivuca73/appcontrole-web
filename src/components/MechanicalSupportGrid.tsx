/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Monitor, CalendarDays, Trash2, Shield, Users2, HelpCircle, CheckCircle } from 'lucide-react';
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
      <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl p-5 text-center mt-6">
        <p className="text-[#718096] text-xs font-semibold font-sans">Apoio técnico da reunião não publicado para esta semana.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl p-6 mt-8 space-y-4 shadow-3xs" id="weekly-support-grid">
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
        <Shield className="w-4 h-4 text-[#1A365D]" />
        <h4 className="text-xs font-bold text-[#1A365D] tracking-wider uppercase font-sans">
          Apoio Técnico da Reunião
        </h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
          <span className="text-[#718096] font-mono block mb-1 text-[9px] font-bold uppercase tracking-wider">Mídias (Áudio/Vídeo)</span>
          <strong className="text-[#2D3748] font-bold text-sm block tracking-tight truncate">{designacoes.midias || "—"}</strong>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
          <span className="text-[#718096] font-mono block mb-1 text-[9px] font-bold uppercase tracking-wider">Indicador</span>
          <strong className="text-[#2D3748] font-bold text-sm block tracking-tight truncate">{designacoes.indicador || "—"}</strong>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
          <span className="text-[#718096] font-mono block mb-1 text-[9px] font-bold uppercase tracking-wider">Microfonistas</span>
          <strong className="text-[#2D3748] font-bold text-sm block tracking-tight truncate">
            {designacoes.microfonista || "—"}
            {designacoes.microfonista2 ? ` e ${designacoes.microfonista2}` : ''}
          </strong>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
          <span className="text-[#718096] font-mono block mb-1 text-[9px] font-bold uppercase tracking-wider">Palco</span>
          <strong className="text-[#2D3748] font-bold text-sm block tracking-tight truncate">{designacoes.palco || "—"}</strong>
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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-[#E2E8F0] min-h-[300px] shadow-xs">
        <Monitor className="w-12 h-12 text-[#1A365D]/20 mb-4" />
        <h3 className="text-base font-bold text-[#1A365D] font-sans">Apoio Técnico & Quadro Mecânico</h3>
        <p className="text-[#1A365D] font-semibold max-w-sm mt-3 text-xs font-sans bg-[#1A365D]/5 px-4 py-2.5 rounded-xl border border-[#1A365D]/10">
          Escala mensal de apoio técnico e limpeza não publicada para este período.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="quadro-mecanico-mensal-view">
      {/* CABEÇALHO DO MÊS */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2a4870] rounded-2xl p-6 text-white shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase">PROGRAMAÇÃO MENSAL</span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-sans text-white">{mecanicaMensal.mesLabel}</h2>
        </div>
        <CalendarDays className="w-8 h-8 text-white/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA CONTROLE DE DESIGNADOS (APOIO TÉCNICO E MECÂNICA) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2.5">
            <div className="w-2.5 h-6 bg-[#1A365D] rounded-xs" />
            <h3 className="text-lg font-bold text-[#1A365D] tracking-tight font-sans">Apoio Técnico e Mecânica</h3>
          </div>

          <div className="bg-[#1A365D]/5 border border-[#1A365D]/10 rounded-xl p-4 flex items-start gap-2.5 text-xs text-[#1A365D] font-sans shadow-3xs">
            <HelpCircle className="w-4.5 h-4.5 text-[#1A365D] shrink-0 mt-0.5" />
            <div>
              <strong>Consultas Separadas:</strong> Os dados de apoio técnico abaixo refletem as designações completas e independentes para as reuniões de Meio de Semana e Fim de Semana.
            </div>
          </div>

          <div className="space-y-6">
            {mecanicaMensal.semanas.map((semana, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#1A365D]/30 hover:shadow-2xs transition-all duration-300">
                <div className="bg-[#1A365D]/5 text-[#1A365D] font-mono text-xs font-bold px-3 py-1.5 rounded-lg inline-block mb-4.5 border border-[#1A365D]/10">
                  Semana: {semana.labelSemana}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* MEIO DE SEMANA (TERÇA) */}
                  <div className="space-y-3 bg-[#F7F9FC] p-4 rounded-xl border border-[#E2E8F0]">
                    <h5 className="text-xs font-bold text-[#1A365D] tracking-wider uppercase font-mono border-b border-[#E2E8F0] pb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#4A90E2] block animate-pulse" />
                      Meio de Semana (Terça)
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
                        <span className="text-[#718096] font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Mídias (A/V)</span>
                        <strong className="text-[#2D3748] font-bold text-xs sm:text-sm truncate">{semana.audioVideo || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
                        <span className="text-[#718096] font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Indicador</span>
                        <strong className="text-[#2D3748] font-bold text-xs sm:text-sm truncate">{semana.indicador1 || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
                        <span className="text-[#718096] font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Microfonista</span>
                        <strong className="text-[#2D3748] font-bold text-xs sm:text-sm truncate">{semana.volante1 || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
                        <span className="text-[#718096] font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Palco</span>
                        <strong className="text-[#2D3748] font-bold text-xs sm:text-sm truncate">{semana.palco || "—"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* FIM DE SEMANA (SÁBADO) */}
                  <div className="space-y-3 bg-[#F7F9FC] p-4 rounded-xl border border-[#E2E8F0]">
                    <h5 className="text-xs font-bold text-[#1A365D] tracking-wider uppercase font-mono border-b border-[#E2E8F0] pb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#BE9F67] block" />
                      Fim de Semana (Sábado)
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
                        <span className="text-[#718096] font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Mídias (A/V)</span>
                        <strong className="text-[#2D3748] font-bold text-xs sm:text-sm truncate">{semana.audioVideoFimSemana || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
                        <span className="text-[#718096] font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Indicador</span>
                        <strong className="text-[#2D3748] font-bold text-xs sm:text-sm truncate">{semana.indicadorFimSemana || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
                        <span className="text-[#718096] font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Microfonista</span>
                        <strong className="text-[#2D3748] font-bold text-xs sm:text-sm truncate">{semana.volanteFimSemana || "—"}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-3xs flex flex-col justify-between">
                        <span className="text-[#718096] font-mono block mb-1 text-[9px] font-medium uppercase tracking-wider">Palco</span>
                        <strong className="text-[#2D3748] font-bold text-xs sm:text-sm truncate">{semana.palcoFimSemana || "—"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA: LIMPEZA DO SALÃO DO REINO */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2.5 bg-transparent">
            <div className="w-2.5 h-6 bg-[#BE9F67] rounded-xs" />
            <h3 className="text-lg font-bold text-[#1A365D] tracking-tight font-sans">Limpeza do Salão</h3>
          </div>

          <div className="space-y-4">
            {mecanicaMensal.limpeza && mecanicaMensal.limpeza.length > 0 ? (
              mecanicaMensal.limpeza.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#BE9F67]/50 transition-all duration-300 space-y-4 shadow-3xs relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#BE9F67]/5 rounded-bl-full flex items-center justify-center pointer-events-none">
                    <Trash2 className="w-4 h-4 text-[#BE9F67]/40 translate-x-2 -translate-y-2" />
                  </div>

                  <div className="flex flex-col border-b border-[#E2E8F0] pb-3">
                    <span className="text-[9px] font-mono font-bold text-[#BE9F67] uppercase tracking-wider">Semana: {item.labelSemana}</span>
                    <strong className="text-[#1A365D] font-bold text-sm font-sans mt-0.5 tracking-tight flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#BE9F67] shrink-0" />
                      {item.grupo || "Grupo a decidir"}
                    </strong>
                  </div>

                  {/* Designated team names from Firebase */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono font-bold text-[#718096] tracking-wider uppercase block">Integrantes Designados</span>
                    
                    {item.integrantes && item.integrantes.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {item.integrantes.map((member, mIdx) => (
                          <span 
                            key={mIdx} 
                            className="inline-flex items-center bg-[#F7F9FC] border border-[#E2E8F0] text-[#2D3748] font-sans text-xs px-2.5 py-1 rounded-full shadow-3xs transition-colors hover:bg-white hover:border-[#BE9F67]"
                          >
                            <span className="w-1.5 h-1.5 bg-[#BE9F67] rounded-full mr-1 px-0 py-0 shrink-0 inline-block align-middle" />
                            {member}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="pt-1.5 px-3 py-2 bg-slate-50 border border-dashed border-[#E2E8F0] rounded-lg">
                        <span className="text-[#718096] text-xs italic font-sans">Nenhum integrante gravado para esta semana.</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#718096] text-xs italic font-sans">Escala de limpeza não disponível para este período.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
