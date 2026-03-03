# turkce-js 🇹🇷

Türk Dil Kurumu (TDK) sözlük API wrapper for Node.js — word definitions, suggestions, validation, and formatted output.

## 🚀 What's New in v2.0.0

- **`getSuggestions()`** — TDK autocomplete suggestions for partial words
- **`getFormattedDefinition()`** — Beautiful ASCII-formatted word details
- **`isValidWord()`** — Quick boolean word validation
- **`validateWords()`** — Batch validate arrays of words
- **Enhanced definitions** — Pronunciation, detailed meanings with types/examples, related words
- **Better CLI** — New commands: `detay`, `oneri`, `kontrol`

## 📦 Installation

```bash
npm install turkce-js
```

## 📋 Usage

### Get Word Definition

```js
const { getWordDefinition } = require("turkce-js");

const result = await getWordDefinition("merhaba");
console.log(result.title);       // "merhaba"
console.log(result.pronunciation); // Pronunciation info
console.log(result.meanings);     // Detailed meanings array
console.log(result.relatedWords); // Related words array
```

### Get Suggestions (Autocomplete)

```js
const { getSuggestions } = require("turkce-js");

const suggestions = await getSuggestions("mer");
// ["mera", "merak", "meraklı", "meral", "meram", "merhaba", ...]
```

### Formatted Definition

```js
const { getFormattedDefinition } = require("turkce-js");

const text = await getFormattedDefinition("bilgisayar");
console.log(text);
// ╔════════════════════════════╗
// ║  BILGISAYAR              ║
// ╠════════════════════════════╣
// ║  1. [isim] ...           ║
// ╚════════════════════════════╝
```

### Validate Words

```js
const { isValidWord, validateWords } = require("turkce-js");

const valid = await isValidWord("kitap"); // true
const invalid = await isValidWord("xyzabc"); // false

const results = await validateWords(["kitap", "kalem", "xyzabc"]);
// { valid: ["kitap", "kalem"], invalid: ["xyzabc"] }
```

### Batch Lookup

```js
const { batchLookup } = require("turkce-js");

const words = await batchLookup(["araba", "ev", "kitap"]);
// Returns array of definition objects

// With formatted output:
const formatted = await batchLookup(["araba", "ev"], { formatted: true });
```

## 📟 CLI Usage

```bash
# Basic definition
npx turkce-js kelime merhaba

# Formatted definition
npx turkce-js detay bilgisayar

# Get suggestions
npx turkce-js oneri mer

# Validate a word
npx turkce-js kontrol kitap

# Lookup from file
npx turkce-js dosya kelimeler.txt

# Formatted file output
npx turkce-js dosya kelimeler.txt --formatli
```

## 📡 API

| Function | Description |
|----------|-------------|
| `getWordDefinition(word)` | Get detailed word definition from TDK |
| `getSuggestions(partial)` | Get autocomplete suggestions |
| `getFormattedDefinition(word)` | Get ASCII-formatted definition |
| `isValidWord(word)` | Check if word exists (boolean) |
| `validateWords(words[])` | Batch validate words |
| `batchLookup(words[], options?)` | Lookup multiple words |

## 📄 License

MIT © Utku Berkay Koç
