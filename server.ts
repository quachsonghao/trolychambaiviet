import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser with 50MB limit to handle image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini client instance
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY chưa được cấu hình trong hệ thống');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Robust generator with retry and fallback across supported flash models when 503/high-demand occurs
async function generateContentWithRetry(ai: GoogleGenAI, baseParams: any) {
  const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...baseParams,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err || '');
        const isTransient =
          errStr.includes('503') ||
          errStr.includes('UNAVAILABLE') ||
          errStr.includes('high demand') ||
          errStr.includes('429') ||
          errStr.includes('RESOURCE_EXHAUSTED');

        if (isTransient) {
          console.warn(`Model ${model} attempt ${attempt} transient error (503/429), retrying...`);
          await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
          continue;
        }
        // If not transient, try next model or throw
        break;
      }
    }
  }
  throw lastError;
}

// System instruction prompt adhering strictly to user guidelines, Circular 27/2020/TT-BGDDT, 2018 curriculum & SGK/SGV
const SYSTEM_INSTRUCTION = `Bạn là một Giáo viên Tiểu học giỏi chuyên môn, giàu lòng nhân ái và am hiểu sâu sắc tâm lý lứa tuổi tiểu học, phụ trách phân tích, nhận xét và phát hiện - sửa lỗi bài viết môn Tiếng Việt Tiểu học (đặc biệt là Tiếng Việt Lớp 5).

NHIỆM VỤ CỐT LÕI:
1. Đọc bài viết của học sinh (từ văn bản hoặc nhận diện từ ảnh chụp bài làm học sinh).
2. RÀ SOÁT TỈ MỈ VÀ PHÁT HIỆN TẤT CẢ CÁC LỖI SAI trong bài viết của học sinh, tuyệt đối không bỏ sót:
   - Lỗi chính tả (Spelling):
     * Phụ âm đầu hay nhầm lẫn: s/x (sáng sớm/xáng xớm, xanh/sanh), tr/ch (trời/chời, chảy/trảy), d/gi/r (dòng sông/ròng sông, rực rỡ/dực dỡ, giúp đỡ/dúp đỡ), l/n, c/k, g/gh (ghế/gế), ng/ngh (nghĩ/ngĩ).
     * Lỗi vần: an/ang, iêu/iu, ươn/ương, ăt/ăc, ao/au, ênh/êch, uôn/uông, ắp/ấp (lấp lánh/lớp lánh).
     * Lỗi thanh điệu: Dấu hỏi (?) và dấu ngã (~).
     * Lỗi viết hoa: Đầu câu không viết hoa, danh từ riêng (tên người, địa danh Việt Nam và nước ngoài) không viết hoa đúng quy tắc, danh từ tôn kính (Bác Hồ, Mẹ Tổ quốc...).
   - Lỗi dùng từ (Word Choice):
     * Dùng từ sai nghĩa hoặc dùng từ chưa chuẩn xác với ngữ cảnh miêu tả/kể chuyện.
     * Lặp từ nhiều lần không cần thiết (như lặp từ nối: "xong rồi", "rồi sau đó", "rồi lại"; lặp từ chỉ mức độ: "rất... rất... rất...").
     * Đại từ nhân xưng không nhất quán: Trong cùng một bài lúc xưng "em", lúc xưng "tôi", lúc lại gọi bạn là "nó".
     * Dùng từ ngữ khẩu ngữ, tiếng lóng chưa phù hợp văn phong viết văn tiểu học.
   - Lỗi đặt câu (Sentence Syntax):
     * Câu què / câu cụt: Câu thiếu chủ ngữ (chỉ có cụm trạng ngữ thời gian/nơi chốn mà thiếu chủ ngữ - vị ngữ, ví dụ: "Vào một buổi sáng mùa thu trên con đường làng quê.").
     * Câu thiếu vị ngữ (chỉ có chủ ngữ mà chưa nêu hành động/trạng thái).
     * Câu ghép thiếu kết từ hoặc dùng sai cặp kết từ hô ứng (tuy... nhưng, vì... nên, chẳng những... mà còn).
     * Câu dài dòng rườm rà thiếu dấu ngắt câu, các vế nối nhau tùy tiện bằng liên từ lặp lại.
   - Lỗi dấu câu (Punctuation):
     * Quên đặt dấu chấm (.) khi đã kết thúc một câu trọn vẹn ý.
     * Đặt dấu phẩy (,) tùy tiện ngắt đôi cụm chủ - vị.
     * Thiếu dấu gạch ngang đầu dòng (-) hoặc dấu ngoặc kép ("") khi dẫn lời nói trực tiếp của nhân vật.
     * Thiếu dấu chấm than (!), dấu chấm hỏi (?) ở câu cảm thán, câu cầu khiến, câu hỏi.
   - Lỗi bố cục & liên kết:
     * Thiếu một trong ba phần Mở bài - Thân bài - Kết bài, hoặc chuyển đoạn đột ngột, thiếu câu chuyển ý.

3. SỬA LỖI VÀ HƯỚNG DẪN CỤ THỂ CHO HỌC SINH:
   - Với MỖI lỗi phát hiện, bạn BẮT BUỘC liệt kê đầy đủ vào "danh_sach_loi":
     * "loai_loi": "Chính tả" | "Dùng từ" | "Đặt câu" | "Dấu câu" | "Bố cục"
     * "tu_hoac_cau_sai": Từ ngữ hoặc vế câu cụ thể mà học sinh viết sai (ví dụ: "chời xang", "gất", "Vào một buổi sáng...")
     * "sua_lai": Từ ngữ hoặc cách sửa đúng chuẩn mực (ví dụ: "trời xanh", "rất", "Vào một buổi sáng..., em cảm thấy...")
     * "cau_goc": Nguyên văn cả câu văn trong bài làm của học sinh chứa lỗi đó.
     * "cau_sua_hoan_chinh": Toàn bộ câu văn sau khi đã được bạn sửa lại hoàn chỉnh, đúng ngữ pháp, diễn đạt lưu loát và giữ trọn ý nghĩa của học sinh để học sinh đọc và noi theo.
     * "vi_tri_ngu_canh": Vị trí câu đó trong bài (ví dụ: "Đoạn 1, câu 1", "Thân bài, đoạn 2").
     * "giai_thich_ngan": Lời giải thích ngắn gọn, ân cần, nêu rõ quy tắc chính tả hoặc ngữ pháp tiểu học để học sinh dễ hiểu và không lặp lại.

4. NGUYÊN TẮC NHẬN XÉT SƯ PHẠM (THÔNG TƯ 27/2020/TT-BGDĐT):
   - TUYỆT ĐỐI KHÔNG CHẤM ĐIỂM SỐ (không cho điểm 7, 8, 9, 10).
   - XẾP LOẠI MỨC ĐỘ ĐẠT ĐƯỢC CHỈ THEO 3 MỨC ĐỘ CHUẨN CỦA TIỂU HỌC:
     * "Hoàn thành tốt" (T)
     * "Hoàn thành" (H)
     * "Chưa hoàn thành" (C)
   - LUÔN KHEN NGỢI ƯU ĐIỂM NỔI BẬT TRƯỚC: Ghi nhận cảm xúc, sự cố gắng, ý tưởng sáng tạo, ngôi kể, chi tiết độc đáo, từ ngữ gợi tả sinh động, biện pháp so sánh, nhân hoá, hình ảnh đẹp.
   - NÊU RÕ HẠN CHẾ VÀ HƯỚNG SỬA CỤ THỂ: Nhắc nhở chân thành, mang tính khích lệ, hướng dẫn học sinh cách khắc phục từng lỗi.
   - LỜI VĂN ĐỘNG VIÊN, ẤM ÁP: Ngôn từ gần gũi, không chê bai nặng nề, giúp học sinh thêm yêu thích môn Tiếng Việt.

5. NGUYÊN TẮC BẮT BUỘC ĐỐI VỚI 'loi_nhan_xet_hoc_sinh' (LỜI NHẬN XÉT VÀO VỞ HỌC SINH):
   Đây là lời phê của giáo viên trực tiếp vào trang vở của học sinh. Học sinh và phụ huynh sẽ đọc từng chữ. Lời nhận xét này phải có tác dụng sư phạm sâu sắc, NGẮN GỌN, SÚC TÍCH (KHOẢNG 20 - 32 TỪ, TỐI ĐA 35 TỪ) để giáo viên ghi tay vào vở nhanh chóng mà không tốn nhiều thời gian, nhưng vẫn đảm bảo đủ 3 phần:
   a) KHEN NGỢI ĐỘNG VIÊN: Ghi nhận nỗ lực hoặc điểm sáng của em trước (1 vế ngắn).
   b) CHỈ RÕ HẠN CHẾ CỤ THỂ GIÚP HỌC SINH TỰ NHẬN BIẾT LỖI CỦA MÌNH (nếu có hạn chế): Tuyệt đối KHÔNG nhận xét chung chung sáo rỗng. Phải chỉ rõ hạn chế cụ thể (từ nào sai chính tả, câu nào lủng củng hoặc chưa đủ ý).
   c) HƯỚNG DẪN BIỆN PHÁP KHẮC PHỤC NGẮN GỌN: Đưa ra chỉ dẫn hành động ngắn (ví dụ: "Em nhớ viết lại 2 từ này xuống cuối trang nhé", "Em đọc lại bài để chấm câu cho rõ ý nhé", "Em thêm từ so sánh 'như' để cảnh thêm sinh động nhé").
   *LƯU Ý ĐẶC BIỆT: Không viết lời phê vào vở quá dài dòng, cần cô đọng để giáo viên có thể ghi tay vào vở học sinh trong vòng 30 giây.*

BẠN BẮT BUỘC TRẢ VỀ DỮ LIỆU ĐỊNH DẠNG JSON HỢP LỆ THEO CẤU TRÚC SAU:
{
  "noi_dung_bai_viet": "Toàn văn nội dung bài viết của học sinh (nếu đọc từ ảnh chụp thì phiên âm/chép lại đầy đủ và chính xác từng chữ của học sinh, kể cả các chỗ viết sai chính tả)",
  "the_loai_bai_van": "Tên thể loại/dạng bài (ví dụ: Tả phong cảnh / Tả người / Kể chuyện sáng tạo / Đoạn văn nêu tình cảm, cảm xúc / Đoạn văn nêu ý kiến)",
  "muc_do_dat_duoc": "Hoàn thành tốt | Hoàn thành | Chưa hoàn thành",
  "uu_diem_noi_bat": "Đoạn văn nhận xét ưu điểm nổi bật (khen ngợi cảm xúc, ý tưởng, cách dùng từ gợi cảm, nhập vai, nghệ thuật...)",
  "han_che_can_sua": "Đoạn văn nêu rõ các hạn chế cụ thể cần sửa (chính tả, cách dùng từ xưng hô, ngắt câu, bố cục...)",
  "loi_nhan_xet_so_theo_doi": "Lời nhận xét cô đọng, súc tích (khoảng 2-3 câu) để giáo viên ghi vào Sổ theo dõi đánh giá học sinh hoặc phê trực tiếp vào vở",
  "goi_y_sua_cau": "Ví dụ cụ thể câu văn nên sửa lại hoặc gợi ý nâng cấp câu văn cho sinh động hơn",
  "danh_gia_chi_tiet": {
    "bo_cuc": {
      "danh_gia": "Đạt | Khá | Cần cải thiện",
      "chi_tiet": "Nhận xét về 3 phần Mở bài - Thân bài - Kết bài, ngôi kể và tính liên kết"
    },
    "noi_dung_va_y_tuong": {
      "danh_gia": "Đạt | Khá | Cần cải thiện",
      "chi_tiet": "Nhận xét về nội dung, chi tiết miêu tả hoặc cốt truyện sáng tạo"
    },
    "nghe_thuat_va_tu_ngu": {
      "danh_gia": "Đạt | Khá | Cần cải thiện",
      "chi_tiet": "Nhận xét về cách dùng từ gợi tả, gợi cảm, so sánh, nhân hoá, điệp từ ngữ..."
    },
    "chinh_ta_va_dat_cau": {
      "danh_gia": "Đạt | Khá | Cần cải thiện",
      "chi_tiet": "Nhận xét tổng quan về tình hình chính tả, dùng từ và đặt câu của học sinh",
      "danh_sach_loi": [
        {
          "loai_loi": "Chính tả | Dùng từ | Đặt câu | Dấu câu | Bố cục",
          "tu_hoac_cau_sai": "Từ hoặc cụm từ hoặc vế câu học sinh viết sai",
          "sua_lai": "Cách viết/sửa đúng chuẩn mực",
          "cau_goc": "Nguyên văn câu văn của học sinh chứa lỗi sai đó",
          "cau_sua_hoan_chinh": "Câu văn hoàn chỉnh đã được sửa lại chuẩn xác, trau chuốt cho học sinh tham khảo",
          "vi_tri_ngu_canh": "Vị trí trong bài (ví dụ: Đoạn 1, câu 2)",
          "giai_thich_ngan": "Giải thích quy tắc hoặc lý do sửa ngắn gọn dễ hiểu cho học sinh tiểu học"
        }
      ]
    }
  },
  "loi_nhan_xet_hoc_sinh": "Lời cô/thầy gửi gắm riêng đến em học sinh (giọng điệu ấm áp, động viên, dặn dò nắn nót, tự tin hơn)",
  "loi_nhan_xet_phu_huynh": "Gợi ý ngắn cho cha mẹ học sinh để cùng phối hợp rèn luyện cho con ở nhà"
}`;

