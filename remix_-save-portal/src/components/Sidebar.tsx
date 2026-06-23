import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  FolderLock, 
  Activity, 
  ShieldCheck, 
  FileCheck,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDocId?: string;
}

export default function Sidebar({ activeTab, setActiveTab, selectedDocId }: SidebarProps) {
  // AD is used for Version Control, DR for Archive Manager/RAG
  const isAdminCtrl = activeTab === 'version-control';

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col bg-white border-r border-[#E2E8F0] z-35 transition-all duration-150 ease-in-out">
      {/* Admin credentials segment */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-archive-navy rounded flex items-center justify-center text-white font-bold tracking-wider font-sans">
            {isAdminCtrl ? 'AD' : 'DR'}
          </div>
          <div>
            <h3 className="font-sans text-sm font-bold text-primary">
              {isAdminCtrl ? '관리자 제어' : '관리자 제어'}
            </h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-sans font-medium">
              {isAdminCtrl ? '재난 대응 본부' : '재난 대응 유닛'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-left font-sans transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-secondary bg-secondary-fixed/30 font-bold border-l-4 border-secondary'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-black'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>대시보드</span>
        </button>

        <button
          onClick={() => setActiveTab('version-control')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-left font-sans transition-all cursor-pointer ${
            activeTab === 'version-control'
              ? 'text-secondary bg-secondary-fixed/30 font-bold border-l-4 border-secondary'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-black'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">history_toggle_off</span>
          <span>버전 관리</span>
        </button>

        <button
          onClick={() => setActiveTab('archive-manager')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-left font-sans transition-all cursor-pointer ${
            activeTab === 'archive-manager'
              ? 'text-secondary bg-secondary-fixed/30 font-bold border-l-4 border-secondary'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-black'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>아카이브 매니저</span>
        </button>

        {selectedDocId && (
          <button
            onClick={() => setActiveTab('document-detail')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-left font-sans transition-all cursor-pointer ${
              activeTab === 'document-detail'
                ? 'text-secondary bg-secondary-fixed/30 font-bold border-l-4 border-secondary'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">compare</span>
            <span>문서 상세 / 이력</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('system-status')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-left font-sans transition-all cursor-pointer ${
            activeTab === 'system-status'
              ? 'text-secondary bg-secondary-fixed/30 font-bold border-l-4 border-secondary'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-black'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>시스템 현황</span>
        </button>

        <button
          onClick={() => setActiveTab('audit-log')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-left font-sans transition-all cursor-pointer ${
            activeTab === 'audit-log'
              ? 'text-secondary bg-secondary-fixed/30 font-bold border-l-4 border-secondary'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-black'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>감사 로그</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-left font-sans transition-all cursor-pointer ${
            activeTab === 'compliance'
              ? 'text-secondary bg-secondary-fixed/30 font-bold border-l-4 border-secondary'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-black'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>규정 준수</span>
        </button>
      </nav>

      {/* Pulsed optimal indicator */}
      <div className="p-4 bg-surface-muted/60 mx-4 mb-4 rounded border border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-archive-navy">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>시스템 상태: 최적</span>
          </div>
        </div>
        <p className="text-[10px] text-on-surface-variant italic mt-1 font-mono">가동율 99.98% REAL-TIME</p>
      </div>

      {/* Support / Logout links */}
      <div className="border-t border-[#E2E8F0] py-4 px-2 space-y-1">
        <button 
          onClick={() => alert("전문 지원 대응팀과 연계합니다.")}
          className="w-full flex items-center gap-3 px-4 py-2 text-xs text-on-surface-variant hover:bg-surface-container-low text-left font-sans rounded cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>지원 센터</span>
        </button>
        <button 
          onClick={() => alert("기밀 아카이브 세션을 안전하게 도크 아웃합니다.")}
          className="w-full flex items-center gap-3 px-4 py-2 text-xs text-on-surface-variant hover:bg-surface-container-low text-left font-sans rounded cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>로그아웃 (Lock-Out)</span>
        </button>
      </div>
    </aside>
  );
}
