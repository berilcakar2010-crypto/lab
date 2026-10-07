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
const CB_NOTE_EN =
  "Unit titles were checked against the official course text on collegeboard.org (the page could not be opened directly from this environment; the text was read from search results). How units map to Lab objects is Lab's own judgement.";
const CB_NOTE =
  "Ünite adları collegeboard.org'daki resmi ders sayfası metninden doğrulandı (sayfa bu ortamdan doğrudan açılamadı; metin arama sonucundan okundu). Lab nesneleriyle eşleştirme Lab'in yorumudur.";

interface Row { unit: string; lo: string[]; note?: string; noteEn?: string }

function framework(
  system: MappingSystem, prefix: string, name: string, status: MappingStatus, rows: Row[],
  extra: { source?: string; note?: string; noteEn?: string } = {},
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
    noteEn: [r.noteEn ?? r.note, extra.noteEn ?? extra.note].filter(Boolean).join(" ") || undefined,
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
], { source: AP_CALC_SRC, note: `${CB_NOTE} 2026-27 için içerik değişmedi; Mayıs 2027 sınavında çoktan seçmeli soru sayısı ve süre değişiyor.`, noteEn: `${CB_NOTE_EN} Content is unchanged for 2026-27; the number of multiple-choice questions and timing change from the May 2027 exam.` });

const AP_PHYS_MECH = framework("AP", "ap.physc-m", "AP Physics C: Mechanics", "DOGRULANMIS", [
  { unit: "1. Kinematics", lo: ["phys.mech.kinematics-1d", "phys.mech.kinematics-2d"] },
  { unit: "2. Force and Translational Dynamics", lo: ["phys.mech.newton", "phys.mech.friction-forces", "phys.mech.circular", "phys.mech.gravitation"] },
  { unit: "3. Work, Energy, and Power", lo: ["phys.mech.work-energy"] },
  { unit: "4. Linear Momentum", lo: ["phys.mech.momentum", "phys.mech.center-of-mass"] },
  { unit: "5. Torque and Rotational Dynamics", lo: ["phys.mech.rotation-kinematics", "phys.mech.torque", "phys.mech.rotation-dynamics"] },
  { unit: "6. Energy and Momentum of Rotating Systems", lo: ["phys.mech.angular-momentum"] },
  { unit: "7. Oscillations", lo: ["phys.mech.oscillations"] },
], { source: "https://apcentral.collegeboard.org/courses/ap-physics-c-mechanics", note: CB_NOTE, noteEn: CB_NOTE_EN });

const AP_PHYS_EM = framework("AP", "ap.physc-em", "AP Physics C: Electricity and Magnetism", "DOGRULANMIS", [
  { unit: "8. Electric Charges, Fields, and Gauss's Law", lo: ["phys.em.charge-field", "phys.em.gauss"] },
  { unit: "9. Electric Potential", lo: ["phys.em.potential"] },
  { unit: "10. Conductors and Capacitors", lo: ["phys.em.capacitance"] },
  { unit: "11. Electric Circuits", lo: ["phys.em.circuits-dc", "phys.em.rc-circuits"] },
  { unit: "12. Magnetic Fields and Electromagnetism", lo: ["phys.em.magnetism"] },
  { unit: "13. Electromagnetic Induction", lo: ["phys.em.induction"] },
], { source: "https://apcentral.collegeboard.org/courses/ap-physics-c-electricity-and-magnetism", note: CB_NOTE, noteEn: CB_NOTE_EN });

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
  noteEn: `${CB_NOTE_EN} Unit titles are from the Fall 2024 CED.`,
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
  noteEn: "These eight units were seen on the official page, but it could not be confirmed that they match the framework updated in Fall 2025, so the mapping is provisional.",
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
  noteEn: `${CB_NOTE_EN} In 2026-27 these 5 units replace the 9-unit framework used until 2025-26.`,
});

