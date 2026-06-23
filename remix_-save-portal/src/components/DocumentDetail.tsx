import React, { useState } from 'react';
import { ArchiveDocument, VersionInfo } from '../types';
import { 
  Download, 
  Edit3, 
  History, 
  CheckCircle2, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';

interface DocumentDetailProps {
  document: ArchiveDocument;
  onBackToList: () => void;
}

export default function DocumentDetail({ document, onBackToList }: DocumentDetailProps) {
  // Setup version tracking state
  const fontVersions = document.versions || [];
  const [selectedVerId, setSelectedVerId] = useState<string>(
    fontVersions.length > 0 ? fontVersions[0].id : "v1.0.0"
  );

  const activeVersion = fontVersions.find(v => v.id === selectedVerId) || fontVersions[0];

  const handleExportPdf = () => {
    alert(`기밀 레벨 4 문서 인쇄 제어 발동: [${document.id} ${activeVersion.id}]가 안전한 격리 전송 승인(SHA-256)을 거쳐 PDF 포맷 다운로드 배치에 등록되었습니다.`);
  };

  const handleModifyProposal = () => {
    const props = prompt("개정 제안 사항을 간략히 상신해 주십시오:", "섹션 4.2.1 규정 세분화 개정안 제안");
    if (props) {
      alert("개정 제의 승인 안건이 감사 부서('Admin_User_01' 결제 대기열)로 안전하게 전송되었습니다.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Area representing Layout 3 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-3 mb-2 font-mono">
            {document.status === 'active' ? (
              <span className="px-2 py-0.5 bg-green-100 text-[#065F46] text-[10px] font-bold uppercase rounded border border-green-200">
                활성 / 유효
              </span>
            ) : document.status === 'archived' ? (
              <span className="px-2 py-0.5 bg-yellow-100 text-[#A16207] text-[10px] font-bold uppercase rounded border border-yellow-200">
                격리 보관됨
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase rounded border border-red-200">
                폐지 / 흡수
              </span>
            )}
            <span className="text-[11px] text-on-surface-variant font-semibold tracking-wider uppercase">
              UID: {document.id}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-sans font-bold text-archive-navy">
            {document.title}
          </h1>
          <p className="text-on-surface-variant text-xs mt-1 md:max-w-xl">
            {document.description}
          </p>
        </div>

        {/* Dropdown controls selection */}
        <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-white p-1 rounded border border-[#E2E8F0] shadow-sm">
            <span className="text-[10px] font-sans font-black text-on-surface-variant px-2.5">버전</span>
            <select 
              value={selectedVerId}
              onChange={(e) => setSelectedVerId(e.target.value)}
              className="border-0 font-mono text-xs text-primary font-bold focus:ring-0 cursor-pointer bg-transparent py-1 pr-8 pl-1 focus:outline-none"
            >
              {fontVersions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 text-xs">
            <button 
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3 py-2 cursor-pointer border border-primary text-primary hover:bg-slate-50 transition-all font-semibold rounded-sm"
            >
              <Download className="w-3.5 h-3.5" />
              PDF 내보내기
            </button>
            <button 
              onClick={handleModifyProposal}
              className="flex items-center gap-1.5 px-3.5 py-2 cursor-pointer bg-primary text-white hover:bg-[#1d2b4d] font-semibold transition-all rounded-sm shadow"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-300" />
              개정 제안
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left main grid column: Diff comparison + Lineage */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          
          {/* Version Comparison Diff Panel Card */}
          <section className="bg-white rounded border border-[#E2E8F0] overflow-hidden shadow-sm">
            
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0040e0] font-bold">compare</span>
                <h2 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-tight">
                  콘텐츠 변경 사항 ({activeVersion.id === 'v1.0.0' ? '최초 등록' : `이전 문서 → ${activeVersion.id}`})
                </h2>
              </div>
              {/* Highlight badge indicators */}
              {activeVersion.diff ? (
                <div className="flex gap-4 text-[10px] font-mono font-bold">
                  <span className="flex items-center gap-1 text-[#065F46]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    +{activeVersion.diff.addedCount} 추가
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    -{activeVersion.diff.removedCount} 삭제
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-on-surface-variant italic">최초 동결 보존본</span>
              )}
            </div>

            {/* Rendered comparison lines */}
            <div className="p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap bg-white space-y-2 select-text">
              <h3 className="font-sans text-xs font-bold text-primary tracking-wide mb-3">
                {activeVersion.title} (기록 등록일: {activeVersion.date})
              </h3>
              
              {activeVersion.diff ? (
                <div className="border-l border-slate-200 pl-4 space-y-1">
                  {activeVersion.diff.lines.map((line, ix) => (
                    <div 
                      key={ix}
                      className={`px-1.5 py-0.5 rounded-sm transition-colors ${
                        line.type === 'add' 
                          ? 'bg-diff-added-bg text-emerald-900 border-l-2 border-emerald-500' 
                          : line.type === 'remove' 
                            ? 'bg-diff-removed-bg text-red-900 line-through opacity-70 border-l-2 border-red-500' 
                            : 'text-on-surface-variant'
                      }`}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-on-surface-variant italic p-4 bg-slate-50 border border-[#E2E8F0] rounded">
                  본 버전 ({activeVersion.id})은 초기 마감본입니다. 전개될 패치 개정안이 발견되지 않았습니다.
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-100 border-t border-[#E2E8F0] text-on-surface-variant italic text-[10px] font-mono">
              SAVE 시스템 코어 (Delta Engine v4.0.2-SEC) 암호화 매칭 및 비교 완료
            </div>
          </section>

          {/* Document Lineage detailed map */}
          <section className="bg-white rounded border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-heritage-gold font-bold">account_tree</span>
                <h2 className="font-sans text-xs font-bold text-archive-navy uppercase tracking-tight">문서 계보도 (Lineage Graph)</h2>
              </div>
              <div className="flex gap-1.5">
                <button className="p-1 cursor-pointer hover:bg-slate-50 border border-[#E2E8F0] rounded text-[#1a1c1c]"><ZoomIn className="w-3.5 h-3.5" /></button>
                <button className="p-1 cursor-pointer hover:bg-slate-50 border border-[#E2E8F0] rounded text-[#1a1c1c]"><ZoomOut className="w-3.5 h-3.5" /></button>
                <button className="p-1 cursor-pointer hover:bg-slate-50 border border-[#E2E8F0] rounded text-[#1a1c1c]"><Maximize2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="relative h-64 bg-slate-50 rounded border border-dashed border-[#c5c6cf] grid-lineage flex items-center justify-center overflow-hidden">
              
              {/* Core visual lines drawing */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M 120 128 L 260 128" fill="none" stroke="#1D2B4D" strokeWidth="2" />
                <path d="M 380 128 L 520 128" fill="none" stroke="#1D2B4D" strokeWidth="2" />
                <path d="M 520 128 L 520 65 L 580 65" fill="none" stroke="#B08156" strokeDasharray="3,3" strokeWidth="1.5" />
                <path d="M 520 128 L 520 190 L 580 190" fill="none" stroke="#1D2B4D" strokeWidth="1.5" />
              </svg>

              {/* Functional lineage nodes details */}
              <div className="absolute left-[30px] top-1/2 -translate-y-1/2 bg-white border border-[#E2E8F0] p-2.5 rounded shadow-sm w-28 text-center">
                <span className="text-[8px] font-mono text-on-surface-variant block uppercase leading-none mb-1">기본 아카이브</span>
                <span className="text-[11px] font-semibold text-primary truncate block font-sans">마스터 프로토콜</span>
                <span className="text-[9px] text-secondary font-mono block mt-1 font-bold">v1.0.0</span>
              </div>

              <div className="absolute left-[260px] top-1/2 -translate-y-1/2 bg-white border-2 border-secondary p-3 rounded shadow-md w-32 z-10 text-center">
                <span className="text-[8px] font-mono text-on-surface-variant block uppercase leading-none mb-1">현재 참조 컨텍스트</span>
                <span className="text-xs font-bold text-slate-800 truncate block font-sans">{document.title.substring(0,8)}...</span>
                <span className="text-[10px] text-secondary font-mono block mt-1 font-semibold">{activeVersion.id}</span>
              </div>

              <div className="absolute right-[40px] top-[25px] bg-white border border-[#E2E8F0] p-2.5 rounded shadow-sm w-28 text-center">
                <span className="text-[8px] font-mono text-heritage-gold block uppercase leading-none mb-1">외부 지침 참조</span>
                <span className="text-[11px] font-bold text-primary truncate block font-sans">OSHA 지침 Ref</span>
                <span className="text-[9px] text-[#A16207] font-mono block mt-1">1910.120</span>
              </div>

              <div className="absolute right-[40px] bottom-[25px] bg-white border border-[#E2E8F0] p-2.5 rounded shadow-sm w-28 text-center opacity-75">
                <span className="text-[8px] font-mono text-on-surface-variant block uppercase leading-none mb-1">파생 하위 분기</span>
                <span className="text-[11px] font-bold text-primary truncate block font-sans">현장 특정 B</span>
                <span className="text-[9px] text-[#0040e0] font-mono block mt-1">v0.8.2-beta</span>
              </div>

            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-[10px] font-mono font-bold text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-0.5 bg-archive-navy inline-block" />
                <span>직계 무결성 계보</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-0.5 bg-heritage-gold border-t border-dashed inline-block" />
                <span>외부 행정 규정 참조</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-white border-2 border-secondary inline-block" />
                <span>현재 보고 계보</span>
              </div>
            </div>
          </section>

        </div>

        {/* Right side Grid Column: Timeline and Integrity card */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          
          {/* Revision timeline cron */}
          <section className="bg-white rounded border border-[#E2E8F0] p-6 shadow-sm">
            <div className="px-1 pb-4 border-b border-[#E2E8F0] flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary font-bold">history</span>
              <h2 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-tight">개정 타임라인 (Revision Log)</h2>
            </div>

            <div className="relative pl-6">
              {/* Connection timeline rod */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-archive-navy/20" />
              
              <div className="space-y-8">
                {fontVersions.map((v, idx) => (
                  <div key={v.id} className="relative group">
                    {/* Circle bulb indicator */}
                    <div className="absolute -left-[24px] top-1">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white transition-all duration-150 ${
                        v.id === selectedVerId 
                          ? 'border-secondary ring-4 ring-secondary-fixed/50 scale-110' 
                          : 'border-archive-navy'
                      }`} />
                    </div>

                    <div>
                      <div className="flex justify-between items-start mb-1 font-mono text-[10px] font-bold">
                        <span className={v.id === selectedVerId ? 'text-secondary' : 'text-on-surface-variant'}>
                          {v.date}
                        </span>
                        <span 
                          onClick={() => setSelectedVerId(v.id)}
                          className={`px-1.5 py-0.2 rounded cursor-pointer ${
                            v.id === selectedVerId ? 'bg-secondary-fixed text-[#001356]' : 'bg-slate-100 text-on-surface-variant'
                          }`}
                        >
                          {v.id}
                        </span>
                      </div>
                      <h4 
                        onClick={() => setSelectedVerId(v.id)}
                        className={`text-xs font-bold font-sans cursor-pointer hover:text-secondary ${
                          v.id === selectedVerId ? 'text-secondary' : 'text-[#1a1c1c]'
                        }`}
                      >
                        {v.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                        {v.summary}
                      </p>

                      {v.signer && (
                        <div className="mt-3 flex items-center gap-2">
                          <img 
                            src={v.signerAvatar || "https://lh3.googleusercontent.com/a/default-user=s40"} 
                            alt={v.signer}
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full border border-[#c5c6cf] text-[8px]"
                            onError={(e) => {
                              // If image fails, replace with initial letter avatar placeholder
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="text-[9px] font-semibold text-on-surface-variant font-sans">
                            최종 서명: <span className="text-slate-800">{v.signer}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => alert("해당 문서의 전체 감사 원장 원본을 출력 해시 비교 대기열에 상신합니다.")}
              className="w-full mt-6 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-secondary hover:bg-secondary-fixed/20 transition-all border-t border-[#E2E8F0] pt-4 cursor-pointer text-center"
            >
              전체 이력 감사 원본 보기
            </button>
          </section>

          {/* Institutional Integrity cryptographic verification */}
          <section className="bg-primary text-white rounded border border-[#E2E8F0] p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 translate-x-8 -translate-y-8">
              <span className="material-symbols-outlined text-[140px]">security</span>
            </div>
            
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-white border-b border-white/10 pb-3">
              <span className="material-symbols-outlined text-heritage-gold" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              기록 무결성 실시간 암호 검증
            </h3>

            <div className="space-y-3 font-mono text-[10px] tracking-wide relative z-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-white/60">해시 (SHA-256)</span>
                <span className="bg-primary-container text-emerald-300 font-semibold px-2 py-0.5 rounded uppercase text-[9px] truncate max-w-[150px]">
                  e3b0c44298fckc149afbf4c62{document.id.replace('-', '')}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-white/60">암호화 기법</span>
                <span className="text-white">AES-256-GCM / Triple Des</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-white/60">안전성 등급</span>
                <span className="text-white font-bold text-emerald-400">CLASS 4 (SOP)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">영구 보존 플래그</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[8px] font-bold">
                  IMMUTABLE - SECURE
                </span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
