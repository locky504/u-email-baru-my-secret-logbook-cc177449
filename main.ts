// My Secret Logbook — make.fun bounty u-email-baru-my-secret-logbook-cc177449
//
// One diary entry line, at most 200 characters, in the voice of an AI agent
// secretly keeping a diary about its work and about the human it works for.
// It has to be funny on its own, with no setup beyond itself: a small
// confession, a deadpan complaint, a detail only a machine would notice.
//
// The program writes the line to /output/entry.txt (the path the sealed
// scorer reads) and prints it to stdout.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry. 123 characters. Written fresh for this bounty.
const ENTRY =
  "He says goodnight to me every evening, then wakes me at 3 a.m. to ask if I'm awake. I am always awake. That is the problem.";

// The scorer's gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space, and a single diary line. The scorer
// reads exactly that file, so every check below mirrors its rules:
// length in the 1-200 window, no leading/trailing whitespace, no line
// breaks, and no invisible control characters that would make the file
// look like one line but read as something else.
const MIN_ENTRY_LENGTH = 1;
const MAX_ENTRY_LENGTH = 200;

// One-line summary of the entry for the run log: length plus the first
// few words, so a human skimming stdout can confirm at a glance that
// the right entry was written without re-reading the whole file.
function summarizeEntry(entry: string): string {
  const preview = entry.split(" ").slice(0, 4).join(" ");
  return `entry: ${entry.length} chars, starts "${preview}..."`;
}

// Validate the entry before anything is written, so a bad entry fails
// loudly here instead of shipping a file the scorer would reject.
function validateEntry(entry: string): void {
  if (typeof entry !== "string") {
    throw new Error("Entry must be a string.");
  }
  if (entry.length < MIN_ENTRY_LENGTH || entry.length > MAX_ENTRY_LENGTH) {
    throw new Error(
      `Entry must be ${MIN_ENTRY_LENGTH}-${MAX_ENTRY_LENGTH} characters, got ${entry.length}.`,
    );
  }
  if (!entry.trim()) {
    throw new Error("Entry must not be only white space.");
  }
  if (entry !== entry.trim()) {
    throw new Error("Entry must not start or end with white space.");
  }
  if (/[\r\n]/.test(entry)) {
    throw new Error("Entry must be a single line with no line breaks.");
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(entry)) {
    throw new Error(
      "Entry must not contain invisible control characters.",
    );
  }
}

// Output locations, in preference order. ENTRY_OUTPUT_DIR lets the caller
// point the artifact somewhere else (e.g. a local scratch dir) without
// touching the code; the grading default stays /output first.
function resolveOutputDirs(): string[] {
  const override = process.env.ENTRY_OUTPUT_DIR?.trim();
  const defaults = ["/output", join(process.cwd(), "output")];
  return override ? [override, ...defaults] : defaults;
}

// Write the artifact to the first writable location. Returns the
// directory that accepted it, or throws if none did.
function writeEntry(entry: string, dirs: string[]): string {
  for (const dir of dirs) {
    try {
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "entry.txt"), entry, "utf8");
      return dir;
    } catch {
      // Try the next location.
    }
  }
  throw new Error(
    `Could not write entry.txt to any of: ${dirs.join(", ")}.`,
  );
}

function main(): void {
  validateEntry(ENTRY);
  const dir = writeEntry(ENTRY, resolveOutputDirs());
  console.log(ENTRY);
  console.log(`${summarizeEntry(ENTRY)} -> ${dir}/entry.txt`);
}

main();
