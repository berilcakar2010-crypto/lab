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
  "neuro.sys.sensory": {
    title: "Sensory systems: vision and hearing",
    description: "Photoreceptors and retinal circuits, receptive fields and the visual pathway; frequency discrimination in the cochlea and the auditory pathway; sensory adaptation.",
    whyItMatters: "These are the best-known examples of how a physical stimulus is turned into a neural code, and the experimental ground for neural coding and Bayesian models of perception.",
    entryQuestions: [
      "The light-sensitive cells of the retina face backwards, away from the incoming light. What might be the cost, and the possible advantage, of this \"inverted\" design?",
      "Does the cochlea work like a Fourier analyser when it separates frequencies? Where does the analogy break down?",
    ],
    coreQuestions: [
      "What is a receptive field, and what does a centre–surround structure emphasise?",
      "How does the cochlea convert frequency information into position?",
      "Why is adaptation necessary for sensory systems?",
    ],
    learningObjectives: [
      "Models a centre–surround receptive field as a difference of two Gaussians and predicts its response to an edge.",
      "Calculates the size of the image on the retina using lens optics.",
      "Explains the tonotopic organisation of the cochlea using wave physics.",
    ],
    commonMisconceptions: [
      "The eye sends a complete picture to the brain like a camera; the retina already does extensive processing.",
      "The colour we perceive is directly the wavelength of the light; perception depends on context and contrast.",
    ],
    researchApplications: ["Applying receptive-field models to natural images"],
    competitionApplications: ["Sensory system questions in the Brain Bee"],
    links: {
      "phys.optics.geometric": "the lens of the eye and image formation",
      "phys.waves.sound": "sound waves and frequency",
      "math.fourier": "the cochlea's frequency decomposition resembles Fourier analysis",
    },
  },
  "neuro.sys.motor": {
    title: "The motor system and movement control",
    description: "The roles of motor neurons and muscle, reflex arcs, central pattern generators, the motor cortex, the basal ganglia and the cerebellum in controlling movement.",
    whyItMatters: "It completes the chain from perception to action; feedback control and brain–computer interfaces rely on models of this system.",
    entryQuestions: [
      "Think of an everyday experience showing that, when you lift a cup, your brain \"predicts\" in advance how heavy your arm will be.",
      "If sensory feedback arrives with a delay of hundreds of milliseconds, how can we make fast movements smoothly?",
    ],
    coreQuestions: [
      "At which levels are reflex, rhythmic and voluntary movements generated?",
      "How do the cerebellum and basal ganglia regulate movement?",
    ],
    learningObjectives: [
      "Diagrams the stretch reflex arc with its afferent and efferent components.",
      "Predicts the effect of delayed feedback on stability with a simple model.",
      "Explains motor disorders (e.g. Parkinson's disease) by relating them to changes in the relevant circuits.",
    ],
    commonMisconceptions: [
      "All movements are planned in the motor cortex; many rhythmic movements are generated by spinal circuits.",
      "The cerebellum is only about balance; it also plays a role in timing and motor learning.",
    ],
    researchApplications: ["Building a coupled-oscillator model of a central pattern generator"],
    links: {
      "phys.mech.torque": "joint torques and muscle forces",
      "math.dyn.stability": "stability of control with delayed feedback",
      "phys.mech.oscillations": "central pattern generators are modelled as oscillators",
    },
  },
  "neuro.sys.development": {
    title: "Development of the nervous system",
    description: "Neural tube formation, neurogenesis, neuronal migration, axon guidance, synapse formation and pruning; critical periods.",
    whyItMatters: "It explains how the brain \"builds itself\"; critical periods and activity-dependent refinement of connections relate directly to models of plasticity.",
    entryQuestions: [
      "The number of genes in the human genome is far smaller than the number of synapses in the brain. So how are the connections specified?",
    ],
    coreQuestions: [
      "By which chemical cues do axons find their targets?",
      "How does activity guide the pruning of connections?",
    ],
    learningObjectives: [
      "Diagrams the main stages of nervous system development in order.",
      "Interprets the gap between the number of genes and the number of synapses with an information calculation.",
      "Explains the results of critical-period experiments in terms of activity-dependent plasticity.",
    ],
    commonMisconceptions: [
      "Brain development is complete at birth; pruning and myelination continue through adolescence and beyond.",
      "Every connection is encoded individually in the genes.",
    ],
    links: {
      "bio.genetics.regulation": "patterns of gene expression determine cell fate",
      "bio.cell.division": "neurogenesis and cell proliferation",
      "math.info.entropy": "comparing the information capacity of the genome with the information in the connections",
    },
  },
  "neuro.cog.learning-memory": {
    title: "Learning and memory systems",
    description: "Short- and long-term memory, explicit (declarative) and implicit memory systems, the role of the hippocampus, consolidation and retrieval.",
    whyItMatters: "It is one of the central questions of neuroscience and also the way to put your own learning strategies (spaced repetition, retrieval practice) on a scientific footing.",
    entryQuestions: [
      "A patient with hippocampal damage can learn a new motor skill but does not remember having learned it. What does this tell us about memory?",
      "Which sticks better: rereading information or testing yourself on it? Predict, and think about why at the synaptic level.",
    ],
    coreQuestions: [
      "Which brain systems do the different types of memory depend on?",
      "How is a memory encoded, consolidated and retrieved?",
    ],
    learningObjectives: [
      "Classifies memory systems by function and by the brain regions involved.",
      "Draws inferences about the dissociation of memory systems from lesion cases.",
      "Applies spaced repetition and retrieval practice to their own study plan.",
    ],
    commonMisconceptions: [
      "Memory is stored as-is, like a video recording; retrieval is reconstructive.",
      "Short-term memory is just a \"short\" long-term memory; it involves different mechanisms.",
    ],
    researchApplications: ["A small self-experiment measuring the effect of retrieval practice"],
    competitionApplications: ["Memory and learning questions in the Brain Bee"],
    links: {
      "comp.meta.learning-to-learn": "the neuroscientific basis of the spacing and retrieval effects",
      "prog.ml.neural-nets": "comparing catastrophic forgetting in artificial networks with biological memory",
      "res.method.causal": "causal inference from lesion studies",
    },
  },
  "neuro.cog.attention": {
    title: "Attention",
    description: "Selective attention, attention networks, modulation of neural responses by gain changes, and the limits of attentional capacity.",
    whyItMatters: "It explains how a limited processing resource is allocated; it appears in study habits and, as gain modulation, in models of neural coding.",
    entryQuestions: [
      "In a crowded room you notice someone saying your name. How did you \"hear\" something you weren't paying attention to?",
    ],
    coreQuestions: [
      "How does attention change neuronal responses?",
      "How are top-down and bottom-up attention distinguished?",
    ],
    learningObjectives: [
      "Distinguishes top-down from bottom-up attention with examples.",
      "Models how attention scales a tuning curve as a gain.",
      "Designs a simple reaction-time experiment and interprets its results.",
    ],
    commonMisconceptions: [
      "We can multitask; mostly, attention switches rapidly between tasks, and that switching has a cost.",
      "Attention resides in a single brain region.",
    ],
    researchApplications: ["Setting up an online Posner cueing task and collecting data"],
    links: {
      "math.stat.inference": "testing group differences in reaction-time experiments",
      "res.method.experimental-design": "counterbalancing in attention experiments",
      "prog.ml.neural-nets": "a conceptual comparison with attention mechanisms in artificial networks",
    },
  },
  "neuro.cog.decision": {
    title: "Decision-making and reward",
    description: "Evidence-accumulation (drift–diffusion) models, value representation, reward prediction error and choice under risk.",
    whyItMatters: "It is one of the most productive areas linking behaviour to quantitative models, and a bridge between reinforcement learning and the Bayesian brain.",
    entryQuestions: [
      "Why do you make more mistakes when you decide faster? Try to explain the speed–accuracy trade-off with the idea of a \"threshold\".",
    ],
    coreQuestions: [
      "How does the brain accumulate noisy evidence over time?",
      "How are reward and value represented at the neural level?",
    ],
    learningObjectives: [
      "Simulates the drift–diffusion model as a random walk.",
      "Predicts how reaction time and accuracy change when the threshold changes.",
      "Interprets the concept of reward prediction error using dopamine recordings.",
    ],
    commonMisconceptions: [
      "Decisions are either entirely rational or entirely emotional; value computation combines both.",
      "Dopamine encodes reward itself; there is strong evidence that it encodes deviation from expectation.",
    ],
    researchApplications: ["Fitting a drift–diffusion model to reaction-time data"],
    links: {
      "math.prob.stochastic": "drift–diffusion is a random walk",
      "math.prob.bayes": "Bayesian accumulation of evidence",
      "prog.sci.simulation": "Monte Carlo simulation of decision models",
    },
  },
  "neuro.cog.sleep": {
    title: "Sleep and memory consolidation",
    description: "Sleep stages and their EEG signatures, the circadian rhythm, hippocampal replay during sleep and memory consolidation.",
    whyItMatters: "It shows that learning continues during sleep; it connects to organising your study plan on a scientific basis and to interpreting EEG data.",
    entryQuestions: [
      "Is staying up all night studying before an exam a gain or a loss? Predict from the standpoint of memory consolidation.",
    ],
    coreQuestions: [
      "How are sleep stages distinguished in the EEG?",
      "By which mechanisms does sleep strengthen memory?",
    ],
    learningObjectives: [
      "Distinguishes sleep stages by their EEG frequency bands.",
      "Explains the circadian rhythm with an oscillator model.",
      "Interprets the findings of sleep and memory experiments together with their methodological limits.",
    ],
    commonMisconceptions: [
      "The brain \"switches off\" during sleep; in some stages activity is close to wakefulness.",
      "Lost sleep is fully made up by one long sleep.",
    ],
    researchApplications: ["Analysing frequency bands in an open sleep EEG data set"],
    links: {
      "math.fourier": "identifying sleep stages from the EEG power spectrum",
      "comp.meta.learning-to-learn": "the place of sleep in a study plan",
      "bio.physiology.endocrine": "the daily rhythm of melatonin and cortisol",
    },
  },
  "neuro.cog.emotion": {
    title: "Emotion and stress",
    description: "The roles of the amygdala and prefrontal cortex in emotion regulation, fear conditioning, the HPA axis and the effects of chronic stress on the brain.",
    whyItMatters: "It explains how emotion affects cognition and learning, and offers a scientific framework for understanding exam anxiety and resilience.",
    entryQuestions: [
      "Why does moderate stress improve performance while high stress impairs it? Try to explain the inverted-U curve with a mechanism.",
    ],
    coreQuestions: [
      "Through which circuits is fear conditioning learned and extinguished?",
      "How does chronic stress affect the hippocampus and prefrontal cortex?",
    ],
    learningObjectives: [
      "Diagrams fear conditioning and extinction at the circuit level.",
      "Interprets the relationship between stress and performance from data.",
      "Explains emotion-regulation strategies by relating them to neural mechanisms.",
    ],
    commonMisconceptions: [
      "The amygdala is the \"fear centre\" and deals only with fear; it also plays a role in processing salience and value.",
      "All stress is harmful.",
    ],
    links: {
      "bio.physiology.endocrine": "the HPA axis and cortisol",
      "comp.meta.stress": "the scientific basis for coping with performance anxiety",
      "res.method.causal": "confounding variables in stress–illness relationships",
    },
  },
  "neuro.comp.lif": {
    title: "The leaky integrate-and-fire (LIF) model",
    description: "The simplest spiking model, which treats the membrane as an RC circuit and registers a spike and resets at threshold; the f–I curve, the refractory period and noisy inputs.",
    whyItMatters: "It is the workhorse of network simulations; before moving on to the HH model, it teaches in the plainest form the logic of modelling neurons with differential equations.",
    entryQuestions: [
      "If you give a LIF neuron a constant current, does doubling the current exactly double the firing rate? Predict first.",
      "Will a constant current below threshold produce a spike if you wait forever?",
    ],
    coreQuestions: [
      "Which biophysics does the LIF model keep, and which does it discard?",
      "How is the f–I curve found analytically?",
    ],
    learningObjectives: [
      "Derives the LIF equation from an RC circuit and writes its analytical solution.",
      "Derives the f–I curve analytically from the time to first spike and calculates the rheobase current.",
      "Codes a LIF neuron in Python with Euler's method and compares it with the analytical result.",
    ],
    commonMisconceptions: [
      "LIF models the shape of the spike; the spike is merely added as an event.",
      "The result is the same whatever the time step; large steps shift spike times.",
    ],
    researchApplications: [
      "Writing a LIF simulator as preparation for the HH project",
      "Comparing the f–I curves of LIF and HH",
    ],
    links: {
      "phys.em.rc-circuits": "without its threshold, LIF is exactly an RC circuit",
      "math.ode.first-order": "the exponential solution of a linear first-order equation",
      "math.ode.numerical": "numerical integration with Euler's method",
    },
  },
  "neuro.comp.hh-model": {
    title: "The Hodgkin–Huxley model",
    description: "A four-dimensional nonlinear ODE system that describes the membrane current through Na⁺, K⁺ and leak conductances, and channel kinetics through the gating variables m, h and n.",
    whyItMatters: "It is the cornerstone of biophysical neuron modelling and the centre of your research project; a model case of turning experimental data into a mechanistic model.",
    entryQuestions: [
      "In the HH model the conductance is written as g_Na·m³·h. Why the cube of m? Guess an explanation from the idea of independent gates.",
      "If the injected current is increased slowly, does an HH neuron begin repetitive firing from zero frequency as in LIF, or abruptly at a definite frequency? Predict.",
    ],
    coreQuestions: [
      "How do the gating variables depend on voltage, and why do they have different time constants?",
      "How did voltage-clamp experiments determine the model's parameters?",
      "How does the model produce spikes, threshold and refractoriness on its own?",
    ],
    learningObjectives: [
      "Derives the HH equations from conservation of membrane current and gating kinetics.",
      "Calculates and interprets the x∞ and τx curves of the gating variables from α(V) and β(V).",
      "Codes the HH system with Runge–Kutta and tests the effect of the time step on accuracy.",
      "Distinguishes type I and type II excitability from the f–I curve.",
    ],
    commonMisconceptions: [
      "m, h and n are real physical particles; they are phenomenological variables summarising channel opening probabilities.",
      "HH applies only to the squid axon; the same formalism generalises to many types of channel.",
      "Euler's method is always good enough; because HH has stiff dynamics, the step size needs care.",
    ],
    researchApplications: [
      "Simulating the HH model from scratch and extracting the f–I curve",
      "Studying the effect of temperature (Q10) or channel density changes on spike shape",
      "Mimicking channel blockers in the model and comparing with experimental findings",
    ],
    links: {
      "math.ode.systems": "a four-dimensional nonlinear ODE system",
      "math.ode.numerical": "integration and stability with Runge–Kutta",
      "phys.em.circuits-dc": "an equivalent circuit with parallel conductances and Kirchhoff's current law",
    },
  },
  "neuro.comp.phase-plane": {
    title: "Reduced models and the phase plane (FitzHugh–Nagumo)",
    description: "Reducing HH to two-dimensional models (FitzHugh–Nagumo, Morris–Lecar) by separating fast and slow variables; geometric analysis of excitability with nullclines, fixed points and limit cycles.",
    whyItMatters: "It lets you understand spike generation by asking \"why\": threshold, repetitive firing and type I/II behaviour are explained by bifurcations in the phase plane.",
    entryQuestions: [
      "What do you lose in going from the four-variable HH model to two variables? Which variables can \"stand in\" for one another?",
      "Is there really a \"threshold line\" in the phase plane, or is the threshold just an illusion?",
    ],
    coreQuestions: [
      "How do nullclines and fixed points determine excitability?",
      "Which types of firing do Hopf and saddle-node bifurcations correspond to?",
    ],
    learningObjectives: [
      "Draws the nullclines of the FitzHugh–Nagumo model and finds the fixed point.",
      "Derives the stability of the fixed point from the eigenvalues of the Jacobian matrix.",
      "Demonstrates by simulation the bifurcation that occurs as the input current changes and interprets type I/II behaviour.",
    ],
    commonMisconceptions: [
      "A simpler model is always less accurate; for the right question a reduced model can be more explanatory.",
      "The threshold is a fixed voltage value; in the phase plane it is a separatrix region and depends on the shape of the input.",
    ],
    researchApplications: ["Explaining the type of the f–I curve in the HH project with phase-plane analysis"],
    links: {
      "math.dyn.stability": "the Jacobian matrix and linearisation",
      "math.dyn.bifurcation": "Hopf and saddle-node bifurcations",
      "math.linalg.eigen": "fixed-point stability is read off from the eigenvalues",
    },
  },
  "neuro.comp.spike-stats": {
    title: "Spike train statistics and the Poisson model",
    description: "Describing spike trains statistically with firing rate, the inter-spike interval (ISI) distribution, the Fano factor, the coefficient of variation and homogeneous/inhomogeneous Poisson processes.",
    whyItMatters: "Since real neuronal recordings are noisy, neural coding, data analysis and model validation all rely on this statistical language.",
    entryQuestions: [
      "If a neuron fires 10 spikes per second on average, estimate the probability of seeing no spike in a 100 ms window. Is that probability \"small\"?",
      "If there is a refractory period, can a spike train be exactly Poisson?",
    ],
    coreQuestions: [
      "By which measures is the regularity of a spike train defined?",
      "Where is the Poisson model useful, and where does it break down?",
    ],
    learningObjectives: [
      "Derives that the ISI distribution of a Poisson process is exponential.",
      "Calculates the Fano factor and CV from a spike train.",
      "Codes an inhomogeneous Poisson spike generator and validates it with a PSTH.",
    ],
    commonMisconceptions: [
      "Firing rate can be measured reliably from a single trial; usually many trials and a choice of window are needed.",
      "A Fano factor of 1 proves the train is Poisson; it is necessary but not sufficient.",
    ],
    researchApplications: [
      "Analysing ISI distributions in open electrophysiology data",
      "Comparing the regularity of LIF and HH outputs",
    ],
    links: {
      "math.prob.distributions": "the Poisson and exponential distributions",
      "math.prob.stochastic": "the Poisson process",
      "prog.python.numpy": "generating spike trains and computing histograms",
    },
  },
  "neuro.comp.neural-coding": {
    title: "Neural coding and decoding",
    description: "Tuning curves, rate and timing codes, population codes; the spike-triggered average, linear–nonlinear–Poisson (LNP) models and decoding with the population vector.",
    whyItMatters: "It is the central question of what neurons are \"saying\"; it underlies brain–computer interfaces and the analyses of modern systems neuroscience.",
    entryQuestions: [
      "If a single neuron encodes direction only roughly, how well can 100 noisy neurons together estimate it? Predict how the improvement will scale.",
      "Is information carried by the precise timing of spikes, or only by their number? What experiment would tell them apart?",
    ],
    coreQuestions: [
      "How is a stimulus mapped onto a neural response (encoding), and how is it estimated in reverse (decoding)?",
      "What do population codes gain over single-neuron codes?",
    ],
    learningObjectives: [
      "Derives and computes the spike-triggered average from a white-noise stimulus.",
      "Codes a population-vector decoder with cosine tuning curves.",
      "Builds a decoder with linear regression and interprets its performance with cross-validation.",
    ],
    commonMisconceptions: [
      "Information that can be decoded is information the brain uses; decodability does not show that it is used.",
      "Noise is only a loss of information; correlated noise can sometimes preserve or even increase information.",
    ],
    researchApplications: ["Decoding movement direction from population activity in an open data set"],
    links: {
      "math.stat.regression": "linear decoders are regressions",
      "math.linalg.orthogonality": "estimating filters by least squares",
      "prog.ml.basics": "decoding with a classifier and cross-validation",
    },
  },
  "neuro.comp.info-theory": {
    title: "Information theory in neuroscience",
    description: "The entropy of spike responses, the mutual information between stimulus and response, bits-per-spike measures, the efficient coding hypothesis and estimation bias.",
    whyItMatters: "It makes it possible to measure, independently of any model, \"how much\" information a neuron carries, and leads to the idea of efficient coding, which explains why sensory systems encode the way they do.",
    entryQuestions: [
      "If a neuron gives the same response to every stimulus, its entropy is zero. What if it responds completely at random on every trial? Why does neither carry information?",
    ],
    coreQuestions: [
      "How is mutual information estimated from neural responses, and what biases arise?",
      "What does the efficient coding hypothesis predict about sensory tuning curves?",
    ],
    learningObjectives: [
      "Derives the definition of mutual information as a difference of entropies and proves its properties.",
      "Calculates mutual information from a discrete stimulus–response table.",
      "Demonstrates and interprets estimation bias with limited samples by simulation.",
    ],
    commonMisconceptions: [
      "High entropy means high information; information is the entropy that is related to the stimulus.",
      "Mutual information computed from little data is reliable; it is systematically overestimated.",
    ],
    researchApplications: ["Calculating a model neuron's bits per spike at different noise levels"],
    links: {
      "math.info.entropy": "definitions of entropy and mutual information",
      "phys.thermo.stat-mech": "the shared form of thermodynamic and information entropy",
      "math.stat.inference": "estimation bias and the bootstrap",
    },
  },
  "neuro.comp.networks": {
    title: "Neuronal networks and population dynamics",
    description: "Excitatory–inhibitory (E–I) balance, rate models (Wilson–Cowan), eigenvalues of the connectivity matrix, network oscillations and simulation of LIF networks.",
    whyItMatters: "It is the bridge from single neurons to behaviour; irregular activity, rhythms and working memory in the cortex are explained at the network level.",
    entryQuestions: [
      "Why does a network made only of excitatory neurons blow up? How does adding inhibitory neurons change the dynamics?",
      "What happens to the network's activity if the largest eigenvalue of the connectivity matrix exceeds 1? Predict.",
    ],
    coreQuestions: [
      "How is the stability of a linear rate network read off from the connectivity matrix?",
      "How does E–I balance produce irregular firing and oscillations?",
    ],
    learningObjectives: [
      "Derives the solution of a linear rate network by eigenvector decomposition.",
      "Analyses the stability of the fixed points of the Wilson–Cowan model.",
      "Codes a sparsely connected LIF network with NumPy and interprets its raster plot.",
    ],
    commonMisconceptions: [
      "Network behaviour is the sum of the behaviour of individual neurons; there are emergent dynamics.",
      "Noisy firing must come from external noise; balanced networks can generate irregularity themselves.",
    ],
    researchApplications: [
      "Simulating the effect of the E–I ratio on network oscillations",
      "Measuring synchrony in a small LIF network",
    ],
    links: {
      "math.linalg.eigen": "the spectrum of the connectivity matrix determines network stability",
      "math.dyn.stability": "analysis of the Wilson–Cowan fixed points",
      "bio.ecology": "E–I interaction resembles predator–prey dynamics",
    },
  },
  "neuro.comp.attractors": {
    title: "Attractor networks and working memory",
    description: "Hopfield networks, the energy function and fixed-point attractors; continuous (ring) attractors, persistent activity and models of working memory.",
    whyItMatters: "It makes concrete the idea that a memory can be stored as a stable state of a network, uniting dynamical systems, statistical physics and neuroscience in one model.",
    entryQuestions: [
      "Could recalling a memory be like \"rolling\" from an incomplete cue down to a complete pattern? Try to draw this as an energy landscape.",
      "What happens if you store too many patterns in a Hopfield network? Estimate the capacity in terms of the number of neurons.",
    ],
    coreQuestions: [
      "Why does a network with symmetric connections always converge to a fixed point?",
      "How does persistent activity store information after a stimulus is removed?",
    ],
    learningObjectives: [
      "Proves that the energy of a Hopfield network does not increase with any update.",
      "Codes a Hopfield network that stores patterns with the Hebb rule and tests recall from corrupted cues.",
      "Shows by simulation how recall success falls as the number of stored patterns grows.",
    ],
    commonMisconceptions: [
      "Attractor networks store a memory at an \"address\"; the information is distributed across all the connections.",
      "Persistent activity is solely a property of individual neurons; it usually arises from network feedback.",
    ],
    researchApplications: ["Systematically measuring a Hopfield network's robustness to noise"],
    links: {
      "math.dyn.bifurcation": "the birth and loss of attractors",
      "phys.thermo.stat-mech": "the similarity between the Hopfield network and spin-glass models",
      "math.linalg.eigen": "the connectivity matrix and the stored patterns",
    },
  },
  "neuro.comp.hebbian": {
    title: "Hebbian learning and models of plasticity",
    description: "The Hebb rule and its instability, normalisation with Oja's rule, the BCM rule, STDP models and the relationship between Hebbian learning and principal component analysis.",
    whyItMatters: "It shows mathematically what biological learning rules compute; the convergence of Oja's rule to PCA unites neuroscience with linear algebra.",
    entryQuestions: [
      "If you apply the rule \"neurons that fire together wire together\" exactly as stated, what happens to the weights over time? Why?",
    ],
    coreQuestions: [
      "Why is the pure Hebb rule unstable, and how is it stabilised?",
      "Why does Oja's rule find the principal eigenvector of the input covariance matrix?",
    ],
    learningObjectives: [
      "Writes the averaged Hebbian dynamics in terms of the covariance matrix and derives the growth of the weights.",
      "Shows by eigenvalue analysis that Oja's rule converges to the principal component.",
      "Codes the Hebb, Oja and STDP rules and compares their results with PCA.",
    ],
    commonMisconceptions: [
      "The Hebb rule involves only strengthening and is sufficient on its own; without normalisation or LTD the weights blow up.",
      "Hebbian learning is the same as backpropagation; backpropagation uses a global error signal, whereas Hebb works locally.",
    ],
    researchApplications: ["Studying how Hebbian learning on natural image patches produces receptive-field-like filters"],
    links: {
      "math.linalg.svd": "Oja's rule is an online form of PCA",
      "math.linalg.eigen": "the weight dynamics are determined by the eigenvectors of the covariance matrix",
      "prog.ml.neural-nets": "comparing local learning rules with backpropagation",
    },
  },
  "neuro.comp.reinforcement": {
    title: "Reinforcement learning and dopamine (TD learning)",
    description: "The Rescorla–Wagner rule, Markov decision processes, the value function, the temporal-difference (TD) error and the interpretation of dopamine neurons as signalling reward prediction error.",
    whyItMatters: "It is one of the most successful matches ever made between the activity of a neuronal population and an internal variable of an algorithm; it is a common language of artificial intelligence and neuroscience.",
    entryQuestions: [
      "If a reward always follows the sound of a bell, after learning do dopamine neurons fire at the reward or at the bell? What happens if the reward unexpectedly fails to arrive?",
    ],
    coreQuestions: [
      "How is the TD error defined, and how does it update value estimates?",
      "Which predictions of the TD model agree with dopamine recordings?",
    ],
    learningObjectives: [
      "Derives the TD(0) update rule from the Bellman equation.",
      "Codes TD learning in a simple conditioning task and shows the TD error shifting to the cue over time.",
      "Interprets the model's predictions by comparing them with findings from dopamine recordings.",
    ],
    commonMisconceptions: [
      "Dopamine is released in the same amount at every reward; the response changes with expectation.",
      "Reinforcement learning is just reward maximisation, with no need for exploration.",
    ],
    researchApplications: ["Fitting an RL model to human choice data in a two-armed bandit task"],
    links: {
      "math.prob.markov": "Markov decision processes",
      "prog.algo.dp": "the Bellman equation is dynamic programming",
      "prog.ml.basics": "learning rules and parameter updates",
    },
  },
  "neuro.comp.bayesian-brain": {
    title: "The Bayesian brain and perception",
    description: "The framework that treats perception as probabilistic inference from noisy sensory data; prior knowledge, likelihood, cross-modal cue combination and the Bayesian explanation of visual illusions.",
    whyItMatters: "It links behavioural data to quantitative, testable predictions, and is the common language of models of perception and decision-making under uncertainty.",
    entryQuestions: [
      "When you see something move in the dark, do you estimate its position better if you also hear a sound at the same moment? How much better?",
      "Why do we interpret a shaded surface on the assumption that \"light comes from above\"?",
    ],
    coreQuestions: [
      "How does an optimal observer combine two noisy cues?",
      "When do priors mislead perception?",
    ],
    learningObjectives: [
      "Derives inverse-variance weighted combination of two Gaussian cues from Bayes' rule.",
      "Calculates the optimal-combination prediction for a psychophysics experiment.",
      "Interprets a visual illusion as a conflict between prior and likelihood.",
    ],
    commonMisconceptions: [
      "The Bayesian brain means that neurons explicitly compute Bayes' formula; it is a computational theory at the level of behaviour.",
      "Optimal behaviour always means correct perception; wrong priors produce optimal but wrong percepts.",
    ],
    researchApplications: ["A small online psychophysics experiment on audiovisual localisation"],
    links: {
      "math.stat.bayesian": "prior, likelihood and posterior",
      "math.prob.bayes": "Bayes' theorem",
      "math.prob.distributions": "the product of Gaussian distributions",
    },
  },
  "neuro.comp.ann-bridge": {
    title: "Artificial neural networks and the brain",
    description: "Comparing artificial and biological neural networks: the visual pathway and convolutional networks, the biological plausibility of backpropagation, and methods for comparing networks with brain data.",
    whyItMatters: "Much current computational neuroscience research uses artificial networks as models of the brain; telling the similarities from the differences makes critical reading possible.",
    entryQuestions: [
      "If an artificial network recognises objects as well as a human does, does that show it works like a brain? What additional evidence would you want?",
    ],
    coreQuestions: [
      "What abstractions are made between an artificial neuron and a biological neuron?",
      "How are a network's internal representations compared with brain activity?",
    ],
    learningObjectives: [
      "Compares artificial and biological networks in terms of neuron model, learning rule and architecture.",
      "Derives the weight-transport requirement of backpropagation from the chain rule and discusses its biological plausibility.",
      "Codes representational similarity analysis (RSA) on a small data set.",
      "Evaluates the strength of evidence behind a claim that \"the network resembles the brain\".",
    ],
    commonMisconceptions: [
      "Artificial neural networks are simplified copies of the brain; their design goals and learning rules differ substantially.",
      "High predictive performance means mechanistic similarity.",
    ],
    researchApplications: ["Comparing the layer representations of a pretrained network with open brain data"],
    links: {
      "prog.ml.neural-nets": "the architecture and training of artificial networks",
      "math.opt.optimization": "comparing gradient descent with biological learning",
      "res.lit.reading": "critical reading of papers comparing models with the brain",
    },
  },
  "neuro.methods.electrophysiology": {
    title: "Electrophysiology and EEG",
    description: "Intracellular and patch-clamp recording, current and voltage clamp, extracellular spike recording and spike sorting, local field potentials and EEG rhythms.",
    whyItMatters: "The parameters of the HH model come from voltage-clamp experiments; bridging model and data requires knowing what each recording technique measures.",
    entryQuestions: [
      "Does EEG measured from the scalp see individual spikes, or something else? Why do millions of neurons need to be synchronised?",
      "If you hold the voltage constant in a voltage clamp, what does the current you measure show?",
    ],
    coreQuestions: [
      "Which spatial and temporal scales do the different recording methods see?",
      "How does voltage clamp make it possible to separate ionic currents?",
    ],
    learningObjectives: [
      "Compares recording methods by spatial and temporal resolution.",
      "Explains the voltage-clamp experiment on a circuit diagram.",
      "Computes the power spectrum of EEG data and interprets the frequency bands.",
    ],
    commonMisconceptions: [
      "EEG measures single neurons in deep brain structures; it mainly sees the synchronous synaptic currents of cortical pyramidal cells.",
      "Every signal in a recording is neural in origin; artefacts from muscle, eye movements and the mains supply are common.",
    ],
    researchApplications: [
      "Comparing HH conductance curves with open voltage-clamp data",
      "Analysing the alpha rhythm in an open EEG data set",
    ],
    links: {
      "phys.em.circuits-dc": "recording circuits and electrode resistance",
      "math.fourier": "decomposing a signal into its frequency components",
      "phys.lab.experimental": "measurement noise and uncertainty",
    },
  },
  "neuro.methods.imaging": {
    title: "Brain imaging: fMRI and calcium imaging",
    description: "The physical principle of MRI, the BOLD signal and the haemodynamic response, fMRI experimental design; cellular-resolution imaging with genetically encoded calcium indicators.",
    whyItMatters: "Most research on the human brain is done with fMRI; knowing that the signal is indirect and slow lets you weigh the claims in papers correctly.",
    entryQuestions: [
      "fMRI measures blood oxygenation, not neuronal activity. How do this delay and indirectness affect claims of the form \"region X does task Y\"?",
    ],
    coreQuestions: [
      "How is the BOLD signal related to neural activity?",
      "How well does calcium imaging reflect spikes?",
    ],
    learningObjectives: [
      "Compares imaging methods in terms of resolution and invasiveness.",
      "Models the expected BOLD signal by convolution with the haemodynamic response function.",
      "Evaluates the multiple-comparison and reverse-inference problems of an fMRI finding.",
    ],
    commonMisconceptions: [
      "A region that \"lights up\" in fMRI performs that task on its own.",
      "The calcium signal shows individual spikes directly; with slow indicators spikes are blurred and must be inferred.",
    ],
    researchApplications: ["A simple general linear model analysis on an open fMRI data set"],
    links: {
      "phys.modern.atomic-nuclear": "the physical basis of nuclear magnetic resonance",
      "res.stats.pitfalls": "the multiple-comparison problem in fMRI",
      "bio.genetics.molecular": "genetically encoded indicators",
    },
  },
  "neuro.methods.data-analysis": {
    title: "Neural data analysis (Python)",
    description: "Processing spike trains and continuous signals with Python: filtering, power spectra, PSTHs, trial averaging, statistical comparison and a reproducible analysis layout.",
    whyItMatters: "It is the practical skill of working with real neuroscience data, needed to analyse the results of the HH project and to do research with open data sets.",
    entryQuestions: [
      "A signal is contaminated with 50 Hz mains noise. Would you work in the time domain or the frequency domain to remove it? Why?",
      "If you run 20 different tests on the same data, how many \"significant\" results do you expect even if there is no effect?",
    ],
    coreQuestions: [
      "How are neural signals cleaned, summarised and compared?",
      "How can analysis decisions affect the results?",
    ],
    learningObjectives: [
      "Codes a PSTH and a raster plot from a spike data set.",
      "Derives the relationship between sampling frequency and the Nyquist limit and demonstrates aliasing error.",
      "Computes the power spectrum of a continuous signal and justifies a filter design.",
      "Analyses the difference between two conditions with an appropriate test and reports its uncertainty.",
    ],
    commonMisconceptions: [
      "More filtering always means cleaner, more accurate data; filters can create spurious oscillations and phase shifts.",
      "p < 0.05 shows that an effect is large and important.",
    ],
    researchApplications: ["Analysing firing differences between conditions in an open electrophysiology data set"],
    links: {
      "prog.python.numpy": "array operations and vectorisation",
      "math.fourier": "power spectra and filtering",
      "res.data.analysis-pipeline": "a reproducible analysis pipeline",
    },
  },
  "neuro.methods.ethics": {
    title: "Ethics in neuroscience",
    description: "Principles for animal experiments, consent in research with human participants, privacy of neural data, and the ethical questions raised by brain–computer interfaces and cognitive enhancement.",
    whyItMatters: "Because neuroscience deals directly with the mind and identity, ethical questions are unavoidable; it helps you make responsible decisions in your own experiments and use of data.",
    entryQuestions: [
      "If a device can produce text from your thoughts, who owns that data? What protective rules would you propose?",
    ],
    coreQuestions: [
      "Which ethical principles apply in neuroscience research?",
      "What new ethical problems do neurotechnologies raise?",
    ],
    learningObjectives: [
      "Applies the principles of replacement, reduction and refinement in animal research to an experimental proposal.",
      "Evaluates a scenario about neural data privacy through different ethical frameworks.",
      "Prepares an informed-consent text for their own small experiment.",
    ],
    commonMisconceptions: [
      "Ethics is merely a bureaucratic step after an experiment is approved; it is part of the design from the start.",
      "Anonymised neural data is always safe; there is a risk of re-identification.",
    ],
    links: {
      "res.ethics": "general principles of research ethics",
      "res.data.management": "storing and sharing sensitive data",
    },
    notes: ["Verify current ethics committee and legal requirements against your institution's up-to-date sources."],
  },
  "neuro.proj.hh-simulation": {
    title: "Project: Simulate the Hodgkin–Huxley model from scratch",
    description: "Coding the HH equations in Python without a ready-made neuroscience library; reproducing spikes, threshold, refractoriness and the f–I curve, investigating a parameter question and writing a report.",
    whyItMatters: "It is the core project of your research interest: it combines biophysics, differential equations, numerical methods, coding and scientific writing in one concrete output.",
    entryQuestions: [
      "How will you know the simulation is \"right\"? Without a real neuron to hand, which tests give you confidence?",
      "If spike times change when you halve the time step, what does that show?",
    ],
    coreQuestions: [
      "Which known behaviours should the model reproduce when it is coded correctly?",
      "How does the chosen parameter change affect the neuron's behaviour?",
      "How are the results reported reproducibly?",
    ],
    learningObjectives: [
      "Codes the HH equations with RK4 and validates them with unit tests (resting potential, steady-state gate values).",
      "Extracts the f–I curve with current steps and interprets type II behaviour.",
      "Defines a research question (e.g. the effect of temperature, channel density or a blocker) and carries out a systematic parameter sweep.",
      "Writes a short scientific report covering methods, results and limitations, and shares the code under version control.",
    ],
    commonMisconceptions: [
      "If the plot looks right, the code is right; unit and sign errors can produce plausible-looking wrong results.",
      "The voltage sign conventions in the original paper are the same as modern ones; the historical conventions differ and need converting.",
      "The project is over once the code is written; validation, the research question and reporting are half the work.",
    ],
    researchApplications: [
      "The effect of temperature (Q10) on spike width and firing rate in the HH model",
      "How excitability changes when the Na⁺ or K⁺ conductance is reduced",
      "A short report comparing HH results with LIF and FitzHugh–Nagumo",
    ],
    competitionApplications: ["Can be turned into an entry for research project competitions"],
    links: {
      "math.ode.numerical": "RK4 and step-size convergence tests",
      "prog.tools.git": "version control of the project code",
      "res.write.report": "writing a scientific report",
    },
  },
  "neuro.boss": {
    title: "Boss: Computational neuroscience synthesis",
    description: "An integrated problem set that requires single-neuron biophysics, neural coding, network dynamics and data analysis together: build a model, simulate it, generate data, decode it and interpret the results.",
    whyItMatters: "It proves that you can connect the pieces of computational neuroscience, testing the integrated skill expected in summer school and research applications.",
    entryQuestions: [
      "You want to recover the stimulus from the output of a small network of HH neurons. Which steps, in what order? Before planning, predict: which step will be hardest?",
    ],
    coreQuestions: [
      "How do the single-neuron, network and coding levels constrain one another?",
      "How do you validate a model's result with data analysis?",
    ],
    learningObjectives: [
      "Derives a neuron model's f–I relationship analytically or with phase-plane methods.",
      "Generates spike data from a population of model neurons and decodes the stimulus.",
      "Predicts a network's stability with eigenvalue analysis and confirms it by simulation.",
      "Interprets all the results, with their uncertainties, in a short technical report.",
    ],
    commonMisconceptions: [
      "Knowing each piece separately is enough to solve the whole; keeping assumptions consistent across levels is a separate skill.",
    ],
    researchApplications: ["Turning the boss results into a research poster"],
    competitionApplications: ["Can be used as a sample of work in computational neuroscience summer school applications"],
    links: {
      "math.linalg.eigen": "analysis of network stability",
      "math.stat.regression": "building a decoder",
      "prog.sci.simulation": "organising a large-scale simulation",
    },
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_NEURO: Record<string, string> = {
  "Hücresel nörobilim": "Cellular neuroscience",
  "Nöron ve membran": "Neurons and membranes",
  "Sinaps": "Synapses",
  "Sistem nörobilimi": "Systems neuroscience",
  "Sistemler": "Systems",
  "Bilişsel nörobilim": "Cognitive neuroscience",
  "Biliş": "Cognition",
  "Hesaplamalı nörobilim": "Computational neuroscience",
  "Nöron modelleri": "Neuron models",
  "Kodlama ve ağlar": "Coding and networks",
  "Yöntemler ve projeler": "Methods and projects",
  "Yöntemler": "Methods",
};
