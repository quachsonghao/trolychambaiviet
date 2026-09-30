import React, { useState, useMemo } from 'react';
import {
  BookmarkCheck,
  Search,
  Filter,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Printer,
  Sparkles,
  BookOpen,
  Tag,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ClipboardList,
  Compass,
} from 'lucide-react';
import { CommentBankItem } from '../types';
import { StorageService } from '../services/api';

interface Props {
  onSelectCommentForGrading?: (comment: CommentBankItem) => void;
}

export const CommentBankView: React.FC<Props> = ({ onSelectCommentForGrading }) => {
  const [items, setItems] = useState<CommentBankItem[]>(() => StorageService.getCommentBank());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'all' | 'viet' | 'ltvc'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'Hoàn thành tốt' | 'Hoàn thành' | 'Chưa hoàn thành'>('all');
  const [selectedTheLoai, setSelectedTheLoai] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal State for adding/editing custom comment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CommentBankItem | null>(null);
  const [formPhanMon, setFormPhanMon] = useState<'viet' | 'ltvc'>('viet');
  const [formTheLoai, setFormTheLoai] = useState('Tả phong cảnh');
  const [formTinhHuong, setFormTinhHuong] = useState('');
  const [formMoTa, setFormMoTa] = useState('');
  const [formMucDo, setFormMucDo] = useState<'Hoàn thành tốt' | 'Hoàn thành' | 'Chưa hoàn thành'>('Hoàn thành');
  const [formLoiVaoVo, setFormLoiVaoVo] = useState('');
  const [formLoiSoTheoDoi, setFormLoiSoTheoDoi] = useState('');
  const [formBienPhap, setFormBienPhap] = useState('');
  const [formTags, setFormTags] = useState('');

  // Extract unique theLoai categories
  const allTheLoai = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.theLoai) set.add(it.theLoai);
    });
    return Array.from(set);
  }, [items]);

  // Filtered comments
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      // Domain filter
      if (selectedDomain !== 'all' && it.phanMon !== selectedDomain) return false;
      // Level filter
      if (selectedLevel !== 'all' && it.mucDo !== selectedLevel) return false;
      // The loai filter
      if (selectedTheLoai !== 'all' && it.theLoai !== selectedTheLoai) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = it.tinhHuong.toLowerCase().includes(q);
        const matchMoTa = it.moTaTinhHuong.toLowerCase().includes(q);
        const matchVo = it.loiNhanXetVaoVo.toLowerCase().includes(q);
        const matchSo = it.loiNhanXetSoTheoDoi.toLowerCase().includes(q);
        const matchTheLoai = it.theLoai.toLowerCase().includes(q);
        const matchTags = it.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchMoTa && !matchVo && !matchSo && !matchTheLoai && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedDomain, selectedLevel, selectedTheLoai, searchQuery]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Open modal for new comment
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormPhanMon('viet');
    setFormTheLoai('Tả phong cảnh');
    setFormTinhHuong('');
    setFormMoTa('');
    setFormMucDo('Hoàn thành');
    setFormLoiVaoVo('');
    setFormLoiSoTheoDoi('');
    setFormBienPhap('');
    setFormTags('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (item: CommentBankItem) => {
    setEditingItem(item);
    setFormPhanMon(itPhanMon(item.phanMon));
    setFormTheLoai(item.theLoai);
    setFormTinhHuong(item.tinhHuong);
    setFormMoTa(item.moTaTinhHuong);
    setFormMucDo(item.mucDo);
    setFormLoiVaoVo(item.loiNhanXetVaoVo);
    setFormLoiSoTheoDoi(item.loiNhanXetSoTheoDoi);
    setFormBienPhap(item.bienPhapKhacPhuc);
    setFormTags(item.tags.join(', '));
    setIsModalOpen(true);
  };

  const itPhanMon = (p: string): 'viet' | 'ltvc' => (p === 'ltvc' ? 'ltvc' : 'viet');

  // Save comment (add or update)
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTinhHuong.trim() || !formLoiVaoVo.trim()) {
      alert('Vui lòng nhập Tên tình huống và Lời nhận xét vào vở!');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingItem) {
      StorageService.updateComment(editingItem.id, {
        phanMon: formPhanMon,
        theLoai: formTheLoai,
        tinhHuong: formTinhHuong.trim(),
        moTaTinhHuong: formMoTa.trim(),
        mucDo: formMucDo,
        loiNhanXetVaoVo: formLoiVaoVo.trim(),
        loiNhanXetSoTheoDoi: formLoiSoTheoDoi.trim(),
        bienPhapKhacPhuc: formBienPhap.trim(),
        tags: tagsArray,
      });
    } else {
      StorageService.saveCustomComment({
        phanMon: formPhanMon,
        theLoai: formTheLoai,
        tinhHuong: formTinhHuong.trim(),
        moTaTinhHuong: formMoTa.trim(),
        mucDo: formMucDo,
        loiNhanXetVaoVo: formLoiVaoVo.trim(),
        loiNhanXetSoTheoDoi: formLoiSoTheoDoi.trim(),
        bienPhapKhacPhuc: formBienPhap.trim(),
        tags: tagsArray,
      });
    }

    setItems(StorageService.getCommentBank());
    setIsModalOpen(false);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa mẫu nhận xét này khỏi ngân hàng?')) {
      StorageService.deleteComment(id);
      setItems(StorageService.getCommentBank());
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Thầy/Cô có muốn khôi phục toàn bộ Ngân hàng lời nhận xét về mẫu chuẩn ban đầu?')) {
      StorageService.resetCommentBank();
      setItems(StorageService.getCommentBank());
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-400/30">
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Ngân hàng lời nhận xét chuẩn Thông tư 27/2020/TT-BGDĐT</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Ngân hàng Lời nhận xét theo Dạng bài & Tình huống
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Kho <strong>{items.length}+ mẫu lời nhận xét</strong> sư phạm phong phú theo Thông tư 27, được phân loại
              theo từng thể loại bài và mọi tình huống học sinh. Lời nhận xét vào vở được tối ưu{' '}
              <strong>ngắn gọn (15 – 30 từ)</strong>, giúp Thầy/Cô <strong>ghi tay vào vở cực nhanh</strong>, không lo trùng lặp lời phê cho cả lớp 40-45 em!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm lời nhận xét mới</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm rounded-xl flex items-center gap-2 transition cursor-pointer"
              title="In danh mục nhận xét"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In danh mục</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
              title="Khôi phục mẫu chuẩn ban đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar inside Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <div className="text-emerald-200 text-[11px]">Tổng số mẫu nhận xét</div>
            <div className="text-lg font-bold text-white mt-0.5">{items.length} tình huống</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <div className="text-emerald-200 text-[11px]">Tập làm văn (Viết)</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {items.filter((i) => i.phanMon === 'viet').length} mẫu
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <div className="text-emerald-200 text-[11px]">Luyện từ và câu</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {items.filter((i) => i.phanMon === 'ltvc').length} mẫu
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <div className="text-emerald-200 text-[11px]">Do giáo viên tự thêm</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {items.filter((i) => i.isCustom).length} mẫu cá nhân
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tình huống, hạn chế (ví dụ: 'chính tả', 'so sánh', 'câu dài', 'sơ sài', 'tả người')..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs px-1.5 py-0.5"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Domain Pills */}
          <div className="flex items-center gap-1.5 shrink-0 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedDomain('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedDomain === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tất cả ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedDomain('viet')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedDomain === 'viet' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tập làm văn ({items.filter((i) => i.phanMon === 'viet').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedDomain('ltvc')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedDomain === 'ltvc' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Luyện từ & câu ({items.filter((i) => i.phanMon === 'ltvc').length})
            </button>
          </div>
        </div>

        {/* Second row filters: Level & Dạng bài */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5 text-stone-500">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold">Mức độ đạt được:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'Hoàn thành tốt', 'Hoàn thành', 'Chưa hoàn thành'] as const).map((lvl) => {
              const label =
                lvl === 'all'
                  ? 'Tất cả mức độ'
                  : lvl === 'Hoàn thành tốt'
                  ? 'Hoàn thành tốt (T)'
                  : lvl === 'Hoàn thành'
                  ? 'Hoàn thành (H)'
                  : 'Chưa hoàn thành (C)';
              const isSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    isSelected
                      ? lvl === 'Hoàn thành tốt'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                        : lvl === 'Hoàn thành'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300 font-bold'
                        : lvl === 'Chưa hoàn thành'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                        : 'bg-stone-800 text-white font-bold'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-stone-500 font-semibold">Dạng bài:</span>
            <select
              value={selectedTheLoai}
              onChange={(e) => setSelectedTheLoai(e.target.value)}
              className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tất cả dạng bài ({allTheLoai.length})</option>
              {allTheLoai.map((tl) => (
                <option key={tl} value={tl}>
                  {tl}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid: Comment Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-base text-stone-800">Không tìm thấy mẫu nhận xét phù hợp</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Thầy/Cô hãy thử tìm bằng từ khoá khác hoặc bấm vào "Xóa bộ lọc" để xem toàn bộ danh mục ngân hàng.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('all');
              setSelectedLevel('all');
              setSelectedTheLoai('all');
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
          >
            Xem lại tất cả mẫu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredItems.map((item) => {
            const levelColor =
              item.mucDo === 'Hoàn thành tốt'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : item.mucDo === 'Hoàn thành'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-amber-50 text-amber-800 border-amber-200';

            const domainBadge =
              item.phanMon === 'ltvc'
                ? 'bg-blue-600 text-white'
                : 'bg-emerald-700 text-white';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-500/70 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${domainBadge}`}>
                        {item.phanMon === 'ltvc' ? 'Luyện từ & câu' : 'Tập làm văn'}
                      </span>
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                        {item.theLoai}
                      </span>
                      {item.isCustom && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-md">
                          Mẫu tự tạo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${levelColor}`}>
                        {item.mucDo}
                      </span>
                      {item.isCustom && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100"
                            title="Chỉnh sửa mẫu này"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50"
                            title="Xóa mẫu này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Situation Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item.tinhHuong}</span>
                    </h3>
                    {item.moTaTinhHuong && (
                      <p className="text-xs text-stone-500 mt-1 pl-5.5 italic">
                        Biểu hiện: {item.moTaTinhHuong}
                      </p>
                    )}
                  </div>

                  {/* Section 1: Lời nhận xét vào vở học sinh (Core highlight) */}
                  <div className="bg-amber-50/60 border border-amber-200/90 rounded-xl p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                          Lời phê ghi vào vở học sinh:
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/70 text-amber-950 border border-amber-300 flex items-center gap-1">
                          <span>⚡ {item.loiNhanXetVaoVo.trim().split(/\s+/).length} từ</span>
                          <span className="text-amber-800 hidden sm:inline">• Ghi vở nhanh</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.loiNhanXetVaoVo, `vo-${item.id}`)}
                        className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                        title="Sao chép lời phê này"
                      >
                        {copiedKey === `vo-${item.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Chép lời phê</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-stone-800 leading-relaxed font-normal bg-white/60 p-2.5 rounded-lg border border-amber-100">
                      "{item.loiNhanXetVaoVo}"
                    </p>
                  </div>

                  {/* Section 2: Lời nhận xét vào Sổ theo dõi (Chuẩn TT27) */}
                  <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <ClipboardList className="w-3.5 h-3.5 text-emerald-700" />
                        Lời ghi Sổ theo dõi đánh giá (TT 27/2020):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.loiNhanXetSoTheoDoi, `so-${item.id}`)}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedKey === `so-${item.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Chép sổ</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-stone-700 italic">"{item.loiNhanXetSoTheoDoi}"</p>
                  </div>

                  {/* Section 3: Biện pháp hỗ trợ của giáo viên */}
                  {item.bienPhapKhacPhuc && (
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-600 space-y-1">
                      <div className="font-semibold text-stone-800 flex items-center gap-1 text-[11px]">
                        <Compass className="w-3 h-3 text-purple-600" />
                        <span>Biện pháp giáo viên giúp học sinh khắc phục:</span>
                      </div>
                      <p className="text-[11px] text-stone-600 pl-4">{item.bienPhapKhacPhuc}</p>
                    </div>
                  )}
                </div>

                {/* Card Footer: Tags & Selection Button if in modal/select mode */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <Tag className="w-3 h-3 text-stone-400" />
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        onClick={() => setSearchQuery(tag)}
                        className="text-[10px] bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-600 px-1.5 py-0.5 rounded cursor-pointer transition"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {onSelectCommentForGrading && (
                    <button
                      type="button"
                      onClick={() => onSelectCommentForGrading(item)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Áp dụng vào bài đang chấm</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Thêm hoặc Sửa lời nhận xét */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-emerald-600" />
                <span>{editingItem ? 'Chỉnh sửa mẫu nhận xét' : 'Thêm mẫu nhận xét mới vào ngân hàng'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phân môn (*)</label>
                  <select
                    value={formPhanMon}
                    onChange={(e) => setFormPhanMon(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  >
                    <option value="viet">Tập làm văn (Viết)</option>
                    <option value="ltvc">Luyện từ và câu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dạng bài / Thể loại (*)</label>
                  <input
                    type="text"
                    value={formTheLoai}
                    onChange={(e) => setFormTheLoai(e.target.value)}
                    placeholder="VD: Tả phong cảnh, Tả người..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Mức độ đạt được</label>
                  <select
                    value={formMucDo}
                    onChange={(e) => setFormMucDo(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  >
                    <option value="Hoàn thành tốt">Hoàn thành tốt (T)</option>
                    <option value="Hoàn thành">Hoàn thành (H)</option>
                    <option value="Chưa hoàn thành">Chưa hoàn thành (C)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Tên tình huống / Hạn chế của học sinh (*)
                </label>
                <input
                  type="text"
                  value={formTinhHuong}
                  onChange={(e) => setFormTinhHuong(e.target.value)}
                  placeholder="VD: Mắc lỗi chính tả tr/ch, Câu văn dài không ngắt dấu chấm..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Mô tả cụ thể biểu hiện khi học sinh viết bài
                </label>
                <input
                  type="text"
                  value={formMoTa}
                  onChange={(e) => setFormMoTa(e.target.value)}
                  placeholder="VD: Viết liền 4 dòng không chấm câu; nhầm từ 'chời' thành 'trời'..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs text-stone-700"
                />
              </div>

              {/* Lời nhận xét vào vở */}
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                <label className="block font-bold text-amber-900 mb-1">
                  Lời nhận xét ghi vào vở học sinh (*) (Khen ngợi + Chỉ rõ hạn chế cụ thể + Cách sửa)
                </label>
                <textarea
                  rows={3}
                  value={formLoiVaoVo}
                  onChange={(e) => setFormLoiVaoVo(e.target.value)}
                  placeholder="VD: Cô khen em quan sát tốt. Tuy nhiên, câu văn của em còn quá dài do thiếu dấu chấm câu. Em hãy đọc lại và đặt thêm dấu chấm ngắt câu khi diễn đạt xong một ý nhé!"
                  className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>

              {/* Lời ghi sổ theo dõi */}
              <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-200">
                <label className="block font-bold text-emerald-900 mb-1">
                  Lời nhận xét ghi vào Sổ theo dõi đánh giá học sinh (khoảng 2 câu theo chuẩn TT27)
                </label>
                <textarea
                  rows={2}
                  value={formLoiSoTheoDoi}
                  onChange={(e) => setFormLoiSoTheoDoi(e.target.value)}
                  placeholder="VD: Quan sát cảnh vật tốt nhưng diễn đạt còn lủng củng do viết câu quá dài. Cần rèn thêm kỹ năng chấm ngắt câu."
                  className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Biện pháp khắc phục */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Biện pháp giáo viên giúp học sinh khắc phục (gợi ý sư phạm)
                </label>
                <input
                  type="text"
                  value={formBienPhap}
                  onChange={(e) => setFormBienPhap(e.target.value)}
                  placeholder="VD: Hướng dẫn học sinh đọc to câu văn, dừng hơi ở đâu thì đánh dấu phẩy hoặc chấm."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs text-stone-700"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Từ khoá (Tags) - Phân cách bằng dấu phẩy
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="VD: chính tả, câu dài, tả cảnh, tr/ch"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs text-stone-700"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs"
                >
                  {editingItem ? 'Cập nhật mẫu' : 'Lưu vào Ngân hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
