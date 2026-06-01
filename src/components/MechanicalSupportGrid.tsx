/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, Mic, Monitor, Pocket } from 'lucide-react';
import { DesignacoesMecanicas } from '../types';

interface MechanicalSupportGridProps {
  designacoes?: DesignacoesMecanicas;
}

export function MechanicalSupportGrid({ designacoes }: MechanicalSupportGridProps) {
  if (!designacoes) {
    return (
      <div className="mt-8 border border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50">
        <p className="text-sm text-gray-500 font-sans">
          Designações mecânicas ainda não publicadas para este dia.
        </p>
      </div>
    );
  }

  const items = [
    {
      label: "Indicador",
      value: designacoes.indicador || "-",
      icon: Eye,
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      iconColor: "text-slate-500",
    },
    {
      label: "Microfonista",
      value: designacoes.microfonista || "-",
      icon: Mic,
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      iconColor: "text-slate-500",
    },
    {
      label: "Palco",
      value: designacoes.palco || "-",
      icon: Pocket,
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      iconColor: "text-slate-500",
    },
    {
      label: "Mídias / Som",
      value: designacoes.midias || "-",
      icon: Monitor,
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      iconColor: "text-slate-500",
    },
  ];

  return (
    <div className="mt-8" id="designacoes-mecanicas-container">
      <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3 font-mono">
        Designações Mecânicas & Apoio
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              id={`mecanica-${item.label.toLowerCase().replace(/[^a-z]/g, '')}`}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-100 bg-white shadow-xs hover:shadow-md transition-all duration-300 group"
            >
              <div className={`p-2 rounded-lg ${item.bgColor} transition-colors group-hover:bg-slate-100`}>
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-semibold text-gray-400 tracking-wide uppercase font-mono">
                  {item.label}
                </span>
                <span className="block text-sm font-semibold text-gray-800 truncate font-sans">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
