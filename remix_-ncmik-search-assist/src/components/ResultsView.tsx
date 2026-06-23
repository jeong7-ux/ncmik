/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, RotateCcw, Share2, ArrowDownToLine, SortAsc, 
  Bookmark, FileText, FolderOpen, ChevronLeft, ChevronRight, 
  Info, Send, AlertTriangle, SendHorizontal, CheckSquare, Square, Check
} from 'lucide-react';
import { Paper, ChatMessage, FilterState } from '../types';
import { KEYWORD_CLUSTERS_MAP, CHAT_RESPONSE_DATABASE, RECOMMENDED_BOOKS } from '../data';

interface ResultsViewProps {
  papers: Paper[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onOpenPaper: (paper: Paper) => void;
  onOpenAiSummary: (paper: Paper) => void;
  savedPaperIds: string[];
  toggleSavePaper: (id: string) => void;
}

export default function ResultsView({
  papers,
  searchQuery = '정밀 의료 인공지능 윤리 가이드라인',
  onSearch,
  onOpenPaper,
  onOpenAiSummary,
  savedPaperIds,
  toggleSavePaper,
}: ResultsViewProps) {
  
  // Filter States
  const [dbFilters, setDbFilters] = useState({
    ncmik: true,
    pubmed: true,
    kmbase: false,
  });
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>(['report', 'paper', 'guideline', 'dataset']);
  const [sortOrder, setSortOrder] = useState<'accuracy' | 'views' | 'citations'>('accuracy');

  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      sender: "assistant",
      text: "안녕하세요! 김연구 위원님. 국립의과학지식센터 검색 비서입니다. 검색하신 '정밀 의료 인공지능 윤리 가이드라인' 영역의 최신 법규와 논문 요약을 도와드릴 수 있습니다.",
      timestamp: "오후 4:42",
      isAiSparkle: true
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered papers logical calculations
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);

  useEffect(() => {
    // Determine papers matching keyword
    const key = searchQuery.toLowerCase();
    let result = papers.filter(p => {
      // Basic text search matching
      const matchesText = 
        p.title.toLowerCase().includes(key) ||
        p.authors.toLowerCase().includes(key) ||
        p.abstract.toLowerCase().includes(key) ||
        p.institution.toLowerCase().includes(key);
      
      // Match Doc Type
      const matchesType = selectedDocTypes.includes(p.type);

      // Match Year
      const matchesYear = p.year <= selectedYear;

      return matchesText && matchesType && matchesYear;
    });

    // If query is broad like "E-Journals", "NTIS DB", or empty, provide standard list
    if (result.length === 0 && (key === '' || key === 'all' || key === '통합검색' || key === 'resources')) {
      result = papers;
    } else if (result.length === 0) {
      // Fallback: list papers containing any segment
      result = papers.filter(p => {
        const words = key.split(' ').filter(w => w.length > 1);
        if (words.length === 0) return true;
        return words.some(w => p.title.toLowerCase().includes(w) || p.abstract.toLowerCase().includes(w));
      });
    }

    // Default sorting
    if (sortOrder === 'accuracy') {
      // Keep "의료용 인공지능 신뢰성" first for "정밀 의료" or "윤리" keyword
      result.sort((a, b) => {
        if (key.includes('윤리') || key.includes('정밀')) {
          if (a.id === 'p1') return -1;
          if (b.id === 'p1') return 1;
        }
        return b.views - a.views;
      });
    } else if (sortOrder === 'views') {
      result.sort((a, b) => b.views - a.views);
    } else if (sortOrder === 'citations') {
      result.sort((a, b) => b.citations - a.citations);
    }

    setFilteredPapers(result);
    setCurrentPage(1); // Reset page on filter/search change
  }, [papers, searchQuery, selectedDocTypes, selectedYear, sortOrder]);

  // Scroll chat window to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle document type toggle chip
  const toggleDocType = (type: string) => {
    if (selectedDocTypes.includes(type)) {
      if (selectedDocTypes.length > 1) {
        setSelectedDocTypes(selectedDocTypes.filter(t => t !== type));
      }
    } else {
      setSelectedDocTypes([...selectedDocTypes, type]);
    }
  };

