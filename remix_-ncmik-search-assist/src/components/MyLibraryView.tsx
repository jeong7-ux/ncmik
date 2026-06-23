/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bookmark, FileText, Trash2, ArrowRight, Sparkles, FolderLock, ListTodo, Clipboard, HelpCircle } from 'lucide-react';
import { Paper } from '../types';

interface MyLibraryViewProps {
  papers: Paper[];
  savedPaperIds: string[];
  toggleSavePaper: (id: string) => void;
  onOpenPaper: (paper: Paper) => void;
  onOpenAiSummary: (paper: Paper) => void;
}

export default function MyLibraryView({
  papers,
  savedPaperIds,
  toggleSavePaper,
  onOpenPaper,
  onOpenAiSummary,
}: MyLibraryViewProps) {
  const [localQuery, setLocalQuery] = useState('');

  const savedPapers = papers.filter(p => savedPaperIds.includes(p.id));

  const filteredSaved = savedPapers.filter(p => 
    p.title.toLowerCase().includes(localQuery.toLowerCase()) ||
    p.authors.toLowerCase().includes(localQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 min-h-[calc(100vh-120px)] bg-[#F9F9F9]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-research-navy tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-clinical-blue fill-clinical-blue/10" />
            내 서재 (My Library)
          </h2>
          <p className="text-xs text-slate-500">연구 도중 보관 상자(Bookmark)에 수집한 가이드라인 및 전문 논문들을 안전하게 관리합니다.</p>
        </div>

        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="서재 내 보관자료 검색..."
          className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs md:text-sm outline-none focus:border-clinical-blue focus:ring-1 focus:ring-clinical-blue w-full md:w-60"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Saved papers lists */}
        <div className="lg:col-span-8 space-y-4">
          {filteredSaved.length === 0 ? (
            <div className="bg-white rounded-2xl py-16 px-6 border border-slate-200 text-center space-y-4 max-w-xl mx-auto shadow-sm">
              <FolderLock className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">보관 중인 논문이 없습니다</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  'Resources' 검색 결과 목록에서 '내 서재 담기' 버튼 혹은 우측 상단의 책갈피 아이콘을 눌러 필요한 자료를 수집해보세요.
                </p>
              </div>
            </div>
          ) : (
            filteredSaved.map(paper => (
              <div 
                key={paper.id}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-clinical-blue/20 transition-all hover:shadow-md group flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold inline-block uppercase">
                    {paper.type}
                  </span>
                  <h3 
                    onClick={() => onOpenPaper(paper)}
                    className="text-sm md:text-base font-bold text-research-navy cursor-pointer hover:text-clinical-blue transition-colors leading-snug"
                  >
                    {paper.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {paper.authors} | {paper.institution} | {paper.date}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1 italic">
                    "{paper.abstract}"
                  </p>
                </div>

                <div className="flex md:flex-col justify-end items-end gap-2.5 shrink-0 border-t md:border-t-0 border-slate-50 pt-3 md:pt-0">
                  <button 
                    onClick={() => toggleSavePaper(paper.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center md:justify-center"
                    title="서재에서 제외"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => onOpenPaper(paper)}
                    className="bg-research-navy hover:bg-clinical-blue text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    <FileText className="w-3" />
                    원문 열기
                  </button>

                  <button 
                    onClick={() => onOpenAiSummary(paper)}
                    className="border border-clinical-blue text-clinical-blue hover:bg-clinical-blue/5 px-2.5 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    <Sparkles className="w-3" />
                    AI 요약
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Log summary state info */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <ListTodo className="w-4 h-4 text-clinical-blue" />
              학술 보관함 현황
            </h4>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>수집 학술물 총합</span>
                <span className="font-bold text-slate-800">{savedPapers.length}건</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>정부 임상보고서 분류</span>
                <span className="font-bold text-slate-800">
                  {savedPapers.filter(p => p.type === 'report').length}건
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>학술 가이드라인 분류</span>
                <span className="font-bold text-slate-800">
                  {savedPapers.filter(p => p.type === 'guideline').length}건
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>수정 날짜</span>
                <span className="font-semibold text-slate-400">실시간 동기화</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-slate-400 text-[10px] leading-relaxed flex gap-1.5 items-start">
              <Clipboard className="w-4 h-4 text-slate-400 shrink-0" />
              <span>본 서재 데이터는 브라우저 캐시에 영속 보관되어, 탭을 재접속(혹은 preview 갱신)하여도 마지막 수집 리스트를 그대로 불러옵니다.</span>
            </div>
          </div>

          {/* Special recommendation block */}
          <div className="bg-gradient-to-r from-academic-purple to-research-navy text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
            <h4 className="font-bold text-sm mb-1">인용한 학술 참고자료 일괄 추출</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              내 서재에 등록된 모든 논문의 인용 캡처 본을 국립의학도서관 전용 포맷(RIS/BibTeX)으로 한번에 추출할 수 있습니다.
            </p>
            <button 
              onClick={() => alert("보관 자료 RIS 일괄 다운로드 완료! (프로토타입)")}
              className="px-4 py-1.5 bg-white text-research-navy rounded font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              RIS 내보내기
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
