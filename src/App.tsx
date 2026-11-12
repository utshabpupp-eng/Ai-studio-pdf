import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ConstitutionFocusView } from './components/ConstitutionFocusView';
import { TenColumnTable } from './components/TenColumnTable';
import { DirectoryView } from './components/DirectoryView';
import { TenColumnModal } from './components/TenColumnModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { MarkdownPdfSyncView } from './components/MarkdownPdfSyncView';
import { AinFocusView } from './components/AinFocusView';
import { AdhyadeshFocusView } from './components/AdhyadeshFocusView';
import { NiyamawaliFocusView } from './components/NiyamawaliFocusView';
import { NirdeshikaFocusView } from './components/NirdeshikaFocusView';
import { AkhtiyarFocusView } from './components/AkhtiyarFocusView';
import { BhumiAayogFocusView } from './components/BhumiAayogFocusView';
import { GeminiHeaderAnalyzerModal } from './components/GeminiHeaderAnalyzerModal';
import { exportToExcel, exportToCsv, exportToJson } from './utils/exportUtils';
import { LegalRow, DocumentSummary } from './types';

// Pre-compiled verified datasets from barshapbp2026/any-pdf-
import allRowsData from './data/all_rows.json';
import constitutionRowsData from './data/constitution_data.json';
import documentsSummaryData from './data/documents_summary.json';

import { BookOpen, Database, FolderTree, ShieldCheck, Sliders, Layers, Sparkles, Columns, FileText, Scale, BookMarked, Compass, Users, AlertTriangle } from 'lucide-react';

