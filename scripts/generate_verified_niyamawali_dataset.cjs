const fs = require('fs');
const path = require('path');

const toDeva = n => (n === null || n === undefined || n === '') ? '' : n.toString().replace(/[0-9]/g, d => '०१२३४५६७८९'[d]);

// =========================================================================
// १. उखडा सम्बन्धी (चौथौ संशोधन २०४२) नियमहरू, २०२१ (११ पृष्ठ)
// मूल PDF फाइल: 'उखडा सम्बन्धी (चौथौ संसोधन २०४२ )नियमहरू २०२१, २०४२-०९-२२.pdf'
// =========================================================================
const ukhadaNiyams = [
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '२.', title: '२. परिभाषा', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '३.', title: '३. उखडा जग्गाको लगत लिने', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '४.', title: '४. सूचनामा खुलाउनु पर्ने', page: '२', style: 'underline_only', type: 'नियम' },
  { id: '५.', title: '५. विवरण सूचना प्रकाशित गर्नु पर्ने', page: '२', style: 'bold_and_underline', type: 'नियम' },
  { id: '६.', title: '६. उजुर गर्ने बारे', page: '३', style: 'underline_only', type: 'नियम' },
  { id: '७.', title: '७. नागरिकताको प्रमाण पत्र पेश गर्नु पर्ने', page: '३', style: 'underline_only', type: 'नियम' },
  { id: '७क.', title: '७क. अदालत तोकिने', page: '३', style: 'bold_and_underline', type: 'नियम' },
  { id: '८.', title: '८. हक बेहक सम्बन्धी मिसिल कागजात जिल्ला अदालतमा पठाउने र जग्गा दर्ताको प्रमाण पत्र दिने', page: '३', style: 'bold_and_underline', type: 'नियम' },
  { id: '९.', title: '९. प्राप्त क्षतिपूर्तिको भरपाई दिनु पर्ने', page: '४', style: 'underline_only', type: 'नियम' },
  { id: '१०.', title: '१०. अन्तिम निर्णय नभएसम्म जग्गा दर्ता नहुने', page: '४', style: 'underline_only', type: 'नियम' },
  { id: '११.', title: '११. जग्गाधनीको नाममा जग्गा दर्ता हुने', page: '४', style: 'bold_and_underline', type: 'नियम' },
  { id: '१२.', title: '१२. क्षतिपूर्ति लिन आउने सूचना दिनु पर्ने', page: '५', style: 'underline_only', type: 'नियम' },
  { id: '१३.', title: '१३. किसानले किस्ताबन्दीको रुपैयाँ नबुझाएमा सूचना दिनु पर्ने', page: '५', style: 'underline_only', type: 'नियम' },
  { id: 'द्रष्टव्य', title: 'द्रष्टव्य (शब्द रूपान्तरण व्यवस्था)', page: '५', style: 'bold_only', type: 'नियम' },
  // अनुसूचीहरू
  {
    id: '',
    title: '',
    page: '६',
    anusuchi_id: 'अनुसूची-१',
    anusuchi_title: 'अनुसूची-१: उखडा जग्गा सम्बन्धी विवरणको ढाँचा (नियम ३(१) सँग सम्बन्धित)',
    anusuchi_print_page: '६',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '८',
    anusuchi_id: 'अनुसूची-२',
    anusuchi_title: 'अनुसूची-२: सूचनाको ढाँचा (नियम ५ सँग सम्बन्धित)',
    anusuchi_print_page: '८',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '९',
    anusuchi_id: 'अनुसूची-३',
    anusuchi_title: 'अनुसूची-३: उखडा जग्गाधनी दर्ता प्रमाण पत्र (पुर्जा) को ढाँचा (नियम ८(३) सँग सम्बन्धित)',
    anusuchi_print_page: '९',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '१०',
    anusuchi_id: 'अनुसूची-४',
    anusuchi_title: 'अनुसूची-४: माल अड्डालाई लेखिने पत्रको ढाँचा (नियम ८(४) सँग सम्बन्धित)',
    anusuchi_print_page: '१०',
    style: 'bold_only',
    type: 'अनुसूची'
  }
];

