# MATTR Text Complexity

A Raycast extension that calculates text complexity using MATTR (Moving Average Type-Token Ratio) with a 100-word sliding window.

## What is MATTR?

MATTR (Moving Average Type-Token Ratio) measures lexical diversity in text by calculating the average ratio of unique words to total words across sliding windows. It provides a normalized measure of vocabulary richness that's more stable than simple Type-Token Ratio, especially for longer texts.

- **Score range:** 0.0 to 1.0
- **Higher scores:** Greater vocabulary variety
- **Lower scores:** More repetitive text
- **Typical score:** ~0.8 for natural language

## Features

- **Automatic clipboard paste** - Pastes clipboard content when you open the extension
- **Live calculation** - Updates MATTR score as you type
- **Efficient algorithm** - Uses incremental sliding window with O(n) time complexity
- **100-word window** - Standard window size for reliable MATTR measurement
- **Text sanitization** - Automatically handles special characters that could cause issues

## How It Works

The extension uses a sliding window approach:
1. Tokenizes text into words (lowercase, split on non-alphanumeric characters)
2. For texts ≥100 words: slides a 100-word window through the text, calculating TTR for each position
3. For texts <100 words: falls back to simple Type-Token Ratio
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

**Note:** Results may be inaccurate with fewer than 150 words.

## Technical Details

- **Window size:** 100 words (configurable in code)
- **Tokenization:** Regex-based (`/\W+/`) with lowercase normalization
- **Sanitization:** Removes backslashes, control characters, double quotes, and high Unicode characters to prevent JSON serialization errors
- **Fallback:** Uses TTR for texts shorter than window size

## Project Structure

```
src/
  text-complexity.tsx    # Main extension code
```

## License

MIT
