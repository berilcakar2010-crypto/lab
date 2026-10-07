import type { LOText } from "../../schema";

export const EN_NEURO: Record<string, LOText> = {
  "neuro.cell.neuron-anatomy": {
    title: "Neuron anatomy and glia",
    description: "The parts of a neuron (dendrites, soma, axon hillock, axon and synaptic terminals); neuron types; and glial cells such as astrocytes, oligodendrocytes and microglia.",
    whyItMatters: "It determines the direction in which information flows through a neuron and which compartments are represented in models; the HH and cable models are abstractions of this anatomy.",
    entryQuestions: [
      "If a neuron can have only one axon but thousands of synapses, what does this \"one output, many inputs\" design gain computationally?",
      "Myelin is an insulator; so if it covered the whole axon, would the signal travel faster, or not be conducted at all?",
    ],
    coreQuestions: [
      "What role does each part of a neuron play in information processing?",
      "How do glial cells contribute to the working of neurons?",
    ],
    learningObjectives: [
      "Labels the parts of a neuron and the direction of signal flow on a diagram.",
      "Classifies neuron types by their morphology.",
      "Explains the functions of the glial cell types by relating them to neuronal physiology.",
    ],
    commonMisconceptions: [
      "Glia are just the \"glue\" holding neurons together; in fact they play an active role in regulating synapses and in myelination.",
      "Information in every neuron flows strictly one way, from dendrite to axon; back-propagating action potentials also exist.",
    ],
    researchApplications: ["Examining reconstructions in neuron morphology databases"],
    competitionApplications: ["Neuron structure questions in Brain Bee-style competitions"],
    links: {
      "bio.cell.structure": "a neuron is a specialised eukaryotic cell",
      "math.discrete.graph-theory": "neuronal branching and connections are represented as trees and graphs",
      "bio.immune": "microglia are the brain's immune cells",
    },
  },
  "neuro.cell.membrane-potential": {
    title: "Membrane potential: the Nernst and GHK equations",
    description: "How the resting potential arises from ion concentration differences and selective permeability; the Nernst equilibrium potential and the Goldman–Hodgkin–Katz equation for several ions.",
    whyItMatters: "Every ionic current in the HH model is written in terms of the difference (V − E_ion); without being able to calculate E_Na and E_K, the model's parameters lose their meaning.",
    entryQuestions: [
      "The K⁺ concentration inside the cell is about 30 times that outside, so why doesn't all the K⁺ flow out until it is used up? Guess what stops the flow.",
      "How many ions must cross the membrane to set up the resting potential: half the cell's K⁺, or a very small fraction of it?",
    ],
    coreQuestions: [
      "At what voltage do the chemical and electrical forces balance?",
      "When the membrane is permeable to several ions, how is the resting potential determined?",
      "Does the Na⁺/K⁺ pump contribute to the resting potential directly or indirectly?",
    ],
    learningObjectives: [
      "Derives the Nernst equation from the Boltzmann distribution or from the equality of electrochemical potentials.",
      "Calculates E_K, E_Na and E_Cl from given concentrations.",
      "Uses the GHK equation to predict how the resting potential shifts when permeability ratios change.",
      "Estimates, with a capacitor calculation, the amount of charge needed for the resting potential.",
    ],
    commonMisconceptions: [
      "The resting potential is produced directly by the pump; it arises mainly from K⁺ leak and the concentration difference.",
      "An action potential noticeably changes ion concentrations; the number of ions that move is a tiny fraction of the total.",
      "At the equilibrium potential ion flow stops; in fact the inward and outward fluxes become equal.",
    ],
    researchApplications: [
      "Changing the external K⁺ concentration in an HH simulation and studying excitability",
      "Modelling the effect of conditions such as hyperkalaemia on neuronal behaviour",
    ],
    competitionApplications: ["Nernst calculation questions in biology and brain olympiads"],
    links: {
      "chem.redox-electrochem": "the Nernst equation is the same equation as in electrochemistry",
      "phys.thermo.stat-mech": "the Boltzmann distribution is the origin of the equilibrium potential",
      "phys.em.capacitance": "the membrane stores charge like a capacitor",
    },
  },
  "neuro.cell.action-potential": {
    title: "The action potential and ion channels",
    description: "The all-or-none signal produced by the sequence in which voltage-gated Na⁺ and K⁺ channels open and close; threshold, the refractory period and propagation along the axon.",
    whyItMatters: "It is the mechanism of the neuron's unit of communication; the HH model is precisely the quantitative account of this event.",
    entryQuestions: [
      "If the action potential is \"all or none\", how does a neuron encode the strength of a stimulus?",
      "If the Na⁺ channels stayed open, where would the membrane potential go? Guess a number.",
    ],
    coreQuestions: [
      "How do positive and negative feedback loops produce the shape of a spike?",
      "What causes the refractory period, and what are its consequences?",
      "How does myelin increase conduction velocity?",
    ],
    learningObjectives: [
      "Diagrams the phases of the action potential in terms of channel states and ionic currents.",
      "Predicts the effect of channel blockers (e.g. TTX, TEA) on the spike.",
      "Calculates the effect of the absolute and relative refractory periods on the maximum firing rate.",
    ],
    commonMisconceptions: [
      "Na⁺ and K⁺ swap places during a spike; in fact there are two separate currents that open on different time scales.",
      "The action potential travels along the axon like an electric current at close to the speed of light; propagation is only of the order of m/s.",
      "Repolarisation is due to the pump; it is due to K⁺ channels.",
    ],
    researchApplications: ["The role of channel kinetics in channelopathies (e.g. some types of epilepsy)"],
    competitionApplications: ["Questions on spike phases in the Brain Bee and biology olympiads"],
    links: {
      "math.dyn.stability": "the threshold can be interpreted as a point of instability",
      "phys.em.rc-circuits": "membrane currents resemble a parallel RC circuit",
      "bio.genetics.molecular": "mutations in channel proteins lead to channelopathies",
    },
  },
  "neuro.cell.cable": {
    title: "Cable theory and dendritic integration",
    description: "The cable equation, which models passive dendrites and axons as a leaky cable; length and time constants, attenuation of the signal with distance, and spatio-temporal summation in dendrites.",
    whyItMatters: "It quantifies the effect of a synapse's distance from the soma; it is the basis of multi-compartment neuron models and extends HH into a wave travelling along the axon.",
    entryQuestions: [
      "If a synapse on a distant dendrite and one close to the soma inject the same current, which does the soma \"hear\" more strongly? Why?",
      "If you make an axon twice as thick, how many times farther does the signal travel: twice as far, or less?",
    ],
    coreQuestions: [
      "Why does voltage decay exponentially along a passive cable?",
      "How does the length constant λ depend on axon diameter?",
    ],
    learningObjectives: [
      "Derives the cable equation from conservation of membrane and axial currents.",
      "Solves for the exponential decay of voltage with distance in the steady state and calculates λ.",
      "Builds a multi-compartment model in Python and simulates the effect of synapse location.",
    ],
    commonMisconceptions: [
      "Dendrites are merely passive wires; many carry active channels and can generate dendritic spikes.",
      "λ grows linearly with diameter; in a passive cable λ is proportional to the square root of the diameter.",
    ],
    researchApplications: [
      "Extending the HH model to a multi-compartment axon and measuring conduction velocity",
      "Modelling the effect of dendritic location on synaptic weight",
    ],
    links: {
      "math.ode.pde-intro": "the cable equation is a diffusion-type partial differential equation",
      "phys.em.rc-circuits": "each patch of membrane is an RC element",
      "math.found.exp-log": "exponential decay with distance",
    },
  },
  "neuro.syn.transmission": {
    title: "Synaptic transmission and neurotransmitters",
    description: "Vesicle release triggered by Ca²⁺ entry at a chemical synapse, neurotransmitter–receptor interaction, EPSPs/IPSPs, electrical synapses and termination of the signal.",
    whyItMatters: "It is the basis of communication between neurons and the site of action of almost every psychoactive drug; the synaptic current terms in network models come from here.",
    entryQuestions: [
      "Synaptic transmission is probabilistic: a spike sometimes releases no vesicle at all. Is this \"unreliability\" a flaw, or could it be a computational feature?",
      "Why does the same neurotransmitter (e.g. acetylcholine) slow the heart but excite skeletal muscle?",
    ],
    coreQuestions: [
      "How is an electrical signal converted into a chemical one and then back into an electrical one?",
      "What determines whether a synapse is excitatory or inhibitory?",
      "On what data does the quantal release hypothesis rest?",
    ],
    learningObjectives: [
      "Diagrams the steps of synaptic transmission from Ca²⁺ entry to the receptor response.",
      "Predicts from its reversal potential whether a synaptic current will be excitatory or inhibitory.",
      "Calculates quantal release with a binomial model and interprets the distribution of responses.",
    ],
    commonMisconceptions: [
      "A neurotransmitter is always excitatory or always inhibitory; the effect is determined by the receptor and the ionic balance.",
      "Synapses either transmit fully or not at all; the release probability is usually less than 1.",
    ],
    researchApplications: ["Simulating synaptic currents with conductance-based models"],
    competitionApplications: ["Neurotransmitter and drug-action questions in the Brain Bee"],
    links: {
      "math.prob.distributions": "binomial and Poisson models of quantal release",
      "bio.cell.signaling": "ionotropic and metabotropic receptor pathways",
      "bio.enzymes": "termination of the signal by acetylcholinesterase",
    },
  },
  "neuro.syn.plasticity": {
    title: "Synaptic plasticity: LTP, LTD, STDP",
    description: "Lasting, activity-dependent change in synaptic strength: NMDA receptor-mediated LTP and LTD, spike-timing-dependent plasticity (STDP) and short-term facilitation/depression.",
    whyItMatters: "It is regarded as the cellular basis of learning and memory; Hebbian learning and the weight updates in artificial networks draw their inspiration from it.",
    entryQuestions: [
      "The NMDA receptor requires both glutamate and depolarisation. Why is this \"AND gate\" an ideal detector for learning?",
      "If the pre-before-post order is reversed by 10 ms, the synapse can weaken instead of strengthen. What might this mean in terms of causality?",
    ],
    coreQuestions: [
      "Under what conditions does a synapse strengthen, and under what conditions does it weaken?",
      "How is the STDP window measured and modelled?",
    ],
    learningObjectives: [
      "Explains the NMDA receptor's role as a coincidence detector in terms of the Mg²⁺ block.",
      "Models an STDP learning window with exponential functions.",
      "Interprets the magnitude and duration of potentiation from LTP experimental data.",
    ],
    commonMisconceptions: [
      "LTP is the same thing as memory; LTP is one possible mechanism of memory.",
      "Plasticity only strengthens synapses; weakening (LTD) and homeostatic scaling are just as important.",
    ],
    researchApplications: ["Simulating learning in a simple two-neuron circuit with an STDP rule"],
    links: {
      "math.found.exp-log": "the STDP window is defined with exponential kernels",
      "prog.ml.neural-nets": "the biological counterpart of the weight-update concept",
      "bio.genetics.regulation": "late LTP requires gene expression and protein synthesis",
    },
  },
  "neuro.syn.neuromodulation": {
    title: "Neuromodulation: dopamine, serotonin, acetylcholine",
    description: "How widely projecting modulatory systems alter the properties of neurons and synapses slowly and on a broad scale through metabotropic receptors.",
    whyItMatters: "It explains how attention, motivation, sleep and learning rate are tuned; in reinforcement-learning models dopamine appears as the reward prediction error signal.",
    entryQuestions: [
      "A small number of dopamine neurons project to wide areas of the brain. Does this structure carry a \"message\", or does it set the \"context\"?",
    ],
    coreQuestions: [
      "How do neuromodulators differ from fast synaptic transmission?",
      "With which functions are the dopamine, serotonin and acetylcholine systems associated?",
    ],
    learningObjectives: [
      "Distinguishes neuromodulation from classical synaptic transmission in terms of time scale and range of action.",
      "Predicts how a modulator shifts the f–I curve by changing a conductance.",
      "Diagrams the source nuclei and targets of the main modulatory systems.",
    ],
    commonMisconceptions: [
      "Dopamine is the \"happiness molecule\"; it is more closely tied to expectation, motivation and learning signals.",
      "A modulator has only one function; its effects vary with receptor subtype and brain region.",
    ],
    researchApplications: ["Mimicking modulation by scaling a conductance in an HH or LIF model"],
    links: {
      "bio.physiology.endocrine": "hormonal and neuromodulatory signals operate on similarly slow time scales",
      "bio.cell.signaling": "G-protein-coupled receptors and second messengers",
      "math.opt.optimization": "modulators tuning the learning rate is likened to the gradient step size",
    },
  },
  "neuro.sys.neuroanatomy": {
    title: "Neuroanatomy: brain regions and pathways",
    description: "The cortical lobes, thalamus, basal ganglia, hippocampus, cerebellum and brainstem; the main pathways and anatomical directional terms.",
    whyItMatters: "It is the map needed to read an fMRI result, a lesion case or a region name in a paper; the shared language of systems and cognitive neuroscience.",
    entryQuestions: [
      "The left half of the brain controls the right side of the body. Must there be a \"design reason\" for this, or could it be an evolutionary accident?",
      "The cerebellum may contain more neurons than the cortex; so why isn't it called the \"centre of thought\"?",
    ],
    coreQuestions: [
      "With which functions are the main brain regions associated?",
      "How do pathways between regions carry information?",
    ],
    learningObjectives: [
      "Recognises and names the main brain regions in section images.",
      "Predicts the likely loss of function from the location of a lesion.",
      "Diagrams a sensory or motor pathway from receptor to cortex.",
    ],
    commonMisconceptions: [
      "Every function has a single \"centre\"; functions run on distributed networks.",
      "People use only 10% of their brains.",
    ],
    researchApplications: ["Tracing a pathway using open brain atlases"],
    competitionApplications: ["The neuroanatomy section of Brain Bee competitions"],
    links: {
      "math.discrete.graph-theory": "the connectome is analysed as a graph",
      "bio.evolution": "conservation of brain structures across species",
      "math.geo.analytic": "stereotaxic coordinate systems",
    },
  },
  // @@CONTINUE@@
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_NEURO: Record<string, string> = {
  "Hücresel nörobilim": "Cellular neuroscience",
  "Nöron ve membran": "Neurons and membranes",
  "Sinaps": "Synapses",
  "Sistem nörobilimi": "Systems neuroscience",
  "Sistemler": "Systems",
  // @@UNITS@@
};