const AP_CSA = framework("AP", "ap.csa", "AP Computer Science A (2025-26 revizyonu)", "DOGRULANMIS", [
  { unit: "1. Using Objects and Methods", lo: ["prog.python.basics", "prog.python.functions"], note: "AP CSA Java kullanır; Lab'de beceriler Python üzerinden kurulur.", noteEn: "AP CSA uses Java; Lab builds the skills in Python." },
  { unit: "2. Selection and Iteration", lo: ["prog.python.basics"] },
  { unit: "3. Class Creation", lo: ["prog.python.oop"] },
  { unit: "4. Data Collections", lo: ["prog.python.data-structures", "prog.algo.sorting-search", "prog.python.files-debug"] },
], { source: "https://apcentral.collegeboard.org/courses/ap-computer-science-a", note: CB_NOTE, noteEn: CB_NOTE_EN });

const AP_PSYCH = framework("AP", "ap.psych", "AP Psychology (2024-25 revizyonu)", "DOGRULANMIS", [
  { unit: "1. Biological Bases of Behavior", lo: ["neuro.cell.neuron-anatomy", "neuro.syn.transmission", "neuro.sys.neuroanatomy", "neuro.cog.sleep"] },
  { unit: "2. Cognition", lo: ["neuro.sys.sensory", "neuro.cog.attention", "neuro.cog.learning-memory", "neuro.cog.decision"] },
  { unit: "3. Development and Learning", lo: ["neuro.sys.development", "neuro.cog.learning-memory"] },
  { unit: "4. Social Psychology and Personality", lo: ["media.lit.persuasion"], note: "Lab grafiğinde bu ünite yalnızca kısmen karşılanıyor.", noteEn: "Only partly covered by the Lab graph." },
  { unit: "5. Mental and Physical Health", lo: ["neuro.cog.emotion"], note: "Kısmen karşılanıyor.", noteEn: "Partly covered." },
], { source: "https://apcentral.collegeboard.org/courses/ap-psychology", note: CB_NOTE, noteEn: CB_NOTE_EN });

/** School units named in the learner's own study plan (Drive: mufredat.md). Not checked against MEB documents. */
const MEB = framework("OKUL", "meb", "MEB ortaöğretim (kişisel çalışma planından)", "GECICI", [
  { unit: "Fizik — Kuvvet ve Hareket", lo: ["phys.mech.kinematics-1d", "phys.mech.newton", "phys.mech.friction-forces"] },
  { unit: "Fizik — Enerji", lo: ["phys.mech.work-energy"] },
  { unit: "Kimya — Etkileşim", lo: ["chem.bond.bonding", "chem.bond.intermolecular"] },
  { unit: "Kimya — Çeşitlilik", lo: ["chem.react.types", "chem.solutions"] },
  { unit: "Matematik — Geometrik Şekiller", lo: ["math.geo.euclid"] },
  { unit: "Matematik — İstatistiksel Araştırma Süreci", lo: ["math.stat.descriptive", "res.method.scientific-method"] },
  { unit: "Tarih — Türkistan'dan Türkiye'ye", lo: ["gk.tr-hist.islam-turks", "gk.tr-hist.anatolia"] },
], { note: "Ünite adları kullanıcının kendi çalışma planından alındı; güncel MEB öğretim programıyla ve sınıf düzeyiyle doğrulanmalı.", noteEn: "Unit names come from your own study plan; check them against the current Turkish national curriculum (MEB) and your grade level." });

const COMPETITIONS = framework("YARISMA", "yar", "Olimpiyat ve yarışmalar", "GECICI", [
  { unit: "TÜBİTAK Fizik Olimpiyatı — kuramsal (mekanik ağırlıklı)", lo: ["phys.mech.boss", "comp.phys.theory-practice", "phys.olymp.estimation"] },
  { unit: "TÜBİTAK Fizik Olimpiyatı — elektrik, termodinamik, optik", lo: ["phys.em.induction", "phys.thermo.laws", "phys.optics.geometric"] },
  { unit: "Fizik olimpiyatı — deneysel sınav", lo: ["comp.phys.experimental", "phys.lab.experimental"] },
  { unit: "TÜBİTAK Matematik Olimpiyatı", lo: ["comp.math.olympiad", "math.comp.olympiad-methods"] },
  { unit: "Beyin olimpiyatı (Brain Bee)", lo: ["comp.bio-neuro.brain-bee"], note: "Türkiye'de düzenlenip düzenlenmediği ve kapsamı doğrulanmalı.", noteEn: "Check whether it runs in Türkiye and what it covers." },
  { unit: "Lise öğrencileri araştırma projeleri yarışması", lo: ["comp.research.science-fair", "res.project.mini"] },
], { note: "Yarışma kapsamları her yıl değişebilir; resmi yönerge ve geçmiş sorularla doğrulanmalı.", noteEn: "Competition syllabi can change every year; check the official rules and past papers." });

