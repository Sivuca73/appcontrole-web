/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { Tv, Shield, Mic, UserCheck } from 'lucide-react';

interface MechanicalSupportGridProps {
  designacoes?: any; // Alterado para any temporariamente para evitar quebras de tipagem do banco
}

export function MechanicalSupportGrid({ designacoes }: MechanicalSupportGridProps) {
  // Se não vier nenhuma designação, o componente apenas fica invisível em vez de quebrar a página
  if (!designacoes) return null;

  try {
    // Mapeamento dinâmico e seguro para encontrar o operador de mídias/som
    const nomeMidias = designacoes.midias || designacoes.som || designacoes.audio || null;
    const nomeIndicador = designacoes.indicador || designacoes.indicadores || null;
    const fontVolantes = designacoes.volantes || designacoes.microfone || designacoes.microfones || null;
    const nomeCapitao = designacoes.capitao || designacoes.presidenteApoio || null;

    return (
      <div className="mt-8 space-y-4" id="secao-designacoes-mecanicas">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <div className="w-2 h-4 bg-slate-400 rounded-xs" />
          <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase font-mono">
            Designações Mecânicas
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          
          {/* Card: Mídias */}
          {nomeMidias && (
            <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Tv className="w-4 h-4 text-slate-400" />
                <span>Mídias</span>
              </div>
              <strong className="text-slate-900 font-semibold">{nomeMidias}</strong>
            </div>
          )}

          {/* Card: Indicador */}
          {nomeIndicador && (
            <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Indicador</span>
              </div>
              <strong className="text-slate-900 font-semibold">{nomeIndicador}</strong>
            </div>
          )}

          {/* Card: Volantes */}
          {fontVolantes && (
            <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Mic className="w-4 h-4 text-slate-400" />
                <span>Volantes</span>
              </div>
              <strong className="text-slate-900 font-semibold">{fontVolantes}</strong>
            </div>
          )}

          {/* Card: Capitão */}
          {nomeCapitao && (
            <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>Capitão</span>
              </div>
              <strong className="text-slate-900 font-semibold">{nomeCapitao}</strong>
            </div>
          )}

        </div>
      </div>
    );
  } catch (err) {
    console.error("Erro ao renderizar o grid mecânico:", err);
    // Retorna nulo em caso de erro para não derrubar a Reunião inteira
    return null;
  }
}
