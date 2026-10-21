// TİLAVET AKADEMİSİ — KAPSAMLI DAHİLİ VERİ SETİ (OFFLINE & FILE:// GÜVENCESİ)
(function(window) {
  'use strict';

  window.TilavetAkademiDefaultData = {
  "makamlar": [
  {
    "id": "rast",
    "names": {
      "tr": "Rast",
      "ar": "رَاسْت",
      "en": "Rast"
    },
    "durak": 0,
    "guclu": 31,
    "yeden": -5,
    "seyir": "cikici",
    "dizi": {
      "cikici": [
        0,
        9,
        17,
        22,
        31,
        40,
        48,
        53
      ],
      "inici": [
        0,
        9,
        17,
        22,
        31,
        40,
        44,
        53
      ]
    },
    "cesniler": [
      {
        "tur": "rast-beslisi",
        "baslangic": 0
      },
      {
        "tur": "rast-dortlusu",
        "baslangic": 31
      }
    ],
    "yarimKarar": [
      31
    ],
    "asmaKararlar": [
      9,
      17,
      22
    ],
    "genisleme": {
      "pest": -5,
      "tiz": 62
    },
    "seyirBolumleri": {
      "zemin": "Rast ve Dügâh perdeleri civarından başlar, Segâh ve Çargâh ile Nevâ'ya yükselir.",
      "meyan": "Nevâ üzerinde Gerdâniye ve Eviç perdeleriyle tiz bölgeye genişler.",
      "karar": "Nevâ'dan aşağı çeşniler basılarak Rast perdesinde tam karar verilir."
    },
    "school": [
      "turk",
      "misir",
      "hicaz"
    ],
    "tags": [
      "ferah",
      "vakarlı",
      "dengeli",
      "adalet",
      "öğle ezânı"
    ],
    "difficulty": 1,
    "ruhiTesir": "Zihne berraklık, kalbe sükûnet ve adalet hissi verir. Fazla neşeli veya fazla kederli olmayan dengeli ve asil bir tavra sahiptir.",
    "gelenekNotu": [
      "İlahi azamet ve yaratılış nizamı âyetleri",
      "Hüküm ve adalet âyetleri",
      "Cennet tasvirleri ve ilahi müjdeler",
      "Kıyamet ve haşr sahneleri"
    ],
    "ezanGelenegi": {
      "metin": "Öğle Ezânı (Günün aydınlığında vakar, celal ve adalet)",
      "kaynak": "Geleneksel Türk ve Mısır Ezan Uygulamaları",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "rast-m1",
        "name": {
          "tr": "Rast Klasik Giriş",
          "ar": "مدخل راست الكلاسيكي",
          "en": "Rast Classic Opening"
        },
        "type": "giris",
        "path": [
          {
            "abs": 0,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "rast-m2",
        "name": {
          "tr": "Nevâ Güçlü Asılış",
          "ar": "ارتكاز النوى",
          "en": "Neva Dominant Pivot"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "rast-m3",
        "name": {
          "tr": "Eviç Açılımı",
          "ar": "امتداد الأوج",
          "en": "Evic Expansion"
        },
        "type": "asma-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 48,
            "beats": 1
          },
          {
            "abs": 53,
            "beats": 2
          },
          {
            "abs": 48,
            "beats": 1
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "rast-m4",
        "name": {
          "tr": "Rast Karara İniş",
          "ar": "الهبوط إلى القرار",
          "en": "Descent to Rast Cadence"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 0,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "ussak",
        "via": "Dügâh",
        "viaAbs": 9,
        "path": [
          {
            "abs": 0
          },
          {
            "abs": 9
          },
          {
            "abs": 17
          },
          {
            "abs": 9
          }
        ],
        "note": {
          "tr": "Dügâh perdesinde asılarak Uşşak dörtlüsüne geçki yapılır."
        }
      },
      {
        "to": "nihavend",
        "via": "Çargâh",
        "viaAbs": 22,
        "path": [
          {
            "abs": 9
          },
          {
            "abs": 13
          },
          {
            "abs": 22
          }
        ],
        "note": {
          "tr": "Kürdî perdesi alınıp Çargâh üzerinde Bûselik seslerine geçilir."
        }
      },
      {
        "to": "segah",
        "via": "Segâh",
        "viaAbs": 17,
        "path": [
          {
            "abs": 9
          },
          {
            "abs": 17
          },
          {
            "abs": 22
          },
          {
            "abs": 17
          }
        ],
        "note": {
          "tr": "Segâh perdesine yumuşak bir iniş yapılarak Segâh makamına bağlanılır."
        }
      }
    ],
    "confidence": "high",
    "needsReview": false,
    "notlar": "Klasik Rast makamı. İnici varyantta Eviç yerine Acem perdesi kullanılabilir (TDV Rast).",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Rast",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/rast--musiki",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "53-koma cetveli TDV analizine göre derlendi."
        }
      ]
    },
    "characterTags": [
      "ferah",
      "vakarlı",
      "dengeli",
      "adalet",
      "öğle ezânı"
    ],
    "kararName": "Rast",
    "description": {
      "tr": "Zihne berraklık, kalbe sükûnet ve adalet hissi verir. Fazla neşeli veya fazla kederli olmayan dengeli ve asil bir tavra sahiptir."
    },
    "degrees": [
      {
        "name": {
          "tr": "Rast",
          "ar": "Rast",
          "en": "Rast"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": 0
      },
      {
        "name": {
          "tr": "Dügâh",
          "ar": "Dügâh",
          "en": "Dügâh"
        },
        "komas": 9,
        "arCents": 204,
        "isMicro": false,
        "abs": 9
      },
      {
        "name": {
          "tr": "Segâh",
          "ar": "Segâh",
          "en": "Segâh"
        },
        "komas": 17,
        "arCents": 385,
        "isMicro": true,
        "abs": 17
      },
      {
        "name": {
          "tr": "Çargâh",
          "ar": "Çargâh",
          "en": "Çargâh"
        },
        "komas": 22,
        "arCents": 498,
        "isMicro": true,
        "abs": 22
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 31,
        "arCents": 702,
        "isMicro": true,
        "abs": 31
      },
      {
        "name": {
          "tr": "Hüseynî",
          "ar": "Hüseynî",
          "en": "Hüseynî"
        },
        "komas": 40,
        "arCents": 906,
        "isMicro": false,
        "abs": 40
      },
      {
        "name": {
          "tr": "Eviç",
          "ar": "Eviç",
          "en": "Eviç"
        },
        "komas": 48,
        "arCents": 1087,
        "isMicro": false,
        "abs": 48
      },
      {
        "name": {
          "tr": "Gerdâniye",
          "ar": "Gerdâniye",
          "en": "Gerdâniye"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 53
      }
    ],
    "ayahExamples": [
      {
        "id": "rast-ex-1",
        "surah": 93,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "Duhâ Sûresi",
        "text": "Duhâ Sûresi (1-4. Âyetler: Kuşluk Vakti & İlahi Teselli)",
        "reciter": "Şeyh Mustafa İsmail",
        "reciterTitle": "Makamlar Üstadı (Mısır Ekolü)",
        "reciterId": "mustafa_ismail",
        "audioUrl": "https://everyayah.com/data/Mustafa_Ismail_48kbps/093001.mp3",
        "ayahTextAr": "وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ ۝ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ۝ وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ ۝",
        "ayahTextTr": "Kuşluk vaktine ve sükûnete erdiğinde geceye andolsun ki, Rabbin seni terk etmedi ve sana darılmadı. Elbette ahiret senin için dünyadan daha hayırlıdır.",
        "makamAnalysis": "Mustafa İsmail'in klasikleşmiş Duhâ tilavetidir. Rast karar perdesinden (Sol/G3) girip vakarlı, teselli veren bir edayla seyre başlar; meyan perdesine kadar Rast nağmelerini ilahi bir huzurla işler.",
        "verified": true
      },
      {
        "id": "rast-ex-2",
        "surah": 1,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "Fâtiha Sûresi",
        "text": "Fâtiha Sûresi (1-4. Âyetler: Hamd ve Rubûbiyyet)",
        "reciter": "Mahmûd Halîl el-Husarî",
        "reciterTitle": "Tartılmış Kusursuz Tertîl Üstadı",
        "reciterId": "husary",
        "audioUrl": "https://everyayah.com/data/Husary_128kbps/001001.mp3",
        "ayahTextAr": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝",
        "ayahTextTr": "Rahmân ve Rahîm olan Allah'ın adıyla. Hamd, âlemlerin Rabbi, Rahmân, Rahîm ve din gününün mâliki olan Allah'a mahsustur.",
        "makamAnalysis": "Husarî, Fâtiha'ya tam bir klasik Rast tertîliyle başlar; ilk dört âyeti birbirine bağlayarak Rast makamının oturaklı, adil ve ferah seyrini noksansız icra eder.",
        "verified": true
      },
      {
        "id": "rast-ex-3",
        "surah": 48,
        "ayah": 1,
        "endAyah": 3,
        "surahName": "Fetih Sûresi",
        "text": "Fetih Sûresi (1-3. Âyetler: Şanlı Zafer Müjdesi)",
        "reciter": "Şeyh Mustafa İsmail",
        "reciterTitle": "Mısır Radyosu Baş Kârisi",
        "reciterId": "mustafa_ismail",
        "audioUrl": "https://everyayah.com/data/Mustafa_Ismail_48kbps/048001.mp3",
        "ayahTextAr": "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا ۝ لِيَغْفِرَ لَكَ اللَّهُ مَا تَقَدَّمَ مِن ذَنبِكَ وَمَا تَأَخَّرَ وَيُتِمَّ نِعْمَتَهُ عَلَيْكَ وَيَهْدِيَكَ صِرَاطًا مُّسْتَقِيمًا ۝ وَيَنصُرَكَ اللَّهُ نَصْرًا عَزِيزًا ۝",
        "ayahTextTr": "Şüphesiz biz sana apaçık bir fetih verdik. Ta ki Allah senin geçmiş ve gelecek günahlarını bağışlasın, sana olan nimetini tamamlasın, seni doğru yola iletsin ve sana şanlı bir zaferle yardım etsin.",
        "makamAnalysis": "Rast makamının asil ve müjdeleyici karakteri, fethin büyüklüğü ve ilahi vaat ile tam bir ruhani intibak oluşturur; güçlü perdesi Nevâ'da gezinip karara iner.",
        "verified": true
      },
      {
        "id": "rast-ex-4",
        "surah": 2,
        "ayah": 255,
        "endAyah": 255,
        "surahName": "Bakara Sûresi",
        "text": "Âyetü'l-Kürsî (255. Âyet: Tevhid ve Saltanat-ı İlahiye)",
        "reciter": "Mahmûd Halîl el-Husarî",
        "reciterTitle": "Kıraat ve Tecvid Otoritesi",
        "reciterId": "husary",
        "audioUrl": "https://everyayah.com/data/Husary_128kbps/002255.mp3",
        "ayahTextAr": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۚ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ ۝",
        "ayahTextTr": "Allah O'dur ki, O'ndan başka hiçbir ilah yoktur. Hayy'dır, Kayyûm'dur. O'nu ne bir uyuklama tutabilir ne de uyku. Göklerde ve yerde ne varsa hepsi O'nundur...",
        "makamAnalysis": "Âyetü'l-Kürsî'nin heybeti, Rast makamının oturaklı bas sesleriyle ve Nevâ asma kararlarıyla yaklaşık 50 saniyelik eksiksiz bir tertil şaheseri olarak icra edilir.",
        "verified": true
      }
    ]
  },
  {
    "id": "ussak",
    "names": {
      "tr": "Uşşak",
      "ar": "عُشَّاق",
      "en": "Ushshak"
    },
    "durak": 9,
    "guclu": 31,
    "yeden": 0,
    "seyir": "cikici",
    "dizi": {
      "cikici": [
        9,
        17,
        22,
        31,
        40,
        44,
        53,
        62
      ],
      "inici": null
    },
    "cesniler": [
      {
        "tur": "usak-dortlusu",
        "baslangic": 9
      },
      {
        "tur": "buselik-beslisi",
        "baslangic": 31
      }
    ],
    "iliskili": [
      "bayati"
    ],
    "yarimKarar": [
      31
    ],
    "asmaKararlar": [
      17,
      22
    ],
    "genisleme": {
      "pest": 0,
      "tiz": 62
    },
    "seyirBolumleri": {
      "zemin": "Dügâh perdesinden veya civarından başlar; Segâh koması duyurularak Nevâ'ya çıkılır.",
      "meyan": "Nevâ üzerinde Bûselik beşlisiyle Acem ve Gerdâniye seslerinde dolaşılır.",
      "karar": "Nevâ'dan Çargâh ve Segâh üzerinden Dügâh'ta karar verilir."
    },
    "school": [
      "turk",
      "misir",
      "hicaz"
    ],
    "tags": [
      "samimi",
      "icten",
      "huzun",
      "ikindi ezani",
      "tovbe"
    ],
    "difficulty": 1,
    "ruhiTesir": "Tevazu, derin hüzün, huşû ve samimiyet telkin eder. Âşığın maşuka yakarışı gibi yürek yakıcıdır.",
    "gelenekNotu": [
      "Müminlerin vasıfları ve ahlak âyetleri",
      "Tevbe, istiğfar ve ilahi rahmet",
      "Peygamber kıssalarındaki imtihan anları"
    ],
    "ezanGelenegi": {
      "metin": "İkindi ve Yatsı Ezânı (Günün yorgunluğunda huşû ve teslimiyet)",
      "kaynak": "Geleneksel Türk Ezan Tavrı",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "ussak-m1",
        "name": {
          "tr": "Uşşak Zemin Girişi",
          "ar": "مدخل العشاق",
          "en": "Ushshak Ground Opening"
        },
        "type": "giris",
        "path": [
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "ussak-m2",
        "name": {
          "tr": "Nevâ Üzerinde Seyir",
          "ar": "سير النوى",
          "en": "Pivoting around Neva"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          },
          {
            "abs": 22,
            "beats": 1
          }
        ]
      },
      {
        "id": "ussak-m3",
        "name": {
          "tr": "Uşşak Düşüş Nağmesi",
          "ar": "نغمة الهبوط",
          "en": "Ushshak Descending Wave"
        },
        "type": "asma-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 2
          },
          {
            "abs": 9,
            "beats": 2
          }
        ]
      },
      {
        "id": "ussak-m4",
        "name": {
          "tr": "Karar Perdesine Bağlanış",
          "ar": "الاستقرار على الدوكاه",
          "en": "Cadence to Dugah"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 17,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "rast",
        "via": "Rast",
        "viaAbs": 0,
        "path": [
          {
            "abs": 9
          },
          {
            "abs": 0
          }
        ],
        "note": {
          "tr": "Rast perdesine inilerek makamlar şahına bağlanılır."
        }
      },
      {
        "to": "hicaz",
        "via": "Dik-Kürdî",
        "viaAbs": 14,
        "path": [
          {
            "abs": 9
          },
          {
            "abs": 14
          },
          {
            "abs": 26
          },
          {
            "abs": 31
          }
        ],
        "note": {
          "tr": "Dik-Kürdî ve Nîm-Hicaz basılarak Hicaz dörtlüsüne geçilir."
        }
      },
      {
        "to": "saba",
        "via": "Çargâh",
        "viaAbs": 22,
        "path": [
          {
            "abs": 9
          },
          {
            "abs": 17
          },
          {
            "abs": 22
          },
          {
            "abs": 27
          }
        ],
        "note": {
          "tr": "Çargâh'tan sonra Hicaz perdesi (27) basılarak Sabâ'ya geçilir."
        }
      }
    ],
    "confidence": "high",
    "needsReview": false,
    "notlar": "Bayâtî makamı aynı diziyi kullanır; seyir güçlü (Nevâ) civarından başlar (TDV Bayatî). Dügâh→Segâh 8 komadır (≈181 c), 150 c değildir.",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Uşşak",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/ussak--musiki",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "8 komalık Segâh aralığı doğrulandı."
        }
      ]
    },
    "characterTags": [
      "samimi",
      "icten",
      "huzun",
      "ikindi ezani",
      "tovbe"
    ],
    "kararName": "Dügâh",
    "description": {
      "tr": "Tevazu, derin hüzün, huşû ve samimiyet telkin eder. Âşığın maşuka yakarışı gibi yürek yakıcıdır."
    },
    "degrees": [
      {
        "name": {
          "tr": "Dügâh",
          "ar": "Dügâh",
          "en": "Dügâh"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": 9
      },
      {
        "name": {
          "tr": "Segâh",
          "ar": "Segâh",
          "en": "Segâh"
        },
        "komas": 8,
        "arCents": 181,
        "isMicro": false,
        "abs": 17
      },
      {
        "name": {
          "tr": "Çargâh",
          "ar": "Çargâh",
          "en": "Çargâh"
        },
        "komas": 13,
        "arCents": 294,
        "isMicro": true,
        "abs": 22
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 22,
        "arCents": 498,
        "isMicro": true,
        "abs": 31
      },
      {
        "name": {
          "tr": "Hüseynî",
          "ar": "Hüseynî",
          "en": "Hüseynî"
        },
        "komas": 31,
        "arCents": 702,
        "isMicro": true,
        "abs": 40
      },
      {
        "name": {
          "tr": "Acem",
          "ar": "Acem",
          "en": "Acem"
        },
        "komas": 35,
        "arCents": 792,
        "isMicro": true,
        "abs": 44
      },
      {
        "name": {
          "tr": "Gerdâniye",
          "ar": "Gerdâniye",
          "en": "Gerdâniye"
        },
        "komas": 44,
        "arCents": 996,
        "isMicro": false,
        "abs": 53
      },
      {
        "name": {
          "tr": "Muhayyer",
          "ar": "Muhayyer",
          "en": "Muhayyer"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 62
      }
    ],
    "ayahExamples": [
      {
        "id": "ussak-ex-1",
        "surah": 55,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "Rahmân Sûresi",
        "text": "Rahmân Sûresi (1-4. Âyetler: İlahi Ta'lim ve Yaratılış)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Ağlatan Ses (Mücevved)",
        "reciterId": "minshawi_mujawwad",
        "audioUrl": "https://everyayah.com/data/Minshawy_Mujawwad_192kbps/055001.mp3",
        "ayahTextAr": "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ ۝ عَلَّمَهُ الْبَيَانَ ۝",
        "ayahTextTr": "Rahmân olan Allah, Kur'an'ı öğretti. İnsanı yarattı. Ona beyânı (açıklamayı) öğretti.",
        "makamAnalysis": "Minşâvî'nin Bayâtî makamındaki dünyaca ünlü mücevved icrası; ilk 4 âyeti kesintisiz birbirine bağlayarak Bayâtî'nin tevazu ve huşû dolu iklimini dinleyicinin kalbine nakşeder.",
        "verified": true
      },
      {
        "id": "ussak-ex-2",
        "surah": 67,
        "ayah": 1,
        "endAyah": 2,
        "surahName": "Mülk Sûresi",
        "text": "Mülk Sûresi (1-2. Âyetler: Tebâreke ve Hayatın Gayesi)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Huşûlu Mürettel İcrası",
        "reciterId": "minshawi",
        "audioUrl": "https://everyayah.com/data/Minshawy_Murattal_128kbps/067001.mp3",
        "ayahTextAr": "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ۝",
        "ayahTextTr": "Hükümranlık elinde olan Allah yüceler yücesidir. O, her şeye hakkıyla güç yetirendir. O, hanginizin daha güzel amel işleyeceğini denemek için ölümü ve hayatı yarattı.",
        "makamAnalysis": "Tertil formunda Bayâtî'nin nasıl sakin, tane tane ve harf haklarını zedelemeden icra edileceğinin dünyadaki en muteber örneğidir.",
        "verified": true
      },
      {
        "id": "ussak-ex-3",
        "surah": 49,
        "ayah": 1,
        "endAyah": 2,
        "surahName": "Hucurât Sûresi",
        "text": "Hucurât Sûresi (1-2. Âyetler: İman, Edeb ve Nebevî Vakar)",
        "reciter": "Şeyh Mustafa İsmail",
        "reciterTitle": "Mısır Tilavet Anıtı",
        "reciterId": "mustafa_ismail",
        "audioUrl": "https://everyayah.com/data/Mustafa_Ismail_48kbps/049001.mp3",
        "ayahTextAr": "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تُقَدِّمُوا بَيْنَ يَدَيِ اللَّهِ وَرَسُولِهِ ۖ وَاتَّقُوا اللَّهَ ۚ إِنَّ اللَّهَ سَمِيعٌ عَلِيمٌ ۝ يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَرْفَعُوا أَصْوَاتَكُمْ فَوْقَ صَوْtِ النَّبِيِّ ۝",
        "ayahTextTr": "Ey iman edenler! Allah'ın ve Peygamberinin önüne geçmeyin. Allah'tan korkun... Ey iman edenler! Seslerinizi Peygamberin sesinin üstüne yükseltmeyin.",
        "makamAnalysis": "Mustafa İsmail, edep ve huşû bildiren bu âyetlere Bayâtî'nin orta perdelerinden girerek dinleyiciyi tam bir sükûnete davet eder.",
        "verified": true
      },
      {
        "id": "ussak-ex-4",
        "surah": 25,
        "ayah": 63,
        "endAyah": 64,
        "surahName": "Furkân Sûresi",
        "text": "Furkân Sûresi (63-64. Âyetler: Rahmân'ın Seçkin Kulları)",
        "reciter": "Şeyh Ali Câbir",
        "reciterTitle": "Mekke-i Mükerreme İmamı",
        "reciterId": "ali_jaber",
        "audioUrl": "https://everyayah.com/data/Ali_Jaber_64kbps/025063.mp3",
        "ayahTextAr": "وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا ۝ وَالَّذِينَ يَبِيتُونَ لِرَبِّهِمْ سُجَّدًا وَقِيَامًا ۝",
        "ayahTextTr": "Rahmân'ın has kulları yeryüzünde vakar ve tevazu ile yürürler. Kendini bilmezler onlara laf attığında 'Selam!' der geçerler. Onlar gecelerini Rablerine secde ve kıyamla geçirirler.",
        "makamAnalysis": "Şeyh Ali Câbir'in Kâbe-i Muazzama teravihlerinde milyonları ağlatan, sade, fıtrî ve yürekten Bayâtî tilavetinin zirve örneğidir.",
        "verified": true
      }
    ]
  },
  {
    "id": "hicaz",
    "names": {
      "tr": "Hicaz",
      "ar": "حِجَاز",
      "en": "Hijaz"
    },
    "durak": 9,
    "guclu": 31,
    "yeden": 0,
    "seyir": "inici-cikici",
    "dizi": {
      "cikici": [
        9,
        14,
        26,
        31,
        40,
        48,
        53,
        62
      ],
      "inici": null
    },
    "cesniler": [
      {
        "tur": "hicaz-dortlusu",
        "baslangic": 9
      },
      {
        "tur": "rast-beslisi",
        "baslangic": 31
      }
    ],
    "varyantlar": [
      {
        "id": "humayun",
        "dizi": [
          9,
          14,
          26,
          31,
          40,
          44,
          53,
          62
        ],
        "not": "TDV Hümâyun: hicaz dörtlüsü + nevâda bûselik beşlisi (Acem perdesi içerir)."
      }
    ],
    "yarimKarar": [
      31
    ],
    "asmaKararlar": [
      26,
      40
    ],
    "genisleme": {
      "pest": 0,
      "tiz": 62
    },
    "seyirBolumleri": {
      "zemin": "Nevâ veya Dügâh civarından başlar; Nîm-Hicaz ve Dik-Kürdî sesleriyle Hicaz karakteri verilir.",
      "meyan": "Nevâ üzerinde Rast beşlisiyle Gerdâniye ve Eviç perdelerine çıkılır.",
      "karar": "Nevâ'dan Nîm-Hicaz ve Dik-Kürdî üzerinden Dügâh perdesinde karar verilir."
    },
    "school": [
      "turk",
      "misir",
      "hicaz"
    ],
    "tags": [
      "celalli",
      "yakaris",
      "hasyet",
      "ikindi ezani",
      "heybet"
    ],
    "difficulty": 2,
    "ruhiTesir": "Kalbi derinden sarsan yakarış, haşyet, ilahi heybet ve celâl duyguları uyandırır.",
    "gelenekNotu": [
      "İlahi tehdit, cehennem ve azap tasvirleri",
      "Kıyamet sahneleri ve kozmik dehşet",
      "İçten ve derin yakarış duaları"
    ],
    "ezanGelenegi": {
      "metin": "İkindi ve Yatsı Ezânı (Akşamın yaklaştığı saatlerde ürpertici çağrı)",
      "kaynak": "Geleneksel Türk Ezan Usulü",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "hicaz-m1",
        "name": {
          "tr": "Hicaz Dörtlüsü Girişi",
          "ar": "مدخل رباعي الحجاز",
          "en": "Hijaz Tetrachord Opening"
        },
        "type": "giris",
        "path": [
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 14,
            "beats": 1
          },
          {
            "abs": 26,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "hicaz-m2",
        "name": {
          "tr": "Nevâ Güçlüsü ve Hüseynî",
          "ar": "النوى والحسيني",
          "en": "Neva Dominant & Huseyni"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 40,
            "beats": 2
          },
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 26,
            "beats": 2
          }
        ]
      },
      {
        "id": "hicaz-m3",
        "name": {
          "tr": "Eviç Zirvesi",
          "ar": "ذروة الأوج",
          "en": "Evic Peak Motif"
        },
        "type": "asma-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 48,
            "beats": 1
          },
          {
            "abs": 53,
            "beats": 2
          },
          {
            "abs": 48,
            "beats": 1
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "hicaz-m4",
        "name": {
          "tr": "Dügâh Kararına İniş",
          "ar": "الهبوط إلى دوكاه",
          "en": "Cadence to Dugah"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 26,
            "beats": 1
          },
          {
            "abs": 14,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "ussak",
        "via": "Dügâh",
        "viaAbs": 9,
        "path": [
          {
            "abs": 26
          },
          {
            "abs": 17
          },
          {
            "abs": 9
          }
        ],
        "note": {
          "tr": "Segâh perdesine yumuşatılarak Uşşak makamına geçilir."
        }
      },
      {
        "to": "rast",
        "via": "Rast",
        "viaAbs": 0,
        "path": [
          {
            "abs": 9
          },
          {
            "abs": 0
          }
        ],
        "note": {
          "tr": "Rast perdesine basılarak Rast kararında kalınır."
        }
      },
      {
        "to": "nihavend",
        "via": "Nevâ",
        "viaAbs": 31,
        "path": [
          {
            "abs": 26
          },
          {
            "abs": 31
          },
          {
            "abs": 36
          },
          {
            "abs": 31
          }
        ],
        "note": {
          "tr": "Nevâ üzerinde Bûselik sesleriyle Nihavend'e bağlanılır."
        }
      }
    ],
    "confidence": "high",
    "needsReview": false,
    "notlar": "TDV Hicaz: Hicaz dörtlüsü + Nevâ'da Rast beşlisi. Eski blueprint Acem (44) içerdiği için aslında Hümâyun dizisiydi; bu fark varyant olarak belgelendi.",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Hicaz",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/hicaz--musiki",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "Hicaz ve Hümâyun dizileri ayrıştırıldı."
        }
      ]
    },
    "characterTags": [
      "celalli",
      "yakaris",
      "hasyet",
      "ikindi ezani",
      "heybet"
    ],
    "kararName": "Dügâh",
    "description": {
      "tr": "Kalbi derinden sarsan yakarış, haşyet, ilahi heybet ve celâl duyguları uyandırır."
    },
    "degrees": [
      {
        "name": {
          "tr": "Dügâh",
          "ar": "Dügâh",
          "en": "Dügâh"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": 9
      },
      {
        "name": {
          "tr": "Dik-Kürdî",
          "ar": "Dik-Kürdî",
          "en": "Dik-Kürdî"
        },
        "komas": 5,
        "arCents": 113,
        "isMicro": true,
        "abs": 14
      },
      {
        "name": {
          "tr": "Nîm-Hicaz",
          "ar": "Nîm-Hicaz",
          "en": "Nîm-Hicaz"
        },
        "komas": 17,
        "arCents": 385,
        "isMicro": true,
        "abs": 26
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 22,
        "arCents": 498,
        "isMicro": true,
        "abs": 31
      },
      {
        "name": {
          "tr": "Hüseynî",
          "ar": "Hüseynî",
          "en": "Hüseynî"
        },
        "komas": 31,
        "arCents": 702,
        "isMicro": true,
        "abs": 40
      },
      {
        "name": {
          "tr": "Eviç",
          "ar": "Eviç",
          "en": "Eviç"
        },
        "komas": 39,
        "arCents": 883,
        "isMicro": true,
        "abs": 48
      },
      {
        "name": {
          "tr": "Gerdâniye",
          "ar": "Gerdâniye",
          "en": "Gerdâniye"
        },
        "komas": 44,
        "arCents": 996,
        "isMicro": false,
        "abs": 53
      },
      {
        "name": {
          "tr": "Muhayyer",
          "ar": "Muhayyer",
          "en": "Muhayyer"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 62
      }
    ],
    "ayahExamples": [
      {
        "id": "hicaz-ex-1",
        "surah": 19,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "Meryem Sûresi",
        "text": "Meryem Sûresi (1-4. Âyetler: Hz. Zekeriyyâ'nın Gizli Niyazı)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Kıraat Semasının Efsanesi (Mücevved)",
        "reciterId": "abdulbasit_mujawwad",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/019001.mp3",
        "ayahTextAr": "كهيعص ۝ ذِكْرُ رَحْمَتِ رَبِّكَ عَبْدَهُ زَكَرِيَّا ۝ إِذْ نَادَىٰ رَبَّهُ نِدَاءً خَفِيًّا ۝ قَالَ رَبِّ إِنِّي وَهَنَ الْعَظْمُ مِنِّي وَاشْتَعَلَ الرَّأْسُ شَيْبًا وَلَمْ أَكُن بِدُعَائِكَ رَبِّ شَقِيًّا ۝",
        "ayahTextTr": "Kâf Hâ Yâ Ayn Sâd. Bu, Rabbinin Zekeriyyâ kuluna olan rahmetinin anılışıdır. Hani o, Rabbine gizlice yalvarmıştı: 'Rabbim! Doğrusu kemiklerim gevşedi, saçım sakalım bembeyaz oldu...' demişti.",
        "makamAnalysis": "Abdülbâsıt'ın Meryem tilaveti Hicaz makamının dünyadaki en meşhur mücevved icrasıdır. Gizli yakarış ve haşyet, Hicaz'ın karakteristik artık ikili aralıklarıyla yüreğe işler.",
        "verified": true
      },
      {
        "id": "hicaz-ex-2",
        "surah": 79,
        "ayah": 27,
        "endAyah": 31,
        "surahName": "Nâziât Sûresi",
        "text": "Nâziât Sûresi (27-31. Âyetler: Göğün ve Yerin Yaratılışı)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Mücevved Makam Zirvesi",
        "reciterId": "abdulbasit_mujawwad",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/079027.mp3",
        "ayahTextAr": "أَأَنتُمْ أَشَدُّ خَلْقًا أَمِ السَّمَاءُ ۚ بَنَاهَا ۝ رَفَعَ سَمْكَهَا فَسَوَّاهَا ۝ وَأَغْطَشَ لَيْلَهَا وَأَخْرَجَ ضُحَاهَا ۝ وَالْأَرْضَ بَعْدَ ذَٰلِكَ دَحَاهَا ۝ أَخْرَجَ مِنْهَا مَاءَهَا وَمَرْعَاهَا ۝",
        "ayahTextTr": "Sizi yaratmak mı daha güç, yoksa göğü yaratmak mı? Onu Allah bina etti. Tavanını yükseltti, ona nizam verdi. Gecesini kararttı, gündüzünü aydınlığa çıkardı.",
        "makamAnalysis": "Kozmik haşyet ve ilahi kudret beyanı, Hicaz'ın tiz perdelerindeki nefes kesen gerilimiyle ve Abdülbâsıt'ın meşhur tiz nağmeleriyle can bulur.",
        "verified": true
      },
      {
        "id": "hicaz-ex-3",
        "surah": 14,
        "ayah": 40,
        "endAyah": 41,
        "surahName": "İbrâhîm Sûresi",
        "text": "İbrâhîm Sûresi (40-41. Âyetler: Hz. İbrâhîm'in Namaz Duası)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Huşûlu Mürettel Tilavet",
        "reciterId": "abdulbasit",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/014040.mp3",
        "ayahTextAr": "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ ۝ رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ ۝",
        "ayahTextTr": "Rabbim! Beni ve soyumdan gelecekleri namazı dosdoğru kılanlardan eyle! Rabbimiz, duamı kabul buyur! Rabbimiz! Hesabın görüleceği gün beni, anamı-babamı ve bütün müminleri bağışla!",
        "makamAnalysis": "İbrahim Aleyhisselam'ın asırları aşan duaları, Hicaz makamının içli ve yakarıcı nağmeleriyle eda edilir; her namazda okunan 'Rabbenâğfirlî'nin ruhudur.",
        "verified": true
      },
      {
        "id": "hicaz-ex-4",
        "surah": 75,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "Kıyâme Sûresi",
        "text": "Kıyâme Sûresi (1-4. Âyetler: Diriliş ve Parmak Uçları)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Mücevved Kıyâmet İntibakı",
        "reciterId": "minshawi_mujawwad",
        "audioUrl": "https://everyayah.com/data/Minshawy_Mujawwad_192kbps/075001.mp3",
        "ayahTextAr": "لَا أُقْسِمُ بِيَوْمِ الْقِيَامَةِ ۝ وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ ۝ أَيَحْسَبُ الْإِنسَانُ أَلَّن نَّجْمَعَ عِظَامَهُ ۝ بَلَىٰ قَادِرِينَ عَلَىٰ أَن نُّسَوِّيَ بَنَانَهُ ۝",
        "ayahTextTr": "Yemin ederim kıyamet gününe! Ve yemin ederim kendini kınayan nefse! İnsan, kemiklerini bir araya toplayamayacağımızı mı sanır? Evet, parmak uçlarını bile tastamam düzenlemeye gücümüz yeter.",
        "makamAnalysis": "Kıyametin sarsıcı uyarısı, Hicaz'ın keskin perdelerinde Minşâvî'nin derin haşyetiyle vücut bulur.",
        "verified": true
      }
    ]
  },
  {
    "id": "nihavend",
    "names": {
      "tr": "Nihavend",
      "ar": "نِهَاوَنْد",
      "en": "Nahawand"
    },
    "durak": 0,
    "guclu": 31,
    "yeden": -5,
    "seyir": "inici-cikici",
    "dizi": {
      "cikici": [
        0,
        9,
        13,
        22,
        31,
        36,
        48,
        53
      ],
      "inici": [
        0,
        9,
        13,
        22,
        31,
        35,
        44,
        53
      ]
    },
    "cesniler": [
      {
        "tur": "buselik-beslisi",
        "baslangic": 0
      },
      {
        "tur": "hicaz-dortlusu",
        "baslangic": 31
      }
    ],
    "transpoze": {
      "ornek": "C üzerinde (Çargâh kararı)",
      "kararAbs": 22
    },
    "yarimKarar": [
      31
    ],
    "asmaKararlar": [
      13,
      22
    ],
    "genisleme": {
      "pest": -5,
      "tiz": 53
    },
    "seyirBolumleri": {
      "zemin": "Nevâ veya Rast civarından başlar; Kürdî ve Çargâh sesleriyle Bûselik beşlisi duyurulur.",
      "meyan": "Çıkıcı seyirde Nevâ üzerinde Hicaz dörtlüsü (Hisar ve Eviç), inici seyirde Kürdî dörtlüsü (Nîm-Hisar ve Acem) kullanılır.",
      "karar": "Nevâ'dan Çargâh, Kürdî ve Dügâh üzerinden Rast perdesinde tam karar verilir."
    },
    "school": [
      "turk",
      "misir",
      "hicaz"
    ],
    "tags": [
      "vakar",
      "dinginlik",
      "huzur",
      "letafet",
      "yatsi ezani"
    ],
    "difficulty": 2,
    "ruhiTesir": "Vakar, dinginlik, letafet ve sükûnet hissi verir. Batı mûsikisindeki armonik minöre yakındır.",
    "gelenekNotu": [
      "Peygamber kıssaları ve hikmetli öğütler",
      "Kâinat nizamı ve tefekkür âyetleri",
      "Huzur, sekinet ve teslimiyet telkini"
    ],
    "ezanGelenegi": {
      "metin": "Yatsı Ezânı (Gecenin sessizliğine geçişte huzur ve letafet)",
      "kaynak": "Geleneksel Türk Ezan Uygulamaları",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "nihavend-m1",
        "name": {
          "tr": "Nihavend Bûselik Beşlisi",
          "ar": "بوسليك النهاوند",
          "en": "Nahawand Buselik Fifth"
        },
        "type": "giris",
        "path": [
          {
            "abs": 0,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 13,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "nihavend-m2",
        "name": {
          "tr": "Nevâ Güçlüsü Üzerinde Salınım",
          "ar": "تمايل النوى",
          "en": "Oscillation on Neva"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          },
          {
            "abs": 36,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "nihavend-m3",
        "name": {
          "tr": "Hicaz Dörtlüsü Geçişi (Çıkıcı)",
          "ar": "رباعي الحجاز الصاعد",
          "en": "Ascending Hijaz Fourth"
        },
        "type": "asma-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 36,
            "beats": 1
          },
          {
            "abs": 48,
            "beats": 1
          },
          {
            "abs": 53,
            "beats": 2
          }
        ]
      },
      {
        "id": "nihavend-m4",
        "name": {
          "tr": "Rast Kararına Dönüş",
          "ar": "الرجوع إلى قرار الراست",
          "en": "Cadence to Rast"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 13,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 0,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "rast",
        "via": "Rast",
        "viaAbs": 0,
        "path": [
          {
            "abs": 13
          },
          {
            "abs": 9
          },
          {
            "abs": 0
          }
        ],
        "note": {
          "tr": "Aynı durak (Rast) üzerinde Segâh perdesi basılarak Rast makamına geçilir."
        }
      },
      {
        "to": "kurdi",
        "via": "Kürdî",
        "viaAbs": 13,
        "path": [
          {
            "abs": 22
          },
          {
            "abs": 13
          },
          {
            "abs": 9
          }
        ],
        "note": {
          "tr": "Kürdî perdesinden Dügâh kararına inilerek Kürdî makamına bağlanılır."
        }
      },
      {
        "to": "hicaz",
        "via": "Hisar",
        "viaAbs": 36,
        "path": [
          {
            "abs": 31
          },
          {
            "abs": 36
          },
          {
            "abs": 48
          },
          {
            "abs": 53
          }
        ],
        "note": {
          "tr": "Nevâ üzerindeki Hicaz dörtlüsü genişletilerek Hicaz makamına geçki yapılır."
        }
      }
    ],
    "confidence": "high",
    "needsReview": false,
    "notlar": "Standart durak Rast perdesidir (TDV Nihâvend). Çıkıcıda Hisar (36) ve Eviç (48), inicide Nîm-Hisar (35) ve Acem (44) kullanılır.",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Nihâvend",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/nihavend--musiki",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "Çıkıcı ve inici varyantlar ayrıştırıldı."
        }
      ]
    },
    "characterTags": [
      "vakar",
      "dinginlik",
      "huzur",
      "letafet",
      "yatsi ezani"
    ],
    "kararName": "Rast",
    "description": {
      "tr": "Vakar, dinginlik, letafet ve sükûnet hissi verir. Batı mûsikisindeki armonik minöre yakındır."
    },
    "degrees": [
      {
        "name": {
          "tr": "Rast",
          "ar": "Rast",
          "en": "Rast"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": 0
      },
      {
        "name": {
          "tr": "Dügâh",
          "ar": "Dügâh",
          "en": "Dügâh"
        },
        "komas": 9,
        "arCents": 204,
        "isMicro": false,
        "abs": 9
      },
      {
        "name": {
          "tr": "Kürdî",
          "ar": "Kürdî",
          "en": "Kürdî"
        },
        "komas": 13,
        "arCents": 294,
        "isMicro": true,
        "abs": 13
      },
      {
        "name": {
          "tr": "Çargâh",
          "ar": "Çargâh",
          "en": "Çargâh"
        },
        "komas": 22,
        "arCents": 498,
        "isMicro": true,
        "abs": 22
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 31,
        "arCents": 702,
        "isMicro": true,
        "abs": 31
      },
      {
        "name": {
          "tr": "Hisar",
          "ar": "Hisar",
          "en": "Hisar"
        },
        "komas": 36,
        "arCents": 815,
        "isMicro": false,
        "abs": 36
      },
      {
        "name": {
          "tr": "Eviç",
          "ar": "Eviç",
          "en": "Eviç"
        },
        "komas": 48,
        "arCents": 1087,
        "isMicro": false,
        "abs": 48
      },
      {
        "name": {
          "tr": "Gerdâniye",
          "ar": "Gerdâniye",
          "en": "Gerdâniye"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 53
      }
    ],
    "ayahExamples": [
      {
        "id": "nihavend-ex-1",
        "surah": 12,
        "ayah": 1,
        "endAyah": 3,
        "surahName": "Yûsuf Sûresi",
        "text": "Yûsuf Sûresi (1-3. Âyetler: Ahsenü'l-Kasas / Kıssaların En Güzeli)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Ağlatan Ses (Mücevved)",
        "reciterId": "minshawi_mujawwad",
        "audioUrl": "https://everyayah.com/data/Minshawy_Mujawwad_192kbps/012001.mp3",
        "ayahTextAr": "الر ۚ تِلْكَ آيَاتُ الْكِتَابِ الْمُبِينِ ۝ إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ ۝ نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ بِمَا أَوْحَيْنَا إِلَيْكَ هَٰذَا الْقُرْآنَ ۝",
        "ayahTextTr": "Elif Lâm Râ. Bunlar apaçık Kitab'ın âyetleridir. Biz onu akıl erdiresiniz diye Arapça bir Kur'an olarak indirdik. Sana bu Kur'an'ı vahyederek kıssaların en güzelini anlatıyoruz.",
        "makamAnalysis": "Yûsuf kıssasının duygusal zarafeti ve sabır destanı, Nihâvend makamının Batı minor dizisine yakın hüzünlü fakat dingin melodisiyle kusursuz örtüşür.",
        "verified": true
      },
      {
        "id": "nihavend-ex-2",
        "surah": 18,
        "ayah": 1,
        "endAyah": 2,
        "surahName": "Kehf Sûresi",
        "text": "Kehf Sûresi (1-2. Âyetler: Kitab'ın İndirilişi ve Müjde)",
        "reciter": "Mahmûd Halîl el-Husarî",
        "reciterTitle": "Klasik Tertîl Rehberi",
        "reciterId": "husary",
        "audioUrl": "https://everyayah.com/data/Husary_128kbps/018001.mp3",
        "ayahTextAr": "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا ۜ ۝ قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا ۝",
        "ayahTextTr": "Hamd, kuluna Kitab'ı indiren ve onda hiçbir eğrilik kılmayan Allah'a mahsustur. Onu dosdoğru bir kitap kıldı ki, katından şiddetli bir azapla uyarsın ve müminlere güzel bir mükafat müjdelesin.",
        "makamAnalysis": "Husarî'nin Kehf Sûresi girişi, Nihâvend'in vakar ve sekinetini harf harf tertil disiplini içinde ortaya koyar.",
        "verified": true
      },
      {
        "id": "nihavend-ex-3",
        "surah": 76,
        "ayah": 1,
        "endAyah": 3,
        "surahName": "İnsân Sûresi",
        "text": "İnsân Sûresi (1-3. Âyetler: İnsanın Yaratılışı ve İmtihan)",
        "reciter": "Şeyh Meşâri Râşid el-Afâsî",
        "reciterTitle": "Duygusal ve Berrak Kuveyt Ekolü",
        "reciterId": "alafasy",
        "audioUrl": "https://everyayah.com/data/Alafasy_128kbps/076001.mp3",
        "ayahTextAr": "هَلْ أَتَىٰ عَلَى الْإِنسَانِ حِينٌ مِّنَ الدَّهْرِ لَمْ يَكُن شَيْئًا مَّذْكُورًا ۝ إِنَّا خَلَقْنَا الْإِنسَانَ مِن نُّطْفَةٍ أَمْشَاجٍ نَّبْتَلِيهِ فَجَعَلْنَاهُ سَمِيعًا بَصِيرًا ۝ إِنَّا هَدَيْنَاهُ السَّبِيلَ إِمَّا شَاكِرًا وَإِمَّا كَفُورًا ۝",
        "ayahTextTr": "İnsanın üzerinden, henüz anılan bir şey olmadığı uzun bir süre geçmedi mi? Biz insanı imtihan etmek için karmaşık bir nutfeden yarattık; onu işitici ve görücü kıldık. Biz ona yolu gösterdik; ister şükredici olsun ister nankör.",
        "makamAnalysis": "Afâsî'nin Nihâvend icrası, varoluş tefekkürünü berrak ve akıcı bir tınıyla dinleyicinin zihnine ulaştırır.",
        "verified": true
      },
      {
        "id": "nihavend-ex-4",
        "surah": 25,
        "ayah": 1,
        "endAyah": 2,
        "surahName": "Furkân Sûresi",
        "text": "Furkân Sûresi (1-2. Âyetler: Furkân'ın İndirilişi ve Kudret)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Mücevved Zarafet İcrası",
        "reciterId": "abdulbasit_mujawwad",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/025001.mp3",
        "ayahTextAr": "تَبَارَكَ الَّذِي نَزَّلَ الْفُرْقَانَ عَلَىٰ عَبْدِهِ لِيَكُونَ لِلْعَالَمِينَ نَذِيرًا ۝ الَّذِي لَهُ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ وَلَمْ يَتَّخِذْ وَلَدًا وَلَمْ يَكُن لَّهُ شَرِيكٌ فِي الْمُلْكِ وَخَلَقَ كُلَّ شَيْءٍ فَقَدَّرَهُ تَقْدِيرًا ۝",
        "ayahTextTr": "Âlemlere bir uyarıcı olsun diye kuluna Furkân'ı indiren Allah yüceler yücesidir. O ki, göklerin ve yerin mülkü O'nundur; hiçbir çocuk edinmemiştir ve mülkünde hiçbir ortağı yoktur...",
        "makamAnalysis": "Nihâvend'in berrak ve nezih melodik yapısı, ilahi hükümranlığı derin bir tefekkür ve zarafetle dile getirir.",
        "verified": true
      }
    ]
  },
  {
    "id": "saba",
    "names": {
      "tr": "Sabâ",
      "ar": "صَبَا",
      "en": "Saba"
    },
    "durak": 9,
    "guclu": 22,
    "yeden": 0,
    "seyir": "cikici",
    "dizi": {
      "cikici": [
        9,
        17,
        22,
        27,
        31,
        44,
        53,
        62
      ],
      "inici": null
    },
    "cesniler": [
      {
        "tur": "saba-dortlusu",
        "baslangic": 9
      },
      {
        "tur": "hicaz-dizisi",
        "baslangic": 22
      }
    ],
    "bend": [
      {
        "abs": 27,
        "kosul": "seyir",
        "komaOfset": 2,
        "aciklama": "Hicaz perdesi seyir esnasında 2-2.5 koma dik basılır (TDV Sabâ)."
      }
    ],
    "yarimKarar": [
      22
    ],
    "asmaKararlar": [
      27,
      31
    ],
    "genisleme": {
      "pest": 0,
      "tiz": 62
    },
    "seyirBolumleri": {
      "zemin": "Dügâh veya Çargâh civarından başlar; Segâh koması ve Hicaz aralığıyla Sabâ havası kurulur.",
      "meyan": "Çargâh üzerinde Hicaz dizisiyle Nevâ, Acem ve Gerdâniye perdelerine yükselinir.",
      "karar": "Hicaz ve Çargâh üzerinden Segâh kırılarak Dügâh perdesinde hüzünle karar verilir."
    },
    "school": [
      "turk",
      "misir",
      "hicaz"
    ],
    "tags": [
      "huzunlu",
      "dokunakli",
      "yakarici",
      "sabah ezani",
      "nedamet"
    ],
    "difficulty": 2,
    "ruhiTesir": "Mûsiki nazariyatında hüznün en samimi ve saf hali sayılır. Kibri yıkar, ölümü ve haşri hatırlatarak gözyaşı döktürür.",
    "gelenekNotu": [
      "Ölüm ve can çekişme sahneleri",
      "Pişmanlık, tevbe ve sığınma âyetleri",
      "Âhiret mahkemesi ve hesap günleri",
      "Geçmiş kavimlerin helaki"
    ],
    "ezanGelenegi": {
      "metin": "Sabah Ezânı (Seher vaktinin derin sessizliğinde kalbi titreten yakarış)",
      "kaynak": "Geleneksel Türk ve Mısır Ezanı",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "saba-m1",
        "name": {
          "tr": "Çargâh Üzerinde Sabâ Girişi",
          "ar": "مدخل صبا على الجهاركاه",
          "en": "Saba Opening on Chargah"
        },
        "type": "giris",
        "path": [
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 2
          }
        ]
      },
      {
        "id": "saba-m2",
        "name": {
          "tr": "Hicaz Aralığıyla Yükseliş",
          "ar": "صعود بحركة الحجاز",
          "en": "Hijaz Interval Ascent"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 27,
            "beats": 2
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "saba-m3",
        "name": {
          "tr": "Meyan Bölgesi Gerdâniye",
          "ar": "ميانه كردانيه",
          "en": "Meyan at Gerdaniye"
        },
        "type": "asma-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 44,
            "beats": 1
          },
          {
            "abs": 53,
            "beats": 2
          },
          {
            "abs": 44,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "saba-m4",
        "name": {
          "tr": "Sabâ Kararına Hüzünlü İniş",
          "ar": "هبوط صبا الحزين",
          "en": "Melancholic Saba Cadence"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 27,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 2
          },
          {
            "abs": 9,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "ussak",
        "via": "Dügâh",
        "viaAbs": 9,
        "path": [
          {
            "abs": 22
          },
          {
            "abs": 17
          },
          {
            "abs": 9
          }
        ],
        "note": {
          "tr": "Dügâh perdesinde Uşşak/Bayâtî kararına bağlanış."
        }
      },
      {
        "to": "hicaz",
        "via": "Hicaz",
        "viaAbs": 27,
        "path": [
          {
            "abs": 22
          },
          {
            "abs": 27
          },
          {
            "abs": 31
          }
        ],
        "note": {
          "tr": "Hicaz perdesi genişletilerek doğrudan Hicaz makamına geçilir."
        }
      }
    ],
    "confidence": "high",
    "needsReview": false,
    "notlar": "Dügâh'ta Sabâ dörtlüsü + Çargâh'ta Hicaz dizisi (TDV Sabâ). Hicaz perdesinin seyirde 2 koma dik basılması bend alanında belgelendi.",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Sabâ",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/saba--musiki",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "Sabâ tam oktav dizisi TDV verileriyle tamamlandı."
        }
      ]
    },
    "characterTags": [
      "huzunlu",
      "dokunakli",
      "yakarici",
      "sabah ezani",
      "nedamet"
    ],
    "kararName": "Dügâh",
    "description": {
      "tr": "Mûsiki nazariyatında hüznün en samimi ve saf hali sayılır. Kibri yıkar, ölümü ve haşri hatırlatarak gözyaşı döktürür."
    },
    "degrees": [
      {
        "name": {
          "tr": "Dügâh",
          "ar": "Dügâh",
          "en": "Dügâh"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": 9
      },
      {
        "name": {
          "tr": "Segâh",
          "ar": "Segâh",
          "en": "Segâh"
        },
        "komas": 8,
        "arCents": 181,
        "isMicro": false,
        "abs": 17
      },
      {
        "name": {
          "tr": "Çargâh",
          "ar": "Çargâh",
          "en": "Çargâh"
        },
        "komas": 13,
        "arCents": 294,
        "isMicro": true,
        "abs": 22
      },
      {
        "name": {
          "tr": "Hicaz",
          "ar": "Hicaz",
          "en": "Hicaz"
        },
        "komas": 18,
        "arCents": 408,
        "isMicro": false,
        "abs": 27
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 22,
        "arCents": 498,
        "isMicro": true,
        "abs": 31
      },
      {
        "name": {
          "tr": "Acem",
          "ar": "Acem",
          "en": "Acem"
        },
        "komas": 35,
        "arCents": 792,
        "isMicro": true,
        "abs": 44
      },
      {
        "name": {
          "tr": "Gerdâniye",
          "ar": "Gerdâniye",
          "en": "Gerdâniye"
        },
        "komas": 44,
        "arCents": 996,
        "isMicro": false,
        "abs": 53
      },
      {
        "name": {
          "tr": "Muhayyer",
          "ar": "Muhayyer",
          "en": "Muhayyer"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 62
      }
    ],
    "ayahExamples": [
      {
        "id": "saba-ex-1",
        "surah": 89,
        "ayah": 27,
        "endAyah": 30,
        "surahName": "Fecr Sûresi",
        "text": "Fecr Sûresi (27-30. Âyetler: Yâ Eyyetühe'n-Nefsü'l-Mutmainneh)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Tarihe Geçen Sabâ Şaheseri",
        "reciterId": "minshawi_mujawwad",
        "audioUrl": "https://everyayah.com/data/Minshawy_Mujawwad_192kbps/089027.mp3",
        "ayahTextAr": "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ۝ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً ۝ فَادْخُلِي فِي عِبَادِي ۝ وَادْخُلِي جَنَّتِي ۝",
        "ayahTextTr": "Ey huzura kavuşmuş nefis! Sen O'ndan razı, O da senden razı olarak Rabbine dön! Artık gir kullarımın arasına ve gir cennetime!",
        "makamAnalysis": "Sabâ makamının yeryüzündeki en meşhur tilavetidir. Sabâ'nın dar aralıkları, kalbi hüzün ve şefkatle doldururken, Minşâvî'nin sesi teslimiyet ve vuslat gözyaşlarına dönüşür.",
        "verified": true
      },
      {
        "id": "saba-ex-2",
        "surah": 81,
        "ayah": 1,
        "endAyah": 5,
        "surahName": "Tekvîr Sûresi",
        "text": "Tekvîr Sûresi (1-5. Âyetler: Kozmik Kıyamet Sahneleri)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Mücevved Kıyâmet Tasviri",
        "reciterId": "abdulbasit_mujawwad",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/081001.mp3",
        "ayahTextAr": "إِذَا الشَّمْسُ كُوِّرَتْ ۝ وَإِذَا النُّجُومُ انكَدَرَتْ ۝ وَإِذَا الْجِبَالُ سُيِّرَتْ ۝ وَإِذَا الْعِشَارُ عُطِّلَتْ ۝ وَإِذَا الْوُحُوشُ حُشِرَتْ ۝",
        "ayahTextTr": "Güneş dürüldüğü zaman! Yıldızlar kararıp döküldüğü zaman! Dağlar yürütüldüğü zaman! Doğuracak develer başıboş bırakıldığı zaman! Vahşi hayvanlar bir araya toplandığı zaman!",
        "makamAnalysis": "Kıyametin dehşeti ve hüznü Sabâ makamının içli feryadıyla buluşur; Abdülbâsıt'ın nefesi dinleyiciyi mahşer atmosferine taşır.",
        "verified": true
      },
      {
        "id": "saba-ex-3",
        "surah": 50,
        "ayah": 16,
        "endAyah": 17,
        "surahName": "Kâf Sûresi",
        "text": "Kâf Sûresi (16-17. Âyetler: Şah Damarından Daha Yakın)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Huşûlu Mürettel Tilavet",
        "reciterId": "minshawi",
        "audioUrl": "https://everyayah.com/data/Minshawy_Murattal_128kbps/050016.mp3",
        "ayahTextAr": "وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ ۖ وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ ۝ إِذْ يَتَلَقَّى الْمُتَلَقِّيَانِ عَنِ الْيَمِينِ وَعَنِ الشِّمَالِ قَعِيدٌ ۝",
        "ayahTextTr": "Andolsun insanı biz yarattık ve nefsinin ona ne fısıldadığını biliriz. Çünkü biz ona şah damarından daha yakınız. Sağında ve solunda oturan iki alıcı melek yaptıklarını kaydederken...",
        "makamAnalysis": "İnsanın iç muhasebesi ve ilahi yakınlık, Sabâ makamının dokunaklı nağmeleriyle derin bir nedamet ve huşû aşılar.",
        "verified": true
      },
      {
        "id": "saba-ex-4",
        "surah": 69,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "Hâkka Sûresi",
        "text": "Hâkka Sûresi (1-4. Âyetler: Gerçekleşecek Olan Büyük Kıyamet)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Mücevved Kıyâmet Nidası",
        "reciterId": "minshawi_mujawwad",
        "audioUrl": "https://everyayah.com/data/Minshawy_Mujawwad_192kbps/069001.mp3",
        "ayahTextAr": "الْحَاقَّةُ ۝ مَا الْحَاقَّةُ ۝ وَمَا أَدْرَاكَ مَا الْحَاقَّةُ ۝ كَذَّبَتْ ثَمُودُ وَعَادٌ بِالْقَارِعَةِ ۝",
        "ayahTextTr": "Gerçekleşecek olan kıyamet! Nedir o gerçekleşecek olan? O gerçekleşecek olanın ne olduğunu sen nereden bileceksin? Semûd ve Âd kavimleri o çarpıcı felaketi yalanlamışlardı.",
        "makamAnalysis": "Sabâ makamının karar perdelerinden yükselen sarsıcı feryat, âyetin ihtarıyla tam bir ahenk kurar.",
        "verified": true
      }
    ]
  },
  {
    "id": "segah",
    "names": {
      "tr": "Segâh",
      "ar": "سِيكَاه",
      "en": "Sikah"
    },
    "durak": 17,
    "guclu": 31,
    "yeden": 13,
    "seyir": "cikici",
    "dizi": {
      "cikici": [
        17,
        22,
        31,
        40,
        48,
        53,
        65,
        70
      ],
      "inici": null
    },
    "cesniler": [
      {
        "tur": "segah-beslisi",
        "baslangic": 17
      },
      {
        "tur": "hicaz-dortlusu",
        "baslangic": 48
      }
    ],
    "varyantlar": [
      {
        "id": "dik-hisar",
        "degisim": {
          "40": 39
        },
        "not": "Hüseynî yerine dik-hisar kullanılabilir."
      },
      {
        "id": "acemli",
        "degisim": {
          "48": 44
        },
        "not": "Eviç yerine Acem perdesi gelebilir."
      }
    ],
    "yarimKarar": [
      31
    ],
    "asmaKararlar": [
      40,
      48
    ],
    "genisleme": {
      "pest": 13,
      "tiz": 70
    },
    "seyirBolumleri": {
      "zemin": "Segâh perdesinden başlar; Çargâh ve Nevâ'ya yumuşak bir yükseliş yapılır.",
      "meyan": "Nevâ'dan Hüseynî ve Eviç üzerinden Tiz-Segâh bölgesine genişler.",
      "karar": "Eviç ve Nevâ üzerinden Çargâh geçilerek Segâh perdesinde karar verilir."
    },
    "school": [
      "turk",
      "misir",
      "hicaz"
    ],
    "tags": [
      "mistik",
      "vecd",
      "munacat",
      "aksam ezani",
      "itri tekbiri"
    ],
    "difficulty": 2,
    "ruhiTesir": "Mistik bir vecd, derin münâcât, tefekkür ve teslimiyet uyandırır. Türk din mûsikisinin temel makamıdır (Itrî Tekbiri ve Salât-ı Ümmiye).",
    "gelenekNotu": [
      "Tesbih, tenzih ve tevhid âyetleri",
      "Peygamber Efendimiz'e salavat ve muhabbet",
      "Tefekkür ve yaratılış hikmetleri"
    ],
    "ezanGelenegi": {
      "metin": "Akşam Ezânı (Itrî ekolüyle akşamın çabuk kılınışına uygun huşûlu sedâ)",
      "kaynak": "Geleneksel Türk Ezan Tavrı",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "segah-m1",
        "name": {
          "tr": "Segâh Beşlisi Açılışı",
          "ar": "افتتاح خماسي السيكاه",
          "en": "Sikah Fifth Opening"
        },
        "type": "giris",
        "path": [
          {
            "abs": 17,
            "beats": 2
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "segah-m2",
        "name": {
          "tr": "Nevâ Güçlüsü ve Eviç",
          "ar": "النوى والأوج",
          "en": "Neva Dominant & Evic"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 48,
            "beats": 2
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "segah-m3",
        "name": {
          "tr": "Tiz Segâh Meyanı",
          "ar": "ميانه تيز سيكاه",
          "en": "High Sikah Climax"
        },
        "type": "asma-karar",
        "path": [
          {
            "abs": 53,
            "beats": 1
          },
          {
            "abs": 65,
            "beats": 1
          },
          {
            "abs": 70,
            "beats": 2
          },
          {
            "abs": 65,
            "beats": 1
          },
          {
            "abs": 53,
            "beats": 2
          }
        ]
      },
      {
        "id": "segah-m4",
        "name": {
          "tr": "Segâh Kararına Bağlanış",
          "ar": "الاستقرار على السيكاه",
          "en": "Cadence to Sikah"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 48,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "huzzam",
        "via": "Hisar",
        "viaAbs": 36,
        "path": [
          {
            "abs": 17
          },
          {
            "abs": 31
          },
          {
            "abs": 36
          },
          {
            "abs": 48
          }
        ],
        "note": {
          "tr": "Nevâ üzerinde Hisar perdesi kullanılarak Hüzzam makamına geçilir."
        }
      },
      {
        "to": "rast",
        "via": "Rast",
        "viaAbs": 0,
        "path": [
          {
            "abs": 17
          },
          {
            "abs": 9
          },
          {
            "abs": 0
          }
        ],
        "note": {
          "tr": "Dügâh üzerinden Rast perdesine inilerek Rast kararında kalınır."
        }
      },
      {
        "to": "ussak",
        "via": "Dügâh",
        "viaAbs": 9,
        "path": [
          {
            "abs": 17
          },
          {
            "abs": 9
          }
        ],
        "note": {
          "tr": "Dügâh perdesine inilerek Uşşak makamına geçki yapılır."
        }
      }
    ],
    "confidence": "high",
    "needsReview": false,
    "notlar": "Segâh beşlisi + Eviç'te Hicaz dörtlüsü (TDV Segâh). Karar frekansı 244.3 Hz civarıdır (247 Hz doğal Si DEĞİL).",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Segâh",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/segah--musiki",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "Karar frekansı 244.3 Hz koma hesabıyla düzeltildi."
        }
      ]
    },
    "characterTags": [
      "mistik",
      "vecd",
      "munacat",
      "aksam ezani",
      "itri tekbiri"
    ],
    "kararName": "Segâh",
    "description": {
      "tr": "Mistik bir vecd, derin münâcât, tefekkür ve teslimiyet uyandırır. Türk din mûsikisinin temel makamıdır (Itrî Tekbiri ve Salât-ı Ümmiye)."
    },
    "degrees": [
      {
        "name": {
          "tr": "Segâh",
          "ar": "Segâh",
          "en": "Segâh"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": 17
      },
      {
        "name": {
          "tr": "Çargâh",
          "ar": "Çargâh",
          "en": "Çargâh"
        },
        "komas": 5,
        "arCents": 113,
        "isMicro": true,
        "abs": 22
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 14,
        "arCents": 317,
        "isMicro": true,
        "abs": 31
      },
      {
        "name": {
          "tr": "Hüseynî",
          "ar": "Hüseynî",
          "en": "Hüseynî"
        },
        "komas": 23,
        "arCents": 521,
        "isMicro": true,
        "abs": 40
      },
      {
        "name": {
          "tr": "Eviç",
          "ar": "Eviç",
          "en": "Eviç"
        },
        "komas": 31,
        "arCents": 702,
        "isMicro": true,
        "abs": 48
      },
      {
        "name": {
          "tr": "Gerdâniye",
          "ar": "Gerdâniye",
          "en": "Gerdâniye"
        },
        "komas": 36,
        "arCents": 815,
        "isMicro": false,
        "abs": 53
      },
      {
        "name": {
          "tr": "Nîm-Şehnaz",
          "ar": "Nîm-Şehnaz",
          "en": "Nîm-Şehnaz"
        },
        "komas": 48,
        "arCents": 1087,
        "isMicro": false,
        "abs": 65
      },
      {
        "name": {
          "tr": "Tiz-Segâh",
          "ar": "Tiz-Segâh",
          "en": "Tiz-Segâh"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 70
      }
    ],
    "ayahExamples": [
      {
        "id": "segah-ex-1",
        "surah": 24,
        "ayah": 35,
        "endAyah": 35,
        "surahName": "Nûr Sûresi",
        "text": "Nûr Sûresi (35. Âyet: Âyetü'n-Nûr / Nur Üstüne Nur)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Mücevved İrfan Tilaveti",
        "reciterId": "abdulbasit_mujawwad",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/024035.mp3",
        "ayahTextAr": "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ الْمِصْبَاحُ فِي زُجَاجَةٍ ۖ الزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ يُوقَدُ مِن شَجَرَةٍ مُّبَارَكَةٍ زَيْتُونَةٍ لَّا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِيءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ ۚ نُّورٌ عَلَىٰ نُورٍ ۝",
        "ayahTextTr": "Allah, göklerin ve yerin nurudur. O'nun nurunun temsili, içinde lamba bulunan bir kandillik gibidir. O lamba bir cam içindedir; o cam sanki inciden bir yıldızdır... Nur üstüne nurdur!",
        "makamAnalysis": "Segâh makamının mistik ve tefekkür yüklü tabiatı, Âyetü'n-Nûr'un ışıl ışıl manasıyla birleştiğinde tasavvufi ve irfani bir mirac hissi uyandırır.",
        "verified": true
      },
      {
        "id": "segah-ex-2",
        "surah": 94,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "İnşirâh Sûresi",
        "text": "İnşirâh Sûresi (1-4. Âyetler: Göğsün Genişletilmesi ve Şan)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Gönülleri Ferahlatan Tertîl",
        "reciterId": "abdulbasit",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/094001.mp3",
        "ayahTextAr": "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ ۝ الَّذِي أَنقَضَ ظَهْرَكَ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَ ۝",
        "ayahTextTr": "Biz senin göğsünü açıp genişletmedik mi? Belini büken yükünü üzerinden kaldırıp atmadık mı? Ve senin şanını yüceltmedik mi?",
        "makamAnalysis": "Segâh'ın fıtrî koma bemolü, göğsü daralan kalplere manevi bir inşirah ve genişlik aşılar.",
        "verified": true
      },
      {
        "id": "segah-ex-3",
        "surah": 56,
        "ayah": 10,
        "endAyah": 14,
        "surahName": "Vâkıa Sûresi",
        "text": "Vâkıa Sûresi (10-14. Âyetler: es-Sâbikûn / Hayırda Öncü Olanlar)",
        "reciter": "Şeyh Mustafa İsmail",
        "reciterTitle": "Makamlar Şahı",
        "reciterId": "mustafa_ismail",
        "audioUrl": "https://everyayah.com/data/Mustafa_Ismail_48kbps/056010.mp3",
        "ayahTextAr": "وَالسَّابِقُونَ السَّابِقُونَ ۝ أُولَٰئِكَ الْمُقَرَّبُونَ ۝ فِي جَنَّاتِ النَّعِيمِ ۝ ثُلَّةٌ مِّنَ الْأَوَّلِينَ ۝ وَقَلِيلٌ مِّنَ الْآخِرِينَ ۝",
        "ayahTextTr": "Hayırda öne geçenler ise öne geçenlerdir. İşte onlar Allah'a en yakın olanlardır. Nimet cennetlerindedirler. Birçoğu önceki ümmetlerdendir, birazı da sonrakilerdendir.",
        "makamAnalysis": "Mustafa İsmail, mukarreblerin derecelerini Segâh'ın narin geçkileriyle ve meyan perdelerinde yükselerek tasvir eder.",
        "verified": true
      },
      {
        "id": "segah-ex-4",
        "surah": 53,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "Necm Sûresi",
        "text": "Necm Sûresi (1-4. Âyetler: Kayan Yıldız ve Vahiy Hakikati)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Mücevved Tilavet Anıtı",
        "reciterId": "abdulbasit_mujawwad",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/053001.mp3",
        "ayahTextAr": "وَالنَّجْمِ إِذَا هَوَىٰ ۝ مَا ضَلَّ صَاحِبُكُمْ وَمَا غَوَىٰ ۝ وَمَا يَنطِقُ عَنِ الْهَوَىٰ ۝ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ ۝",
        "ayahTextTr": "Battığı zaman yıldıza andolsun ki, arkadaşınız (Muhammed) sapmadı ve batıla yönelmedi. O kendi arzusuna göre de konuşmaz. O, kendisine vahyedilen bir vahiyden başka bir şey değildir.",
        "makamAnalysis": "Yıldızların süzülüşü ve vahy-i ilahinin berraklığı, Segâh perdesinin zarif nağmeleriyle semavi bir ufka taşınır.",
        "verified": true
      }
    ]
  },
  {
    "id": "kurdi",
    "names": {
      "tr": "Kürdî",
      "ar": "كُرْدِي",
      "en": "Kurdi"
    },
    "durak": 9,
    "guclu": 31,
    "yeden": 0,
    "seyir": "cikici",
    "dizi": {
      "cikici": [
        9,
        13,
        22,
        31,
        40,
        44,
        53,
        62
      ],
      "inici": null
    },
    "cesniler": [
      {
        "tur": "kurdi-dortlusu",
        "baslangic": 9
      },
      {
        "tur": "buselik-beslisi",
        "baslangic": 31
      }
    ],
    "yarimKarar": [
      31
    ],
    "asmaKararlar": [
      13,
      22
    ],
    "genisleme": {
      "pest": 0,
      "tiz": 62
    },
    "seyirBolumleri": {
      "zemin": "Dügâh civarından başlar; küçük ikili (Kürdî) perdesi belirgin duyurularak Nevâ'ya çıkılır.",
      "meyan": "Nevâ üzerinde Bûselik veya Çargâh çeşnileriyle Gerdâniye ve Muhayyer seslerinde dolaşılır.",
      "karar": "Nevâ'dan Çargâh ve Kürdî perdesi üzerinden Dügâh'ta karar verilir."
    },
    "school": [
      "hicaz",
      "misir",
      "turk"
    ],
    "tags": [
      "akici",
      "husu",
      "haremeyn tavri",
      "teravih",
      "duygusal"
    ],
    "difficulty": 1,
    "ruhiTesir": "Akıcılık, huşû ve içtenlik telkin eder. Çağdaş Haremeyn kıraat ekolünün (Mekke/Medine teravihleri) en çok tercih ettiği makamdır.",
    "gelenekNotu": [
      "Müjde ve rahmet âyetleri",
      "Kıyamet ve hesap sahnelerinin hüzünlü anlatımı",
      "Kısa ve ritmik sûreler"
    ],
    "ezanGelenegi": {
      "metin": "Yatsı ve Teravih Namazları (Mekke ve Medine Haremeyn tavrı)",
      "kaynak": "Çağdaş Haremeyn Uygulamaları",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "kurdi-m1",
        "name": {
          "tr": "Kürdî Dörtlüsü Girişi",
          "ar": "مدخل رباعي الكرد",
          "en": "Kurdi Tetrachord Opening"
        },
        "type": "giris",
        "path": [
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 13,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "kurdi-m2",
        "name": {
          "tr": "Nevâ Güçlüsü ve Bûselik",
          "ar": "النوى وبوسليك",
          "en": "Neva Dominant & Buselik"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 44,
            "beats": 1
          },
          {
            "abs": 53,
            "beats": 2
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "kurdi-m3",
        "name": {
          "tr": "Kürdî Kararına İniş",
          "ar": "الهبوط إلى دوكاه كرد",
          "en": "Cadence to Dugah"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 13,
            "beats": 2
          },
          {
            "abs": 9,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "nihavend",
        "via": "Çargâh",
        "viaAbs": 22,
        "path": [
          {
            "abs": 13
          },
          {
            "abs": 22
          },
          {
            "abs": 31
          }
        ],
        "note": {
          "tr": "Çargâh üzerinde Bûselik çeşnisiyle Nihavend makamına geçilir."
        }
      },
      {
        "to": "ussak",
        "via": "Segâh",
        "viaAbs": 17,
        "path": [
          {
            "abs": 13
          },
          {
            "abs": 17
          },
          {
            "abs": 9
          }
        ],
        "note": {
          "tr": "Kürdî perdesi yerine Segâh koması basılarak Uşşak'a bağlanılır."
        }
      },
      {
        "to": "hicaz",
        "via": "Dik-Kürdî",
        "viaAbs": 14,
        "path": [
          {
            "abs": 9
          },
          {
            "abs": 14
          },
          {
            "abs": 26
          },
          {
            "abs": 31
          }
        ],
        "note": {
          "tr": "Nîm-Hicaz perdesi alınarak Hicaz makamına geçki yapılır."
        }
      }
    ],
    "confidence": "high",
    "needsReview": false,
    "notlar": "TDV Kürdî: Çıkıcı veya bazen çıkıcı-inici. Eski blueprint inici-çıkıcı yazmıştı.",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Kürdî",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/kurdi--musiki",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "Seyir türü çıkıcı olarak TDV'ye göre güncellendi."
        }
      ]
    },
    "characterTags": [
      "akici",
      "husu",
      "haremeyn tavri",
      "teravih",
      "duygusal"
    ],
    "kararName": "Dügâh",
    "description": {
      "tr": "Akıcılık, huşû ve içtenlik telkin eder. Çağdaş Haremeyn kıraat ekolünün (Mekke/Medine teravihleri) en çok tercih ettiği makamdır."
    },
    "degrees": [
      {
        "name": {
          "tr": "Dügâh",
          "ar": "Dügâh",
          "en": "Dügâh"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": 9
      },
      {
        "name": {
          "tr": "Kürdî",
          "ar": "Kürdî",
          "en": "Kürdî"
        },
        "komas": 4,
        "arCents": 91,
        "isMicro": false,
        "abs": 13
      },
      {
        "name": {
          "tr": "Çargâh",
          "ar": "Çargâh",
          "en": "Çargâh"
        },
        "komas": 13,
        "arCents": 294,
        "isMicro": true,
        "abs": 22
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 22,
        "arCents": 498,
        "isMicro": true,
        "abs": 31
      },
      {
        "name": {
          "tr": "Hüseynî",
          "ar": "Hüseynî",
          "en": "Hüseynî"
        },
        "komas": 31,
        "arCents": 702,
        "isMicro": true,
        "abs": 40
      },
      {
        "name": {
          "tr": "Acem",
          "ar": "Acem",
          "en": "Acem"
        },
        "komas": 35,
        "arCents": 792,
        "isMicro": true,
        "abs": 44
      },
      {
        "name": {
          "tr": "Gerdâniye",
          "ar": "Gerdâniye",
          "en": "Gerdâniye"
        },
        "komas": 44,
        "arCents": 996,
        "isMicro": false,
        "abs": 53
      },
      {
        "name": {
          "tr": "Muhayyer",
          "ar": "Muhayyer",
          "en": "Muhayyer"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 62
      }
    ],
    "ayahExamples": [
      {
        "id": "kurdi-ex-1",
        "surah": 94,
        "ayah": 1,
        "endAyah": 8,
        "surahName": "İnşirâh Sûresi",
        "text": "İnşirâh Sûresi (1-8. Âyetler: Tam Sûre / Kolaylık Müjdesi)",
        "reciter": "Şeyh Yâsir ed-Devserî",
        "reciterTitle": "Kâbe İmamı (Duygu ve Coşku)",
        "reciterId": "dossary",
        "audioUrl": "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/094001.mp3",
        "ayahTextAr": "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ ۝ الَّذِي أَنقَضَ ظَهْرَكَ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَ ۝ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب ۝",
        "ayahTextTr": "Biz senin göğsünü açıp genişletmedik mi? Yükünü üzerinden atmadık mı? Şanını yüceltmedik mi? Elbette zorlukla beraber bir kolaylık vardır! Öyleyse bir işi bitirince diğerine koyul ve yalnız Rabbine yönel!",
        "makamAnalysis": "Devserî'nin Kâbe'de milyonları cezbeden meşhur Kürdî tilavetidir. Tam sûre kesintisiz okunur; Kürdî'nin doğal, hüzünlü ve umut dolu melodisi ruhu sarsar.",
        "verified": true
      },
      {
        "id": "kurdi-ex-2",
        "surah": 67,
        "ayah": 1,
        "endAyah": 2,
        "surahName": "Mülk Sûresi",
        "text": "Mülk Sûresi (1-2. Âyetler: Hükümranlık ve İmtihan)",
        "reciter": "Şeyh Nâsır el-Katâmî",
        "reciterTitle": "Modern Hicaz & Körfez Ekolü",
        "reciterId": "katami",
        "audioUrl": "https://everyayah.com/data/Nasser_Alqatami_128kbps/067001.mp3",
        "ayahTextAr": "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ۝",
        "ayahTextTr": "Mülk elinde olan Allah yüceler yücesidir. O, her şeye hakkıyla güç yetirendir. Hanginizin daha güzel amel işleyeceğini denemek için ölümü ve hayatı yaratan O'dur.",
        "makamAnalysis": "Katâmî'nin kendine has duygusal üslubuyla icra ettiği Kürdî tilavetidir; genç kuşakların tilavete ısınmasında büyük rol oynamıştır.",
        "verified": true
      },
      {
        "id": "kurdi-ex-3",
        "surah": 1,
        "ayah": 1,
        "endAyah": 7,
        "surahName": "Fâtiha Sûresi",
        "text": "Fâtiha Sûresi (1-7. Âyetler: Tam Sûre / Ümmü'l-Kitâb)",
        "reciter": "Şeyh Meşâri Râşid el-Afâsî",
        "reciterTitle": "Dünyaca Ünlü Berrak Kıraat",
        "reciterId": "alafasy",
        "audioUrl": "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
        "ayahTextAr": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝",
        "ayahTextTr": "Rahmân ve Rahîm olan Allah'ın adıyla. Hamd âlemlerin Rabbi Allah'a mahsustur... Yalnız Sana kulluk eder, yalnız Senden yardım dileriz. Bizi doğru yola ilet...",
        "makamAnalysis": "Afâsî'nin bütün dünyada ezberlenen eksiksiz Kürdî Fâtiha'sıdır; Fâtiha'nın 7 âyeti boyunca Kürdî makamının yalın ve berrak yapısını tanıtır.",
        "verified": true
      },
      {
        "id": "kurdi-ex-4",
        "surah": 75,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "Kıyâme Sûresi",
        "text": "Kıyâme Sûresi (1-4. Âyetler: Diriliş Yemini ve Azamet)",
        "reciter": "Şeyh Yâsir ed-Devserî",
        "reciterTitle": "Kâbe İmamı (Makam & Haşyet)",
        "reciterId": "dossary",
        "audioUrl": "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/075001.mp3",
        "ayahTextAr": "لَا أُقْسِمُ بِيَوْمِ الْقِيَامَةِ ۝ وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ ۝ أَيَحْسَبُ الْإِنسَانُ أَلَّن نَّجْمَعَ عِظَامَهُ ۝ بَلَىٰ قَادِرِينَ عَلَىٰ أَن نُّسَوِّيَ بَنَانَهُ ۝",
        "ayahTextTr": "Kıyamet gününe yemin ederim! Ve kendini kınayan nefse yemin ederim! İnsan kemiklerini toplayamayacağımızı mı sanır? Evet, parmak uçlarını bile tastamam düzenlemeye gücümüz yeter.",
        "makamAnalysis": "Devserî'nin heyecan ve haşyet dolu Kıyâme tilaveti, Kürdî makamının dinamik perde geçişlerini gözler önüne serer.",
        "verified": true
      }
    ]
  },
  {
    "id": "acem",
    "names": {
      "tr": "Acem",
      "ar": "عَجَم",
      "en": "Ajam"
    },
    "durak": -9,
    "guclu": 22,
    "yeden": -13,
    "seyir": "inici-cikici",
    "dizi": {
      "cikici": [
        -9,
        0,
        9,
        13,
        22,
        31,
        40,
        44
      ],
      "inici": null
    },
    "cesniler": [
      {
        "tur": "cargah-dizisi-transpoze",
        "baslangic": -9
      },
      {
        "tur": "cargah-beslisi",
        "baslangic": 22
      }
    ],
    "yarimKarar": [
      22
    ],
    "asmaKararlar": [
      0,
      9
    ],
    "genisleme": {
      "pest": -13,
      "tiz": 44
    },
    "seyirBolumleri": {
      "zemin": "Çargâh veya Acem-Aşîran civarından başlar; majör karakterli berrak sesler duyurulur.",
      "meyan": "Çargâh ve Nevâ üzerinde parıldayan perdelerle tiz bölgeye çıkılır.",
      "karar": "Nevâ ve Çargâh'tan Dügâh ve Rast geçilerek Acem-Aşîran perdesinde tam karar verilir."
    },
    "school": [
      "misir",
      "turk",
      "hicaz"
    ],
    "tags": [
      "zafer",
      "izzet",
      "san",
      "azamet",
      "bayram"
    ],
    "difficulty": 2,
    "ruhiTesir": "Zafer, sevinç, azamet, izzet ve ilahi şan duygusu verir. Batı mûsikisindeki majör tonla birebir örtüşür.",
    "gelenekNotu": [
      "İlahi zafer ve fetih âyetleri",
      "Müminlerin izzet ve üstünlüğü",
      "Kâinatın ilahi nizamı ve azameti"
    ],
    "ezanGelenegi": {
      "metin": "Cuma ve Bayram Namazları (Büyük toplanma ve bayram neşesi)",
      "kaynak": "Geleneksel Türk Din Mûsikisi",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "acem-m1",
        "name": {
          "tr": "Acem-Aşîran Girişi",
          "ar": "مدخل عجم عشيران",
          "en": "Ajam Ashiran Opening"
        },
        "type": "giris",
        "path": [
          {
            "abs": -9,
            "beats": 1
          },
          {
            "abs": 0,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 2
          }
        ]
      },
      {
        "id": "acem-m2",
        "name": {
          "tr": "Çargâh Güçlüsü Açılımı",
          "ar": "انفتاح الجهاركاه",
          "en": "Chargah Dominant Pivot"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 2
          },
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 2
          }
        ]
      },
      {
        "id": "acem-m3",
        "name": {
          "tr": "Acem Perdesi Zirvesi",
          "ar": "ذروة العجم",
          "en": "Ajam Climax"
        },
        "type": "asma-karar",
        "path": [
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 44,
            "beats": 2
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "acem-m4",
        "name": {
          "tr": "Acem-Aşîran Kararına Dönüş",
          "ar": "الرجوع إلى قرار عجم عشيران",
          "en": "Cadence to Ajam Ashiran"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 1
          },
          {
            "abs": 0,
            "beats": 1
          },
          {
            "abs": -9,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "rast",
        "via": "Rast",
        "viaAbs": 0,
        "path": [
          {
            "abs": -9
          },
          {
            "abs": 0
          }
        ],
        "note": {
          "tr": "Rast perdesine basılarak Rast makamına geçilir."
        }
      },
      {
        "to": "nihavend",
        "via": "Çargâh",
        "viaAbs": 22,
        "path": [
          {
            "abs": 9
          },
          {
            "abs": 13
          },
          {
            "abs": 22
          }
        ],
        "note": {
          "tr": "Çargâh üzerinde Bûselik sesleriyle Nihavend'e bağlanılır."
        }
      },
      {
        "to": "kurdi",
        "via": "Dügâh",
        "viaAbs": 9,
        "path": [
          {
            "abs": 22
          },
          {
            "abs": 13
          },
          {
            "abs": 9
          }
        ],
        "note": {
          "tr": "Dügâh perdesinde Kürdî kararına inilir."
        }
      }
    ],
    "confidence": "medium",
    "needsReview": true,
    "notlar": "Acem-aşîran makamı: Çargâh dizisinin Acem-aşîran perdesine (-9) göçürülmüş halidir. Eski blueprint C4 kararlı transpoze sürüm vermişti.",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Acem-Aşîran",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/acem-asiran",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "Doğal durak Acem-Aşîran (-9) olarak ayarlandı."
        }
      ]
    },
    "characterTags": [
      "zafer",
      "izzet",
      "san",
      "azamet",
      "bayram"
    ],
    "kararName": "Acem-Aşîran",
    "description": {
      "tr": "Zafer, sevinç, azamet, izzet ve ilahi şan duygusu verir. Batı mûsikisindeki majör tonla birebir örtüşür."
    },
    "degrees": [
      {
        "name": {
          "tr": "Acem-Aşîran",
          "ar": "Acem-Aşîran",
          "en": "Acem-Aşîran"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": -9
      },
      {
        "name": {
          "tr": "Rast",
          "ar": "Rast",
          "en": "Rast"
        },
        "komas": 9,
        "arCents": 204,
        "isMicro": false,
        "abs": 0
      },
      {
        "name": {
          "tr": "Dügâh",
          "ar": "Dügâh",
          "en": "Dügâh"
        },
        "komas": 18,
        "arCents": 408,
        "isMicro": false,
        "abs": 9
      },
      {
        "name": {
          "tr": "Kürdî",
          "ar": "Kürdî",
          "en": "Kürdî"
        },
        "komas": 22,
        "arCents": 498,
        "isMicro": true,
        "abs": 13
      },
      {
        "name": {
          "tr": "Çargâh",
          "ar": "Çargâh",
          "en": "Çargâh"
        },
        "komas": 31,
        "arCents": 702,
        "isMicro": true,
        "abs": 22
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 40,
        "arCents": 906,
        "isMicro": false,
        "abs": 31
      },
      {
        "name": {
          "tr": "Hüseynî",
          "ar": "Hüseynî",
          "en": "Hüseynî"
        },
        "komas": 49,
        "arCents": 1109,
        "isMicro": true,
        "abs": 40
      },
      {
        "name": {
          "tr": "Acem",
          "ar": "Acem",
          "en": "Acem"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 44
      }
    ],
    "ayahExamples": [
      {
        "id": "acem-ex-1",
        "surah": 48,
        "ayah": 1,
        "endAyah": 3,
        "surahName": "Fetih Sûresi",
        "text": "Fetih Sûresi (1-3. Âyetler: Feth-i Mübîn ve Aziz Zafer)",
        "reciter": "Şeyh Mustafa İsmail",
        "reciterTitle": "Mısır Radyosu Baş Kârisi",
        "reciterId": "mustafa_ismail",
        "audioUrl": "https://everyayah.com/data/Mustafa_Ismail_48kbps/048001.mp3",
        "ayahTextAr": "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا ۝ لِيَغْفِرَ لَكَ اللَّهُ مَا تَقَدَّمَ مِن ذَنبِكَ وَمَا تَأَخَّرَ وَيُتِمَّ نِعْمَتَهُ عَلَيْكَ وَيَهْدِيَكَ صِرَاطًا مُّسْتَقِيمًا ۝ وَيَنصُرَكَ اللَّهُ نَصْرًا عَزِيزًا ۝",
        "ayahTextTr": "Şüphesiz biz sana apaçık bir fetih verdik. Ta ki Allah geçmiş ve gelecek günahlarını bağışlasın, nimetini tamamlasın ve sana şanlı bir zaferle yardım etsin.",
        "makamAnalysis": "Acem (Acemaşîran) makamının Batı majör dizisine denk düşen muzaffer, celalli ve parlak havası, fethin müjdesiyle kusursuz örtüşür.",
        "verified": true
      },
      {
        "id": "acem-ex-2",
        "surah": 110,
        "ayah": 1,
        "endAyah": 3,
        "surahName": "Nasr Sûresi",
        "text": "Nasr Sûresi (1-3. Âyetler: Tam Sûre / Zafer ve Tevbe)",
        "reciter": "Mahmûd Halîl el-Husarî",
        "reciterTitle": "Tertîl Rehberi",
        "reciterId": "husary",
        "audioUrl": "https://everyayah.com/data/Husary_128kbps/110001.mp3",
        "ayahTextAr": "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۝ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ۝ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا ۝",
        "ayahTextTr": "Allah'ın yardımı ve fetih geldiğinde; insanların bölük bölük Allah'ın dinine girdiğini gördüğünde, Rabbini hamd ile tesbih et ve O'ndan bağışlanma dile! Çünkü O tevbeleri çokça kabul edendir.",
        "makamAnalysis": "Sûrenin tamamı Acem makamının parlak ve ferahlatıcı kararıyla icra edilir; kısa sûrelerde makam bütünlüğünün nasıl korunacağını öğretir.",
        "verified": true
      },
      {
        "id": "acem-ex-3",
        "surah": 112,
        "ayah": 1,
        "endAyah": 4,
        "surahName": "İhlâs Sûresi",
        "text": "İhlâs Sûresi (1-4. Âyetler: Tam Sûre / Tevhidin Zirvesi)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Huşûlu Mürettel İcrası",
        "reciterId": "abdulbasit",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/112001.mp3",
        "ayahTextAr": "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ۝",
        "ayahTextTr": "De ki: O Allah tektir. Allah Samed'dir. O doğurmamış ve doğmamıştır. O'nun hiçbir dengi yoktur.",
        "makamAnalysis": "Tevhid akidesinin kesin ve sarsılmaz hükümleri, Acem makamının tok ve net sesleriyle taçlanır.",
        "verified": true
      },
      {
        "id": "acem-ex-4",
        "surah": 3,
        "ayah": 133,
        "endAyah": 134,
        "surahName": "Âl-i İmrân Sûresi",
        "text": "Âl-i İmrân Sûresi (133-134. Âyetler: Mağfiret ve Cennet Yarışı)",
        "reciter": "Mahmûd Halîl el-Husarî",
        "reciterTitle": "Kıraat Otoritesi",
        "reciterId": "husary",
        "audioUrl": "https://everyayah.com/data/Husary_128kbps/003133.mp3",
        "ayahTextAr": "وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ وَجَنَّةٍ عَرْضُهَا السَّمَاوَاتُ وَالْأَرْضُ أُعِدَّتْ لِلْمُتَّقِينَ ۝ الَّذِينَ يُنفِقُونَ فِي السَّرَّاءِ وَالضَّرَّاءِ وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ ۝",
        "ayahTextTr": "Rabbinizin bağışına ve takva sahipleri için hazırlanmış, genişliği gökler ve yer kadar olan cennete koşuşun! Onlar bollukta da darlıkta da infak ederler, öfkelerini yutarlar ve insanları affederler...",
        "makamAnalysis": "Cennete koşuş çağrısı, Acem makamının coşkulu, teşvik edici ve umut aşılayan nağmeleriyle seslendirilir.",
        "verified": true
      }
    ]
  },
  {
    "id": "neva",
    "names": {
      "tr": "Nevâ",
      "ar": "نَوَى",
      "en": "Nawa"
    },
    "durak": 9,
    "guclu": 31,
    "yeden": 0,
    "seyir": "inici-cikici",
    "dizi": {
      "cikici": [
        9,
        17,
        22,
        31,
        40,
        48,
        53,
        62
      ],
      "inici": null
    },
    "cesniler": [
      {
        "tur": "usak-dortlusu",
        "baslangic": 9
      },
      {
        "tur": "rast-beslisi",
        "baslangic": 31
      }
    ],
    "varyantlar": [
      {
        "id": "buselik-uzeri",
        "dizi": [
          9,
          17,
          22,
          31,
          40,
          44,
          53,
          62
        ],
        "not": "Nevâ'da Bûselik beşlisi varyantı."
      }
    ],
    "yarimKarar": [
      31
    ],
    "asmaKararlar": [
      17,
      22
    ],
    "genisleme": {
      "pest": 0,
      "tiz": 62
    },
    "seyirBolumleri": {
      "zemin": "Nevâ perdesinden veya civarından başlar; güçlü etrafında vakarla salınır.",
      "meyan": "Nevâ üzerinde Rast veya Bûselik beşlisiyle Gerdâniye ve Muhayyer'e yükselir.",
      "karar": "Nevâ'dan Çargâh ve Segâh geçilerek Dügâh'ta karar verilir."
    },
    "school": [
      "turk",
      "misir"
    ],
    "tags": [
      "hikmet",
      "suknet",
      "vusat",
      "ogle ezani",
      "vakar"
    ],
    "difficulty": 3,
    "ruhiTesir": "Hikmetli bir sükûnet, vüs'at (genişlik) ve ruh ferahlığı verir. İcrası en çok ustalık isteyen klasik makamlardandır.",
    "gelenekNotu": [
      "Hikmet ve ibret dolu meseller",
      "Kâinatın mükemmel yaratılışı",
      "İlahi irade ve takdir âyetleri"
    ],
    "ezanGelenegi": {
      "metin": "Öğle ve İkindi Ezânı (Günün vakar dolu dingin vakitleri)",
      "kaynak": "Klasik Osmanlı Ezan Tavrı",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "neva-m1",
        "name": {
          "tr": "Nevâ Perdesinde Zemin",
          "ar": "ارتكاز على النوى",
          "en": "Neva Center Opening"
        },
        "type": "giris",
        "path": [
          {
            "abs": 31,
            "beats": 2
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          },
          {
            "abs": 22,
            "beats": 1
          }
        ]
      },
      {
        "id": "neva-m2",
        "name": {
          "tr": "Nevâ'da Rast Beşlisi",
          "ar": "خماسي الراست على النوى",
          "en": "Rast Fifth on Neva"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 40,
            "beats": 1
          },
          {
            "abs": 48,
            "beats": 1
          },
          {
            "abs": 53,
            "beats": 2
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "neva-m3",
        "name": {
          "tr": "Dügâh Kararına İniş",
          "ar": "الهبوط إلى دوكاه",
          "en": "Cadence to Dugah"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 1
          },
          {
            "abs": 9,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "ussak",
        "via": "Dügâh",
        "viaAbs": 9,
        "path": [
          {
            "abs": 31
          },
          {
            "abs": 22
          },
          {
            "abs": 17
          },
          {
            "abs": 9
          }
        ],
        "note": {
          "tr": "Uşşak dörtlüsüyle doğrudan Uşşak kararına bağlanılır."
        }
      },
      {
        "to": "rast",
        "via": "Rast",
        "viaAbs": 0,
        "path": [
          {
            "abs": 9
          },
          {
            "abs": 0
          }
        ],
        "note": {
          "tr": "Rast perdesine inilerek Rast kararında kalınır."
        }
      },
      {
        "to": "segah",
        "via": "Segâh",
        "viaAbs": 17,
        "path": [
          {
            "abs": 31
          },
          {
            "abs": 22
          },
          {
            "abs": 17
          }
        ],
        "note": {
          "tr": "Segâh perdesinde asılarak Segâh makamına geçilir."
        }
      }
    ],
    "confidence": "medium",
    "needsReview": true,
    "notlar": "Nevâ makamı dizisi: Dügâh'ta Uşşak dörtlüsü + Nevâ'da Rast (veya Bûselik) beşlisi (TDV Tâhir/Nevâ). Tâhir makamından seyir ile ayrılır.",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Nevâ",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/neva--musiki",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "Nevâ dizisi ve Tâhir ayrımı TDV'ye göre belgelendi."
        }
      ]
    },
    "characterTags": [
      "hikmet",
      "suknet",
      "vusat",
      "ogle ezani",
      "vakar"
    ],
    "kararName": "Dügâh",
    "description": {
      "tr": "Hikmetli bir sükûnet, vüs'at (genişlik) ve ruh ferahlığı verir. İcrası en çok ustalık isteyen klasik makamlardandır."
    },
    "degrees": [
      {
        "name": {
          "tr": "Dügâh",
          "ar": "Dügâh",
          "en": "Dügâh"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": 9
      },
      {
        "name": {
          "tr": "Segâh",
          "ar": "Segâh",
          "en": "Segâh"
        },
        "komas": 8,
        "arCents": 181,
        "isMicro": false,
        "abs": 17
      },
      {
        "name": {
          "tr": "Çargâh",
          "ar": "Çargâh",
          "en": "Çargâh"
        },
        "komas": 13,
        "arCents": 294,
        "isMicro": true,
        "abs": 22
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 22,
        "arCents": 498,
        "isMicro": true,
        "abs": 31
      },
      {
        "name": {
          "tr": "Hüseynî",
          "ar": "Hüseynî",
          "en": "Hüseynî"
        },
        "komas": 31,
        "arCents": 702,
        "isMicro": true,
        "abs": 40
      },
      {
        "name": {
          "tr": "Eviç",
          "ar": "Eviç",
          "en": "Eviç"
        },
        "komas": 39,
        "arCents": 883,
        "isMicro": true,
        "abs": 48
      },
      {
        "name": {
          "tr": "Gerdâniye",
          "ar": "Gerdâniye",
          "en": "Gerdâniye"
        },
        "komas": 44,
        "arCents": 996,
        "isMicro": false,
        "abs": 53
      },
      {
        "name": {
          "tr": "Muhayyer",
          "ar": "Muhayyer",
          "en": "Muhayyer"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 62
      }
    ],
    "ayahExamples": [
      {
        "id": "neva-ex-1",
        "surah": 78,
        "ayah": 1,
        "endAyah": 5,
        "surahName": "Nebe Sûresi",
        "text": "Nebe Sûresi (1-5. Âyetler: Büyük Haber ve Kıyamet)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Huşûlu Mürettel Tilavet",
        "reciterId": "minshawi",
        "audioUrl": "https://everyayah.com/data/Minshawy_Murattal_128kbps/078001.mp3",
        "ayahTextAr": "عَمَّ يَتَسَاءَلُونَ ۝ عَنِ النَّبَإِ الْعَظِيمِ ۝ الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ ۝ كَلَّا سَيَعْلَمُونَ ۝ ثُمَّ كَلَّا سَيَعْلَمُونَ ۝",
        "ayahTextTr": "Neyi sorup duruyorlar birbirlerine? O büyük haberi mi? Hani üzerinde anlaşmazlığa düştükleri şeyi? Hayır! Yakında bilecekler! Yine hayır! Yakında bilecekler!",
        "makamAnalysis": "Nevâ makamı (Re / D4) tiz karar ekseninde canlı, sorgulayıcı ve dinamik bir havaya sahiptir. Nebe Sûresi'nin sorgulayan girişi Nevâ nağmeleriyle canlanır.",
        "verified": true
      },
      {
        "id": "neva-ex-2",
        "surah": 31,
        "ayah": 12,
        "endAyah": 13,
        "surahName": "Lokmân Sûresi",
        "text": "Lokmân Sûresi (12-13. Âyetler: Hikmet ve Evlada Öğüt)",
        "reciter": "Mahmûd Halîl el-Husarî",
        "reciterTitle": "Tertîl Rehberi",
        "reciterId": "husary",
        "audioUrl": "https://everyayah.com/data/Husary_128kbps/031012.mp3",
        "ayahTextAr": "وَلَقَدْ آتَيْنَا لُقْمَانَ الْحِكْمَةَ أَنِ اشْكُرْ لِلَّهِ ۚ وَمَن يَشْكُرْ فَإِنَّمَا يَشْكُرُ لِنَفْسِهِ ۖ وَمَن كَفَرَ فَإِنَّ اللَّهَ غَنِيٌّ حَمِيدٌ ۝ وَإِذْ قَالَ لُقْمَانُ لِابْنِهِ وَهُوَ يَعِظُهُ يَا بُنَيَّ لَا تُشْرِكْ بِاللَّهِ ۖ إِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ ۝",
        "ayahTextTr": "Andolsun biz Lokmân'a 'Allah'a şükret' diye hikmet verdik... Hani Lokmân oğluna öğüt vererek: 'Yavrucuğum! Allah'a ortak koşma; çünkü şirk gerçekten büyük bir zulümdür' demişti.",
        "makamAnalysis": "Hikmetli öğütler, Nevâ'nın aydınlık, açık ve tesirli tiz dengesiyle tane tane kulağa aktarılır.",
        "verified": true
      },
      {
        "id": "neva-ex-3",
        "surah": 103,
        "ayah": 1,
        "endAyah": 3,
        "surahName": "Asr Sûresi",
        "text": "Asr Sûresi (1-3. Âyetler: Tam Sûre / Zaman ve Kurtuluş)",
        "reciter": "Şeyh Suûd eş-Şüraym",
        "reciterTitle": "Hicaz / Kâbe İmamı",
        "reciterId": "shuraym",
        "audioUrl": "https://everyayah.com/data/Saood_ash-Shuraym_128kbps/103001.mp3",
        "ayahTextAr": "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ۝",
        "ayahTextTr": "Asra yemin olsun ki, insan gerçekten ziyan içindedir. Ancak iman edip salih ameller işleyenler, birbirine hakkı tavsiye edenler ve sabrı tavsiye edenler müstesnadır.",
        "makamAnalysis": "Şüraym'ın Kâbe tilavetlerinde Asr Sûresi'ni Nevâ / Beyâtî tizlerinde okuyuşu, zamanın kıymetini ve uyarının aciliyetini hissettirir.",
        "verified": true
      },
      {
        "id": "neva-ex-4",
        "surah": 67,
        "ayah": 15,
        "endAyah": 16,
        "surahName": "Mülk Sûresi",
        "text": "Mülk Sûresi (15-16. Âyetler: Yeryüzü Nimeti ve Göğün Kudreti)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Huşûlu Mürettel İcrası",
        "reciterId": "minshawi",
        "audioUrl": "https://everyayah.com/data/Minshawy_Murattal_128kbps/067015.mp3",
        "ayahTextAr": "هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِن رِّزْقِهِ ۖ وَإِلَيْهِ النُّشُورُ ۝ أَأَمِنتُم مَّن فِي السَّمَاءِ أَن يَخْسِفَ بِكُمُ الْأَرْضَ فَإِذَا هِيَ تَمُورُ ۝",
        "ayahTextTr": "Yeryüzünü sizin için boyun eğdiren O'dur. Öyleyse onun sırtlarında yürüyün ve O'nun rızkından yiyin. Dönüş yalnız O'nadır. Gökte olanın sizi yere batırmayacağından emin misiniz?",
        "makamAnalysis": "Ufuk açıcı âyetler Nevâ makamının yüksek ve parlak perdelerinde icra edilir.",
        "verified": true
      }
    ]
  },
  {
    "id": "huzzam",
    "names": {
      "tr": "Hüzzam",
      "ar": "حُزَّام",
      "en": "Huzzam"
    },
    "durak": 17,
    "guclu": 31,
    "yeden": 13,
    "seyir": "inici-cikici",
    "dizi": {
      "cikici": [
        17,
        22,
        31,
        36,
        48,
        53,
        65,
        70
      ],
      "inici": null
    },
    "cesniler": [
      {
        "tur": "huzzam-beslisi",
        "baslangic": 17
      },
      {
        "tur": "hicaz-dortlusu",
        "baslangic": 48
      }
    ],
    "yarimKarar": [
      31
    ],
    "asmaKararlar": [
      36,
      48
    ],
    "genisleme": {
      "pest": 13,
      "tiz": 70
    },
    "seyirBolumleri": {
      "zemin": "Nevâ veya Segâh civarından başlar; Çargâh, Nevâ ve Hisar perdesiyle Hüzzam yakarışı duyurulur.",
      "meyan": "Nevâ üzerinde Eviç ve Nîm-Şehnaz perdeleriyle Tiz-Segâh bölgesinde feryat nağmeleri basılır.",
      "karar": "Hisar ve Nevâ'dan Çargâh geçilerek Segâh perdesinde kırık bir teslimiyetle karar verilir."
    },
    "school": [
      "turk",
      "misir"
    ],
    "tags": [
      "yanik",
      "yakaris",
      "gozyasi",
      "aksam ezani",
      "mevlid"
    ],
    "difficulty": 3,
    "ruhiTesir": "Türk ve Şark mûsikisinin en derin yakarış, gözyaşı ve feryat makamlarındandır. Balığın karnındaki Hz. Yûnus'un duası Hüzzam'ın kırık nağmeleriyle arşa yükselir.",
    "gelenekNotu": [
      "Peygamber duaları ve mahzun münâcâtlar",
      "Ayrılık, hasret ve can yakıcı tövbeler",
      "Mevlid-i Şerif münâcât ve velâdet bahrı"
    ],
    "ezanGelenegi": {
      "metin": "İkindi ve Akşam Vakitleri (Günün batışında hüzün ve iç yakıcı feryat)",
      "kaynak": "Geleneksel Türk Din Mûsikisi",
      "kesinlik": "gelenek"
    },
    "motifs": [
      {
        "id": "huzzam-m1",
        "name": {
          "tr": "Hüzzam Beşlisi Girişi",
          "ar": "مدخل خماسي الحزام",
          "en": "Huzzam Fifth Opening"
        },
        "type": "giris",
        "path": [
          {
            "abs": 17,
            "beats": 2
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "huzzam-m2",
        "name": {
          "tr": "Hisar Perdesiyle Yakarış",
          "ar": "نداء بحصار",
          "en": "Lament with Hisar"
        },
        "type": "guclu",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 36,
            "beats": 2
          },
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 2
          }
        ]
      },
      {
        "id": "huzzam-m3",
        "name": {
          "tr": "Eviç Üzerinde Meyan",
          "ar": "ميانه على الأوج",
          "en": "Climax on Evic"
        },
        "type": "asma-karar",
        "path": [
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 48,
            "beats": 1
          },
          {
            "abs": 53,
            "beats": 1
          },
          {
            "abs": 65,
            "beats": 2
          },
          {
            "abs": 48,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 2
          }
        ]
      },
      {
        "id": "huzzam-m4",
        "name": {
          "tr": "Hüzzam Hüzünlü Karar",
          "ar": "الاستقرار الحزين",
          "en": "Melancholic Huzzam Cadence"
        },
        "type": "inis-karar",
        "path": [
          {
            "abs": 36,
            "beats": 1
          },
          {
            "abs": 31,
            "beats": 1
          },
          {
            "abs": 22,
            "beats": 1
          },
          {
            "abs": 17,
            "beats": 3
          }
        ]
      }
    ],
    "transitions": [
      {
        "to": "segah",
        "via": "Segâh",
        "viaAbs": 17,
        "path": [
          {
            "abs": 31
          },
          {
            "abs": 22
          },
          {
            "abs": 17
          }
        ],
        "note": {
          "tr": "Hisar perdesi terkedilip Segâh perdesine inilerek Segâh makamına bağlanılır."
        }
      },
      {
        "to": "hicaz",
        "via": "Hicaz",
        "viaAbs": 27,
        "path": [
          {
            "abs": 31
          },
          {
            "abs": 26
          },
          {
            "abs": 14
          },
          {
            "abs": 9
          }
        ],
        "note": {
          "tr": "Hicaz seslerine geçilerek Dügâh kararında Hicaz icra edilir."
        }
      },
      {
        "to": "rast",
        "via": "Rast",
        "viaAbs": 0,
        "path": [
          {
            "abs": 17
          },
          {
            "abs": 9
          },
          {
            "abs": 0
          }
        ],
        "note": {
          "tr": "Segâh ve Dügâh üzerinden Rast perdesine inilerek Rast kararı verilir."
        }
      }
    ],
    "confidence": "high",
    "needsReview": false,
    "notlar": "Hüzzam beşlisi (Segâh, Çargâh, Nevâ, Hisar, Eviç) + Eviç'te Hicaz dörtlüsü (TDV Hüzzam). Karar frekansı 244.3 Hz civarıdır.",
    "kaynaklar": [
      {
        "baslik": "TDV İslâm Ansiklopedisi — Hüzzam",
        "yazar": "İsmail Hakkı Özkan",
        "url": "https://islamansiklopedisi.org.tr/huzzam--musiki",
        "erisimTarihi": "2026-10-20"
      }
    ],
    "review": {
      "status": "draft",
      "log": [
        {
          "tarih": "2026-10-20",
          "not": "huzzam-m1 motifi bozuk veriden arındırıldı."
        }
      ]
    },
    "characterTags": [
      "yanik",
      "yakaris",
      "gozyasi",
      "aksam ezani",
      "mevlid"
    ],
    "kararName": "Segâh",
    "description": {
      "tr": "Türk ve Şark mûsikisinin en derin yakarış, gözyaşı ve feryat makamlarındandır. Balığın karnındaki Hz. Yûnus'un duası Hüzzam'ın kırık nağmeleriyle arşa yükselir."
    },
    "degrees": [
      {
        "name": {
          "tr": "Segâh",
          "ar": "Segâh",
          "en": "Segâh"
        },
        "komas": 0,
        "arCents": 0,
        "isMicro": false,
        "abs": 17
      },
      {
        "name": {
          "tr": "Çargâh",
          "ar": "Çargâh",
          "en": "Çargâh"
        },
        "komas": 5,
        "arCents": 113,
        "isMicro": true,
        "abs": 22
      },
      {
        "name": {
          "tr": "Nevâ",
          "ar": "Nevâ",
          "en": "Nevâ"
        },
        "komas": 14,
        "arCents": 317,
        "isMicro": true,
        "abs": 31
      },
      {
        "name": {
          "tr": "Hisar",
          "ar": "Hisar",
          "en": "Hisar"
        },
        "komas": 19,
        "arCents": 430,
        "isMicro": true,
        "abs": 36
      },
      {
        "name": {
          "tr": "Eviç",
          "ar": "Eviç",
          "en": "Eviç"
        },
        "komas": 31,
        "arCents": 702,
        "isMicro": true,
        "abs": 48
      },
      {
        "name": {
          "tr": "Gerdâniye",
          "ar": "Gerdâniye",
          "en": "Gerdâniye"
        },
        "komas": 36,
        "arCents": 815,
        "isMicro": false,
        "abs": 53
      },
      {
        "name": {
          "tr": "Nîm-Şehnaz",
          "ar": "Nîm-Şehnaz",
          "en": "Nîm-Şehnaz"
        },
        "komas": 48,
        "arCents": 1087,
        "isMicro": false,
        "abs": 65
      },
      {
        "name": {
          "tr": "Tiz-Segâh",
          "ar": "Tiz-Segâh",
          "en": "Tiz-Segâh"
        },
        "komas": 53,
        "arCents": 1200,
        "isMicro": true,
        "abs": 70
      }
    ],
    "ayahExamples": [
      {
        "id": "huzzam-ex-1",
        "surah": 21,
        "ayah": 87,
        "endAyah": 88,
        "surahName": "Enbiyâ Sûresi",
        "text": "Enbiyâ Sûresi (87-88. Âyetler: Hz. Yûnus'un Karanlıklardaki Niyazı)",
        "reciter": "Mahmûd Halîl el-Husarî",
        "reciterTitle": "Kusursuz Mizan Üstadı",
        "reciterId": "husary",
        "audioUrl": "https://everyayah.com/data/Husary_128kbps/021087.mp3",
        "ayahTextAr": "وَذَا النُّونِ إِذ ذَّهَبَ مُغَاضِبًا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِي الظُّلُمَاتِ أَن لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ ۝ فَاسْتَجَبْنَا لَهُ وَنَجَّيْنَاهُ مِنَ الْغَمِّ ۚ وَكَذَٰلِكَ نُنجِي الْمُؤْمِنِينَ ۝",
        "ayahTextTr": "Balık sahibini (Yûnus'u) da hatırla... Karanlıklar içinde: 'Senden başka hiçbir ilah yoktur. Seni tenzih ederim. Gerçekten ben zalimlerden oldum!' diye niyaz etti. Biz de onun duasını kabul ettik ve onu kederden kurtardık.",
        "makamAnalysis": "Hüzzam makamı Türk ve Şark musikisinin en derin yakarış ve gözyaşı makamlarındandır. Balığın karnındaki Zünnûn'un duası Hüzzam'ın kırık ve titrek nağmeleriyle arşa yükselir.",
        "verified": true
      },
      {
        "id": "huzzam-ex-2",
        "surah": 28,
        "ayah": 10,
        "endAyah": 11,
        "surahName": "Kasas Sûresi",
        "text": "Kasas Sûresi (10-11. Âyetler: Hz. Mûsâ'nın Annesinin Çaresizliği)",
        "reciter": "Muhammed Sıddîk el-Minşâvî",
        "reciterTitle": "Ağlatan Mücevved İcrası",
        "reciterId": "minshawi_mujawwad",
        "audioUrl": "https://everyayah.com/data/Minshawy_Mujawwad_192kbps/028010.mp3",
        "ayahTextAr": "وَأَصْبَحَ فُؤَادُ أُمِّ مُوسَىٰ فَارِغًا ۖ إِن كَادَتْ لَتُبْدِي بِهِ لَوْلَا أَن رَّبَطْنَا عَلَىٰ قَلْبِهَا لِتَكُونَ مِنَ الْمُؤْمِنِينَ ۝ وَقَالَتْ لِأُخْتِهِ قُصِّيهِ ۖ فَبَصُرَتْ بِهِ عَن جُنُبٍ وَهُمْ لَا يَشْعُرُونَ ۝",
        "ayahTextTr": "Mûsâ'nın annesinin yüreği bomboş kalıverdi. Eğer inananlardan olması için kalbini pekiştirmemiş olsaydık, neredeyse işi açığa vuracaktı. Kız kardeşine: 'Onu izle' dedi...",
        "makamAnalysis": "Bir annenin yavrusunu Nil nehrine bırakırken çektiği acı ve yüreğinin boşluğu, Hüzzam makamının feryadında Minşâvî'nin eşsiz nefesiyle yankılanır.",
        "verified": true
      },
      {
        "id": "huzzam-ex-3",
        "surah": 56,
        "ayah": 1,
        "endAyah": 6,
        "surahName": "Vâkıa Sûresi",
        "text": "Vâkıa Sûresi (1-6. Âyetler: Vuku Bulacak Kıyamet ve Yerin Sarsılışı)",
        "reciter": "Abdülbâsıt Abdüssamed",
        "reciterTitle": "Mücevved Haşyet İcrası",
        "reciterId": "abdulbasit_mujawwad",
        "audioUrl": "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/056001.mp3",
        "ayahTextAr": "إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ۝ خَافِضَةٌ رَّافِعَةٌ ۝ إِذَا رُجَّتِ الْأَرْضُ رَجًّا ۝ وَبُسَّتِ الْجِبَالُ بَسًّا ۝ فَكَانَتْ هَبَاءً مُّنبَثًّا ۝",
        "ayahTextTr": "Kıyamet koptuğu zaman! Onun kopuşunu yalanlayacak hiçbir kimse yoktur. O alçaltıcı ve yükselticidir. Yer şiddetle sarsıldığı ve dağlar ufalanıp toz duman olduğu zaman!",
        "makamAnalysis": "Hüzzam'ın ağır, vakarlı ve ürpertici nağmeleri, kıyametin kaçınılmaz dehşetini derin bir tefekkürle resmeder.",
        "verified": true
      },
      {
        "id": "huzzam-ex-4",
        "surah": 27,
        "ayah": 19,
        "endAyah": 19,
        "surahName": "Neml Sûresi",
        "text": "Neml Sûresi (19. Âyet: Hz. Süleyman'ın Şükrü ve Duası)",
        "reciter": "Mahmûd Halîl el-Husarî",
        "reciterTitle": "Kıraat Otoritesi",
        "reciterId": "husary",
        "audioUrl": "https://everyayah.com/data/Husary_128kbps/027019.mp3",
        "ayahTextAr": "فَتَبَسَّمَ ضَاحِكًا مِّن قَوْلِهَا وَقَالَ رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ ۝",
        "ayahTextTr": "(Süleyman) karıncanın sözüne tebessüm ederek gülümsedi ve dedi ki: 'Rabbim! Bana ve ana-babama lütfettiğin nimete şükretmemi ve rızana uygun salih amel işlememi nasip eyle! Rahmetinle beni salih kullarının arasına kat!'",
        "makamAnalysis": "Hüzzam makamının içli ve rikkat dolu yapısı, ilahi nimetler karşısında duyulan derin minnettarlık ve acziyetle birleşir.",
        "verified": true
      }
    ]
  }
],
  "lessons": [
    {
      "id": "L0-1-giris-ve-adab",
      "level": 0,
      "module": "hazirlik",
      "title": {
        "tr": "Kur'an'a Giriş ve Tilavet Adabı",
        "ar": "آدَابُ التِّلَاوَة",
        "en": "Introduction & Etiquette"
      },
      "objectives": [
        "Kur'an tilavetinin manevi ve ahlaki gayesini kavrar",
        "Abdest, kıble, eûzü-besmele ve huşû adabını öğrenir"
      ],
      "estimatedMinutes": 8,
      "prerequisites": [],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "intro",
          "text": "Kur'ân-ı Kerîm, Allah Teâlâ'nın insanlığa gönderdiği son ve evrensel hidâyet rehberidir. Tilavet; yalnızca harfleri telaffuz etmek değil, lafzı tecvidle süslemek, manayı tefekkür etmek ve kalbe tesir ettirmektir."
        },
        {
          "type": "explain",
          "text": "Tilavetin Zahirî ve Bâtınî Edepleri:\n1. Maddî ve mânevî temizlik (Abdest almak, misvak kullanmak, temiz kıyafet).\n2. Kıbleye yönelerek vakarla oturmak.\n3. 'Eûzü-Besmele' ile şeytanın vesveselerinden Allah'a sığınmak.\n4. Acele etmeden, tecvid ve tertil üzere tane tane okumak.\n5. Âyetlerin vadettiği rahmette ümitlenmek, uyardığı azapta sığınmak."
        },
        {
          "type": "quiz",
          "questions": [
            {
              "q": "Kur'an tilavetine başlarken ilk yapılması gereken sünnet nedir?",
              "options": [
                "Hemen hızlıca okumak",
                "Eûzü-Besmele çekip huşû ile başlamak",
                "Makam değiştirmek"
              ],
              "answer": 1
            }
          ]
        }
      ]
    },
    {
      "id": "L0-2-mushaf-anatomisi",
      "level": 0,
      "module": "hazirlik",
      "title": {
        "tr": "Mushaf'ın Tertibi: Sûre, Âyet, Cüz ve Sayfa",
        "ar": "تَرْتِيبُ الْمُصْحَف",
        "en": "Mushaf Anatomy"
      },
      "objectives": [
        "Mushaf-ı Şerif'in iç düzenini tanır",
        "Cüz, hizb, sayfa ve âyet madalyonlarını kavrar"
      ],
      "estimatedMinutes": 10,
      "prerequisites": [
        "L0-1-giris-ve-adab"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "intro",
          "text": "Klasik Medine Mushafı tam 604 sayfadır. Her sayfa istisnalar dışında 15 satırdan meydana gelir. Kur'ân-ı Kerîm'de 114 sûre ve 6236 âyet-i kerîme bulunmaktadır."
        },
        {
          "type": "explain",
          "text": "Temel Kavramlar:\n- Âyet: Mushaf'ta çiçekli madalyonlarla birbirinden ayrılan cümle veya lafız öbeği.\n- Sûre: Âyetlerin unvan kartuşlarıyla bir araya geldiği 114 ana bölüm.\n- Cüz: Mushaf'ın 20'şer sayfalık 30 eşit parçasından her biri.\n- Secde Âyeti: Okunduğunda veya dinlendiğinde tilavet secdesi yapılmasını bildiren kenar işareti."
        }
      ]
    },
    {
      "id": "L1-1-harfler-ve-sesler",
      "level": 1,
      "module": "elifba",
      "title": {
        "tr": "Elif-Ba: 28 Harfin Şekli ve Asli Sesi",
        "ar": "حُرُوفُ الْهِجَاء",
        "en": "The 28 Arabic Letters"
      },
      "objectives": [
        "28 Arap harfini tekil halleriyle tanır",
        "Harflerin kalın ve ince ayrımını kavrar"
      ],
      "estimatedMinutes": 15,
      "prerequisites": [
        "L0-2-mushaf-anatomisi"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "intro",
          "text": "Arap alfabesinde 28 asli harf bulunur. Arapça sağdan sola yazılır ve okunur. Harfler ince ve kalın sesli olarak iki ana gruba ayrılır."
        },
        {
          "type": "interactive_letters",
          "totalLetters": 28
        },
        {
          "type": "explain",
          "text": "Kalın Harfler (خ ص ض غ ط ق ظ): 'Hussa daktin kîz' (خُصَّ ضَغْطٍ قِظْ) şifresiyle toplanmıştır. Bu harfler ağız boşluğu doldurularak dolgun (a-u arası) bir tonla okunur. Diğer harfler ise zarif ve ince (e-i arası) okunur."
        }
      ]
    },
    {
      "id": "L1-2-kulak-egitimi-benzer-harfler",
      "level": 1,
      "module": "elifba",
      "title": {
        "tr": "Kulak Eğitimi: Benzer Sesli Harfleri Ayırt Etme",
        "ar": "تَمْيِيزُ الْحُرُوفِ الْمُتَشَابِهَة",
        "en": "Distinguishing Similar Letters"
      },
      "objectives": [
        "Peltek ث ile ince س ve kalın ص harflerini kulakla ayırt eder",
        "ذ ile ز ve ظ harflerini netleştirir"
      ],
      "estimatedMinutes": 12,
      "prerequisites": [
        "L1-1-harfler-ve-sesler"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "intro",
          "text": "Arapçada birbirine benzeyen seslerin yanlış telaffuzu kelimenin manasını tamamen değiştirebilir (Örn: 'Kalp' قَلْب ile 'Köpek' كَلْب gibi). Bu derste kritik harf çiftlerini dinleyip kulağımızı eğitiyoruz."
        },
        {
          "type": "pairs",
          "items": [
            {
              "pair": "ث (Peltek Se) vs س (Keskin Sin) vs ص (Kalın Sad)",
              "diff": "ث dil ucu dişlerin arasından; س dil ucu alt diş arkasında ıslıklı; ص dili damağa yapıştırarak kalın."
            },
            {
              "pair": "ح (Boğaz Ha) vs ه (Göğüs He) vs خ (Hırıltılı Hı)",
              "diff": "ح boğazın tam ortasından buharlı; ه göğüsten derin; خ boğazın ağza en yakın üst kısmından hırıltıyla."
            },
            {
              "pair": "ق (Kaf) vs ك (Kef)",
              "diff": "ق dil kökünün küçük dile vuran kalın sesi; ك biraz daha önden çıkan ince 'k' sesi."
            },
            {
              "pair": "ذ (Peltek Ze) vs ز (Keskin Ze) vs ظ (Kalın Peltek Zı)",
              "diff": "ذ peltek yumuşak; ز arı vızıltısı gibi keskin; ظ dil ucu dışarıda ve kalın."
            }
          ]
        }
      ]
    },
    {
      "id": "L1-5-mahreclere-giris",
      "level": 1,
      "module": "elifba",
      "title": {
        "tr": "Mahreç Atlası: Seslerin Çıkış Bölgeleri",
        "ar": "مَخَارِجُ الْحُرُوف",
        "en": "Makharij (Points of Articulation)"
      },
      "objectives": [
        "5 ana mahreç bölgesini öğrenir (Cevf, Halk, Lisân, Şefeteyn, Hayşûm)",
        "Her harfin kaynağını zihninde canlandırır"
      ],
      "estimatedMinutes": 15,
      "prerequisites": [
        "L1-2-kulak-egitimi-benzer-harfler"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "diagram",
          "target": "mouth_anatomy"
        },
        {
          "type": "explain",
          "text": "5 Ana Mahreç Bölgesi:\n1. Boğaz (Halk - حَلْق): 6 boğaz harfi (ء ه ع ح غ خ)\n2. Dil (Lisân - لِسَان): 18 harf (dil kökü, orta, yan ve uç bölümleri)\n3. Dudaklar (Şefeteyn - شَفَتَيْن): 4 harf (ب م و ف)\n4. Ağız Boşluğu (Cevf - جَوْف): Med harfleri (Uzatan ا و ي sesleri)\n5. Geniz (Hayşûm - خَيْشُوم): Gunne sesinin çıktığı burun içi boşluk."
        }
      ]
    },
    {
      "id": "L2-1-harekeler-giris",
      "level": 2,
      "module": "okuma",
      "title": {
        "tr": "Harekeler: Üstün, Esre, Ötre ve Tenvin",
        "ar": "الْحَرَكَاتُ وَالتَّنْوِين",
        "en": "Vowels & Tanween"
      },
      "objectives": [
        "Harfleri üstün (e/a), esre (i/ı) ve ötre (ü/u) ile seslendirir",
        "Tenvin ile nûnlu bitişleri okur"
      ],
      "estimatedMinutes": 12,
      "prerequisites": [
        "L1-5-mahreclere-giris"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "intro",
          "text": "Harekeler harflere can veren sesli işaretlerdir. Bir harfin harekesi varsa o harf 'harekeli', yoksa 'sâkin' (cezimli) adını alır."
        },
        {
          "type": "examples",
          "items": [
            {
              "char": "بَ",
              "sound": "be",
              "type": "Üstün (Fetha)"
            },
            {
              "char": "بِ",
              "sound": "bi",
              "type": "Esre (Kesra)"
            },
            {
              "char": "بُ",
              "sound": "bü",
              "type": "Ötre (Damme)"
            },
            {
              "char": "بًا",
              "sound": "ben",
              "type": "İki Üstün"
            },
            {
              "char": "بٍ",
              "sound": "bin",
              "type": "İki Esre"
            },
            {
              "char": "بٌ",
              "sound": "bün",
              "type": "İki Ötre"
            }
          ]
        }
      ]
    },
    {
      "id": "L2-2-cezm-ve-sedde",
      "level": 2,
      "module": "okuma",
      "title": {
        "tr": "Cezm (Sükûn) ve Şedde ile Birleştirme",
        "ar": "السُّكُونُ وَالشَّدَّة",
        "en": "Sukun and Shaddah"
      },
      "objectives": [
        "Cezimli harfi kendinden önceki harfe tutturarak okur",
        "Şeddeli harfi iki defa (tutarak ve fırlatarak) seslendirir"
      ],
      "estimatedMinutes": 14,
      "prerequisites": [
        "L2-1-harekeler-giris"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "intro",
          "text": "Cezm harfin sesini durdurur; şedde ise iki aynı harfi tek bir harfte birleştirerek kuvvetlendirir."
        }
      ]
    },
    {
      "id": "L2-5-fatiha-okumaya-gecis",
      "level": 2,
      "module": "okuma",
      "title": {
        "tr": "İlk Âyetler: Kelime Kelime Fâtiha Tilaveti",
        "ar": "تِلَاوَةُ سُورَةِ الْفَاتِحَة",
        "en": "First Verses: Surah Al-Fatiha"
      },
      "objectives": [
        "Fâtiha Sûresi'ni kelime kelime takip ederek okur",
        "Model kurrâ ile kendi sesini karşılaştırır"
      ],
      "estimatedMinutes": 20,
      "prerequisites": [
        "L2-2-cezm-ve-sedde"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "interactive_ayah",
          "surah": 1,
          "ayah": 1,
          "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
        },
        {
          "type": "interactive_ayah",
          "surah": 1,
          "ayah": 2,
          "text": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
        },
        {
          "type": "imitate",
          "surah": 1,
          "ayah": 1,
          "recordingRequired": true
        }
      ]
    },
    {
      "id": "L3-1-nun-sakin-izhar",
      "level": 3,
      "module": "tecvid",
      "title": {
        "tr": "Nun Sâkin ve Tenvin: İzhâr Kuralı",
        "ar": "حُكْمُ الْإِظْهَار",
        "en": "Rules of Noon Sakinah: Izhar"
      },
      "objectives": [
        "İzhâr harflerini (ء ه ع ح غ خ) ezberler",
        "Gunne yapmadan nûn sesini berrak çıkarır"
      ],
      "estimatedMinutes": 12,
      "prerequisites": [
        "L2-5-fatiha-okumaya-gecis"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "explain",
          "text": "Sâkin Nûn (نْ) veya tenvinden (ـًـٍـٌ) sonra 6 boğaz harfinden biri gelirse İZHÂR olur. Nûn sesi genze kaçırılmadan, tutulmadan, berrak bir şekilde okunur."
        },
        {
          "type": "examples",
          "items": [
            {
              "ayah": "112:4",
              "phrase": "كُفُوًا أَحَدٌ",
              "rule": "Tenvinden sonra Hemze geldiği için İzhâr"
            },
            {
              "ayah": "108:2",
              "phrase": "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
              "rule": "Sakin nun'dan sonra Ha harfi geldiği için İzhâr"
            }
          ]
        }
      ]
    },
    {
      "id": "L3-4-med-bolumu",
      "level": 3,
      "module": "tecvid",
      "title": {
        "tr": "Med Kaideleri: Aslî ve Fer'î Medler",
        "ar": "أَحْكَامُ الْمُدُود",
        "en": "Rules of Madd (Prolongation)"
      },
      "objectives": [
        "Med harflerini (و ا ي) ve med sebeplerini (hemze, sükûn) kavrar",
        "Medd-i Muttasıl, Munfasıl ve Lâzım mertebelerini uygular"
      ],
      "estimatedMinutes": 15,
      "prerequisites": [
        "L3-1-nun-sakin-izhar"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "explain",
          "text": "Med harfinden sonra med sebebi (hemze veya sükûn) gelirse uzatma miktarı artar:\n- Medd-i Tabiî: 1 elif (yaklaşık 1-1.5 saniye)\n- Medd-i Muttasıl: Bitişik hemze ile 4 elif (zorunlu uzatma)\n- Medd-i Munfasıl: Ayrı kelimedeki hemze ile 4 elif (caiz uzatma)\n- Medd-i Lâzım: Aslî sükûn ile tam 4 elif (vacip uzatma)."
        }
      ]
    },
    {
      "id": "L4-1-okuma-hizlari",
      "level": 4,
      "module": "teknikler",
      "title": {
        "tr": "Kıraat Hızları: Tahkîk, Tertîl, Tedvîr ve Hadr",
        "ar": "مَرَاتِبُ الْقِرَاءَة",
        "en": "Recitation Tempos"
      },
      "objectives": [
        "4 farklı tilavet hızının farkını kavrar",
        "Aynı âyeti farklı tempolarda dinleyerek kulağını alıştırır"
      ],
      "estimatedMinutes": 12,
      "prerequisites": [
        "L3-4-med-bolumu"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "explain",
          "text": "Kur'an tilavetinde 4 meşhur hız mertebesi vardır:\n1. Tahkîk: En ağır tempo, her kuralın hakkı milimetrik verilir; talim için idealdir.\n2. Tertîl: Tefekkür ağırlıklı, yavaş-orta tempo; Kur'an'ın tavsiye ettiği esastır.\n3. Tedvîr: Orta sürat; cemaat namazlarında en yaygın olanıdır.\n4. Hadr: En seri hız; tecvidi çiğnemeden yapılan hatim tilavetidir."
        }
      ]
    },
    {
      "id": "L4-5-hatalar-atlasi",
      "level": 4,
      "module": "teknikler",
      "title": {
        "tr": "Hatalar Atlası: Lahn-ı Celî ve Lahn-ı Hafî",
        "ar": "أَطْلَسُ اللَّحْن",
        "en": "Atlas of Common Errors"
      },
      "objectives": [
        "En sık yapılan 50 tilavet hatasını öğrenir",
        "Namazı bozan açık hata ile güzelliği bozan gizli hatayı ayırt eder"
      ],
      "estimatedMinutes": 15,
      "prerequisites": [
        "L4-1-okuma-hizlari"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "explain",
          "text": "Lahn kıraatteki hata demektir:\n- Lahn-ı Celî (Büyük Hata): Harfi başka harfe çevirmek (ث yerine س demek gibi) veya harekeyi değiştirmek (üstünü ötre yapmak gibi). Namazı ifsat eder.\n- Lahn-ı Hafî (Küçük Hata): Gunneyi az tutmak, meddi 4 elif yerine 2 elif çekmek gibi güzelliği zedeleyen kusurlardır."
        }
      ]
    },
    {
      "id": "L5-1-makama-giris",
      "level": 5,
      "module": "makam",
      "title": {
        "tr": "Makam Sanatına Giriş: Perde, Karar ve Seyir",
        "ar": "مَدْخَلٌ إِلَى عِلْمِ الْمَقَامَات",
        "en": "Introduction to Makam"
      },
      "objectives": [
        "Makamın tilavetteki meşru sınırını kavrar (Tecvid > Makam ilkesi)",
        "Perde, karar ve seyir kavramlarını öğrenir"
      ],
      "estimatedMinutes": 15,
      "prerequisites": [
        "L4-5-hatalar-atlasi"
      ],
      "status": "published",
      "needsReview": false,
      "sections": [
        {
          "type": "important_note",
          "text": "ÖNEMLİ İLKE: Makamlar tilavetin vakarını ve hüznünü artıran geleneksel ses sanatıdır; dini hüküm değildir. Tecvid kuralını bozan hiçbir nağme caiz değildir. Öncelik daima tecvid ve huşûdadır."
        },
        {
          "type": "explain",
          "text": "Makamın 3 Temel Direği:\n1. Karar Perdesi: Makamın evi; tilavetin dinlendiği zemin.\n2. Güçlü Perdesi: Melodinin etrafında döndüğü ağırlık merkezi.\n3. Seyir: Seslerin izlediği yol (Çıkıcı, İnici veya İnici-Çıkıcı)."
        }
      ]
    }
  ],
  "sozluk": [
    {
      "id": "mahrec",
      "term": "Mahreç",
      "termAr": "مَخْرَج",
      "category": "tecvid",
      "definition": "Harflerin ağız, boğaz ve geniz gibi ses organlarından çıktığı, telaffuz edildiği yer.",
      "relatedLesson": "L1-5-mahreclere-giris"
    },
    {
      "id": "sifat",
      "term": "Sıfat",
      "termAr": "صِفَة",
      "category": "tecvid",
      "definition": "Harfin mahrecinden çıkarken kazandığı kalınlık, incelik, nefes akması (hems) veya hapsedilmesi (cehr) gibi ses hususiyetleri.",
      "relatedLesson": "L1-6-harflerin-sifatlari"
    },
    {
      "id": "hareke",
      "term": "Hareke",
      "termAr": "حَرَكَة",
      "category": "elifba",
      "definition": "Arap harflerinin seslendirilmesini sağlayan üstün, esre ve ötre işaretlerinin genel adı.",
      "relatedLesson": "L2-1-harekeler-giris"
    },
    {
      "id": "ustun",
      "term": "Üstün (Fetha)",
      "termAr": "فَتْحَة",
      "category": "elifba",
      "definition": "Harfin üstüne konulan ve ince harfleri 'e', kalın harfleri 'a' sesiyle okutan çizgi.",
      "relatedLesson": "L2-1-harekeler-giris"
    },
    {
      "id": "esre",
      "term": "Esre (Kesra)",
      "termAr": "كَسْرَة",
      "category": "elifba",
      "definition": "Harfin altına konulan ve ince harfleri 'i', kalın harfleri 'ı-i' arası okutan çizgi.",
      "relatedLesson": "L2-1-harekeler-giris"
    },
    {
      "id": "otre",
      "term": "Ötre (Damme)",
      "termAr": "ضَمَّة",
      "category": "elifba",
      "definition": "Harfin üstüne konulan küçük 'vav' şeklindeki işaret; ince harfleri 'ü', kalın harfleri 'u' okutur.",
      "relatedLesson": "L2-1-harekeler-giris"
    },
    {
      "id": "tenvin",
      "term": "Tenvin",
      "termAr": "تَنْوِين",
      "category": "elifba",
      "definition": "Kelime sonundaki iki üstün, iki esre veya iki ötreye verilen ad; cezimli bir nûn sesi ekler.",
      "relatedLesson": "L2-1-harekeler-giris"
    },
    {
      "id": "cezm",
      "term": "Cezm (Sükûn)",
      "termAr": "سُكُون",
      "category": "elifba",
      "definition": "Harfin harekesiz olduğunu gösteren yuvarlak işaret; harfi durdurarak tutar.",
      "relatedLesson": "L2-2-cezm-ve-sedde"
    },
    {
      "id": "sedde",
      "term": "Şedde (Teşdid)",
      "termAr": "شَدَّة",
      "category": "elifba",
      "definition": "Bir harfin iki kere, ilki cezimli ikincisi harekeli olarak okunmasını sağlayan üç dişli işaret.",
      "relatedLesson": "L2-2-cezm-ve-sedde"
    },
    {
      "id": "med",
      "term": "Med",
      "termAr": "مَدّ",
      "category": "tecvid",
      "definition": "Sesi uzatmak demektir. Vav, yâ ve elif harfleriyle yapılan asli veya fer'i uzatmalar.",
      "relatedLesson": "L3-4-med-bolumu"
    },
    {
      "id": "kasr",
      "term": "Kasr",
      "termAr": "قَصْر",
      "category": "tecvid",
      "definition": "Uzatmayı terk edip harfi tabiî miktarda (1 elif / 1 hareke) kısa okumak.",
      "relatedLesson": "L3-5-kalkale-ve-kasr"
    },
    {
      "id": "gunne",
      "term": "Gunne",
      "termAr": "غُنَّة",
      "category": "tecvid",
      "definition": "Genizden (hayşûm) gelen, nûn ve mîm harflerine özgü hoş ve tınlayan ses.",
      "relatedLesson": "L3-3-gunne-ve-museddet"
    },
    {
      "id": "izhar",
      "term": "İzhâr",
      "termAr": "إِظْهَار",
      "category": "tecvid",
      "definition": "Nun sâkin veya tenvinden sonra boğaz harfleri geldiğinde nun sesini gunnesiz ve net olarak açığa çıkarmak.",
      "relatedLesson": "L3-1-nun-sakin-izhar"
    },
    {
      "id": "idgam",
      "term": "İdğâm",
      "termAr": "إِدْغَام",
      "category": "tecvid",
      "definition": "Sâkin bir harfi harekeli bir harfe katarak şeddeli tek bir harf gibi okumak.",
      "relatedLesson": "L3-1-nun-sakin-idgam"
    },
    {
      "id": "iklab",
      "term": "İklâb",
      "termAr": "إِقْلَاب",
      "category": "tecvid",
      "definition": "Nun sâkin veya tenvinden sonra 'bâ' (ب) harfi geldiğinde nun sesini gunneli mîm (م) sesine dönüştürmek.",
      "relatedLesson": "L3-1-nun-sakin-iklab"
    },
    {
      "id": "ihfa",
      "term": "İhfâ",
      "termAr": "إِخْفَاء",
      "category": "tecvid",
      "definition": "Nun sâkin veya tenvini izhar ile idğam arasında, şeddesiz ve genizden gunne ile gizleyerek okumak.",
      "relatedLesson": "L3-1-nun-sakin-ihfa"
    },
    {
      "id": "kalkale",
      "term": "Kalkale",
      "termAr": "قَلْقَلَة",
      "category": "tecvid",
      "definition": "ق ط ب ج د harfleri cezimli olduğunda mahrecin sarsılarak kuvvetli bir ses yankısıyla duyulması.",
      "relatedLesson": "L3-5-kalkale-ve-kasr"
    },
    {
      "id": "tefhim",
      "term": "Tefhim",
      "termAr": "تَفْخِيم",
      "category": "tecvid",
      "definition": "Harfi ağız boşluğunu dolduracak şekilde kalın okumak.",
      "relatedLesson": "L3-6-ra-ve-lam-tefhim"
    },
    {
      "id": "terkik",
      "term": "Terkîk",
      "termAr": "تَرْقِيق",
      "category": "tecvid",
      "definition": "Harfi ince ve zarif bir sesle okumak.",
      "relatedLesson": "L3-6-ra-ve-lam-tefhim"
    },
    {
      "id": "vakif",
      "term": "Vakıf",
      "termAr": "وَقْف",
      "category": "tilavet",
      "definition": "Tilavete devam etmek niyetiyle, nefes alarak bir kelimenin sonunda sesi kesmek.",
      "relatedLesson": "L4-2-vakif-ve-ibtida"
    },
    {
      "id": "ibtida",
      "term": "İbtidâ",
      "termAr": "اِبْتِدَاء",
      "category": "tilavet",
      "definition": "Vakıftan sonra kıraate manayı bozmayacak uygun bir kelimeden yeniden başlamak.",
      "relatedLesson": "L4-2-vakif-ve-ibtida"
    },
    {
      "id": "lahn-i-celi",
      "term": "Lahn-ı Celî",
      "termAr": "اللَّحْنُ الجَلِيّ",
      "category": "tilavet",
      "definition": "Harfin zatını veya harekesini değiştirerek manayı bozan açık ve büyük hata; namazı ve kıraati ifsat eder.",
      "relatedLesson": "L4-5-hatalar-atlasi"
    },
    {
      "id": "lahn-i-hafi",
      "term": "Lahn-ı Hafî",
      "termAr": "اللَّحْنُ الخَفِيّ",
      "category": "tilavet",
      "definition": "Med, gunne veya ihfa gibi tecvid inceliklerini eksik yaparak güzelliği bozan gizli hata.",
      "relatedLesson": "L4-5-hatalar-atlasi"
    },
    {
      "id": "tahkik",
      "term": "Tahkîk",
      "termAr": "تَحْقِيق",
      "category": "tilavet",
      "definition": "Harflerin haklarını ve müstahaklarını tastamam vererek yapılan en yavaş ve en dikkatli tilavet hızı.",
      "relatedLesson": "L4-1-okuma-hizlari"
    },
    {
      "id": "tertil",
      "term": "Tertîl",
      "termAr": "تَرْتِيل",
      "category": "tilavet",
      "definition": "Tefekkür ve huşû ile, kelimeleri tane tane ve orta-yavaş ritimde okuma biçimi.",
      "relatedLesson": "L4-1-okuma-hizlari"
    },
    {
      "id": "tedvir",
      "term": "Tedvîr",
      "termAr": "تَدْوِير",
      "category": "tilavet",
      "definition": "Tahkik ile hadr arasında, günümüz cemaat namazlarında sıkça tercih edilen orta hız.",
      "relatedLesson": "L4-1-okuma-hizlari"
    },
    {
      "id": "hadr",
      "term": "Hadr",
      "termAr": "حَدْر",
      "category": "tilavet",
      "definition": "Tecvid kurallarını bozmadan, harfleri birbirine karıştırmadan yapılan en seri (hızlı) hatim kıraati.",
      "relatedLesson": "L4-1-okuma-hizlari"
    },
    {
      "id": "makam",
      "term": "Makam",
      "termAr": "مَقَام",
      "category": "makam",
      "definition": "Belli aralıklardaki ses dizisi üzerinde belirli bir kural ve seyir (hareket) disipliniyle icra edilen melodik yapı.",
      "relatedLesson": "L5-1-makama-giris"
    },
    {
      "id": "perde",
      "term": "Perde",
      "termAr": "نَغْمَة / دَرَجَة",
      "category": "makam",
      "definition": "Müzikteki belirli bir frekansa karşılık gelen ses basamağı (nota).",
      "relatedLesson": "L5-1-makama-giris"
    },
    {
      "id": "dizi",
      "term": "Dizi (Gam)",
      "termAr": "سُلَّم",
      "category": "makam",
      "definition": "Bir makamı meydana getiren perdelerin karardan tize doğru sıralanışı.",
      "relatedLesson": "L5-1-makama-giris"
    },
    {
      "id": "karar",
      "term": "Karar Perdesi",
      "termAr": "قَرَار",
      "category": "makam",
      "definition": "Makamın başladığı, dinlendiği ve nihayetinde tamamlandığı temel referans perdesi.",
      "relatedLesson": "L5-1-makama-giris"
    },
    {
      "id": "guclu",
      "term": "Güçlü Perdesi",
      "termAr": "غَمَّاز",
      "category": "makam",
      "definition": "Makamın seyrinde en çok vurgulanan, yarım kararların ve asma kararların verildiği merkezi perde.",
      "relatedLesson": "L5-1-makama-giris"
    },
    {
      "id": "seyir",
      "term": "Seyir",
      "termAr": "سَيْر",
      "category": "makam",
      "definition": "Makam dizisindeki seslerin çıkıcı, inici veya inici-çıkıcı olarak izlediği melodik güzergâh.",
      "relatedLesson": "L5-1-makama-giris"
    },
    {
      "id": "gecki",
      "term": "Geçki (Modülasyon)",
      "termAr": "اِنْتِقَال",
      "category": "makam",
      "definition": "Bir makam icra edilirken ortak bir perde veya ilgi yoluyla geçici olarak başka bir makama geçip dönme sanatı.",
      "relatedLesson": "L5-4-makam-geckileri"
    },
    {
      "id": "koma",
      "term": "Koma",
      "termAr": "كُومَا",
      "category": "makam",
      "definition": "Geleneksel Türk musikisinde tam bir sesin (büyük ikili) dokuzda biri olan en küçük mikrotonal aralık.",
      "relatedLesson": "L5-1-makama-giris"
    },
    {
      "id": "cent",
      "term": "Cent",
      "termAr": "سِنْت",
      "category": "makam",
      "definition": "Batı akustiğinde bir oktavın 1200 eşit parçaya bölünmesiyle elde edilen logaritmik perde ölçüm birimi (1 yarım ses = 100 cent).",
      "relatedLesson": "L5-1-makama-giris"
    },
    {
      "id": "drone",
      "term": "Drone (Karar Sesi)",
      "termAr": "صَوْتُ القَرَار المُسْتَمِرّ",
      "category": "makam",
      "definition": "Öğrencinin entonasyonunu ve makam hissini kaybetmemesi için arkada sürekli çalan temel referans karar sesi.",
      "relatedLesson": "L5-1-makama-giris"
    },
    {
      "id": "mukabele",
      "term": "Mukabele",
      "termAr": "مُقَابَلَة",
      "category": "tilavet",
      "definition": "Bir kimsenin Kur'an'ı tilavet etmesi, diğerlerinin ise Mushaf'tan takip etmesi veya karşılıklı okuması usulü.",
      "relatedLesson": "L4-6-mukabele-ve-hatim"
    },
    {
      "id": "hatim",
      "term": "Hatim",
      "termAr": "خَتْم",
      "category": "tilavet",
      "definition": "Kur'ân-ı Kerîm'in Fâtiha'dan Nâs sûresine kadar baştan sona tamamının tilavet edilmesi.",
      "relatedLesson": "L4-6-mukabele-ve-hatim"
    },
    {
      "id": "icazet",
      "term": "İcazet",
      "termAr": "إِجَازَة",
      "category": "genel",
      "definition": "Hafızlık veya kıraat ilmini ehil bir hocadan başarıyla tamamlayan kimseye verilen silsileli yetki belgesi.",
      "relatedLesson": "L0-1-giris-ve-adab"
    },
    {
      "id": "kurra",
      "term": "Kurrâ",
      "termAr": "قُرَّاء",
      "category": "genel",
      "definition": "Kur'ân-ı Kerîm'i kıraat ve tecvid vecihleriyle en üst seviyede ve usulüne uygun okuyan üstat kıraat âlimleri.",
      "relatedLesson": "L0-1-giris-ve-adab"
    },
    {
      "id": "hafiz",
      "term": "Hâfız",
      "termAr": "حَافِظ",
      "category": "genel",
      "definition": "Kur'ân-ı Kerîm'in 604 sayfalık metninin tamamını lafzıyla ezberlemiş olan kimse.",
      "relatedLesson": "L0-1-giris-ve-adab"
    }
  ],
  "reciters": [
    {
      "id": "mustafa_ismail",
      "name": "Şeyh Mustafa İsmail",
      "nameAr": "مُصْطَفَى إِسْمَاعِيل",
      "school": "misir",
      "schoolTitle": "Mısır Makam Ekolü & Makamlar Sultanı",
      "style": "Mücevved & Makam Üstadı",
      "famousMakams": [
        "Rast",
        "Bayâtî",
        "Nihavend",
        "Acem",
        "Segâh"
      ],
      "bio": "Kur'an tilavetinde makam ilminin, perde geçkilerinin ve mana ile nağme ahengini kurmanın tartışmasız en büyük dâhisi.",
      "avatarText": "MIS",
      "audioBase": "https://everyayah.com/data/Mustafa_Ismail_48kbps/",
      "hasMuallim": false
    },
    {
      "id": "minshawi_mujawwad",
      "name": "Muhammed Sıddîk el-Minşâvî (Mücevved)",
      "nameAr": "مُحَمَّد صِدِّيق المِنْشَاوِي (مُجَوَّد)",
      "school": "misir",
      "schoolTitle": "Mısır Klasik Ekolü",
      "style": "Mücevved / Makam Zirvesi",
      "famousMakams": [
        "Sabâ",
        "Bayâtî",
        "Hicaz",
        "Nihavend"
      ],
      "bio": "Ağlayan ve ağlatan ses; Sabâ ve Bayâtî makamlarında dünya çapında aşılmamış huşû zirvesi.",
      "avatarText": "MSM",
      "audioBase": "https://everyayah.com/data/Minshawy_Mujawwad_192kbps/",
      "hasMuallim": false
    },
    {
      "id": "minshawi",
      "name": "Muhammed Sıddîk el-Minşâvî (Mürettel)",
      "nameAr": "مُحَمَّد صِدِّيق المِنْشَاوِي (مُرَتَّل)",
      "school": "misir",
      "schoolTitle": "Mısır Klasik Ekolü",
      "style": "Mürettel & Mushaf-ı Muallim",
      "famousMakams": [
        "Uşşak (Bayâtî)",
        "Rast",
        "Sabâ",
        "Hicaz"
      ],
      "bio": "Kur'an tilavetinde huşû ve samimiyetin zirve ismi; sakin ve berrak tertîliyle meşhurdur.",
      "avatarText": "MSM",
      "audioBase": "https://everyayah.com/data/Minshawy_Murattal_128kbps/",
      "hasMuallim": true
    },
    {
      "id": "abdulbasit_mujawwad",
      "name": "Abdülbâsıt Abdüssamed (Mücevved)",
      "nameAr": "عَبْدُ البَاسِط عَبْدُ الصَّمَد (مُجَوَّد)",
      "school": "misir",
      "schoolTitle": "Mısır Klasik Ekolü",
      "style": "Mücevved & Efsanevi Tizler",
      "famousMakams": [
        "Segâh",
        "Hicaz",
        "Sabâ",
        "Acem"
      ],
      "bio": "Eşsiz nefesi ve göklere uzanan tiz perdelerdeki berraklığıyla dinleyenleri cezbeden tilavet anıtı.",
      "avatarText": "ABM",
      "audioBase": "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/",
      "hasMuallim": false
    },
    {
      "id": "abdulbasit",
      "name": "Abdülbâsıt Abdüssamed (Mürettel)",
      "nameAr": "عَبْدُ البَاسِط عَبْدُ الصَّمَد (مُرَتَّل)",
      "school": "misir",
      "schoolTitle": "Mısır Klasik Ekolü",
      "style": "Mürettel",
      "famousMakams": [
        "Hicaz",
        "Segâh",
        "Sabâ",
        "Rast"
      ],
      "bio": "Tertil formunda harf mahreçlerini zedelemeden okuyan dünya çapında şöhret sahibi üstat.",
      "avatarText": "ABA",
      "audioBase": "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/",
      "hasMuallim": false
    },
    {
      "id": "husary",
      "name": "Mahmûd Halîl el-Husarî",
      "nameAr": "مَحْمُود خَلِيل الحُصَرِي",
      "school": "misir",
      "schoolTitle": "Mısır Klasik Ekolü",
      "style": "Tahkîk & Mizan Üstadı",
      "famousMakams": [
        "Rast",
        "Uşşak",
        "Nihavend"
      ],
      "bio": "Kıraat ilminin ve harf mahreçlerinin en hatasız ve kusursuz icracısı kabul edilir.",
      "avatarText": "MKH",
      "audioBase": "https://everyayah.com/data/Husary_128kbps/",
      "hasMuallim": true
    },
    {
      "id": "husary_mujawwad",
      "name": "Mahmûd Halîl el-Husarî (Mücevved)",
      "nameAr": "مَحْمُود خَلِيل الحُصَرِي (مُجَوَّد)",
      "school": "misir",
      "schoolTitle": "Mısır Klasik Ekolü",
      "style": "Mücevved & Makamlı",
      "famousMakams": [
        "Rast",
        "Uşşak",
        "Nihavend",
        "Acem"
      ],
      "bio": "Hatasız tecvid kuralı üzerine bina edilmiş vakarlı ve ağırbaşlı mücevved icraları.",
      "avatarText": "HKM",
      "audioBase": "https://everyayah.com/data/Husary_128kbps_Mujawwad/",
      "hasMuallim": false
    },
    {
      "id": "dossary",
      "name": "Şeyh Yâsir ed-Devserî",
      "nameAr": "يَاسِر الدَّوْسَرِي",
      "school": "hicaz",
      "schoolTitle": "Hicaz / Mescid-i Haram",
      "style": "Kâbe İmamı Kıraati",
      "famousMakams": [
        "Kürdî",
        "Uşşak",
        "Hicaz"
      ],
      "bio": "Kâbe-i Muazzama imamı; güçlü, yankılı ve derinden etkileyen vakarlı Kürdî ve Bayâtî icraları.",
      "avatarText": "YAD",
      "audioBase": "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/",
      "hasMuallim": false
    },
    {
      "id": "qatami",
      "name": "Şeyh Nâsır el-Katâmî",
      "nameAr": "نَاصِر القَطَامِي",
      "school": "hicaz",
      "schoolTitle": "Körfez / Riyad Ekolü",
      "style": "Dokunaklı & Modern",
      "famousMakams": [
        "Kürdî",
        "Bayâtî"
      ],
      "bio": "Riyad camilerinde hüznü ve gözyaşını samimi bir tınıyla birleştiren çağdaş kâri.",
      "avatarText": "NAQ",
      "audioBase": "https://everyayah.com/data/Nasser_Alqatami_128kbps/",
      "hasMuallim": false
    },
    {
      "id": "alafasy",
      "name": "Meşâri Râşid el-Afâsî",
      "nameAr": "مِشَارِي رَاشِد العَفَاسِي",
      "school": "hicaz",
      "schoolTitle": "Körfez / Hicaz Ekolü",
      "style": "Modern Mürettel",
      "famousMakams": [
        "Kürdî",
        "Rast",
        "Hicaz",
        "Nihavend"
      ],
      "bio": "Milyonlarca gencin Kur'an sevgisini artıran, modern berrak kayıtları ve tecvid intizamıyla öne çıkan kâri.",
      "avatarText": "MRA",
      "audioBase": "https://everyayah.com/data/Alafasy_128kbps/",
      "hasMuallim": false
    },
    {
      "id": "ali_jaber",
      "name": "Şeyh Ali Câbir",
      "nameAr": "عَلِي جَابِر",
      "school": "hicaz",
      "schoolTitle": "Mekke-i Mükerreme Ekolü",
      "style": "Harem-i Şerif Teravih Tertili",
      "famousMakams": [
        "Bayâtî",
        "Kürdî"
      ],
      "bio": "Kâbe-i Muazzama teravihlerinde milyonları ağlatan sade, içten ve pürüzsüz kıraat.",
      "avatarText": "AC",
      "audioBase": "https://everyayah.com/data/Ali_Jaber_64kbps/",
      "hasMuallim": false
    },
    {
      "id": "shuraym",
      "name": "Şeyh Suûd eş-Şüraym",
      "nameAr": "سُعُود الشُّرَيْم",
      "school": "hicaz",
      "schoolTitle": "Hicaz / Kâbe İmamı",
      "style": "Kâbe İmamı Kıraati",
      "famousMakams": [
        "Nevâ",
        "Hicaz",
        "Rast"
      ],
      "bio": "Uzun yıllar Kâbe imamlığı yapmış; ritmik, dengeli ve vakarlı tilavet ekolü.",
      "avatarText": "SAS",
      "audioBase": "https://everyayah.com/data/Saood_ash-Shuraym_128kbps/",
      "hasMuallim": false
    },
    {
      "id": "turk-ekol",
      "name": "Türk Makam Ekolü Seçkisi",
      "nameAr": "المَدْرَسَةُ التُّرْكِيَّة",
      "school": "turk",
      "schoolTitle": "Geleneksel Türk Ekolü",
      "style": "Cami & Tasavvufi Tertil",
      "famousMakams": [
        "Rast",
        "Segâh",
        "Uşşak",
        "Hüzzam"
      ],
      "bio": "Osmanlı'dan bugüne uzanan tecvid nezaketi, ney tonu ve ölçülü koma geçişleriyle Türk tilavet mektebi.",
      "avatarText": "TRK",
      "audioBase": "https://everyayah.com/data/Husary_128kbps/",
      "hasMuallim": true
    }
  ],
  "arabicLetters": [
    {
      "char": "ا",
      "name": "Elif",
      "forms": [
        "ا",
        "ا",
        "ـا",
        "ـا"
      ],
      "sound": "e / a",
      "mahrec": "Ağız ve boğaz boşluğu (Cevf)",
      "zone": "cevf",
      "type": "ince",
      "example": "أَمَرَ",
      "nonConnector": true
    },
    {
      "char": "ب",
      "name": "Bâ",
      "forms": [
        "ب",
        "بـ",
        "ـبـ",
        "ـب"
      ],
      "sound": "be",
      "mahrec": "İki dudağın ıslak kısmının birleşmesi",
      "zone": "sefeteyn",
      "type": "ince",
      "example": "بَلَدٌ"
    },
    {
      "char": "ت",
      "name": "Tâ",
      "forms": [
        "ت",
        "تـ",
        "ـتـ",
        "ـت"
      ],
      "sound": "te",
      "mahrec": "Dil ucunun üst ön diş diplerine değmesi",
      "zone": "lisan",
      "type": "ince",
      "example": "تَابَ"
    },
    {
      "char": "ث",
      "name": "Sâ (Peltek)",
      "forms": [
        "ث",
        "ثـ",
        "ـثـ",
        "ـث"
      ],
      "sound": "se",
      "mahrec": "Dil ucunun ön diş arasından çıkması",
      "zone": "lisan",
      "type": "ince",
      "example": "ثَمَرَةٍ"
    },
    {
      "char": "ج",
      "name": "Cîm",
      "forms": [
        "ج",
        "جـ",
        "ـجـ",
        "ـج"
      ],
      "sound": "ce",
      "mahrec": "Dil ortasının üst damağa yapışması",
      "zone": "lisan",
      "type": "ince",
      "example": "جَعَلَ"
    },
    {
      "char": "ح",
      "name": "Hâ",
      "forms": [
        "ح",
        "حـ",
        "ـحـ",
        "ـح"
      ],
      "sound": "ha",
      "mahrec": "Boğazın tam ortasından buharlı",
      "zone": "halk",
      "type": "bogaz",
      "example": "حَسَنٌ"
    },
    {
      "char": "خ",
      "name": "Hı",
      "forms": [
        "خ",
        "خـ",
        "ـخـ",
        "ـخ"
      ],
      "sound": "hı",
      "mahrec": "Boğazın ağza en yakın üst kısmından hırıltılı",
      "zone": "halk",
      "type": "kalin",
      "example": "خَلَقَ"
    },
    {
      "char": "د",
      "name": "Dâl",
      "forms": [
        "د",
        "د",
        "ـد",
        "ـد"
      ],
      "sound": "de",
      "mahrec": "Dil ucunun üst ön diş diplerine vurması",
      "zone": "lisan",
      "type": "ince",
      "example": "دَخَلَ",
      "nonConnector": true
    },
    {
      "char": "ذ",
      "name": "Zâl (Peltek)",
      "forms": [
        "ذ",
        "ذ",
        "ـذ",
        "ـذ"
      ],
      "sound": "ze",
      "mahrec": "Dil ucunun üst diş uçlarına dokunması",
      "zone": "lisan",
      "type": "ince",
      "example": "ذَكَرَ",
      "nonConnector": true
    },
    {
      "char": "ر",
      "name": "Râ",
      "forms": [
        "ر",
        "ر",
        "ـر",
        "ـر"
      ],
      "sound": "ra / re",
      "mahrec": "Dil ucunun arkasının üst ön damakla teması",
      "zone": "lisan",
      "type": "degisken",
      "example": "رَزَقَ",
      "nonConnector": true
    },
    {
      "char": "ز",
      "name": "Zê",
      "forms": [
        "ز",
        "ز",
        "ـز",
        "ـز"
      ],
      "sound": "ze",
      "mahrec": "Dil ucunun alt ön diş üst kenarına yaklaşması",
      "zone": "lisan",
      "type": "ince",
      "example": "زَلْزَلَةً",
      "nonConnector": true
    },
    {
      "char": "س",
      "name": "Sîn",
      "forms": [
        "س",
        "سـ",
        "ـسـ",
        "ـس"
      ],
      "sound": "se",
      "mahrec": "Dil ucunun alt diş arkasından ıslıklı çıkışı",
      "zone": "lisan",
      "type": "ince",
      "example": "سَمِعَ"
    },
    {
      "char": "ش",
      "name": "Şîn",
      "forms": [
        "ش",
        "شـ",
        "ـشـ",
        "ـش"
      ],
      "sound": "şe",
      "mahrec": "Dil ortasının üst damağa yaklaşıp yayılması",
      "zone": "lisan",
      "type": "ince",
      "example": "شَكَرَ"
    },
    {
      "char": "ص",
      "name": "Sâd",
      "forms": [
        "ص",
        "صـ",
        "ـصـ",
        "ـص"
      ],
      "sound": "sa",
      "mahrec": "Dili damağa yapıştırarak dolgun s",
      "zone": "lisan",
      "type": "kalin",
      "example": "صَبَرَ"
    },
    {
      "char": "ض",
      "name": "Dâd",
      "forms": [
        "ض",
        "ضـ",
        "ـضـ",
        "ـض"
      ],
      "sound": "da / zla",
      "mahrec": "Dil yanının üst azı dişlerine basması",
      "zone": "lisan",
      "type": "kalin",
      "example": "ضَرَبَ"
    },
    {
      "char": "ط",
      "name": "Tı",
      "forms": [
        "ط",
        "طـ",
        "ـطـ",
        "ـط"
      ],
      "sound": "ta",
      "mahrec": "Dil ucunun üst diş diplerine kuvvetle vurması",
      "zone": "lisan",
      "type": "kalin",
      "example": "طَلَبَ"
    },
    {
      "char": "ظ",
      "name": "Zı (Peltek)",
      "forms": [
        "ظ",
        "ظـ",
        "ـظـ",
        "ـظ"
      ],
      "sound": "za",
      "mahrec": "Dil ucunun üst dişlerden hafif çıkıp kalınlaşması",
      "zone": "lisan",
      "type": "kalin",
      "example": "ظَلَمَ"
    },
    {
      "char": "ع",
      "name": "Ayn",
      "forms": [
        "ع",
        "عـ",
        "ـعـ",
        "ـع"
      ],
      "sound": "‘a",
      "mahrec": "Boğaz ortasının sıkılmasıyla çıkan gırtlak sesi",
      "zone": "halk",
      "type": "bogaz",
      "example": "عَلِمَ"
    },
    {
      "char": "غ",
      "name": "Gayn",
      "forms": [
        "غ",
        "غـ",
        "ـغـ",
        "ـغ"
      ],
      "sound": "ga",
      "mahrec": "Boğazın ağza en yakın kısmından yumuşak akış",
      "zone": "halk",
      "type": "kalin",
      "example": "غَفَرَ"
    },
    {
      "char": "ف",
      "name": "Fê",
      "forms": [
        "ف",
        "فـ",
        "ـفـ",
        "ـف"
      ],
      "sound": "fe",
      "mahrec": "Üst ön diş uçlarının alt dudak içine basması",
      "zone": "sefeteyn",
      "type": "ince",
      "example": "فَتَحَ"
    },
    {
      "char": "ق",
      "name": "Kâf",
      "forms": [
        "ق",
        "قـ",
        "ـقـ",
        "ـق"
      ],
      "sound": "ka",
      "mahrec": "Dil kökünün küçük dil karşısındaki damağa vurması",
      "zone": "lisan",
      "type": "kalin",
      "example": "قَرَأَ"
    },
    {
      "char": "ك",
      "name": "Kef",
      "forms": [
        "ك",
        "كـ",
        "ـكـ",
        "ـك"
      ],
      "sound": "ke",
      "mahrec": "Dil kökünün biraz ön tarafının sert damağa vurması",
      "zone": "lisan",
      "type": "ince",
      "example": "كَتَبَ"
    },
    {
      "char": "ل",
      "name": "Lâm",
      "forms": [
        "ل",
        "لـ",
        "ـلـ",
        "ـل"
      ],
      "sound": "le",
      "mahrec": "Dil ucunun iki yanının üst ön diş etlerine değmesi",
      "zone": "lisan",
      "type": "ince",
      "example": "لَعَلَّ"
    },
    {
      "char": "م",
      "name": "Mîm",
      "forms": [
        "م",
        "مـ",
        "ـمـ",
        "ـم"
      ],
      "sound": "me",
      "mahrec": "İki dudağın kuru kısmının birbirine kapanması",
      "zone": "sefeteyn",
      "type": "ince",
      "example": "مَلِكٌ"
    },
    {
      "char": "ن",
      "name": "Nûn",
      "forms": [
        "ن",
        "نـ",
        "ـنـ",
        "ـن"
      ],
      "sound": "ne",
      "mahrec": "Dil ucunun üst ön diş etlerine basması",
      "zone": "haysum",
      "type": "ince",
      "example": "نَصَرَ"
    },
    {
      "char": "و",
      "name": "Vâv",
      "forms": [
        "و",
        "و",
        "ـو",
        "ـو"
      ],
      "sound": "ve / û",
      "mahrec": "Dudakların yuvarlaklaştırılarak ileri uzatılması",
      "zone": "sefeteyn",
      "type": "ince",
      "example": "وَهَبَ",
      "nonConnector": true
    },
    {
      "char": "ه",
      "name": "Hê",
      "forms": [
        "ه",
        "هـ",
        "ـهـ",
        "ـه"
      ],
      "sound": "he",
      "mahrec": "Boğazın en altından, göğse en yakın yerden",
      "zone": "halk",
      "type": "ince",
      "example": "هَدَى"
    },
    {
      "char": "ي",
      "name": "Yâ",
      "forms": [
        "ي",
        "يـ",
        "ـيـ",
        "ـي"
      ],
      "sound": "ye / î",
      "mahrec": "Dil ortasının üst damağa yükselmesi",
      "zone": "lisan",
      "type": "ince",
      "example": "يَسِيرٌ"
    }
  ],
  "harekeler": {
    "ustun": [
      {
        "char": "اَ",
        "sound": "e",
        "name": "Elif"
      },
      {
        "char": "بَ",
        "sound": "be",
        "name": "Bâ"
      },
      {
        "char": "تَ",
        "sound": "te",
        "name": "Tâ"
      },
      {
        "char": "ثَ",
        "sound": "se",
        "name": "Sâ"
      },
      {
        "char": "جَ",
        "sound": "ce",
        "name": "Cîm"
      },
      {
        "char": "حَ",
        "sound": "ha",
        "name": "Hâ"
      },
      {
        "char": "خَ",
        "sound": "ha",
        "name": "Hı"
      },
      {
        "char": "دَ",
        "sound": "de",
        "name": "Dâl"
      },
      {
        "char": "ذَ",
        "sound": "ze",
        "name": "Zâl"
      },
      {
        "char": "رَ",
        "sound": "ra",
        "name": "Râ"
      },
      {
        "char": "زَ",
        "sound": "ze",
        "name": "Zê"
      },
      {
        "char": "سَ",
        "sound": "se",
        "name": "Sîn"
      },
      {
        "char": "شَ",
        "sound": "şe",
        "name": "Şîn"
      },
      {
        "char": "صَ",
        "sound": "sa",
        "name": "Sâd"
      },
      {
        "char": "ضَ",
        "sound": "da",
        "name": "Dâd"
      },
      {
        "char": "طَ",
        "sound": "ta",
        "name": "Tı"
      },
      {
        "char": "ظَ",
        "sound": "za",
        "name": "Zı"
      },
      {
        "char": "عَ",
        "sound": "‘a",
        "name": "Ayn"
      },
      {
        "char": "غَ",
        "sound": "ga",
        "name": "Gayn"
      },
      {
        "char": "فَ",
        "sound": "fe",
        "name": "Fê"
      },
      {
        "char": "قَ",
        "sound": "ka",
        "name": "Kâf"
      },
      {
        "char": "كَ",
        "sound": "ke",
        "name": "Kef"
      },
      {
        "char": "لَ",
        "sound": "le",
        "name": "Lâm"
      },
      {
        "char": "مَ",
        "sound": "me",
        "name": "Mîm"
      },
      {
        "char": "نَ",
        "sound": "ne",
        "name": "Nûn"
      },
      {
        "char": "وَ",
        "sound": "ve",
        "name": "Vâv"
      },
      {
        "char": "هَ",
        "sound": "he",
        "name": "Hê"
      },
      {
        "char": "يَ",
        "sound": "ye",
        "name": "Yâ"
      }
    ],
    "esre": [
      {
        "char": "اِ",
        "sound": "i",
        "name": "Elif"
      },
      {
        "char": "بِ",
        "sound": "bi",
        "name": "Bâ"
      },
      {
        "char": "تِ",
        "sound": "ti",
        "name": "Tâ"
      },
      {
        "char": "ثِ",
        "sound": "si",
        "name": "Sâ"
      },
      {
        "char": "جِ",
        "sound": "ci",
        "name": "Cîm"
      },
      {
        "char": "حِ",
        "sound": "hı",
        "name": "Hâ"
      },
      {
        "char": "خِ",
        "sound": "hı",
        "name": "Hı"
      },
      {
        "char": "دِ",
        "sound": "di",
        "name": "Dâl"
      },
      {
        "char": "ذِ",
        "sound": "zi",
        "name": "Zâl"
      },
      {
        "char": "رِ",
        "sound": "ri",
        "name": "Râ"
      },
      {
        "char": "زِ",
        "sound": "zi",
        "name": "Zê"
      },
      {
        "char": "سِ",
        "sound": "si",
        "name": "Sîn"
      },
      {
        "char": "شِ",
        "sound": "şi",
        "name": "Şîn"
      },
      {
        "char": "صِ",
        "sound": "sı",
        "name": "Sâd"
      },
      {
        "char": "ضِ",
        "sound": "dı",
        "name": "Dâd"
      },
      {
        "char": "طِ",
        "sound": "tı",
        "name": "Tı"
      },
      {
        "char": "ظِ",
        "sound": "zı",
        "name": "Zı"
      },
      {
        "char": "عِ",
        "sound": "‘i",
        "name": "Ayn"
      },
      {
        "char": "غِ",
        "sound": "gı",
        "name": "Gayn"
      },
      {
        "char": "فِ",
        "sound": "fi",
        "name": "Fê"
      },
      {
        "char": "قِ",
        "sound": "kı",
        "name": "Kâf"
      },
      {
        "char": "كِ",
        "sound": "ki",
        "name": "Kef"
      },
      {
        "char": "لِ",
        "sound": "li",
        "name": "Lâm"
      },
      {
        "char": "مِ",
        "sound": "mi",
        "name": "Mîm"
      },
      {
        "char": "نِ",
        "sound": "ni",
        "name": "Nûn"
      },
      {
        "char": "وِ",
        "sound": "vi",
        "name": "Vâv"
      },
      {
        "char": "هِ",
        "sound": "hi",
        "name": "Hê"
      },
      {
        "char": "يِ",
        "sound": "yi",
        "name": "Yâ"
      }
    ],
    "otre": [
      {
        "char": "اُ",
        "sound": "ü",
        "name": "Elif"
      },
      {
        "char": "بُ",
        "sound": "bü",
        "name": "Bâ"
      },
      {
        "char": "تُ",
        "sound": "tü",
        "name": "Tâ"
      },
      {
        "char": "ثُ",
        "sound": "sü",
        "name": "Sâ"
      },
      {
        "char": "جُ",
        "sound": "cü",
        "name": "Cîm"
      },
      {
        "char": "حُ",
        "sound": "hu",
        "name": "Hâ"
      },
      {
        "char": "خُ",
        "sound": "hu",
        "name": "Hı"
      },
      {
        "char": "دُ",
        "sound": "dü",
        "name": "Dâl"
      },
      {
        "char": "ذُ",
        "sound": "zü",
        "name": "Zâl"
      },
      {
        "char": "رُ",
        "sound": "ru",
        "name": "Râ"
      },
      {
        "char": "زُ",
        "sound": "zü",
        "name": "Zê"
      },
      {
        "char": "سُ",
        "sound": "sü",
        "name": "Sîn"
      },
      {
        "char": "شُ",
        "sound": "şü",
        "name": "Şîn"
      },
      {
        "char": "صُ",
        "sound": "su",
        "name": "Sâd"
      },
      {
        "char": "ضُ",
        "sound": "du",
        "name": "Dâd"
      },
      {
        "char": "طُ",
        "sound": "tu",
        "name": "Tı"
      },
      {
        "char": "ظُ",
        "sound": "zu",
        "name": "Zı"
      },
      {
        "char": "عُ",
        "sound": "‘u",
        "name": "Ayn"
      },
      {
        "char": "غُ",
        "sound": "gu",
        "name": "Gayn"
      },
      {
        "char": "فُ",
        "sound": "fü",
        "name": "Fê"
      },
      {
        "char": "قُ",
        "sound": "ku",
        "name": "Kâf"
      },
      {
        "char": "كُ",
        "sound": "kü",
        "name": "Kef"
      },
      {
        "char": "لُ",
        "sound": "lü",
        "name": "Lâm"
      },
      {
        "char": "مُ",
        "sound": "mü",
        "name": "Mîm"
      },
      {
        "char": "نُ",
        "sound": "nü",
        "name": "Nûn"
      },
      {
        "char": "وُ",
        "sound": "vü",
        "name": "Vâv"
      },
      {
        "char": "هُ",
        "sound": "hü",
        "name": "Hê"
      },
      {
        "char": "يُ",
        "sound": "yü",
        "name": "Yâ"
      }
    ]
  },
  "cezmSedde": {
    "cezm": [
      {
        "glyph": "اَبْ",
        "sound": "eb",
        "desc": "Elif üstünlü, Bâ cezimli"
      },
      {
        "glyph": "اَتْ",
        "sound": "et",
        "desc": "Elif üstünlü, Tâ cezimli"
      },
      {
        "glyph": "اَلْ",
        "sound": "el",
        "desc": "Elif üstünlü, Lâm cezimli"
      },
      {
        "glyph": "مَنْ",
        "sound": "men",
        "desc": "Mîm üstünlü, Nûn cezimli"
      },
      {
        "glyph": "قُلْ",
        "sound": "kul",
        "desc": "Kâf ötreli, Lâm cezimli"
      },
      {
        "glyph": "كُمْ",
        "sound": "küm",
        "desc": "Kef ötreli, Mîm cezimli"
      },
      {
        "glyph": "هَلْ",
        "sound": "hel",
        "desc": "Hê üstünlü, Lâm cezimli"
      },
      {
        "glyph": "لَمْ",
        "sound": "lem",
        "desc": "Lâm üstünlü, Mîm cezimli"
      },
      {
        "glyph": "اَمْ",
        "sound": "em",
        "desc": "Elif üstünlü, Mîm cezimli"
      },
      {
        "glyph": "صَدْ",
        "sound": "sad",
        "desc": "Sâd üstünlü, Dâl cezimli (Kalkaleli)"
      },
      {
        "glyph": "رَبْ",
        "sound": "rab",
        "desc": "Râ üstünlü, Bâ cezimli (Kalkaleli)"
      },
      {
        "glyph": "كَيْ",
        "sound": "key",
        "desc": "Kef üstünlü, Yâ cezimli (Lîn harfi)"
      }
    ],
    "sedde": [
      {
        "glyph": "اَبَّ",
        "sound": "eb-be",
        "desc": "Bâ harfi iki defa kuvvetle tutulup açılır"
      },
      {
        "glyph": "اِنَّ",
        "sound": "in-ne",
        "desc": "Şeddeli Nûn gunneli (1.5 elif) tutulur"
      },
      {
        "glyph": "رَبِّ",
        "sound": "rab-bi",
        "desc": "Râ üstün, Bâ esreli şeddeli"
      },
      {
        "glyph": "ثُمَّ",
        "sound": "süm-me",
        "desc": "Şeddeli Mîm gunneli (1.5 elif) tutulur"
      },
      {
        "glyph": "حَقٌّ",
        "sound": "hak-kun",
        "desc": "Kâf şeddeli ve tenvinli"
      },
      {
        "glyph": "كُلَّ",
        "sound": "kül-le",
        "desc": "Kef ötreli, Lâm şeddeli"
      },
      {
        "glyph": "عَمَّ",
        "sound": "am-me",
        "desc": "Ayn üstünlü, Mîm şeddeli ve gunneli"
      },
      {
        "glyph": "مَدَّ",
        "sound": "med-de",
        "desc": "Mîm üstünlü, Dâl şeddeli"
      }
    ]
  },
  "tenvin": [
    {
      "glyph": "اَبًا",
      "sound": "eben",
      "type": "İki Üstün",
      "meaning": "Baba olarak",
      "desc": "Kelime sonuna cezimli nun sesi katar (-en)"
    },
    {
      "glyph": "كُفُوًا",
      "sound": "küfüven",
      "type": "İki Üstün",
      "meaning": "Denk, eş",
      "desc": "İhlâs Sûresi 4. âyette geçer"
    },
    {
      "glyph": "رَحْمَةً",
      "sound": "rahmeten",
      "type": "İki Üstün",
      "meaning": "Rahmet olarak",
      "desc": "Yuvarlak Te üzerinde iki üstün"
    },
    {
      "glyph": "عِلْمًا",
      "sound": "ilmen",
      "type": "İki Üstün",
      "meaning": "İlim bakımından",
      "desc": "Mîm üzerinde iki üstün (Tâhâ 114)"
    },
    {
      "glyph": "عَلِيمًا",
      "sound": "alîmen",
      "type": "İki Üstün",
      "meaning": "Hakkıyla bilen",
      "desc": "Nisâ Sûresi 170. âyet"
    },
    {
      "glyph": "حَكِيمًا",
      "sound": "hakîmen",
      "type": "İki Üstün",
      "meaning": "Hüküm ve hikmet sahibi",
      "desc": "İnsân Sûresi 30. âyet"
    },
    {
      "glyph": "اَبٍ",
      "sound": "ebin",
      "type": "İki Esre",
      "meaning": "Bir babanın",
      "desc": "Kelime sonuna -in sesi katar"
    },
    {
      "glyph": "لَهَبٍ",
      "sound": "lehebin",
      "type": "İki Esre",
      "meaning": "Alevli (Ebû Leheb)",
      "desc": "Tebbet Sûresi 1. âyette geçer"
    },
    {
      "glyph": "نَفْسٍ",
      "sound": "nefsin",
      "type": "İki Esre",
      "meaning": "Bir can, kimse",
      "desc": "Bakara Sûresi 48. âyet"
    },
    {
      "glyph": "عِيشَةٍ",
      "sound": "îşetin",
      "type": "İki Esre",
      "meaning": "Hoşnut bir hayat içinde",
      "desc": "Kâria Sûresi 7. âyette geçer"
    },
    {
      "glyph": "شَيْءٍ",
      "sound": "şey'in",
      "type": "İki Esre",
      "meaning": "Herhangi bir şey",
      "desc": "Yâsîn Sûresi 82. âyet"
    },
    {
      "glyph": "قَدِيرٍ",
      "sound": "kadîrin",
      "type": "İki Esre",
      "meaning": "Her şeye gücü yeten",
      "desc": "Mülk Sûresi 1. âyet"
    },
    {
      "glyph": "اَبٌ",
      "sound": "ebün",
      "type": "İki Ötre",
      "meaning": "Bir baba",
      "desc": "Kelime sonuna -ün/-un sesi katar"
    },
    {
      "glyph": "أَحَدٌ",
      "sound": "ehadün",
      "type": "İki Ötre",
      "meaning": "Bir, tek olan Allah",
      "desc": "İhlâs Sûresi 1. âyette geçer"
    },
    {
      "glyph": "نُورٌ",
      "sound": "nûrun",
      "type": "İki Ötre",
      "meaning": "Aydınlık, nur",
      "desc": "Nûr Sûresi 35. âyet"
    },
    {
      "glyph": "كِتَابٌ",
      "sound": "kitâbün",
      "type": "İki Ötre",
      "meaning": "Yüce bir kitap",
      "desc": "Bakara Sûresi 2. âyet"
    },
    {
      "glyph": "غَفُورٌ",
      "sound": "gafûrun",
      "type": "İki Ötre",
      "meaning": "Çok bağışlayan",
      "desc": "Bakara Sûresi 173. âyet"
    },
    {
      "glyph": "شَكُورٌ",
      "sound": "şekûrun",
      "type": "İki Ötre",
      "meaning": "Şükrün karşılığını bolca veren",
      "desc": "Fâtır Sûresi 30. âyet"
    }
  ],
  "med": [
    {
      "glyph": "بَا",
      "sound": "bâ",
      "type": "Elif ile Med",
      "desc": "Öncesi fethalı harfi 1 elif (yaklaşık 1-1.5 sn) uzatır"
    },
    {
      "glyph": "تَا",
      "sound": "tâ",
      "type": "Elif ile Med",
      "desc": "Tâ harfini tabiî med ile uzatır"
    },
    {
      "glyph": "قَالَ",
      "sound": "kâ-le",
      "type": "Elif ile Med",
      "desc": "Kâf harfi elif ile uzatılır"
    },
    {
      "glyph": "بُو",
      "sound": "bû",
      "type": "Vâv ile Med",
      "desc": "Öncesi dammeli harfi 1 elif uzatır"
    },
    {
      "glyph": "تُو",
      "sound": "tû",
      "type": "Vâv ile Med",
      "desc": "Tâ harfini damme ve vâv ile uzatır"
    },
    {
      "glyph": "يَقُولُ",
      "sound": "ye-kû-lü",
      "type": "Vâv ile Med",
      "desc": "Kâf harfi vâv ile uzatılır"
    },
    {
      "glyph": "بِي",
      "sound": "bî",
      "type": "Yâ ile Med",
      "desc": "Öncesi kesralı harfi 1 elif uzatır"
    },
    {
      "glyph": "تِي",
      "sound": "tî",
      "type": "Yâ ile Med",
      "desc": "Tâ harfini kesra ve yâ ile uzatır"
    },
    {
      "glyph": "قِيلَ",
      "sound": "kî-le",
      "type": "Yâ ile Med",
      "desc": "Kâf harfi yâ ile uzatılır"
    },
    {
      "glyph": "نُوحِيهَا",
      "sound": "nû - hî - hâ",
      "type": "Üç Meddi Birleştiren Âyet",
      "desc": "Vâv, Yâ ve Elif uzatmalarını sırasıyla içeren klasik talim kelimesi (Hûd 49)"
    }
  ],
  "heceleme": [
    {
      "word": "كَتَبَ",
      "syllables": [
        "بَ",
        "تَ",
        "كَ"
      ],
      "latin": "ke - te - be",
      "tr": "Yazdı"
    },
    {
      "word": "ذَهَبَ",
      "syllables": [
        "بَ",
        "هَ",
        "ذَ"
      ],
      "latin": "ze - he - be",
      "tr": "Gitti"
    },
    {
      "word": "خَلَقَ",
      "syllables": [
        "قَ",
        "لَ",
        "خَ"
      ],
      "latin": "ha - la - ka",
      "tr": "Yarattı"
    },
    {
      "word": "عَلِمَ",
      "syllables": [
        "مَ",
        "لِ",
        "عَ"
      ],
      "latin": "‘a - li - me",
      "tr": "Bildi"
    },
    {
      "word": "رَزَقَ",
      "syllables": [
        "قَ",
        "زَ",
        "رَ"
      ],
      "latin": "ra - za - ka",
      "tr": "Rızıklandırdı"
    },
    {
      "word": "غَفَرَ",
      "syllables": [
        "رَ",
        "فَ",
        "غَ"
      ],
      "latin": "ğa - fe - ra",
      "tr": "Bağışladı"
    },
    {
      "word": "صَدَقَ",
      "syllables": [
        "قَ",
        "دَ",
        "صَ"
      ],
      "latin": "sa - da - ka",
      "tr": "Doğru söyledi"
    },
    {
      "word": "حَمِدَ",
      "syllables": [
        "دَ",
        "مِ",
        "حَ"
      ],
      "latin": "ha - mi - de",
      "tr": "Hamdetti"
    },
    {
      "word": "الْحَمْدُ",
      "syllables": [
        "دُ",
        "حَمْ",
        "اَلْ"
      ],
      "latin": "el - ham - dü",
      "tr": "Hamd (Övgü)"
    },
    {
      "word": "يُؤْمِنُونَ",
      "syllables": [
        "نَ",
        "نُو",
        "مِ",
        "يُؤْ"
      ],
      "latin": "yü’ - mi - nû - ne",
      "tr": "İnanırlar"
    },
    {
      "word": "مَالِكِ",
      "syllables": [
        "كِ",
        "لِ",
        "مَا"
      ],
      "latin": "mâ - li - ki",
      "tr": "Sahibi, Hükümranı"
    },
    {
      "word": "نَعْبُدُ",
      "syllables": [
        "دُ",
        "بُ",
        "نَعْ"
      ],
      "latin": "na’ - bü - dü",
      "tr": "Kulluk ederiz"
    },
    {
      "word": "نَسْتَعِينُ",
      "syllables": [
        "نُ",
        "عِي",
        "تَ",
        "نَسْ"
      ],
      "latin": "nes - te - ‘î - nü",
      "tr": "Yardım dileriz"
    },
    {
      "word": "أَنْعَمْتَ",
      "syllables": [
        "تَ",
        "عَمْ",
        "أَنْ"
      ],
      "latin": "en - ‘am - te",
      "tr": "Nimet verdin"
    },
    {
      "word": "الصِّرَاطَ",
      "syllables": [
        "طَ",
        "رَا",
        "صِ",
        "اَلصِّ"
      ],
      "latin": "es - cı - râ - ta",
      "tr": "Dosdoğru yol"
    },
    {
      "word": "مُسْتَقِيمَ",
      "syllables": [
        "مَ",
        "قِي",
        "تَ",
        "مُسْ"
      ],
      "latin": "müs - te - kî - me",
      "tr": "İstikametli, doğru"
    },
    {
      "word": "يَعْلَمُونَ",
      "syllables": [
        "نَ",
        "مُو",
        "لَ",
        "يَعْ"
      ],
      "latin": "ya’ - le - mû - ne",
      "tr": "Bilirler"
    },
    {
      "word": "مُفْلِحُونَ",
      "syllables": [
        "نَ",
        "حُو",
        "لِ",
        "مُفْ"
      ],
      "latin": "müf - li - hû - ne",
      "tr": "Kurtuluşa erenler"
    },
    {
      "word": "خَلَقْنَا",
      "syllables": [
        "نَا",
        "لَقْ",
        "خَ"
      ],
      "latin": "ha - lak - nâ",
      "tr": "Biz yarattık"
    },
    {
      "word": "سُبْحَانَ",
      "syllables": [
        "نَ",
        "حَا",
        "سُبْ"
      ],
      "latin": "süb - hâ - ne",
      "tr": "Noksandan münezzehtir"
    }
  ],
  "tecvidRules": [
    {
      "id": "izhar",
      "cat": "nun",
      "name": "İzhâr",
      "ar": "إِظْهَار",
      "family": "madd",
      "surah": 112,
      "ayah": 4,
      "desc": "Sâkin Nûn veya tenvinden sonra 6 boğaz harfinden biri (ء ه ع ح غ خ) gelirse gunnesiz ve duraksamadan net okunur.",
      "samplePhrase": "كُفُوًا أَحَدٌ",
      "ayahRef": "İhlâs Sûresi 4. Âyet"
    },
    {
      "id": "idgam-maalgunne",
      "cat": "nun",
      "name": "İdğâm-ı Maalgunne",
      "ar": "إِدْغَام بِغُنَّة",
      "family": "ihfa",
      "surah": 111,
      "ayah": 1,
      "desc": "Sâkin Nûn veya tenvinden sonra (ي ن م و - Yemnu) harfleri gelirse nûn sesi genizden 1.5 elif tutularak kaynaştırılır.",
      "samplePhrase": "لَهَبٍ وَتَبَّ",
      "ayahRef": "Tebbet Sûresi 1. Âyet"
    },
    {
      "id": "idgam-bilagunne",
      "cat": "nun",
      "name": "İdğâm-ı Bilagunne",
      "ar": "إِدْغَام بِلَا غُنَّة",
      "family": "ihfa",
      "surah": 2,
      "ayah": 5,
      "desc": "Sâkin Nûn veya tenvinden sonra Lâm (ل) veya Râ (ر) gelirse gunnesiz tam idğam yapılır.",
      "samplePhrase": "مِنْ رَبِّهِمْ",
      "ayahRef": "Bakara Sûresi 5. Âyet"
    },
    {
      "id": "iklab",
      "cat": "nun",
      "name": "İklâb",
      "ar": "إِقْلَاب",
      "family": "iklab",
      "surah": 2,
      "ayah": 18,
      "desc": "Sâkin Nûn veya tenvinden sonra Bâ (ب) harfi geldiğinde nûn sesi dudaklar hafifçe kapatılarak gunneli Mîm’e çevrilir.",
      "samplePhrase": "صُمٌّ بُكْمٌ",
      "ayahRef": "Bakara Sûresi 18. Âyet"
    },
    {
      "id": "ihfa",
      "cat": "nun",
      "name": "İhfâ",
      "ar": "إِخْفَاء",
      "family": "ihfa",
      "surah": 2,
      "ayah": 4,
      "desc": "Sâkin Nûn veya tenvinden sonra 15 ihfâ harfi gelirse dil üst diş etine değdirilmeden ses geniz boşluğunda 1.5 elif gizlenir.",
      "samplePhrase": "مِنْ قَبْلِكَ",
      "ayahRef": "Bakara Sûresi 4. Âyet"
    },
    {
      "id": "dudak-ihfasi",
      "cat": "mim",
      "name": "Dudak İhfâsı (İhfâ-i Şefevî)",
      "ar": "إِخْفَاء شَفَوِي",
      "family": "ihfa",
      "surah": 105,
      "ayah": 4,
      "desc": "Sâkin Mîm’den sonra Bâ (ب) harfi gelirse dudaklar kuvvetle sıkılmadan 1.5 elif gunne ile gizlenir.",
      "samplePhrase": "تَرْمِيهِمْ بِحِجَارَةٍ",
      "ayahRef": "Fîl Sûresi 4. Âyet"
    },
    {
      "id": "idgam-misleyn-mim",
      "cat": "mim",
      "name": "İdğâm-ı Misl-i Maalgunne",
      "ar": "إِدْغَام مِثْلَيْن مَعَ الغُنَّة",
      "family": "ihfa",
      "surah": 2,
      "ayah": 25,
      "desc": "Sâkin Mîm’den sonra harekeli Mîm gelirse iki mîm birbirine katılarak 1.5 elif gunne yapılır.",
      "samplePhrase": "لَهُمْ مَا",
      "ayahRef": "Bakara Sûresi 25. Âyet"
    },
    {
      "id": "mim-izhari",
      "cat": "mim",
      "name": "Mîm’in İzhârı (İzhâr-ı Şefevî)",
      "ar": "إِظْهَار شَفَوِي",
      "family": "madd",
      "surah": 1,
      "ayah": 7,
      "desc": "Sâkin Mîm’den sonra Bâ ve Mîm harici 26 harften biri gelirse mîm sesi net ve gunnesiz okunur.",
      "samplePhrase": "عَلَيْهِمْ وَلَا",
      "ayahRef": "Fâtiha Sûresi 7. Âyet"
    },
    {
      "id": "medd-i-tabii",
      "cat": "madd",
      "name": "Medd-i Tabiî (Aslî Med)",
      "ar": "مَدّ طَبِيعِي",
      "family": "madd",
      "surah": 2,
      "ayah": 11,
      "desc": "Med harfinden sonra med sebebi bulunmadığında harfi 1 elif miktarı (yaklaşık 1-1.5 saniye) tabii olarak uzatmak.",
      "samplePhrase": "قَالُوا",
      "ayahRef": "Bakara Sûresi 11. Âyet"
    },
    {
      "id": "medd-i-muttasil",
      "cat": "madd",
      "name": "Medd-i Muttasıl",
      "ar": "مَدّ مُتَّصِل",
      "family": "madd",
      "surah": 110,
      "ayah": 1,
      "desc": "Med harfi ile sebeb-i med olan hemze aynı kelimede bitişik geldiğinde sesi 4 elif miktarı uzatmak vaciptir.",
      "samplePhrase": "إِذَا جَاءَ",
      "ayahRef": "Nasr Sûresi 1. Âyet"
    },
    {
      "id": "medd-i-munfasil",
      "cat": "madd",
      "name": "Medd-i Munfasıl",
      "ar": "مَدّ مُنْفَصِل",
      "family": "madd",
      "surah": 108,
      "ayah": 1,
      "desc": "Med harfi kelime sonunda, hemze ise takip eden kelimenin başında ayrı geldiğinde sesi 4 elif uzatmak caizdir.",
      "samplePhrase": "إِنَّا أَعْطَيْنَاكَ",
      "ayahRef": "Kevser Sûresi 1. Âyet"
    },
    {
      "id": "medd-i-lazim",
      "cat": "madd",
      "name": "Medd-i Lâzım",
      "ar": "مَدّ لَازِم",
      "family": "madd",
      "surah": 1,
      "ayah": 7,
      "desc": "Med harfinden sonra aslî sükûn (cezm veya şedde) geldiğinde sesi tam 4 elif miktarı uzatmak vaciptir.",
      "samplePhrase": "وَلَا الضَّالِّينَ",
      "ayahRef": "Fâtiha Sûresi 7. Âyet"
    },
    {
      "id": "medd-i-ariz",
      "cat": "madd",
      "name": "Medd-i Ârız",
      "ar": "مَدّ عَارِض",
      "family": "madd",
      "surah": 1,
      "ayah": 1,
      "desc": "Med harfinden sonra durak (vakıf) sebebiyle geçici sükûn meydana geldiğinde 1 ila 4 elif arası uzatılabilir.",
      "samplePhrase": "الرَّحِيمِ",
      "ayahRef": "Fâtiha Sûresi 1. Âyet"
    },
    {
      "id": "medd-i-lin",
      "cat": "madd",
      "name": "Medd-i Lîn",
      "ar": "مَدّ لِين",
      "family": "madd",
      "surah": 106,
      "ayah": 1,
      "desc": "Lîn harfi olan sakin Vâv veya Yâ’dan önce fetha gelip sonrasında vakıf sükûnu oluştuğunda yumuşakça uzatmak.",
      "samplePhrase": "قُرَيْشٍ",
      "ayahRef": "Kureyş Sûresi 1. Âyet"
    },
    {
      "id": "kalkale",
      "cat": "letter",
      "name": "Kalkale (Harfi Titretmek)",
      "ar": "قَلْقَلَة",
      "family": "kalkale",
      "surah": 112,
      "ayah": 1,
      "desc": "Kutbu Cedin (ق ط ب ج د) harfleri cezimli olduğunda mahrecine kuvvetle çarpıp sesi titreterek yankılandırmaktır.",
      "samplePhrase": "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "ayahRef": "İhlâs Sûresi 1. Âyet"
    },
    {
      "id": "hukmur-ra",
      "cat": "letter",
      "name": "Hükmü’r-Râ (Kalın/İnce Râ)",
      "ar": "أَحْكَامُ الرَّاء",
      "family": "madd",
      "surah": 1,
      "ayah": 2,
      "desc": "Râ harfi üstün ve ötrede kalın (tefhim), esrede ince (terkik) okunur; cezimliyken önceki harekeye bakılır.",
      "samplePhrase": "رَبِّ الْعَالَمِينَ",
      "ayahRef": "Fâtiha Sûresi 2. Âyet"
    },
    {
      "id": "lam-i-tarif",
      "cat": "letter",
      "name": "Lâm-ı Ta’rif (Şemsiyye/Kameriyye)",
      "ar": "لَامُ التَّعْرِيف",
      "family": "ihfa",
      "surah": 91,
      "ayah": 1,
      "desc": "El (ال) takısının lâm’ı 14 şemsî harfte idğam edilir (eş-Şems), 14 kamerî harfte ise açıkça izhar edilir (el-Kamer).",
      "samplePhrase": "وَالشَّمْسِ وَضُحَاهَا",
      "ayahRef": "Şems Sûresi 1. Âyet"
    },
    {
      "id": "zamir",
      "cat": "letter",
      "name": "Zamir (Hû Zamiri)",
      "ar": "هَاءُ الضَّمِير",
      "family": "madd",
      "surah": 110,
      "ayah": 3,
      "desc": "Kelime sonundaki Hû zamirinin öncesi harekeli ise 1 elif uzatılır; öncesi cezimli veya med harfi ise uzatılmaz.",
      "samplePhrase": "إِنَّهُ كَانَ تَوَّابًا",
      "ayahRef": "Nasr Sûresi 3. Âyet"
    },
    {
      "id": "vakif-isaretleri",
      "cat": "letter",
      "name": "Vakıf (Secavend) İşaretleri",
      "ar": "عَلَامَاتُ الْوَقْف",
      "family": "madd",
      "surah": 2,
      "ayah": 2,
      "desc": "Mushaf’ta durma ve geçme kaideleri: (م) Kesin durulur, (ط) Mutlak vakıf, (ج) Durmak serbest, (لا) Durulmaz, geçilir.",
      "samplePhrase": "لَا رَيْبَ ۛ فِيهِ ۛ",
      "ayahRef": "Bakara Sûresi 2. Âyet"
    }
  ],
  "qiraat": {
    "title": "Aşere-i Mütevâtire Kıraat ve Rivayet Kataloğu",
    "description": "Sahabe-i kiramdan tevatür yoluyla günümüze ulaşan 10 sahih imam ve 20 meşhur râvisinin okuyuş hükümleri ve usûl kaideleri.",
    "academicReferences": [
      "İbnü'l-Cezerî, en-Neşr fi'l-Kırââti'l-Aşr",
      "İmam eş-Şâtıbî, Hırzü'l-Emânî ve Vechü't-Tehânî (eş-Şâtıbiyye)",
      "İbnü'l-Cezerî, Tayyibetü'n-Neşr fi'l-Kırââti'l-Aşr"
    ],
    "disclaimer": "Farklı kıraat ve rivayetler lehçe farklılıkları veya musiki/makam varyasyonları değil; Hz. Peygamber'e (s.a.v.) dayanan vahyî okuyuş biçimleridir. Kesinlikle ehil hoca (fem-i muhsin) denetimi olmadan kendi kendine kıraat tatbikatı yapılmamalıdır.",
    "imams": [
      {
        "id": "asim",
        "name": "İmam Âsım b. Behdele el-Kûfî (v. 127/745)",
        "region": "Kûfe",
        "rawis": [
          {
            "id": "hafs",
            "name": "Hafs b. Süleyman (v. 180/796)",
            "status": "Dünya genelinde (%90+) en yaygın okunan rivayet",
            "rulesSummary": "Met ve harekelerde tahkik esas, imale sadece Hud 41'de (Mecrêhê), teshil Fussilet 44'te (E-a'cemiyyün)."
          },
          {
            "id": "sube",
            "name": "Şu'be b. Ayyâş (v. 193/809)",
            "status": "İslam dünyasının kadim rivayetlerindendir",
            "rulesSummary": "Bazı ferşî kelimelerde hemze ve sükûn farklılıkları, belirli kelimelerde imâle."
          }
        ]
      },
      {
        "id": "nafi",
        "name": "İmam Nâfi' b. Abdirrahmân el-Medenî (v. 169/785)",
        "region": "Medîne",
        "rawis": [
          {
            "id": "kalun",
            "name": "Kālûn (İsâ b. Mînâ, v. 220/835)",
            "status": "Libya, Tunus ve Batı Mısır'da yaygın",
            "rulesSummary": "Sıla-i Mîm (mîm-i cem'i vâv ile uzatma caiz), hemze teshili, medd-i munfasıl kasr tercihi."
          },
          {
            "id": "vers",
            "name": "Verş (Osman b. Saîd el-Mısrî, v. 197/812)",
            "status": "Fas, Cezayir, Moritanya ve Batı Afrika'da resmi rivayet",
            "rulesSummary": "Nakl (sâkin harften sonraki hemzenin harekesini sâkine aktarıp hemzeyi düşürme), kalın râ'ların inceltilmesi (terkîk), medd-i bedel'in 2-4-6 vecihle uzatılması, kübrâ/suğrâ imâleler."
          }
        ]
      },
      {
        "id": "ibn-kesir",
        "name": "İmam İbn Kesîr el-Mekkî (v. 120/738)",
        "region": "Mekke",
        "rawis": [
          {
            "id": "bezzi",
            "name": "el-Bezzî (v. 250/864)",
            "status": "Mekke kıraati",
            "rulesSummary": "Duha'dan itibaren her sure sonunda tekbir, sıla-i zamir ve mîm."
          },
          {
            "id": "kunbul",
            "name": "Kunbül (v. 291/904)",
            "status": "Mekke kıraati",
            "rulesSummary": "Müfred hemzelerin ibdali ve sıla hükümleri."
          }
        ]
      },
      {
        "id": "ebu-amr",
        "name": "İmam Ebû Amr b. el-Alâ el-Basrî (v. 154/770)",
        "region": "Basra",
        "rawis": [
          {
            "id": "duri-ebu-amr",
            "name": "ed-Dûrî (v. 246/860)",
            "status": "Sudan, Somali ve Yemen'de yaygın",
            "rulesSummary": "İdğâm-ı Kebîr (iki harekeli harfin birbirine katılması), imâleler ve teshil."
          },
          {
            "id": "susi",
            "name": "es-Sûsî (v. 261/874)",
            "status": "Basra kıraati",
            "rulesSummary": "Tüm harekeli mütekarib ve mütemasil harflerde idğam-ı kebir."
          }
        ]
      },
      {
        "id": "ibn-amir",
        "name": "İmam İbn Âmir ed-Dımaşkî (v. 118/736)",
        "region": "Şam",
        "rawis": [
          {
            "id": "hisam",
            "name": "Hişâm b. Ammâr (v. 245/859)",
            "status": "Şam kıraati",
            "rulesSummary": "Vakıf halinde hemzenin ibdali ve teshili."
          },
          {
            "id": "ibn-zekvan",
            "name": "İbn Zekvân (v. 242/856)",
            "status": "Şam kıraati",
            "rulesSummary": "Bazı fiillerde sekte ve imale vecihleri."
          }
        ]
      },
      {
        "id": "hamza",
        "name": "İmam Hamza ez-Zeyyât el-Kûfî (v. 156/773)",
        "region": "Kûfe",
        "rawis": [
          {
            "id": "halef",
            "name": "Halef b. Hişâm (v. 229/844)",
            "status": "Kûfe kıraati",
            "rulesSummary": "Sâkin-i mefsûl ve hemzeli kelimelerde sekte (şahsî tahkik), vakıfta hemzenin tahfifi."
          },
          {
            "id": "hallad",
            "name": "Hallâd b. Hâlid (v. 220/835)",
            "status": "Kûfe kıraati",
            "rulesSummary": "İşmâm (Sad harfini Za harfi kokusuyla okuma) ve vakıf tahfifleri."
          }
        ]
      },
      {
        "id": "kisai",
        "name": "İmam el-Kisâî el-Kûfî (v. 189/805)",
        "region": "Kûfe",
        "rawis": [
          {
            "id": "ebul-haris",
            "name": "Ebü'l-Hâris el-Leys (v. 240/854)",
            "status": "Kûfe kıraati",
            "rulesSummary": "Vakıf halinde müenneslik te'sinden önceki harfte imâle."
          },
          {
            "id": "duri-kisai",
            "name": "ed-Dûrî (v. 246/860)",
            "status": "Kûfe kıraati",
            "rulesSummary": "Geniş imâle usulü ve idğam hükümleri."
          }
        ]
      },
      {
        "id": "ebu-cafer",
        "name": "İmam Ebû Ca'fer Yezîd b. el-Ka'kā' (v. 130/747)",
        "region": "Medîne",
        "rawis": [
          {
            "id": "ibn-verdan",
            "name": "İbn Vardân (v. 160/777)",
            "status": "Medine 3 imam kıraati",
            "rulesSummary": "Müfred sâkin hemzelerin tam ibdali."
          },
          {
            "id": "ibn-cemmaz",
            "name": "İbn Cemmâz (v. 170/786)",
            "status": "Medine 3 imam kıraati",
            "rulesSummary": "İhfâ-yı şefevî ve hemze kolaylaştırmaları."
          }
        ]
      },
      {
        "id": "yakub",
        "name": "İmam Ya'kūb el-Hadramî (v. 205/820)",
        "region": "Basra",
        "rawis": [
          {
            "id": "ruveys",
            "name": "Ruveys (v. 238/852)",
            "status": "Basra 3 imam kıraati",
            "rulesSummary": "He-i sekte ile vakıf ve tenvin idğamları."
          },
          {
            "id": "ravh",
            "name": "Ravh b. Abdilmü'min (v. 234/848)",
            "status": "Basra 3 imam kıraati",
            "rulesSummary": "He-i kinâye ve lafzatullah hükümleri."
          }
        ]
      },
      {
        "id": "haleful-asir",
        "name": "İmam Halefü'l-Âşir (v. 229/844)",
        "region": "Kûfe",
        "rawis": [
          {
            "id": "ishak",
            "name": "İshâk b. İbrâhîm el-Verrâk (v. 286/899)",
            "status": "Kûfe 10. imam kıraati",
            "rulesSummary": "Hamza usulüne yakın; gunnesiz idğam ve imâle vecihleri."
          },
          {
            "id": "idris",
            "name": "İdrîs b. Abdilkerîm el-Haddâd (v. 292/905)",
            "status": "Kûfe 10. imam kıraati",
            "rulesSummary": "Sekte ve tahkik hükümleri."
          }
        ]
      }
    ],
    "usulDifferences": [
      {
        "rule": "İmâle (İnklinasyon)",
        "description": "Fetha (üstün) harekesini kesreye (esreye), elifi de yâ harfine meylettirerek okumak.",
        "hafs": "Sadece 11:41 (Mecrêhê)",
        "vers": "Bütün zâtü'l-yâ kelimelerde taklîl (küçük imâle)",
        "hamzaKisai": "Geniş kübrâ imâle tatbikatı"
      },
      {
        "rule": "Nakil (Aktarma)",
        "description": "Sâkin harften sonra gelen hemzenin harekesini sâkin harfe aktarıp hemzeyi تلفz etmeden düşürmek.",
        "hafs": "Sadece 49:11 (Bi'sel-ismu)",
        "vers": "Bütün Kur'an'da sâkin harf + hemze durumunda genel kural (Örn: Kud efleha -> Kudeffleha)",
        "hamzaKisai": "Vakıf durumunda nakil ve tahfif"
      },
      {
        "rule": "İdğâm-ı Kebîr (Büyük Kaynaştırma)",
        "description": "Her ikisi de harekeli olan mütemâsil veya mütekârib iki harfin birincisini sâkin kılıp ikincisine katmak.",
        "hafs": "Uygulanmaz (tahkik)",
        "ebuAmrSusi": "Tüm Kur'an'da genel kural (Örn: er-Rahmâni'r-Rahîm / Mâliki -> er-Rahîm-mâliki)",
        "diger": "İstisnai yerlerde"
      },
      {
        "rule": "Sıla-i Mîm-i Cem'",
        "description": "Çoğul mîm'inden sonra gelen zamiri küçük bir vâv ile uzatarak okumak.",
        "hafs": "Yalnızca kendisinden sonra hemze-i vasl geldiğinde değil, normalde sükûnla okunur.",
        "kalunIbnKesir": "Aleyhimū, Entehumū şeklinde sıla ile okumak caizdir.",
        "vers": "Sadece hemze-i kat' öncesinde medd-i munfasıl hükmünde uzatır."
      }
    ]
  },
  "secavend": [
    {
      "symbol": "م",
      "name": "Vakf-ı Lâzım (م)",
      "desc": "Muhakkak durulması gereken yerdir. Geçilirse mânâ tamamen bozulabilir veya yanlış anlaşılabilir.",
      "hukum": "Durmak vâcip / gereklidir.",
      "sampleAr": "إِنَّمَا يَسْتَجِيبُ الَّذِينَ يَسْمَعُونَ ۘ وَالْمَوْتَىٰ يَبْعَثُهُمُ اللَّهُ",
      "sampleLatin": "İnnemâ yestecîbüllezîne yesme'ûn (م) Vel-mevtâ yeb'asühümullâh...",
      "surah": 6,
      "ayah": 36,
      "explanation": "'Ancak dinleyenler icabet eder' cümlesinde durulmaz da 'Ölüleri de Allah diriltir' cümlesine bağlanırsa, ölülerin de icabet ettiği gibi yanlış bir mana çıkabilir."
    },
    {
      "symbol": "ط",
      "name": "Vakf-ı Mutlak (ط)",
      "desc": "Mana ve lafız yönünden cümle tamamlanmıştır; durmak evlâdır, geçmek de caizdir.",
      "hukum": "Durmak evlâdır.",
      "sampleAr": "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
      "sampleLatin": "Ülâ'ike 'alâ hüdem-mir-rabbihim (ط) Ve ülâ'ike hümül-müflihûn",
      "surah": 2,
      "ayah": 5,
      "explanation": "Mana ve lafız yönünden cümle tamamlanmıştır. Müttakilerin sıfatları beyan edilmiş, ikinci kısımda onların felaha ereceği yeni ve müstakil bir cümleyle müjdelenmiştir. Durmak evlâdır."
    },
    {
      "symbol": "ج",
      "name": "Vakf-ı Câiz (ج)",
      "desc": "Durmak da geçmek de tamamen caiz ve serbesttir. Durmak biraz daha tercihe şayandır.",
      "hukum": "Durmak da geçmek de caiz.",
      "sampleAr": "نَحْنُ نَقُصُّ عَلَيْكَ نَبَأَهُم بِالْحَقِّ ۚ إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ",
      "sampleLatin": "...naba'ehüm bil-hakk (ج) İnnehüm fityetün...",
      "surah": 18,
      "ayah": 13,
      "explanation": "Kıssa cümlesinin ilk kısmı tamamlanmıştır; ister durulur ister geçilir."
    },
    {
      "symbol": "ز",
      "name": "Vakf-ı Mücevvez (ز)",
      "desc": "Geçmek durmaktan daha evlâdır; fakat durulsa da bir mahzur yoktur.",
      "hukum": "Geçmek evlâ, durmak caiz.",
      "sampleAr": "تِلْكَ الرُّسُلُ فَضَّلْنَا بَعْضَهُمْ عَلَىٰ بَعْضٍ ۘ",
      "sampleLatin": "Tilker-rusulü faddalnâ ba'dahüm 'alâ ba'd (ز)",
      "surah": 2,
      "ayah": 253,
      "explanation": "Arkasından gelen cümle bir öncekiyle mana bağı taşıdığı için vasıl (geçiş) daha güzeldir."
    },
    {
      "symbol": "ص",
      "name": "Vakf-ı Murahhas (ص)",
      "desc": "Cümle uzun olup kârinin nefesi yetmediği takdirde durmasına ruhsat verilmiştir. Nefes yetiyorsa geçilir.",
      "hukum": "Zarurette durulur, geçmek evlâdır.",
      "sampleAr": "وَقَالَ الَّذِينَ لَا يَعْلَمُونَ لَوْلَا يُكَلِّمُنَا اللَّهُ ۘ",
      "sampleLatin": "...levlâ yükellimünallâh (ص)",
      "surah": 2,
      "ayah": 118,
      "explanation": "Kârinin nefes tasarrufu için koyulmuş bir kolaylık durağıdır."
    },
    {
      "symbol": "قف",
      "name": "Vakf-ı Kıf (قف)",
      "desc": "Kârinin mana güzelliğini hissettirmek üzere durmasını tavsiye eden işarettir.",
      "hukum": "Durmak tavsiye edilir.",
      "sampleAr": "قِيلَ ادْخُلِ الْجَنَّةَ ۖ قَالَ يَا لَيْتَ قَوْمِي يَعْلَمُونَ",
      "sampleLatin": "Kîledhulil-cenneh (قف) Kâle yâ leyte kavmî ya'lemûn...",
      "surah": 36,
      "ayah": 26,
      "explanation": "Sözün bir muhataptan diğerine geçtiğini belirtmek için vakıf yapmak çok etkilidir."
    },
    {
      "symbol": "لا",
      "name": "Vakf-ı Lâ (لا)",
      "desc": "Ayet ortasında kesinlikle durulmaz. Durulursa gerideki uygun bir kelimeden iade edilerek başlanır. Ayet sonunda ise durmak caizdir.",
      "hukum": "Ayet ortasında durulmaz, ayet sonunda durulabilir.",
      "sampleAr": "الَّذِينَ تَتَوَفَّاهُمُ الْمَلَائِكَةُ طَيِّبِينَ ۙ يَقُولُونَ سَلَامٌ عَلَيْكُمُ",
      "sampleLatin": "...tayyibîne (لا) yekûlûne selâmün aleyküm...",
      "surah": 16,
      "ayah": 32,
      "explanation": "'Meleklerin canlarını arınmış olarak aldıkları kimseler' terkibi bir sıfattır, ardından gelen hal cümlesinden koparılmamalıdır."
    },
    {
      "symbol": "∴ ∴",
      "name": "Muânaka / Mürâkabe (∴ ∴)",
      "desc": "Birbirine yakın iki yerde bulunan üçer noktalı duraktır. Birincisinde durulursa ikincisinde geçilir; birincisinde geçilirse ikincisinde durulur. İkisinde birden durulmaz.",
      "hukum": "Sadece birinde durulur.",
      "sampleAr": "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
      "sampleLatin": "Zâlikel-kitâbü lâ rayb (∴) fîhi (∴) hüden lil-müttekîn...",
      "surah": 2,
      "ayah": 2,
      "explanation": "Ya 'lâ rayb'de durulup 'fîhi hüden...' diye başlanır, ya da 'lâ raybe fîh'de durulup 'hüden...' diye devam edilir."
    }
  ],
  "ibtidaVasl": [
    {
      "id": "hemze-vasl",
      "title": "Hemze-i Vasl (Vasıl Hemzesi)",
      "desc": "Sözün başında gelince okunan, önceki kelimeden bağlanarak geçildiğinde telaffuz edilmeyip düşen hemzedir.",
      "sampleAr": "ٱهْدِنَا الصِّرَاطَ ۝ وَٱهْدِنَا",
      "sampleLatin": "Başlarken: 'İhdinâ' · Geçişte: 'Vehdinâ'",
      "rule": "Kelime başında harekesi kuralına göre belirlenir (Fiillerde üçüncü harfin harekesine bakılır; isimlerde esre, elif-lâm takısında üstündür)."
    },
    {
      "id": "hemze-kat",
      "title": "Hemze-i Kat' (Katı Hemzesi)",
      "desc": "Hem başlangıçta hem de geçişte kesinlikle düşmeyen, açıkça telaffuz edilen asıl hemzedir.",
      "sampleAr": "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      "sampleLatin": "İnnâ a'taynâkel-kevser",
      "rule": "Üzerinde hemze işareti (ء / أ / إ) açıkça yazılır; geçişte asla atlanmaz."
    },
    {
      "id": "tenvin-munkani",
      "title": "Tenvin-i Münkatı' (Nûn-ı Vikâye ile Geçiş)",
      "desc": "Tenvinli bir kelimeden sonra vasıl hemzeli bir kelimeye geçilirken tenvindeki gizli nûn esrelenerek telaffuz edilir.",
      "sampleAr": "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ",
      "sampleLatin": "Kul hüvallâhu ehadunillâhus-samed (أَحَدٌ ٱللَّهُ -> ehadunillâh)",
      "rule": "Ayet sonunda durulmayıp iki ayet birbirine vasledilerek geçilmek istendiğinde uygulanır."
    }
  ],
  "ozelKelimeler": [
    {
      "type": "Sekte",
      "count": 4,
      "desc": "Sesi kesip nefes almadan 1 elif miktarı (yaklaşık 1 saniye) bekleyip sonra okumaya devam etmektir.",
      "places": [
        {
          "surah": 18,
          "ayah": 1,
          "name": "Kehf Sûresi (1. ve 2. ayet arası)",
          "phraseAr": "عِوَجًا ۜ قَيِّمًا",
          "latin": "'ıvecâ (Sekte) kayyimâ"
        },
        {
          "surah": 36,
          "ayah": 52,
          "name": "Yâsîn Sûresi (52. ayet)",
          "phraseAr": "مِن مَّرْقَدِنَا ۜ هَٰذَا",
          "latin": "mim-mergadinâ (Sekte) hâzâ"
        },
        {
          "surah": 75,
          "ayah": 27,
          "name": "Kıyâme Sûresi (27. ayet)",
          "phraseAr": "وَقِيلَ مَنْ ۜ رَاقٍ",
          "latin": "ve kîle men (Sekte) râk"
        },
        {
          "surah": 83,
          "ayah": 14,
          "name": "Mutaffifîn Sûresi (14. ayet)",
          "phraseAr": "كَلَّا ۖ بَلْ ۜ رَانَ",
          "latin": "kellâ bel (Sekte) râne"
        }
      ]
    },
    {
      "type": "İmâle",
      "count": 1,
      "desc": "Üstün harekesini esreye, elif harfini yâ harfine meylettirerek okumaktır (A ile E arası tatlı bir tını).",
      "places": [
        {
          "surah": 11,
          "ayah": 41,
          "name": "Hûd Sûresi (41. ayet)",
          "phraseAr": "بِسْمِ اللَّهِ مَجْرٜىٰهَا وَمُرْسَاهَا",
          "latin": "Bismillâhi mecrêhê ve mursâhâ (Mecrâha değil mecrêhâ okunur)"
        }
      ]
    },
    {
      "type": "Teshîl",
      "count": 1,
      "desc": "Yan yana gelen iki hemzenin ikincisini hemze ile elif arasında yumuşatarak telaffuz etmektir.",
      "places": [
        {
          "surah": 41,
          "ayah": 44,
          "name": "Fussilet Sûresi (44. ayet)",
          "phraseAr": "ءَ۬اعْجَمِيٌّ وَعَرَبِيٌّ",
          "latin": "E-e'cemiyyün değil, E..a'cemiyyün (yumuşak hemze)"
        }
      ]
    },
    {
      "type": "İşmâm",
      "count": 1,
      "desc": "Cezimli veya harekesiz sâkin harfi telaffuz ederken dudakları öne doğru toplayarak ötre harekesine işaret etmektir (ses çıkarılmaz, dudakla gösterilir).",
      "places": [
        {
          "surah": 12,
          "ayah": 11,
          "name": "Yûsuf Sûresi (11. ayet)",
          "phraseAr": "مَا لَكَ لَا تَأْمَ۫نَّا",
          "latin": "Mâ leke lâ te'mennâ (Nûn şeddesinde dudaklar öne uzatılır)"
        }
      ]
    }
  ],
  "medineDuraklari": [
    {
      "symbol": "قلى",
      "name": "el-Vakfu Evlâ (قلى)",
      "desc": "Vakıf yapmak (durmak), vasl etmekten (geçmekten) daha evlâ ve üstündür.",
      "hukum": "Durmak evlâ, geçmek câiz.",
      "sampleAr": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ",
      "sampleLatin": "...lâ te'huzühû sinetüv-velâ nevm (قلى)",
      "surah": 2,
      "ayah": 255,
      "explanation": "Cümlenin manası tamamlanmıştır. Âyetü'l-Kürsî'de her bir ilahi vasıfta nefes tazeleyip durmak manayı kalbe nakşeder."
    },
    {
      "symbol": "صلى",
      "name": "el-Vaslu Evlâ (صلى)",
      "desc": "Vasl etmek (geçmek), vakıf yapmaktan (durmaktan) daha evlâ ve uygundur.",
      "hukum": "Geçmek evlâ, durmak câiz.",
      "sampleAr": "فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌ",
      "sampleLatin": "...fe-zâdehümullâhu meradâ (صلى) ve lehüm 'azâbün elîm...",
      "surah": 2,
      "ayah": 10,
      "explanation": "İki cümle birbiriyle sıkı bir mana ve sebep-sonuç irtibatı taşıdığı için birbirine bağlayarak okumak daha fasihtir."
    },
    {
      "symbol": "ج",
      "name": "Vakf-ı Câiz (ج)",
      "desc": "Durmak ile geçmenin eşit derecede caiz olduğu mutedil duraktır.",
      "hukum": "Durmak da geçmek de eşittir.",
      "sampleAr": "نَحْنُ نَقُصُّ عَلَيْكَ نَبَأَهُم بِالْحَقِّ ۚ إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ",
      "sampleLatin": "...naba'ehüm bil-hakk (ج) İnnehüm fityetün...",
      "surah": 18,
      "ayah": 13,
      "explanation": "Hem klasik Secavend'de hem de Medine Mushafı'nda tam bir ittifakla yer alan ruhsat durağıdır."
    },
    {
      "symbol": "ع",
      "name": "Rükû' / Kıssa Sonu Durağı (ع)",
      "desc": "Bir konunun, kıssanın veya müstakil bir tebliğ bölümünün tamamlandığını gösteren ana durak işaretidir.",
      "hukum": "Namazda rükûa gitmek veya aşrı bitirmek için ideal yer.",
      "sampleAr": "إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝",
      "sampleLatin": "İnnallâhe 'alâ külli şey'in kadîr (ع)",
      "surah": 2,
      "ayah": 20,
      "explanation": "Özellikle teravih ve hatimle namaz kıldıran imamlar için konu bütünlüğünü bozmadan rükûa varma kılavuzudur."
    },
    {
      "symbol": "ك",
      "name": "Kezâlik / Önceki Gibi (ك)",
      "desc": "Kendinden önceki durak işaretinin hükmü ne ise, buradaki durak da aynı hükme tabidir.",
      "hukum": "Önceki durağın hükmü geçerlidir.",
      "sampleAr": "كَذَٰلِكَ يَضْرِبُ اللَّهُ الْأَمْثَالَ ۝",
      "sampleLatin": "Kezâlike yadribullâhul-emsâl (ك)",
      "surah": 13,
      "ayah": 17,
      "explanation": "Mushaf tertibinde tekrarlanan ibarelerde durak hükmünü özetlemek için kullanılır."
    },
    {
      "symbol": "س",
      "name": "Sekte-i Hafîfe Durağı (س)",
      "desc": "Nefes almaksızın sesi 1 elif miktarı (1 saniye) durdurup tilavete devam etme işaretidir.",
      "hukum": "Nefes almadan durmak vâciptir (Hafs).",
      "sampleAr": "مِن مَّرْقَدِنَا ۜ هَٰذَا مَا وَعَدَ الرَّحْمَٰنُ",
      "sampleLatin": "mir-mergadinâ (س) hâzâ mâ ve'ader-rahmân...",
      "surah": 36,
      "ayah": 52,
      "explanation": "Kafirlerin sözünün bittiğini, meleklerin veya müminlerin sözünün başladığını ayırt eder."
    }
  ],
  "vakifTurleri": [
    {
      "id": "tamm",
      "name": "1. Vakf-ı Tâmm (الوقف التام)",
      "degree": "En Yüksek Mertebe",
      "color": "gold",
      "desc": "Kendinden sonraki ayet veya cümleyle ne lafız (i'rab) ne de mana yönünden hiçbir bağı kalmayan duraktır.",
      "hukum": "Durmak evlâdır; durulduktan sonra geriye dönülmeden doğrudan sonraki kelimeden başlanır.",
      "sampleAr": "وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ ۝ إِنَّ الَّذِينَ كَفَرُوا",
      "sampleLatin": "...ve ülâ'ike hümül-müflihûn (Tâmm). İnnellezîne keferû...",
      "surah": 2,
      "ayah": 5,
      "note": "Sûre sonları, kıssaların bittiği yerler ve hüküm cümlelerinin tamamlandığı yerler Vakf-ı Tâmm'dır."
    },
    {
      "id": "kafi",
      "name": "2. Vakf-ı Kâfî (الوقف الكافي)",
      "degree": "Kifayet Mertebesi",
      "color": "cyan",
      "desc": "Lafız (gramer / i'rab) yönünden cümle tamamlanmış, fakat mana bakımından sonraki cümleyle konu irtibatı süren duraktır.",
      "hukum": "Durmak da geçmek de güzeldir; durulduğunda geriye dönmeden sonrasından başlanır.",
      "sampleAr": "سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ ۝ خَتَمَ اللَّهُ",
      "sampleLatin": "...lâ yü'minûn (Kâfî). Hatemallâhu...",
      "surah": 2,
      "ayah": 6,
      "note": "Kur'an-ı Kerim'deki durakların en büyük kısmı Vakf-ı Kâfî kategorisindedir."
    },
    {
      "id": "hasen",
      "name": "3. Vakf-ı Hasen (الوقف الحسن)",
      "degree": "Güzellik Mertebesi",
      "color": "emerald",
      "desc": "Kendi içinde tam ve anlaşılır bir mana ifade eden, fakat sonrasındaki kelimeyle i'rab veya mana bağı süren duraktır.",
      "hukum": "Ayet sonunda ise durulur ve sonraki ayete başlanır (Sünnettir). Ayet ortasında durulursa geriden alınarak devam edilir.",
      "sampleAr": "الْحَمْدُ لِلَّهِ ۝ رَبِّ الْعَالَمِينَ",
      "sampleLatin": "El-hamdü lillâh (Hasen) ... Rabbi'l-'âlemîn...",
      "surah": 1,
      "ayah": 2,
      "note": "Peygamber Efendimiz (s.a.v.) her ayet sonunda durmayı (Vakf-ı Hasen dahi olsa) tercih buyururlardı."
    },
    {
      "id": "kabih",
      "name": "4. Vakf-ı Kabîh (الوقف القبيح)",
      "degree": "Kusurlu / Bozuk Durak",
      "color": "alert",
      "desc": "Lafız ve mana yönünden bağı kopararak anlamsız, eksik veya inanç esaslarına aykırı bozuk bir mana üreten duruştur.",
      "hukum": "Kasten yapılması haramdır. Nefes tükenip zarureten durulursa gerideki uygun yerden başlanması şarttır.",
      "sampleAr": "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَقْرَبُوا الصَّلَاةَ ۝ (بدون إتمام: وَأَنتُمْ سُكَارَىٰ)",
      "sampleLatin": "Yâ eyyühellezîne âmenû lâ takrabus-salâh (Kabîh!) [Sarhoşken kısmı okunmadan durulursa!]",
      "surah": 4,
      "ayah": 43,
      "note": "'İnnallâhe lâ yestahyî' veya 'Fe-veylün lil-musallîn' deyip durup ardını getirmemek Vakf-ı Kabîh'in bariz misalleridir."
    },
    {
      "id": "iztirari",
      "name": "5. Vakf-ı Iztırârî (الوقف الاضطراري)",
      "degree": "Zaruret Durağı",
      "color": "purple",
      "desc": "Kârinin nefesinin yetmemesi, aksırma, öksürme, esneme veya unutma gibi beşerî mecburiyetlerle durmasıdır.",
      "hukum": "Mazeret sebebiyle caizdir. Nefes alındıktan sonra durulan kelimeden veya münasip önceki kelimeden iade edilir.",
      "sampleAr": "إِعَادَةُ الْقِرَاءَةِ مِنْ مَوْضِعٍ يَسْتَقِيمُ بِهِ الْمَعْنَى",
      "sampleLatin": "Zarureten durulunca: 'İ'tibar-ı lafız ve mana ile geriden başlama kuralı'",
      "surah": 2,
      "ayah": 255,
      "note": "Nefes yetmediğinde kâri harfi yarım bırakmamalı; kelimeyi tamamlayıp durmalı ve 1-2 kelime geriden almalıdır."
    },
    {
      "id": "ihtibari",
      "name": "6. Vakf-ı İhtibârî & İntizârî (الوقف الاختباري والانتظاري)",
      "degree": "Tedrisat & İmtihan Durağı",
      "color": "cyan",
      "desc": "İhtibârî: Hocanın talebeyi kelimenin yazılışı (resm-i hat) ve i'rabı hususunda denemek için durdurmasıdır. İntizârî: Kıraat vecihlerini cem etmek için duruştur.",
      "hukum": "Yalnızca talim, meşk ve kıraat tedrisatı meclislerinde caizdir.",
      "sampleAr": "فِي مَقَامِ التَّعْلِيمِ وَجَمْعِ الْقِرَاءَاتِ",
      "sampleLatin": "Tedrisat meclisinde: Talebenin rivayet ve resm-i hat farklarını ispatı.",
      "surah": 11,
      "ayah": 41,
      "note": "Örneğin 'Eynehâ' kelimesinin bitişik mi ayrı mı yazıldığını ölçmek için hocanın durdurması bu kabildendir."
    }
  ],
  "tempolarDetay": [
    {
      "id": "tahkik",
      "name": "Tahkîk (التحقيق)",
      "titleAr": "مَرْتَبَةُ التَّحْقِيقِ",
      "speed": "En Yavaş / Talim Hızı",
      "bpm": 60,
      "bpmRange": "55 - 70 BPM",
      "multiplier": "K = 1.40",
      "idealReciter": "Şeyh Mahmûd Halîl el-Husarî",
      "reciterKey": "husary",
      "sampleSurah": 2,
      "sampleAyah": 255,
      "sampleSurahName": "Bakara Sûresi",
      "sampleAyahName": "255. Âyet (Âyetü'l-Kürsî)",
      "desc": "Harflerin mahreç ve sıfatlarını, medd ölçülerini azami sınırlarıyla (4-6 elif), harfleri adeta teraziyle tartar gibi tane tane okuma makamıdır. <strong>Fem-i muhsin talim ve meşk hızıdır.</strong>",
      "meddRules": "Medd-i Muttasıl: 4-5 elif · Medd-i Munfasıl: 4-5 elif · Medd-i Lâzım: 4-6 elif · Gunneler: 1.5 - 2 elif tam dolgunlukta.",
      "examples": [
        {
          "id": "tahkik-ex-1",
          "title": "Bakara Sûresi — 255. Âyet (Âyetü'l-Kürsî)",
          "surah": 2,
          "ayah": 255,
          "endAyah": 255,
          "surahName": "Bakara Sûresi",
          "ayahName": "255. Âyet (Âyetü'l-Kürsî)",
          "reciter": "Şeyh Mahmûd Halîl el-Husarî",
          "reciterKey": "husary",
          "reciterTitle": "Fem-i Muhsin Meşk & Tahkîk Üstadı",
          "bpm": 58,
          "textAr": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ ۝",
          "mealTr": "Allah O'dur ki, O'ndan başka hiçbir ilah yoktur. Ezelî ve ebedî diridir (Hayy), bütün kâinatı yönetendir (Kayyûm). O'nu ne bir uyuklama tutabilir ne de uyku. Göklerde ve yerde ne varsa hepsi O'nundur...",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Muttasıl (شَآءَ: 5 Elif)" },
            { "rule": "tj-ihfa", "label": "İhfâ (عِندَهُۥ: 2 Elif)" },
            { "rule": "tj-iklab", "label": "İklâb (بِشَيْءٍ مِّنْ: B Harfine Dönüşüm)" }
          ],
          "speedNote": "Tahkîk hızında her harf teraziyle tartılır; Medd-i Muttasıl tam 5 elif, durak Medd-i Ârızları 4-6 elif vakurca uzatılır."
        },
        {
          "id": "tahkik-ex-2",
          "title": "Duhâ Sûresi — 1-4. Âyetler (Vakar ve Teselli)",
          "surah": 93,
          "ayah": 1,
          "endAyah": 4,
          "surahName": "Duhâ Sûresi",
          "ayahName": "1-4. Âyetler",
          "reciter": "Şeyh Mustafa İsmail",
          "reciterKey": "mustafa_ismail",
          "reciterTitle": "Mısır Ekolü Tahkîk Dehası",
          "bpm": 56,
          "textAr": "وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ ۝ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ۝ وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ ۝",
          "mealTr": "Kuşluk vaktine andolsun. Ve sükûnete erdiği zaman geceye andolsun ki, Rabbin seni terk etmedi ve sana darılmadı. Elbette ahiret senin için dünyadan daha hayırlıdır.",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Tabiî & Bedel" },
            { "rule": "tj-idgam", "label": "İdgam-ı Bilâ-Gunne (خَيْرٌ لَّكَ)" },
            { "rule": "tj-kalin", "label": "Kalın Harf / Ra Dengesi" }
          ],
          "speedNote": "Mustafa İsmail'in ağır talim üslubudur. Elif uzatmaları milimetriktir; idgam-ı bilâ gunne harfleri düşürmeden tam bağlanır."
        },
        {
          "id": "tahkik-ex-3",
          "title": "Haşr Sûresi — 22-24. Âyetler (Hüvel-lâhüllezî)",
          "surah": 59,
          "ayah": 22,
          "endAyah": 24,
          "surahName": "Haşr Sûresi",
          "ayahName": "22-24. Âyetler",
          "reciter": "Şeyh Muhammed Sıddîk el-Minşâvî",
          "reciterKey": "minshawi_mujawwad",
          "reciterTitle": "Mücevved Tahkîk & Huşû İntizamı",
          "bpm": 62,
          "textAr": "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ ۝ هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ ۚ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ ۝ هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ يُسَبِّحُ لَهُۥ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ ۝",
          "mealTr": "O, kendisinden başka hiçbir ilah olmayan Allah'tır. Gaybı da, görünen âlemi de bilendir. O, Rahmân'dır, Rahîm'dir...",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Muttasıl (الْأَسْمَاءُ: 5 Elif)" },
            { "rule": "tj-kalkale", "label": "Kalkale-i Vustâ (سُبْحَانَ)" },
            { "rule": "tj-ihfa", "label": "Şeddeli Gunne (عَمَّا)" }
          ],
          "speedNote": "Minşâvî'nin mücevved üslubu Tahkîk'in en tesirli örneğidir; her lafza-i celâl ve sıfat-ı ilahiye hakları tastamam verilerek icra edilir."
        },
        {
          "id": "tahkik-ex-4",
          "title": "Fecr Sûresi — 27-30. Âyetler (Ey Huzura Eren Nefis)",
          "surah": 89,
          "ayah": 27,
          "endAyah": 30,
          "surahName": "Fecr Sûresi",
          "ayahName": "27-30. Âyetler",
          "reciter": "Şeyh Abdülbâsıt Abdüssamed",
          "reciterKey": "abdulbasit_mujawwad",
          "reciterTitle": "Dünya Kur'an Zirvesi & Tahkîk İhtişamı",
          "bpm": 60,
          "textAr": "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ۝ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً ۝ فَادْخُلِي فِي عِبَادِي ۝ وَادْخُلِي جَنَّتِي ۝",
          "mealTr": "Ey huzura kavuşmuş nefis! Sen O'ndan razı, O da senden razı olarak Rabbine dön! Gir kullarımın arasına, gir cennetime!",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Munfasıl (يَا أَيَّتُهَا: 5 Elif)" },
            { "rule": "tj-kalkale", "label": "Kalkale (الْمُطْمَئِنَّةُ, فَادْخُلِي)" },
            { "rule": "tj-idgam", "label": "İdgam-ı Mea'l-Gunne (رَاضِيَةً مَّرْضِيَّةً)" }
          ],
          "speedNote": "Tı ve Dal harflerinin kalkalesi nefes doyumunda tam verilir; medd-i munfasıllar azami ölçü olan 5 elif ile taçlandırılır."
        }
      ]
    },
    {
      "id": "tertil",
      "name": "Tertîl (الترتيل)",
      "titleAr": "مَرْتَبَةُ التَّرْتِيلِ",
      "speed": "Huşû & Tefekkür (Altın Oran)",
      "bpm": 85,
      "bpmRange": "75 - 95 BPM",
      "multiplier": "K = 1.00 (Referans)",
      "idealReciter": "Şeyh Muhammed Sıddîk el-Minşâvî",
      "reciterKey": "minshawi",
      "sampleSurah": 1,
      "sampleAyah": 1,
      "sampleSurahName": "Fâtiha Sûresi",
      "sampleAyahName": "1-7. Âyetler",
      "desc": "Mânâyı tefekkür ederek, orta ağırlıkta ve kalbe tesir edecek bir ahenk ve huşû ile tilavet etmektir. <em>'Kur'an'ı tertîl üzere oku'</em> (Müzzemmil: 4) emr-i ilahisinin doğrudan muhatabıdır.",
      "meddRules": "Medd-i Muttasıl: 4 elif · Medd-i Munfasıl: 4 elif · Medd-i Lâzım: 4 elif · Gunneler: 1.5 elif tam dengeli.",
      "examples": [
        {
          "id": "tertil-ex-1",
          "title": "Fâtiha Sûresi — 1-7. Âyetler (Ümmü'l-Kitâb)",
          "surah": 1,
          "ayah": 1,
          "endAyah": 7,
          "surahName": "Fâtiha Sûresi",
          "ayahName": "1-7. Âyetler (Tam Sûre)",
          "reciter": "Şeyh Muhammed Sıddîk el-Minşâvî",
          "reciterKey": "minshawi",
          "reciterTitle": "Tertîl Ekolü & Huşû Zirvesi",
          "bpm": 82,
          "textAr": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝",
          "mealTr": "Rahmân ve Rahîm olan Allah'ın adıyla. Hamd, âlemlerin Rabbi Allah'a mahsustur. O, Rahmân'dır, Rahîm'dir. Din gününün sahibidir. Ancak sana kulluk eder ve yalnız senden yardım dileriz...",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Lâzım (الضَّالِّينَ: 4 Elif)" },
            { "rule": "tj-izhar", "label": "İzhâr (أَنْعَمْتَ)" },
            { "rule": "tj-madd", "label": "Medd-i Ârız Durakları (3 Elif)" }
          ],
          "speedNote": "Tertîl mertebesinin mutlak referansıdır. Medd-i Lâzım (الضَّالِّينَ) net 4 elif çekilir, duraklar 3 elif dengeli kapatılır."
        },
        {
          "id": "tertil-ex-2",
          "title": "İnşirâh Sûresi — 1-8. Âyetler (Gönül İnşirâhı)",
          "surah": 94,
          "ayah": 1,
          "endAyah": 8,
          "surahName": "İnşirâh Sûresi",
          "ayahName": "1-8. Âyetler (Tam Sûre)",
          "reciter": "Şeyh Mahmûd Halîl el-Husarî",
          "reciterKey": "husary",
          "reciterTitle": "Kusursuz Tertîl Standartı",
          "bpm": 84,
          "textAr": "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ ۝ الَّذِي أَنقَضَ ظَهْرَكَ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَ ۝ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب ۝",
          "mealTr": "Biz senin göğsünü açıp genişletmedik mi? Belini büken yükünü üzerinden kaldırmadık mı? Şanın ve nâmını yüceltmedik mi? Şüphesiz zorlukla beraber bir kolaylık vardır...",
          "tajweedHighlights": [
            { "rule": "tj-ihfa", "label": "İhfâ (عَنكَ, أَنقَضَ, فَانصَبْ)" },
            { "rule": "tj-kalkale", "label": "Kalkale-i Kübrâ (فَانصَبْ ۝, فَارْغَب ۝)" },
            { "rule": "tj-ihfa", "label": "Şeddeli Nun Gunneleri" }
          ],
          "speedNote": "Husarî'nin mürettel tertîlinde ihfâlar tam 1.5 elif süresinde kalbe sindirilerek okunur, kalkaleler aşırılığa kaçmadan parlatılır."
        },
        {
          "id": "tertil-ex-3",
          "title": "Kıyâme Sûresi — 1-6. Âyetler (Mekke Tertîli)",
          "surah": 75,
          "ayah": 1,
          "endAyah": 6,
          "surahName": "Kıyâme Sûresi",
          "ayahName": "1-6. Âyetler",
          "reciter": "Şeyh Ali Câbir",
          "reciterKey": "ali_jaber",
          "reciterTitle": "Mescid-i Harâm Eski İmamı",
          "bpm": 88,
          "textAr": "لَا أُقْسِمُ بِيَوْمِ الْقِيَامَةِ ۝ وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ ۝ أَيَحْسَبُ الْإِنسَانُ أَلَّن نَّجْمَعَ عِظَامَهُۥ ۝ بَلَىٰ قَادِرِينَ عَلَىٰ أَن نُّسَوِّيَ بَنَانَهُۥ ۝ بَلْ يُرِيدُ الْإِنسَانُ لِيَفْجُرَ أَمَامَهُۥ ۝ يَسْأَلُ أَيَّانَ يَوْمُ الْقِيَامَةِ ۝",
          "mealTr": "Kıyamet gününe andolsun! Kendini kınayan nefse andolsun! İnsan kemiklerini bir araya toplayamayacağımızı mı sanır? Evet parmak uçlarına varıncaya kadar yeniden tanzim etmeye kādiriz...",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Munfasıl (لَا أُقْسِمُ: 4 Elif)" },
            { "rule": "tj-kalkale", "label": "Kalkale (أُقْسِمُ: Kaf)" },
            { "rule": "tj-idgam", "label": "İdgam-ı Mea'l-Gunne (أَلَّن نَّجْمَعَ)" }
          ],
          "speedNote": "Merhum Ali Câbir'in hüzünlü ve tefekkür yüklü Kâbe tertîlidir; medd-i munfasıllar 4 elif ahenkle uzatılır."
        },
        {
          "id": "tertil-ex-4",
          "title": "Mülk Sûresi — 1-4. Âyetler (Yaratılış Nizamı)",
          "surah": 67,
          "ayah": 1,
          "endAyah": 4,
          "surahName": "Mülk Sûresi",
          "ayahName": "1-4. Âyetler",
          "reciter": "Şeyh Sa'd el-Gâmidî",
          "reciterKey": "ghamadi",
          "reciterTitle": "Dengeli ve Vakar Dolu Tertîl",
          "bpm": 86,
          "textAr": "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ۝ الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ ۝",
          "mealTr": "Mülk elinde bulunan Allah yüceler yücesidir. O her şeye hakkıyla kādirdir. O ki, hanginizin daha güzel amel işleyeceğini denemek için ölümü ve hayatı yarattı...",
          "tajweedHighlights": [
            { "rule": "tj-ihfa", "label": "İhfâ (مِن تَفَاوُتٍ, مِن فُطُورٍ)" },
            { "rule": "tj-kalkale", "label": "Kalkale (سَبْعَ)" },
            { "rule": "tj-kalin", "label": "Ra ve Tı Harfleri Kalınlığı" }
          ],
          "speedNote": "Gâmidî'nin berrak ve net tertîli; ihfâ ve iklâb harfleri dudak ve dil pozisyonları tam verilerek icra edilir."
        }
      ]
    },
    {
      "id": "tedvir",
      "name": "Tedvîr (التدوير)",
      "titleAr": "مَرْتَبَةُ التَّدْوِيرِ",
      "speed": "Mutedil / İmamet Hızı",
      "bpm": 110,
      "bpmRange": "100 - 120 BPM",
      "multiplier": "K = 0.85",
      "idealReciter": "Kâbe İmamı Şeyh Yâsir ed-Devserî",
      "reciterKey": "dossary",
      "sampleSurah": 67,
      "sampleAyah": 1,
      "sampleSurahName": "Mülk Sûresi",
      "sampleAyahName": "1. Âyet (Tebâreke)",
      "desc": "Tahkîk ile Hadr arasında mutedil bir orta sürattir. Tecvid kaidelerinden ve harf haklarından taviz vermeden cemaatle cehrî namazlarda en çok tercih edilen sürattir.",
      "meddRules": "Medd-i Muttasıl: 3-4 elif · Medd-i Munfasıl: 2-3 elif · Medd-i Lâzım: 4 elif · Gunneler: 1.5 elif akıcı.",
      "examples": [
        {
          "id": "tedvir-ex-1",
          "title": "Mülk Sûresi — 1-5. Âyetler (Kâbe İmamet Sürati)",
          "surah": 67,
          "ayah": 1,
          "endAyah": 5,
          "surahName": "Mülk Sûresi",
          "ayahName": "1-5. Âyetler",
          "reciter": "Kâbe İmamı Şeyh Yâsir ed-Devserî",
          "reciterKey": "dossary",
          "reciterTitle": "Mescid-i Harâm İmamı & Hatibi",
          "bpm": 112,
          "textAr": "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ۝ الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ ۝ ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ ۝ وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ ۝",
          "mealTr": "Mülk elinde bulunan Allah ne yücedir... Andolsun biz en yakın göğü kandillerle donattık ve onları şeytanlara atılan taşlar kıldık...",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Muttasıl (السَّمَاءَ: 3-4 Elif)" },
            { "rule": "tj-ihfa", "label": "İhfâ (بِمَصَابِيحَ)" },
            { "rule": "tj-idgam", "label": "İdgam-ı Bilâ-Gunne (رُجُومًا لِّلشَّيَاطِينِ)" }
          ],
          "speedNote": "Devserî'nin Kâbe'deki cehrî namaz hızıdır. Mutedil akışta medd-i muttasıllar 3-4 elif, medd-i munfasıllar 2-3 elif mertebesinde dinamik korunur."
        },
        {
          "id": "tedvir-ex-2",
          "title": "Kâf Sûresi — 1-5. Âyetler (Vakar ve İkaz)",
          "surah": 50,
          "ayah": 1,
          "endAyah": 5,
          "surahName": "Kâf Sûresi",
          "ayahName": "1-5. Âyetler",
          "reciter": "Şeyh Nâsır el-Katâmî",
          "reciterKey": "qatami",
          "reciterTitle": "Riyad İmameti & Tedvîr Üstadı",
          "bpm": 108,
          "textAr": "ق ۚ وَالْقُرْآنِ الْمَجِيدِ ۝ بَلْ عَجِبُوا أَن جَاءَهُم مُّنذِرٌ مِّنْهُمْ فَقَالَ الْكَافِرُونَ هَٰذَا شَيْءٌ عَجِيبٌ ۝ أَإِذَا مِتْنَا وَكُنَّا تُرَابًا ۖ ذَٰلِكَ رَجْعٌ بَعِيدٌ ۝ قَدْ عَلِمْنَا مَا تَنقُصُ الْأَرْضُ مِنْهُمْ ۖ وَعِندَنَا كِتَابٌ حَفِيظٌ ۝ بَلْ كَذَّبُوا بِالْحَقِّ لَمَّا جَاءَهُمْ فَهُمْ فِي أَمْرٍ مَّرِيجٍ ۝",
          "mealTr": "Kâf. Şanlı Kur'an'a andolsun! Doğrusu kendilerine içlerinden bir uyarıcı geldiğine şaştılar da o kâfirler: 'Bu şaşılacak bir şey!' dediler...",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Lâzım (ق: 6 Elif)" },
            { "rule": "tj-iklab", "label": "İklâb (رَجْعٌ بَعِيدٌ)" },
            { "rule": "tj-ihfa", "label": "İhfâ (أَن جَاءَهُم, مُّنذِرٌ)" }
          ],
          "speedNote": "Tedvîr hızında 'Kâf' harfinin Medd-i Lâzımı asla kısaltılamaz (tam 6 elif). İklâb ve ihfâlar akıcı 1.5 elifte tutulur."
        },
        {
          "id": "tedvir-ex-3",
          "title": "İsrâ Sûresi — 1-3. Âyetler (Mescid-i Harâm İmameti)",
          "surah": 17,
          "ayah": 1,
          "endAyah": 3,
          "surahName": "İsrâ Sûresi",
          "ayahName": "1-3. Âyetler",
          "reciter": "Şeyh Suûd eş-Şüreym",
          "reciterKey": "shuraym",
          "reciterTitle": "Kâbe-i Muazzama Emektar İmamı",
          "bpm": 115,
          "textAr": "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى الَّذِي بَارَكْنَا حَوْلَهُ لِنُرِيَهُ مِنْ آيَاتِنَا ۚ إِنَّهُ هُوَ السَّمِيعُ الْبَصِيرُ ۝ وَآتَيْنَا مُوسَى الْكِتَابَ وَجَعَلْنَاهُ هُدًى لِّبَنِي إِسْرَائِيلَ أَلَّا تَتَّخِذُوا مِن دُونِي وَكِيلًا ۝ ذُرِّيَّةَ مَنْ حَمَلْنَا مَعَ نُوحٍ ۚ إِنَّهُ كَانَ عَبْدًا شَكُورًا ۝",
          "mealTr": "Kulu Muhammed'i bir gece Mescid-i Harâm'dan çevresini mübarek kıldığımız Mescid-i Aksâ'ya götüren Allah her türlü noksanlıktan münezzehtir...",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Munfasıl (أَسْرَىٰ: 2-3 Elif)" },
            { "rule": "tj-kalkale", "label": "Kalkale (سُبْحَانَ, بِعَبْدِهِ, الْأَقْصَى)" },
            { "rule": "tj-idgam", "label": "İdgam-ı Mea'l-Gunne (لَيْلًا مِّنَ)" }
          ],
          "speedNote": "Şüreym'in klasikleşmiş Harem-i Şerîf cehrî namaz tedvîri; akış seridir fakat kalkaleler ve harf sıfatları berraktır."
        },
        {
          "id": "tedvir-ex-4",
          "title": "Yâsîn Sûresi — 1-6. Âyetler (Öğretici Tedvîr)",
          "surah": 36,
          "ayah": 1,
          "endAyah": 6,
          "surahName": "Yâsîn Sûresi",
          "ayahName": "1-6. Âyetler",
          "reciter": "Şeyh Mahmûd Halîl el-Husarî",
          "reciterKey": "husary",
          "reciterTitle": "Kusursuz Mutedil Kıraat",
          "bpm": 106,
          "textAr": "يس ۝ وَالْقُرْآنِ الْحَكِيمِ ۝ إِنَّكَ لَمِنَ الْمُرْسَلِينَ ۝ عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ ۝ تَنزِيلَ الْعَزِيزِ الرَّحِيمِ ۝ لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ ۝",
          "mealTr": "Yâ Sîn. Hikmet dolu Kur'an'a andolsun ki, sen elbette dosdoğru bir yol üzere gönderilen peygamberlerdensin...",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Lâzım (يس: 6 Elif)" },
            { "rule": "tj-idgam", "label": "İdgam-ı Mea'l-Gunne (صِرَاطٍ مُّسْتَقِيمٍ)" },
            { "rule": "tj-ihfa", "label": "İhfâ (تَنزِيلَ, لِتُنذِرَ)" }
          ],
          "speedNote": "Husarî'nin mutedil tedvîrinde Yâ-Sîn harfindeki Medd-i Lâzım tavizsiz 6 elif tutulur, izhâr ve idgamlar tecvid hakkıyla icra edilir."
        }
      ]
    },
    {
      "id": "hadr",
      "name": "Hadr (الحدر)",
      "titleAr": "مَرْتَبَةُ الْحَدْرِ",
      "speed": "Seri / Hatim & Mukabele Hızı",
      "bpm": 140,
      "bpmRange": "130 - 155 BPM",
      "multiplier": "K = 0.70",
      "idealReciter": "Şeyh Meşâri Râşid el-Afâsî",
      "reciterKey": "alafasy",
      "sampleSurah": 55,
      "sampleAyah": 1,
      "sampleSurahName": "Rahmân Sûresi",
      "sampleAyahName": "1-4. Âyetler",
      "desc": "Hatim kıraatinde ve mukabelelerde tecvid ölçülerini asgari sınırlarda (Medd-i Munfasıl 1-2 elif, gunneler net) tutarak harf düşürmeden en süratli okuma biçimidir.",
      "meddRules": "Medd-i Muttasıl: 2-3 elif · Medd-i Munfasıl: 1-2 elif · Medd-i Lâzım: 4 elif · Harf yutulması kesinlikle yasaktır.",
      "examples": [
        {
          "id": "hadr-ex-1",
          "title": "Rahmân Sûresi — 1-13. Âyetler (Mukabele & Seri Hatim)",
          "surah": 55,
          "ayah": 1,
          "endAyah": 13,
          "surahName": "Rahmân Sûresi",
          "ayahName": "1-13. Âyetler",
          "reciter": "Şeyh Meşâri Râşid el-Afâsî",
          "reciterKey": "alafasy",
          "reciterTitle": "Mukabele & Seri Hatim Hadrı",
          "bpm": 142,
          "textAr": "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ ۝ عَلَّمَهُ الْبَيَانَ ۝ الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ ۝ وَالنَّجْمُ وَالشَّجَرُ يَسْجُدَانِ ۝ وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ ۝ أَلَّا تَطْغَوْا فِي الْمِيزَانِ ۝ وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ ۝ وَالْأَرْضَ وَضَعَهَا لِلْأَنَامِ ۝ فِيهَا فَاكِهَةٌ وَالنَّخْلُ ذَاتُ الْأَكْمَامِ ۝ وَالْحَبُّ ذُو الْعَصْفِ وَالرَّيْحَانُ ۝ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ۝",
          "mealTr": "Rahmân. Kur'an'ı öğretti. İnsanı yarattı. Ona açıklamayı öğretti... O halde Rabbinizin hangi nimetlerini yalanlayabilirsiniz?...",
          "tajweedHighlights": [
            { "rule": "tj-madd", "label": "Medd-i Muttasıl (وَالسَّمَاءَ, آلَاءِ: 2-3 Elif)" },
            { "rule": "tj-ihfa", "label": "Hadr İhfâsı (الْإِنسَانَ: 1-1.5 Elif)" },
            { "rule": "tj-madd", "label": "Medd-i Ârız Kasr (1-2 Elif)" }
          ],
          "speedNote": "Hadr süratinde temel kaide: Harf yutmak haramdır! Seri akışta medd-i munfasıllar 1-2 elif, gunneler net ama seri, duraklar 1-2 elifte kapatılır."
        },
        {
          "id": "hadr-ex-2",
          "title": "Nebe Sûresi — 1-10. Âyetler (Harem-i Şerîf Seri Mukabele)",
          "surah": 78,
          "ayah": 1,
          "endAyah": 10,
          "surahName": "Nebe Sûresi",
          "ayahName": "1-10. Âyetler",
          "reciter": "Şeyh Abdurrahman es-Südeys",
          "reciterKey": "sudais",
          "reciterTitle": "Kâbe İmamı Mukabele & Teravih Seriliği",
          "bpm": 148,
          "textAr": "عَمَّ يَتَسَاءَلُونَ ۝ عَنِ النَّبَإِ الْعَظِيمِ ۝ الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ ۝ كَلَّا سَيَعْلَمُونَ ۝ ثُمَّ كَلَّا سَيَعْلَمُونَ ۝ أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا ۝ وَالْجِبَالَ أَوْتَادًا ۝ وَخَلَقْنَاكُمْ أَزْوَاجًا ۝ وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا ۝ وَجَعَلْنَا اللَّيْلَ لِبَاسًا ۝",
          "mealTr": "Birbirlerine neyi soruyorlar? Hakkında ayrılığa düştükleri o büyük haberi mi? Hayır! Yakında bilecekler...",
          "tajweedHighlights": [
            { "rule": "tj-ihfa", "label": "Şeddeli Mim & Nun (عَمَّ, ثُمَّ)" },
            { "rule": "tj-kalkale", "label": "Seri Kalkale (نَجْعَلِ: Cim)" },
            { "rule": "tj-madd", "label": "Medd-i Muttasıl (يَتَسَاءَلُونَ: 2 Elif)" }
          ],
          "speedNote": "Südeys'in meşhur teravih ve mukabele hadr icrası. 'Amme'deki şeddeli mim ve kalkaleler harf zayi edilmeden seri akar."
        },
        {
          "id": "hadr-ex-3",
          "title": "Vâkıa Sûresi — 1-12. Âyetler (Akıcı Mukabele Hadrı)",
          "surah": 56,
          "ayah": 1,
          "endAyah": 12,
          "surahName": "Vâkıa Sûresi",
          "ayahName": "1-12. Âyetler",
          "reciter": "Şeyh Sa'd el-Gâmidî",
          "reciterKey": "ghamadi",
          "reciterTitle": "Akıcı Hatim Mukabelesi",
          "bpm": 138,
          "textAr": "إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ۝ خَافِضَةٌ رَّافِعَةٌ ۝ إِذَا رُجَّتِ الْأَرْضُ رَجًّا ۝ وَبُسَّتِ الْجِبَالُ بَسًّا ۝ فَكَانَتْ هَبَاءً مُّنبَثًّا ۝ وَكُنتُمْ أَزْوَاجًا ثَلَاثَةً ۝ فَأَصْحَابُ الْمَيْمَنَةِ مَا أَصْحَابُ الْمَيْمَنَةِ ۝ وَأَصْحَابُ الْمَشْأَمَةِ مَا أَصْحَابُ الْمَشْأَمَةِ ۝ وَالسَّابِقُونَ السَّابِقُونَ ۝ أُولَٰئِكَ الْمُقَرَّبُونَ ۝ فِي جَنَّاتِ النَّعِيمِ ۝",
          "mealTr": "O kaçınılmaz olay gerçekleştiği zaman... Yerin sarsıldıkça sarsıldığı, dağların un ufak edildiği zaman...",
          "tajweedHighlights": [
            { "rule": "tj-idgam", "label": "İdgam-ı Bilâ-Gunne (خَافِضَةٌ رَّافِعَةٌ)" },
            { "rule": "tj-iklab", "label": "İklâb (هَبَاءً مُّنبَثًّا)" },
            { "rule": "tj-ihfa", "label": "İhfâ (وَكُنتُمْ)" }
          ],
          "speedNote": "Gâmidî'nin hatim mukabele sürati. 'Habâen münbessâ' iklâbı seri hızda net bir 'mim'e dönüştürülür, idgam-ı bilâ gunneler hızla birleştirilir."
        },
        {
          "id": "hadr-ex-4",
          "title": "İhlâs & Felak & Nâs — (Seri Kısa Sûreler)",
          "surah": 112,
          "ayah": 1,
          "endAyah": 4,
          "surahName": "İhlâs Sûresi",
          "ayahName": "1-4. Âyetler (Tam Sûre)",
          "reciter": "Şeyh Hânî er-Rifâî",
          "reciterKey": "rifai",
          "reciterTitle": "Seri Namaz Kıraati",
          "bpm": 136,
          "textAr": "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ ۝",
          "mealTr": "De ki: O Allah tektir. Allah Samed'dir. O doğurmamış ve doğmamıştır. O'nun hiçbir dengi yoktur...",
          "tajweedHighlights": [
            { "rule": "tj-kalkale", "label": "Seri Kalkale (أَحَدٌ, الصَّمَدُ, يَلِدْ, يُولَدْ)" },
            { "rule": "tj-idgam", "label": "İdgam-ı Bilâ-Gunne (يَكُن لَّهُۥ)" },
            { "rule": "tj-kalin", "label": "Lafzatullah Kalınlığı" }
          ],
          "speedNote": "Namazda seri okurken İhlâs duraklarındaki Dal kalkaleleri aceleye getirilip düşürülmez; şaklama sesi net duyulur."
        }
      ]
    }
  ],
  "lahnKarsilastirma": [
    {
      "id": "case-1",
      "title": "1. Boğaz Harfini Göğüs Harfine Çevirmek",
      "type": "celi",
      "risk": "Mânâ Değişir - Namaz Bâtıl Olur!",
      "wrong": "الْهَمْدُ لِلَّهِ ('ح' yerine göğüsten çıkan 'هـ' okumak)",
      "correct": "الْحَمْدُ لِلَّهِ (Boğaz ortasından tatlı bir hırıltısız 'ح')",
      "impact": "'El-hamd' (Övgü Allah'a) yerine 'El-hemd' (Ölüm/sönme Allah'a) demek küfür ve fesada yol açar."
    },
    {
      "id": "case-2",
      "title": "2. Fâtiha'da Fail Zamirini Değiştirmek",
      "type": "celi",
      "risk": "İtikadî ve Fıkhî Bozulma!",
      "wrong": "صِرَاطَ الَّذِينَ أَنْعَمْتُ عَلَيْهِمْ (Tâ harfini ötre ile 'En'amtü' okumak)",
      "correct": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ (Tâ harfini üstün ile 'En'amte' okumak)",
      "impact": "'Sen nimet verdin' yerine 'Ben nimet verdim' diyerek nimeti kula isnat eder; namaz bozulur."
    },
    {
      "id": "case-3",
      "title": "3. İyyâke Kelimesinde Şeddeyi Atlamak",
      "type": "celi",
      "risk": "Şirk İhtimali Taşıyan Ağır Mana Kayması!",
      "wrong": "إِيَاكَ نَعْبُدُ (Şeddesiz tek 'yâ' ile 'İyâke' demek)",
      "correct": "إِيَّاكَ نَعْبُدُ (Şeddeli ve vurgulu 'İyyâke' demek)",
      "impact": "Şeddesiz 'İyâ' Arapçada güneş ışığı mânâsına gelir. 'Güneş ışığına taparız' mânâsına kayar."
    },
    {
      "id": "case-4",
      "title": "4. Medd-i Lâzım'ı Kısaltmak",
      "type": "hafi",
      "risk": "Tilavet Kusuru - Mekruh",
      "wrong": "وَلَا الضَّالِّينَ (Lâzım meddini 1-2 elifte alelacele kesmek)",
      "correct": "وَلَا الضَّالِّينَ (Şeddeli Lâm öncesi 4 elif tam uzatmak)",
      "impact": "Namazı bozmaz ancak tecvidin farz/vacip olan uzatma hakkını zayi eder."
    },
    {
      "id": "case-5",
      "title": "5. İhfâ ve Gunnede Geniz Yerine Ağızdan Ses Çıkarmak",
      "type": "hafi",
      "risk": "Fonetik Kusur - Estetik Zafiyet",
      "wrong": "مِن قَبْلُ (Sesi genze (hayşûm) vermeden ağız içinde nûn telaffuz etmek)",
      "correct": "مِن قَبْلُ (Dil damağa değmeden sesi 1.5 elif burun boşluğunda tutmak)",
      "impact": "İhfâ sırrını yok eder; izhâra benzer yapay bir ses üretir."
    },
    {
      "id": "case-6",
      "title": "6. Kalkale Harfinin Ardına Hemze Eklemek",
      "type": "hafi",
      "risk": "Harf Ziyadesi Kusuru",
      "wrong": "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ ('Ahad-e!' diye arkasına yapay bir hemze veya e sesi yapıştırmak)",
      "correct": "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ (Mahreçte sesin tabii titreşimiyle yankılanması)",
      "impact": "Kelimede olmayan fazladan bir hareke veya hemze üretme kusurudur."
    }
  ],
  "ekstraOzelKelimeler": [
    {
      "type": "Nakil (النقل)",
      "desc": "Hemzenin harekesini kendinden önceki sâkin harfe aktarıp hemzeyi düşürerek okumaktır.",
      "places": [
        {
          "surah": 49,
          "ayah": 11,
          "name": "Hucurât Sûresi (11. ayet)",
          "phraseAr": "بِئْسَ الِاسْمُ الْفُسُوقُ",
          "latin": "Bi'sel-ismü değil, 'Bi'se-lismu' şeklinde Lâm esrelenerek okunur."
        }
      ]
    },
    {
      "type": "İdğâm İstisnaları",
      "desc": "Farklı iki harfin birleşmesi kuralında doğrudan rivayetle gelen özel birleşmeler:",
      "places": [
        {
          "surah": 11,
          "ayah": 42,
          "name": "Hûd Sûresi (42. ayet - Mütekaribeyn)",
          "phraseAr": "يَا بُنَيَّ ارْكَب مَّعَنَا",
          "latin": "irkeb me'anâ değil, 'irkem-me'anâ' (bâ mîm'e idğam edilir)."
        },
        {
          "surah": 7,
          "ayah": 176,
          "name": "A'râf Sûresi (176. ayet - Mütecaniseyn)",
          "phraseAr": "يَلْهَث ذَّٰلِكَ",
          "latin": "yelhes zâlik değil, 'yelhez-zâlik' (sâ zâl'e idğam edilir)."
        }
      ]
    },
    {
      "type": "Sâd / Sîn Tercihleri (Hafs)",
      "desc": "Mushaf-ı Şerif'te kelime üzerindeki veya altındaki küçük Sîn harfinin tercih ölçüleri:",
      "places": [
        {
          "surah": 2,
          "ayah": 245,
          "name": "Bakara Sûresi (245. ayet)",
          "phraseAr": "وَاللَّهُ يَقْبِضُ وَيَبْصُطُ",
          "latin": "Üstte sîn vardır: 'Yebsutu' (Sîn ile okunması evlâdır)."
        },
        {
          "surah": 7,
          "ayah": 69,
          "name": "A'râf Sûresi (69. ayet)",
          "phraseAr": "وَزَادَكُمْ فِي الْخَلْقِ بَصْطَةً",
          "latin": "Üstte sîn vardır: 'Bestaten' (Sîn ile okunması evlâdır)."
        },
        {
          "surah": 52,
          "ayah": 37,
          "name": "Tûr Sûresi (37. ayet)",
          "phraseAr": "أَمْ هُمُ الْمُصَيْطِرُونَ",
          "latin": "Altta sîn vardır: Sâd ile okunması evlâ, Sîn ile de caizdir."
        },
        {
          "surah": 88,
          "ayah": 22,
          "name": "Gâşiye Sûresi (22. ayet)",
          "phraseAr": "لَّسْتَ عَلَيْهِم بِمُصَيْطِرٍ",
          "latin": "Altta sîn vardır fakat SÂD ile okunması şarttır (Sîn okunmaz)."
        }
      ]
    },
    {
      "type": "Elifât-ı Seb'a (7 Vakıf Elifi)",
      "desc": "Vakıf yapıldığında (durulduğunda) 1 elif uzatılan; vasl yapıldığında (geçildiğinde) elifi düşen 7 kelime:",
      "places": [
        {
          "surah": 18,
          "ayah": 38,
          "name": "Kehf Sûresi (38. ayet)",
          "phraseAr": "لَّٰكِنَّا هُوَ اللَّهُ رَبِّي",
          "latin": "Dururken: 'Lâkinnâ' · Geçerken: 'Lâkinne hüvallâh'"
        },
        {
          "surah": 33,
          "ayah": 10,
          "name": "Ahzâb Sûresi (10. ayet)",
          "phraseAr": "وَتَظُنُّونَ بِاللَّهِ الظُّنُونَا",
          "latin": "Dururken: 'ez-Zunûnâ' · Geçerken: 'ez-Zunûne'"
        },
        {
          "surah": 33,
          "ayah": 66,
          "name": "Ahzâb Sûresi (66. ayet)",
          "phraseAr": "أَطَعْنَا الرَّسُولَا",
          "latin": "Dururken: 'er-Rasûlâ' · Geçerken: 'er-Rasûle'"
        },
        {
          "surah": 33,
          "ayah": 67,
          "name": "Ahzâb Sûresi (67. ayet)",
          "phraseAr": "فَأَضَلُّونَا السَّبِيلَا",
          "latin": "Dururken: 'es-Sebîlâ' · Geçerken: 'es-Sebîle'"
        },
        {
          "surah": 76,
          "ayah": 4,
          "name": "İnsân Sûresi (4. ayet)",
          "phraseAr": "إِنَّا أَعْتَدْنَا لِلْكَافِرِينَ سَلَاسِلَا",
          "latin": "Dururken: 'Selâsilâ' / 'Selâsil' · Geçerken: 'Selâsile'"
        },
        {
          "surah": 76,
          "ayah": 15,
          "name": "İnsân Sûresi (15. ayet)",
          "phraseAr": "كَانَتْ قَوَارِيرَا",
          "latin": "Dururken: 'Kavârîrâ' · Geçerken: 'Kavârîra'"
        }
      ]
    }
  ],
  "teknikQuiz": [
    {
      "id": "q1",
      "question": "Secavend durak işaretlerinden 'م' (Vakf-ı Lâzım) işaretini gördüğünüzde tilavet hükmü nedir?",
      "options": [
        "Durmak caiz, geçmek evlâdır.",
        "Muhakkak durulmalıdır; geçilirse mânâ tamamen bozulabilir veya yanlış anlaşılabilir.",
        "İki ayet arasında sadece nefes tazelemek için durulur.",
        "Durmak mekruhtur, geçilmelidir."
      ],
      "answer": 1,
      "explanation": "Vakf-ı Lâzım (م), mânânın karışmasını önlemek için durulması vâcip/gerekli olan yerdir. Geçilirse mânâ bozulabilir."
    },
    {
      "id": "q2",
      "question": "Fâtiha Sûresi 7. ayetteki 'أَنْعَمْتَ' (En'amte) kelimesini 'En'amtü' şeklinde ötre ile okumak ne tür bir hatadır?",
      "options": [
        "Lahn-ı Hafî (Mekruh gizli hata)",
        "Lahn-ı Celî (Açık büyük hata, namazı bozar)",
        "Vakf-ı Hasen hatası",
        "Kıraat ihtilafıdır, caizdir"
      ],
      "answer": 1,
      "explanation": "Harekeyi üstünden ötreye çevirmek faili 'Sen' yerine 'Ben' yapar ve mânâyı kökten ifsad ettiği için namazı bozan bir Lahn-ı Celî'dir."
    },
    {
      "id": "q3",
      "question": "İmam Âsım'ın Hafs rivayetine göre Kur'an-ı Kerim'de kaç yerde 'Sekte' vaciptir?",
      "options": [
        "2 yerde",
        "4 yerde (Kehf, Yâsîn, Kıyâme, Mutaffifîn)",
        "6 yerde",
        "Her secde ayetinde"
      ],
      "answer": 1,
      "explanation": "Hafs rivayetinde 4 farz/vacip sekte yeri vardır: Kehf 1-2, Yâsîn 52, Kıyâme 27 ve Mutaffifîn 14."
    },
    {
      "id": "q4",
      "question": "'اُدْعُ إِلَىٰ سَبِيلِ رَبِّكَ' ayetinin başındaki vasıl hemzesiyle BAŞLARKEN harekesi nasıl tayin edilir?",
      "options": [
        "Daima esre ile başlanır.",
        "Fiilin 3. harfi ('ع') ötreli olduğu için ötre ile ('Ud'u') başlanır.",
        "Üstün ile ('Ed'u') başlanır.",
        "Hemze okunmadan doğrudan dâl harfine geçilir."
      ],
      "answer": 1,
      "explanation": "Fiil-i emirlerin başındaki vasıl hemzelerinde 3. harfe bakılır; üçüncü harf ötreli ise hemze ötre ('Ud'u') ile okunur."
    },
    {
      "id": "q5",
      "question": "Hûd Sûresi 41. ayetteki 'مَجْرٜىٰهَا' kelimesinde uygulanan özel tilavet kuralı hangisidir?",
      "options": [
        "İşmâm (Dudakları öne uzatma)",
        "Teshîl (Hemzeyi yumuşatma)",
        "İmâle (Üstünü esreye meylederek 'Mecrêhê' okuma)",
        "Sekte (Nefessiz durma)"
      ],
      "answer": 2,
      "explanation": "Hafs rivayetinde Kur'an'daki tek İmâle yeri Hûd 41'dir; 'Mecrâha' değil, A ile E arası 'Mecrêhê' olarak telaffuz edilir."
    }
  ],
  "vocalWarmups": [
    {
      "title": "Lip Trill (Dudak Titretme)",
      "benefit": "Ses tellerini yormadan hafif kan akışı sağlar; diyafram kontrolünü dengeler.",
      "duration": "2 dakika",
      "icon": "",
      "instruction": "Dudaklarınızı gevşek bırakıp nefes vererek 'Brrrr' sesi çıkarın. Pes tondan tiz tona doğru hafifçe kaydırın."
    },
    {
      "title": "Humming & Rezonans ('Mmm')",
      "benefit": "Sesi boğazdan alıp mask/burun rezonansına (haysum) aktarır; gunneli harflere zemin hazırlar.",
      "duration": "3 dakika",
      "icon": "",
      "instruction": "Ağız kapalı, dişler birbirine değmeyecek şekilde 'Mmm' diyerek titreşimin dudaklarda ve burun kökünde hissedilmesini sağlayın."
    },
    {
      "title": "Sirene (Ses Kaydırma)",
      "benefit": "Göğüs sesi ile kafa sesi arasındaki register geçiş kırılmalarını yumuşatır.",
      "duration": "2 dakika",
      "icon": "",
      "instruction": "'Vuuu' veya 'Ooo' hecesi ile en pes notadan en tize doğru itfaiye sireni gibi yumuşakça kaydırıp geri inin."
    },
    {
      "title": "Staccato Diyafram Darbeleri",
      "benefit": "Kalkale harfleri ve kesik vurgular için karın kası refleksini hızlandırır.",
      "duration": "1 dakika",
      "icon": "",
      "instruction": "'Ha - Ha - Ha' veya 'Kıf - Kıf - Kıf' şeklinde karından hafif darbelerle kısa ve net sesler üretin."
    }
  ],
  "reciterSchools": [
    {
      "schoolId": "misir",
      "name": "Mısır Ekolü (Klasik / Murattal & Mücevved)",
      "centers": "Kahire, Tanta",
      "representatives": [
        "M. Halîl el-Husarî",
        "M. Sıddîk el-Minşâvî",
        "Abdülbâsıt Abdüssamed",
        "Mustafa İsmâil"
      ],
      "characteristics": "Tavizsiz tecvid tahkiki, geniş ses ranjı (2.5 - 3 oktav), derin makam geçişleri ve güçlü diyafram desteği.",
      "focus": "Makam tilavetin hizmetindedir; harf mahreci ve sıfatları asla makama feda edilmez."
    },
    {
      "schoolId": "haremeyn",
      "name": "Haremeyn & Körfez Ekolü (Hadr / İmamet)",
      "centers": "Mekke-i Mükerreme, Medine-i Münevvere, Riyad",
      "representatives": [
        "Yâsir ed-Devserî",
        "Nâsır el-Katâmî",
        "Abdurrahman es-Südeys",
        "Meşâri el-Afâsî"
      ],
      "characteristics": "Akıcı, dinlendirici, orta-hızlı tempo (Tedvir/Hadr), huşû ve hüzün odaklı yalın makam seyri.",
      "focus": "Cemaatle namaz kılma ve hatim kıraati için ideal sürat ve netlik."
    },
    {
      "schoolId": "turk",
      "name": "Türk / Osmanlı Tilavet Ekolü (İstanbul Tavrı)",
      "centers": "İstanbul (Süleymaniye, Fatih)",
      "representatives": [
        "İsmail Karaçam",
        "Abdurrahman Gürses",
        "Kani Karaca",
        "Mehmet Çevik"
      ],
      "characteristics": "Geleneksel Türk Makam Musikisi koma hassasiyeti, içtenlik, zarif nağmeler ve cami akustik estetiği.",
      "focus": "Osmanlı selâtin camileri geleneğinde vakıf, ibtida ve makam-mana uyumu."
    }
  ]
};