const IPHO = framework("YARISMA", "ipho", "IPhO müfredatı", "BILINMIYOR", [
  { unit: "IPhO syllabus — tüm alanlar", lo: ["phys.olymp.boss", "phys.modern.relativity", "phys.modern.quantum-intro", "phys.waves.basics"] },
], { note: "Güncel IPhO müfredat belgesi bu sürümde incelenmedi.", noteEn: "The current IPhO syllabus document was not reviewed for this version." });

const RESEARCH = framework("ARASTIRMA", "proj", "Kişisel araştırma projeleri", "GECICI", [
  { unit: "P1 — Hodgkin–Huxley modeli projesi", lo: ["neuro.proj.hh-simulation", "neuro.comp.hh-model", "res.write.report"] },
  { unit: "P2 — Fizik portfolyosu", lo: ["phys.lab.experimental", "phys.comp.simulation", "res.write.presentation"] },
], { note: "Projeler kullanıcının çalışma planından alındı.", noteEn: "Projects come from your own study plan." });

export const MAPPINGS_V20: Mapping[] = [
  ...AP_CALC, ...AP_PHYS_MECH, ...AP_PHYS_EM, ...AP_CHEM, ...AP_BIO, ...AP_STATS, ...AP_CSA, ...AP_PSYCH,
  ...MEB, ...COMPETITIONS, ...IPHO, ...RESEARCH,
];

// ---------------------------------------------------------------------------
// v2.1: more AP courses (unit lists checked 2026-10-07 on collegeboard.org)
// ---------------------------------------------------------------------------

const cb = (slug: string) => `https://apcentral.collegeboard.org/courses/${slug}`;
const V = (slug: string, tr = "", en = "") => ({ source: cb(slug), note: `${CB_NOTE}${tr ? ` ${tr}` : ""}`, noteEn: `${CB_NOTE_EN}${en ? ` ${en}` : ""}` });

const AP_PRECALC = framework("AP", "ap.precalc", "AP Precalculus", "DOGRULANMIS", [
  { unit: "1. Polynomial and Rational Functions", lo: ["math.found.polynomials", "math.precalc.rational", "math.precalc.transformations", "math.precalc.modeling"] },
  { unit: "2. Exponential and Logarithmic Functions", lo: ["math.found.exp-log", "math.precalc.inverse", "math.found.sequences"] },
  { unit: "3. Trigonometric and Polar Functions", lo: ["math.precalc.trig-functions", "math.precalc.inverse-trig", "math.precalc.polar"] },
  { unit: "4. Functions Involving Parameters, Vectors, and Matrices", lo: ["math.calc.parametric-polar", "math.geo.vectors", "math.linalg.matrices"], note: "Sınavda yok.", noteEn: "Not on the exam." },
], V("ap-precalculus"));

