/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Download, Printer, Share2, Bookmark, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { Paper } from '../types';

interface PaperDetailModalProps {
  paper: Paper;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function PaperDetailModal({
  paper,
  onClose,
  isSaved,
  onToggleSave,
}: PaperDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'ai-analysis' | 'citations'>('content');

  // Generate highly realistic mock full text sections based on title
  const generateMockFullText = () => {
    return (
      <div className="space-y-6 text-slate-700 leading-relaxed text-xs md:text-sm">
        <section className="space-y-2">
          <h4 className="font-bold text-slate-900 border-l-4 border-clinical-blue pl-2.5 text-sm md:text-base">
            1. 서론 (Introduction)
          </h4>
          <p>
            인공지능(AI)과 정밀의료(Precision Medicine)의 등장은 환자 맞춤형 바이오 데이터 해석 능력을 극대화하고 있습니다. 그러나 딥러닝 기계학습 모델의 태생적 특성으로 불리는 블랙박스 알고리즘 문제는 의무 진단의 귀책 귀속 문제를 수반합니다. 본 논문은 이 영역의 의사 결정 신뢰 구조와 데이터 품질에 대한 공시 지표 가이드라인 가치 체계를 증명합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-slate-900 border-l-4 border-clinical-blue pl-2.5 text-sm md:text-base">
            2. 연구 방법론 (Methodology)
          </h4>
          <p>
            국립의과학지식센터 소장 문헌 12만 건 및 해외 PubMed 등재 연계 코호트 임상 데이터베이스를 가공하여 모델 성능 보장을 정량화하였습니다. 
          </p>
          <ul className="list-disc ml-5 space-y-1 text-xs">
            <li><strong>데이터 샘플링</strong>: 변이 변수 밀집도 0.85 이상의 1,200케이스 전장유전체(WGS) 샘플링 처리</li>
            <li><strong>알고리즘 정의</strong>: 변형된 크로스-어텐션 트랜스포머 레이어 가중치 검증</li>
            <li><strong>통기 검토</strong>: 딥러닝 예측 AUC 신뢰값 95% 신뢰구간 확보 및 분쟁 회피 수렴 가능성 수학적 증명</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-slate-900 border-l-4 border-clinical-blue pl-2.5 text-sm md:text-base">
            3. 실험 및 고찰 (Results &amp; Discussion)
          </h4>
          <p>
            국가 보건 의료 데이터를 활용한 연합 학습(Federated Learning) 아키텍처 환경에서, 개별 병원 로컬 노드에서의 손실 분석이 현저히 줄어듦을 확인하였습니다. 설명가능 인공지능(XAI) 분석 기법을 반영할 시 의약 결정 정확도는 전통적인 임상 프로토콜 대비 12% 향상되었습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-slate-900 border-l-4 border-clinical-blue pl-2.5 text-sm md:text-base">
            4. 결의안 (Conclusion)
          </h4>
          <p>
            보건복지부가 고시 예정인 AI 규격 가이드라인의 제도적 안착은 의료 사고의 법적 불확실성을 예방하고 환자 데이터 주권을 신속히 보장하는 지름길입니다.
          </p>
        </section>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left header actions and metadata */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-start shrink-0 bg-slate-50">
          <div className="space-y-1.5 flex-1 mr-4">
            <div className="flex items-center gap-2">
              <span className="bg-research-navy text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {paper.type}
              </span>
              <span className="text-xs text-slate-400 font-medium">소장 정보조회 시스템</span>
            </div>
            
            <h2 className="text-base md:text-xl font-bold text-research-navy leading-snug">
              {paper.title}
            </h2>

            <p className="text-xs text-slate-500 font-medium">
              저자: <span className="text-slate-800 font-semibold">{paper.authors}</span> | 소속 기관: <span className="text-slate-800 font-semibold">{paper.institution}</span> | 발행일자: <span className="font-semibold">{paper.date}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={onToggleSave}
              className={`p-2 rounded-lg border transition-all ${
                isSaved 
                  ? 'bg-academic-purple/10 border-academic-purple text-academic-purple' 
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={isSaved ? "서재 항목 취소" : "내 서재 보관"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-academic-purple' : ''}`} />
            </button>

            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 border-b border-slate-200 bg-white flex gap-6 shrink-0 text-xs md:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'content' 
                ? 'border-clinical-blue text-clinical-blue font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            학술 논문 전문 보기
          </button>

          <button
            onClick={() => setActiveTab('ai-analysis')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'ai-analysis' 
                ? 'border-academic-purple text-[#411c5e] font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-ai-accent fill-ai-accent/10" />
            Gemma 의약 AI 입체 분석
          </button>

          <button
            onClick={() => setActiveTab('citations')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'citations' 
                ? 'border-clinical-blue text-clinical-blue font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>인용 참고문헌 ({paper.citationsList?.length || 1}건)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-white max-h-[50vh]">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Box Info */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <h5 className="font-bold text-xs text-slate-400 uppercase tracking-widest">초록 (Abstract)</h5>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal italic">
                  "{paper.abstract}"
                </p>
              </div>

              {/* Generative Text elements */}
              {generateMockFullText()}
            </div>
          )}

          {activeTab === 'ai-analysis' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <Sparkles className="w-5 h-5 text-ai-accent fill-ai-accent/10 animate-bounce" />
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-[#4c1d76]">Gemma-4.0 연동 의과학 독점 요약</h4>
                  <p className="text-[10px] md:text-xs text-purple-600">국가 보건 데이터 규격에 부합하는 자동 심층요약 채널입니다.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs md:text-sm text-slate-600 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: paper.aiSummary.replace(/\n/g, '<br/>') }} />
              </div>

              {/* Ethical Compliance checklist */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  생명윤리 및 AI 안전 규격 신뢰점수
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center">
                    <span>데이터 가명화 조치 점수</span>
                    <span className="font-bold text-green-600">{paper.isOpenAccess ? '최우수 (S)' : '우수 (A)'}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center">
                    <span>설명가능 인공지능(XAI) 탑재 상태</span>
                    <span className="font-bold text-green-600">준수 완료 (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'citations' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="font-bold text-slate-800 text-sm">상호 인용 논리 네트워크</h4>
              <p className="text-xs text-slate-400">본 보고서가 인용하였거나 해당 논문을 피인용한 센터 중심 인지 구조망입니다.</p>
              
              <div className="space-y-2.5">
                {paper.citationsList ? (
                  paper.citationsList.map((cit, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors flex justify-between items-center text-xs">
                      <div className="flex gap-2.5 items-center">
                        <span className="bg-clinical-blue text-white w-5 h-5 flex items-center justify-center font-bold rounded-full text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-700">{cit}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500">
                    인용한 학술 참고문헌이 데이터 연계 과정에 통합되어 있습니다. 상세 정보조회 권한을 신청하세요.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-between md:flex-row gap-3 items-center shrink-0 text-xs">
          <div className="flex gap-4 text-slate-500 font-semibold">
            <span>조회수: <span className="text-slate-800 font-bold">{paper.views}회</span></span>
            <span>피인용: <span className="text-slate-850 font-extrabold text-clinical-blue">{paper.citations}회</span></span>
          </div>

          <div className="flex gap-2.5">
            <button 
              onClick={() => {
                alert(`'${paper.title}' PDF 문서 원본 전송이 시작되었습니다. (다운로드 폴더를 확인하세요)`);
              }}
              className="px-4 py-2 bg-research-navy hover:bg-clinical-blue text-white rounded font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              자료 다운로드 (PDF)
            </button>
            
            <button 
              onClick={() => {
                alert("인쇄 인공인프라 연결 대기중... (가상 큐 탑재)");
              }}
              className="px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded font-bold flex items-center gap-1 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              인쇄
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
