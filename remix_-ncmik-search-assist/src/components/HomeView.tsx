/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Sparkles, Network, BarChart3, BookOpen, Database, Archive, FileEdit, ArrowRight, TrendingUp, HelpCircle, Laptop, Landmark, ClipboardList, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { KEYWORD_CLUSTERS_MAP } from '../data';

interface HomeViewProps {
  onSearch: (query: string) => void;
  openTrendingWord: (word: string) => void;
  onOpenDashboard: () => void;
  onOpenVisualization: () => void;
}

export default function HomeView({
  onSearch,
  openTrendingWord,
  onOpenDashboard,
  onOpenVisualization,
}: HomeViewProps) {
  const [localQuery, setLocalQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDb, setSelectedDb] = useState('통합검색');
  const [showDbDropdown, setShowDbDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery);
    } else {
      onSearch('정밀 의료 인공지능 윤리 가이드라인'); // Default to screenshot values
    }
  };

  const dbOptions = ['통합검색', 'PubMed Central', 'NTIS (국가과학기술)', 'E-Journals'];

  const trendingKeywords = [
    { rank: 1, text: "COVID-19 변이 추적 연구", tag: "NEW", count: "890회" },
    { rank: 2, text: "유전자 가위 기술 동향", tag: "HOT", count: "612회" },
    { rank: 3, text: "디지털 헬스케어 AI 윤리", tag: "", count: "340회" },
    { rank: 4, text: "희귀질환 치료제 임상 데이터", tag: "", count: "285회" }
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] pb-20 bg-[#F9F9F9]">
      
      {/* Hero Search Section */}
      <section className="relative pt-16 pb-24 px-6 md:px-10 bg-white border-b border-slate-100 overflow-hidden">
        {/* Soft Mesh Gradient background indicating intelligence */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-ai-accent/5 via-clinical-blue/5 to-transparent rounded-full filter blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-10 w-[300px] h-[300px] bg-gradient-to-tr from-academic-purple/5 to-transparent rounded-full filter blur-2xl pointer-events-none -z-10" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-clinical-blue font-bold tracking-widest text-[13px] uppercase mb-3 flex items-center justify-center gap-1.5"
          >
            <Landmark className="w-3.5 h-3.5" />
            대한민국 국립의학도서관
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-research-navy mb-10 tracking-tight leading-tight"
          >
            국립의과학지식센터 <span className="bg-gradient-to-r from-academic-purple to-clinical-blue bg-clip-text text-transparent">AI 지식 플랫폼</span>
          </motion.h1>

          {/* Search Console */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-6"
          >
            <form 
              onSubmit={handleSearchSubmit}
              className={`flex items-center gap-2 p-2 bg-white/95 rounded-full border transition-all duration-300 shadow-lg ${
                isFocused 
                  ? 'border-clinical-blue shadow-clinical-blue/10 ring-4 ring-clinical-blue/5' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowDbDropdown(!showDbDropdown)}
                  className="flex items-center gap-1.5 pl-5 pr-3 py-2 text-research-navy font-semibold border-r border-slate-200 hover:text-clinical-blue transition-colors text-xs whitespace-nowrap"
                >
                  <span>{selectedDb}</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>

                {showDbDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1">
                    {dbOptions.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setSelectedDb(opt);
                          setShowDbDropdown(false);
                        }}
                        className={`px-4 py-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs text-left text-slate-700 font-medium ${
                          selectedDb === opt ? 'bg-slate-50 text-clinical-blue font-bold' : ''
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-4 text-slate-800 text-sm md:text-base font-normal placeholder:text-slate-400"
                type="text"
                value={localQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="검색어를 입력하여 주십시오. (예: 당뇨병, 줄기세포 연구, 코로나, CRISPR)"
              />

              <button 
                type="submit" 
                className="bg-research-navy text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:bg-clinical-blue hover:scale-105 active:scale-95 transition-all shadow-md group shrink-0"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-6 transition-transform" />
              </button>
            </form>

            <div className="flex justify-center gap-6 mt-5 text-xs text-slate-500 font-medium">
              <button 
                type="button" 
                onClick={() => onSearch('의료용 인공지능 신뢰성 확보를 위한 가이드라인 개발 연구')}
                className="flex items-center gap-1.5 hover:text-clinical-blue transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                상세검색 도움받기
              </button>
              <div className="w-px h-3 bg-slate-200"></div>
              <button 
                type="button" 
                onClick={() => onSearch('도움말')}
                className="flex items-center gap-1.5 hover:text-clinical-blue transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                도움말 가이드
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-8 mt-12">
        
        {/* Left Side: Bento Grid and quick indexes */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-research-navy mb-6 flex items-center gap-2">
            <span className="w-2.5 h-5 bg-clinical-blue rounded-full"></span>
            주요 연구 서비스
          </h2>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
            
            {/* AI Advisor Card (taking 8 columns on md) */}
            <div className="md:col-span-8 bg-white rounded-2xl p-6 md:p-8 flex flex-col border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
              {/* Abs decoration */}
              <div className="absolute top-0 right-0 p-8 text-academic-purple/5 opacity-40 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                <Sparkles className="w-36 h-36 stroke-[0.5]" />
              </div>

              <div className="mt-4 md:mt-8 z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-academic-purple/10 text-academic-purple text-[11px] font-bold mb-4">
                  <span className="w-1.5 h-1.5 bg-academic-purple rounded-full animate-pulse"></span>
                  NEW AI BETA
                </span>
                <h3 className="text-2xl font-bold text-research-navy mb-2 group-hover:text-clinical-blue transition-colors">
                  AI 에이전트 리서치
                </h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
                  수백만 건의 고품질 의료 및 생명공학 학술 데이터를 기반으로 유용한 임상 연구 핵심 요약과 사후 분쟁 책임 가이드 통찰을 인체해 제공합니다.
                </p>
                <button 
                  onClick={() => onSearch('정밀 의료 인공지능 윤리 가이드라인')}
                  className="flex items-center gap-2 bg-research-navy text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-clinical-blue/90 hover:gap-3 transition-all"
                >
                  시작하기
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contextual Analysis (taking 4 columns) */}
            <div 
              onClick={() => onSearch('가이드라인')}
              className="md:col-span-4 bg-primary-container text-white rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:bg-[#003875] transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
            >
              {/* Background trace */}
              <div className="absolute -bottom-6 -right-6 text-white/5 group-hover:text-white/10 transition-colors">
                <Network className="w-32 h-32" />
              </div>

              <div>
                <span className="bg-white/10 border border-white/20 text-[11px] px-2 py-0.5 rounded-md font-semibold text-slate-200">
                  인용 그래프
                </span>
                <h4 className="text-lg font-bold mt-3 mb-1.5">문맥 기반 인용 분석</h4>
                <p className="text-white/70 text-xs leading-relaxed">
                  개별 논문 및 가이드라인 간의 상호 인용, 보완관계를 한눈에 그래프로 자동 매핑합니다.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-white/80 font-bold mt-6">
                <span>자세히 보기</span>
                <Network className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Data Visualization (taking 12 columns in total, but can shrink or remain secondary row) */}
            <div className="md:col-span-12 bg-white rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all duration-300">
              <div>
                <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider mb-2 inline-block">
                  트렌드 차트
                </span>
                <h4 className="text-lg font-bold text-research-navy mb-1">국가 의료인공지능 연구 트렌드 시각화</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  최근 5년간 보건복지부 및 해외 PMC 등 등재 건 유전학 결합 인공지능 연구 트렌드를 시각화 차트로 점검해보세요.
                </p>
              </div>
              <button 
                onClick={onOpenVisualization}
                className="flex items-center gap-1.5 border border-clinical-blue text-clinical-blue bg-white hover:bg-clinical-blue/5 transition-all text-xs font-bold px-4 py-2 rounded-lg"
              >
                도구 열기
                <BarChart3 className="w-4 h-4 text-clinical-blue" />
              </button>
            </div>

          </div>

          {/* Quick Academic Indexes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              onClick={() => onSearch('E-Journals')}
              className="p-5 bg-white border border-slate-200 rounded-xl hover:border-clinical-blue/40 transition-all hover:bg-slate-50/50 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-clinical-blue/10 flex items-center justify-center transition-colors mb-3">
                <BookOpen className="w-5 h-5 text-clinical-blue" />
              </div>
              <h5 className="font-bold text-sm text-research-navy mb-0.5">E-Journals</h5>
              <p className="text-[11px] text-slate-400">전자 학술지 통합 연동</p>
            </div>

            <div 
              onClick={() => onSearch('NTIS DB')}
              className="p-5 bg-white border border-slate-200 rounded-xl hover:border-clinical-blue/40 transition-all hover:bg-slate-50/50 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-clinical-blue/10 flex items-center justify-center transition-colors mb-3">
                <Database className="w-5 h-5 text-clinical-blue" />
              </div>
              <h5 className="font-bold text-sm text-research-navy mb-0.5">NTIS DB</h5>
              <p className="text-[11px] text-slate-400">국가과학기술 인덱스</p>
            </div>

            <div 
              onClick={() => onSearch('Osong PHRP')}
              className="p-5 bg-white border border-slate-200 rounded-xl hover:border-clinical-blue/40 transition-all hover:bg-slate-50/50 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-clinical-blue/10 flex items-center justify-center transition-colors mb-3">
                <Archive className="w-5 h-5 text-clinical-blue" />
              </div>
              <h5 className="font-bold text-sm text-research-navy mb-0.5">Osong PHRP</h5>
              <p className="text-[11px] text-slate-400">질병청 발간 공식 학술지</p>
            </div>

            <div 
              onClick={() => onSearch('자료 신청')}
              className="p-5 bg-white border border-slate-200 rounded-xl hover:border-clinical-blue/40 transition-all hover:bg-slate-50/50 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-clinical-blue/10 flex items-center justify-center transition-colors mb-3">
                <FileEdit className="w-5 h-5 text-clinical-blue" />
              </div>
              <h5 className="font-bold text-sm text-research-navy mb-0.5">자료 신청</h5>
              <p className="text-[11px] text-slate-400">학위 희망 및 원문 복사</p>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar Insights */}
        <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
          
          {/* Researcher Profile State Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <img 
                className="w-12 h-12 rounded-full object-cover border-2 border-clinical-blue/10"
                alt="김연구 위원"
                referrerPolicy="no-referrer"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
              />
              <div>
                <h4 className="font-bold text-md text-research-navy">홍길동 연구원님</h4>
                <p className="text-[11px] text-slate-400">질병관리청 국립보건연구원</p>
              </div>
            </div>

            {/* Gauge utilize bar */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">금월 지식요약 이용 현황</span>
                <span className="text-research-navy">42건 / 60건</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-clinical-blue to-academic-purple rounded-full"
                  style={{ width: '70%' }}
                />
              </div>
            </div>

            <button 
              onClick={onOpenDashboard}
              className="w-full py-2.5 bg-gradient-to-r from-clinical-blue to-[#1e74d1] hover:opacity-95 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              나의 연구 대시보드
            </button>
          </div>

          {/* Hot Trending Keywords */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <h4 className="font-bold text-research-navy mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-4 h-4 text-academic-purple" />
              인기 연구 키워드
            </h4>
            <div className="space-y-3.5">
              {trendingKeywords.map((item) => (
                <div 
                  key={item.rank}
                  onClick={() => openTrendingWord(item.text)}
                  className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-1 rounded-md transition-colors"
                >
                  <span className="text-academic-purple font-extrabold text-sm w-4 text-center">
                    {item.rank}
                  </span>
                  <span className="flex-1 text-xs text-slate-700 font-medium group-hover:text-clinical-blue transition-colors truncate">
                    {item.text}
                  </span>
                  {item.tag && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                      item.tag === 'NEW' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {item.tag}
                    </span>
                  )}
                  {!item.tag && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={() => onSearch('윤리')}
              className="w-full mt-5 text-center text-[11px] font-bold text-slate-400 hover:text-research-navy transition-colors flex items-center justify-center gap-1"
            >
              키워드 더보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Promotional Card */}
          <div 
            onClick={() => onSearch('정밀 의료 인공지능 윤리 가이드라인')}
            className="rounded-2xl overflow-hidden relative group cursor-pointer shadow-md bg-research-navy h-44 text-white hover:shadow-lg transition-all duration-300"
          >
            {/* Background pattern mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-research-navy via-research-navy/40 to-transparent z-10" />
            <img 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              alt="Medical research research"
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=300&auto=format&fit=crop"
            />
            
            <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex flex-col justify-end">
              <span className="text-[10px] bg-clinical-blue font-bold tracking-widest px-2 py-0.5 rounded w-fit mb-1">
                NCMIK AI Summarizer
              </span>
              <h5 className="font-bold text-sm text-white mb-0.5 flex items-center gap-1">
                논문 100편도 1분 만에 요약받기
              </h5>
              <p className="text-[10px] text-slate-300">
                Gemma 4.0 알고리즘을 연동한 단기 특질 분석
              </p>
            </div>
          </div>

        </aside>
      </div>

    </div>
  );
}