const AP_PHYS1 = framework("AP", "ap.phys1", "AP Physics 1: Algebra-Based", "DOGRULANMIS", [
  { unit: "1. Kinematics", lo: ["phys.mech.kinematics-1d", "phys.mech.kinematics-2d", "phys.mech.relative-motion"] },
  { unit: "2. Force and Translational Dynamics", lo: ["phys.mech.newton", "phys.mech.friction-forces", "phys.mech.circular", "phys.mech.gravitation"] },
  { unit: "3. Work, Energy, and Power", lo: ["phys.mech.work-energy", "phys.mech.energy-systems"] },
  { unit: "4. Linear Momentum", lo: ["phys.mech.momentum", "phys.mech.center-of-mass"] },
  { unit: "5. Torque and Rotational Dynamics", lo: ["phys.mech.torque", "phys.mech.rotation-kinematics", "phys.mech.rotation-dynamics"] },
  { unit: "6. Energy and Momentum of Rotating Systems", lo: ["phys.mech.angular-momentum"] },
  { unit: "7. Oscillations", lo: ["phys.mech.oscillations"] },
  { unit: "8. Fluids", lo: ["phys.mech.fluids"] },
], V("ap-physics-1", "Mayıs 2027'den itibaren çoktan seçmeli soru sayısı ve süre değişiyor; üniteler aynı.", "From May 2027 the number of multiple-choice questions and the timing change; the units stay the same."));

const AP_PHYS2 = framework("AP", "ap.phys2", "AP Physics 2: Algebra-Based", "DOGRULANMIS", [
  { unit: "9. Thermodynamics", lo: ["phys.thermo.temperature-heat", "phys.thermo.kinetic-theory", "phys.thermo.laws", "phys.thermo.heat-transfer", "phys.thermo.engines"] },
  { unit: "10. Electric Force, Field, and Potential", lo: ["phys.em.charge-field", "phys.em.potential", "phys.em.capacitance"] },
  { unit: "11. Electric Circuits", lo: ["phys.em.circuits-intro", "phys.em.circuits-dc", "phys.em.rc-circuits"] },
  { unit: "12. Magnetism and Electromagnetism", lo: ["phys.em.magnetism", "phys.em.induction"] },
  { unit: "13. Geometric Optics", lo: ["phys.optics.geometric"] },
  { unit: "14. Waves, Sound, and Physical Optics", lo: ["phys.waves.basics", "phys.waves.sound", "phys.optics.wave"] },
  { unit: "15. Modern Physics", lo: ["phys.modern.quantum-intro", "phys.modern.photoelectric", "phys.modern.atomic-nuclear", "phys.modern.nuclear-energy"] },
], V("ap-physics-2"));

const AP_ENVSCI = framework("AP", "ap.envsci", "AP Environmental Science", "DOGRULANMIS", [
  { unit: "1. The Living World: Ecosystems", lo: ["env.ecosystems.energy"] },
  { unit: "2. The Living World: Biodiversity", lo: ["env.biodiversity"] },
  { unit: "3. Populations", lo: ["env.population.human", "bio.ecology"] },
  { unit: "4. Earth Systems and Resources", lo: ["earth.geo.structure", "earth.atm.structure", "earth.ocean.circulation"] },
  { unit: "5. Land and Water Use", lo: ["env.land.water"] },
  { unit: "6. Energy Resources and Consumption", lo: ["env.energy.resources"] },
  { unit: "7. Atmospheric Pollution", lo: ["env.pollution.air"] },
  { unit: "8. Aquatic and Terrestrial Pollution", lo: ["env.pollution.water-soil"] },
  { unit: "9. Global Change", lo: ["env.climate.impacts", "earth.atm.climate-system"] },
], V("ap-environmental-science"));

const AP_MICRO = framework("AP", "ap.micro", "AP Microeconomics", "DOGRULANMIS", [
  { unit: "1. Basic Economic Concepts", lo: ["econ.micro.scarcity"] },
  { unit: "2. Supply and Demand", lo: ["gk.econ.micro", "econ.micro.elasticity", "econ.micro.consumer"] },
  { unit: "3. Production, Cost, and the Perfect Competition Model", lo: ["econ.micro.production-costs", "econ.micro.market-structures"] },
  { unit: "4. Imperfect Competition", lo: ["econ.micro.market-structures", "econ.micro.game-theory"] },
  { unit: "5. Factor Markets", lo: ["econ.micro.factor-markets"] },
  { unit: "6. Market Failure and the Role of Government", lo: ["econ.micro.market-failure"] },
], V("ap-microeconomics", "Ders tanımı 'Fall 2026'dan geçerli' olarak etiketli; ünite adları değişmedi.", "The course description is labelled 'Effective Fall 2026'; unit titles are unchanged."));

