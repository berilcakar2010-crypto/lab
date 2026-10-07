import type { LOText } from "../../schema";

export const EN_BIOLOGY: Record<string, LOText> = {
  "bio.cell.structure": {
    title: "Cell structure and organelles",
    description: "The basic components of prokaryotic and eukaryotic cells; the roles of the nucleus, mitochondria, endoplasmic reticulum, Golgi apparatus and cytoskeleton.",
    whyItMatters: "The behavior of every tissue, neurons included, arises from the division of labor among organelles; the rest of cell biology is built on this map.",
    entryQuestions: [
      "Why can't a cell be a meter across? Estimate a limit by thinking about the surface-to-volume ratio.",
      "A neuron's axon can be longer than a meter; does that contradict the limit from the first question?",
    ],
    coreQuestions: [
      "Which organelle does which job, and how are these jobs connected?",
      "What physical constraints determine the size and shape of a cell?",
    ],
    learningObjectives: [
      "Distinguishes prokaryotic and eukaryotic cells using structural criteria.",
      "Diagrams the path through the organelles that a protein follows from synthesis to secretion.",
      "Explains the limit on cell size by calculating the surface-to-volume ratio.",
    ],
    commonMisconceptions: [
      "The inside of a cell is a homogeneous 'bag of fluid'; in fact the cytoplasm is densely organized by the cytoskeleton.",
      "Mitochondria are only 'power plants'; they also play roles in calcium storage and apoptosis.",
    ],
    links: {
      "neuro.cell.neuron-anatomy": "the specialized cell structure of the neuron builds on this foundation",
      "math.found.arithmetic": "surface-to-volume ratio as a scaling calculation",
    },
  },
  "bio.cell.membrane": {
    title: "The cell membrane and transport",
    description: "The phospholipid bilayer, diffusion, osmosis, channel and carrier proteins, active transport and the Na⁺/K⁺ pump.",
    whyItMatters: "A neuron's resting potential, kidney function and drug entry into cells all depend on membrane transport; the conductances in the HH model are the channels described here.",
    entryQuestions: [
      "Why does a lettuce leaf wilt in salt water? Which way does the water move, and why?",
      "If the Na⁺/K⁺ pump were stopped, would a neuron fall silent immediately, or keep firing for a while? Make a prediction.",
    ],
    coreQuestions: [
      "By what routes, and at what energy cost, does a molecule cross the membrane?",
      "How do concentration differences and electrical differences jointly drive transport?",
    ],
    learningObjectives: [
      "Distinguishes passive and active transport by their energy source.",
      "Calculates a simple diffusion flux using Fick's law.",
      "Predicts the outcome of an osmosis experiment from solution concentrations.",
      "Interprets the electrogenic effect of the Na⁺/K⁺ pump.",
    ],
    commonMisconceptions: [
      "In diffusion molecules 'want to go where there are fewer of them'; in fact it is the net result of random motion.",
      "Ion channels pump ions; channels only allow passage down the electrochemical gradient.",
    ],
    researchApplications: ["Using membrane permeability in models of drug distribution"],
    links: {
      "neuro.cell.membrane-potential": "ion gradients give rise to the membrane potential",
      "chem.solutions": "concentration and osmotic pressure",
      "phys.thermo.kinetic-theory": "the microscopic origin of diffusion",
    },
  },
  "bio.molecules": {
    title: "Biological macromolecules",
    description: "Carbohydrates, lipids, proteins and nucleic acids; their building blocks, bond types and the relationship between structure and function.",
    whyItMatters: "Enzymes, ion channels, receptors and DNA all come from these four classes; reading the structure–function relationship is reading the language of biology.",
    entryQuestions: [
      "What does it mean that a protein loses its function when heated, even though its amino acid sequence stays the same?",
      "Fat and sugar both store energy; why does the body prefer fat for long-term storage?",
    ],
    coreQuestions: [
      "By what bonds do monomers form polymers?",
      "How do the four levels of protein structure determine its function?",
    ],
    learningObjectives: [
      "Classifies the four classes of macromolecules by monomer and bond type.",
      "Explains the levels of protein folding and the interactions that hold them together.",
      "Predicts the likely effect of a mutation on protein function by reasoning from structure.",
    ],
    commonMisconceptions: [
      "Denaturation breaks peptide bonds; usually only weak interactions are disrupted.",
      "Lipids are 'bad' molecules; they are the main building blocks of membranes and myelin.",
    ],
    links: {
      "chem.biochem": "the chemical basis of the same molecules",
      "chem.bond.intermolecular": "hydrogen bonding and the hydrophobic effect determine folding",
    },
  },
  "bio.enzymes": {
    title: "Enzymes and metabolism",
    description: "How enzymes lower activation energy, Michaelis–Menten kinetics, types of inhibition and the regulation of metabolic pathways.",
    whyItMatters: "Metabolism, drug design and neurotransmitter breakdown are explained by enzyme kinetics; Michaelis–Menten is the template for every saturating process in biology.",
    entryQuestions: [
      "If you double the substrate concentration, does the reaction rate always double? Predict and sketch the graph.",
      "Can an enzyme change the equilibrium of a reaction?",
    ],
    coreQuestions: [
      "How does enzyme rate depend on substrate concentration, and why does it saturate?",
      "How are competitive and noncompetitive inhibition distinguished on a graph?",
    ],
    learningObjectives: [
      "Derives the Michaelis–Menten equation from the quasi-steady-state assumption.",
      "Calculates Km and Vmax from experimental data.",
      "Identifies the type of inhibition from kinetic plots.",
    ],
    commonMisconceptions: [
      "Enzymes change a reaction's ΔG; they only lower the activation energy.",
      "Km is an exact measure of binding affinity; it is only approximately so under certain conditions.",
    ],
    researchApplications: ["Fitting enzyme kinetic parameters to data"],
    links: {
      "chem.kinetics": "rate laws and activation energy",
      "math.ode.first-order": "kinetic equations are differential equations",
      "neuro.syn.transmission": "acetylcholinesterase terminates the synaptic signal",
    },
  },
  "bio.energy.respiration": {
    title: "Cellular respiration",
    description: "Glycolysis, the Krebs cycle and oxidative phosphorylation; the electron transport chain and chemiosmotic ATP synthesis.",
    whyItMatters: "The brain consumes a disproportionately large share of the body's energy; the ATP that runs its ion pumps comes from here. Chemiosmosis is the universal example of extracting work from a membrane gradient.",
    entryQuestions: [
      "Burning glucose and respiration yield the same products; so why doesn't the cell catch fire?",
      "If the mitochondrial membrane became leaky, what would happen to ATP production and body temperature? Make a prediction.",
    ],
    coreQuestions: [
      "Through which steps is the energy in glucose transferred to ATP?",
      "How does the proton gradient drive ATP synthase?",
    ],
    learningObjectives: [
      "Diagrams the stages of respiration with their inputs and outputs.",
      "Explains the direction of electron flow in terms of redox potentials.",
      "Calculates the approximate ATP yield and interprets why it is not exact.",
    ],
    commonMisconceptions: [
      "ATP is made directly from glucose; most of it is produced via the proton gradient.",
      "Plants don't respire; plants also respire using mitochondria.",
    ],
    links: {
      "chem.redox-electrochem": "the electron transport chain proceeds according to redox potentials",
      "chem.thermo.gibbs": "the thermodynamics of energy coupling",
      "neuro.cell.membrane-potential": "proton gradients and ion gradients follow the same electrochemical logic",
    },
  },
  "bio.energy.photosynthesis": {
    title: "Photosynthesis",
    description: "The light-dependent reactions, photosystems and the Calvin cycle; the conversion of light energy into chemical energy.",
    whyItMatters: "It is the energy input to food chains on Earth; because it uses the same chemiosmotic principle as respiration in the reverse direction, it teaches comparative thinking.",
    entryQuestions: [
      "Where does most of a tree's mass come from: the soil, the water or the air? Make a prediction first.",
    ],
    coreQuestions: [
      "At which steps is light energy converted into chemical energy?",
      "What common mechanism do photosynthesis and respiration share?",
    ],
    learningObjectives: [
      "Distinguishes the light-dependent and light-independent reactions by their inputs and outputs.",
      "Represents photosynthesis and respiration in a comparative diagram.",
      "Designs an experiment measuring the effect of light intensity and CO₂ concentration on the rate.",
    ],
    commonMisconceptions: [
      "Plant mass comes from the soil; most of it comes from CO₂ in the air.",
      "The Calvin cycle runs in the dark; it requires the products of the light-dependent reactions.",
    ],
    links: {
      "phys.modern.quantum-intro": "photon absorption and energy levels",
      "chem.redox-electrochem": "the oxidation of water and the reduction of NADP⁺",
    },
  },
  "bio.cell.signaling": {
    title: "Cell signaling",
    description: "Ligand–receptor interactions, G-protein-coupled receptors, second messengers, kinase cascades and signal amplification.",
    whyItMatters: "Most neurotransmitters, hormones and drugs act through these pathways; this is the molecular language of neuromodulation and synaptic plasticity.",
    entryQuestions: [
      "How can a single adrenaline molecule lead to the release of thousands of glucose molecules?",
      "Can the same signaling molecule produce opposite effects in two different cells? How?",
    ],
    coreQuestions: [
      "How is an extracellular signal transmitted into the cell and amplified?",
      "How is a signal terminated, and why does termination matter?",
    ],
    learningObjectives: [
      "Distinguishes ionotropic and metabotropic receptor pathways in terms of speed and mechanism.",
      "Calculates the amplification factor in a kinase cascade.",
      "Diagrams a signaling pathway from initiation to response.",
    ],
    commonMisconceptions: [
      "The receptor alone determines what the signal will do; the response depends on the pathways inside the cell.",
      "A signaling molecule must enter the cell; most bind to a surface receptor and stay outside.",
    ],
    links: {
      "neuro.syn.transmission": "synaptic transmission is specialized cell signaling",
      "neuro.syn.neuromodulation": "metabotropic receptors and second messengers",
      "math.found.exp-log": "cascade amplification is exponential growth",
    },
  },
  "bio.cell.division": {
    title: "The cell cycle, mitosis and meiosis",
    description: "The phases and checkpoints of the cell cycle, equal division by mitosis, and genetic diversity through meiosis.",
    whyItMatters: "Understanding heredity, development and cancer depends on division working correctly or going wrong; the question of why mature neurons do not divide is also asked here.",
    entryQuestions: [
      "Without crossing-over in meiosis, how many different gametes could a person produce? Estimate from the chromosome number.",
      "Why do mature neurons mostly not divide, and what does this mean for brain injury?",
    ],
    coreQuestions: [
      "For what purposes, and with what differences, do mitosis and meiosis take place?",
      "What happens when checkpoints fail?",
    ],
    learningObjectives: [
      "Diagrams the stages of mitosis and meiosis while tracking chromosome number.",
      "Calculates the gamete diversity produced by independent assortment.",
      "Explains the link between checkpoint loss and cancer.",
    ],
    commonMisconceptions: [
      "A chromatid and a chromosome are the same thing; confusing the counting rules ruins meiosis calculations.",
      "The chromosome number is halved in meiosis II; the reduction happens in meiosis I.",
    ],
    links: {
      "math.prob.counting": "counting gamete combinations",
      "neuro.sys.development": "neurogenesis and cell proliferation",
    },
  },
  "bio.genetics.mendel": {
    title: "Mendelian genetics",
    description: "The laws of segregation and independent assortment, types of dominance, pedigree analysis and probability-based cross calculations.",
    whyItMatters: "It teaches probability-based thinking for calculating the risk of inherited disease and interpreting genetic data.",
    entryQuestions: [
      "Is it possible that none of the four children of two carrier parents is affected? Estimate before calculating the probability.",
    ],
    coreQuestions: [
      "How do Mendel's ratios arise from meiosis?",
      "How do linked genes break independent assortment?",
    ],
    learningObjectives: [
      "Calculates phenotype ratios in monohybrid and dihybrid crosses.",
      "Infers the mode of inheritance from a pedigree and justifies it.",
      "Interprets whether observed ratios fit the expected ones using a chi-square test.",
    ],
    commonMisconceptions: [
      "A dominant allele is more common in the population; dominance and frequency are independent.",
      "The 3:1 ratio appears exactly in every family; random deviation is expected in small samples.",
    ],
    competitionApplications: ["Pedigree and cross problems in biology olympiads"],
    links: {
      "math.prob.basics": "the product rule for independent events",
      "math.stat.inference": "the chi-square goodness-of-fit test",
    },
  },
  "bio.genetics.molecular": {
    title: "Molecular genetics: DNA, transcription, translation",
    description: "The structure and replication of DNA, transcription, RNA processing, the genetic code and translation; types of mutation.",
    whyItMatters: "This is the path from gene to protein; it is the basis for understanding how ion channel mutations (channelopathies) lead to epilepsy and for using genetic tools such as optogenetics.",
    entryQuestions: [
      "The genetic code is made of three-letter codons; why wouldn't a two-letter code suffice? Calculate the shortest length needed to encode 20 amino acids.",
    ],
    coreQuestions: [
      "Through which steps does information flow from DNA to protein?",
      "Which mutations change the protein, and which do not?",
    ],
    learningObjectives: [
      "Converts a DNA sequence into mRNA and into an amino acid sequence.",
      "Predicts the effects of point, frameshift and silent mutations.",
      "Explains semiconservative replication using the experimental evidence.",
    ],
    commonMisconceptions: [
      "Every DNA sequence codes for a protein; most of the genome is non-coding sequence.",
      "Silent mutations are always harmless; they can affect splicing or translation speed.",
    ],
    links: {
      "math.found.exp-log": "the calculation 4^n ≥ 20 for code length",
      "neuro.methods.imaging": "genetically encoded calcium indicators",
      "chem.biochem": "nucleotide chemistry",
    },
  },
  "bio.genetics.regulation": {
    title: "Regulation of gene expression",
    description: "The operon model, transcription factors, epigenetic modifications and cell-type-specific gene expression.",
    whyItMatters: "It explains why a neuron and a liver cell with the same genome are different; the fact that long-term memory requires gene expression also connects here.",
    entryQuestions: [
      "If every cell in your body carries the same DNA, how does a neuron stay a neuron?",
    ],
    coreQuestions: [
      "At which levels is gene expression switched on and off?",
      "How do feedback loops produce stable states in gene networks?",
    ],
    learningObjectives: [
      "Predicts the behavior of the lac operon under different conditions.",
      "Models a simple gene regulatory circuit with a differential equation.",
      "Distinguishes epigenetic from genetic change in terms of inheritance.",
    ],
    commonMisconceptions: [
      "Genes are either fully on or fully off; expression levels are continuous and noisy.",
      "Epigenetic changes alter the DNA sequence; the sequence stays the same while accessibility changes.",
    ],
    links: {
      "math.dyn.stability": "bistable genetic switches",
      "neuro.cog.learning-memory": "long-term memory requires new protein synthesis",
    },
  },
  "bio.evolution": {
    title: "Evolution and natural selection",
    description: "Adaptation through variation, inheritance and selection; the evidence for evolution, speciation and reading phylogenetic trees.",
    whyItMatters: "It is the ultimate framework for every 'why' question in biology; comparing brain structures across species also requires evolutionary thinking.",
    entryQuestions: [
      "Does antibiotic use cause bacteria to 'develop resistance', or does it select the resistant ones? Why does the difference matter?",
    ],
    coreQuestions: [
      "Under what conditions is natural selection inevitable?",
      "What does a phylogenetic tree show, and what does it not show?",
    ],
    learningObjectives: [
      "Applies the three conditions for natural selection to an example.",
      "Interprets common-ancestry relationships correctly from a phylogenetic tree.",
      "Evaluates and compares different kinds of evidence for evolution.",
    ],
    commonMisconceptions: [
      "Individuals evolve during their lifetimes; evolution happens at the population level.",
      "Evolution progresses toward a goal or toward the 'most advanced' species.",
      "Humans evolved from chimpanzees; they share a common ancestor.",
    ],
    links: {
      "math.prob.stochastic": "random variation and selection",
      "neuro.sys.neuroanatomy": "the evolutionary conservation of brain structures",
    },
  },
  "bio.evolution.popgen": {
    title: "Population genetics: Hardy–Weinberg",
    description: "Allele and genotype frequencies, Hardy–Weinberg equilibrium and its assumptions, and the effects of genetic drift, migration and selection on frequencies.",
    whyItMatters: "It is the first mathematical model to make evolution quantitative; it is used to estimate the proportion of carriers in a population.",
    entryQuestions: [
      "If a rare recessive disease affects one in every 10,000 people, do you think the proportion of carriers is more or less than 1%? Estimate first, then calculate.",
    ],
    coreQuestions: [
      "Why do allele frequencies stay constant when no evolutionary forces act?",
      "Why is drift stronger in small populations?",
    ],
    learningObjectives: [
      "Derives Hardy–Weinberg equilibrium from the rules of probability.",
      "Calculates allele and carrier frequencies from phenotype data.",
      "Demonstrates genetic drift with a simple Python simulation.",
    ],
    commonMisconceptions: [
      "A dominant allele spreads over time and eliminates the recessive one; without selection, frequencies stay constant.",
      "Hardy–Weinberg describes real populations exactly; it is a null hypothesis.",
    ],
    researchApplications: ["Searching for signatures of selection in population data"],
    links: {
      "math.prob.markov": "the Wright–Fisher model is a Markov chain",
      "prog.sci.simulation": "Monte Carlo simulation of drift",
    },
  },
  "bio.physiology.systems": {
    title: "Human physiology and homeostasis",
    description: "How the circulatory, respiratory, excretory and digestive systems work; homeostasis through negative feedback.",
    whyItMatters: "It builds thinking at the level of the whole organism; the nervous system controls these systems, and the concept of feedback is shared with control theory.",
    entryQuestions: [
      "Sweating cools you on a hot day; so why does it work less well when the air is very humid?",
      "In a system that regulates blood pressure, what happens if the feedback delay is very large? Make a prediction.",
    ],
    coreQuestions: [
      "Through which feedback loops does the body keep its internal environment constant?",
      "How do organ systems depend on one another?",
    ],
    learningObjectives: [
      "Diagrams a homeostatic loop in terms of sensor, controller and effector.",
      "Distinguishes negative and positive feedback with examples.",
      "Calculates cardiac output and vascular resistance using a circuit analogy.",
    ],
    commonMisconceptions: [
      "Homeostasis means values never change; values fluctuate around a set point.",
      "The heart pulls blood in by 'suction'; circulation is driven by pressure differences.",
    ],
    links: {
      "phys.em.circuits-dc": "circulation and the Ohm's law analogy",
      "phys.mech.fluids": "blood flow and pressure",
      "math.dyn.stability": "stability in feedback systems",
    },
  },
  "bio.physiology.endocrine": {
    title: "The endocrine system",
    description: "Classes of hormones, the hypothalamic–pituitary axis, hormonal feedback loops and the stress response.",
    whyItMatters: "It shows how the nervous and hormonal systems share control; it intersects directly with neuroscience on stress, sleep and emotion.",
    entryQuestions: [
      "A nerve signal acts within milliseconds, a hormonal signal over minutes to hours. Why does the body need two separate communication systems?",
    ],
    coreQuestions: [
      "How does the hypothalamic–pituitary axis form a hierarchical feedback system?",
      "How do steroid and peptide hormones differ in the way they act on cells?",
    ],
    learningObjectives: [
      "Diagrams the feedback loop of a hormonal axis.",
      "Predicts the effects of a hormonal disorder along the axis.",
      "Compares neural and hormonal communication in terms of speed, range and duration.",
    ],
    commonMisconceptions: [
      "Hormones travel only to their target organ; they reach everywhere via the blood, and only cells with the receptor respond.",
      "Cortisol is only a 'bad' stress hormone; it is also needed in the normal daily rhythm.",
    ],
    links: {
      "neuro.cog.emotion": "the HPA axis and the stress response",
      "neuro.syn.neuromodulation": "overlapping effects of hormones and neuromodulators",
      "math.ode.first-order": "hormone half-life and exponential decay",
    },
  },
  "bio.immune": {
    title: "The immune system",
    description: "Innate and adaptive immunity, antibodies, T and B cells, and how vaccines work.",
    whyItMatters: "It is needed to understand vaccines, autoimmune disease and neuroinflammation; microglia are the brain's immune cells.",
    entryQuestions: [
      "How can the immune system recognize a virus it has never seen before? Think about the idea of 'pre-generated diversity'.",
    ],
    coreQuestions: [
      "How does the immune system tell self from non-self?",
      "How do vaccines create immunological memory?",
    ],
    learningObjectives: [
      "Distinguishes innate and adaptive immunity in terms of speed and specificity.",
      "Interprets graphs of primary and secondary immune responses.",
      "Demonstrates by calculation the combinatorial origin of antibody diversity.",
    ],
    commonMisconceptions: [
      "Antibiotics are effective against viruses.",
      "The brain is completely isolated from the immune system; there are microglia and limited passage.",
    ],
    links: {
      "math.prob.counting": "calculating the diversity from V(D)J recombination",
      "neuro.cell.neuron-anatomy": "microglia and glial functions",
    },
  },
  "bio.ecology": {
    title: "Ecology and population dynamics",
    description: "Exponential and logistic growth, predator–prey (Lotka–Volterra) interactions, food webs and energy flow.",
    whyItMatters: "It is the cleanest example of modeling biological systems with differential equations; the same mathematics reappears in neuron populations.",
    entryQuestions: [
      "If all the predators disappeared, would the prey population grow forever? Predict what would stop it.",
      "Why do predator and prey numbers usually oscillate out of phase?",
    ],
    coreQuestions: [
      "Under what conditions does population growth saturate?",
      "How do interacting populations produce oscillations?",
    ],
    learningObjectives: [
      "Solves the logistic growth equation and interprets the carrying capacity.",
      "Simulates the Lotka–Volterra system numerically.",
      "Calculates energy transfer through a food web in percentages.",
    ],
    commonMisconceptions: [
      "Ecosystems spontaneously reach a 'balance' and stay there.",
      "Predator and prey populations peak at the same time.",
    ],
    researchApplications: ["Fitting population models to field data"],
    links: {
      "math.ode.systems": "the Lotka–Volterra phase space",
      "math.ode.numerical": "numerical solution of population models",
      "neuro.comp.networks": "excitatory–inhibitory populations show predator–prey-like dynamics",
    },
  },
  "bio.methods.lab": {
    title: "Biology laboratory methods and experimental design",
    description: "Microscopy, PCR, gel electrophoresis and the basics of cell culture; control groups, replicates and variability in biological experiments.",
    whyItMatters: "Biological data are highly variable; knowing how to set up an experiment correctly is a prerequisite for evaluating claims in papers and for doing your own project.",
    entryQuestions: [
      "In an experiment showing that a drug kills cells, which missing control would make the result meaningless?",
      "Is a measurement repeated in three wells 'n = 3', or is it 'n = 1' if they all come from the same cell culture?",
    ],
    coreQuestions: [
      "What is the difference between a biological and a technical replicate?",
      "Which questions can a method answer, and which can it not?",
    ],
    learningObjectives: [
      "Designs an experiment that includes positive and negative controls.",
      "Interprets fragment sizes from a gel electrophoresis image.",
      "Determines sample size correctly by distinguishing biological from technical replicates.",
    ],
    commonMisconceptions: [
      "More technical replicates always give stronger evidence; independent biological replicates are needed.",
      "A control group is just the group where 'nothing is done'; a vehicle control is also needed.",
    ],
    researchApplications: ["Designing a small biology experiment in a school laboratory"],
    competitionApplications: ["The practical sections of biology olympiads"],
    links: {
      "res.method.experimental-design": "controls, randomization and power",
      "res.stats.pitfalls": "pseudoreplication and multiple comparisons",
      "math.stat.inference": "testing group differences",
    },
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_BIOLOGY: Record<string, string> = {
  "Hücre": "The cell",
  "Hücre biyolojisi": "Cell biology",
  "Genetik ve evrim": "Genetics and evolution",
  "Organizma ve ekoloji": "Organisms and ecology",
};
