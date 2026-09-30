export interface RubricLevelDetail {
  hoanThanhTot: string;
  hoanThanh: string;
  chuaHoanThanh: string;
}

export interface CriteriaItem {
  id: string;
  name: string;
  description: string;
  levels: RubricLevelDetail;
}

export interface WritingGenreRubric {
  genre: string;
  criterias: CriteriaItem[];
}

export const RUBRICS_BY_GENRE: Record<string, WritingGenreRubric> = {
  'Kể chuyện sáng tạo': {
    genre: 'Kể chuyện sáng tạo (Lớp 5)',
    criterias: [
      {
        id: 'bo_cuc_ngoi_ke',
        name: '1. Bố cục & Ngôi kể',
        description: 'Cấu trúc bài viết và sự nhất quán trong đại từ xưng hô',
        levels: {
          hoanThanhTot:
            'Đủ 3 phần hoàn chỉnh. Nhập vai tự nhiên, đại từ xưng hô thống nhất từ đầu đến cuối.',
          hoanThanh:
            'Đủ 3 phần nhưng đôi chỗ xưng hô chưa thống nhất (lúc xưng "tôi", lúc xưng tên nhân vật).',
          chuaHoanThanh:
            'Thiếu Mở bài hoặc Kết bài. Ngôi kể bị xáo trộn, dùng từ xưng hô chưa phù hợp ngữ cảnh.',
        },
      },
      {
        id: 'cot_truyen_dien_bien',
        name: '2. Cốt truyện & Diễn biến',
        description: 'Trình tự sự việc và sự liên kết logic',
        levels: {
          hoanThanhTot:
            'Kể đủ sự việc chính, trình tự hợp lý, dẫn dắt tự nhiên, cuốn hút người đọc.',
          hoanThanh:
            'Kể đủ sự việc chính nhưng diễn biến còn đơn điệu, chuyển ý giữa các đoạn còn hơi cứng.',
          chuaHoanThanh:
            'Thiếu sự việc quan trọng, cốt truyện ngắt đoạn hoặc quá sơ sài như bản tóm tắt bài.',
        },
      },
      {
        id: 'chi_tiet_sang_tao',
        name: '3. Chi tiết Sáng tạo',
        description: 'Mức độ sáng tạo chi tiết tả, lời thoại, nội tâm hoặc kết thúc mới',
        levels: {
          hoanThanhTot:
            'Sáng tạo độc đáo (thêm lời thoại, độc thoại nội tâm, kết thúc mới hợp lý), giàu cảm xúc, không làm thay đổi thông điệp gốc.',
          hoanThanh:
            'Có chi tiết sáng tạo nhưng còn đơn giản, chưa làm nổi bật được tính cách nhân vật.',
          chuaHoanThanh:
            'Chưa có chi tiết sáng tạo (chép lại bài cũ máy móc) hoặc sáng tạo quá đà làm sai lệch logic câu chuyện.',
        },
      },
      {
        id: 'tu_ngu_nghe_thuat',
        name: '4. Từ ngữ & Nghệ thuật',
        description: 'Vốn từ gợi tả, biện pháp tu từ, sự trôi chảy của câu văn',
        levels: {
          hoanThanhTot:
            'Dùng từ gợi tả, biểu cảm; có so sánh, nhân hoá; câu văn trôi chảy, linh hoạt, không lặp từ.',
          hoanThanh:
            'Diễn đạt khá trôi chảy, có dùng từ miêu tả nhưng còn lặp một số từ nối (rồi, sau đó, thế là).',
          chuaHoanThanh:
            'Vốn từ nghèo nàn, lặp từ nhiều lần, câu văn lủng củng hoặc chưa viết trọn câu.',
        },
      },
      {
        id: 'chinh_ta_trinh_bay',
        name: '5. Chính tả & Trình bày',
        description: 'Độ chuẩn xác chính tả, dấu câu, chữ viết và mỹ quan bài viết',
        levels: {
          hoanThanhTot:
            'Gần như không mắc lỗi chính tả; chữ viết nắn nót, rõ ràng; ngắt câu chuẩn bằng dấu chấm phẩy; bài sạch đẹp.',
          hoanThanh:
            'Mắc vài lỗi chính tả nhỏ (lẫn lộn âm đầu, dấu thanh); chữ viết đọc được; có chỗ tẩy xoá nhẹ.',
          chuaHoanThanh:
            'Mắc nhiều lỗi chính tả; không ngắt câu hoặc đặt dấu câu sai; chữ viết cẩu thả, tẩy xoá nhiều.',
        },
      },
    ],
  },

  'Tả phong cảnh': {
    genre: 'Bài văn Tả phong cảnh (Lớp 5)',
    criterias: [
      {
        id: 'bo_cuc_3_phan',
        name: '1. Bố cục 3 phần',
        description: 'Mở bài gián tiếp/trực tiếp, Thân bài rõ ý, Kết bài mở rộng/không mở rộng',
        levels: {
          hoanThanhTot:
            'Mở bài sinh động (dẫn dắt gián tiếp tự nhiên); Thân bài rành mạch; Kết bài mở rộng gợi nhiều cảm nghĩ sâu sắc.',
          hoanThanh:
            'Đủ 3 phần nhưng Mở bài và Kết bài còn đơn giản, viết theo khuôn mẫu quen thuộc.',
          chuaHoanThanh:
            'Thiếu Mở bài hoặc Kết bài; ranh giới giữa các phần không rõ ràng, đoạn văn dính liền.',
        },
      },
      {
        id: 'trinh_tu_quan_sat',
        name: '2. Trình tự Quan sát',
        description: 'Cách sắp xếp cảnh vật theo không gian hoặc thời gian',
        levels: {
          hoanThanhTot:
            'Tả theo trình tự hợp lý (từ bao quát đến cụ thể, hoặc theo thời gian/mùa); chọn lọc được những nét nổi bật độc đáo của cảnh.',
          hoanThanh:
            'Có trình tự tả nhưng chưa chọn lọc được nét đặc sắc, tiêu biểu nhất của cảnh vật.',
          chuaHoanThanh:
            'Liệt kê cảnh vật lộn xộn, thiếu trình tự quan sát rõ ràng, tả rời rạc không thành khối.',
        },
      },
      {
        id: 'hinh_anh_cam_xuc',
        name: '3. Hình ảnh & Cảm xúc',
        description: 'Vận dụng biện pháp so sánh, nhân hoá và bộc lộ cảm xúc chân thật',
        levels: {
          hoanThanhTot:
            'Vận dụng xuất sắc so sánh, nhân hoá; hình ảnh, âm thanh, màu sắc sinh động; đan xen cảm xúc tự nhiên, chân thật.',
          hoanThanh:
            'Có dùng so sánh hoặc nhân hoá nhưng chưa thật ấn tượng; cảm xúc miêu tả còn mờ nhạt.',
          chuaHoanThanh:
            'Không có hình ảnh so sánh, nhân hoá; bài viết khô khan như bản kê khai sự vật.',
        },
      },
      {
        id: 'dien_dat_dung_tu',
        name: '4. Diễn đạt & Dùng từ',
        description: 'Vốn từ ngữ gợi tả, câu ghép, tránh lặp từ nối',
        levels: {
          hoanThanhTot:
            'Dùng từ gợi tả phong phú, tinh tế; câu văn giàu nhịp điệu; phối hợp linh hoạt câu đơn và câu ghép.',
          hoanThanh:
            'Diễn đạt trôi chảy nhưng từ ngữ còn chung chung; còn lặp từ ngữ nối ở đầu câu.',
          chuaHoanThanh:
            'Câu văn lủng củng, sai ngữ pháp, câu thiếu thành phần chủ vị, lặp ý.',
        },
      },
      {
        id: 'chinh_ta_trinh_bay',
        name: '5. Chính tả & Trình bày',
        description: 'Độ chuẩn xác chính tả, dấu ngắt câu và trình bày bài viết',
        levels: {
          hoanThanhTot:
            'Đúng chính tả; ngắt câu chuẩn bằng dấu chấm, phẩy; chữ viết sạch đẹp, đúng quy cách.',
          hoanThanh:
            'Mắc vài lỗi chính tả nhẹ hoặc quên ngắt câu ở vài vị trí trong thân bài.',
          chuaHoanThanh:
            'Mắc nhiều lỗi chính tả; không ngắt câu; chữ viết ẩu, tẩy xoá nhiều.',
        },
      },
    ],
  },

  'Tả người': {
    genre: 'Bài văn Tả người (Lớp 5)',
    criterias: [
      {
        id: 'bo_cuc_3_phan',
        name: '1. Bố cục 3 phần',
        description: 'Mở bài gián tiếp, Thân bài rõ ý, Kết bài mở rộng tự nhiên',
        levels: {
          hoanThanhTot:
            'Mở bài gián tiếp hấp dẫn, giới thiệu tự nhiên người được tả; Thân bài có cấu trúc đoạn rõ rệt; Kết bài mở rộng sâu sắc.',
          hoanThanh:
            'Đủ 3 phần nhưng mở bài còn khuôn sáo ("Nhà em có...", "Trong lớp em..."); kết bài ngắn.',
          chuaHoanThanh:
            'Thiếu phần mở bài hoặc kết bài; các đoạn thân bài không tách bạch.',
        },
      },
      {
        id: 'dac_diem_noi_bat',
        name: '2. Ngoại hình & Hoạt động',
        description: 'Lựa chọn chi tiết ngoại hình tiêu biểu gắn với hoạt động, tính tình',
        levels: {
          hoanThanhTot:
            'Chọn lọc được những chi tiết tiêu biểu về vóc dáng, gương mặt, ánh mắt gắn liền với cử chỉ, việc làm và tính cách trong tình huống cụ thể.',
          hoanThanh:
            'Có tả ngoại hình và hoạt động nhưng còn liệt kê từ trên xuống dưới, chưa làm nổi bật nét riêng phân biệt.',
          chuaHoanThanh:
            'Liệt kê sơ sài, thiếu chi tiết miêu tả ngoại hình hoặc hoạt động, người được tả mờ nhạt.',
        },
      },
      {
        id: 'cam_xuc_tinh_cam',
        name: '3. Tình cảm & Kỉ niệm',
        description: 'Bộc lộ tình cảm yêu mến, gắn bó qua kỷ niệm hoặc thói quen thân thương',
        levels: {
          hoanThanhTot:
            'Bộc lộ tình cảm tha thiết, chân thực qua ánh mắt, nụ cười, kỷ niệm sâu sắc khó quên.',
          hoanThanh:
            'Có bày tỏ tình cảm ("em rất yêu quý...") nhưng chưa gắn với tình huống hoặc kỷ niệm cụ thể.',
          chuaHoanThanh:
            'Bài viết khô cứng, không bộc lộ được tình cảm của người viết đối với người được tả.',
        },
      },
      {
        id: 'dien_dat_nghe_thuat',
        name: '4. Diễn đạt & Nghệ thuật',
        description: 'Sử dụng từ ngữ gợi tả, so sánh, kết từ và câu ghép',
        levels: {
          hoanThanhTot:
            'Hình ảnh so sánh ví von ấn tượng; từ ngữ giàu sức biểu cảm; dùng câu ghép nhịp nhàng.',
          hoanThanh:
            'Câu văn rõ ý, trôi chảy; có so sánh đơn giản; đôi chỗ dùng từ chưa đắt giá.',
          chuaHoanThanh:
            'Câu văn vụng về, câu què câu cụt, vốn từ hạn hẹp, lặp từ quá nhiều.',
        },
      },
      {
        id: 'chinh_ta_trinh_bay',
        name: '5. Chính tả & Trình bày',
        description: 'Quy tắc chính tả, ngắt câu, viết hoa',
        levels: {
          hoanThanhTot:
            'Viết đúng chính tả, viết hoa danh từ chung tôn kính đúng lúc (Bác, Người); chữ viết nắn nót.',
          hoanThanh:
            'Mắc 1-3 lỗi chính tả; chữ viết đọc rõ; có sửa chữa nhỏ.',
          chuaHoanThanh:
            'Mắc nhiều lỗi chính tả cơ bản; ngắt câu tùy tiện; bài lem nhem.',
        },
      },
    ],
  },

  'Đoạn văn nêu ý kiến': {
    genre: 'Đoạn văn nêu ý kiến tán thành / phản đối (Lớp 5)',
    criterias: [
      {
        id: 'neu_quan_diem',
        name: '1. Nêu quan điểm rõ ràng',
        description: 'Câu mở đầu nêu rõ sự việc/hiện tượng và ý kiến tán thành hoặc phản đối',
        levels: {
          hoanThanhTot:
            'Câu mở đầu dẫn dắt ấn tượng, khẳng định dứt khoát và rõ ràng quan điểm cá nhân (tán thành/phản đối).',
          hoanThanh:
            'Nêu được sự việc và quan điểm nhưng cách mở đầu còn đơn giản, gượng gạo.',
          chuaHoanThanh:
            'Chưa nêu rõ sự việc hoặc người đọc không nhận ra người viết tán thành hay phản đối.',
        },
      },
      {
        id: 'li_le_dan_chung',
        name: '2. Lí lẽ & Dẫn chứng',
        description: 'Các lí do thuyết phục và ví dụ thực tế chứng minh',
        levels: {
          hoanThanhTot:
            'Đưa ra 2-3 lí lẽ chặt chẽ, xác đáng kèm dẫn chứng thực tế sinh động, có sức thuyết phục cao đối với cộng đồng.',
          hoanThanh:
            'Có lí lẽ nhưng dẫn chứng còn chung chung, chưa phân tích sâu để làm sáng tỏ lí do.',
          chuaHoanThanh:
            'Lí lẽ thiếu căn cứ, không có dẫn chứng minh hoạ hoặc lí do lạc đề.',
        },
      },
      {
        id: 'ket_thuc_thong_diep',
        name: '3. Kết thúc & Thông điệp',
        description: 'Khẳng định lại ý kiến và kêu gọi hành động tích cực',
        levels: {
          hoanThanhTot:
            'Khẳng định lại ý kiến một cách sâu sắc; nêu được bài học hoặc lời kêu gọi hành động thiết thực.',
          hoanThanh:
            'Có câu kết nhắc lại ý kiến nhưng chưa nêu được thông điệp mở rộng.',
          chuaHoanThanh:
            'Không có câu kết đoạn hoặc kết thúc đột ngột, bỏ lửng ý.',
        },
      },
      {
        id: 'tu_ngu_lien_ket',
        name: '4. Từ ngữ & Liên kết câu',
        description: 'Sử dụng từ ngữ biểu đạt thái độ và các biện pháp liên kết',
        levels: {
          hoanThanhTot:
            'Sử dụng khéo léo từ ngữ biểu đạt thái độ (rất xác đáng, cần chấm dứt, khó chấp nhận...); liên kết câu mạch lạc.',
          hoanThanh:
            'Diễn đạt khá trôi chảy; câu văn rõ nghĩa; còn lặp một số từ ngữ liên kết.',
          chuaHoanThanh:
            'Câu văn lủng củng; các câu rời rạc không có sự kết nối logic.',
        },
      },
      {
        id: 'chinh_ta_trinh_bay',
        name: '5. Chính tả & Trình bày',
        description: 'Chính tả, dấu câu và thể thức đoạn văn',
        levels: {
          hoanThanhTot:
            'Viết đúng thể thức đoạn văn (lùi đầu dòng, viết hoa, chấm câu cuối); không sai chính tả.',
          hoanThanh:
            'Đúng thể thức đoạn văn; mắc 1-2 lỗi chính tả nhỏ.',
          chuaHoanThanh:
            'Xuống dòng tùy tiện giữa đoạn; sai nhiều lỗi chính tả và dấu câu.',
        },
      },
    ],
  },
};
