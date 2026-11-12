const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const toDeva = n => (n === null || n === undefined || n === '') ? '' : n.toString().replace(/[0-9]/g, d => '०१२३४५६७८९'[d]);
const toNum = s => {
  if (!s) return 0;
  const cleaned = s.toString().replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d)).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

function cleanNepaliFont(text) {
  if (!text) return '';
  let s = text.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\t+/g, ' ').replace(/[]/g, '');
  
  // Ligature and typography fixes
  const wordMap = {
    'प्र ारम्भ': 'प्रारम्भ',
    'प्रारम् भ': 'प्रारम्भ',
    'प्र ारम् भ': 'प्रारम्भ',
    'प्र ारभभ': 'प्रारम्भ',
    'प्रारभभ': 'प्रारम्भ',
    'सिंशिप्त': 'संक्षिप्त',
    'संशिप् त': 'संक्षिप्त',
    'संशिप्त': 'संक्षिप्त',
    'संजक्षप् त': 'संक्षिप्त',
    'संजक्षिप्त': 'संक्षिप्त',
    'संचिप्त': 'संक्षिप्त',
    'प्र शासन': 'प्रशासन',
    'प्र िासन': 'प्रशासन',
    'मनर्देशशका': 'निर्देशिका',
    'मनर्दे शशका': 'निर्देशिका',
    'मनर्देशिका': 'निर्देशिका',
    'मनर्दे शन': 'निर्देशन',
    'मनर्देशन': 'निर्देशन',
    'पररच् छेर्द': 'परिच्छेद',
    'पररच्छेद': 'परिच्छेद',
    'प्रारशभभक': 'प्रारम्भिक',
    'पररभाषा': 'परिभाषा',
    'िोठ': 'मोठ',
    'स्रेस् ता': 'स्रेस्ता',
    'स्रेस्ता': 'स्रेस्ता',
    'सभबन्त्धी': 'सम्बन्धी',
    'सभबन्धी': 'सम्बन्धी',
    'सभबन्त् धी': 'सम्बन्धी',
    'सम्बन् धी': 'सम्बन्धी',
    'सम्बन्धी': 'सम्बन्धी',
    'व् यवस्था': 'व्यवस्था',
    'व् यवस् था': 'व्यवस्था',
    'ब् यवस्था': 'व्यवस्था',
    'ब् यवस् था': 'व्यवस्था',
    'अमधकार': 'अधिकार',
    'अ मधकार': 'अधिकार',
    'अमधकारको': 'अधिकारको',
    'भूमम': 'भूमि',
    'िुद्द ाको': 'मुद्दाको',
    'िुद्दा': 'मुद्दा',
    'साहवक': 'साबिक',
    'िेर': 'क्षेत्र',
    'िेरफल': 'क्षेत्रफल',
    'उिडा': 'उखडा',
    'र्ग् गा': 'जग्गा',
    'र्ग् गाधनी': 'जग्गाधनी',
    'र्ग्गाधनी': 'जग्गाधनी',
    'र्ग्गा': 'जग्गा',
    'र्द ताा': 'दर्ता',
    'र्दताा': 'दर्ता',
    'अको': 'अर्को',
    'अकै': 'अर्कै',
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
    'सिकारी': 'सहकारी',
    'सचा लन': 'सञ्चालन',
    'सञ्चा लन': 'सञ्चालन',
    'सम्पजत्त': 'सम्पत्ति',
    'सािवभौम': 'सार्वभौम',
    'सािवभौमसत्ता': 'सार्वभौमसत्ता',
    'सिोच्च': 'सर्वोच्च',
    'आियक': 'आवश्यक',
    'पविलो': 'पहिलो',
    'पहहलो': 'पहिलो',
    'र्द ोस्रो': 'दोस्रो',
    'तेस्र ो': 'तेस्रो',
    'सिंशोधन': 'संशोधन',
    'मममि': 'मिति',
    'मिमत': 'मिति',
    'प्र माणीकरण': 'प्रमाणीकरण',
    'प्रिाशणत': 'प्रमाणित',
    'प्र िाशणत': 'प्रमाणित',
    'मनशान': 'निशान',
    'बिस': 'बहस',
    'पैरिी': 'पैरवी',
    'बिुजािीय': 'बहुजातीय',
    'कायाालय': 'कार्यालय',
    'कायाालयले': 'कार्यालयले',
    'काया': 'कार्य',
    'कायाहवमध': 'कार्यविधि',
    'मनवेर्द न': 'निवेदन',
    'मनवेर्दन': 'निवेदन',
    'मनणाय': 'निर्णय',
    'हकमसि': 'किसिम',
    'हकमसििा': 'किसिममा',
    'हकत्ता': 'कित्ता',
    'हकत्ताकाट': 'कित्ताकाट',
    'िञ्जुर': 'मञ्जुर',
    'िञ्जु र': 'मञ्जुर',
    'िोही': 'मोही',
    'िोहीको': 'मोहीको',
    'पुर् ाा': 'पुर्जा',
    'पुर्जा': 'पुर्जा',
    'पुर् ााको': 'पुर्जाको',
    'नभबर': 'नम्बर',
    'दर्द ने': 'दिने',
    'दर्द नु': 'दिनु',
    'िारेर्': 'खारेज',
    'िारेर्जी': 'खारेजी',
    'िारेर् ी': 'खारेजी',
    'सुरिा': 'सुरक्षा',
    'सुरिाको': 'सुरक्षाको',
    'प्र मतमलहप': 'प्रतिलिपि',
    'प्रमतमलहप': 'प्रतिलिपि',
    'शिची': 'खिची',
    'िुशस् कएिा': 'फुस्किएमा',
    'छुहट्ट एिा': 'छुट्टिएमा',
    'मभडाउने': 'भिडाउने',
    'रार्स्व': 'राजस्व',
    'रार्स् व': 'राजस्व',
    'बृत्त शचर': 'वृत्तचित्र',
    'भयानुयल': 'म्यानुअल',
    'मिमसल': 'मिसिल',
    'सिंलग् न': 'संलग्न',
    'फाराि': 'फाराम',
    'अनुगिन': 'अनुगमन',
    'अन्त्तगात': 'अन्तर्गत'
  };

  for (const [w, r] of Object.entries(wordMap)) {
    s = s.split(w).join(r);
  }
  return s.replace(/\s+/g, ' ').trim();
}

