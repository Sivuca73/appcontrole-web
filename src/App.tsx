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
import { 
  CalendarDays, 
  ChevronDown, 
  Layers, 
  Users2, 
  RefreshCw,
  BookMarked,
  ArrowRight
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
  const [activeTab, setActiveTab] = useState<'meioSemana' | 'fimSemana'>('meioSemana');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showConfigHint, setShowConfigHint] = useState<boolean>(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans selection:bg-slate-100 selection:text-slate-900" id="spa-root">
      
      {/* Top micro helper bar - Discrete & Professional */}
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
              <BookMarked className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-500 block uppercase font-mono leading-none">
                Designações
              </span>
              <strong className="text-xs font-bold text-slate-800 font-sans tracking-tight">
                Consulta de Irmãos
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              id="reload-data-btn"
              onClick={loadData}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title="Atualizar Dados"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-slate-700" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-10 pb-24 space-y-8">
        
        <AnimatePresence>
          {showConfigHint && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-xs text-slate-600 space-y-2.5 font-sans relative"
              id="config-hint-box"
            >
              <strong className="text-slate-800 block text-sm font-semibold">Configuração do Firebase</strong>
              <p className="leading-relaxed">
                Este aplicativo de consulta possui estrito acesso de <strong>apenas leitura (Read-Only)</strong>. 
              </p>
              <button 
                onClick={() => setShowConfigHint(false)}
                className="absolute top-3 right-4 font-mono font-bold hover:text-slate-900 p-1 text-slate-400"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING INDICATOR STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4" id="loading-spinner-container">
            <div className="w-10 h-10 border-3 border-slate-150 border-t-slate-800 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-light tracking-wide font-mono">Buscando designações na nuvem...</p>
          </div>
        ) : (
          <>
            {/* HERO BLOCK: WEEK TITLE & WEEK DROP-DOWN SELECTOR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-gray-100 pb-6" id="hero-block">
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-widest uppercase font-mono flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                  Programação Congregacional
                </span>
                
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-display" id="selected-week-title">
                  {selectedWeek ? formatWeekLabelLong(selectedWeek.labelSemana) : "Semana de Consulta"}
                </h1>
              </div>

              {/* Discreet Week Dropdown Selector */}
              <div ref={dropdownRef} className="relative shrink-0" id="seletor-semana-dropdown-root">
                <button
                  id="dropdown-toggle-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between gap-3 px-4.5 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-slate-50 hover:border-gray-300 transition shadow-2xs font-sans text-sm font-semibold text-gray-700 min-w-[210px]"
                >
                  <span className="truncate">Alternar Semana</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-72 bg-white border border-gray-150 rounded-2xl shadow-xl overflow-hidden z-40 py-1.5"
                      id="dropdown-menu-list"
                    >
                      <div className="px-3 pb-1.5 mb-1.5 border-b border-gray-100">
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
                                  ? "bg-slate-50 text-slate-900 border-l-4 border-slate-900" 
                                  : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
                              }`}
                            >
                              <div className="flex flex-col min-w-0">
                                <span className={isCurrentItem ? "font-bold text-gray-900" : "font-semibold"}>
                                  {weekItem.labelSemana}
                                </span>
                              </div>
                              <ArrowRight className={`w-3.5 h-3.5 transition opacity-0 group-hover:opacity-100 ${isCurrentItem ? "opacity-100 text-slate-800" : "text-gray-300"}`} />
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* PRESENTATION CARD BODY */}
            <div className="pt-4" id="view-content-canvas">
              <AnimatePresence mode="wait">
                {activeTab === 'meioSemana' ? (
                  <MeetingMidweek 
                    key="midweek-content"
                    meioSemana={selectedWeek?.publicadoMeioSemana ? selectedWeek.meioSemana : undefined}
                    mecanicas={selectedWeek?.publicadoMeioSemana ? selectedWeek.mecanicasMeioSemana : undefined}
                    isVisitaSuperintendente={selectedWeek?.isVisitaSuperintendente || false}
                  />
                ) : (
                  <MeetingWeekend 
                    key="weekend-content"
                    fimSemana={selectedWeek?.publicadoFimSemana ? selectedWeek.fimSemana : undefined}
                    mecanicas={selectedWeek?.publicadoFimSemana ? selectedWeek.mecanicasFimSemana : undefined}
                  />
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-150 text-gray-400 pt-8 pb-32 text-xs font-sans mt-auto" id="spa-footer">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left leading-normal font-medium">
            Consulta de Programações.
            <span className="block text-[10px] text-gray-400 mt-0.5">Todos os direitos reservados à Congregação Local.</span>
          </p>
          <span className="px-3 py-1 bg-slate-50 border border-gray-100 rounded-lg text-[10px] font-mono hover:bg-slate-100">
            Apostila 2026 Layout
          </span>
        </div>
      </footer>

      {/* Premium Translucent Floating Bottom Menu Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/40 backdrop-blur-md border border-gray-200/60 rounded-full py-1.5 px-2.5 z-50 flex justify-center shadow-lg hover:shadow-xl transition-all duration-300 w-36" id="bottom-navigation-bar">
        <div className="w-full flex justify-between gap-1">
          <button
            id="menu-btn-meio-semana"
            onClick={() => {
              setActiveTab('meioSemana');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
              activeTab === 'meioSemana'
                ? "bg-[#820ad1]/10 text-[#820ad1] scale-105"
                : "text-gray-400 hover:text-gray-600 hover:bg-slate-50"
            }`}
            title="Reunião de Meio de Semana"
          >
            <Layers className="w-5 h-5 transition-transform" />
          </button>

          <button
            id="menu-btn-fim-semana"
            onClick={() => {
              setActiveTab('fimSemana');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
              activeTab === 'fimSemana'
                ? "bg-[#820ad1]/10 text-[#820ad1] scale-105"
                : "text-gray-400 hover:text-gray-600 hover:bg-slate-50"
            }`}
            title="Reunião de Fim de Semana"
          >
            <Users2 className="w-5 h-5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