// =========================================================================
// २. जग्गा नाप जाँच (दोस्रो संशोधन २०८३) नियमावली, २०५८ (४७ पृष्ठ)
// मूल PDF फाइल: 'जग्गा नाप जाँच ( दोस्रो संसोधन २०८३) नियमावली २०५८, २०८३-०२-२८.pdf'
// =========================================================================
const napiNiyams = [
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '२.', title: '२. परिभाषा', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '३.', title: '३. जग्गा नाप जाँच गर्न सूचना प्रकाशन गर्नु पर्ने', page: '२', style: 'bold_and_underline', type: 'नियम' },
  { id: '४.', title: '४. जग्गा नाप जाँच गर्ने', page: '२', style: 'bold_and_underline', type: 'नियम' },
  { id: '५.', title: '५. उजुरी र निर्णय', page: '३', style: 'bold_and_underline', type: 'नियम' },
  { id: '६.', title: '६. दोस्रो पटक सूचना प्रकाशन गर्नु पर्ने', page: '३', style: 'bold_and_underline', type: 'नियम' },
  { id: '७.', title: '७. अस्थायी दर्ता सम्बन्धी व्यवस्था', page: '४', style: 'underline_only', type: 'नियम' },
  { id: '८.', title: '८. गाउँ विकास समिति वा नगरपालिकाको क्षेत्र वा वडाको सिमाना छुट्याउने', page: '४', style: 'underline_only', type: 'नियम' },
  { id: '९.', title: '९. जग्गाको क्षेत्रफल निकाल्ने र संशोधन गर्ने', page: '५', style: 'bold_and_underline', type: 'नियम' },
  { id: '१०.', title: '१०. छुट जग्गा दर्ता सम्बन्धी व्यवस्था', page: '५', style: 'bold_and_underline', type: 'नियम' },
  { id: '११.', title: '११. छुट जग्गा दर्ता सिफारिस समितिको गठन', page: '५', style: 'underline_only', type: 'नियम' },
  { id: '१२.', title: '१२. दर्ता स्रेस्ता मिलाउन सक्ने', page: '६', style: 'bold_and_underline', type: 'नियम' },
  { id: '१३.', title: '१३. सरकारी वा सार्वजनिक जग्गा सँग जोडिएको जग्गाको क्षेत्रफल कायम गर्ने', page: '६', style: 'bold_and_underline', type: 'नियम' },
  { id: '१४.', title: '१४. जग्गाधनी दर्ता प्रमाण पुर्जा दिनु पर्ने', page: '६', style: 'bold_and_underline', type: 'नियम' },
  { id: '१५.', title: '१५. सरकारी जग्गा वा सार्वजनिक जग्गाको दर्ता', page: '७', style: 'bold_and_underline', type: 'नियम' },
  { id: '१६.', title: '१६. मौजुदा दर्ता स्रेस्ता भिडाई जग्गा दर्ता गर्ने', page: '८', style: 'underline_only', type: 'नियम' },
  { id: '१७.', title: '१७. आवश्यक सुधार गर्न सक्ने', page: '८', style: 'underline_only', type: 'नियम' },
  { id: '१८.', title: '१८. जग्गामा प्रवेश गर्न सक्ने', page: '९', style: 'underline_only', type: 'नियम' },
  { id: '१९.', title: '१९. क्षतिपूर्ति दिने', page: '९', style: 'underline_only', type: 'नियम' },
  { id: '२०.', title: '२०. जग्गाको किसिम वर्गीकरण गर्ने आधार', page: '९', style: 'bold_and_underline', type: 'नियम' },
  { id: '२१.', title: '२१. जग्गाको किसिम वर्गीकरण सम्बन्धी उजुरी', page: '१०', style: 'underline_only', type: 'नियम' },
  { id: '२२.', title: '२२. नक्सा र स्रेस्ता अद्यावधिक गर्ने', page: '१०', style: 'bold_and_underline', type: 'नियम' },
  { id: '२२क.', title: '२२क. युजर आइडी र पासवर्ड लिनु पर्ने (भूसूचना प्रणाली)', page: '१२', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३.', title: '२३. नक्सा स्रेस्ता अद्यावधिक गर्ने कार्यमा सहयोग गर्नु पर्ने', page: '१३', style: 'underline_only', type: 'नियम' },
  { id: '२४.', title: '२४. चक्लाबन्दी वा एकीकृत विकास गर्नको लागि नाप जाँच गर्दा क्षेत्रफल घटाउन नपाइने', page: '१३', style: 'bold_and_underline', type: 'नियम' },
  { id: '२५.', title: '२५. स्वीकृति लिई हवाई सर्वेक्षण, नक्सा प्रकाशन आदि गर्न सक्ने', page: '१३', style: 'underline_only', type: 'नियम' },
  { id: '२६.', title: '२६. नाप नक्साको अनुमतिपत्र सम्बन्धी व्यवस्था', page: '१४', style: 'bold_and_underline', type: 'नियम' },
  { id: '२७.', title: '२७. परीक्षण समिति सम्बन्धी व्यवस्था', page: '१४', style: 'underline_only', type: 'नियम' },
  { id: '२८.', title: '२८. अनुमतिपत्र प्राप्त गर्न चाहने व्यक्तिको योग्यता', page: '१५', style: 'bold_only', type: 'नियम' },
  { id: '२९.', title: '२९. अनुमतिपत्र दस्तुर', page: '१५', style: 'bold_only', type: 'नियम' },
  { id: '३०.', title: '३०. अनुमतिपत्र प्राप्त व्यक्ति वा संस्थाले पालन गर्नु पर्ने शर्तहरू', page: '१५', style: 'underline_only', type: 'नियम' },
  { id: '३१.', title: '३१. अनुमतिपत्रको अवधी र नवीकरण', page: '१५', style: 'underline_only', type: 'नियम' },
  { id: '३२.', title: '३२. नाप नक्सा समिति सम्बन्धी व्यवस्था', page: '१६', style: 'bold_and_underline', type: 'नियम' },
  { id: '३३.', title: '३३. खर्च असूल गर्ने व्यवस्था', page: '१७', style: 'underline_only', type: 'नियम' },
  { id: '३४.', title: '३४. दण्ड सजाय गर्ने अधिकारी तोकिएको', page: '१७', style: 'bold_only', type: 'नियम' },
  { id: '३५.', title: '३५. अधिकार प्रत्यायोजन', page: '१८', style: 'underline_only', type: 'नियम' },
  { id: '३६.', title: '३६. निर्देशिका बनाउन सक्ने अधिकार', page: '१८', style: 'bold_and_underline', type: 'नियम' },
  { id: '३७.', title: '३७. अनुसूचीमा थपघट वा हेरफेर गर्न सक्ने', page: '१८', style: 'bold_only', type: 'नियम' },
  { id: '३८.', title: '३८. खारेजी र बचाउ', page: '१८', style: 'bold_only', type: 'नियम' },
  // अनुसूचीहरू (१ देखि १४ सम्म, १३क र १३ख सहित कुल १६ वटा)
  {
    id: '',
    title: '',
    page: '१९',
    anusuchi_id: 'अनुसूची-१',
    anusuchi_title: 'अनुसूची-१: नाप जाँच प्रारम्भ गर्ने सूचनाको ढाँचा (नियम ३ को उपनियम (१) सँग सम्बन्धित)',
    anusuchi_print_page: '१९',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२०',
    anusuchi_id: 'अनुसूची-२',
    anusuchi_title: 'अनुसूची-२: सात दिने सार्वजनिक सूचनाको ढाँचा (नियम ४ को उपनियम (२) सँग सम्बन्धित)',
    anusuchi_print_page: '२०',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२१',
    anusuchi_id: 'अनुसूची-३',
    anusuchi_title: 'अनुसूची-३: क्षेत्रीय किताबको ढाँचा (नियम ४ को उपनियम (३) सँग सम्बन्धित)',
    anusuchi_print_page: '२१',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२२',
    anusuchi_id: 'अनुसूची-४',
    anusuchi_title: 'अनुसूची-४: पृथक पृथक स्वामित्व भएको घर जग्गा क्षेत्रीय किताब ढाँचा (नियम ४ को उपनियम (४) सँग सम्बन्धित)',
    anusuchi_print_page: '२२',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२३',
    anusuchi_id: 'अनुसूची-५',
    anusuchi_title: 'अनुसूची-५: भूल सुधार गरी दर्ता गरी पाउँ भन्ने उजुरीको ढाँचा (नियम ५ को उपनियम (१) सँग सम्बन्धित)',
    anusuchi_print_page: '२३',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२४',
    anusuchi_id: 'अनुसूची-६',
    anusuchi_title: 'अनुसूची-६: दोस्रो पटक जारी गरिएको पन्ध्र दिने सूचना (नियम ६ को उपनियम (१) सँग सम्बन्धित)',
    anusuchi_print_page: '२४',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२५',
    anusuchi_id: 'अनुसूची-७',
    anusuchi_title: 'अनुसूची-७: जग्गाको क्षेत्रफल सम्बन्धी विवरण (नियम ९ को उपनियम (१) सँग सम्बन्धित)',
    anusuchi_print_page: '२५',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२६',
    anusuchi_id: 'अनुसूची-८',
    anusuchi_title: 'अनुसूची-८: कित्ता स्रेस्ता (नियम १४ को उपनियम (१) सँग सम्बन्धित)',
    anusuchi_print_page: '२६',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२७',
    anusuchi_id: 'अनुसूची-९',
    anusuchi_title: 'अनुसूची-९: जग्गाधनी दर्ता स्रेस्ता (नियम १४ को उपनियम (१) सँग सम्बन्धित)',
    anusuchi_print_page: '२७',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '३०',
    anusuchi_id: 'अनुसूची-१०',
    anusuchi_title: 'अनुसूची-१०: जग्गाधनी दर्ता प्रमाण-पुर्जा (नियम १४ को उपनियम (२) सँग सम्बन्धित)',
    anusuchi_print_page: '३०',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '३४',
    anusuchi_id: 'अनुसूची-११',
    anusuchi_title: 'अनुसूची-११: जग्गाधनी दर्ता प्रमाण-पुर्जा (मोहीको) (नियम १४ को उपनियम (३) सँग सम्बन्धित)',
    anusuchi_print_page: '३४',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '३८',
    anusuchi_id: 'अनुसूची-१२',
    anusuchi_title: 'अनुसूची-१२: जग्गाको वर्गीकरण गर्दा दिइने अंकको आधार (नियम २० को उपनियम (३) सँग सम्बन्धित)',
    anusuchi_print_page: '३८',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '४२',
    anusuchi_id: 'अनुसूची-१३',
    anusuchi_title: 'अनुसूची-१३: कित्ताकाट स्रेस्ता (प्लट रजिस्टर) (नियम २२ को उपनियम (३) को खण्ड (क) सँग सम्बन्धित)',
    anusuchi_print_page: '४२',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '४३',
    anusuchi_id: 'अनुसूची-१३क',
    anusuchi_title: 'अनुसूची-१३क: भूसूचना प्रणालीको युजर आइडी र पासवर्ड लिन लेखिने पत्रको ढाँचा (नियम २२क को उपनियम (१) सँग सम्बन्धित)',
    anusuchi_print_page: '४३',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '४५',
    anusuchi_id: 'अनुसूची-१३ख',
    anusuchi_title: 'अनुसूची-१३ख: सम्बन्धित स्थानीय तहलाई भूसूचना प्रणालीको युजर आइडी र पासवर्ड दिँदा लेखिने पत्रको ढाँचा (नियम २२क को उपनियम (२) सँग सम्बन्धित)',
    anusuchi_print_page: '४५',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '४६',
    anusuchi_id: 'अनुसूची-१४',
    anusuchi_title: 'अनुसूची-१४: नाप नक्सा गर्ने अनुमति-पत्र (लाइसेन्स) (नियम २६ को उपनियम (२) सँग सम्बन्धित)',
    anusuchi_print_page: '४६',
    style: 'bold_only',
    type: 'अनुसूची'
  }
];

