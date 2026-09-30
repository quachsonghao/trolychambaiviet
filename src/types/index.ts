export type AchievementLevel = 'Hoàn thành tốt' | 'Hoàn thành' | 'Chưa hoàn thành';
export type LearningDomain = 'viet' | 'ltvc';

export interface SpellingOrGrammarError {
  loai_loi: 'Chính tả' | 'Dùng từ' | 'Đặt câu' | 'Dấu câu' | 'Bố cục';
  tu_hoac_cau_sai: string;
  sua_lai: string;
  vi_tri_ngu_canh?: string;
  cau_goc?: string;
  cau_sua_hoan_chinh?: string;
  giai_thich_ngan: string;
}

export interface DetailedAspect {
  danh_gia: 'Đạt' | 'Khá' | 'Cần cải thiện';
  chi_tiet: string;
}

export interface DetailedEvaluation {
  bo_cuc: DetailedAspect;
  noi_dung_va_y_tuong: DetailedAspect;
  nghe_thuat_va_tu_ngu: DetailedAspect;
  chinh_ta_va_dat_cau: DetailedAspect & {
    danh_sach_loi: SpellingOrGrammarError[];
  };
}

export interface LtvcQuestionCheck {
  cau_so: string;
  yeu_cau: string;
  bai_lam_hoc_sinh: string;
  ket_qua: 'Đúng' | 'Đúng một phần' | 'Chưa đúng';
  dap_an_chuan: string;
  nhan_xet_chi_tiet: string;
}

export interface EvaluationResult {
  id: string;
  ngay_tao: string;
  ten_hoc_sinh: string;
  lop: string | number;
  phan_mon?: LearningDomain; // 'viet' (Tập làm văn) hoặc 'ltvc' (Luyện từ và câu)
  chu_diem: string;
  bai_hoc: string;
  the_loai_bai_van: string; // Tên thể loại văn hoặc Dạng bài tập LTVC
  de_bai: string;
  noi_dung_bai_viet: string;
  anh_bai_viet?: string; // base64 or preview url
  danh_sach_anh?: string[]; // list of multi-page images
  muc_do_dat_duoc: AchievementLevel;
  uu_diem_noi_bat: string;
  han_che_can_sua: string;
  loi_nhan_xet_so_theo_doi: string;
  goi_y_sua_cau: string;
  danh_gia_chi_tiet: DetailedEvaluation;
  // Specific for LTVC evaluations
  ket_qua_tung_cau?: LtvcQuestionCheck[];
  kien_thuc_can_on_tap?: string[];
  loi_nhan_xet_hoc_sinh: string;
  loi_nhan_xet_phu_huynh: string;
  giao_vien_ghi_chu?: string;
  da_duyet: boolean;
}

export interface StudentProfile {
  id: string;
  so_thu_tu?: number;
  ten: string;
  ngay_sinh?: string;
  lop: string;
  gioi_tinh: 'Nam' | 'Nữ';
  ghi_chu_hoc_luc?: string;
  so_bai_da_cham: number;
  ti_le_hoan_thanh_tot: number;
  loi_thuong_gap: string[];
}

export interface LessonUnit {
  id: string;
  tuan: string;
  chuDiem: string;
  baiHoc: string;
  dangBaiViet: string;
  deBaiGoiY: string[];
  yeuCauCanDat: string;
  trongTamTiengViet: string;
}

export interface LtvcLessonUnit {
  id: string;
  tuan: string;
  chuDiem: string;
  baiHoc: string;
  chuDeNguPhap: string;
  dangBaiTap: string;
  deBaiGoiY: string[];
  yeuCauCanDat: string;
  kienThucTrongTam: string;
}

export interface GradedStudentSummary {
  evalId: string;
  studentName: string;
  muc_do_dat_duoc: AchievementLevel;
  ngay_tao: string;
  loi_nhan_xet_so_theo_doi: string;
  so_loi: number;
}

export interface AssignmentStats {
  key: string;
  bai_hoc: string;
  chu_diem: string;
  the_loai_bai_van: string;
  phan_mon: LearningDomain;
  de_bai: string;
  totalEvaluated: number;
  totalClassStudents: number;
  completionRate: number;
  levels: {
    tot: number;
    hoanThanh: number;
    chuaHoanThanh: number;
  };
  levelsPercent: {
    tot: number;
    hoanThanh: number;
    chuaHoanThanh: number;
  };
  gradedStudents: GradedStudentSummary[];
  notGradedStudents: StudentProfile[];
  topErrorsInAssignment: Array<[string, number]>;
}

export interface TotalOverallStats {
  totalEvaluations: number;
  totalStudents: number;
  studentsEvaluatedCount: number;
  coveragePercent: number;
  levels: {
    tot: number;
    hoanThanh: number;
    chuaHoanThanh: number;
  };
  levelsPercent: {
    tot: number;
    hoanThanh: number;
    chuaHoanThanh: number;
  };
  byDomain: {
    viet: number;
    ltvc: number;
  };
  totalErrorsFound: number;
  errorCategoryCount: Record<string, number>;
  topCommonErrors: Array<[string, number]>;
  ltvcQuestionsStats?: {
    totalQuestions: number;
    dung: number;
    dungMotPhan: number;
    chuaDung: number;
    dungPercent: number;
  };
}

export interface CommentBankItem {
  id: string;
  phanMon: 'viet' | 'ltvc';
  theLoai: string;
  tinhHuong: string;
  moTaTinhHuong: string;
  mucDo: AchievementLevel;
  loiNhanXetVaoVo: string;
  loiNhanXetSoTheoDoi: string;
  bienPhapKhacPhuc: string;
  tags: string[];
  isCustom?: boolean;
}