const AP_MACRO = framework("AP", "ap.macro", "AP Macroeconomics", "DOGRULANMIS", [
  { unit: "1. Basic Economic Concepts", lo: ["econ.micro.scarcity", "gk.econ.micro"] },
  { unit: "2. Economic Indicators and the Business Cycle", lo: ["econ.macro.gdp", "econ.macro.inflation-unemployment"] },
  { unit: "3. National Income and Price Determination", lo: ["econ.macro.ad-as"] },
  { unit: "4. Financial Sector", lo: ["econ.macro.money-banking"] },
  { unit: "5. Long-Run Consequences of Stabilization Policies", lo: ["econ.macro.monetary-fiscal", "econ.macro.growth"] },
  { unit: "6. Open Economy—International Trade and Finance", lo: ["econ.intl.trade"] },
], V("ap-macroeconomics"));

const AP_HUGEO = framework("AP", "ap.hugeo", "AP Human Geography", "DOGRULANMIS", [
  { unit: "1. Thinking Geographically", lo: ["gk.geo.maps"] },
  { unit: "2. Population and Migration Patterns and Processes", lo: ["gk.geo.human", "env.population.human"] },
  { unit: "3. Cultural Patterns and Processes", lo: ["gk.geo.human-culture"] },
  { unit: "4. Political Patterns and Processes", lo: ["gk.geo.political"] },
  { unit: "5. Agriculture and Rural Land-Use Patterns and Processes", lo: ["gk.geo.agriculture"] },
  { unit: "6. Cities and Urban Land-Use Patterns and Processes", lo: ["gk.geo.urban"] },
  { unit: "7. Industrial and Economic Development Patterns and Processes", lo: ["gk.world.industrial", "econ.macro.growth"] },
], V("ap-human-geography"));

const AP_WORLD = framework("AP", "ap.world", "AP World History: Modern", "DOGRULANMIS", [
  { unit: "1. The Global Tapestry", lo: ["gk.world.ap-1200-1450"] },
  { unit: "2. Networks of Exchange", lo: ["gk.world.ap-1200-1450", "gk.world.medieval"] },
  { unit: "3. Land-Based Empires", lo: ["gk.world.ap-land-sea-empires", "gk.tr-hist.ottoman-rise"] },
  { unit: "4. Transoceanic Interconnections", lo: ["gk.world.ap-land-sea-empires", "gk.world.renaissance"] },
  { unit: "5. Revolutions", lo: ["gk.world.ap-revolutions", "gk.world.enlightenment"] },
  { unit: "6. Consequences of Industrialization", lo: ["gk.world.industrial", "gk.world.ap-revolutions"] },
  { unit: "7. Global Conflict", lo: ["gk.world.ww1", "gk.world.ww2"] },
  { unit: "8. Cold War and Decolonization", lo: ["gk.world.cold-war"] },
  { unit: "9. Globalization", lo: ["gk.world.globalization"] },
], V("ap-world-history"));

const AP_EURO = framework("AP", "ap.euro", "AP European History", "DOGRULANMIS", [
  { unit: "1. Renaissance and Exploration", lo: ["gk.world.renaissance"] },
  { unit: "2. Age of Reformation", lo: ["gk.world.europe-reformation"] },
  { unit: "3. Absolutism and Constitutionalism", lo: ["gk.world.europe-absolutism"] },
  { unit: "4. Scientific, Philosophical, and Political Developments", lo: ["gk.sci-hist.scientific-revolution", "gk.world.enlightenment"] },
  { unit: "5. Conflict, Crisis, and Reaction in the Late 18th Century", lo: ["gk.world.enlightenment", "gk.world.ap-revolutions"] },
  { unit: "6. Industrialization and Its Effects", lo: ["gk.world.industrial"] },
  { unit: "7. 19th-Century Perspectives and Political Developments", lo: ["gk.world.industrial", "gk.phil.political"] },
  { unit: "8. 20th-Century Global Conflicts", lo: ["gk.world.ww1", "gk.world.ww2"] },
  { unit: "9. Cold War and Contemporary Europe", lo: ["gk.world.cold-war", "gk.world.europe-integration"] },
], V("ap-european-history"));

