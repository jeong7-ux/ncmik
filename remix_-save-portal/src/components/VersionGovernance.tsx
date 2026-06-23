import React, { useState } from 'react';
import { ArchiveDocument, AuditLogEntry } from '../types';
import { Plus, ListFilter, Download, ArrowRight, CheckCircle2, History } from 'lucide-react';

interface VersionGovernanceProps {
  documents: ArchiveDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ArchiveDocument[]>>;
  auditLogs: AuditLogEntry[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLogEntry[]>>;
  onViewDoc: (id: string) => void;
}

export default function VersionGovernance({
  documents,
  setDocuments,
  auditLogs,
  setAuditLogs,
  onViewDoc,
}: VersionGovernanceProps) {
  const [autoIdentify, setAutoIdentify] = useState(true);
  const [relationCsv, setRelationCsv] = useState('');
  const [selectedRelation, setSelectedRelation] = useState<'revision' | 'derivation' | 'obsolete' | 'reference'>('obsolete');
  const [successToast, setSuccessToast] = useState('');

  // Bulk Relationship Execution handler
  const handleBulkUpdate = () => {
    if (!relationCsv.trim()) {
      alert('대상 문서 ID를 최소 하나 가량 입력해 주십시오.');
      return;
    }

    const targetIds = relationCsv
      .split(',')
      .map((id) => id.trim().toUpperCase())
      .filter((id) => id.length > 0);

    // Cross-reference existing files
    let updatedCount = 0;
    const newDocs = documents.map((doc) => {
      if (targetIds.includes(doc.id)) {
        updatedCount++;
        
        // Mutate status if obsolete is chosen
        let newStatus = doc.status;
        let newStability = doc.stability;
        if (selectedRelation === 'obsolete') {
          newStatus = 'obsolete';
          newStability = 25; // drop stability index
        }

        // Add dummy relation link
        const newRel = {
          type: selectedRelation,
          targetId: 'ARCH-2024-DRU-098', // Link it to our signature document
          targetTitle: '생물학적 위험 대응 프로토콜 (v2.4.1)',
          note: '관계 정의 수동 오버라이드 정형 적용'
        };

        return {
          ...doc,
          status: newStatus,
          stability: newStability,
          relationships: [...doc.relationships, newRel],
        };
      }
      return doc;
    });

    if (updatedCount === 0) {
      alert('입력된 문서 ID가 데이터베이스에 존재하지 않습니다. 인스턴스를 확인해 주세요.');
      return;
    }

    setDocuments(newDocs);

    // Generate fresh audit log
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
    
    const labelMapping = {
      revision: '개정',
      derivation: '파생',
      obsolete: '폐지',
      reference: '참조',
    };

    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      time: formattedTime,
      date: formattedDate,
      action: `${labelMapping[selectedRelation]} 수동 배치 갱신: ${targetIds.join(', ')}`,
      trigger: 'Admin_User_01',
      docId: targetIds[0],
      type: selectedRelation === 'obsolete' ? 'obsolete' : 'editorial',
    };

    setAuditLogs([newLog, ...auditLogs]);
    setRelationCsv('');
    
    setSuccessToast(`${updatedCount}건의 문서 계보가 성공적으로 일괄 매핑되었습니다.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Success alert message toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded shadow-xl border border-secondary flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* View Title Grid */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-sans font-bold text-archive-navy uppercase tracking-tight">
            버전 거버넌스 및 매핑
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            고위험 아카이브 문서 계보의 무결성을 실시간 감시 및 연관 구조로 매핑 관리합니다.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="bg-[#EAEAEA] border border-[#E2E8F0] p-3 rounded flex items-center gap-4 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider">
                AUTO-IDENTIFY LATEST
              </span>
              <span className={`text-xs font-bold ${autoIdentify ? 'text-secondary' : 'text-on-surface-variant'}`}>
                {autoIdentify ? 'ACTIVE - REALTIME' : 'INACTIVE (PAUSED)'}
              </span>
            </div>
            {/* Auto toggle switcher switch widget */}
            <div
              onClick={() => setAutoIdentify(!autoIdentify)}
              className={`w-12 h-6 rounded-full relative cursor-pointer px-1 transition-colors duration-200 ${
                autoIdentify ? 'bg-secondary-fixed' : 'bg-on-primary-container/20'
              }`}
            >
              <div
                className={`w-4 h-4 bg-secondary absolute top-1 rounded transition-all duration-200 ${
                  autoIdentify ? 'left-7' : 'left-1'
                }`}
              />
            </div>
          </div>
          <span className="text-[10px] font-mono text-on-surface-variant italic">
            마지막 동기화: 2026-06-22 21:12:21 KST (정부 표준규약 적용)
          </span>
        </div>
      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Table representation segment */}
        <section className="col-span-12 xl:col-span-8 bg-white border border-[#E2E8F0] rounded p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-archive-navy flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary font-medium">format_list_bulleted</span>
              버전 등록부
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => alert("CSV 보존 파일을 암호화 내보내기 처리했습니다.")}
                className="text-xs px-3 py-1 cursor-pointer border border-[#c5c6cf] hover:bg-surface-container-low transition-colors rounded"
              >
                CSV 내보내기
              </button>
              <button className="text-xs px-3 py-1 border border-[#c5c6cf] hover:bg-surface-container-low transition-colors rounded cursor-pointer">
                필터
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-left border-b border-[#E2E8F0]">
                  <th className="p-3 text-[11px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider">문서 ID</th>
                  <th className="p-3 text-[11px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider">주</th>
                  <th className="p-3 text-[11px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider">부</th>
                  <th className="p-3 text-[11px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider">패치</th>
                  <th className="p-3 text-[11px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider">상태</th>
                  <th className="p-3 text-[11px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider text-right">안정성 지표</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {documents.map((doc) => {
                  const parts = doc.currentVersion.replace('v', '').split('.');
                  const major = parts[0] || '1';
                  const minor = parts[1] || '0';
                  const patch = parts[2] || '0';

                  return (
                    <tr 
                      key={doc.id}
                      onClick={() => onViewDoc(doc.id)}
                      className="hover:bg-secondary-fixed/10 transition-all cursor-pointer group"
                    >
                      <td className="p-3 font-mono text-xs font-semibold text-secondary group-hover:underline">
                        {doc.id}
                      </td>
                      <td className="p-3 font-bold text-archive-navy text-xs">v{major}</td>
                      <td className="p-3 text-xs text-on-surface-variant font-mono">.{minor.padStart(2, '0')}</td>
                      <td className="p-3 text-xs text-on-surface-variant font-mono">.{patch.padStart(2, '0')}</td>
                      <td className="p-3">
                        {doc.status === 'active' ? (
                          <span className="px-2 py-0.5 bg-diff-added-bg text-emerald-800 text-[10px] font-extrabold uppercase rounded border border-emerald-200">
                            최신
                          </span>
                        ) : doc.status === 'archived' ? (
                          <span className="px-2 py-0.5 bg-[#eaeaea] text-on-surface-variant text-[10px] font-bold uppercase rounded border border-[#c5c6cf]">
                            보관
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold uppercase rounded border border-error-container/40">
                            폐지
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-24 h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                doc.status === 'active' ? 'bg-secondary' : doc.status === 'archived' ? 'bg-heritage-gold' : 'bg-red-500'
                              }`} 
                              style={{ width: `${doc.stability}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-semibold text-on-surface-variant">{doc.stability}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Change Audit timeline panel right side */}
        <section className="col-span-12 xl:col-span-4 bg-white border border-[#E2E8F0] rounded p-6 shadow-sm flex flex-col h-full">
          <h2 className="text-base font-bold text-archive-navy mb-6 flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <span className="material-symbols-outlined text-secondary">description</span>
            변경 감사 등록부
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-5 max-h-[340px] pr-2 custom-scrollbar">
            {auditLogs.map((log) => (
              <div 
                key={log.id} 
                onClick={() => onViewDoc(log.docId)}
                className="flex gap-4 group cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors"
              >
                <div className="relative flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 z-10 ${
                    log.type === 'system' ? 'bg-secondary' : log.type === 'obsolete' ? 'bg-red-500' : 'bg-heritage-gold'
                  }`} />
                  <div className="w-px h-full bg-[#E2E8F0] absolute top-4 left-1/2 -translate-x-1/2" />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-on-surface-variant flex items-center gap-1.5">
                    <span>{log.time} - {log.date}</span>
                    <span className="text-[9px] bg-slate-100 px-1 py-0.2 text-secondary rounded">{log.docId}</span>
                  </p>
                  <p className="text-xs font-semibold text-[#1a1c1c] mt-0.5 group-hover:text-secondary transition-colors">
                    {log.action}
                  </p>
                  <p className="text-[10px] text-on-surface-variant italic mt-0.5 font-sans">
                    Triggered by: <span className="font-semibold text-slate-700">{log.trigger}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bulk Relationship defining form panel */}
        <section className="col-span-12 md:col-span-5 bg-white border border-[#E2E8F0] rounded p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-archive-navy mb-4 border-b border-[#E2E8F0] pb-3">
              수동 관계 정의
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                  대상 원본 문서 ID (콤마 구분)
                </label>
                <textarea 
                  value={relationCsv}
                  onChange={(e) => setRelationCsv(e.target.value)}
                  className="w-full h-24 p-3 bg-slate-50 border border-[#c5c6cf] font-mono text-xs focus:ring-1 focus:ring-secondary focus:bg-white focus:outline-none rounded transition-all" 
                  placeholder="예: ARCH-2023-882, MED-REF-419"
                />
              </div>

              {/* Relationship grid selection selector options buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedRelation('revision')}
                  className={`flex flex-col items-start p-2.5 border rounded transition-all text-left cursor-pointer ${
                    selectedRelation === 'revision'
                      ? 'border-secondary bg-secondary-fixed/20'
                      : 'border-[#E2E8F0] hover:border-secondary hover:bg-secondary-fixed/10'
                  }`}
                >
                  <span className="text-xs font-bold text-primary">개정 (Revision)</span>
                  <span className="text-[10px] text-on-surface-variant mt-0.5">업데이트된 사후 콘텐츠</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setSelectedRelation('derivation')}
                  className={`flex flex-col items-start p-2.5 border rounded transition-all text-left cursor-pointer ${
                    selectedRelation === 'derivation'
                      ? 'border-secondary bg-secondary-fixed/20'
                      : 'border-[#E2E8F0] hover:border-secondary hover:bg-secondary-fixed/10'
                  }`}
                >
                  <span className="text-xs font-bold text-primary">파생 (Derive)</span>
                  <span className="text-[10px] text-on-surface-variant mt-0.5">국지 특정 문서 분기</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setSelectedRelation('obsolete')}
                  className={`flex flex-col items-start p-2.5 border rounded transition-all text-left cursor-pointer ${
                    selectedRelation === 'obsolete'
                      ? 'border-secondary bg-secondary-fixed/20'
                      : 'border-[#E2E8F0] hover:border-secondary hover:bg-secondary-fixed/10'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold text-primary">폐지 (Obsolete)</span>
                    {selectedRelation === 'obsolete' && <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />}
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-0.5">만료 및 타문서 병합 지정</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setSelectedRelation('reference')}
                  className={`flex flex-col items-start p-2.5 border rounded transition-all text-left cursor-pointer ${
                    selectedRelation === 'reference'
                      ? 'border-secondary bg-secondary-fixed/20'
                      : 'border-[#E2E8F0] hover:border-secondary hover:bg-secondary-fixed/10'
                  }`}
                >
                  <span className="text-xs font-bold text-primary">참조 (Reference)</span>
                  <span className="text-[10px] text-on-surface-variant mt-0.5">외부 가이드라인 링크</span>
                </button>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleBulkUpdate}
            className="w-full mt-6 py-3 bg-archive-navy text-white text-xs font-bold hover:bg-primary transition-all rounded shadow active:scale-[0.98] cursor-pointer cursor-pointer"
          >
            일괄 업데이트 실행
          </button>
        </section>

        {/* Orthogonal lineage hierarchy visualizer */}
        <section className="col-span-12 md:col-span-7 bg-white border border-[#E2E8F0] rounded p-6 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-archive-navy">계층 구조 실각 계보도</h2>
            <div className="flex gap-4 text-[10px] font-mono font-bold tracking-wider uppercase text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-secondary rounded-sm"></span> 상위 마스터
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-heritage-gold rounded-sm"></span> 하위/개별 참조
              </span>
            </div>
          </div>

          <div className="relative w-full h-[330px] bg-slate-50 rounded border border-[#E2E8F0] grid-lineage overflow-hidden flex items-center justify-center">
            
            {/* Orthogonal Network Line Graph Connectors using standard SVG elements */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Box paths correctly matching coordinates of relative nodes */}
              <path d="M 170 165 L 230 165 L 230 85 L 290 85" fill="none" stroke="#b8c6f0" strokeWidth="2" />
              <path d="M 170 165 L 230 165 L 230 245 L 290 245" fill="none" stroke="#E2E8F0" strokeWidth="2" />
              <path d="M 170 165 L 290 165" fill="none" stroke="#B08156" strokeWidth="2" strokeDasharray="3,3" />
            </svg>

            {/* Micro component node blocks */}
            <div className="relative w-full h-full flex items-center justify-between px-10">
              
              {/* Master Node */}
              <div 
                onClick={() => onViewDoc('ARCH-2024-DRU-098')}
                className="w-32 p-3 bg-white border-2 border-secondary shadow-sm rounded-sm transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer z-10"
              >
                <span className="text-[9px] font-mono text-on-surface-variant block uppercase leading-none mb-1">UID: ARCH-2024</span>
                <span className="text-xs font-bold text-primary truncate block">마스터 아카이브</span>
                <span className="text-[10px] text-secondary font-mono block mt-1 font-semibold leading-none">v2.4.1 (활성)</span>
              </div>

              {/* Connected Descendants list */}
              <div className="flex flex-col justify-between h-full py-6 pr-4 space-y-4">
                
                {/* Node Active A */}
                <div 
                  onClick={() => onViewDoc('ARCH-2023-882')}
                  className="w-36 p-2.5 bg-white border border-[#E2E8F0] shadow-sm rounded-sm transition-all duration-200 hover:scale-105 cursor-pointer z-10"
                >
                  <span className="text-[8px] font-mono text-on-surface-variant block uppercase mb-0.5">UID: 882-99-XA</span>
                  <span className="text-xs font-bold text-primary truncate block">지역 초안 (오미크론)</span>
                  <span className="text-[9px] text-emerald-800 font-mono font-bold block mt-0.5 uppercase">최신 최적</span>
                </div>

                {/* Node active B */}
                <div 
                  onClick={() => onViewDoc('MED-REF-419')}
                  className="w-36 p-2.5 bg-white border-2 border-heritage-gold shadow-sm rounded-sm transition-all duration-200 hover:scale-105 cursor-pointer z-10"
                >
                  <span className="text-[8px] font-mono text-[#B08156] block uppercase mb-0.5">UID: 441-11-BT</span>
                  <span className="text-xs font-bold text-primary truncate block">CDC 유전체 매핑</span>
                  <span className="text-[9px] text-heritage-gold font-mono font-bold block mt-0.5">보관 처리 (v1)</span>
                </div>

                {/* Node obsolete C */}
                <div 
                  onClick={() => onViewDoc('PROTO-DS-01')}
                  className="w-36 p-2.5 bg-white border border-[#E2E8F0] shadow-sm rounded-sm opacity-50 transition-all duration-200 hover:scale-105 cursor-pointer z-10"
                >
                  <span className="text-[8px] font-mono text-on-surface-variant block uppercase mb-0.5">UID: PROTO-DS</span>
                  <span className="text-xs font-bold text-primary line-through truncate block">메르스 분석 보고서</span>
                  <span className="text-[9px] text-red-700 font-mono font-bold block mt-0.5">폐지 처리</span>
                </div>

              </div>

            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
