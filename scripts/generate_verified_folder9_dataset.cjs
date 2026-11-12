const fs = require('fs');
const path = require('path');

const toDeva = n => (n === null || n === undefined || n === '') ? '' : n.toString().replace(/[0-9]/g, d => '०१२३४५६७८९'[d]);
const toNum = s => {
  if (!s) return 0;
  const cleaned = s.toString().replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d)).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

// 1. जग्गा उपलब्ध गराउने सम्बन्धि कार्यविधि, २०८३-०३-०२.pdf
const doc1Dafas = [
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '२', type: 'दफा' },
  { id: '२.', title: '२. परिभाषा', page: '२', type: 'दफा' },
  { id: '३.', title: '३. जिल्ला समितिले जग्गा दर्ताको निर्णय गर्नु पूर्व प्राप्त गर्नु पर्ने विवरण तथा कागजातहरू', page: '३', type: 'दफा' },
  { id: '४.', title: '४. हकदाबीको सूचना र जग्गा दर्ता निर्णय', page: '५', type: 'दफा' },
  { id: '५.', title: '५. भूमिहीन दलित र भूमिहीन सुकुम्बासीको नाममा जग्गा दर्ता गर्ने सम्बन्धमा', page: '६', type: 'दफा' },
  { id: '६.', title: '६. अव्यवस्थित बसोबासीको नाममा जग्गा दर्ता गर्ने सम्बन्धमा', page: '६', type: 'दफा' },
  { id: '७.', title: '७. जग्गाधनी दर्ता स्रेस्ता तथा जग्गाधनी दर्ता प्रमाण-पुर्जा', page: '८', type: 'दफा' },
  { id: '८.', title: '८. नक्सा तथा स्रेस्ता हस्तान्तरण', page: '९', type: 'दफा' },
  { id: '९.', title: '९. साविकमा नाप नक्सा भइसकेको जग्गा सम्बन्धमा', page: '९', type: 'दफा' },
  { id: '१०.', title: '१०. स्रेस्ता अद्यावधिक सम्बन्धमा', page: '९', type: 'दफा' },
  { id: '११.', title: '११. प्रगति प्रतिवेदन', page: '९', type: 'दफा' },
  { id: '१२.', title: '१२. प्रचलित कानून बमोजिम हुने', page: '९', type: 'दफा' },
  { id: '१३.', title: '१३. खारेजी र बचाउ', page: '१०', type: 'दफा' },
  { id: '१४.', title: '१४. बाधा अड्काउ फुकाउने अधिकार', page: '१०', type: 'दफा' },
];

const doc1Anusuchis = [
  { id: 'अनुसूची-१', title: 'अनुसूची-१: भूमिहीन दलित र भूमिहीन सुकुम्बासीलाई उपलब्ध गराउने जग्गाको प्रस्तावित विवरण (दफा ३(३)(क) सँग सम्बन्धित)', page: '११', printPage: '११', type: 'अनुसूची' },
  { id: 'अनुसूची-२', title: 'अनुसूची-२: अव्यवस्थित बसोबासीका लागि उपलब्ध गराउने जग्गाको प्रस्तावित विवरण (दफा ३(३)(ख) सँग सम्बन्धित)', page: '१२', printPage: '१२', type: 'अनुसूची' },
  { id: 'अनुसूची-३', title: 'अनुसूची-३: प्रस्तावित स्वामित्व सम्बन्धी विवरण (दफा ३(३)(ग) सँग सम्बन्धित)', page: '१३', printPage: '१३', type: 'अनुसूची' },
  { id: 'अनुसूची-४', title: 'अनुसूची-४: हकदाबी गर्ने सम्बन्धी ७ (सात) दिने सार्वजनिक सूचनाको ढाँचा (दफा ४(१) सँग सम्बन्धित)', page: '१४', printPage: '१४', type: 'अनुसूची' },
  { id: 'अनुसूची-५', title: 'अनुसूची-५: नापी सेरियरी किताब (फिल्डबुक) तयार गर्ने ढाँचा (दफा ५(१) र ६(१०) सँग सम्बन्धित)', page: '१५', printPage: '१५', type: 'अनुसूची' },
  { id: 'अनुसूची-६', title: 'अनुसूची-६: जग्गाधनी दर्ता प्रमाण पुर्जा वितरण सम्बन्धी सूचनाको ढाँचा (दफा ५(२) सँग सम्बन्धित)', page: '१६', printPage: '१६', type: 'अनुसूची' },
  { id: 'अनुसूची-७', title: 'अनुसूची-७: अव्यवस्थित बसोबासीको नाप नक्सा तथा जग्गा दर्ता सम्बन्धी सूचनाको ढाँचा (दफा ६(२) सँग सम्बन्धित)', page: '१७', printPage: '१७', type: 'अनुसूची' },
  { id: 'अनुसूची-८', title: 'अनुसूची-८: जग्गा दर्ता तथा राजस्व दाखिला सम्बन्धी सूचनाको ढाँचा (दफा ६(११) सँग सम्बन्धित)', page: '१८', printPage: '१८', type: 'अनुसूची' },
  { id: 'अनुसूची-९', title: 'अनुसूची-९: जग्गाधनी दर्ता स्रेस्ताको ढाँचा (दफा ७(१) सँग सम्बन्धित)', page: '१९', printPage: '१९', type: 'अनुसूची' },
  { id: 'अनुसूची-१०', title: 'अनुसूची-१०: जग्गाधनी दर्ता प्रमाण-पुर्जाको ढाँचा (दफा ७(१) सँग सम्बन्धित)', page: '२१', printPage: '२१', type: 'अनुसूची' },
  { id: 'अनुसूची-११', title: 'अनुसूची-११: जग्गाधनी प्रमाण पुर्जा वितरण गर्नु पूर्व पूरा हुनुपर्ने कार्यहरूको चेकलिस्ट (दफा ७(३) सँग सम्बन्धित)', page: '२३', printPage: '२३', type: 'अनुसूची' },
  { id: 'अनुसूची-१२', title: 'अनुसूची-१२: जिल्ला समितिले आयोगमा नियमित पठाउने मासिक प्रगति प्रतिवेदनको ढाँचा (दफा ११ सँग सम्बन्धित)', page: '२५', printPage: '२५', type: 'अनुसूची' }
];

