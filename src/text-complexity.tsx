import { Form, Clipboard, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";

function sanitizeText(text: string): string {
  // Remove characters that cause JSON serialization errors
  return text
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .replace(/[\uD800-\uDFFF]/g, "");
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 0);
}

function calculateMATTR(words: string[], windowSize: number = 100): number {
  if (words.length < windowSize) {
    const uniqueWords = new Set(words);
    return words.length > 0 ? uniqueWords.size / words.length : 0;
  }

  const numWindows = words.length - windowSize + 1;
  let sumTTR = 0;

  // Initialize the first window with a frequency map
  const wordCounts = new Map<string, number>();
  for (let i = 0; i < windowSize; i++) {
    const word = words[i];
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  }
  sumTTR += wordCounts.size / windowSize;

  // Efficiently slide the window by updating counts incrementally
  for (let i = 1; i < numWindows; i++) {
    // Remove the word sliding out of the window
    const removedWord = words[i - 1];
    const removedCount = wordCounts.get(removedWord)!;
    if (removedCount === 1) {
      wordCounts.delete(removedWord);
    } else {
      wordCounts.set(removedWord, removedCount - 1);
    }

    // Add the word sliding into the window
    const addedWord = words[i + windowSize - 1];
    wordCounts.set(addedWord, (wordCounts.get(addedWord) || 0) + 1);

    // Calculate TTR for this window
    sumTTR += wordCounts.size / windowSize;
  }

  return sumTTR / numWindows;
}

export default function Command() {
  const [text, setText] = useState<string>("");
  const [mattr, setMATTR] = useState<number>(1);
  const [wordCount, setWordCount] = useState<number>(0);

  useEffect(() => {
    async function pasteFromClipboard() {
      try {
        const clipboardText = await Clipboard.readText();
        if (clipboardText) {
          setText(sanitizeText(clipboardText));
        }
      } catch (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to read clipboard",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    pasteFromClipboard();
  }, []);

  useEffect(() => {
    const words = tokenize(text);
    setWordCount(words.length);
    setMATTR(words.length > 0 ? calculateMATTR(words, 100) : 1);
  }, [text]);

  return (
    <Form>
      <Form.Description
        text={`${mattr.toFixed(2)} MATTR-100 score (0.8 typical)\n${wordCount} words${wordCount < 150 ? " (may be inaccurate with <150 words)" : ""}`}
      />
      <Form.TextArea
        id="text"
        title="Text"
        placeholder="Paste your text here..."
        value={text}
        onChange={(newText) => setText(sanitizeText(newText))}
        enableMarkdown={false}
      />
    </Form>
  );
}
