import type { LOText } from "../../schema";

export const EN_PHYSICS_PLUS: Record<string, LOText> = {
  "phys.em.circuits-intro": {
    title: "Simple circuits: current, voltage, resistance (introduction)",
    description: "Current as the flow of charge, voltage as energy per unit charge, resistance as opposition to current; Ohm's law, resistors in series and parallel, and how ammeters and voltmeters are connected.",
    whyItMatters: "It is the language of all electricity and electronics; Kirchhoff's rules, RC circuits and the circuit model of the neuron membrane are built on this foundation.",
    entryQuestions: [
      "If you connect two identical bulbs in series to a battery instead of one, do they glow brighter or dimmer? What if you connect them in parallel? Predict first.",
      "When you flip a switch the bulb lights almost instantly, yet electrons drift through the wire at millimetres per second. How can that be?",
    ],
    coreQuestions: [
      "How are current, voltage and resistance related?",
      "How are current and voltage shared in series and parallel connections?",
      "How, and why, are meters connected to a circuit the way they are?",
    ],
    learningObjectives: [
      "Calculates the equivalent resistance and branch currents in series, parallel and mixed resistor networks.",
      "Draws a circuit diagram with correct symbols and places the ammeter and voltmeter correctly.",
      "Predicts, using power, how bulb brightness changes with the type of connection and justifies the prediction.",
    ],
    commonMisconceptions: [
      "Thinking current is 'used up' in a circuit and decreases after a bulb.",
      "Thinking a battery supplies a constant current (it is the voltage that is roughly constant).",
      "Thinking that adding a parallel branch increases the total resistance.",
    ],
    links: {
      "neuro.cell.membrane-potential": "the circuit model of the membrane as a resistor and battery (Nernst potential)",
      "cs.algo.logic-gates": "building logic gates from switched circuits",
    },
  },
  "phys.mech.relative-motion": {
    title: "Relative motion and reference frames",
    description: "How position, velocity and acceleration change with the observer; the Galilean transformation and velocity addition, swimmer-in-a-current and plane-in-the-wind problems, inertial reference frames.",
    whyItMatters: "Solving a problem in the right reference frame often halves the work; collisions, orbits and relativity all rest on this idea.",
    entryQuestions: [
      "A swimmer wants to cross a river in the shortest time: should they swim straight across, or angled upstream? What if they want the shortest path instead?",
      "Rain is falling vertically; does the angle at which you get wet change if you run? How should you tilt your umbrella?",
    ],
    coreQuestions: [
      "How are velocities transformed between different observers?",
      "Which reference frames are inertial, and why does that matter?",
    ],
    learningObjectives: [
      "Sets up relative-velocity problems with a vector diagram and solves them using components.",
      "Moves a problem into the reference frame that simplifies the calculation and converts the result back to the ground frame.",
      "Explains why Galilean velocity addition fails at speeds close to the speed of light.",
    ],
    commonMisconceptions: [
      "Thinking a motion has a single 'true' velocity independent of the observer.",
      "Thinking crossing in the shortest time and crossing by the shortest path are the same strategy.",
    ],
    links: {
      "math.geo.vectors": "velocity addition as vector addition",
      "space.sky.observation": "how sky motions appear from the rotating frame of the Earth",
    },
  },
  "phys.mech.energy-systems": {
    title: "Energy in systems: conservative forces and potential energy graphs",
    description: "Conservative and non-conservative forces, the relation F = −dU/dx, reading equilibrium points, turning points and stability from potential energy curves; energy bookkeeping in systems with friction.",
    whyItMatters: "It lets you predict motion from a U(x) graph without solving the equations; molecular bonds, orbits and oscillations are studied in the same language.",
    entryQuestions: [
      "A ball on top of a hill and a ball at the bottom of a dip: both feel zero net force. Which one is really 'in equilibrium'? How would you see the difference on a graph?",
      "You release a marble inside a bowl; can it ever roll over the rim? What information lets you decide for certain?",
    ],
    coreQuestions: [
      "How do you tell whether a force is conservative, and why is potential energy defined only for such forces?",
      "How are force, equilibrium and regions of motion read from a U(x) graph?",
      "How is energy tracked when non-conservative forces act?",
    ],
    learningObjectives: [
      "Derives U(x) from F(x) for a conservative force and proves the relation F = −dU/dx.",
      "Identifies stable and unstable equilibrium points on a potential energy graph and the allowed regions for a given total energy.",
      "Calculates the loss of mechanical energy in a system with friction as a transfer to internal energy.",
      "Predicts the frequency of small oscillations near a stable equilibrium from U''(x).",
    ],
    commonMisconceptions: [
      "Thinking every point of zero net force is a stable equilibrium.",
      "Thinking the zero of potential energy has a physical meaning.",
      "Thinking friction 'destroys' energy.",
    ],
    links: {
      "chem.bond.bonding": "bond length as the minimum of the potential energy curve",
      "math.dyn.stability": "stability analysis of equilibrium points",
    },
  },
  "phys.thermo.heat-transfer": {
    title: "Heat conduction, convection and radiation",
    description: "Fourier's law and thermal resistance in conduction, fluid motion in convection, the Stefan–Boltzmann law and black bodies in radiation; insulation and cooling problems.",
    whyItMatters: "It lets you estimate energy flow numerically, from insulating a house to the temperature of planets, from keeping body heat to cooling electronics.",
    entryQuestions: [
      "A metal spoon and a wooden spoon are both at room temperature. Which one feels colder? Is it actually colder?",
      "How does a vacuum flask keep hot tea hot and cold water cold? How does it block the three ways heat travels?",
    ],
    coreQuestions: [
      "Under what conditions does each of the three heat transfer mechanisms dominate?",
      "How is the heat flux through a layered wall calculated?",
      "How does the power a body radiates depend on its temperature?",
    ],
    learningObjectives: [
      "Calculates the heat flux through a layered surface by adding thermal resistances in series.",
      "Calculates the power radiated by a body and its equilibrium temperature using the Stefan–Boltzmann law.",
      "Identifies the dominant mechanism in an everyday heat-loss situation and proposes a measure to reduce it.",
    ],
    commonMisconceptions: [
      "Thinking an object that feels cold to the touch is at a lower temperature (it is a difference in thermal conductivity).",
      "Thinking only very hot objects emit radiation.",
    ],
    links: {
      "earth.atm.structure": "the Earth's radiative energy balance",
      "env.energy.resources": "energy efficiency and insulation in buildings",
      "space.stars.life": "stellar radiation and temperature",
    },
  },
  "phys.thermo.engines": {
    title: "Heat engines and efficiency",
    description: "Heat engine, refrigerator and heat pump cycles; work on P–V diagrams, the Carnot efficiency and the limit set by the second law; efficiency losses in real engines.",
    whyItMatters: "From power stations to car engines, from refrigerators to heat pumps, it gives the exact limit to the question 'how much of the energy can become work?'.",
    entryQuestions: [
      "Does a refrigerator with its door left open cool a closed room or heat it? Why?",
      "If engineers were given an unlimited budget, could they raise a heat engine's efficiency to 100%?",
    ],
    coreQuestions: [
      "Why is the efficiency of a heat engine limited by the second law?",
      "How is the Carnot efficiency derived and what does it depend on?",
      "Why can a heat pump move more heat than the electrical energy it uses?",
    ],
    learningObjectives: [
      "Derives the efficiency of the Carnot cycle for an ideal gas step by step.",
      "Calculates the net work done by a cycle and the heat absorbed and released from a P–V diagram.",
      "Calculates the coefficient of performance of a refrigerator and a heat pump and compares it with efficiency.",
      "Explains why the efficiency of a real engine stays below the Carnot limit.",
    ],
    commonMisconceptions: [
      "Thinking better engineering can bring any heat engine close to 100% efficiency.",
      "Thinking a coefficient of performance greater than 1 violates energy conservation.",
    ],
    competitionApplications: ["Cycle efficiency and P–V diagram problems in physics olympiads"],
    links: {
      "env.energy.resources": "power-station efficiency and waste heat",
      "chem.thermo.gibbs": "entropy and the criterion for spontaneity",
      "gk.world.industrial": "the role of the steam engine in the Industrial Revolution",
    },
  },
  "phys.modern.photoelectric": {
    title: "The photoelectric effect and the photon",
    description: "Ejection of electrons from a metal surface by light; threshold frequency, work function, stopping potential and Einstein's photon explanation E = hf; why the wave model is not enough.",
    whyItMatters: "It is the key experiment showing the particle side of light; solar cells, photomultipliers, camera sensors and spectroscopy rest on this idea.",
    entryQuestions: [
      "Very bright red light cannot eject electrons from a metal, but dim ultraviolet light can. If light is a wave, how can this be?",
      "If you double the intensity of the light, what happens to the maximum kinetic energy of the ejected electrons? Predict.",
    ],
    coreQuestions: [
      "Which predictions of the wave model do the photoelectric results contradict?",
      "How are stopping potential, frequency and work function related?",
    ],
    learningObjectives: [
      "Derives the relation eV₀ = hf − φ from energy conservation.",
      "Finds Planck's constant and the work function graphically from stopping potential versus frequency data.",
      "Predicts the effect of changes in intensity and frequency on the current and the maximum kinetic energy.",
    ],
    commonMisconceptions: [
      "Thinking that increasing the light intensity increases the electrons' energy (it only increases their number).",
      "Picturing the photon as a tiny marble, a classical particle.",
    ],
    links: {
      "chem.analysis.spectroscopy": "photon energy and interaction with matter",
      "gk.sci-hist.modern-physics": "the birth of the quantum idea",
      "env.energy.resources": "the working principle of solar cells",
    },
  },
  "phys.modern.nuclear-energy": {
    title: "Nuclear energy: fission and fusion",
    description: "The binding energy curve and mass defect, energy released via E = mc²; the fission chain reaction, critical mass, reactor control; conditions for fusion and energy production in stars.",
    whyItMatters: "It helps you understand why stars shine, how nuclear power stations work and the physical basis of energy policy debates.",
    entryQuestions: [
      "Both splitting a heavy nucleus and joining light nuclei release energy. This looks like a contradiction; how can both be true?",
      "Why does fusion happen on its own in the core of the Sun, yet is so hard to achieve on Earth?",
    ],
    coreQuestions: [
      "How does the binding energy per nucleon curve explain fission and fusion?",
      "How is a chain reaction sustained and how is it controlled?",
      "What conditions does fusion require?",
    ],
    learningObjectives: [
      "Calculates the energy released in a fission or fusion reaction from the mass defect.",
      "Predicts which reactions will release energy by interpreting the binding energy curve.",
      "Explains the role of the moderator and control rods in a reactor.",
    ],
    commonMisconceptions: [
      "Thinking mass 'disappears' into energy in nuclear reactions but never does so in chemical reactions.",
      "Thinking a nuclear power station can explode like a bomb.",
    ],
    links: {
      "space.stars.life": "fusion and energy production in stars",
      "env.energy.resources": "the advantages of nuclear energy and the waste problem",
      "chem.nuclear": "radioactive decay and nuclear reactions",
    },
  },
  "phys.modern.particles": {
    title: "Introduction to particle physics",
    description: "Elementary particles and the overall structure of the Standard Model: quarks, leptons, the four fundamental interactions and their mediating particles; using conservation laws to check whether reactions are possible.",
    whyItMatters: "It introduces the smallest building blocks of matter and the frontier of modern physics, and teaches you to use conservation laws as a bookkeeping tool.",
    entryQuestions: [
      "The proton and the neutron have almost the same mass. Is one 'elementary' and the other composite, or are both composite? How do we know?",
      "You wrote down a particle reaction: energy is conserved but charge is not. Can this reaction happen?",
    ],
    coreQuestions: [
      "What are the particle families and interactions of the Standard Model?",
      "Which conservation laws decide whether a reaction is possible?",
    ],
    learningObjectives: [
      "Checks whether a particle reaction conserves charge, baryon number and lepton number.",
      "Builds hadrons from their quark content using a charge calculation.",
      "Compares the four fundamental interactions by range, relative strength and mediating particle.",
    ],
    commonMisconceptions: [
      "Thinking the electron and the proton are 'elementary' in the same sense.",
      "Thinking antimatter exists only in science fiction.",
    ],
    links: {
      "math.adv.abstract-algebra": "the group-theory language of symmetries and conservation laws",
      "gk.phil.science": "unobservable entities and how theories are confirmed",
    },
  },
};

export const UNITS_PHYSICS_PLUS: Record<string, string> = {
  "Elektromanyetizma": "Electromagnetism",
  "Elektrostatik ve devreler": "Electrostatics and circuits",
  "Mekanik": "Mechanics",
  "Kinematik ve dinamik": "Kinematics and dynamics",
  "Dalgalar ve termodinamik": "Waves and thermodynamics",
  "Termodinamik": "Thermodynamics",
  "Optik ve modern fizik": "Optics and modern physics",
  "Modern fizik": "Modern physics",
};