// 2. भुमि आयोग गठन आदेश, २०८१-०६-१४.pdf
const doc2Dafas = [
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '१', type: 'दफा' },
  { id: '२.', title: '२. परिभाषा', page: '१', type: 'दफा' },
  { id: '३.', title: '३. आयोगको गठन', page: '२', type: 'दफा' },
  { id: '४.', title: '४. आयोगको काम, कर्तव्य र अधिकार', page: '४', type: 'दफा' },
  { id: '५.', title: '५. जिल्ला समिति गठन', page: '६', type: 'दफा' },
  { id: '६.', title: '६. जिल्ला समितिको काम, कर्तव्य र अधिकार', page: '७', type: 'दफा' },
  { id: '७.', title: '७. लगत संकलन सम्बन्धी व्यवस्था', page: '९', type: 'दफा' },
  { id: '८.', title: '८. जग्गा पहिचान तथा छनोट', page: '११', type: 'दफा' },
  { id: '९.', title: '९. जग्गा उपलब्ध गराउने आधार तथा मापदण्ड', page: '१३', type: 'दफा' },
  { id: '१०.', title: '१०. पुर्जा वितरण सम्बन्धी व्यवस्था', page: '१६', type: 'दफा' },
  { id: '११.', title: '११. अनुगमन तथा निरीक्षण', page: '१८', type: 'दफा' },
  { id: '१२.', title: '१२. आयोगको कोष र आर्थिक व्यवस्था', page: '१९', type: 'दफा' },
  { id: '१३.', title: '१३. कार्यविधि तथा निर्देशिका बनाउने अधिकार', page: '२०', type: 'दफा' },
  { id: '१४.', title: '१४. बाधा अड्काउ फुकाउने', page: '२१', type: 'दफा' },
  { id: '१५.', title: '१५. खारेजी र बचाउ', page: '२२', type: 'दफा' },
];

// 3. भूमिहीन दलित भूमिहीन सुकुम्बासी र अव्यवस्थित बसोबासीको लगत सम्बन्धि निर्देशिका२०८३-०३-०२.pdf
const doc3Nirdeshans = [
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '२', type: 'निर्देशन' },
  { id: '२.', title: '२. परिभाषा', page: '२', type: 'निर्देशन' },
  { id: '३.', title: '३. समिति र प्रदेश तथा स्थानीय तह बीच समझदारी', page: '३', type: 'निर्देशन' },
  { id: '४.', title: '४. सहजीकरण समिति', page: '४', type: 'निर्देशन' },
  { id: '५.', title: '५. जनशक्ति व्यवस्थापन र कार्ययोजना निर्धारण', page: '६', type: 'निर्देशन' },
  { id: '६.', title: '६. स्थानीय तहको अनौपचारिक भू-सम्बन्धको वस्तुस्थिति र परिवेश आँकलन', page: '७', type: 'निर्देशन' },
  { id: '७.', title: '७. तथ्याङ्क संकलनको तयारी र प्रचारप्रसार', page: '७', type: 'निर्देशन' },
  { id: '८.', title: '८. सूचना प्रकाशन', page: '९', type: 'निर्देशन' },
  { id: '९.', title: '९. तथ्याङ्क संकलनको विधि', page: '९', type: 'निर्देशन' },
  { id: '१०.', title: '१०. तालिम तथा प्रशिक्षण', page: '११', type: 'निर्देशन' },
  { id: '११.', title: '११. तथ्याङ्कको प्रविष्टि', page: '१२', type: 'निर्देशन' },
  { id: '१२.', title: '१२. तथ्याङ्कको जाँचबुझ, प्रमाणीकरण तथा हस्तान्तरण', page: '१३', type: 'निर्देशन' },
  { id: '१३.', title: '१३. नाप नक्साको तयारी', page: '१३', type: 'निर्देशन' },
  { id: '१४.', title: '१४. नाप नक्साको विधि र प्रविधि सम्बन्धमा', page: '१५', type: 'निर्देशन' },
  { id: '१५.', title: '१५. नाप नक्सा गर्ने', page: '१५', type: 'निर्देशन' },
  { id: '१६.', title: '१६. नाप नक्सा गर्दा विचार पुर्याउनुपर्ने थप कुराहरू', page: '१९', type: 'निर्देशन' },
  { id: '१७.', title: '१७. नक्सा निर्माण', page: '२०', type: 'निर्देशन' },
  { id: '१८.', title: '१८. नाप नक्साको प्रतिवेदन तयारी, जाँचबुझ र हस्तान्तरण', page: '२१', type: 'निर्देशन' },
  { id: '१९.', title: '१९. अनुगमन सम्बन्धी व्यवस्था', page: '२१', type: 'निर्देशन' },
  { id: '२०.', title: '२०. कार्यविधिको पालना गर्नुपर्ने', page: '२२', type: 'निर्देशन' },
  { id: '२१.', title: '२१. कार्यविधिमा परिमार्जन तथा संशोधन', page: '२२', type: 'निर्देशन' },
  { id: '२२.', title: '२२. प्रचलित कानुन बमोजिम हुने', page: '२२', type: 'निर्देशन' },
  { id: '२३.', title: '२३. खारेजी र बचाऊ', page: '२२', type: 'निर्देशन' },
  { id: '२४.', title: '२४. बाधा अड्काउ फुकाउने अधिकार', page: '२२', type: 'निर्देशन' }
];