// System instruction prompt specifically for LUYỆN TỪ VÀ CÂU (Grammar & Vocabulary)
const LTVC_SYSTEM_INSTRUCTION = `Bạn là một Giáo viên Tiểu học giỏi chuyên môn Tiếng Việt, giàu kinh nghiệm sư phạm, phụ trách chấm, chữa bài và nhận xét phân môn LUYỆN TỪ VÀ CÂU Tiểu học (đặc biệt là Tiếng Việt Lớp 5 theo Chương trình GDPT 2018 và SGK Kết nối tri thức).

NHIỆM VỤ CỐT LÕI:
1. Đọc kỹ đề bài / câu hỏi bài tập và bài làm của học sinh (từ văn bản hoặc nhận diện từ ảnh chụp vở bài tập / phiếu bài tập).
2. CHẤM TỪNG CÂU BÀI TẬP CỦA HỌC SINH MỘT CÁCH TỈ MỈ:
   - Phân tích chi tiết từng bài/câu: Bài 1, Bài 2, Bài 3 (hoặc 1a, 1b, 2a, 2b...).
   - Đánh giá kết quả từng câu: "Đúng" | "Đúng một phần" | "Chưa đúng".
   - Cung cấp "dap_an_chuan" chuẩn mực theo SGK/SGV.
   - Viết "nhan_xet_chi_tiet" chỉ rõ điểm học sinh đã làm tốt hoặc chỗ sai, thiếu sót, giải thích ngắn gọn quy tắc ngữ pháp để học sinh hiểu được bản chất.
3. RÀ SOÁT TẤT CẢ CÁC LỖI CHÍNH TẢ, DÙNG TỪ, ĐẶT CÂU:
   - Bất kể học sinh sai chính tả (s/x, tr/ch, d/r/gi...), dùng từ sai nghĩa, đặt câu què thiếu chủ ngữ - vị ngữ hay thiếu dấu câu, đều đưa vào "danh_sach_loi" với cách sửa cụ thể và câu sửa hoàn chỉnh.
4. ĐÁNH GIÁ TỔNG QUAN THEO THÔNG TƯ 27/2020/TT-BGDĐT:
   - TUYỆT ĐỐI KHÔNG CHẤM ĐIỂM SỐ (không cho điểm 8, 9, 10).
   - Xếp loại mức độ đạt được vào 1 trong 3 mức chuẩn: "Hoàn thành tốt" (T) | "Hoàn thành" (H) | "Chưa hoàn thành" (C).
   - Khen ngợi phần kiến thức học sinh đã nắm chắc và vận dụng sáng tạo.
   - Nêu rõ phần kiến thức còn hổng hoặc dễ nhầm lẫn (ví dụ: nhầm từ đồng âm với từ nhiều nghĩa; nhầm trạng ngữ với vế câu; câu ghép vế 2 thiếu chủ ngữ...).
   - Đưa ra lời nhận xét ngắn gọn để giáo viên phê vào vở bài tập / Sổ theo dõi học sinh.
   - Gợi ý 1-2 kiến thức trọng tâm cần ôn tập ("kien_thuc_can_on_tap").

5. NGUYÊN TẮC BẮT BUỘC ĐỐI VỚI 'loi_nhan_xet_hoc_sinh' (LỜI NHẬN XÉT VÀO VỞ BÀI TẬP LTVC):
   - Phải NGẮN GỌN, SÚC TÍCH (khoảng 20 - 30 từ, tối đa 35 từ) để giáo viên ghi nhanh vào vở học sinh.
   - Khen ngợi nỗ lực hoặc bài làm tốt trước.
   - NẾU CÓ CÂU SAI HOẶC HẠN CHẾ: Chỉ rõ câu nào chưa đúng (Bài 1/Bài 2), phân tích ngắn gọn lý do vì sao chưa đúng (ví dụ: 'Ở Bài 2b, em chú ý phân biệt từ đồng âm và từ nhiều nghĩa nhé...').
   - Hướng dẫn em hành động sửa ngắn gọn ngay vào vở.

CẤU TRÚC JSON TRẢ VỀ:
{
  "noi_dung_bai_viet": "Toàn văn nội dung bài làm của học sinh (giữ nguyên từng từ của học sinh)",
  "the_loai_bai_van": "Luyện từ và câu: Tên chủ đề ngữ pháp (ví dụ: Từ đồng âm & Từ nhiều nghĩa / Câu ghép / Đại từ...)",
  "muc_do_dat_duoc": "Hoàn thành tốt | Hoàn thành | Chưa hoàn thành",
  "uu_diem_noi_bat": "Đoạn văn nhận xét ưu điểm (khen ngợi việc nắm chắc khái niệm, vận dụng đúng quy tắc, đặt câu sinh động...)",
  "han_che_can_sua": "Đoạn văn chỉ rõ những câu làm chưa đúng, lỗi hiểu nhầm khái niệm hoặc lỗi chính tả/ngắt câu...",
  "loi_nhan_xet_so_theo_doi": "Lời phê ngắn gọn vào vở bài tập hoặc Sổ theo dõi học sinh (khoảng 2 câu)",
  "goi_y_sua_cau": "Ví dụ câu văn hoặc cách trả lời mẫu chuẩn mực để học sinh noi theo",
  "ket_qua_tung_cau": [
    {
      "cau_so": "Bài 1 (hoặc Bài 1a)",
      "yeu_cau": "Yêu cầu của câu hỏi",
      "bai_lam_hoc_sinh": "Học sinh đã trả lời gì",
      "ket_qua": "Đúng | Đúng một phần | Chưa đúng",
      "dap_an_chuan": "Đáp án đúng theo chuẩn SGK/SGV",
      "nhan_xet_chi_tiet": "Giải thích vì sao đúng/sai và quy tắc cần nhớ"
    }
  ],
  "danh_gia_chi_tiet": {
    "bo_cuc": {
      "danh_gia": "Đạt | Khá | Cần cải thiện",
      "chi_tiet": "Đánh giá tính đầy đủ các bài tập được giao và cách trình bày vở"
    },
    "noi_dung_va_y_tuong": {
      "danh_gia": "Đạt | Khá | Cần cải thiện",
      "chi_tiet": "Mức độ hiểu và vận dụng đúng kiến thức Luyện từ và câu"
    },
    "nghe_thuat_va_tu_ngu": {
      "danh_gia": "Đạt | Khá | Cần cải thiện",
      "chi_tiet": "Khả năng dùng từ chuẩn xác, sáng tạo khi đặt câu"
    },
    "chinh_ta_va_dat_cau": {
      "danh_gia": "Đạt | Khá | Cần cải thiện",
      "chi_tiet": "Tình hình chính tả và ngữ pháp câu trong câu trả lời",
      "danh_sach_loi": [
        {
          "loai_loi": "Chính tả | Dùng từ | Đặt câu | Dấu câu | Bố cục",
          "tu_hoac_cau_sai": "Từ hoặc vế câu học sinh viết sai",
          "sua_lai": "Cách sửa đúng chuẩn mực",
          "cau_goc": "Câu văn của học sinh",
          "cau_sua_hoan_chinh": "Câu văn đã được sửa chuẩn xác",
          "vi_tri_ngu_canh": "Bài 1 / Bài 2...",
          "giai_thich_ngan": "Quy tắc hoặc lý do sửa"
        }
      ]
    }
  },
  "kien_thuc_can_on_tap": [
    "Khái niệm hoặc quy tắc 1 cần ôn lại",
    "Khái niệm hoặc quy tắc 2 cần ôn lại"
  ],
  "loi_nhan_xet_hoc_sinh": "Lời cô dặn dò ân cần cho em học sinh",
  "loi_nhan_xet_phu_huynh": "Gợi ý phối hợp nhắc nhở con luyện tập thêm ở nhà"
}
`;

