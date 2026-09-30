import React, { useState, useEffect } from 'react';
import { EvaluationResult, StudentProfile } from '../types';
import { StorageService } from '../services/api';
import {
  Users,
  Search,
  Filter,
  Trash2,
  Printer,
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  AlertTriangle,
  UserPlus,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { PrintEvaluationSheet } from './PrintEvaluationSheet';

interface Props {
  onSelectStudentForGrading: (studentName: string) => void;
  onHistoryChanged?: () => void;
  onNavigateToAnalytics?: () => void;
}

export const StudentHistoryView: React.FC<Props> = ({
  onSelectStudentForGrading,
  onHistoryChanged,
  onNavigateToAnalytics,
}) => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [history, setHistory] = useState<EvaluationResult[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<'all' | 'viet' | 'ltvc'>('all');
  const [expandedEvalId, setExpandedEvalId] = useState<string | null>(null);
  const [activePrintEval, setActivePrintEval] = useState<EvaluationResult | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showClearModal, setShowClearModal] = useState<boolean>(false);

  // New Student Modal state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentGender, setNewStudentGender] = useState<'Nam' | 'Nữ'>('Nữ');
  const [newStudentBirth, setNewStudentBirth] = useState<string>('');
  const [newStudentNote, setNewStudentNote] = useState<string>('');

  const loadData = () => {
    setStudents(StorageService.getStudents());
    setHistory(StorageService.getHistory());
  };

  const totalEvaluationsCount = history.length;
  const totCount = history.filter((h) => h.muc_do_dat_duoc === 'Hoàn thành tốt').length;
  const htCount = history.filter((h) => h.muc_do_dat_duoc === 'Hoàn thành').length;
  const chuaHtCount = history.filter((h) => h.muc_do_dat_duoc === 'Chưa hoàn thành').length;
  const vietCount = history.filter((h) => h.phan_mon !== 'ltvc').length;
  const ltvcCount = history.filter((h) => h.phan_mon === 'ltvc').length;

  const handleResetClass52 = () => {
    if (confirm('Khôi phục lại danh sách gốc 42 học sinh Lớp 5/2?')) {
      const resetList = StorageService.resetToClass52();
      setStudents(resetList);
      loadData();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa bài nhận xét này khỏi sổ theo dõi?')) {
      StorageService.deleteEvaluation(id);
      loadData();
      onHistoryChanged?.();
    }
  };

  const handleClearAllHistory = () => {
    StorageService.clearAllHistory();
    loadData();
    setShowClearModal(false);
    onHistoryChanged?.();
  };

  const handleResetSampleHistory = () => {
    StorageService.resetToInitialHistory();
    loadData();
    setShowClearModal(false);
    onHistoryChanged?.();
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    StorageService.addStudent({
      ten: newStudentName.trim(),
      lop: '5A',
      gioi_tinh: newStudentGender,
      ghi_chu_hoc_luc: newStudentNote.trim(),
    });
    setNewStudentName('');
    setNewStudentNote('');
    setIsAddStudentOpen(false);
    loadData();
  };

  // Filter evaluations
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.ten_hoc_sinh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.de_bai.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.the_loai_bai_van.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudent =
      selectedStudentFilter === 'all' || item.ten_hoc_sinh.toLowerCase() === selectedStudentFilter.toLowerCase();
    const matchesLevel = levelFilter === 'all' || item.muc_do_dat_duoc === levelFilter;
    const matchesDomain =
      domainFilter === 'all' ||
      (domainFilter === 'ltvc' ? item.phan_mon === 'ltvc' : item.phan_mon !== 'ltvc');
    return matchesSearch && matchesStudent && matchesLevel && matchesDomain;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Stats Overview */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            Sổ theo dõi Lớp 5/2 (42 học sinh)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Danh sách Lớp 5/2 & Lịch sử nhận xét bài viết
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Lưu vết quá trình viết văn, sự khắc phục lỗi chính tả, dùng từ và các mốc tiến bộ của 42 học sinh Lớp 5/2 theo đúng quy định Thông tư 27.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToAnalytics && (
            <button
              type="button"
              onClick={onNavigateToAnalytics}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Xem thống kê chi tiết theo từng bài lưu lại và theo tổng"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Thống kê chấm ({history.length} bài)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetClass52}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition"
            title="Khôi phục danh sách chuẩn 42 học sinh lớp 5/2"
          >
            Đồng bộ 42 HS Lớp 5/2
          </button>
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Xóa toàn bộ lịch sử chấm bài"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa lịch sử ({history.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddStudentOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Thêm học sinh
          </button>
        </div>
      </div>

      {/* View Switcher & Roster Container */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              Danh sách học sinh Lớp 5/2 ({students.length} em)
            </h3>
            {selectedStudentFilter !== 'all' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                Đang lọc: {selectedStudentFilter}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md transition ${
                viewMode === 'table' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
              }`}
            >
              📋 Bảng danh sách chi tiết
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md transition ${
                viewMode === 'cards' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
              }`}
            >
              🗂 Thẻ học sinh
            </button>
          </div>
        </div>

        {/* TABLE VIEW */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-3 text-center w-12">TT</th>
                  <th className="p-3">Họ và tên</th>
                  <th className="p-3 text-center">Ngày sinh</th>
                  <th className="p-3 text-center">Nữ</th>
                  <th className="p-3 text-center">Số bài viết</th>
                  <th className="p-3 text-center">Tỷ lệ Tốt</th>
                  <th className="p-3">Lưu ý rèn luyện</th>
                  <th className="p-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {students.map((student, idx) => {
                  const isSelected = selectedStudentFilter.toLowerCase() === student.ten.toLowerCase();
                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudentFilter(isSelected ? 'all' : student.ten)}
                      className={`cursor-pointer transition hover:bg-stone-50 ${
                        isSelected ? 'bg-emerald-50/80 font-medium' : ''
                      }`}
                    >
                      <td className="p-3 text-center font-bold text-stone-500">
                        {student.so_thu_tu || idx + 1}
                      </td>
                      <td className="p-3 font-bold text-stone-900 text-sm">
                        {student.ten}
                      </td>
                      <td className="p-3 text-center text-stone-600 font-mono">
                        {student.ngay_sinh || '—'}
                      </td>
                      <td className="p-3 text-center">
                        {student.gioi_tinh === 'Nữ' ? (
                          <span className="inline-block w-4 h-4 rounded-full bg-pink-100 text-pink-700 text-center leading-4 font-bold text-[10px]">
                            x
                          </span>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-semibold text-stone-700">
                        {student.so_bai_da_cham} bài
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            student.ti_le_hoan_thanh_tot >= 75
                              ? 'bg-emerald-100 text-emerald-800'
                              : student.ti_le_hoan_thanh_tot > 0
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {student.ti_le_hoan_thanh_tot}%
                        </span>
                      </td>
                      <td className="p-3 text-stone-600 italic max-w-xs truncate">
                        {student.loi_thuong_gap?.[0] || '—'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStudentForGrading(student.ten);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition"
                        >
                          Chấm bài
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* CARDS VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {students.map((student, idx) => {
              const isSelected = selectedStudentFilter.toLowerCase() === student.ten.toLowerCase();
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudentFilter(isSelected ? 'all' : student.ten)}
                  className={`p-4 rounded-xl border transition cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-stone-900 truncate">
                      {student.so_thu_tu ? `${student.so_thu_tu}. ` : `${idx + 1}. `}
                      {student.ten}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        student.gioi_tinh === 'Nữ'
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {student.gioi_tinh}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-stone-500">
                    {student.ngay_sinh && (
                      <div className="flex justify-between">
                        <span>Ngày sinh:</span>
                        <strong className="text-stone-700 font-mono">{student.ngay_sinh}</strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Số bài viết:</span>
                      <strong className="text-stone-700">{student.so_bai_da_cham} bài</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Mức Tốt:</span>
                      <strong className="text-emerald-700">{student.ti_le_hoan_thanh_tot}%</strong>
                    </div>
                  </div>

                  {student.loi_thuong_gap && student.loi_thuong_gap.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 text-[11px]">
                      <span className="text-stone-400 block font-medium">Lưu ý rèn luyện:</span>
                      <p className="text-amber-800 line-clamp-1 italic font-medium">
                        {student.loi_thuong_gap[0]}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudentForGrading(student.ten);
                      }}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
                    >
                      Chấm bài cho em ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên học sinh, đề bài, thể loại..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3">
          <select
            value={selectedStudentFilter}
            onChange={(e) => setSelectedStudentFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="all">Tất cả học sinh</option>
            {students.map((s) => (
              <option key={s.id} value={s.ten}>
                {s.ten}
              </option>
            ))}
          </select>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value as any)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="all">Tất cả phân môn</option>
            <option value="viet">Tập làm văn (Viết)</option>
            <option value="ltvc">Luyện từ và câu</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="all">Mọi mức độ</option>
            <option value="Hoàn thành tốt">★ Hoàn thành tốt</option>
            <option value="Hoàn thành">✓ Hoàn thành</option>
            <option value="Chưa hoàn thành">▲ Cần cố gắng</option>
          </select>

          {(selectedStudentFilter !== 'all' || levelFilter !== 'all' || domainFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedStudentFilter('all');
                setLevelFilter('all');
                setDomainFilter('all');
                setSearchTerm('');
              }}
              className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary Stats Bar */}
      {totalEvaluationsCount > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div>
              <span className="text-stone-500 block text-[11px] font-medium">Tổng số bài đã chấm:</span>
              <strong className="text-base text-stone-900 font-extrabold">{totalEvaluationsCount} bài</strong>
            </div>
            <div className="h-7 w-px bg-stone-200 hidden sm:block" />
            <div>
              <span className="text-stone-500 block text-[11px] font-medium">Mức độ đạt được:</span>
              <div className="flex items-center gap-1.5 font-bold mt-0.5">
                <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">Tốt: {totCount}</span>
                <span className="text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">HT: {htCount}</span>
                {chuaHtCount > 0 && (
                  <span className="text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">Chưa HT: {chuaHtCount}</span>
                )}
              </div>
            </div>
            <div className="h-7 w-px bg-stone-200 hidden sm:block" />
            <div>
              <span className="text-stone-500 block text-[11px] font-medium">Theo phân môn:</span>
              <div className="flex items-center gap-1.5 font-semibold mt-0.5 text-stone-700">
                <span>Viết: <strong>{vietCount}</strong></span>
                <span>•</span>
                <span>LTVC: <strong>{ltvcCount}</strong></span>
              </div>
            </div>
          </div>

          {onNavigateToAnalytics && (
            <button
              type="button"
              onClick={onNavigateToAnalytics}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <span>Xem phân tích chi tiết theo từng đề bài & tổng</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* History Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
          <span>Danh sách bài viết đã nhận xét ({filteredHistory.length} bài)</span>
          <span>Theo dõi theo Thông tư 27/2020</span>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300 text-stone-500 space-y-2">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-sm font-semibold">Chưa có bài viết nào phù hợp bộ lọc.</p>
            <p className="text-xs">Hãy chuyển qua tab "Chấm bài mới" để nhận xét bài làm của học sinh.</p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isExpanded = expandedEvalId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition overflow-hidden"
              >
                {/* Item Summary Header */}
                <div
                  onClick={() => setExpandedEvalId(isExpanded ? null : item.id)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 select-none"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        item.muc_do_dat_duoc === 'Hoàn thành tốt'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : item.muc_do_dat_duoc === 'Hoàn thành'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {item.muc_do_dat_duoc === 'Hoàn thành tốt' ? 'T' : item.muc_do_dat_duoc === 'Hoàn thành' ? 'H' : 'C'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm sm:text-base">{item.ten_hoc_sinh}</h4>
                        {item.phan_mon === 'ltvc' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold border border-blue-200">
                            LTVC
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200">
                            Tập làm văn
                          </span>
                        )}
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                          {item.the_loai_bai_van}
                        </span>
                        <span className="text-xs text-stone-400">• Lớp {item.lop}A</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-1 italic">
                        "{item.de_bai}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.ngay_tao).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                        {item.muc_do_dat_duoc}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePrintEval(item);
                      }}
                      title="In phiếu nhận xét"
                      className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Xóa bài nhận xét"
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="p-1 text-stone-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Full Details */}
                {isExpanded && (
                  <div className="p-6 bg-stone-50/70 border-t border-stone-200 space-y-4 text-xs sm:text-sm">
                    {/* Bài làm học sinh */}
                    <div className="bg-white p-4 rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-800 text-xs uppercase block mb-1.5">
                        Bài viết của học sinh:
                      </span>
                      <p className="text-stone-800 font-['Be_Vietnam_Pro'] leading-relaxed whitespace-pre-line text-justify text-xs sm:text-sm">
                        {item.noi_dung_bai_viet}
                      </p>
                    </div>

                    {/* Feedback Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-900 block mb-1">
                          ✓ Ưu điểm nổi bật:
                        </span>
                        <p className="text-stone-800 leading-relaxed text-xs sm:text-sm">{item.uu_diem_noi_bat}</p>
                      </div>

                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                        <span className="font-bold text-amber-950 block mb-1">
                          ▲ Hạn chế & Hướng khắc phục:
                        </span>
                        <p className="text-stone-800 leading-relaxed text-xs sm:text-sm">{item.han_che_can_sua}</p>
                      </div>
                    </div>

                    {/* LTVC question check table if available */}
                    {item.ket_qua_tung_cau && item.ket_qua_tung_cau.length > 0 && (
                      <div className="bg-white p-4 rounded-xl border border-blue-200 space-y-2">
                        <span className="font-bold text-blue-900 text-xs uppercase block flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          Kết quả chấm chi tiết từng câu Luyện từ và câu ({item.ket_qua_tung_cau.length} câu):
                        </span>
                        <div className="space-y-2">
                          {item.ket_qua_tung_cau.map((q, qIdx) => (
                            <div key={qIdx} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-stone-800">{q.cau_so}: {q.yeu_cau}</span>
                                <span
                                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                    q.ket_qua === 'Đúng'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : q.ket_qua === 'Đúng một phần'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {q.ket_qua}
                                </span>
                              </div>
                              <p className="text-stone-700 italic">
                                Học sinh: "{q.bai_lam_hoc_sinh || (q as any).tra_loi_hoc_sinh || ''}"
                              </p>
                              <p className="text-emerald-950 font-medium">
                                Đáp án chuẩn: {q.dap_an_chuan}
                              </p>
                              {q.nhan_xet_chi_tiet && (
                                <p className="text-blue-900 text-[11px] italic">
                                  Ghi chú: {q.nhan_xet_chi_tiet}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sổ theo dõi & Lời phê */}
                    <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-900 block mb-1 text-xs uppercase">
                        Lời nhận xét sổ theo dõi:
                      </span>
                      <p className="italic text-stone-800 leading-relaxed">
                        "{item.loi_nhan_xet_so_theo_doi}"
                      </p>
                    </div>

                    {/* Spelling errors list if any */}
                    {item.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi &&
                      item.danh_gia_chi_tiet.chinh_ta_va_dat_cau.danh_sach_loi.length > 0 && (
                        <div className="bg-white p-3.5 rounded-xl border border-red-200">
                          <span className="font-bold text-red-900 block mb-1 text-xs">
                            Các lỗi chính tả / dùng từ cần chú ý:
                          </span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.danh_gia_chi_tiet.chinh_ta_va_dat_cau.danh_sach_loi.map((err, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs"
                              >
                                <span className="line-through">{err.tu_hoac_cau_sai}</span> ➔{' '}
                                <strong className="text-emerald-700">{err.sua_lai}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Actions */}
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActivePrintEval(item)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        In phiếu nhận xét này
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateStudent}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                Thêm học sinh vào danh sách lớp
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Họ và tên học sinh</label>
              <input
                type="text"
                required
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Ví dụ: Lê Bảo Hân"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Ngày sinh (dd/mm/yyyy)</label>
                <input
                  type="text"
                  value={newStudentBirth}
                  onChange={(e) => setNewStudentBirth(e.target.value)}
                  placeholder="Ví dụ: 15/6/2016"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Giới tính</label>
                <div className="flex gap-4 pt-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={newStudentGender === 'Nữ'}
                      onChange={() => setNewStudentGender('Nữ')}
                    />
                    <span>Nữ</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={newStudentGender === 'Nam'}
                      onChange={() => setNewStudentGender('Nam')}
                    />
                    <span>Nam</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Ghi chú học lực / thói quen viết văn
              </label>
              <input
                type="text"
                value={newStudentNote}
                onChange={(e) => setNewStudentNote(e.target.value)}
                placeholder="VD: Cần rèn chữ, ý văn sáng tạo, hay viết tắt..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-700 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Lưu học sinh
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clear History Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-stone-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Quản lý & Xóa lịch sử chấm bài</h3>
                <p className="text-xs text-stone-500">Lớp 5/2 • Hiện có {history.length} bài đã lưu</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Bạn có thể xóa sạch lịch sử bài làm để bắt đầu đợt chấm bài mới hoặc khôi phục lại dữ liệu mẫu ban đầu của Lớp 5/2.
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleClearAllHistory}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Xóa sạch toàn bộ ({history.length} bài về 0)
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
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Sheet Modal */}
      {activePrintEval && (
        <PrintEvaluationSheet evaluation={activePrintEval} onClose={() => setActivePrintEval(null)} />
      )}
    </div>
  );
};