const doc3Anusuchis = [
  { id: 'अनुसूची-१(क)', title: 'अनुसूची-१(क): तथ्याङ्क संकलन कार्यतालिका (दफा ५(१) सँग सम्बन्धित)', page: '३१', printPage: '३०', type: 'अनुसूची' },
  { id: 'अनुसूची-१(ख)', title: 'अनुसूची-१(ख): जनशक्ति परिचालन विवरण (दफा ५(१) सँग सम्बन्धित)', page: '३१', printPage: '३०', type: 'अनुसूची' },
  { id: 'अनुसूची-१(ग)', title: 'अनुसूची-१(ग): समिति तथा शाखा विवरण (दफा ५(१) सँग सम्बन्धित)', page: '३२', printPage: '३१', type: 'अनुसूची' },
  { id: 'अनुसूची-२', title: 'अनुसूची-२: स्थानीय तहको अनौपचारिक तथा अव्यवस्थित भू-सम्बन्धको वस्तुस्थिति र परिवेश आँकलन (दफा ६(१) सँग सम्बन्धित)', page: '३३', printPage: '३२', type: 'अनुसूची' },
  { id: 'अनुसूची-३', title: 'अनुसूची-३: भूमिहीन दलित / भूमिहीन सुकुम्बासीले भर्ने निवेदन फाराम (दफा ७(२) सँग सम्बन्धित)', page: '३७', printPage: '३६', type: 'अनुसूची' },
  { id: 'अनुसूची-४', title: 'अनुसूची-४: अव्यवस्थित बसोबासीले दिने निवेदन फाराम (दफा ७(२) सँग सम्बन्धित)', page: '४३', printPage: '४२', type: 'अनुसूची' },
  { id: 'अनुसूची-५', title: 'अनुसूची-५: ३५ दिने लगत संकलन सूचनाको ढाँचा (दफा ८(१) सँग सम्बन्धित)', page: '५२', printPage: '५१', type: 'अनुसूची' },
  { id: 'अनुसूची-५(क)', title: 'अनुसूची-५(क): लगत संकलन सम्बन्धी सिफारिस पत्रको ढाँचा (दफा ९(४) सँग सम्बन्धित)', page: '५३', printPage: '५२', type: 'अनुसूची' },
  { id: 'अनुसूची-६', title: 'अनुसूची-६: पालिका मार्फत संकलन गर्ने भूमिहीन/अव्यवस्थित विवरण दर्ता किताब (दफा ११(१) सँग सम्बन्धित)', page: '५६', printPage: '५५', type: 'अनुसूची' },
  { id: 'अनुसूची-७', title: 'अनुसूची-७: भूमिहीन दलित / भूमिहीन सुकुम्बासीको हकमा वडा तहमा प्रकाशन हुने ७ दिने सूचनाको ढाँचा (दफा ११(२) र १२(१) सँग सम्बन्धित)', page: '५७', printPage: '५६', type: 'अनुसूची' },
  { id: 'अनुसूची-७(क)', title: 'अनुसूची-७(क): अव्यवस्थित बसोबासीको हकमा वडा तहमा प्रकाशन हुने ७ दिने सूचनाको ढाँचा (दफा ११(२) र १२(१) सँग सम्बन्धित)', page: '५८', printPage: '५७', type: 'अनुसूची' },
  { id: 'अनुसूची-८', title: 'अनुसूची-८: नापनक्सा कार्यका लागि जिल्ला समितिबाट स्थानीय तहमा पठाइने पत्र (दफा १३(४) सँग सम्बन्धित)', page: '५९', printPage: '५८', type: 'अनुसूची' },
  { id: 'अनुसूची-९', title: 'अनुसूची-९: नापनक्सा गर्दाको अवस्थाको फिल्ड मुचुल्का (दफा १५(१)(ट) सँग सम्बन्धित)', page: '६०', printPage: '५९', type: 'अनुसूची' },
  { id: 'अनुसूची-१०', title: 'अनुसूची-१०: कित्ताहरूको विवरण फाराम (दफा १५(१)(ड) सँग सम्बन्धित)', page: '६१', printPage: '६०', type: 'अनुसूची' },
  { id: 'अनुसूची-११', title: 'अनुसूची-११: नियन्त्रण बिन्दु विस्तार तथा नापनक्सा निरीक्षण फाराम (दफा १५(२)(ख) सँग सम्बन्धित)', page: '६२', printPage: '६१', type: 'अनुसूची' },
  { id: 'अनुसूची-१२', title: 'अनुसूची-१२: डिजिटल नक्सा तथा डाटा हस्तान्तरण ढाँचा (दफा १७(४) सँग सम्बन्धित)', page: '६३', printPage: '६२', type: 'अनुसूची' },
  { id: 'अनुसूची-१३', title: 'अनुसूची-१३: नापनक्सा प्रतिवेदन फाराम (दफा १८(१) सँग सम्बन्धित)', page: '६५', printPage: '६४', type: 'अनुसूची' },
  { id: 'अनुसूची-१४', title: 'अनुसूची-१४: जिल्ला समितिले आयोगमा पठाउने मासिक प्रगति विवरण ढाँचा (दफा १८(४) सँग सम्बन्धित)', page: '६६', printPage: '६५', type: 'अनुसूची' },
  { id: 'अनुसूची-१५', title: 'अनुसूची-१५: अनुगमन तथा सुपरिवेक्षण चेकलिस्ट (दफा १९ सँग सम्बन्धित)', page: '६७', printPage: '६६', type: 'अनुसूची' }
];

