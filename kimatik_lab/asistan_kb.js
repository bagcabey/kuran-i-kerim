/* =========================================================================
   TİLAVET ASİSTANI — genişletilmiş cevap havuzu
   Her kayıt: keywords (normalize edilerek aranır), title, answer,
   references, isteğe bağlı options [{label, query}] ve go (uygulamada bölüm aç).
   Fıkhî hüküm verilmez; bu tür sorular yetkili mercie yönlendirilir.
   ========================================================================= */
(function () {
  'use strict';

  const CEZERI = "İbnü'l-Cezerî, el-Mukaddimetü'l-Cezeriyye";
  const TUHFE = "Süleyman el-Cemzûrî, Tuhfetü'l-Etfâl";
  const DIYANET_TECVID = 'Diyanet İşleri Başkanlığı, Kur\u2019an-ı Kerîm\u2019i Güzel Okuma Rehberi';
  const ILMIHAL = 'Diyanet İşleri Başkanlığı, İlmihal';
  const TDV = 'TDV İslâm Ansiklopedisi';

  window.TilavetAsistanKB = [
    // ---------------------------------------------------------------- Başlangıç
    {
      keywords: ['nereden baslamaliyim', 'nereden baslayayim', 'sifirdan', 'yeni basliyorum', 'hic bilmiyorum', 'kuran ogrenmek istiyorum', 'kuran okumayi ogrenmek', 'arapca harfleri calismak'],
      title: 'Sıfırdan başlamak',
      answer: 'Sıfırdan başlıyorsanız şu sırayı öneririm:\n- 1. Harfler: 28 harfi ve çıkış yerlerini (mahreç) tanıyın.\n- 2. Harekeler: üstün, esre, ötre; ardından cezm ve şedde.\n- 3. Tenvin ve med harfleri.\n- 4. Heceleme: kısa kelimeleri hece hece okuyun.\n- 5. Kısa sûreler: Fâtiha ve son sûreler, hocadan dinleyerek.\nGünde 15–20 dakika, her gün düzenli çalışmak; seyrek ve uzun oturumlardan daha verimlidir.',
      references: [DIYANET_TECVID],
      go: { view: 'elifba', elifba: 'harfler', label: 'Sıfırdan Kur\u2019an\u2019ı aç' },
      options: [{ label: 'Harekeler nedir?', query: 'Harekeler ve cezim nedir?' }, { label: 'Ne kadar sürede öğrenirim?', query: 'Kuran okumayı ne kadar sürede öğrenirim' }]
    },
    {
      keywords: ['ne kadar surede ogrenirim', 'kac ayda ogrenirim', 'ne zaman ogrenirim', 'kac gunde'],
      title: 'Öğrenme süresi',
      answer: 'Kişiden kişiye değişir, ama düzenli çalışan bir yetişkin için kabaca:\n- Harfleri ve harekeleri tanımak: 2–4 hafta.\n- Heceleyerek akıcı okumaya geçmek: 2–3 ay.\n- Temel tecvidle rahat okumak: 6–12 ay.\nBelirleyici olan süre değil sürekliliktir: her gün kısa bir çalışma ve haftada en az bir kez bir hocaya okumak.',
      references: ['Tilavet Akademisi öğretim tasarımı'],
      options: [{ label: '20 dakikalık plan', query: '20 dakikalık çalışma planı' }]
    },
    {
      keywords: ['harekeler', 'hareke nedir', 'ustun esre otre', 'cezim nedir', 'cezm nedir', 'harekeler ve cezim'],
      title: 'Harekeler, cezm ve şedde',
      answer: 'Harekeler harfin hangi sesle okunacağını gösterir:\n- Üstün (fetha) َ : ince harflerde "e", kalın harflerde "a".\n- Esre (kesra) ِ : ince harflerde "i", kalın harflerde "ı".\n- Ötre (damme) ُ : ince harflerde "ü", kalın harflerde "u".\n- Cezm (sükûn) ْ : harf harekesiz, önceki harfe bağlanarak okunur: أَبْ (eb).\n- Şedde ّ : harf iki kez okunur; ilki cezimli, ikincisi harekeli: رَبَّ (rab-be).',
      references: [DIYANET_TECVID],
      go: { view: 'elifba', elifba: 'harekeler', label: 'Harekeler bölümünü aç' }
    },
    {
      keywords: ['tenvin nedir', 'tenvin', 'iki ustun', 'iki esre', 'iki otre'],
      title: 'Tenvin',
      answer: 'Tenvin, kelime sonundaki çift harekedir ve sonuna sâkin bir nûn sesi ekler:\n- İki üstün ً : -en / -an (عَل۪يمًا: alîmen)\n- İki esre ٍ : -in / -ın (رَح۪يمٍ: rahîmin)\n- İki ötre ٌ : -ün / -un (غَفُورٌ: ğafûrun)\nTenvinin nûnu, sonraki harfe göre izhâr, ihfâ, idğâm veya iklâb ile okunur. Durulduğunda iki üstün "a/e" uzatmasına, diğerleri sükûna döner.',
      references: [TUHFE],
      go: { view: 'elifba', elifba: 'tenvin', label: 'Tenvin örneklerini dinle' }
    },
    {
      keywords: ['sedde nedir', 'sedde', 'seddeli harf'],
      title: 'Şedde',
      answer: 'Şedde ( ّ ) harfin iki kez okunduğunu gösterir: ilki cezimli, ikincisi harekeli. Örnek: رَبَّنَا "rab-be-nâ". Şeddeli nûn ve mîmde ayrıca gunne yapılır: إِنَّ (in-ne), ثُمَّ (süm-me).',
      references: [DIYANET_TECVID],
      go: { view: 'elifba', elifba: 'cezm-sedde', label: 'Cezm ve şedde bölümünü aç' }
    },
    {
      keywords: ['elif nedir', 'bir elif ne kadar', 'elif miktari', 'elif olcusu', 'hareke miktari'],
      title: 'Elif ölçüsü',
      answer: 'Elif, uzatmalarda kullanılan zaman birimidir: bir harfi normal hızla okuma süresi. Geleneksel olarak parmağı orta hızla açıp kapama süresi olarak öğretilir. Sabit bir saniye değeri yoktur; okuma hızınız (tahkîk, tertîl, hadr) değiştikçe elifin süresi de değişir. Önemli olan bir okuyuş içinde ölçünün tutarlı olmasıdır: 4 elif, aynı okuyuştaki 1 elifin dört katı olmalıdır.',
      references: [DIYANET_TECVID],
      go: { view: 'studyo', station: 'medd', label: 'Elif ölçeri aç' }
    },

    // ---------------------------------------------------------------- Nûn-ı sâkin & tenvin
    {
      keywords: ['nun i sakin', 'nuni sakin', 'nun sakin ve tenvin', 'nun-i sakin', 'sakin nun', 'nun ve tenvin hukumleri'],
      title: 'Nûn-ı sâkin ve tenvin hükümleri',
      answer: 'Sâkin nûn (نْ) veya tenvinden sonra gelen harfe göre dört hüküm vardır:\n- İzhâr: boğaz harfleri (ء ه ع ح غ خ) gelirse nûn açık okunur.\n- İdğâm: ي ر م ل و ن harfleri gelirse nûn sonraki harfe katılır (ي ن م و ile gunneli, ل ر ile gunnesiz).\n- İklâb: ب gelirse nûn mîme çevrilir, gunneyle okunur.\n- İhfâ: kalan 15 harf gelirse nûn genizden, gizlice okunur.',
      references: [TUHFE, CEZERI],
      options: [{ label: 'İzhâr', query: 'izhar nedir' }, { label: 'İhfâ', query: 'ihfa nedir' }, { label: 'İdğâm', query: 'idgam nedir' }, { label: 'İklâb', query: 'iklab nedir' }]
    },
    {
      keywords: ['mim i sakin', 'mimi sakin', 'sakin mim', 'mim sakin hukumleri'],
      title: 'Mîm-i sâkin hükümleri',
      answer: 'Sâkin mîmden (مْ) sonra gelen harfe göre üç hüküm vardır:\n- İhfâ-i şefevî: ب gelirse mîm dudaklar hafifçe kapanarak gunneyle okunur: تَرْم۪يهِمْ بِحِجَارَةٍ.\n- İdğâm-ı misleyn: م gelirse iki mîm birleşir, gunneyle okunur: لَهُمْ مَا.\n- İzhâr-ı şefevî: diğer harflerde mîm açık okunur; özellikle و ve ف önünde gizlenmemesine dikkat edin: عَلَيْهِمْ وَلَا.',
      references: [TUHFE]
    },
    {
      keywords: ['ihfa i sefevi', 'ihfai sefevi', 'sefevi ihfa'],
      title: 'İhfâ-i şefevî',
      answer: 'Sâkin mîmden sonra ب gelirse mîm, dudaklar sıkılmadan hafifçe kapatılarak genizden (gunne) okunur. Örnek: تَرْم۪يهِمْ بِحِجَارَةٍ (Fîl 4).',
      references: [TUHFE]
    },
    {
      keywords: ['izhar i sefevi', 'izhari sefevi', 'sefevi izhar'],
      title: 'İzhâr-ı şefevî',
      answer: 'Sâkin mîmden sonra م ve ب dışında bir harf gelirse mîm açıkça, gunnesiz okunur. و ve ف harfleri mîmle aynı bölgeden (dudak) çıktığı için bu harflerin önünde mîmi gizleme hatası sık yapılır. Örnek: لَكُمْ ف۪يهَا.',
      references: [TUHFE]
    },
    {
      keywords: ['idgam i misleyn', 'misleyn', 'idgami misleyn'],
      title: 'İdğâm-ı misleyn',
      answer: 'Aynı iki harf yan yana gelir ve ilki sâkin olursa birleştirilip şeddeli okunur. Mîmde gunneyle okunur: لَهُمْ مَا. Diğer harflerde de aynı kural vardır: اِضْرِبْ بِعَصَاكَ.',
      references: [CEZERI]
    },
    {
      keywords: ['mutecaniseyn', 'idgam i mutecaniseyn'],
      title: 'İdğâm-ı mütecâniseyn',
      answer: 'Mahreçleri aynı, sıfatları farklı iki harften ilki sâkin olursa ikincisine katılır. Kur\u2019an\u2019daki yerleri:\n- ت → ط: بَسَطْتَ\n- د → ت: قَدْ تَبَيَّنَ\n- ث → ذ: يَلْهَثْ ذٰلِكَ\n- ذ → ظ: اِذْ ظَلَمُوا\n- ب → م: اِرْكَبْ مَعَنَا\nبَسَطْتَ örneğinde ط\u2019nin kalınlığı (itbâk) korunarak idğâm eksik yapılır.',
      references: [CEZERI]
    },
    {
      keywords: ['mutekaribeyn', 'idgam i mutekaribeyn'],
      title: 'İdğâm-ı mütekâribeyn',
      answer: 'Mahreç ve sıfatları birbirine yakın iki harften ilki sâkin olursa ikincisine katılır:\n- ل → ر: قُلْ رَبِّ (kur-rabbi)\n- ق → ك: اَلَمْ نَخْلُقْكُمْ (Mürselât 20)',
      references: [CEZERI]
    },
    {
      keywords: ['lam i tarif', 'lami tarif', 'semsi', 'kameri', 'semsiyye', 'kameriyye', 'harfi tarif'],
      title: 'Lâm-ı ta\u2019rîf: şemsî ve kamerî harfler',
      answer: '"ال" takısının lâmı, sonraki harfe göre iki türlü okunur:\n- Kamerî (izhâr): lâm açık okunur. 14 harf: ا ب غ ح ج ك و خ ف ع ق ي م ه (ezber cümlesi: ebğı haccek ve haf akîmeh). Örnek: اَلْقَمَرُ.\n- Şemsî (idğâm): lâm okunmaz, sonraki harf şeddeli okunur. Kalan 14 harf. Örnek: اَلشَّمْسُ (eş-şems).',
      references: [TUHFE]
    },
    {
      keywords: ['lafzatullah', 'allah lafzi', 'allah kelimesi nasil okunur', 'allah lafzinin okunusu'],
      title: 'Lafzatullah (Allah lafzı)',
      answer: 'Allah lafzındaki lâm, önceki harfin harekesine göre okunur:\n- Önceki harf üstünlü veya ötreli ise kalın: قَالَ اللّٰهُ, رَسُولُ اللّٰهِ.\n- Önceki harf esreli ise ince: بِسْمِ اللّٰهِ.\nCümle başında okunduğunda da kalındır: اَللّٰهُ لَٓا اِلٰهَ اِلَّا هُوَ.',
      references: [CEZERI]
    },
    {
      keywords: ['gunne nedir', 'gunne', 'genizden okumak', 'seddeli nun', 'seddeli mim'],
      title: 'Gunne',
      answer: 'Gunne, sesin genizden (hayşûm) gelen tınısıdır. Şeddeli nûn ve şeddeli mîmde her zaman yapılır: اِنَّ, ثُمَّ. İhfâ, iklâb ve gunneli idğâmda da bulunur. Gunneyi kontrol etmek için burnunuzu hafifçe kapatın: ses kesiliyorsa gunne doğru yerden geliyordur.',
      references: [CEZERI],
      go: { view: 'tecvid', label: 'Tecvid okulunu aç' }
    },
    {
      keywords: ['kalkale kubra', 'kalkale sugra', 'kalkale cesitleri', 'kalkale vakif'],
      title: 'Kalkale: sugrâ ve kübrâ',
      answer: 'Kalkale harfleri: ق ط ب ج د.\n- Kalkale-i sugrâ: harf kelime ortasında sâkindir; hafif yankılanır: يَقْطَعُونَ.\n- Kalkale-i kübrâ: harf durulan yerde sâkin olur; yankı daha belirgindir: اَحَدٌ diye durunca "ehad".\nKalkale harfe eklenen bir sesli harf değildir; "ehade" gibi okunmamalıdır.',
      references: [CEZERI]
    },
    {
      keywords: ['istila harfleri', 'kalin harfler', 'tefhim', 'terkik', 'kalin ince harfler', 'ince harfler'],
      title: 'Kalın ve ince harfler',
      answer: 'Her zaman kalın okunan yedi harf (isti\u2019lâ): خ ص ض غ ط ق ظ. Ezber cümlesi: "hussa dağtın kız". Bunlardan ص ض ط ظ ayrıca itbâklıdır ve en kalın okunanlardır. Râ ve Allah lafzının lâmı duruma göre kalın veya ince okunur. Diğer harfler incedir; ince harfi kalınlaştırmak (ör. ت\u2019yi ط gibi okumak) harfi değiştiren bir hatadır.',
      references: [CEZERI],
      go: { view: 'elifba', elifba: 'kulak', label: 'Kulak testini aç' }
    },

    // ---------------------------------------------------------------- Medler
    {
      keywords: ['medd i tabii', 'meddi tabii', 'tabii med', 'dogal med'],
      title: 'Medd-i tabîî',
      answer: 'Med harfinden (ا و ي) sonra hemze veya sükûn gelmezse doğal uzatma olur: bir elif. Üstünden sonra elif (قَالَ), ötreden sonra vav (يَقُولُ), esreden sonra ye (ق۪يلَ). Daha kısa okumak harfi düşürür, daha uzun okumak ise gereksiz uzatmadır.',
      references: [DIYANET_TECVID],
      go: { view: 'studyo', station: 'medd', label: 'Elif ölçerle dene' }
    },
    {
      keywords: ['medd i muttasil', 'meddi muttasil', 'muttasil'],
      title: 'Medd-i muttasıl',
      answer: 'Med harfi ile hemze aynı kelimede ise muttasıl med olur: جَٓاءَ, سُٓوءَ, السَّمَٓاءِ. Bütün kıraat imamları bu medi uzatır; kısaltılması caiz görülmez. Türkiye\u2019deki yaygın öğretimde dört elif civarında uzatılır.',
      references: [CEZERI, DIYANET_TECVID],
      go: { view: 'studyo', station: 'medd', label: 'Elif ölçerle dene' }
    },
    {
      keywords: ['medd i munfasil', 'meddi munfasil', 'munfasil'],
      title: 'Medd-i munfasıl',
      answer: 'Med harfi bir kelimenin sonunda, hemze sonraki kelimenin başında ise munfasıl med olur: اِنَّٓا اَعْطَيْنَاكَ, ق۪ٓي اَنْفُسِكُمْ. Hafs rivayetinde uzatılır; Türkiye\u2019deki yaygın öğretimde dört elif civarı okunur. Bir okuyuş boyunca aynı ölçüyü korumak gerekir.',
      references: [CEZERI, DIYANET_TECVID],
      go: { view: 'studyo', station: 'medd', label: 'Elif ölçerle dene' }
    },
    {
      keywords: ['medd i arız', 'meddi ariz', 'ariz med', 'medd i ariz', 'vakifta uzatma'],
      title: 'Medd-i ârız',
      answer: 'Med harfinden sonraki harf yalnız durulduğu için sâkin olursa ârız med olur: الرَّح۪يمِ diye durunca "er-rahîm", نَسْتَع۪ينُ → "neste\u2019în". Uzatma bir eliften üç elife kadar câizdir; yaygın olan üç elif civarıdır. Geçerken (vasl) okunduğunda tabîî med olarak bir elif okunur.',
      references: [CEZERI],
      go: { view: 'studyo', station: 'medd', label: 'Elif ölçerle dene' }
    },
    {
      keywords: ['medd i lazim', 'meddi lazim', 'lazim med', 'lazim kelimi', 'lazim harfi'],
      title: 'Medd-i lâzım',
      answer: 'Med harfinden sonra aslî (her durumda bulunan) sükûn veya şedde gelirse lâzım med olur ve en uzun meddir:\n- Kelimî müsakkal: الضَّٓالّ۪ينَ, اَلْحَٓاقَّةُ\n- Harfî: sûre başlarındaki harflerde: الٓمٓ (elif-lââm-mîîm)\nBütün kıraatlerde aynı ölçüde uzatılır.',
      references: [CEZERI],
      go: { view: 'studyo', station: 'medd', label: 'Elif ölçerle dene' }
    },
    {
      keywords: ['medd i lin', 'meddi lin', 'lin med', 'lin harfleri'],
      title: 'Medd-i lîn',
      answer: 'Üstünlü harften sonra sâkin و veya ي gelir ve ardından durulursa lîn med olur: خَوْفٌ diye durunca "havf", الْبَيْتِ → "el-beyt". Vakıfta bir elifle üç elif arasında uzatılabilir; geçerken uzatılmaz.',
      references: [CEZERI]
    },
    {
      keywords: ['medd i sila', 'meddi sila', 'sila med', 'zamir he'],
      title: 'Medd-i sıla',
      answer: 'Kelime sonundaki zamir "he" (ـهُ / ـهِ) iki harekeli harf arasında kalırsa kısa bir "u/i" ile uzatılır: اِنَّهُ كَانَ → "innehû kâne". Ardından hemze gelirse munfasıl gibi uzatılır: عِنْدَهُٓ اِلَّا. Durulduğunda sıla yapılmaz.',
      references: [CEZERI]
    },
    {
      keywords: ['medd i bedel', 'meddi bedel', 'bedel med'],
      title: 'Medd-i bedel',
      answer: 'Hemzeden sonra med harfi gelirse bedel med olur: اٰمَنُوا (âmenû), ا۪يمَانًا (îmânen), اُو۫تُوا (ûtû). Hafs rivayetinde bir elif (tabîî ölçüde) okunur.',
      references: [CEZERI]
    },
    {
      keywords: ['medd i ivaz', 'meddi ivaz', 'ivaz med', 'iki ustunde durmak'],
      title: 'Medd-i ivaz',
      answer: 'İki üstünlü (tenvinli) kelimede durulunca tenvin düşer ve yerine bir elif uzatma okunur: عَل۪يمًا → "alîmâ", اَبَدًا → "ebedâ". Yuvarlak te (ة) ile biten kelimelerde bu yapılmaz; orada "h" ile durulur.',
      references: [CEZERI]
    },
    {
      keywords: ['huruf u mukattaa', 'hurufu mukattaa', 'mukattaa harfleri', 'sure baslarindaki harfler', 'elif lam mim'],
      title: 'Hurûf-ı mukattaa',
      answer: '29 sûrenin başındaki harfler (الٓمٓ, يٰسٓ, حٰمٓ, كٓهٰيٰعٓصٓ…) harf adlarıyla okunur. Uzatmaları:\n- Elif uzatılmaz: "elif".\n- Adı iki harfli olanlar tabîî medle: حٰ (hâ), يٰ (yâ), طٰ (tâ), هٰ (hâ), رٰ (râ).\n- Adı üç harfli olanlar (ل م ن ق ص س ك ع) lâzım medle: لٓامْ, مٓيمْ, نٓونْ. Ayn\u2019da kısa veya uzun okumak câizdir.',
      references: [CEZERI]
    },

    // ---------------------------------------------------------------- Vakıf & ibtidâ
    {
      keywords: ['nerede durmali', 'nerede durup', 'nereden baslamali', 'vakif ve ibtida', 'vakf ve ibtida', 'ibtida nedir', 'durunca nereden'],
      title: 'Vakıf ve ibtidâ',
      answer: 'Vakıf durmak, ibtidâ yeniden başlamaktır. Temel ilkeler:\n- Âyet sonları ve م, ط, ج işaretleri durmak için uygun yerlerdir.\n- لا işaretinde ve anlamın tamamlanmadığı yerde durulmaz.\n- Nefes yetmediği için uygunsuz bir yerde durduysanız, anlamı bozmayacak şekilde bir-iki kelime geriden başlayın.\n- Başlanan kelime anlamı bozacak bir yerden olmamalıdır.',
      references: ["es-Secâvendî, Kitâbü'l-Vakf ve'l-İbtidâ", CEZERI],
      go: { view: 'teknik', teknik: 'vasl', label: 'İbtidâ ve vasl örneklerini aç' }
    },
    {
      keywords: ['durunca son harf', 'vakif yapinca', 'nasil durulur', 'durmanin kurali', 'yuvarlak te', 'te-i merbuta'],
      title: 'Durulurken son harf',
      answer: 'Bir kelimede durunca:\n- Son harf cezimli okunur: الْعَالَم۪ينَ → "el-âlemîn".\n- İki üstün elife döner: عَل۪يمًا → "alîmâ".\n- Yuvarlak te (ة) "h" olur: رَحْمَةٌ → "rahmeh".\n- Son harf med harfiyse ârız med uygulanır.\nRevm (harekeyi fısıltıyla belli etmek) ve işmâm (ötreyi dudakla göstermek) da durma şekilleridir; bunlar hocadan dinlenerek öğrenilir.',
      references: [CEZERI]
    },
    {
      keywords: ['revm', 'ismam', 'revm ve ismam'],
      title: 'Revm ve işmâm',
      answer: 'Durma şekilleridir:\n- Revm: son harfin harekesi üçte biri kadar, fısıltıya yakın belli edilir (esre ve ötrede).\n- İşmâm: harf sâkin okunur, ötre olduğu dudakları yuvarlayarak gösterilir; ses çıkmaz.\nAyrıca Yûsuf 11\u2019deki لَا تَأْمَ۫نَّا kelimesinde Hafs rivayetinde işmâm yapılır.',
      references: [CEZERI]
    },
    {
      keywords: ['istiaze', 'euzu besmele', 'besmele nasil', 'besmele ile baslamak', 'dort vecih', 'sure arasinda besmele'],
      title: 'İstiâze ve besmele',
      answer: 'Okumaya "eûzü billâhi mineş-şeytânir-racîm" ile başlanır. Sûre başında besmele okunur (Tevbe hariç). Eûzü, besmele ve sûre başı arasında dört okuyuş şekli vardır:\n- Üçünü ayrı ayrı okumak (en yaygın).\n- Üçünü tek nefeste birleştirmek.\n- Eûzü\u2019yü ayırıp besmeleyi sûreye bağlamak.\n- Eûzü\u2019yü besmeleye bağlayıp sûreyi ayırmak.\nİki sûre arasında besmeleyi önceki sûrenin sonuna bağlayıp sonrakini ayırmak yapılmaz.',
      references: [CEZERI]
    },
    {
      keywords: ['tevbe suresi besmele', 'tevbe besmelesiz'],
      title: 'Tevbe sûresinin başı',
      answer: 'Tevbe sûresinin başında besmele yoktur ve okunmaz. Sûreye doğrudan başlanır; önceki sûreden (Enfâl) geçerken arada durmak, sekte yapmak veya geçmek şekilleri vardır.',
      references: [CEZERI]
    },

    // ---------------------------------------------------------------- Özel okuyuşlar
    {
      keywords: ['imale', 'mecraha', 'hud 41'],
      title: 'İmâle',
      answer: 'Hafs rivayetinde tek bir yerde vardır: Hûd 41\u2019deki مَجْرٰ۪يهَا kelimesi "mecrêhâ" şeklinde, üstün esreye doğru meylettirilerek okunur.',
      references: [CEZERI],
      go: { view: 'teknik', teknik: 'ozel', label: 'Sekte ve özel kelimeleri aç' }
    },
    {
      keywords: ['teshil', 'ecemiyyun', 'fussilet 44'],
      title: 'Teshîl',
      answer: 'Hafs rivayetinde Fussilet 44\u2019teki ءَاَعْجَمِيٌّ kelimesinde ikinci hemze, hemze ile elif arası yumuşatılarak okunur.',
      references: [CEZERI],
      go: { view: 'teknik', teknik: 'ozel', label: 'Sekte ve özel kelimeleri aç' }
    },
    {
      keywords: ['hemze i vasl', 'hemzei vasl', 'vasl hemzesi', 'hemze i kat', 'kat hemzesi'],
      title: 'Hemze-i vasl ve hemze-i kat\u2019',
      answer: '- Hemze-i kat\u2019: her durumda okunur: اَنْعَمْتَ.\n- Hemze-i vasl: yalnız o kelimeden başlanınca okunur, geçerken düşer: وَاسْتَغْفِرُوا → "vestağfirû".\nVasl hemzesiyle başlarken: "el" takısında üstün; fiillerde üçüncü harf ötreliyse ötre (اُدْعُ), değilse esre (اِهْدِنَا); اِسْم, اِبْن gibi isimlerde esre okunur.',
      references: [CEZERI],
      go: { view: 'teknik', teknik: 'vasl', label: 'İbtidâ ve vasl bölümünü aç' }
    },

    // ---------------------------------------------------------------- Okuma hızı & usul
    {
      keywords: ['tilavet mertebeleri', 'tahkik', 'tertil', 'tedvir', 'hadr', 'okuma hizlari'],
      title: 'Okuma hızları',
      answer: '- Tahkîk: en ağır okuyuş; öğretim ve talim için.\n- Tertîl: ağır ve tane tane; tefekkürle okuma.\n- Tedvîr: orta hız; günlük okuma ve namaz.\n- Hadr: hızlı okuma; mukabele ve hatim.\nHangi hızda okunursa okunsun tecvid kuralları korunur; değişen yalnız elifin süresidir.',
      references: [CEZERI],
      go: { view: 'teknik', teknik: 'tempolar', label: 'Okuma hızlarını dinle' }
    },
    {
      keywords: ['hatim nedir', 'hatim', 'mukabele', 'asir nedir', 'asir okumak'],
      title: 'Hatim, mukabele ve aşır',
      answer: '- Hatim: Kur\u2019an\u2019ı baştan sona okumak.\n- Mukabele: Bir kişi okurken diğerlerinin Mushaf\u2019tan takip etmesi; Ramazan\u2019da cüz cüz yapılır.\n- Aşır: Bir bölümün (genellikle on âyet civarı) makamla, tertîl üzere okunması; camilerde ve programlarda okunan tilavet.',
      references: [TDV]
    },
    {
      keywords: ['tilavet secdesi', 'secde ayetleri', 'secde ayeti'],
      title: 'Tilavet secdesi',
      answer: 'Kur\u2019an\u2019da okunduğunda veya dinlendiğinde secde yapılan âyetler vardır; Hanefî mezhebine göre 14 yerdir: A\u2019râf 206, Ra\u2019d 15, Nahl 50, İsrâ 109, Meryem 58, Hac 18, Furkân 60, Neml 26, Secde 15, Sâd 24, Fussilet 38, Necm 62, İnşikâk 21, Alak 19. Mushaflarda kenarda secde işaretiyle gösterilir. Hükmü ve yapılışı ile ilgili ayrıntılar için ilmihale başvurun.',
      references: [ILMIHAL]
    },
    {
      keywords: ['kiraat nedir', 'yedi kiraat', 'on kiraat', 'hafs', 'asim kiraati', 'rivayet nedir'],
      title: 'Kıraat ve rivayet',
      answer: 'Kıraat, Kur\u2019an\u2019ın Hz. Peygamber\u2019den sahih senetle nakledilen okunuş biçimleridir. Meşhur on kıraat imamı ve her birinin iki râvîsi vardır. Türkiye ve dünyanın büyük kısmında Âsım kıraatinin Hafs rivayeti okunur; bu uygulamadaki bütün örnekler de Hafs rivayetidir.',
      references: [TDV]
    },
    {
      keywords: ['kac sure', 'kac ayet', 'kac cuz', 'kac sayfa', 'mushaf duzeni', 'hizb', 'cuz nedir'],
      title: 'Mushaf\u2019ın düzeni',
      answer: '- 114 sûre.\n- 6236 âyet (Kûfe sayımı; Mushaflarımızda kullanılan).\n- 30 cüz; her cüz yaklaşık 20 sayfa.\n- Medine Mushafı düzeninde 604 sayfa.\n- Cüzler hizb ve rub\u2019 (çeyrek) işaretleriyle daha küçük bölümlere ayrılır.',
      references: [TDV],
      go: { tab: 'tab-tilavet', label: 'Mushaf\u2019ı aç' }
    },
    {
      keywords: ['mekki medeni', 'mekki sure', 'medeni sure'],
      title: 'Mekkî ve Medenî sûreler',
      answer: 'Hicretten önce inen sûrelere Mekkî, sonra inenlere Medenî denir. Mekkî sûreler genellikle kısa âyetli olup iman, âhiret ve tevhidi; Medenî sûreler ise toplum hayatı ve hükümleri işler. Her sûrenin Mekkî/Medenî bilgisi Âyet İnceleme bölümünde görülebilir.',
      references: [TDV],
      go: { tab: 'tab-inceleme', label: 'Âyet İnceleme\u2019yi aç' }
    },
    {
      keywords: ['ilk inen ayet', 'ilk ayet', 'son inen ayet', 'vahiy nasil', 'kuran ne zaman indi', 'nuzul'],
      title: 'Kur\u2019an\u2019ın inişi',
      answer: 'Kur\u2019an yaklaşık 23 yılda, parça parça indirilmiştir. İlk inen âyetler Alak sûresinin ilk beş âyetidir; Kadir gecesinde inmeye başladığı bildirilir. Son inen âyet hakkında farklı rivayetler vardır; yaygın görüş Bakara 281\u2019dir. Âyetlerin iniş sebeplerini Âyet İnceleme bölümünde okuyabilirsiniz.',
      references: [TDV],
      go: { tab: 'tab-inceleme', label: 'Âyet İnceleme\u2019yi aç' }
    },
    {
      keywords: ['kuran nasil toplandi', 'mushaf nasil', 'resm i osmani', 'rasm', 'cem ve istinsah'],
      title: 'Kur\u2019an\u2019ın toplanması ve yazımı',
      answer: 'Kur\u2019an Hz. Peygamber zamanında yazılıyor ve ezberleniyordu. Hz. Ebû Bekir döneminde tek bir Mushaf\u2019ta toplandı; Hz. Osman döneminde çoğaltılarak merkezlere gönderildi. Bu Mushafların yazım biçimine resm-i Osmânî denir; bugünkü Mushaflar bu yazıma bağlıdır, hareke ve işaretler sonradan okumayı kolaylaştırmak için eklenmiştir.',
      references: [TDV]
    },

    // ---------------------------------------------------------------- Benzer harfler
    {
      keywords: ['benzer harfler', 'harfleri karistiriyorum', 'karistirdigim harfler', 'harf ayirt'],
      title: 'Benzer harfleri ayırt etmek',
      answer: 'En sık karışan gruplar:\n- ث س ص: peltek se / ince sin / kalın sad.\n- ذ ز ظ: peltek zel / ze / kalın peltek zı.\n- ح ه: boğaz ortasından ha / boğaz dibinden he.\n- ع ء: boğaz ortası ayn / hemze.\n- ق ك: dil kökü kaf (kalın) / kef (ince).\n- ت ط, د ض: ince / kalın çiftler.\nKulak testinde bu çiftleri gerçek okunuşlarla ayırt edebilirsiniz.',
      references: [CEZERI],
      go: { view: 'elifba', elifba: 'kulak', label: 'Kulak testini aç' }
    },
    {
      keywords: ['kaf kef farki', 'kaf ile kef', 'kef ile kaf'],
      title: 'Kaf (ق) ve kef (ك)',
      answer: 'Kaf, dil kökünün küçük dile yakın yumuşak damağa değmesiyle, kalın ve tok çıkar; kalkale harfidir. Kef biraz daha önden, sert damaktan ince çıkar ve sâkin olduğunda arkasından hafif nefes (hems) akar. Örnek çift: قَلْبٌ (kalb) / كَلْبٌ (kelb).',
      references: [CEZERI],
      go: { view: 'elifba', elifba: 'kulak', label: 'Kulak testini aç' }
    },
    {
      keywords: ['ha he farki', 'ha ile he'],
      title: 'Ha (ح) ve he (ه)',
      answer: 'ح boğazın ortasından, boğaz hafifçe daraltılarak sürtünmeli çıkar. ه boğazın en dibinden, açık bir nefesle çıkar ve zayıf bir harftir; kaybolmaması için net okunmalıdır. ح\u2019yi خ gibi hırıltılı okumamak gerekir.',
      references: [CEZERI],
      go: { view: 'elifba', elifba: 'kulak', label: 'Kulak testini aç' }
    },
    {
      keywords: ['ayn harfi', 'ayn nasil', 'ayn ile hemze'],
      title: 'Ayn (ع)',
      answer: 'Ayn boğazın ortasından çıkar; boğaz hafifçe sıkılır ama ses kesilmez, akar. Hemze (ء) ise boğazın en dibinde sesi kısaca kesip bırakmaktır. Ayn\u2019ı hemze gibi okumak ya da hiç okumamak, kelimenin anlamını değiştirebilen bir hatadır: عَل۪يمٌ ile اَل۪يمٌ farklı kelimelerdir.',
      references: [CEZERI],
      go: { view: 'elifba', elifba: 'harfler', label: 'Harfler ve mahreçleri aç' }
    },
    {
      keywords: ['dad harfi', 'dad nasil', 'zad'],
      title: 'Dad (ض)',
      answer: 'Dad, dilin yan kenarının (çoğunlukla sol) üst azı dişlerinin iç tarafına dayanmasıyla çıkar; kalın ve itbâklıdır, ses dil kenarı boyunca biraz uzar (istitâle). Türkçedeki "z" veya "d" gibi okunmamalıdır. Bu harfin doğru telaffuzu yazıyla zor öğrenilir; hocadan dinleyerek çalışın.',
      references: [CEZERI],
      go: { view: 'elifba', elifba: 'harfler', label: 'Harfler ve mahreçleri aç' }
    },
    {
      keywords: ['peltek harfler', 'se zel zi', 'peltek se', 'peltek nasil'],
      title: 'Peltek harfler (ث ذ ظ)',
      answer: 'Bu üç harfte dil ucu üst ön dişlerin ucuna hafifçe değer, dilin ucu çok az görünür:\n- ث: ince ve nefesli (İngilizce "think").\n- ذ: ince ve sesli (İngilizce "this").\n- ظ: ذ gibi ama kalın ve itbâklı.\nس, ز gibi keskin okunmamalıdır.',
      references: [CEZERI],
      go: { view: 'elifba', elifba: 'kulak', label: 'Kulak testini aç' }
    },

    // ---------------------------------------------------------------- Makam
    {
      keywords: ['makamlar tilavette', 'makam nedir', 'makam kullanimi', 'makamlar nasil kullanilir', 'makam ogrenmek'],
      title: 'Tilavette makam',
      answer: 'Makam, okuyuşun ezgisel yoludur: hangi perdeden başlanacağı, nerede durulacağı (karar) ve nasıl dolaşılacağı (seyir). Tilavette makam anlamı ve huşûyu desteklemek içindir; tecvid her zaman önce gelir. Bir harfi uzatıp kısaltmak veya harekeyi değiştirmek pahasına nağme yapılmaz. Öğrenirken: önce kararı tanıyın, sonra perdeleri dinleyin, en son kısa motifleri tekrar edin.',
      references: [TDV + ': Makam', 'Tilavet Akademisi Makam Okulu'],
      go: { view: 'makam', label: 'Makam okulunu aç' }
    },
    {
      keywords: ['tecvid mi makam mi', 'once tecvid', 'tecvid ile makam', 'oncelik sirasi'],
      title: 'Tecvid ve makam',
      answer: 'Öncelik sırası açıktır: önce harflerin doğru çıkışı ve tecvid, sonra güzel ses ve makam. Makam, doğru okunan bir tilaveti süsler; yanlış okunan bir tilaveti düzeltmez. Yeni başlayan biri makama geçmeden önce tecvidle rahat okuyabilmelidir.',
      references: [CEZERI]
    },
    {
      keywords: ['huzzam', 'huzzam makami'],
      title: 'Hüzzam makamı',
      answer: 'Hüzzam, Segâh perdesinde karar veren, hicaz çeşnisi taşıyan içli bir makamdır. Segâh ile akrabadır ve tilavette segâh seyrinden sonra geçki olarak sık kullanılır.',
      references: ['Türk musikisi nazariyatı kaynakları'],
      go: { view: 'makam', label: 'Makam okulunu aç' }
    },
    {
      keywords: ['karar perdesi', 'karar nedir', 'guclu perde', 'guclu nedir', 'seyir nedir'],
      title: 'Karar, güçlü ve seyir',
      answer: '- Karar: makamın dinlendiği, bittiği perde.\n- Güçlü: makamın ikinci önemli perdesi; ezgi burada sık durur.\n- Seyir: ezginin perdeler arasında dolaşma yönü (çıkıcı, inici, inici-çıkıcı).\nSes Laboratuvarı\u2019ndaki "Perde ve karar" istasyonu kendi karar perdenizi bulmanıza yardım eder.',
      references: ['Türk musikisi nazariyatı kaynakları'],
      go: { view: 'studyo', station: 'tuner', label: 'Perde ve karar istasyonunu aç' }
    },
    {
      keywords: ['hangi kariyi dinlemeliyim', 'kari onerisi', 'kimi dinleyeyim', 'ogrenmek icin kari', 'kari tavsiyesi'],
      title: 'Öğrenirken hangi kâri?',
      answer: 'Öğrenme aşamasında yavaş ve net okuyan kârileri dinleyin. Mahmûd Halîl el-Husarî\u2019nin "muallim" (öğretici) kaydı bunun için hazırlanmıştır: her âyeti yavaş okur, harfler çok nettir. Tecvidle rahat okumaya başladıktan sonra Minşâvî ve Abdulbâsıt gibi kârileri makam ve üslup için dinleyebilirsiniz.',
      references: ['Tilavet Akademisi Dinleme Salonu'],
      go: { view: 'dinleme', label: 'Dinleme Salonu\u2019nu aç' }
    },

    // ---------------------------------------------------------------- Ses & nefes
    {
      keywords: ['ses isinmasi', 'isinma nasil', 'tilavet oncesi isinma', 'sesimi acmak'],
      title: 'Tilavet öncesi ses ısınması',
      answer: 'Üç-dört dakika yeter:\n- 1 dk: Rahat oturun, omuzları gevşetin; burundan sakin nefes alıp ağızdan yavaş verin.\n- 1 dk: Dudaklar kapalı "mmm" ile mırıldanın; titreşimi yüzünüzde hissedin.\n- 1 dk: Dudak titreşimi (brrr) ile alçaktan yükseğe yumuşak kaydırmalar.\n- 1 dk: Kendi rahat perdenizde kısa bir âyet okuyun.\nBoğazda acı veya yanma olursa durun.',
      references: ['Ses sağlığı kaynakları', 'Tilavet Akademisi Şan ve Ses'],
      go: { view: 'san', san: 'vokal-isinma', label: 'Vokal ısınmayı aç' }
    },
    {
      keywords: ['sesimi yormadan', 'ses yorgunlugu', 'sesim yoruluyor', 'sesim kisiliyor', 'sesim catliyor'],
      title: 'Sesi yormadan çalışmak',
      answer: '- Kendi rahat perdenizde okuyun; kâri taklidiyle çok yükseğe çıkmayın.\n- Uzun oturum yerine 15–20 dakikalık parçalar yapın; araya sessiz dinleme koyun.\n- Oda sıcaklığında su için; boğazı öksürerek temizlemek yerine yutkunun.\n- Fısıldayarak okumak sesi dinlendirmez, aksine yorar.\nKısıklık iki haftadan uzun sürerse bir kulak burun boğaz uzmanına görünün.',
      references: ['Ses sağlığı kaynakları'],
      go: { view: 'san', san: 'diyafram', label: 'Nefes ve ses çalışmasını aç' }
    },
    {
      keywords: ['yukseklere cikamiyorum', 'tiz perde', 'yuksek perde', 'sesim yetmiyor', 'pes ses'],
      title: 'Perde (ses yüksekliği) sorunu',
      answer: 'Kârilerin perdesi sizin sesinize uymayabilir; onları aynı perdeden taklit etmek zorunda değilsiniz. Kendi rahat karar perdenizi bulun ve ezgiyi oradan kurun. Ses Laboratuvarı\u2019ndaki karşılaştırma da perde farkını değil, ezginin şeklini ölçer; bu yüzden kendi tonunuzda okuyabilirsiniz.',
      references: ['Tilavet Akademisi Ses Laboratuvarı'],
      go: { view: 'studyo', station: 'tuner', label: 'Karar perdemi bul' }
    },
    {
      keywords: ['nefesim yetmiyor', 'nefes yetmiyor', 'uzun nefes', 'nefes nerede alinir'],
      title: 'Nefes yetmediğinde',
      answer: 'Nefes, durak yerlerinde alınır. Nefesiniz uzun bir âyete yetmiyorsa:\n- Uygun bir durakta (ج, ز, ص veya anlamın tamamlandığı yer) durup nefes alın.\n- Uygunsuz yerde durduysanız bir-iki kelime geriden başlayın.\n- Hızınızı biraz artırmak (tertîlden tedvîre) nefesi rahatlatır.\nNefes kapasitesini zorlayarak "büyütmeye" çalışmayın; zamanla okuma ekonomisi gelişir.',
      references: [CEZERI],
      go: { view: 'teknik', teknik: 'secavend', label: 'Durak işaretlerini aç' }
    },

    // ---------------------------------------------------------------- Ezber
    {
      keywords: ['ezber nasil', 'nasil ezberlerim', 'ezber yontemi', 'ezberimi tekrar', 'ezber tekrari', 'unutmamak icin'],
      title: 'Ezber ve tekrar',
      answer: 'Etkili bir yöntem:\n- Ezberlemeden önce âyeti doğru okunuşla birkaç kez dinleyin.\n- Kısa parçalar (bir-iki satır) halinde ezberleyip birleştirin.\n- Aynı Mushaf\u2019ı kullanın; sayfanın görüntüsü hafızaya yardım eder.\n- Her gün: yeni ders + dünkü ders + eski ezberlerden bir bölüm.\n- Ezberi hocaya veya bir arkadaşa dinletin.\nUnutmak normaldir; düzenli tekrar ezberi kalıcı yapar.',
      references: ['Hafızlık öğretimi uygulamaları'],
      options: [{ label: '30 dakikalık plan', query: '30 dakikalık çalışma planı' }]
    },
    {
      keywords: ['cocuga ogretmek', 'cocuklara kuran', 'cocugum', 'cocuk icin'],
      title: 'Çocuklara Kur\u2019an öğretmek',
      answer: '- Oturumları kısa tutun: 10–15 dakika.\n- Önce bol dinleme; çocuklar taklitle çok hızlı öğrenir.\n- Harfleri oyunla, kartlarla ve sesle tanıtın.\n- Kısa sûrelerle başlayın, küçük başarıları kutlayın.\n- Zorlamayın; sevgiyle ve düzenli olmak, uzun derslerden daha etkilidir.',
      references: ['Din eğitimi uygulamaları'],
      go: { view: 'elifba', elifba: 'harfler', label: 'Harflerle başla' }
    },
    {
      keywords: ['yasim ilerledi', 'bu yastan sonra', 'gec mi kaldim', 'yasli', 'emekliyim'],
      title: 'Hiçbir yaş geç değil',
      answer: 'Kur\u2019an okumayı öğrenmenin yaşı yoktur. Yetişkinler kuralları çocuklardan daha hızlı kavrar; sadece telaffuz biraz daha fazla tekrar ister. Her gün kısa ve düzenli çalışın, hocaya okumayı ihmal etmeyin. Zorlanarak okuyana iki kat sevap olduğu hadiste müjdelenmiştir.',
      references: ['Buhârî, Tefsîr (Abese)', 'Müslim, Salâtü\u2019l-müsâfirîn'],
      go: { view: 'elifba', elifba: 'harfler', label: 'Sıfırdan Kur\u2019an\u2019ı aç' }
    },

    // ---------------------------------------------------------------- Kavramlar
    {
      keywords: ['kavram', 'takva nedir', 'tevekkul nedir', 'sabir nedir', 'sukur nedir', 'rahmet nedir', 'kuranda sik gecen'],
      title: 'Kur\u2019an\u2019da sık geçen kavramlar',
      answer: '- Takvâ: Allah\u2019a saygıyla O\u2019nun razı olmayacağı şeylerden sakınmak.\n- Sabır: zorluk ve sıkıntıda direnmek, isyan etmemek.\n- Şükür: nimeti bilip Allah\u2019a hamd etmek ve nimeti yerinde kullanmak.\n- Tevekkül: elinden geleni yapıp sonucu Allah\u2019a bırakmak.\n- Rahmet: Allah\u2019ın her şeyi kuşatan merhameti.\n- İhsân: Allah\u2019ı görüyormuş gibi kulluk etmek.\nBir kavramı âyetler üzerinden incelemek için Âyet İnceleme bölümünde arama yapabilirsiniz.',
      references: [TDV],
      go: { tab: 'tab-inceleme', label: 'Âyet İnceleme\u2019yi aç' }
    },
    {
      keywords: ['ayetin mealini', 'ayeti incelemek', 'baglamini nasil', 'ayet nasil incelenir'],
      title: 'Bir âyeti incelemek',
      answer: 'Bir âyeti anlamaya çalışırken:\n- Birden fazla güvenilir meali karşılaştırın.\n- Âyeti önceki ve sonraki âyetlerle birlikte okuyun (bağlam).\n- Varsa iniş sebebini (sebeb-i nüzûl) öğrenin.\n- Tefsirlere bakın; tek bir âyetten kesin hüküm çıkarmayın.\nÂyet İnceleme bölümünde meal, okunuş ve iniş bilgisi bir arada.',
      references: [TDV],
      go: { tab: 'tab-inceleme', label: 'Âyet İnceleme\u2019yi aç' }
    },
    {
      keywords: ['hadis nedir', 'sunnet nedir', 'hadis ve sunnet'],
      title: 'Hadis ve sünnet',
      answer: 'Hadis, Hz. Peygamber\u2019in söz, fiil ve onaylarının rivayetidir. Sünnet ise onun hayat örneği ve uygulamasıdır; hadisler bu örneği bize ulaştıran kaynaklardır. Hadislerin güvenilirliği senet ve metin incelemesiyle değerlendirilir (sahih, hasen, zayıf gibi).',
      references: [TDV]
    },

    // ---------------------------------------------------------------- Fıkıh yönlendirme
    {
      keywords: ['abdestsiz kuran', 'abdestsiz okunur', 'mushafa dokunmak', 'ezberden okumak abdest'],
      title: 'Abdest ve Kur\u2019an okumak',
      answer: 'Fıkıh kitapları ezberden okumak, Mushaf\u2019a dokunmak ve ekrandan okumak arasında ayrım yapar ve mezhepler arasında farklı görüşler vardır. Kendi durumunuz için Diyanet İlmihali\u2019ne bakmanızı veya Alo 190 Diyanet hattına sormanızı öneririm. Ben bu konuda hüküm vermem.',
      references: [ILMIHAL, 'Diyanet İşleri Başkanlığı Alo 190']
    },
    {
      keywords: ['namazda okunacak', 'namazda hangi sure', 'zammi sure', 'namaz sureleri'],
      title: 'Namazda okunan sûreler',
      answer: 'Namazın her rekâtında Fâtiha okunur; farzların ilk iki rekâtında ve vacip/sünnet namazlarda Fâtiha\u2019dan sonra bir sûre veya en az üç kısa âyet (zamm-ı sûre) eklenir. Yeni öğrenenler genellikle Fîl\u2019den Nâs\u2019a kadar olan kısa sûrelerle başlar. Namazın kılınışı ve hükümleri için ilmihale başvurun.',
      references: [ILMIHAL],
      go: { tab: 'tab-tilavet', label: 'Mushaf\u2019ı aç' }
    },
    {
      keywords: ['fikhi konuda', 'fetva nereden', 'guvenilir merci', 'kime sorayim', 'alo 190'],
      title: 'Fıkhî sorular için',
      answer: 'Kişisel dinî hükümler (namaz, abdest, oruç, zekât vb.) için:\n- Diyanet İşleri Başkanlığı Alo 190 hattı.\n- Bulunduğunuz yerin müftülüğü.\n- Diyanet İlmihali ve Din İşleri Yüksek Kurulu kararları.\nBu asistan tilavet ve öğrenme rehberidir; fetva vermez.',
      references: ['Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu']
    },

    // ---------------------------------------------------------------- Uygulama yardımı
    {
      keywords: ['mikrofon calismiyor', 'mikrofon izni', 'mikrofon acilmiyor', 'ses algilanmiyor', 'mikrofonu goremiyor'],
      title: 'Mikrofon çalışmıyorsa',
      answer: 'Sırasıyla deneyin:\n- Adres çubuğundaki kilit/ayar simgesinden bu site için mikrofona izin verin, sayfayı yenileyin.\n- Başka bir uygulama (toplantı, kayıt programı) mikrofonu kullanıyorsa kapatın.\n- Bilgisayarın ses ayarlarında doğru mikrofonun seçili olduğunu kontrol edin.\n- Kulaklık mikrofonu kullanıyorsanız ağzınıza 10–15 cm yaklaştırın.\nSesiniz cihazınızda işlenir; hiçbir yere gönderilmez.',
      references: ['Tilavet Akademisi yardım'],
      go: { view: 'studyo', station: 'kurra', label: 'Ses Laboratuvarı\u2019nı aç' }
    },
    {
      keywords: ['elif olcer olcmuyor', 'elif olcer calismiyor', 'elif sayilmiyor', 'uzatma olculmuyor'],
      title: 'Elif ölçer ölçmüyorsa',
      answer: 'En sık nedenler:\n- Ortam gürültülü: ölçer başta sessizliği ölçer; o sırada konuşmayın.\n- Ses çok kısık veya fısıltı: med sesi titreşimli (sesli) olmalı.\n- Ses arada kesiliyor: uzatırken nefesi bölmeyin.\n- Perde çok dalgalanıyor: uzatmayı düz bir perdede tutun.\nÖnce "Hocadan dinle" ile örneği dinleyin, sonra aynı kelimeyi okuyun.',
      references: ['Tilavet Akademisi yardım'],
      go: { view: 'studyo', station: 'medd', label: 'Elif ölçeri aç' }
    },
    {
      keywords: ['ses laboratuvari nasil', 'kari ile karsilastir', 'karsilastirma nasil', 'puanim dusuk', 'skor nasil hesaplaniyor'],
      title: 'Kâri ile karşılaştırma',
      answer: 'Sûre ve âyeti seçin, kâriyi dinleyin, sonra "Oku" ile aynı âyeti okuyun. Sonuç dört ölçüden oluşur:\n- Perde uyumu: ezgi çizginizin kâriye ±2 koma yakınlıkta kaldığı oran.\n- Seyir: ezginin iniş-çıkış yönlerinin benzerliği.\n- Tempo: toplam süre oranı.\n- Ortalama sapma.\nTon farkı (daha kalın/ince ses) puanı düşürmez; ezginin şekli karşılaştırılır. Kısa âyetlerle başlamak daha anlamlı sonuç verir.',
      references: ['Tilavet Akademisi Ses Laboratuvarı'],
      go: { view: 'studyo', station: 'kurra', label: 'Kâri ile karşılaştır' }
    },
    {
      keywords: ['kari calmiyor', 'ses gelmiyor', 'kayit yok', 'dinleme salonu calmiyor', 'tilavet acilmiyor'],
      title: 'Ses çalmıyorsa',
      answer: '- İnternet bağlantınızı kontrol edin; âyet sesleri çevrim içi kaynaklardan gelir.\n- Dinleme Salonu\u2019nda soluk görünen kâri, seçili sûrenin kaydına sahip değildir; başka bir kâri seçin.\n- Cihazın sesinin açık olduğundan ve başka bir sekmenin sesi kilitlemediğinden emin olun.\n- Sorun sürerse sayfayı yenileyin (Ctrl+F5).',
      references: ['Tilavet Akademisi yardım'],
      go: { view: 'dinleme', label: 'Dinleme Salonu\u2019nu aç' }
    },
    {
      keywords: ['yazi boyutu', 'yaziyi buyut', 'arapca kucuk', 'harfler kucuk', 'karanlik mod', 'tema degistir', 'gece modu'],
      title: 'Yazı boyutu ve tema',
      answer: 'Ayarlar\u2019dan Akademi\u2019deki Arapça yazı boyutunu büyütebilir, temayı (aydınlık, sepya, karanlık) değiştirebilirsiniz. Mushaf sayfasında ise araç çubuğundaki A− / A+ düğmeleri sayfa yazısını büyütür.',
      references: ['Tilavet Akademisi yardım'],
      go: { view: 'ayarlar', label: 'Ayarlar\u2019ı aç' }
    },
    {
      keywords: ['ilerlemem', 'kaldigim yer', 'dersler nerede', 'seviyem', 'seviye testi'],
      title: 'İlerleme ve seviye',
      answer: 'Yolculuğum sayfasında sıradaki dersiniz ve altı seviyelik öğrenme yolu görünür. Nereden başlayacağınızdan emin değilseniz seviye testini çözün; test sizi uygun seviyeye yerleştirir. İlerlemeniz bu tarayıcıda saklanır.',
      references: ['Tilavet Akademisi'],
      go: { view: 'yolculuk', label: 'Yolculuğum\u2019u aç' }
    },
    {
      keywords: ['pratik', 'alistirma', 'calisma onerisi', 'ne calisayim', 'bugun ne yapayim'],
      title: 'Bugün ne çalışayım?',
      answer: 'Kısa ve dengeli bir oturum:\n- 2 dk ses ısınması.\n- 5 dk kulak testi (benzer harfler).\n- 5 dk sıradaki ders.\n- 5 dk bir âyeti kâriyle karşılaştırma.\nPratikler bölümünde hepsi tek yerde.',
      references: ['Tilavet Akademisi'],
      go: { view: 'pratik', label: 'Pratikleri aç' }
    },
    {
      keywords: ['tecvid kurallarina nereden', 'tecvide nereden', 'tecvid ogrenmek', 'tecvid sirasi'],
      title: 'Tecvide nereden başlamalı?',
      answer: 'Önerilen sıra:\n- 1. Harflerin mahreç ve sıfatları.\n- 2. Nûn-ı sâkin ve tenvin (izhâr, ihfâ, idğâm, iklâb).\n- 3. Mîm-i sâkin hükümleri.\n- 4. Medler: tabîî, muttasıl, munfasıl, ârız, lâzım.\n- 5. Kalkale, râ ve lafzatullah.\n- 6. Vakıf ve ibtidâ.\nHer kuralı renkli Mushaf\u2019ta örnek âyetlerde görün ve dinleyin.',
      references: [TUHFE, CEZERI],
      go: { view: 'tecvid', label: 'Tecvid okulunu aç' },
      options: [{ label: 'Nûn-ı sâkin ve tenvin', query: 'nun i sakin ve tenvin hükümleri' }, { label: 'Med çeşitleri', query: 'medd cesitleri' }]
    },
    {
      keywords: ['tecvid farz mi', 'tecvid onemli mi', 'tecvid neden', 'tecvidsiz okumak'],
      title: 'Tecvid neden önemli?',
      answer: 'Tecvid, Kur\u2019an\u2019ı indirildiği şekilde, harfleri hakkını vererek okumaktır. Âlimler, harfi veya harekeyi değiştirip anlamı bozabilen açık hatalardan (lahn-ı celî) sakınmanın gerekli olduğunu belirtir. Hükmî ayrıntılar ve kişisel durumlar için güvenilir bir merciye danışın; pratikte ise bir hocadan dinleyerek ve okuyarak öğrenmek en sağlıklı yoldur.',
      references: [CEZERI]
    }
  ];
})();
