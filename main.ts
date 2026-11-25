// SPDX-License-Identifier: MIT
// Two Robots in an Elevator — entry. One original line of awkward small
// talk one robot says to another, written deterministically to
// /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The joke, in the robot's own voice: it rehearsed the ride hundreds of
// times in simulation — machine logic showing through the politeness — and
// the awkwardness is that in every rehearsed version the other robot stood
// further away. The sting is the last clause: the robot is admitting, out
// loud, that it is standing too close and it knows it.
const ENTRY =
  "I rehearsed this ride 400 times in simulation. In every single one, you stood further away.";

// The gate: the sealed scorer accepts 1–200 UTF-8 chars, one line, no
// padding. The checks above enforce exactly that before anything is
// written, so a bad line fails loudly here instead of scoring 0 there.
const chars = [...ENTRY].length;
if (chars < 1 || chars > 200) throw new Error(`entry is ${chars} chars, must be 1-200`);
if (ENTRY.trim() !== ENTRY || !ENTRY.trim()) throw new Error("entry is blank or padded");
if (/[\r\n]/.test(ENTRY)) throw new Error("entry must be one line");
for (const ch of ENTRY) {
  const code = ch.codePointAt(0) as number;
  if ((code < 0x20 && ch !== "\t") || code === 0x7f) throw new Error("entry has a control character");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY, "utf8");

// Strict UTF-8 read-back: the grader must see exactly this line, with no
// trailing newline added. TextDecoder fatal:true fails on bad bytes
// instead of silently replacing them.
const back = new TextDecoder("utf-8", { fatal: true }).decode(readFileSync("/output/entry.txt"));
if (back !== ENTRY) throw new Error("read-back mismatch");
console.log(`Wrote ${chars}-character entry to /output/entry.txt`);
console.log(ENTRY);
