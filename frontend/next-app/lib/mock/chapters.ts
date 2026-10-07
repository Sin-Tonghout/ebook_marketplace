export interface Chapter {
  id: string;
  title: string; // "Chapter 3" (saved as the reading position label)
  subtitle: string;
  paragraphs: string[];
}

const SUBTITLES = [
  "Where it begins",
  "The shape of things",
  "A slower kind of attention",
  "What we keep",
  "Small changes, long echoes",
  "The last page, the first step",
];

const SENTENCES = [
  "Some ideas arrive quietly, and stay long after louder ones have gone.",
  "It is easy to mistake speed for progress, and busyness for meaning.",
  "The best things are rarely made in a hurry; they are revisited, shaped and trusted.",
  "A page left open on a table can say more than an hour of explanation.",
  "Attention, once given freely, turns out to be the most generous thing we own.",
  "There is a particular calm in finishing a sentence you have been carrying for days.",
  "What we choose to read becomes, slowly, part of how we choose to see.",
  "Nothing here asks to be rushed; each idea waits patiently for its turn.",
  "Morning light moved across the desk while the work, for once, felt enough.",
  "Looking back, the turning point was small: a pause, a question, a decision to stay.",
];

// Deterministic placeholder text: same book always yields the same chapters
export function getChapters(bookId: string): Chapter[] {
  const seed = bookId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  return SUBTITLES.map((subtitle, ci) => ({
    id: `chapter-${ci + 1}`,
    title: `Chapter ${ci + 1}`,
    subtitle,
    paragraphs: Array.from({ length: 7 }, (_, pi) =>
      Array.from({ length: 4 }, (_, si) => SENTENCES[(seed + ci * 3 + pi * 2 + si) % SENTENCES.length]).join(" "),
    ),
  }));
}