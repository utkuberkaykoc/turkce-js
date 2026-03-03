#!/usr/bin/env node
const { getWordDefinition, getFormattedDefinition, batchLookup, getSuggestions, isValidWord } = require("./index");
const fs = require("fs");

const args = process.argv.slice(2);

async function run() {
  if (args.length === 0) {
    console.log(`
📖 TürkçeJS - Kullanım:

  turkce-js kelime <kelime>          Kelimenin anlamını getir
  turkce-js detay <kelime>           Detaylı formatlı çıktı
  turkce-js oneri <kelime>           Otomatik tamamlama önerileri
  turkce-js kontrol <kelime>         Kelimenin TDK'da olup olmadığını kontrol et
  turkce-js dosya <dosyaYolu>        Toplu kelime sorgulama
  turkce-js dosya <yol> --formatli   Formatlı toplu sorgulama

Örnekler:
  turkce-js kelime bilgisayar
  turkce-js detay merhaba
  turkce-js oneri bil
  turkce-js kontrol asdfg
`);
    process.exit(1);
  }

  const command = args[0];

  if (command === "kelime" && args[1]) {
    const result = await getWordDefinition(args[1]);
    if (result.error) {
      console.error(`❌ ${result.error}`);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } else if (command === "detay" && args[1]) {
    const formatted = await getFormattedDefinition(args[1]);
    console.log(formatted);
  } else if (command === "oneri" && args[1]) {
    const suggestions = await getSuggestions(args[1]);
    if (suggestions.length === 0) {
      console.log("❌ Öneri bulunamadı.");
    } else {
      console.log(`\n💡 "${args[1]}" için öneriler:\n`);
      suggestions.forEach((s, i) => console.log(`   ${i + 1}. ${s}`));
      console.log('');
    }
  } else if (command === "kontrol" && args[1]) {
    const valid = await isValidWord(args[1]);
    console.log(valid ? `✅ "${args[1]}" TDK sözlüğünde mevcut.` : `❌ "${args[1]}" TDK sözlüğünde bulunamadı.`);
  } else if (command === "dosya" && args[1]) {
    if (!fs.existsSync(args[1])) {
      console.error("❌ Dosya bulunamadı!");
      process.exit(1);
    }

    const formatted = args.includes("--formatli");
    const results = await batchLookup(args[1], { formatted });
    if (formatted) {
      results.forEach((r) => console.log(r));
    } else {
      console.log(JSON.stringify(results, null, 2));
    }
  } else {
    console.error("❌ Geçersiz komut! Kullanım için: turkce-js");
    process.exit(1);
  }
}

run();
