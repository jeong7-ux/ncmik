/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_PAPERS } from './data';
import { Paper } from './types';
import TopNavBar from './components/TopNavBar';
import HomeView from './components/HomeView';
import ResultsView from './components/ResultsView';
import MyLibraryView from './components/MyLibraryView';
import PaperDetailModal from './components/PaperDetailModal';
import DashboardOverlay from './components/DashboardOverlay';
import TrendsVisualization from './components/TrendsVisualization';
import { Sparkles, MessageSquare, Info, Share2, Landmark, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'resources' | 'ai-assist' | 'my-library'>('resources');
  const [searchQuery, setSearchQuery] = useState('');
  
  // LocalStorage saved items persistence for premium prototype feel
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>(() => {
    const local = localStorage.getItem('ncmik_saved_papers');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return ['p1', 'p3']; // initial mock populated items
      }
    }
    return ['p1', 'p3'];
  });

  useEffect(() => {
    localStorage.setItem('ncmik_saved_papers', JSON.stringify(savedPaperIds));
  }, [savedPaperIds]);

  // Modal active states
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [detailModalTabState, setDetailModalTabState] = useState<'content' | 'ai-analysis' | 'citations'>('content');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showTrendsVis, setShowTrendsVis] = useState(false);

  // Floating micro robot chat quick panel trigger
  const [quickMessengerOpen, setQuickMessengerOpen] = useState(false);

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setActiveTab('ai-assist');
    } else {
      setActiveTab('resources');
    }
  };

  const toggleSavePaper = (id: string) => {
    setSavedPaperIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleOpenPaperDoc = (paper: Paper) => {
    setDetailModalTabState('content');
    setSelectedPaper(paper);
  };

  const handleOpenPaperAiAnalysis = (paper: Paper) => {
    setDetailModalTabState('ai-analysis');
    setSelectedPaper(paper);
  };

  const triggerTrendingQuery = (word: string) => {
    setSearchQuery(word);
    setActiveTab('ai-assist');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800 selection:bg-clinical-blue/20">
      
      {/* 1. Universal Top Navigation Bar */}
      <TopNavBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleGlobalSearch}
        savedCount={savedPaperIds.length}
      />

      {/* 2. Primary Views Router */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'resources' && searchQuery === '' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <HomeView 
                onSearch={handleGlobalSearch}
                openTrendingWord={triggerTrendingQuery}
                onOpenDashboard={() => setShowDashboard(true)}
                onOpenVisualization={() => setShowTrendsVis(true)}
              />
            </motion.div>
          ) : activeTab === 'my-library' ? (
            <motion.div
              key="library"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MyLibraryView 
                papers={MOCK_PAPERS}
                savedPaperIds={savedPaperIds}
                toggleSavePaper={toggleSavePaper}
                onOpenPaper={handleOpenPaperDoc}
                onOpenAiSummary={handleOpenPaperAiAnalysis}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsView 
                papers={MOCK_PAPERS}
                searchQuery={searchQuery}
                onSearch={handleGlobalSearch}
                onOpenPaper={handleOpenPaperDoc}
                onOpenAiSummary={handleOpenPaperAiAnalysis}
                savedPaperIds={savedPaperIds}
                toggleSavePaper={toggleSavePaper}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Global Center Institutional Footer */}
      <footer className="bg-research-navy text-slate-300 py-12 px-6 md:px-10 border-t border-slate-800 transition-all shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          
          <div className="max-w-md space-y-4">
            <div className="text-white font-extrabold text-sm md:text-base flex items-center gap-2">
              <Landmark className="w-5 h-5 text-clinical-blue" />
              NCMIK <span className="font-light text-slate-400">국립의과학지식센터</span>
            </div>
            
            <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed font-normal">
              국립의과학지식센터는 국가 의과학 지식 정보의 체계적 수집, 보존 및 실시간 공유를 통해 국가 보건의료 연구 경쟁력을 극대화하고 국민 건강 증진에 공헌하는 대한민국 보건복지부 산하의 대표 의과학 전문도서관입니다.
            </p>
            
            <div className="flex gap-3">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert("외부 사이트 연동 완료: 국립의과학지식센터 영문 홈피"); }}
                className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs"
              >
                EN
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert("SNS 아카이브 메일링 수집 동의 (프로토타입)"); }}
                className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs"
              >
                SNS
              </a>
            </div>
          </div>

          {/* Links structure column */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-xs font-semibold">
            <div className="space-y-3">
              <h6 className="text-white text-xs border-b border-slate-800 pb-1.5 uppercase tracking-wider">센터 소강 안내</h6>
              <ul className="space-y-2 text-slate-400 text-[11px]">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors block">의과학 지식 검색안내</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors block">도서 청구 및 위치 찾기</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors block">기증의학 연구 문헌집</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h6 className="text-white text-xs border-b border-slate-800 pb-1.5 uppercase tracking-wider">법적 지원 및 서약</h6>
              <ul className="space-y-2 text-slate-400 text-[11px]">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors block font-extrabold text-[#74a0da]">개인정보처리방침</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors block">이용 약관 및 수집 범위</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors block">윤리 규범 선언문 (IRB)</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold">
          <p>© 2026 National Center for Medical Information & Knowledge (NCMIK). All rights reserved.</p>
          <p>질병관리청 국립보건연구원 정보시스템 연계인증 완료</p>
        </div>
      </footer>

      {/* 4. MODAL DETAILED PANELS SYSTEM */}
      <AnimatePresence>
        
        {/* Paper Reader Modal */}
        {selectedPaper && (
          <PaperDetailModal 
            paper={selectedPaper}
            onClose={() => setSelectedPaper(null)}
            isSaved={savedPaperIds.includes(selectedPaper.id)}
            onToggleSave={() => toggleSavePaper(selectedPaper.id)}
          />
        )}

        {/* Dashboard Modal */}
        {showDashboard && (
          <DashboardOverlay 
            savedPapersCount={savedPaperIds.length}
            onClose={() => setShowDashboard(false)}
          />
        )}

        {/* Trend line Visualizer Modal */}
        {showTrendsVis && (
          <TrendsVisualization 
            onClose={() => setShowTrendsVis(false)}
          />
        )}

      </AnimatePresence>

      {/* Floating Interactive Robot Assistant Action Button (Only on landing or small tabs for instant help) */}
      {activeTab !== 'ai-assist' && (
        <button 
          onClick={() => handleGlobalSearch('정밀 의료 인공지능 윤리 가이드라인')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-academic-purple to-clinical-blue text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50 group border border-white/20"
          title="AI 연구 비서에게 질문하기"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          
          <div className="absolute right-full mr-3.5 bg-slate-900 border border-slate-800 text-white text-[11px] font-bold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl flex items-center gap-1.5">
            <span>AI 연구 비서 켜기</span>
            <span className="bg-ai-accent text-[9px] px-1 rounded">Beta</span>
          </div>
        </button>
      )}

    </div>
  );
}