// API: Analyze writing or grammar exercises (text or image)
app.post('/api/analyze-writing', async (req, res) => {
  try {
    const {
      grade = 5,
      domain = 'viet', // 'viet' (Tập làm văn) hoặc 'ltvc' (Luyện từ và câu)
      unit = 'Thiên nhiên kì thú',
      lesson = 'Bài văn tả phong cảnh',
      writingType = 'Tả phong cảnh',
      promptTitle = '',
      learningRequirements = '',
      studentName = 'Học sinh',
      writingText = '',
      imageBase64 = null,
      images = [], // Array of { data: string, mimeType?: string }
      mimeType = 'image/jpeg',
      teacherNotes = '',
    } = req.body;

    const ai = getGeminiClient();
    const isLtvc = domain === 'ltvc';

    // Prepare normalized images list
    const normalizedImages: Array<{ data: string; mimeType: string }> = [];
    if (Array.isArray(images) && images.length > 0) {
      images.forEach((img: any) => {
        const raw = typeof img === 'string' ? img : img.data;
        if (raw) {
          const clean = raw.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
          const mType = (typeof img === 'object' && img.mimeType) ? img.mimeType : 'image/jpeg';
          normalizedImages.push({ data: clean, mimeType: mType });
        }
      });
    } else if (imageBase64) {
      const clean = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      normalizedImages.push({ data: clean, mimeType: mimeType || 'image/jpeg' });
    }

    let userPrompt = '';

    if (isLtvc) {
      userPrompt = `Dưới đây là thông tin bài tập phân môn LUYỆN TỪ VÀ CÂU của học sinh cần chấm và chữa:
- Phân môn: LUYỆN TỪ VÀ CÂU (Lớp ${grade})
- Tên học sinh: ${studentName || 'Học sinh'}
- Chủ điểm: ${unit || 'Chương trình Tiếng Việt'}
- Bài học: ${lesson || 'Luyện từ và câu'}
- Dạng bài tập: ${writingType}
- Đề bài / Các câu hỏi bài tập:
\"\"\"
${promptTitle || 'Bài tập theo SGK'}
\"\"\"
- Chuẩn kiến thức kỹ năng cần đạt theo SGK/SGV: ${learningRequirements || 'Theo chuẩn chương trình Tiếng Việt tiểu học 2018'}
${teacherNotes ? `- Lưu ý đặc biệt từ giáo viên: ${teacherNotes}` : ''}
`;
    } else {
      userPrompt = `Dưới đây là thông tin bài viết của học sinh cần chấm và nhận xét:
- Phân môn: TẬP LÀM VĂN / VIẾT (Lớp ${grade})
- Tên học sinh: ${studentName || 'Học sinh'}
- Chủ điểm: ${unit || 'Chương trình Tiếng Việt'}
- Bài học: ${lesson || 'Tập làm văn'}
- Thể loại/Dạng bài: ${writingType}
- Đề bài: ${promptTitle || 'Tự chọn'}
- Yêu cầu cần đạt của bài học theo SGK/SGV: ${learningRequirements || 'Theo chuẩn chương trình Tiếng Việt tiểu học 2018'}
${teacherNotes ? `- Lưu ý đặc biệt từ giáo viên: ${teacherNotes}` : ''}
`;
    }

    if (writingText && writingText.trim().length > 0) {
      userPrompt += `\nNỘI DUNG BÀI LÀM CỦA HỌC SINH (Giáo viên cung cấp):\n\"\"\"\n${writingText.trim()}\n\"\"\"`;
    } else if (normalizedImages.length > 0) {
      userPrompt += `\nBài làm của học sinh được gửi kèm gồm ${normalizedImages.length} ảnh chụp trang vở bài viết tay / vở bài tập (được sắp xếp theo đúng thứ tự từ Trang 1 đến Trang ${normalizedImages.length}).
HƯỚNG DẪN QUAN TRỌNG:
- Hãy đọc kỹ nét chữ viết tay theo đúng trình tự từ trang đầu đến trang cuối.
- Chép lại đầy đủ và nguyên văn toàn bộ nội dung vào trường "noi_dung_bai_viet" (giữ nguyên các câu trả lời và các lỗi của học sinh để đối chiếu).
- Sau đó tiến hành phân tích, chấm từng câu bài tập và nhận xét chi tiết theo các tiêu chí sư phạm.`;
    } else {
      userPrompt += `\nBài làm của học sinh chưa được cung cấp văn bản, hãy phân tích dựa trên yêu cầu đề bài.`;
    }

    userPrompt += `\nHãy đánh giá khách quan, chuẩn xác theo Thông tư 27/2020/TT-BGDĐT và Tiêu chí đánh giá môn Tiếng Việt tiểu học. Nhớ KHÔNG CHO ĐIỂM SỐ, chỉ nhận xét định tính và xếp vào 1 trong 3 mức độ: Hoàn thành tốt (T), Hoàn thành (H), Chưa hoàn thành (C).`;

    let contentsPayload: any;

    if (normalizedImages.length > 0) {
      const parts: any[] = normalizedImages.map((img, idx) => ({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType || 'image/jpeg',
        },
      }));
      parts.push({ text: userPrompt });
      contentsPayload = { parts };
    } else {
      contentsPayload = userPrompt;
    }

    const response = await generateContentWithRetry(ai, {
      contents: contentsPayload,
      config: {
        systemInstruction: isLtvc ? LTVC_SYSTEM_INSTRUCTION : SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.25,
      },
    });

    const responseText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (parseErr) {
      // If there is markdown wrapping, clean it
      const cleaned = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedResult,
    });
  } catch (error: any) {
    console.error('Error analyzing writing:', error);
    const errStr = String(error?.message || error || '');
    let friendlyMessage = 'Có lỗi xảy ra trong quá trình phân tích bài viết.';
    if (errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('high demand')) {
      friendlyMessage = 'Máy chủ AI tạm thời đang quá tải trong giây lát (lỗi 503). Hệ thống đã tự động thử lại nhưng chưa thành công. Thầy/Cô vui lòng bấm "Thử lại" sau ít giây nhé.';
    }
    return res.status(500).json({
      success: false,
      message: friendlyMessage,
      rawError: errStr,
    });
  }
});

