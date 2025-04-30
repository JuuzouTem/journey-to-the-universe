document.addEventListener('DOMContentLoaded', () => {
    // HTML Elementlerini Seçme
    const paperElement = document.getElementById('paper');
    const foldCountDisplay = document.getElementById('fold-count');
    const thicknessDisplay = document.getElementById('thickness-display');
    const milestoneList = document.getElementById('milestone-list');
    const bodyElement = document.body; // Arka plan ve sınıf değişimi için
    const playMusicButton = document.getElementById('play-music-button');
    const backgroundMusic = document.getElementById('background-music');

    // Sabitler ve Başlangıç Değerleri
    const INITIAL_THICKNESS_MM = 0.1;
    const INITIAL_THICKNESS_M = INITIAL_THICKNESS_MM / 1000;

    // Birim sabitleri (metre cinsinden)
    const METERS_IN_CM = 0.01;
    const METERS_IN_M = 1;
    const METERS_IN_KM = 1000;
    const METERS_IN_AU = 149597870700; // Astronomik Birim
    const METERS_IN_LY = 9460730472580800; // Işık Yılı

    // Dönüm noktaları (metre cinsinden ve sıralı olmalı)
    // Gezegenler ve özel noktalar için planetId eklendi
    const milestones = [
        // Küçük Ölçek
        { threshold: INITIAL_THICKNESS_M * 10, name: "Kağıt Kalınlığı (1mm)", reached: false, bgClass: 'bg-earth' },
        { threshold: METERS_IN_CM, name: "Tırnak Kalınlığı (~1cm)", reached: false, bgClass: 'bg-earth' },
        { threshold: METERS_IN_CM * 10, name: "Kalem Boyu (~10cm)", reached: false, bgClass: 'bg-earth' },
        { threshold: METERS_IN_M, name: "İnsan Boyu (~1m)", reached: false, bgClass: 'bg-earth' },
        { threshold: 10, name: "Bir Otobüs Uzunluğu (~10m)", reached: false, bgClass: 'bg-earth' },
        { threshold: 115, name: "En Uzun Ağaç (Sekoya ~115m)", reached: false, bgClass: 'bg-earth' },
        { threshold: 828, name: "Burj Khalifa (828m)", reached: false, bgClass: 'bg-earth' },
        { threshold: 8849, name: "Everest Dağı (8,849m)", reached: false, bgClass: 'bg-sky' },

        // Atmosfer ve Yakın Uzay
        { threshold: 12 * METERS_IN_KM, name: "Troposfer Katmanı Sonu (~12km)", reached: false, bgClass: 'bg-sky' },
        { threshold: 50 * METERS_IN_KM, name: "Stratosfer Katmanı Sonu (~50km)", reached: false, bgClass: 'bg-sky' },
        { threshold: 85 * METERS_IN_KM, name: "Mezosfer Katmanı Sonu (~85km)", reached: false, bgClass: 'bg-space-entry' },
        { threshold: 100 * METERS_IN_KM, name: "Kármán Hattı / Uzayın Başlangıcı (100km)", reached: false, bgClass: 'bg-space-entry' },
        { threshold: 400 * METERS_IN_KM, name: "Uluslararası Uzay İstasyonu (ISS) (~400km)", reached: false, bgClass: 'bg-space-entry' },
        { threshold: 35786 * METERS_IN_KM, name: "Jeostatik Yörünge (~35,786 km)", reached: false, bgClass: 'bg-space-moon' }, // Ay'a doğru

        // Ay ve Gezegenler Arası
        { threshold: 384400 * METERS_IN_KM, name: "Ay'a Ortalama Uzaklık (~384,400 km)", reached: false, bgClass: 'bg-space-moon', planetId: 'moon' }, // ID eklendi (CSS'te özel ::after'ı var)
        { threshold: 1.5 * 1000000 * METERS_IN_KM, name: "James Webb Uzay Teleskobu (L2 noktası ~1.5 Milyon km)", reached: false, bgClass: 'bg-interplanetary' },
        { threshold: 55 * 1000000 * METERS_IN_KM, name: "Mars'a En Yakın Mesafe (~55 Milyon km)", reached: false, bgClass: 'bg-interplanetary', planetId: 'mars' }, // ID eklendi
        { threshold: METERS_IN_AU, name: "Dünya-Güneş Mesafesi (1 AU / ~150 Milyon km)", reached: false, bgClass: 'bg-interplanetary', planetId: 'sun-distance' }, // ID eklendi
        { threshold: 5.2 * METERS_IN_AU, name: "Jüpiter'e Ortalama Uzaklık (~5.2 AU)", reached: false, bgClass: 'bg-interplanetary', planetId: 'jupiter' }, // ID eklendi
        { threshold: 30 * METERS_IN_AU, name: "Neptün'e Ortalama Uzaklık (~30 AU)", reached: false, bgClass: 'bg-interplanetary', planetId: 'neptune' }, // ID eklendi

        // Yıldızlararası ve Ötesi
        { threshold: 100 * METERS_IN_AU, name: "Helyosfer Sınırı (~100 AU - Voyager geçişi)", reached: false, bgClass: 'bg-interstellar', planetId: 'heliopause' }, // ID eklendi
        { threshold: METERS_IN_LY, name: "1 Işık Yılı (~9.46 Trilyon km)", reached: false, bgClass: 'bg-interstellar' },
        { threshold: 4.24 * METERS_IN_LY, name: "En Yakın Yıldız - Proxima Centauri (~4.24 IY)", reached: false, bgClass: 'bg-interstellar' },
        { threshold: 26000 * METERS_IN_LY, name: "Samanyolu'nun Merkezine Uzaklık (~26,000 IY)", reached: false, bgClass: 'bg-galactic' },
        { threshold: 100000 * METERS_IN_LY, name: "Samanyolu Galaksisi Çapı (~100,000 IY)", reached: false, bgClass: 'bg-galactic', planetId: 'galaxy-disk' }, // ID eklendi
        { threshold: 2.5 * 1000000 * METERS_IN_LY, name: "Andromeda Galaksisi Mesafesi (~2.5 Milyon IY)", reached: false, bgClass: 'bg-galactic' },
        { threshold: 10 * 1000000 * METERS_IN_LY, name: "Yerel Grup Galaksi Kümesi Çapı (~10 Milyon IY)", reached: false, bgClass: 'bg-cosmic' },
        { threshold: 100 * 1000000 * METERS_IN_LY, name: "Virgo Süperkümesi Çapı (~100 Milyon IY)", reached: false, bgClass: 'bg-cosmic' },
        { threshold: 1 * 1000000000 * METERS_IN_LY, name: "Laniakea Süperkümesi (~1 Milyar IY)", reached: false, bgClass: 'bg-cosmic' },
        { threshold: 93 * 1000000000 * METERS_IN_LY, name: "Gözlemlenebilir Evrenin Çapı (~93 Milyar IY)", reached: false, bgClass: 'bg-cosmic' }
    ];

    // Durum Değişkenleri
    let foldCount = 0;
    let currentThicknessM = INITIAL_THICKNESS_M;
    let isFolding = false;
    let lastBgClass = 'bg-earth';
    let currentPlanetClass = null;
    let foldDirection = 'horizontal';


    // --- Başlangıç Durumu Ayarları ---
    updateThicknessDisplay(currentThicknessM);
    updateBackground(currentThicknessM);
    paperElement.classList.add('show-horizontal-line');

    // --- Olay Dinleyiciler ---
    paperElement.addEventListener('click', handleFold);

    // --- Müzik Butonu Olay Dinleyici ---
    if (playMusicButton && backgroundMusic) {
        playMusicButton.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    playMusicButton.textContent = '❚❚'; // Pause ikonu
                    playMusicButton.title = "Müziği Durdur";
                }).catch(error => {
                    console.error("Müzik çalma hatası:", error);
                    alert("Tarayıcı ayarları veya bir hata nedeniyle müzik başlatılamadı.");
                    playMusicButton.textContent = '►'; // Başarısız olursa Play ikonuna geri dön
                    playMusicButton.title = "Müziği Oynat";
                });
            } else {
                backgroundMusic.pause();
                playMusicButton.textContent = '►'; // Play ikonu
                playMusicButton.title = "Müziği Oynat";
            }
        });
    } else {
        console.warn("Müzik butonu veya ses elementi bulunamadı.");
    } // <--- ADD THIS CLOSING BRACE

    // --- Fonksiyonlar ---

    /**
     * Kağıda tıklanıldığında katlama işlemini yönetir.
     */
    function handleFold() {
        if (isFolding) return; // Animasyon bitmeden tekrar katlama
        isFolding = true;

        // İlk katlamada başlangıç mesajını kaldır
        if (foldCount === 0) {
            const initialMsg = milestoneList.querySelector('.milestone-initial');
            if (initialMsg) initialMsg.remove();
            paperElement.classList.add('folded-visual'); // Kalıcı kat izi için sınıf ekle
        }

        foldCount++;
        // Üstel büyüme
        currentThicknessM = INITIAL_THICKNESS_M * Math.pow(2, foldCount);

        // Görsel ve bilgi güncellemeleri
        foldCountDisplay.textContent = foldCount;
        updateThicknessDisplay(currentThicknessM);
        checkMilestones(currentThicknessM);
        updateBackground(currentThicknessM);

        // Animasyon ve Görsel Efektler
        const currentFoldAnimationClass = `folding-${foldDirection}`;
        paperElement.classList.add(currentFoldAnimationClass);

        // Bir sonraki katlama yönünü belirle (animasyondan *önce* belirleyip, animasyon *sonrası* uygula)
        const nextFoldDirection = (foldDirection === 'horizontal') ? 'vertical' : 'horizontal';

        // Animasyonun bitmesini bekle ve durumu sıfırla
        setTimeout(() => {
            paperElement.classList.remove(currentFoldAnimationClass); // Geçerli animasyon sınıfını kaldır
            isFolding = false; // Yeni katlamaya izin ver

            // Katlama yönünü güncelle
            foldDirection = nextFoldDirection;

            // Gösterilecek katlama çizgisini güncelle
            paperElement.classList.remove('show-horizontal-line', 'show-vertical-line');
            if (foldDirection === 'horizontal') {
                paperElement.classList.add('show-horizontal-line');
            } else {
                paperElement.classList.add('show-vertical-line');
            }

        }, 400); // CSS animasyon süresiyle eşleşmeli (0.4s)
    }

    /**
     * Sayıyı okunabilir bir formata dönüştürür (üstel, yerel format).
     * @param {number} num - Formatlanacak sayı.
     * @returns {string} Formatlanmış sayı.
     */
    function formatNumber(num) {
        if (num === 0) return "0";
        // Çok küçük veya çok büyük sayılar için üstel gösterim
        if (num < 0.0001 || num >= 1e15) {
            return num.toExponential(2);
        }
         // Orta büyüklükteki sayılar için standart gösterim (maks 4 ondalık)
        if (num < 1) {
             return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
        }
        // Daha büyük sayılar için (maks 2 ondalık)
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    /**
     * Hesaplanan kalınlığı uygun birimle ekranda gösterir.
     * @param {number} thicknessM - Metre cinsinden kalınlık.
     */
    function updateThicknessDisplay(thicknessM) {
        let displayValue;
        let displayUnit;

        if (thicknessM < METERS_IN_CM) { // 1 cm'den küçükse mm
            displayValue = formatNumber(thicknessM * 1000);
            displayUnit = "mm";
        } else if (thicknessM < METERS_IN_M) { // 1 m'den küçükse cm
            displayValue = formatNumber(thicknessM * 100);
            displayUnit = "cm";
        } else if (thicknessM < METERS_IN_KM) { // 1 km'den küçükse m
            displayValue = formatNumber(thicknessM);
            displayUnit = "m";
        } else if (thicknessM < METERS_IN_AU) { // 1 AU'dan küçükse km
            displayValue = formatNumber(thicknessM / METERS_IN_KM);
            displayUnit = "km";
        } else if (thicknessM < METERS_IN_LY) { // 1 IY'den küçükse AU
            displayValue = formatNumber(thicknessM / METERS_IN_AU);
            displayUnit = "AU";
        } else { // Işık Yılı
            displayValue = formatNumber(thicknessM / METERS_IN_LY);
            displayUnit = "Işık Yılı";
        }

        thicknessDisplay.textContent = `${displayValue} ${displayUnit}`;
    }

     /**
     * Mevcut kalınlığa göre ulaşılan dönüm noktalarını kontrol eder ve listeye ekler.
     * Gezegenlere/özel noktalara özel sınıfları body'ye ekler.
     * @param {number} thicknessM - Metre cinsinden kalınlık.
     */
    function checkMilestones(thicknessM) {
        milestones.forEach(milestone => {
            if (!milestone.reached && thicknessM >= milestone.threshold) {
                milestone.reached = true;
                const li = document.createElement('li');
                li.textContent = milestone.name;
                li.classList.add('reached');
                milestoneList.appendChild(li);
                li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                // Eğer milestone bir gezegen/özel nokta ise (planetId varsa), body'ye sınıf ekle
                if (milestone.planetId) {
                    // Önceki gezegen sınıfını kaldır (üst üste binmemesi için)
                    if (currentPlanetClass) {
                        bodyElement.classList.remove(currentPlanetClass);
                    }
                    // Yeni sınıfı ekle (örn: "reached-mars")
                    const newPlanetClass = `reached-${milestone.planetId}`;
                    bodyElement.classList.add(newPlanetClass);
                    currentPlanetClass = newPlanetClass; // Yeni sınıfı hatırla
                }
            }
        });
    }

    /**
     * Mevcut kalınlığa göre sayfanın arka plan sınıfını günceller.
     * @param {number} thicknessM - Metre cinsinden kalınlık.
     */
    function updateBackground(thicknessM) {
        let targetBgClass = 'bg-earth'; // Hedef arka plan sınıfı

        // Uygun arka plan sınıfını bul (en yüksek eşikten başlayarak kontrol et)
        for (let i = milestones.length - 1; i >= 0; i--) {
            // İlk dönüm noktası (1mm) için başlangıç arka planını koru
             if (i === 0 && thicknessM < milestones[0].threshold) {
                 targetBgClass = 'bg-earth';
                 break;
             }
            if (thicknessM >= milestones[i].threshold && milestones[i].bgClass) {
                targetBgClass = milestones[i].bgClass;
                break; // En uygun (en yüksek eşikli) olanı bulduk
            }
        }

        // Eğer sınıf değiştiyse DOM'u güncelle
        if (targetBgClass !== lastBgClass) {
             bodyElement.classList.remove(lastBgClass); // Eski sınıfı kaldır
             bodyElement.classList.add(targetBgClass); // Yeni sınıfı ekle
             lastBgClass = targetBgClass; // Son kullanılan sınıfı güncelle
        }
    }

}); // DOMContentLoaded olay dinleyicisinin sonu