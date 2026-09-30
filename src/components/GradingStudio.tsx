import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  BookOpen,
  FileText,
  User,
  CheckCircle,
  AlertTriangle,
  Copy,
  Printer,
  Save,
  Eye,
  Check,
  ChevronRight,
  Info,
  Edit3,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Maximize2,
  RefreshCw,
  Layers,
  SwitchCamera,
  Filter,
  X,
  PenLine,
  CheckSquare,
  HelpCircle,
  ArrowUpRight,
  BookmarkCheck,
  MessageSquare,
  Search,
} from 'lucide-react';
import {
  GRADE_5_LESSONS,
  SAMPLE_STUDENT_ESSAYS,
  GRADE_5_LTVC_LESSONS,
  SAMPLE_LTVC_EXERCISES,
} from '../data/curriculumData';
import {
  EvaluationResult,
  AchievementLevel,
  SpellingOrGrammarError,
  LearningDomain,
  LtvcQuestionCheck,
  CommentBankItem,
} from '../types';
import { StorageService } from '../services/api';
import { PrintEvaluationSheet } from './PrintEvaluationSheet';

interface ImagePage {
  id: string;
  dataUrl: string;
  name: string;
  mimeType: string;
}

interface Props {
  onEvaluationSaved: (evaluation: EvaluationResult) => void;
  selectedStudentFromList?: string | null;
}

