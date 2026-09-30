import React from 'react';
import { EvaluationResult } from '../types';
import { Award, CheckCircle, AlertTriangle, BookOpen, User, Calendar } from 'lucide-react';

interface Props {
  evaluation: EvaluationResult;
  onClose: () => void;
}

export const PrintEvaluationSheet: React.FC<Props> = ({ evaluation, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Hoàn thành tốt':
        return {
          text: 'HOÀN THÀNH TỐT (T)',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: '🌟',
        };
      case 'Hoàn thành':
        return {
          text: 'HOÀN THÀNH (H)',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: '✅',
        };
      default:
        return {
          text: 'CHƯA HOÀN THÀNH / CẦN CỐ GẮNG (C)',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: '🌱',
        };
    }
  };

  const levelInfo = getLevelBadge(evaluation.muc_do_dat_duoc);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-6 border border-stone-200">
        {/* Modal Controls - Hidden during print */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-stone-700 font-medium">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Xem trước Phiếu nhận xét bài viết (Mẫu chuẩn Thông tư 27)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              In phiếu / Lưu PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm font-medium transition"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div id="printable-sheet" className="p-8 sm:p-10 font-['Be_Vietnam_Pro',sans-serif] text-stone-900 bg-white">
          {/* Header */}
          <div className="text-center pb-6 border-b-2 border-stone-800 mb-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-stone-600 mb-2">
              <span>BỘ GIÁO DỤC VÀ ĐÀO TẠO</span>
              <span>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
              <span>TRƯỜNG TIỂU HỌC ..........................</span>
              <span className="italic font-medium">Độc lập – Tự do – Hạnh phúc</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-emerald-900 mt-2">
              {evaluation.phan_mon === 'ltvc'
                ? 'PHIẾU ĐÁNH GIÁ & NHẬN XÉT BÀI TẬP LUYỆN TỪ VÀ CÂU'
                : 'PHIẾU ĐÁNH GIÁ VÀ NHẬN XÉT BÀI VIẾT'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              (Thực hiện theo quy định đánh giá học sinh tiểu học – Thông tư số 27/2020/TT-BGDĐT)
            </p>
          </div>

          {/* Student & Lesson Details */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
            <div>
              <p className="text-stone-600">
                <span className="font-semibold text-stone-800">Họ và tên học sinh:</span>{' '}
                <span className="text-emerald-800 font-bold">{evaluation.ten_hoc_sinh}</span>
              </p>
              <p className="text-stone-600 mt-1">
                <span className="font-semibold text-stone-800">Lớp:</span>{' '}
                {evaluation.lop.toString().includes('/') ? evaluation.lop : `${evaluation.lop}A`}
              </p>
              <p className="text-stone-600 mt-1">
                <span className="font-semibold text-stone-800">Chủ điểm:</span> {evaluation.chu_diem}
              </p>
            </div>
            <div>
              <p className="text-stone-600">
                <span className="font-semibold text-stone-800">Ngày đánh giá:</span>{' '}
                {new Date(evaluation.ngay_tao).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-stone-600 mt-1">
                <span className="font-semibold text-stone-800">
                  {evaluation.phan_mon === 'ltvc' ? 'Chủ đề ngữ pháp:' : 'Dạng bài:'}
                </span>{' '}
                {evaluation.the_loai_bai_van}
              </p>
              <p className="text-stone-600 mt-1">
                <span className="font-semibold text-stone-800">Bài học:</span> {evaluation.bai_hoc}
              </p>
            </div>
            <div className="col-span-2 pt-2 border-t border-stone-200">
              <span className="font-semibold text-stone-800">Đề bài: </span>
              <span className="italic text-stone-700">{evaluation.de_bai}</span>
            </div>
          </div>

          {/* Result Badge according to Circular 27 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border mb-6 bg-emerald-50/50 border-emerald-200">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <span className="font-bold text-sm uppercase text-stone-700">Mức độ đạt được:</span>
            </div>
            <div className={`px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold tracking-wide ${levelInfo.color}`}>
              {levelInfo.icon} {levelInfo.text}
            </div>
          </div>

          {/* Core Pedagogical Feedback */}
          <div className="space-y-4 text-sm mb-6">
            <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-4">
              <h3 className="font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                1. ƯU ĐIỂM NỔI BẬT (Khen ngợi, khích lệ)
              </h3>
              <p className="text-stone-800 leading-relaxed text-justify">{evaluation.uu_diem_noi_bat}</p>
            </div>

            <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-4">
              <h3 className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                2. HẠN CHẾ & HƯỚNG DẪN KHẮC PHỤC CỤ THỂ
              </h3>
              <p className="text-stone-800 leading-relaxed text-justify">{evaluation.han_che_can_sua}</p>
            </div>

            {evaluation.goi_y_sua_cau && (
              <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-1.5">
                  💡 GỢI Ý NÂNG CAO / CÂU VĂN THAM KHẢO
                </h3>
                <p className="text-stone-800 italic leading-relaxed">"{evaluation.goi_y_sua_cau}"</p>
              </div>
            )}
          </div>

          {/* Detailed Criteria Table (For Writing) or Question-by-Question Table (For LTVC) */}
          {evaluation.ket_qua_tung_cau && evaluation.ket_qua_tung_cau.length > 0 ? (
            <div className="mb-6">
              <h3 className="font-bold text-stone-800 text-sm mb-2 uppercase tracking-wide flex items-center justify-between">
                <span>Kết quả chấm chi tiết từng câu bài tập Luyện từ và câu:</span>
                <span className="text-xs text-stone-500 font-normal">
                  (Tổng số {evaluation.ket_qua_tung_cau.length} câu)
                </span>
              </h3>
              <table className="w-full text-xs border border-stone-300 rounded-lg overflow-hidden">
                <thead className="bg-stone-100 text-stone-700">
                  <tr>
                    <th className="border border-stone-300 p-2 text-center w-16">Câu</th>
                    <th className="border border-stone-300 p-2 text-left">Bài làm của học sinh</th>
                    <th className="border border-stone-300 p-2 text-center w-28">Đánh giá</th>
                    <th className="border border-stone-300 p-2 text-left">Đáp án chuẩn / Gợi ý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {evaluation.ket_qua_tung_cau.map((q, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="border border-stone-300 p-2 text-center font-bold text-stone-800">
                        {q.cau_so}
                      </td>
                      <td className="border border-stone-300 p-2 text-stone-800">
                        <p className="font-medium text-stone-600 text-[11px] mb-0.5">{q.yeu_cau}</p>
                        <p className="italic">"{q.bai_lam_hoc_sinh || (q as any).tra_loi_hoc_sinh || ''}"</p>
                      </td>
                      <td className="border border-stone-300 p-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            q.ket_qua === 'Đúng'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.ket_qua === 'Đúng một phần'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {q.ket_qua}
                        </span>
                      </td>
                      <td className="border border-stone-300 p-2 text-emerald-900 bg-emerald-50/20">
                        <p className="font-semibold text-emerald-950">{q.dap_an_chuan}</p>
                        {q.nhan_xet_chi_tiet && (
                          <p className="text-stone-500 italic text-[11px] mt-0.5">
                            {q.nhan_xet_chi_tiet}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {evaluation.kien_thuc_can_on_tap && evaluation.kien_thuc_can_on_tap.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-blue-900">
                  <span className="font-bold">📚 Kiến thức trọng tâm cần ôn lại: </span>
                  <span>{evaluation.kien_thuc_can_on_tap.join('; ')}</span>
                </div>
              )}
            </div>
          ) : evaluation.danh_gia_chi_tiet ? (
            <div className="mb-6">
              <h3 className="font-bold text-stone-800 text-sm mb-2 uppercase tracking-wide">
                Đánh giá chi tiết theo tiêu chí cần đạt:
              </h3>
              <table className="w-full text-xs border border-stone-300 rounded-lg overflow-hidden">
                <thead className="bg-stone-100 text-stone-700">
                  <tr>
                    <th className="border border-stone-300 p-2 text-left w-1/4">Thành phần</th>
                    <th className="border border-stone-300 p-2 text-center w-24">Mức</th>
                    <th className="border border-stone-300 p-2 text-left">Nhận xét chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="border border-stone-300 p-2 font-medium">Bố cục & Ngôi kể</td>
                    <td className="border border-stone-300 p-2 text-center font-semibold text-emerald-700">
                      {evaluation.danh_gia_chi_tiet.bo_cuc?.danh_gia || 'Đạt'}
                    </td>
                    <td className="border border-stone-300 p-2 text-stone-700">
                      {evaluation.danh_gia_chi_tiet.bo_cuc?.chi_tiet}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-stone-300 p-2 font-medium">Nội dung & Ý tưởng</td>
                    <td className="border border-stone-300 p-2 text-center font-semibold text-emerald-700">
                      {evaluation.danh_gia_chi_tiet.noi_dung_va_y_tuong?.danh_gia || 'Đạt'}
                    </td>
                    <td className="border border-stone-300 p-2 text-stone-700">
                      {evaluation.danh_gia_chi_tiet.noi_dung_va_y_tuong?.chi_tiet}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-stone-300 p-2 font-medium">Nghệ thuật & Từ ngữ</td>
                    <td className="border border-stone-300 p-2 text-center font-semibold text-emerald-700">
                      {evaluation.danh_gia_chi_tiet.nghe_thuat_va_tu_ngu?.danh_gia || 'Đạt'}
                    </td>
                    <td className="border border-stone-300 p-2 text-stone-700">
                      {evaluation.danh_gia_chi_tiet.nghe_thuat_va_tu_ngu?.chi_tiet}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-stone-300 p-2 font-medium">Chính tả & Đặt câu</td>
                    <td className="border border-stone-300 p-2 text-center font-semibold text-emerald-700">
                      {evaluation.danh_gia_chi_tiet.chinh_ta_va_dat_cau?.danh_gia || 'Đạt'}
                    </td>
                    <td className="border border-stone-300 p-2 text-stone-700">
                      {evaluation.danh_gia_chi_tiet.chinh_ta_va_dat_cau?.chi_tiet}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}

          {/* Spelling & Grammar Errors specific breakdown if any */}
          {evaluation.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi &&
            evaluation.danh_gia_chi_tiet.chinh_ta_va_dat_cau.danh_sach_loi.length > 0 && (
              <div className="mb-6 border border-red-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-red-50/70 px-4 py-2 border-b border-red-200 flex items-center justify-between">
                  <span className="font-bold text-red-900 uppercase tracking-wide">
                    Chỉ dẫn sửa lỗi chính tả, dùng từ và đặt câu cho học sinh:
                  </span>
                  <span className="text-[11px] font-semibold text-red-700">
                    {evaluation.danh_gia_chi_tiet.chinh_ta_va_dat_cau.danh_sach_loi.length} lỗi cần lưu ý
                  </span>
                </div>
                <div className="divide-y divide-stone-200 bg-white p-3 space-y-3">
                  {evaluation.danh_gia_chi_tiet.chinh_ta_va_dat_cau.danh_sach_loi.map((err, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-red-100 text-red-800 border border-red-200">
                          {err.loai_loi}
                        </span>
                        {err.vi_tri_ngu_canh && (
                          <span className="text-stone-500 font-medium text-[11px]">
                            [{err.vi_tri_ngu_canh}]
                          </span>
                        )}
                        <span className="font-semibold text-red-700 line-through">"{err.tu_hoac_cau_sai}"</span>
                        <span className="text-stone-400 font-bold">➔</span>
                        <span className="font-bold text-emerald-700">"{err.sua_lai}"</span>
                      </div>

                      {err.cau_sua_hoan_chinh && (
                        <div className="text-[11px] text-stone-700 pl-2 border-l-2 border-emerald-400 bg-emerald-50/30 py-0.5 mt-1">
                          <span className="font-semibold text-emerald-900">Gợi ý viết lại câu: </span>
                          <span className="italic">"{err.cau_sua_hoan_chinh}"</span>
                        </div>
                      )}

                      {err.giai_thich_ngan && (
                        <p className="text-stone-500 italic text-[11px] pl-2">
                          Lý do: {err.giai_thich_ngan}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Teacher Log Comment */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm mb-8">
            <span className="font-bold text-amber-950 block mb-1">
              Lời nhận xét vào sổ theo dõi / Sổ liên lạc:
            </span>
            <p className="italic text-stone-800">"{evaluation.loi_nhan_xet_so_theo_doi}"</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center text-sm pt-4">
            <div>
              <p className="font-bold text-stone-800 uppercase">Ý KIẾN PHỤ HUYNH</p>
              <p className="text-xs text-stone-500 italic mt-0.5">(Ký và ghi rõ họ tên)</p>
              <div className="h-16"></div>
              <p className="text-stone-400">....................................................</p>
            </div>
            <div>
              <p className="text-xs text-stone-500 italic mb-1">
                Ngày ..... tháng ..... năm 20....
              </p>
              <p className="font-bold text-stone-800 uppercase">GIÁO VIÊN BÌNH ĐÁNH GIÁ</p>
              <p className="text-xs text-stone-500 italic mt-0.5">(Ký và ghi rõ họ tên)</p>
              <div className="h-16 flex items-center justify-center">
                <span className="font-['Plus_Jakarta_Sans'] font-semibold text-emerald-700 tracking-wider">
                  Đã duyệt nhận xét
                </span>
              </div>
              <p className="text-stone-700 font-medium">Giáo viên chủ nhiệm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