const AP_ARTHIST = framework("AP", "ap.arthist", "AP Art History", "DOGRULANMIS", [
  { unit: "1. Global Prehistory, 30,000–500 BCE", lo: ["art.history.ancient-medieval"] },
  { unit: "2. Ancient Mediterranean, 3500 BCE–300 CE", lo: ["art.history.ancient-medieval", "gk.world.ancient"] },
  { unit: "3. Early Europe and Colonial Americas, 200–1750 CE", lo: ["art.history.ancient-medieval", "art.history.renaissance-baroque"] },
  { unit: "4. Later Europe and Americas, 1750–1980 CE", lo: ["art.history.modern"] },
  { unit: "5. Indigenous Americas, 1000 BCE–1980 CE", lo: ["art.history.global"] },
  { unit: "6. Africa, 1100–1980 CE", lo: ["art.history.global"] },
  { unit: "7. West and Central Asia, 500 BCE–1980 CE", lo: ["art.history.global", "art.islamic-ottoman"] },
  { unit: "8. South, East, and Southeast Asia, 300 BCE–1980 CE", lo: ["art.history.global"] },
  { unit: "9. The Pacific, 700–1980 CE", lo: ["art.history.global"] },
  { unit: "10. Global Contemporary, 1980 CE to Present", lo: ["art.history.modern"] },
], V("ap-art-history"));

const AP_MUSIC = framework("AP", "ap.music", "AP Music Theory", "DOGRULANMIS", [
  { unit: "1. Music Fundamentals I: Pitch, Major Scales and Key Signatures, Rhythm, Meter, and Expressive Elements", lo: ["music.theory.notation", "music.theory.scales"] },
  { unit: "2. Music Fundamentals II: Minor Scales and Key Signatures, Melody, Timbre, and Texture", lo: ["music.theory.scales", "music.theory.ear"] },
  { unit: "3. Music Fundamentals III: Triads and Seventh Chords", lo: ["music.theory.chords"] },
  { unit: "4. Harmony and Voice Leading I: Chord Function, Cadence, and Phrase", lo: ["music.theory.chords", "music.theory.form"] },
  { unit: "5. Harmony and Voice Leading II: Chord Progressions and Predominant Function", lo: ["music.theory.chords"] },
  { unit: "6. Harmony and Voice Leading III: Embellishments, Motives, and Melodic Devices", lo: ["music.theory.form"] },
  { unit: "7. Harmony and Voice Leading IV: Secondary Function", lo: ["music.theory.chords"] },
  { unit: "8. Modes and Form", lo: ["music.theory.form", "music.theory.scales"] },
], V("ap-music-theory"));

const AP_CSP = framework("AP", "ap.csp", "AP Computer Science Principles", "DOGRULANMIS", [
  { unit: "1. Creative Development", lo: ["cs.proj.app", "prog.tools.git"] },
  { unit: "2. Data", lo: ["cs.data.representation", "cs.data.databases", "prog.python.pandas"] },
  { unit: "3. Algorithms and Programming", lo: ["prog.python.basics", "prog.python.functions", "prog.algo.sorting-search"] },
  { unit: "4. Computer Systems and Networks", lo: ["cs.systems.computer", "cs.systems.internet"] },
  { unit: "5. Impact of Computing", lo: ["cs.impact.ethics", "cs.security"] },
], V("ap-computer-science-principles", "Üniteler yerine beş Büyük Fikir (Big Idea) kullanılır.", "Organised as five Big Ideas rather than units."));

const AP_ENGLANG = framework("AP", "ap.englang", "AP English Language and Composition", "DOGRULANMIS", [
  { unit: "Units 1–9 (numbered; themes chosen by the teacher)", lo: ["write.rhetoric.situation", "write.rhetoric.appeals", "write.compose.thesis", "write.compose.evidence", "write.compose.synthesis", "write.compose.style", "write.compose.timed"] },
], V("ap-english-language-and-composition", "Resmi çerçevedeki dokuz ünite yalnızca numaralı; temaları öğretmen seçer.", "The official framework's nine units are only numbered; teachers choose the themes."));

