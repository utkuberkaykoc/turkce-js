#!/usr/bin/env node
const { getWordDefinition, batchLookup } = require("./index");
const fs = require("fs");

const args = process.argv.slice(2);

async function run() {
  if (args.length === 0) {
    console.error("Kullanım: turkce-js kelime <kelime> veya turkce-js dosya <dosyaYolu>");
    process.exit(1);
  }

  const command = args[0];

  if (command === "kelime" && args[1]) {
    const result = await getWordDefinition(args[1]);
    console.log(result);
  } else if (command === "dosya" && args[1]) {
    if (!fs.existsSync(args[1])) {
      console.error("Dosya bulunamadı!");
      process.exit(1);
    }

    const results = await batchLookup(args[1]);
    console.log(results);
  } else {
    console.error("Geçersiz komut!");
    process.exit(1);
  }
}

run();
