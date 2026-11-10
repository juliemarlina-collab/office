/* Web Wizard Studio 4.2 — the four website types taught in Web Wizard PoliPD.
   Loads right after enhancement.js. It keeps only four types, in the same order and with the
   same names and "must have" content as the Kenali page:
     Laman PdP (lms) · Laman pengurusan kerja (office) · Acara (conference) · Portfolio (portfolio)
   The internal keys stay the same, so saved projects, sample images and the ZIP export keep working. */
(function(){'use strict';
const T4={
 lms:{bm:'Laman PdP',en:'Teaching & learning site',
  nav:['Utama|Home','Kursus|Course','Topik|Topics','Aktiviti|Activities','Tugasan|Assignments','Hubungi|Contact'],
  hero:'Belajar Setiap Minggu dengan Lebih Mudah|Learn Every Week, the Easy Way',
  desc:'Nota, slaid, video, aktiviti dan kuiz kursus anda dalam satu tempat.|Your course notes, slides, videos, activities and quizzes in one place.',
  cta:'Mula Minggu 1|Start Week 1',secondary:'Lihat Topik|View Topics',
  sections:['Maklumat Kursus & CLO|Course Details & CLOs','Topik Mingguan|Weekly Topics','Aktiviti & Kuiz|Activities & Quizzes','Tugasan & Tarikh Hantar|Assignments & Due Dates','Hubungi Pensyarah|Contact the Lecturer'],
  items:['Minggu 1: Pengenalan|Week 1: Introduction','Minggu 2: Latihan|Week 2: Practice','Minggu 3: Aplikasi|Week 3: Application'],action:'quiz',
  copy:['Nyatakan kod dan nama kursus serta 2–3 hasil pembelajaran (CLO).|State the course code and name, plus 2–3 learning outcomes (CLOs).',
   'Senaraikan topik setiap minggu dengan pautan nota, slaid dan video.|List each week’s topic with links to notes, slides and videos.',
   'Sediakan aktiviti dan kuiz untuk setiap topik, contohnya Google Form, Quizizz atau Wordwall.|Add activities and quizzes for each topic, such as Google Forms, Quizizz or Wordwall.',
   'Paparkan tugasan, tarikh hantar dan cara menghantar.|Show the assignments, due dates and how to submit.',
   'Beri emel rasmi dan waktu pelajar boleh menghubungi anda.|Give your official email and when students can reach you.']},
 office:{bm:'Laman pengurusan kerja',en:'Work management site',
  nav:['Utama|Home','Tugasan|Tasks','Tarikh Penting|Key Dates','Dokumen|Documents','Borang|Forms','Hubungi|Contact'],
  hero:'Hab Kerja Unit dalam Satu Tempat|Your Unit’s Work Hub in One Place',
  desc:'Tugasan, tarikh penting, SOP dan borang unit, mudah dicari oleh semua ahli.|Unit tasks, key dates, SOPs and forms, easy for every member to find.',
  cta:'Lihat Tugasan|View Tasks',secondary:'Buka Kalendar|Open Calendar',
  sections:['Senarai Tugasan|Task List','Jadual & Tarikh Penting|Schedule & Key Dates','SOP & Garis Panduan|SOPs & Guidelines','Borang|Forms','Hubungi Unit|Contact the Unit'],
  items:['Laporan program|Programme report','Mesyuarat unit|Unit meeting','Kemas kini SOP|Update the SOP'],action:'request',
  copy:['Senaraikan tugasan bersama PIC (orang yang bertanggungjawab) dan status terkini.|List the tasks with the person in charge and their current status.',
   'Paparkan tarikh mesyuarat, tarikh akhir dan acara penting unit.|Show meeting dates, deadlines and key unit events.',
   'Pautkan SOP dan garis panduan dalam Google Drive dengan akses yang sesuai.|Link SOPs and guidelines in Google Drive with suitable access.',
   'Pautkan borang permohonan atau laporan, contohnya Google Form.|Link request or report forms, such as Google Forms.',
   'Nyatakan pegawai untuk dihubungi dan emel rasmi unit.|State the contact officer and the unit’s official email.']},
 conference:{bm:'Acara',en:'Event',
  nav:['Utama|Home','Tentang|About','Atur Cara|Programme','Penceramah|Speakers','Lokasi|Venue','Daftar|Register'],
  hero:'Hari Digital Kreatif|Creative Digital Day',
  desc:'Tarikh, atur cara, penceramah dan pendaftaran program dalam satu laman.|The date, programme, speakers and registration, all on one page.',
  cta:'Daftar Sekarang|Register Now',secondary:'Lihat Atur Cara|View Programme',
  sections:['Tentang Acara|About the Event','Tarikh, Masa & Lokasi|Date, Time & Venue','Atur Cara|Programme','Penceramah|Speakers','Pendaftaran|Registration'],
  items:['9.00 pagi: Pendaftaran|9.00 am: Registration','10.00 pagi: Ucaptama|10.00 am: Keynote','2.00 petang: Bengkel|2.00 pm: Workshop'],action:'register',
  copy:['Terangkan tujuan acara, penganjur dan siapa yang patut hadir.|Explain the purpose of the event, the organiser and who should attend.',
   'Nyatakan tarikh, masa dan tempat, atau pautan sesi dalam talian.|State the date, time and venue, or the online session link.',
   'Susun sesi mengikut masa dengan tajuk yang jelas.|List the sessions by time with clear titles.',
   'Perkenalkan penceramah dengan nama, peranan dan foto yang dibenarkan.|Introduce the speakers with names, roles and photos used with permission.',
   'Letakkan pautan pendaftaran yang berfungsi dan tarikh tutup.|Add a working registration link and the closing date.']},
 portfolio:{bm:'Portfolio',en:'Portfolio',
  nav:['Utama|Home','Tentang Saya|About Me','Projek|Projects','Pencapaian|Achievements','Kemahiran|Skills','Hubungi|Contact'],
  hero:'Idea, Kreativiti dan Hasil Kerja Saya|Ideas, Creativity and My Work',
  desc:'Pengalaman, projek dan pencapaian saya dalam satu laman.|My experience, projects and achievements on one page.',
  cta:'Lihat Projek Saya|View My Projects',secondary:'Hubungi Saya|Contact Me',
  sections:['Tentang Saya|About Me','Projek Pilihan|Selected Projects','Penyelidikan & Pencapaian|Research & Achievements','Kemahiran|Skills','Hubungi Saya|Contact Me'],
  items:['Projek 1|Project 1','Projek 2|Project 2','Projek 3|Project 3'],action:'filter',
  copy:['Tulis 3–4 ayat tentang diri, bidang dan apa yang anda tawarkan.|Write 3–4 sentences about yourself, your field and what you offer.',
   'Tunjukkan 3 projek terbaik: masalahnya, peranan anda dan hasilnya.|Show your 3 best projects: the problem, your role and the result.',
   'Senaraikan penyelidikan, anugerah dan pencapaian yang boleh disahkan.|List research, awards and achievements that can be verified.',
   'Senaraikan kemahiran utama bersama contoh hasil kerja.|List your key skills with examples of your work.',
   'Letakkan emel rasmi, LinkedIn atau Google Scholar.|Add your official email, LinkedIn or Google Scholar.']}
};
const ORDER=['lms','office','conference','portfolio'];
const prompts={};Object.keys(types).forEach(k=>{prompts[k]=types[k].prompt});
Object.keys(CATALOG).forEach(k=>{delete CATALOG[k]});
Object.keys(SECTION_COPY).forEach(k=>{delete SECTION_COPY[k]});
Object.keys(types).forEach(k=>{delete types[k]});
ORDER.forEach(k=>{const d=T4[k],c={bm:d.bm,en:d.en,nav:d.nav,hero:d.hero,desc:d.desc,cta:d.cta,secondary:d.secondary,sections:d.sections,items:d.items,action:d.action};
 CATALOG[k]=c;SECTION_COPY[k]=d.copy;
 types[k]={name:tr(c.bm+'|'+c.en),tag:c.en,title:tr(c.hero),desc:tr(c.desc),cta:tr(c.cta),sections:c.sections.map(tr),prompt:prompts[k]||('Editorial illustration for a '+c.en+', no text')}});
if(!(state.type in CATALOG))state.type='lms';
window.WW_TYPES=ORDER.slice();
if(typeof renderGallery==='function')renderGallery();
})();
