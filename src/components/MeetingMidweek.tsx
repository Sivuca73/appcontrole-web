/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BookOpen, 
  Gem, 
  Compass, 
  MessageSquare, 
  User,
  Calendar,
  Layers,
  Briefcase,
  Mic
} from 'lucide-react';

// Interfaces ajustadas para a nova relação de campos informada
interface ParteFacaSeuMelhor {
  tipo: 'demonstracao' | 'nao_demonstracao';
  label: string;
  estudante?: string;
  ajudante?: string;
  dirigente?: string;
}

interface ParteVidaCrista {
  label: string;
  dirigente: string;
}

interface SecaoMeioSemana {
  presidente: string;
  oracaoInicial: string;
  oracaoFinal: string;
  tesouros: {
    discursoAbertura: string;
    joiasEspirituais: string;
    leituraBiblia: string;
  };
  facaSeuMelhor?: ParteFacaSeuMelhor[];
  vidaCrista?: ParteVidaCrista[];
  estudoBiblico?: {
    dirigente: string;
    leitor: string;
  };
  discursoSuperintendente?: {
    tema: string;
    orador: string;
  };
}

interface MeetingMidweekProps {
  meioSemana?: SecaoMeioSemana;
  mecanicas?: any;
  isVisitaSuperintendente?: boolean; // Campo crucial para a mudança do layout da visita
}

