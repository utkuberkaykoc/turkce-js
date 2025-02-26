const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

/**
 * Fetches word definitions from the Turkish Language Association (TDK) dictionary.
 * @param {string} word - The word to search for.
 * @returns {Promise<Object>} - Word details including meanings, origin, and examples.
 */
async function getWordDefinition(word) {
  try {
    const url = `https://sozluk.gov.tr/gts?ara=${encodeURIComponent(word)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("Kelime bulunamadı.");
    }

    const entry = data[0];

    return {
      word: entry.madde,
      meanings: entry.anlamlarListe.map((item) => item.anlam),
      origin: entry.lisan || "Bilinmiyor",
      suffix: entry.taki || null,
      proverbs: entry.atasozu || [],
      examples: entry.orneklerListe
        ? entry.orneklerListe.map((example) => ({
            sentence: example.ornek,
            author: example.yazar || "Bilinmiyor",
          }))
        : [],
      relatedWords: entry.birlesikler || [],
    };
  } catch (error) {
    return { word, error: error.message };
  }
}

/**
 * Reads a .txt file and fetches word definitions in batch.
 * @param {string} filePath - Path to the .txt file.
 * @returns {Promise<Array>} - Array of word definitions.
 */
async function batchLookup(filePath) {
  try {
    const words = fs.readFileSync(filePath, "utf8").split("\n").map((w) => w.trim()).filter(Boolean);
    const results = await Promise.all(words.map(getWordDefinition));
    return results;
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

module.exports = { getWordDefinition, batchLookup };
