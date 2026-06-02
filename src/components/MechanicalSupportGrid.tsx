/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Tv, Users, Mic, Shield, UserCheck } from 'lucide-react';
import { DesignacoesMecanicas } from '../types';

interface MechanicalSupportGridProps {
  designacoes?: DesignacoesMecanicas;
}

export function MechanicalSupportGrid({ designacoes }: MechanicalSupportGridProps) {
  if (!designacoes) return null;

  return (
    <div className="mt-8 space-y-4" id="secao-designacoes-mecanicas">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <div className="w-2 h-4 bg-slate-400 rounded-xs" />
        <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase font-mono">
          Designações Mecânicas
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        
        {/* CARD ALTERADO: Apenas "Mídias" */}
        {designacoes.midias && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Tv className="w-4 h-4 text-slate-400" />
              <span>Mídias</span>
            </div>
            <strong className="text-slate-900 font-semibold">{designacoes.midias}</strong>
          </div>
        )}

        {/* Indicador */}
        {designacoes.indicador && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Indicador</span>
            </div>
            <strong className="text-slate-900 font-semibold">{designacoes.indicador}</strong>
          </div>
        )}

        {/* Microfone / Volantes */}
        {designacoes.volantes && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Mic className="w-4 h-4 text-slate-400" />
              <span>Volantes</span>
            </div>
            <strong className="text-slate-900 font-semibold">{designacoes.volantes}</strong>
          </div>
        )}

        {/* Capitão / Outra função de apoio que você possua no types */}
        {designacoes.capitao && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span>Capitão</span>
            </div>
            <strong className="text-slate-900 font-semibold">{designacoes.capitao}</strong>
          </div>
        )}

      </div>
    </div>
  );
}
