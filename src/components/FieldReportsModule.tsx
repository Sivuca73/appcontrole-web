/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  getPublishersFromDB, 
  savePublisherToDB, 
  getFieldReportsFromDB, 
  saveFieldReportToDB, 
  generateAccessCode,
  Publisher, 
  FieldReport 
} from '../reportFirebase';
import { 
  FileText, 
  Users2, 
  ClipboardCheck, 
  Clock, 
  Search, 
  Plus, 
  Lock, 
  Unlock, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  UserMinus, 
  UserPlus, 
  Calendar, 
  BookOpen, 
  Check, 
  Phone, 
  Mail, 
  X,
  Filter,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function FieldReportsModule() {
  // Database States
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Authentication & Session States
  const [accessCode, setAccessCode] = useState<string>('');
  const [loggedInPublisher, setLoggedInPublisher] = useState<Publisher | null>(null);
  const [isSecretary, setIsSecretary] = useState<boolean>(false);
  const [secretaryPassword, setSecretaryPassword] = useState<string>('');
  const [showSecretaryLogin, setShowSecretaryLogin] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [secAuthError, setSecAuthError] = useState<string | null>(null);

  // Sub-tabs for Secretary Mode
  const [secActiveTab, setSecActiveTab] = useState<'received' | 'publishers'>('received');

  // Input states for Publisher Report Form
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-06'); // Current local time is June 2026
  const [participated, setParticipated] = useState<boolean>(true);
  const [hours, setHours] = useState<string>('');
  const [studies, setStudies] = useState<string>('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);
  const [reportErrorMsg, setReportErrorMsg] = useState<string | null>(null);

  // Filter States for Secretary View
  const [filterMonth, setFilterMonth] = useState<string>('2026-06');
  const [filterType, setFilterType] = useState<string>('all');
  const [publisherSearch, setPublisherSearch] = useState<string>('');

  // Editing state for Secretary
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);
  const [editingReport, setEditingReport] = useState<FieldReport | null>(null);
  const [showAddPublisherModal, setShowAddPublisherModal] = useState<boolean>(false);

  // Form states for adding/editing Publisher
  const [pubFormName, setPubFormName] = useState<string>('');
  const [pubFormGender, setPubFormGender] = useState<'masculino' | 'feminino'>('masculino');
  const [pubFormType, setPubFormType] = useState<'publicador' | 'pioneiro_auxiliar' | 'pioneiro_regular'>('publicador');
  const [pubFormPhone, setPubFormPhone] = useState<string>('');
  const [pubFormEmail, setPubFormEmail] = useState<string>('');
  const [pubFormActive, setPubFormActive] = useState<boolean>(true);
  const [pubFormError, setPubFormError] = useState<string | null>(null);

  // Month list helper (to pick reports for)
  const availableMonths = [
    { value: '2026-06', label: 'Junho de 2026' },
    { value: '2026-05', label: 'Maio de 2026' },
    { value: '2026-04', label: 'Abril de 2026' },
    { value: '2026-03', label: 'Março de 2026' },
    { value: '2026-02', label: 'Fevereiro de 2026' },
    { value: '2026-01', label: 'Janeiro de 2026' },
  ];

  // Load publishers and reports
  const reloadData = async () => {
    setLoading(true);
    try {
      const pubs = await getPublishersFromDB();
      const reps = await getFieldReportsFromDB();
      setPublishers(pubs);
      setReports(reps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
    // Auto restore session if available in localStorage
    const savedPub = localStorage.getItem('reduto_current_user');
    if (savedPub) {
      try {
        setLoggedInPublisher(JSON.parse(savedPub));
      } catch {
        localStorage.removeItem('reduto_current_user');
      }
    }
    const savedSec = localStorage.getItem('reduto_is_secretary');
    if (savedSec === 'true') {
      setIsSecretary(true);
    }
  }, []);

  // Handle Publisher Access Code Login
  const handlePublisherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const code = accessCode.trim();
    if (code.length !== 6) {
      setAuthError('O código deve conter exatamente 6 dígitos.');
      return;
    }

    const matched = publishers.find(p => p.codigo === code);
    if (!matched) {
      setAuthError('Código de acesso não encontrado. Verifique com o secretário.');
      return;
    }

    if (!matched.ativo) {
      setAuthError('Este cadastro de publicador foi desativado.');
      return;
    }

    setLoggedInPublisher(matched);
    localStorage.setItem('reduto_current_user', JSON.stringify(matched));
    setAccessCode('');
  };

  // Handle Secretary Login
  const handleSecretaryLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSecAuthError(null);
    const pass = secretaryPassword.trim().toLowerCase();
    
    // Support either PIN, word "secretario", or default "123456" for ease of demo compliance
    if (pass === 'secretario' || pass === '123456' || pass === '999999') {
      setIsSecretary(true);
      setShowSecretaryLogin(false);
      localStorage.setItem('reduto_is_secretary', 'true');
      setSecretaryPassword('');
    } else {
      setSecAuthError('PIN incorreto. Use "123456" ou "secretario" para testar.');
    }
  };

  // Logout/Reset Sessions
  const handleLogoutPublisher = () => {
    setLoggedInPublisher(null);
    localStorage.removeItem('reduto_current_user');
    setReportSuccessMsg(null);
    setReportErrorMsg(null);
  };

  const handleLogoutSecretary = () => {
    setIsSecretary(false);
    localStorage.removeItem('reduto_is_secretary');
  };

  // Check if current logged in publisher already has report for selectedMonth
  const getExistingReport = (pubId: string, month: string) => {
    return reports.find(r => r.publisherId === pubId && r.mesAno === month);
  };

  // Submit report (Módulo 1 + 5)
  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccessMsg(null);
    setReportErrorMsg(null);

    if (!loggedInPublisher) return;

    // Check Duplicate
    const existing = getExistingReport(loggedInPublisher.id, selectedMonth);
    if (existing) {
      setReportErrorMsg(`Seu relatório deste mês (${selectedMonth}) já foi enviado.`);
      return;
    }

    const timestamp = Date.now();
    const reportId = `${loggedInPublisher.id}_${selectedMonth}`;

    let reportPayload: FieldReport = {
      id: reportId,
      publisherId: loggedInPublisher.id,
      nome: loggedInPublisher.nome,
      tipo: loggedInPublisher.tipo,
      mesAno: selectedMonth,
      dataEnvio: timestamp
    };

    if (loggedInPublisher.tipo === 'publicador') {
      reportPayload.atividade = participated;
    } else {
      const hInt = parseInt(hours);
      const sInt = parseInt(studies);

      if (isNaN(hInt) || hInt < 0) {
        setReportErrorMsg('Por favor, digite um número válido de horas.');
        return;
      }
      if (isNaN(sInt) || sInt < 0) {
        setReportErrorMsg('Por favor, digite um número válido de estudos bíblicos.');
        return;
      }

      reportPayload.horas = hInt;
      reportPayload.estudos = sInt;
    }

    try {
      await saveFieldReportToDB(reportPayload);
      setReportSuccessMsg('Relatório enviado com sucesso.');
      // Refresh local list
      const updatedReports = [...reports];
      const existIdx = updatedReports.findIndex(r => r.id === reportId);
      if (existIdx !== -1) {
        updatedReports[existIdx] = reportPayload;
      } else {
        updatedReports.push(reportPayload);
      }
      setReports(updatedReports);

      // Clean active inputs
      setHours('');
      setStudies('');
    } catch (err) {
      setReportErrorMsg('Erro ao salvar no banco de dados. Tente novamente.');
    }
  };

  // Admin Add/Edit Publisher (Módulo 2)
  const handleOpenAddPublisher = () => {
    setEditingPublisher(null);
    setPubFormName('');
    setPubFormGender('masculino');
    setPubFormType('publicador');
    setPubFormPhone('');
    setPubFormEmail('');
    setPubFormActive(true);
    setPubFormError(null);
    setShowAddPublisherModal(true);
  };

  const handleOpenEditPublisher = (pub: Publisher) => {
    setEditingPublisher(pub);
    setPubFormName(pub.nome);
    setPubFormGender(pub.sexo);
    setPubFormType(pub.tipo);
    setPubFormPhone(pub.telefone || '');
    setPubFormEmail(pub.email || '');
    setPubFormActive(pub.ativo);
    setPubFormError(null);
    setShowAddPublisherModal(true);
  };

  const handleSavePublisher = async (e: React.FormEvent) => {
    e.preventDefault();
    setPubFormError(null);

    const nameClean = pubFormName.trim();
    if (!nameClean) {
      setPubFormError('O nome do publicador é obrigatório.');
      return;
    }

    const code = editingPublisher ? editingPublisher.codigo : generateAccessCode(publishers);
    const id = editingPublisher ? editingPublisher.id : `pub_${Date.now()}`;

    const newPub: Publisher = {
      id,
      nome: nameClean,
      sexo: pubFormGender,
      tipo: pubFormType,
      telefone: pubFormPhone.trim(),
      email: pubFormEmail.trim(),
      codigo: code,
      ativo: pubFormActive
    };

    try {
      await savePublisherToDB(newPub);
      
      // Update local state instantly
      const listCopy = [...publishers];
      const idx = listCopy.findIndex(p => p.id === id);
      if (idx !== -1) {
        listCopy[idx] = newPub;
      } else {
        listCopy.push(newPub);
      }
      setPublishers(listCopy);
      
      setShowAddPublisherModal(false);
      setEditingPublisher(null);
    } catch (err) {
      setPubFormError('Ocorreu um erro ao salvar o publicador.');
    }
  };

  const handleTogglePublisherActive = async (pub: Publisher) => {
    const updated = { ...pub, ativo: !pub.ativo };
    try {
      await savePublisherToDB(updated);
      setPublishers(publishers.map(p => p.id === pub.id ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Edit/Delete submitted reports (Módulo 5)
  const handleOpenEditReport = (rep: FieldReport) => {
    setEditingReport(rep);
    setHours(rep.horas !== undefined ? String(rep.horas) : '');
    setStudies(rep.estudos !== undefined ? String(rep.estudos) : '');
    setParticipated(rep.atividade ?? true);
  };

  const handleSaveEditedReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    let payload = { ...editingReport };

    if (editingReport.tipo === 'publicador') {
      payload.atividade = participated;
    } else {
      const hInt = parseInt(hours);
      const sInt = parseInt(studies);
      if (isNaN(hInt) || hInt < 0 || isNaN(sInt) || sInt < 0) {
        alert('Por favor digite valores numéricos válidos!');
        return;
      }
      payload.horas = hInt;
      payload.estudos = sInt;
    }

    try {
      await saveFieldReportToDB(payload);
      setReports(reports.map(r => r.id === editingReport.id ? payload : r));
      setEditingReport(null);
      setHours('');
      setStudies('');
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations for dashboard indicators & tables (Módulo 3 + Módulo 4)
  const activePublishers = publishers.filter(p => p.ativo);
  
  // Filter received reports on Secretary Panel by selected filters
  const filteredReports = reports.filter(r => {
    const matchesMonth = r.mesAno === filterMonth;
    const matchesType = filterType === 'all' || r.tipo === filterType;
    return matchesMonth && matchesType;
  });

  // Calculate stats for selected month:
  // Recebidos, Pendentes, Total
  const countTotalCount = activePublishers.length;
  // Look at unique active publishers who sent a report for selectedMonth
  const activePubsIds = activePublishers.map(p => p.id);
  const countReceivedList = reports.filter(r => r.mesAno === filterMonth && activePubsIds.includes(r.publisherId));
  const countReceivedCount = countReceivedList.length;
  const countPendingCount = Math.max(0, countTotalCount - countReceivedCount);

  // Missing brothers list (Faltantes) - Módulo 4
  const missingPublishers = activePublishers.filter(pub => {
    const hasReport = reports.some(r => r.publisherId === pub.id && r.mesAno === filterMonth);
    return !hasReport;
  });

  // Type dictionary helper for translation
  const translateType = (type: string) => {
    switch (type) {
      case 'publicador': return 'Publicador';
      case 'pioneiro_auxiliar': return 'Pioneiro Auxiliar';
      case 'pioneiro_regular': return 'Pioneiro Regular';
      default: return type;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in" id="field-reports-module-root">
      
      {/* HEADER BOARD */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#254A7E] rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#4A90E2]/25 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none blur-xl" />
        
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#BE9F67] uppercase">SERVIÇO DE CAMPO</span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#BE9F67]" />
            Relatórios de Campo
          </h2>
          <p className="text-xs text-slate-300 font-medium">Atividade ministerial da Congregação Reduto</p>
        </div>

        {/* Lock/Unlock Toggle for Administrative Secretary Access */}
        <div className="self-end sm:self-center">
          {isSecretary ? (
            <button 
              onClick={handleLogoutSecretary}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#BE9F67] hover:bg-[#d6b77c] text-[#1A365D] font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition duration-300 shadow-3xs cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              Sair da Secretaria
            </button>
          ) : (
            <button 
              onClick={() => setShowSecretaryLogin(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/10 font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition duration-300 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              Área do Secretário
            </button>
          )}
        </div>
      </div>

      {/* POPUP: Secretary Login PIN */}
      {showSecretaryLogin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" id="secretary-login-backdrop">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl relative"
          >
            <button 
              onClick={() => {
                setShowSecretaryLogin(false);
                setSecAuthError(null);
                setSecretaryPassword('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-11 h-11 bg-[#1A365D]/5 rounded-xl flex items-center justify-center border border-[#1A365D]/10 text-[#1A365D]">
                <Lock className="w-5 h-5 text-[#1A365D]" />
              </div>

              <div>
                <h3 className="font-bold text-base text-[#1A365D] font-sans">Acesso à Secretaria</h3>
                <p className="text-xs text-slate-500 mt-1">Por favor, insira o seu PIN ou código para acessar o painel administrativo.</p>
              </div>

              <form onSubmit={handleSecretaryLogin} className="w-full space-y-3.5">
                <input 
                  type="password"
                  placeholder="PIN de acesso (ex: 123456)"
                  value={secretaryPassword}
                  onChange={(e) => setSecretaryPassword(e.target.value)}
                  className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent text-[#1A365D]"
                  autoFocus
                />

                {secAuthError && (
                  <div className="flex items-center gap-1.5 text-red-500 justify-center text-[11px] font-semibold bg-red-50 p-2.5 rounded-lg border border-red-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{secAuthError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#1A365D] text-white hover:bg-[#152e52] font-semibold text-xs uppercase tracking-wider rounded-xl transition duration-300"
                >
                  Autenticar Painel
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* RENDER BODY FOR SECRETARY ADMIN MODE */}
      {isSecretary ? (
        <div className="space-y-6" id="secretary-dashboard-view">
          
          {/* SECRETARY DOUBLE HEAD BAR */}
          <div className="flex border-b border-[#E2E8F0] gap-4" id="secretary-tab-navigation">
            <button
              onClick={() => setSecActiveTab('received')}
              className={`pb-3 text-sm font-bold border-b-2 font-sans tracking-tight transition-all cursor-pointer ${
                secActiveTab === 'received'
                  ? 'border-[#1A365D] text-[#1A365D]'
                  : 'border-transparent text-[#718096] hover:text-[#2D3748]'
              }`}
            >
              📋 Relatórios Recebidos & Faltantes
            </button>
            <button
              onClick={() => setSecActiveTab('publishers')}
              className={`pb-3 text-sm font-bold border-b-2 font-sans tracking-tight transition-all cursor-pointer ${
                secActiveTab === 'publishers'
                  ? 'border-[#1A365D] text-[#1A365D]'
                  : 'border-transparent text-[#718096] hover:text-[#2D3748]'
              }`}
            >
              👥 Cadastro de Publicadores
            </button>
          </div>

          {/* LOADING STATE FOR DB */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#1A365D] rounded-full animate-spin" />
              <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Sincronizando Secretaria...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* TAB 1: RECEIVED REPS & MISSING PENDINGS */}
              {secActiveTab === 'received' && (
                <motion.div
                  key="sec-tab-received"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  
                  {/* SEARCH FILTERS SECTION */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-3xs flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1A365D] uppercase tracking-wider font-mono">
                      <Filter className="w-3.5 h-3.5" />
                      Filtros de Período
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <select 
                          value={filterMonth}
                          onChange={(e) => setFilterMonth(e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-sans text-slate-700 focus:outline-none"
                        >
                          {availableMonths.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <select 
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-sans text-slate-700 focus:outline-none"
                        >
                          <option value="all">Todos os tipos</option>
                          <option value="publicador">Publicadores</option>
                          <option value="pioneiro_auxiliar">Pioneiros Auxiliares</option>
                          <option value="pioneiro_regular">Pioneiros Regulares</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* CARDS RESUMO (Módulo 3) */}
                  <div className="grid grid-cols-3 gap-3 md:gap-6">
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-3xs hover:border-[#1A365D]/25 transition duration-300">
                      <span className="text-[#718096] font-mono block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">Total Ativos</span>
                      <strong className="text-2xl sm:text-4xl font-extrabold text-[#1A365D] block tracking-tight font-display mt-2">{countTotalCount}</strong>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-3xs transition duration-300">
                      <span className="text-emerald-700 font-mono block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">Recebidos</span>
                      <strong className="text-2xl sm:text-4xl font-extrabold text-emerald-600 block tracking-tight font-display mt-2">{countReceivedCount}</strong>
                    </div>

                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-3xs transition duration-300">
                      <span className="text-amber-800 font-mono block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">Pendentes</span>
                      <strong className="text-2xl sm:text-4xl font-extrabold text-amber-600 block tracking-tight font-display mt-2">{countPendingCount}</strong>
                    </div>
                  </div>

                  {/* SUB TABLE: REPORTS RECEIVED */}
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-3xs">
                    <div className="px-5 py-4 border-b border-[#E2E8F0] bg-slate-50/50 flex justify-between items-center">
                      <h3 className="text-xs font-black text-[#1A365D] uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <ClipboardCheck className="w-4 h-4 text-[#1A365D]" />
                        Listagem de Envios ({filteredReports.length})
                      </h3>
                      <span className="text-[10px] text-[#718096] font-semibold">{availableMonths.find(m => m.value === filterMonth)?.label}</span>
                    </div>

                    {filteredReports.length === 0 ? (
                      <div className="text-center py-12 px-4 space-y-2">
                        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-slate-500 font-semibold text-xs font-sans">Nenhum relatório recebido com estes filtros.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 font-bold text-slate-500 uppercase border-b border-[#E2E8F0] font-mono text-[9px] tracking-wider">
                              <th className="py-3 px-4">Nome</th>
                              <th className="py-3 px-4">Tipo</th>
                              <th className="py-3 px-4 text-center">Atividade / Horas</th>
                              <th className="py-3 px-4 text-center">Estudos</th>
                              <th className="py-3 px-4">Envio</th>
                              <th className="py-3 px-4 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E8F0] font-sans">
                            {filteredReports.map((rep) => (
                              <tr key={rep.id} className="hover:bg-slate-50/50 transition">
                                <td className="py-3.5 px-4 font-bold text-[#1A365D] tracking-tight">{rep.nome}</td>
                                <td className="py-3.5 px-4 text-slate-600 font-semibold">{translateType(rep.tipo)}</td>
                                <td className="py-3.5 px-4 text-center">
                                  {rep.tipo === 'publicador' ? (
                                    <span className="inline-flex items-center gap-1 bg-[#EEF2F6] font-[#1A365D] font-bold text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                                      <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                                      Ativo
                                    </span>
                                  ) : (
                                    <strong className="font-bold text-[#1A365D] text-sm">{rep.horas || 0} h</strong>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  {rep.tipo === 'publicador' ? (
                                    <span className="text-slate-400">—</span>
                                  ) : (
                                    <strong className="font-bold text-[#1A365D] text-sm">{rep.estudos || 0}</strong>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 font-mono text-[10px]">
                                  {new Date(rep.dataEnvio).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button 
                                    onClick={() => handleOpenEditReport(rep)}
                                    className="p-1 px-2.5 bg-[#1A365D]/5 hover:bg-[#1A365D]/10 text-[#1A365D] font-bold text-[10px] uppercase rounded-lg border border-[#1A365D]/10 transition cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    Editar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* POPUP: EDIT REPORT MANUALLY */}
                  {editingReport && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" id="edit-report-dialog">
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl relative"
                      >
                        <button 
                          onClick={() => setEditingReport(null)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                            <Edit3 className="w-4 h-4 text-[#1A365D]" />
                            <h3 className="font-bold text-sm text-[#1A365D] uppercase tracking-wider font-mono">Editar Relatório</h3>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-mono">Publicador:</span>
                            <strong className="block text-[#1A365D] font-bold text-sm font-sans">{editingReport.nome}</strong>
                            <span className="text-[10px] text-[#BE9F67] font-bold uppercase tracking-wider font-mono bg-[#BE9F67]/5 px-2 py-0.5 rounded-md border border-[#BE9F67]/10 inline-block mt-1">
                              {translateType(editingReport.tipo)}
                            </span>
                          </div>

                          <form onSubmit={handleSaveEditedReport} className="space-y-3 pt-2">
                            {editingReport.tipo === 'publicador' ? (
                              <label className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-3 rounded-xl cursor-copy checkbox-label">
                                <input 
                                  type="checkbox"
                                  checked={participated}
                                  onChange={(e) => setParticipated(e.target.checked)}
                                  className="w-4.5 h-4.5 accent-[#1A365D] cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-700 font-sans">
                                  Participei de alguma modalidade neste mês.
                                </span>
                              </label>
                            ) : (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider font-mono">Horas:</label>
                                  <input 
                                    type="number"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A365D] font-bold text-slate-700"
                                    min="0"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider font-mono">Estudos:</label>
                                  <input 
                                    type="number"
                                    value={studies}
                                    onChange={(e) => setStudies(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A365D] font-bold text-slate-700"
                                    min="0"
                                  />
                                </div>
                              </div>
                            )}

                            <button 
                              type="submit"
                              className="w-full mt-4 py-2.5 bg-[#1A365D] font-bold text-white text-xs uppercase tracking-wider rounded-xl transition hover:bg-[#152e52]"
                            >
                              Salvar Alterações
                            </button>
                          </form>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* SECTION: FALTANTES (Módulo 4) */}
                  <div className="bg-amber-50/15 border border-amber-200/50 rounded-2xl p-5 md:p-6 space-y-4 shadow-3xs" id="faltantes-section">
                    <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
                      <h4 className="text-xs font-black text-amber-800 tracking-wider uppercase font-mono flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        Irmãos que ainda não enviaram ({missingPublishers.length})
                      </h4>
                      <span className="text-[10px] text-amber-700 font-bold font-mono">Faltando relatar</span>
                    </div>

                    {missingPublishers.length === 0 ? (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs font-bold font-sans">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        Cem por cento de envios! Todos os publicadores ativos enviaram seus relatórios para este mês.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {missingPublishers.map((pub) => (
                          <div 
                            key={pub.id} 
                            className="bg-white border border-slate-200/60 rounded-xl p-3.5 space-y-2 flex flex-col justify-between hover:border-amber-300 transition-all duration-300 shadow-3xs"
                          >
                            <div>
                              <strong className="text-slate-800 font-bold text-xs block font-sans truncate">{pub.nome}</strong>
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider mt-0.5 inline-block px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-500">
                                {translateType(pub.tipo)}
                              </span>
                            </div>

                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
                              {/* Discrete communication shortcuts */}
                              {pub.telefone ? (
                                <a 
                                  href={`https://wa.me/${pub.telefone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg transition"
                                  title="Enviar lembrete WhatsApp"
                                >
                                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                  WhatsApp
                                </a>
                              ) : (
                                <span className="text-[9px] text-slate-400 italic">Sem Tel</span>
                              )}

                              {pub.email && (
                                <a 
                                  href={`mailto:${pub.email}?subject=Relatório de Atividade de Campo`}
                                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                                  title="Enviar Email de lembrete"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </motion.div>
              )}

              {/* TAB 2: PUBLISHER DIRECTORY (Módulo 2) */}
              {secActiveTab === 'publishers' && (
                <motion.div
                  key="sec-tab-publishers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* DIRECTORY CONTROL HEADER BAR */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-[#E2E8F0] shadow-3xs">
                    
                    {/* SEARCH INPUT */}
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input 
                        type="text"
                        placeholder="Buscar publicador por nome..."
                        value={publisherSearch}
                        onChange={(e) => setPublisherSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1A365D] focus:bg-white text-slate-700"
                      />
                    </div>

                    {/* ADD NEW BUTTON */}
                    <button 
                      onClick={handleOpenAddPublisher}
                      className="px-4 py-2.5 bg-[#1A365D] hover:bg-[#152e52] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-300 flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer align-middle self-stretch sm:self-auto"
                    >
                      <Plus className="w-4 h-4 text-white" />
                      Novo Publicador
                    </button>
                  </div>

                  {/* DIRECTORY LISTING MAP */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                    {publishers.length === 0 ? (
                      <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-8 bg-white border border-[#E2E8F0] rounded-2xl text-center shadow-3xs" id="publishers-empty-state-card">
                        <Users2 className="w-12 h-12 text-[#1A365D]/20 mb-3" />
                        <h4 className="text-sm font-bold text-[#1A365D] font-sans">Nenhum Publicador Cadastrado</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                          Cadastre os membros da congregação clicando no botão <strong>"Novo Publicador"</strong> acima para poder gerenciar as designações de relatórios.
                        </p>
                      </div>
                    ) : (
                      publishers
                        .filter(pub => pub.nome.toLowerCase().includes(publisherSearch.toLowerCase()))
                        .map((pub) => (
                        <div 
                          key={pub.id} 
                          className={`bg-white border rounded-2xl p-5 space-y-4 hover:shadow-2xs transition duration-300 relative overflow-hidden ${
                            !pub.ativo ? 'border-[#E2E8F0] opacity-60 bg-[#F7F9FC]/50' : 'border-[#E2E8F0]'
                          }`}
                        >
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <strong className="text-sm font-black text-[#1A365D] tracking-tight block font-sans">{pub.nome}</strong>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-500">
                                  {translateType(pub.tipo)}
                                </span>
                                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  pub.sexo === 'masculino' 
                                    ? 'bg-blue-50 border border-blue-100 text-blue-600' 
                                    : 'bg-rose-50 border border-rose-100 text-rose-600'
                                }`}>
                                  {pub.sexo === 'masculino' ? 'Masc' : 'Fem'}
                                </span>
                              </div>
                            </div>

                            {/* Access code badge */}
                            <div className="bg-[#BE9F67]/10 text-[#BE9F67] border border-[#BE9F67]/20 px-3 py-1 bg-emerald border-dashed rounded-xl font-mono text-xs font-bold select-all cursor-all block">
                              Cód: {pub.codigo}
                            </div>
                          </div>

                          {/* Contact attributes */}
                          <div className="text-[11px] space-y-1 pt-2 border-t border-slate-100 text-slate-500 font-sans">
                            {pub.telefone ? (
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <span>{pub.telefone}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 italic text-slate-400">
                                <Phone className="w-3.5 h-3.5 text-slate-300" />
                                <span>Telefone não cadastrado</span>
                              </div>
                            )}

                            {pub.email ? (
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                <span className="truncate">{pub.email}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 italic text-slate-400">
                                <Mail className="w-3.5 h-3.5 text-slate-300" />
                                <span>Email não cadastrado</span>
                              </div>
                            )}
                          </div>

                          {/* Footer Action items */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                            {/* Deactivate switch / Toggle active */}
                            <button 
                              onClick={() => handleTogglePublisherActive(pub)}
                              className={`px-2.5 py-1.5 font-bold text-[10px] uppercase rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                                pub.ativo 
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' 
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {pub.ativo ? (
                                <>
                                  <UserMinus className="w-3 h-3" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3 h-3" />
                                  Ativar
                                </>
                              )}
                            </button>

                            {/* Edit publisher button */}
                            <button 
                              onClick={() => handleOpenEditPublisher(pub)}
                              className="px-2.5 py-1.5 text-[10px] font-bold uppercase rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                              Editar Dados
                            </button>
                          </div>
                        </div>
                      )))}
                  </div>

                  {/* MODAL: ADD / EDIT PUBLISHER (Módulo 2) */}
                  {showAddPublisherModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" id="add-publisher-dialog-box">
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl relative"
                      >
                        <button 
                          onClick={() => setShowAddPublisherModal(false)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-slate-150 pb-2.5">
                            <Users2 className="w-4.5 h-4.5 text-[#1A365D]" />
                            <h3 className="font-bold text-sm text-[#1A365D] uppercase tracking-wider font-mono">
                              {editingPublisher ? 'Editar Cadastro' : 'Novo Publicador'}
                            </h3>
                          </div>

                          <form onSubmit={handleSavePublisher} className="space-y-3.5 font-sans text-xs">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider font-mono">Nome:</label>
                              <input 
                                type="text"
                                placeholder="Nome completo do irmão"
                                value={pubFormName}
                                onChange={(e) => setPubFormName(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A365D]"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3.5">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider font-mono">Sexo:</label>
                                <select 
                                  value={pubFormGender}
                                  onChange={(e) => setPubFormGender(e.target.value as any)}
                                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A365D] font-medium"
                                >
                                  <option value="masculino">Masculino</option>
                                  <option value="feminino">Feminino</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider font-mono">Tipo:</label>
                                <select 
                                  value={pubFormType}
                                  onChange={(e) => setPubFormType(e.target.value as any)}
                                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A365D] font-medium"
                                >
                                  <option value="publicador">Publicador</option>
                                  <option value="pioneiro_auxiliar">Pioneiro Auxiliar</option>
                                  <option value="pioneiro_regular">Pioneiro Regular</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider font-mono">Telefone (opcional):</label>
                              <input 
                                type="text"
                                placeholder="(81) 98888-7711"
                                value={pubFormPhone}
                                onChange={(e) => setPubFormPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A365D]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider font-mono">Email (opcional):</label>
                              <input 
                                type="email"
                                placeholder="exemplo@reduto.org"
                                value={pubFormEmail}
                                onChange={(e) => setPubFormEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A365D]"
                              />
                            </div>

                            {editingPublisher && (
                              <label className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-3 rounded-xl cursor-copy mt-2">
                                <input 
                                  type="checkbox"
                                  checked={pubFormActive}
                                  onChange={(e) => setPubFormActive(e.target.checked)}
                                  className="w-4.5 h-4.5 accent-[#1A365D] cursor-pointer"
                                />
                                <span className="font-bold text-slate-700">Seu status está ativo na Congregação</span>
                              </label>
                            )}

                            {pubFormError && (
                              <div className="flex items-center gap-1.5 text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-150 font-semibold text-[11px]">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{pubFormError}</span>
                              </div>
                            )}

                            <div className="pt-2">
                              <button 
                                type="submit"
                                className="w-full py-3 bg-[#1A365D] text-white hover:bg-[#152e52] font-semibold uppercase tracking-wider rounded-xl transition duration-300"
                              >
                                {editingPublisher ? 'Salvar Edição' : 'Cadastrar Publicador'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    </div>
                  )}

                </motion.div>
              )}

            </AnimatePresence>
          )}

        </div>
      ) : (
        
        /* OTHERWISE: PUBLISHER PERSONAL REPORT AREA */
        <div id="publisher-report-lobby-view" className="bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-xs">
          {loggedInPublisher ? (
            
            /* PUBLISHER VIEW: ALREADY IDENTIFIED (Módulo 1) */
            <div className="space-y-6" id="identified-publisher-form-container">
              
              {/* Publisher Badge Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#BE9F67] tracking-widest block bg-[#BE9F67]/5 py-0.5 px-2 rounded-md border border-[#BE9F67]/15 inline-block">
                    {translateType(loggedInPublisher.tipo)}
                  </span>
                  
                  <strong className="block text-lg font-black text-[#1A365D] font-sans tracking-tight pt-1">
                    Olá, {loggedInPublisher.nome}!
                  </strong>
                  
                  <p className="text-slate-500 text-xs">
                    Código de acesso: <span className="font-mono font-bold tracking-wider">{loggedInPublisher.codigo}</span>
                  </p>
                </div>

                {/* Quit / Switch Account */}
                <button 
                  onClick={handleLogoutPublisher}
                  className="font-semibold text-[10px] uppercase tracking-wider text-[#718096] hover:text-[#1A365D] px-3 py-1.5 border border-slate-200 hover:border-slate-350 bg-slate-50 rounded-xl transition cursor-pointer self-start sm:self-center inline-flex items-center gap-1.5 flex-none"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Trocar de Código
                </button>
              </div>

              {/* REPORT INPUT SHEETS METADATA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Form column */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-xs font-black uppercase text-[#1A365D] tracking-wider font-mono flex items-center gap-1.5 pb-1 block border-b border-slate-100">
                    <Calendar className="w-4 h-4 text-[#1A365D]" />
                    Enviar Atividade do Mês
                  </h3>

                  <form onSubmit={handleSendReport} className="space-y-4">
                    
                    {/* Month selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-[#1A365D] uppercase tracking-wider font-mono">Selecione o Mês Relatório:</label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => {
                          setSelectedMonth(e.target.value);
                          setReportSuccessMsg(null);
                          setReportErrorMsg(null);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-330 rounded-xl text-xs font-bold font-sans text-slate-700 focus:outline-none"
                      >
                        {availableMonths.map((m) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Check if already sent for this month */}
                    {getExistingReport(loggedInPublisher.id, selectedMonth) ? (
                      
                      <div className="bg-amber-50/45 border border-amber-200 rounded-2xl p-4.5 flex items-start gap-3 shadow-3xs" id="already-sent-banner">
                        <CheckCircle2 className="w-5.5 h-5.5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <strong className="text-amber-800 text-xs font-bold font-sans">Seu relatório deste mês já foi enviado.</strong>
                          <p className="text-amber-700/80 text-[10px] leading-normal font-medium">
                            Não é permitido fazer reenvios. Caso precise corrigir algum dado (como horas ou estudos), fale diretamente com o secretário da Congregação para que ele altere no painel.
                          </p>
                        </div>
                      </div>

                    ) : (

                      /* OTHERWISE: ALLOW SENDING */
                      <div className="space-y-4 bg-slate-50/50 rounded-2xl p-5 border border-[#E2E8F0]" id="input-report-fields-wrapper">
                        
                        {loggedInPublisher.tipo === 'publicador' ? (
                          
                          // Type 1: Publicador simple checkbox
                          <label className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-xl cursor-copy shadow-3xs hover:border-[#1A365D]/30 transition checkbox-label">
                            <input 
                              type="checkbox"
                              checked={participated}
                              onChange={(e) => setParticipated(e.target.checked)}
                              className="w-5.5 h-5.5 accent-[#1A365D] cursor-pointer mt-0.5 shrink-0"
                            />
                            <div className="space-y-1">
                              <strong className="text-xs font-bold text-[#1A365D] font-sans">
                                Participei de alguma modalidade do ministério neste mês.
                              </strong>
                              <p className="text-[10.5px] text-slate-500 leading-normal">
                                Marque este campo se você participou na pregação, no testemunho público ou informal, ou em qualquer outra via de ministério voluntário neste mês.
                              </p>
                            </div>
                          </label>

                        ) : (

                          // Type 2 & 3: Pioneer Hours & Bible Studies input (Módulo 1)
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-extrabold text-[#1A365D] uppercase tracking-wider font-mono">Horas no Campo:</label>
                                <input 
                                  type="number"
                                  placeholder="Ex: 50"
                                  value={hours}
                                  onChange={(e) => setHours(e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#1A365D] text-slate-700 shadow-3xs"
                                  required
                                  min="0"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-extrabold text-[#1A365D] uppercase tracking-wider font-mono">Estudos Bíblicos dirigidos:</label>
                                <input 
                                  type="number"
                                  placeholder="Ex: 2"
                                  value={studies}
                                  onChange={(e) => setStudies(e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#1A365D] text-slate-700 shadow-3xs"
                                  required
                                  min="0"
                                />
                              </div>
                            </div>
                          </div>

                        )}

                        {/* Submit Button (Módulo 1) */}
                        <div className="pt-2">
                          <button 
                            type="submit"
                            className="w-full py-3 bg-[#1A365D] hover:bg-[#152e52] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-300 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer align-middle"
                          >
                            Enviar Relatório de Campo
                          </button>
                        </div>
                      </div>

                    )}

                    {/* Elegant Success Feedbacks (Módulo 5) */}
                    {reportSuccessMsg && (
                      <div className="flex items-start gap-2.5 text-emerald-700 bg-emerald-50 border border-emerald-150 p-4.5 rounded-2xl shadow-3xs">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <strong className="text-emerald-800 text-xs font-sans font-bold">{reportSuccessMsg}</strong>
                          <p className="text-emerald-700/80 text-[10.5px] leading-relaxed">
                            Seu relatório foi registrado na secretaria e já está somado nas estatísticas mensais consolidadas da congregação. Muito obrigado pelo seu empenho!
                          </p>
                        </div>
                      </div>
                    )}

                    {reportErrorMsg && (
                      <div className="flex items-start gap-2.5 text-red-700 bg-red-50 border border-red-150 p-4.5 rounded-2xl shadow-3xs font-semibold text-xs leading-normal">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span>{reportErrorMsg}</span>
                      </div>
                    )}

                  </form>
                </div>

                {/* Right metadata / Help column */}
                <div className="bg-[#F7F9FC] rounded-2xl p-5 border border-slate-200/50 flex flex-col justify-between space-y-4 text-xs font-sans">
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-[#1A365D] uppercase text-[10px] tracking-wider font-mono pb-2 border-b border-slate-200 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Lembretes Úteis
                    </h4>
                    <p className="leading-relaxed text-slate-600">
                      Irmãos, procurem enviar seu relatório pontualmente até o <strong>último dia do mês</strong> ou, no máximo, até o dia <strong>5 do mês seguinte</strong>.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Caso tenha esquecido de relatar algum mês anterior, sinta-se à vontade de alterar a caixa de seleção para o respectivo mês e realizar o envio retroativo.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#BE9F67] animate-pulse shrink-0" />
                    <span className="text-[10px] text-slate-500 font-bold">Conselho de Anciãos Reduto</span>
                  </div>
                </div>

              </div>

            </div>
          ) : publishers.length === 0 ? (
            /* PUBLISHER VIEW: WARNING WHEN NO PUBLISHERS */
            <div className="max-w-md mx-auto py-8 text-center space-y-6" id="publisher-empty-warning">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200 text-amber-600 mx-auto shadow-3xs">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-[#1A365D] tracking-tight font-sans">Sem Publicadores Cadastrados</h3>
                <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto">
                  Não há publicadores cadastrados no banco de dados Firebase para a congregação Reduto.
                </p>
                <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto">
                  O secretário precisa acessar a <strong>Área do Secretário</strong> (no botão acima) e cadastrar os publicadores para que eles possam enviar seus relatórios.
                </p>
              </div>
            </div>
          ) : (
            
            /* PUBLISHER VIEW: ENTER 6-DIGIT CODE TO LOGIN */
            <div className="max-w-md mx-auto py-8 text-center space-y-6" id="publisher-code-login-gate">
              <div className="w-14 h-14 bg-[#1A365D]/5 rounded-2xl flex items-center justify-center border border-[#1A365D]/10 text-[#1A365D] mx-auto shadow-3xs">
                <FileText className="w-6 h-6 text-[#1A365D]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-[#1A365D] tracking-tight font-sans">Acesse o seu Relatório</h3>
                <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto">
                  Insira o seu código pessoal de 6 dígitos que foi fornecido pelo secretário para acessar o seu formulário de atividade de campo.
                </p>
              </div>

              <form onSubmit={handlePublisherLogin} className="space-y-4 max-w-sm mx-auto">
                <input 
                  type="text"
                  placeholder="Código de 6 dígitos (ex: 123456)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  maxLength={6}
                  className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-black tracking-widest text-base focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent text-[#1A365D]"
                />

                {authError && (
                  <div className="flex items-center gap-1.5 text-red-500 justify-center text-xs font-bold font-sans bg-red-50 p-3 rounded-xl border border-red-150">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#1A365D] text-white hover:bg-[#152e52] font-semibold text-xs uppercase tracking-wider rounded-xl transition duration-300"
                >
                  Entrar e Relatar
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-sans">
                Esqueceu seu código de acesso? Peça ajuda ao secretário do Reduto.
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
