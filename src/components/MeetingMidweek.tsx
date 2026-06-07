/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BookOpen, 
  Gem, 
  Compass, 
  HelpCircle, 
  Mic, 
  MessageSquare, 
  Users, 
  Music, 
  User,
  UserCheck,
  Bookmark,
  Calendar,
  Layers
} from 'lucide-react';
import { SecaoVidaMinisterio, DesignacoesMecanicas } from '../types';
import { motion } from 'motion/react';

interface MeetingMidweekProps {
  key?: string;
  meioSemana?: SecaoVidaMinisterio;
  mecanicas?: DesignacoesMecanicas;
}

// Smart helper to supply tailored icons to different congregation activities
function getMidweekIcon(partTitle: string, sectionType: 'tesouros' | 'faca-seu-melhor' | 'vida-crista') {
  const lowercase = partTitle.toLowerCase();
  
  if (sectionType === 'tesouros') {
    if (lowercase.includes('encontre') || lowercase.includes('joias') || lowercase.includes('jóias')) {
      return Gem;
    }
    if (lowercase.includes('leitura')) {
      return BookOpen;
    }
    return Compass;
  }
  
  if (sectionType === 'faca-seu-melhor') {
    if (lowercase.includes('conversa')) {
      return MessageSquare;
    }
    if (lowercase.includes('revisita')) {
      return Users;
    }
    if (lowercase.includes('estudo')) {
      return Bookmark;
    }
    if (lowercase.includes('discurso') || lowercase.includes('orador')) {
      return Mic;
    }
    return HelpCircle;
  }
  
  // Nossa Vida Cristã
  if (lowercase.includes('estudo bíblico') || lowercase.includes('congregação')) {
    return BookOpen;
  }
  if (lowercase.includes('necessidades')) {
    return Calendar;
  }
  return Layers;
}

