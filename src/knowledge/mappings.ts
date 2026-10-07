/**
 * Mapping layer: school, AP, competition and research frameworks → graph
 * objects. Kept apart from the graph because frameworks change on their own
 * schedule. Every mapping carries a status:
 *   DOGRULANMIS — the framework's unit list was checked against an official source (see `source`).
 *   GECICI      — plausible but not checked against the current official document.
 *   BILINMIYOR  — the framework's content is not known; the mapping is a placeholder.
 * The LO correspondences themselves are Lab's judgement; "doğrulanmış" refers to
 * the framework's units, never to a claim about any exam's questions.
 */
import type { Mapping, MappingStatus, MappingSystem } from "./schema";

const CHECKED = "2026-10-07";
const CB_NOTE =
  "Ünite adları collegeboard.org'daki resmi ders sayfası metninden doğrulandı (sayfa bu ortamdan doğrudan açılamadı; metin arama sonucundan okundu). Lab nesneleriyle eşleştirme Lab'in yorumudur.";

interface Row { unit: string; lo: string[]; note?: string }

function framework(
  system: MappingSystem, prefix: string, name: string, status: MappingStatus, rows: Row[],
  extra: { source?: string; note?: string } = {},
): Mapping[] {
  return rows.map((r, i) => ({
    id: `${prefix}.${String(i + 1).padStart(2, "0")}`,
    system,
    framework: name,
    unit: r.unit,
    loIds: r.lo,
    status,
    source: extra.source,
    checkedAt: status === "DOGRULANMIS" ? CHECKED : undefined,
    note: [r.note, extra.note].filter(Boolean).join(" ") || undefined,
  }));
}

const AP_CALC_SRC = "https://apcentral.collegeboard.org/courses/ap-calculus-bc";
const AP_CALC = framework("AP", "ap.calc", "AP Calculus AB/BC", "DOGRULANMIS", [
  { unit: "1. Limits and Continuity", lo: ["math.calc.limits"] },
  { unit: "2. Differentiation: Definition and Fundamental Properties", lo: ["math.calc.derivative-def", "math.calc.diff-rules"] },
  { unit: "3. Differentiation: Composite, Implicit, and Inverse Functions", lo: ["math.calc.diff-rules", "math.calc.implicit"] },
  { unit: "4. Contextual Applications of Differentiation", lo: ["math.calc.implicit", "math.calc.applications", "math.calc.lhopital"] },
  { unit: "5. Analytical Applications of Differentiation", lo: ["math.calc.mvt", "math.calc.applications"] },
  { unit: "6. Integration and Accumulation of Change", lo: ["math.calc.integral-def", "math.calc.ftc", "math.calc.integration-tech"] },
  { unit: "7. Differential Equations", lo: ["math.ode.first-order"] },
  { unit: "8. Applications of Integration", lo: ["math.calc.integral-apps"] },
  { unit: "9. Parametric Equations, Polar Coordinates, and Vector-Valued Functions (yalnızca BC)", lo: ["math.calc.parametric-polar"] },
  { unit: "10. Infinite Sequences and Series (yalnızca BC)", lo: ["math.calc.series", "math.calc.taylor"] },
], { source: AP_CALC_SRC, note: `${CB_NOTE} 2026-27 için içerik değişmedi; Mayıs 2027 sınavında çoktan seçmeli soru sayısı ve süre değişiyor.` });

const AP_PHYS_MECH = framework("AP", "ap.physc-m", "AP Physics C: Mechanics", "DOGRULANMIS", [
  { unit: "1. Kinematics", lo: ["phys.mech.kinematics-1d", "phys.mech.kinematics-2d"] },
  { unit: "2. Force and Translational Dynamics", lo: ["phys.mech.newton", "phys.mech.friction-forces", "phys.mech.circular", "phys.mech.gravitation"] },
  { unit: "3. Work, Energy, and Power", lo: ["phys.mech.work-energy"] },
  { unit: "4. Linear Momentum", lo: ["phys.mech.momentum", "phys.mech.center-of-mass"] },
  { unit: "5. Torque and Rotational Dynamics", lo: ["phys.mech.rotation-kinematics", "phys.mech.torque", "phys.mech.rotation-dynamics"] },
  { unit: "6. Energy and Momentum of Rotating Systems", lo: ["phys.mech.angular-momentum"] },
  { unit: "7. Oscillations", lo: ["phys.mech.oscillations"] },
], { source: "https://apcentral.collegeboard.org/courses/ap-physics-c-mechanics", note: CB_NOTE });

