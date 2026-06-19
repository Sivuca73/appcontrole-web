/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  fetchSchedulesFromDB, 
  getFbDatabase 
} from './firebase';
import { SemanaProgramacao } from './types';
import { MeetingMidweek } from './components/MeetingMidweek';
import { MeetingWeekend } from './components/MeetingWeekend';
import { MonthlySupportGrid } from './components/MechanicalSupportGrid';
import { FieldReportsModule } from './components/FieldReportsModule';
import { 
  CalendarDays, 
  ChevronDown, 
  Layers, 
  Users2, 
  Info, 
  RefreshCw,
  Sparkles,
  BookMarked,
  ArrowRight,
  Monitor,
  FileText
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Help find the Monday of the current week in YYYY-MM-DD
function getMondayOfCurrentWeek(): string {
  // We use the local time from additional metadata as mock/actual foundation (2026-06-01)
  const baseDate = new Date("2026-06-01T02:40:45Z");
  
  const day = baseDate.getUTCDay();
  const diff = baseDate.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(baseDate.setUTCDate(diff));
  
  const year = monday.getUTCFullYear();
  const month = String(monday.getUTCMonth() + 1).padStart(2, '0');
  const dateNum = String(monday.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${dateNum}`;
}

export default function App() {
  const [weeks, setWeeks] = useState<SemanaProgramacao[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<SemanaProgramacao | null>(null);
  const [activeTab, setActiveTab] = useState<'meioSemana' | 'fimSemana' | 'mecanica' | 'relatorio'>('meioSemana');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showConfigHint, setShowConfigHint] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamically change background color of body and html based on showWelcome status to prevent white bars at the top/bottom (safe area / bounce)
  useEffect(() => {
    if (showWelcome) {
      document.body.style.backgroundColor = '#1A365D';
      document.documentElement.style.backgroundColor = '#1A365D';
    } else {
      document.body.style.backgroundColor = '#F7F9FC';
      document.documentElement.style.backgroundColor = '#F7F9FC';
    }
  }, [showWelcome]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { weeks: loadedWeeks, isDemo } = await fetchSchedulesFromDB();
      setWeeks(loadedWeeks);
      setIsDemoMode(isDemo);
      
      if (loadedWeeks.length > 0) {
        // "Inteligência de Exibição Atual" - search for current week based on 2026-06-01
        const currentMonday = getMondayOfCurrentWeek();
        const foundCurrent = loadedWeeks.find(w => w.id === currentMonday);
        
        if (foundCurrent) {
          setSelectedWeek(foundCurrent);
        } else {
          // Fallback: If not exact today, find the first upcoming week or closest week
          const sorted = [...loadedWeeks].sort((a, b) => a.id.localeCompare(b.id));
          
          // Find first occurring after or equal
          const futureWeeks = sorted.filter(w => w.id >= currentMonday);
          if (futureWeeks.length > 0) {
            setSelectedWeek(futureWeeks[0]);
          } else {
            setSelectedWeek(sorted[sorted.length - 1]); // Latest available
          }
        }
      }
    } catch (err) {
      console.error("Erro ao carregar as programações:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format month name elegantly in Portuguese
  const formatWeekLabelLong = (label: string) => {
    if (!label) return "";
    return `Semana de ${label}`;
  };

  if (showWelcome) {
    return (
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 bg-gradient-to-b from-[#1A365D] to-[#10223B] text-white flex flex-col justify-between p-6 z-[999] font-sans overflow-hidden"
        id="welcome-full-screen-banner"
      >
        {/* Decorative Grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06]" />
        
        {/* Floating gradient lights */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#4A90E2]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#BE9F67]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto w-full my-auto flex flex-col items-center text-center space-y-8">
          
          {/* Animated Emblem */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A365D] to-[#274C77] flex items-center justify-center shadow-lg border border-[#BE9F67]/30"
          >
            <CalendarDays className="w-8 h-8 text-[#BE9F67] animate-pulse" />
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-bold tracking-widest text-[#BE9F67] uppercase font-mono block"
            >
              📅 Programação Congregacional de Reduto
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display leading-tight"
            >
              BEM-VINDO À <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#4A90E2] to-[#BE9F67]">Agenda Teocrática</span>
              <span className="block text-xl sm:text-2xl text-[#BE9F67] font-semibold mt-2 tracking-wide font-sans normal-case">
                da Congregação Reduto
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-200 font-light text-sm sm:text-base leading-relaxed max-w-md mx-auto"
            >
              Consulte facilmente as designações e programações da Congregação Reduto atualizadas.
            </motion.p>
          </div>

          {/* Elegant Intro Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 text-left text-xs text-slate-300 font-sans space-y-2.5 shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#BE9F67]" />
              <strong className="text-[#BE9F67]">Acesso Simplificado aos Leitores e Indicadores</strong>
            </div>
            <p className="leading-relaxed text-slate-300">
              O quadro realiza a consulta automática e apresenta as designações atualizadas de todas as reuniões e serviços do Reino em tempo real.
            </p>
          </motion.div>

          {/* CTA Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowWelcome(false)}
            className="w-full max-w-xs py-3.5 px-6 bg-[#BE9F67] text-[#1A365D] hover:bg-[#d6b77c] transition-all font-bold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            Acessar Quadro de Designações
            <ArrowRight className="w-5 h-5 text-[#1A365D]" />
          </motion.button>
        </div>

        {/* Brand signature */}
        <div className="text-center font-mono opacity-40 text-[9px] uppercase tracking-widest text-[#BE9F67] relative z-10">
          Agenda Teocrática • Congregação Reduto
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#2D3748] flex flex-col font-sans selection:bg-[#E2E8F0] selection:text-[#1A365D]" id="spa-root">
      
      {/* Top micro helper bar - Discrete & Professional */}
      <header className="border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1A365D] flex items-center justify-center shadow-xs border border-[#4A90E2]/20">
              <CalendarDays className="w-4.5 h-4.5 text-[#BE9F67]" />
            </div>
            <div>
              <span className="text-[9px] font-bold tracking-widest text-[#BE9F67] block uppercase font-mono leading-none">
                Quadro de Designações
              </span>
              <strong className="text-sm font-bold text-[#1A365D] font-sans tracking-tight">
                Agenda Teocrática — Reduto
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Reload action remains */}
            <button 
              id="reload-data-btn"
              onClick={loadData}
              className="p-1.5 hover:bg-[#E2E8F0]/50 rounded-lg text-[#718096] transition-colors"
              title="Atualizar Dados"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#1A365D]" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-10 pb-28 space-y-7">
        
        {/* Dynamic configuration helper card */}
        <AnimatePresence>
          {showConfigHint && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 text-xs text-[#718096] space-y-2.5 font-sans relative"
              id="config-hint-box"
            >
              <strong className="text-[#1A365D] block text-sm font-semibold">Quadro Virtual</strong>
              <p className="leading-relaxed">
                Este aplicativo possui estrito acesso de <strong>apenas leitura (Read-Only)</strong> para consulta das programações congregacionais atualizadas.
              </p>
              <button 
                onClick={() => setShowConfigHint(false)}
                className="absolute top-3 right-4 font-mono font-bold hover:text-[#1A365D] p-1 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING INDICATOR STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4" id="loading-spinner-container">
            <div className="w-10 h-10 border-3 border-[#E2E8F0] border-t-[#1A365D] rounded-full animate-spin" />
            <p className="text-[#718096] text-xs font-semibold tracking-wide uppercase font-mono">Buscando designações na nuvem...</p>
          </div>
        ) : (
          <>
            {/* HERO BLOCK: WEEK TITLE & WEEK DROP-DOWN SELECTOR */}
            {activeTab !== 'relatorio' && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[#E2E8F0] pb-6" id="hero-block">
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] sm:text-xs font-semibold text-[#BE9F67] tracking-widest uppercase font-mono flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-[#BE9F67]" />
                    Programação Congregacional • Reduto
                  </span>
                  
                  {/* Dynamically configured format title */}
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A365D] font-display" id="selected-week-title">
                    {selectedWeek ? formatWeekLabelLong(selectedWeek.labelSemana) : "Semana de Consulta"}
                  </h1>
                </div>

                {/* Discreet Week Dropdown Selector */}
                <div ref={dropdownRef} className="relative shrink-0" id="seletor-semana-dropdown-root">
                  <button
                    id="dropdown-toggle-btn"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between gap-3 px-4.5 py-3 border border-[#E2E8F0] rounded-2xl bg-white hover:bg-slate-50 hover:border-[#BE9F67]/30 transition shadow-2xs font-sans text-xs font-bold text-[#1A365D] min-w-[210px] cursor-pointer"
                  >
                    <span className="truncate">Alternar Semana</span>
                    <ChevronDown className={`w-4 h-4 text-[#718096] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-40 py-1.5"
                        id="dropdown-menu-list"
                      >
                        <div className="px-3 pb-1.5 mb-1.5 border-b border-[#E2E8F0]">
                          <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase font-mono block">
                            Selecione o Período
                          </span>
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto space-y-0.5">
                          {weeks.map((weekItem) => {
                            const isCurrentItem = selectedWeek?.id === weekItem.id;
                            return (
                              <button
                                key={weekItem.id}
                                id={`week-option-${weekItem.id}`}
                                onClick={() => {
                                  setSelectedWeek(weekItem);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors ${
                                  isCurrentItem 
                                    ? "bg-[#1A365D]/5 text-[#1A365D] border-l-4 border-[#1A365D]" 
                                    : "text-[#718096] hover:bg-slate-50 hover:text-[#1A365D]"
                                }`}
                              >
                                <div className="flex flex-col min-w-0">
                                  <span className={isCurrentItem ? "font-bold text-[#1A365D]" : "font-semibold"}>
                                    {weekItem.labelSemana}
                                  </span>
                                  {weekItem.temaMensal && (
                                    <span className="text-[10px] text-gray-400 truncate max-w-[220px]">
                                      {weekItem.temaMensal}
                                    </span>
                                  )}
                                </div>
                                <ArrowRight className={`w-3.5 h-3.5 transition opacity-0 group-hover:opacity-100 ${isCurrentItem ? "opacity-100 text-[#1A365D]" : "text-gray-300"}`} />
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* PRESENTATION HIGHLIGHT CARD (CARTÃO DESTAQUE) */}
            {activeTab !== 'relatorio' && selectedWeek && (
              <div 
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-300 relative overflow-hidden" 
                id="highlight-info-card"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1A365D]" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-[#718096] uppercase tracking-wider block">Status das Escalas</span>
                    <strong className="text-base font-bold text-[#1A365D] block font-sans">
                      Semana de {selectedWeek.labelSemana}
                    </strong>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-[#F7F9FC] px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] self-start sm:self-center shadow-3xs">
                    <span className={`w-2 h-2 rounded-full ${selectedWeek.publicadoMeioSemana || selectedWeek.publicadoFimSemana ? "bg-[#BE9F67]" : "bg-red-400"}`} />
                    <span className="text-xs font-semibold text-[#2D3748] font-sans">
                      {selectedWeek.publicadoMeioSemana && selectedWeek.publicadoFimSemana 
                        ? "Escalas publicadas" 
                        : selectedWeek.publicadoMeioSemana 
                          ? "Meio de semana publicado"
                          : selectedWeek.publicadoFimSemana 
                            ? "Fim de semana publicado"
                            : "Aguardando publicação"}
                    </span>
                  </div>
                </div>
                
                {selectedWeek.temaMensal && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-1">
                    <span className="text-[9px] font-mono font-bold text-[#718096] uppercase tracking-wider block">Tema do Mês / Reunião</span>
                    <p className="text-sm font-semibold text-[#2D3748] italic font-sans leading-relaxed">
                      "{selectedWeek.temaMensal}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PRESENTATION CARD BODY */}
            <div className="pt-2" id="view-content-canvas">
              <AnimatePresence mode="wait">
                {activeTab === 'meioSemana' ? (
                  <MeetingMidweek 
                    key="midweek-content"
                    meioSemana={selectedWeek?.publicadoMeioSemana ? selectedWeek.meioSemana : undefined}
                    mecanicas={selectedWeek?.publicadoMeioSemana ? selectedWeek.mecanicasMeioSemana : undefined}
                  />
                ) : activeTab === 'fimSemana' ? (
                  <MeetingWeekend 
                    key="weekend-content"
                    fimSemana={selectedWeek?.publicadoFimSemana ? selectedWeek.fimSemana : undefined}
                  />
                ) : activeTab === 'mecanica' ? (
                  <MonthlySupportGrid
                    key="mecanica-content"
                    mecanicaMensal={selectedWeek?.mecanicaMensal}
                  />
                ) : (
                  <FieldReportsModule 
                    key="relatorio-content"
                  />
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      {/* Humble Elegant footer */}
      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] text-[#718096] pt-8 pb-32 text-xs font-sans mt-auto bg-white/50" id="spa-footer">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left leading-normal font-medium">
            Programação Congregacional de Reduto.
            <span className="block text-[10px] text-[#718096]/75 mt-0.5">Todos os direitos reservados à Congregação Reduto.</span>
          </p>
          <span className="px-3 py-1 bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg text-[10px] font-mono hover:bg-[#E2E8F0]/30 transition-colors">
            Agenda Teocrática — Reduto 2026
          </span>
        </div>
      </footer>

      {/* Translucent Floating Bottom Menu Bar with labels below the icons */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-full py-2 px-3.5 z-50 flex justify-center shadow-lg hover:shadow-xl transition-all duration-300 w-[440px] max-w-[95vw]" id="bottom-navigation-bar">
        <div className="w-full flex justify-between items-center gap-1.5">
          <button
            id="menu-btn-meio-semana"
            onClick={() => {
              setActiveTab('meioSemana');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-300 cursor-pointer ${
              activeTab === 'meioSemana'
                ? "bg-[#1A365D]/5 text-[#1A365D] font-bold scale-[1.01]"
                : "text-[#718096] hover:text-[#2D3748] hover:bg-slate-50/50"
            }`}
          >
            <Layers className={`w-4.5 h-4.5 mb-0.5 transition-transform ${activeTab === 'meioSemana' ? 'text-[#4A90E2]' : ''}`} />
            <span className="text-[10px] font-sans font-semibold tracking-tight">Meio de Semana</span>
          </button>

          <button
            id="menu-btn-fim-semana"
            onClick={() => {
              setActiveTab('fimSemana');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-300 cursor-pointer ${
              activeTab === 'fimSemana'
                ? "bg-[#1A365D]/5 text-[#1A365D] font-bold scale-[1.01]"
                : "text-[#718096] hover:text-[#2D3748] hover:bg-slate-50/50"
            }`}
          >
            <Users2 className={`w-4.5 h-4.5 mb-0.5 transition-transform ${activeTab === 'fimSemana' ? 'text-[#BE9F67]' : ''}`} />
            <span className="text-[10px] font-sans font-semibold tracking-tight">Fim de Semana</span>
          </button>

          <button
            id="menu-btn-mecanica"
            onClick={() => {
              setActiveTab('mecanica');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-300 cursor-pointer ${
              activeTab === 'mecanica'
                ? "bg-[#1A365D]/5 text-[#1A365D] font-bold scale-[1.01]"
                : "text-[#718096] hover:text-[#2D3748] hover:bg-slate-50/50"
            }`}
          >
            <Monitor className={`w-4.5 h-4.5 mb-0.5 transition-transform ${activeTab === 'mecanica' ? 'text-[#4A90E2]' : ''}`} />
            <span className="text-[10px] font-sans font-semibold tracking-tight">Apoio</span>
          </button>

          <button
            id="menu-btn-relatorio"
            onClick={() => {
              setActiveTab('relatorio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-300 cursor-pointer ${
              activeTab === 'relatorio'
                ? "bg-[#1A365D]/5 text-[#1A365D] font-bold scale-[1.01]"
                : "text-[#718096] hover:text-[#2D3748] hover:bg-slate-50/50"
            }`}
          >
            <FileText className={`w-4.5 h-4.5 mb-0.5 transition-transform ${activeTab === 'relatorio' ? 'text-[#BE9F67]' : ''}`} />
            <span className="text-[10px] font-sans font-semibold tracking-tight">Relatório</span>
          </button>
        </div>
      </div>
    </div>
  );
}
