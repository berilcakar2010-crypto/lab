import type { LOText } from "../../schema";

export const EN_BIOLOGY_PLUS: Record<string, LOText> = {
  "bio.anatomy.circulatory": {
    title: "The circulatory system",
    description: "Structure of the heart and the cardiac cycle, systemic and pulmonary circulation, types of blood vessel, blood pressure, the components of blood and exchange of materials in the capillaries; a comparison of circulatory systems across vertebrates.",
    whyItMatters: "It explains how oxygen and nutrients reach every cell; it is biology's counterpart to fluid physics, blood-pressure measurement and exercise physiology.",
    entryQuestions: [
      "The wall of the heart's left ventricle is much thicker than the right one. Why? Think about where the blood is going and make a guess.",
      "If the radius of a blood vessel is halved, does the blood flow through it halve, or drop by much more?",
    ],
    coreQuestions: [
      "In what sequence do the valves open and close and the pressures change during the cardiac cycle?",
      "How does the structure of arteries, veins and capillaries fit their functions?",
      "Which forces govern the exchange of fluid and materials in the capillaries?",
    ],
    learningObjectives: [
      "Traces the path of blood through the body on a diagram via the heart chambers, valves and vessels.",
      "Interprets the moments at which the valves open and close on a cardiac-cycle pressure–time graph.",
      "Predicts the effect of a change in vessel radius on flow using a simple flow model.",
      "Compares the circulatory systems of fish, frogs and mammals in terms of efficiency.",
    ],
    commonMisconceptions: [
      "Thinking arteries always carry oxygenated blood and veins always carry deoxygenated blood (the pulmonary vessels are the reverse).",
      "Thinking the blood in veins is actually blue.",
    ],
    competitionApplications: ["Cardiac-cycle graph questions in the Biology Olympiad"],
    links: {
      "phys.mech.fluids": "pressure, flow and vascular resistance",
      "phys.em.circuits-dc": "the circulation–circuit analogy: pressure ↔ voltage, flow ↔ current",
    },
  },
  "bio.anatomy.respiratory": {
    title: "The respiratory system and gas exchange",
    description: "Structure of the airways, the mechanics of breathing, gas exchange by diffusion in the alveoli, partial pressure, the oxygen-binding curve of haemoglobin and the neural control of breathing.",
    whyItMatters: "It explains how the oxygen that cellular respiration needs is supplied; it is a living application of the gas laws and diffusion.",
    entryQuestions: [
      "To breathe in, do you need to 'inflate' your lungs, or to enlarge your chest cavity? Think of a syringe.",
      "At the top of a high mountain the percentage of oxygen in the air is almost the same as at sea level. So why do you end up out of breath?",
    ],
    coreQuestions: [
      "How do pressure differences make breathing in and out happen?",
      "How does the structure of the alveoli maximise the rate of diffusion?",
      "Why is haemoglobin's S-shaped binding curve an advantage for oxygen transport?",
    ],
    learningObjectives: [
      "Explains the volume–pressure relationship in breathing using Boyle's law.",
      "Predicts the effect of alveolar surface area and membrane thickness on gas exchange using Fick's principle of diffusion.",
      "Interprets the oxygen–haemoglobin dissociation curve and explains how pH and temperature shift it.",
    ],
    commonMisconceptions: [
      "Thinking exhaled air is entirely carbon dioxide and inhaled air is entirely oxygen.",
      "Treating breathing (gas exchange) as the same process as cellular respiration.",
      "Thinking the urge to breathe is triggered mainly by low oxygen (CO₂ is usually the deciding factor).",
    ],
    competitionApplications: ["Dissociation-curve and partial-pressure problems in the Biology Olympiad"],
    links: {
      "chem.gas.laws": "Boyle's and Dalton's laws and partial pressure",
      "bio.energy.respiration": "external respiration supplies the oxygen for cellular respiration",
      "earth.atm.structure": "the fall in atmospheric pressure with altitude",
    },
  },
  "bio.anatomy.digestive": {
    title: "Digestion and nutrition",
    description: "Mechanical and chemical digestion, the alimentary canal and accessory organs, digestive enzymes and their conditions, absorption and surface area, macro- and micronutrients, and the hormonal control of digestion.",
    whyItMatters: "It shows how enzyme kinetics and membrane transport work at the level of an organ; it lets you judge nutrition claims on the basis of biochemistry.",
    entryQuestions: [
      "The pH of the stomach is about 2, while the small intestine is alkaline. Does an enzyme that works in the stomach also work in the intestine? Why?",
      "The small intestine is a few metres long, yet its inner surface is said to be about the size of a tennis court. How is that possible?",
    ],
    coreQuestions: [
      "By which enzymes, where, and into which products is each nutrient group digested?",
      "Which structures enlarge the absorptive surface?",
      "How is digestion coordinated by hormones?",
    ],
    learningObjectives: [
      "Organises the digestion of carbohydrates, proteins and fats into a table of enzymes, organs and products.",
      "Interprets the effect of pH and temperature on enzyme activity from experimental data.",
      "Shows by calculation the effect of villi and microvilli on the surface-area-to-volume relationship.",
    ],
    commonMisconceptions: [
      "Thinking most digestion takes place in the stomach.",
      "Thinking bile is an enzyme that chemically breaks down fats (it emulsifies them).",
    ],
    researchApplications: ["A simple experiment measuring the effect of pH on amylase activity"],
    links: {
      "chem.acid-base": "pH, stomach acid and bicarbonate in the intestine",
      "chem.biochem": "hydrolysis of macromolecules",
    },
  },
  "bio.anatomy.excretory": {
    title: "Excretion and osmoregulation",
    description: "Structure of the kidney and the nephron; filtration, reabsorption and secretion; the countercurrent mechanism; water–salt balance through ADH and aldosterone; nitrogenous wastes and osmoregulation in different organisms.",
    whyItMatters: "It is one of the clearest examples of homeostasis, bringing membrane transport, osmosis and feedback loops together in a single organ.",
    entryQuestions: [
      "The kidneys filter about 180 litres of fluid a day, yet only 1–2 litres of urine are produced. Where does the rest go, and why is it filtered in the first place?",
      "A sea fish and a freshwater fish face opposite problems in keeping their water balance. What should each one do?",
    ],
    coreQuestions: [
      "Which substances are transported, and how, in each section of the nephron?",
      "How does the countercurrent mechanism make it possible to produce concentrated urine?",
      "How do hormones regulate water and salt balance through feedback?",
    ],
    learningObjectives: [
      "Locates filtration, reabsorption and secretion along the nephron on a diagram.",
      "Explains the regulation of ADH during dehydration as a negative feedback loop.",
      "Compares the osmoregulation strategies of organisms in different environments using the principle of osmosis.",
    ],
    commonMisconceptions: [
      "Thinking the kidney filters out only wastes, separating the needed substances from the start.",
      "Thinking that drinking a lot of water has no effect at all on the salt concentration of the blood.",
    ],
    competitionApplications: ["Nephron and hormonal-regulation questions in the Biology Olympiad"],
    links: {
      "chem.solutions": "osmotic pressure and concentration",
      "math.ode.first-order": "a simple model of the return to equilibrium through feedback",
    },
  },
  "bio.anatomy.musculoskeletal": {
    title: "The muscular and skeletal systems",
    description: "Bone tissue and joints, the structure of skeletal muscle, the sliding-filament model, excitation–contraction coupling and the role of calcium, types of muscle, and muscle–bone lever systems.",
    whyItMatters: "It links scales from molecular motors to whole-body movement; it is a direct application of the physics of torque and levers in biology.",
    entryQuestions: [
      "The biceps attaches very close to the elbow, so to hold 5 kg in your hand the muscle has to produce a much larger force. Why might evolution have chosen such a 'bad' design?",
      "Muscles can only pull, never push. So how can you both bend and straighten your arm?",
    ],
    coreQuestions: [
      "What happens to the actin and myosin filaments as a sarcomere shortens?",
      "Through which steps does a nerve impulse become a muscle contraction?",
      "What trade-off between force and speed do the levers in the body make?",
    ],
    learningObjectives: [
      "Explains the sliding-filament model on a sarcomere diagram and states the roles of ATP and calcium.",
      "Calculates the force a muscle must produce from torque balance in the forearm lever.",
      "Compares skeletal, smooth and cardiac muscle in terms of structure and control.",
    ],
    commonMisconceptions: [
      "Thinking the filaments themselves shorten when a muscle contracts.",
      "Thinking bones are lifeless, unchanging structures.",
    ],
    links: {
      "phys.mech.torque": "the forearm is a lever and is solved with torque balance",
      "neuro.sys.motor": "motor neurons and the control of movement",
      "neuro.syn.transmission": "acetylcholine transmission at the neuromuscular junction",
    },
  },
  "bio.reproduction": {
    title: "Reproduction and embryonic development",
    description: "Sexual and asexual reproduction, gamete formation, fertilisation, the hormonal regulation of the human reproductive system, the stages of embryonic development (cleavage, gastrulation, organogenesis) and cell differentiation.",
    whyItMatters: "It explains how a complex organism arises from a single cell; cell division, gene regulation and hormones all come together here.",
    entryQuestions: [
      "Every cell in your body carries the same DNA, yet a neuron and a liver cell are very different. How does this difference arise during development?",
      "Asexual reproduction is much faster, so why do so many organisms reproduce sexually? Guess an advantage.",
    ],
    coreQuestions: [
      "What is the advantage of sexual reproduction in terms of genetic diversity?",
      "How are reproductive hormones regulated by feedback loops?",
      "How are cells in an embryo directed towards different fates?",
    ],
    learningObjectives: [
      "Compares spermatogenesis and oogenesis by relating them to meiosis.",
      "Interprets the phases of the cycle and the feedback relationships from a graph of hormone levels.",
      "Sequences the stages of embryonic development and matches the three germ layers formed in gastrulation to their derivatives.",
    ],
    commonMisconceptions: [
      "Thinking cells differentiate because each carries different genes (the same genes are expressed differently).",
      "Thinking sexual reproduction is 'superior' to asexual reproduction in every situation.",
    ],
    links: {
      "psy.development": "prenatal development is the first stage of lifespan development",
      "neuro.sys.development": "embryonic development of the nervous system",
    },
  },
  "bio.plants.structure": {
    title: "Plant structure, transport and growth",
    description: "Tissue structure of the root, stem and leaf; xylem and phloem; the transpiration–cohesion–tension theory and root pressure; the pressure-flow model in phloem; control of stomata; primary and secondary growth.",
    whyItMatters: "It explains how a hundred-metre tree lifts water to its top without a pump; it brings the physics of water potential, capillarity and cohesion together in a living system.",
    entryQuestions: [
      "Even the best vacuum pump cannot lift water higher than about 10 metres. So how does a 100-metre redwood get water to its top?",
      "On a hot, dry, windy day, should a plant keep its stomata open or closed? What does it gain, and what does it lose?",
    ],
    coreQuestions: [
      "By which forces is water carried from the root to the leaf?",
      "How is sugar carried in the phloem from source to sink?",
      "How do stomata manage the trade-off between photosynthesis and water loss?",
    ],
    learningObjectives: [
      "Predicts the direction of water flow from differences in water potential.",
      "Explains the transpiration–cohesion–tension theory in terms of cohesion, adhesion and tension.",
      "Illustrates the pressure-flow model with a source–sink diagram.",
      "Designs an experiment that measures the effect of environmental conditions on the rate of transpiration.",
    ],
    commonMisconceptions: [
      "Thinking water is pushed up a tree mainly by root pressure.",
      "Thinking most of a plant's mass comes from the soil (most of it comes from CO₂ in the air).",
    ],
    researchApplications: ["Measuring transpiration rate with a potometer"],
    links: {
      "phys.mech.fluids": "pressure, capillarity and a water column under negative pressure",
      "chem.bond.intermolecular": "cohesion of water molecules and hydrogen bonding",
    },
  },
  "bio.plants.hormones": {
    title: "Plant hormones and responses",
    description: "The main effects of auxin, gibberellin, cytokinin, abscisic acid and ethylene; phototropism and gravitropism; photoperiodism and phytochrome; plant responses to environmental stress.",
    whyItMatters: "It shows how an organism with no nervous system 'senses' and responds to its surroundings; it is applied directly in agriculture and fruit ripening.",
    entryQuestions: [
      "If you put a potted plant by a window, its stem bends towards the light. The plant has no eyes, so how does it 'know' which way the light is coming from?",
      "If you put a ripe banana in a paper bag with unripe avocados, the avocados ripen faster. Why?",
    ],
    coreQuestions: [
      "How does auxin direct cell elongation in phototropism?",
      "How do plants measure day length and time their flowering?",
      "How do hormones coordinate responses to stress?",
    ],
    learningObjectives: [
      "Interprets the results of the classic coleoptile experiments in terms of auxin distribution.",
      "Matches the main plant hormones to their effects and gives examples of their agricultural uses.",
      "Infers from photoperiod experiment data whether a plant is a short-day or a long-day plant.",
    ],
    commonMisconceptions: [
      "Thinking plants move towards light 'deliberately'.",
      "Thinking each hormone has only a single effect.",
    ],
    links: {
      "bio.physiology.endocrine": "comparing hormonal signalling in plants and animals",
      "gk.geo.agriculture": "use of plant growth regulators in agriculture",
    },
  },
  "bio.micro.microbes": {
    title: "Microorganisms: bacteria, viruses, fungi",
    description: "Bacterial structure and reproduction, the bacterial growth curve, horizontal gene transfer, viral structure and the lytic/lysogenic cycles, fungi and protists; the roles of microbes in ecology and health; antibiotic resistance.",
    whyItMatters: "It explains the role of microorganisms in everything from epidemics to fermentation and from the nitrogen cycle to biotechnology; it is a real-world example of exponential growth.",
    entryQuestions: [
      "If a bacterium divides every 20 minutes, how many bacteria will a single one produce in 24 hours? Why does this never actually happen?",
      "Antibiotics kill bacteria but do nothing against the common cold. Why?",
    ],
    coreQuestions: [
      "What are the phases of the bacterial growth curve, and why do they arise?",
      "Is a virus alive? By which criteria?",
      "How does antibiotic resistance arise and spread?",
    ],
    learningObjectives: [
      "Plots bacterial growth data on a semi-logarithmic graph and identifies the phases.",
      "Compares prokaryotes, eukaryotes and viruses in terms of structure and reproduction.",
      "Explains how antibiotic resistance spreads through natural selection and horizontal gene transfer.",
    ],
    commonMisconceptions: [
      "Thinking all bacteria are harmful.",
      "Thinking antibiotic resistance means the human body 'getting used to' the antibiotic.",
    ],
    researchApplications: ["Measuring yeast or bacterial growth under different conditions"],
    links: {
      "math.found.exp-log": "the exponential phase of bacterial growth",
      "bio.immune": "the immune response to pathogens",
      "env.ecosystems.energy": "decomposers and matter cycles",
    },
  },
  "bio.biotech": {
    title: "Biotechnology: PCR, cloning, CRISPR",
    description: "Restriction enzymes and recombinant DNA, gene cloning with plasmids, PCR and gel electrophoresis, DNA sequencing, gene editing with CRISPR–Cas, and the ethical dimension of these techniques.",
    whyItMatters: "These are the everyday tools of modern biology labs; they let you read the methods sections of research papers and judge biotechnology debates from an informed position.",
    entryQuestions: [
      "A single hair was found at a crime scene; the DNA obtained from it is too little to analyse. How could you copy this DNA billions of times?",
      "A bacterium can produce human insulin. How does the bacterium understand the 'language' of a human gene?",
    ],
    coreQuestions: [
      "What happens in each PCR cycle, and why is a heat-stable polymerase needed?",
      "Why do DNA fragments separate by size in gel electrophoresis?",
      "How does CRISPR–Cas find and cut its target sequence?",
    ],
    learningObjectives: [
      "Explains the denaturation, annealing and extension steps of PCR and calculates the number of copies after n cycles.",
      "Estimates fragment sizes by interpreting a gel electrophoresis image.",
      "Designs the steps of a gene-cloning experiment using a restriction enzyme, ligase and a selectable marker.",
      "Debates the ethical questions of gene editing from the perspectives of different stakeholders.",
    ],
    commonMisconceptions: [
      "Thinking PCR copies the whole genome (it amplifies only the region bounded by the primers).",
      "Thinking small fragments move more slowly through the gel.",
    ],
    competitionApplications: ["Gel and cloning-experiment questions in the Biology Olympiad"],
    links: {
      "res.ethics": "research ethics of gene editing",
      "math.found.exp-log": "copy number growing as 2ⁿ in PCR",
      "chem.lab.techniques": "electrophoresis and separation techniques",
    },
  },
  "bio.classification": {
    title: "Classification and phylogenetic trees",
    description: "Taxonomic ranks and binomial nomenclature, the three domains, reading phylogenetic trees, shared derived characters, monophyletic groups, the principle of parsimony and building trees from molecular data.",
    whyItMatters: "It organises the diversity of life by evolutionary relatedness; tree-reading skills are a foundation of the Biology Olympiad and of debates about evolution.",
    entryQuestions: [
      "On a phylogenetic tree, humans appear more closely related to fungi than to plants. Does that surprise you? What exactly does the tree show?",
      "Bats and birds both have wings. Does this shared feature make them close relatives?",
    ],
    coreQuestions: [
      "On what basis is relatedness read from a phylogenetic tree?",
      "How are homologous and analogous traits told apart?",
      "How is the principle of parsimony used when building a tree from molecular data?",
    ],
    learningObjectives: [
      "Determines degrees of relatedness on a phylogenetic tree by finding most recent common ancestors.",
      "Builds the tree requiring the fewest changes from a character table using the principle of parsimony.",
      "Distinguishes homologous from analogous traits with examples and identifies monophyletic groups.",
    ],
    commonMisconceptions: [
      "Thinking branches drawn next to each other on a tree are more closely related (rotating branches does not change relatedness).",
      "Thinking one species is 'more evolved' than another.",
    ],
    competitionApplications: ["Phylogenetic-tree and cladogram questions in the Biology Olympiad"],
    links: {
      "math.discrete.graph-theory": "phylogenetic trees are rooted tree graphs",
      "prog.algo.dp": "sequence alignment and tree-building algorithms",
    },
  },
  "bio.behavior.animal": {
    title: "Animal behaviour",
    description: "Innate and learned behaviour, fixed action patterns, imprinting, navigation and migration, communication, social behaviour, kin selection and altruism; Tinbergen's four questions.",
    whyItMatters: "It teaches you to explain behaviour at the evolutionary and mechanistic levels together; it builds a direct bridge to psychology and neuroscience.",
    entryQuestions: [
      "Worker bees never reproduce and may die defending the hive. How can natural selection favour a behaviour that does not pass on the individual's own genes?",
      "A newly hatched gosling follows the first moving object it sees as if it were its mother. Is this learning or instinct?",
    ],
    coreQuestions: [
      "At what different levels can the question 'why?' be asked about a behaviour?",
      "How does kin selection explain altruism?",
      "How are innate and learned behaviour distinguished experimentally?",
    ],
    learningObjectives: [
      "Analyses a behaviour according to Tinbergen's four questions (mechanism, development, function, evolution).",
      "Calculates whether an altruistic behaviour will be selected for using Hamilton's rule.",
      "Designs an observation or experiment that distinguishes innate from learned behaviour.",
    ],
    commonMisconceptions: [
      "Thinking animals behave 'for the good of the species'.",
      "Thinking behaviour is either entirely innate or entirely learned.",
    ],
    researchApplications: ["A simple behavioural observation of ants or birds"],
    links: {
      "psy.learning.conditioning": "conditioning and learning in animals",
      "econ.micro.game-theory": "evolutionary game theory and strategic behaviour",
      "neuro.cog.decision": "animal decision-making and reward",
    },
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_BIOLOGY_PLUS: Record<string, string> = {
  "Organizma ve ekoloji": "Organisms and ecology",
};