const makamCandidateReciters = {
  rast: 'minshawi_mujawwad',
  ussak: 'husary_mujawwad',
  hicaz: 'dossary',
  nihavend: 'shuraym',
  saba: 'ali_jaber',
  segah: 'minshawi_mujawwad',
  kurdi: 'ali_jaber',
  acem: 'minshawi_mujawwad',
  neva: 'abdulbasit_mujawwad',
  huzzam: 'ali_jaber'
};
const makamRecitersById = new Map(window.TilavetAkademiDefaultData.reciters.map(reciter => [reciter.id, reciter]));

for (const makam of window.TilavetAkademiDefaultData.makamlar) {
  for (const example of makam.ayahExamples) {
    if (!example.verificationStatus) example.verificationStatus = 'pending-expert-review';
  }

  const reciterId = makamCandidateReciters[makam.id];
  const reciter = makamRecitersById.get(reciterId);
  const sourceExample = makam.ayahExamples[0];
  if (!reciter || !sourceExample || makam.ayahExamples.some(example => example.reciterId === reciterId)) continue;

  const ayahPath = `${String(sourceExample.surah).padStart(3, '0')}${String(sourceExample.ayah).padStart(3, '0')}.mp3`;
  makam.ayahExamples.push({
    ...sourceExample,
    id: `${makam.id}-candidate-${reciterId}`,
    reciter: reciter.name,
    reciterTitle: `${reciter.style} · aday kayıt`,
    reciterId,
    audioUrl: `${reciter.audioBase}${ayahPath}`,
    verificationStatus: 'candidate-pending-expert-review',
    makamAnalysis: 'Aday karşılaştırma kaydıdır; bu tilavetin makam seyri uzman dinlemesiyle ayrıca doğrulanmalıdır.'
  });
}

})(window);
