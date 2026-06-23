import React, { useState } from 'react';
import { INITIAL_DOCUMENTS, INITIAL_AUDIT_LOGS } from './mockData';
import { ArchiveDocument, AuditLogEntry } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VersionGovernance from './components/VersionGovernance';
import ArchiveManager from './components/ArchiveManager';
import DocumentDetail from './components/DocumentDetail';
import NewRegistrationModal from './components/NewRegistrationModal';
import { 
  FolderLock, 
  History, 
  Activity, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  BarChart4, 
  TrendingUp, 
  Database,
  Lock
} from 'lucide-react';

export default function App() {
  const [documents, setDocuments] = useState<ArchiveDocument[]>(INITIAL_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  
  // Set default active tab representing the central Version Governance screen
  const [activeTab, setActiveTab] = useState<string>('version-control');
  const [selectedDocId, setSelectedDocId] = useState<string>('ARCH-2024-DRU-098');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedDocument = documents.find((d) => d.id === selectedDocId) || documents[0];

  // Callback to view another document detail
  const handleViewDoc = (id: string) => {
    setSelectedDocId(id);
    setActiveTab('document-detail');
  };

  // Callback to register a new file from modal
  const handleRegister = (newDoc: ArchiveDocument) => {
    setDocuments([newDoc, ...documents]);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();

    // Spawn an audit trail entry
    const newAudit: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      time: formattedTime,
      date: formattedDate,
      action: `신규 아카이브 인스턴스 전격 상신: ${newDoc.id}`,
      trigger: newDoc.authors[0] || 'System',
      docId: newDoc.id,
      type: 'critical',
    };
    setAuditLogs([newAudit, ...auditLogs]);
  };

  // Helper count variables for Dashboard
  const activeCount = documents.filter(d => d.status === 'active').length;
  const archivedCount = documents.filter(d => d.status === 'archived').length;
  const obsoleteCount = documents.filter(d => d.status === 'obsolete').length;
  const averageStability = Math.round(documents.reduce((acc, curr) => acc + curr.stability, 0) / documents.length);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      {/* Header bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenRegister={() => setIsRegisterOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main split viewport */}
      <div className="flex pt-16 min-h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Sidebar Left panel */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          selectedDocId={selectedDocId} 
        />

        {/* Content canvas container */}
        <main className="flex-1 ml-64 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
            
            {/* Conditional Tab Rendering */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-sans font-bold text-archive-navy uppercase tracking-tight">
                    대시보드 종합 관제
                  </h1>
                  <p className="text-on-surface-variant text-sm mt-1">
                    SAVE 국가 기밀 재난 보존 문헌 및 RAG 연동 지표의 관제 스냅샷입니다.
                  </p>
                </div>

                {/* Dashboard stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block font-mono">가용 문헌 총량</span>
                      <span className="text-2xl font-bold font-sans text-archive-navy">{documents.length}개</span>
                    </div>
                    <div className="w-10 h-10 rounded bg-[#dde1ff] flex items-center justify-center text-primary">
                      <Database className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block font-mono">평균 보존 신뢰도</span>
                      <span className="text-2xl font-bold font-sans text-secondary">{averageStability}%</span>
                    </div>
                    <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center text-[#065F46]">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block font-mono">활성 / 아카이브 상태</span>
                      <span className="text-2xl font-bold font-sans text-archive-navy">
                        {activeCount} <span className="text-xs font-normal text-slate-400">/ {archivedCount}</span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded bg-amber-100 flex items-center justify-center text-amber-700">
                      <BarChart4 className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block font-mono">임의 폐지 및 격리건</span>
                      <span className="text-2xl font-bold font-sans text-red-600">{obsoleteCount}개</span>
                    </div>
                    <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center text-red-700">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Dashboard Quick shortcuts bento panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shortcut 1 */}
                  <div className="bg-white border border-[#E2E8F0] p-6 rounded shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <History className="w-5 h-5 text-secondary" />
                        <h3 className="font-sans font-bold text-sm text-slate-800">버전 거버넌스 및 문서 계보도</h3>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        실시간으로 아카이브 문헌의 개정 이력을 비교 대조하고, 부처 간 계보 매핑을 정의합니다. 수동으로 관계를 오버라이드하여 계보를 자동 갱신할 수 있습니다.
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('version-control')}
                      className="mt-6 text-xs font-semibold text-secondary flex items-center gap-1 hover:underline cursor-pointer text-left"
                    >
                      <span>버전 등록부 이동</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Shortcut 2 */}
                  <div className="bg-white border border-[#E2E8F0] p-6 rounded shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FolderLock className="w-5 h-5 text-secondary animate-pulse" />
                        <h3 className="font-sans font-bold text-sm text-slate-800">아카이브 지식 RAG 보존소</h3>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        문헌을 다중 선택하여 지식 전개 엔진(SAVE AI)에 일괄 바인딩하십시오. 선택 문서의 임상 데이터를 바탕으로 한 인공지능 교차 질의 응답을 정형 도출합니다.
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('archive-manager')}
                      className="mt-6 text-xs font-semibold text-secondary flex items-center gap-1 hover:underline cursor-pointer text-left"
                    >
                      <span>RAG 매니저 검색 이동</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'version-control' && (
              <VersionGovernance 
                documents={documents}
                setDocuments={setDocuments}
                auditLogs={auditLogs}
                setAuditLogs={setAuditLogs}
                onViewDoc={handleViewDoc}
              />
            )}

            {activeTab === 'archive-manager' && (
              <ArchiveManager 
                documents={documents}
                onViewDoc={handleViewDoc}
              />
            )}

            {activeTab === 'document-detail' && (
              <DocumentDetail 
                document={selectedDocument}
                onBackToList={() => setActiveTab('version-control')}
              />
            )}

            {/* Simulated Additional Sidebar tabs for Institutional Depth */}
            {activeTab === 'system-status' && (
              <div className="bg-white border border-[#E2E8F0] rounded p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-secondary mx-auto">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-archive-navy font-sans">실시간 시스템 무결성 현황 (Telemetry)</h3>
                <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  국가 재난 가용한 아카이브 서버 포털 4, 포털 7 노드가 100% 가동 중에 있습니다. 블록 유효성 체인이 각 로컬 해시를 지속적으로 인덱싱하고 통제합니다.
                </p>
                <div className="text-left max-w-sm mx-auto bg-slate-50 border border-[#E2E8F0] p-4 rounded text-xs space-y-2 font-mono">
                  <p>✔ Node-Alfa (Seoul): [ACTIVE] ping 4ms</p>
                  <p>✔ Node-Beta (Daejeon): [ACTIVE] ping 7ms</p>
                  <p>✔ Cryptographic Encryptor: [AES-256-GCM]</p>
                  <p>✔ RAG Streamer Backbone: [ONLINE]</p>
                </div>
              </div>
            )}

            {activeTab === 'audit-log' && (
              <div className="bg-white border border-[#E2E8F0] rounded p-8 space-y-4">
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
                  <h3 className="text-base font-bold text-archive-navy font-sans">종합 감사 추적 원장 (Immutable Audit Trails)</h3>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">WORM 스토리지</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  WORM(Write Once, Read Many) 인프라에 쓰여진 모든 소독 및 관계 승인 추적 로그입니다. 본 내역은 임의 수정이나 소급 폐기가 원천 거부됩니다.
                </p>
                <div className="space-y-3 font-mono text-xs">
                  {auditLogs.map(l => (
                    <div key={l.id} className="p-3 bg-slate-50 hover:bg-slate-100 transition-all rounded border border-[#E2E8F0] flex justify-between items-start">
                      <div>
                        <span className="bg-primary text-white text-[9px] px-1.5 py-0.2 rounded font-semibold mr-2">{l.id}</span>
                        <span className="font-bold text-slate-800">{l.action}</span>
                        <div className="text-[10px] text-slate-400 mt-1">서명 대행관: {l.trigger} | 연계 대상문서: {l.docId}</div>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-semibold">{l.date} - {l.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="bg-white border border-[#E2E8F0] rounded p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-archive-navy font-sans">글로벌 규정 준수 (Compliance Certification)</h3>
                <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  SAVE Portal은 ISO/TC 292(재난안전 복구), ISO 27001(정보 보안 특화), 및 보건 안전성 WORM 백서 규정을 충실히 비준하여 설계되었습니다.
                </p>
                <p className="text-[10px] text-slate-400 italic">마지막 공식 위생 감리 합격: ISO 22301:2019 (Business Continuity Management)</p>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Institutional Branding footer details */}
      <footer className="ml-64 p-6 border-t border-[#E2E8F0] mt-12 bg-white flex justify-between items-center text-xs text-on-surface-variant font-sans">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded">
            <span className="material-symbols-outlined text-slate-400 text-2xl">verified</span>
          </div>
          <div className="text-[10px] font-mono leading-relaxed uppercase tracking-wider text-slate-400">
            데이터 무결성 프로토콜 버전 2.4.11<br />
            SAVE Portal 기밀 재난 보존 구역 — 권한 외 접근 대형 추적
          </div>
        </div>
        <div className="flex gap-6 text-[11px] font-semibold">
          <a href="#" onClick={(e) => {e.preventDefault(); alert("보안 정책 비준 확인.");}} className="hover:text-secondary hover:underline">보안 정책</a>
          <a href="#" onClick={(e) => {e.preventDefault(); alert("API 원장 검증 조항.");}} className="hover:text-secondary hover:underline">API 참조</a>
          <a href="#" onClick={(e) => {e.preventDefault(); alert("대한민국 국가재난안전 법적 비준 통보.");}} className="hover:text-secondary hover:underline">법적 고지</a>
        </div>
      </footer>

      {/* New Registration Modal Popup Dialog form */}
      <NewRegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onRegister={handleRegister} 
      />
    </div>
  );
}
