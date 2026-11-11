import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ConstitutionFocusView } from './components/ConstitutionFocusView';
import { TenColumnTable } from './components/TenColumnTable';
import { DirectoryView } from './components/DirectoryView';
import { TenColumnModal } from './components/TenColumnModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { exportToExcel, exportToCsv, exportToJson } from './utils/exportUtils';
import { LegalRow, DocumentSummary } from './types';

// Pre-compiled verified datasets from barshapbp2026/any-pdf-
import allRowsData from './data/all_rows.json';
import constitutionRowsData from './data/constitution_data.json';
import documentsSummaryData from './data/documents_summary.json';

import { BookOpen, Database, FolderTree, ShieldCheck, Sliders, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const allRows: LegalRow[] = allRowsData as LegalRow[];
  const constitutionRows: LegalRow[] = constitutionRowsData as LegalRow[];
  const documents: DocumentSummary[] = documentsSummaryData as DocumentSummary[];

  // Navigation tab state - default to 'all' for the unified folder-wise table
  const [activeTab, setActiveTab] = useState<'all' | 'constitution' | 'directory'>('all');

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
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 min-w-[220px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>मास्टर तालिका (५. PDF Name सहित ११ स्तम्भ)</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200">
              {allRows.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('constitution')}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'constitution'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>१. नेपालको संबिधान (३०८ धारा र ९ अनुसूची)</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white">
              {constitutionRows.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-indigo-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>PDF फोल्डर र फाइल संरचना निर्देशिका</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              {documents.length} PDFs
            </span>
          </button>
        </div>

        {/* Tab 1: Constitution Focus View */}
        {activeTab === 'constitution' && (
          <ConstitutionFocusView
            rows={constitutionRows}
            onOpenModal={r => handleOpenModal(r, constitutionRows)}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {/* Tab 2: All 48 Documents Master 10-Column Table */}
        {activeTab === 'all' && (
          <TenColumnTable
            rows={allRows}
            documents={documents}
            onOpenModal={r => handleOpenModal(r, allRows)}
            onOpenPdf={handleOpenPdf}
            selectedDocFilter={selectedDocFilter}
            onClearDocFilter={() => setSelectedDocFilter('all')}
            onExportExcel={filtered => handleExportExcelAll(filtered)}
            onExportCsv={filtered => handleExportCsvAll(filtered)}
          />
        )}

        {/* Tab 3: Folder and Subfolder Directory */}
        {activeTab === 'directory' && (
          <DirectoryView
            documents={documents}
            onSelectDoc={handleSelectDocFromDirectory}
            onOpenPdf={handleOpenPdf}
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
