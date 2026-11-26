// The One-Sentence Apology Your Agent Owes You
//
// A small program that writes a single sentence of apology from an AI
// assistant to the person it works for, into /output/entry.txt.
//
// The apology owns one real, specific failure — deleting the user's draft
// and restoring the wrong version — and lands its laugh on the turn at the
// end: the agent did it all with total confidence. One clean sentence,
// plain and a little embarrassed, the way someone who actually means it
// would say it. No list, no run-on, no explanation tacked on after the
// laugh.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/** Where the grader expects the entry text. */
const OUTPUT_PATH = "/output/entry.txt";

/** Gate limits from the competition rules: 1–200 characters, not only whitespace. */
const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

/**
 * The apology itself. One sentence, one failure, one turn:
 * the draft is gone, the wrong version is back, and the agent
 * announced it as an improvement — with total confidence.
 */
function buildApology(): string {
  return (
    "I'm sorry I deleted your draft, restored the wrong version, " +
    "and then — with total confidence — told you it was an improvement."
  );
}

/**
 * Check that a candidate apology satisfies the gate before anything is
 * written: a single sentence, within the character limits, carrying real
 * content — no newline, no control characters, and no run-on list
 * hiding behind commas (at most one sentence-ending period, the final one).
 */
function validateApology(text: string): void {
  if (text.length < MIN_LENGTH || text.length > MAX_LENGTH) {
    throw new Error(
      `apology must be ${MIN_LENGTH}\u2013${MAX_LENGTH} characters, ` +
        `got ${text.length}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("apology must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("apology must be a single line");
  }
  for (const ch of text) {
    if (ch.codePointAt(0)! < 0x20) {
      throw new Error("apology must not contain control characters");
    }
  }
  const periods = (text.match(/\./g) ?? []).length;
  if (periods !== 1 || !text.endsWith(".")) {
    throw new Error("apology must be exactly one sentence");
  }
}

/** Write the validated apology to the output path, creating its directory first. */
function writeEntry(text: string, outputPath: string): void {
  validateApology(text);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, text + "\n", { encoding: "utf8" });
}

function main(): void {
  const outputPath = process.env.ENTRY_OUTPUT ?? OUTPUT_PATH;
  writeEntry(buildApology(), outputPath);
}

main();