// 4. भूमिहीन-दलित-सुकुम्बासी-पहिचान र प्रमाणीकरण- मापदण्ड २०८३-३-०२.pdf
const doc4Bundas = [
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '२', type: 'बुँदा' },
  { id: '२.', title: '२. परिभाषा', page: '२', type: 'बुँदा' },
  { id: '३.', title: '३. कार्यविधि', page: '३', type: 'बुँदा' },
  { id: '४.', title: '४. भूमिहीन दलित तथा भूमिहीन सुकुम्बासीको पहिचान र प्रमाणीकरणका आधार र मापदण्ड', page: '४', type: 'बुँदा' },
  { id: '५.', title: '५. अव्यवस्थित बसोबासीको पहिचान र प्रमाणीकरणका आधार र मापदण्ड', page: '५', type: 'बुँदा' },
  { id: '६.', title: '६. परिवार र अंशवण्डा सम्बन्धी व्यवस्था', page: '७', type: 'बुँदा' },
  { id: '७.', title: '७. परिमार्जन र संशोधन', page: '७', type: 'बुँदा' },
  { id: '८.', title: '८. प्रचलित कानून बमोजिम हुने', page: '८', type: 'बुँदा' },
  { id: '९.', title: '९. खारेजी र बचाउ', page: '८', type: 'बुँदा' },
];

const doc4Anusuchis = [
  { id: 'अनुसूची-१', title: 'अनुसूची-१: भूमिहीन दलित तथा भूमिहीन सुकुम्बासी पहिचान तथा प्रमाणीकरण सम्बन्धी विवरण', page: '९', printPage: '८', type: 'अनुसूची' },
  { id: 'अनुसूची-१(क)', title: 'अनुसूची-१(क): भूमिहीन दलित तथा भूमिहीन सुकुम्बासी पहिचान उपर दाबी विरोधको ७ दिने सूचनाको ढाँचा', page: '११', printPage: '१०', type: 'अनुसूची' },
  { id: 'अनुसूची-२', title: 'अनुसूची-२: अव्यवस्थित बसोबासी पहिचान तथा प्रमाणीकरण सम्बन्धी विवरण', page: '१२', printPage: '११', type: 'अनुसूची' },
  { id: 'अनुसूची-३', title: 'अनुसूची-३: अव्यवस्थित बसोबासी पहिचान उपर दाबी विरोधको ७ दिने सूचनाको ढाँचा', page: '१४', printPage: '१३', type: 'अनुसूची' }
];

// 5. विगतका आयोग, समिति र कार्यदलका बाँकी काम सम्पन्न गर्ने सम्बन्धी कार्यविधि २०८३-०३-०२.pdf
const doc5Dafas = [
  { id: '१.', title: '१. संक्षिप्त नाम र प्रारम्भ', page: '२', type: 'दफा' },
  { id: '२.', title: '२. परिभाषा', page: '२', type: 'दफा' },
  { id: '३.', title: '३. बाँकी कामको पहिचान', page: '४', type: 'दफा' },
  { id: '४.', title: '४. सूचना गर्नुपर्ने', page: '५', type: 'दफा' },
  { id: '५.', title: '५. अभिलेख माग गर्ने', page: '६', type: 'दफा' },
  { id: '६.', title: '६. निवेदन उपर छानबिन र निर्णय', page: '६', type: 'दफा' },
  { id: '७.', title: '७. बाँकी कामको निर्णय कार्यान्वयन', page: '१०', type: 'दफा' },
  { id: '८.', title: '८. खारेजी र बचाउ', page: '११', type: 'दफा' },
  { id: '९.', title: '९. बाधा अड्काउ फुकाउने अधिकार', page: '११', type: 'दफा' },
  { id: '१०.', title: '१०. प्रचलित कानून बमोजिम हुने', page: '११', type: 'दफा' },
];

