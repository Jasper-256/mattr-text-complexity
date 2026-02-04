# MATTR Text Complexity

A Raycast extension that calculates text complexity using MATTR (Moving Average Type-Token Ratio).

## What is MATTR?

MATTR (Moving Average Type-Token Ratio) measures lexical diversity in text by calculating the average ratio of unique words to total words across sliding windows. It provides a normalized measure of vocabulary richness that's more stable than simple Type-Token Ratio, especially for longer texts.

- **Score range:** 0.0 to 1.0
- **Higher scores:** Greater vocabulary variety
- **Lower scores:** More repetitive text
- **Typical scores:** ~0.80 for MATTR-100, ~0.58 for MATTR-500

## Features

- **Automatic clipboard paste** - Pastes clipboard content when you open the extension
- **Live calculation** - Updates MATTR scores as you type
- **Efficient algorithm** - Uses incremental sliding window with O(n) time complexity
- **Multiple window sizes** - Calculates MATTR-100 and MATTR-500 (when applicable)
- **Text sanitization** - Automatically handles special characters that could cause issues

## How It Works

The extension uses a sliding window approach:
1. Tokenizes text into words (lowercase, split on non-alphanumeric characters)
2. For texts with sufficient words: slides a window through the text, calculating TTR for each position
3. For texts shorter than the window size: falls back to simple Type-Token Ratio
4. Returns the average of all window TTRs

**Data Structure:** Uses a Map to track word frequencies in the current window, allowing O(1) updates as the window slides.

## Installation & Development

```bash
npm install && npm run dev
```

This will install dependencies and start Raycast in development mode.

## Usage

1. Copy some text to your clipboard
2. Open the extension in Raycast
3. The text will automatically paste and calculate MATTR
4. Edit the text to see live updates

**Note:** MATTR-100 results may be inaccurate with fewer than 100 words. MATTR-500 only displays for texts with 500+ words.

## Technical Details

- **Window sizes:** 100 and 500 words (configurable in code)
- **Tokenization:** Regex-based (`/\W+/`) with lowercase normalization
- **Sanitization:** Removes control characters and high Unicode characters to prevent JSON serialization errors
- **Fallback:** Uses TTR for texts shorter than window size

## Project Structure

```
src/
  text-complexity.tsx    # Main extension code
```

## License

MIT