const AP_PHYS_EM = framework("AP", "ap.physc-em", "AP Physics C: Electricity and Magnetism", "DOGRULANMIS", [
  { unit: "8. Electric Charges, Fields, and Gauss's Law", lo: ["phys.em.charge-field", "phys.em.gauss"] },
  { unit: "9. Electric Potential", lo: ["phys.em.potential"] },
  { unit: "10. Conductors and Capacitors", lo: ["phys.em.capacitance"] },
  { unit: "11. Electric Circuits", lo: ["phys.em.circuits-dc", "phys.em.rc-circuits"] },
  { unit: "12. Magnetic Fields and Electromagnetism", lo: ["phys.em.magnetism"] },
  { unit: "13. Electromagnetic Induction", lo: ["phys.em.induction"] },
], { source: "https://apcentral.collegeboard.org/courses/ap-physics-c-electricity-and-magnetism", note: CB_NOTE });

const AP_CHEM = framework("AP", "ap.chem", "AP Chemistry", "DOGRULANMIS", [
  { unit: "1. Atomic Structure and Properties", lo: ["chem.atoms.structure", "chem.atoms.electron-config", "chem.stoich.mole"] },
  { unit: "2. Molecular and Ionic Compound Structure and Properties", lo: ["chem.bond.bonding"] },
  { unit: "3. Intermolecular Forces and Properties", lo: ["chem.bond.intermolecular", "chem.gas.laws", "chem.solutions"] },
  { unit: "4. Chemical Reactions", lo: ["chem.react.types"] },
  { unit: "5. Kinetics", lo: ["chem.kinetics"] },
  { unit: "6. Thermodynamics", lo: ["chem.thermo.thermochemistry"] },
  { unit: "7. Equilibrium", lo: ["chem.equilibrium"] },
  { unit: "8. Acids and Bases", lo: ["chem.acid-base"] },
  { unit: "9. Applications of Thermodynamics", lo: ["chem.thermo.gibbs", "chem.redox-electrochem"] },
], {
  source: "https://apcentral.collegeboard.org/courses/ap-chemistry",
  note: `${CB_NOTE} Ünite başlıkları Fall 2024 CED'den alındı.`,
});

const AP_BIO = framework("AP", "ap.bio", "AP Biology", "GECICI", [
  { unit: "1. Chemistry of Life", lo: ["bio.molecules"] },
  { unit: "2. Cells", lo: ["bio.cell.structure", "bio.cell.membrane"] },
  { unit: "3. Cellular Energetics", lo: ["bio.enzymes", "bio.energy.respiration", "bio.energy.photosynthesis"] },
  { unit: "4. Cell Communication and Cell Cycle", lo: ["bio.cell.signaling", "bio.cell.division"] },
  { unit: "5. Heredity", lo: ["bio.genetics.mendel"] },
  { unit: "6. Gene Expression and Regulation", lo: ["bio.genetics.molecular", "bio.genetics.regulation"] },
  { unit: "7. Natural Selection", lo: ["bio.evolution", "bio.evolution.popgen"] },
  { unit: "8. Ecology", lo: ["bio.ecology"] },
], {
  source: "https://apcentral.collegeboard.org/courses/ap-biology",
  note: "Bu sekiz ünite resmi sayfada görüldü, ancak Fall 2025'te güncellenen çerçevenin ünite adlarıyla birebir aynı olduğu doğrulanamadı. Bu yüzden geçici.",
});

const AP_STATS = framework("AP", "ap.stats", "AP Statistics (2026-27 revizyonu)", "DOGRULANMIS", [
  { unit: "1. Exploring One-Variable Data and Collecting Data", lo: ["math.stat.descriptive", "res.method.experimental-design"] },
  { unit: "2. Probability, Random Variables, and Probability Distributions", lo: ["math.prob.basics", "math.prob.random-vars", "math.prob.distributions", "math.prob.limit-theorems"] },
  { unit: "3. Inference for Categorical Data: Proportions", lo: ["math.stat.inference"] },
  { unit: "4. Inference for Quantitative Data: Means", lo: ["math.stat.inference"] },
  { unit: "5. Regression Analysis", lo: ["math.stat.regression"] },
], {
  source: "https://apcentral.collegeboard.org/courses/ap-statistics/future-revisions",
  note: `${CB_NOTE} 2025-26'ya kadar geçerli olan 9 üniteli eski çerçevenin yerini 2026-27'de bu 5 ünite aldı.`,
});

const AP_CSA = framework("AP", "ap.csa", "AP Computer Science A (2025-26 revizyonu)", "DOGRULANMIS", [
  { unit: "1. Using Objects and Methods", lo: ["prog.python.basics", "prog.python.functions"], note: "AP CSA Java kullanır; Lab'de beceriler Python üzerinden kurulur." },
  { unit: "2. Selection and Iteration", lo: ["prog.python.basics"] },
  { unit: "3. Class Creation", lo: ["prog.python.oop"] },
  { unit: "4. Data Collections", lo: ["prog.python.data-structures", "prog.algo.sorting-search", "prog.python.files-debug"] },
], { source: "https://apcentral.collegeboard.org/courses/ap-computer-science-a", note: CB_NOTE });