const doc5Anusuchis = [
  { id: 'अनुसूची-१', title: 'अनुसूची-१: जग्गाको स्वामित्व, दर्ता स्रेस्ता, फिल्डबुक प्रमाणित लगायतका विषयमा ३५ (पैंतीस) दिने सूचना (दफा ४(१) सँग सम्बन्धित)', page: '१२', printPage: '११', type: 'अनुसूची' },
  { id: 'अनुसूची-२', title: 'अनुसूची-२: जग्गाधनी दर्ता प्रमाण पूर्जा सम्बन्धी बाँकी काम सम्पन्न गरी पाऊँ भन्ने निवेदन ढाँचा (दफा ४(२) सँग सम्बन्धित)', page: '१३', printPage: '१२', type: 'अनुसूची' }
];

// 6. सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf
const doc6Sections = [
  { id: '१.', title: '१. पृष्ठभूमि', page: '१', type: 'बुँदा' },
  { id: '२.', title: '२. सुकुम्बासी समस्या सिर्जना हुनुका कारक तत्वहरू', page: '४', type: 'बुँदा' },
  { id: '३.', title: '३. समस्या समाधानका लागि गरिएका प्रयासहरू', page: '५', type: 'बुँदा' },
  { id: '४.', title: '४. विभिन्न आयोगका कार्यादेश (अनुसूचीहरू)', page: '३८', type: 'बुँदा' },
];

const doc6Anusuchis = [
  { id: 'अनुसूची-१', title: 'अनुसूची-१: सुकुम्बासी समस्या समाधान आयोग गठन आदेश, २०४८ (मंसिर ९, २०४८)', page: '४७', printPage: '३९', type: 'अनुसूची' },
  { id: 'अनुसूची-२', title: 'अनुसूची-२: सुकुम्बासी समस्या समाधान आयोग गठन आदेश, २०५१ (मंसिर २९, २०५१)', page: '५०', printPage: '४२', type: 'अनुसूची' },
  { id: 'अनुसूची-३', title: 'अनुसूची-३: सुकुम्बासी समस्या समाधान आयोग गठन आदेश, २०५३ (वैशाख २४, २०५३)', page: '५१', printPage: '४३', type: 'अनुसूची' },
  { id: 'अनुसूची-४', title: 'अनुसूची-४: सुकुम्बासी समस्या समाधान आयोग गठन आदेश, २०५४ (वैशाख २६, २०५४)', page: '५९', printPage: '५१', type: 'अनुसूची' },
  { id: 'अनुसूची-५', title: 'अनुसूची-५: सुकुम्बासी समस्या समाधान आयोग गठन आदेश संशोधन, २०५४ (मंसिर ९, २०५४)', page: '६०', printPage: '५२', type: 'अनुसूची' },
  { id: 'अनुसूची-६', title: 'अनुसूची-६: सुकुम्बासी समस्या समाधान आयोग गठन आदेश, २०५५ (असार १, २०५५)', page: '६१', printPage: '५३', type: 'अनुसूची' },
  { id: 'अनुसूची-७', title: 'अनुसूची-७: सुकुम्बासी समस्या समाधान आयोग सम्बन्धी अनुसूची (२०५५/३/१ मा स्वीकृत)', page: '६२', printPage: '५४', type: 'अनुसूची' },
  { id: 'अनुसूची-७(क)', title: 'अनुसूची-७(क): सुकुम्बासी समस्या समाधान आयोग कार्यविधि संशोधन (२०५५/३/२९)', page: '६७', printPage: '५९', type: 'अनुसूची' },
  { id: 'अनुसूची-७(ख)', title: 'अनुसूची-७(ख): सुकुम्बासी समस्या समाधान आयोग कार्यविधि संशोधन (२०५५/४/४)', page: '७४', printPage: '६६', type: 'अनुसूची' },
  { id: 'अनुसूची-७(ग)', title: 'अनुसूची-७(ग): सुकुम्बासी समस्या समाधान आयोग कार्यविधि संशोधन (२०५५/४/११)', page: '७६', printPage: '६८', type: 'अनुसूची' },
  { id: 'अनुसूची-७(घ)', title: 'अनुसूची-७(घ): सुकुम्बासी समस्या समाधान आयोग कार्यविधि संशोधन (२०५५/५/१)', page: '७९', printPage: '७१', type: 'अनुसूची' },
  { id: 'अनुसूची-८', title: 'अनुसूची-८: सुकुम्बासी समस्या समाधान आयोग गठन आदेश, २०५६ (मंसिर १६, २०५६)', page: '८०', printPage: '७२', type: 'अनुसूची' },
  { id: 'अनुसूची-९', title: 'अनुसूची-९: सुकुम्बासी समस्या समाधान आयोगको गठन, काम, कर्तव्य र अधिकार सम्बन्धी कार्यनीति २०५६', page: '८६', printPage: '७८', type: 'अनुसूची' },
  { id: 'अनुसूची-१०', title: 'अनुसूची-१०: सुकुम्बासी समस्या समाधान आयोग गठन आदेश, २०६६ (चैत ४, २०६६)', page: '९५', printPage: '८७', type: 'अनुसूची' },
  { id: 'अनुसूची-११', title: 'अनुसूची-११: सुकुम्बासी समस्या समाधान आयोग, जिल्ला समिति कार्यविधि २०६६', page: '१००', printPage: '९२', type: 'अनुसूची' },
  { id: 'अनुसूची-१२', title: 'अनुसूची-१२: सुकुम्बासी समस्या समाधान आयोग, २०६८ (२०६८।८।२०)', page: '१०५', printPage: '९७', type: 'अनुसूची' },
  { id: 'अनुसूची-१३', title: 'अनुसूची-१३: सुकुम्बासी समस्या समाधान आयोग गठन आदेश, २०७१ (२०७१।४।१९)', page: '११६', printPage: '१०८', type: 'अनुसूची' },
  { id: 'अनुसूची-१४', title: 'अनुसूची-१४: व्यवस्थित बसोबास आयोग गठन आदेश, २०७३ (२०७३।१२।०८)', page: '१३९', printPage: '१३१', type: 'अनुसूची' },
  { id: 'अनुसूची-१५', title: 'अनुसूची-१५: व्यवस्थित बसोबास आयोग (पहिलो संशोधन) आदेश, २०७४ (२०७४।०७।०६)', page: '१५३', printPage: '१४५', type: 'अनुसूची' },
  { id: 'अनुसूची-१६', title: 'अनुसूची-१६: व्यवस्थित बसोबास आयोग आदेश संशोधन, २०७५ (२०७५।०१।११)', page: '१५६', printPage: '१४८', type: 'अनुसूची' },
  { id: 'अनुसूची-१७', title: 'अनुसूची-१७: भूमि सम्बन्धी समस्या समाधान आयोग गठन आदेश, २०७६ (२०७७।०१।०१)', page: '१५७', printPage: '१४९', type: 'अनुसूची' },
  { id: 'अनुसूची-१७(क)', title: 'अनुसूची-१७(क): आयोगका पदाधिकारी पारिश्रमिक तथा सुविधा सम्बन्धी सूचना २ (२०७७।०१।०१)', page: '१७२', printPage: '१६४', type: 'अनुसूची' },
];

