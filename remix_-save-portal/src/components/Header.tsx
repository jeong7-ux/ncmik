import React from 'react';
import { Bell, Settings, Plus, Search } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegister: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  onOpenRegister,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-6 md:px-10 h-16 bg-primary border-b border-on-primary-container/20 transition-colors duration-200">
      <div className="flex items-center gap-8">
        <span 
          onClick={() => setActiveTab('version-control')}
          className="font-sans text-xl font-bold text-white tracking-tight cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          SAVE Portal
        </span>
        
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('archive-manager')}
            className={`font-sans text-sm font-medium transition-all cursor-pointer py-1 ${
              activeTab === 'archive-manager' 
                ? 'text-white border-b-2 border-secondary-fixed font-semibold' 
                : 'text-on-primary-container hover:text-white opacity-80'
            }`}
          >
            아카이브
          </button>
          <button 
            onClick={() => setActiveTab('version-control')}
            className={`font-sans text-sm font-medium transition-all cursor-pointer py-1 ${
              activeTab === 'version-control' || activeTab === 'document-detail'
                ? 'text-white border-b-2 border-secondary-fixed font-semibold' 
                : 'text-on-primary-container hover:text-white opacity-80'
            }`}
          >
            보고서
          </button>
          <button 
            onClick={() => setActiveTab('system-status')}
            className="font-sans text-sm font-medium text-on-primary-container hover:text-white opacity-80 transition-all cursor-pointer"
          >
            통계
          </button>
          <button 
            onClick={() => setActiveTab('audit-log')}
            className="font-sans text-sm font-medium text-on-primary-container hover:text-white opacity-80 transition-all cursor-pointer"
          >
            디렉토리
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Interactive Instant Search Bar in Header */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-primary-container" />
          <input 
            type="text" 
            placeholder="아카이브 고유코드 검색..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Auto focus to search results if not already there
              if (activeTab !== 'archive-manager') {
                setActiveTab('archive-manager');
              }
            }}
            className="bg-primary-container/40 border border-on-primary-container/30 text-white placeholder-on-primary-container text-xs px-9 py-1.5 w-60 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent focus:outline-none transition-all"
          />
        </div>

        <button 
          onClick={onOpenRegister}
          className="bg-secondary text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-secondary-container transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          신규 등록
        </button>

        <div className="flex gap-2">
          <button className="text-white hover:bg-primary-container/40 p-1.5 rounded transition-colors relative cursor-pointer">
            <span className="material-symbols-outlined text-[20px] text-white">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500"></span>
          </button>
          <button className="text-white hover:bg-primary-container/40 p-1.5 rounded transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[20px] text-white">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
