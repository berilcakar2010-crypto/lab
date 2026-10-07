/**
 * Resource layer: books, courses and tools linked many-to-many to graph
 * objects. Resources never define the graph; an object is learnable without
 * any of them, and a resource can serve many objects.
 */
import type { Resource } from "./schema";

const r = (id: string, title: string, kind: Resource["kind"], language: Resource["language"], loIds: string[], extra: Partial<Resource> = {}): Resource =>
  ({ id, title, kind, language, loIds, ...extra });

export const RESOURCES: Resource[] = [
  // Matematik
  r("res.khan-math", "Khan Academy — Matematik", "DERS", "çok", [
    "math.found.algebra", "math.found.functions", "math.trig.basics", "math.calc.limits", "math.calc.derivative-def",
    "math.calc.integral-def", "math.prob.basics", "math.stat.descriptive", "math.linalg.matrices",
  ], { url: "https://www.khanacademy.org", note: "Türkçe arayüz ve altyazı seçenekleri var." }),
  r("res.3b1b-calc", "Essence of Calculus", "VIDEO", "en", ["math.calc.derivative-def", "math.calc.ftc", "math.calc.taylor"], { author: "3Blue1Brown" }),
  r("res.3b1b-linalg", "Essence of Linear Algebra", "VIDEO", "en", ["math.linalg.matrices", "math.linalg.linear-maps", "math.linalg.determinants", "math.linalg.eigen"], { author: "3Blue1Brown" }),
  r("res.strang-linalg", "Introduction to Linear Algebra", "KITAP", "en", ["math.linalg.systems", "math.linalg.vector-spaces", "math.linalg.orthogonality", "math.linalg.svd"], { author: "Gilbert Strang", note: "MIT OCW 18.06 ders videolarıyla birlikte kullanılabilir." }),
  r("res.stewart-calc", "Calculus", "KITAP", "en", ["math.calc.limits", "math.calc.integration-tech", "math.calc.series", "math.calc.multivar", "math.calc.multiple-integrals"], { author: "James Stewart" }),
  r("res.strogatz", "Nonlinear Dynamics and Chaos", "KITAP", "en", ["math.ode.systems", "math.dyn.stability", "math.dyn.bifurcation"], { author: "Steven Strogatz" }),
  r("res.polya", "How to Solve It (Nasıl Çözmeli?)", "KITAP", "çok", ["comp.meta.problem-solving", "math.comp.olympiad-methods"], { author: "George Pólya" }),

  // Fizik
  r("res.morin", "Introduction to Classical Mechanics", "KITAP", "en", ["phys.mech.newton", "phys.mech.momentum", "phys.mech.angular-momentum", "phys.mech.oscillations", "phys.mech.lagrangian"], { author: "David Morin", note: "Olimpiyat düzeyinde problemler." }),
  r("res.hrw", "Fundamentals of Physics", "KITAP", "çok", ["phys.mech.kinematics-1d", "phys.mech.work-energy", "phys.thermo.laws", "phys.em.charge-field", "phys.optics.geometric"], { author: "Halliday, Resnick, Walker" }),
  r("res.purcell", "Electricity and Magnetism", "KITAP", "en", ["phys.em.gauss", "phys.em.potential", "phys.em.magnetism", "phys.em.induction", "phys.em.maxwell"], { author: "Purcell, Morin" }),
  r("res.irodov", "Problems in General Physics", "KITAP", "en", ["comp.phys.theory-practice", "phys.mech.boss"], { author: "I. E. Irodov" }),
  r("res.feynman", "The Feynman Lectures on Physics", "KITAP", "en", ["phys.mech.newton", "phys.waves.basics", "phys.modern.quantum-intro"], { url: "https://www.feynmanlectures.caltech.edu" }),

  // Kimya ve biyoloji
  r("res.campbell", "Campbell Biology", "KITAP", "çok", [
    "bio.cell.structure", "bio.cell.membrane", "bio.energy.respiration", "bio.genetics.molecular", "bio.evolution", "bio.physiology.systems",
  ], { note: "Kullanıcının çalışma planında bölüm bölüm geçiyor." }),
  r("res.openstax-chem", "OpenStax Chemistry 2e", "KITAP", "en", ["chem.atoms.structure", "chem.stoich.mole", "chem.equilibrium", "chem.acid-base", "chem.kinetics"], { url: "https://openstax.org" }),

  // Nörobilim
  r("res.neuronal-dynamics", "Neuronal Dynamics", "KITAP", "en", ["neuro.comp.lif", "neuro.comp.hh-model", "neuro.comp.phase-plane", "neuro.comp.networks", "neuro.comp.hebbian"], { author: "Gerstner, Kistler, Naud, Paninski", url: "https://neuronaldynamics.epfl.ch", note: "Çevrimiçi ücretsiz sürüm ve Python alıştırmaları var." }),
  r("res.dayan-abbott", "Theoretical Neuroscience", "KITAP", "en", ["neuro.comp.neural-coding", "neuro.comp.spike-stats", "neuro.comp.info-theory", "neuro.comp.reinforcement"], { author: "Dayan, Abbott" }),
  r("res.kandel", "Principles of Neural Science", "KITAP", "en", ["neuro.cell.action-potential", "neuro.syn.transmission", "neuro.sys.neuroanatomy", "neuro.cog.learning-memory"], { author: "Kandel ve ark." }),
  r("res.nma", "Neuromatch Academy — Computational Neuroscience", "DERS", "en", ["neuro.comp.lif", "neuro.comp.neural-coding", "neuro.methods.data-analysis", "neuro.comp.reinforcement"], { url: "https://compneuro.neuromatch.io" }),

  // Programlama ve araştırma
  r("res.python-tutorial", "Python Tutorial (resmi)", "SITE", "çok", ["prog.python.basics", "prog.python.functions", "prog.python.data-structures"], { url: "https://docs.python.org/3/tutorial/" }),
  r("res.software-carpentry", "Software Carpentry dersleri", "DERS", "en", ["prog.tools.git", "prog.python.numpy", "prog.tools.reproducible"], { url: "https://software-carpentry.org" }),
  r("res.academic-phrasebank", "Academic Phrasebank", "SITE", "en", ["en.c1.academic-writing", "res.write.report"], { author: "University of Manchester" }),

  // Medya ve diller
  r("res.sift", "SIFT yöntemi (Stop, Investigate, Find, Trace)", "SITE", "en", ["media.lit.source-evaluation", "media.lit.claim-analysis"], { author: "Mike Caulfield" }),
  r("res.teyit", "teyit.org — doğrulama yöntem yazıları", "SITE", "tr", ["media.lit.image-video", "media.lit.claim-analysis"], { note: "Yöntem için kullan; tek tek güncel iddiaları müfredata taşıma." }),
  r("res.goethe", "Goethe-Institut öğrenme materyalleri", "SITE", "de", ["de.a1.basics", "de.a2.everyday", "de.b1.communication", "de.c1.exam"]),
  r("res.genki", "Genki", "KITAP", "ja", ["ja.n5.grammar", "ja.n5.kanji-vocab", "ja.n4.grammar"]),
];