const AP_PSYCH = framework("AP", "ap.psych", "AP Psychology (2024-25 revizyonu)", "DOGRULANMIS", [
  { unit: "1. Biological Bases of Behavior", lo: ["neuro.cell.neuron-anatomy", "neuro.syn.transmission", "neuro.sys.neuroanatomy", "neuro.cog.sleep"] },
  { unit: "2. Cognition", lo: ["neuro.sys.sensory", "neuro.cog.attention", "neuro.cog.learning-memory", "neuro.cog.decision"] },
  { unit: "3. Development and Learning", lo: ["neuro.sys.development", "neuro.cog.learning-memory"] },
  { unit: "4. Social Psychology and Personality", lo: ["media.lit.persuasion"], note: "Lab grafiğinde bu ünite yalnızca kısmen karşılanıyor." },
  { unit: "5. Mental and Physical Health", lo: ["neuro.cog.emotion"], note: "Kısmen karşılanıyor." },
], { source: "https://apcentral.collegeboard.org/courses/ap-psychology", note: CB_NOTE });

/** School units named in the learner's own study plan (Drive: mufredat.md). Not checked against MEB documents. */
const MEB = framework("OKUL", "meb", "MEB ortaöğretim (kişisel çalışma planından)", "GECICI", [
  { unit: "Fizik — Kuvvet ve Hareket", lo: ["phys.mech.kinematics-1d", "phys.mech.newton", "phys.mech.friction-forces"] },
  { unit: "Fizik — Enerji", lo: ["phys.mech.work-energy"] },
  { unit: "Kimya — Etkileşim", lo: ["chem.bond.bonding", "chem.bond.intermolecular"] },
  { unit: "Kimya — Çeşitlilik", lo: ["chem.react.types", "chem.solutions"] },
  { unit: "Matematik — Geometrik Şekiller", lo: ["math.geo.euclid"] },
  { unit: "Matematik — İstatistiksel Araştırma Süreci", lo: ["math.stat.descriptive", "res.method.scientific-method"] },
  { unit: "Tarih — Türkistan'dan Türkiye'ye", lo: ["gk.tr-hist.islam-turks", "gk.tr-hist.anatolia"] },
], { note: "Ünite adları kullanıcının kendi çalışma planından alındı; güncel MEB öğretim programıyla ve sınıf düzeyiyle doğrulanmalı." });

const COMPETITIONS = framework("YARISMA", "yar", "Olimpiyat ve yarışmalar", "GECICI", [
  { unit: "TÜBİTAK Fizik Olimpiyatı — kuramsal (mekanik ağırlıklı)", lo: ["phys.mech.boss", "comp.phys.theory-practice", "phys.olymp.estimation"] },
  { unit: "TÜBİTAK Fizik Olimpiyatı — elektrik, termodinamik, optik", lo: ["phys.em.induction", "phys.thermo.laws", "phys.optics.geometric"] },
  { unit: "Fizik olimpiyatı — deneysel sınav", lo: ["comp.phys.experimental", "phys.lab.experimental"] },
  { unit: "TÜBİTAK Matematik Olimpiyatı", lo: ["comp.math.olympiad", "math.comp.olympiad-methods"] },
  { unit: "Beyin olimpiyatı (Brain Bee)", lo: ["comp.bio-neuro.brain-bee"], note: "Türkiye'de düzenlenip düzenlenmediği ve kapsamı doğrulanmalı." },
  { unit: "Lise öğrencileri araştırma projeleri yarışması", lo: ["comp.research.science-fair", "res.project.mini"] },
], { note: "Yarışma kapsamları her yıl değişebilir; resmi yönerge ve geçmiş sorularla doğrulanmalı." });

const IPHO = framework("YARISMA", "ipho", "IPhO müfredatı", "BILINMIYOR", [
  { unit: "IPhO syllabus — tüm alanlar", lo: ["phys.olymp.boss", "phys.modern.relativity", "phys.modern.quantum-intro", "phys.waves.basics"] },
], { note: "Güncel IPhO müfredat belgesi bu sürümde incelenmedi." });

const RESEARCH = framework("ARASTIRMA", "proj", "Kişisel araştırma projeleri", "GECICI", [
  { unit: "P1 — Hodgkin–Huxley modeli projesi", lo: ["neuro.proj.hh-simulation", "neuro.comp.hh-model", "res.write.report"] },
  { unit: "P2 — Fizik portfolyosu", lo: ["phys.lab.experimental", "phys.comp.simulation", "res.write.presentation"] },
], { note: "Projeler kullanıcının çalışma planından alındı." });

export const MAPPINGS: Mapping[] = [
  ...AP_CALC, ...AP_PHYS_MECH, ...AP_PHYS_EM, ...AP_CHEM, ...AP_BIO, ...AP_STATS, ...AP_CSA, ...AP_PSYCH,
  ...MEB, ...COMPETITIONS, ...IPHO, ...RESEARCH,
];
