import type { LOText } from "../../schema";

export const EN_PHYSICS: Record<string, LOText> = {
  "phys.measure.units": {
    title: "Measurement, units, dimensional analysis and uncertainty",
    description: "SI units, unit conversion, checking formulas with dimensional analysis and propagation of measurement uncertainty.",
    whyItMatters: "It is the first sanity check for every physics calculation; in olympiads it lets you catch a wrong answer in seconds and guess the form of an unknown formula.",
    entryQuestions: [
      "If a pendulum's period depends on the string length, the mass and g, can you find the formula for the period just by looking at units? Why can't the mass appear in the formula?",
      "You measured 12.3 cm with a ruler. When computing an area from this number, how many digits is it honest to write?",
    ],
    coreQuestions: [
      "Does a dimensionally consistent equation have to be correct?",
      "How do measurement uncertainties combine under addition, multiplication and raising to a power?",
      "What information does the Buckingham π approach give, and what can it not give?",
    ],
    learningObjectives: [
      "Checks the dimensional consistency of a formula and locates the faulty term.",
      "Derives the form of an unknown relation up to a constant factor using dimensional analysis.",
      "Propagates measurement uncertainty through addition and multiplication and reports the result with the correct significant figures.",
    ],
    commonMisconceptions: [
      "Believing that a dimensionally correct formula must be correct (dimensionless factors and 2π are invisible).",
      "Thinking that writing down every digit on the calculator is more 'precise'.",
    ],
    competitionApplications: ["Checking olympiad answers with dimensional analysis", "Questions on guessing formulas by dimensional analysis"],
    links: {
      "chem.stoich.mole": "the same unit-conversion discipline in mole and concentration calculations",
      "res.data.management": "documenting measurement units and uncertainty in a dataset",
    },
  },
  "phys.mech.kinematics-1d": {
    title: "Motion in one dimension",
    description: "The derivative–integral relations between position, velocity and acceleration; equations of motion with constant acceleration and reading motion graphs.",
    whyItMatters: "It is the language of all mechanics; being able to read x–t and v–t graphs is also the basis for later reading current–time graphs in circuits and voltage–time graphs in neurons.",
    entryQuestions: [
      "When you throw a ball upward, is its acceleration zero at the highest point? Predict, then justify.",
      "Can a car with negative velocity be speeding up?",
    ],
    coreQuestions: [
      "How are position, velocity and acceleration obtained from one another?",
      "What do the area under a v–t graph and its slope tell us?",
      "What assumption underlies the constant-acceleration equations of motion?",
    ],
    learningObjectives: [
      "Derives the constant-acceleration equations of motion from a v–t graph.",
      "Converts between and interprets x–t, v–t and a–t graphs.",
      "Solves pursuit and meeting problems using relative motion.",
    ],
    commonMisconceptions: [
      "Believing that acceleration must be zero whenever velocity is zero.",
      "Thinking that negative acceleration always means slowing down.",
    ],
    competitionApplications: ["Graph-reading and relative-motion questions (first round of the national olympiad)", "Pursuit–catch-up problems"],
    links: {
      "math.calc.derivative-def": "velocity is the derivative of position; the physical meaning of the derivative",
      "math.calc.integral-def": "displacement is the area under the v–t curve",
    },
  },
  "phys.mech.kinematics-2d": {
    title: "Motion in two dimensions and projectile motion",
    description: "Splitting motion into independent components, projectile motion, relative velocity and switching between reference frames.",
    whyItMatters: "It forces vector thinking; projectile motion is the classic ground for optimization, envelope-curve and relative-motion questions in olympiads.",
    entryQuestions: [
      "Of two bullets, one fired horizontally and one simply dropped at the same moment, which hits the ground first?",
      "Without air resistance, maximum range needs 45°. If the launch is made down a slope, does the optimal angle get larger or smaller?",
    ],
    coreQuestions: [
      "Why can horizontal and vertical motion be treated independently?",
      "How does relative velocity transform between different observers?",
      "What is the boundary of the region reachable by a launch at a given speed?",
    ],
    learningObjectives: [
      "Derives the range, time of flight and maximum height relations for projectile motion.",
      "Solves relative-velocity problems with vector diagrams.",
      "Solves launches onto inclined surfaces and optimal-angle problems by optimization.",
    ],
    commonMisconceptions: [
      "Believing that the velocity is completely zero at the top of the trajectory (the horizontal component remains).",
      "Thinking that a heavier object will have a shorter range for the same launch.",
    ],
    competitionApplications: ["Projectile and safe-region (envelope parabola) problems", "Relative-velocity questions such as river crossings and flights in wind"],
    links: {
      "math.calc.parametric-polar": "the trajectory is a parametric curve",
      "math.calc.applications": "the optimal launch angle is an optimization problem",
    },
  },
  "phys.mech.newton": {
    title: "Newton's laws and free-body diagrams",
    description: "The concept of force, Newton's three laws, inertial reference frames and setting up equations of motion with free-body diagrams.",
    whyItMatters: "Most mechanics problems start with a correct free-body diagram; the same 'add up the forces, set up the equation' thinking is also used in electricity and fluids.",
    entryQuestions: [
      "If a horse pulls a cart and the cart pulls back on the horse with equal force, how can the system move at all?",
      "When an elevator moving upward is slowing down, does the scale show more or less than your true weight?",
    ],
    coreQuestions: [
      "Is force the cause of motion, or of a change in motion?",
      "Why don't action–reaction pairs cancel each other?",
      "When and how are fictitious forces used in an accelerating system?",
    ],
    learningObjectives: [
      "Draws correct free-body diagrams for multi-body systems.",
      "Calculates the accelerations of pulley, inclined-plane and connected-body systems.",
      "Distinguishes action–reaction pairs from balancing forces.",
      "Re-solves a problem in an accelerating reference frame using a fictitious force and compares the results.",
    ],
    commonMisconceptions: [
      "Believing that a constant force is needed to keep something moving (the Aristotelian intuition).",
      "Thinking that action and reaction forces act on the same object.",
      "Assuming that the normal force always equals the weight.",
    ],
    competitionApplications: ["Connected bodies and pulley systems (at every olympiad stage)", "Moving-wedge and accelerating-system questions"],
    links: {
      "gk.sci-hist.scientific-revolution": "the historical birth of Newtonian mechanics",
      "math.ode.first-order": "F = ma is a differential equation",
    },
  },
  "phys.mech.friction-forces": {
    title: "Friction, spring and tension forces",
    description: "Static and kinetic friction, Hooke's law, string tension and modeling drag forces.",
    whyItMatters: "These are the forces that separate realistic problems from idealized ones; the spring model reappears everywhere as a linear approximation, from molecular bonds to the neuron membrane.",
    entryQuestions: [
      "For a ladder leaning against a wall not to slip, is friction at the floor or at the wall more important?",
      "Why does a rope wrapped around a post make the load so much easier to hold after just two turns?",
    ],
    coreQuestions: [
      "Why is static friction an inequality rather than an equality?",
      "How do springs combine in series and in parallel?",
      "How does a drag force proportional to velocity change the motion?",
    ],
    learningObjectives: [
      "Distinguishes the regimes of static and kinetic friction and calculates the slipping threshold.",
      "Derives the equivalent constant of series and parallel spring systems.",
      "Calculates terminal velocity under linear drag using a differential equation.",
    ],
    commonMisconceptions: [
      "Believing that the friction force always equals μN.",
      "Thinking that friction always opposes the motion (when walking, the propulsive friction points forward).",
    ],
    competitionApplications: ["Questions on the slipping threshold and on tipping versus sliding", "Capstan (rope–cylinder) friction problems"],
    links: {
      "math.ode.first-order": "the terminal velocity problem is a first-order equation",
      "chem.bond.bonding": "a chemical bond behaves like a spring for small vibrations",
    },
  },
  "phys.mech.circular": {
    title: "Uniform circular motion",
    description: "Centripetal acceleration, force analysis in circular motion, banked curves, vertical circles and rotating reference frames.",
    whyItMatters: "Orbits, rotation and the motion of charged particles in magnetic fields are all built on circular motion.",
    entryQuestions: [
      "Is an object moving in a circle at constant speed accelerating? If so, in which direction?",
      "Does the 'centrifugal force' that pins you to the wall on a spinning fairground ride really exist?",
    ],
    coreQuestions: [
      "Is the centripetal force a separate force, or a role played by other forces?",
      "What is the condition for the string to go slack in a vertical circle?",
      "How is the safe frictionless speed on a banked curve found?",
    ],
    learningObjectives: [
      "Derives a = v²/r geometrically.",
      "Calculates the required forces in banked-curve, conical-pendulum and vertical-circle problems.",
      "Distinguishes the centripetal and centrifugal concepts for inertial and rotating observers.",
    ],
    commonMisconceptions: [
      "Drawing the centripetal force as an extra force on the free-body diagram.",
      "Believing that when the string breaks the object flies radially outward.",
    ],
    competitionApplications: ["Loop and string-breaking conditions in a vertical circle", "Equilibrium problems in rotating systems"],
    links: {
      "math.calc.parametric-polar": "acceleration components in polar coordinates",
    },
  },
  "phys.mech.work-energy": {
    title: "Work, energy and power",
    description: "The work–energy theorem, conservative forces and potential energy, conservation of mechanical energy, power and potential energy curves.",
    whyItMatters: "The energy method reaches the answer without tracking forces; reading a potential energy curve is also the key to understanding the reaction coordinate in chemistry and energy landscapes in neuroscience.",
    entryQuestions: [
      "A skier descends frictionlessly from the same height down two slopes of different steepness. Which is faster at the bottom?",
      "What net work do you do carrying a book upward at constant speed? Then why do you get tired?",
    ],
    coreQuestions: [
      "When is a force conservative, and why can potential energy be defined only then?",
      "What does F = −dU/dx tell us about equilibrium points?",
      "How is power related to force and velocity?",
    ],
    learningObjectives: [
      "Derives the work–energy theorem from Newton's second law.",
      "Interprets equilibrium points and their stability from a potential energy curve.",
      "Calculates the work done by a variable force using an integral.",
      "Compares energy conservation with the force method on the same problem and selects the appropriate one.",
    ],
    commonMisconceptions: [
      "Confusing which forces do work, rather than only the component along the motion; believing that the normal force does work.",
      "Thinking that energy conservation fails when there is friction (mechanical energy is not conserved, total energy is).",
    ],
    competitionApplications: ["Speed and height questions using energy conservation", "Stability analysis from a potential curve"],
    links: {
      "math.calc.integral-apps": "the work of a variable force is an application of integration",
      "chem.thermo.thermochemistry": "extending energy conservation to chemical reactions",
      "neuro.comp.attractors": "the analogy of energy landscapes and stable states",
    },
  },
  "phys.mech.momentum": {
    title: "Momentum, impulse and collisions",
    description: "Linear momentum, the impulse–momentum theorem, conservation of momentum, elastic and inelastic collisions, and variable-mass systems.",
    whyItMatters: "It is how to solve brief interactions where the force is unknown; the rocket equation, the microscopic explanation of gas pressure and particle physics all rest on momentum.",
    entryQuestions: [
      "If a billiard ball strikes an identical stationary ball off-center in an elastic collision, at what angle do the two balls separate?",
      "How does a rocket accelerate in empty space when there is nothing to push against?",
    ],
    coreQuestions: [
      "When is momentum conserved, and when is energy not conserved?",
      "Why do collisions look simpler in the center-of-mass frame?",
      "How is Newton's second law written for variable-mass systems?",
    ],
    learningObjectives: [
      "Solves one- and two-dimensional collisions using conservation laws.",
      "Derives the Tsiolkovsky rocket equation from conservation of momentum.",
      "Calculates and interprets energy loss using the coefficient of restitution.",
    ],
    commonMisconceptions: [
      "Believing that momentum is also lost in an inelastic collision.",
      "Thinking that momentum and kinetic energy carry the same information.",
    ],
    competitionApplications: ["Multi-body collision and billiard geometry questions", "Rocket and variable-mass (chain, sand) problems"],
    links: {
      "chem.gas.laws": "gas pressure is the momentum molecules transfer to the wall",
      "prog.sci.simulation": "checking conservation in collision simulations",
    },
  },
  "phys.mech.center-of-mass": {
    title: "Center of mass and systems of particles",
    description: "The center of mass of discrete and continuous systems, motion of the center of mass, reduced mass and the internal and external energy of systems.",
    whyItMatters: "It lets you summarize complex systems by the motion of a single point; reducing the two-body problem to a one-body problem goes through here.",
    entryQuestions: [
      "If a boatman in a boat resting on frictionless ice walks from one end of the boat to the other, how far does the boat move relative to the shore?",
      "Can a high jumper clear the bar while their center of mass passes below it?",
    ],
    coreQuestions: [
      "Why don't a system's internal forces affect the motion of its center of mass?",
      "How does kinetic energy split into center-of-mass and internal motion?",
      "How does reduced mass simplify the two-body problem?",
    ],
    learningObjectives: [
      "Calculates the center of mass of continuous bodies such as a uniform rod, a half-disk and a cone by integration.",
      "Derives König's theorem (the decomposition of kinetic energy).",
      "Converts the two-body problem into a one-body problem using reduced mass.",
    ],
    commonMisconceptions: [
      "Believing that the center of mass must always lie inside the object.",
      "Thinking that after an explosion the trajectory of the fragments' center of mass changes.",
    ],
    competitionApplications: ["Boat–person and exploding-projectile questions", "Center-of-mass calculations for continuous bodies"],
    links: {
      "math.calc.multiple-integrals": "the center of mass of continuous bodies is a multiple integral",
    },
  },
  "phys.mech.rotation-kinematics": {
    title: "Rotational kinematics",
    description: "Angular position, velocity and acceleration; the relations between linear and angular quantities and the rolling-without-slipping condition.",
    whyItMatters: "Rotational motion is the exact counterpart of linear kinematics; setting up this correspondence makes rotational dynamics come almost for free.",
    entryQuestions: [
      "How fast is the point of a wheel rolling without slipping that touches the ground moving at that instant?",
      "Does the top point of a bicycle wheel move faster than the bicycle itself?",
    ],
    coreQuestions: [
      "Why are angular quantities treated as vectors?",
      "Where does the rolling-without-slipping condition v = ωR come from?",
    ],
    learningObjectives: [
      "Derives the constant-angular-acceleration equations of motion from their linear counterparts.",
      "Calculates the velocities of different points on a rolling body vectorially.",
      "Interprets the velocity distribution using the concept of the instantaneous center of rotation.",
    ],
    commonMisconceptions: [
      "Believing that all points of a rolling wheel move forward at the same speed.",
      "Thinking that the angular velocity points within the plane of rotation.",
    ],
    competitionApplications: ["Rolling and instantaneous center of rotation questions"],
    links: {
      "math.geo.vectors": "v = ω × r is an application of the cross product",
    },
  },
  "phys.mech.torque": {
    title: "Torque and static equilibrium",
    description: "The concept of torque, the two conditions for static equilibrium, center of gravity, and tipping and slipping analysis.",
    whyItMatters: "Bridges, levers and muscles work by torque; static equilibrium questions in olympiads often hide the most elegant short solutions.",
    entryQuestions: [
      "Why is it so hard to push a door near its hinge? The force is the same, so what changes?",
      "How far beyond the edge of a table can you make a stack of identical bricks overhang? Is there a limit?",
    ],
    coreQuestions: [
      "About which point should torques be taken in static equilibrium, and why is the choice free?",
      "Will an object slide first or tip over first?",
      "Why do the lines of action of three forces in equilibrium meet at a single point?",
    ],
    learningObjectives: [
      "Selects a suitable pivot point for torque balance to reduce the number of unknowns.",
      "Calculates reaction forces in ladder, shelf and hanging-object problems.",
      "Compares the conditions for slipping and tipping to show which occurs first.",
    ],
    commonMisconceptions: [
      "Believing that torque depends only on the magnitude of the force.",
      "Thinking that an object in equilibrium has no forces acting on it.",
    ],
    competitionApplications: ["Ladder and tipping questions", "Quick solutions using the three-force theorem"],
    links: {
      "bio.physiology.systems": "the musculoskeletal system works as a set of levers",
      "math.found.sequences": "the harmonic series appears in the stacked-bricks problem",
    },
  },
  "phys.mech.rotation-dynamics": {
    title: "Rotational dynamics and moment of inertia",
    description: "τ = Iα, calculating moments of inertia, the parallel- and perpendicular-axis theorems, rotational kinetic energy and rolling dynamics.",
    whyItMatters: "Rolling bodies, flywheels and pendulums cannot be solved without rotational dynamics; this is one of the most frequently tested parts of olympiad mechanics.",
    entryQuestions: [
      "A solid cylinder and a hollow cylinder of the same mass and radius are released down the same ramp. Which reaches the bottom first? Would the result change if their masses differed?",
      "If you pull the string of a yo-yo horizontally, which way does it roll?",
    ],
    coreQuestions: [
      "How does the moment of inertia measure the way mass is distributed?",
      "Why is the parallel-axis theorem true?",
      "When does friction do no work on a rolling body?",
    ],
    learningObjectives: [
      "Derives the moments of inertia of a rod, disk, sphere and shell by integration.",
      "Proves and applies the parallel- and perpendicular-axis theorems.",
      "Solves rolling problems using both torque and energy methods.",
      "Calculates the period of a physical pendulum from its moment of inertia.",
    ],
    commonMisconceptions: [
      "Believing that the moment of inertia depends only on mass.",
      "Thinking that all of a rolling body's kinetic energy is translational.",
      "Believing that static friction always causes energy loss in rolling.",
    ],
    competitionApplications: ["Rolling-race-down-a-ramp questions", "Pulley–disk and yo-yo problems", "The bowling ball that starts sliding and transitions to rolling"],
    links: {
      "math.calc.multiple-integrals": "the moment of inertia is an integral over the mass distribution",
      "math.linalg.eigen": "the principal axes of the inertia tensor are eigenvectors",
    },
  },
  "phys.mech.angular-momentum": {
    title: "Angular momentum and its conservation",
    description: "Angular momentum of a particle and a rigid body, angular impulse, conditions for conservation, and the basics of gyroscopes and precession.",
    whyItMatters: "It is the key to central-force problems, the figure skater's spin and planetary orbits; it is also a fundamental conserved quantity in quantum mechanics.",
    entryQuestions: [
      "A figure skater spins faster when pulling in her arms. Does her kinetic energy increase too? If so, where does that energy come from?",
      "When you hold a spinning bicycle wheel by one end of its axle, why does it turn in the horizontal plane instead of falling?",
    ],
    coreQuestions: [
      "About which point is angular momentum conserved?",
      "Why is the areal velocity constant under a central force?",
      "How is the precession rate related to torque and angular momentum?",
    ],
    learningObjectives: [
      "Derives the conservation of angular momentum under a central force and connects it to Kepler's second law.",
      "Solves collisions in which linear and angular momentum are conserved together.",
      "Calculates the approximate precession frequency of a fast top.",
    ],
    commonMisconceptions: [
      "Believing that only rotating bodies have angular momentum (a particle moving in a straight line has it too).",
      "Thinking that if angular momentum is conserved, rotational kinetic energy is conserved too.",
    ],
    competitionApplications: ["Questions on a particle that hits and sticks to a rod", "Skater and rotating-platform problems", "Gyroscope and spinning-top precession"],
    links: {
      "math.geo.vectors": "L = r × p as a cross product",
      "chem.atoms.electron-config": "the angular momentum quantum numbers of orbitals",
    },
  },
  "phys.mech.gravitation": {
    title: "Universal gravitation and orbits",
    description: "Newton's law of gravitation, gravitational potential, the shell theorem, Kepler's laws, orbital energy and escape velocity.",
    whyItMatters: "It is the first great unification in physics; orbital mechanics reaches from space missions to binary stars and is an indispensable olympiad topic.",
    entryQuestions: [
      "Are astronauts in a satellite weightless because there is no gravity? Estimate how much g decreases at satellite altitude.",
      "What happens if an orbiting satellite fires its engine forward to catch up with a satellite ahead of it?",
    ],
    coreQuestions: [
      "Why does the shell theorem let us treat planets as point masses?",
      "Why does the energy of an elliptical orbit depend only on the semi-major axis?",
      "How are the escape velocity and the condition for a bound orbit found?",
    ],
    learningObjectives: [
      "Derives Kepler's third law for a circular orbit.",
      "Calculates escape velocity and orbital energy.",
      "Classifies orbit types using the effective potential.",
      "Demonstrates the consequences of the shell theorem by integration.",
    ],
    commonMisconceptions: [
      "Believing that the gravitational force on astronauts in orbit is zero.",
      "Thinking that firing forward to speed up will bring the satellite closer to the one ahead (it moves to a higher, slower orbit).",
    ],
    competitionApplications: ["Kepler's laws and orbital transfer (Hohmann) questions", "Binary star and reduced-mass problems", "Rough estimates of tidal forces"],
    links: {
      "gk.sci-hist.scientific-revolution": "the development of celestial mechanics from Kepler to Newton",
      "math.calc.parametric-polar": "in polar coordinates the orbit equation is a conic section",
    },
  },
  "phys.mech.oscillations": {
    title: "Simple harmonic motion",
    description: "Restoring forces, the equation of simple harmonic motion, period, energy and the small-oscillation approximation.",
    whyItMatters: "Every small motion around a stable equilibrium is a harmonic oscillator; waves, circuits, molecular vibrations and neuron models all grow out of this model.",
    entryQuestions: [
      "If you take a pendulum to the Moon, what happens to its period? What about a spring–mass system?",
      "If you dug a tunnel through the Earth and dropped a stone in, how long would it take to reach the other end? Estimate first.",
    ],
    coreQuestions: [
      "Why is motion around any potential minimum harmonic?",
      "Why doesn't the period depend on the amplitude, and when does this break down?",
      "How is energy shared between kinetic and potential forms?",
    ],
    learningObjectives: [
      "Derives the small-oscillation frequency from the second derivative of the potential energy.",
      "Calculates the periods of a spring–mass system, a simple pendulum and a physical pendulum.",
      "Determines the phase and amplitude of an oscillation from the initial conditions.",
    ],
    commonMisconceptions: [
      "Believing that a pendulum's period depends on its mass.",
      "Assuming that a pendulum swinging through large angles is still exactly harmonic.",
    ],
    competitionApplications: ["Finding small-oscillation frequencies (a classic olympiad question)", "Coupled springs and compound pendulums"],
    links: {
      "math.ode.linear-second": "a physical example of the equation x'' + ω²x = 0",
      "math.calc.taylor": "the small-oscillation approximation is the second-order Taylor expansion of the potential",
      "neuro.comp.phase-plane": "representing oscillations in the phase plane",
    },
  },
  "phys.mech.damped-driven": {
    title: "Damped and driven oscillations, resonance",
    description: "Types of damping (under-, critically and over-damped), the steady state of driven oscillation, the resonance curve, the quality factor and phase lag.",
    whyItMatters: "This is how real oscillators behave; resonance is everywhere, from bridge vibrations to radio receivers, from MRI machines to the frequency selectivity of neurons.",
    entryQuestions: [
      "How often should you push a child on a swing to get them as high as possible? Why doesn't pushing more often help?",
      "If a car's shock absorbers damp 'very well', does ride comfort go up or down?",
    ],
    coreQuestions: [
      "Why does critical damping give the fastest return to equilibrium?",
      "Why is the phase difference 90° at the resonance frequency?",
      "How does the quality factor determine the width of the resonance?",
    ],
    learningObjectives: [
      "Derives the three regimes of a damped oscillator from the characteristic equation.",
      "Derives the amplitude and phase of a driven oscillation using complex numbers.",
      "Relates the width of the resonance curve to the Q factor and calculates Q from data.",
    ],
    commonMisconceptions: [
      "Believing that the amplitude at resonance is always infinite.",
      "Thinking that a driven oscillation continues at its own natural frequency.",
    ],
    competitionApplications: ["Resonance and Q factor questions", "Extracting parameters from a resonance curve in the experimental exam"],
    links: {
      "math.complex.numbers": "the complex amplitude method",
      "neuro.cell.cable": "the membrane behaving as an RC filter and its frequency response",
      "math.ode.linear-second": "the particular solution of the inhomogeneous equation",
    },
  },
  "phys.mech.fluids": {
    title: "Fluid mechanics",
    description: "Pressure, Pascal's and Archimedes' principles, the continuity equation, Bernoulli's equation, and an introduction to viscosity and surface tension.",
    whyItMatters: "It opens a wide range of applications, from blood circulation to aircraft wings, from hydraulic pistons to a fish's swim bladder; it is a frequent olympiad topic in its own right.",
    entryQuestions: [
      "A glass of water with an ice cube floating in it is filled to the brim. Will it overflow when the ice melts?",
      "If you dip your finger into the water in a glass without touching the glass, what does the scale show?",
    ],
    coreQuestions: [
      "Where does the buoyant force come from?",
      "Under what assumptions is Bernoulli's equation valid?",
      "How do viscosity and the Reynolds number determine the character of a flow?",
    ],
    learningObjectives: [
      "Derives Archimedes' principle from the pressure difference.",
      "Derives Bernoulli's equation from energy conservation and applies it to Torricelli's problem.",
      "Calculates the equilibrium and small oscillations of floating bodies.",
    ],
    commonMisconceptions: [
      "Believing that the buoyant force depends on the weight of the object.",
      "Explaining the lift on an aircraft wing solely with the 'equal transit time' argument.",
    ],
    competitionApplications: ["Buoyancy and scale-reading questions", "Bernoulli and Torricelli draining problems", "Surface tension estimation questions"],
    links: {
      "bio.physiology.systems": "blood flow, pressure and vascular resistance",
      "math.ode.pde-intro": "the equations of fluid flow are partial differential equations",
    },
  },
  "phys.mech.lagrangian": {
    title: "Lagrangian mechanics",
    description: "Generalized coordinates, the principle of least action, the Euler–Lagrange equations, conserved quantities and their relation to symmetry.",
    whyItMatters: "It solves constrained systems without computing forces; it reveals the link between symmetry and conservation (Noether) and is the language of quantum and field theories.",
    entryQuestions: [
      "Why does light travelling between two media choose not the shortest path but the path of least time? Is nature 'calculating in advance'?",
      "If you tried to write the equations of a double pendulum using forces, how many unknown forces would you have to deal with?",
    ],
    coreQuestions: [
      "How do the Euler–Lagrange equations follow from the principle of least action?",
      "Why does a cyclic coordinate correspond to a conserved quantity?",
      "When is the Lagrangian method superior to Newton's method?",
    ],
    learningObjectives: [
      "Derives the Euler–Lagrange equations using the calculus of variations.",
      "Sets up the equations of motion for systems such as a double pendulum and a wedge sliding on an incline.",
      "Identifies conserved momenta from cyclic coordinates and explains Noether's relation.",
    ],
    commonMisconceptions: [
      "Believing that the Lagrangian is the total energy (L = T − V).",
      "Thinking that the principle of least action requires the action always to be a minimum (being stationary is enough).",
    ],
    researchApplications: ["Equations of motion in robotics and control systems", "The Lagrangian density in field theories"],
    competitionApplications: ["Setting up equations of motion for constrained systems (international level)", "Quick solutions to moving-wedge and bead-on-a-wire problems"],
    links: {
      "math.calc.multivar": "partial derivatives and the chain rule",
      "math.opt.optimization": "a variational principle is an optimization problem",
      "math.adv.abstract-algebra": "symmetry groups and conservation laws",
    },
  },
  "phys.mech.boss": {
    title: "Boss: Mechanics synthesis",
    description: "A synthesis exam of multi-stage problems that require momentum, energy, rotation, gravitation and oscillation all at once.",
    whyItMatters: "Real olympiad problems do not stay within a single topic; this synthesis tests your ability to choose which conservation law to use and when.",
    entryQuestions: [
      "In a problem where a particle hits the end of a rod and sticks, which quantities are conserved: momentum, angular momentum, energy? Why not all of them?",
      "When a problem looks 'unsolvable' on first reading, what are your first three steps?",
    ],
    coreQuestions: [
      "How can you quickly tell which conservation laws hold in a problem?",
      "How does the same problem simplify in different reference frames?",
      "How is the correctness of a result checked with limiting cases and dimensional analysis?",
    ],
    learningObjectives: [
      "Breaks a multi-stage mechanics problem into sub-stages and justifies the conserved quantities for each stage.",
      "Checks the solution using limiting cases and dimensional analysis.",
      "Derives a critical result from first principles and presents a written solution under time pressure.",
    ],
    commonMisconceptions: [
      "Assuming that energy is conserved in every problem involving a collision.",
      "Forgetting that the point about which torques are taken must be fixed.",
    ],
    competitionApplications: ["Mechanics problems from national and international olympiads", "Timed practice sets"],
    links: {
      "comp.phys.theory-practice": "the mechanics part of olympiad theory problems",
      "comp.meta.problem-solving": "the strategy of breaking a problem into stages",
    },
  },
  "phys.waves.basics": {
    title: "Waves: propagation, interference, standing waves",
    description: "The wave equation, wave speed, superposition, interference, reflection, standing waves and normal modes.",
    whyItMatters: "Sound, light, earthquakes and the quantum wave function use the same mathematics; the idea of normal modes appears in every area of physics.",
    entryQuestions: [
      "When two waves overlap at the same point and cancel each other, where does their energy go?",
      "Why does the fundamental tone disappear when you lightly touch the exact middle of a guitar string while plucking it?",
    ],
    coreQuestions: [
      "What does the wave speed on a taut string depend on, and why?",
      "How are the frequencies of standing waves determined by the boundary conditions?",
      "What is the difference between group velocity and phase velocity?",
    ],
    learningObjectives: [
      "Derives the wave equation for a taut string from Newton's law.",
      "Calculates standing-wave frequencies for different boundary conditions.",
      "Interprets the conditions for constructive and destructive interference in terms of path difference.",
    ],
    commonMisconceptions: [
      "Believing that the particles of the medium travel along with the wave.",
      "Thinking that energy is destroyed in destructive interference.",
    ],
    competitionApplications: ["Standing-wave and resonance-tube questions", "Wave-speed derivation problems"],
    links: {
      "math.ode.pde-intro": "the wave equation is a fundamental partial differential equation",
      "math.fourier": "every waveform can be decomposed into sinusoidal components",
      "neuro.sys.sensory": "frequency analysis in the cochlea",
    },
  },
  "phys.waves.sound": {
    title: "Sound and the Doppler effect",
    description: "The nature of sound waves, sound intensity and decibels, resonance in pipes, beats and the Doppler effect.",
    whyItMatters: "Hearing, music, ultrasound imaging and velocity measurement in astronomy all rest on this topic.",
    entryQuestions: [
      "Why does a passing ambulance's siren sound higher as it approaches and lower as it moves away? Would the effect be the same if you were the one moving?",
      "When the sound intensity doubles, does the decibel value double too?",
    ],
    coreQuestions: [
      "Why do the motions of the source and the observer affect the frequency differently?",
      "Where does the beat frequency come from?",
      "Why is the logarithmic decibel scale used?",
    ],
    learningObjectives: [
      "Derives the Doppler formula for a moving source and a moving observer.",
      "Calculates resonance frequencies in open and closed pipes.",
      "Converts decibel differences into intensity ratios.",
    ],
    commonMisconceptions: [
      "Believing that the speed of sound changes in the Doppler effect.",
      "Thinking that the frequency of a receding source keeps decreasing (at constant speed it stays constant).",
    ],
    competitionApplications: ["Doppler and reflected-sound questions", "Measuring the speed of sound with a resonance tube (experimental)"],
    links: {
      "neuro.sys.sensory": "the auditory system and frequency perception",
      "math.found.exp-log": "the decibel is a logarithmic scale",
      "gk.art.music": "intervals, harmonics and tuning",
    },
  },
  "phys.thermo.temperature-heat": {
    title: "Temperature, heat and thermal equilibrium",
    description: "Temperature scales, specific heat, phase changes, heat conduction, convection and radiation, and thermal expansion.",
    whyItMatters: "It connects energy transfer to everyday life; climate, cooking and body temperature regulation are understood from here.",
    entryQuestions: [
      "A metal bench and a wooden bench are at the same temperature. Which one feels colder? Why?",
      "Why doesn't the temperature of boiling water rise as you keep heating it?",
    ],
    coreQuestions: [
      "What is the difference between heat and temperature?",
      "How is thermal equilibrium used in mixing problems?",
      "What does the rate of heat conduction depend on?",
    ],
    learningObjectives: [
      "Calculates the final temperature in mixing problems involving phase changes.",
      "Distinguishes the concepts of heat and temperature using everyday examples.",
      "Models heat conduction through layered walls using the electrical resistance analogy.",
    ],
    commonMisconceptions: [
      "Believing that heat is a substance contained in an object.",
      "Thinking that metal feels cold because it is colder.",
    ],
    competitionApplications: ["Calorimetry and phase-change questions", "Heat conduction estimation problems"],
    links: {
      "chem.thermo.thermochemistry": "heat of reaction and calorimetry",
      "bio.physiology.systems": "regulation of body temperature",
      "gk.geo.climate-change": "energy balance and radiation",
    },
  },
  "phys.thermo.kinetic-theory": {
    title: "The kinetic theory of gases",
    description: "The microscopic model of an ideal gas, the molecular origin of pressure, the relation between temperature and average kinetic energy, equipartition and the idea of a speed distribution.",
    whyItMatters: "It is the first example showing that macroscopic quantities emerge from microscopic averages; it is a bridge to statistical physics and to reaction rates in chemistry.",
    entryQuestions: [
      "If the air molecules in a room move at hundreds of meters per second, why does the scent of an opened perfume take minutes to reach the opposite corner?",
      "At the same temperature, which moves faster: hydrogen molecules or oxygen molecules? By what factor?",
    ],
    coreQuestions: [
      "How is pressure derived from molecular collisions?",
      "Why is temperature a measure of average kinetic energy?",
      "How does the equipartition principle explain the heat capacities of gases?",
    ],
    learningObjectives: [
      "Derives pV = (1/3)Nm⟨v²⟩ from momentum transfer.",
      "Calculates the root-mean-square speed and the mean free path.",
      "Predicts the heat capacities of monatomic and diatomic gases using the equipartition principle.",
    ],
    commonMisconceptions: [
      "Believing that all molecules move at the same speed.",
      "Thinking that temperature is meaningful for a single molecule.",
    ],
    competitionApplications: ["Pressure and effusion questions using kinetic theory", "Estimating the mean free path"],
    links: {
      "chem.gas.laws": "the microscopic explanation of the ideal gas law",
      "math.prob.random-vars": "the speed distribution in terms of mean and variance",
      "chem.kinetics": "collision theory and reaction rate",
    },
  },
  "phys.thermo.laws": {
    title: "The laws of thermodynamics and entropy",
    description: "The first law, internal energy, processes on the PV diagram, heat engines, Carnot efficiency, the second law and entropy.",
    whyItMatters: "It sets the limit on how much energy can be turned into work; it applies from engines to refrigerators, from chemical spontaneity to how living things use energy.",
    entryQuestions: [
      "If you leave the refrigerator door open, does the kitchen cool down or warm up?",
      "Could a perfect engine with no heat losses turn all of its fuel energy into work?",
    ],
    coreQuestions: [
      "How are heat, work and internal energy related?",
      "Why can't the Carnot efficiency be exceeded?",
      "Why is entropy the natural language of the second law?",
    ],
    learningObjectives: [
      "Calculates work and heat in isothermal, adiabatic, isobaric and isochoric processes.",
      "Derives the relation pVᵞ = constant for an adiabatic process.",
      "Proves from the second law that the Carnot efficiency is an upper bound.",
      "Calculates entropy changes in irreversible processes.",
    ],
    commonMisconceptions: [
      "Believing that heat is a state function.",
      "Thinking that entropy is merely 'disorder' and must increase in every system (it increases in an isolated system).",
    ],
    competitionApplications: ["Efficiency calculations for PV cycles", "Adiabatic processes and atmosphere questions", "Entropy change problems"],
    links: {
      "chem.thermo.gibbs": "spontaneity and free energy",
      "bio.energy.respiration": "the efficiency of energy conversion in living things",
      "gk.world.industrial": "steam engines and the birth of thermodynamics",
    },
  },
  "phys.thermo.stat-mech": {
    title: "Introduction to statistical mechanics: the Boltzmann distribution",
    description: "Microstates and macrostates, S = k ln Ω, the Boltzmann factor, the partition function and two-level systems.",
    whyItMatters: "It derives thermodynamics from probability; chemical equilibrium, the open probability of ion channels and energy-based models in machine learning all use the same Boltzmann factor.",
    entryQuestions: [
      "Is it physically forbidden for all the air molecules in a room to gather spontaneously in one corner, or is it just extremely improbable?",
      "Can you explain the thin air at the top of high mountains with a single exponential factor?",
    ],
    coreQuestions: [
      "Why is entropy the logarithm of the number of microstates?",
      "Where does the Boltzmann factor come from?",
      "How is the average energy obtained from the partition function?",
    ],
    learningObjectives: [
      "Derives the Boltzmann distribution for a system in contact with a heat bath.",
      "Calculates the average energy and heat capacity of a two-level system.",
      "Derives the barometric formula from the Boltzmann factor.",
    ],
    commonMisconceptions: [
      "Believing that the second law is an absolute prohibition rather than a statistical statement.",
      "Thinking that high-energy states are never occupied.",
    ],
    researchApplications: ["Protein folding and channel kinetics in biophysics", "Energy-based machine learning models"],
    competitionApplications: ["Two-level system and barometric formula questions (international olympiad)"],
    links: {
      "math.info.entropy": "the common form of Gibbs and Shannon entropy",
      "neuro.cell.action-potential": "the Boltzmann curve of ion channel gates",
      "chem.equilibrium": "the equilibrium constant and the Boltzmann factor",
      "prog.ml.neural-nets": "softmax is a Boltzmann distribution",
    },
  },
  "phys.em.charge-field": {
    title: "Electric charge, Coulomb's law and the electric field",
    description: "Conservation and quantization of charge, Coulomb's law, superposition, electric field lines and the fields of continuous charge distributions.",
    whyItMatters: "It is the basis of the interaction that holds matter together, from the chemical bond to the membrane of a nerve cell.",
    entryQuestions: [
      "If the electric force is so much stronger than gravity, why aren't we constantly being pulled and pushed in everyday life?",
      "Why does a charged comb attract neutral bits of paper?",
    ],
    coreQuestions: [
      "How does the field concept redefine action at a distance?",
      "How is the field of a continuous charge distribution calculated?",
      "Why are neutral objects affected by an electric field?",
    ],
    learningObjectives: [
      "Calculates the field of systems of point charges using superposition.",
      "Derives the on-axis field of a charged rod and a charged ring by integration.",
      "Explains the attraction of neutral objects through polarization.",
    ],
    commonMisconceptions: [
      "Believing that field lines are the paths a charged particle will follow.",
      "Thinking that neutral objects do not interact with electric fields at all.",
    ],
    competitionApplications: ["Superposition and symmetry questions", "Problems on the fields of charged rings and rods"],
    links: {
      "chem.bond.intermolecular": "dipoles and the Coulomb interaction",
      "neuro.cell.membrane-potential": "the motion of ions in an electric field",
      "math.calc.integral-apps": "the fields of continuous distributions",
    },
  },
  "phys.em.gauss": {
    title: "Gauss's law",
    description: "Electric flux, Gauss's law, the fields of symmetric charge distributions and the electrostatic properties of conductors.",
    whyItMatters: "In symmetric situations it reduces an integral calculation to a single line; it is the first of Maxwell's equations.",
    entryQuestions: [
      "Why is the electric field inside a charged metal sphere zero? What changes if the sphere is hollow and you put a charge inside?",
      "Why doesn't the field of an infinite charged plane decrease with distance?",
    ],
    coreQuestions: [
      "Why does the flux through a closed surface depend only on the enclosed charge?",
      "In which situations is Gauss's law enough to calculate the field?",
      "Why does charge collect on the surface of a conductor?",
    ],
    learningObjectives: [
      "Derives the fields of spherically, cylindrically and planar-symmetric distributions using Gauss's law.",
      "Proves the integral form of Gauss's law from Coulomb's law.",
      "Determines the charge distribution in conducting-shell and cavity problems.",
    ],
    commonMisconceptions: [
      "Believing that charges outside the Gaussian surface do not affect the field on the surface (they do not affect the flux, but they do affect the field).",
      "Thinking that Gauss's law holds only in symmetric situations (it always holds; it is only useful with symmetry).",
    ],
    competitionApplications: ["Field calculations for symmetric distributions", "Conducting shells and image-charge problems"],
    links: {
      "math.calc.vector-calc": "the differential form via the divergence theorem",
      "math.calc.multiple-integrals": "flux as a surface integral",
    },
  },
  "phys.em.potential": {
    title: "Electric potential and potential energy",
    description: "Electric potential, equipotential surfaces, the gradient relation between field and potential, and the potential energy of charge systems.",
    whyItMatters: "Voltage in circuits, the potential difference across a neuron's membrane and the cell potential in electrochemistry are all this same concept.",
    entryQuestions: [
      "Why don't birds get electrocuted when they land on a high-voltage line? What would happen if one foot touched the ground?",
      "At a point where the electric field is zero, must the potential also be zero?",
    ],
    coreQuestions: [
      "What is the difference between potential and potential energy?",
      "How is the relation E = −∇V interpreted?",
      "How is the energy needed to assemble a system of charges calculated?",
    ],
    learningObjectives: [
      "Calculates the potential of point and continuous distributions.",
      "Interprets the direction and magnitude of the field from equipotential surfaces.",
      "Calculates the electrostatic potential energy of charge systems.",
    ],
    commonMisconceptions: [
      "Believing that the potential is zero wherever the field is zero.",
      "Thinking that voltage is an absolute value at a point (it is always relative to a reference).",
    ],
    competitionApplications: ["Potential energy and charge-system questions", "Acceleration of a charged particle in a field"],
    links: {
      "neuro.cell.membrane-potential": "the membrane potential is a potential difference",
      "chem.redox-electrochem": "electrode potentials and cell voltage",
      "math.calc.multivar": "the gradient",
    },
  },
  "phys.em.capacitance": {
    title: "Conductors, capacitors and dielectrics",
    description: "Charge distribution on conductors, capacitance, series and parallel capacitors, stored energy and the effect of dielectrics.",
    whyItMatters: "It is the circuit element that stores energy; the cell membrane also behaves like a capacitor and sits at the heart of neuron models.",
    entryQuestions: [
      "If you pull apart the plates of a charged capacitor, does the stored energy increase or decrease? Does the answer change if the battery stays connected?",
      "A cell membrane is a few nanometers thick. Estimate whether this thin insulating layer has a large or small capacitance.",
    ],
    coreQuestions: [
      "Why does capacitance depend only on geometry and material?",
      "Where is the energy in a capacitor stored?",
      "Why does a dielectric material increase capacitance?",
    ],
    learningObjectives: [
      "Derives the capacitance of parallel-plate, spherical and cylindrical capacitors.",
      "Solves networks of capacitors connected in series and in parallel.",
      "Calculates the energy density of the electric field and interprets the effect of a dielectric.",
    ],
    commonMisconceptions: [
      "Believing that a capacitor 'stores' charge (its net charge is zero; it stores energy).",
      "Thinking that the capacitances of capacitors in series add up.",
    ],
    competitionApplications: ["Dielectric-insertion and plate-sliding questions", "Energy-conservation pitfalls in capacitor networks"],
    links: {
      "neuro.cell.membrane-potential": "the capacitance of the cell membrane",
      "neuro.comp.lif": "the membrane capacitor in the LIF model",
    },
  },
  "phys.em.circuits-dc": {
    title: "Direct-current circuits: Ohm and Kirchhoff",
    description: "Current, resistance, Ohm's law, series and parallel connections, Kirchhoff's rules, internal resistance and power.",
    whyItMatters: "It is the foundation of every electronic system and of equivalent-circuit models of neurons; Kirchhoff's rules are conservation laws in circuit form.",
    entryQuestions: [
      "What would happen if the lamps in your home were wired in series? When one lamp burned out, what would the others do?",
      "If you connect a very small resistance across the terminals of a battery, why doesn't an unlimited current flow?",
    ],
    coreQuestions: [
      "Which conservation laws do Kirchhoff's rules come from?",
      "How are complex resistor networks solved systematically?",
      "When is the maximum power drawn from a source?",
    ],
    learningObjectives: [
      "Converts multi-loop circuits into a system of linear equations using Kirchhoff's rules and solves it.",
      "Simplifies complex resistor networks using symmetry and equipotential points.",
      "Derives the condition for maximum power transfer.",
    ],
    commonMisconceptions: [
      "Believing that current is 'used up' in a circuit.",
      "Thinking that a battery always delivers a constant current.",
    ],
    competitionApplications: ["Infinite resistor ladder and resistor cube questions", "Simplifying circuits with symmetry"],
    links: {
      "math.linalg.systems": "loop currents form a system of equations",
      "neuro.cell.membrane-potential": "the parallel conductance model",
      "math.discrete.graph-theory": "a circuit is a graph",
    },
  },
  "phys.em.rc-circuits": {
    title: "RC circuits",
    description: "Charging and discharging a capacitor, the time constant, exponential approach and the filtering behavior of RC circuits.",
    whyItMatters: "It is the first step toward time-varying circuits; the LIF neuron model is exactly an RC circuit.",
    entryQuestions: [
      "When you charge a capacitor through a resistor, how much of the energy delivered by the battery ends up in the capacitor? Does changing the resistance change this fraction?",
      "Why does a camera flash first 'charge up' for a few seconds and then fire all at once?",
    ],
    coreQuestions: [
      "What does the time constant RC determine?",
      "Why does the circuit approach equilibrium exponentially?",
      "Why is half of the energy dissipated in the resistor during charging?",
    ],
    learningObjectives: [
      "Derives the current and voltage expressions for charging and discharging from the differential equation.",
      "Extracts the time constant from an experimental curve.",
      "Interprets the parameters by mapping the RC circuit onto the LIF neuron model.",
    ],
    commonMisconceptions: [
      "Believing that a capacitor is fully charged after one time constant (it is about 63%).",
      "Thinking that direct current flows continuously through a capacitor.",
    ],
    researchApplications: ["Electrical modeling of the neuron membrane"],
    competitionApplications: ["Measuring the RC time constant (experimental exam)", "Questions on circuits with switches opening and closing"],
    links: {
      "neuro.comp.lif": "the LIF model is an RC circuit with a threshold added",
      "neuro.cell.cable": "dendritic segments are an RC chain",
      "math.ode.first-order": "a linear first-order equation",
    },
  },
  "phys.em.magnetism": {
    title: "Magnetic fields and magnetic force",
    description: "The Lorentz force, the motion of charged particles in a magnetic field, the force on a current-carrying wire, and the Biot–Savart and Ampère laws.",
    whyItMatters: "Electric motors, mass spectrometers, particle accelerators and MRI imaging rely on the magnetic force.",
    entryQuestions: [
      "Can a magnetic force change the velocity of a charged particle? What about its kinetic energy?",
      "Do two parallel wires carrying current in the same direction attract or repel each other? Make a prediction.",
    ],
    coreQuestions: [
      "Why does the magnetic force do no work?",
      "How do currents create magnetic fields?",
      "For which symmetries is Ampère's law useful?",
    ],
    learningObjectives: [
      "Calculates the circular and helical trajectories of a charged particle in a magnetic field.",
      "Derives the fields of a straight wire, a loop and a solenoid using the Biot–Savart and Ampère laws.",
      "Explains how a velocity selector and a mass spectrometer work.",
    ],
    commonMisconceptions: [
      "Believing that the magnetic force pushes the particle along the field lines.",
      "Thinking that a magnetic field also exerts a force on stationary charges.",
    ],
    competitionApplications: ["Charged-particle trajectory and velocity-selector questions", "Field calculations with Biot–Savart"],
    links: {
      "math.geo.vectors": "F = qv × B as a cross product",
      "neuro.methods.imaging": "the physical basis of MRI",
    },
  },
  "phys.em.induction": {
    title: "Electromagnetic induction: Faraday and Lenz",
    description: "Magnetic flux, Faraday's law, Lenz's rule, motional emf, self- and mutual inductance, and the energy of the magnetic field.",
    whyItMatters: "Generators, transformers and wireless charging work by induction; this is where electricity and magnetism come together.",
    entryQuestions: [
      "Why does a magnet dropped through a copper pipe fall slowly? What happens in a plastic pipe?",
      "If you translate a loop through a uniform magnetic field without rotating it, is a current produced?",
    ],
    coreQuestions: [
      "How is the induced emf related to the change in flux?",
      "How does Lenz's rule reflect energy conservation?",
      "Why does an inductor behave like 'inertia' in a circuit?",
    ],
    learningObjectives: [
      "Derives the emf for a moving rod and a rotating loop.",
      "Determines the direction of the induced current with Lenz's rule and justifies it by energy balance.",
      "Calculates the self-inductance of a solenoid and the energy stored in it.",
    ],
    commonMisconceptions: [
      "Believing that a large flux produces a large emf (it is the rate of change that matters).",
      "Thinking that Lenz's rule opposes the flux itself (it opposes the change).",
    ],
    competitionApplications: ["Rod sliding on rails and terminal-velocity questions", "Falling magnets and eddy currents", "Mutual inductance calculations"],
    links: {
      "math.calc.derivative-def": "emf is the time derivative of flux",
      "neuro.methods.electrophysiology": "the principle of transcranial magnetic stimulation",
    },
  },
  "phys.em.ac-rlc": {
    title: "Alternating current and RLC circuits",
    description: "Sinusoidal current, impedance, phasors, resonance in RLC circuits, power factor and LC oscillation.",
    whyItMatters: "The power grid and radio receivers run on AC circuits; the RLC circuit is the exact electrical counterpart of the mechanical oscillator.",
    entryQuestions: [
      "In a series RLC circuit, can the voltages across the capacitor and the inductor individually exceed the source voltage? Does this violate energy conservation?",
      "How does a radio select just one station?",
    ],
    coreQuestions: [
      "Why is impedance most naturally expressed as a complex number?",
      "At what frequency does an RLC circuit resonate?",
      "What is the correspondence between mechanical and electrical oscillators?",
    ],
    learningObjectives: [
      "Calculates the impedance of series and parallel RLC circuits using the phasor method.",
      "Derives the oscillation frequency of an LC circuit from the differential equation.",
      "Constructs and uses the correspondence between an RLC circuit and a damped mechanical oscillator.",
    ],
    commonMisconceptions: [
      "Believing that rms values add directly in an AC circuit.",
      "Thinking that there is no energy loss at all in the circuit at resonance.",
    ],
    competitionApplications: ["RLC resonance and power questions", "Solving via the mechanical–electrical correspondence"],
    links: {
      "math.complex.numbers": "phasors are complex numbers",
      "neuro.comp.hh-model": "the equivalent circuit of the conductances in the HH model",
      "math.ode.linear-second": "the same equation, different physics",
    },
  },
  "phys.em.maxwell": {
    title: "Maxwell's equations and electromagnetic waves",
    description: "The integral and differential forms of the four Maxwell equations, displacement current, the electromagnetic wave equation and the speed of light.",
    whyItMatters: "It unites electricity, magnetism and optics in a single theory; it shows that light is an electromagnetic wave and is the starting point of relativity.",
    entryQuestions: [
      "If no charge flows between the plates of a capacitor, why does Ampère's law break down there? How did Maxwell fix it?",
      "Can you build a speed out of the electric and magnetic constants? Calculate its numerical value and compare it with a familiar number.",
    ],
    coreQuestions: [
      "Why is the displacement current necessary?",
      "How does the wave equation follow from Maxwell's equations?",
      "Does an electromagnetic wave carry energy and momentum?",
    ],
    learningObjectives: [
      "Derives the electromagnetic wave equation in vacuum from Maxwell's equations.",
      "Proves the necessity of the displacement current using charge conservation.",
      "Calculates radiation intensity and radiation pressure using the Poynting vector.",
    ],
    commonMisconceptions: [
      "Believing that electromagnetic waves need a medium to propagate.",
      "Thinking that in a wave the electric and magnetic fields arise alternately as each other's 'cause' (they oscillate together).",
    ],
    researchApplications: ["Antenna and waveguide design", "Modeling electromagnetic fields in biological tissue"],
    competitionApplications: ["Radiation pressure and Poynting vector questions (international level)"],
    links: {
      "math.calc.vector-calc": "the differential form via divergence and curl",
      "math.ode.pde-intro": "the wave equation",
      "gk.sci-hist.modern-physics": "Maxwell's unification and the road to relativity",
    },
  },
  "phys.optics.geometric": {
    title: "Geometric optics: reflection, refraction, lenses",
    description: "The laws of reflection and refraction, total internal reflection, mirrors, thin lenses, optical instruments and Fermat's principle.",
    whyItMatters: "How the eye, the camera, the microscope and the telescope work is understood from here; in olympiads it produces short but geometry-heavy questions.",
    entryQuestions: [
      "Why does the bottom of a pool look shallower than it really is? Does it look shallower from the side or from directly above?",
      "What is the minimum length of a flat mirror in which you can see your whole body? Does stepping back from the mirror change this?",
    ],
    coreQuestions: [
      "How does Snell's law follow from Fermat's principle?",
      "What approximations does the thin-lens equation rest on?",
      "How do microscopes and telescopes achieve magnification?",
    ],
    learningObjectives: [
      "Derives Snell's law from Fermat's principle.",
      "Finds the image position and magnification in thin-lens and mirror systems using ray diagrams and calculation.",
      "Calculates the condition for total internal reflection and applies it to fiber optics.",
    ],
    commonMisconceptions: [
      "Believing that covering half of a lens makes half of the image disappear.",
      "Thinking that a mirror image is reversed left to right (it is reversed front to back).",
    ],
    competitionApplications: ["Lens-system and image questions", "Refraction and apparent-depth problems", "Measuring focal length in the experimental exam"],
    links: {
      "math.geo.euclid": "ray geometry and similar triangles",
      "neuro.sys.sensory": "the optics of the eye and the image on the retina",
      "gk.sci-hist.ancient-medieval": "Ibn al-Haytham and the history of optics",
    },
  },
  "phys.optics.wave": {
    title: "Wave optics: interference and diffraction",
    description: "Young's double-slit experiment, thin-film interference, single slits and diffraction gratings, the resolution limit and polarization.",
    whyItMatters: "It is the evidence for the wave nature of light; it lets you understand the resolution limit of microscopes, spectroscopy and the interference experiments of quantum physics.",
    entryQuestions: [
      "Why does a soap bubble look colored, and why does it turn black just before it bursts?",
      "Can a telescope with an aperture twice as wide resolve stars that are twice as close together?",
    ],
    coreQuestions: [
      "What does the spacing of an interference pattern depend on?",
      "How does diffraction limit the resolution of optical instruments?",
      "Which property of light does polarization reveal?",
    ],
    learningObjectives: [
      "Derives the conditions for bright fringes for a double slit and a diffraction grating.",
      "Predicts colors in thin-film interference, taking phase changes into account.",
      "Calculates angular resolution using the Rayleigh criterion.",
    ],
    commonMisconceptions: [
      "Believing that the diffraction pattern narrows as the slits get narrower.",
      "Thinking that reflection always involves a phase change.",
    ],
    competitionApplications: ["Double-slit and thin-film questions", "Measuring wavelength with a diffraction grating in the experimental exam"],
    links: {
      "math.fourier": "the diffraction pattern is the Fourier transform of the aperture",
      "neuro.methods.imaging": "the resolution limit in microscopy",
      "math.trig.identities": "adding phasors",
    },
  },
  "phys.modern.relativity": {
    title: "Special relativity",
    description: "The postulates of relativity, the relativity of simultaneity, time dilation, length contraction, Lorentz transformations and relativistic energy–momentum.",
    whyItMatters: "It changes our intuitions about space and time; particle physics, GPS corrections and E = mc² rest on this theory.",
    entryQuestions: [
      "Lightning strikes the front and back ends of a train moving near the speed of light at the same moment. Is it 'at the same moment' for a passenger on the train too?",
      "How do muons created in the upper atmosphere reach the ground despite their very short lifetimes?",
    ],
    coreQuestions: [
      "How does the constancy of the speed of light demolish the concept of simultaneity?",
      "How are the Lorentz transformations derived from the postulates?",
      "What relation connects relativistic energy and momentum?",
    ],
    learningObjectives: [
      "Derives time dilation using the light-clock thought experiment.",
      "Calculates the coordinates of events in different frames by applying the Lorentz transformations.",
      "Uses the relativistic energy–momentum relation in particle decay and collision problems.",
      "Analyzes the twin paradox in terms of acceleration and simultaneity.",
    ],
    commonMisconceptions: [
      "Believing that time dilation is a mechanical malfunction of clocks.",
      "Thinking that mass 'increases' with speed and that this is the only thing preventing faster-than-light travel.",
    ],
    competitionApplications: ["Relativistic kinematics and decay questions", "Threshold energy problems"],
    links: {
      "gk.sci-hist.modern-physics": "Einstein and the historical context of relativity",
      "gk.phil.science": "an example of a paradigm shift",
      "math.linalg.linear-maps": "the Lorentz transformation is a linear map",
    },
  },
  "phys.modern.quantum-intro": {
    title: "Introduction to quantum physics",
    description: "The photoelectric effect, the photon, the de Broglie wavelength, the uncertainty principle, the wave function and the particle in a box.",
    whyItMatters: "The behavior of atoms, chemical bonds, semiconductors and lasers can only be explained by quantum physics.",
    entryQuestions: [
      "If electrons are sent through a double slit one at a time, does an interference pattern still form on the screen? What happens if you check which slit each one goes through?",
      "No matter how much you increase the intensity of red light, you cannot knock electrons out of some metals. Why is this surprising in the wave model?",
    ],
    coreQuestions: [
      "Which property of light does the photoelectric effect prove?",
      "Is the uncertainty principle a measurement error, or a property of nature?",
      "Why is the energy of a confined particle discrete?",
    ],
    learningObjectives: [
      "Calculates Planck's constant and the work function from photoelectric effect data.",
      "Derives the energy levels of a particle in a box from the standing-wave condition.",
      "Estimates quantities such as atomic size and zero-point energy using the uncertainty principle.",
    ],
    commonMisconceptions: [
      "Believing that the uncertainty principle arises only from imperfections in measuring instruments.",
      "Thinking that the electron in an atom orbits in a definite planet-like path.",
    ],
    researchApplications: ["An introduction to quantum computing and quantum biology"],
    competitionApplications: ["Photoelectric and de Broglie questions", "Order-of-magnitude estimates using the uncertainty principle"],
    links: {
      "chem.atoms.electron-config": "orbitals and quantum numbers",
      "math.complex.numbers": "the wave function is complex-valued",
      "gk.sci-hist.modern-physics": "the birth of quantum theory",
    },
  },
  "phys.modern.atomic-nuclear": {
    title: "Atomic and nuclear physics",
    description: "The hydrogen atom and the Bohr model, spectral lines, nuclear structure, binding energy, radioactive decay, fission and fusion.",
    whyItMatters: "It is the basis for understanding the energy of stars, medical imaging, radiometric dating and nuclear energy.",
    entryQuestions: [
      "If the protons in a nucleus repel each other, why doesn't the nucleus fly apart?",
      "How can both splitting heavy nuclei and fusing light nuclei release energy?",
    ],
    coreQuestions: [
      "Why does the hydrogen spectrum consist of discrete lines?",
      "What does the curve of binding energy per nucleon explain?",
      "Why does radioactive decay follow an exponential law?",
    ],
    learningObjectives: [
      "Derives the hydrogen energy levels from the Bohr model and calculates spectral lines.",
      "Calculates binding energy from the mass defect.",
      "Performs half-life and activity calculations using the exponential decay law.",
    ],
    commonMisconceptions: [
      "Believing that all nuclei have decayed after one half-life.",
      "Thinking that it can be known in advance when a single nucleus will decay.",
    ],
    competitionApplications: ["Spectrum and Bohr model questions", "Binding energy and decay chains"],
    links: {
      "chem.atoms.structure": "the atomic model and isotopes",
      "math.found.exp-log": "exponential decay",
      "math.prob.stochastic": "radioactive decay is a Poisson process",
      "neuro.methods.imaging": "positron emission in PET imaging",
    },
  },
  "phys.lab.experimental": {
    title: "Experimental physics: measurement, error analysis and graphs",
    description: "Experimental design, random and systematic error, error propagation, linearization, least-squares fitting and the lab report.",
    whyItMatters: "A large share of olympiad points comes from the experimental exam; the same skills are the foundation of all laboratory research.",
    entryQuestions: [
      "When timing a pendulum's period with a stopwatch, is it more accurate to time one swing or twenty? Why?",
      "Your data look like a parabola. Which axes could you change to turn it into a straight line?",
    ],
    coreQuestions: [
      "How are random and systematic errors distinguished, and how are they reduced?",
      "Which graph should be drawn to extract parameters from a nonlinear relation?",
      "How are the slope of a fit and its uncertainty calculated?",
    ],
    learningObjectives: [
      "Linearizes a nonlinear relation and calculates a physical constant with its uncertainty from the slope of the graph.",
      "Identifies the dominant source of error in an experiment and designs the measurement strategy accordingly.",
      "Writes a short lab report consisting of measurements, a graph and a conclusion.",
    ],
    commonMisconceptions: [
      "Believing that writing more significant figures means a more accurate measurement.",
      "Thinking that every point on a graph must lie on the line.",
    ],
    researchApplications: ["Data analysis in every experimental research project"],
    competitionApplications: ["Olympiad experimental exams", "Graph linearization and uncertainty calculation"],
    links: {
      "math.stat.regression": "least-squares fitting",
      "res.method.experimental-design": "experimental design and controls",
      "res.data.visualization": "drawing scientific graphs",
    },
  },
  "phys.comp.simulation": {
    title: "Computational physics: numerical simulation",
    description: "Solving equations of motion numerically, the Euler and Verlet methods, choosing the time step, checking energy conservation and many-body simulations.",
    whyItMatters: "It lets you explore systems with no analytical solution (the double pendulum, the three-body problem, neural networks); it is the third pillar of modern physics research.",
    entryQuestions: [
      "If you simulate a planetary orbit with the simple Euler method, what does the planet do after a few orbits? Predict first, then try it.",
      "Does halving the time step halve the error, or cut it to a quarter?",
    ],
    coreQuestions: [
      "How does the error of a numerical method depend on the time step?",
      "Why do some methods conserve energy better over long times?",
      "How can we trust that a simulation is correct?",
    ],
    learningObjectives: [
      "Codes projectile, spring and orbit problems using the Euler and Verlet methods.",
      "Validates a simulation against analytical solutions and conservation laws.",
      "Investigates an analytically difficult effect such as air resistance by simulation and interprets the result.",
    ],
    commonMisconceptions: [
      "Believing that a smaller time step always gives a better result (rounding error and cost).",
      "Thinking that a simulation looking nice proves that it is correct.",
    ],
    researchApplications: ["Molecular dynamics and celestial mechanics simulations", "Computational neuroscience models"],
    competitionApplications: ["Research project competitions supported by programming"],
    links: {
      "prog.sci.simulation": "general simulation techniques",
      "neuro.proj.hh-simulation": "a neuron model built with the same numerical methods",
      "math.ode.numerical": "Euler and Runge–Kutta",
    },
  },
  "phys.olymp.estimation": {
    title: "Fermi estimation and reasoning with dimensional analysis",
    description: "Fast physical reasoning using rough order-of-magnitude estimates, scaling laws, dimensional analysis and limiting-case checks.",
    whyItMatters: "Knowing the size of the answer before solving a problem catches errors; in olympiads and in research it is the answer to the question 'does this make sense?'",
    entryQuestions: [
      "How many piano tuners are there in Istanbul? Without looking up any data, give a range and write down your assumptions.",
      "Why can't an elephant jump as high as a flea? Explain using scaling.",
    ],
    coreQuestions: [
      "Which assumptions are enough to estimate a quantity to within an order of magnitude?",
      "How do scaling laws limit the sizes of living things and structures?",
      "How do limiting cases test the correctness of a result?",
    ],
    learningObjectives: [
      "Breaks a Fermi problem into sub-estimates and gives the result to within an order of magnitude.",
      "Derives and tests an unknown relation using dimensional analysis.",
      "Checks a solution using limiting cases and extreme values.",
    ],
    commonMisconceptions: [
      "Believing that estimation is 'guessing' and worthless without exact data.",
      "Thinking that computing every intermediate step very precisely improves the estimate.",
    ],
    competitionApplications: ["Estimation questions in olympiads", "Limiting-case checks to verify solutions"],
    links: {
      "bio.ecology": "scaling laws and metabolism",
      "media.lit.stats-in-news": "testing whether numbers in the news are plausible",
      "math.found.exp-log": "thinking on a logarithmic scale",
    },
  },
  "phys.olymp.boss": {
    title: "Boss: Full physics olympiad problem set",
    description: "A full olympiad set combining mechanics, electromagnetism, thermodynamics, optics and estimation questions, solved under real exam conditions.",
    whyItMatters: "It takes you from knowing topics separately to combining the different parts of a single long problem under time pressure.",
    entryQuestions: [
      "If you can't solve part a of a problem with parts a, b and c, can you still score points on the later parts? What strategy would you follow?",
      "How do you decide which question to start with in an exam?",
    ],
    coreQuestions: [
      "How is a long, multi-part problem read and planned?",
      "How do different topics come together in a single physical situation?",
      "How is partial credit maximized under a time limit?",
    ],
    learningObjectives: [
      "Solves a full timed problem set and writes up the solution legibly.",
      "Selects and derives the necessary principles in a problem that combines different topics.",
      "Compares their own solution with the official solution and writes an analysis in an error log.",
    ],
    commonMisconceptions: [
      "Believing that you cannot move on to later parts without solving the first part.",
      "Thinking that a solution is graded only on whether the final number is correct.",
    ],
    competitionApplications: ["Stages of the national physics olympiad", "The International Physics Olympiad and regional olympiads", "Practice with past years' problem sets"],
    links: {
      "comp.phys.theory-practice": "olympiad theory practice",
      "comp.meta.exam-strategy": "time management and question selection",
      "comp.boss.mock": "full mock-exam simulation",
    },
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_PHYSICS: Record<string, string> = {
  "Temel": "Foundations",
  "Ölçme": "Measurement",
  "Mekanik": "Mechanics",
  "Kinematik ve dinamik": "Kinematics and dynamics",
  "Dönme, kütle çekimi, salınım": "Rotation, gravitation, oscillation",
  "Dalgalar ve termodinamik": "Waves and thermodynamics",
  "Dalgalar": "Waves",
  "Termodinamik": "Thermodynamics",
  "Elektromanyetizma": "Electromagnetism",
  "Elektrostatik ve devreler": "Electrostatics and circuits",
  "Manyetizma ve indüksiyon": "Magnetism and induction",
  "Optik ve modern fizik": "Optics and modern physics",
  "Optik": "Optics",
  "Modern fizik": "Modern physics",
  "Deney ve hesaplama": "Experiment and computation",
};
