/**
 * Hand-written descriptions for the most-listed areas, keyed by region slug then area slug
 * (the slug of the `district` value stored on listings, which in practice is the neighbourhood).
 *
 * Deliberately general: character, location and transport – no prices or statistics, which the
 * page computes live from listings. Needs a local-knowledge read-through before publishing.
 */
export interface AreaCopy {
  intro: string;
  /** Things worth checking when renting in this specific area. */
  tips?: string[];
}

export const AREA_COPY: Record<string, Record<string, AreaCopy>> = {
  'dar-es-salaam': {
    kinondoni: {
      intro:
        'Kinondoni ni mojawapo ya wilaya kubwa za Dar es Salaam, ikijumuisha maeneo mengi ya makazi na biashara kaskazini mwa katikati ya jiji. Kwenye Ndotoni, nyumba nyingi zimewekwa chini ya jina pana la Kinondoni badala ya mtaa mahususi, kwa hiyo angalia eneo kamili kwenye ramani ya kila tangazo kabla ya kuamua.',
      tips: ['Thibitisha mtaa halisi (kwa mfano Mikocheni, Kijitonyama au Mwananyamala) kwenye ramani ya tangazo.'],
    },
    kimara: {
      intro:
        'Kimara iko kando ya barabara ya Morogoro upande wa magharibi wa jiji, na ni eneo kubwa la makazi lenye vyumba na nyumba za familia kwa bajeti mbalimbali. Ukaribu na barabara kuu na usafiri wa umma ni sababu kuu watu huchagua Kimara, lakini foleni za asubuhi kuelekea mjini ni jambo la kupanga.',
      tips: ['Pima muda wa safari kwenda kazini saa za asubuhi kabla ya kulipa.', 'Uliza kuhusu maji, kwani upatikanaji hutofautiana kati ya mitaa.'],
    },
    mbezi: {
      intro:
        'Mbezi inajumuisha mitaa mingi kando ya barabara ya Morogoro, kuanzia maeneo yenye maduka na usafiri hadi mitaa tulivu ya nyumba za familia. Ni chaguo maarufu kwa wanaotaka nafasi zaidi kuliko katikati ya jiji kwa kodi ya wastani.',
      tips: ['Angalia hali ya barabara za ndani, hasa wakati wa mvua.'],
    },
    'mbezi-beach': {
      intro:
        'Mbezi Beach iko kando ya barabara ya Bagamoyo kaskazini mwa jiji, karibu na ufukwe. Inajulikana kwa nyumba zenye maeneo makubwa ya wazi na uzio, na inapendelewa na familia na wafanyakazi wa mashirika. Safari kuelekea mjini inategemea sana foleni ya barabara ya Bagamoyo.',
      tips: ['Uliza kuhusu usalama wa eneo na huduma ya maji, na kama kuna jenereta au umeme wa akiba.'],
    },
    mikocheni: {
      intro:
        'Mikocheni ni eneo la makazi lenye utulivu karibu na barabara ya Old Bagamoyo na Mwenge, lenye mchanganyiko wa nyumba za familia, apartments na ofisi ndogo. Ni maarufu kwa wafanyakazi wa mashirika na familia zinazotaka eneo lenye huduma karibu.',
      tips: ['Linganisha nyumba ndani ya Mikocheni A na B – mazingira yanaweza kutofautiana.'],
    },
    sinza: {
      intro:
        'Sinza ni eneo lenye shughuli nyingi la makazi, mikahawa na burudani, linalopendwa na vijana wataalamu na wanaoanza maisha ya kujitegemea. Kuna chaguo za vyumba na apartments, na maduka na usafiri viko karibu.',
      tips: ['Tembelea jioni na usiku ili kujua kiwango cha kelele kabla ya kulipa.'],
    },
    goba: {
      intro:
        'Goba iko nje ya katikati ya jiji upande wa kaskazini-magharibi, ikiwa na viwanja vikubwa na nyumba mpya. Kodi mara nyingi ni nafuu kuliko maeneo ya karibu na mjini, lakini safari ni ndefu zaidi na usafiri wa kibinafsi husaidia.',
      tips: ['Hakikisha unajua njia ya kuelekea barabara kuu na hali yake wakati wa mvua.'],
    },
    kinyerezi: {
      intro:
        'Kinyerezi ni eneo linalokua upande wa magharibi mwa jiji, lenye nyumba za familia na kodi nafuu kiasi. Linafaa kwa wanaotafuta nafasi na bajeti ndogo, kwa kukubali safari ndefu kuelekea mjini.',
    },
    ubungo: {
      intro:
        'Ubungo ni kitovu cha usafiri kilicho karibu na Chuo Kikuu cha Dar es Salaam, na mitaa yake ina vyumba na nyumba zinazopendwa na wanafunzi, wafanyakazi na wasafiri wa mara kwa mara. Ni eneo lenye shughuli nyingi na usafiri rahisi kwenda sehemu mbalimbali za jiji.',
    },
    kunduchi: {
      intro:
        'Kunduchi iko kaskazini mwa Dar es Salaam kando ya pwani, ikichanganya mitaa ya makazi na maeneo ya ufukweni. Inafaa kwa wanaopenda utulivu wa pwani, huku wakikubali umbali kutoka katikati ya jiji.',
    },
    kijitonyama: {
      intro:
        'Kijitonyama iko karibu na Mwenge na Sinza, ikiwa na apartments na nyumba za kati zenye huduma na usafiri karibu. Ni chaguo zuri kwa wanaotaka ukaribu na maeneo ya kibiashara kaskazini mwa jiji.',
    },
    masaki: {
      intro:
        'Masaki iko kwenye rasi ya Msasani na ni mojawapo ya maeneo ya hadhi ya juu jijini, yenye apartments za kisasa, mikahawa na balozi nyingi. Ni chaguo la wageni, wafanyakazi wa mashirika na wanaotafuta usalama na huduma karibu.',
      tips: ['Thibitisha kinachojumuishwa kwenye kodi: huduma, maegesho na usalama.'],
    },
    msasani: {
      intro:
        'Msasani iko kwenye rasi ileile ya Masaki na Oyster Bay, ikiwa na mchanganyiko wa nyumba za familia na apartments, karibu na maduka, mikahawa na ufukwe. Mazingira ni ya hadhi ya juu lakini kwa kawaida ni tulivu zaidi.',
    },
    'oyster-bay': {
      intro:
        'Oyster Bay ni eneo la ufukweni lenye hadhi ya juu lenye nyumba kubwa, apartments na ofisi za kidiplomasia. Linapendelewa na wageni na wafanyakazi wa mashirika wanaotafuta usalama na mandhari ya bahari.',
    },
    'bahari-beach': {
      intro:
        'Bahari Beach iko pwani ya kaskazini mwa jiji, karibu na Kunduchi, na ni maarufu kwa nyumba za ufukweni na utulivu. Linafaa kwa wanaotaka mazingira ya pwani kwa kuishi kila siku.',
    },
    kawe: {
      intro:
        'Kawe iko kaskazini mwa jiji karibu na Mwenge na barabara ya Bagamoyo, ikiwa na makazi yanayokua na maduka na huduma. Ni chaguo la kati kati kwa wanaotaka ukaribu na ufukwe bila kuwa mbali sana na mjini.',
    },
    magomeni: {
      intro:
        'Magomeni ni mtaa wa zamani karibu na katikati ya jiji, wenye usafiri rahisi na kodi ya wastani. Unafaa kwa wanaotaka kuwa karibu na mjini bila gharama ya maeneo ya hadhi ya juu.',
    },
    tabata: {
      intro:
        'Tabata ni eneo lenye shughuli nyingi la makazi upande wa magharibi wa katikati ya jiji, lenye vyumba na nyumba za kodi nafuu na usafiri unaopatikana kwa urahisi.',
    },
    kigamboni: {
      intro:
        'Kigamboni iko upande wa kusini wa bandari, ikifikiwa kwa daraja la Nyerere au kivuko. Ina fukwe na maeneo mapya ya makazi yenye utulivu, ingawa safari ya kuelekea mjini inategemea foleni na kivuko.',
    },
  },
  arusha: {
    'arusha-urban': {
      intro:
        'Arusha Urban inajumuisha katikati ya jiji na mitaa ya jirani, karibu na masoko, ofisi na huduma. Inafaa kwa wanaotaka kuwa karibu na kazi, safari za utalii na usafiri wa kwenda maeneo mengine.',
    },
    njiro: {
      intro:
        'Njiro ni eneo la makazi la kisasa kusini-mashariki mwa katikati ya Arusha, lenye nyumba za familia na apartments. Linapendwa na wafanyakazi wa mashirika na familia zinazotaka utulivu na huduma karibu.',
    },
    'usa-river': {
      intro:
        'Usa River iko mashariki mwa Arusha kuelekea Kilimanjaro, ikiwa na mandhari ya mashamba na milima. Ni chaguo tulivu kwa wanaopenda nafasi na mazingira ya asili, kwa kukubali safari ya kuelekea mjini.',
    },
    olasiti: {
      intro: 'Olasiti ni mtaa wa makazi mashariki mwa Arusha, wenye nyumba za familia na mazingira tulivu.',
    },
  },
};

export function getAreaCopy(regionSlug: string, areaSlug: string): AreaCopy | undefined {
  return AREA_COPY[regionSlug]?.[areaSlug];
}
