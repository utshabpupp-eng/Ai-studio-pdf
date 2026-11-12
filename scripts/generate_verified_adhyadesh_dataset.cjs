const fs = require('fs');
const path = require('path');

const toDeva = n => (n === null || n === undefined || n === '') ? '' : n.toString().replace(/[0-9]/g, d => '०१२३४५६७८९'[d]);

// =========================================================================
// १. केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०१-२० (१३ पृष्ठ)
// =========================================================================
const someActsOrdinanceRows = [
  {
    id: '१.',
    title: '१. संक्षिप्त नाम र प्रारम्भ',
    page: '१',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '२.',
    title: '२. कर्मचारी सञ्चय कोष ऐन, २०१९ मा संशोधन',
    page: '१',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '३.',
    title: '३. जग्गा (नाप जाँच) ऐन, २०१९ मा संशोधन',
    page: '१',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '३(५क)',
    title: '३. (५क) संवत् २०६६ साल माघ २८ गते अगावैदेखि आवाद कमोतमा रहेको जग्गा यकिन गरी पुनः नक्साङ्कन गर्ने',
    page: '१',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '४.',
    title: '४. भूमि सम्बन्धी ऐन, २०२१ मा संशोधन',
    page: '१',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '४(२)',
    title: '४. (२) दफा १२ को उपदफा (२) संशोधन - हदबन्दी भन्दा बढी जग्गा रोक्का राख्ने तथा धितो बन्धक दिने व्यवस्था',
    page: '१',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '५.',
    title: '५. शिक्षा ऐन, २०२८ मा संशोधन',
    page: '२',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '६.',
    title: '६. मालपोत ऐन, २०३४ मा संशोधन',
    page: '३',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '६(८ख)',
    title: '६. (८ख) लिखत रजिस्ट्रेसन तथा जग्गा प्रशासन सम्बन्धी व्यवस्था',
    page: '३',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '७.',
    title: '७. प्राविधिक शिक्षा तथा व्यावसायिक तालीम परिषद् ऐन, २०४५ मा संशोधन',
    page: '४',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '८.',
    title: '८. नागरिक लगानी कोष ऐन, २०४७ मा संशोधन',
    page: '४',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '९.',
    title: '९. नेपाल विज्ञान तथा प्रविधि प्रज्ञा प्रतिष्ठान ऐन, २०४८ मा संशोधन',
    page: '५',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१०.',
    title: '१०. निजामती सेवा ऐन, २०४९ मा संशोधन',
    page: '५',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '११.',
    title: '११. विश्वविद्यालय अनुदान आयोग ऐन, २०५० मा संशोधन',
    page: '६',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१२.',
    title: '१२. स्वास्थ्य सेवा ऐन, २०५३ मा संशोधन',
    page: '६',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१३.',
    title: '१३. वैदेशिक रोजगार ऐन, २०६४ मा संशोधन',
    page: '६',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१३(५३)',
    title: '१३. (५३) प्रवेशाज्ञा शुल्क, सेवा शुल्क तथा प्रवर्द्धन खर्च बढी लिएमा हुने सजाय',
    page: '७',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '१४.',
    title: '१४. सङ्घीय संसद सचिवालय सम्बन्धी ऐन, २०६४ मा संशोधन',
    page: '७',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१४(७३)',
    title: '१४. (७३) कर्मचारीको गुनासो सुनुवाइको व्यवस्था',
    page: '७',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '१५.',
    title: '१५. योगदानमा आधारित सामाजिक सुरक्षा ऐन, २०७४ मा संशोधन',
    page: '८',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१६.',
    title: '१६. राष्ट्रिय चिकित्सा शिक्षा ऐन, २०७५ मा संशोधन',
    page: '८',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१७.',
    title: '१७. भूउपयोग ऐन, २०७६ मा संशोधन',
    page: '८',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१८.',
    title: '१८. वन ऐन, २०७६ मा संशोधन',
    page: '८',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१८(४२)',
    title: '१८. (४२) वन क्षेत्रको प्रयोग - राष्ट्रिय प्राथमिकता प्राप्त आयोजना, लगानी बोर्डबाट स्वीकृत आयोजनाको लागि राष्ट्रिय वनको प्रयोग',
    page: '१०',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '१८(४२-४)',
    title: '१८. (४२-४) निजी जग्गाको व्यवस्था, वृक्षारोपण तथा पाँच वर्षसम्म रुख हुर्काउने सम्भार रकम',
    page: '११',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '१८(४२-६)',
    title: '१८. (४२-६) विद्युत प्रसारण तथा वितरण र सञ्चार सेवा आयोजना (टावर प्याड र राइट अफ वे) व्यवस्था',
    page: '११',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '१९.',
    title: '१९. बीमा ऐन, २०७९ मा संशोधन',
    page: '१२',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '१९(७२क)',
    title: '१९. (७२क) सार्वजनिक पूर्वाधार निर्माणको बीमा सम्बन्धी व्यवस्था',
    page: '१३',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '२०.',
    title: '२०. विधायन ऐन, २०८१ मा संशोधन',
    page: '१३',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '२०(३५क)',
    title: '२०. (३५क) कार्यकारी आदेश जारी गर्नु अघि कानून मन्त्रालयको सहमति लिनु पर्ने',
    page: '१३',
    style: 'bold_and_underline',
    type: 'संशोधन'
  }
];