// =========================================================================
// ३. भूउपयोग (तेस्रो संशोधन २०८२) नियमावली, २०७९ (२५ पृष्ठ)
// मूल PDF फाइल: 'भूउपयोग (तेस्रो संसोधन २०८२ ) नियमावली २०७९, २०८३-०७-२७.pdf'
// =========================================================================
const bhuupayogNiyams = [
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '२.', title: '२. परिभाषा', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '३.', title: '३. भूउपयोग कार्यक्रम सञ्चालनका लागि सूचना प्रकाशन गर्ने', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '४.', title: '४. स्थानीय तहमा भूउपयोग नक्सा र तथ्याङ्क तयार गर्ने', page: '२', style: 'underline_only', type: 'नियम' },
  { id: '५.', title: '५. स्थानीय तहमा भूउपयोग क्षेत्र वर्गीकरण', page: '३', style: 'bold_and_underline', type: 'नियम' },
  { id: '६.', title: '६. अन्य भूउपयोग क्षेत्रमा वर्गीकरण गर्न सकिने', page: '४', style: 'underline_only', type: 'नियम' },
  { id: '७.', title: '७. नक्सा तथा तथ्याङ्क उपलब्ध गराउने', page: '४', style: 'underline_only', type: 'नियम' },
  { id: '८.', title: '८. भूउपयोग क्षेत्र वर्गीकरणका आधार, मापदण्ड र क्षेत्रफल', page: '४', style: 'bold_and_underline', type: 'नियम' },
  { id: '९.', title: '९. भूउपयोग योजना तर्जुमा गर्ने', page: '५', style: 'bold_and_underline', type: 'नियम' },
  { id: '१०.', title: '१०. जग्गाधनी दर्ता स्रेस्ता र जग्गाधनी दर्ता प्रमाणपुर्जा अद्यावधिक गर्नु पर्ने', page: '५', style: 'bold_and_underline', type: 'नियम' },
  { id: '११.', title: '११. भूउपयोग क्षेत्र परिवर्तनका लागि निवेदन दिन सक्ने', page: '६', style: 'bold_and_underline', type: 'नियम' },
  { id: '१२.', title: '१२. जग्गाको खण्डीकरण नियन्त्रण', page: '७', style: 'bold_and_underline', type: 'नियम' },
  { id: '१२क.', title: '१२क. कित्ताकाट गर्न सकिने', page: '१०', style: 'bold_and_underline', type: 'नियम' },
  { id: '१२ख.', title: '१२ख. विद्युतीय प्रसारण लाइनको मार्गाधिकार', page: '९', style: 'underline_only', type: 'नियम' },
  { id: '१३.', title: '१३. जग्गाको चक्लाबन्दी कार्यक्रम', page: '१०', style: 'bold_and_underline', type: 'नियम' },
  { id: '१३क.', title: '१३क. भूमि बैङ्कको स्थापना र सञ्चालन', page: '११', style: 'bold_and_underline', type: 'नियम' },
  { id: '१३ख.', title: '१३ख. भूमि बैङ्क मार्फत जग्गा उपयोग', page: '१२', style: 'bold_and_underline', type: 'नियम' },
  { id: '१३ग.', title: '१३ग. स्थानीय तह आफैंले जग्गा उपयोगमा ल्याउन सक्ने', page: '१४', style: 'underline_only', type: 'नियम' },
  { id: '१३घ.', title: '१३घ. भूमि बैङ्क संयुक्त रूपमा सञ्चालन गर्न सकिने', page: '१४', style: 'bold_only', type: 'नियम' },
  { id: '१३ङ.', title: '१३ङ. भूउपयोगमा दिएको जग्गा रोक्का राख्ने', page: '१४', style: 'underline_only', type: 'नियम' },
  { id: '१३च.', title: '१३च. जग्गा फिर्ता दिने वा लिने', page: '१४', style: 'underline_only', type: 'नियम' },
  { id: '१३छ.', title: '१३छ. विवाद समाधान', page: '१५', style: 'bold_and_underline', type: 'नियम' },
  { id: '१४.', title: '१४. भूउपयोग योजनाको अनुकूल हुने गरी गर्नु पर्ने', page: '१५', style: 'bold_only', type: 'नियम' },
  { id: '१५.', title: '१५. सदस्यको सेवा सुविधा', page: '१५', style: 'bold_only', type: 'नियम' },
  { id: '१६.', title: '१६. भूउपयोग सम्बन्धी विवाद समाधान गर्ने', page: '१६', style: 'bold_and_underline', type: 'नियम' },
  { id: '१७.', title: '१७. कार्यान्वयन समितिको बैठक', page: '१६', style: 'underline_only', type: 'नियम' },
  { id: '१८.', title: '१८. उजुरी तथा सजाय सम्बन्धी व्यवस्था', page: '१६', style: 'bold_only', type: 'नियम' },
  { id: '१९.', title: '१९. भूउपयोग परिषद्को सचिवालय', page: '१६', style: 'bold_only', type: 'नियम' },
  { id: '२०.', title: '२०. जग्गाको किसिम उल्लेख गर्नु पर्ने', page: '१६', style: 'bold_and_underline', type: 'नियम' },
  // अनुसूचीहरू
  {
    id: '',
    title: '',
    page: '१७',
    anusuchi_id: 'अनुसूची-१',
    anusuchi_title: 'अनुसूची-१: भूउपयोग क्षेत्र वर्गीकरणका आधार र मापदण्ड (नियम ८ सँग सम्बन्धित)',
    anusuchi_print_page: '१७',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२३',
    anusuchi_id: 'अनुसूची-२',
    anusuchi_title: 'अनुसूची-२: भूउपयोग क्षेत्र परिवर्तन गर्नको लागि दिने निवेदनको ढाँचा (नियम ११ को उपनियम (१) सँग सम्बन्धित)',
    anusuchi_print_page: '२३',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२४',
    anusuchi_id: 'अनुसूची-३',
    anusuchi_title: 'अनुसूची-३: जग्गा उपयोग गर्न दिइने निवेदनको ढाँचा (नियम १३ख को उपनियम (२) सँग सम्बन्धित)',
    anusuchi_print_page: '२४',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '२५',
    anusuchi_id: 'अनुसूची-४',
    anusuchi_title: 'अनुसूची-४: जग्गा उपयोग गर्न इच्छुक व्यक्तिले दिने निवेदनको ढाँचा (नियम १३ख को उपनियम (५) सँग सम्बन्धित)',
    anusuchi_print_page: '२५',
    style: 'bold_only',
    type: 'अनुसूची'
  }
];

