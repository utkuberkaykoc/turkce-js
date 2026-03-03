const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const TDK_BASE = "https://sozluk.gov.tr";

/**
 * Fetches word definitions from the Turkish Language Association (TDK) dictionary.
 * @param {string} word - The word to search for.
 * @returns {Promise<Object>} - Word details including meanings, origin, and examples.
 */
async function getWordDefinition(word) {
  try {
    if (!word || typeof word !== "string") {
      throw new Error("Kelime gereklidir ve metin olmalıdır.");
    }

    const url = `${TDK_BASE}/gts?ara=${encodeURIComponent(word.trim())}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0 || data.error) {
      throw new Error("Kelime bulunamadı.");
    }

    const entry = data[0];

    return {
      word: entry.madde,
      meanings: entry.anlamlarListe ? entry.anlamlarListe.map((item) => ({
        meaning: item.anlam,
        type: item.opilesik || null,
        example: item.orneklerListe ? item.orneklerListe[0]?.ornek : null,
      })) : [],
      shortMeanings: entry.anlamlarListe ? entry.anlamlarListe.map((item) => item.anlam) : [],
      origin: entry.lisan || "Bilinmiyor",
      suffix: entry.taki || null,
      pronunciation: entry.telaffuz || null,
      proverbs: entry.atasozu || [],
      examples: entry.orneklerListe
        ? entry.orneklerListe.map((example) => ({
            sentence: example.ornek,
            author: example.yazar || "Bilinmiyor",
          }))
        : [],
      relatedWords: entry.birlesikler ? entry.birlesikler.split(", ") : [],
      compound: entry.birlesikler || null,
    };
  } catch (error) {
    return { word, error: error.message };
  }
}

/**
 * Gets autocomplete suggestions for a partial word.
 * @param {string} prefix - The beginning of a word.
 * @returns {Promise<string[]>} - Array of suggested words.
 */
async function getSuggestions(prefix) {
  try {
    if (!prefix || typeof prefix !== "string") {
      throw new Error("Kelime başlangıcı gereklidir.");
    }

    const url = `${TDK_BASE}/autocomplete.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) return [];

    const normalizedPrefix = prefix.toLowerCase().trim();
    return data
      .filter((item) => {
        const word = (item.madde || item).toString().toLowerCase();
        return word.startsWith(normalizedPrefix);
      })
      .map((item) => item.madde || item.toString())
      .slice(0, 20);
  } catch (error) {
    throw new Error(`Öneri hatası: ${error.message}`);
  }
}

/**
 * Gets a formatted, readable definition string for a word.
 * @param {string} word - The word to look up.
 * @returns {Promise<string>} - Formatted string output.
 */
async function getFormattedDefinition(word) {
  const result = await getWordDefinition(word);

  if (result.error) return `❌ ${word}: ${result.error}`;

  let output = `\n📖 ${result.word.toUpperCase()}`;
  if (result.pronunciation) output += ` (${result.pronunciation})`;
  output += `\n${"─".repeat(40)}\n`;
  output += `📌 Köken: ${result.origin}\n\n`;

  if (result.shortMeanings.length > 0) {
    output += `📝 Anlamlar:\n`;
    result.shortMeanings.forEach((m, i) => {
      output += `   ${i + 1}. ${m}\n`;
    });
  }

  if (result.examples.length > 0) {
    output += `\n💬 Örnek Cümleler:\n`;
    result.examples.forEach((e) => {
      output += `   "${e.sentence}" — ${e.author}\n`;
    });
  }

  if (result.proverbs.length > 0) {
    output += `\n🔮 Atasözleri/Deyimler:\n`;
    result.proverbs.forEach((p) => {
      output += `   • ${p}\n`;
    });
  }

  if (result.relatedWords.length > 0) {
    output += `\n🔗 İlişkili: ${result.relatedWords.join(", ")}\n`;
  }

  return output;
}

/**
 * Reads a .txt file and fetches word definitions in batch.
 * @param {string} filePath - Path to the .txt file.
 * @param {Object} [options] - Options.
 * @param {boolean} [options.formatted=false] - Return formatted strings.
 * @returns {Promise<Array>} - Array of word definitions.
 */
async function batchLookup(filePath, options = {}) {
  try {
    const words = fs.readFileSync(filePath, "utf8").split("\n").map((w) => w.trim()).filter(Boolean);

    if (options.formatted) {
      const results = [];
      for (const word of words) {
        results.push(await getFormattedDefinition(word));
      }
      return results;
    }

    const results = await Promise.all(words.map(getWordDefinition));
    return results;
  } catch (error) {
    throw new Error(`Dosya okuma hatası: ${error.message}`);
  }
}

/**
 * Checks if a word exists in the TDK dictionary.
 * @param {string} word - The word to check.
 * @returns {Promise<boolean>} - True if the word exists.
 */
async function isValidWord(word) {
  const result = await getWordDefinition(word);
  return !result.error;
}

/**
 * Checks multiple words and returns which are valid TDK words.
 * @param {string[]} words - Array of words to check.
 * @returns {Promise<Object>} - { valid: [...], invalid: [...] }
 */
async function validateWords(words) {
  const results = await Promise.all(
    words.map(async (word) => ({
      word,
      valid: await isValidWord(word),
    }))
  );

  return {
    valid: results.filter((r) => r.valid).map((r) => r.word),
    invalid: results.filter((r) => !r.valid).map((r) => r.word),
    total: words.length,
    validCount: results.filter((r) => r.valid).length,
    invalidCount: results.filter((r) => !r.valid).length,
  };
}

module.exports = {
  getWordDefinition,
  getSuggestions,
  getFormattedDefinition,
  batchLookup,
  isValidWord,
  validateWords,
};