// =========================================================================
// २. वन सम्बन्धी केही नेपाल ऐनलाई संशोधन गर्ने अध्यादेश, २०८३-०६-२७ (२८ पृष्ठ)
// =========================================================================
const forestOrdinanceRows = [
  {
    id: '१.',
    title: '१. संक्षिप्त नाम र प्रारम्भ',
    page: '१',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '२.',
    title: '२. वन ऐन, २०७६ मा संशोधन',
    page: '१',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '२(१)',
    title: '२. (१) दफा २ को परिभाषा संशोधन - "कार्यालय" र "डिभिजनल वन अधिकृत" को व्याख्या',
    page: '१',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '२(२)',
    title: '२. (२) दफा ३ संशोधन - राष्ट्रिय वनको स्वामित्व र संरक्षण',
    page: '२',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '२(३)',
    title: '२. (३) दफा १० संशोधन - राष्ट्रिय वनको दिगो व्यवस्थापन र काठ दाउरा सङ्कलन तथा बिक्री वितरण',
    page: '५',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '२(४)',
    title: '२. (४) दफा १३ पछि दफा १३क. थप - जैविक मार्गको व्यवस्थापन (वन क्षेत्रभित्रको जैविक मार्ग घोषणा)',
    page: '८',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '२(५)',
    title: '२. (५) दफा १८ संशोधन - सामुदायिक वनको राष्ट्रिय कोड र कार्ययोजना अद्यावधिक',
    page: '९',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '२(६)',
    title: '२. (६) दफा २६ पछि दफा २६क. थप - पर्यावरण पर्यटन विकासको लागि कबुलियती वन प्रदान गर्न सकिने',
    page: '११',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '२(७)',
    title: '२. (७) दफा २६क को उपदफा (२) - पर्यावरण पर्यटनका पूर्वाधार (कम्तीमा चारतारे होटल, केबुलकार, सफारी रिसोर्ट)',
    page: '१२',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '२(८)',
    title: '२. (८) दफा २६क को उपदफा (४) देखि (१०) - कबुलियती वनको भौतिक पूर्वाधार निर्माण, वार्षिक अनुगमन र खारेजी',
    page: '१३',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '२(९)',
    title: '२. (९) दफा ३० संशोधन - कबुलियती वनको सम्झौता र डिभिजन वन कार्यालयको सिफारिस',
    page: '१६',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '२(१०)',
    title: '२. (१०) दफा ३२ संशोधन - धार्मिक वनको व्यवस्थापन र उपभोक्ता समूह',
    page: '१७',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '२(११)',
    title: '२. (११) दफा ३४ संशोधन - निजी वन दर्ता र अभिलेख',
    page: '१७',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '२(१२)',
    title: '२. (१२) दफा ४२ को सट्टा नयाँ दफा ४२ - वन क्षेत्रको प्रयोग (राष्ट्रिय प्राथमिकता प्राप्त, राष्ट्रिय गौरव र रणनीतिक आयोजना)',
    page: '१८',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '२(१३)',
    title: '२. (१३) दफा ४२ को उपदफा (४) - वन क्षेत्र प्रयोग गरे बराबरको निजी जग्गा व्यवस्था र वृक्षारोपण',
    page: '२०',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '२(१४)',
    title: '२. (१४) दफा ४२ को उपदफा (६) - विद्युत प्रसारण/वितरण, सञ्चार लाइन र खानेपानी आयोजनाको सहुलियत',
    page: '२१',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '२(१५)',
    title: '२. (१५) दफा ४२ को उपदफा (१०) देखि (१२) - कार्बन क्रेडिट तथा वन संरक्षण क्षतिपूर्ति व्यवस्था',
    page: '२४',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '२(१६)',
    title: '२. (१६) दफा ४५ संशोधन - वन विकास कोषमा रकम दाखिला सम्बन्धी व्यवस्था',
    page: '२५',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '२(१७)',
    title: '२. (१७) दफा ६५ संशोधन - वन पैदावार बरामद र सुरक्षित स्थानमा दाखिला',
    page: '२६',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '२(१८)',
    title: '२. (१८) दफा ७१ पछि दफा ७१क. थप - वन पैदावार निकाशी वा पैठारी गर्दा विभागको अनुमति लिनु पर्ने',
    page: '२६',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '२(१९)',
    title: '२. (१९) दफा ७४ पछि दफा ७४क. थप - विकास आयोजनाको वातावरणीय अध्ययन गर्नुअघि वन विभागको पूर्व अनुमति लिनु पर्ने',
    page: '२७',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '२(२०)',
    title: '२. (२०) दफा ७९ पछि दफा ७९क. थप - वन अपराध न्यूनीकरण तथा अनुसन्धानमा सुराकी परिचालन गर्न सक्ने',
    page: '२७',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '३.',
    title: '३. राष्ट्रिय निकुञ्ज तथा वन्यजन्तु संरक्षण ऐन, २०२९ मा संशोधन',
    page: '२७',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '३(७)',
    title: '३. (७) दफा ३ख को उपदफा (७) थप - मध्यवर्ती क्षेत्रभित्रको नदी खोलाबाट ढुङ्गा, गिटी, बालुवा लगायत नदीजन्य पदार्थ सङ्कलन तथा व्यवस्थापन',
    page: '२८',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '३(८)',
    title: '३. (८) दफा ३ख को उपदफा (८) थप - संवत् २०६६ साल माघ २८ गते अगावैदेखि आवाद कमोतमा रहेको मध्यवर्ती क्षेत्रको जग्गा पुनः नक्साङ्कन गरी नेपाल सरकारको नाममा कायम गर्ने',
    page: '२८',
    style: 'bold_and_underline',
    type: 'संशोधन'
  }
];

