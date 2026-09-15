# Pınar & Enes — Fotoğraf Yükleme Sayfası

Misafirlerin düğün/nikah fotoğraflarını yükleyebildiği ve herkesin galeriden
görebildiği basit bir sayfa. Depolama için **Netlify Blobs** kullanır — ekstra
bir veritabanı veya üçüncü parti servis gerekmez, tamamen Netlify'ın ücretsiz
planında çalışır.

## Bu neden bir zip'i sürükle-bırakmaktan farklı?

Bu sitede, dosyaları saklayan küçük sunucu tarafı fonksiyonlar var
(`netlify/functions/` klasörü). Netlify'ın "drag and drop deploy" ekranı
sadece statik dosyaları (HTML/CSS/görsel) kabul eder, fonksiyonları çalıştırmaz.
Bu yüzden bu projeyi **GitHub üzerinden** Netlify'a bağlamanız gerekiyor
(veya Netlify CLI kullanmanız — aşağıda ikisi de anlatılıyor).

## Kurulum — Yöntem 1: GitHub üzerinden (önerilen, tamamen ücretsiz)

1. github.com'da yeni bir repository oluşturun (örn. `pinar-enes-fotograflar`).
2. Bu klasördeki tüm dosyaları (netlify.toml, package.json, netlify/, public/)
   o repository'ye yükleyin.
3. app.netlify.com adresine gidin, **"Add new site" → "Import an existing project"**
   deyin, GitHub hesabınızı bağlayıp bu repository'yi seçin.
4. Netlify ayarları otomatik algılayacaktır (netlify.toml sayesinde). Herhangi
   bir şey değiştirmeden **Deploy** deyin.
5. Birkaç dakika içinde siteniz `https://rastgele-isim.netlify.app` adresinde
   yayına girecek. İsterseniz Site settings'ten adresi değiştirebilirsiniz.
6. Netlify Blobs otomatik olarak aktiftir — ekstra bir hesap açmanıza veya
   API anahtarı girmenize gerek yoktur.

## Kurulum — Yöntem 2: Netlify CLI ile (bilgisayarınızdan)

```bash
npm install -g netlify-cli
cd pinar-enes-fotograflar
npm install
netlify login
netlify deploy --prod
```

## Kullanım

- Ana sayfa iki sekme sunar: **Fotoğraf Yükle** ve **Galeri**.
- Yüklenen her fotoğraf tarayıcıda otomatik olarak küçültülür (en fazla
  1920px, JPEG %85 kalite) — böylece büyük telefon fotoğrafları da sorunsuz
  yüklenir.
- Galeri sekmesi, `/api/list-photos` fonksiyonunu çağırarak tüm fotoğrafları
  listeler ve `/api/photo/:key` üzerinden gösterir.

## Sınırlamalar / bilinmesi gerekenler

- **Herkese açık**: Bağlantıyı bilen herkes fotoğraf yükleyebilir ve galeriyi
  görebilir. Şifre veya giriş sistemi yoktur — düğün davetiyesi bağlamında
  bu genelde sorun değildir, ama linki sadece davetlilerle paylaşmanız önerilir.
- **Dosya boyutu**: Tek seferde yüklenebilecek fotoğraf boyutu (sıkıştırma
  sonrası) yaklaşık 9MB ile sınırlıdır — bu, normal telefon fotoğrafları için
  yeterlidir.
- **Fotoğraf sayısı**: Netlify Blobs'un pratikte bir üst sınırı yoktur, ancak
  çok yüksek trafik/depolama Netlify'ın ücretsiz plan kotalarına takılabilir.
- Fotoğrafları toplu olarak indirmek isterseniz, Netlify dashboard'undaki
  "Blobs" sekmesinden veya Netlify CLI ile tek tek indirebilirsiniz.

## Davetiye sitesine bağlama

Ana davetiye sitenizdeki "Fotoğraf Yükle" ve "Nikah Fotoğrafları" linklerini
bu sitenin adresiyle güncelleyin, örn:

```
https://pinar-enes-fotograf.netlify.app/
```

(İki link de aynı sayfaya gidebilir — kullanıcı orada "Yükle" veya "Galeri"
sekmesini seçer.)
