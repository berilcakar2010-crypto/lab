import type { LOText } from "../../schema";

export const EN_CHEMISTRY: Record<string, LOText> = {
  "chem.atoms.structure": {
    title: "Atomic structure and the periodic table",
    description: "Protons, neutrons and electrons; atomic number, mass number, isotopes, average atomic mass and the organization of the periodic table.",
    whyItMatters: "This is the alphabet of all chemistry; being able to read the periodic table lets you predict how an element behaves without memorizing it.",
    entryQuestions: [
      "If an atom is almost entirely empty space, why can't your hand pass through the table?",
      "Chlorine has two stable isotopes, yet its atomic mass in the table is not a whole number. Can you estimate the isotope abundances from that number?",
    ],
    coreQuestions: [
      "What determines the identity of an element?",
      "How is average atomic mass calculated from isotope abundances?",
      "What do the rows and columns of the periodic table represent?",
    ],
    learningObjectives: [
      "Calculates the numbers of protons, neutrons and electrons in an atom or ion.",
      "Calculates average atomic mass from isotope abundances and solves the inverse problem.",
      "Distinguishes metals, nonmetals and metalloids from their position in the periodic table.",
    ],
    commonMisconceptions: [
      "Believing that electrons orbit the nucleus in fixed planet-like orbits.",
      "Thinking that isotopes have different chemical properties (they are chemically almost identical).",
    ],
    competitionApplications: ["Isotope and mass-spectrum questions in the early rounds of the chemistry olympiad"],
    links: {
      "phys.modern.atomic-nuclear": "nuclear structure and isotopes",
      "gk.sci-hist.modern-physics": "the historical development of atomic models",
    },
  },
  "chem.atoms.electron-config": {
    title: "Electron configuration and periodic trends",
    description: "Quantum numbers, orbitals, the Aufbau principle, the Pauli and Hund rules; trends in atomic radius, ionization energy and electronegativity.",
    whyItMatters: "Electron configuration determines which bonds an element will form, which ion it will produce and how reactive it is.",
    entryQuestions: [
      "Moving right across a period the number of electrons increases, yet the atom gets smaller. How can that be?",
      "Why is the first ionization energy of nitrogen greater than that of oxygen? Doesn't the trend say the opposite?",
    ],
    coreQuestions: [
      "In what order do electrons fill orbitals, and why?",
      "How does effective nuclear charge explain periodic trends?",
      "Why do exceptions to the trends arise?",
    ],
    learningObjectives: [
      "Writes electron configurations of atoms and ions and identifies valence electrons.",
      "Explains trends in atomic radius and ionization energy in terms of effective nuclear charge.",
      "Interprets successive ionization energy data to identify an element's group.",
    ],
    commonMisconceptions: [
      "Believing that orbitals are paths that electrons follow.",
      "Thinking that the 4s orbital always empties in the same order it fills relative to 3d (in transition-metal cations 4s empties first).",
    ],
    competitionApplications: ["Successive ionization energy and periodic trend questions"],
    links: {
      "phys.modern.quantum-intro": "orbitals are a consequence of quantum mechanics",
      "phys.mech.angular-momentum": "angular momentum quantum numbers",
    },
  },
  "chem.bond.bonding": {
    title: "Chemical bonding and molecular geometry",
    description: "Ionic, covalent and metallic bonds; Lewis structures, resonance, molecular geometry from VSEPR, hybridization and polarity.",
    whyItMatters: "A molecule's shape and polarity determine all of its properties, from its boiling point to its biological function.",
    entryQuestions: [
      "CO₂ and H₂O are both triatomic. Why is one linear and nonpolar, while the other is bent and polar?",
      "Why are all the C–C bonds in benzene the same length, when its Lewis structure shows alternating single and double bonds?",
    ],
    coreQuestions: [
      "How does the electronegativity difference determine the type of bond?",
      "How does VSEPR predict molecular geometry?",
      "What do resonance structures actually represent?",
    ],
    learningObjectives: [
      "Constructs Lewis structures and calculates formal charges for molecules and polyatomic ions.",
      "Predicts molecular geometry and bond angles using VSEPR.",
      "Justifies whether a molecule is polar from its geometry and bond polarities.",
    ],
    commonMisconceptions: [
      "Believing that every molecule containing polar bonds is polar.",
      "Thinking that the molecule rapidly flips back and forth between resonance structures.",
      "Believing that breaking a bond releases energy (bond formation releases energy).",
    ],
    competitionApplications: ["Lewis structure and geometry questions", "Comparisons of hybridization and polarity"],
    links: {
      "phys.em.charge-field": "bonds are electrostatic interactions",
      "phys.mech.oscillations": "bond vibrations are modeled as harmonic oscillators",
      "bio.molecules": "the structure of macromolecules rests on bond geometry",
    },
  },
  "chem.bond.intermolecular": {
    title: "Intermolecular forces",
    description: "London dispersion forces, dipole–dipole interactions, hydrogen bonding, ion–dipole interactions and their effect on physical properties.",
    whyItMatters: "They explain the unusual behavior of water, the DNA double helix, protein folding and the spontaneous formation of cell membranes.",
    entryQuestions: [
      "Water (H₂O) is not a lighter molecule than methane (CH₄), yet their boiling points differ by more than a hundred degrees. Why?",
      "How can geckos walk on a glass wall without any glue?",
    ],
    coreQuestions: [
      "How do intermolecular forces differ from chemical bonds?",
      "Which force dominates in which situation?",
      "How are boiling point, solubility and surface tension related to these forces?",
    ],
    learningObjectives: [
      "Identifies the dominant intermolecular force in a substance.",
      "Ranks a series of substances by boiling point and justifies the ranking.",
      "Explains the \"like dissolves like\" principle in terms of the balance of forces.",
    ],
    commonMisconceptions: [
      "Believing that boiling breaks the covalent bonds within molecules.",
      "Thinking that London forces are always the weakest force (they can dominate in large molecules).",
    ],
    competitionApplications: ["Boiling-point ranking and solubility questions"],
    links: {
      "bio.cell.membrane": "the hydrophobic effect and the lipid bilayer",
      "bio.molecules": "protein folding and DNA base pairing",
      "phys.mech.fluids": "surface tension",
    },
  },
  "chem.stoich.mole": {
    title: "The mole concept and stoichiometry",
    description: "The mole and Avogadro's number, molar mass, percent composition from chemical formulas, limiting reagent and yield calculations.",
    whyItMatters: "It is the common unit of every quantitative calculation in chemistry, used everywhere from preparing solutions in the lab to drug dosing.",
    entryQuestions: [
      "How many water molecules are in a glass of water? Estimate the order of magnitude before calculating.",
      "A recipe needs 2 eggs and 1 cup of flour; how many batches can you make with 5 eggs and 2 cups of flour? What does this correspond to in chemistry?",
    ],
    coreQuestions: [
      "How does the mole concept connect the microscopic and macroscopic worlds?",
      "How is the limiting reagent determined?",
      "How is an empirical formula found from mass percentages?",
    ],
    learningObjectives: [
      "Converts between mass, moles and number of particles.",
      "Calculates the limiting reagent and percent yield.",
      "Determines empirical and molecular formulas from combustion analysis data.",
    ],
    commonMisconceptions: [
      "Believing that the coefficients in an equation give mass ratios (they give mole ratios).",
      "Thinking that the reactant in excess determines the amount of product.",
    ],
    competitionApplications: ["Stoichiometry and formula determination questions (at every stage of the chemistry olympiad)"],
    links: {
      "phys.measure.units": "unit conversion and significant figures",
      "phys.olymp.estimation": "order-of-magnitude estimation at the Avogadro scale",
    },
  },
  "chem.react.types": {
    title: "Reaction types and balancing equations",
    description: "Precipitation, acid–base, combustion and redox reactions; net ionic equations and balancing by conservation of mass and charge.",
    whyItMatters: "Recognizing the type of a reaction is the first step in predicting its products; all of physical chemistry is built on these reactions.",
    entryQuestions: [
      "Mixing silver nitrate and sodium chloride solutions produces a white solid. Which ions remain 'spectators'?",
      "In a balanced equation, must the number of molecules on both sides be equal?",
    ],
    coreQuestions: [
      "How is the type of a reaction recognized?",
      "Why is the net ionic equation more meaningful?",
      "How are redox reactions balanced by the half-reaction method?",
    ],
    learningObjectives: [
      "Classifies reactions by type and predicts their products.",
      "Writes net ionic equations and identifies spectator ions.",
      "Balances redox reactions in acidic and basic solution using the half-reaction method.",
    ],
    commonMisconceptions: [
      "Believing it is acceptable to change subscripts when balancing.",
      "Thinking that every reaction goes to completion.",
    ],
    competitionApplications: ["Redox balancing and product prediction questions"],
    links: {
      "math.linalg.systems": "balancing an equation is a system of linear equations",
    },
  },
  "chem.gas.laws": {
    title: "The gas laws",
    description: "Boyle's, Charles's and Avogadro's laws, the ideal gas equation, partial pressures, gas stoichiometry and deviations of real gases.",
    whyItMatters: "From breathing to airbags, from atmospheric chemistry to laboratory gas calculations, a single equation lets you predict how gases behave.",
    entryQuestions: [
      "Why does a sealed bag of chips puff up as you drive up a mountain? Would it puff up even if the thermometer read the same?",
      "At the same temperature and pressure, would a balloon filled with helium or one filled with nitrogen contain more molecules?",
    ],
    coreQuestions: [
      "What assumptions underlie the ideal gas equation?",
      "How is Dalton's law of partial pressures used for mixtures?",
      "When and why do real gases deviate from ideal behavior?",
    ],
    learningObjectives: [
      "Calculates pressure, volume, temperature and amount of gas using the ideal gas equation.",
      "Calculates partial pressures and mole fractions in gas mixtures.",
      "Interprets the van der Waals corrections in terms of molecular volume and attractive forces.",
    ],
    commonMisconceptions: [
      "Believing that Celsius temperatures can be used directly in the gas laws.",
      "Thinking that heavier gas molecules exert a greater pressure at the same temperature.",
    ],
    competitionApplications: ["Gas stoichiometry and partial pressure questions"],
    links: {
      "phys.thermo.kinetic-theory": "microscopic derivation of the ideal gas law",
      "bio.physiology.systems": "partial pressures and gas exchange in respiration",
    },
  },
  "chem.solutions": {
    title: "Solutions and concentration",
    description: "The dissolution process, concentration units (molarity, molality, mass percent), dilution, solubility and colligative properties.",
    whyItMatters: "Most laboratory work is done with solutions; intracellular and extracellular fluids, osmosis and drug doses all rest on these concepts.",
    entryQuestions: [
      "Why is salt spread on roads in winter? Would sugar do the same job, and which would be more effective?",
      "Why does drinking seawater make you thirstier?",
    ],
    coreQuestions: [
      "How do you convert between concentration units?",
      "Why do colligative properties depend on the number of particles rather than the identity of the solute?",
      "How is osmotic pressure calculated?",
    ],
    learningObjectives: [
      "Performs calculations for preparing and diluting a solution of a given concentration.",
      "Calculates freezing-point depression and boiling-point elevation using the van 't Hoff factor.",
      "Predicts the direction of water flow from an osmotic pressure difference.",
    ],
    commonMisconceptions: [
      "Believing that salt 'disappears' when it dissolves in water.",
      "Thinking that molarity and molality are always equal.",
    ],
    competitionApplications: ["Concentration conversion and colligative property questions"],
    links: {
      "bio.cell.membrane": "osmosis and cell volume",
      "neuro.cell.membrane-potential": "intracellular and extracellular ion concentrations",
    },
  },
  "chem.thermo.thermochemistry": {
    title: "Thermochemistry and enthalpy",
    description: "Internal energy and enthalpy, exothermic and endothermic reactions, calorimetry, Hess's law, enthalpies of formation and bond energies.",
    whyItMatters: "Calculating how much energy a reaction releases or absorbs answers every energy question, from choosing a fuel to metabolism.",
    entryQuestions: [
      "If melting ice requires energy, how does ice cool your drink? Which way is the energy flowing?",
      "Can you find the enthalpy of a reaction without ever measuring it, using only data from other reactions?",
    ],
    coreQuestions: [
      "Why is enthalpy equal to the heat at constant pressure?",
      "Why does Hess's law hold?",
      "Why do bond energies and enthalpies of formation give slightly different results?",
    ],
    learningObjectives: [
      "Calculates reaction enthalpy from calorimetry data.",
      "Derives an unknown reaction enthalpy using Hess's law.",
      "Estimates reaction enthalpy from bond energies and explains the limits of this approximation.",
    ],
    commonMisconceptions: [
      "Believing that exothermic reactions are always spontaneous.",
      "Thinking that breaking bonds releases energy.",
    ],
    competitionApplications: ["Hess's law and Born–Haber cycle questions"],
    links: {
      "phys.thermo.laws": "the first law of thermodynamics",
      "phys.thermo.temperature-heat": "calorimetry and specific heat",
      "bio.energy.respiration": "the combustion energy of glucose",
    },
  },
  "chem.thermo.gibbs": {
    title: "Entropy, Gibbs free energy and spontaneity",
    description: "Entropy in chemical systems, Gibbs free energy, ΔG = ΔH − TΔS, standard free energy and its relation to the equilibrium constant.",
    whyItMatters: "It is the criterion that tells whether a reaction will occur spontaneously; the energetics of living things and the role of ATP are understood within this framework.",
    entryQuestions: [
      "Ice melts spontaneously at room temperature, yet the process absorbs heat. How can a heat-absorbing process be spontaneous?",
      "If living things lower entropy by building ordered structures, are they violating the second law?",
    ],
    coreQuestions: [
      "What criterion is used for spontaneity, and why?",
      "How can temperature change the sign of ΔG?",
      "How is ΔG° related to the equilibrium constant?",
    ],
    learningObjectives: [
      "Calculates the temperature range over which a reaction is spontaneous from ΔH and ΔS.",
      "Calculates the equilibrium constant using ΔG° = −RT ln K.",
      "Explains how coupled reactions (e.g. ATP hydrolysis) drive non-spontaneous processes.",
    ],
    commonMisconceptions: [
      "Believing that spontaneous reactions must be fast (thermodynamics says nothing about rate).",
      "Thinking that entropy need only be evaluated for the system (the surroundings must be counted too).",
    ],
    competitionApplications: ["Questions on ΔG, ΔH, ΔS and temperature", "The relation between the equilibrium constant and free energy"],
    links: {
      "phys.thermo.laws": "the second law and entropy",
      "phys.thermo.stat-mech": "the statistical definition of entropy",
      "bio.energy.respiration": "ATP and coupled reactions",
    },
  },
  "chem.kinetics": {
    title: "Reaction rates and kinetics",
    description: "Rate laws, reaction order, integrated rate equations, half-life, activation energy, the Arrhenius equation, mechanisms and catalysis.",
    whyItMatters: "Kinetics determines how fast a reaction proceeds; drug breakdown, enzyme activity and neurotransmitter clearance are understood through kinetic models.",
    entryQuestions: [
      "Raising the temperature by just 10 °C can roughly double the rate of some reactions. How, if the molecules don't speed up nearly that much?",
      "If diamond thermodynamically 'wants' to turn into graphite, why does the diamond in a ring last forever?",
    ],
    coreQuestions: [
      "Why can't the rate law be read off the balanced equation?",
      "How does activation energy explain temperature dependence?",
      "How does a catalyst increase the rate, and why doesn't it shift the equilibrium?",
    ],
    learningObjectives: [
      "Determines the rate law and reaction orders from initial-rate data.",
      "Derives first- and second-order integrated rate equations and identifies the order graphically.",
      "Calculates activation energy from an Arrhenius plot.",
    ],
    commonMisconceptions: [
      "Believing that the exponents in a rate law always equal the stoichiometric coefficients.",
      "Thinking that a catalyst shifts the equilibrium toward products.",
    ],
    researchApplications: ["Models of enzyme kinetics and drug pharmacokinetics"],
    competitionApplications: ["Rate-law determination and mechanism questions", "Arrhenius calculations"],
    links: {
      "math.ode.first-order": "rate equations are differential equations",
      "phys.thermo.stat-mech": "the Arrhenius factor is a Boltzmann factor",
      "bio.enzymes": "enzyme kinetics and Michaelis–Menten",
      "neuro.comp.hh-model": "first-order kinetics of ion channel gates",
    },
  },
  "chem.equilibrium": {
    title: "Chemical equilibrium",
    description: "Dynamic equilibrium, the equilibrium constants Kc and Kp, the reaction quotient Q, Le Chatelier's principle and equilibrium calculations.",
    whyItMatters: "Many reactions do not go to completion but stop at equilibrium; from acids to oxygen transport in blood to industrial production, equilibrium must be calculated.",
    entryQuestions: [
      "Has the reaction stopped at equilibrium? Think about what is happening at the molecular level.",
      "Why does a sealed bottle of soda fizz when you open it? Which equilibrium was disturbed?",
    ],
    coreQuestions: [
      "How does the equilibrium constant follow from the equality of the forward and reverse rates?",
      "How does comparing Q and K determine the direction of a reaction?",
      "In which situations can Le Chatelier's principle be misleading?",
    ],
    learningObjectives: [
      "Calculates equilibrium concentrations from initial concentrations using an ICE table.",
      "Predicts the direction of a reaction by comparing Q with K.",
      "Justifies the effect of changes in concentration, pressure and temperature on equilibrium.",
    ],
    commonMisconceptions: [
      "Believing that the concentrations of reactants and products are equal at equilibrium.",
      "Thinking that adding a catalyst changes the equilibrium constant.",
    ],
    competitionApplications: ["Equilibrium calculations and Le Chatelier questions", "Multiple-equilibrium problems"],
    links: {
      "phys.thermo.stat-mech": "the equilibrium constant and the Boltzmann distribution",
      "bio.physiology.systems": "the buffer equilibrium of blood and oxygen transport",
      "math.dyn.stability": "the stability of dynamic equilibrium",
    },
  },
  "chem.acid-base": {
    title: "Acids, bases and pH",
    description: "The Arrhenius, Brønsted–Lowry and Lewis definitions; pH, weak acid–base equilibria, buffer solutions, the Henderson–Hasselbalch equation and titration.",
    whyItMatters: "Blood pH, enzyme activity, soil chemistry and ocean acidification all depend on acid–base equilibria.",
    entryQuestions: [
      "How many times more acidic is a solution of pH 3 than one of pH 6? Twice?",
      "If a small amount of acid is added to your blood, its pH barely changes. What could make this possible?",
    ],
    coreQuestions: [
      "What is the difference between a strong and a weak acid?",
      "How do buffer solutions resist changes in pH?",
      "What does the shape of a titration curve tell us?",
    ],
    learningObjectives: [
      "Calculates the pH of strong and weak acid and base solutions.",
      "Designs a buffer at a given pH using the Henderson–Hasselbalch equation.",
      "Interprets the equivalence point and pKa from a titration curve.",
    ],
    commonMisconceptions: [
      "Believing that a concentrated weak acid is always more acidic than a dilute strong acid.",
      "Thinking that the pH at the equivalence point is always 7.",
    ],
    competitionApplications: ["pH, buffer and titration questions", "Titration practice in the laboratory round"],
    links: {
      "math.found.exp-log": "pH is a logarithmic scale",
      "bio.physiology.systems": "blood buffers and homeostasis",
      "gk.geo.climate-change": "ocean acidification",
    },
  },
  "chem.redox-electrochem": {
    title: "Redox and electrochemistry: the Nernst equation",
    description: "Oxidation states, galvanic and electrolytic cells, standard electrode potentials, ΔG = −nFE and the Nernst equation.",
    whyItMatters: "Batteries, corrosion and electrolysis rest on this topic; the same Nernst equation explains the resting potential of neurons.",
    entryQuestions: [
      "When a battery 'dies', have the chemicals inside run out, or has something else happened?",
      "If only the potassium concentration differs across a cell membrane, can a voltage arise without any chemical reaction?",
    ],
    coreQuestions: [
      "How do electrode potentials determine which half-reaction will occur?",
      "How is cell voltage related to free energy?",
      "How does the Nernst equation give the voltage of a concentration difference?",
    ],
    learningObjectives: [
      "Calculates the voltage and spontaneity of a galvanic cell from standard potentials.",
      "Derives the Nernst equation from ΔG = ΔG° + RT ln Q.",
      "Applies the Nernst equation to a concentration cell and to the membrane potential of an ion.",
    ],
    commonMisconceptions: [
      "Believing that a potential must be multiplied by the half-reaction coefficient (it is an intensive quantity).",
      "Thinking that the anode is always the positive terminal (the sign differs between galvanic and electrolytic cells).",
    ],
    researchApplications: ["Battery materials and electrophysiology"],
    competitionApplications: ["Cell voltage and Nernst questions", "Electrolysis and Faraday's laws"],
    links: {
      "neuro.cell.membrane-potential": "the Nernst equation gives the equilibrium potential of ions",
      "phys.em.potential": "electric potential difference",
      "bio.energy.respiration": "the electron transport chain is a redox sequence",
    },
  },
  "chem.organic.intro": {
    title: "Introduction to organic chemistry",
    description: "The bonding properties of carbon, functional groups, nomenclature, isomerism and stereochemistry, and the basic reaction types (addition, substitution, elimination).",
    whyItMatters: "This is the chemistry of living things, medicines and plastics; recognizing functional groups lets you predict how a molecule will behave.",
    entryQuestions: [
      "Of two substances with the same formula (C₂H₆O), one is drinkable and the other is a gas. How is that possible?",
      "Why can the mirror-image molecule of a drug have a completely different effect in the body?",
    ],
    coreQuestions: [
      "Why does carbon form such a variety of compounds?",
      "How do functional groups determine reactivity?",
      "What is chirality, and why does it matter in biology?",
    ],
    learningObjectives: [
      "Identifies functional groups in organic compounds and names them according to IUPAC rules.",
      "Distinguishes structural isomers from stereoisomers and identifies chiral centers.",
      "Predicts the product of basic reaction types and shows electron flow with curved arrows.",
    ],
    commonMisconceptions: [
      "Believing that organic compounds can be produced only by living things.",
      "Thinking that compounds with the same formula have the same properties.",
    ],
    competitionApplications: ["Organic structure determination and reaction questions"],
    links: {
      "bio.molecules": "the building blocks of biological macromolecules",
      "math.adv.abstract-algebra": "symmetry and chirality",
    },
  },
  "chem.biochem": {
    title: "The chemistry of biomolecules",
    description: "The chemical structure of carbohydrates, lipids, proteins and nucleic acids; peptide and glycosidic bonds, protein folding and the chemistry of biological reactions.",
    whyItMatters: "This is the bridge between chemistry and biology; enzymes, DNA and the cell membrane are understood through the chemical properties of these molecules.",
    entryQuestions: [
      "If proteins are built from only about twenty amino acids, how can they take on so many different functions?",
      "When you cook an egg, which bonds break and which do not?",
    ],
    coreQuestions: [
      "Which bonds hold biomolecules together?",
      "Which interactions maintain the four levels of protein structure?",
      "How is the relationship between structure and function established?",
    ],
    learningObjectives: [
      "Represents the formation of peptide, glycosidic and phosphodiester bonds as condensation reactions.",
      "Distinguishes the interactions that maintain each level of protein structure.",
      "Explains denaturation as the disruption of intermolecular forces.",
    ],
    commonMisconceptions: [
      "Believing that peptide bonds break during denaturation.",
      "Thinking that fats serve only as energy stores (they also form membranes and signaling molecules).",
    ],
    researchApplications: ["Structural biology and drug design"],
    competitionApplications: ["Biochemistry questions in the biology and chemistry olympiads"],
    links: {
      "bio.molecules": "biological macromolecules",
      "bio.enzymes": "the chemical structure of enzymes",
      "neuro.syn.transmission": "the chemistry of neurotransmitters",
    },
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_CHEMISTRY: Record<string, string> = {
  "Genel kimya": "General chemistry",
  "Atom ve bağ": "Atoms and bonding",
  "Tepkimeler ve madde": "Reactions and matter",
  "Fizikokimya": "Physical chemistry",
  "Enerji, hız ve denge": "Energy, rates and equilibrium",
  "Organik ve biyokimya": "Organic chemistry and biochemistry",
};
