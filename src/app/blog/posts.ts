export interface BlogPost {
  slug: string;
  title: string;
  titleSw: string;
  description: string;
  descriptionSw: string;
  date: string;
  author: string;
  category: string;
  image: string;
  content: string; // HTML content
  contentSw: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'nyumba-za-kupanga-dar-es-salaam-2026',
    title: 'Best Rental Areas in Dar es Salaam 2026 – Prices & Neighborhoods',
    titleSw: 'Maeneo Bora ya Kupanga Nyumba Dar es Salaam 2026 – Bei na Mitaa',
    description: 'A complete guide to the best neighborhoods for renting in Dar es Salaam in 2026, with average prices and what to expect.',
    descriptionSw: 'Mwongozo kamili wa maeneo bora ya kupanga nyumba Dar es Salaam mwaka 2026, na bei za wastani na unachopaswa kutarajia.',
    date: '2026-05-25',
    author: 'Ndotoni',
    category: 'Mwongozo',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
    content: `
      <h2>Finding the Right Neighborhood in Dar es Salaam</h2>
      <p>Dar es Salaam is a growing city with many neighborhoods to choose from. Whether you're a student, a young professional, or a family, there's a place for you. Here's our breakdown of the best areas to rent in 2026.</p>

      <h3>Budget-Friendly Areas (Under 300,000 TZS/month)</h3>
      <ul>
        <li><strong>Ubungo</strong> – Close to the University of Dar es Salaam, great for students. Expect 150,000–300,000 TZS for a room or small apartment.</li>
        <li><strong>Kimara</strong> – Affordable and well-connected via BRT. Rooms from 100,000 TZS.</li>
        <li><strong>Mbagala</strong> – One of the most affordable areas, ideal for families on a budget.</li>
      </ul>

      <h3>Mid-Range Areas (300,000 – 1,000,000 TZS/month)</h3>
      <ul>
        <li><strong>Kinondoni</strong> – Central location, good amenities, mix of apartments and houses.</li>
        <li><strong>Sinza</strong> – Popular with young professionals, close to shops and restaurants.</li>
        <li><strong>Mikocheni</strong> – Quiet residential area with good security.</li>
      </ul>

      <h3>Premium Areas (1,000,000+ TZS/month)</h3>
      <ul>
        <li><strong>Masaki</strong> – Upscale peninsula area, popular with expats and diplomats.</li>
        <li><strong>Oyster Bay</strong> – Beautiful ocean views, high-end apartments.</li>
        <li><strong>Mbezi Beach</strong> – Spacious compounds, family-friendly, slightly outside the city center.</li>
      </ul>

      <h3>Tips for Renting in Dar</h3>
      <ol>
        <li>Always visit the property in person before paying</li>
        <li>Ask about water and electricity reliability in the area</li>
        <li>Check proximity to BRT or dala dala routes for your commute</li>
        <li>Use Ndotoni to compare prices and contact landlords directly via WhatsApp</li>
      </ol>

      <p>Ready to find your next home? <a href="/">Browse properties on Ndotoni</a> and contact landlords directly.</p>
    `,
    contentSw: `
      <h2>Kupata Eneo Sahihi Dar es Salaam</h2>
      <p>Dar es Salaam ni jiji linalokua na maeneo mengi ya kuchagua. Iwe wewe ni mwanafunzi, mtaalamu mchanga, au familia, kuna mahali pazuri kwako. Hapa kuna mwongozo wetu wa maeneo bora ya kupanga mwaka 2026.</p>

      <h3>Maeneo ya Bei Nafuu (Chini ya 300,000 TZS/mwezi)</h3>
      <ul>
        <li><strong>Ubungo</strong> – Karibu na Chuo Kikuu cha Dar es Salaam, nzuri kwa wanafunzi. Tarajia 150,000–300,000 TZS kwa chumba au apartment ndogo.</li>
        <li><strong>Kimara</strong> – Bei nafuu na imeunganishwa vizuri na BRT. Vyumba kuanzia 100,000 TZS.</li>
        <li><strong>Mbagala</strong> – Mojawapo ya maeneo ya bei nafuu zaidi, nzuri kwa familia zenye bajeti ndogo.</li>
      </ul>

      <h3>Maeneo ya Kati (300,000 – 1,000,000 TZS/mwezi)</h3>
      <ul>
        <li><strong>Kinondoni</strong> – Eneo la kati, huduma nzuri, mchanganyiko wa apartments na nyumba.</li>
        <li><strong>Sinza</strong> – Maarufu kwa wataalamu wachanga, karibu na maduka na mikahawa.</li>
        <li><strong>Mikocheni</strong> – Eneo tulivu la makazi lenye usalama mzuri.</li>
      </ul>

      <h3>Maeneo ya Kifahari (1,000,000+ TZS/mwezi)</h3>
      <ul>
        <li><strong>Masaki</strong> – Eneo la kifahari, maarufu kwa wageni na mabalozi.</li>
        <li><strong>Oyster Bay</strong> – Mandhari mazuri ya bahari, apartments za hali ya juu.</li>
        <li><strong>Mbezi Beach</strong> – Maeneo makubwa, rafiki kwa familia, nje kidogo ya katikati ya jiji.</li>
      </ul>

      <h3>Vidokezo vya Kupanga Nyumba Dar</h3>
      <ol>
        <li>Daima tembelea nyumba kabla ya kulipa</li>
        <li>Uliza kuhusu upatikanaji wa maji na umeme katika eneo</li>
        <li>Angalia ukaribu na njia za BRT au dala dala kwa safari yako</li>
        <li>Tumia Ndotoni kulinganisha bei na kuwasiliana na wamiliki moja kwa moja kupitia WhatsApp</li>
      </ol>

      <p>Uko tayari kupata nyumba yako mpya? <a href="/">Tafuta nyumba kwenye Ndotoni</a> na wasiliana na wamiliki moja kwa moja.</p>
    `,
  },
  {
    slug: 'jinsi-ya-kupata-nyumba-bei-nafuu',
    title: 'How to Find Affordable Housing in Tanzania – A Step-by-Step Guide',
    titleSw: 'Jinsi ya Kupata Nyumba ya Bei Nafuu Tanzania – Mwongozo wa Hatua kwa Hatua',
    description: 'Practical tips for finding quality, affordable rental housing in Tanzanian cities without getting scammed.',
    descriptionSw: 'Vidokezo vya vitendo vya kupata nyumba nzuri na ya bei nafuu katika miji ya Tanzania bila kudanganywa.',
    date: '2026-05-20',
    author: 'Ndotoni',
    category: 'Vidokezo',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    content: `
      <h2>Finding Affordable Housing Without the Hassle</h2>
      <p>Looking for a place to rent in Tanzania can be stressful — brokers charging high fees, fake listings, and unclear pricing. Here's how to navigate it smartly.</p>

      <h3>1. Set a Realistic Budget</h3>
      <p>A good rule: spend no more than 30-40% of your monthly income on rent. In Dar es Salaam, you can find decent rooms from 100,000 TZS and apartments from 300,000 TZS depending on the area.</p>

      <h3>2. Skip the Middleman</h3>
      <p>Traditional brokers (dalali) often charge 1-2 months' rent as commission. Platforms like Ndotoni connect you directly with landlords via WhatsApp — no broker fees.</p>

      <h3>3. Know What to Look For</h3>
      <ul>
        <li>Water availability (ask neighbors, not just the landlord)</li>
        <li>Electricity stability and backup options</li>
        <li>Security — is there a guard, fence, or gate?</li>
        <li>Transport access — how far to the main road?</li>
        <li>Noise levels — visit at different times of day</li>
      </ul>

      <h3>4. Avoid Common Scams</h3>
      <ul>
        <li>Never pay before visiting the property in person</li>
        <li>Be wary of prices that seem too good to be true</li>
        <li>Ask to see the ownership documents or rental agreement</li>
        <li>Get a receipt for every payment</li>
      </ul>

      <h3>5. Use Technology</h3>
      <p>Browse listings with photos and verified prices on <a href="/">Ndotoni</a>. Filter by budget, area, and property type. Contact landlords directly — no waiting, no broker games.</p>

      <p>Start your search today at <a href="/">ndotoni.com</a></p>
    `,
    contentSw: `
      <h2>Kupata Nyumba ya Bei Nafuu Bila Usumbufu</h2>
      <p>Kutafuta mahali pa kupanga Tanzania kunaweza kuwa na msongo — madalali wanaotoza ada kubwa, matangazo ya uongo, na bei zisizo wazi. Hivi ndivyo unavyoweza kufanya kwa busara.</p>

      <h3>1. Weka Bajeti ya Kweli</h3>
      <p>Kanuni nzuri: usitumie zaidi ya 30-40% ya mapato yako ya kila mwezi kwa kodi. Dar es Salaam, unaweza kupata vyumba vizuri kuanzia 100,000 TZS na apartments kuanzia 300,000 TZS kulingana na eneo.</p>

      <h3>2. Epuka Madalali</h3>
      <p>Madalali wa kawaida mara nyingi hutoza kodi ya miezi 1-2 kama kamisheni. Majukwaa kama Ndotoni yanakuunganisha moja kwa moja na wamiliki kupitia WhatsApp — hakuna ada za dalali.</p>

      <h3>3. Jua Unachotafuta</h3>
      <ul>
        <li>Upatikanaji wa maji (uliza majirani, si mwenye nyumba tu)</li>
        <li>Uthabiti wa umeme na chaguzi za akiba</li>
        <li>Usalama — kuna mlinzi, ua, au geti?</li>
        <li>Usafiri — umbali gani hadi barabara kuu?</li>
        <li>Kelele — tembelea nyakati tofauti za siku</li>
      </ul>

      <h3>4. Epuka Udanganyifu wa Kawaida</h3>
      <ul>
        <li>Kamwe usilipe kabla ya kutembelea nyumba</li>
        <li>Jihadhari na bei zinazoonekana nzuri sana</li>
        <li>Omba kuona nyaraka za umiliki au mkataba wa kukodisha</li>
        <li>Pata risiti kwa kila malipo</li>
      </ul>

      <h3>5. Tumia Teknolojia</h3>
      <p>Tafuta matangazo yenye picha na bei zilizothibitishwa kwenye <a href="/">Ndotoni</a>. Chuja kwa bajeti, eneo, na aina ya nyumba. Wasiliana na wamiliki moja kwa moja — hakuna kusubiri, hakuna michezo ya dalali.</p>

      <p>Anza kutafuta leo kwenye <a href="/">ndotoni.com</a></p>
    `,
  },
  {
    slug: 'maeneo-salama-kuishi-dar-es-salaam',
    title: 'Safest Neighborhoods to Live in Dar es Salaam for Families',
    titleSw: 'Maeneo Salama Zaidi ya Kuishi Dar es Salaam kwa Familia',
    description: 'A guide to the safest, most family-friendly neighborhoods in Dar es Salaam with good schools and amenities nearby.',
    descriptionSw: 'Mwongozo wa maeneo salama zaidi na rafiki kwa familia Dar es Salaam yenye shule nzuri na huduma karibu.',
    date: '2026-05-15',
    author: 'Ndotoni',
    category: 'Mwongozo',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
    content: `
      <h2>Safe Living in Dar es Salaam</h2>
      <p>Safety is a top priority when choosing where to live, especially for families with children. Here are the neighborhoods known for security and family-friendly amenities.</p>

      <h3>Top Safe Neighborhoods</h3>

      <h4>1. Mikocheni</h4>
      <p>A quiet residential area with tree-lined streets, good schools (IST, Feza), and reliable security. Mix of apartments and standalone houses. Average rent: 500,000–1,500,000 TZS.</p>

      <h4>2. Mbezi Beach</h4>
      <p>Spacious compounds with gardens, popular with families. Slightly outside the city center but peaceful. Many gated communities. Average rent: 800,000–2,000,000 TZS.</p>

      <h4>3. Masaki / Peninsula</h4>
      <p>High-end area with 24/7 security, embassies nearby, and premium amenities. Best for those with higher budgets. Average rent: 1,500,000–5,000,000 TZS.</p>

      <h4>4. Kawe</h4>
      <p>Growing area between Mikocheni and Mbezi Beach. Good balance of affordability and safety. New developments with modern security features. Average rent: 400,000–1,200,000 TZS.</p>

      <h3>Safety Tips for Any Area</h3>
      <ul>
        <li>Choose properties with perimeter walls and gates</li>
        <li>Ask about neighborhood watch programs</li>
        <li>Check street lighting at night before committing</li>
        <li>Talk to current tenants about their experience</li>
      </ul>

      <p>Find safe, family-friendly homes on <a href="/">Ndotoni</a> — filter by area and see real photos before visiting.</p>
    `,
    contentSw: `
      <h2>Kuishi Salama Dar es Salaam</h2>
      <p>Usalama ni kipaumbele cha juu unapochagua mahali pa kuishi, hasa kwa familia zenye watoto. Hapa kuna maeneo yanayojulikana kwa usalama na huduma rafiki kwa familia.</p>

      <h3>Maeneo Bora Salama</h3>

      <h4>1. Mikocheni</h4>
      <p>Eneo tulivu la makazi lenye barabara zenye miti, shule nzuri (IST, Feza), na usalama wa kuaminika. Mchanganyiko wa apartments na nyumba. Bei ya wastani: 500,000–1,500,000 TZS.</p>

      <h4>2. Mbezi Beach</h4>
      <p>Maeneo makubwa yenye bustani, maarufu kwa familia. Nje kidogo ya katikati ya jiji lakini tulivu. Jumuiya nyingi zenye uzio. Bei ya wastani: 800,000–2,000,000 TZS.</p>

      <h4>3. Masaki / Peninsula</h4>
      <p>Eneo la kifahari lenye usalama wa masaa 24, balozi karibu, na huduma za hali ya juu. Bora kwa wenye bajeti kubwa. Bei ya wastani: 1,500,000–5,000,000 TZS.</p>

      <h4>4. Kawe</h4>
      <p>Eneo linalokua kati ya Mikocheni na Mbezi Beach. Uwiano mzuri wa bei nafuu na usalama. Maendeleo mapya yenye vifaa vya kisasa vya usalama. Bei ya wastani: 400,000–1,200,000 TZS.</p>

      <h3>Vidokezo vya Usalama kwa Eneo Lolote</h3>
      <ul>
        <li>Chagua nyumba zenye kuta za uzio na malango</li>
        <li>Uliza kuhusu programu za ulinzi wa jirani</li>
        <li>Angalia taa za barabara usiku kabla ya kuamua</li>
        <li>Ongea na wapangaji wa sasa kuhusu uzoefu wao</li>
      </ul>

      <p>Pata nyumba salama na rafiki kwa familia kwenye <a href="/">Ndotoni</a> — chuja kwa eneo na uone picha halisi kabla ya kutembelea.</p>
    `,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}