  // Static citations mapper matching Screenshot 2
  const getAiSummaryBox = () => {
    const isGuidelineSearch = searchQuery.includes('윤리') || searchQuery.includes('가이드라인') || searchQuery.includes('정밀');
    
    if (isGuidelineSearch) {
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-ai-accent/5 to-transparent rounded-full filter blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ai-accent fill-ai-accent/20" />
              <h2 className="text-lg font-bold text-research-navy flex items-center gap-1.5">
                AI 검색 요약
                <span className="text-[11px] font-bold bg-ai-accent/10 text-ai-accent px-2 py-0.5 rounded-full">Gemma 4.0</span>
              </h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => alert("AI 요약을 다시 생성합니다. (Gemma 4.0 최적 채널)")}
                className="p-1 px-1.5 text-slate-400 hover:text-research-navy hover:bg-slate-50 rounded transition-colors" title="요약 갱신"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => alert("요약 링크 정보 복사 완료! (프로토타입)")}
                className="p-1 px-1.5 text-slate-400 hover:text-research-navy hover:bg-slate-50 rounded transition-colors" title="요약 공유"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
            <p>
              한국의 <span className="font-bold text-slate-900 border-b-2 border-academic-purple/20 pb-0.5">정밀 의료 인공지능 윤리 가이드라인</span>은 보건복지부와 국가생명윤리심의위원회를 중심으로 수립되었습니다. 주요 핵심 원칙은 <strong className="text-research-navy">인간 존엄성 존중</strong>, <strong className="text-research-navy">데이터 주권 보장</strong>, <strong className="text-research-navy">알고리즘의 투명성 및 설명 가능성</strong>입니다.
              <span className="text-clinical-blue font-bold ml-1 cursor-pointer hover:underline" onClick={() => handleScrollerToPaper('p1')}>[1, 3]</span>
            </p>
            <p>
              최근 개정안 및 보고서 검토에 따르면 의료 현장에서의 AI 의사결정에 대한 책임 소재 명확화와 개인정보 비식별화(동적 동의권) 기술 적용 범위에 대한 구체적인 권고사항이 추가되었습니다.
              <span className="text-clinical-blue font-bold ml-1 cursor-pointer hover:underline" onClick={() => handleScrollerToPaper('p2')}>[4, 5]</span>
            </p>

