/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Monitor, Trash2, Calendar } from 'lucide-react';

interface DetalheSemanaMecanica {
  labelSemana: string;
  audioVideo: string; // Unificado em uma única propriedade
  indicador1: string;
  volante1: string;
}

interface DetalheLimpeza {
  labelSemana: string;
  grupo: string;
}

interface MechanicalSupportGridProps {
  mecanicaMensal?: {
    mesLabel: string;
    semanas: DetalheSemanaMecanica[];
    limpeza: DetalheLimpeza[];
  };
}

export function MechanicalSupportGrid({ mecanicaMensal }: MechanicalSupportGridProps) {
  if (!mecanicaMensal || !mecanicaMensal.semanas) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-100 min-h-[300px] shadow-sm">
        <Monitor className="w-12 h-12 text-purple-700/40 mb-4" />
        <h3 className="text-base font-bold text-gray-700 font-sans">Apoio Técnico & Quadro Mecânico</h3>
        <p className="text-purple-800 font-medium max-w-sm mt-2 text-sm font-sans bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-100">
          Escala mensal de apoio técnico e limpeza não publicada para este período.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="quadro-mecanico-mensal-view">
      
      {/* CABEÇALHO DO MÊS */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">PROGRAMAÇÃO MENSAL</span>
          <h2 className="text-2xl font-bold tracking-tight font-sans mt-0.5">{mecanicaMensal.mesLabel}</h2>
        </div>
        <Calendar className="w-8 h-8 text-slate-400 opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA: APOIO TÉCNICO E MECÂNICA */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-2.5 h-6 bg-purple-700 rounded-sm" />
            <h3 className="text-lg font-bold text-purple-900 tracking-tight font-sans">
              Apoio Técnico e Mecânica
            </h3>
          </div>

          <div className="space-y-4">
            {mecanicaMensal.semanas.map((semana, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition duration-300">
                <div className="bg-purple-50 text-purple-900 font-mono text-xs font-bold px-3 py-1.5 rounded-lg inline-block mb-4">
                  Semana: {semana.labelSemana}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Áudio e Vídeo Centralizados */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-gray-400 font-mono block mb-1">ÁUDIO E VÍDEO</span>
                    <strong className="text-slate-900 font-bold text-sm">{semana.audioVideo || "—"}</strong>
                  </div>

                  {/* Indicador */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-gray-400 font-mono block mb-1">INDICADOR</span>
                    <strong className="text-slate-900 font-bold text-sm block">
                      {semana.indicador1 || "—"}
                    </strong>
                  </div>

                  {/* Volante */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-gray-400 font-mono block mb-1">VOLANTE</span>
                    <strong className="text-slate-900 font-bold text-sm block">
                      {semana.volante1 || "—"}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA: LIMPEZA DO SALÃO DO REINO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-2.5 h-6 bg-emerald-600 rounded-sm" />
            <h3 className="text-lg font-bold text-emerald-900 tracking-tight font-sans">
              Limpeza do Salão do Reino
            </h3>
          </div>

          <div className="space-y-3">
            {mecanicaMensal.limpeza && mecanicaMensal.limpeza.map((item, idx) => (
              <div key={idx} className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between hover:bg-emerald-50 transition duration-200">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-700/80 uppercase">
                    SEMANA {item.labelSemana}
                  </span>
                  <strong className="text-slate-900 font-bold text-sm font-sans">
                    {item.grupo || "Grupo a definir"}
                  </strong>
                </div>
                <div className="p-2 bg-white rounded-xl text-emerald-600 border border-emerald-100">
                  <Trash2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