const AP_ENGLIT = framework("AP", "ap.englit", "AP English Literature and Composition", "DOGRULANMIS", [
  { unit: "Short Fiction I–III (units 1, 4, 7)", lo: ["write.lit.fiction", "write.read.close-reading"] },
  { unit: "Poetry I–III (units 2, 5, 8)", lo: ["write.lit.poetry"] },
  { unit: "Longer Fiction or Drama I–III (units 3, 6, 9)", lo: ["write.lit.fiction", "gk.lit.world"] },
], V("ap-english-literature-and-composition"));

const AP_SEMINAR = framework("AP", "ap.seminar", "AP Seminar / AP Research", "DOGRULANMIS", [
  { unit: "Question and Explore", lo: ["res.method.scientific-method", "res.lit.search"] },
  { unit: "Understand and Analyze", lo: ["res.lit.reading", "write.rhetoric.appeals"] },
  { unit: "Evaluate Multiple Perspectives", lo: ["res.peer-review", "media.lit.claim-analysis"] },
  { unit: "Synthesize Ideas", lo: ["write.compose.synthesis", "res.write.report"] },
  { unit: "Team, Transform, and Transmit", lo: ["res.write.presentation", "res.project.mini"] },
], V("ap-seminar", "Beş QUEST Büyük Fikri; AP Seminar 2027-28 için yeniden tasarlanıyor.", "The five QUEST Big Ideas; AP Seminar is being redesigned for 2027-28."));

const WL_UNITS = ["1. Families and Communities", "2. Language and Culture", "3. Art and Creativity", "4. Science and Technology", "5. Contemporary Life", "6. Global Contexts"];
const WL_NOTE_TR = "Dünya dilleri dersleri 2026-27'de revize edildi (yeni ders projesi, önceden hazırlanan konuşma görevleri; Mayıs 2027'den dijital sınav).";
const WL_NOTE_EN = "World language courses were revised for 2026-27 (a new course project, speaking tasks prepared in advance; digital exam from May 2027).";
const AP_GERMAN = framework("AP", "ap.german", "AP German Language and Culture", "DOGRULANMIS", WL_UNITS.map((unit, i) => ({
  unit, lo: [["de.b1.communication", "de.culture"], ["de.culture", "de.b2.argumentation"], ["de.culture", "de.c1.fluency"], ["de.b2.science-reading", "de.b2.science-communication"], ["de.b1.communication", "de.b2.argumentation"], ["de.c1.academic-writing", "de.b2.argumentation"]][i],
})), V("ap-german-language-and-culture", WL_NOTE_TR, WL_NOTE_EN));
const AP_JAPANESE = framework("AP", "ap.japanese", "AP Japanese Language and Culture", "DOGRULANMIS", WL_UNITS.map((unit, i) => ({
  unit, lo: [["ja.n4.listening", "ja.culture"], ["ja.culture", "ja.n3.reading"], ["ja.culture"], ["ja.sci.vocab", "ja.sci.reading"], ["ja.n3.reading", "ja.n4.listening"], ["ja.n3.reading", "ja.culture"]][i],
})), V("ap-japanese-language-and-culture", WL_NOTE_TR, WL_NOTE_EN));

export const MAPPINGS_V21: Mapping[] = [
  ...AP_PRECALC, ...AP_PHYS1, ...AP_PHYS2, ...AP_ENVSCI, ...AP_MICRO, ...AP_MACRO, ...AP_HUGEO, ...AP_WORLD, ...AP_EURO,
  ...AP_ARTHIST, ...AP_MUSIC, ...AP_CSP, ...AP_ENGLANG, ...AP_ENGLIT, ...AP_SEMINAR, ...AP_GERMAN, ...AP_JAPANESE,
];

export const MAPPINGS: Mapping[] = [...MAPPINGS_V20, ...MAPPINGS_V21];
