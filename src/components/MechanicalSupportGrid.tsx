/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Mic, Layers, Tv, Sliders, CheckCircle2 } from 'lucide-react';
import { DesignacoesMecanicas } from '../types';

interface MechanicalSupportGridProps {
  designacoes?: DesignacoesMecanicas;
}

export function MechanicalSupportGrid({ designacoes }: MechanicalSupportGridProps) {
  if (!designacoes) {
    return (
      <div className="mt-8 border border-dashed border-gray-205 rounded-3xl p-8 text-center bg-gray-50/50" id="designacoes-mecanicas-container">
        <p className="text-sm text-gray-400 font-medium font-sans">
          Designações mecânicas ainda não publicadas para este dia.
        </p>
      </div>
    );
  }

  const items = [
    {
      label: "Indicador",
      value: designacoes.indicador || "-",
      description: "Recepção calorosa dos convidados e organização no auditório principal.",
      icon: Shield,
      accentColor: "from-blue-500/8 to-indigo-500/4",
      borderColor: "border-blue-100/60",
      iconColor: "text-blue-600",
      textColor: "text-blue-950",
      badgeColor: "bg-blue-100/60 text-blue-800",
    },
    {
      label: "Microfonista",
      value: designacoes.microfonista2 
        ? `${designacoes.microfonista} e ${designacoes.microfonista2}`
        : (designacoes.microfonista || "-"),
      description: "Circulação ágil e atenciosa dos microfones para os comentários da congregação.",
      icon: Mic,
      accentColor: "from-teal-500/8 to-emerald-500/4",
      borderColor: "border-teal-100/60",
      iconColor: "text-teal-600",
      textColor: "text-teal-950",
      badgeColor: "bg-teal-100/60 text-teal-800",
    },
    {
      label: "Palco / Tribuna",
      value: designacoes.palco || "-",
      description: "Apoio geral no palanque, ajuste dos displays e suporte aos oradores oficiais.",
      icon: Layers,
      accentColor: "from-amber-500/8 to-orange-500/4",
      borderColor: "border-amber-100/60",
      iconColor: "text-amber-600",
      textColor: "text-amber-950",
      badgeColor: "bg-amber-100/60 text-amber-800",
    },
    {
      label: "Mídias / Som",
      value: designacoes.midias || "-",
      description: "Controle da mesa de som, projeção de mídias, transmissão online e gravação.",
      icon: Tv,
      accentColor: "from-purple-500/8 to-fuchsia-500/4",
      borderColor: "border-purple-100/60",
      iconColor: "text-purple-600",
      textColor: "text-purple-950",
      badgeColor: "bg-purple-100/60 text-purple-800",
    },
  ];

  return (
    <div className="mt-8 transition-all duration-300" id="designacoes-mecanicas-container">
      {/* Elegant overarching card container */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xs hover:shadow-xs transition-all duration-300 relative overflow-hidden">
        
        {/* Abstract background decors */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl -mr-16 -mt-16 opacity-60 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-slate-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-xs shrink-0 flex items-center justify-center">
              <Sliders className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 tracking-tight font-sans">
                Apoio Técnico e Mecânica
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Voluntários dedicados à operação harmônica do Salão do Reino
              </p>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-1.5 self-start sm:self-center px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border border-emerald-100 shadow-3xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Escala Ativa
          </div>
        </div>

        {/* Dashboard Grid - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, index) => {
            const Icon = item.icon;
            const itemHtmlId = `mecanica-${item.label.toLowerCase().replace(/[^a-z]/g, '')}`;
            
            return (
              <div 
                key={index}
                id={itemHtmlId}
                className={`relative group bg-linear-to-br ${item.accentColor} border ${item.borderColor} rounded-2xl p-4.5 hover:scale-[1.01] hover:shadow-xs transition-all duration-300 flex items-start gap-4`}
              >
                {/* Colored Icon Badge */}
                <div className={`p-3 bg-white rounded-xl ${item.iconColor} shadow-3xs shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Info Text Stack */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-500 uppercase">
                      {item.label}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wide font-mono ${item.badgeColor}`}>
                      Ativo
                    </span>
                  </div>

                  <h4 className={`text-base font-bold truncate tracking-tight ${item.textColor} font-sans`}>
                    {item.value}
                  </h4>

                  <p className="text-xs text-slate-500/90 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational small footer within the support card */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-sans flex-wrap gap-2">
          <span>Seu serviço a Jeová é feito de toda a alma.</span>
          <span className="font-mono text-[100%]">Colossenses 3:23</span>
        </div>
      </div>
    </div>
  );
}