function buildRows(pdfName, pdfRelPath, folderId, subfolderId, folderName, subfolderName, sections, anusuchis) {
  const rows = [];
  let sn = 1;

  sections.forEach(item => {
    rows.push({
      folder_id: folderId,
      subfolder_id: subfolderId,
      folder_name: folderName,
      subfolder_name: subfolderName,
      section_id: item.id,
      title_name: item.title,
      title_page: item.page,
      anusuchi_id: '',
      anusuchi_title: '',
      anusuchi_print_page: '',
      pdf_name: pdfName,
      pdf_path: pdfRelPath,
      style_classification: 'bold_and_underline',
      type: item.type || 'दफा',
      order_index: sn++
    });
  });

  anusuchis.forEach(item => {
    rows.push({
      folder_id: folderId,
      subfolder_id: subfolderId,
      folder_name: folderName,
      subfolder_name: subfolderName,
      section_id: '',
      title_name: '',
      title_page: item.page,
      anusuchi_id: item.id,
      anusuchi_title: item.title,
      anusuchi_print_page: item.printPage || item.page,
      pdf_name: pdfName,
      pdf_path: pdfRelPath,
      style_classification: 'bold_only',
      type: 'अनुसूची',
      order_index: sn++
    });
  });

  return rows;
}

// Generate rows for Folder 9
const f9FolderId = '९.';
const f9SubfolderId = '९.१.';
const f9FolderName = '९. भुमि समस्या समाधान समिति';
const f9SubfolderName = '९.१. भुमि आयोग';

const f9Doc1Rows = buildRows(
  'जग्गा उपलब्ध गराउने सम्बन्धि कार्यविधि, २०८३-०३-०२.pdf',
  'pdfs/९. भुमि समस्या समाधान समिति/जग्गा उपलब्ध गराउने सम्बन्धि कार्यविधि, २०८३-०३-०२.pdf',
  f9FolderId, f9SubfolderId, f9FolderName, f9SubfolderName,
  doc1Dafas, doc1Anusuchis
);

const f9Doc2Rows = buildRows(
  'भुमि आयोग गठन आदेश, २०८१-०६-१४.pdf',
  'pdfs/९. भुमि समस्या समाधान समिति/भुमि आयोग गठन आदेश, २०८१-०६-१४.pdf',
  f9FolderId, f9SubfolderId, f9FolderName, f9SubfolderName,
  doc2Dafas, []
);

const f9Doc3Rows = buildRows(
  'भूमिहीन दलित भूमिहीन सुकुम्बासी र अव्यवस्थित बसोबासीको लगत सम्बन्धि निर्देशिका२०८३-०३-०२.pdf',
  'pdfs/९. भुमि समस्या समाधान समिति/भूमिहीन दलित भूमिहीन सुकुम्बासी र अव्यवस्थित बसोबासीको लगत सम्बन्धि निर्देशिका२०८३-०३-०२.pdf',
  f9FolderId, f9SubfolderId, f9FolderName, f9SubfolderName,
  doc3Nirdeshans, doc3Anusuchis
);