// =========================================================================
// ३. भूमि सम्बन्धी केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०६-२७ (१४ पृष्ठ)
// =========================================================================
const landOrdinanceRows = [
  {
    id: '१.',
    title: '१. संक्षिप्त नाम र प्रारम्भ',
    page: '१',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '२.',
    title: '२. जग्गा (नाप जाँच) ऐन, २०१९ मा संशोधन',
    page: '१',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '२(५क)',
    title: '२. (५क) दफा ६ मा उपदफा (५क) थप - संवत् २०६६ साल माघ २८ गते अगावैदेखि आवाद कमोतमा रहेको जग्गा यकिन गरी पुनः नक्साङ्कन गर्ने',
    page: '१',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '३.',
    title: '३. भूमि सम्बन्धी ऐन, २०२१ मा संशोधन',
    page: '२',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '३(५२ख)',
    title: '३. (५२ख) दफा ५२ख संशोधन - भूमिहीन दलित, भूमिहीन सुकुम्बासी वा अव्यवस्थित बसोबासीलाई जग्गा उपलब्ध गराउने व्यवस्था',
    page: '३',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '३(५२ख-४)',
    title: '३. (५२ख-४) सार्वजनिक जग्गा, नदी खोला किनार र जोखिमयुक्त क्षेत्र बाहेकका स्थानमा बसोबासीलाई जग्गा उपलब्ध गराउन बाधा नपर्ने',
    page: '४',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '३(५२ग)',
    title: '३. (५२ग) दफा ५२ग संशोधन - जग्गाको स्वामित्व उपलब्ध गराउँदा लाग्ने न्यूनतम मूल्यांकन, दस्तुर निर्धारण र छुट',
    page: '५',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '३(५२ग-२)',
    title: '३. (५२ग-२) कृषि प्रयोजन तथा आवास प्रयोजनको जग्गाको रजिष्ट्रेशन न्यूनतम मूल्यांकन र दस्तुर गणना विधि',
    page: '६',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '३(५२घ)',
    title: '३. (५२घ) दफा ५२घ संशोधन - भूमि समस्या समाधान आयोग, जिल्ला समिति वा कार्यदल गठन सम्बन्धी व्यवस्था',
    page: '७',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '३(५२ङ)',
    title: '३. (५२ङ) विगतमा नेपाल सरकारबाट गठित विभिन्न आयोग वा कार्यदलले वितरण गरेका जग्गाहरूको स्वामित्व वा दर्ता स्रेस्ताको मान्यता',
    page: '८',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '४.',
    title: '४. गुठी संस्थान ऐन, २०३३ मा संशोधन',
    page: '९',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '४(३९ख)',
    title: '४. (३९ख) दफा ३९ पछि दफा ३९ख. थप - जग्गा एकीकरण आयोजनामा गुठी अधीनस्थ जग्गाको योगदान र प्राकृतिक व्यक्ति सरह सुविधा',
    page: '१०',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '५.',
    title: '५. मालपोत ऐन, २०३४ मा संशोधन',
    page: '१०',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '५(ख१)',
    title: '५. (ख१) दफा २ को खण्ड (ख१) संशोधन - "भूमि प्रशासन अधिकृत" को आधिकारिक परिभाषा',
    page: '१०',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '५(८क)',
    title: '५. (८क) दफा ८क को सट्टा नयाँ दफा ८क - दर्ता स्रेस्ता अनुरूप नापी नक्सा अद्यावधिक गर्ने कार्यविधि',
    page: '१०',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '५(८ग)',
    title: '५. (८ग) दफा ८ख पछि दफा ८ग. थप - लिखत रजिष्ट्रेशन, नामसारी, दाखेल खारेज, लगत कट्टा र रोक्का फुकुवा सम्बन्धी काम स्थानीय तहले समेत गर्न सक्ने',
    page: '११',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '५(३२ख)',
    title: '५. (३२ख) दफा ३२ख को सट्टा नयाँ दफा ३२ख - काम कारबाही बदर गर्न सक्ने (महानिर्देशकद्वारा निर्णय बदर तथा पुनरावलोकन)',
    page: '१२',
    style: 'underline_only',
    type: 'संशोधन'
  },
  {
    id: '५(३३क)',
    title: '५. (३३क) दफा ३३ पछि दफा ३३क. थप - मन्त्रालयले आवश्यक निर्देशिका वा कार्यविधि बनाउन सक्ने अधिकार',
    page: '१३',
    style: 'bold_only',
    type: 'संशोधन'
  },
  {
    id: '५(रूपान्तर)',
    title: '५. (रूपान्तर) ऐनका ठाउँ-ठाउँमा रहेका "मालपोत कार्यालय" को सट्टा "भूमि प्रशासन कार्यालय" र "मालपोत अधिकृत" को सट्टा "भूमि प्रशासन अधिकृत" कायम',
    page: '१३',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '६.',
    title: '६. भूउपयोग ऐन, २०७६ मा संशोधन',
    page: '१३',
    style: 'bold_and_underline',
    type: 'दफा'
  },
  {
    id: '६(२क)',
    title: '६. (२क) दफा ८ को उपदफा (२) पछि उपदफा (२क) थप - एक पटकका लागि स्थानीय भूउपयोग परिषद्ले भूउपयोग परिवर्तन गर्न सक्ने',
    page: '१३',
    style: 'bold_and_underline',
    type: 'संशोधन'
  },
  {
    id: '६(३)',
    title: '६. (३) दफा ८ को उपदफा (३) संशोधन - फरक प्रयोजनमा भूउपयोग परिवर्तन गर्दा प्रादेशिक भूउपयोग परिषद् समक्ष अनुरोध सम्बन्धी कार्यविधि',
    page: '१४',
    style: 'underline_only',
    type: 'संशोधन'
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
    anusuchi_id: '',
    anusuchi_title: '',
    anusuchi_print_page: '',
    pdf_name: pdfName,
    pdf_path: pdfPath,
    type: item.type || 'दफा',
    legal_style: item.style || 'bold_and_underline'
  }));
}

