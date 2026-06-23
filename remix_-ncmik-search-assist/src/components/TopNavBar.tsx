/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, User, Library, BookOpen, Sparkles, LogIn, Menu, X } from 'lucide-react';

interface TopNavBarProps {
  activeTab: 'resources' | 'ai-assist' | 'my-library';
  setActiveTab: (tab: 'resources' | 'ai-assist' | 'my-library') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  savedCount: number;
}

export default function TopNavBar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onSearch,
  savedCount,
}: TopNavBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const notifications = [
    { id: 1, text: "홍길동 연구원님이 '정밀의학 AI 윤리 가이드라인' 전문을 내 서재에 추가했습니다.", time: "10분 전", read: false },
    { id: 2, text: "관심 키워드 'CRISPR' 관련 신규 논문 2건이 추천되었습니다.", time: "2시간 전", read: false },
    { id: 3, text: "희귀 난치성 전장유전체(WGS) 데이터셋 사용 권한이 승인되었습니다.", time: "어제", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16 w-full shadow-sm">
      <div className="flex justify-between items-center w-full px-6 md:px-10 h-full max-w-7xl mx-auto">
        
        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center gap-8">
          <div 
            onClick={() => {
              setActiveTab('resources');
              onSearch('');
              setLocalQuery('');
            }}
            className="text-xl md:text-2xl font-bold text-research-navy cursor-pointer tracking-tight whitespace-nowrap flex items-center gap-2"
          >
            NCMIK <span className="font-light text-slate-500">Search Assist</span>
          </div>

          <nav className="hidden md:flex gap-6 h-full items-center">
            <button
              onClick={() => {
                setActiveTab('resources');
                onSearch('');
                setLocalQuery('');
              }}
              className={`pb-1 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'resources' && searchQuery === ''
                  ? 'text-clinical-blue border-clinical-blue'
                  : 'text-slate-500 hover:text-research-navy border-transparent'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => {
                setActiveTab('ai-assist');
                if (!searchQuery) {
                  onSearch('정밀 의료 인공지능 윤리 가이드라인');
                  setLocalQuery('정밀 의료 인공지능 윤리 가이드라인');
                }
              }}
              className={`pb-1 font-semibold text-sm transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'ai-assist' || searchQuery !== ''
                  ? 'text-clinical-blue border-clinical-blue'
                  : 'text-slate-500 hover:text-research-navy border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4 text-ai-accent fill-ai-accent/20" />
              AI Assist
            </button>
            <button
              onClick={() => setActiveTab('my-library')}
              className={`pb-1 font-semibold text-sm transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'my-library'
                  ? 'text-clinical-blue border-clinical-blue'
                  : 'text-slate-500 hover:text-research-navy border-transparent'
              }`}
            >
              My Library
              {savedCount > 0 && (
                <span className="bg-clinical-blue text-white text-[11px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Center: Search input (only visible in secondary layout or right of tabs) */}
        {(activeTab === 'ai-assist' || searchQuery !== '') && (
          <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                className="w-full bg-slate-50 border border-slate-200 focus:border-clinical-blue focus:ring-1 focus:ring-clinical-blue rounded-full px-5 py-1.5 text-sm outline-none transition-all pr-10"
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="정밀 의료 인공지능 윤리 가이드라인..."
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-clinical-blue">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Right Side: Account Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Notifications Notification Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-2">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="font-bold text-sm text-research-navy">센터 알림</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-xs text-clinical-blue hover:underline">모두 읽음</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(noti => (
                    <div key={noti.id} className={`px-4 py-3 border-b border-slate-50 text-xs hover:bg-slate-50 transition-colors ${!noti.read ? 'bg-slate-50/50' : ''}`}>
                      <p className="text-slate-700 leading-relaxed"><span className="font-bold text-slate-900">{noti.text}</span></p>
                      <span className="text-[10px] text-slate-400 block mt-1">{noti.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg transition-all border border-transparent hover:border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center p-0.5 text-research-navy border border-slate-200">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs text-slate-400 block leading-none">위원 연구진</span>
              <span className="font-semibold text-xs text-slate-800 leading-normal">김연구 위원</span>
            </div>
          </div>

          <button 
            onClick={() => alert("로그아웃 되었습니다. (프로토타입)")}
            className="bg-research-navy text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all border border-research-navy flex items-center gap-1 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 py-3 px-6 flex flex-col gap-3 shadow-lg absolute w-full top-16 left-0 z-40 transition-all">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-3">
            <button
              onClick={() => {
                setActiveTab('resources');
                setMobileMenuOpen(false);
              }}
              className={`text-left font-semibold text-sm py-2 ${activeTab === 'resources' ? 'text-clinical-blue' : 'text-slate-600'}`}
            >
              Resources
            </button>
            <button
              onClick={() => {
                setActiveTab('ai-assist');
                if (!searchQuery) {
                  onSearch('정밀 의료 인공지능 윤리 가이드라인');
                }
                setMobileMenuOpen(false);
              }}
              className={`text-left font-semibold text-sm py-2 flex items-center gap-2 ${activeTab === 'ai-assist' ? 'text-clinical-blue' : 'text-slate-600'}`}
            >
              <Sparkles className="w-4 h-4 text-ai-accent" />
              AI Assist
            </button>
            <button
              onClick={() => {
                setActiveTab('my-library');
                setMobileMenuOpen(false);
              }}
              className={`text-left font-semibold text-sm py-2 flex items-center justify-between ${activeTab === 'my-library' ? 'text-clinical-blue' : 'text-slate-600'}`}
            >
              <span>My Library</span>
              <span className="bg-clinical-blue text-white text-xs px-2 py-0.5 rounded-full">{savedCount}</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">위원 연구진</span>
              <span className="font-semibold text-sm text-slate-800">김연구 위원</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
