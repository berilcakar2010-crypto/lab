import type { LOText } from "../../schema";

export const EN_CHEMISTRY_PLUS: Record<string, LOText> = {
  "chem.atoms.periodic-trends": {
    title: "Periodic trends in depth: ionisation, electronegativity, radius",
    description: "Atomic and ionic radius, successive ionisation energies, electron affinity and electronegativity trends explained through effective nuclear charge and shielding; accounting for exceptions to the trends with electron configurations.",
    whyItMatters: "It turns the periodic table from a list to memorise into a prediction tool; bond type, reactivity and acidity can all be read from these trends.",
    entryQuestions: [
      "The Na⁺ ion and the Ne atom have the same number of electrons. Which one is smaller? Why?",
      "You see a sudden huge jump in an element's successive ionisation energies. What does that jump tell you about the element's group?",
    ],
    coreQuestions: [
      "How does effective nuclear charge change across a period and down a group?",
      "How are the exceptions in ionisation energy (e.g. Be–B, N–O) explained?",
      "How does the difference in electronegativity determine the character of a bond?",
    ],
    learningObjectives: [
      "Ranks given atoms and ions by radius, ionisation energy and electronegativity and justifies each ranking.",
      "Infers the number of valence electrons of an element from successive ionisation energy data.",
      "Explains exceptions to the trends in terms of orbital filling and electron repulsion.",
    ],
    commonMisconceptions: [
      "Thinking an atom with more electrons is always larger.",
      "Thinking electronegativity and electron affinity are the same quantity.",
    ],
    competitionApplications: ["Chemistry olympiad questions interpreting ionisation energy data"],
    links: {
      "phys.em.charge-field": "Coulomb's law for nuclear attraction and shielding",
      "phys.modern.atomic-nuclear": "energy levels and ionisation",
    },
  },
  "chem.bond.lewis-vsepr": {
    title: "Lewis structures, resonance and VSEPR",
    description: "Drawing Lewis structures, formal charge, resonance structures and exceptions to the octet rule; electron-group and molecular geometry with VSEPR, bond angles and molecular polarity.",
    whyItMatters: "It lets you predict a molecule's shape on paper; shape determines polarity, and polarity determines solubility, boiling point and biological interactions.",
    entryQuestions: [
      "CO₂ and H₂O both contain polar bonds, yet one is a polar molecule and the other is not. Which is which, and why?",
      "When the two O–O bonds in ozone (O₃) are measured they come out exactly the same length, yet the Lewis structure shows one single and one double bond. How do you explain this?",
    ],
    coreQuestions: [
      "How is the most likely Lewis structure of a molecule chosen?",
      "How do lone pairs change the geometry?",
      "How does molecular shape determine polarity?",
    ],
    learningObjectives: [
      "Draws Lewis structures for polyatomic molecules and ions and selects the best structure using formal charges.",
      "Predicts electron-group and molecular geometry and approximate bond angles with VSEPR.",
      "Determines whether a molecule is polar by adding bond dipoles as vectors.",
    ],
    commonMisconceptions: [
      "Thinking resonance structures are separate forms the molecule keeps switching between.",
      "Thinking every molecule containing polar bonds is polar.",
    ],
    links: {
      "math.geo.solid": "tetrahedral and bipyramidal geometries, bond angles",
      "math.geo.vectors": "vector addition of dipole moments",
      "bio.molecules": "shape and function of biomolecules",
    },
  },
  "chem.react.limiting-yield": {
    title: "Limiting reagent and yield",
    description: "Identifying the limiting and excess reagents from mole ratios in a balanced equation; theoretical, actual and percentage yield; overall yield in multi-step syntheses.",
    whyItMatters: "It lets you calculate how much product to expect in the lab or in industry and which substance will be left over; it is the core of every quantitative chemistry problem.",
    entryQuestions: [
      "You have 10 slices of bread and 3 slices of cheese; each sandwich needs 2 slices of bread and 1 of cheese. How many sandwiches can you make, and what is left over? How would you apply the same logic to a reaction?",
      "Each step of a synthesis runs at 90% yield. Roughly what is the overall yield after five steps? Guess first.",
    ],
    coreQuestions: [
      "Why is the limiting reagent decided by moles rather than by mass?",
      "Why does the actual yield fall short of the theoretical yield?",
    ],
    learningObjectives: [
      "Identifies the limiting reagent from given masses and calculates the theoretical amount of product.",
      "Calculates the percentage yield from an experimental result and lists possible reasons for a low yield.",
      "Calculates the overall yield of a multi-step synthesis.",
    ],
    commonMisconceptions: [
      "Thinking the substance with the smaller mass is always the limiting reagent.",
      "Thinking a yield above 100% means a better experiment (it usually means impurities or moisture).",
    ],
    links: {
      "math.found.arithmetic": "ratio and proportion",
      "env.sustainability": "atom economy and green chemistry",
    },
  },
  "chem.react.precipitation": {
    title: "Precipitation reactions and solubility equilibria",
    description: "Solubility rules, net ionic equations, the solubility product (Ksp), molar solubility, the common-ion effect and predicting precipitation by comparing Q with Ksp.",
    whyItMatters: "From kidney stones to hard water, from cave formation to removing heavy metals from waste water, it answers 'when does something precipitate?' quantitatively.",
    entryQuestions: [
      "You mix two clear solutions and a white cloudiness suddenly appears. Where did this solid come from, and which ions is it made of?",
      "What happens if you add another salt containing the same ion to a saturated solution of a sparingly soluble salt? Predict.",
    ],
    coreQuestions: [
      "How are Ksp and molar solubility related?",
      "How do you predict whether a precipitate will form in a mixture?",
      "How do a common ion and pH change solubility?",
    ],
    learningObjectives: [
      "Writes net ionic equations for precipitation reactions.",
      "Calculates molar solubility from Ksp and Ksp from molar solubility.",
      "Predicts whether a precipitate forms when two solutions are mixed by comparing Q with Ksp.",
      "Explains the common-ion effect with Le Chatelier's principle and calculates it numerically.",
    ],
    commonMisconceptions: [
      "Thinking the salt with the smaller Ksp always dissolves less (they cannot be compared directly if the number of ions differs).",
      "Thinking 'insoluble' salts do not dissolve at all.",
    ],
    links: {
      "env.pollution.water-soil": "removing heavy metals from water by precipitation",
      "earth.geo.rocks": "dissolution and precipitation of carbonate rocks",
      "bio.anatomy.excretory": "the formation of kidney stones",
    },
  },
  "chem.nuclear": {
    title: "Nuclear chemistry and radioactivity",
    description: "Alpha, beta and gamma decay and balancing nuclear equations, the band of stability, half-life and first-order decay kinetics; uses of radioisotopes in medicine and dating.",
    whyItMatters: "From radiometric dating to medical imaging, from nuclear waste to radiation safety, it lets you reason quantitatively about nuclear processes as distinct from chemical reactions.",
    entryQuestions: [
      "If half of a radioactive sample decays in 10 days, does the remaining half disappear completely in the next 10 days? Why?",
      "Does heating an atom, applying pressure or bonding it into a compound change its decay rate? Compare with chemical reactions.",
    ],
    coreQuestions: [
      "How are nuclear equations balanced?",
      "How can you predict which type of decay a nucleus will undergo?",
      "How are half-life and exponential decay calculated?",
    ],
    learningObjectives: [
      "Balances nuclear equations for alpha, beta and gamma decay by conserving mass number and atomic number.",
      "Predicts the likely decay mode of an isotope from its neutron-to-proton ratio.",
      "Calculates the remaining amount or the age of a sample using half-life.",
    ],
    commonMisconceptions: [
      "Thinking a sample has completely decayed after two half-lives.",
      "Thinking the rate of radioactive decay changes with temperature or chemical environment.",
    ],
    links: {
      "math.found.exp-log": "exponential decay and calculating age with logarithms",
      "earth.geo.deep-time": "radiometric dating",
      "phys.modern.nuclear-energy": "fission, fusion and binding energy",
    },
  },
  "chem.organic.functional-groups": {
    title: "Functional groups and nomenclature",
    description: "Recognising alcohol, ether, aldehyde, ketone, carboxylic acid, ester, amine and amide groups; IUPAC naming rules, structural isomerism and the effect of the functional group on physical properties.",
    whyItMatters: "It is the alphabet of organic chemistry: how a molecule reacts is largely read from its functional groups; drugs, biomolecules and polymers are described in this language.",
    entryQuestions: [
      "Ethanol (C₂H₆O) and dimethyl ether have the same molecular formula; one is a liquid at room temperature and the other a gas. How is that possible?",
      "The molecules behind the smell of vinegar and of bananas can differ only slightly in structure. Which part of a molecule decides its smell or taste?",
    ],
    coreQuestions: [
      "How are the main functional groups recognised and named?",
      "How does the functional group affect boiling point and solubility?",
    ],
    learningObjectives: [
      "Identifies the functional groups in a structural formula and writes its IUPAC name.",
      "Draws the structural formula from a given name and generates possible structural isomers.",
      "Ranks boiling points according to whether the functional groups can form hydrogen bonds and justifies the ranking.",
    ],
    commonMisconceptions: [
      "Thinking molecules with the same molecular formula have the same properties.",
      "Thinking the –OH group in alcohols behaves like a basic hydroxide ion.",
    ],
    links: {
      "bio.molecules": "functional groups in biomolecules",
      "neuro.syn.transmission": "the amine groups of neurotransmitters",
    },
  },
  "chem.organic.reactions": {
    title: "Basic organic reactions",
    description: "Addition, substitution (SN1/SN2), elimination, oxidation–reduction and esterification reactions; the concepts of nucleophile and electrophile, and curly-arrow mechanism notation.",
    whyItMatters: "It builds the logic of organic synthesis, letting you plan how to make a given product from a given starting material; medicinal chemistry and biochemical pathways use the same reaction types.",
    entryQuestions: [
      "When you add bromine water to ethene the brown colour vanishes at once; with ethane it does not. Which difference between the two molecules explains this?",
      "You mix an alcohol and an acid to make an ester, but the yield stays low. How would you push the equilibrium towards the product?",
    ],
    coreQuestions: [
      "What are nucleophiles and electrophiles, and how do they meet in a reaction?",
      "Under what conditions do the SN1 and SN2 mechanisms dominate?",
      "Through which reactions is one functional group converted into another?",
    ],
    learningObjectives: [
      "Predicts the product of the basic reaction types and names the reaction type.",
      "Draws a simple mechanism with curly arrows and identifies the nucleophile and the electrophile.",
      "Proposes a synthetic route for a two- or three-step transformation.",
    ],
    commonMisconceptions: [
      "Thinking curly arrows show the movement of atoms (they show the movement of electron pairs).",
      "Thinking every organic reaction gives a single, definite product.",
    ],
    competitionApplications: ["Organic transformation and mechanism questions in chemistry olympiads"],
    links: {
      "bio.enzymes": "enzymes catalysing organic reactions",
      "bio.energy.respiration": "oxidation steps in respiratory pathways",
    },
  },
  "chem.organic.polymers": {
    title: "Polymers and materials",
    description: "Addition and condensation polymerisation, the monomer–polymer relationship, the effect of chain structure (branching, cross-linking) on properties; natural polymers, plastics and recycling.",
    whyItMatters: "It shows how large molecules, from plastics and fibres to proteins and DNA, are built and why they behave differently; it underpins choosing materials and debates about plastic pollution.",
    entryQuestions: [
      "A polyethylene bag and a PET bottle are both plastics, yet one is soft and flexible and the other is rigid. What might the difference be at the molecular level?",
      "Some plastics can be reshaped when heated, while others do not even soften before they burn. Why?",
    ],
    coreQuestions: [
      "How do addition and condensation polymers form?",
      "How do chain structure and intermolecular forces determine a polymer's properties?",
    ],
    learningObjectives: [
      "Draws the repeating unit of a polymer from its monomer, and the monomer(s) from a repeating unit.",
      "Classifies polymers as addition or condensation polymers and states the by-product.",
      "Explains thermoplastic and thermoset behaviour in terms of chain structure and recommends a material for a given use.",
    ],
    commonMisconceptions: [
      "Thinking all plastics can be recycled in the same way.",
      "Thinking 'natural' polymers are chemically completely different from synthetic ones.",
    ],
    links: {
      "env.pollution.water-soil": "plastic and microplastic pollution",
      "bio.molecules": "proteins and nucleic acids as polymers",
    },
  },
  "chem.analysis.spectroscopy": {
    title: "Spectroscopy and the Beer–Lambert law",
    description: "Absorption and emission of light by matter; the basic idea of UV–visible, IR and atomic spectra, the link between colour and absorbed wavelength, the Beer–Lambert law and determining concentration with a calibration curve.",
    whyItMatters: "It lets you measure a solution's concentration with light and identify a molecule from its 'fingerprint'; it is the most widespread analytical method, from medical labs to astronomy.",
    entryQuestions: [
      "Copper sulfate solution looks blue. Does that mean the solution absorbs blue light, or the opposite?",
      "If you dilute a solution twofold, does the light passing through it double? Predict first.",
    ],
    coreQuestions: [
      "Why do atoms and molecules absorb light only at certain wavelengths?",
      "How are absorbance, concentration and path length related?",
      "How is a calibration curve built, and when does it become unreliable?",
    ],
    learningObjectives: [
      "Converts between absorbance and transmittance and calculates concentration with the Beer–Lambert law.",
      "Builds a calibration curve from standard solutions and finds the concentration of an unknown sample with its uncertainty.",
      "Predicts the colour of a solution from the wavelength it absorbs using complementary colours.",
      "Recognises characteristic bond vibrations in a simple IR spectrum.",
    ],
    commonMisconceptions: [
      "Thinking the colour we see is the colour the solution absorbs.",
      "Thinking transmittance decreases linearly with concentration (it is absorbance that is linear).",
    ],
    researchApplications: ["Measuring protein and DNA concentrations in biochemistry labs"],
    links: {
      "phys.modern.photoelectric": "photon energy E = hf",
      "space.light.spectra": "inferring composition from stellar spectra",
      "math.stat.regression": "the calibration line and its uncertainty",
    },
  },
  "chem.lab.techniques": {
    title: "Laboratory techniques: titration, chromatography, safety",
    description: "Acid–base titration and choice of indicator, preparing standard solutions, paper and thin-layer chromatography (Rf values), filtration, distillation and recrystallisation; laboratory safety and measurement uncertainty.",
    whyItMatters: "It turns chemistry on paper into reliable measurements; it is the basis of olympiad practical exams, science projects and every experimental report.",
    entryQuestions: [
      "While reading a burette in a titration, your eye sits slightly above the line. Will your result always come out too high, always too low, or vary randomly?",
      "When you run the black ink of a felt-tip pen up paper with water, it separates into colours. What causes this separation?",
    ],
    coreQuestions: [
      "How is the end point of a titration determined and how is an indicator chosen?",
      "Why do substances travel at different speeds in chromatography?",
      "How are systematic and random errors told apart and reduced?",
    ],
    learningObjectives: [
      "Plans and carries out an acid–base titration and calculates the unknown concentration with its uncertainty.",
      "Calculates Rf values from a chromatogram and identifies components by comparison with standards.",
      "Assesses the risks of an experiment and writes appropriate safety precautions.",
      "Distinguishes whether the error in a measurement is systematic or random.",
    ],
    commonMisconceptions: [
      "Thinking that repeating a measurement also removes systematic error.",
      "Thinking the solution is always neutral (pH 7) at the end point.",
    ],
    competitionApplications: ["Titration and separation tasks in chemistry olympiad practical exams"],
    links: {
      "phys.lab.experimental": "measurement uncertainty and error propagation",
      "res.method.experimental-design": "designing controlled experiments",
      "bio.methods.lab": "separation techniques in the biology lab",
    },
  },
};

export const UNITS_CHEMISTRY_PLUS: Record<string, string> = {
  "Genel kimya": "General chemistry",
  "Atom ve bağ": "Atoms and bonding",
  "Tepkimeler ve madde": "Reactions and matter",
  "Organik ve biyokimya": "Organic chemistry and biochemistry",
  "Fizikokimya": "Physical chemistry",
  "Enerji, hız ve denge": "Energy, rates and equilibrium",
};
