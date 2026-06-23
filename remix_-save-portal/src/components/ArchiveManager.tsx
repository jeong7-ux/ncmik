import React, { useState, useEffect, useRef } from 'react';
import { ArchiveDocument, ChatMessage } from '../types';
import { Search, Brain, ChevronDown, CheckSquare, Square, FileText, Send, Sparkles, Check } from 'lucide-react';

interface ArchiveManagerProps {
  documents: ArchiveDocument[];
  onViewDoc: (id: string) => void;
}

export default function ArchiveManager({ documents, onViewDoc }: ArchiveManagerProps) {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('관련성 순');
  const [onlyLatest, setOnlyLatest] = useState(true);

  // Pre-seed checked documents to mimic Layout 2
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useEffect(() => {
    // Initial mapping matching Layout 2 ("WHO-COVID19-TRANS-ARCHIVE-2022" and "H1N1-VACCINE-EFFICACY-META-ANALYSIS")
    const initialChecked = documents
      .filter(d => d.id === 'ARCH-2023-882' || d.id === 'H1N1-VACCINE-EFFICACY')
      .map(d => d.id);
    setCheckedIds(initialChecked);
  }, []);

  // Chat integration state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'ai',
      text: '안녕하십니까. SAVE Portal RAG 지식 보존 엔진입니다. 선택된 문서 데이터를 참조하여 어떤 분석을 수행할까요? (예: "백신 반응 시간 비교해줘")',
      timestamp: '21:12 KST'
    },
    {
      id: 'pre-seeded-user',
      sender: 'user',
      text: '2009년 H1N1과 2021년 COVID-19 데이터셋 간의 백신 반응 시간을 비교해줘.',
      timestamp: '21:12 KST'
    },
    {
      id: 'pre-seeded-ai',
      sender: 'ai',
      text: `선택된 아카이브 데이터 분석 결과:\n\n* **2009 H1N1(H1N1-VACCINE-EFFICACY):** 백신 접종 후 정점 항체 반응 관찰 시차는 평균 **21일차** (v1.0.0 p.44)로 확인됩니다.\n* **2021 COVID-19(ARCH-2023-882):** 오미크론 변이 급증 주기 내에서 부스터 후 **14일차** (v4.2.1 p.12) 내외의 정점 면역 반응 속도가 감지됩니다.\n\n출처: 882-99-XA-442, 772-LM-00-551`,
      timestamp: '21:12 KST'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiLoading]);

  // Document filtration logic
  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = filterCategory === 'ALL' || doc.category.toUpperCase().includes(filterCategory.toUpperCase());
    const matchesKeyword = 
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesKeyword;
  });

  // Checked documents array reference
  const checkedDocuments = documents.filter(d => checkedIds.includes(d.id));

  // Toggle checklist checkbox
  const toggleChecked = (id: string) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter(cid => cid !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  // Chat execution sending payload to /api/chat express endpoint
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isAiLoading) return;

    const userText = inputMessage;
    setInputMessage('');

    const now = new Date();
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} KST`;

    // Append User Message bubble
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timestampStr
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText,
          checkedDocuments: checkedDocuments
        })
      });

      if (!response.ok) {
        throw new Error('RAG 서버 커뮤니케이션 실패');
      }

      const data = await response.json();
      
      const aiResponseMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text,
        timestamp: timestampStr
      };
      setChatMessages(prev => [...prev, aiResponseMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `죄송합니다. 네트워크 교란으로 인하여 RAG 질의 수행에 오류가 발생했습니다. (${err.message}). 잠시 후 재시도하십시오.`,
        timestamp: timestampStr
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full bg-slate-50">
      
      {/* Search Header panel - Matches Layout 2 */}
      <section className="p-6 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Main search bar query */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-on-surface-variant" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-[#c5c6cf] rounded-lg pl-12 pr-36 py-3.5 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary focus:bg-white outline-none transition-all shadow-sm group-hover:shadow"
              placeholder="아카이브, 질병 코드 또는 재난 식별자 검색..."
            />
            <div className="absolute right-3 inset-y-0 flex items-center">
              <button 
                type="button"
                onClick={() => handleSendMessage()}
                className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                AI RAG 검색
              </button>
            </div>
          </div>

          {/* Filtering chips list */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mr-2">주요 분류:</span>
            {[
              { label: '전체', value: 'ALL' },
              { label: 'COVID-19', value: 'COVID-19' },
              { label: 'MERS', value: 'MERS' },
              { label: 'SARS-2003', value: 'SARS-2003' },
              { label: 'H1N1', value: 'H1N1' },
              { label: 'Ebola-WAF', value: 'Ebola' },
            ].map((chip) => (
              <button
                key={chip.value}
                onClick={() => setFilterCategory(chip.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                  filterCategory === chip.value
                    ? 'border-secondary text-secondary bg-secondary-fixed/55 font-bold shadow-sm'
                    : 'border-[#E2E8F0] text-on-surface-variant bg-white hover:border-secondary hover:text-secondary'
                }`}
              >
                {chip.label}
              </button>
            ))}
            <div className="h-5 w-px bg-[#E2E8F0] mx-2" />
            <button 
              onClick={() => { setFilterCategory('ALL'); setSearchQuery(''); }}
              className="flex items-center gap-1 text-xs font-bold text-secondary hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">filter_list</span>
              전제 필터초기화
            </button>
          </div>

        </div>
      </section>

      {/* Grid container layout splitting columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column list card results */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-archive-navy font-sans uppercase tracking-tight">
                {filteredDocs.length}개의 가용 아카이브 지표 발견
              </h2>
              <div className="flex items-center gap-4 text-xs">
                <button 
                  onClick={() => setOnlyLatest(!onlyLatest)}
                  className="text-on-surface-variant hover:text-black flex items-center gap-1.5 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[14px] ${onlyLatest ? 'text-[#065F46] font-bold' : ''}`}>
                    {onlyLatest ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  최신 버전만 조회
                </button>
                <div className="h-4 w-px bg-[#E2E8F0]" />
                <div className="flex items-center gap-1 cursor-pointer">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-transparent font-bold focus:outline-none text-xs border-none cursor-pointer"
                  >
                    <option value="관련성 순">관련성 순</option>
                    <option value="최신 날짜순">최신 날짜순</option>
                    <option value="안정성 지수순">안정성 지수순</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Iteration cards */}
            <div className="space-y-4">
              {filteredDocs.map((doc) => {
                const isChecked = checkedIds.includes(doc.id);
                return (
                  <div 
                    key={doc.id}
                    className={`bg-white border rounded-lg p-5 hover:border-secondary transition-all shadow-sm hover:shadow duration-150 relative ${
                      isChecked ? 'border-secondary/60 bg-secondary-fixed/5' : 'border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 
                            onClick={() => onViewDoc(doc.id)}
                            className="font-sans text-sm font-bold text-slate-900 hover:text-secondary group cursor-pointer"
                          >
                            {doc.title}
                          </h3>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200 uppercase font-mono">
                            {doc.currentVersion} 최종격식
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant font-mono">
                          UID: <span className="font-semibold text-slate-700">{doc.id}</span> • 최종 수정: {doc.lastUpdated}
                        </p>
                      </div>

                      {/* Custom Checkbox binding target */}
                      <button 
                        type="button"
                        onClick={() => toggleChecked(doc.id)}
                        className="text-secondary hover:scale-105 transition-transform p-1 cursor-pointer"
                        title="AI 분석용 RAG 모델 바인딩"
                      >
                        {isChecked ? (
                          <span className="material-symbols-outlined text-secondary text-2xl font-bold">check_box</span>
                        ) : (
                          <span className="material-symbols-outlined text-slate-300 text-2xl hover:text-slate-400">check_box_outline_blank</span>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                      {doc.description}
                    </p>

                    <div className="flex items-center gap-4">
                      {/* Author avatars */}
                      <div className="flex -space-x-2">
                        {doc.authors.map((auth, index) => (
                          <div 
                            key={index}
                            title={`작성 승인자: ${auth}`}
                            className="w-7 h-7 rounded-full border-2 border-white bg-archive-navy flex items-center justify-center text-[9px] font-extrabold text-white"
                          >
                            {auth.substring(0, 2).toUpperCase()}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] font-mono font-semibold text-on-surface-variant bg-slate-100 px-2.5 py-1 rounded">
                        <FileText className="w-3.5 h-3.5 text-on-surface-variant" />
                        <span>{doc.type}</span>
                      </div>

                      {isChecked && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-[#065F46] bg-emerald-100/60 border border-emerald-200 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" />
                          <span>RAG 연계 완료</span>
                        </div>
                      )}

                      <div className="flex-1" />
                      <button 
                        onClick={() => onViewDoc(doc.id)}
                        className="text-secondary font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                      >
                        <span>이력 보기</span>
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </button>
                    </div>

                  </div>
                );
              })}

              {filteredDocs.length === 0 && (
                <div className="p-12 text-center bg-white border border-[#E2E8F0] rounded-lg">
                  <p className="text-on-surface-variant text-sm font-semibold">검색 필터와 매칭되는 활성 아카이브 파일이 없습니다.</p>
                  <p className="text-xs text-slate-400 mt-1">다른 분류 코드를 가이드 선택하거나 키워드를 축소해 보십시오.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: SAVE AI RAG sidebar chat */}
        <aside className="w-96 border-l border-[#E2E8F0] bg-white flex flex-col shadow-lg z-10">
          
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-white">
                <Brain className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-archive-navy">SAVE AI에게 물어보기</h2>
                <p className="text-[9px] text-[#0040e0] font-mono leading-none font-bold mt-0.5">Grounding active Model</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-secondary-fixed text-[#001356] px-2 py-0.5 rounded uppercase">
              RAG 모드
            </span>
          </div>

          {/* Bound documents indicator header */}
          <div className="px-5 py-3.5 bg-slate-50 border-b border-[#E2E8F0]">
            <p className="text-[11px] font-bold text-archive-navy mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span>{checkedDocuments.length}개의 전개 지포 분석 중:</span>
            </p>
            {checkedDocuments.length > 0 ? (
              <ul className="text-[10px] text-on-surface-variant space-y-1 pl-1 font-mono">
                {checkedDocuments.map(d => (
                  <li key={d.id} className="flex items-center gap-1.5 truncate">
                    <Check className="w-3 h-3 text-[#065F46]" />
                    <span className="font-semibold text-slate-800">{d.id}</span>
                    <span className="text-slate-400">({d.title.substring(0, 15)}...)</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[10px] text-slate-400">체크 해제됨. 왼쪽 리스트의 체크박스를 점검하여 대상 RAG 문헌을 바인드 해주세요.</p>
            )}
          </div>

          {/* Chat scrolling log timeline */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {chatMessages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={msg.id} className={`flex ${isAi ? 'justify-start' : 'justify-end'} gap-3`}>
                  {isAi && (
                    <div className="w-8 h-8 rounded-full bg-archive-navy flex-shrink-0 flex items-center justify-center text-white text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-royal-gold" />
                    </div>
                  )}
                  <div 
                    className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[85%] shadow-sm border ${
                      isAi 
                        ? 'bg-slate-50 border-slate-200 text-[#1a1c1c] rounded-tl-none whitespace-pre-wrap' 
                        : 'bg-secondary border-secondary-container text-white rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                    <div className={`text-[8px] mt-1 text-right block ${isAi ? 'text-on-surface-variant' : 'text-secondary-fixed opacity-70'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isAiLoading && (
              <div className="flex justify-start gap-3">
                <div className="w-8 h-8 rounded-full bg-archive-navy flex-shrink-0 flex items-center justify-center text-white text-xs animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-royal-gold" />
                </div>
                <div className="bg-slate-50 border border-slate-200 text-on-surface-variant p-3.5 rounded-xl rounded-tl-none text-xs flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0040e0] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  <span>RAG 시퀀스를 연동하여 컨텍스트 추출 및 심층 요약 생성 중...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Textarea post interface */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E2E8F0] bg-white">
            <div className="relative">
              <textarea 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full bg-slate-50 border border-[#c5c6cf] rounded-lg p-3 text-xs focus:ring-1 focus:ring-secondary focus:bg-white outline-none resize-none pr-12" 
                placeholder="선택된 아카이브 지식에 관해 질문하십시오..."
                rows={3}
              />
              <button 
                type="submit"
                disabled={!inputMessage.trim() || isAiLoading}
                className="absolute bottom-3 right-3 p-2 bg-archive-navy text-white rounded hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer cursor-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </aside>

      </div>
    </div>
  );
}
