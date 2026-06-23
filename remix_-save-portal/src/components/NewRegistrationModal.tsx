import React, { useState } from 'react';
import { ArchiveDocument, VersionInfo } from '../types';
import { X, Check } from 'lucide-react';

interface NewRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (doc: ArchiveDocument) => void;
}

export default function NewRegistrationModal({ isOpen, onClose, onRegister }: NewRegistrationModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('COVID-19');
  const [type, setType] = useState('의료 보고서');
  const [description, setDescription] = useState('');
  const [stability, setStability] = useState(100);
  const [status, setStatus] = useState<'active' | 'archived' | 'obsolete'>('active');
  const [signer, setSigner] = useState('Dr. Aris Thorne');
  const [versionText, setVersionText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !versionText.trim()) {
      alert('모든 필수 항목(제목, 설명, 최초 개정본 내용)을 입력하십시오.');
      return;
    }

    const uniqueId = `ARCH-2026-${category.split('-')[0].substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

    const initialVersion: VersionInfo = {
      id: "v1.0.0",
      label: "v1.0.0 (배포)",
      title: "최초 개정 및 배포 마감",
      date: formattedDate,
      summary: "신규 아카이브 인스턴스를 확보하여 국가 안전보강 체역에 정식 등록 처리함.",
      signer: signer,
      diff: {
        addedCount: 5,
        removedCount: 0,
        lines: [
          { type: 'normal', text: '섹션 1.0: 개결 보고서의 전개' },
          { type: 'add', text: `+ 최초 개정본 기준: ${versionText}` }
        ]
      }
    };

    const newDoc: ArchiveDocument = {
      id: uniqueId,
      title: title,
      description: description,
      currentVersion: "v1.0.0",
      category: category,
      type: type,
      status: status,
      stability: Number(stability),
      lastUpdated: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} 12:00 UTC`,
      authors: [signer, "Admin_User_01"],
      relationships: [],
      versions: [initialVersion]
    };

    onRegister(newDoc);
    
    // Clear state
    setTitle('');
    setDescription('');
    setVersionText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
        
        {/* Header Title */}
        <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">verified_user</span>
            <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-white">
              신규 아카이브 문서 등록 절차
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-white hover:text-red-300 transition-colors p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                재난 아카이브 대분류
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs border border-[#c5c6cf] rounded bg-slate-50 p-2 focus:ring-1 focus:ring-secondary focus:bg-white focus:outline-none"
              >
                <option value="COVID-19">COVID-19</option>
                <option value="MERS">MERS</option>
                <option value="SARS-2003">SARS-2003</option>
                <option value="H1N1">H1N1</option>
                <option value="Ebola">Ebola-WAF</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                문서 종류 형식
              </label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs border border-[#c5c6cf] rounded bg-slate-50 p-2 focus:ring-1 focus:ring-secondary focus:bg-white focus:outline-none"
              >
                <option value="의료 보고서">의료 보고서</option>
                <option value="일반 데이터">일반 데이터</option>
                <option value="PDF, JSON, CSV">PDF, JSON, CSV</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
              문서 제목 (Title) *
            </label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs border border-[#c5c6cf] rounded p-2.5 outline-none focus:ring-1 focus:ring-secondary focus:bg-white"
              placeholder="예: 경과 격리 구역 긴급 가이드라인"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
              임상 보고서 요약 및 세부 설명 (Description) *
            </label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-20 text-xs border border-[#c5c6cf] rounded p-2.5 outline-none focus:ring-1 focus:ring-secondary focus:bg-white resize-none"
              placeholder="해당 아카이브 자료가 커버하는 주된 관측 지표 및 방제 조치 내력을 요약 상신하십시오."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                초기 안정성 지표 (%)
              </label>
              <input 
                type="number" 
                min={1} 
                max={100}
                value={stability}
                onChange={(e) => setStability(Number(e.target.value))}
                className="w-full text-xs border border-[#c5c6cf] rounded p-2 focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                최종 검증관 위임 서명자
              </label>
              <input 
                type="text" 
                value={signer}
                onChange={(e) => setSigner(e.target.value)}
                className="w-full text-xs border border-[#c5c6cf] rounded p-2 focus:ring-1 focus:ring-secondary h-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-red-600 font-extrabold flex items-center gap-1">
              <span>최초 v1.0.0 본문 개정 내용 *</span>
            </label>
            <textarea 
              required
              value={versionText}
              onChange={(e) => setVersionText(e.target.value)}
              className="w-full h-20 text-xs border-2 border-emerald-300 bg-emerald-50/20 rounded p-2.5 outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white resize-none font-mono"
              placeholder="예: 최초 배포에 따른 A등급 음압 카트로 시약 수송 가이드라인 강제 수립."
            />
          </div>

          {/* Form Actions footer */}
          <div className="flex gap-3 justify-end pt-3 border-t border-[#E2E8F0] text-xs">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-[#c5c6cf] hover:bg-slate-50 font-semibold transition-colors rounded-sm cursor-pointer"
            >
              취소
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-primary text-white hover:bg-slate-800 font-semibold transition-colors rounded-sm shadow cursor-pointer"
            >
              국가 대행 등록 상신
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