const f9Doc4Rows = buildRows(
  'भूमिहीन-दलित-सुकुम्बासी-पहिचान र प्रमाणीकरण- मापदण्ड २०८३-३-०२.pdf',
  'pdfs/९. भुमि समस्या समाधान समिति/भूमिहीन-दलित-सुकुम्बासी-पहिचान र प्रमाणीकरण- मापदण्ड २०८३-३-०२.pdf',
  f9FolderId, f9SubfolderId, f9FolderName, f9SubfolderName,
  doc4Bundas, doc4Anusuchis
);

const f9Doc5Rows = buildRows(
  'विगतका आयोग, समिति र कार्यदलका बाँकी काम सम्पन्न गर्ने सम्बन्धी कार्यविधि २०८३-०३-०२.pdf',
  'pdfs/९. भुमि समस्या समाधान समिति/विगतका आयोग, समिति र कार्यदलका बाँकी काम सम्पन्न गर्ने सम्बन्धी कार्यविधि २०८३-०३-०२.pdf',
  f9FolderId, f9SubfolderId, f9FolderName, f9SubfolderName,
  doc5Dafas, doc5Anusuchis
);

const f9Doc6Rows = buildRows(
  'सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf',
  'pdfs/९. भुमि समस्या समाधान समिति/सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf',
  f9FolderId, f9SubfolderId, f9FolderName, f9SubfolderName,
  doc6Sections, doc6Anusuchis
);

const allFolder9Rows = [
  ...f9Doc1Rows,
  ...f9Doc2Rows,
  ...f9Doc3Rows,
  ...f9Doc4Rows,
  ...f9Doc5Rows,
  ...f9Doc6Rows
];

console.log(`Folder 9 Generated:
- Doc 1 (जग्गा उपलब्ध गराउने कार्यविधि): ${f9Doc1Rows.length} rows (14 dafas + 12 anusuchis)
- Doc 2 (भुमि आयोग गठन आदेश): ${f9Doc2Rows.length} rows (15 dafas)
- Doc 3 (लगत निर्देशिका): ${f9Doc3Rows.length} rows (24 nirdeshans + 19 anusuchis)
- Doc 4 (पहिचान र प्रमाणीकरण मापदण्ड): ${f9Doc4Rows.length} rows (9 bundas + 4 anusuchis)
- Doc 5 (विगतका आयोग कार्यविधि): ${f9Doc5Rows.length} rows (10 dafas + 2 anusuchis)
- Doc 6 (कार्यादेशको संगालो): ${f9Doc6Rows.length} rows (4 bundas + 22 anusuchis)
Total Folder 9 rows: ${allFolder9Rows.length}`);

// Generate Mirror rows for Folder 11 (`११. जोड्नु पर्ने कानुन / ११.१. भुमि आयोग हाल`)
const f11FolderId = '११.';
const f11SubfolderId = '११.१.';
const f11FolderName = '११. जोड्नु पर्ने कानुन';
const f11SubfolderName = '११.१. भुमि आयोग हाल';

const f11Doc1Rows = buildRows(
  'जग्गा उपलब्ध गराउने सम्बन्धि कार्यविधि, २०८३-०३-०२.pdf',
  'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/जग्गा उपलब्ध गराउने सम्बन्धि कार्यविधि, २०८३-०३-०२.pdf',
  f11FolderId, f11SubfolderId, f11FolderName, f11SubfolderName,
  doc1Dafas, doc1Anusuchis
);

const f11Doc2Rows = buildRows(
  'भुमि आयोग गठन आदेश, २०८१-०६-१४.pdf',
  'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/भुमि आयोग गठन आदेश, २०८१-०६-१४.pdf',
  f11FolderId, f11SubfolderId, f11FolderName, f11SubfolderName,
  doc2Dafas, []
);

const f11Doc3Rows = buildRows(
  'भूमिहीन दलित भूमिहीन सुकुम्बासी र अव्यवस्थित बसोबासीको लगत सम्बन्धि निर्देशिका२०८३-०३-०२.pdf',
  'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/भूमिहीन दलित भूमिहीन सुकुम्बासी र अव्यवस्थित बसोबासीको लगत सम्बन्धि निर्देशिका२०८३-०३-०२.pdf',
  f11FolderId, f11SubfolderId, f11FolderName, f11SubfolderName,
  doc3Nirdeshans, doc3Anusuchis
);

const f11Doc4Rows = buildRows(
  'भूमिहीन-दलित-सुकुम्बासी-पहिचान र प्रमाणीकरण- मापदण्ड २०८३-३-०२.pdf',
  'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/भूमिहीन-दलित-सुकुम्बासी-पहिचान र प्रमाणीकरण- मापदण्ड २०८३-३-०२.pdf',
  f11FolderId, f11SubfolderId, f11FolderName, f11SubfolderName,
  doc4Bundas, doc4Anusuchis
);

const f11Doc5Rows = buildRows(
  'विगतका आयोग, समिति र कार्यदलका बाँकी काम सम्पन्न गर्ने सम्बन्धी कार्यविधि २०८३-०३-०२.pdf',
  'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/विगतका आयोग, समिति र कार्यदलका बाँकी काम सम्पन्न गर्ने सम्बन्धी कार्यविधि २०८३-०३-०२.pdf',
  f11FolderId, f11SubfolderId, f11FolderName, f11SubfolderName,
  doc5Dafas, doc5Anusuchis
);