// -------------------------------------------------------------------------
// ५.२. जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१
// Exactly extracted from scanned table of contents (Pages 2-5):
// ५२ वटा निर्देशनहरू (Nirdeshans) + ३२ वटा अनुसूचीहरू (Schedules)
// -------------------------------------------------------------------------
const napiNirdeshikaItems = [
  // परिच्छेद १ प्रारम्भिक
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '१', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '२.', title: '२. परिभाषा', page: '१', style: 'bold_and_underline', type: 'निर्देशन' },
  // खण्ड १ जग्गा नाप जाँच सम्बन्धी / परिच्छेद २ नाप जाँच सम्बन्धी प्रारम्भिक कार्य
  { id: '३.', title: '३. नेपाल सरकारले नाप जाँचका लागि आदेश जारी गर्ने', page: '४', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '४.', title: '४. नापी टोलीको गठन तथा व्यवस्थापन', page: '५', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '५.', title: '५. मासिक प्रगति सम्बन्धमा', page: '६', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद ३ नियन्त्रण बिन्दु स्थापना
  { id: '६.', title: '६. नियन्त्रण बिन्दु स्थापना सम्बन्धी कार्यविधि', page: '८', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद ४ फिल्ड कार्य
  { id: '७.', title: '७. नाप जाँच गर्ने कार्यविधि', page: '१०', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '७क.', title: '७क. चक्लाबन्दी वा एकीकृत विकासका लागि नाप जाँच सम्बन्धी व्यवस्था', page: '१४', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '८.', title: '८. चेकजाँच सम्बन्धी व्यवस्था', page: '१४', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '९.', title: '९. सूचना प्रकाशन गर्ने', page: '१५', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद ५ जग्गा दर्ता
  { id: '१०.', title: '१०. जग्गा दर्ता सम्बन्धी कार्यविधि', page: '१७', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '११.', title: '११. ठाउँसरी भोग गरी आएको सम्बन्धमा जग्गा दर्ता गर्ने कार्यविधि', page: '२१', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '१२.', title: '१२. संशोधन गर्न सकिने', page: '२२', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '१३.', title: '१३. साविकको नक्सामा एकल धर्कोबाट संकेतको रुपमा देखाईएको र स्रेस्ता कायम नभएको एवम् प्रयोगमा नरहेको बाटो कुलो सम्बन्धमा', page: '२३', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '१४.', title: '१४. सरकारी जग्गा दर्ता सम्बन्धी व्यवस्था', page: '२३', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '१५.', title: '१५. बेनिस्साको स्ववासी जग्गा दर्ता प्रक्रिया', page: '२४', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '१६.', title: '१६. जग्गा दर्ता गर्न आउने बारेको दोस्रो पटकको सूचना', page: '२५', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '१७.', title: '१७. जग्गा दर्ताको रजिष्टर खडा गर्ने', page: '२५', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '१८.', title: '१८. फिल्डबुक तथा प्लट रजिष्टरको कैफियत महलमा व्यहोरा जनाउने', page: '२५', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद ६ छुट नापी तथा छुट जग्गा दर्ता
  { id: '१९.', title: '१९. छुट जग्गा दर्ता सम्बन्धी कार्यविधि', page: '२६', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '२०.', title: '२०. छुट जग्गा दर्ता सिफारिस समितिमा पेश गर्ने', page: '२७', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '२१.', title: '२१. छुट नापी सम्बन्धी कार्यविधि', page: '२८', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद ७ जग्गाधनी दर्ता स्रेस्ता तथा प्रमाणपत्र तयारी तथा वितरण
  { id: '२२.', title: '२२. जग्गाधनी दर्ता स्रेस्ता तथा प्रमाणपत्र तयारी सम्बन्धी कार्यविधि', page: '३०', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '२३.', title: '२३. जग्गाधनी दर्ता प्रमाणपत्र चेकजाँच तथा वितरण', page: '३१', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद ८ नाप जाँच कार्यमा जग्गाधनीले गर्नुपर्ने कार्यहरू
  { id: '२४.', title: '२४. जग्गाधनीको जिम्मेवारी', page: '३३', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद ९ पुनः नापी भएका क्षेत्रका अधुरा कार्य सम्पादन सम्बन्धमा
  { id: '२५.', title: '२५. नापनक्सा अधुरो रहेको वा नापनक्सा भएता पनि सात दिने सूचना प्रकाशन गर्न बाँकी क्षेत्रको कार्य सम्पादन कार्यविधि', page: '३४', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '२६.', title: '२६. सात दिने सूचना प्रकाशन भएको क्षेत्रको कार्यसम्पादन कार्यविधि', page: '३४', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '२७.', title: '२७. जग्गाधनी दर्ता प्रमाणपत्र वितरण भएको तर लामो समय देखि स्रेस्ता बुझाउन बाँकी रहेको क्षेत्रको कार्यसम्पादन कार्यविधि', page: '३५', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद १० आयोजना तथा अधिकार प्राप्त निकायहरूबाट तयार भएका नक्सा/स्रेस्ताको प्राप्ति, संरक्षण र व्यवस्थापन
  { id: '२८.', title: '२८. नक्सा स्रेस्ता तथा डिजिटल डाटा प्राप्ति', page: '३६', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '२९.', title: '२९. आयोजना तथा अधिकार प्राप्त निकायहरूबाट तयार भएका नक्सा/स्रेस्ता बुझिलिँदा अपनाउनुपर्ने कार्यविधि', page: '३६', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '३०.', title: '३०. नक्सा स्रेस्ता फिल्डबुक तथा डिजिटल डाटाहरू संरक्षण गरी राख्ने', page: '३७', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '३१.', title: '३१. नक्सा स्रेस्ता फिल्डबुक तथा डिजिटल डाटाहरू व्यवस्थित गरी राख्ने', page: '३७', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद ११ कित्ताकाट, फायल नक्सा, टायल चेक
  { id: '३२.', title: '३२. कित्ताकाट गर्ने कार्यविधि', page: '३९', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '३३.', title: '३३. फायल नक्सा सम्बन्धी कार्यविधि', page: '४२', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '३४.', title: '३४. टायल चेक सम्बन्धी कार्यविधि', page: '४३', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद १२ कित्ता एकीकरण तथा खण्डीकरण
  { id: '३५.', title: '३५. कित्ता एकीकरण सम्बन्धी कार्यविधि', page: '४५', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '३६.', title: '३६. जग्गा विकास योजना अनुमति प्राप्त आयोजना क्षेत्रको कित्ता खण्डीकरण', page: '४६', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद १३ फिल्ड रेखाङ्कन, दुरी अंकित, नक्सा प्रिन्ट, फिल्डबुक तथा प्लट रजिष्टर उतार
  { id: '३७.', title: '३७. फिल्ड रेखाङ्कन सम्बन्धी कार्यविधि', page: '४७', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '३८.', title: '३८. फिल्ड रेखाङ्कन बापतको राजस्व निर्धारण', page: '४९', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '३९.', title: '३९. फिल्ड रेखाङ्कन कार्यको अभिलेखीकरण', page: '४९', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '४०.', title: '४०. विकास आयोजनाबाट आयोजना क्षेत्रको कित्ता यकिन गर्ने प्रयोजनमा प्राविधिक सहयोगका लागि कर्मचारी खटाउने कार्यविधि', page: '४९', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '४१.', title: '४१. दुरी अंकित गर्ने सम्बन्धी कार्यविधि', page: '५०', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '४२.', title: '४२. नक्सा प्रिन्ट सम्बन्धी कार्यविधि', page: '५०', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '४३.', title: '४३. फिल्डबुक, प्लट रजिष्टरको प्रतिलिपि उपलब्ध गराउने सम्बन्धी कार्यविधि', page: '५१', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद १४ नक्सा सुधार
  { id: '४४.', title: '४४. नक्सा सुधार सम्बन्धी कार्यविधि', page: '५३', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद १५ मौजुदा दर्ता स्रेस्ता भिडाई स्रेस्ता पुर्जा तयार गर्ने
  { id: '४५.', title: '४५. पुनः नापीको नयाँ स्रेस्ता मालपोत कार्यालयबाट लागू भई सके पश्चात मौजुदा दर्ता स्रेस्ता भिडाई स्रेस्ता पुर्जा तयार गर्ने कार्यविधि', page: '६१', style: 'bold_and_underline', type: 'निर्देशन' },
  // परिच्छेद १६ विविध
  { id: '४६.', title: '४६. नक्सा ओभरल्याप सम्बन्धी', page: '६२', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '४७.', title: '४७. साविक नापीमा नापनक्सा भएका कुनै वडा अन्तर्गत केही कित्ताहरू पुनः नाप जाँच हुँदा नाप जाँच हुन छुट भएकोमा सो को नाप जाँच गर्ने सम्बन्धी', page: '६२', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '४८.', title: '४८. जग्गा दर्ता गर्ने प्रयोजनका लागि नेपाल सरकारबाट गठन भएका आयोग वा समितिको प्रयोजनार्थ कार्यालयमा रहेको नक्साको कुनै कित्ता मध्येबाट हुने नाप जाँच सम्बन्धी', page: '६३', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '४९.', title: '४९. भूसूचना प्रणाली मार्फत सेवा प्रवाह सम्बन्धी', page: '६३', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '५०.', title: '५०. अन्य विविध कार्यहरू', page: '६४', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '५१.', title: '५१. विभागले अनुगमन गर्ने', page: '६४', style: 'bold_and_underline', type: 'निर्देशन' },
  { id: '५२.', title: '५२. खारेजी तथा बचाउ', page: '६४', style: 'bold_and_underline', type: 'निर्देशन' },
  // अनुसूचीहरू (३२ वटा)
  { id: '', title: '', page: '६५', anusuchi_id: 'अनुसूची-१', anusuchi_title: 'अनुसूची-१: कार्यालयबाट विभाग पठाउने प्रगतिको ढाँचा', anusuchi_print_page: '६५', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '६७', anusuchi_id: 'अनुसूची-२', anusuchi_title: 'अनुसूची-२: नियन्त्रण बिन्दु विस्तार सम्बन्धी मापदण्ड (Traverse Observation / Computation Form)', anusuchi_print_page: '६७', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '७०', anusuchi_id: 'अनुसूची-३', anusuchi_title: 'अनुसूची-३: दैनिक डायरी', anusuchi_print_page: '७०', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '७१', anusuchi_id: 'अनुसूची-४', anusuchi_title: 'अनुसूची-४: प्रारम्भिक तेरिज', anusuchi_print_page: '७१', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '७२', anusuchi_id: 'अनुसूची-५', anusuchi_title: 'अनुसूची-५: दाबी विरोधको सूचना', anusuchi_print_page: '७२', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '७३', anusuchi_id: 'अनुसूची-६', anusuchi_title: 'अनुसूची-६: जग्गा दर्ताका लागि निवेदन', anusuchi_print_page: '७३', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '७४', anusuchi_id: 'अनुसूची-७', anusuchi_title: 'अनुसूची-७: जग्गा दर्ताको रजिष्टर', anusuchi_print_page: '७४', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '७५', anusuchi_id: 'अनुसूची-८', anusuchi_title: 'अनुसूची-८: छुट जग्गा दर्ताको लागि सिफारिस गर्दा भर्नुपर्ने फारम', anusuchi_print_page: '७५', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '७९', anusuchi_id: 'अनुसूची-९', anusuchi_title: 'अनुसूची-९: जग्गाधनी तेरिज', anusuchi_print_page: '७९', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '८०', anusuchi_id: 'अनुसूची-१०', anusuchi_title: 'अनुसूची-१०: जग्गाधनी प्रमाणपुर्जा वितरणका लागि आदेश माग गर्न कित्तानापी महाशाखामा पठाउनु पर्ने विवरण', anusuchi_print_page: '८०', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '८१', anusuchi_id: 'अनुसूची-११', anusuchi_title: 'अनुसूची-११: नापी कार्यालयले पुर्जा वितरण गर्नुपूर्व चेकजाँचका लागि कित्तानापी महाशाखाबाट नापी कार्यालयमा खटिएका कर्मचारीले चेक जाँच तथा निरीक्षण गर्नु पर्ने विषयहरू', anusuchi_print_page: '८१', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '८५', anusuchi_id: 'अनुसूची-१२', anusuchi_title: 'अनुसूची-१२: जग्गाधनी दर्ता प्रमाणपुर्जामा चित्त नबुझेमा उजुरी दिन सकिने व्यहोरा उल्लेख भएको छाप', anusuchi_print_page: '८५', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '८६', anusuchi_id: 'अनुसूची-१३', anusuchi_title: 'अनुसूची-१३: पुर्जा वितरण पश्चात ६० दिनभित्र दिने निवेदनको ढाँचा', anusuchi_print_page: '८६', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '८७', anusuchi_id: 'अनुसूची-१४', anusuchi_title: 'अनुसूची-१४: जग्गा दर्ताका लागि निवेदन', anusuchi_print_page: '८७', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '८८', anusuchi_id: 'अनुसूची-१५', anusuchi_title: 'अनुसूची-१५: लिखत दर्ता किताब', anusuchi_print_page: '८८', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '८९', anusuchi_id: 'अनुसूची-१६', anusuchi_title: 'अनुसूची-१६: कित्ताकाट डायरी', anusuchi_print_page: '८९', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '९०', anusuchi_id: 'अनुसूची-१७', anusuchi_title: 'अनुसूची-१७: टायल चेक रजिष्टर', anusuchi_print_page: '९०', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '९१', anusuchi_id: 'अनुसूची-१८', anusuchi_title: 'अनुसूची-१८: क्षेत्रफल छुट फरक', anusuchi_print_page: '९१', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '९४', anusuchi_id: 'अनुसूची-१९', anusuchi_title: 'अनुसूची-१९: कित्ता एकीकरण निवेदन', anusuchi_print_page: '९४', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '९५', anusuchi_id: 'अनुसूची-२०', anusuchi_title: 'अनुसूची-२०: फिल्ड रेखाङ्कन निवेदन', anusuchi_print_page: '९५', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '९६', anusuchi_id: 'अनुसूची-२१', anusuchi_title: 'अनुसूची-२१: फिल्ड रेखाङ्कन दर्ता किताब', anusuchi_print_page: '९६', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '९७', anusuchi_id: 'अनुसूची-२२', anusuchi_title: 'अनुसूची-२२: कार्यालयबाट रेखाङ्कनका लागि खटाइएको पत्र', anusuchi_print_page: '९७', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '९८', anusuchi_id: 'अनुसूची-२३', anusuchi_title: 'अनुसूची-२३: फिल्ड रेखाङ्कन गर्दा गरिने मुचुल्काको ढाँचा', anusuchi_print_page: '९८', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '९९', anusuchi_id: 'अनुसूची-२४', anusuchi_title: 'अनुसूची-२४: फिल्ड रेखाङ्कन गर्न लिइएका आधार विन्दुहरूको स्केचको नमुना', anusuchi_print_page: '९९', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '१००', anusuchi_id: 'अनुसूची-२५', anusuchi_title: 'अनुसूची-२५: फिल्ड रेखाङ्कन प्रतिवेदन पेश गर्ने ढाँचा', anusuchi_print_page: '१००', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '१०१', anusuchi_id: 'अनुसूची-२६', anusuchi_title: 'अनुसूची-२६: नक्सा प्रिन्ट', anusuchi_print_page: '१०१', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '१०२', anusuchi_id: 'अनुसूची-२७', anusuchi_title: 'अनुसूची-२७: फिल्डबुक/प्लट रजिष्टर माग गर्ने निवेदनको ढाँचा', anusuchi_print_page: '१०२', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '१०३', anusuchi_id: 'अनुसूची-२८', anusuchi_title: 'अनुसूची-२८: मालपोत ऐन २०३४ को दफा ८क को उपदफा (२) को प्रयोजनको लागी मालपोत कार्यालयमा पठाउने विवरण', anusuchi_print_page: '१०३', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '१०८', anusuchi_id: 'अनुसूची-२९', anusuchi_title: 'अनुसूची-२९: पुनः नापी बमोजिम जग्गा दर्ताका लागि दिने निवेदनको ढाँचा', anusuchi_print_page: '१०८', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '१०९', anusuchi_id: 'अनुसूची-३०', anusuchi_title: 'अनुसूची-३०: मोठ रोक्का भिडाउन मालपोत कार्यालयलाई पठाउने पत्रको ढाँचा', anusuchi_print_page: '१०९', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '११०', anusuchi_id: 'अनुसूची-३१', anusuchi_title: 'अनुसूची-३१: मालपोत कार्यालयमा निर्णय मिसिल संलग्न कागजातका प्रतिलिपी बुझाउँदा गरिने भरपाई रजिष्टर', anusuchi_print_page: '११०', style: 'bold_only', type: 'अनुसूची' },
  { id: '', title: '', page: '१११', anusuchi_id: 'अनुसूची-३२', anusuchi_title: 'अनुसूची-३२: फाँटवाला कर्मचारीको दैनिक डायरी', anusuchi_print_page: '१११', style: 'bold_only', type: 'अनुसूची' }
];

async function main() {
  // Read parsed 5.1 dataset from /tmp/f5_1_final_dataset.json
  const f5_1_data = JSON.parse(fs.readFileSync('/tmp/f5_1_final_dataset.json', 'utf8'));

  // Build rows for 5.1
  const f5_1_rows = [
    ...f5_1_data.nirdeshans.map(n => ({
      folder_id: '५.',
      subfolder_id: '५.१.',
      folder_name: '५. निर्देशिका',
      subfolder_name: '५.१. भुमि प्रशासन निर्देशिका, २०८१',
      section_id: n.id,
      title_name: n.title,
      title_page: n.page,
      anusuchi_id: '',
      anusuchi_title: '',
      anusuchi_print_page: '',
      pdf_name: 'भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      pdf_path: 'pdfs/५. निर्देशिका/५.१. भुमि प्रशासन निर्देशिका, २०८१/भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      legal_style: n.style,
      type: 'निर्देशन'
    })),
    ...f5_1_data.anusuchis.map(a => ({
      folder_id: '५.',
      subfolder_id: '५.१.',
      folder_name: '५. निर्देशिका',
      subfolder_name: '५.१. भुमि प्रशासन निर्देशिका, २०८१',
      section_id: '',
      title_name: '',
      title_page: a.page,
      anusuchi_id: a.anusuchi_id,
      anusuchi_title: a.anusuchi_title,
      anusuchi_print_page: a.anusuchi_print_page,
      pdf_name: 'भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      pdf_path: 'pdfs/५. निर्देशिका/५.१. भुमि प्रशासन निर्देशिका, २०८१/भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      legal_style: 'bold_only',
      type: 'अनुसूची'
    }))
  ];

  // Build rows for 5.2
  const f5_2_rows = napiNirdeshikaItems.map(item => ({
    folder_id: '५.',
    subfolder_id: '५.२.',
    folder_name: '५. निर्देशिका',
    subfolder_name: '५.२. जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१',
    section_id: item.id || '',
    title_name: item.title || '',
    title_page: item.page || '',
    anusuchi_id: item.anusuchi_id || '',
    anusuchi_title: item.anusuchi_title || '',
    anusuchi_print_page: item.anusuchi_print_page || '',
    pdf_name: 'जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१.pdf',
    pdf_path: 'pdfs/५. निर्देशिका/५.२. जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१/जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१.pdf',
    legal_style: item.style,
    type: item.type
  }));

  // Also build mirror rows for Folder 11 and Folder 12
  // 12.8: जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१.pdf
  const f12_8_rows = napiNirdeshikaItems.map(item => ({
    folder_id: '१२.',
    subfolder_id: '१२.८.',
    folder_name: '१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि',
    subfolder_name: '',
    section_id: item.id || '',
    title_name: item.title || '',
    title_page: item.page || '',
    anusuchi_id: item.anusuchi_id || '',
    anusuchi_title: item.anusuchi_title || '',
    anusuchi_print_page: item.anusuchi_print_page || '',
    pdf_name: '१२.८. जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१.pdf',
    pdf_path: 'pdfs/१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि/१२.८. जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक सम्बन्धि निर्देशिका, २०८१.pdf',
    legal_style: item.style,
    type: item.type
  }));

  // 12.9: भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf
  const f12_9_rows = [
    ...f5_1_data.nirdeshans.map(n => ({
      folder_id: '१२.',
      subfolder_id: '१२.९.',
      folder_name: '१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि',
      subfolder_name: '',
      section_id: n.id,
      title_name: n.title,
      title_page: n.page,
      anusuchi_id: '',
      anusuchi_title: '',
      anusuchi_print_page: '',
      pdf_name: '१२.९. भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      pdf_path: 'pdfs/१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि/१२.९. भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      legal_style: n.style,
      type: 'निर्देशन'
    })),
    ...f5_1_data.anusuchis.map(a => ({
      folder_id: '१२.',
      subfolder_id: '१२.९.',
      folder_name: '१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि',
      subfolder_name: '',
      section_id: '',
      title_name: '',
      title_page: a.page,
      anusuchi_id: a.anusuchi_id,
      anusuchi_title: a.anusuchi_title,
      anusuchi_print_page: a.anusuchi_print_page,
      pdf_name: '१२.९. भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      pdf_path: 'pdfs/१२. मालपोत नापी सम्बन्धि ऐन नियम निर्देशिका कार्यविधि/१२.९. भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      legal_style: 'bold_only',
      type: 'अनुसूची'
    }))
  ];

  // 11.1 also has "भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf"
  const f11_1_rows = [
    ...f5_1_data.nirdeshans.map(n => ({
      folder_id: '११.',
      subfolder_id: '११.१.',
      folder_name: '११. जोड्नु पर्ने कानुन',
      subfolder_name: '११.१. भुमि आयोग हाल',
      section_id: n.id,
      title_name: n.title,
      title_page: n.page,
      anusuchi_id: '',
      anusuchi_title: '',
      anusuchi_print_page: '',
      pdf_name: 'भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      pdf_path: 'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      legal_style: n.style,
      type: 'निर्देशन'
    })),
    ...f5_1_data.anusuchis.map(a => ({
      folder_id: '११.',
      subfolder_id: '११.१.',
      folder_name: '११. जोड्नु पर्ने कानुन',
      subfolder_name: '११.१. भुमि आयोग हाल',
      section_id: '',
      title_name: '',
      title_page: a.page,
      anusuchi_id: a.anusuchi_id,
      anusuchi_title: a.anusuchi_title,
      anusuchi_print_page: a.anusuchi_print_page,
      pdf_name: 'भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      pdf_path: 'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/भूमि प्रशासन ( तेस्रो संसोधन २०८२) निर्देशिका २०८१, २०८२-१२-०६.pdf',
      legal_style: 'bold_only',
      type: 'अनुसूची'
    }))
  ];

  console.log(`Generated:
  - Folder 5.1: ${f5_1_rows.length} rows (436 nirdeshans + 64 schedules)
  - Folder 5.2: ${f5_2_rows.length} rows (52 nirdeshans + 32 schedules)
  - Folder 12.8: ${f12_8_rows.length} rows
  - Folder 12.9: ${f12_9_rows.length} rows
  - Folder 11.1 (Bhumi Prashasan): ${f11_1_rows.length} rows`);

  // Load existing all_rows.json
  const allRowsPath = path.resolve(__dirname, '../src/data/all_rows.json');
  const allRows = JSON.parse(fs.readFileSync(allRowsPath, 'utf8'));

  // Filter out old Folder 5 rows, old 12.8, old 12.9, old 11.1 Bhumi Prashasan
  const cleanedRows = allRows.filter(r => {
    if (r.folder_id === '५.' || r.folder_name === '५. निर्देशिका') return false;
    if (r.folder_id === '१२.' && (r.pdf_name.includes('१२.८.') || r.pdf_name.includes('१२.९.') || r.pdf_name.includes('भूमि प्रशासन') || r.pdf_name.includes('जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक'))) return false;
    if (r.folder_id === '११.' && r.pdf_name.includes('भूमि प्रशासन')) return false;
    return true;
  });

  const mergedRows = [
    ...cleanedRows,
    ...f5_1_rows,
    ...f5_2_rows,
    ...f12_8_rows,
    ...f12_9_rows,
    ...f11_1_rows
  ];

  // Serial Sort
  const devaToNum = s => {
    if (!s) return 999;
    const m = s.toString().match(/^([०-९0-9]+)/);
    if (!m) return 999;
    return parseInt(m[1].replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d)), 10);
  };

  const subfolderToNum = s => {
    if (!s) return 0;
    const parts = s.toString().replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d)).split('.');
    const major = parseInt(parts[0], 10) || 0;
    const minor = parseInt(parts[1], 10) || 0;
    return major * 100 + minor;
  };

  mergedRows.sort((a, b) => {
    const fA = devaToNum(a.folder_id);
    const fB = devaToNum(b.folder_id);
    if (fA !== fB) return fA - fB;

    const sfA = subfolderToNum(a.subfolder_id);
    const sfB = subfolderToNum(b.subfolder_id);
    if (sfA !== sfB) return sfA - sfB;

    if (a.pdf_name !== b.pdf_name) {
      return a.pdf_name.localeCompare(b.pdf_name, 'ne');
    }

    // Sort by section_id or anusuchi_id
    const secA = devaToNum(a.section_id || a.anusuchi_id);
    const secB = devaToNum(b.section_id || b.anusuchi_id);
    if (secA !== secB) return secA - secB;

    return 0;
  });

  fs.writeFileSync(allRowsPath, JSON.stringify(mergedRows, null, 2), 'utf8');
  console.log(`Saved updated all_rows.json with ${mergedRows.length} total rows.`);

  // Update documents_summary.json
  const docsSummaryPath = path.resolve(__dirname, '../src/data/documents_summary.json');
  let docs = JSON.parse(fs.readFileSync(docsSummaryPath, 'utf8'));

  docs = docs.map(doc => {
    if (doc.filename.includes('भूमि प्रशासन') || doc.path.includes('भूमि प्रशासन')) {
      return {
        ...doc,
        totalSections: 436,
        totalSchedules: 64,
        totalRows: 500
      };
    }
    if (doc.filename.includes('जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक') || doc.path.includes('जग्गा नापजाँच तथा नक्सा स्रेस्ता अध्यावधिक')) {
      return {
        ...doc,
        totalSections: 52,
        totalSchedules: 32,
        totalRows: 84
      };
    }
    return doc;
  });

  fs.writeFileSync(docsSummaryPath, JSON.stringify(docs, null, 2), 'utf8');
  console.log('Successfully updated documents_summary.json!');
}

main().catch(console.error);