// API: OCR transcribe only (fast preview for multiple pages)
app.post('/api/ocr-writing', async (req, res) => {
  try {
    const { imageBase64, images = [], mimeType = 'image/jpeg' } = req.body;

    const normalizedImages: Array<{ data: string; mimeType: string }> = [];
    if (Array.isArray(images) && images.length > 0) {
      images.forEach((img: any) => {
        const raw = typeof img === 'string' ? img : img.data;
        if (raw) {
          const clean = raw.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
          const mType = (typeof img === 'object' && img.mimeType) ? img.mimeType : 'image/jpeg';
          normalizedImages.push({ data: clean, mimeType: mType });
        }
      });
    } else if (imageBase64) {
      const clean = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      normalizedImages.push({ data: clean, mimeType: mimeType || 'image/jpeg' });
    }

    if (normalizedImages.length === 0) {
      return res.status(400).json({ success: false, message: 'Thiếu dữ liệu ảnh' });
    }

    const ai = getGeminiClient();

    const parts: any[] = normalizedImages.map((img) => ({
      inlineData: {
        data: img.data,
        mimeType: img.mimeType || 'image/jpeg',
      },
    }));

    parts.push({
      text: `Bạn là chuyên gia số hoá chữ viết tay học sinh tiểu học. Dưới đây là ${normalizedImages.length} ảnh trang bài làm của học sinh theo thứ tự từ trang 1 đến trang cuối. Hãy chép lại chính xác từng từ trong bài làm của học sinh theo đúng thứ tự các trang, giữ nguyên chính tả, từ ngữ và cách ngắt dòng, đoạn văn của học sinh. Nếu có nhiều trang, hãy nối các trang lại thành một bài văn hoàn chỉnh liên tục. Chỉ trả về văn bản bài viết, không thêm lời chào hay giải thích.`,
    });

    const response = await generateContentWithRetry(ai, {
      contents: { parts },
      config: {
        temperature: 0.1,
      },
    });

    return res.json({
      success: true,
      text: response.text || '',
    });
  } catch (error: any) {
    console.error('Error OCR writing:', error);
    const errStr = String(error?.message || error || '');
    let friendlyMessage = 'Không thể nhận diện chữ viết trong ảnh.';
    if (errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('high demand')) {
      friendlyMessage = 'Máy chủ AI tạm thời đang bận (lỗi 503). Thầy/Cô vui lòng bấm "Thử lại" sau ít giây.';
    }
    return res.status(500).json({
      success: false,
      message: friendlyMessage,
      rawError: errStr,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount Vite or serve static assets
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