export default function App() {
  const allRows: LegalRow[] = allRowsData as LegalRow[];
  const constitutionRows: LegalRow[] = constitutionRowsData as LegalRow[];
  const documents: DocumentSummary[] = documentsSummaryData as DocumentSummary[];

  // Navigation tab state - default to 'bhumi-aayog' for the newly completed Folder 9 focus
  const [activeTab, setActiveTab] = useState<'bhumi-aayog' | 'akhtiyar' | 'nirdeshika' | 'niyamawali' | 'adhyadesh' | 'ain' | 'all' | 'constitution' | 'directory' | 'md-sync'>('bhumi-aayog');

  // Gemini Analyzer state
  const [geminiAnalyzerOpen, setGeminiAnalyzerOpen] = useState(false);
  const [geminiDocPath, setGeminiDocPath] = useState('pdfs/२. ऐन/भूउपयोग ऐन २०७६, २०७६-०५-०६.pdf');
  const [geminiPage, setGeminiPage] = useState('१');

  // MD + PDF Sync navigation context
  const [mdSyncDoc, setMdSyncDoc] = useState<string>('नेपालको संबिधान (२०७२-०६-०३).pdf');
  const [mdSyncPage, setMdSyncPage] = useState<string>('३');

  // Modal inspection state
  const [activeModalRow, setActiveModalRow] = useState<LegalRow | null>(null);
  const [modalRowIndex, setModalRowIndex] = useState<number>(-1);
  const [activeRowsContext, setActiveRowsContext] = useState<LegalRow[]>(constitutionRows);

  // PDF Viewer state
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdfPath, setCurrentPdfPath] = useState('');
  const [currentPdfName, setCurrentPdfName] = useState('');
  const [currentPdfPage, setCurrentPdfPage] = useState('1');

  // Pre-selected document filter when user clicks from Directory
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>('all');

  // Open 10-column Modal
  const handleOpenModal = (row: LegalRow, contextList?: LegalRow[]) => {
    const list = contextList || (activeTab === 'constitution' ? constitutionRows : allRows);
    setActiveRowsContext(list);
    const idx = list.findIndex(
      r => r.folder_id === row.folder_id && r.pdf_name === row.pdf_name && r.section_id === row.section_id && r.anusuchi_id === row.anusuchi_id
    );
    setModalRowIndex(idx >= 0 ? idx : 0);
    setActiveModalRow(row);
  };

  const handleNextModalRow = () => {
    if (modalRowIndex < activeRowsContext.length - 1) {
      const nextIdx = modalRowIndex + 1;
      setModalRowIndex(nextIdx);
      setActiveModalRow(activeRowsContext[nextIdx]);
    }
  };

  const handlePrevModalRow = () => {
    if (modalRowIndex > 0) {
      const prevIdx = modalRowIndex - 1;
      setModalRowIndex(prevIdx);
      setActiveModalRow(activeRowsContext[prevIdx]);
    }
  };

  // Open PDF viewer at page
  const handleOpenPdf = (path: string, page: string) => {
    const doc = documents.find(d => d.path === path);
    setCurrentPdfPath(path);
    setCurrentPdfName(doc ? doc.filename : path.split('/').pop() || 'कागजात.pdf');
    setCurrentPdfPage(page || '1');
    setPdfViewerOpen(true);
  };

  // Switch to All Docs table with specific doc filtered
  const handleSelectDocFromDirectory = (filename: string) => {
    setSelectedDocFilter(filename);
    setActiveTab('all');
  };

  // Switch to MD + PDF Sync Dual View with a specific document
  const handleOpenInMdSync = (filename: string, page: string = '1') => {
    setMdSyncDoc(filename);
    setMdSyncPage(page);
    setActiveTab('md-sync');
  };

  // Open Gemini AI Header Analyzer Modal
  const handleOpenGeminiAnalyzer = (docPath: string, page: string = '1') => {
    setGeminiDocPath(docPath);
    setGeminiPage(page);
    setGeminiAnalyzerOpen(true);
  };

  // Exports
  const handleExportExcelAll = (customRows?: LegalRow[]) => {
    const target = customRows || (activeTab === 'constitution' ? constitutionRows : allRows);
    const name = activeTab === 'constitution' ? 'Nepal_Constitution_308_Articles_9_Schedules.xlsx' : 'Nepal_Legal_All_PDFs_10_Columns.xlsx';
    exportToExcel(target, name);
  };

  const handleExportCsvAll = (customRows?: LegalRow[]) => {
    const target = customRows || (activeTab === 'constitution' ? constitutionRows : allRows);
    const name = activeTab === 'constitution' ? 'Nepal_Constitution_308_Articles_9_Schedules.csv' : 'Nepal_Legal_All_PDFs_10_Columns.csv';
    exportToCsv(target, name);
  };

  const handleExportJsonAll = () => {
    const target = activeTab === 'constitution' ? constitutionRows : allRows;
    const name = activeTab === 'constitution' ? 'Nepal_Constitution_Data.json' : 'Nepal_Legal_All_PDFs_Data.json';
    exportToJson(target, name);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        totalRows={allRows.length}
        totalDocs={documents.length}
        onExportExcel={() => handleExportExcelAll()}
        onExportCsv={() => handleExportCsvAll()}
        onExportJson={handleExportJsonAll}
        onOpenGeminiAnalyzer={() => handleOpenGeminiAnalyzer('pdfs/२. ऐन/भूउपयोग ऐन २०७६, २०७६-०५-०६.pdf', '१')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('bhumi-aayog')}
            className={`flex-1 min-w-[210px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'bhumi-aayog'
                ? 'bg-gradient-to-r from-rose-800 via-pink-800 to-rose-900 text-white shadow-md ring-2 ring-rose-400/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-rose-300" />
            <span>९. भुमि समस्या समिति (६ दस्ताबेज)</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-400/30 text-rose-200 font-semibold font-mono">
              {allRows.filter(r => r.folder_id === '९.').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('akhtiyar')}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'akhtiyar'
                ? 'bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900 text-white shadow-md ring-2 ring-indigo-400/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4 text-indigo-300" />
            <span>८. अख्तियार / भ्रष्टाचार</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-400/30 text-indigo-200 font-semibold font-mono">
              {allRows.filter(r => r.folder_id === '८.').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('nirdeshika')}
            className={`flex-1 min-w-[210px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'nirdeshika'
                ? 'bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white shadow-md ring-2 ring-teal-400/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4 text-teal-300" />
            <span>५. निर्देशिका (२ निर्देशिकाहरू — हुबहु)</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-teal-400/30 text-teal-200 font-semibold font-mono">
              {allRows.filter(r => r.folder_id === '५.').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('niyamawali')}
            className={`flex-1 min-w-[210px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'niyamawali'
                ? 'bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 text-white shadow-md ring-2 ring-amber-400/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookMarked className="w-4 h-4 text-amber-300" />
            <span>४. नियमावली (४ नियमावली)</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 font-semibold font-mono">
              {allRows.filter(r => r.folder_id === '४.').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('adhyadesh')}
            className={`flex-1 min-w-[210px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'adhyadesh'
                ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-md ring-2 ring-emerald-400/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-300" />
            <span>३. अध्यादेश (३ अध्यादेश)</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-200 font-semibold font-mono">
              {allRows.filter(r => r.folder_id === '३.').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ain')}
            className={`flex-1 min-w-[210px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'ain'
                ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white shadow-md ring-2 ring-blue-400/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>२. ऐन (५ ऐनहरू — क्रिस्टल क्लियर)</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-200 font-semibold font-mono">
              {allRows.filter(r => r.folder_id === '२.').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>मास्टर तालिका (११ स्तम्भ)</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200">
              {allRows.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('md-sync')}
            className={`flex-1 min-w-[220px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'md-sync'
                ? 'bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white shadow-md ring-2 ring-indigo-400/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Columns className="w-4 h-4 text-amber-300" />
            <span>MD रिडर र PDF सिंक (Dual View)</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 font-semibold">
              नयाँ
            </span>
          </button>

          <button
            onClick={() => setActiveTab('constitution')}
            className={`flex-1 min-w-[190px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'constitution'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>१. संविधान (३०८ धारा, ९ अनुसूची)</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white">
              {constitutionRows.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 min-w-[190px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-indigo-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>४८ PDF फाइल निर्देशिका</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              {documents.length}
            </span>
          </button>
        </div>

        {/* Tab: Folder 9 'भुमि समस्या समाधान समिति' Focus Master Table View */}
        {activeTab === 'bhumi-aayog' && (
          <BhumiAayogFocusView
            allRows={allRows}
            documents={documents}
            onOpenPdf={handleOpenPdf}
            onOpenMdSync={handleOpenInMdSync}
            onOpenModal={r => handleOpenModal(r, allRows)}
            onOpenGeminiAnalyzer={handleOpenGeminiAnalyzer}
          />
        )}

        {/* Tab: Folder 8 'अख्तियार दुरुपयोग अनुसन्धान आयोग' Focus Master Table View */}
        {activeTab === 'akhtiyar' && (
          <AkhtiyarFocusView
            allRows={allRows}
            documents={documents}
            onOpenPdf={handleOpenPdf}
            onOpenMdSync={handleOpenInMdSync}
            onOpenModal={r => handleOpenModal(r, allRows)}
            onOpenGeminiAnalyzer={handleOpenGeminiAnalyzer}
          />
        )}

        {/* Tab: Folder 5 'निर्देशिका' Focus Master Table View */}
        {activeTab === 'nirdeshika' && (
          <NirdeshikaFocusView
            allRows={allRows}
            documents={documents}
            onOpenPdf={handleOpenPdf}
            onOpenMdSync={handleOpenInMdSync}
            onOpenModal={r => handleOpenModal(r, allRows)}
            onOpenGeminiAnalyzer={handleOpenGeminiAnalyzer}
          />
        )}

        {/* Tab 0: Folder 3 'अध्यादेश' Focus Master Table View */}
        {activeTab === 'adhyadesh' && (
          <AdhyadeshFocusView
            allRows={allRows}
            documents={documents}
            onOpenPdf={handleOpenPdf}
            onOpenMdSync={handleOpenInMdSync}
            onOpenModal={r => handleOpenModal(r, allRows)}
            onOpenGeminiAnalyzer={handleOpenGeminiAnalyzer}
          />
        )}

        {/* Tab: Folder 4 'नियमावली' Focus Master Table View */}
        {activeTab === 'niyamawali' && (
          <NiyamawaliFocusView
            allRows={allRows}
            documents={documents}
            onOpenPdf={handleOpenPdf}
            onOpenMdSync={handleOpenInMdSync}
            onOpenModal={r => handleOpenModal(r, allRows)}
            onOpenGeminiAnalyzer={handleOpenGeminiAnalyzer}
          />
        )}

        {/* Tab 1: Folder 2 'ऐन' Focus Master Table View */}
        {activeTab === 'ain' && (
          <AinFocusView
            allRows={allRows}
            documents={documents}
            onOpenPdf={handleOpenPdf}
            onOpenMdSync={handleOpenInMdSync}
            onOpenModal={r => handleOpenModal(r, allRows)}
            onOpenGeminiAnalyzer={handleOpenGeminiAnalyzer}
          />
        )}

        {/* Tab 1: Markdown Reader & Synchronized PDF Dual View */}
        {activeTab === 'md-sync' && (
          <MarkdownPdfSyncView
            documents={documents}
            allRows={allRows}
            initialDocFilename={mdSyncDoc}
            initialPage={mdSyncPage}
            onOpen10ColumnTable={handleSelectDocFromDirectory}
          />
        )}

        {/* Tab 2: Constitution Focus View */}
        {activeTab === 'constitution' && (
          <ConstitutionFocusView
            rows={constitutionRows}
            onOpenModal={r => handleOpenModal(r, constitutionRows)}
            onOpenPdf={handleOpenPdf}
            onOpenInMdSync={page => handleOpenInMdSync('नेपालको संबिधान (२०७२-०६-०३).pdf', page || '३')}
          />
        )}

        {/* Tab 3: All 48 Documents Master 10-Column Table */}
        {activeTab === 'all' && (
          <TenColumnTable
            rows={allRows}
            documents={documents}
            onOpenModal={r => handleOpenModal(r, allRows)}
            onOpenPdf={handleOpenPdf}
            onOpenMdSync={handleOpenInMdSync}
            selectedDocFilter={selectedDocFilter}
            onClearDocFilter={() => setSelectedDocFilter('all')}
            onExportExcel={filtered => handleExportExcelAll(filtered)}
            onExportCsv={filtered => handleExportCsvAll(filtered)}
          />
        )}

        {/* Tab 4: Folder and Subfolder Directory */}
        {activeTab === 'directory' && (
          <DirectoryView
            documents={documents}
            onSelectDoc={handleSelectDocFromDirectory}
            onOpenPdf={handleOpenPdf}
            onOpenMdSync={handleOpenInMdSync}
          />
        )}
      </main>

      {/* 10-Column Modal Inspector */}
      {/* 10-Column Modal Inspector */}
      {activeModalRow && (
        <TenColumnModal
          row={activeModalRow}
          isOpen={true}
          onClose={() => setActiveModalRow(null)}
          onPrev={handlePrevModalRow}
          onNext={handleNextModalRow}
          hasPrev={modalRowIndex > 0}
          hasNext={modalRowIndex < activeRowsContext.length - 1}
          onOpenPdfViewer={handleOpenPdf}
        />
      )}

      {/* Embedded PDF Page Verifier Modal */}
      {pdfViewerOpen && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setPdfViewerOpen(false)}
          pdfPath={currentPdfPath}
          pdfName={currentPdfName}
          targetPage={currentPdfPage}
        />
      )}

      {/* Gemini AI Header & Style Analyzer Modal */}
      <GeminiHeaderAnalyzerModal
        isOpen={geminiAnalyzerOpen}
        onClose={() => setGeminiAnalyzerOpen(false)}
        documents={documents}
        defaultDocPath={geminiDocPath}
        defaultPage={geminiPage}
        onOpenPdf={handleOpenPdf}
        onFilterTableDoc={handleSelectDocFromDirectory}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            नेपाल कानून तथा संबिधान १०-स्तम्भ डेटा पोर्टल • रिपोजिटरी: <code className="text-slate-700 font-semibold">barshapbp2026/any-pdf-</code>
          </div>
          <div className="flex items-center gap-3">
            <span>प्रमाणित ३०८ धारा</span>
            <span>•</span>
            <span>९ अनुसूची</span>
            <span>•</span>
            <span>४८ कानुनी PDF कागजात</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
