# PACU ტკივილის მართვა — iPhone / iPad ვერსია (PWA)

ეს არის იგივე აპლიკაცია, რომელიც iPhone-ზე მთელ ეკრანზე იხსნება და ოფლაინაც მუშაობს,
App Store-ის, Mac-ის და გადასახადის გარეშე.

## ერთჯერადი გამოქვეყნება (≈10 წუთი)

1. github.com-ზე: **+** → **New repository**. სახელი: `pacu`.
   მონიშნეთ **Public** (უფასო GitHub Pages მხოლოდ Public-ზე მუშაობს) → **Create**.
2. **uploading an existing file** → გადმოათრიეთ ამ საქაღალდის **შიგთავსი**
   (`index.html`, `manifest.webmanifest`, `sw.js`, `icons`, `fonts`) → **Commit changes**.
3. **Settings** → მარცხნივ **Pages** → *Build and deployment* → Source: **Deploy from a branch**,
   Branch: **main** / **(root)** → **Save**.
4. 1–2 წუთში იმავე გვერდზე გამოჩნდება მისამართი:
   `https://drvaska.github.io/pacu/`

## დაყენება iPhone-ზე

1. გახსენით ეს მისამართი **Safari**-ში (აუცილებლად Safari, არა Chrome).
2. ქვემოთ **Share** ღილაკი (კვადრატი ისრით) → **Add to Home Screen** → **Add**.
3. ხატულა გამოჩნდება მთავარ ეკრანზე. პირველად გახსენით ინტერნეტთან —
   ამის შემდეგ ოფლაინაც იმუშავებს.

იგივე მუშაობს Android-ზე Chrome-იდანაც (**Install app**).

## განახლება

შეცვალეთ `index.html` repozitorium-ში (**Add file → Upload files**, იგივე სახელით).
ტელეფონზე აპი განახლდება შემდეგი გახსნისას, როცა ინტერნეტი აქვს — თავიდან დაყენება არ სჭირდება.

## ახალი HTML ვერსიის მომზადება

თუ HTML-ს რედაქტორიდან ხელახლა გამოიტანთ, `<head>`-ში დაამატეთ ეს შვიდი ხაზი:

```html
<link rel="manifest" href="manifest.webmanifest">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="PACU ტკივილი">
<link rel="apple-touch-icon" href="icons/apple-touch-icon-180.png">
<link rel="icon" href="icons/icon-192.png">
```

`</body>`-მდე კი ეს:

```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}
</script>
```

და შრიფტების ხაზი უნდა იყოს `<link href="fonts/fonts.css" rel="stylesheet">`,
და არა `fonts.googleapis.com` — თორემ ოფლაინში შრიფტები დაიკარგება.

## შენიშვნები

- პაციენტის მონაცემები რჩება მხოლოდ ტელეფონში (localStorage) და არსად არ იგზავნება.
- Repozitorium Public-ია, ანუ თავად ინსტრუმენტი საჯაროა — მონაცემები არა.
  თუ საჭიროა დახურული წვდომა, იგივე ფაილები აიტვირთება Cloudflare Pages-ზე
  პრივატული repozitorium-იდან, Cloudflare Access-ით.
- ბეჭდვა მთავარი ეკრანის აპში iOS-ზე ზოგჯერ არ იხსნება; ასეთ დროს იგივე მისამართი
  Safari-ში გახსენით და იქიდან დაბეჭდეთ.
