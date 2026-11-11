const fs = require('fs');

const toDeva = n => (n === null || n === undefined || n === '') ? '' : n.toString().replace(/[0-9]/g, d => '०१२३४५६७८९'[d]);
const devaToNum = s => {
  if (!s) return 999;
  const m = s.toString().match(/^([०-९0-9]+)/);
  if (!m) return 999;
  return parseInt(m[1].replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d)), 10);
};

const subfolderToNum = s => {
  if (!s) return 0;
  // e.g. "१२.४." -> 12.4
  const parts = s.toString().replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d)).split('.');
  const major = parseInt(parts[0], 10) || 0;
  const minor = parseInt(parts[1], 10) || 0;
  return major * 100 + minor;
};

function cleanNepaliFont(text) {
  if (!text) return '';
  let s = text;
  
  // 1. Remove tabs, zero-width chars, non-standard symbols
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, '');
  s = s.replace(/\t+/g, ' ');
  s = s.replace(/[]/g, '');
  
  // 2. Fix broken conjuncts with spaces between halant and consonant:
  s = s.replace(/प्र\s+ार/g, 'प्रार');
  s = s.replace(/प्र\s+ा/g, 'प्रा');
  s = s.replace(/स्\s+थ/g, 'स्थ');
  s = s.replace(/व्\s+य/g, 'व्य');
  s = s.replace(/न्\s+य/g, 'न्या');
  s = s.replace(/त्\s+य/g, 'त्य');
  s = s.replace(/म्\s+ब/g, 'म्ब');
  s = s.replace(/म्\s+ल/g, 'म्ल');
  s = s.replace(/क्\s+त/g, 'क्त');
  s = s.replace(/क्\s+ष/g, 'क्ष');
  s = s.replace(/ष्\s+ट/g, 'ष्ट');
  s = s.replace(/ष्ट्\s+र/g, 'ष्ट्र');
  s = s.replace(/च्\s+छ/g, 'च्छ');
  s = s.replace(/ज्\s+ञ/g, 'ज्ञ');
  s = s.replace(/न्\s+द/g, 'न्द');
  s = s.replace(/न्\s+त/g, 'न्त');
  s = s.replace(/द्\s+ध/g, 'द्ध');
  s = s.replace(/द्\s+व/g, 'द्व');
  s = s.replace(/द्\s+य/g, 'द्य');
  s = s.replace(/क\s+्\s+ष/g, 'क्ष');
  s = s.replace(/स\s+्\s+थ/g, 'स्थ');
  s = s.replace(/व\s+्\s+य/g, 'व्य');
  s = s.replace(/र\s+्\s+ग/g, 'र्ग');
  s = s.replace(/र\s+्\s+द/g, 'र्द');
  
  // Specific word & ligature dictionary fixes
  const wordMap = {
    'प्र ारम्भ': 'प्रारम्भ',
    'प्रारम् भ': 'प्रारम्भ',
    'प्र ारम् भ': 'प्रारम्भ',
    'संशिप् त': 'संक्षिप्त',
    'संशिप्त': 'संक्षिप्त',
    'संजक्षप् त': 'संक्षिप्त',
    'संजक्षिप्त': 'संक्षिप्त',
    'संचिप्त': 'संक्षिप्त',
    'प्र िरी': 'प्रहरी',
    'प्र शासन': 'प्रशासन',
    'प्र िासन': 'प्रशासन',
    'शशिा': 'शिक्षा',
    'प्र ाववमधक': 'प्राविधिक',
    'व् यावसावयक': 'व्यावसायिक',
    'िोही': 'मोही',
    'िोहीको': 'मोहीको',
    'कूतको': 'कुतको',
    'अवस् था': 'अवस्था',
    'व् यवस् था': 'व्यवस्था',
    'व् यवस्था': 'व्यवस्था',
    'स्रेस् ता': 'स्रेस्ता',
    'स्रेस् तािा': 'स्रेस्तामा',
    'किनव्य': 'कर्तव्य',
    'अ मधकार': 'अधिकार',
    'अमधकार': 'अधिकार',
    'अमधकारको': 'अधिकारको',
    'भूमम': 'भूमि',
    'िुद्द ाको': 'मुद्दाको',
    'िुद्दा': 'मुद्दा',
    'साहवक': 'साबिक',
    'िेर': 'क्षेत्र',
    'िेरफल': 'क्षेत्रफल',
    'उिडा': 'उखडा',
    'र्ग् गा': 'जग्गा',
    'र्द ताा': 'दर्ता',
    'सभबन्त्धी': 'सम्बन्धी',
    'सम् बन् धी': 'सम्बन्धी',
    'सम्बन् धी': 'सम्बन्धी',
    'अको': 'अर्को',
    'परेिा': 'परेमा',
    'तहिा': 'तहमा',
    'नािब': 'नाप',
    'िि': 'तह',
    'ििको': 'तहको',
    'िथा': 'तथा',
    'िुनेछ': 'हुनेछ',
    'िुनु': 'हुनु',
    'िामी': 'हामी',
    'विर्य': 'विषय',
    'विर्यिरु': 'विषयहरू',
    'विर्यिरू': 'विषयहरू',
    'सिकारी': 'सहकारी',
    'िण्डा': 'झन्डा',
    'िण्डानेपालको': 'झन्डा नेपालको',
    'सचा लन': 'सञ्चालन',
    'सञ्चा लन': 'सञ्चालन',
    'सम्पजत्त': 'सम्पत्ति',
    'सािवभौम': 'सार्वभौम',
    'सािवभौमसत्ता': 'सार्वभौमसत्ता',
    'सिोच्च': 'सर्वोच्च',
    'आियक': 'आवश्यक',
    'पविलो': 'पहिलो',
    'मममि': 'मिति',
    'प्र माणीकरण': 'प्रमाणीकरण',
    'मनशान': 'निशान',
    'बिस': 'बहस',
    'पैरिी': 'पैरवी',
    'बिुजािीय': 'बहुजातीय',
    'विशेर् िायुक्त': 'विशेषतायुक्त'
  };

  for (const [w, r] of Object.entries(wordMap)) {
    s = s.split(w).join(r);
  }

  // 3. Fix multiple spaces and trim
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// 1. Process all_rows.json
const allRows = JSON.parse(fs.readFileSync('src/data/all_rows.json', 'utf8'));

