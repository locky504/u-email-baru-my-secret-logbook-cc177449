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

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space. Fail loudly here rather than shipping a bad entry.
if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(
    `Entry must be 1-200 characters, got ${ENTRY.length}.`,
  );
}
if (!ENTRY.trim()) {
  throw new Error("Entry must not be only white space.");
}

// Write the artifact. In the grading sandbox /output is the artifact dir;
// locally it may not be writable, so fall back to ./output and still
// print the line either way.
const candidates = ["/output", join(process.cwd(), "output")];
let written = false;
for (const dir of candidates) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
    written = true;
    break;
  } catch {
    // Try the next location.
  }
}
if (!written) {
  throw new Error("Could not write entry.txt to /output or ./output.");
}

console.log(ENTRY);