// 1. Folder 3 Rows
const f3_1_rows = buildLegalRows(
  '३.',
  '३.१.',
  '३. अध्यादेश',
  '३.१. केहि नेपाल ऐन सम्बन्धि अध्यादेश',
  'केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०१-२०.pdf',
  'pdfs/३. अध्यादेश/३.१. केहि नेपाल ऐन सम्बन्धि अध्यादेश/केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०१-२०.pdf',
  someActsOrdinanceRows
);

const f3_2_rows = buildLegalRows(
  '३.',
  '३.२.',
  '३. अध्यादेश',
  '३.२. वन सम्बन्धि अध्यादेश',
  'वन सम्बन्धी केही नेपाल ऐनलाई संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf',
  'pdfs/३. अध्यादेश/३.२. वन सम्बन्धि अध्यादेश/वन सम्बन्धी केही नेपाल ऐनलाई संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf',
  forestOrdinanceRows
);

const f3_3_rows = buildLegalRows(
  '३.',
  '३.३.',
  '३. अध्यादेश',
  '३.३. भुमि सम्बन्धि अध्यादेश',
  'भूमि सम्बन्धी केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf',
  'pdfs/३. अध्यादेश/३.३. भुमि सम्बन्धि अध्यादेश/भूमि सम्बन्धी केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf',
  landOrdinanceRows
);