allRows.forEach(r => {
  r.title_name = cleanNepaliFont(r.title_name);
  r.anusuchi_title = cleanNepaliFont(r.anusuchi_title);
  if (r.type === 'महल') r.type = 'बुँदा';
});

// Serial sorting:
// 1. Folder ID numerically (1, 2, 3, 4, 5, 8, 9, 10, 11, 12)
// 2. Subfolder ID numerically (3.1, 3.2, 3.3, etc.)
// 3. PDF Path / Filename
// 4. Section ID or schedule order
allRows.sort((a, b) => {
  const fA = devaToNum(a.folder_id);
  const fB = devaToNum(b.folder_id);
  if (fA !== fB) return fA - fB;

  const sfA = subfolderToNum(a.subfolder_id);
  const sfB = subfolderToNum(b.subfolder_id);
  if (sfA !== sfB) return sfA - sfB;

  if (a.pdf_name !== b.pdf_name) {
    return a.pdf_name.localeCompare(b.pdf_name, 'ne');
  }

  // Articles first, schedules last or by section_id
  const secA = devaToNum(a.section_id);
  const secB = devaToNum(b.section_id);
  if (secA !== secB) return secA - secB;

  const schA = devaToNum(a.anusuchi_id);
  const schB = devaToNum(b.anusuchi_id);
  return schA - schB;
});

fs.writeFileSync('src/data/all_rows.json', JSON.stringify(allRows, null, 2));
console.log('Cleaned and sorted all_rows.json:', allRows.length);

// 2. Process constitution_data.json
const constRows = JSON.parse(fs.readFileSync('src/data/constitution_data.json', 'utf8'));
constRows.forEach(r => {
  r.title_name = cleanNepaliFont(r.title_name);
  r.anusuchi_title = cleanNepaliFont(r.anusuchi_title);
});
fs.writeFileSync('src/data/constitution_data.json', JSON.stringify(constRows, null, 2));

// 3. Process documents_summary.json
const docs = JSON.parse(fs.readFileSync('src/data/documents_summary.json', 'utf8'));
docs.sort((a, b) => {
  const fA = devaToNum(a.folderId);
  const fB = devaToNum(b.folderId);
  if (fA !== fB) return fA - fB;
  const sfA = subfolderToNum(a.subfolderId);
  const sfB = subfolderToNum(b.subfolderId);
  if (sfA !== sfB) return sfA - sfB;
  return a.filename.localeCompare(b.filename, 'ne');
});
fs.writeFileSync('src/data/documents_summary.json', JSON.stringify(docs, null, 2));
console.log('Cleaned and sorted documents_summary.json:', docs.length);
