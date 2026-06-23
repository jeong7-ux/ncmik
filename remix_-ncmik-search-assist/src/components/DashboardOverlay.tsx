/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, TrendingUp, BarChart3, Database, FileClock, ClipboardCheck, Sparkles, BookOpen } from 'lucide-react';

interface DashboardOverlayProps {
  onClose: () => void;
  savedPapersCount: number;
}

export default function DashboardOverlay({ onClose, savedPapersCount }: DashboardOverlayProps) {
  // Mock data for analytics
  const weeklyUsage = [
    { day: "월", count: 4 },
    { day: "화", count: 12 },
    { day: "수", count: 8 },
    { day: "목", count: 18 },
    { day: "금", count: 14 },
    { day: "토", count: 2 },
    { day: "일", count: 5 }
  ];

  const recentLogs = [
    { id: 1, action: "의료용 인공지능 신뢰성 가이드라인", type: "AI 요약 생성", Date: "오늘 16:42" },
    { id: 2, action: "인공지능 정밀의료 법적 쟁점", type: "PDF 다운로드", Date: "오늘 15:30" },
    { id: 3, action: "CRISPR 가이드 RNA 타겟 모델", type: "내 서재 보관", Date: "어제 11:24" },
    { id: 4, action: "COVID-19 백신 게놈 변이 예측", type: "단어 검색", Date: "2026-06-21" }
  ];

  const maxVal = Math.max(...weeklyUsage.map(w => w.count));

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-clinical-blue/10 flex items-center justify-center text-clinical-blue">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base text-research-navy">나의 연구 대시보드 (Research Analytics)</h3>
              <p className="text-[11px] text-slate-400">학위 연구원 계정의 지식조회 사용량 및 보관 아카이브 활동을 실시간 측정합니다.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scroll Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 max-h-[70vh]">
          
          {/* Key Indicators Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">금월 검색량 (Quota)</span>
                <span className="text-xl font-extrabold text-research-navy mt-1 block">42 / 60 <span className="text-xs font-normal text-slate-400">건</span></span>
              </div>
              <Sparkles className="w-8 h-8 text-ai-accent opacity-20" />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">서재 소장 자료</span>
                <span className="text-xl font-extrabold text-clinical-blue mt-1 block">{savedPapersCount} <span className="text-xs font-normal text-slate-400">건</span></span>
              </div>
              <BookOpen className="w-8 h-8 text-clinical-blue opacity-20" />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">연동 데이터베이스</span>
                <span className="text-xl font-extrabold text-emerald-600 mt-1 block">3 / 4 <span className="text-xs font-normal text-slate-400">개</span></span>
              </div>
              <Database className="w-8 h-8 text-emerald-600 opacity-20" />
            </div>
          </div>

          {/* Graphical Usage Bar Chart with pure CSS/Tailwind */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h4 className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-clinical-blue" />
                요일별 AI 검색 요약 건 수
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">최근 7일 측정 데이터</span>
            </div>
            
            <div className="flex justify-between items-end h-32 pt-2 px-4 gap-2">
              {weeklyUsage.map((w, idx) => {
                const percent = (w.count / maxVal) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex flex-col items-center">
                      <span className="text-[9px] text-slate-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        {w.count}건
                      </span>
                      <div 
                        className="w-4 md:w-6 bg-gradient-to-t from-clinical-blue to-ai-accent group-hover:from-academic-purple group-hover:to-clinical-blue rounded-t transition-all duration-500"
                        style={{ height: `${percent}%`, minHeight: '4px' }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{w.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log stream */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5">
              <FileClock className="w-4 h-4 text-academic-purple" />
              최근 연구 활동 기록 (Activity Logs)
            </h4>
            
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-clinical-blue" />
                    <div>
                      <span className="font-bold text-slate-700 block md:inline mr-2">{log.action}</span>
                      <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-semibold font-mono">
                        {log.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">{log.Date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs shrink-0">
          <div className="flex items-center gap-1 text-slate-400 font-semibold">
            <ClipboardCheck className="w-4 h-4 text-slate-400" />
            <span>본 계정 정보는 외부 망 반출 제한 대상 연계 노드입니다.</span>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-research-navy hover:bg-slate-800 text-white rounded font-bold transition-all shadow"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
}
