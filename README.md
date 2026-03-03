# TDK Sözlük 📖 🇹🇷  

✅ **Ücretsiz Kullanım!**
🔍 **Türkiye Türkçesi Sözlüğü (TDK) API Wrapper** ile kelime anlamlarını, köken bilgilerini, atasözlerini ve örnek cümleleri kolayca alabilirsiniz.  
Ayrıca, `.txt` dosyası ile **toplu kelime sorgulama** ve **CLI desteği** ile terminalden kullanım mümkündür! 🚀  

![NPM Version](https://img.shields.io/npm/v/turkce-js?color=blue&style=flat-square)  
![Downloads](https://img.shields.io/npm/dt/turkce-js?color=green&style=flat-square)  
![License](https://img.shields.io/npm/l/turkce-js?style=flat-square)  

---

## 📦 Kurulum  

```sh
npm install -g turkce-js
```

📌 **Global kurulum** ile terminalde **CLI desteğini** kullanabilirsiniz!  

---

## 🚀 Özellikler  
✅ **TDK Sözlük’ten kelime anlamlarını getirir.**  
✅ **Kelimenin kökenini, eklerini, atasözlerini ve örnek cümlelerini döndürür.**  
✅ **CLI desteği ile terminalden hızlı kullanım sağlar.**  
✅ **.txt dosyası ile toplu kelime kontrolü yapabilirsiniz.**  

---

## 🔥 Kullanım  

### 1️⃣ **Node.js ile Kullanım**  

```js
const { getWordDefinition, batchLookup } = require("turkce-js");

async function main() {
  const kelime = await getWordDefinition("ağaç");
  console.log(kelime);
}

main();
```

📌 **Çıktı Örneği:**  
```json
{
  "word": "ağaç",
  "meanings": ["Uzun ömürlü, odunsu gövdeli bitki."],
  "origin": "Türkçe",
  "suffix": null,
  "proverbs": ["Ağaç yaşken eğilir."],
  "examples": [
    {
      "sentence": "Bahçeye yeni bir ağaç diktik.",
      "author": "Mehmet Akif"
    }
  ],
  "relatedWords": ["ağaçkakan", "ağaç işleri"]
}
```

---

### 2️⃣ **CLI ile Terminalden Kullanım**  

📌 **Tek Kelime Arama:**  
```sh
turkce-js kelime bilgisayar
```
⏩ **Çıktı:** `"Veri işleme amacıyla kullanılan elektronik aygıt."`

📌 **Toplu Kelime Kontrolü (`.txt` Dosyası ile)**  

Dosya (`kelimeler.txt`):  
```
ağaç
bilgisayar
sevgi
ışık
```

Terminalde çalıştır:  
```sh
turkce-js dosya kelimeler.txt
```

⏩ **Tüm kelimelerin anlamlarını içeren JSON çıktısı alırsınız.**  

---

## 📜 Lisans  

Bu proje **MIT Lisansı** ile korunmaktadır.  

---

## 🌟 Destek & İletişim  

- **GitHub Issues:** [Hata Bildir & Öneri Yap](https://github.com/utkuberkaykoc/turkce-js/issues)  
- **⭐ Pakete yıldız ver:** Eğer hoşuna gittiyse projeye destek olabilirsin!  

🚀 **Türkçeyi keşfetmeye hazır mısın?** 🇹🇷