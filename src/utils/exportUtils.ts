import * as XLSX from 'xlsx';
import { LegalRow } from '../types';

export const MASTER_TABLE_HEADERS = [
  '१. Folder ID',
  '२. Subfolder ID',
  '३. Folder Name',
  '४. Subfolder Name',
  '५. PDF Name',
  '६. धारा/दफा/नियम/निर्देशन/बुँदा ID',
  '७. Title Name (संयुक्त)',
  '७.१ धारा Title',
  '७.२ दफा Title',
  '७.३ नियम Title',
  '७.४ निर्देशन Title',
  '७.५ बुँदा Title',
  '८. Title Page',
  '९. अनुसूची ID',
  '१०. अनुसूची Title',
  '११. अनुसूची Print Page',
  'PDF Path'
];

export function exportToExcel(rows: LegalRow[], filename = 'Nepal_Legal_Master_Table_Data.xlsx') {
  const formattedData = rows.map(r => ({
    '१. Folder ID': r.folder_id,
    '२. Subfolder ID': r.subfolder_id || '',
    '३. Folder Name': r.folder_name,
    '४. Subfolder Name': r.subfolder_name || '',
    '५. PDF Name': r.pdf_name || '',
    '६. धारा/दफा/नियम/निर्देशन/बुँदा ID': r.section_id || '',
    '७. Title Name': r.title_name || '',
    '७.१ धारा': r.type === 'धारा' ? r.title_name : '',
    '७.२ दफा': r.type === 'दफा' ? r.title_name : '',
    '७.३ नियम': r.type === 'नियम' ? r.title_name : '',
    '७.४ निर्देशन': r.type === 'निर्देशन' ? r.title_name : '',
    '७.५ बुँदा': (r.type === 'बुँदा' || r.type === 'महल') ? r.title_name : '',
    '८. Title Page': r.title_page || '',
    '९. अनुसूची ID': r.anusuchi_id || '',
    '१०. अनुसूची Title': r.anusuchi_title || '',
    '११. अनुसूची Print Page': r.anusuchi_print_page || '',
    'PDF Path': r.pdf_path || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Master_Table_Data');

  // Auto-width columns
  worksheet['!cols'] = [
    { wch: 14 },
    { wch: 16 },
    { wch: 28 },
    { wch: 28 },
    { wch: 45 },
    { wch: 22 },
    { wch: 40 },
    { wch: 35 },
    { wch: 35 },
    { wch: 35 },
    { wch: 35 },
    { wch: 35 },
    { wch: 14 },
    { wch: 16 },
    { wch: 50 },
    { wch: 18 },
    { wch: 60 }
  ];

  XLSX.writeFile(workbook, filename);
}

export function exportToCsv(rows: LegalRow[], filename = 'Nepal_Legal_Master_Table_Data.csv') {
  const headers = [
    '१. Folder ID',
    '२. Subfolder ID',
    '३. Folder Name',
    '४. Subfolder Name',
    '५. PDF Name',
    '६. धारा/दफा/नियम/निर्देशन/बुँदा ID',
    '७.१ धारा Title',
    '७.२ दफा Title',
    '७.३ नियम Title',
    '७.४ निर्देशन Title',
    '७.५ बुँदा Title',
    '७. Title Name (संयुक्त)',
    '८. Title Page',
    '९. अनुसूची ID',
    '१०. अनुसूची Title',
    '११. अनुसूची Print Page'
  ];

  const escapeCsv = (str: string) => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""');
    return `"${clean}"`;
  };

  const csvRows = [headers.map(escapeCsv).join(',')];

  rows.forEach(r => {
    csvRows.push([
      escapeCsv(r.folder_id),
      escapeCsv(r.subfolder_id || ''),
      escapeCsv(r.folder_name),
      escapeCsv(r.subfolder_name || ''),
      escapeCsv(r.pdf_name || ''),
      escapeCsv(r.section_id || ''),
      escapeCsv(r.type === 'धारा' ? r.title_name : ''),
      escapeCsv(r.type === 'दफा' ? r.title_name : ''),
      escapeCsv(r.type === 'नियम' ? r.title_name : ''),
      escapeCsv(r.type === 'निर्देशन' ? r.title_name : ''),
      escapeCsv((r.type === 'बुँदा' || r.type === 'महल') ? r.title_name : ''),
      escapeCsv(r.title_name || ''),
      escapeCsv(r.title_page || ''),
      escapeCsv(r.anusuchi_id || ''),
      escapeCsv(r.anusuchi_title || ''),
      escapeCsv(r.anusuchi_print_page || '')
    ].join(','));
  });

  // UTF-8 BOM (\uFEFF) ensures Excel opens Devanagari Unicode without garbling
  const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJson(rows: LegalRow[], filename = 'Nepal_Legal_10_Columns_Data.json') {
  const jsonStr = JSON.stringify(rows, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
