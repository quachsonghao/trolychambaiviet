import React, { useState } from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, Award, ListChecks, HelpCircle, Sparkles, FileText } from 'lucide-react';
import { RUBRICS_BY_GENRE } from '../data/criteriaRubric';

export const HandbookView: React.FC = () => {
  const [selectedGenreTab, setSelectedGenreTab] = useState<string>('Kể chuyện sáng tạo');
  const [activeDocSection, setActiveDocSection] = useState<'rubric' | 'tt27' | 'grammar'>('rubric');

  const currentRubric = RUBRICS_BY_GENRE[selectedGenreTab] || RUBRICS_BY_GENRE['Kể chuyện sáng tạo'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Tài liệu căn cứ & Khung tiêu chí chuẩn
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          Cẩm nang đánh giá Viết Tiếng Việt Tiểu học
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-3xl leading-relaxed">
          Tra cứu toàn diện các quy định của Bộ Giáo dục & Đào tạo (Thông tư 27/2020/TT-BGDĐT), Chương trình GDPT 2018, Sách giáo khoa & Sách giáo viên Tiếng Việt 5 (Kết nối tri thức) và Bộ tiêu chí nhận xét định tính.
        </p>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-stone-100 mt-6">
          <button
            type="button"
            onClick={() => setActiveDocSection('rubric')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeDocSection === 'rubric'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            Bộ tiêu chí nhận xét (Rubric từng thể loại)
          </button>

          <button
            type="button"
            onClick={() => setActiveDocSection('tt27')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeDocSection === 'tt27'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Quy định Thông tư 27/2020/TT-BGDĐT
          </button>

          <button
            type="button"
            onClick={() => setActiveDocSection('grammar')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeDocSection === 'grammar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Kiến thức Luyện từ & Câu Lớp 5
          </button>
        </div>
      </div>

      {/* SECTION 1: RUBRIC TIÊU CHÍ */}
      {activeDocSection === 'rubric' && (
        <div className="space-y-6">
          {/* Genre selector tabs */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200 flex flex-wrap gap-2">
            {Object.keys(RUBRICS_BY_GENRE).map((genreKey) => (
              <button
                key={genreKey}
                type="button"
                onClick={() => setSelectedGenreTab(genreKey)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  selectedGenreTab === genreKey
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 ring-1 ring-emerald-400/30'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {genreKey}
              </button>
            ))}
          </div>

          {/* Current Rubric Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50/30 border-b border-stone-200">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {currentRubric.genre}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Bảng tiêu chuẩn đánh giá phân định theo 3 mức độ đạt được của Thông tư 27 (T / H / C).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100/80 text-stone-800 font-bold border-b border-stone-200">
                    <th className="p-3.5 w-1/4">Tiêu chí đánh giá</th>
                    <th className="p-3.5 w-1/4 bg-emerald-50/50 text-emerald-900">
                      ★ Hoàn thành tốt (T)
                    </th>
                    <th className="p-3.5 w-1/4 bg-blue-50/50 text-blue-900">
                      ✓ Hoàn thành (H)
                    </th>
                    <th className="p-3.5 w-1/4 bg-amber-50/50 text-amber-950">
                      ▲ Cần cố gắng (C)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {currentRubric.criterias.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/60 transition">
                      <td className="p-3.5 font-bold text-stone-900 align-top">
                        <div>{c.name}</div>
                        <div className="text-[11px] font-normal text-stone-500 mt-1">
                          {c.description}
                        </div>
                      </td>
                      <td className="p-3.5 text-stone-800 leading-relaxed bg-emerald-50/20 align-top">
                        {c.levels.hoanThanhTot}
                      </td>
                      <td className="p-3.5 text-stone-800 leading-relaxed bg-blue-50/20 align-top">
                        {c.levels.hoanThanh}
                      </td>
                      <td className="p-3.5 text-stone-800 leading-relaxed bg-amber-50/20 align-top">
                        {c.levels.chuaHoanThanh}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: QUY ĐỊNH THÔNG TƯ 27/2020 */}
      {activeDocSection === 'tt27' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="text-lg font-bold text-stone-900">
              Nguyên tắc Đánh giá định tính môn Tiếng Việt Tiểu học (Thông tư 27/2020/TT-BGDĐT)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Ban hành ngày 04/09/2020 - Áp dụng chính thức cho khối Lớp 5 từ năm học 2024 - 2025
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                1. Mục đích đánh giá vì sự tiến bộ của học sinh
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                Đánh giá kết quả giáo dục nhằm cung cấp thông tin kịp thời về mức độ đáp ứng yêu cầu cần đạt.
                Coi trọng việc động viên, khuyến khích sự cố gắng trong học tập; phát huy nhiều nhất khả năng,
                năng lực của học sinh; đảm bảo kịp thời, công bằng, khách quan;{' '}
                <strong>không so sánh học sinh này với học sinh khác</strong>.
              </p>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
              <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                2. Hình thức đánh giá thường xuyên
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                Đánh giá thường xuyên bằng nhận xét định tính:{' '}
                <strong>không sử dụng điểm số để chấm bài viết hàng ngày</strong>. Giáo viên chỉ ra cho học sinh
                biết được chỗ đúng, chỗ chưa đúng và cách sửa chữa cụ thể; viết lời nhận xét vào vở hoặc sản
                phẩm học tập để học sinh và phụ huynh cùng theo dõi.
              </p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                3. Ba mức độ đánh giá chuẩn
              </h4>
              <ul className="text-xs text-stone-700 space-y-1.5">
                <li>
                  <strong className="text-emerald-800">Hoàn thành tốt (T):</strong> Thực hiện tốt các yêu cầu học
                  tập và thường xuyên có biểu hiện cụ thể về các thành phần năng lực môn học.
                </li>
                <li>
                  <strong className="text-blue-800">Hoàn thành (H):</strong> Thực hiện được các yêu cầu học tập
                  và có biểu hiện cụ thể về các thành phần năng lực của môn học.
                </li>
                <li>
                  <strong className="text-amber-800">Chưa hoàn thành / Cần cố gắng (C):</strong> Chưa thực hiện
                  được một số yêu cầu học tập hoặc chưa có biểu hiện cụ thể về năng lực môn học.
                </li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
              <h4 className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                4. Cấu trúc ghi Sổ theo dõi đánh giá học sinh
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                Ghi những điểm nổi bật về sự tiến bộ, năng khiếu, hứng thú học tập đối với môn Tiếng Việt; nội dung,
                kĩ năng chưa hoàn thành cần được khắc phục, giúp đỡ (kèm theo các biện pháp cụ thể của giáo viên).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: KIẾN THỨC LUYỆN TỪ & CÂU LỚP 5 */}
      {activeDocSection === 'grammar' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="text-lg font-bold text-stone-900">
              Kiến thức Tiếng Việt & Ngữ pháp trọng tâm Lớp 5 (SGK Kết nối tri thức)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Các mạch kiến thức thường xuyên được tích hợp để đánh giá trong bài viết của học sinh
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm mb-1 text-emerald-800">
                1. Đại từ (Đại từ xưng hô, đại từ thay thế, đại từ nghi vấn)
              </h4>
              <p className="text-stone-700 text-xs leading-relaxed">
                - <strong>Đại từ xưng hô:</strong> tôi, tớ, chúng tôi, chúng tớ, mày, chúng mày, ta... Ngoài ra có các danh từ chỉ quan hệ gia đình (ông, bà, bố, mẹ, anh, chị, em) hoặc chức danh dùng để xưng hô.<br />
                - <strong>Đại từ thay thế:</strong> như thế, vậy, đó, này... dùng để thay cho danh từ, động từ, tính từ hoặc cả câu đi trước nhằm tránh lặp từ.<br />
                - <strong>Đại từ nghi vấn:</strong> ai, gì, nào, sao, bao nhiêu, đâu... dùng để hỏi.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm mb-1 text-emerald-800">
                2. Kết từ và Câu ghép
              </h4>
              <p className="text-stone-700 text-xs leading-relaxed">
                - <strong>Kết từ:</strong> từ nối các từ ngữ hoặc các câu (và, với, hay, hoặc, vì, do, của, nhưng, mà...).<br />
                - <strong>Cặp kết từ:</strong> <em>Vì... nên...</em>, <em>Bởi... nên...</em>, <em>Nhờ... nên...</em> (nguyên nhân - kết quả); <em>Nếu... thì...</em>, <em>Hễ... thì...</em> (điều kiện - kết quả); <em>Tuy... nhưng...</em>, <em>Mặc dù... nhưng...</em> (tương phản); <em>Không những... mà còn...</em> (tăng tiến).<br />
                - <strong>Cặp từ hô ứng:</strong> <em>vừa... đã...</em>, <em>chưa... đã...</em>, <em>càng... càng...</em>, <em>đâu... đó...</em>, <em>bao nhiêu... bấy nhiêu...</em>
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm mb-1 text-emerald-800">
                3. Liên kết câu trong đoạn văn
              </h4>
              <p className="text-stone-700 text-xs leading-relaxed">
                - <strong>Lặp từ ngữ:</strong> Lặp lại từ ngữ ở câu trước để duy trì đối tượng.<br />
                - <strong>Dùng từ ngữ thay thế:</strong> Dùng đại từ hoặc từ đồng nghĩa thay cho từ đã dùng ở câu trước để tránh lặp từ vô cớ.<br />
                - <strong>Dùng từ ngữ nối:</strong> Dùng kết từ hoặc từ có tác dụng nối (thứ nhất, sau đó, tiếp theo, cuối cùng, bên cạnh đó, ngoài ra...).
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm mb-1 text-emerald-800">
                4. Dấu gạch ngang & Dấu gạch nối
              </h4>
              <p className="text-stone-700 text-xs leading-relaxed">
                - <strong>Dấu gạch ngang (—):</strong> Đặt ở giữa câu để đánh dấu bộ phận chú thích, giải thích; đặt ở đầu dòng đánh dấu lời nói trực tiếp hoặc các ý liệt kê.<br />
                - <strong>Dấu gạch nối (-):</strong> Nối các tiếng trong những từ mượn gồm nhiều tiếng (Át-lát, Xa-ha-ra, ba-la-lai-ca...).
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm mb-1 text-emerald-800">
                5. Quy tắc viết hoa đặc biệt
              </h4>
              <p className="text-stone-700 text-xs leading-relaxed">
                - <strong>Viết hoa danh từ chung tôn kính:</strong> Viết hoa danh từ chung trong một số trường hợp đặc biệt để thể hiện sự tôn kính đối với lãnh tụ và đất nước (Bác, Người, Đất Nước, Mẹ Thiên Nhiên...).<br />
                - <strong>Tên người, tên địa lí nước ngoài:</strong> Viết hoa chữ cái đầu của mỗi bộ phận tạo thành tên; nếu bộ phận gồm nhiều tiếng thì có dấu gạch nối giữa các tiếng (Lu-i Brai, Tô-ky-ô). Trường hợp đọc theo âm Hán Việt viết như tên Việt Nam (Trung Quốc, Ấn Độ).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
