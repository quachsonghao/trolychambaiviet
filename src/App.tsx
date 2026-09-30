/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GradingStudio } from './components/GradingStudio';
import { StudentHistoryView } from './components/StudentHistoryView';
import { ErrorAnalyticsView } from './components/ErrorAnalyticsView';
import { HandbookView } from './components/HandbookView';
import { StorageService } from './services/api';
import { EvaluationResult } from './types';
import { ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'grading' | 'history' | 'analytics' | 'handbook'>('grading');
  const [evaluationCount, setEvaluationCount] = useState<number>(0);
  const [targetStudentForGrading, setTargetStudentForGrading] = useState<string | null>(null);

  const refreshCount = () => {
    const list = StorageService.getHistory();
    setEvaluationCount(list.length);
  };

  useEffect(() => {
    refreshCount();
  }, []);

  const handleEvaluationSaved = (newEval: EvaluationResult) => {
    refreshCount();
  };

  const handleSelectStudentForGrading = (studentName: string) => {
    setTargetStudentForGrading(studentName);
    setActiveTab('grading');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 flex flex-col font-['Be_Vietnam_Pro',sans-serif]">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'grading') {
            setTargetStudentForGrading(null);
          }
        }}
        evaluationCount={evaluationCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'grading' && (
          <GradingStudio
            onEvaluationSaved={handleEvaluationSaved}
            selectedStudentFromList={targetStudentForGrading}
          />
        )}

        {activeTab === 'history' && (
          <StudentHistoryView
            onSelectStudentForGrading={handleSelectStudentForGrading}
            onHistoryChanged={refreshCount}
            onNavigateToAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {activeTab === 'analytics' && (
          <ErrorAnalyticsView
            onSelectStudentForGrading={handleSelectStudentForGrading}
            onHistoryChanged={refreshCount}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'handbook' && <HandbookView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/70 backdrop-blur-xs py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium text-stone-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Trợ lý chấm bài Viết Tiếng Việt tiểu học — Tuân thủ Thông tư 27/2020/TT-BGDĐT</span>
          </div>
          <div className="flex items-center gap-1 text-stone-500">
            <span>Dành cho Giáo viên Tiểu học</span>
            <span>•</span>
            <span>Ưu tiên Tiếng Việt Lớp 5 (SGK Kết nối tri thức với cuộc sống)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
