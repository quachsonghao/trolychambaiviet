import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/api';
import {
  TotalOverallStats,
  AssignmentStats,
  EvaluationResult,
} from '../types';
import {
  BarChart3,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  Sparkles,
  BookOpen,
  Layers,
  Trash2,
  Printer,
  RefreshCw,
  Users,
  Search,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  PenLine,
  UserCheck,
  UserX,
  FileText,
  Calendar,
} from 'lucide-react';
import { PrintEvaluationSheet } from './PrintEvaluationSheet';

interface Props {
  onSelectStudentForGrading?: (studentName: string) => void;
  onHistoryChanged?: () => void;
  onNavigateToHistory?: () => void;
}

export const ErrorAnalyticsView: React.FC<Props> = ({
  onSelectStudentForGrading,
  onHistoryChanged,
  onNavigateToHistory,
}) => {
  // Main view tab: 'overall' (Thống kê theo tổng) vs 'by_assignment' (Thống kê theo bài lưu lại)
  const [viewTab, setViewTab] = useState<'overall' | 'by_assignment'>('overall');

  // Stats data states
  const [overallStats, setOverallStats] = useState<TotalOverallStats>(
    StorageService.getTotalOverallStats()
  );
  const [assignmentStatsList, setAssignmentStatsList] = useState<AssignmentStats[]>(
    StorageService.getStatsByAssignment()
  );

  // Filters for by-assignment tab
  const [assignmentDomainFilter, setAssignmentDomainFilter] = useState<'all' | 'viet' | 'ltvc'>('all');
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState<string>('');
  const [expandedAssignmentKey, setExpandedAssignmentKey] = useState<string | null>(null);
  const [assignmentStudentSubTab, setAssignmentStudentSubTab] = useState<Record<string, 'graded' | 'not_graded'>>({});

  // Modals
  const [showClearHistoryModal, setShowClearHistoryModal] = useState<boolean>(false);
  const [activePrintEval, setActivePrintEval] = useState<EvaluationResult | null>(null);
  const [evalToDelete, setEvalToDelete] = useState<{ id: string; studentName: string } | null>(null);

  const reloadData = () => {
    setOverallStats(StorageService.getTotalOverallStats());
    setAssignmentStatsList(StorageService.getStatsByAssignment());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleClearAllHistory = () => {
    StorageService.clearAllHistory();
    reloadData();
    setShowClearHistoryModal(false);
    onHistoryChanged?.();
  };

  const handleResetSampleHistory = () => {
    StorageService.resetToInitialHistory();
    reloadData();
    setShowClearHistoryModal(false);
    onHistoryChanged?.();
  };

  const handleConfirmDeleteSingleEval = () => {
    if (!evalToDelete) return;
    StorageService.deleteEvaluation(evalToDelete.id);
    reloadData();
    onHistoryChanged?.();
    setEvalToDelete(null);
  };

  const handleDeleteSingleEval = (evalId: string, studentName: string) => {
    setEvalToDelete({ id: evalId, studentName });
  };

  const handlePrintSingleEval = (evalId: string) => {
    const history = StorageService.getHistory();
    const found = history.find((h) => h.id === evalId);
    if (found) {
      setActivePrintEval(found);
    }
  };

  // Filtered assignments
  const filteredAssignments = assignmentStatsList.filter((item) => {
    const matchesDomain =
      assignmentDomainFilter === 'all' || item.phan_mon === assignmentDomainFilter;
    const matchesSearch =
      item.bai_hoc.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      item.de_bai.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      item.the_loai_bai_van.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      item.chu_diem.toLowerCase().includes(assignmentSearchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Tab Switcher */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Báo cáo & Thống kê sư phạm Lớp 5/2
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Trung tâm Thống kê & Phân tích kết quả chấm bài
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Thống kê toàn diện theo tổng quan toàn lớp hoặc theo dõi chi tiết tiến độ từng bài học, bài tập Luyện từ & câu đã lưu theo Thông tư 27/2020/TT-BGDĐT.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigateToHistory && (
              <button
                type="button"
                onClick={onNavigateToHistory}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Mở Sổ theo dõi Lớp 5/2"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Sổ theo dõi & Lịch sử HS</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="In báo cáo thống kê"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In báo cáo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearHistoryModal(true)}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Xóa toàn bộ lịch sử chấm bài"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa lịch sử chấm ({overallStats.totalEvaluations})</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: THỐNG KÊ THEO TỔNG vs THỐNG KÊ THEO BÀI */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-stone-100 mt-6">
          <button
            type="button"
            onClick={() => setViewTab('overall')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              viewTab === 'overall'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>1. Thống kê theo tổng (Toàn diện {overallStats.totalEvaluations} bài)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewTab('by_assignment')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              viewTab === 'by_assignment'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Thống kê theo bài lưu lại ({assignmentStatsList.length} đề bài)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: THỐNG KÊ THEO TỔNG (OVERALL TOTAL STATS)           */}
      {/* ======================================================== */}
      {viewTab === 'overall' && (
        <div className="space-y-8">
          {/* Row 1: KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Evaluations */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                <span>Tổng số bài đã chấm</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-stone-900">
                {overallStats.totalEvaluations}{' '}
                <span className="text-xs font-normal text-stone-500">lượt bài</span>
              </div>
              <div className="flex items-center gap-2 text-xs pt-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Viết: {overallStats.byDomain.viet}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold border border-blue-200">
                  LTVC: {overallStats.byDomain.ltvc}
                </span>
              </div>
            </div>

            {/* Card 2: Student Coverage */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                <span>Bao phủ học sinh Lớp 5/2</span>
                <Users className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-3xl font-extrabold text-stone-900">
                {overallStats.studentsEvaluatedCount} / {overallStats.totalStudents}{' '}
                <span className="text-xs font-normal text-stone-500">em</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${overallStats.coveragePercent}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500">
                Đạt <strong>{overallStats.coveragePercent}%</strong> học sinh đã có bài nhận xét.
              </p>
            </div>

            {/* Card 3: Quality Rate */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span>Mức Hoàn thành tốt (T)</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-700">
                {overallStats.levelsPercent.tot}%{' '}
                <span className="text-xs font-normal text-stone-500">
                  ({overallStats.levels.tot} bài)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                <span className="text-blue-700 font-semibold">H: {overallStats.levels.hoanThanh} bài</span>
                <span>•</span>
                <span className="text-amber-700 font-semibold">C: {overallStats.levels.chuaHoanThanh} bài</span>
              </div>
            </div>

            {/* Card 4: Total Errors spotted */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900 uppercase tracking-wider">
                <span>Lỗi đã phát hiện & sửa</span>
                <AlertOctagon className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-extrabold text-stone-900">
                {overallStats.totalErrorsFound}{' '}
                <span className="text-xs font-normal text-stone-500">lỗi</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Trung bình{' '}
                <strong>
                  {overallStats.totalEvaluations > 0
                    ? (overallStats.totalErrorsFound / overallStats.totalEvaluations).toFixed(1)
                    : 0}
                </strong>{' '}
                lỗi/bài viết được chỉ dẫn sửa cụ thể.
              </p>
            </div>
          </div>

          {/* Row 2: Achievement Level Breakdown Bar & Quality Details */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tổng hợp chất lượng học tập theo chuẩn Thông tư 27/2020/TT-BGDĐT
              </h3>
              <span className="text-xs text-stone-500">
                Tổng cộng {overallStats.totalEvaluations} lượt bài đã lưu
              </span>
            </div>

            {/* Combined Bar */}
            <div className="w-full bg-stone-100 rounded-2xl h-4 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${overallStats.levelsPercent.tot}%` }}
                title={`Hoàn thành tốt: ${overallStats.levels.tot} bài (${overallStats.levelsPercent.tot}%)`}
              />
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${overallStats.levelsPercent.hoanThanh}%` }}
                title={`Hoàn thành: ${overallStats.levels.hoanThanh} bài (${overallStats.levelsPercent.hoanThanh}%)`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${overallStats.levelsPercent.chuaHoanThanh}%` }}
                title={`Chưa hoàn thành: ${overallStats.levels.chuaHoanThanh} bài (${overallStats.levelsPercent.chuaHoanThanh}%)`}
              />
            </div>

            {/* 3 Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">★ Hoàn thành tốt (T)</span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    {overallStats.levelsPercent.tot}%
                  </span>
                </div>
                <div className="text-xl font-bold text-stone-900">{overallStats.levels.tot} bài</div>
                <p className="text-[11px] text-stone-600">
                  Bài viết sáng tạo, cảm xúc chân thực, câu văn gãy gọn hoặc làm đúng trọn vẹn bài LTVC.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">✓ Hoàn thành (H)</span>
                  <span className="text-sm font-extrabold text-blue-700">
                    {overallStats.levelsPercent.hoanThanh}%
                  </span>
                </div>
                <div className="text-xl font-bold text-stone-900">
                  {overallStats.levels.hoanThanh} bài
                </div>
                <p className="text-[11px] text-stone-600">
                  Đủ ý, bám sát yêu cầu đề bài, mắc một vài lỗi chính tả hoặc dùng từ nhỏ đã được chỉ ra.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">▲ Cần cố gắng (C)</span>
                  <span className="text-sm font-extrabold text-amber-700">
                    {overallStats.levelsPercent.chuaHoanThanh}%
                  </span>
                </div>
                <div className="text-xl font-bold text-stone-900">
                  {overallStats.levels.chuaHoanThanh} bài
                </div>
                <p className="text-[11px] text-stone-600">
                  Cần giáo viên kèm cặp thêm về câu què, thiếu Chủ ngữ - Vị ngữ hoặc nhầm lẫn kiến thức LTVC.
                </p>
              </div>
            </div>
          </div>

          {/* Row 3: Error Category Breakdown & Top Common Misspelled Words */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 6 cols: Error Category Breakdown */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                Phân loại lỗi thường gặp nhất trong lớp ({overallStats.totalErrorsFound} lỗi)
              </h3>

              <div className="space-y-3 pt-2">
                {Object.entries(overallStats.errorCategoryCount).map(([cat, count]) => {
                  const maxVal = Math.max(...Object.values(overallStats.errorCategoryCount), 1);
                  const barWidth = Math.round((count / maxVal) * 100);
                  const catPercent =
                    overallStats.totalErrorsFound > 0
                      ? Math.round((count / overallStats.totalErrorsFound) * 100)
                      : 0;

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-stone-700 font-bold">{cat}</span>
                        <span className="text-stone-600">
                          <strong>{count}</strong> lần ({catPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            cat === 'Chính tả'
                              ? 'bg-red-500'
                              : cat === 'Dùng từ'
                              ? 'bg-amber-500'
                              : cat === 'Đặt câu'
                              ? 'bg-blue-500'
                              : 'bg-purple-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LTVC Question Evaluation Stats if any */}
              {overallStats.ltvcQuestionsStats &&
                overallStats.ltvcQuestionsStats.totalQuestions > 0 && (
                  <div className="mt-4 p-4 bg-blue-50/40 rounded-xl border border-blue-200 space-y-2">
                    <span className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Kết quả câu hỏi Luyện từ và câu ({overallStats.ltvcQuestionsStats.totalQuestions} câu đã chấm):
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                        ✓ Đúng: {overallStats.ltvcQuestionsStats.dung} câu ({overallStats.ltvcQuestionsStats.dungPercent}%)
                      </span>
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-lg font-bold">
                        • Đúng 1 phần: {overallStats.ltvcQuestionsStats.dungMotPhan}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-lg font-bold">
                        ✕ Chưa đúng: {overallStats.ltvcQuestionsStats.chuaDung}
                      </span>
                    </div>
                  </div>
                )}
            </div>

            {/* Right 6 cols: Top Common Misspelled Words & Pedagogical Insights */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Danh sách từ ngữ học sinh hay viết sai (Cần sửa chung trên lớp)
              </h3>

              {overallStats.topCommonErrors.length > 0 ? (
                <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
                  {overallStats.topCommonErrors.map(([errStr, count], idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="text-stone-800 font-medium">{errStr}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-semibold text-[11px] border border-red-100">
                        {count} lần
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic py-4">Chưa có đủ dữ liệu lỗi cụ thể.</p>
              )}

              {/* Remedial Pedagogical Tips */}
              <div className="pt-2 border-t border-stone-100">
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    Định hướng tiết Luyện từ và câu tiếp theo:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-stone-700 pl-1 leading-relaxed">
                    <li>Rèn phân biệt các cặp phụ âm đầu dễ lẫn (s/x, tr/ch, d/gi/r).</li>
                    <li>Luyện tập nối câu ghép bằng kết từ và cặp từ hô ứng (SGK Tiếng Việt 5).</li>
                    <li>Sửa triệt để lỗi câu què thiếu Chủ ngữ hoặc thiếu dấu ngắt câu.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: THỐNG KÊ THEO BÀI LƯU LẠI (BY ASSIGNMENT)         */}
      {/* ======================================================== */}
      {viewTab === 'by_assignment' && (
        <div className="space-y-6">
          {/* Filter & Search Bar for Assignments */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={assignmentSearchTerm}
                onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                placeholder="Tìm theo tên bài học, đề bài, chủ điểm..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {/* Domain Filter Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAssignmentDomainFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  assignmentDomainFilter === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Tất cả ({assignmentStatsList.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignmentDomainFilter('viet')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  assignmentDomainFilter === 'viet'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Tập làm văn ({assignmentStatsList.filter((a) => a.phan_mon !== 'ltvc').length})
              </button>
              <button
                type="button"
                onClick={() => setAssignmentDomainFilter('ltvc')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  assignmentDomainFilter === 'ltvc'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Luyện từ & câu ({assignmentStatsList.filter((a) => a.phan_mon === 'ltvc').length})
              </button>
            </div>
          </div>

          {/* List of Assignment Stats Cards */}
          {filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300 text-stone-500 space-y-2">
              <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm font-semibold">Chưa có bài nào phù hợp bộ lọc.</p>
              <p className="text-xs">
                Khi bạn chấm bài và bấm "Duyệt & Lưu vào Sổ", hệ thống sẽ tự động tổng hợp thống kê chi tiết từng bài tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredAssignments.map((assignment, aIdx) => {
                const isExpanded = expandedAssignmentKey === assignment.key;
                const subTab = assignmentStudentSubTab[assignment.key] || 'graded';

                return (
                  <div
                    key={assignment.key}
                    className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition overflow-hidden"
                  >
                    {/* Assignment Header Card */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Title & Badges */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                                assignment.phan_mon === 'ltvc'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}
                            >
                              {assignment.phan_mon === 'ltvc' ? 'Luyện từ & câu 5' : 'Tập làm văn 5'}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold">
                              {assignment.the_loai_bai_van}
                            </span>
                            <span className="text-xs text-stone-400">• {assignment.chu_diem}</span>
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-stone-900">
                            {assignment.bai_hoc}
                          </h4>
                          <p className="text-xs text-stone-600 italic bg-stone-50 p-2 rounded-lg border border-stone-200 leading-relaxed">
                            Đề bài: "{assignment.de_bai}"
                          </p>
                        </div>

                        {/* Expand / Collapse Button */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedAssignmentKey(isExpanded ? null : assignment.key)
                          }
                          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition text-stone-700 cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              <span>Thu gọn</span>
                              <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>Chi tiết ({assignment.totalEvaluated} HS đã chấm)</span>
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Progress & Quality Metrics Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                        {/* Progress */}
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-stone-700">
                            <span>Tiến độ chấm lớp 5/2:</span>
                            <span className="font-extrabold text-emerald-700">
                              {assignment.totalEvaluated} / {assignment.totalClassStudents} em
                            </span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${assignment.completionRate}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-stone-500 text-right">
                            Đã chấm {assignment.completionRate}%
                          </p>
                        </div>

                        {/* Good (T) */}
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-emerald-900 block">
                              ★ Hoàn thành tốt (T)
                            </span>
                            <span className="text-xl font-extrabold text-emerald-700">
                              {assignment.levels.tot}{' '}
                              <span className="text-xs font-normal text-stone-500">bài</span>
                            </span>
                          </div>
                          <span className="text-sm font-bold text-emerald-800">
                            {assignment.levelsPercent.tot}%
                          </span>
                        </div>

                        {/* Completed (H) */}
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-blue-900 block">
                              ✓ Hoàn thành (H)
                            </span>
                            <span className="text-xl font-extrabold text-blue-700">
                              {assignment.levels.hoanThanh}{' '}
                              <span className="text-xs font-normal text-stone-500">bài</span>
                            </span>
                          </div>
                          <span className="text-sm font-bold text-blue-800">
                            {assignment.levelsPercent.hoanThanh}%
                          </span>
                        </div>

                        {/* Needs Improvement (C) */}
                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-amber-900 block">
                              ▲ Cần cố gắng (C)
                            </span>
                            <span className="text-xl font-extrabold text-amber-700">
                              {assignment.levels.chuaHoanThanh}{' '}
                              <span className="text-xs font-normal text-stone-500">bài</span>
                            </span>
                          </div>
                          <span className="text-sm font-bold text-amber-800">
                            {assignment.levelsPercent.chuaHoanThanh}%
                          </span>
                        </div>
                      </div>

                      {/* Top errors in this assignment */}
                      {assignment.topErrorsInAssignment.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-stone-600">Lỗi hay mắc trong bài này:</span>
                          {assignment.topErrorsInAssignment.map(([err, count], idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-red-50 text-red-800 border border-red-200 text-[11px]"
                            >
                              {err} ({count} lần)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* EXPANDED SECTION: STUDENTS GRADED & STUDENTS NOT YET GRADED */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 bg-stone-50/70 border-t border-stone-200 space-y-4">
                        {/* Sub tabs: Graded vs Not Graded */}
                        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
                          <button
                            type="button"
                            onClick={() =>
                              setAssignmentStudentSubTab((prev) => ({
                                ...prev,
                                [assignment.key]: 'graded',
                              }))
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              subTab === 'graded'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Đã chấm ({assignment.gradedStudents.length} em)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setAssignmentStudentSubTab((prev) => ({
                                ...prev,
                                [assignment.key]: 'not_graded',
                              }))
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              subTab === 'not_graded'
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Chưa chấm ({assignment.notGradedStudents.length} em)</span>
                          </button>
                        </div>

                        {/* SUBTAB 1: GRADED STUDENTS LIST */}
                        {subTab === 'graded' && (
                          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider">
                                <tr>
                                  <th className="p-2.5 text-center w-12">STT</th>
                                  <th className="p-2.5">Học sinh</th>
                                  <th className="p-2.5 text-center w-28">Mức đạt được</th>
                                  <th className="p-2.5">Lời nhận xét vào sổ theo dõi</th>
                                  <th className="p-2.5 text-center w-20">Số lỗi</th>
                                  <th className="p-2.5 text-center w-28">Ngày chấm</th>
                                  <th className="p-2.5 text-center w-24">Thao tác</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100">
                                {assignment.gradedStudents.map((gs, idx) => (
                                  <tr key={gs.evalId} className="hover:bg-stone-50/80 transition">
                                    <td className="p-2.5 text-center font-bold text-stone-500">
                                      {idx + 1}
                                    </td>
                                    <td className="p-2.5 font-bold text-stone-900">{gs.studentName}</td>
                                    <td className="p-2.5 text-center">
                                      <span
                                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                          gs.muc_do_dat_duoc === 'Hoàn thành tốt'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : gs.muc_do_dat_duoc === 'Hoàn thành'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-amber-100 text-amber-800'
                                        }`}
                                      >
                                        {gs.muc_do_dat_duoc}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-stone-700 italic max-w-sm truncate">
                                      "{gs.loi_nhan_xet_so_theo_doi}"
                                    </td>
                                    <td className="p-2.5 text-center">
                                      {gs.so_loi > 0 ? (
                                        <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-md font-bold text-[10px]">
                                          {gs.so_loi} lỗi
                                        </span>
                                      ) : (
                                        <span className="text-emerald-700 font-bold text-[10px]">0 lỗi</span>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-center text-stone-500">
                                      {new Date(gs.ngay_tao).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-2.5 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handlePrintSingleEval(gs.evalId)}
                                          className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                                          title="In phiếu nhận xét"
                                        >
                                          <Printer className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteSingleEval(gs.evalId, gs.studentName)}
                                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                          title="Xóa bài nhận xét này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* SUBTAB 2: NOT GRADED STUDENTS IN CLASS 5/2 */}
                        {subTab === 'not_graded' && (
                          <div className="space-y-3">
                            <p className="text-xs text-stone-600">
                              Danh sách <strong>{assignment.notGradedStudents.length} học sinh</strong> trong Lớp 5/2 chưa được chấm bài này:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                              {assignment.notGradedStudents.map((s) => (
                                <div
                                  key={s.id}
                                  className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs hover:border-emerald-400 transition"
                                >
                                  <div>
                                    <span className="text-stone-400 font-mono text-[10px] mr-1">
                                      {s.so_thu_tu ? `${String(s.so_thu_tu).padStart(2, '0')}.` : ''}
                                    </span>
                                    <strong className="text-stone-800">{s.ten}</strong>
                                  </div>
                                  {onSelectStudentForGrading && (
                                    <button
                                      type="button"
                                      onClick={() => onSelectStudentForGrading(s.ten)}
                                      className="text-[11px] text-emerald-600 hover:text-emerald-800 font-bold ml-1"
                                      title={`Chấm bài ${assignment.bai_hoc} cho em ${s.ten}`}
                                    >
                                      Chấm ➔
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Clear History Modal */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-stone-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Quản lý & Xóa lịch sử chấm bài</h3>
                <p className="text-xs text-stone-500">
                  Lớp 5/2 • Hiện có {overallStats.totalEvaluations} bài đã lưu
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Bạn có thể xóa sạch lịch sử nhận xét để bắt đầu đợt chấm bài mới hoặc khôi phục lại dữ liệu mẫu ban đầu của Lớp 5/2.
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleClearAllHistory}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Xóa sạch toàn bộ ({overallStats.totalEvaluations} bài về 0)
              </button>

              <button
                type="button"
                onClick={handleResetSampleHistory}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Khôi phục dữ liệu mẫu ban đầu (2 bài mẫu)
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowClearHistoryModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Evaluation Modal */}
      {evalToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-stone-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Xác nhận xóa bài nhận xét</h3>
                <p className="text-xs text-stone-500">Học sinh: {evalToDelete.studentName}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài nhận xét của học sinh <strong>"{evalToDelete.studentName}"</strong> khỏi đề bài này?
            </p>

            <div className="pt-2 flex justify-end gap-2.5 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setEvalToDelete(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSingleEval}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Xóa bài này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Sheet Modal if triggered */}
      {activePrintEval && (
        <PrintEvaluationSheet evaluation={activePrintEval} onClose={() => setActivePrintEval(null)} />
      )}
    </div>
  );
};