export function MeetingMidweek({ meioSemana, mecanicas }: MeetingMidweekProps) {
  if (!meioSemana) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-[#E2E8F0] min-h-[300px] shadow-xs">
        <Calendar className="w-12 h-12 text-[#1A365D]/20 mb-4 animate-pulse" />
        <h3 className="text-base font-bold text-[#1A365D] font-sans">Meio de Semana</h3>
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
      id="meio-semana-programacao-view"
    >
      {/* Overview Card with timing, prayers and chairman */}
      <div className="bg-slate-55 border border-slate-100 rounded-2xl p-5 bg-linear-to-br from-slate-50 to-white hover:shadow-xs transition duration-300">
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
              <strong className="text-slate-800 font-semibold">{meioSemana.presidente || "A definir"}</strong>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
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

      {/* 1. TESOUROS DA PALAVRA DE DEUS */}
      <div id="secao-tesouros" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <div className="w-2.5 h-6 bg-[#34727D] rounded-xs" />
          <h2 className="text-lg font-bold text-[#34727D] tracking-tight font-sans">
            Tesouros da Palavra de Deus
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              titulo: "Discurso inicial",
              tema: meioSemana.tesouros?.[0]?.tema || "A ruína da cidade sanguinária",
              tempo: meioSemana.tesouros?.[0]?.tempo || "10 min",
              orador: meioSemana.tesouros?.[0]?.orador || "A decidir"
            },
            {
              titulo: "Joias espirituais",
              tema: meioSemana.tesouros?.[1]?.tema || "Encontro de joias espirituais",
              tempo: meioSemana.tesouros?.[1]?.tempo || "10 min",
              orador: meioSemana.tesouros?.[1]?.orador || "A decidir"
            },
            {
              titulo: "Leitura da Bíblia",
              tema: meioSemana.tesouros?.[2]?.tema || "Análise e leitura bíblica semanal",
              tempo: meioSemana.tesouros?.[2]?.tempo || "4 min",
              orador: meioSemana.tesouros?.[2]?.orador || "A decidir"
            }
          ].map((tesouro, index) => {
            const PartIcon = getMidweekIcon(tesouro.tema, 'tesouros');
            return (
              <div 
                key={index} 
                id={`tesouro-card-${index}`}
                className="bg-[#E4F2F4] border border-[#CDE5E9] rounded-2xl p-5 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#2a5b64] uppercase font-mono shadow-2xs">
                    {tesouro.tempo}
                  </span>
                  {/* Top-right scripture/reference text eliminated as requested */}
                </div>
                
                <div className="mt-1 mb-4 flex-1 flex items-center gap-3">
                  <div className="p-2.5 bg-white/85 rounded-xl text-[#34727D] shrink-0">
                    <PartIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#2a5b64] uppercase font-sans tracking-tight">
                    {index === 0 ? "DISCURSO INICIAL" : index === 1 ? "JOIAS ESPIRITUAIS" : "LEITURA DA BÍBLIA"}
                  </h4>
                </div>
                
                <div className="border-t border-[#A8D3DB] pt-3 flex items-center justify-between text-xs mt-auto">
                  <span className="text-[#3a7c88] font-mono tracking-wider font-bold">ORADOR</span>
                  <strong className="text-gray-950 font-bold text-sm bg-white/80 px-2.5 py-1 rounded-md shadow-3xs font-sans">
                    {tesouro.orador}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. FAÇA SEU MELHOR NO MINISTÉRIO */}
      <div id="secao-faca-seu-melhor" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <div className="w-2.5 h-6 bg-[#BE9F67] rounded-xs" />
          <h2 className="text-lg font-bold text-[#BE9F67] tracking-tight font-sans">
            Faça Seu Melhor no Ministério
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meioSemana.facaSeuMelhor && meioSemana.facaSeuMelhor.length > 0 ? (
            meioSemana.facaSeuMelhor.map((faca, index) => {
              const PartIcon = getMidweekIcon(faca.tema, 'faca-seu-melhor');
              return (
                <div 
                  key={index} 
                  id={`faca-card-${index}`}
                  className="bg-[#F0E9DC] border border-[#E1D4BD] rounded-2xl p-5 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#836c42] uppercase font-mono shadow-2xs">
                      {faca.tempo || "5 min"}
                    </span>
                    {/* Top-right scripture/reference text eliminated as requested */}
                  </div>
                  
                  <div className="flex gap-3 items-start mt-1 mb-4 flex-1">
                    <div className="p-2.5 bg-white/85 rounded-xl text-[#BE9F67]">
                      <PartIcon className="w-5 h-5 shrink-0" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 font-sans leading-relaxed pt-1">
                      {faca.tema}
                    </p>
                  </div>
                  
                  <div className="border-t border-[#DFD1B7] pt-3 flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8c744c] font-mono tracking-wider font-bold">DESIGNAÇÃO</span>
                      <strong className="text-gray-950 font-bold text-sm bg-white/85 px-2.5 py-1 rounded-md shadow-3xs font-sans">
                        {faca.orador || "A definir"}
                      </strong>
                    </div>
                    {faca.ajudante && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8c744c]/80 font-mono tracking-wider">Ajudante</span>
                        <strong className="text-gray-700 font-medium text-sm">
                          {faca.ajudante}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400 italic">Nenhuma designação listada.</p>
          )}
        </div>
      </div>

      {/* 3. NOSSA VIDA CRISTÃ */}
      <div id="secao-nossa-vida-crista" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <div className="w-2.5 h-6 bg-[#912421] rounded-xs" />
          <h2 className="text-lg font-bold text-[#912421] tracking-tight font-sans">
            Nossa Vida Cristã
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meioSemana.vidaCrista && meioSemana.vidaCrista.length > 0 ? (
            meioSemana.vidaCrista.map((vida, index) => {
              const PartIcon = getMidweekIcon(vida.tema, 'vida-crista');
              const cardTitle = `Parte ${index + 1}`;
              return (
                <div 
                  key={index} 
                  id={`vida-card-${index}`}
                  className="bg-[#F7DEDD] border border-[#EDC1C0] rounded-2xl p-5 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#6d1b19] uppercase font-mono shadow-2xs">
                      {vida.tempo || "15 min"}
                    </span>
                    {/* Top-right scripture/reference text eliminated as requested */}
                  </div>
                  
                  <div className="mt-1 mb-4 flex-1 flex items-center gap-3">
                    <div className="p-2.5 bg-white/85 rounded-xl text-[#912421] shrink-0">
                      <PartIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-[#6d1b19] uppercase font-sans tracking-tight">
                      PARTE {index + 1}
                    </h4>
                  </div>
                  
                  <div className="border-t border-[#EEBDBD] pt-3 flex items-center justify-between text-xs mt-auto">
                    <span className="text-[#6d1b19] font-mono tracking-wider font-bold">DIRIGENTE</span>
                    <strong className="text-gray-950 font-bold text-sm bg-white/80 px-2.5 py-1 rounded-md shadow-3xs font-sans">
                      {vida.orador || "A definir"}
                    </strong>
                  </div>
                </div>
              );
            })
          ) : null}

          {/* Congregation Bible Study Render (Estudo Bíblico de Congregação) */}
          {meioSemana.estudoBiblico && (
            <div 
              id="estudo-biblico-card"
              className="bg-[#F7DEDD] border border-[#EDC1C0] rounded-2xl p-5 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between hover:shadow-md md:col-span-2"
            >
              <div className="flex items-center justify-between gap-3 mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#912421]" />
                  <h4 className="text-sm font-bold text-gray-850 font-sans">
                    Estudo Bíblico de Congregação
                  </h4>
                </div>
                <span className="text-xs font-mono font-semibold text-[#731c19] bg-white/50 px-2 py-0.5 rounded-sm shrink-0">
                  30 min
                </span>
              </div>
              
              {/* Eliminated description theme below as requested */}
              
              <div className="border-t border-[#EEBDBD] pt-3 flex flex-col gap-2.5 mt-2">
                <div className="flex flex-col items-start gap-0.5 bg-white/60 p-2.5 rounded-xl w-full">
                  <span className="text-[#6d1b19] font-mono text-[9px] tracking-wider uppercase font-bold">Dirigente</span>
                  <strong className="text-[#2D3748] font-bold text-sm font-sans w-full truncate">
                    {meioSemana.estudoBiblico.dirigente || "A definir"}
                  </strong>
                </div>
                <div className="flex flex-col items-start gap-0.5 bg-white/60 p-2.5 rounded-xl w-full">
                  <span className="text-[#6d1b19] font-mono text-[9px] tracking-wider uppercase font-bold">Leitor</span>
                  <strong className="text-[#2D3748] font-bold text-sm font-sans w-full truncate">
                    {meioSemana.estudoBiblico.leitor || "A definir"}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