export function MeetingMidweek({ meioSemana, mecanicas, isVisitaSuperintendente = false }: MeetingMidweekProps) {
  
  if (!meioSemana) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-100 min-h-[300px] shadow-sm">
        <Calendar className="w-12 h-12 text-cyan-700/40 mb-4" />
        <h3 className="text-base font-bold text-gray-700 font-sans">Meio de Semana</h3>
        <p className="text-cyan-800 font-medium max-w-sm mt-2 text-sm font-sans bg-cyan-50 px-4 py-2.5 rounded-xl border border-cyan-100">
          Programação ainda não publicada para este dia.
        </p>
      </div>
    );
  }

  try {
    return (
      <div className="space-y-8" id="meio-semana-programacao-view">
        
        {/* DIRETRIZES GERAIS */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 bg-gradient-to-br from-slate-50 to-white hover:shadow-sm transition duration-300">
          <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono mb-4">
            Diretrizes Gerais da Reunião
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-mono">PRESIDENTE</span>
                <strong className="text-slate-800 font-semibold">
                  {meioSemana.presidente || "A definir"}
                </strong>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0 mt-0.5 font-mono text-[10px] uppercase font-bold text-blue-600 flex items-center justify-center w-8 h-8">
                Amém
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <span className="block text-xs text-gray-400 font-mono">ORAÇÃO INICIAL</span>
                  <strong className="text-slate-800 font-semibold truncate block max-w-full">
                    {meioSemana.oracaoInicial || "A definir"}
                  </strong>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-mono">ORAÇÃO FINAL</span>
                  <strong className="text-slate-800 font-semibold truncate block max-w-full">
                    {meioSemana.oracaoFinal || "A definir"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. TESOUROS DA PALAVRA DE DEUS (PARTES FIXAS) */}
        <div id="secao-tesouros" className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-2.5 h-6 bg-[#34727D] rounded-sm" />
            <h2 className="text-lg font-bold text-[#34727D] tracking-tight font-sans">
              Tesouros da Palavra de Deus
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Discurso de Abertura */}
            <div className="bg-[#E4F2F4] border border-[#CDE5E9] rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex gap-3 items-center mt-1 mb-6">
                <div className="p-2.5 bg-white/80 rounded-xl text-[#34727D]"><Compass className="w-5 h-5" /></div>
                <h4 className="text-sm font-bold text-gray-800 font-sans">Discurso de abertura</h4>
              </div>
              <div className="border-t border-[#A8D3DB] pt-3 flex items-center justify-between text-xs">
                <span className="text-[#3a7c88] font-mono tracking-wider font-bold">DESIGADO</span>
                <strong className="text-gray-900 font-bold text-sm bg-white/80 px-2.5 py-1 rounded-md shadow-sm font-sans">
                  {meioSemana.tesouros?.discursoAbertura || "A definir"}
                </strong>
              </div>
            </div>

            {/* Joias Espirituais */}
            <div className="bg-[#E4F2F4] border border-[#CDE5E9] rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex gap-3 items-center mt-1 mb-6">
                <div className="p-2.5 bg-white/80 rounded-xl text-[#34727D]"><Gem className="w-5 h-5" /></div>
                <h4 className="text-sm font-bold text-gray-800 font-sans">Joias espirituais</h4>
              </div>
              <div className="border-t border-[#A8D3DB] pt-3 flex items-center justify-between text-xs">
                <span className="text-[#3a7c88] font-mono tracking-wider font-bold">DESIGNADO</span>
                <strong className="text-gray-900 font-bold text-sm bg-white/80 px-2.5 py-1 rounded-md shadow-sm font-sans">
                  {meioSemana.tesouros?.joiasEspirituais || "A definir"}
                </strong>
              </div>
            </div>

            {/* Leitura da Bíblia */}
            <div className="bg-[#E4F2F4] border border-[#CDE5E9] rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex gap-3 items-center mt-1 mb-6">
                <div className="p-2.5 bg-white/80 rounded-xl text-[#34727D]"><BookOpen className="w-5 h-5" /></div>
                <h4 className="text-sm font-bold text-gray-800 font-sans">Leitura da Bíblia</h4>
              </div>
              <div className="border-t border-[#A8D3DB] pt-3 flex items-center justify-between text-xs">
                <span className="text-[#3a7c88] font-mono tracking-wider font-bold">DESIGNADO</span>
                <strong className="text-gray-900 font-bold text-sm bg-white/80 px-2.5 py-1 rounded-md shadow-sm font-sans">
                  {meioSemana.tesouros?.leituraBiblia || "A definir"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FAÇA SEU MELHOR NO MINISTÉRIO (VARIÁVEL E DINÂMICO) */}
        <div id="secao-faca-seu-melhor" className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-2.5 h-6 bg-[#BE9F67] rounded-sm" />
            <h2 className="text-lg font-bold text-[#BE9F67] tracking-tight font-sans">
              Faça Seu Melhor no Ministério
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meioSemana.facaSeuMelhor && meioSemana.facaSeuMelhor.length > 0 ? (
              meioSemana.facaSeuMelhor.map((parte, index) => (
                <div 
                  key={index} 
                  className="bg-[#F0E9DC] border border-[#E1D4BD] rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="flex gap-3 items-center mt-1 mb-4">
                    <div className="p-2.5 bg-white/80 rounded-xl text-[#BE9F67]">
                      <MessageSquare className="w-5 h-5 shrink-0" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 font-sans leading-tight">
                      {parte.label || `Parte ${index + 1}`}
                    </h4>
                  </div>
                  
                  <div className="border-t border-[#DFD1B7] pt-3 flex flex-col gap-2">
                    {parte.tipo === 'demonstracao' ? (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8c744c] font-mono font-bold">ESTUDANTE</span>
                          <strong className="text-gray-900 font-bold text-sm bg-white/85 px-2.5 py-1 rounded-md shadow-sm font-sans">
                            {parte.estudante || "A definir"}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8c744c]/80 font-mono">AJUDANTE</span>
                          <strong className="text-gray-700 font-medium text-sm">
                            {parte.ajudante || "A definir"}
                          </strong>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8c744c] font-mono font-bold">DIRIGENTE</span>
                        <strong className="text-gray-900 font-bold text-sm bg-white/85 px-2.5 py-1 rounded-md shadow-sm font-sans">
                          {parte.dirigente || "A definir"}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic col-span-2">Nenhuma designação para esta seção.</p>
            )}
          </div>
        </div>

        {/* 3. NOSSA VIDA CRISTÃ (DINÂMICA + VIAJANTE) */}
        <div id="secao-nossa-vida-crista" className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-2.5 h-6 bg-[#912421] rounded-sm" />
            <h2 className="text-lg font-bold text-[#912421] tracking-tight font-sans">
              Nossa Vida Cristã
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Renderiza dinamicamente as partes da Vida Cristã (Parte 1 fixa, Parte 2 condicional) */}
            {meioSemana.vidaCrista && meioSemana.vidaCrista.map((parte, index) => (
              <div 
                key={index} 
                className="bg-[#F7DEDD] border border-[#EDC1C0] rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="flex gap-3 items-center mt-1 mb-6">
                  <div className="p-2.5 bg-white/80 rounded-xl text-[#912421]"><Layers className="w-5 h-5" /></div>
                  <h4 className="text-sm font-bold text-gray-800 font-sans">{parte.label || `Parte ${index + 1}`}</h4>
                </div>
                <div className="border-t border-[#EEBDBD] pt-3 flex items-center justify-between text-xs">
                  <span className="text-[#6d1b19] font-mono tracking-wider font-bold">DIRIGENTE</span>
                  <strong className="text-gray-950 font-bold text-sm bg-white/80 px-2.5 py-1 rounded-md shadow-sm font-sans">
                    {parte.dirigente || "A definir"}
                  </strong>
                </div>
              </div>
            ))}

            {/* CONDICIONAL: ESTUDO BÍBLICO OU VISITA DO SUPERINTENDENTE */}
            {isVisitaSuperintendente ? (
              /* CARD DO SUPERINTENDENTE DA CIRCUITO */
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md md:col-span-2">
                <div className="mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase font-mono shadow-sm">
                    Visita do Superintendente de Circuito
                  </span>
                </div>
                <div className="mt-1 mb-4 space-y-1">
                  <span className="text-xs text-amber-700/80 uppercase font-mono font-bold block">TEMA DO DISCURSO</span>
                  <h4 className="text-base font-bold text-amber-950 font-sans leading-tight">
                    {meioSemana.discursoSuperintendente?.tema || "Tema do Discurso não informado"}
                  </h4>
                </div>
                <div className="border-t border-amber-200 pt-3 flex items-center justify-between text-xs">
                  <span className="text-amber-800 font-mono font-bold uppercase tracking-wider">SUPERINTENDENTE VIAJANTE</span>
                  <strong className="text-amber-950 font-bold text-sm bg-white/90 px-3 py-1 rounded-md shadow-sm font-sans">
                    {meioSemana.discursoSuperintendente?.orador || "A definir"}
                  </strong>
                </div>
              </div>
            ) : (
              /* CARD NORMAL: ESTUDO BÍBLICO DA CONGREGAÇÃO */
              meioSemana.estudoBiblico && (
                <div className="bg-[#F7DEDD] border border-[#EDC1C0] rounded-2xl p-5 flex flex-col justify-between hover:shadow-md md:col-span-2">
                  <div className="mt-1 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-white/80 rounded-xl text-[#912421]"><BookOpen className="w-5 h-5" /></div>
                    <h4 className="text-base font-bold text-gray-800 font-sans">Estudo bíblico de congregação</h4>
                  </div>
                  <div className="border-t border-[#EEBDBD] pt-3 grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between text-xs bg-white/60 p-2 rounded-xl">
                      <span className="text-[#6d1b19] font-mono text-[9px] tracking-wider uppercase font-semibold">Dirigente</span>
                      <strong className="text-gray-950 font-bold text-xs truncate max-w-[120px] font-sans">
                        {meioSemana.estudoBiblico.dirigente || "A definir"}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-xs bg-white/60 p-2 rounded-xl">
                      <span className="text-[#6d1b19] font-mono text-[9px] tracking-wider uppercase font-semibold">Leitor</span>
                      <strong className="text-gray-950 font-bold text-xs truncate max-w-[120px] font-sans">
                        {meioSemana.estudoBiblico.leitor || "A definir"}
                      </strong>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Quadro Mecânico Acoplado no fim */}
        {mecanicas && (
          <div className="mt-4">
            {/* O componente MechanicalSupportGrid puxará as mecânicas normais abaixo */}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Erro crítico interceptado no MeetingMidweek:", error);
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-xl max-w-md mx-auto mt-10">
        <p className="font-bold">Aviso do Sistema</p>
        <p className="text-sm mt-1">O componente foi reiniciado de forma segura.</p>
      </div>
    );
  }
}