const allFolder3Rows = [...f3_1_rows, ...f3_2_rows, ...f3_3_rows];

// 2. Mirror Folder 11.1 (११. जोड्नु पर्ने कानुन / ११.१. भुमि आयोग हाल) Rows
const f11_1_rows = buildLegalRows(
  '११.',
  '११.१.',
  '११. जोड्नु पर्ने कानुन',
  '११.१. भुमि आयोग हाल',
  'केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०१-२०.pdf',
  'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०१-२०.pdf',
  someActsOrdinanceRows
);

const f11_2_rows = buildLegalRows(
  '११.',
  '११.१.',
  '११. जोड्नु पर्ने कानुन',
  '११.१. भुमि आयोग हाल',
  'वन सम्बन्धी केही नेपाल ऐनलाई संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf',
  'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/वन सम्बन्धी केही नेपाल ऐनलाई संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf',
  forestOrdinanceRows
);

const f11_3_rows = buildLegalRows(
  '११.',
  '११.१.',
  '११. जोड्नु पर्ने कानुन',
  '११.१. भुमि आयोग हाल',
  'भूमि सम्बन्धी केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf',
  'pdfs/११. जोड्नु पर्ने कानुन/११.१. भुमि आयोग हाल/भूमि सम्बन्धी केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf',
  landOrdinanceRows
);

const allFolder11MirrorRows = [...f11_1_rows, ...f11_2_rows, ...f11_3_rows];

console.log(`Generated Folder 3 rows: ${allFolder3Rows.length}`);
console.log(`Generated Folder 11 mirror rows: ${allFolder11MirrorRows.length}`);

// Load existing all_rows.json
const allRowsPath = path.resolve(__dirname, '../src/data/all_rows.json');
let existingRows = JSON.parse(fs.readFileSync(allRowsPath, 'utf8'));

// Filter out old Folder 3 rows and old Folder 11.1 rows for these 3 pdfs
const cleanedRows = existingRows.filter(r => {
  if (r.folder_id === '३.' || r.folder_name === '३. अध्यादेश') return false;
  if (r.folder_id === '११.' && (
    r.pdf_name === 'केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०१-२०.pdf' ||
    r.pdf_name === 'वन सम्बन्धी केही नेपाल ऐनलाई संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf' ||
    r.pdf_name === 'भूमि सम्बन्धी केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf'
  )) return false;
  return true;
});

const mergedRows = [...cleanedRows, ...allFolder3Rows, ...allFolder11MirrorRows];
fs.writeFileSync(allRowsPath, JSON.stringify(mergedRows, null, 2), 'utf8');
console.log(`Successfully updated all_rows.json! New total rows: ${mergedRows.length}`);

// Update documents_summary.json with precise section/schedule counts
const docsSummaryPath = path.resolve(__dirname, '../src/data/documents_summary.json');
let docs = JSON.parse(fs.readFileSync(docsSummaryPath, 'utf8'));

docs = docs.map(doc => {
  if (doc.filename === 'केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०१-२०.pdf') {
    return {
      ...doc,
      totalSections: someActsOrdinanceRows.length,
      totalSchedules: 0,
      totalRows: someActsOrdinanceRows.length
    };
  }
  if (doc.filename === 'वन सम्बन्धी केही नेपाल ऐनलाई संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf') {
    return {
      ...doc,
      totalSections: forestOrdinanceRows.length,
      totalSchedules: 0,
      totalRows: forestOrdinanceRows.length
    };
  }
  if (doc.filename === 'भूमि सम्बन्धी केही नेपाल ऐन संशोधन गर्ने अध्यादेश, २०८३-०६-२७.pdf') {
    return {
      ...doc,
      totalSections: landOrdinanceRows.length,
      totalSchedules: 0,
      totalRows: landOrdinanceRows.length
    };
  }
  return doc;
});

fs.writeFileSync(docsSummaryPath, JSON.stringify(docs, null, 2), 'utf8');
console.log('Successfully updated documents_summary.json!');
