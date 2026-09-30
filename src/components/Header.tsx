import React from 'react';
import { PenTool, BookOpen, Users, BarChart3, BookmarkCheck, GraduationCap, ShieldCheck } from 'lucide-react';

interface Props {
  activeTab: 'grading' | 'history' | 'analytics' | 'handbook';
  onTabChange: (tab: 'grading' | 'history' | 'analytics' | 'handbook') => void;
  evaluationCount: number;
}

export const Header: React.FC<Props> = ({ activeTab, onTabChange, evaluationCount }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <PenTool className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 truncate tracking-tight">
                  Trợ lý chấm Tiếng Việt tiểu học (Viết & LTVC)
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Chuẩn TT 27/2020
                </span>
              </div>
              <p className="text-xs text-stone-500 truncate hidden sm:block">
                Hỗ trợ cả Tập làm văn & Luyện từ và câu • SGK & SGV Tiếng Việt 5 • Đánh giá định tính
              </p>
            </div>
          </div>

          {/* Quick info tag */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold">
              <GraduationCap className="w-4 h-4 text-amber-700" />
              <span>Lớp 5/2 (42 học sinh) • Năm học 2024 - 2025</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span>{evaluationCount} bài đã nhận xét</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-1 sm:space-x-2 py-2 border-t border-stone-100 no-scrollbar">
          <button
            onClick={() => onTabChange('grading')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-150 ${
              activeTab === 'grading'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Chấm bài mới</span>
          </button>

          <button
            onClick={() => onTabChange('history')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-150 ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Sổ theo dõi & Lịch sử</span>
            {evaluationCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {evaluationCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-150 ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Thống kê chấm bài (Theo bài / Theo tổng)</span>
          </button>

          <button
            onClick={() => onTabChange('handbook')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-150 ${
              activeTab === 'handbook'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cẩm nang & Tiêu chí TT 27</span>
          </button>
        </div>
      </div>
    </header>
  );
};
