import {
  EvaluationResult,
  StudentProfile,
  AssignmentStats,
  TotalOverallStats,
  GradedStudentSummary,
  CommentBankItem,
} from '../types';
import { DEFAULT_COMMENT_BANK } from '../data/commentBankData';

const STORAGE_KEYS = {
  HISTORY: 'tro_ly_cham_bai_history_v2',
  STUDENTS: 'tro_ly_cham_bai_students_lop52_v2',
  CURRENT_CLASS: 'tro_ly_cham_bai_current_class_v2',
  COMMENT_BANK: 'tro_ly_cham_bai_comment_bank_v2',
};

// Official roster of 42 students from Class 5/2 as provided by teacher
export const OFFICIAL_STUDENTS_CLASS_5_2: StudentProfile[] = [
  { id: 'hs-1', so_thu_tu: 1, ten: 'Lê Xuân An', ngay_sinh: '15/6/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 2, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: ['Đôi khi câu văn dài cần ngắt nhịp'] },
  { id: 'hs-2', so_thu_tu: 2, ten: 'Nguyễn Ngô Hoài An', ngay_sinh: '15/01/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-3', so_thu_tu: 3, ten: 'Nguyễn Huỳnh Quốc An', ngay_sinh: '25/6/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 2, ti_le_hoan_thanh_tot: 50, loi_thuong_gap: ['Lặp từ "rồi"', 'Lẫn lộn s/x'] },
  { id: 'hs-4', so_thu_tu: 4, ten: 'Lâm Nguyễn Mai Anh', ngay_sinh: '18/10/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 2, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-5', so_thu_tu: 5, ten: 'Mai Nguyễn Bảo Anh', ngay_sinh: '26/3/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-6', so_thu_tu: 6, ten: 'Lê Trần Như Băng', ngay_sinh: '01/01/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-7', so_thu_tu: 7, ten: 'Ngô Ngọc Châu', ngay_sinh: '20/02/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-8', so_thu_tu: 8, ten: 'Nguyễn Minh Châu', ngay_sinh: '08/02/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-9', so_thu_tu: 9, ten: 'Trần Ngọc Anh Đào', ngay_sinh: '07/4/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-10', so_thu_tu: 10, ten: 'Lê Phúc Đăng', ngay_sinh: '26/5/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 0, loi_thuong_gap: ['Quên dấu phẩy', 'Chữ viết cần nắn nót'] },
  { id: 'hs-11', so_thu_tu: 11, ten: 'Lê Trịnh Minh Hà', ngay_sinh: '12/02/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-12', so_thu_tu: 12, ten: 'Trần Nhật Hà', ngay_sinh: '28/01/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-13', so_thu_tu: 13, ten: 'Tiêu Lê Hiếu', ngay_sinh: '21/01/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 0, loi_thuong_gap: ['Liệt kê câu ngắn'] },
  { id: 'hs-14', so_thu_tu: 14, ten: 'Huỳnh Phạm Tuyết Hồng', ngay_sinh: '25/10/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-15', so_thu_tu: 15, ten: 'Huỳnh Phúc Hưng', ngay_sinh: '19/01/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-16', so_thu_tu: 16, ten: 'Nguyễn Lâm Vũ Khang', ngay_sinh: '26/10/2015', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-17', so_thu_tu: 17, ten: 'Võ Đăng Khoa', ngay_sinh: '03/02/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-18', so_thu_tu: 18, ten: 'Trần Túc Lam', ngay_sinh: '28/5/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-19', so_thu_tu: 19, ten: 'Nguyễn Lê Minh', ngay_sinh: '03/7/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 2, ti_le_hoan_thanh_tot: 50, loi_thuong_gap: ['Lặp từ nối', 'Lẫn lộn d/gi'] },
  { id: 'hs-20', so_thu_tu: 20, ten: 'Trần Nguyễn Ái My', ngay_sinh: '10/4/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-21', so_thu_tu: 21, ten: 'Trương Lâm Thiện Mỹ', ngay_sinh: '31/12/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-22', so_thu_tu: 22, ten: 'Phạm Hậu Nam', ngay_sinh: '13/11/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 0, loi_thuong_gap: ['Thiếu ý mở bài'] },
  { id: 'hs-23', so_thu_tu: 23, ten: 'Phan Huỳnh Như Ngọc', ngay_sinh: '14/02/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-24', so_thu_tu: 24, ten: 'Đinh Thảo Nguyên', ngay_sinh: '22/02/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-25', so_thu_tu: 25, ten: 'Lý Kim Nguyên', ngay_sinh: '08/01/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-26', so_thu_tu: 26, ten: 'Phan Thảo Nguyên', ngay_sinh: '20/01/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-27', so_thu_tu: 27, ten: 'Trần Khôi Nguyên', ngay_sinh: '16/11/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-28', so_thu_tu: 28, ten: 'Trương Đăng Phú', ngay_sinh: '15/4/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-29', so_thu_tu: 29, ten: 'Trương Hà Thiên Phú', ngay_sinh: '06/5/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-30', so_thu_tu: 30, ten: 'Trần Minh Phúc', ngay_sinh: '30/7/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-31', so_thu_tu: 31, ten: 'Trần Ngọc Như Quỳnh', ngay_sinh: '06/6/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-32', so_thu_tu: 32, ten: 'Trần Dũng Minh Tài', ngay_sinh: '12/7/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-33', so_thu_tu: 33, ten: 'Lâm Ngô Phúc Tấn', ngay_sinh: '30/11/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-34', so_thu_tu: 34, ten: 'Trần Nguyễn Hà Thanh', ngay_sinh: '07/02/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-35', so_thu_tu: 35, ten: 'Lâm Nguyên Thảo', ngay_sinh: '25/01/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-36', so_thu_tu: 36, ten: 'Trần Bảo Anh Thư', ngay_sinh: '11/11/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-37', so_thu_tu: 37, ten: 'Phạm Hoàng Tín', ngay_sinh: '04/02/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 0, loi_thuong_gap: ['Sai dấu hỏi/ngã', 'Lỗi câu cụt'] },
  { id: 'hs-38', so_thu_tu: 38, ten: 'Trần Khánh Tùng', ngay_sinh: '13/6/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 2, ti_le_hoan_thanh_tot: 50, loi_thuong_gap: ['Xưng hô chưa thống nhất'] },
  { id: 'hs-39', so_thu_tu: 39, ten: 'Nguyễn Ngọc Nhã Uyên', ngay_sinh: '10/10/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-40', so_thu_tu: 40, ten: 'Nguyễn Bá Vương', ngay_sinh: '04/7/2016', lop: '5/2', gioi_tinh: 'Nam', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-41', so_thu_tu: 41, ten: 'Trần Nguyễn Nhã Vy', ngay_sinh: '16/3/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
  { id: 'hs-42', so_thu_tu: 42, ten: 'Trần Hồ Bảo Yên', ngay_sinh: '09/9/2016', lop: '5/2', gioi_tinh: 'Nữ', so_bai_da_cham: 1, ti_le_hoan_thanh_tot: 100, loi_thuong_gap: [] },
];

// Initial sample history with students of class 5/2
const INITIAL_HISTORY_5_2: EvaluationResult[] = [
  {
    id: 'eval-52-1',
    ngay_tao: '2026-09-21T08:30:00.000Z',
    ten_hoc_sinh: 'Lê Xuân An',
    lop: '5/2',
    chu_diem: 'Thiên nhiên kì thú',
    bai_hoc: 'Bài 15: Bài ca về mặt trời',
    the_loai_bai_van: 'Tả phong cảnh',
    de_bai: 'Tả một cảnh biển đảo em đã được thấy tận mắt hoặc xem trên phim ảnh.',
    noi_dung_bai_viet: `Trong kì nghỉ hè vừa qua, em được bố mẹ cho đi nghỉ mát tại bãi biển Nha Trang. Đó là một chuyến đi vô cùng thú vị và để lại trong em những ấn tượng không thể nào quên.

Sáng sớm, khi vạn vật còn đang chìm trong giấc ngủ, bãi biển mang một vẻ đẹp tĩnh mịch và huyền ảo. Gió biển thổi vi vu, mang theo vị mặn mòi quen thuộc của đại dương bao la. Phía chân trời xa, một vệt sáng màu hồng cam bắt đầu le lói. Rồi từ từ, vầng mặt trời đỏ ối như chiếc mâm đồng khổng lồ đội biển nhô lên, toả những tia nắng ấm áp xuống mặt nước. Mặt biển đang từ màu xanh thẫm bỗng chốc được dát vàng lấp lánh như được khoác lên mình tấm áo choàng rực rỡ.

Càng về trưa, biển càng thêm nhộn nhịp. Từng con sóng bạc đầu xô nhau rượt đuổi vào bờ cát trắng mịn, tạo nên âm thanh rào rạt như bản hoà ca bất tận. Xa xa, những cánh buồm nâu lướt êm ả trên mặt nước, mang theo niềm vui của người dân chài sau chuyến ra khơi bội thu tôm cá. Bọn trẻ chúng em tha hồ nô đùa, xây lâu đài cát rồi ùa mình vào làn nước biển mát rượi.

Ngắm nhìn biển trời quê hương, lòng em dâng lên niềm tự hào sâu sắc. Em thầm hứa sẽ luôn có ý thức giữ gìn vệ sinh bãi biển để biển Việt Nam mãi giữ trọn vẻ đẹp hoang sơ, kì vĩ.`,
    muc_do_dat_duoc: 'Hoàn thành tốt',
    uu_diem_noi_bat:
      'Bài viết rất giàu hình ảnh, bố cục 3 phần cân đối và tự nhiên. Em Xuân An quan sát cảnh biển tinh tế bằng nhiều giác quan (thị giác, thính giác, khứu giác). Vận dụng rất khéo léo các biện pháp so sánh ("mâm đồng khổng lồ", "dát vàng lấp lánh") và từ ngữ gợi tả sinh động ("mặn mòi", "rào rạt", "bạc đầu"). Kết bài mở rộng bộc lộ tình yêu và ý thức trách nhiệm đẹp.',
    han_che_can_sua:
      'Một số câu văn miêu tả buổi sáng có thể tách nhịp bằng dấu phẩy để giọng văn thêm phần lắng đọng.',
    loi_nhan_xet_so_theo_doi:
      'Bài viết đạt mức Hoàn thành tốt. Cảm xúc chân thực, câu văn giàu hình ảnh và nghệ thuật so sánh. Khen ngợi ý thức bảo vệ cảnh đẹp quê hương của em.',
    goi_y_sua_cau:
      'Có thể thêm từ nối liên kết nhẹ nhàng: "Khi nắng mai bắt đầu chan hoà, mặt biển như được thay chiếc áo lộng lẫy..."',
    danh_gia_chi_tiet: {
      bo_cuc: {
        danh_gia: 'Đạt',
        chi_tiet: 'Mở bài gián tiếp tự nhiên, thân bài phân chia 2 khoảng thời gian sáng sớm và trưa rõ rệt, kết bài mở rộng.',
      },
      noi_dung_va_y_tuong: {
        danh_gia: 'Đạt',
        chi_tiet: 'Tả đúng đối tượng cảnh biển, làm nổi bật được vẻ đẹp hoang sơ và không khí nhộn nhịp của ngư dân.',
      },
      nghe_thuat_va_tu_ngu: {
        danh_gia: 'Đạt',
        chi_tiet: 'Sử dụng điêu luyện các tính từ chỉ màu sắc, ánh sáng và phép so sánh nhân hoá sinh động.',
      },
      chinh_ta_va_dat_cau: {
        danh_gia: 'Đạt',
        chi_tiet: 'Không mắc lỗi chính tả, câu ghép mạch lạc, đúng thể thức trình bày.',
        danh_sach_loi: [],
      },
    },
    loi_nhan_xet_hoc_sinh:
      'Xuân An có tâm hồn rất nhạy cảm và vốn từ ngữ phong phú. Cô rất tự hào về bức tranh biển Nha Trang sống động trong bài văn của em!',
    loi_nhan_xet_phu_huynh:
      'Gia đình tiếp tục tạo điều kiện cho em An đọc thêm sách văn học thiếu nhi để nuôi dưỡng trí tưởng tượng và năng khiếu viết văn.',
    da_duyet: true,
  },
  {
    id: 'eval-52-2',
    ngay_tao: '2026-09-23T10:15:00.000Z',
    ten_hoc_sinh: 'Nguyễn Huỳnh Quốc An',
    lop: '5/2',
    chu_diem: 'Thế giới tuổi thơ',
    bai_hoc: 'Bài 4: Bến sông tuổi thơ',
    the_loai_bai_van: 'Kể chuyện sáng tạo',
    de_bai: 'Đóng vai chú chuột xù kể lại câu chuyện chuyến phiêu lưu mạo hiểm sang bờ bên kia sông.',
    noi_dung_bai_viet: `Chào các bạn, tôi là chuột xù đây. Hôm nay tôi sẽ kể cho các bạn nghe về chuyến phiêu lưu mạo hiểm của tôi và bạn mèo nhép.

Hôm đó là một ngày đẹp trời, mèo nhép rủ tôi sang bờ sông bên kia chơi. Tôi nhớ lời bác ngựa dặn là bên đó rất nguy hiểm nên đã từ chối. Nhưng mèo nhép cứ nằng nặc đòi đi, tôi sợ bạn gặp nạn nên đành đi theo.

Khi sang đến nơi, bờ cỏ xanh mướt làm mèo nhép thích thú nhảy nhót khắp nơi. Bỗng nhiên, một con rắn hổ mang to lớn thò đầu ra định cắn mèo nhép. Thấy bạn gặp nguy, tôi vội lao đến đẩy bạn ra. Con rắn quay sang đuổi theo tôi, tôi sợ quá hét toáng lên: "Bác ngựa ơi cứu chúng cháu với!". May sao bác ngựa đang gặm cỏ gần đó nghe thấy liền phi tới dùng móng đá văng con rắn.

Sau lần đó, mèo nhép đã nhận ra bài học quý giá. Tôi cũng rất vui vì đã cứu được bạn và giữ được tình bạn thân thiết.`,
    muc_do_dat_duoc: 'Hoàn thành',
    uu_diem_noi_bat:
      'Em Quốc An đã biết đóng vai nhân vật chuột xù để xưng "tôi" tự tin, kể đúng cốt truyện và sáng tạo thêm tình huống bất ngờ với con rắn hổ mang rất gay cấn. Hành động dũng cảm cứu bạn của chuột xù được thể hiện rõ ràng.',
    han_che_can_sua:
      'Cần miêu tả sâu sắc hơn nội tâm và cảm giác sợ hãi của chuột xù khi đối diện hiểm nguy. Đoạn kết nên nêu rõ hơn mèo nhép đã nói gì để xin lỗi và cảm ơn bạn.',
    loi_nhan_xet_so_theo_doi:
      'Bài viết đạt mức Hoàn thành. Nhập vai kể chuyện sinh động, có chi tiết sáng tạo kịch tính. Em chú ý trau chuốt thêm cảm xúc nội tâm nhân vật.',
    goi_y_sua_cau:
      'Thay câu "Sau lần đó, mèo nhép đã nhận ra bài học quý giá" bằng câu: "Mèo nhép rơm rớm nước mắt ôm chầm lấy tôi, khẽ thầm thì: Cảm ơn cậu, từ nay tớ sẽ không bao giờ bướng bỉnh nữa!"',
    danh_gia_chi_tiet: {
      bo_cuc: {
        danh_gia: 'Đạt',
        chi_tiet: 'Đủ 3 phần, ngôi kể thứ nhất xuyên suốt.',
      },
      noi_dung_va_y_tuong: {
        danh_gia: 'Đạt',
        chi_tiet: 'Sáng tạo thêm chi tiết con rắn tấn công và bác ngựa kịp thời cứu nguy.',
      },
      nghe_thuat_va_tu_ngu: {
        danh_gia: 'Khá',
        chi_tiet: 'Từ ngữ diễn đạt nhanh nhưng còn hơi mộc mạc, ít dùng từ tượng hình tượng thanh.',
      },
      chinh_ta_va_dat_cau: {
        danh_gia: 'Khá',
        chi_tiet: 'Viết đúng chính tả, câu kể ngắn gọn.',
        danh_sach_loi: [
          {
            loai_loi: 'Dùng từ',
            tu_hoac_cau_sai: 'bờ cỏ xanh mướt làm mèo nhép thích thú nhảy nhót',
            sua_lai: 'thảm cỏ xanh mướt khiến mèo nhép thích thú tung tăng nhảy nhót',
            cau_goc: 'Khi sang đến nơi, bờ cỏ xanh mướt làm mèo nhép thích thú nhảy nhót khắp nơi.',
            cau_sua_hoan_chinh: 'Khi sang đến nơi, thảm cỏ xanh mướt mát lành khiến mèo nhép vô cùng thích thú tung tăng nhảy nhót khắp nơi.',
            vi_tri_ngu_canh: 'Đoạn 3, câu 1',
            giai_thich_ngan: 'Dùng từ "thảm cỏ" và từ nối "khiến" giúp câu văn giàu hình ảnh và tự nhiên hơn.',
          },
        ],
      },
    },
    loi_nhan_xet_hoc_sinh:
      'Quốc An kể chuyện rất hào hứng và hấp dẫn! Lần sau em hãy dừng lại một chút để tả thêm vẻ mặt run rẩy của bạn mèo nhé, câu chuyện sẽ còn lôi cuốn hơn nữa đấy!',
    loi_nhan_xet_phu_huynh:
      'Quốc An có trí tưởng tượng rất tốt, bố mẹ có thể khuyến khích em tập kể lại những câu chuyện em đã đọc trước giờ đi ngủ.',
    da_duyet: true,
  },
  {
    id: 'eval-52-3',
    ngay_tao: '2026-09-25T15:20:00.000Z',
    ten_hoc_sinh: 'Trần Khánh Tùng',
    lop: '5/2',
    chu_diem: 'Vẻ đẹp cuộc sống',
    bai_hoc: 'Bài 6: Thư của bố',
    the_loai_bai_van: 'Bài văn tả người',
    de_bai: 'Viết bài văn tả một người thân trong gia đình em.',
    noi_dung_bai_viet: `Nhà em có nhiều người nhưng em yêu nhất là bà nội em.

Bà em năm nay 65 tuổi. Bà em giáng người cao cao, tóc đã bạc nhiều sợi trăng trắng. Khuôn mặt bà có nhiều nếp nhăn và đôi mắt bà hơi mờ nên lúc nào đọc báo bà cũng phải đeo kính lão. Bà rất hay mặc chiếc áo bà ba màu nâu xẫm rất dản dị. Tính tình bà rất hiền từ và thương yêu con cháu hết mực. Mỗi ngày bà hay nấu cơm cho cả nhà ăn. Nấu canh rau ngót với thịt băm rất ngon. Chiều nào bà cũng đón em đi học về rồi cho em ăn bánh xôi chè.

Bà là chỗ dựa tinh thần của em, em mong bà luôn mạnh khoẻ và sống lâu trăm tuổi.`,
    muc_do_dat_duoc: 'Hoàn thành',
    uu_diem_noi_bat:
      'Em Khánh Tùng đã thể hiện được tình cảm yêu thương, kính trọng chân thành dành cho bà nội. Bài viết nêu được những nét tiêu biểu về ngoại hình của bà (mái tóc bạc, kính lão, chiếc áo bà ba) và việc làm chăm sóc chu đáo của bà đối với gia đình.',
    han_che_can_sua:
      'Bài viết còn mắc một số lỗi chính tả cơ bản (giáng người -> dáng người, nâu xẫm -> nâu sẫm, dản dị -> giản dị). Có câu văn cụt thiếu chủ ngữ ("Nấu canh rau ngót..."). Cần thêm một vài chi tiết miêu tả ánh mắt hoặc bàn tay ấm áp của bà khi chăm sóc em để bài văn xúc động hơn.',
    loi_nhan_xet_so_theo_doi:
      'Bài viết đạt mức Hoàn thành. Tình cảm với bà chân thành, tả được nét tiêu biểu của bà. Em cần chú ý rèn chính tả phụ âm s/x, d/gi và tránh viết câu thiếu chủ ngữ.',
    goi_y_sua_cau:
      'Nên sửa câu cụt "Nấu canh rau ngót với thịt băm rất ngon" thành: "Món canh rau ngót nấu thịt băm do chính tay bà nấu lúc nào cũng thơm ngọt đậm đà."',
    danh_gia_chi_tiet: {
      bo_cuc: {
        danh_gia: 'Khá',
        chi_tiet: 'Đủ 3 phần nhưng mở bài còn theo khuôn mẫu ("Nhà em có..."). Nên dẫn dắt bằng một kỉ niệm hoặc lời ru ấm áp của bà.',
      },
      noi_dung_va_y_tuong: {
        danh_gia: 'Đạt',
        chi_tiet: 'Tả đúng người thân, có quan sát ngoại hình và hoạt động nấu ăn, đón cháu.',
      },
      nghe_thuat_va_tu_ngu: {
        danh_gia: 'Khá',
        chi_tiet: 'Từ ngữ còn đơn giản, chưa sử dụng biện pháp so sánh (ví dụ: tóc bà bạc trắng như cước, mắt bà hiền từ như vầng trăng).',
      },
      chinh_ta_va_dat_cau: {
        danh_gia: 'Cần cải thiện',
        chi_tiet: 'Mắc 3 lỗi chính tả và 1 lỗi câu cụt thiếu chủ ngữ.',
        danh_sach_loi: [
          {
            loai_loi: 'Chính tả',
            tu_hoac_cau_sai: 'giáng người',
            sua_lai: 'dáng người',
            cau_goc: 'Bà em giáng người cao cao, tóc đã bạc nhiều sợi trăng trắng.',
            cau_sua_hoan_chinh: 'Bà em có dáng người dong dỏng cao, mái tóc đã điểm nhiều sợi bạc.',
            vi_tri_ngu_canh: 'Đoạn 2, câu 1',
            giai_thich_ngan: '"dáng" (dáng vóc, vóc dáng) viết bằng "d", không viết bằng "gi".',
          },
          {
            loai_loi: 'Chính tả',
            tu_hoac_cau_sai: 'nâu xẫm',
            sua_lai: 'nâu sẫm',
            cau_goc: 'Bà hay mặc chiếc áo bà ba màu nâu xẫm rất dản dị.',
            cau_sua_hoan_chinh: 'Bà thường mặc chiếc áo bà ba màu nâu sẫm rất giản dị.',
            vi_tri_ngu_canh: 'Đoạn 2, câu 3',
            giai_thich_ngan: '"sẫm" (màu đậm, tối) viết bằng âm đầu "s".',
          },
          {
            loai_loi: 'Chính tả',
            tu_hoac_cau_sai: 'dản dị',
            sua_lai: 'giản dị',
            cau_goc: 'Bà hay mặc chiếc áo bà ba màu nâu xẫm rất dản dị.',
            cau_sua_hoan_chinh: 'Bà thường mặc chiếc áo bà ba màu nâu sẫm rất giản dị.',
            vi_tri_ngu_canh: 'Đoạn 2, câu 3',
            giai_thich_ngan: '"giản dị" bắt đầu bằng phụ âm "gi".',
          },
          {
            loai_loi: 'Đặt câu',
            tu_hoac_cau_sai: 'Nấu canh rau ngót với thịt băm rất ngon.',
            sua_lai: 'Món canh rau ngót bà nấu với thịt băm rất ngon.',
            cau_goc: 'Nấu canh rau ngót với thịt băm rất ngon.',
            cau_sua_hoan_chinh: 'Món canh rau ngót nấu thịt băm do chính tay bà nấu bao giờ cũng thơm ngon, ngọt lịm.',
            vi_tri_ngu_canh: 'Đoạn 2, câu 6',
            giai_thich_ngan: 'Câu này bị cụt vì thiếu chủ ngữ (ai nấu hoặc món gì ngon). Cần bổ sung chủ ngữ để câu văn trọn vẹn.',
          },
        ],
      },
    },
    loi_nhan_xet_hoc_sinh:
      'Khánh Tùng rất ngoan và yêu quý bà! Em nhớ rèn thêm chính tả các từ "dáng", "sẫm", "giản dị" và tập viết câu có đủ chủ ngữ - vị ngữ nhé!',
    loi_nhan_xet_phu_huynh:
      'Nhờ phụ huynh nhắc em đọc lại bài sau khi viết để soát lỗi thiếu chủ ngữ và phân biệt phụ âm s/x, d/gi.',
    da_duyet: true,
  },
];

export const StorageService = {
  getStudents(): StudentProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length >= 40) {
          return parsed;
        }
      }
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(OFFICIAL_STUDENTS_CLASS_5_2));
      return OFFICIAL_STUDENTS_CLASS_5_2;
    } catch {
      return OFFICIAL_STUDENTS_CLASS_5_2;
    }
  },

  resetToClass52(): StudentProfile[] {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(OFFICIAL_STUDENTS_CLASS_5_2));
    return OFFICIAL_STUDENTS_CLASS_5_2;
  },

  saveStudents(students: StudentProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students:', e);
    }
  },

  addStudent(student: Omit<StudentProfile, 'id' | 'so_bai_da_cham' | 'ti_le_hoan_thanh_tot' | 'loi_thuong_gap'>): StudentProfile {
    const list = this.getStudents();
    const newStudent: StudentProfile = {
      ...student,
      id: `hs-${Date.now()}`,
      so_thu_tu: list.length + 1,
      so_bai_da_cham: 0,
      ti_le_hoan_thanh_tot: 0,
      loi_thuong_gap: [],
    };
    list.push(newStudent);
    this.saveStudents(list);
    return newStudent;
  },

  getHistory(): EvaluationResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_HISTORY_5_2));
      return INITIAL_HISTORY_5_2;
    } catch {
      return INITIAL_HISTORY_5_2;
    }
  },

  saveEvaluation(evaluation: EvaluationResult): void {
    try {
      const history = this.getHistory();
      const existingIndex = history.findIndex((h) => h.id === evaluation.id);
      if (existingIndex >= 0) {
        history[existingIndex] = evaluation;
      } else {
        history.unshift(evaluation);
      }
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

      // Update student profile stats
      this.recalculateStudentStats(evaluation.ten_hoc_sinh);
    } catch (e) {
      console.error('Failed to save evaluation:', e);
    }
  },

  deleteEvaluation(id: string): void {
    const history = this.getHistory();
    const item = history.find((h) => h.id === id);
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    if (item) {
      this.recalculateStudentStats(item.ten_hoc_sinh);
    }
  },

  clearAllHistory(): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    const students = this.getStudents();
    students.forEach((s) => {
      s.so_bai_da_cham = 0;
      s.ti_le_hoan_thanh_tot = 0;
      s.loi_thuong_gap = [];
    });
    this.saveStudents(students);
  },

  resetToInitialHistory(): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_HISTORY_5_2));
    this.recalculateAllStudentsStats();
  },

  recalculateAllStudentsStats(): void {
    const students = this.getStudents();
    const history = this.getHistory();
    students.forEach((student) => {
      const studentHistory = history.filter((h) => h.ten_hoc_sinh.toLowerCase() === student.ten.toLowerCase());
      student.so_bai_da_cham = studentHistory.length;
      if (studentHistory.length > 0) {
        const totCount = studentHistory.filter((h) => h.muc_do_dat_duoc === 'Hoàn thành tốt').length;
        student.ti_le_hoan_thanh_tot = Math.round((totCount / studentHistory.length) * 100);

        const errorMap: Record<string, number> = {};
        studentHistory.forEach((h) => {
          h.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi?.forEach((err) => {
            const key = `${err.loai_loi}: ${err.tu_hoac_cau_sai} -> ${err.sua_lai}`;
            errorMap[key] = (errorMap[key] || 0) + 1;
          });
        });
        student.loi_thuong_gap = Object.entries(errorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([k]) => k);
      } else {
        student.ti_le_hoan_thanh_tot = 0;
        student.loi_thuong_gap = [];
      }
    });
    this.saveStudents(students);
  },

  recalculateStudentStats(studentName: string) {
    const students = this.getStudents();
    const student = students.find((s) => s.ten.toLowerCase() === studentName.toLowerCase());
    if (!student) return;

    const history = this.getHistory().filter((h) => h.ten_hoc_sinh.toLowerCase() === studentName.toLowerCase());
    student.so_bai_da_cham = history.length;
    if (history.length > 0) {
      const totCount = history.filter((h) => h.muc_do_dat_duoc === 'Hoàn thành tốt').length;
      student.ti_le_hoan_thanh_tot = Math.round((totCount / history.length) * 100);

      // Collect top errors
      const errorMap: Record<string, number> = {};
      history.forEach((h) => {
        h.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi?.forEach((err) => {
          const key = `${err.loai_loi}: ${err.tu_hoac_cau_sai} -> ${err.sua_lai}`;
          errorMap[key] = (errorMap[key] || 0) + 1;
        });
      });
      student.loi_thuong_gap = Object.entries(errorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k]) => k);
    } else {
      student.ti_le_hoan_thanh_tot = 0;
      student.loi_thuong_gap = [];
    }
    this.saveStudents(students);
  },

  getTotalOverallStats(): TotalOverallStats {
    const history = this.getHistory();
    const students = this.getStudents();
    const totalEvaluations = history.length;

    // Unique students evaluated
    const evaluatedStudentNames = new Set(history.map((h) => h.ten_hoc_sinh.toLowerCase()));
    const studentsEvaluatedCount = evaluatedStudentNames.size;
    const coveragePercent = students.length > 0 ? Math.round((studentsEvaluatedCount / students.length) * 100) : 0;

    const totCount = history.filter((h) => h.muc_do_dat_duoc === 'Hoàn thành tốt').length;
    const htCount = history.filter((h) => h.muc_do_dat_duoc === 'Hoàn thành').length;
    const chuaHtCount = history.filter((h) => h.muc_do_dat_duoc === 'Chưa hoàn thành').length;

    const totPercent = totalEvaluations > 0 ? Math.round((totCount / totalEvaluations) * 100) : 0;
    const htPercent = totalEvaluations > 0 ? Math.round((htCount / totalEvaluations) * 100) : 0;
    const chuaHtPercent = totalEvaluations > 0 ? Math.round((chuaHtCount / totalEvaluations) * 100) : 0;

    const vietCount = history.filter((h) => h.phan_mon !== 'ltvc').length;
    const ltvcCount = history.filter((h) => h.phan_mon === 'ltvc').length;

    let totalErrorsFound = 0;
    const errorCategoryCount: Record<string, number> = {
      'Chính tả': 0,
      'Dùng từ': 0,
      'Đặt câu': 0,
      'Dấu câu': 0,
      'Bố cục': 0,
    };
    const specificErrors: Record<string, number> = {};

    let totalQuestions = 0;
    let qDung = 0;
    let qDungMotPhan = 0;
    let qChuaDung = 0;

    history.forEach((item) => {
      item.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi?.forEach((err) => {
        totalErrorsFound++;
        if (err.loai_loi) {
          errorCategoryCount[err.loai_loi] = (errorCategoryCount[err.loai_loi] || 0) + 1;
        }
        const key = `${err.tu_hoac_cau_sai} ➔ ${err.sua_lai}`;
        specificErrors[key] = (specificErrors[key] || 0) + 1;
      });

      if (item.ket_qua_tung_cau && item.ket_qua_tung_cau.length > 0) {
        item.ket_qua_tung_cau.forEach((q) => {
          totalQuestions++;
          if (q.ket_qua === 'Đúng') qDung++;
          else if (q.ket_qua === 'Đúng một phần') qDungMotPhan++;
          else qChuaDung++;
        });
      }
    });

    return {
      totalEvaluations,
      totalStudents: students.length,
      studentsEvaluatedCount,
      coveragePercent,
      levels: {
        tot: totCount,
        hoanThanh: htCount,
        chuaHoanThanh: chuaHtCount,
      },
      levelsPercent: {
        tot: totPercent,
        hoanThanh: htPercent,
        chuaHoanThanh: chuaHtPercent,
      },
      byDomain: {
        viet: vietCount,
        ltvc: ltvcCount,
      },
      totalErrorsFound,
      errorCategoryCount,
      topCommonErrors: Object.entries(specificErrors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      ltvcQuestionsStats: {
        totalQuestions,
        dung: qDung,
        dungMotPhan: qDungMotPhan,
        chuaDung: qChuaDung,
        dungPercent: totalQuestions > 0 ? Math.round((qDung / totalQuestions) * 100) : 0,
      },
    };
  },

  getStatsByAssignment(): AssignmentStats[] {
    const history = this.getHistory();
    const students = this.getStudents();
    const totalClassStudents = students.length || 42;

    // Group evaluations by unique assignment key (bai_hoc + de_bai + phan_mon)
    const assignmentMap: Record<string, EvaluationResult[]> = {};

    history.forEach((item) => {
      const deBaiKey = (item.de_bai || '').trim().substring(0, 60);
      const key = `${item.phan_mon || 'viet'}__${item.bai_hoc}__${deBaiKey}`;
      if (!assignmentMap[key]) {
        assignmentMap[key] = [];
      }
      assignmentMap[key].push(item);
    });

    const result: AssignmentStats[] = Object.entries(assignmentMap).map(([key, evals]) => {
      const first = evals[0];
      const totalEvaluated = evals.length;
      const completionRate = Math.round((totalEvaluated / totalClassStudents) * 100);

      const totCount = evals.filter((e) => e.muc_do_dat_duoc === 'Hoàn thành tốt').length;
      const htCount = evals.filter((e) => e.muc_do_dat_duoc === 'Hoàn thành').length;
      const chuaHtCount = evals.filter((e) => e.muc_do_dat_duoc === 'Chưa hoàn thành').length;

      const totPercent = totalEvaluated > 0 ? Math.round((totCount / totalEvaluated) * 100) : 0;
      const htPercent = totalEvaluated > 0 ? Math.round((htCount / totalEvaluated) * 100) : 0;
      const chuaHtPercent = totalEvaluated > 0 ? Math.round((chuaHtCount / totalEvaluated) * 100) : 0;

      // Graded students list
      const gradedStudents: GradedStudentSummary[] = evals.map((e) => ({
        evalId: e.id,
        studentName: e.ten_hoc_sinh,
        muc_do_dat_duoc: e.muc_do_dat_duoc,
        ngay_tao: e.ngay_tao,
        loi_nhan_xet_so_theo_doi: e.loi_nhan_xet_so_theo_doi,
        so_loi: e.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi?.length || 0,
      }));

      // Not graded students in class 5/2
      const gradedNames = new Set(evals.map((e) => e.ten_hoc_sinh.toLowerCase()));
      const notGradedStudents = students.filter((s) => !gradedNames.has(s.ten.toLowerCase()));

      // Top errors specifically for this assignment
      const assignmentErrors: Record<string, number> = {};
      evals.forEach((e) => {
        e.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi?.forEach((err) => {
          const errKey = `${err.tu_hoac_cau_sai} ➔ ${err.sua_lai} (${err.loai_loi})`;
          assignmentErrors[errKey] = (assignmentErrors[errKey] || 0) + 1;
        });
      });

      return {
        key,
        bai_hoc: first.bai_hoc,
        chu_diem: first.chu_diem,
        the_loai_bai_van: first.the_loai_bai_van,
        phan_mon: (first.phan_mon as any) || 'viet',
        de_bai: first.de_bai,
        totalEvaluated,
        totalClassStudents,
        completionRate,
        levels: {
          tot: totCount,
          hoanThanh: htCount,
          chuaHoanThanh: chuaHtCount,
        },
        levelsPercent: {
          tot: totPercent,
          hoanThanh: htPercent,
          chuaHoanThanh: chuaHtPercent,
        },
        gradedStudents,
        notGradedStudents,
        topErrorsInAssignment: Object.entries(assignmentErrors)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5),
      };
    });

    return result.sort((a, b) => b.totalEvaluated - a.totalEvaluated);
  },

  getClassStats() {
    const overall = this.getTotalOverallStats();
    return {
      totalEvals: overall.totalEvaluations,
      totalStudents: overall.totalStudents,
      levels: overall.levels,
      errorCategoryCount: overall.errorCategoryCount,
      topCommonErrors: overall.topCommonErrors,
    };
  },

  // ==================== COMMENT BANK (NGÂN HÀNG LỜI NHẬN XÉT) ====================
  getCommentBank(): CommentBankItem[] {
    try {
      // Check legacy key if teacher had created custom comments
      let legacyCustom: CommentBankItem[] = [];
      try {
        const legacyStored = localStorage.getItem('tro_ly_cham_bai_comment_bank_v1');
        if (legacyStored) {
          const legacyParsed = JSON.parse(legacyStored);
          if (Array.isArray(legacyParsed)) {
            legacyCustom = legacyParsed.filter((i: CommentBankItem) => i.isCustom);
          }
        }
      } catch {
        // ignore
      }

      const stored = localStorage.getItem(STORAGE_KEYS.COMMENT_BANK);
      if (!stored) {
        const initial = [...legacyCustom, ...DEFAULT_COMMENT_BANK];
        localStorage.setItem(STORAGE_KEYS.COMMENT_BANK, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If stored bank has fewer items than current DEFAULT_COMMENT_BANK, refresh with default while preserving custom
        if (parsed.length < DEFAULT_COMMENT_BANK.length) {
          const customItems = parsed.filter((i: CommentBankItem) => i.isCustom);
          const combined = [
            ...customItems,
            ...legacyCustom.filter((lc) => !customItems.some((ci) => ci.id === lc.id)),
            ...DEFAULT_COMMENT_BANK,
          ];
          localStorage.setItem(STORAGE_KEYS.COMMENT_BANK, JSON.stringify(combined));
          return combined;
        }
        return parsed;
      }
      const fallback = [...legacyCustom, ...DEFAULT_COMMENT_BANK];
      return fallback;
    } catch {
      return DEFAULT_COMMENT_BANK;
    }
  },

  saveCustomComment(item: Omit<CommentBankItem, 'id' | 'isCustom'>): CommentBankItem {
    const newItem: CommentBankItem = {
      ...item,
      id: `custom-cb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isCustom: true,
    };
    const current = this.getCommentBank();
    const updated = [newItem, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENT_BANK, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving custom comment:', e);
    }
    return newItem;
  },

  updateComment(id: string, updatedFields: Partial<CommentBankItem>): void {
    const current = this.getCommentBank();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENT_BANK, JSON.stringify(updated));
    } catch (e) {
      console.error('Error updating comment:', e);
    }
  },

  deleteComment(id: string): void {
    const current = this.getCommentBank();
    const updated = current.filter((c) => c.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENT_BANK, JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting comment:', e);
    }
  },

  resetCommentBank(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENT_BANK, JSON.stringify(DEFAULT_COMMENT_BANK));
    } catch (e) {
      console.error('Error resetting comment bank:', e);
    }
  },
};