export const GradingStudio: React.FC<Props> = ({ onEvaluationSaved, selectedStudentFromList }) => {
  // Step 1: Configuration & Learning Domain
  const [domain, setDomain] = useState<LearningDomain>('viet');
  const [grade, setGrade] = useState<number>(5);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(GRADE_5_LESSONS[0].id);
  const [selectedLtvcLessonId, setSelectedLtvcLessonId] = useState<string>(GRADE_5_LTVC_LESSONS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>(GRADE_5_LESSONS[0].deBaiGoiY[0]);
  const [studentName, setStudentName] = useState<string>(selectedStudentFromList || 'Lê Xuân An');
  const [teacherNotes, setTeacherNotes] = useState<string>('');

  useEffect(() => {
    setStudentsList(StorageService.getStudents());
  }, []);

  // Input Method & Content
  const [inputTab, setInputTab] = useState<'text' | 'image' | 'sample'>('image');
  const [writingText, setWritingText] = useState<string>('');
  const [imagesList, setImagesList] = useState<ImagePage[]>([]);
  const [isOcrLoading, setIsOcrLoading] = useState<boolean>(false);

  // Evaluation & Processing States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Comment Bank Picker State
  const [showCommentBankModal, setShowCommentBankModal] = useState<boolean>(false);
  const [commentBankItems, setCommentBankItems] = useState<CommentBankItem[]>([]);
  const [commentBankSearch, setCommentBankSearch] = useState<string>('');
  const [commentBankToast, setCommentBankToast] = useState<string | null>(null);

  // Fullscreen Image Lightbox
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Camera capture modal state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashEffect, setFlashEffect] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraFileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  // Sync camera stream to video element when camera modal is active
  const setVideoRef = (element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && mediaStreamRef.current) {
      element.srcObject = mediaStreamRef.current;
      element.play().catch((err) => console.log('Camera auto-play:', err));
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch((err) => console.log('Camera auto-play:', err));
    }
  }, [isCameraActive]);

  // Detailed Error Management States (Chính tả, Dùng từ, Đặt câu, Dấu câu)
  const [errorFilter, setErrorFilter] = useState<'all' | 'Chính tả' | 'Dùng từ' | 'Đặt câu' | 'Dấu câu' | 'Bố cục'>('all');
  const [errorViewMode, setErrorViewMode] = useState<'cards' | 'table'>('cards');
  const [showTextHighlight, setShowTextHighlight] = useState<boolean>(true);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);
  const [showAddErrorModal, setShowAddErrorModal] = useState<boolean>(false);
  const [editingErrorIndex, setEditingErrorIndex] = useState<number | null>(null);
  const [copiedSentenceIdx, setCopiedSentenceIdx] = useState<number | null>(null);
  const [copiedExercise, setCopiedExercise] = useState<boolean>(false);
  const [errorForm, setErrorForm] = useState<SpellingOrGrammarError>({
    loai_loi: 'Chính tả',
    tu_hoac_cau_sai: '',
    sua_lai: '',
    vi_tri_ngu_canh: '',
    cau_goc: '',
    cau_sua_hoan_chinh: '',
    giai_thich_ngan: '',
  });

  // Sync current lesson object
  const currentLesson = GRADE_5_LESSONS.find((l) => l.id === selectedLessonId) || GRADE_5_LESSONS[0];
  const currentLtvcLesson =
    GRADE_5_LTVC_LESSONS.find((l) => l.id === selectedLtvcLessonId) || GRADE_5_LTVC_LESSONS[0];

  const handleDomainChange = (newDomain: LearningDomain) => {
    setDomain(newDomain);
    if (newDomain === 'ltvc') {
      const lesson = GRADE_5_LTVC_LESSONS.find((l) => l.id === selectedLtvcLessonId) || GRADE_5_LTVC_LESSONS[0];
      if (lesson && lesson.deBaiGoiY.length > 0) {
        setCustomPrompt(lesson.deBaiGoiY[0]);
      }
    } else {
      const lesson = GRADE_5_LESSONS.find((l) => l.id === selectedLessonId) || GRADE_5_LESSONS[0];
      if (lesson && lesson.deBaiGoiY.length > 0) {
        setCustomPrompt(lesson.deBaiGoiY[0]);
      }
    }
  };

  const handleLtvcLessonChange = (newLessonId: string) => {
    setSelectedLtvcLessonId(newLessonId);
    const lesson = GRADE_5_LTVC_LESSONS.find((l) => l.id === newLessonId);
    if (lesson && lesson.deBaiGoiY.length > 0) {
      setCustomPrompt(lesson.deBaiGoiY[0]);
    }
  };

  useEffect(() => {
    if (selectedStudentFromList) {
      setStudentName(selectedStudentFromList);
    }
  }, [selectedStudentFromList]);

  // When lesson changes, update suggested prompt
  const handleLessonChange = (newLessonId: string) => {
    setSelectedLessonId(newLessonId);
    const lesson = GRADE_5_LESSONS.find((l) => l.id === newLessonId);
    if (lesson && lesson.deBaiGoiY.length > 0) {
      setCustomPrompt(lesson.deBaiGoiY[0]);
    }
  };

  // Helper: Compress and downsample image file to keep payload fast and light
  const compressImageFile = (file: File): Promise<{ dataUrl: string; mimeType: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultStr = e.target?.result as string;
        if (!resultStr) {
          resolve({ dataUrl: '', mimeType: file.type || 'image/jpeg' });
          return;
        }
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 1600;
          let { width, height } = img;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve({ dataUrl, mimeType: 'image/jpeg' });
          } else {
            resolve({ dataUrl: resultStr, mimeType: file.type || 'image/jpeg' });
          }
        };
        img.onerror = () => {
          resolve({ dataUrl: resultStr, mimeType: file.type || 'image/jpeg' });
        };
        img.src = resultStr;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Multi-file Upload
  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    for (let index = 0; index < fileArray.length; index++) {
      const file = fileArray[index];
      const compressed = await compressImageFile(file);
      if (compressed.dataUrl) {
        setImagesList((prev) => [
          ...prev,
          {
            id: `img-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
            dataUrl: compressed.dataUrl,
            name: file.name,
            mimeType: compressed.mimeType,
          },
        ]);
      }
    }

    // Reset input so same files can be re-selected if needed
    e.target.value = '';
  };

  // Move page up/down in sequence
  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= imagesList.length) return;
    setImagesList((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIdx];
      copy[newIdx] = temp;
      return copy;
    });
  };

  const removeImage = (index: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Camera start & stream setup with robust progressive fallback
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback for browsers or embedded webviews without live getUserMedia
        cameraFileInputRef.current?.click();
        return;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      let stream: MediaStream | null = null;
      const constraintCandidates: MediaStreamConstraints[] = [
        {
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        },
        {
          video: {
            facingMode: mode,
          },
          audio: false,
        },
        {
          video: true,
          audio: false,
        },
      ];

      for (const constraints of constraintCandidates) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (stream) break;
        } catch (candidateErr) {
          console.warn('Candidate constraint failed, trying next:', candidateErr);
        }
      }

      if (!stream) {
        throw new Error('Không thể khởi tạo luồng camera');
      }

      mediaStreamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Không thể mở stream camera trực tiếp, chuyển sang máy ảnh thiết bị:', err);
      setIsCameraActive(false);
      // Fallback directly to native camera input without blocking prompt
      try {
        cameraFileInputRef.current?.click();
      } catch (_) {}
    }
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      if (videoRef.current.videoWidth === 0) {
        // Stream not ready yet
        return;
      }

      // Haptic vibration feedback if supported
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate(60);
        }
      } catch (_) {}

      // Trigger flash visual feedback
      setFlashEffect(true);
      setTimeout(() => setFlashEffect(false), 200);

      try {
        const vid = videoRef.current;
        const w = (vid.videoWidth && vid.videoWidth > 0) ? vid.videoWidth : 1280;
        const h = (vid.videoHeight && vid.videoHeight > 0) ? vid.videoHeight : 720;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(vid, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          const pageNum = imagesList.length + 1;
          setImagesList((prev) => [
            ...prev,
            {
              id: `snap-${Date.now()}-${pageNum}`,
              dataUrl,
              name: `Trang ${pageNum} (Chụp trực tiếp)`,
              mimeType: 'image/jpeg',
            },
          ]);
        }
      } catch (captureErr) {
        console.warn('Lỗi khi chụp hình từ camera canvas:', captureErr);
      }
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // OCR Pre-extraction for all pages
  const handleRunOcr = async () => {
    if (imagesList.length === 0) return;
    setIsOcrLoading(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/ocr-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imagesList.map((img) => ({
            data: img.dataUrl,
            mimeType: img.mimeType,
          })),
        }),
      });
      const rawText = await res.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          res.ok
            ? 'Dữ liệu phản hồi nhận diện ảnh không đúng định dạng JSON.'
            : `Máy chủ phản hồi mã lỗi ${res.status}. Vui lòng thử lại sau ít giây.`
        );
      }
      if (data.success && data.text) {
        setWritingText(data.text);
        setInputTab('text');
      } else {
        throw new Error(data.message || 'Lỗi nhận diện chữ viết trong ảnh.');
      }
    } catch (e: any) {
      setAnalysisError(e.message || 'Không thể trích xuất chữ viết tay. Bạn có thể gõ trực tiếp văn bản.');
    } finally {
      setIsOcrLoading(false);
    }
  };

  // Apply Sample Essay (Tập làm văn)
  const handleLoadSample = (sample: (typeof SAMPLE_STUDENT_ESSAYS)[0]) => {
    setDomain('viet');
    setStudentName(sample.studentName);
    setGrade(sample.grade);
    setCustomPrompt(sample.promptTitle);
    setTeacherNotes(sample.teacherNotes || '');
    setWritingText(sample.content);
    setImagesList([]);
    setInputTab('text');

    const matchedLesson = GRADE_5_LESSONS.find(
      (l) => l.chuDiem === sample.unit || l.dangBaiViet === sample.writingType
    );
    if (matchedLesson) {
      setSelectedLessonId(matchedLesson.id);
    }
  };

  // Apply Sample LTVC Exercise (Luyện từ và câu)
  const handleLoadLtvcSample = (sample: (typeof SAMPLE_LTVC_EXERCISES)[0]) => {
    setDomain('ltvc');
    setStudentName(sample.studentName);
    setGrade(sample.grade);
    setCustomPrompt(sample.exercisePrompt);
    setTeacherNotes(sample.teacherNotes || '');
    setWritingText(sample.studentSubmission);
    setImagesList([]);
    setInputTab('text');

    const matchedLesson = GRADE_5_LTVC_LESSONS.find(
      (l) => l.chuDeNguPhap === sample.topic || l.chuDiem === sample.unit
    );
    if (matchedLesson) {
      setSelectedLtvcLessonId(matchedLesson.id);
    }
  };

  // Core Evaluation Action
  const handleStartAnalysis = async () => {
    if (!writingText.trim() && imagesList.length === 0) {
      setAnalysisError('Vui lòng chụp/tải ảnh bài làm của học sinh (hoặc nhập văn bản) trước khi phân tích!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setEvaluationResult(null);

    try {
      const isLtvc = domain === 'ltvc';
      const payload = {
        grade,
        domain,
        unit: isLtvc ? currentLtvcLesson.chuDiem : currentLesson.chuDiem,
        lesson: isLtvc ? currentLtvcLesson.baiHoc : currentLesson.baiHoc,
        writingType: isLtvc ? currentLtvcLesson.chuDeNguPhap : currentLesson.dangBaiViet,
        promptTitle: customPrompt,
        learningRequirements: isLtvc ? currentLtvcLesson.yeuCauCanDat : currentLesson.yeuCauCanDat,
        studentName: studentName.trim() || 'Học sinh',
        writingText: writingText.trim(),
        images: imagesList.map((img) => ({
          data: img.dataUrl,
          mimeType: img.mimeType,
        })),
        imageBase64: imagesList[0]?.dataUrl || null,
        teacherNotes: teacherNotes.trim(),
      };

      const response = await fetch('/api/analyze-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let resData: any;
      try {
        resData = JSON.parse(rawText);
      } catch {
        throw new Error(
          response.ok
            ? 'Dữ liệu phản hồi từ máy chủ không đúng định dạng JSON.'
            : `Máy chủ phản hồi mã lỗi ${response.status} (${response.statusText || 'Lỗi mạng'}). Vui lòng thử lại sau ít giây.`
        );
      }

      if (!resData.success) {
        throw new Error(resData.message || 'Không thể chấm bài. Vui lòng thử lại.');
      }

      const result = resData.data;

      const newEval: EvaluationResult = {
        id: `eval-${Date.now()}`,
        ngay_tao: new Date().toISOString(),
        ten_hoc_sinh: studentName.trim() || 'Học sinh',
        lop: '5/2',
        phan_mon: domain,
        chu_diem: isLtvc ? currentLtvcLesson.chuDiem : currentLesson.chuDiem,
        bai_hoc: isLtvc ? currentLtvcLesson.baiHoc : currentLesson.baiHoc,
        the_loai_bai_van:
          result.the_loai_bai_van || (isLtvc ? currentLtvcLesson.chuDeNguPhap : currentLesson.dangBaiViet),
        de_bai: customPrompt,
        noi_dung_bai_viet: result.noi_dung_bai_viet || writingText,
        anh_bai_viet: imagesList[0]?.dataUrl || undefined,
        danh_sach_anh: imagesList.map((img) => img.dataUrl),
        muc_do_dat_duoc: (result.muc_do_dat_duoc as AchievementLevel) || 'Hoàn thành',
        uu_diem_noi_bat: result.uu_diem_noi_bat || 'Bài làm có cố gắng hoàn thành yêu cầu đề bài.',
        han_che_can_sua: result.han_che_can_sua || 'Cần chú ý lỗi chính tả và ôn tập lại quy tắc.',
        loi_nhan_xet_so_theo_doi: result.loi_nhan_xet_so_theo_doi || 'Em hiểu bài và làm bài tương đối tốt.',
        goi_y_sua_cau: result.goi_y_sua_cau || '',
        ket_qua_tung_cau: result.ket_qua_tung_cau || [],
        kien_thuc_can_on_tap: result.kien_thuc_can_on_tap || [],
        danh_gia_chi_tiet: result.danh_gia_chi_tiet || {
          bo_cuc: { danh_gia: 'Đạt', chi_tiet: 'Bố cục bài làm tương đối rõ ràng' },
          noi_dung_va_y_tuong: { danh_gia: 'Đạt', chi_tiet: 'Nội dung bám sát đề bài' },
          nghe_thuat_va_tu_ngu: { danh_gia: 'Khá', chi_tiet: 'Diễn đạt tự nhiên' },
          chinh_ta_va_dat_cau: {
            danh_gia: 'Khá',
            chi_tiet: 'Cần chú ý các lỗi chính tả',
            danh_sach_loi: [],
          },
        },
        loi_nhan_xet_hoc_sinh:
          result.loi_nhan_xet_hoc_sinh || `Cô khen ${studentName} đã rất nỗ lực hoàn thành bài làm!`,
        loi_nhan_xet_phu_huynh:
          result.loi_nhan_xet_phu_huynh || 'Kính mong phụ huynh nhắc nhở con luyện tập thêm tại nhà.',
        giao_vien_ghi_chu: teacherNotes,
        da_duyet: false,
      };

      setEvaluationResult(newEval);
      // Auto-update writing text if OCR detected full text
      if (!writingText && newEval.noi_dung_bai_viet) {
        setWritingText(newEval.noi_dung_bai_viet);
      }
    } catch (err: any) {
      console.error('Lỗi khi chấm bài:', err);
      let msg = String(err?.message || err || '');
      if (
        msg.includes('did not match the expected pattern') ||
        msg.includes('SYNTAX_ERR') ||
        msg.includes('SyntaxError')
      ) {
        msg =
          'Lỗi xử lý cú pháp phản hồi (do tính nghiêm ngặt của trình duyệt WebKit/Safari khi tải dữ liệu). Hệ thống đã tự động làm mới, Thầy/Cô hãy bấm "Thử lại ngay" bên dưới để hoàn tất chấm bài nhé.';
      }
      setAnalysisError(msg || 'Lỗi kết nối máy chủ hoặc API Gemini. Thầy/Cô vui lòng thử lại sau ít giây.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Teacher Approval & Saving
  const handleApproveAndSave = () => {
    if (!evaluationResult) return;
    const approved: EvaluationResult = {
      ...evaluationResult,
      da_duyet: true,
    };
    StorageService.saveEvaluation(approved);
    setEvaluationResult(approved);
    onEvaluationSaved(approved);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  // Copy helper
  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Update evaluationResult local fields
  const updateResultField = (field: keyof EvaluationResult, value: any) => {
    if (!evaluationResult) return;
    setEvaluationResult({
      ...evaluationResult,
      [field]: value,
    });
  };

  // Update question check result for LTVC
  const updateQuestionCheck = (index: number, updated: Partial<LtvcQuestionCheck>) => {
    if (!evaluationResult || !evaluationResult.ket_qua_tung_cau) return;
    const newList = [...evaluationResult.ket_qua_tung_cau];
    newList[index] = { ...newList[index], ...updated };
    setEvaluationResult({
      ...evaluationResult,
      ket_qua_tung_cau: newList,
    });
  };

  // Open Add Error modal
  const handleOpenAddError = () => {
    setErrorForm({
      loai_loi: 'Chính tả',
      tu_hoac_cau_sai: '',
      sua_lai: '',
      vi_tri_ngu_canh: '',
      cau_goc: '',
      cau_sua_hoan_chinh: '',
      giai_thich_ngan: '',
    });
    setEditingErrorIndex(null);
    setShowAddErrorModal(true);
  };

  // Open Edit Error modal
  const handleOpenEditError = (index: number, err: SpellingOrGrammarError) => {
    setErrorForm({ ...err });
    setEditingErrorIndex(index);
    setShowAddErrorModal(true);
  };

  // Save Error from modal (add or edit)
  const handleSaveErrorModal = () => {
    if (!evaluationResult || !errorForm.tu_hoac_cau_sai.trim()) return;
    const currentList = [...(evaluationResult.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi || [])];

    if (editingErrorIndex !== null) {
      currentList[editingErrorIndex] = { ...errorForm };
    } else {
      currentList.push({
        ...errorForm,
        vi_tri_ngu_canh: errorForm.vi_tri_ngu_canh || 'Giáo viên bổ sung',
      });
    }

    setEvaluationResult({
      ...evaluationResult,
      danh_gia_chi_tiet: {
        ...evaluationResult.danh_gia_chi_tiet,
        chinh_ta_va_dat_cau: {
          ...evaluationResult.danh_gia_chi_tiet.chinh_ta_va_dat_cau,
          danh_sach_loi: currentList,
        },
      },
    });

    setShowAddErrorModal(false);
    setEditingErrorIndex(null);
  };

  // Delete Error
  const handleDeleteError = (index: number) => {
    if (!evaluationResult) return;
    const currentList = evaluationResult.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi || [];
    const updated = currentList.filter((_, i) => i !== index);

    setEvaluationResult({
      ...evaluationResult,
      danh_gia_chi_tiet: {
        ...evaluationResult.danh_gia_chi_tiet,
        chinh_ta_va_dat_cau: {
          ...evaluationResult.danh_gia_chi_tiet.chinh_ta_va_dat_cau,
          danh_sach_loi: updated,
        },
      },
    });
  };

  // Copy corrected sentence
  const handleCopyCorrectedSentence = (sentence: string, idx: number) => {
    navigator.clipboard.writeText(sentence);
    setCopiedSentenceIdx(idx);
    setTimeout(() => setCopiedSentenceIdx(null), 2000);
  };

  // Safe word replacement for fill-in-the-blank practice
  const safeReplaceBlank = (sentence: string | undefined, word: string) => {
    if (!sentence || !word) return sentence || '.......';
    try {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return sentence.replace(new RegExp(escaped, 'gi'), '.......');
    } catch {
      return sentence.split(word).join('.......');
    }
  };

  // Generate tailored practice exercises text for teacher to copy
  const getRemedialExercisesText = () => {
    if (!evaluationResult) return '';
    const errors = evaluationResult.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi || [];
    if (errors.length === 0) return '';

    let text = `BÀI TẬP RÈN LUYỆN KHẮC PHỤC LỖI CHO HỌC SINH: ${evaluationResult.ten_hoc_sinh} (Lớp 5/2)\n`;
    text += `(Căn cứ các lỗi cần sửa trong bài viết: ${evaluationResult.de_bai})\n\n`;

    const spellingErrors = errors.filter((e) => e.loai_loi === 'Chính tả');
    if (spellingErrors.length > 0) {
      text += `1. BÀI TẬP CHÍNH TẢ (Lựa chọn từ đúng điền vào chỗ trống):\n`;
      spellingErrors.forEach((e, idx) => {
        text += `   ${idx + 1}. Em hãy chọn giữa [${e.sua_lai} / ${e.tu_hoac_cau_sai}] để điền vào câu:\n`;
        text += `      "${safeReplaceBlank(e.cau_sua_hoan_chinh, e.sua_lai)}"\n`;
      });
      text += `\n`;
    }

    const wordErrors = errors.filter((e) => e.loai_loi === 'Dùng từ');
    if (wordErrors.length > 0) {
      text += `2. BÀI TẬP DÙNG TỪ (Thay thế từ ngữ chưa phù hợp):\n`;
      wordErrors.forEach((e, idx) => {
        text += `   ${idx + 1}. Trong câu: "${e.cau_goc || e.tu_hoac_cau_sai}", từ "${e.tu_hoac_cau_sai}" chưa phù hợp. Em hãy thay bằng từ "${e.sua_lai}".\n`;
      });
      text += `\n`;
    }

    const sentenceErrors = errors.filter((e) => e.loai_loi === 'Đặt câu' || e.loai_loi === 'Dấu câu');
    if (sentenceErrors.length > 0) {
      text += `3. BÀI TẬP ĐẶT CÂU & DẤU CÂU (Sửa câu chưa hoàn chỉnh):\n`;
      sentenceErrors.forEach((e, idx) => {
        text += `   ${idx + 1}. Viết lại câu sau cho đủ thành phần Chủ ngữ - Vị ngữ và dấu câu:\n`;
        text += `      Câu của em: "${e.cau_goc || e.tu_hoac_cau_sai}"\n`;
        text += `      Gợi ý viết đúng: "${e.cau_sua_hoan_chinh || e.sua_lai}"\n`;
      });
      text += `\n`;
    }

    return text;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner: Pedagogical Foundation */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Phương pháp Đánh giá Tiểu học mới • Lớp 5/2
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            {domain === 'ltvc'
              ? 'Chấm & Nhận xét Luyện từ và câu Tiếng Việt Lớp 5'
              : 'Chấm bài & Nhận xét Tập làm văn Tiếng Việt Lớp 5'}
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
            Hỗ trợ cả <strong>Tập làm văn (Viết)</strong> và <strong>Luyện từ và câu (LTVC)</strong>. Đọc bài từ <strong>nhiều trang ảnh chụp</strong> hoặc chữ gõ. Đối chiếu chuẩn SGK/SGV & Thông tư 27: <strong>chấm chi tiết từng câu</strong>, <strong>sửa lỗi chính tả, từ và câu</strong>, <span className="underline decoration-amber-400 font-semibold text-amber-200">không chấm điểm số</span>.
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Setup (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Thiết lập bài học & Đề bài */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/90 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                1. Thiết lập Phân môn & Đề bài
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                Lớp 5/2 (42 HS)
              </span>
            </div>

            {/* DOMAIN SWITCHER: VIẾT vs LUYỆN TỪ VÀ CÂU */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Chọn Phân môn Tiếng Việt cần chấm:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDomainChange('viet')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                    domain === 'viet'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <PenLine className="w-4 h-4" />
                  <span>1. Tập làm văn (Viết)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDomainChange('ltvc')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                    domain === 'ltvc'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>2. Luyện từ và câu (LTVC)</span>
                </button>
              </div>
            </div>

            {/* Row 1: Khối lớp & Học sinh */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Khối Lớp
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                >
                  <option value={5}>Lớp 5/2 (42 học sinh)</option>
                  <option value={4}>Lớp 4 (Mở rộng)</option>
                  <option value={3}>Lớp 3 (Mở rộng)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Học sinh Lớp 5/2</span>
                  <span className="text-[11px] text-emerald-600 normal-case font-semibold">42 em</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={studentsList.some((s) => s.ten === studentName) ? studentName : ''}
                    onChange={(e) => {
                      if (e.target.value) setStudentName(e.target.value);
                    }}
                    className="w-1/2 bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="">-- Chọn HS --</option>
                    {studentsList.map((s) => (
                      <option key={s.id} value={s.ten}>
                        {s.so_thu_tu ? `${String(s.so_thu_tu).padStart(2, '0')}. ` : ''}{s.ten} ({s.gioi_tinh})
                      </option>
                    ))}
                  </select>
                  <div className="relative w-1/2">
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Hoặc gõ tên..."
                      className="w-full pl-8 pr-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Chọn Bài học & Dạng bài (Tập làm văn hoặc LTVC) */}
            {domain === 'ltvc' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Chủ điểm & Bài học Luyện từ và câu (SGK Lớp 5)</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      LTVC Kết nối tri thức
                    </span>
                  </label>
                  <select
                    value={selectedLtvcLessonId}
                    onChange={(e) => handleLtvcLessonChange(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                  >
                    {GRADE_5_LTVC_LESSONS.map((l) => (
                      <option key={l.id} value={l.id}>
                        [{l.tuan}] {l.chuDiem} - {l.baiHoc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-stone-500">Chủ đề ngữ pháp:</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg font-bold">
                    {currentLtvcLesson.chuDeNguPhap}
                  </span>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-900 rounded-lg font-medium">
                    {currentLtvcLesson.dangBaiTap}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-lg font-medium">
                    {currentLtvcLesson.tuan}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Chủ điểm & Bài học Tập làm văn (SGK Tiếng Việt 5)
                  </label>
                  <select
                    value={selectedLessonId}
                    onChange={(e) => handleLessonChange(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                  >
                    {GRADE_5_LESSONS.map((l) => (
                      <option key={l.id} value={l.id}>
                        [{l.tuan}] {l.chuDiem} - {l.dangBaiViet}: {l.baiHoc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-stone-500">Dạng bài:</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                    {currentLesson.dangBaiViet}
                  </span>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-medium">
                    {currentLesson.tuan}
                  </span>
                </div>
              </div>
            )}

            {/* Row 3: Đề bài chi tiết */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {domain === 'ltvc'
                    ? 'Đề bài / Câu hỏi bài tập Luyện từ và câu'
                    : 'Đề bài bài viết'}
                </label>
                {(domain === 'ltvc' ? currentLtvcLesson.deBaiGoiY : currentLesson.deBaiGoiY).length > 0 && (
                  <span className="text-[11px] text-stone-500">Gợi ý từ SGK:</span>
                )}
              </div>

              {(domain === 'ltvc' ? currentLtvcLesson.deBaiGoiY : currentLesson.deBaiGoiY).length > 1 && (
                <div className="flex flex-col gap-1.5 mb-2">
                  {(domain === 'ltvc' ? currentLtvcLesson.deBaiGoiY : currentLesson.deBaiGoiY).map(
                    (promptOpt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomPrompt(promptOpt)}
                        className={`text-left text-xs p-2 rounded-lg border transition ${
                          customPrompt === promptOpt
                            ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-medium'
                            : 'border-stone-200 bg-stone-50/60 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <span className="font-bold mr-1">Mẫu {idx + 1}:</span> {promptOpt.split('\n')[0]}
                      </button>
                    )
                  )}
                </div>
              )}

              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={domain === 'ltvc' ? 4 : 2}
                placeholder={
                  domain === 'ltvc'
                    ? 'Nhập các bài tập (Bài 1, Bài 2, Bài 3...) cần chấm...'
                    : 'Nhập đề bài giáo viên giao...'
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
              />
            </div>

            {/* Accordion: Yêu cầu cần đạt chuẩn SGK & Trọng tâm Tiếng Việt */}
            <div className="bg-emerald-50/40 rounded-xl p-3.5 border border-emerald-100 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {domain === 'ltvc'
                    ? 'Chuẩn kiến thức kỹ năng Luyện từ và câu (SGK/SGV 5):'
                    : 'Căn cứ Yêu cầu cần đạt (Chương trình GDPT & SGV 5):'}
                </span>
              </div>
              <p className="text-stone-700 leading-relaxed pl-5">
                {domain === 'ltvc' ? currentLtvcLesson.yeuCauCanDat : currentLesson.yeuCauCanDat}
              </p>
              <div className="pl-5 pt-1 text-emerald-800 font-medium">
                🎯 <strong>Kiến thức trọng tâm:</strong>{' '}
                {domain === 'ltvc'
                  ? currentLtvcLesson.kienThucTrongTam
                  : currentLesson.trongTamTiengViet}
              </div>
            </div>

            {/* Lưu ý sư phạm của giáo viên */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Lưu ý riêng của giáo viên về học sinh (không bắt buộc):
              </label>
              <input
                type="text"
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                placeholder="VD: Em hay nhầm từ đồng âm với từ nhiều nghĩa; Khích lệ em cẩn thận hơn..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Card: Nhập bài làm của học sinh (Hỗ trợ Nhiều ảnh & Chụp trực tiếp) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/90 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                2. Bài làm của học sinh
              </h3>
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setInputTab('image')}
                  className={`px-3 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                    inputTab === 'image' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Ảnh bài viết ({imagesList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setInputTab('text')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    inputTab === 'text' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Gõ / Dán chữ
                </button>
                <button
                  type="button"
                  onClick={() => setInputTab('sample')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    inputTab === 'sample' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Bài mẫu test
                </button>
              </div>
            </div>

            {/* TAB: MULTI-IMAGE UPLOAD & CAMERA */}
            {inputTab === 'image' && (
              <div className="space-y-4">
                {/* Upload & Camera Action Box */}
                <div className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-5 text-center transition bg-stone-50/50">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Tải ảnh lên (Chọn nhiều ảnh cùng lúc)
                    </button>
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="w-full sm:w-auto px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      Chụp ảnh trực tiếp từ Camera
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-2">
                    💡 Học sinh viết bài 2-3 trang vở? Bạn có thể <strong>chọn nhiều ảnh cùng lúc</strong> hoặc <strong>chụp liên tục từng trang</strong>.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFilesChange}
                    className="hidden"
                  />
                  <input
                    ref={cameraFileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageFilesChange}
                    className="hidden"
                  />
                </div>

                {/* Image Pages Strip / Grid */}
                {imagesList.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-800 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        Danh sách các trang bài viết ({imagesList.length} trang theo thứ tự):
                      </span>
                      <button
                        type="button"
                        onClick={() => setImagesList([])}
                        className="text-stone-400 hover:text-red-600 text-[11px] font-medium"
                      >
                        Xoá tất cả ảnh
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imagesList.map((img, idx) => (
                        <div
                          key={img.id}
                          className="group relative bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition"
                        >
                          {/* Page Label Badge */}
                          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-extrabold tracking-wide">
                            Trang {idx + 1}
                          </div>

                          {/* Quick Actions (Delete & Zoom) */}
                          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setLightboxImage({ url: img.dataUrl, title: `Trang ${idx + 1} - ${studentName}` })}
                              title="Xem ảnh phóng to"
                              className="p-1 rounded-md bg-black/60 hover:bg-black text-white text-xs transition"
                            >
                              <Maximize2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              title="Xoá trang này"
                              className="p-1 rounded-md bg-red-600/80 hover:bg-red-700 text-white text-xs transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Image preview */}
                          <div
                            onClick={() => setLightboxImage({ url: img.dataUrl, title: `Trang ${idx + 1} - ${studentName}` })}
                            className="aspect-3/4 bg-stone-100 flex items-center justify-center overflow-hidden cursor-pointer"
                          >
                            <img src={img.dataUrl} alt={`Trang ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
                          </div>

                          {/* Re-order footer controls */}
                          <div className="p-1.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveImage(idx, 'left')}
                              className="p-1 rounded text-stone-500 hover:text-stone-900 disabled:opacity-20 hover:bg-stone-200"
                              title="Di chuyển sang trước"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-semibold text-stone-700 text-[10px]">
                              {idx + 1} / {imagesList.length}
                            </span>
                            <button
                              type="button"
                              disabled={idx === imagesList.length - 1}
                              onClick={() => moveImage(idx, 'right')}
                              className="p-1 rounded text-stone-500 hover:text-stone-900 disabled:opacity-20 hover:bg-stone-200"
                              title="Di chuyển sang sau"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add more via Camera button */}
                      <button
                        type="button"
                        onClick={() => startCamera()}
                        className="aspect-3/4 rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/80 flex flex-col items-center justify-center gap-1 text-emerald-700 transition cursor-pointer"
                        title="Mở camera chụp tiếp trang vở tiếp theo"
                      >
                        <Camera className="w-6 h-6" />
                        <span className="text-[11px] font-bold text-center">Chụp tiếp</span>
                      </button>

                      {/* Add more via Upload button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-3/4 rounded-xl border-2 border-dashed border-stone-200 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-emerald-700 transition cursor-pointer"
                        title="Tải thêm ảnh từ máy"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-[11px] font-bold text-center">Tải ảnh</span>
                      </button>
                    </div>

                    {/* Pre-OCR extraction button */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleRunOcr}
                        disabled={isOcrLoading}
                        className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {isOcrLoading ? 'Đang trích xuất chữ...' : `Đọc chữ từ ${imagesList.length} ảnh vào ô văn bản`}
                      </button>
                      <span className="text-[11px] text-stone-400 italic">
                        Hoặc bấm "Phân tích & Tạo lời nhận xét" bên dưới để AI tự đọc tất cả ảnh
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: TEXT INPUT */}
            {inputTab === 'text' && (
              <div className="space-y-3">
                <textarea
                  value={writingText}
                  onChange={(e) => setWritingText(e.target.value)}
                  rows={9}
                  placeholder="Gõ hoặc dán nội dung bài viết của học sinh vào đây (giữ nguyên lỗi chính tả nếu có để AI phân tích và chỉ ra cụ thể)..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3.5 text-sm text-stone-900 font-['Be_Vietnam_Pro'] leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                />
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Số từ: {writingText.trim() ? writingText.trim().split(/\s+/).length : 0} từ</span>
                  {imagesList.length > 0 && (
                    <span className="text-emerald-700 font-medium">
                      ✓ Đang đính kèm {imagesList.length} ảnh trang bài viết
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* TAB: SAMPLE ESSAYS & LTVC EXERCISES */}
            {inputTab === 'sample' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-600 font-medium">
                    Chọn bài làm mẫu học sinh Lớp 5/2 để kiểm thử nhanh:
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setDomain('viet')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                        domain === 'viet'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Tập làm văn ({SAMPLE_STUDENT_ESSAYS.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDomain('ltvc')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                        domain === 'ltvc'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Luyện từ & câu ({SAMPLE_LTVC_EXERCISES.length})
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {domain === 'ltvc' ? (
                    SAMPLE_LTVC_EXERCISES.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleLoadLtvcSample(s)}
                        className="p-3.5 rounded-xl border border-blue-200 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-600 text-white">
                              LTVC 5
                            </span>
                            <span className="text-xs font-bold text-stone-900">{s.studentName}</span>
                            <span className="text-[11px] text-stone-500">• {s.topic}</span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900">{s.title}</h4>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-1 italic">
                            Bài làm: "{s.studentSubmission.split('\n')[0]}..."
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                      </div>
                    ))
                  ) : (
                    SAMPLE_STUDENT_ESSAYS.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleLoadSample(s)}
                        className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/30 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-600 text-white">
                              Tập làm văn 5
                            </span>
                            <span className="text-xs font-bold text-stone-900">{s.studentName}</span>
                            <span className="text-[11px] text-stone-500">• {s.writingType}</span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900">{s.title}</h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Chủ điểm: {s.unit} • Lớp {s.grade}/2
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-700/20 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>
                      {imagesList.length > 1
                        ? `Đang đọc ${imagesList.length} trang ảnh & đối chiếu tiêu chí...`
                        : 'Đang đọc bài & đối chiếu tiêu chí Thông tư 27...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>
                      {imagesList.length > 1
                        ? `Phân tích & Nhận xét (${imagesList.length} trang ảnh)`
                        : 'Phân tích & Tạo lời nhận xét sư phạm'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {analysisError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-relaxed">{analysisError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shrink-0 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Thử lại ngay</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pedagogical Evaluation & Review (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          {evaluationResult ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/90 space-y-6 animate-fadeIn">
              {/* Review Header & Status Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    Kết quả nhận xét định tính (TT 27/2020)
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                    Học sinh: <span className="text-emerald-800">{evaluationResult.ten_hoc_sinh}</span>
                    <span className="text-xs text-stone-400 font-normal ml-2">• Lớp 5/2</span>
                  </h3>
                </div>

                {/* Level selector (Hoàn thành tốt / Hoàn thành / Chưa hoàn thành) */}
                <div className="flex items-center gap-1.5">
                  {(['Hoàn thành tốt', 'Hoàn thành', 'Chưa hoàn thành'] as AchievementLevel[]).map(
                    (lvl) => {
                      const isSelected = evaluationResult.muc_do_dat_duoc === lvl;
                      const colorClass =
                        lvl === 'Hoàn thành tốt'
                          ? isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : lvl === 'Hoàn thành'
                          ? isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                          : isSelected
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100';

                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => updateResultField('muc_do_dat_duoc', lvl)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${colorClass}`}
                        >
                          {lvl === 'Hoàn thành tốt' && '★ '}
                          {lvl === 'Hoàn thành' && '✓ '}
                          {lvl === 'Chưa hoàn thành' && '▲ '}
                          {lvl}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Alert: Strictly No Numerical Scores Reminder */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <strong>Quy định:</strong> Không chấm điểm, không xếp loại số. Đánh giá sự tiến bộ của học sinh.
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {evaluationResult.da_duyet ? 'Đã duyệt' : 'Chờ duyệt'}
                </span>
              </div>

              {/* Multi-page Image Thumbnails in Evaluation Result if available */}
              {evaluationResult.danh_sach_anh && evaluationResult.danh_sach_anh.length > 0 && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    Ảnh trang bài làm của học sinh ({evaluationResult.danh_sach_anh.length} trang - bấm để phóng to):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {evaluationResult.danh_sach_anh.map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => setLightboxImage({ url: imgUrl, title: `Trang ${i + 1} - ${evaluationResult.ten_hoc_sinh}` })}
                        className="relative w-20 h-28 rounded-lg overflow-hidden border border-stone-300 shrink-0 cursor-pointer hover:border-emerald-600 hover:shadow-md transition"
                      >
                        <img src={imgUrl} alt={`Trang ${i + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] text-center font-bold py-0.5">
                          Trang {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION ĐẶC THÙ CHO PHÂN MÔN: KẾT QUẢ CHẤM TỪNG CÂU BÀI TẬP LUYỆN TỪ VÀ CÂU */}
              {evaluationResult.ket_qua_tung_cau && evaluationResult.ket_qua_tung_cau.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white rounded-2xl p-5 border border-blue-200 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-200/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-700" />
                        <h4 className="font-extrabold text-stone-900 text-base">
                          Bảng chấm chi tiết từng câu Luyện từ và câu
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {evaluationResult.ket_qua_tung_cau.length} câu bài tập
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        Đối chiếu bài làm của học sinh với đáp án chuẩn SGK/SGV Kết nối tri thức. Thầy/Cô có thể điều chỉnh đánh giá trực tiếp.
                      </p>
                    </div>

                    {/* Stats pills */}
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        ✓ {evaluationResult.ket_qua_tung_cau.filter((q) => q.ket_qua === 'Đúng').length} Đúng
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        • {evaluationResult.ket_qua_tung_cau.filter((q) => q.ket_qua === 'Đúng một phần').length} Đúng một phần
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                        ✕ {evaluationResult.ket_qua_tung_cau.filter((q) => q.ket_qua === 'Chưa đúng').length} Chưa đúng
                      </span>
                    </div>
                  </div>

                  {/* List of Questions */}
                  <div className="space-y-3.5">
                    {evaluationResult.ket_qua_tung_cau.map((q, qIdx) => {
                      const studentAns = q.bai_lam_hoc_sinh || (q as any).tra_loi_hoc_sinh || '';
                      return (
                        <div
                          key={qIdx}
                          className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-2xs hover:border-blue-300 transition"
                        >
                          {/* Question Header & Status Toggle */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-white font-extrabold text-xs">
                                {q.cau_so}
                              </span>
                              <span className="text-xs font-semibold text-stone-700">
                                {q.yeu_cau}
                              </span>
                            </div>

                            {/* Status switch buttons */}
                            <div className="flex items-center gap-1">
                              {(['Đúng', 'Đúng một phần', 'Chưa đúng'] as const).map((status) => {
                                const isCurrent = q.ket_qua === status;
                                const btnColor =
                                  status === 'Đúng'
                                    ? isCurrent
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                    : status === 'Đúng một phần'
                                    ? isCurrent
                                      ? 'bg-amber-600 text-white border-amber-600'
                                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                    : isCurrent
                                    ? 'bg-red-600 text-white border-red-600'
                                    : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100';

                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => updateQuestionCheck(qIdx, { ket_qua: status })}
                                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition ${btnColor}`}
                                  >
                                    {status}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Student Answer Box */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                              📝 Bài làm của học sinh:
                            </span>
                            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs sm:text-sm text-stone-800 font-mono italic whitespace-pre-wrap leading-relaxed">
                              {studentAns || '(Học sinh chưa hoàn thành câu này)'}
                            </div>
                          </div>

                          {/* Standard Answer */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                🎯 Đáp án chuẩn mực SGK/SGV:
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(q.dap_an_chuan, `dapan-${qIdx}`)}
                                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                              >
                                {copiedField === `dapan-${qIdx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copiedField === `dapan-${qIdx}` ? 'Đã chép' : 'Sao chép đáp án'}
                              </button>
                            </div>
                            <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-medium whitespace-pre-wrap leading-relaxed">
                              {q.dap_an_chuan}
                            </div>
                          </div>

                          {/* Pedagogical comment & rule */}
                          {q.nhan_xet_chi_tiet && (
                            <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-200 text-xs text-stone-700 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                              <div className="leading-relaxed">
                                <strong className="text-blue-900">Nhận xét sư phạm & Lời dặn:</strong>{' '}
                                <span className="italic">{q.nhan_xet_chi_tiet}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Grammar Topics to Review */}
                  {evaluationResult.kien_thuc_can_on_tap && evaluationResult.kien_thuc_can_on_tap.length > 0 && (
                    <div className="mt-3 p-3.5 bg-white rounded-xl border border-blue-200 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        Kiến thức trọng tâm em cần ôn tập thêm:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {evaluationResult.kien_thuc_can_on_tap.map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200"
                          >
                            📖 {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 1: ƯU ĐIỂM NỔI BẬT (KHEN NGỢI TRƯỚC) */}
              <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Ưu điểm nổi bật (Khen ngợi, khích lệ)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyText(evaluationResult.uu_diem_noi_bat, 'uudiem')}
                    className="text-emerald-700 hover:text-emerald-800 text-xs font-medium flex items-center gap-1"
                  >
                    {copiedField === 'uudiem' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'uudiem' ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>
                <textarea
                  value={evaluationResult.uu_diem_noi_bat}
                  onChange={(e) => updateResultField('uu_diem_noi_bat', e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-sm text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* SECTION 2: HẠN CHẾ & HƯỚNG DẪN KHẮC PHỤC */}
              <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Hạn chế & Hướng sửa cụ thể
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyText(evaluationResult.han_che_can_sua, 'hanche')}
                    className="text-amber-800 hover:text-amber-900 text-xs font-medium flex items-center gap-1"
                  >
                    {copiedField === 'hanche' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'hanche' ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>
                <textarea
                  value={evaluationResult.han_che_can_sua}
                  onChange={(e) => updateResultField('han_che_can_sua', e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-amber-200 rounded-xl p-3 text-sm text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* SECTION 3A: LỜI NHẬN XÉT GHI VÀO VỞ HỌC SINH (PHÊ TRỰC TIẾP VÀO BÀI LÀM) */}
              <div className="bg-gradient-to-r from-amber-50/80 via-yellow-50/50 to-orange-50/40 border-2 border-amber-300 rounded-2xl p-5 space-y-2.5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-700" />
                    <label className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                      Lời nhận xét vào vở học sinh (Giúp em nhận ra hạn chế & cách sửa)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCommentBankItems(StorageService.getCommentBank());
                        setShowCommentBankModal(true);
                      }}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                      title="Chọn mẫu nhận xét phù hợp với tình huống của học sinh"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>Chọn từ Ngân hàng lời nhận xét</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyText(evaluationResult.loi_nhan_xet_hoc_sinh, 'loiphe_vo')}
                      className="text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                    >
                      {copiedField === 'loiphe_vo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedField === 'loiphe_vo' ? 'Đã chép' : 'Chép lời phê'}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-amber-900/80 italic">
                  💡 Thầy/Cô ghi trực tiếp lời này vào trang vở học sinh: Khen ngợi nỗ lực trước, <strong>chỉ rõ hạn chế cụ thể</strong> (nếu có lỗi chính tả, câu què, bài sơ sài...) và <strong>hướng dẫn em cách sửa</strong>.
                </p>

                <textarea
                  value={evaluationResult.loi_nhan_xet_hoc_sinh}
                  onChange={(e) => updateResultField('loi_nhan_xet_hoc_sinh', e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-amber-300 rounded-xl p-3 text-sm text-stone-900 leading-relaxed font-normal focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  placeholder="Nhập lời phê vào vở cho học sinh..."
                />
              </div>

              {/* SECTION 3B: LỜI NHẬN XÉT SỔ THEO DÕI ĐÁNH GIÁ (CHUẨN TT 27) */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-stone-600" />
                    Lời nhận xét vào Sổ theo dõi đánh giá (Khoảng 2 câu theo TT 27)
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCommentBankItems(StorageService.getCommentBank());
                        setShowCommentBankModal(true);
                      }}
                      className="text-stone-600 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chọn từ Ngân hàng</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyText(evaluationResult.loi_nhan_xet_so_theo_doi, 'loiphe')}
                      className="text-stone-700 hover:text-stone-900 text-xs font-medium flex items-center gap-1"
                    >
                      {copiedField === 'loiphe' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedField === 'loiphe' ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>
                <textarea
                  value={evaluationResult.loi_nhan_xet_so_theo_doi}
                  onChange={(e) => updateResultField('loi_nhan_xet_so_theo_doi', e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-sm text-stone-800 italic leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* SECTION 4: GỢI Ý SỬA CÂU / CÂU VĂN THAM KHẢO */}
              {evaluationResult.goi_y_sua_cau && (
                <div className="bg-blue-50/40 border border-blue-200 rounded-2xl p-4.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      Gợi ý cách sửa câu / Viết lại hay hơn
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopyText(evaluationResult.goi_y_sua_cau, 'suacau')}
                      className="text-blue-700 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                    >
                      {copiedField === 'suacau' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedField === 'suacau' ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                  <textarea
                    value={evaluationResult.goi_y_sua_cau}
                    onChange={(e) => updateResultField('goi_y_sua_cau', e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-blue-200 rounded-xl p-3 text-sm text-stone-800 italic leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}

              {/* SECTION 5: CHI TIẾT LỖI CHÍNH TẢ, ĐẶT CÂU, DÙNG TỪ & HƯỚNG DẪN SỬA CHO HỌC SINH */}
              {(() => {
                const allErrors = evaluationResult.danh_gia_chi_tiet?.chinh_ta_va_dat_cau?.danh_sach_loi || [];
                const filteredErrors =
                  errorFilter === 'all'
                    ? allErrors
                    : allErrors.filter((e) => {
                        if (errorFilter === 'Dấu câu') return e.loai_loi === 'Dấu câu' || e.loai_loi === 'Bố cục';
                        return e.loai_loi === errorFilter;
                      });

                const countSpelling = allErrors.filter((e) => e.loai_loi === 'Chính tả').length;
                const countWord = allErrors.filter((e) => e.loai_loi === 'Dùng từ').length;
                const countSentence = allErrors.filter((e) => e.loai_loi === 'Đặt câu').length;
                const countPunctuation = allErrors.filter(
                  (e) => e.loai_loi === 'Dấu câu' || e.loai_loi === 'Bố cục'
                ).length;

                return (
                  <div className="space-y-4 pt-2">
                    {/* Header bar of Section 5 */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <h4 className="font-extrabold text-stone-900 text-base">
                            Bảng phát hiện & Hướng dẫn sửa lỗi cho học sinh
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                            {allErrors.length} lỗi
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Chỉ ra chính xác lỗi chính tả, dùng từ, đặt câu, câu què, dấu câu kèm câu mẫu đã sửa chuẩn mực.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowTextHighlight(!showTextHighlight)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                            showTextHighlight
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {showTextHighlight ? 'Ẩn văn bản đánh dấu' : 'Xem bài có đánh dấu lỗi'}
                        </button>

                        <button
                          type="button"
                          onClick={handleOpenAddError}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          + Thêm lỗi thủ công
                        </button>
                      </div>
                    </div>

                    {/* INTERACTIVE HIGHLIGHTED TEXT VIEWER (VĂN BẢN ĐÁNH DẤU LỖI TRỰC QUAN) */}
                    {showTextHighlight && evaluationResult.noi_dung_bai_viet && (
                      <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between text-xs text-stone-600">
                          <span className="font-bold flex items-center gap-1.5 text-stone-800">
                            <PenLine className="w-4 h-4 text-emerald-600" />
                            Toàn văn bài làm của học sinh (đã gắn vị trí lỗi):
                          </span>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Chính tả
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Dùng từ
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Đặt câu
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Dấu câu
                            </span>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed font-['Be_Vietnam_Pro',sans-serif] max-h-56 overflow-y-auto space-y-2">
                          {evaluationResult.noi_dung_bai_viet.split('\n').map((para, pIdx) => {
                            if (!para.trim()) return <div key={pIdx} className="h-2"></div>;

                            // Highlight error segments within the paragraph
                            let renderedElements: React.ReactNode[] = [para];

                            allErrors.forEach((err, errIdx) => {
                              const targetWord = err.tu_hoac_cau_sai?.trim();
                              if (!targetWord || targetWord.length < 2) return;

                              const nextElements: React.ReactNode[] = [];
                              renderedElements.forEach((elem, elemIdx) => {
                                if (typeof elem !== 'string') {
                                  nextElements.push(elem);
                                  return;
                                }

                                const lowerText = elem.toLowerCase();
                                const lowerWord = targetWord.toLowerCase();
                                const foundIdx = lowerText.indexOf(lowerWord);

                                if (foundIdx === -1) {
                                  nextElements.push(elem);
                                } else {
                                  const before = elem.substring(0, foundIdx);
                                  const match = elem.substring(foundIdx, foundIdx + targetWord.length);
                                  const after = elem.substring(foundIdx + targetWord.length);

                                  if (before) nextElements.push(before);

                                  const colorClass =
                                    err.loai_loi === 'Chính tả'
                                      ? 'bg-red-100 text-red-950 border-b-2 border-red-500 hover:bg-red-200'
                                      : err.loai_loi === 'Dùng từ'
                                      ? 'bg-amber-100 text-amber-950 border-b-2 border-amber-500 hover:bg-amber-200'
                                      : err.loai_loi === 'Đặt câu'
                                      ? 'bg-blue-100 text-blue-950 border-b-2 border-blue-500 hover:bg-blue-200'
                                      : 'bg-purple-100 text-purple-950 border-b-2 border-purple-500 hover:bg-purple-200';

                                  nextElements.push(
                                    <span
                                      key={`${pIdx}-${errIdx}-${elemIdx}`}
                                      onClick={() => {
                                        setActiveHighlightIndex(errIdx);
                                        const el = document.getElementById(`error-card-${errIdx}`);
                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                      }}
                                      title={`[${err.loai_loi}] ${err.tu_hoac_cau_sai} ➔ ${err.sua_lai}`}
                                      className={`px-1 py-0.5 rounded cursor-pointer font-bold mx-0.5 transition inline-flex items-center gap-1 ${colorClass}`}
                                    >
                                      <span>{match}</span>
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-white/80 font-semibold shadow-2xs">
                                        ➔ {err.sua_lai}
                                      </span>
                                    </span>
                                  );

                                  if (after) nextElements.push(after);
                                }
                              });
                              renderedElements = nextElements;
                            });

                            return (
                              <p key={pIdx} className="text-justify indent-4 leading-relaxed">
                                {renderedElements}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Filter Tabs and View Switcher */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {/* Category Filter Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setErrorFilter('all')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                            errorFilter === 'all'
                              ? 'bg-stone-900 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          Tất cả ({allErrors.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setErrorFilter('Chính tả')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                            errorFilter === 'Chính tả'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          Chính tả ({countSpelling})
                        </button>
                        <button
                          type="button"
                          onClick={() => setErrorFilter('Dùng từ')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                            errorFilter === 'Dùng từ'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          }`}
                        >
                          Dùng từ ({countWord})
                        </button>
                        <button
                          type="button"
                          onClick={() => setErrorFilter('Đặt câu')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                            errorFilter === 'Đặt câu'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                          }`}
                        >
                          Đặt câu ({countSentence})
                        </button>
                        <button
                          type="button"
                          onClick={() => setErrorFilter('Dấu câu')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                            errorFilter === 'Dấu câu'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                          }`}
                        >
                          Dấu câu & Bố cục ({countPunctuation})
                        </button>
                      </div>

                      {/* View Mode Toggle: Cards vs Table */}
                      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setErrorViewMode('cards')}
                          className={`px-2.5 py-1 rounded-lg transition ${
                            errorViewMode === 'cards' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                          }`}
                        >
                          Thẻ so sánh (Trước ➔ Sau)
                        </button>
                        <button
                          type="button"
                          onClick={() => setErrorViewMode('table')}
                          className={`px-2.5 py-1 rounded-lg transition ${
                            errorViewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                          }`}
                        >
                          Bảng tổng hợp
                        </button>
                      </div>
                    </div>

                    {/* ERROR LIST DISPLAY */}
                    {filteredErrors.length === 0 ? (
                      <div className="p-6 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                        Không có lỗi nào thuộc danh mục này. Em học sinh làm phần này rất tốt!
                      </div>
                    ) : errorViewMode === 'cards' ? (
                      /* MODE 1: COMPARISON CARDS (TRƯỚC ➔ SAU) */
                      <div className="space-y-3.5">
                        {filteredErrors.map((err, i) => {
                          const originalIdx = allErrors.findIndex((orig) => orig === err);
                          const isHighlighted = activeHighlightIndex === originalIdx;

                          const badgeStyle =
                            err.loai_loi === 'Chính tả'
                              ? 'bg-red-100 text-red-900 border-red-200'
                              : err.loai_loi === 'Dùng từ'
                              ? 'bg-amber-100 text-amber-900 border-amber-200'
                              : err.loai_loi === 'Đặt câu'
                              ? 'bg-blue-100 text-blue-900 border-blue-200'
                              : 'bg-purple-100 text-purple-900 border-purple-200';

                          return (
                            <div
                              key={i}
                              id={`error-card-${originalIdx}`}
                              className={`rounded-2xl border p-4.5 transition space-y-3 ${
                                isHighlighted
                                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/40'
                                  : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xs'
                              }`}
                            >
                              {/* Card Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeStyle}`}
                                  >
                                    Lỗi {err.loai_loi}
                                  </span>
                                  {err.vi_tri_ngu_canh && (
                                    <span className="text-xs text-stone-500 font-medium">
                                      • {err.vi_tri_ngu_canh}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditError(originalIdx, err)}
                                    className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition text-xs flex items-center gap-1"
                                    title="Chỉnh sửa nội dung lỗi này"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Sửa</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteError(originalIdx)}
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition text-xs flex items-center gap-1"
                                    title="Xóa lỗi này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Error word comparison: Sai ➔ Đúng */}
                              <div className="flex flex-wrap items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                                <span className="font-semibold text-stone-600">Từ / vế sai:</span>
                                <span className="line-through text-red-700 font-bold bg-red-100/70 px-2 py-0.5 rounded border border-red-200">
                                  "{err.tu_hoac_cau_sai}"
                                </span>
                                <span className="text-stone-400 font-bold mx-1">➔</span>
                                <span className="font-semibold text-stone-600">Sửa đúng:</span>
                                <span className="text-emerald-800 font-extrabold bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                                  "{err.sua_lai}"
                                </span>
                              </div>

                              {/* Original Student Sentence */}
                              {err.cau_goc && (
                                <div className="space-y-1">
                                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                                    🔴 Câu văn trong bài của học sinh:
                                  </span>
                                  <p className="text-xs sm:text-sm text-stone-800 p-2.5 bg-red-50/30 rounded-xl border border-red-100 leading-relaxed italic">
                                    "{err.cau_goc}"
                                  </p>
                                </div>
                              )}

                              {/* Fully Corrected Sentence For Student to Learn */}
                              {err.cau_sua_hoan_chinh && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                      🟢 Gợi ý câu văn hoàn chỉnh cho học sinh tham khảo:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyCorrectedSentence(err.cau_sua_hoan_chinh!, i)}
                                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                                    >
                                      {copiedSentenceIdx === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                      {copiedSentenceIdx === i ? 'Đã sao chép' : 'Sao chép câu này'}
                                    </button>
                                  </div>
                                  <p className="text-xs sm:text-sm text-emerald-950 font-medium p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 leading-relaxed">
                                    "{err.cau_sua_hoan_chinh}"
                                  </p>
                                </div>
                              )}

                              {/* Rule & Pedagogical explanation */}
                              {err.giai_thich_ngan && (
                                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-start gap-2">
                                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-stone-800">Quy tắc & Lời cô dặn:</strong>{' '}
                                    <span className="italic leading-relaxed">{err.giai_thich_ngan}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* MODE 2: SUMMARY TABLE */
                      <div className="overflow-x-auto rounded-2xl border border-stone-200">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider">
                            <tr>
                              <th className="p-3">Phân loại</th>
                              <th className="p-3">Từ / Câu sai</th>
                              <th className="p-3">Cách sửa đúng</th>
                              <th className="p-3">Câu sửa hoàn chỉnh cho học sinh</th>
                              <th className="p-3">Quy tắc / Giải thích</th>
                              <th className="p-3 text-center">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-200 bg-white">
                            {filteredErrors.map((err, i) => {
                              const originalIdx = allErrors.findIndex((orig) => orig === err);
                              return (
                                <tr key={i} className="hover:bg-stone-50 transition">
                                  <td className="p-3 font-semibold">
                                    <span
                                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                        err.loai_loi === 'Chính tả'
                                          ? 'bg-red-100 text-red-800'
                                          : err.loai_loi === 'Dùng từ'
                                          ? 'bg-amber-100 text-amber-800'
                                          : err.loai_loi === 'Đặt câu'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-purple-100 text-purple-800'
                                      }`}
                                    >
                                      {err.loai_loi}
                                    </span>
                                  </td>
                                  <td className="p-3 text-red-700 font-semibold line-through">
                                    "{err.tu_hoac_cau_sai}"
                                  </td>
                                  <td className="p-3 text-emerald-700 font-bold bg-emerald-50/40">
                                    "{err.sua_lai}"
                                  </td>
                                  <td className="p-3 text-stone-800 italic max-w-xs">
                                    {err.cau_sua_hoan_chinh ? `"${err.cau_sua_hoan_chinh}"` : '-'}
                                  </td>
                                  <td className="p-3 text-stone-600 max-w-xs">{err.giai_thich_ngan}</td>
                                  <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditError(originalIdx, err)}
                                        className="p-1 text-stone-500 hover:text-stone-800 rounded"
                                        title="Sửa"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteError(originalIdx)}
                                        className="p-1 text-red-500 hover:text-red-700 rounded"
                                        title="Xóa"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* REMEDIAL MINI-EXERCISES GENERATOR */}
                    {allErrors.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 rounded-2xl p-4.5 border border-blue-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-blue-950 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            Phiếu bài tập rèn luyện nhanh dành riêng cho em {evaluationResult.ten_hoc_sinh}:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const text = getRemedialExercisesText();
                              navigator.clipboard.writeText(text);
                              setCopiedExercise(true);
                              setTimeout(() => setCopiedExercise(false), 2000);
                            }}
                            className="px-3 py-1 bg-white hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-lg border border-blue-300 flex items-center gap-1 shadow-2xs transition"
                          >
                            {copiedExercise ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedExercise ? 'Đã sao chép bài tập' : 'Sao chép bài tập cho em'}
                          </button>
                        </div>
                        <p className="text-xs text-blue-900/80 leading-relaxed">
                          Hệ thống đã tự động soạn các câu hỏi trắc nghiệm / điền từ bám sát đúng các lỗi chính tả, dùng từ và câu què của em trong bài này để Thầy/Cô giao bài rèn luyện thêm.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* SECTION 6: LỜI NHẮN HỌC SINH & PHỤ HUYNH */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200 space-y-1">
                  <span className="font-bold text-purple-900 block">Lời cô gửi riêng học sinh:</span>
                  <p className="text-stone-700 leading-relaxed italic">{evaluationResult.loi_nhan_xet_hoc_sinh}</p>
                </div>
                <div className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-200 space-y-1">
                  <span className="font-bold text-teal-900 block">Gợi ý đồng hành cùng phụ huynh:</span>
                  <p className="text-stone-700 leading-relaxed italic">{evaluationResult.loi_nhan_xet_phu_huynh}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPrintModal(true)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-4 h-4 text-stone-600" />
                    In phiếu nhận xét
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        `NHẬN XÉT BÀI VIẾT: ${evaluationResult.ten_hoc_sinh} (Lớp 5/2)\n` +
                          `Mức độ: ${evaluationResult.muc_do_dat_duoc}\n` +
                          `Ưu điểm: ${evaluationResult.uu_diem_noi_bat}\n` +
                          `Hạn chế: ${evaluationResult.han_che_can_sua}\n` +
                          `Lời phê: ${evaluationResult.loi_nhan_xet_so_theo_doi}\n` +
                          (evaluationResult.goi_y_sua_cau ? `Gợi ý sửa câu: ${evaluationResult.goi_y_sua_cau}` : ''),
                        'fullcopy'
                      )
                    }
                    className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition"
                  >
                    {copiedField === 'fullcopy' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copiedField === 'fullcopy' ? 'Đã sao chép tất cả' : 'Sao chép toàn bộ'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApproveAndSave}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{evaluationResult.da_duyet ? 'Cập nhật nhận xét' : 'Duyệt & Lưu vào Sổ'}</span>
                  </button>
                </div>
              </div>

              {saveSuccessNotice && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold text-center border border-emerald-300 animate-bounce">
                  ✓ Đã lưu nhận xét vào Sổ theo dõi học sinh thành công!
                </div>
              )}
            </div>
          ) : (
            /* Placeholder state when not yet evaluated */
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-dashed border-stone-300 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-stone-900">Bảng kết quả nhận xét sư phạm</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Sau khi bạn nhấn "Phân tích & Tạo lời nhận xét sư phạm", hệ thống sẽ đọc tất cả các trang ảnh, đối chiếu với SGK/SGV và Thông tư 27 để hiển thị ưu điểm, hạn chế, gợi ý sửa câu và lời phê hoàn chỉnh tại đây.
                </p>
              </div>

              {/* Quick Guidance Card */}
              <div className="pt-4 max-w-md mx-auto text-left bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Quy trình 3 bước chuẩn giáo viên:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-stone-600">
                  <li>Chọn bài học & chọn học sinh trong danh sách Lớp 5/2.</li>
                  <li>Tải hoặc chụp liên tục các trang ảnh bài làm của học sinh.</li>
                  <li>Xem AI phân tích, chỉnh sửa nếu cần, rồi duyệt lưu vào sổ.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Capture Modal with Continuous Multi-Page Snapping */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-stone-900 rounded-3xl max-w-xl w-full overflow-hidden p-4 sm:p-5 space-y-4 text-white shadow-2xl border border-stone-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <h3 className="font-bold text-sm sm:text-base">
                  Chụp ảnh trực tiếp trang bài viết ({imagesList.length} trang đã chụp)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  title="Đổi camera trước / sau"
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Video Viewport with Alignment Guide */}
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-stone-800">
              <video ref={setVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

              {/* Visual flash effect on shutter */}
              {flashEffect && <div className="absolute inset-0 bg-white opacity-80 transition-opacity"></div>}

              {/* Notebook Page Alignment Frame */}
              <div className="absolute inset-4 sm:inset-6 border-2 border-emerald-400/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between text-[11px] text-emerald-300 font-bold bg-black/40 px-2 py-0.5 rounded-md w-fit">
                  <span>Căn chỉnh trang vở vào khung</span>
                </div>
                <div className="text-right text-[11px] text-emerald-300 font-bold bg-black/40 px-2 py-0.5 rounded-md w-fit self-end">
                  <span>Trang {imagesList.length + 1}</span>
                </div>
              </div>
            </div>

            {/* Captured Pages Strip inside Camera Modal */}
            {imagesList.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                <span className="text-[11px] text-stone-400 font-semibold shrink-0">Đã chụp:</span>
                {imagesList.map((img, i) => (
                  <div key={img.id} className="group relative w-12 h-16 rounded-md overflow-hidden border border-emerald-500/70 shrink-0">
                    <img src={img.dataUrl} alt={`Trang ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      title="Xóa trang này"
                      className="absolute top-0 right-0 p-0.5 bg-red-600/90 hover:bg-red-700 text-white text-[9px] rounded-bl"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-white text-[9px] text-center font-bold">
                      Trang {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Shutter & Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold"
              >
                Hủy
              </button>

              {/* Big Shutter button */}
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl text-sm font-extrabold flex items-center gap-2.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition"
              >
                <Camera className="w-5 h-5" />
                <span>Chụp Trang {imagesList.length + 1}</span>
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
              >
                Xong ({imagesList.length} trang)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Error Modal for Teacher */}
      {showAddErrorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 animate-fadeIn my-6">
            <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-stone-900 text-base">
                  {editingErrorIndex !== null ? 'Chỉnh sửa lỗi bài viết' : 'Thêm lỗi cần lưu ý & hướng dẫn sửa'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddErrorModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Phân loại lỗi
                  </label>
                  <select
                    value={errorForm.loai_loi}
                    onChange={(e) => setErrorForm({ ...errorForm, loai_loi: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-800"
                  >
                    <option value="Chính tả">Chính tả (s/x, tr/ch, d/r/gi...)</option>
                    <option value="Dùng từ">Dùng từ (lặp từ, sai nghĩa...)</option>
                    <option value="Đặt câu">Đặt câu (câu què, thiếu chủ/vị...)</option>
                    <option value="Dấu câu">Dấu câu (chấm, phẩy, ngoặc kép...)</option>
                    <option value="Bố cục">Bố cục & Liên kết đoạn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Vị trí trong bài
                  </label>
                  <input
                    type="text"
                    value={errorForm.vi_tri_ngu_canh || ''}
                    onChange={(e) => setErrorForm({ ...errorForm, vi_tri_ngu_canh: e.target.value })}
                    placeholder="VD: Mở bài, Đoạn 2 câu 1..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-red-700 uppercase mb-1">
                    Từ / Cụm từ viết sai (*)
                  </label>
                  <input
                    type="text"
                    value={errorForm.tu_hoac_cau_sai}
                    onChange={(e) => setErrorForm({ ...errorForm, tu_hoac_cau_sai: e.target.value })}
                    placeholder="VD: chời xang, gất..."
                    className="w-full bg-red-50/50 border border-red-300 rounded-xl p-2.5 text-xs font-semibold text-red-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">
                    Cách sửa đúng chuẩn (*)
                  </label>
                  <input
                    type="text"
                    value={errorForm.sua_lai}
                    onChange={(e) => setErrorForm({ ...errorForm, sua_lai: e.target.value })}
                    placeholder="VD: trời xanh, rất..."
                    className="w-full bg-emerald-50/50 border border-emerald-300 rounded-xl p-2.5 text-xs font-bold text-emerald-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Câu văn học sinh viết (Câu gốc)
                </label>
                <textarea
                  rows={2}
                  value={errorForm.cau_goc || ''}
                  onChange={(e) => setErrorForm({ ...errorForm, cau_goc: e.target.value })}
                  placeholder="Nguyên văn cả câu của học sinh chứa lỗi sai..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800 italic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 uppercase mb-1 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Câu văn gợi ý sửa hoàn chỉnh cho học sinh
                </label>
                <textarea
                  rows={2}
                  value={errorForm.cau_sua_hoan_chinh || ''}
                  onChange={(e) => setErrorForm({ ...errorForm, cau_sua_hoan_chinh: e.target.value })}
                  placeholder="Câu văn hoàn chỉnh đã sửa đúng, diễn đạt mượt mà để học sinh noi theo..."
                  className="w-full bg-emerald-50/30 border border-emerald-300 rounded-xl p-2.5 text-xs font-medium text-emerald-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Quy tắc & Lời giải thích sư phạm cho học sinh
                </label>
                <textarea
                  rows={2}
                  value={errorForm.giai_thich_ngan || ''}
                  onChange={(e) => setErrorForm({ ...errorForm, giai_thich_ngan: e.target.value })}
                  placeholder="Giải thích ngắn gọn lý do vì sao sai và quy tắc để học sinh nhớ..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                />
              </div>
            </div>

            <div className="bg-stone-50 border-t border-stone-200 px-6 py-3.5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddErrorModal(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-semibold transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveErrorModal}
                disabled={!errorForm.tu_hoac_cau_sai.trim()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thông tin lỗi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High-res Image Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between w-full text-white text-sm font-bold">
              <span>{lightboxImage.title}</span>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs"
              >
                Đóng (Esc)
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black border border-stone-800 max-h-[80vh] flex items-center justify-center">
              <img src={lightboxImage.url} alt={lightboxImage.title} className="max-h-[80vh] max-w-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Printable Sheet Modal */}
      {showPrintModal && evaluationResult && (
        <PrintEvaluationSheet evaluation={evaluationResult} onClose={() => setShowPrintModal(false)} />
      )}

      {/* COMMENT BANK PICKER MODAL */}
      {showCommentBankModal && evaluationResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Ngân hàng lời nhận xét chuẩn Thông tư 27</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  Chọn mẫu nhận xét theo tình huống cho em: <span className="text-emerald-200">{evaluationResult.ten_hoc_sinh}</span>
                </h3>
                <p className="text-xs text-emerald-100">
                  Dạng bài: <strong>{evaluationResult.the_loai_bai_van}</strong> • Mức độ hiện tại: <strong>{evaluationResult.muc_do_dat_duoc}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCommentBankModal(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Search & Filter */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={commentBankSearch}
                  onChange={(e) => setCommentBankSearch(e.target.value)}
                  placeholder="Tìm theo tình huống (ví dụ: 'chính tả', 'so sánh', 'câu dài', 'sơ sài', 'tả cảnh')..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {commentBankToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{commentBankToast}</span>
                </div>
              )}
            </div>

            {/* Modal Content List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {(() => {
                const searchQ = commentBankSearch.toLowerCase().trim();
                const filtered = commentBankItems.filter((item) => {
                  if (searchQ) {
                    const matchTitle = item.tinhHuong.toLowerCase().includes(searchQ);
                    const matchMoTa = item.moTaTinhHuong.toLowerCase().includes(searchQ);
                    const matchVo = item.loiNhanXetVaoVo.toLowerCase().includes(searchQ);
                    const matchTheLoai = item.theLoai.toLowerCase().includes(searchQ);
                    const matchTags = item.tags.some((t) => t.toLowerCase().includes(searchQ));
                    return matchTitle || matchMoTa || matchVo || matchTheLoai || matchTags;
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center text-stone-500 text-xs">
                      Không tìm thấy mẫu lời nhận xét phù hợp với từ khoá. Thầy/Cô hãy thử tìm từ khoá khác!
                    </div>
                  );
                }

                return filtered.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-400 bg-white shadow-2xs space-y-3 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-stone-800 text-white">
                          {item.theLoai}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.mucDo === 'Hoàn thành tốt'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : item.mucDo === 'Hoàn thành'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {item.mucDo}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900">{item.tinhHuong}</h4>
                      {item.moTaTinhHuong && (
                        <p className="text-xs text-stone-500 italic mt-0.5">Biểu hiện: {item.moTaTinhHuong}</p>
                      )}
                    </div>

                    {/* Lời phê vào vở */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-950 block">
                          📝 Lời phê vào vở học sinh:
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                          ⚡ {item.loiNhanXetVaoVo.trim().split(/\s+/).length} từ • Viết tay nhanh
                        </span>
                      </div>
                      <p className="text-xs text-stone-800 italic leading-relaxed">
                        "{item.loiNhanXetVaoVo}"
                      </p>
                    </div>

                    {/* Lời vào sổ theo dõi */}
                    <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-stone-700 block">
                        📋 Lời ghi Sổ theo dõi đánh giá:
                      </span>
                      <p className="text-xs text-stone-600 italic">"{item.loiNhanXetSoTheoDoi}"</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          updateResultField('loi_nhan_xet_hoc_sinh', item.loiNhanXetVaoVo);
                          setCommentBankToast(`Đã áp dụng lời phê vào vở cho em ${evaluationResult.ten_hoc_sinh}!`);
                          setTimeout(() => {
                            setCommentBankToast(null);
                            setShowCommentBankModal(false);
                          }, 1200);
                        }}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Áp dụng vào vở</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateResultField('loi_nhan_xet_so_theo_doi', item.loiNhanXetSoTheoDoi);
                          setCommentBankToast(`Đã áp dụng vào Sổ theo dõi cho em ${evaluationResult.ten_hoc_sinh}!`);
                          setTimeout(() => {
                            setCommentBankToast(null);
                            setShowCommentBankModal(false);
                          }, 1200);
                        }}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Áp dụng vào sổ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateResultField('loi_nhan_xet_hoc_sinh', item.loiNhanXetVaoVo);
                          updateResultField('loi_nhan_xet_so_theo_doi', item.loiNhanXetSoTheoDoi);
                          if (item.mucDo) {
                            updateResultField('muc_do_dat_duoc', item.mucDo);
                          }
                          setCommentBankToast(`Đã áp dụng đầy đủ vào vở & sổ cho em ${evaluationResult.ten_hoc_sinh}!`);
                          setTimeout(() => {
                            setCommentBankToast(null);
                            setShowCommentBankModal(false);
                          }, 1200);
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Áp dụng cả hai</span>
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
              <span className="text-stone-500">
                Thầy/Cô có thể chỉnh sửa thêm sau khi áp dụng vào bài làm.
              </span>
              <button
                type="button"
                onClick={() => setShowCommentBankModal(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
