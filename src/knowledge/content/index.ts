import type { LearningObject } from "../schema";
import { MATH } from "./math";
import { PHYSICS } from "./physics";
import { CHEMISTRY } from "./chemistry";
import { BIOLOGY } from "./biology";
import { NEURO } from "./neuroscience";
import { PROGRAMMING } from "./programming";
import { RESEARCH } from "./research";
import { COMPETITION } from "./competition";
import { CULTURE } from "./culture";
import { MEDIA } from "./media";
import { ENGLISH, GERMAN, JAPANESE } from "./languages";

/** Canonical content of Lab Müfredatı v2.0, in display order. */
export const BASE_OBJECTS: LearningObject[] = [
  ...MATH, ...PHYSICS, ...CHEMISTRY, ...BIOLOGY, ...NEURO, ...PROGRAMMING, ...RESEARCH, ...COMPETITION,
  ...CULTURE, ...MEDIA, ...ENGLISH, ...GERMAN, ...JAPANESE,
];
