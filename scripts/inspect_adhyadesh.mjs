import fs from 'fs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

async function inspectPdf(filePath) {
  console.log('\n======================================================');
  console.log('FILE:', filePath);
  console.log('======================================================');
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjs.getDocument({ data }).promise;
  console.log('Total pages:', doc.numPages);
  
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str).filter(s => s.trim().length > 0);
    const text = strings.join(' ');
    console.log(`\n--- PAGE ${i} (chars: ${text.length}) ---`);
    console.log(text.slice(0, 1000));
  }
}

async function run() {
  const files = [
    '/app/applet/public/pdfs/३. अध्यादेश/३.१. केहि नेपाल ऐन सम्बन्धि अध्यादेश/केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०१-२०.pdf',
    '/app/applet/public/pdfs/३. अध्यादेश/३.२. वन सम्बन्धि अध्यादेश/वन सम्बन्धी केही नेपाल ऐनलाई संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf',
    '/app/applet/public/pdfs/३. अध्यादेश/३.३. भुमि सम्बन्धि अध्यादेश/भूमि सम्बन्धी केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf'
  ];
  for (const f of files) {
    await inspectPdf(f);
  }
}
run().catch(console.error);
