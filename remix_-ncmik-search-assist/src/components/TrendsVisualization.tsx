/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, LineChart, Cpu, HelpCircle, Activity, HeartPulse } from 'lucide-react';

interface TrendsVisualizationProps {
  onClose: () => void;
}

export default function TrendsVisualization({ onClose }: TrendsVisualizationProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<'all' | 'mil' | 'gen' | 'can'>('all');

  // Trend plot coordinate coordinates
  const years = [2010, 2013, 2016, 2019, 2022, 2025];
  
  // Custom styled trend plots with safe inline SVGs
  const dataLines = {
    mil: [
      { year: 2010, val: 12 },
      { year: 2013, val: 24 },
      { year: 2016, val: 45 },
      { year: 2019, val: 120 },
      { year: 2022, val: 340 },
      { year: 2025, val: 890 }
    ], // 정밀의료
    gen: [
      { year: 2010, val: 4 },
      { year: 2013, val: 15 },
      { year: 2016, val: 89 },
      { year: 2019, val: 180 },
      { year: 2022, val: 290 },
      { year: 2025, val: 612 }
    ], // 유전자편집 (CRISPR)
    can: [
      { year: 2010, val: 42 },
      { year: 2013, val: 64 },
      { year: 2016, val: 110 },
      { year: 2019, val: 195 },
      { year: 2022, val: 380 },
      { year: 2025, val: 520 }
    ]  // 암 면역치료
  };

  const getPathD = (lineData: { year: number, val: number }[]) => {
    // Width: 600, Height: 200
    // X axis mapped to years 2010-2025
    // Y axis mapped to 0-1000 val
    const points = lineData.map((d, idx) => {
      const x = (idx / (lineData.length - 1)) * 540 + 30; // margins 30 on width 600
      const y = 180 - (d.val / 1000) * 160; // margin 20 on height 200
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-academic-purple/10 flex items-center justify-center text-academic-purple">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base text-research-navy">국가 의학 인공지능 연구 연도별 트렌드</h3>
              <p className="text-[11px] text-slate-400">최근 15년간 국립의학도서관 및 NCMIK 연계 등재 데이터베이스 학술물 게재 추이를 분석합니다.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {/* Keyword Filters */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setSelectedKeyword('all')}
              className={`px-3 py-1.5 rounded-full border font-bold transition-colors ${
                selectedKeyword === 'all' 
                  ? 'bg-research-navy border-research-navy text-white' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              종합 게재 추이
            </button>
            <button
              onClick={() => setSelectedKeyword('mil')}
              className={`px-3 py-1.5 rounded-full border font-bold transition-colors ${
                selectedKeyword === 'mil' 
                  ? 'bg-clinical-blue border-clinical-blue text-white' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              정밀의료 AI 가이드라인
            </button>
            <button
              onClick={() => setSelectedKeyword('gen')}
              className={`px-3 py-1.5 rounded-full border font-bold transition-colors ${
                selectedKeyword === 'gen' 
                  ? 'bg-purple-600 border-purple-600 text-white' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              유전자 편집 (CRISPR-Cas9)
            </button>
            <button
              onClick={() => setSelectedKeyword('can')}
              className={`px-3 py-1.5 rounded-full border font-bold transition-colors ${
                selectedKeyword === 'can' 
                  ? 'bg-rose-500 border-rose-500 text-white' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              암 면역 치료 솔루션
            </button>
          </div>

          {/* SVG Trend Line Graph */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative">
            <div className="relative h-56 w-full">
              {/* Graphic Plot Grid */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
                {/* Horizontal guides lines */}
                <line x1="30" y1="20" x2="570" y2="20" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="30" y1="60" x2="570" y2="60" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="30" y1="100" x2="570" y2="100" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="30" y1="140" x2="570" y2="140" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="30" y1="180" x2="570" y2="180" stroke="#cbd5e1" />

                {/* Y Axis Guides values (0, 250, 500, 750, 1000) */}
                <text x="12" y="184" className="text-[9px] fill-slate-400 font-bold">0</text>
                <text x="6" y="144" className="text-[9px] fill-slate-400 font-bold">250</text>
                <text x="6" y="104" className="text-[9px] fill-slate-400 font-bold">500</text>
                <text x="6" y="64" className="text-[9px] fill-slate-400 font-bold">750</text>
                <text x="3" y="24" className="text-[9px] fill-slate-400 font-bold">1000</text>

                {/* X Axis label Years */}
                {years.map((yr, idx) => {
                  const x = (idx / (years.length - 1)) * 540 + 30;
                  return (
                    <text key={yr} x={x} y="196" className="text-[9px] fill-slate-400 font-bold text-center" textAnchor="middle">
                      {yr}년
                    </text>
                  );
                })}

                {/* Lines drawing according to filter selection */}
                {(selectedKeyword === 'all' || selectedKeyword === 'mil') && (
                  <path 
                    d={getPathD(dataLines.mil)} 
                    fill="none" 
                    stroke="#005EB8" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    className="transition-all duration-500" 
                  />
                )}

                {(selectedKeyword === 'all' || selectedKeyword === 'gen') && (
                  <path 
                    d={getPathD(dataLines.gen)} 
                    fill="none" 
                    stroke="#9333ea" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    className="transition-all duration-500" 
                  />
                )}

                {(selectedKeyword === 'all' || selectedKeyword === 'can') && (
                  <path 
                    d={getPathD(dataLines.can)} 
                    fill="none" 
                    stroke="#f43f5e" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    className="transition-all duration-500" 
                  />
                )}
              </svg>
            </div>

            {/* Custom chart legends */}
            <div className="flex gap-4 items-center justify-center text-xs mt-3 select-none">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#005EB8] rounded"></span> 정밀의료 AI (가중치 급증)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#9333ea] rounded"></span> 유전자 편집 서치</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#f43f5e] rounded"></span> 암 면역치료 예측</span>
            </div>
          </div>

          {/* Description summary card */}
          <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-100 text-xs text-slate-600 leading-relaxed space-y-1">
            <span className="font-bold text-[#4a1c7c] block">지식 분석가의 연도별 코멘트</span>
            <p>
              2019-2023년 구간은 대형 연어신경망(Transformer) 의학 학습 모델 보전과, 병리 생검 디지털 해상도 이미지 기반의 면역 항암제 처치 실증이 급상승하며 트렌드를 주도했습니다. 최근 의료 규제가 동조(AI 가이드라인)되며 신뢰성과 설명가능인자(XAI) 규격 연구가 2025-2026 수렴 국면으로 올라서고 있습니다.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end text-xs">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-research-navy hover:bg-slate-800 text-white rounded font-bold transition-all shadow"
          >
            대기 분석 기호 나가기
          </button>
        </div>

      </div>
    </div>
  );
}
