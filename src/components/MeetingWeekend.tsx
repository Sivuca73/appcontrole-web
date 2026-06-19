/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  User, 
  MapPin, 
  BookOpen, 
  HelpCircle, 
  FileText,
  Award,
  Users2,
  UserCheck
} from 'lucide-react';
import { SecaoFimSemana } from '../types';
import { motion } from 'motion/react';

interface MeetingWeekendProps {
  key?: string;
  fimSemana?: SecaoFimSemana;
}

export function MeetingWeekend({ fimSemana }: MeetingWeekendProps) {
  if (!fimSemana) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-[#E2E8F0] min-h-[300px] shadow-xs">
        <Users2 className="w-12 h-12 text-[#BE9F67]/20 mb-4 animate-pulse" />
        <h3 className="text-base font-bold text-[#1A365D] font-sans">Fim de Semana</h3>
        <p className="text-[#1A365D] font-medium max-w-sm mt-2 text-xs font-sans bg-[#1A365D]/5 px-4 py-2.5 rounded-xl border border-[#1A365D]/10">
          Programação ainda não publicada para esta semana.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-8"
      id="fim-semana-programacao-view"
    >
      {/* General header with timings and songs */}
      <div className="bg-slate-55 border border-slate-100 rounded-2xl p-5 bg-linear-to-br from-slate-50 to-white hover:shadow-xs transition duration-300">
        <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono mb-3">
          Diretrizes Gerais do Fim de Semana
        </h4>
        
        <div className="flex items-start gap-3 text-sm">
          <div className="p-2 bg-slate-100 rounded-lg shrink-0 mt-0.5">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <span className="block text-xs text-gray-400 font-mono">PRESIDENTE</span>
            <strong className="text-slate-800 font-semibold text-base">{fimSemana.presidente || "A definir"}</strong>
          </div>
        </div>
      </div>

      {/* Main meeting components: Discurso Público and Estudo de A Sentinela */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PARTE I: DISCURSO PÚBLICO */}
        <div id="discurso-publico-card" className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-5">
            <div className="p-1.5 bg-[#BE9F67]/10 rounded-lg text-[#BE9F67]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Discurso Público (Palestra)</h3>
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">Parte I (30 minutos)</span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">CÓDIGO / TEMA DO DISCURSO</span>
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {fimSemana.temaDiscurso || "Tema de palestra pública a ser definido"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1">ORADOR CONVIDADO</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <User className="w-4 h-4 text-slate-500 shrink-0" />
                  <strong className="text-sm font-bold text-slate-800">{fimSemana.orador || "A definir"}</strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1">CONGREGAÇÃO</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 truncate">{fimSemana.congregaçãoOrador || "Congregação Reduto"}</span>
                </div>
              </div>
            </div>

            {/* Substitutos, if available */}
            {(fimSemana.oradorSubstituto || fimSemana.temaSubstituto) && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-150">
                <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">SUBSTITUTO / TEMA DE RESERVA</span>
                <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/50 flex flex-col gap-1.5">
                  <strong className="text-xs text-amber-900 font-semibold flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                    {fimSemana.oradorSubstituto || "Presidente ou Ancião Substituto"}
                  </strong>
                  {fimSemana.temaSubstituto && (
                    <p className="text-[11px] text-amber-800 italic leading-snug pl-5 font-sans">
                      "{fimSemana.temaSubstituto}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PARTE II: ESTUDO DE A SENTINELA */}
        <div id="estudo-sentinela-card" className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-5">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">Estudo de A Sentinela</h3>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">Parte II (60 minutos)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 bg-linear-to-r from-blue-50/30 to-slate-50 p-4 rounded-xl border border-blue-50/50 mb-2">
                <div className="p-2 bg-blue-100/80 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-800" />
                </div>
                <div>
                  <strong className="block text-xs text-blue-900 font-semibold font-mono">Duração do Estudo</strong>
                  <p className="text-xs text-gray-500 mt-0.5 pr-2 font-sans">
                    Análise aprofundada do artigo da revista da semana com perguntas e respostas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                  <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">DIRIGENTE</span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <strong className="text-slate-800 font-bold">{fimSemana.dirigenteSentinela || "A definir"}</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                  <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">LEITOR DA REVISTA</span>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <strong className="text-slate-800 font-bold">{fimSemana.leitorSentinela || "A definir"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 text-[11px] text-gray-400 flex items-center gap-1.5 bg-gray-50/70 p-2.5 rounded-lg border border-dashed border-gray-150">
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-sans">Todos os irmãos devem trazer suas revistas lidas e comentadas.</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