const f11Doc6Rows = buildRows(
  'सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf',
  'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf',
  f11FolderId, f11SubfolderId, f11FolderName, f11SubfolderName,
  doc6Sections, doc6Anusuchis
);

// Mirror for Folder 10 (`१०. कानुनी संगालो / १०.१. भुमि आयोग कानुन संगालो`)
const f10Doc6Rows = buildRows(
  'सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf',
  'pdfs/१०. कानुनी संगालो/१०.१. भुमि आयोग कानुन संगालो/सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf',
  '१०.', '१०.१.', '१०. कानुनी संगालो', '१०.१. भुमि आयोग कानुन संगालो',
  doc6Sections, doc6Anusuchis
);

// Load existing all_rows.json
const allRowsPath = path.resolve(__dirname, '../src/data/all_rows.json');
let existingRows = JSON.parse(fs.readFileSync(allRowsPath, 'utf8'));

// Filter out old Folder 9, and the 6 matching files in Folder 11, and Folder 10.1 doc 6
const f9Names = new Set([
  'जग्गा उपलब्ध गराउने सम्बन्धि कार्यविधि, २०८३-०३-०२.pdf',
  'भुमि आयोग गठन आदेश, २०८१-०६-१४.pdf',
  'भूमिहीन दलित भूमिहीन सुकुम्बासी र अव्यवस्थित बसोबासीको लगत सम्बन्धि निर्देशिका२०८३-०३-०२.pdf',
  'भूमिहीन-दलित-सुकुम्बासी-पहिचान र प्रमाणीकरण- मापदण्ड २०८३-३-०२.pdf',
  'विगतका आयोग, समिति र कार्यदलका बाँकी काम सम्पन्न गर्ने सम्बन्धी कार्यविधि २०८३-०३-०२.pdf',
  'सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf'
]);

let keptRows = existingRows.filter(r => {
  // Remove any old rows from Folder 9
  if (r.folder_id === '९.') return false;
  // Remove these 6 files in Folder 11 so they are replaced with pristine full rows
  if (r.folder_id === '११.' && f9Names.has(r.pdf_name)) return false;
  // Remove doc6 in Folder 10
  if (r.folder_id === '१०.' && r.pdf_name === 'सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf') return false;
  return true;
});

console.log(`Kept ${keptRows.length} rows before merging Folder 9 and mirror rows.`);

const mergedRows = [
  ...keptRows,
  ...allFolder9Rows,
  ...f11Doc1Rows,
  ...f11Doc2Rows,
  ...f11Doc3Rows,
  ...f11Doc4Rows,
  ...f11Doc5Rows,
  ...f11Doc6Rows,
  ...f10Doc6Rows
];

// Sort rows neatly
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

  const secA = devaToNum(a.section_id || a.anusuchi_id);
  const secB = devaToNum(b.section_id || b.anusuchi_id);
  if (secA !== secB) return secA - secB;

  return 0;
});

// Reassign sequential sn
mergedRows.forEach((r, idx) => {
  r.sn = toDeva(idx + 1);
});

fs.writeFileSync(allRowsPath, JSON.stringify(mergedRows, null, 2), 'utf8');
console.log(`Saved updated all_rows.json with ${mergedRows.length} total rows.`);

// Update documents_summary.json
const docsSummaryPath = path.resolve(__dirname, '../src/data/documents_summary.json');
let docs = JSON.parse(fs.readFileSync(docsSummaryPath, 'utf8'));

docs = docs.map(doc => {
  if (doc.filename === 'जग्गा उपलब्ध गराउने सम्बन्धि कार्यविधि, २०८३-०३-०२.pdf') {
    return { ...doc, totalSections: 14, totalSchedules: 12, totalRows: 26 };
  }
  if (doc.filename === 'भुमि आयोग गठन आदेश, २०८१-०६-१४.pdf') {
    return { ...doc, totalSections: 15, totalSchedules: 0, totalRows: 15 };
  }
  if (doc.filename === 'भूमिहीन दलित भूमिहीन सुकुम्बासी र अव्यवस्थित बसोबासीको लगत सम्बन्धि निर्देशिका२०८३-०३-०२.pdf') {
    return { ...doc, totalSections: 24, totalSchedules: 19, totalRows: 43 };
  }
  if (doc.filename === 'भूमिहीन-दलित-सुकुम्बासी-पहिचान र प्रमाणीकरण- मापदण्ड २०८३-३-०२.pdf') {
    return { ...doc, totalSections: 9, totalSchedules: 4, totalRows: 13 };
  }
  if (doc.filename === 'विगतका आयोग, समिति र कार्यदलका बाँकी काम सम्पन्न गर्ने सम्बन्धी कार्यविधि २०८३-०३-०२.pdf') {
    return { ...doc, totalSections: 10, totalSchedules: 2, totalRows: 12 };
  }
  if (doc.filename === 'सुकुम्बासी समस्या समाधान आयोगका कार्यादेशको संगालो, २०७७-०१-०१.pdf') {
    return { ...doc, totalSections: 4, totalSchedules: 22, totalRows: 26 };
  }
  return doc;
});

fs.writeFileSync(docsSummaryPath, JSON.stringify(docs, null, 2), 'utf8');
console.log(`Updated documents_summary.json successfully.`);
