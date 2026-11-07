// Blog content for ndotoni.com (Swahili-first). Inline text supports **bold** and [link text](/href).
// Keep claims practical and checkable: no invented market prices, rankings or legal guarantees.

export type Block =
  | { p: string }
  | { list: string[]; ordered?: boolean }
  | { checklist: string[] }
  | { tip: string; title?: string }
  | { warn: string; title?: string }
  | { table: { head: string[]; rows: string[][]; caption?: string } };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  updated?: string;
  /** Index into ./photography; posts without a photo get a typographic cover. */
  photo?: number;
  intro: string;
  takeaways: string[];
  sections: { title: string; blocks: Block[] }[];
  faqs: { q: string; a: string }[];
  cta: { label: string; href: string };
}

const DAR = '/search?region=Dar%20es%20Salaam';

export const blogPosts: BlogPost[] = [
  {
    slug: 'gharama-za-kupanga-nyumba',
    title: 'Gharama za kupanga nyumba: panga bajeti kabla ya kuhamia',
    description: 'Hesabu jumla ya fedha unazohitaji siku ya kwanza — kodi ya awali, amana, ada, huduma na usafiri — kabla ya kuchagua nyumba.',
    category: 'Bajeti',
    date: '2026-11-07',
    photo: 1,
    intro: 'Kodi ya mwezi ni namba moja tu. Kinachoamua kama unaweza kuhamia ni jumla ya fedha unazohitaji siku ya kwanza, pamoja na gharama zitakazojirudia kila mwezi. Mwongozo huu unakusaidia kuhesabu zote mbili kabla ya kujifunga.',
    takeaways: [
      'Linganisha nyumba kwa “fedha ya kuanzia” — si kodi ya mwezi pekee.',
      'Uliza kodi inalipwa miezi mingapi mapema, na kama kuna amana au ada nyingine.',
      'Ongeza huduma (maji, umeme, ulinzi, taka) na usafiri wa kila siku kwenye hesabu ya mwezi.',
      'Kila malipo yaandikwe kwenye makubaliano na upate risiti.',
    ],
    sections: [
      {
        title: 'Hesabu fedha ya kuanzia, si kodi ya mwezi',
        blocks: [
          { p: 'Wamiliki wengi huomba kodi ya miezi kadhaa mapema. Idadi ya miezi inatofautiana kwa kila nyumba, kwa hiyo iulize mapema kabisa — kabla ya kupenda nyumba. Kisha uliza kama kuna **amana** (deposit) na masharti ya kuirejesha.' },
          { p: 'Tumia mfano huu kama kiolezo. Badilisha namba kwa kile mwenye nyumba au wakala amekuambia:' },
          { table: {
            caption: 'Mfano wa hesabu tu — si bei halisi ya soko.',
            head: ['Gharama', 'Mfano', 'Uliza nini'],
            rows: [
              ['Kodi ya mwezi', 'TZS 400,000', 'Kodi kamili ni kiasi gani na inaweza kupanda lini?'],
              ['Kodi ya awali (miezi 6)', 'TZS 2,400,000', 'Lazima kulipa miezi mingapi mapema?'],
              ['Amana', 'TZS 400,000', 'Inarejeshwa lini na kwa masharti gani?'],
              ['Ada ya dalali/wakala', 'Kubalianeni kwanza', 'Ada ni kiasi gani na inalipia huduma gani?'],
              ['Usafiri wa mizigo', 'TZS 150,000', 'Ukubwa wa gari na idadi ya safari'],
              ['Akiba ya dharura', 'TZS 200,000', 'Matengenezo madogo, vifaa vya kuanzia'],
              ['**Jumla ya kuanzia**', '**TZS 3,150,000 + ada**', ''],
            ],
          } },
          { tip: 'Ukiweza kulinganisha nyumba mbili kwa jumla hii, mara nyingi utagundua kuwa nyumba yenye kodi ndogo kidogo lakini miezi mingi ya awali inahitaji fedha zaidi siku ya kwanza.', title: 'Kidokezo' },
        ],
      },
      {
        title: 'Ongeza gharama zinazojirudia kila mwezi',
        blocks: [
          { p: 'Baada ya kuhamia, kodi inaungana na bili nyingine. Uliza kila moja kwa jina:' },
          { checklist: [
            '**Umeme:** kuna mita ya LUKU yako binafsi, au mnagawana mita moja?',
            '**Maji:** bili inakuja kwa nani, na maji yanapatikana siku ngapi kwa wiki? Kuna tanki la akiba?',
            '**Ulinzi, usafi na taka:** kuna michango ya kila mwezi?',
            '**Intaneti:** kuna mtandao unaofika ndani ya nyumba, au utahitaji kifurushi cha simu?',
            '**Usafiri:** safari ya kwenda kazini au shuleni na kurudi itagharimu kiasi gani kwa mwezi?',
          ] },
          { p: 'Nyumba ya bei nafuu iliyo mbali inaweza kukugharimu zaidi ukijumlisha nauli au mafuta ya mwezi mzima. Hesabu safari zako halisi, si umbali kwenye ramani pekee.' },
        ],
      },
      {
        title: 'Kanuni rahisi ya bajeti',
        blocks: [
          { p: 'Hakuna namba moja inayomfaa kila mtu, lakini watu wengi hujitahidi kodi na huduma zisizidi takriban theluthi moja ya mapato ya mwezi. Ukizidi hapo, bajeti ya chakula, usafiri na akiba huanza kubanwa.' },
          { list: [
            'Andika mapato yako halisi ya mwezi baada ya makato.',
            'Toa gharama zisizobadilika: chakula, usafiri, ada za shule, mikopo.',
            'Kinachobaki ndicho kikomo cha kodi na huduma — weka nafasi kidogo kwa dharura.',
          ], ordered: true },
        ],
      },
      {
        title: 'Linda fedha zako',
        blocks: [
          { warn: 'Usilipe chochote kabla ya kuona nyumba ana kwa ana na kuthibitisha kuwa anayekupangisha ana mamlaka ya kufanya hivyo. Soma [jinsi ya kuepuka matapeli wa nyumba](/blog/kuepuka-matapeli-wa-nyumba).', title: 'Kabla ya kulipa' },
          { p: 'Lipa kwa njia inayoacha kumbukumbu (benki au pesa za simu kwa jina linalolingana na makubaliano), pata risiti kwa kila malipo, na hakikisha makubaliano yanaonyesha kiasi, kipindi na masharti ya amana. Angalia pia [vipengele vya mkataba wa kupanga](/blog/mkataba-wa-kupanga-nyumba).' },
        ],
      },
    ],
    faqs: [
      { q: 'Kwa nini wamiliki huomba kodi ya miezi mingi mapema?', a: 'Ni desturi ya kawaida katika miji mingi ya Tanzania, lakini idadi ya miezi inajadilika kwa baadhi ya wamiliki. Uliza mapema na linganisha nyumba kwa jumla ya fedha ya kuanzia.' },
      { q: 'Amana inatofautianaje na kodi ya awali?', a: 'Kodi ya awali ni malipo ya miezi utakayoishi. Amana ni fedha ya dhamana ambayo kwa kawaida hurejeshwa mwishoni ikiwa masharti yametimizwa. Hakikisha tofauti hiyo imeandikwa.' },
    ],
    cta: { label: 'Linganisha nyumba Dar es Salaam', href: DAR },
  },
  {
    slug: 'maswali-kabla-ya-kupanga-nyumba',
    title: 'Maswali 20 ya kuuliza kabla ya kupanga nyumba',
    description: 'Orodha ya kubeba unapotembelea nyumba: malipo, maji, umeme, matengenezo, usalama na masharti ya kuishi.',
    category: 'Vidokezo',
    date: '2026-11-07',
    intro: 'Matatizo mengi ya wapangaji huanza na swali ambalo halikuulizwa. Hifadhi orodha hii kwenye simu yako na uitumie kila unapotembelea nyumba — majibu yake ndiyo yatakusaidia kulinganisha.',
    takeaways: [
      'Uliza kuhusu fedha kwanza: kodi, miezi ya awali, amana na risiti.',
      'Jaribu maji, umeme, milango na madirisha mwenyewe wakati wa kutembelea.',
      'Elewa nani anatengeneza nini, na kwa muda gani.',
      'Jambo lolote muhimu liandikwe kwenye makubaliano.',
    ],
    sections: [
      {
        title: 'Malipo na makubaliano',
        blocks: [
          { checklist: [
            'Kodi kamili ni kiasi gani, na inalipwa kwa sarafu gani?',
            'Ni miezi mingapi inalipwa mapema?',
            'Kuna amana? Inarejeshwa lini na kwa masharti gani?',
            'Kuna ada ya wakala au dalali? Ni kiasi gani na inalipwa kwa nani?',
            'Kodi inaweza kupanda lini, na nitapewa taarifa ya muda gani?',
            'Nitapata mkataba wa maandishi na risiti kwa kila malipo?',
          ] },
        ],
      },
      {
        title: 'Maji, umeme na huduma',
        blocks: [
          { checklist: [
            'Maji yanapatikana siku ngapi kwa wiki? Kuna tanki la akiba?',
            'Mita ya umeme (LUKU) ni ya nyumba hii pekee au inagawanywa?',
            'Bili ya maji inakuja kwa nani na inagawanywaje?',
            'Kuna michango ya ulinzi, usafi au taka?',
          ] },
          { tip: 'Fungua bomba, washa taa na jaribu soketi wakati wa kutembelea. Uliza majirani kuhusu maji — wanaishi na hali halisi kila siku.', title: 'Jaribu mwenyewe' },
        ],
      },
      {
        title: 'Matengenezo na hali ya nyumba',
        blocks: [
          { checklist: [
            'Nani analipia matengenezo makubwa na madogo?',
            'Nikipata tatizo (bomba linavuja, umeme umekatika), nimpigie nani?',
            'Kasoro zilizopo sasa zitarekebishwa kabla ya kuhamia?',
            'Naweza kupaka rangi, kuweka pazia au kubadilisha kufuli?',
          ] },
          { p: 'Piga picha za kasoro zilizopo (madoa, nyufa, vitasa vibovu) na mtumie mwenye nyumba kabla ya kuhamia. Itakusaidia wakati wa kurejeshewa amana. Tumia [orodha ya siku ya kuhamia](/blog/orodha-ya-kuhamia-nyumba-mpya).' },
        ],
      },
      {
        title: 'Maisha ya kila siku',
        blocks: [
          { checklist: [
            'Kuna sheria kuhusu wageni, wanyama au biashara ya nyumbani?',
            'Kuna maegesho? Ni ya kudumu au ya kugombania?',
            'Safari ya kwenda kazini/shuleni inachukua muda gani saa za asubuhi?',
            'Geti linafungwa saa ngapi, na nani ana funguo?',
            'Ninaweza kuondoka kabla ya mkataba kuisha? Kwa masharti gani?',
            'Nani hasa ni mmiliki, na nitathibitishaje?',
          ] },
        ],
      },
    ],
    faqs: [
      { q: 'Nitembelee nyumba saa ngapi?', a: 'Ikiwezekana, tembelea mara mbili: mchana kuona hali ya nyumba, na jioni au asubuhi kuona kelele, mwanga wa njia na foleni ya usafiri.' },
      { q: 'Je, naweza kuuliza maswali haya kupitia WhatsApp kabla ya kutembelea?', a: 'Ndiyo. Kuuliza mapema maswali ya fedha na huduma kunakuokolea safari za kwenda kuona nyumba zisizokufaa.' },
    ],
    cta: { label: 'Tafuta nyumba za kutembelea', href: DAR },
  },
  {
    slug: 'nyumba-karibu-na-udsm',
    title: 'Nyumba karibu na UDSM: mwongozo kwa wanafunzi',
    description: 'Chagua makazi kwa kuangalia safari ya kwenda chuoni, bajeti ya pamoja, mazingira ya kusoma na makubaliano na wenzako.',
    category: 'Wanafunzi',
    date: '2026-11-07',
    photo: 2,
    intro: 'Ukiishi karibu na chuo unaokoa muda na nauli, lakini “karibu” inamaanisha mambo tofauti kwa kila mwanafunzi. Anza na ratiba yako halisi, kisha linganisha nyumba kwa gharama ya jumla na mazingira ya kusoma.',
    takeaways: [
      'Pima umbali kwa muda wa safari saa za asubuhi, si kwa jina la eneo.',
      'Jumlisha kodi, huduma na nauli kabla ya kulinganisha.',
      'Mnapopanga pamoja, andikeni jinsi kodi, bili na amana zitakavyogawanywa.',
      'Tembelea jioni uone mwanga wa njia na kelele.',
    ],
    sections: [
      {
        title: 'Anza na sehemu unayosomea',
        blocks: [
          { p: 'UDSM ina kampasi na malango kadhaa. Tambua jengo au kitivo unachotumia zaidi, na saa unazohitaji kufika. Maeneo yanayotajwa mara nyingi na wanafunzi ni pamoja na Ubungo, Sinza, Mabibo, Survey, Makongo na Mwenge — lakini kila nyumba ndani ya eneo hilo ina umbali wake.' },
          { tip: 'Fanya safari ya majaribio saa 1 asubuhi kutoka nyumba unayoifikiria hadi darasani. Utajua haraka kama ni “karibu” kweli.', title: 'Jaribu safari' },
        ],
      },
      {
        title: 'Linganisha gharama ya jumla',
        blocks: [
          { table: {
            head: ['Kipengele', 'Nyumba A', 'Nyumba B'],
            rows: [
              ['Kodi ya mwezi (fungu lako)', '', ''],
              ['Huduma (maji, umeme, taka)', '', ''],
              ['Nauli au mafuta kwa mwezi', '', ''],
              ['Muda wa safari kwa siku', '', ''],
              ['Fedha ya kuanzia (kodi ya awali + amana)', '', ''],
            ],
            caption: 'Jaza jedwali hili kwa kila nyumba unayoitembelea.',
          } },
          { p: 'Mara nyingi nyumba yenye kodi ya juu kidogo lakini unaweza kutembea hadi darasani inakuwa nafuu kuliko inayohitaji usafiri kila siku. Soma pia [gharama za kupanga nyumba](/blog/gharama-za-kupanga-nyumba).' },
        ],
      },
      {
        title: 'Kupanga na wenzako',
        blocks: [
          { p: 'Kugawana nyumba hupunguza kodi, lakini huleta maswali mapya. Kubalianeni na andikeni kabla ya kulipa:' },
          { checklist: [
            'Kila mmoja analipa kiasi gani cha kodi, amana na bili?',
            'Jina la nani litakuwa kwenye mkataba?',
            'Mmoja akiondoka katikati ya muhula, nini kitatokea kwa fungu lake?',
            'Sheria za wageni, usafi na kelele wakati wa mitihani.',
          ] },
        ],
      },
      {
        title: 'Mazingira ya kusoma na usalama',
        blocks: [
          { checklist: [
            'Kuna meza, mwanga wa kutosha na soketi za kuchaji?',
            'Mtandao wa simu unafika vizuri ndani ya chumba?',
            'Njia ya kurudi usiku ina mwanga na watu?',
            'Milango na madirisha vina kufuli imara?',
          ] },
          { p: 'Usitegemee sifa za jumla za eneo kuhusu usalama. Angalia nyumba yenyewe na njia unayotumia, na uliza wapangaji waliopo.' },
        ],
      },
    ],
    faqs: [
      { q: 'Nianze kutafuta lini?', a: 'Anza wiki kadhaa kabla ya muhula kuanza. Karibu na mwanzo wa mwaka wa masomo, nyumba nyingi za karibu na chuo huchukuliwa haraka.' },
      { q: 'Naweza kutafuta nyumba za Ubungo kwenye Ndotoni?', a: 'Ndiyo. Fungua utafutaji wa Ubungo, kisha wasiliana na mwenye nyumba kuthibitisha bei, upatikanaji na mahali halisi.' },
    ],
    cta: { label: 'Angalia nyumba za Ubungo', href: `${DAR}&district=Ubungo` },
  },
  {
    slug: 'nyumba-za-kupanga-dar-es-salaam-2026',
    title: 'Maeneo ya kupanga nyumba Dar es Salaam: mwongozo wa 2026',
    description: 'Linganisha wilaya na mitaa ya Dar es Salaam kwa safari, aina ya makazi na mtindo wa maisha — kisha angalia nyumba zinazopatikana sasa.',
    category: 'Maeneo',
    date: '2026-05-25',
    updated: '2026-11-07',
    photo: 0,
    intro: 'Dar es Salaam ni jiji kubwa lenye maisha tofauti kati ya mtaa na mtaa. Badala ya kuuliza “eneo gani ni bora?”, uliza “eneo gani linafaa ratiba yangu, bajeti yangu na familia yangu?”. Mwongozo huu unaeleza tabia ya maeneo makuu na jinsi ya kuyalinganisha.',
    takeaways: [
      'Chagua eneo kwa safari yako ya kila siku kwanza, kisha bajeti.',
      'Bei hubadilika kwa nyumba, si kwa jina la mtaa pekee — angalia matangazo ya sasa.',
      'Pwani na peninsula huwa na kodi za juu; maeneo ya pembezoni hutoa nafasi zaidi kwa bei ya chini, lakini safari ndefu.',
      'Tembelea saa za asubuhi na jioni kabla ya kuamua.',
    ],
    sections: [
      {
        title: 'Jinsi ya kutumia mwongozo huu',
        blocks: [
          { p: 'Maelezo hapa chini ni ya jumla, yanayolenga kukusaidia kuchagua maeneo ya kutembelea. Hayabadilishi ukaguzi wako mwenyewe. Kwa bei halisi, fungua utafutaji wa kila wilaya — unaonyesha nyumba zinazopatikana sasa.' },
        ],
      },
      {
        title: 'Kinondoni: pwani, familia na huduma nyingi',
        blocks: [
          { p: 'Kinondoni inajumuisha maeneo mengi yanayotafutwa sana: **Masaki** na **Oyster Bay** kwenye peninsula, **Mikocheni** na **Kawe**, na upande wa kaskazini **Mbezi Beach**, **Tegeta**, **Madale** na **Bunju**.' },
          { list: [
            '**Peninsula (Masaki, Oyster Bay):** karibu na ofisi, balozi na migahawa; kodi kwa kawaida ni za juu.',
            '**Mikocheni, Kawe, Mwenge:** katikati ya jiji na kaskazini; mchanganyiko wa nyumba na apartments.',
            '**Mbezi Beach, Tegeta, Madale, Bunju:** nyumba zenye viwanja na nafasi zaidi; safari ya kwenda mjini inaweza kuwa ndefu saa za foleni.',
          ] },
          { p: '[Angalia nyumba za Kinondoni →](/search?region=Dar%20es%20Salaam&district=Kinondoni)' },
        ],
      },
      {
        title: 'Ubungo: wanafunzi, barabara ya Morogoro na bei mbalimbali',
        blocks: [
          { p: 'Ubungo inajumuisha maeneo kama **Ubungo**, **Sinza**, **Mabibo**, **Kimara** na **Mbezi (Louis)**. Ni karibu na Chuo Kikuu cha Dar es Salaam na kando ya barabara ya Morogoro, ambayo ina njia ya mabasi ya mwendo kasi (BRT).' },
          { list: [
            'Inafaa wanafunzi na wanaofanya kazi katikati ya jiji wanaotaka bei za wastani.',
            'Kimara na Mbezi hutoa nyumba nyingi zaidi kwa ukubwa, mbali kidogo na mjini.',
          ] },
          { p: '[Angalia nyumba za Ubungo →](/search?region=Dar%20es%20Salaam&district=Ubungo) · [Mwongozo wa wanafunzi wa UDSM](/blog/nyumba-karibu-na-udsm)' },
        ],
      },
      {
        title: 'Ilala: katikati ya jiji na biashara',
        blocks: [
          { p: 'Ilala ina katikati ya jiji (City Centre, Kariakoo, Upanga) pamoja na maeneo ya makazi upande wa magharibi kama Kinyerezi na Ukonga. Inafaa wanaofanya kazi mjini au karibu na uwanja wa ndege.' },
          { p: '[Angalia nyumba za Ilala →](/search?region=Dar%20es%20Salaam&district=Ilala)' },
        ],
      },
      {
        title: 'Kigamboni na Temeke: nafasi zaidi, safari ya kuzingatia',
        blocks: [
          { p: '**Kigamboni** iko ng’ambo ya bandari, inafikika kwa daraja la Nyerere au kivuko. Ina mazingira tulivu na fukwe, lakini hesabu safari yako ya kila siku vizuri. **Temeke** (ikiwemo Mbagala na Kurasini) ina makazi mengi ya bei mbalimbali karibu na bandari na barabara ya Kilwa.' },
          { p: '[Angalia nyumba za Kigamboni →](/search?region=Dar%20es%20Salaam&district=Kigamboni)' },
        ],
      },
      {
        title: 'Linganisha maeneo kwa vigezo vyako',
        blocks: [
          { table: {
            head: ['Unachohitaji zaidi', 'Anza kuangalia'],
            rows: [
              ['Karibu na ofisi za mjini', 'Ilala, Upanga, peninsula ya Kinondoni'],
              ['Karibu na UDSM', 'Ubungo, Sinza, Mabibo, Mwenge'],
              ['Nafasi na kiwanja kwa familia', 'Mbezi Beach, Tegeta, Madale, Kimara, Kigamboni'],
              ['Usafiri wa BRT', 'Maeneo kando ya barabara ya Morogoro'],
              ['Bajeti ndogo zaidi', 'Linganisha matangazo ya Ubungo, Ilala na Temeke'],
            ],
          } },
          { tip: 'Kabla ya kuamua, tembelea eneo saa 12 asubuhi na saa 12 jioni. Foleni, kelele na mwanga wa njia hubadilika sana kati ya mchana na nyakati hizo.', title: 'Jaribu saa za foleni' },
        ],
      },
    ],
    faqs: [
      { q: 'Eneo gani lina nyumba za bei nafuu zaidi Dar es Salaam?', a: 'Bei hutegemea nyumba yenyewe, ukubwa na huduma, si eneo pekee. Tumia utafutaji wa Ndotoni kwa kila wilaya na weka kiwango cha juu cha bei ili kulinganisha nyumba zinazopatikana sasa.' },
      { q: 'Je, maeneo haya yote yana nyumba kwenye Ndotoni?', a: 'Upatikanaji hubadilika kila siku. Fungua utafutaji wa wilaya husika kuona matangazo ya sasa, kisha thibitisha na mwenye nyumba.' },
    ],
    cta: { label: 'Tafuta nyumba Dar es Salaam', href: DAR },
  },
  {
    slug: 'jinsi-ya-kupata-nyumba-bei-nafuu',
    title: 'Jinsi ya kupata nyumba ya bei nafuu Tanzania: hatua 6',
    description: 'Weka bajeti halisi, tafuta kwa busara, jadiliana kwa heshima na linda fedha zako unapotafuta nyumba ya bei nafuu.',
    category: 'Bajeti',
    date: '2026-05-20',
    updated: '2026-11-07',
    intro: 'Nyumba ya bei nafuu si ile yenye kodi ndogo zaidi kwenye tangazo — ni ile inayokupa unachohitaji kwa gharama ya jumla unayoimudu. Hatua hizi sita zitakusaidia kuipata bila kupoteza muda wala fedha.',
    takeaways: [
      'Jua kikomo chako cha fedha ya kuanzia na cha kila mwezi.',
      'Panua eneo la utafutaji kwa kufuata njia za usafiri, si majina maarufu.',
      'Linganisha nyumba tatu au zaidi kabla ya kuamua.',
      'Usilipe kabla ya kuona nyumba na kuthibitisha mwenye mamlaka.',
    ],
    sections: [
      {
        title: '1. Weka bajeti ya kweli',
        blocks: [
          { p: 'Hesabu viwango viwili: **fedha ya kuanzia** (kodi ya awali, amana, ada, kuhamia) na **gharama ya mwezi** (kodi, huduma, usafiri). Mwongozo wa [gharama za kupanga nyumba](/blog/gharama-za-kupanga-nyumba) una jedwali la kukusaidia.' },
        ],
      },
      {
        title: '2. Tafuta kwa njia ya usafiri, si jina la mtaa',
        blocks: [
          { p: 'Mitaa maarufu mara nyingi ina kodi za juu. Ukifuata barabara kuu au njia ya daladala/BRT unayotumia, unaweza kupata nyumba nafuu zaidi zenye safari inayokubalika. Linganisha [maeneo ya Dar es Salaam](/blog/nyumba-za-kupanga-dar-es-salaam-2026).' },
        ],
      },
      {
        title: '3. Kuwa wazi kuhusu unachohitaji kweli',
        blocks: [
          { p: 'Tenganisha “lazima” na “ingependeza”. Kwa mfano: maji ya uhakika na usalama wa mlango ni lazima; jiko la kisasa linaweza kusubiri. Orodha hii fupi itakusaidia kukubali nyumba nzuri ambayo si kamilifu.' },
          { checklist: [
            'Idadi ya vyumba unavyohitaji kweli',
            'Maji na umeme wa kuaminika',
            'Muda wa juu wa safari unaokubalika',
            'Usalama wa mlango, madirisha na njia',
          ] },
        ],
      },
      {
        title: '4. Linganisha angalau nyumba tatu',
        blocks: [
          { p: 'Tumia orodha ya [maswali 20 ya kuuliza](/blog/maswali-kabla-ya-kupanga-nyumba) kwa kila nyumba. Kulinganisha kunakupa picha ya bei za sasa na kukusaidia kutambua ofa nzuri au ya kutia shaka.' },
        ],
      },
      {
        title: '5. Jadiliana kwa heshima',
        blocks: [
          { p: 'Baadhi ya wamiliki wanaweza kukubali mabadiliko madogo — idadi ya miezi ya awali, tarehe ya kuanza, au matengenezo kabla ya kuhamia. Eleza unachoweza kumudu kwa uwazi. Makubaliano yoyote mapya yaandikwe.' },
        ],
      },
      {
        title: '6. Linda fedha zako',
        blocks: [
          { warn: 'Bei iliyo chini sana ukilinganisha na nyumba zinazofanana, haraka ya kulipa, au kukataa uone nyumba — ni dalili za hatari. Soma [jinsi ya kuepuka matapeli wa nyumba](/blog/kuepuka-matapeli-wa-nyumba).', title: 'Dalili za hatari' },
          { p: 'Pata risiti kwa kila malipo na mkataba unaoonyesha kiasi, kipindi na masharti.' },
        ],
      },
    ],
    faqs: [
      { q: 'Ni wakati gani mzuri wa kutafuta nyumba?', a: 'Anza wiki 4 hadi 8 kabla ya kuhitaji kuhamia. Unapata muda wa kulinganisha bila kulazimika kukubali nyumba ya kwanza.' },
      { q: 'Ndotoni inanisaidiaje?', a: 'Unaweza kulinganisha nyumba kwa eneo, bei na aina, kuona picha, na kuwasiliana nasi kupitia WhatsApp kuhusu upatikanaji na kupanga kutembelea.' },
    ],
    cta: { label: 'Tafuta nyumba kwa bajeti yako', href: '/search' },
  },
  {
    slug: 'maeneo-salama-kuishi-dar-es-salaam',
    title: 'Usalama wa makazi Dar es Salaam: jinsi ya kuchagua nyumba kwa familia',
    description: 'Jinsi ya kutathmini usalama wa nyumba, njia na mazingira kwa familia — badala ya kutegemea sifa za jumla za eneo.',
    category: 'Familia',
    date: '2026-05-15',
    updated: '2026-11-07',
    intro: 'Hakuna orodha inayoweza kuhakikisha usalama wa eneo zima. Usalama wa familia yako unategemea nyumba yenyewe, njia mnazotumia na jinsi jirani inavyoishi. Mwongozo huu unakuonyesha unachoweza kukagua mwenyewe.',
    takeaways: [
      'Kagua nyumba yenyewe: mlango, madirisha, uzio, geti na mwanga.',
      'Tembea njia mtakazotumia kila siku, hasa saa za jioni.',
      'Uliza wapangaji waliopo na majirani kuhusu uzoefu wao.',
      'Kwa watoto: angalia ngazi, balcony, maji ya wazi na barabara.',
    ],
    sections: [
      {
        title: 'Anza na nyumba yenyewe',
        blocks: [
          { checklist: [
            'Milango ya nje ni imara na ina kufuli nzuri? Funguo zitabadilishwa?',
            'Madirisha ya chini yana grili?',
            'Kuna uzio na geti linalofungwa? Nani ana funguo?',
            'Kuna mlinzi au utaratibu wa kuingia kwa wageni?',
            'Taa za nje zinafanya kazi usiku?',
          ] },
        ],
      },
      {
        title: 'Kagua njia na mazingira',
        blocks: [
          { p: 'Tembea kutoka kituo cha usafiri hadi nyumbani saa ambazo familia itakuwa ikirudi. Angalia mwanga wa njia, watu wanaopita na sehemu zenye giza.' },
          { tip: 'Waulize wapangaji waliopo au wauzaji wa duka la jirani: “Kuishi hapa kukoje?” Mara nyingi wanakupa picha halisi kuliko tangazo.', title: 'Uliza jirani' },
        ],
      },
      {
        title: 'Usalama wa watoto ndani ya nyumba',
        blocks: [
          { checklist: [
            'Ngazi na balcony zina reli imara?',
            'Kuna bwawa, tanki la maji au shimo lililo wazi?',
            'Geti linafunguka moja kwa moja barabarani?',
            'Soketi za umeme ziko mahali salama na zinafanya kazi vizuri?',
          ] },
        ],
      },
      {
        title: 'Huduma muhimu karibu',
        blocks: [
          { p: 'Tafuta umbali halisi hadi shule mnayoilenga, kituo cha afya kilicho karibu, na duka la mahitaji ya kila siku. Ukiwa na muda, endesha safari ya shule asubuhi kuona foleni.' },
          { p: 'Maeneo yenye nyumba nyingi za familia ni pamoja na Mikocheni, Kawe, Mbezi Beach, Tegeta na Madale — linganisha katika [mwongozo wa maeneo ya Dar es Salaam](/blog/nyumba-za-kupanga-dar-es-salaam-2026). Lakini kumbuka: kila nyumba ndani ya eneo ni tofauti.' },
        ],
      },
    ],
    faqs: [
      { q: 'Je, Ndotoni inahakikisha usalama wa nyumba?', a: 'Hapana. Tunakusaidia kupata na kulinganisha nyumba, lakini ukaguzi wako mwenyewe wa nyumba na mazingira ni muhimu kabla ya kuamua.' },
      { q: 'Je, nyumba yenye mlinzi ni salama zaidi?', a: 'Mlinzi husaidia, lakini kagua pia mlango, madirisha, mwanga na utaratibu wa wageni. Usalama ni mchanganyiko wa mambo mengi.' },
    ],
    cta: { label: 'Tafuta nyumba za familia', href: `${DAR}&district=Kinondoni` },
  },
  {
    slug: 'mkataba-wa-kupanga-nyumba',
    title: 'Mkataba wa kupanga nyumba: vipengele 10 vya kuhakikisha',
    description: 'Unachopaswa kuona kwenye makubaliano ya kupanga kabla ya kusaini: pande, kodi, amana, matengenezo, kuondoka na zaidi.',
    category: 'Vidokezo',
    date: '2026-11-07',
    intro: 'Makubaliano ya maneno husahaulika; ya maandishi hukulinda wewe na mwenye nyumba. Huu si ushauri wa kisheria, bali orodha ya vipengele ambavyo mpangaji makini hupenda kuona kabla ya kusaini.',
    takeaways: [
      'Mkataba uonyeshe majina halisi ya pande zote na anwani ya nyumba.',
      'Kodi, kipindi, miezi ya awali na amana viandikwe kwa namba.',
      'Elewa jinsi ya kuondoka mapema na jinsi amana inavyorejeshwa.',
      'Kila mmoja abaki na nakala iliyosainiwa.',
    ],
    sections: [
      {
        title: 'Vipengele vya msingi',
        blocks: [
          { list: [
            '**Pande:** majina kamili ya mpangaji na mwenye nyumba (au wakala aliyeidhinishwa), na namba za simu.',
            '**Nyumba:** anwani, aina ya nyumba na vyumba vinavyohusika.',
            '**Kipindi:** tarehe ya kuanza na kumalizika.',
            '**Kodi:** kiasi, sarafu, tarehe ya malipo na njia ya kulipa.',
            '**Malipo ya awali na amana:** miezi mingapi, kiasi, na masharti ya kurejesha amana.',
          ], ordered: true },
        ],
      },
      {
        title: 'Vipengele vinavyozuia migogoro',
        blocks: [
          { list: [
            '**Huduma:** nani analipa maji, umeme, ulinzi na taka.',
            '**Matengenezo:** nani anarekebisha nini, na kwa muda gani baada ya taarifa.',
            '**Kupandisha kodi:** lini na kwa taarifa ya muda gani.',
            '**Kuondoka mapema:** taarifa inayohitajika na nini kinatokea kwa kodi iliyolipwa.',
            '**Hali ya nyumba:** orodha au picha za hali ya nyumba siku ya kuhamia.',
          ], ordered: true },
          { tip: 'Ambatisha picha za hali ya nyumba kwenye mkataba au zitume kwa WhatsApp siku ya kuhamia — zina tarehe na zinasaidia wakati wa kurejeshewa amana.', title: 'Kumbukumbu za picha' },
        ],
      },
      {
        title: 'Kabla ya kusaini',
        blocks: [
          { checklist: [
            'Soma mkataba wote, si ukurasa wa kwanza tu.',
            'Hakikisha unayesaini naye ana mamlaka ya kupangisha nyumba hiyo.',
            'Maneno yoyote ya mdomo (“nitarekebisha kabla hujahamia”) yaandikwe.',
            'Pata nakala yako iliyosainiwa na pande zote.',
            'Ukiwa na shaka kuhusu kipengele, omba ushauri wa mtaalamu wa sheria.',
          ] },
        ],
      },
    ],
    faqs: [
      { q: 'Je, makubaliano ya WhatsApp yanatosha?', a: 'Ujumbe unaweza kusaidia kama kumbukumbu, lakini mkataba wa maandishi uliosainiwa na pande zote ni bora kwa makubaliano ya kodi ya miezi mingi.' },
      { q: 'Nikimpa wakala fedha, mkataba uwe na nani?', a: 'Hakikisha mkataba unaonyesha mwenye nyumba au mtu mwenye idhini yake ya maandishi, na kwamba risiti zinaonyesha fedha zimepokelewa na nani.' },
    ],
    cta: { label: 'Tafuta nyumba', href: '/search' },
  },
  {
    slug: 'kuepuka-matapeli-wa-nyumba',
    title: 'Jinsi ya kuepuka matapeli unapotafuta nyumba ya kupanga',
    description: 'Dalili 7 za tangazo la utapeli na hatua za kujilinda kabla ya kutuma fedha yoyote.',
    category: 'Usalama',
    date: '2026-11-07',
    intro: 'Matapeli hutegemea mambo mawili: haraka yako na imani yako. Ukijua dalili zao na kufuata hatua chache rahisi, unapunguza sana hatari ya kupoteza fedha.',
    takeaways: [
      'Usitume fedha kabla ya kuona nyumba ana kwa ana.',
      'Thibitisha kuwa anayekupangisha ana mamlaka juu ya nyumba hiyo.',
      'Bei ya chini mno na haraka ya kulipa ni dalili za hatari.',
      'Lipa kwa njia yenye kumbukumbu na upate risiti.',
    ],
    sections: [
      {
        title: 'Dalili 7 za hatari',
        blocks: [
          { list: [
            'Kodi iko chini sana ukilinganisha na nyumba zinazofanana eneo hilo.',
            'Unaambiwa ulipe “booking” au “ada ya kuona nyumba” kabla ya kutembelea.',
            'Mtu anasema yuko safarini na hawezi kukuonyesha nyumba, lakini atatuma funguo.',
            'Unashinikizwa: “wateja wengine wanasubiri, lipa leo.”',
            'Jina la anayepokea fedha halilingani na jina la mwenye nyumba.',
            'Picha za tangazo zinaonekana kwenye matangazo mengine ya maeneo tofauti.',
            'Anakataa kukupa mkataba au risiti.',
          ], ordered: true },
        ],
      },
      {
        title: 'Hatua za kujilinda',
        blocks: [
          { checklist: [
            'Tembelea nyumba na uingie ndani — si kuiona kwa nje pekee.',
            'Omba kuonana na mwenye nyumba au uthibitisho wa maandishi kwamba wakala ameidhinishwa.',
            'Uliza majirani au mlinzi nani ni mmiliki.',
            'Lipa kupitia benki au pesa za simu kwa jina linalolingana na mkataba.',
            'Hifadhi ujumbe, risiti na mkataba.',
          ] },
          { warn: 'Ukihisi kuna jambo si sawa, simama. Nyumba nzuri halisi haitapotea kwa sababu umeomba siku moja ya kuthibitisha.', title: 'Usiharakishwe' },
        ],
      },
      {
        title: 'Ukishatapeliwa',
        blocks: [
          { p: 'Toa taarifa kituo cha polisi haraka iwezekanavyo, ukiwa na ujumbe, namba za simu na kumbukumbu za malipo. Wasiliana pia na mtoa huduma wa pesa za simu au benki uliyotumia. Kama tangazo lilikuwa kwenye Ndotoni, tuandikie kwenye WhatsApp ili tulichunguze.' },
        ],
      },
    ],
    faqs: [
      { q: 'Je, kulipa ada ya kuona nyumba ni utapeli?', a: 'Si kila mara, lakini ni hatari. Elewana mapema kwa maandishi ada ni ya nini, na usilipe kiasi kikubwa kabla ya kuona nyumba.' },
      { q: 'Nikiona tangazo la kutiliwa shaka kwenye Ndotoni?', a: 'Tuandikie kupitia WhatsApp ukitaja kiungo cha tangazo. Tutalikagua.' },
    ],
    cta: { label: 'Tafuta nyumba', href: '/search' },
  },
  {
    slug: 'orodha-ya-kuhamia-nyumba-mpya',
    title: 'Orodha ya kuhamia nyumba mpya: wiki mbili, siku moja, wiki ya kwanza',
    description: 'Orodha ya vitendo ya kujiandaa, kuhamia na kutulia — pamoja na jinsi ya kurekodi hali ya nyumba kulinda amana yako.',
    category: 'Kuhamia',
    date: '2026-11-07',
    intro: 'Umepata nyumba — hongera! Sasa kuhamia kwenyewe. Orodha hii inagawanywa kwa vipindi vitatu ili usisahau jambo muhimu, hasa kurekodi hali ya nyumba siku ya kwanza.',
    takeaways: [
      'Thibitisha tarehe, funguo na malipo kwa maandishi kabla ya siku ya kuhamia.',
      'Piga picha za kila chumba kabla ya kuingiza mizigo.',
      'Angalia umeme, maji na kufuli siku ya kwanza.',
      'Tuma orodha ya kasoro kwa mwenye nyumba ndani ya siku chache.',
    ],
    sections: [
      {
        title: 'Wiki mbili kabla',
        blocks: [
          { checklist: [
            'Thibitisha tarehe ya kuhamia na muda wa kupokea funguo.',
            'Hakikisha malipo yote yamekamilika na una risiti na mkataba.',
            'Panga gari la mizigo na watu wa kusaidia.',
            'Muulize mwenye nyumba kama kasoro zilizoahidiwa zimerekebishwa.',
            'Panga kuhamisha au kufunga intaneti.',
          ] },
        ],
      },
      {
        title: 'Siku ya kuhamia',
        blocks: [
          { checklist: [
            'Piga picha na video ya kila chumba **kabla** ya kuingiza mizigo.',
            'Andika namba ya mita ya umeme na usomaji wa mita ya maji.',
            'Jaribu kila bomba, choo, taa, soketi na feni.',
            'Jaribu kila mlango na dirisha; hesabu funguo ulizopewa.',
            'Tuma picha kwa mwenye nyumba kwenye WhatsApp — zinabaki na tarehe.',
          ] },
          { tip: 'Fikiria kubadilisha kufuli za mlango mkuu baada ya kuhamia (kwa ruhusa ya mwenye nyumba). Huwezi kujua ni nani mwingine alikuwa na funguo.', title: 'Kufuli' },
        ],
      },
      {
        title: 'Wiki ya kwanza',
        blocks: [
          { checklist: [
            'Tuma orodha ya kasoro ulizogundua kwa maandishi.',
            'Jifunze ratiba ya maji, taka na ulinzi wa eneo.',
            'Hifadhi namba za fundi, mlinzi na mwenye nyumba.',
            'Jitambulishe kwa majirani wa karibu.',
          ] },
        ],
      },
    ],
    faqs: [
      { q: 'Kwa nini picha za siku ya kuhamia ni muhimu?', a: 'Zinaonyesha hali ya nyumba ulipoikuta. Unapoondoka, zinakusaidia kuonyesha kuwa kasoro fulani zilikuwepo kabla, hivyo kulinda amana yako.' },
    ],
    cta: { label: 'Bado unatafuta? Angalia nyumba', href: '/search' },
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

const blockText = (b: Block): string =>
  'p' in b ? b.p : 'list' in b ? b.list.join(' ') : 'checklist' in b ? b.checklist.join(' ')
  : 'tip' in b ? b.tip : 'warn' in b ? b.warn : b.table.rows.flat().join(' ');

export function readingMinutes(post: BlogPost): number {
  const text = [post.intro, ...post.sections.flatMap(s => s.blocks.map(blockText)), ...post.faqs.map(f => f.a)].join(' ');
  return Math.max(2, Math.round(text.split(/\s+/).length / 180));
}