// =========================================================================
// ४. मालपोत (नवौं संशोधन २०८३) नियमावली, २०३६ (९६ पृष्ठ)
// मूल PDF फाइल: 'मालपोत (नवौं संसोधन २०८३) नियमावली २०३६, २०८३-०२-२८.pdf'
// =========================================================================
const malpotNiyams = [
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '२.', title: '२. परिभाषा', page: '१', style: 'bold_and_underline', type: 'नियम' },
  { id: '३.', title: '३. जग्गा दर्ता', page: '३', style: 'bold_and_underline', type: 'नियम' },
  { id: '४.', title: '४. नापी नक्सा छुट भएको जग्गा दर्ता गर्ने', page: '३', style: 'bold_and_underline', type: 'नियम' },
  { id: '४क.', title: '४क. दर्ता गर्न सम्म छुट हुन गएको जग्गा दर्ता गर्ने', page: '३', style: 'bold_and_underline', type: 'नियम' },
  { id: '४ख.', title: '४ख. जग्गा दर्ता समितिको गठन', page: '४', style: 'bold_and_underline', type: 'नियम' },
  { id: '५क.', title: '५क. विवरण सच्याउने तथा नामसारी, दाखिल खारेज गर्ने', page: '५', style: 'bold_and_underline', type: 'नियम' },
  { id: '५ख.', title: '५ख. न्यूनतम मूल्य निर्धारण समितिको गठन', page: '५', style: 'bold_and_underline', type: 'नियम' },
  { id: '५ग.', title: '५ग. लगत कट्टा समितिको गठन', page: '६', style: 'bold_and_underline', type: 'नियम' },
  { id: '५घ.', title: '५घ. जग्गा रोक्का वा फुकुवा', page: '७', style: 'bold_and_underline', type: 'नियम' },
  { id: '५ङ.', title: '५ङ. रोक्का रहेको जग्गा फुकुवा सम्बन्धी विशेष व्यवस्था', page: '७', style: 'bold_and_underline', type: 'नियम' },
  { id: '५च.', title: '५च. स्थानीय तहले भूमि प्रशासन सम्बन्धी कार्य गर्ने', page: '८', style: 'bold_and_underline', type: 'नियम' },
  { id: '५छ.', title: '५छ. युजर आइडी र पासवर्ड लिनुपर्ने', page: '८', style: 'underline_only', type: 'नियम' },
  { id: '५ज.', title: '५ज. जग्गाधनीको विस्तृत विवरण उल्लेख भएको पुर्जा हुनु पर्ने', page: '९', style: 'bold_and_underline', type: 'नियम' },
  { id: '५झ.', title: '५झ. लिखत पारित वा स्वामित्व हस्तान्तरण गर्न सक्ने', page: '९', style: 'bold_and_underline', type: 'नियम' },
  { id: '५ञ.', title: '५ञ. मोठ, सक्कल कागजात तथा निर्णय सुरक्षित राख्ने', page: '९', style: 'underline_only', type: 'नियम' },
  { id: '५ट.', title: '५ट. कागजात उपलब्ध गराउनु पर्ने', page: '९', style: 'underline_only', type: 'नियम' },
  { id: '५ठ.', title: '५ठ. दोहोरो पर्ने गरी काम गर्न नहुने', page: '१०', style: 'bold_only', type: 'नियम' },
  { id: '६.', title: '६. मालपोत असूल हुन बाँकी जग्गाको फाँटवारी', page: '१०', style: 'bold_and_underline', type: 'नियम' },
  { id: '७.', title: '७. जग्गा लिलाम गर्ने', page: '११', style: 'bold_and_underline', type: 'नियम' },
  { id: '८.', title: '८. सकार नभएमा जग्गाको बिक्री वितरण', page: '११', style: 'underline_only', type: 'नियम' },
  { id: '१०.', title: '१०. बैङ्क मार्फत मालपोत दाखिल गर्न सकिने', page: '१२', style: 'underline_only', type: 'नियम' },
  { id: '१२.', title: '१२. सुक्खा वा अन्य दैवी प्रकोपले बाली हुन नसकेमा मालपोत मिन्हा दिने', page: '१२', style: 'underline_only', type: 'नियम' },
  { id: '१७.', title: '१७. हाल आवादीको लागि दिइने दरखास्त र वितरण गरिने जग्गाको अधिकतम हद', page: '१३', style: 'bold_and_underline', type: 'नियम' },
  { id: '१८.', title: '१८. जाँच बुझ गर्नु पर्ने', page: '१४', style: 'underline_only', type: 'नियम' },
  { id: '१९.', title: '१९. दर्ता दस्तूर', page: '१५', style: 'bold_only', type: 'नियम' },
  { id: '२०.', title: '२०. हाल आवादीमा जग्गा पाउने प्राथमिकता', page: '१५', style: 'bold_and_underline', type: 'नियम' },
  { id: '२१.', title: '२१. जग्गा आवाद गर्न पालन गर्नु पर्ने शर्त', page: '१५', style: 'underline_only', type: 'नियम' },
  { id: '२२.', title: '२२. जग्गा दर्ता गर्ने', page: '१६', style: 'bold_and_underline', type: 'नियम' },
  { id: '२२क.', title: '२२क. सरकारी र सार्वजनिक जग्गाको दर्ता अद्यावधिक गरी राख्नु पर्ने', page: '१६', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३.', title: '२३. पुरानो हाल आवादीसम्बन्धी', page: '१६', style: 'underline_only', type: 'नियम' },
  { id: '२३क.', title: '२३क. भू-सेवा केन्द्र सम्बन्धी व्यवस्था', page: '१७', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३ख.', title: '२३ख. भू-सेवा केन्द्र सञ्चालनको लागि चाहिने योग्यता तथा पूर्वाधार', page: '१७', style: 'underline_only', type: 'नियम' },
  { id: '२३ग.', title: '२३ग. अनुमतिपत्रको दस्तुर, अवधि तथा नवीकरण सम्बन्धी व्यवस्था', page: '१८', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३घ.', title: '२३घ. भू-सेवा केन्द्रबाट प्रदान गरिने सेवाहरू', page: '२०', style: 'underline_only', type: 'नियम' },
  { id: '२३ङ.', title: '२३ङ. युजर एकाउण्ट उपलब्ध गराउने', page: '२०', style: 'underline_only', type: 'नियम' },
  { id: '२३च.', title: '२३च. धरौटी रकम फिर्ता गर्नु पर्ने', page: '२०', style: 'underline_only', type: 'नियम' },
  { id: '२३छ.', title: '२३छ. जग्गाधनी दर्ता स्रेस्ता र जग्गाधनी दर्ता प्रमाणपुर्जा तयार गर्ने', page: '२१', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३ज.', title: '२३ज. अनुमतिपत्र रद्द गर्न सक्ने', page: '२१', style: 'bold_only', type: 'नियम' },
  { id: '२३झ.', title: '२३झ. भू-सूचना प्रणाली (अनलाइन) को प्राविधिक परीक्षण', page: '२१', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ१.', title: '२३झ१. सरकारी जग्गा दर्ता गर्नु पर्ने', page: '२२', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ२.', title: '२३झ२. सरकारी जग्गा उपयोग गर्न दिन सकिने', page: '२२', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ३.', title: '२३झ३. निजी जग्गा सरकारी निकायलाई उपलब्ध गराउन सक्ने', page: '२४', style: 'underline_only', type: 'नियम' },
  { id: '२३झ४.', title: '२३झ४. लीजमा जग्गा उपलब्ध गराउन सकिने', page: '२५', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ५.', title: '२३झ५. निवेदन दिनु पर्ने', page: '२६', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ६.', title: '२३झ६. छानबिन गर्नु पर्ने', page: '२७', style: 'underline_only', type: 'नियम' },
  { id: '२३झ७.', title: '२३झ७. समितिमा पठाउनु पर्ने', page: '२७', style: 'underline_only', type: 'नियम' },
  { id: '२३झ८.', title: '२३झ८. सिफारिश समिति', page: '२७', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ९.', title: '२३झ९. सिफारिश गर्नु पर्ने', page: '२८', style: 'underline_only', type: 'नियम' },
  { id: '२३झ१०.', title: '२३झ१०. नाफामूलक व्यावसायिक कारोबारका लागि जग्गा लीजमा दिने सम्बन्धी व्यवस्था', page: '२९', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ११.', title: '२३झ११. लीजमा उपलब्ध गराउन स्वीकृति दिने', page: '३०', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ१२.', title: '२३झ१२. लीज सम्झौता गर्नु पर्ने', page: '३०', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ१३.', title: '२३झ१३. लीजको प्रमाणपत्र', page: '३०', style: 'underline_only', type: 'नियम' },
  { id: '२३झ१४.', title: '२३झ१४. रकम बुझाउनु पर्ने', page: '३०', style: 'underline_only', type: 'नियम' },
  { id: '२३झ१५.', title: '२३झ१५. लीज प्राप्त कर्ताको कर्तव्य तथा दायित्व', page: '३१', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ१६.', title: '२३झ१६. लीज अवधि थप तथा नवीकरण', page: '३२', style: 'underline_only', type: 'नियम' },
  { id: '२३झ१७.', title: '२३झ१७. लीज सम्झौता रद्द गर्न सकिने', page: '३३', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ१८.', title: '२३झ१८. लीजमा दिएको जग्गा फिर्ता लिन सक्ने', page: '३४', style: 'bold_only', type: 'नियम' },
  { id: '२३झ१९.', title: '२३झ१९. लीजमा परिणत गर्नु पर्ने', page: '३४', style: 'underline_only', type: 'नियम' },
  { id: '२३झ२०.', title: '२३झ२०. सरकारी तथा सार्वजनिक संरचना निर्माणको लागि जग्गा दिन सक्ने', page: '३५', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ२१.', title: '२३झ२१. अनुगमन तथा निरीक्षण', page: '३५', style: 'underline_only', type: 'नियम' },
  { id: '२३झ२२.', title: '२३झ२२. उजुरी दिन सक्ने', page: '३६', style: 'bold_only', type: 'नियम' },
  { id: '२३झ२३.', title: '२३झ२३. उपयोग वा लीजमा उपलब्ध गराउने जग्गाको प्रकृति र क्षेत्रफल सम्बन्धी व्यवस्था', page: '३६', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३झ२४.', title: '२३झ२४. अभिलेख राख्नु पर्ने', page: '३७', style: 'underline_only', type: 'नियम' },
  { id: '२३झ२५.', title: '२३झ२५. प्रकाशन गर्नु पर्ने', page: '३८', style: 'bold_only', type: 'नियम' },
  { id: '२३ञ.', title: '२३ञ. निवेदन दिनुपर्ने (घरजग्गा कारोबार इजाजतपत्र)', page: '३८', style: 'bold_and_underline', type: 'नियम' },
  { id: '२३ट.', title: '२३ट. इजाजतपत्रको दस्तुर र नवीकरण', page: '३८', style: 'underline_only', type: 'नियम' },
  { id: '२३ठ.', title: '२३ठ. भू-सूचना प्रणालीको माध्यमबाट कारोबार गर्नु पर्ने', page: '३९', style: 'bold_and_underline', type: 'नियम' },
  { id: '२४.', title: '२४. पुनर्वासद्वारा बिक्री वितरण भएको जग्गा', page: '४०', style: 'bold_only', type: 'नियम' },
  { id: '२४क.', title: '२४क. सिफारिश गर्नु पर्ने', page: '४०', style: 'underline_only', type: 'नियम' },
  { id: '२५.', title: '२५. लागू नहुने', page: '४०', style: 'bold_only', type: 'नियम' },
  { id: '२६.', title: '२६. अनुसूचीमा हेरफेर गर्न सक्ने', page: '४०', style: 'bold_only', type: 'नियम' },
  { id: '२७.', title: '२७. निर्देशिका बनाई लागू गर्न सक्ने', page: '४१', style: 'bold_and_underline', type: 'नियम' },
  // अनुसूचीहरू (२१ वटा)
  {
    id: '',
    title: '',
    page: '४२',
    anusuchi_id: 'अनुसूची-१',
    anusuchi_title: 'अनुसूची-१: जग्गा दर्ता किताब (मोठ) को ढाँचा (नियम ३(१) सँग सम्बन्धित)',
    anusuchi_print_page: '४२',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '४३',
    anusuchi_id: 'अनुसूची-१क',
    anusuchi_title: 'अनुसूची-१क: (नवौँ संशोधनद्वारा झिकिएको)',
    anusuchi_print_page: '४३',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '४४',
    anusuchi_id: 'अनुसूची-१ख',
    anusuchi_title: 'अनुसूची-१ख: स्थानीय तहले भूसूचना प्रणालीको युजर आइडी र पासवर्ड माग गर्दा लेखिने पत्रको ढाँचा (नियम ५छ(१) सँग सम्बन्धित)',
    anusuchi_print_page: '४४',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '४६',
    anusuchi_id: 'अनुसूची-१ग',
    anusuchi_title: 'अनुसूची-१ग: कार्यालयले स्थानीय तहलाई भूसूचना प्रणालीको युजर आइडी र पासवर्ड उपलब्ध गराउँदा लेखिने पत्रको ढाँचा (नियम ५छ(२) सँग सम्बन्धित)',
    anusuchi_print_page: '४६',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '४७',
    anusuchi_id: 'अनुसूची-१घ',
    anusuchi_title: 'अनुसूची-१घ: स्थानीय तहबाट सम्पादन हुने भूमिसम्बन्धी सेवाहरू (नियम ५झ(१) सँग सम्बन्धित)',
    anusuchi_print_page: '४७',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '५४',
    anusuchi_id: 'अनुसूची-१ङ',
    anusuchi_title: 'अनुसूची-१ङ: स्थानीय तहले जारी गर्ने जग्गाधनी दर्ता प्रमाणपुर्जाको ढाँचा (नियम ५झ(२) सँग सम्बन्धित)',
    anusuchi_print_page: '५४',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '५९',
    anusuchi_id: 'अनुसूची-१च',
    anusuchi_title: 'अनुसूची-१च: स्थानीय तहले तयार गर्ने जग्गाधनी दर्ता स्रेस्ताको ढाँचा (नियम ५झ(२) सँग सम्बन्धित)',
    anusuchi_print_page: '५९',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '६४',
    anusuchi_id: 'अनुसूची-२',
    anusuchi_title: 'अनुसूची-२: मालपोत असूल भएको रसिदको ढाँचा (नियम ११ सँग सम्बन्धित)',
    anusuchi_print_page: '६४',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '६५',
    anusuchi_id: 'अनुसूची-२क',
    anusuchi_title: 'अनुसूची-२क: सरकारी जग्गाको लगत (अभिलेख) को ढाँचा (नियम २२क(१) सँग सम्बन्धित)',
    anusuchi_print_page: '६५',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '६६',
    anusuchi_id: 'अनुसूची-२ख',
    anusuchi_title: 'अनुसूची-२ख: सार्वजनिक जग्गाको लगत (अभिलेख) को ढाँचा (नियम २२क(१) सँग सम्बन्धित)',
    anusuchi_print_page: '६६',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '६७',
    anusuchi_id: 'अनुसूची-३',
    anusuchi_title: 'अनुसूची-३: हाल आवादीको लागि दिइने दरखास्तको ढाँचा (नियम १७(१) सँग सम्बन्धित)',
    anusuchi_print_page: '६७',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '६९',
    anusuchi_id: 'अनुसूची-३क',
    anusuchi_title: 'अनुसूची-३क: सरकारी जग्गा उपयोगको प्रमाणपत्र (नियम २३झ२(१३) सँग सम्बन्धित)',
    anusuchi_print_page: '६९',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '७०',
    anusuchi_id: 'अनुसूची-३ख',
    anusuchi_title: 'अनुसूची-३ख: सरकारी निकायलाई उपयोग वा लीजमा उपलब्ध गराउने जग्गाको प्रकृति र क्षेत्रफल (नियम २३झ३(४) सँग सम्बन्धित)',
    anusuchi_print_page: '७०',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '७९',
    anusuchi_id: 'अनुसूची-३ग',
    anusuchi_title: 'अनुसूची-३ग: लीजमा दिइने सरकारी जग्गाको न्यूनतम लीज रकम (नियम २३झ४(१) र नियम २३झ९ सँग सम्बन्धित)',
    anusuchi_print_page: '७९',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '८२',
    anusuchi_id: 'अनुसूची-३घ',
    anusuchi_title: 'अनुसूची-३घ: सरकारी जग्गा लीजमा दिने सम्झौताको ढाँचा (नियम २३झ१२ सँग सम्बन्धित)',
    anusuchi_print_page: '८२',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '८३',
    anusuchi_id: 'अनुसूची-३ङ',
    anusuchi_title: 'अनुसूची-३ङ: सरकारी जग्गा लीजको प्रमाणपत्रको ढाँचा (नियम २३झ१३ सँग सम्बन्धित)',
    anusuchi_print_page: '८३',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '८५',
    anusuchi_id: 'अनुसूची-४',
    anusuchi_title: 'अनुसूची-४: भू-सेवा केन्द्र सञ्चालनको लागि दिइने निवेदनको ढाँचा (नियम २३क(३) सँग सम्बन्धित)',
    anusuchi_print_page: '८५',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '८७',
    anusuchi_id: 'अनुसूची-५',
    anusuchi_title: 'अनुसूची-५: भू-सेवा केन्द्र सञ्चालन अनुमतिपत्र (लाइसेन्स) को ढाँचा (नियम २३क(५) सँग सम्बन्धित)',
    anusuchi_print_page: '८७',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '८९',
    anusuchi_id: 'अनुसूची-६',
    anusuchi_title: 'अनुसूची-६: भू-सेवा केन्द्र नवीकरणको प्रमाणपत्रको ढाँचा (नियम २३छ सँग सम्बन्धित)',
    anusuchi_print_page: '८९',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '९१',
    anusuchi_id: 'अनुसूची-७',
    anusuchi_title: 'अनुसूची-७: भू-सेवा केन्द्रको दर्ता किताबको ढाँचा (नियम २३छ सँग सम्बन्धित)',
    anusuchi_print_page: '९१',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '९३',
    anusuchi_id: 'अनुसूची-८',
    anusuchi_title: 'अनुसूची-८: घरजग्गा कारोबारको इजाजतपत्र लिन दिइने निवेदनको ढाँचा (नियम २३ञ(१) सँग सम्बन्धित)',
    anusuchi_print_page: '९३',
    style: 'bold_only',
    type: 'अनुसूची'
  },
  {
    id: '',
    title: '',
    page: '९५',
    anusuchi_id: 'अनुसूची-९',
    anusuchi_title: 'अनुसूची-९: घरजग्गा कारोबारको इजाजतपत्र (लाइसेन्स) को ढाँचा (नियम २३ञ(२) सँग सम्बन्धित)',
    anusuchi_print_page: '९५',
    style: 'bold_only',
    type: 'अनुसूची'
  }
];

function buildLegalRows(folderId, subfolderId, folderName, subfolderName, pdfName, pdfPath, items) {
  return items.map(item => ({
    folder_id: folderId,
    subfolder_id: subfolderId,
    folder_name: folderName,
    subfolder_name: subfolderName,
    section_id: toDeva(item.id),
    title_name: item.title,
    title_page: toDeva(item.page),
    anusuchi_id: toDeva(item.anusuchi_id || ''),
    anusuchi_title: item.anusuchi_title || '',
    anusuchi_print_page: toDeva(item.anusuchi_print_page || ''),
    pdf_name: pdfName,
    pdf_path: pdfPath,
    type: item.type || (item.anusuchi_id ? 'अनुसूची' : 'नियम'),
    legal_style: item.style || 'bold_and_underline'
  }));
}

// Build Folder 4 Rows
const f4_ukhada_rows = buildLegalRows(
  '४.',
  '',
  '४. नियमावली',
  '',
  'उखडा सम्बन्धी (चौथौ संसोधन २०४२ )नियमहरू २०२१, २०४२-०९-२२.pdf',
  'pdfs/४. नियमावली/उखडा सम्बन्धी (चौथौ संसोधन २०४२ )नियमहरू २०२१, २०४२-०९-२२.pdf',
  ukhadaNiyams
);

const f4_napi_rows = buildLegalRows(
  '४.',
  '',
  '४. नियमावली',
  '',
  'जग्गा नाप जाँच ( दोस्रो संसोधन २०८३) नियमावली २०५८, २०८३-०२-२८.pdf',
  'pdfs/४. नियमावली/जग्गा नाप जाँच ( दोस्रो संसोधन २०८३) नियमावली २०५८, २०८३-०२-२८.pdf',
  napiNiyams
);

const f4_bhuupayog_rows = buildLegalRows(
  '४.',
  '',
  '४. नियमावली',
  '',
  'भूउपयोग (तेस्रो संसोधन २०८२ ) नियमावली २०७९, २०८३-०७-२७.pdf',
  'pdfs/४. नियमावली/भूउपयोग (तेस्रो संसोधन २०८२ ) नियमावली २०७९, २०८३-०७-२७.pdf',
  bhuupayogNiyams
);

const f4_malpot_rows = buildLegalRows(
  '४.',
  '',
  '४. नियमावली',
  '',
  'मालपोत (नवौं संसोधन २०८३) नियमावली २०३६, २०८३-०२-२८.pdf',
  'pdfs/४. नियमावली/मालपोत (नवौं संसोधन २०८३) नियमावली २०३६, २०८३-०२-२८.pdf',
  malpotNiyams
);

const allFolder4Rows = [...f4_ukhada_rows, ...f4_napi_rows, ...f4_bhuupayog_rows, ...f4_malpot_rows];

// Build Folder 12 Mirror Rows
const f12_napi_rows = buildLegalRows(
  '१२.',
  '१२.५.',
  '१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि',
  '',
  '१२.५.  जग्गा नाप जाँच ( दोस्रो संसोधन २०८३) नियमावली २०५८, २०८३-०२-२८.pdf',
  'pdfs/१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि/१२.५.  जग्गा नाप जाँच ( दोस्रो संसोधन २०८३) नियमावली २०५८, २०८३-०२-२८.pdf',
  napiNiyams
);

const f12_malpot_rows = buildLegalRows(
  '१२.',
  '१२.६.',
  '१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि',
  '',
  '१२.६. मालपोत (नवौं संसोधन २०८३) नियमावली २०३६, २०८३-०२-२८.pdf',
  'pdfs/१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि/१२.६. मालपोत (नवौं संसोधन २०८३) नियमावली २०३६, २०८३-०२-२८.pdf',
  malpotNiyams
);

const f12_bhuupayog_rows = buildLegalRows(
  '१२.',
  '१२.७.',
  '१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि',
  '',
  '१२.७. भूउपयोग (तेस्रो संसोधन २०८२ ) नियमावली २०७९, २०८३-०७-२७.pdf',
  'pdfs/१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि/१२.७. भूउपयोग (तेस्रो संसोधन २०८२ ) नियमावली २०७९, २०८३-०७-२७.pdf',
  bhuupayogNiyams
);

const allFolder12MirrorRows = [...f12_napi_rows, ...f12_malpot_rows, ...f12_bhuupayog_rows];

console.log(`Generated Folder 4 rows: ${allFolder4Rows.length}`);
console.log(`Generated Folder 12 mirror rows: ${allFolder12MirrorRows.length}`);

// Load existing all_rows.json
const allRowsPath = path.resolve(__dirname, '../src/data/all_rows.json');
let existingRows = JSON.parse(fs.readFileSync(allRowsPath, 'utf8'));

// Filter out old Folder 4 rows and old Folder 12 rows for these 3 pdfs
const cleanedRows = existingRows.filter(r => {
  if (r.folder_id === '४.' || r.folder_name === '४. नियमावली') return false;
  if (r.folder_id === '१२.' && (
    r.pdf_name.includes('जग्गा नाप जाँच ( दोस्रो संसोधन २०८३) नियमावली') ||
    r.pdf_name.includes('मालपोत (नवौं संसोधन २०८३) नियमावली') ||
    r.pdf_name.includes('भूउपयोग (तेस्रो संसोधन २०८२ ) नियमावली')
  )) return false;
  return true;
});

const mergedRows = [...cleanedRows, ...allFolder4Rows, ...allFolder12MirrorRows];
fs.writeFileSync(allRowsPath, JSON.stringify(mergedRows, null, 2), 'utf8');
console.log(`Successfully updated all_rows.json! New total rows: ${mergedRows.length}`);

// Update documents_summary.json with precise section/schedule counts
const docsSummaryPath = path.resolve(__dirname, '../src/data/documents_summary.json');
let docs = JSON.parse(fs.readFileSync(docsSummaryPath, 'utf8'));

docs = docs.map(doc => {
  if (doc.filename.includes('उखडा सम्बन्धी')) {
    return {
      ...doc,
      totalSections: 15,
      totalSchedules: 4,
      totalRows: ukhadaNiyams.length
    };
  }
  if (doc.filename.includes('जग्गा नाप जाँच ( दोस्रो संसोधन २०८३) नियमावली')) {
    return {
      ...doc,
      totalSections: 39,
      totalSchedules: 16,
      totalRows: napiNiyams.length
    };
  }
  if (doc.filename.includes('भूउपयोग (तेस्रो संसोधन २०८२ ) नियमावली')) {
    return {
      ...doc,
      totalSections: 28,
      totalSchedules: 4,
      totalRows: bhuupayogNiyams.length
    };
  }
  if (doc.filename.includes('मालपोत (नवौं संसोधन २०८३) नियमावली')) {
    return {
      ...doc,
      totalSections: 68,
      totalSchedules: 21,
      totalRows: malpotNiyams.length
    };
  }
  return doc;
});

fs.writeFileSync(docsSummaryPath, JSON.stringify(docs, null, 2), 'utf8');
console.log('Successfully updated documents_summary.json!');
