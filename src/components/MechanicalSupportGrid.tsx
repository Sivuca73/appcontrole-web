/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Tv, 
  Mic, 
  Users, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { DesignacoesMecanicas } from '../types';

interface MechanicalSupportGridProps {
  designacoes?: DesignacoesMecanicas;
}

export function MechanicalSupportGrid({ designacoes }: MechanicalSupportGridProps) {
  // Se não houver designações mecânicas para a semana, exibe um aviso amigável sem quebrar o app
  if (!designacoes) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-5 text-center">
        <p className="text-xs text-slate-400 font-sans italic">
          Designações de suporte mecânico não configuradas para esta reunião.
        </p>
      </div>
    );
  }

  // Mapeamento dos itens baseado estritamente na interface DesignacoesMecanicas
  const itensSuporte = [
    {
      label: 'Áudio e Vídeo / Mídias',
      valor: designacoes.midias,
      icon: Tv,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Operador de Palco',
      valor: designacoes.palco,
      icon: Layers,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Indicadores',
      valor: designacoes.indicador,
      icon: Users,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Volantes / Microfonistas',
      // Combina microfonista 1 e 2 de forma elegante se o segundo existir
      valor: designacoes.microfonista2 
        ? `${designacoes.microfonista} e ${designacoes.microfonista2}` 
        : designacoes.microfonista,
      icon: Mic,
      colorClass: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm" id="quadro-suporte-mecanico">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
        <ShieldCheck className="w-4 h-4 text-slate-500" />
        <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
          Suporte Mecânico e Operacional
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {itensSuporte.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={index}
              className="flex flex-col justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition duration-200"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`p-2 rounded-lg border ${item.colorClass}`}>
                  <IconComponent className="w-4 h-4 shrink-0" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 font-mono tracking-wide uppercase leading-tight">
                  {item.label}
                </span>
              </div>

              <div className="mt-1">
                <strong className="text-slate-800 font-bold text-sm block truncate font-sans">
                  {item.valor || "A definir"}
                </strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