            {/* Citations chips */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 text-xs">
              <span 
                onClick={() => handleScrollerToPaper('p1')}
                className="text-[11px] font-semibold px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded cursor-pointer transition-colors"
              >
                <span className="text-clinical-blue font-bold mr-1">[1]</span> 보건복지부 (2023) • 의료 신뢰성 가이드
              </span>
              <span 
                onClick={() => handleScrollerToPaper('p2')}
                className="text-[11px] font-semibold px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded cursor-pointer transition-colors"
              >
                <span className="text-clinical-blue font-bold mr-1">[3]</span> 국가연구윤리 가이드 (2022) • 판례 분석
              </span>
              <span 
                onClick={() => handleScrollerToPaper('p4')}
                className="text-[11px] font-semibold px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded cursor-pointer transition-colors"
              >
                <span className="text-clinical-blue font-bold mr-1">[4]</span> 의료 AI 윤리백서 • 가명화 조치
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Default dynamic summary fallback
    const topPaper = filteredPapers[0];
    if (!topPaper) return null;

    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden mb-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ai-accent fill-ai-accent/10" />
            <h2 className="text-sm font-bold text-research-navy">
              AI 핵심 연구 분석 요약 <span className="text-xs bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded ml-2">'{searchQuery}'</span>
            </h2>
          </div>
        </div>
        <p className="text-xs md:text-sm text-slate-700 leading-relaxed mb-3">
          '{searchQuery}'에 부합하는 소장 지식 중 가장 피인용 및 조회가 우수한 저서 <strong>{topPaper.title}</strong> 분석결과:
        </p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs md:text-sm text-slate-600">
          <div dangerouslySetInnerHTML={{ __html: topPaper.aiSummary.replace(/\n/g, '<br/>') }} />
        </div>
      </div>
    );
  };

  const handleScrollerToPaper = (id: string) => {
    const el = document.getElementById(`paper-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-clinical-blue/20');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-clinical-blue/20');
      }, 3000);
    }
  };

  // Submit AI Assistant Query
  const handleChatSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text: chatInput,
      timestamp: '오후 4:44' // hardcode or compute current time
    };

    setChatMessages(prev => [...prev, userMsg]);
    const requestedQuery = chatInput;
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let aiText = "해당 연구 및 보건 가이드라인 정보를 검색 중입니다. 상세한 법령 검토를 위해 좌측 논문 필터나 원문 보기 탭을 확인해주십시오.";
      
      // Match keywords in user text
      const lowerReq = requestedQuery.toLowerCase();
      let matched = false;

      for (const k of Object.keys(CHAT_RESPONSE_DATABASE)) {
        if (lowerReq.includes(k)) {
          aiText = CHAT_RESPONSE_DATABASE[k];
          matched = true;
          break;
        }
      }

      if (!matched && lowerReq.length > 1) {
        // Simple procedural match
        aiText = `입력하신 '${requestedQuery}' 관련 국가의과학지식센터 아카이브 인덱스를 상호 교차 탐포하였습니다. \n\n유사도가 높은 관련 문헌은 '의료용 인공지능 신뢰성 확보 가이드라인(2023)' 및 '디지털 헬스케어 빅데이터 생명윤리 권고안'입니다. 추가 질의가 필요하시면 해당 키워드를 구체화(예: '코로나', '유전자', '암', '책임', '윤리')하여 적어주십시오.`;
      }

      const aiMsg: ChatMessage = {
        id: `m-a-${Date.now()}`,
        sender: 'assistant',
        text: aiText,
        timestamp: '오후 4:44',
        isAiSparkle: true
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (text: string) => {
    setChatInput(text);
    // Submit logically
    setTimeout(() => {
      const inputEl = document.getElementById('chat-input-field');
      if (inputEl) inputEl.focus();
    }, 50);
  };

  // Get active cluster keywords
  const activeCluster = (() => {
    for (const key of Object.keys(KEYWORD_CLUSTERS_MAP)) {
      if (searchQuery.toLowerCase().includes(key)) {
        return KEYWORD_CLUSTERS_MAP[key];
      }
    }
    return KEYWORD_CLUSTERS_MAP.default;
  })();

  // Pagination indexing helper
  const itemsPerPage = 4;
  const pageCount = Math.ceil(filteredPapers.length / itemsPerPage) || 1;
  const currentPapers = filteredPapers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 flex flex-col lg:flex-row gap-6 relative">
      
      {/* 1. LEFT SIDEBAR: Filters */}
      <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-research-navy tracking-tight">검색 필터</h3>
            <button 
              onClick={() => {
                setDbFilters({ ncmik: true, pubmed: true, kmbase: false });
                setSelectedYear(2024);
                setSelectedDocTypes(['report', 'paper', 'guideline', 'dataset']);
              }}
              className="text-[11px] text-slate-400 hover:text-clinical-blue transition-colors flex items-center gap-0.5 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              초기화
            </button>
          </div>

          {/* Database Checklist */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              대상 데이터베이스
            </label>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dbFilters.ncmik}
                  onChange={(e) => setDbFilters({ ...dbFilters, ncmik: e.target.checked })}
                  className="rounded border-slate-300 text-research-navy focus:ring-research-navy w-4 h-4"
                />
                <span className="group-hover:text-clinical-blue transition-colors">NCMIK 종합 아카이브</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dbFilters.pubmed}
                  onChange={(e) => setDbFilters({ ...dbFilters, pubmed: e.target.checked })}
                  className="rounded border-slate-300 text-research-navy focus:ring-research-navy w-4 h-4"
                />
                <span className="group-hover:text-clinical-blue transition-colors">PubMed Central (PMC)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dbFilters.kmbase}
                  onChange={(e) => setDbFilters({ ...dbFilters, kmbase: e.target.checked })}
                  className="rounded border-slate-300 text-research-navy focus:ring-research-navy w-4 h-4"
                />
                <span className="group-hover:text-clinical-blue transition-colors">Korean Med (KMBase)</span>
              </label>
            </div>
          </div>

          {/* Publication Year range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                발행 연도 제한
              </label>
              <span className="text-xs bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                ~ {selectedYear}년
              </span>
            </div>
            <div className="px-1 text-xs">
              <input 
                type="range"
                min="2000"
                max="2024"
                step="1"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-clinical-blue"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-semibold">
                <span>2000년</span>
                <span>2012년</span>
                <span>2024년</span>
              </div>
            </div>
          </div>

          {/* Document type taxonomy */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              문서 수집 유형
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'paper', label: '학술지 논문' },
                { id: 'report', label: '정부 보고서' },
                { id: 'guideline', label: '임상 가이드라인' },
                { id: 'dataset', label: '의과학 데이터셋' }
              ].map(item => {
                const active = selectedDocTypes.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleDocType(item.id)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                      active 
                        ? 'bg-research-navy border-research-navy text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Insights banner */}
          <div className="p-4 bg-secondary-fixed text-on-secondary-container rounded-xl border border-secondary-container/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-clinical-blue animate-pulse" />
              <span>Smart Insights</span>
            </div>
            <p className="text-[11px] text-[#003B75] leading-relaxed">
              최근 '{searchQuery}' 관련된 보건안전 데이터 정책 가이드 연구가 지난 분기 대비 약 15% 증가했습니다. 최신 규제 동향 분석 및 보험 손배 책임을 고려해보세요.
            </p>
          </div>

        </div>
      </aside>

      {/* 2. CENTER CONTENT SPACE: Summarizer + Search Results */}
      <div className="flex-1 min-w-0 space-y-6">

        {/* AI Answer Summary block */}
        {getAiSummaryBox()}

        {/* Info label line */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="text-xs md:text-sm font-semibold text-slate-500">
            검색 결과 <span className="text-research-navy font-bold">{filteredPapers.length}</span>건
          </span>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold cursor-pointer select-none">
              <SortAsc className="w-4 h-4 text-slate-400" />
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 py-0 cursor-pointer"
              >
                <option value="accuracy">정확도순</option>
                <option value="views">조회수순</option>
                <option value="citations">피인용순</option>
              </select>
            </div>
            
            <button 
              onClick={() => {
                alert(`엑셀 파일로 총 ${filteredPapers.length}건 목록 메타데이터 다운로드 완료! (프로토타입)`);
              }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-clinical-blue font-bold"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-slate-400" />
              목록 다운로드
            </button>
          </div>
        </div>

        {/* Results Stream */}
        <div className="space-y-4">
          {currentPapers.length === 0 ? (
            <div className="bg-white rounded-xl py-12 px-6 border border-slate-200 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">일치하는 지식이 없습니다</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                필터 범위를 넓히거나, 다른 검색어를 입력해 주십시오. (예: 당뇨병, 줄기세포 연구, 코로나, 가이드라인 등)
              </p>
              <button 
                onClick={() => onSearch('정밀 의료 인공지능 윤리 가이드라인')}
                className="text-xs font-bold text-clinical-blue hover:underline"
              >
                기본 정밀의료 가이드라인 문헌 불러오기
              </button>
            </div>
          ) : (
            currentPapers.map((paper) => {
              const isSaved = savedPaperIds.includes(paper.id);
              const isGuideline = paper.type === 'guideline' || paper.type === 'report';

              return (
                <article 
                  key={paper.id} 
                  id={`paper-card-${paper.id}`}
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:border-clinical-blue/30 transition-all duration-300 hover:shadow-md group relative"
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded text-[10px] font-bold">
                        {paper.type === 'paper' ? '학술지 논문' : paper.type === 'report' ? '정부 보고서' : paper.type === 'guideline' ? '임상 가이드라인' : '의과학 데이터셋'}
                      </span>
                      {paper.isOpenAccess && (
                        <span className="bg-[#EAF5FC] text-clinical-blue px-2 py-0.5 rounded text-[10px] font-bold">
                          Open Access
                        </span>
                      )}
                      {paper.isPeerReviewed && (
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          Peer Reviewed
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => toggleSavePaper(paper.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isSaved 
                          ? 'text-academic-purple bg-academic-purple/10 hover:bg-academic-purple/20' 
                          : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                      }`}
                      title={isSaved ? "서재 보관해제" : "내 서재 보관하기"}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-academic-purple' : ''}`} />
                    </button>
                  </div>

                  <h3 
                    onClick={() => onOpenPaper(paper)}
                    className="text-base md:text-md font-bold text-research-navy mb-2 group-hover:text-clinical-blue transition-colors cursor-pointer leading-tight"
                  >
                    {paper.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-400 font-medium mb-3">
                    <span className="font-semibold text-slate-700">{paper.authors} ({paper.institution})</span>
                    <span>•</span>
                    <span>{paper.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-slate-500">
                      조회 {paper.views}회
                    </span>
                    <span>•</span>
                    <span className="font-bold text-clinical-blue">
                      피인용 {paper.citations}회
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-normal mb-5 line-clamp-2">
                    {paper.abstract}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-50">
                    <button 
                      onClick={() => onOpenPaper(paper)}
                      className="flex items-center gap-1 px-4 py-1.5 bg-research-navy hover:bg-clinical-blue text-white rounded text-xs font-bold transition-all shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      원문 보기
                    </button>

                    <button 
                      onClick={() => onOpenAiSummary(paper)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 border border-clinical-blue text-clinical-blue hover:bg-clinical-blue/5 rounded text-xs font-bold transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI 부문 요약
                    </button>

                    <button 
                      onClick={() => toggleSavePaper(paper.id)}
                      className={`ml-auto text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                        isSaved ? 'text-academic-purple hover:text-slate-600' : 'text-slate-400 hover:text-research-navy'
                      }`}
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>{isSaved ? '서재 보관됨' : '내 서재 담기'}</span>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Feature Recommended Stack Card (Bento Style) */}
        {RECOMMENDED_BOOKS.slice(0, 1).map((book) => (
          <article 
            key={book.id}
            className="bg-primary-container text-white rounded-xl p-6 border border-slate-700 shadow-lg relative overflow-hidden"
          >
            <div className="relative z-10 max-w-lg">
              <span className="bg-clinical-blue text-white px-2.5 py-0.5 rounded text-[10px] font-bold block w-fit mb-4">
                추천 학술도서 소장
              </span>
              <h3 className="text-lg font-bold mb-3">{book.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {book.description}
              </p>
              <div className="flex gap-2.5">
                <button 
                  onClick={() => alert(`'${book.title}' 대출 예약 신청 완료! 원문 사본 수령을 위해 관내 대출 데스크를 확인해주세요.`)}
                  className="px-5 py-2 bg-white hover:bg-slate-100 text-research-navy rounded-full font-bold text-xs transition-all shadow"
                >
                  대출 온라인 예약
                </button>
                <button 
                  onClick={() => alert(`해당 추천 도서 실물 검색 기호: [610.285 N34c] (기타 소장가치 분석실 보관)`)}
                  className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white rounded-full font-bold text-xs transition-all"
                >
                  기호 위치 정보
                </button>
              </div>
            </div>

            <div className="absolute right-4 -bottom-6 w-32 h-36 opacity-30 transform rotate-12 select-none pointer-events-none">
              <div className="w-full h-full bg-slate-800 rounded shadow-2xl border border-slate-700 flex items-center justify-center p-3 text-center">
                <span className="text-[9px] text-slate-400 font-bold block">{book.title}</span>
              </div>
            </div>
          </article>
        ))}

        {/* Simple pagination */}
        {pageCount > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-clinical-blue disabled:opacity-40 disabled:hover:border-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pageCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-9 h-9 font-bold text-xs rounded-lg transition-colors ${
                  currentPage === idx + 1 
                    ? 'bg-research-navy text-white' 
                    : 'border border-slate-200 text-slate-600 hover:border-clinical-blue'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button 
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-clinical-blue disabled:opacity-40 disabled:hover:border-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* 3. RIGHT SIDEBAR: Related keywords + AI Assistant widget */}
      <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
        
        {/* Keyword Cluster map widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
            <h4 className="font-extrabold text-xs text-research-navy tracking-tight">관련 키워드 클러스터</h4>
            <Info className="w-4 h-4 text-slate-300" title="현재 검색의 핵심 인접 단어 목록" />
          </div>

          <div className="h-44 bg-slate-50 rounded-xl relative overflow-hidden flex items-center justify-center p-3 border border-slate-100">
            {/* Visual concentric rings decorators to simulate node layout */}
            <div className="absolute w-32 h-32 border border-slate-200/50 rounded-full animate-ping pointer-events-none opacity-25" />
            <div className="absolute w-24 h-24 border border-slate-200/50 rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-wrap justify-center gap-1.5 max-w-xs">
              {activeCluster.map((tag, idx) => (
                <span
                  key={tag}
                  onClick={() => onSearch(tag)}
                  className={`text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all shadow-sm ${
                    idx === 1 
                      ? 'bg-research-navy text-white scale-105 hover:bg-clinical-blue' 
                      : idx === 4 
                        ? 'bg-clinical-blue text-white hover:bg-research-navy'
                        : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Research Chat Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col shadow-lg overflow-hidden h-[420px]">
          
          {/* Header */}
          <div className="bg-slate-800 text-white p-4 flex items-center justify-between border-b border-slate-700 shrink-0">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold font-hanken tracking-wider">AI 연구 비서</span>
            </div>
            <button 
              onClick={() => {
                setChatMessages([
                  {
                    id: "m-reset",
                    sender: "assistant",
                    text: "이전 대화가 아카이빙되었습니다. 연구비서 도움말이 필요하시면 아래 가이드를 클릭해주세요.",
                    timestamp: "오후 4:44",
                    isAiSparkle: true
                  }
                ]);
              }}
              className="text-xs text-slate-400 hover:text-white" title="대화 지우기"
            >
              대사화 리셋
            </button>
          </div>

          {/* Conversations container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-research-navy text-white' 
                    : 'bg-ai-accent text-white'
                }`}>
                  {msg.sender === 'user' ? (
                    <span className="text-[10px] font-bold">나</span>
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className={`p-3 rounded-xl shadow-sm text-xs max-w-[85%] leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-clinical-blue/10 text-slate-800 rounded-tr-none border border-clinical-blue/15'
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] text-slate-400 block mt-1.5 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7.5 h-7.5 rounded-full bg-ai-accent text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white p-3 rounded-xl text-xs text-slate-400 border border-slate-200 animate-pulse">
                  Gemma 4.0 답변을 준비 중입니다...
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Prompt options shortcut chips */}
          <div className="px-3 py-1.5 bg-slate-50 shrink-0 border-t border-slate-100 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button 
              onClick={() => handleSuggestionClick("코로나 신규 변이 추적 연구 알려줘")}
              className="text-[10px] bg-white border border-slate-200 hover:border-clinical-blue text-slate-600 font-bold px-2 py-1 rounded"
            >
              🧬 변이 추적
            </button>
            <button 
              onClick={() => handleSuggestionClick("유전자 가위 타겟의 오프타겟 위험 요약해줘")}
              className="text-[10px] bg-white border border-slate-200 hover:border-clinical-blue text-slate-600 font-bold px-2 py-1 rounded"
            >
              ✂️ CRISPR
            </button>
            <button 
              onClick={() => handleSuggestionClick("암 면역 치료 인공지능 기법은?")}
              className="text-[10px] bg-white border border-slate-200 hover:border-clinical-blue text-slate-600 font-bold px-2 py-1 rounded"
            >
              🎯 항암 AI
            </button>
            <button 
              onClick={() => handleSuggestionClick("도움말")}
              className="text-[10px] bg-white border border-slate-200 hover:border-clinical-blue text-slate-600 font-bold px-2 py-1 rounded"
            >
              ❓ 사용 가이드
            </button>
          </div>

          {/* Form input */}
          <form 
            onSubmit={handleChatSubmit}
            className="p-3 border-t border-slate-200 bg-white flex gap-2 shrink-0"
          >
            <input
              id="chat-input-field"
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="코로나, 암, 유전자 등 질문을 입력하세요..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-ai-accent focus:ring-1 focus:ring-ai-accent transition-all"
            />
            <button 
              type="submit" 
              className="bg-ai-accent hover:bg-academic-purple text-white p-2 rounded-lg transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      </aside>

    </div>
  );
}
