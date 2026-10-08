import type { LOText } from "../../schema";

export const EN_MATH_PLUS: Record<string, LOText> = {
  "math.precalc.transformations": {
    title: "Function transformations and composition",
    description: "How shifts, stretches and reflections of the form y = a·f(b(x − h)) + k change a graph; composition of functions, its domain, and decomposing a composite.",
    whyItMatters: "Seeing a new function as a transformation of a familiar 'parent' function makes graphing, and later the chain rule in calculus, much easier.",
    entryQuestions: [
      "Is the graph of y = (x − 3)² the graph of y = x² shifted right or left? Why does the minus sign inside seem counter-intuitive?",
      "Can f(g(x)) and g(f(x)) be the same function? Find one example and one counter-example.",
    ],
    coreQuestions: [
      "In what order should transformations be applied, and why does the order matter?",
      "How do changes inside and outside the function affect the graph differently?",
      "How is the domain of a composite function found?",
    ],
    learningObjectives: [
      "Sketches the new graph from a sequence of transformations applied to a parent function.",
      "Writes the equation of a given graph as a transformation of a parent function.",
      "Calculates the composition of two functions and its domain, and decomposes a complicated function as a composite.",
    ],
    commonMisconceptions: [
      "Thinking f(x − 3) shifts the graph to the left.",
      "Thinking composition is commutative, i.e. f∘g = g∘f.",
    ],
    links: {
      "phys.waves.basics": "a travelling wave y = A sin(kx − ωt) is a shifted function",
      "prog.python.functions": "function composition and modular code",
    },
  },
  "math.precalc.inverse": {
    title: "Inverse functions",
    description: "One-to-one functions and the horizontal-line test, finding an inverse, reflection in the line y = x, swapping domain and range, and restricting the domain of functions that have no inverse.",
    whyItMatters: "Logarithms, roots and inverse trigonometric functions are all 'undo' operations; the inverse function is the general idea behind solving an equation.",
    entryQuestions: [
      "Is the inverse of f(x) = x² simply √x? If f(−3) = 9, what do you get when you 'undo' 9?",
      "If an encryption function turns two different messages into the same ciphertext, can the cipher be decrypted?",
    ],
    coreQuestions: [
      "What condition must a function satisfy to have an inverse?",
      "How is the graph of the inverse obtained from the original?",
      "How can a function without an inverse be made invertible?",
    ],
    learningObjectives: [
      "Tests whether a function is one-to-one algebraically and graphically.",
      "Finds an inverse function algebraically and verifies it with f(f⁻¹(x)) = x.",
      "Chooses and justifies an invertible branch by restricting the domain.",
    ],
    commonMisconceptions: [
      "Confusing f⁻¹(x) with 1/f(x).",
      "Thinking every function has an inverse.",
    ],
    links: {
      "cs.security": "encryption and decryption are a pair of inverse functions",
      "chem.acid-base": "the logarithm–exponential inverse relation between pH and [H⁺]",
    },
  },
  "math.precalc.rational": {
    title: "Rational functions and asymptotes",
    description: "Rational functions as quotients of polynomials; vertical, horizontal and oblique asymptotes, holes (removable discontinuities), sign charts and rational inequalities.",
    whyItMatters: "It is an intuitive rehearsal of the limit and discontinuity ideas of calculus; saturating relationships in physics and chemistry (such as Michaelis–Menten) are rational functions.",
    entryQuestions: [
      "f(x) = (x² − 1)/(x − 1) is undefined at x = 1. Does the graph have an asymptote there, or something else?",
      "Can a graph cross its horizontal asymptote? Its vertical asymptote?",
    ],
    coreQuestions: [
      "How are the types of asymptote determined from the degrees of numerator and denominator?",
      "How do you tell a hole from a vertical asymptote?",
      "How is a rational inequality solved with a sign chart?",
    ],
    learningObjectives: [
      "Calculates the asymptotes and holes of a rational function.",
      "Sketches the graph using zeros, asymptotes and a sign chart.",
      "Solves rational inequalities with a sign chart.",
    ],
    commonMisconceptions: [
      "Thinking a graph can never cross its horizontal asymptote.",
      "Thinking every zero of the denominator gives a vertical asymptote (a common factor gives a hole).",
    ],
    links: {
      "bio.enzymes": "the Michaelis–Menten rate law is a rational function",
      "phys.optics.geometric": "asymptotic behaviour of image distance in the lens equation",
    },
  },
  "math.precalc.trig-functions": {
    title: "Graphs of trigonometric functions and modelling",
    description: "Graphs of sine, cosine and tangent; amplitude, period, phase shift and vertical shift; describing periodic phenomena (tides, daylight hours, oscillations) with sinusoidal models.",
    whyItMatters: "Waves, oscillations, alternating current and biological rhythms are all described by sinusoids; it is the first step on the road to Fourier analysis.",
    entryQuestions: [
      "How does the length of daylight in a city change over the year? Sketch a graph; why might it look like a sine curve?",
      "Is the graph of y = sin(2x) squeezed or stretched compared with y = sin x? What is its period?",
    ],
    coreQuestions: [
      "Where do amplitude, period and phase shift appear in the equation?",
      "How is periodic data expressed with a sinusoidal model?",
      "Where do the asymptotes of the tangent graph come from?",
    ],
    learningObjectives: [
      "Sketches the graph of y = A sin(B(x − C)) + D from its parameters.",
      "Builds a sinusoidal model from a periodic data set (tides, temperature) and interprets the parameters.",
      "Explains with a diagram how the trigonometric graphs arise from the unit circle.",
    ],
    commonMisconceptions: [
      "Thinking the period of y = sin(Bx) is B (it is 2π/B).",
      "Always taking the number inside the brackets as the phase shift (forgetting the factor when B ≠ 1).",
    ],
    links: {
      "phys.mech.oscillations": "simple harmonic motion is sinusoidal",
      "phys.em.ac-rlc": "alternating current and phase difference",
      "neuro.methods.electrophysiology": "EEG rhythms are periodic signals",
    },
  },
  "math.precalc.inverse-trig": {
    title: "Inverse trigonometric functions and trigonometric equations",
    description: "Domain restrictions and principal values for arcsin, arccos and arctan; the general solution of trigonometric equations and finding all solutions in a given interval.",
    whyItMatters: "It is needed to find an angle from a side ratio, compute angles in physics and solve trigonometric equations completely; the derivative and integral of arctan come up often in calculus.",
    entryQuestions: [
      "How many solutions does sin x = 1/2 have? Why does the calculator give only one?",
      "Is arcsin(sin(5π/6)) equal to 5π/6? Guess first.",
    ],
    coreQuestions: [
      "Why is the domain restricted for inverse trigonometric functions?",
      "How is the general solution of a trigonometric equation written?",
      "How are identities used in solving equations?",
    ],
    learningObjectives: [
      "Calculates principal values of inverse trigonometric functions and simplifies composite expressions.",
      "Derives the general solution of trigonometric equations and finds all solutions in a given interval.",
      "Solves quadratic-type trigonometric equations using identities.",
    ],
    commonMisconceptions: [
      "Confusing sin⁻¹x with 1/sin x.",
      "Taking the single angle the calculator returns as the only solution of the equation.",
    ],
    competitionApplications: ["Questions on the number of solutions in an interval in olympiads and exams"],
    links: {
      "phys.mech.kinematics-2d": "finding a launch angle from components in projectile motion",
      "phys.optics.geometric": "computing the refraction angle with Snell's law",
    },
  },
  "math.precalc.polar": {
    title: "Polar coordinates and the complex plane",
    description: "Polar coordinates and conversion to Cartesian; polar curves (roses, cardioids, spirals); the polar form of complex numbers, multiplication as rotation, De Moivre's theorem and the nth roots of unity.",
    whyItMatters: "It is the most natural coordinate system for rotation and periodic motion; the 'rotate and scale' meaning of complex multiplication is used throughout signal processing and physics.",
    entryQuestions: [
      "What happens in the plane when you multiply a complex number by i? Try a few numbers and guess a rule.",
      "How many petals does r = cos(3θ) have? And r = cos(2θ)? Guess before you draw.",
    ],
    coreQuestions: [
      "How do you convert between polar and Cartesian coordinates?",
      "What is the product of complex numbers geometrically?",
      "How are the roots of zⁿ = 1 arranged in the plane?",
    ],
    learningObjectives: [
      "Converts points and equations between polar and Cartesian forms.",
      "Sketches the basic polar curves and identifies their symmetries.",
      "Proves De Moivre's theorem by induction and calculates the nth roots of unity.",
    ],
    commonMisconceptions: [
      "Thinking a polar point has only one (r, θ) representation.",
      "Thinking the angles multiply when complex numbers are multiplied (they add).",
    ],
    links: {
      "phys.em.ac-rlc": "phasors are rotating vectors in the complex plane",
      "phys.mech.circular": "a polar description of circular motion",
    },
  },
  "math.precalc.modeling": {
    title: "Modelling data with functions",
    description: "Choosing a linear, exponential, logarithmic, power or sinusoidal model for a data set; linearising with transformed axes (log–log, semi-log), residual analysis and the limits of a model.",
    whyItMatters: "It is the core skill for extracting a physical law from lab data and for describing growth, decay or scaling with the right model.",
    entryQuestions: [
      "You measured a pendulum's length and period. How can you tell whether the data is a line, a parabola or a square-root function?",
      "A model's predictions fit the data very well. Does that mean the model is correct?",
    ],
    coreQuestions: [
      "How is the right family of functions chosen for a data set?",
      "How do logarithmic scales linearise a relationship?",
      "What do residuals say about how well a model fits?",
    ],
    learningObjectives: [
      "Chooses and justifies a suitable family of functions from a data set's graph and ratios.",
      "Linearises power and exponential relationships with log–log or semi-log plots and calculates the parameters.",
      "Interprets a residual plot and states the range in which the model is valid.",
    ],
    commonMisconceptions: [
      "Thinking a high R² proves the model is correct.",
      "Confidently extending a model far beyond the range of the data (extrapolation).",
    ],
    researchApplications: ["Fitting models to experimental data and estimating parameters"],
    links: {
      "phys.lab.experimental": "extracting laws from experimental data and linearising",
      "res.data.visualization": "using logarithmic axes correctly",
      "env.population.human": "fitting growth models to population data",
    },
  },
  "math.geo.proofs": {
    title: "Geometric proof and constructions",
    description: "Two-column and paragraph proofs with congruence and similarity criteria; drawing auxiliary lines, compass-and-straightedge constructions, circle theorems (inscribed angle, chord, tangent) and loci.",
    whyItMatters: "It is the most visual school of mathematical proof and the foundation of olympiad geometry and of any rigorous reasoning.",
    entryQuestions: [
      "Why is every inscribed angle that subtends a diameter a right angle? Draw a few examples, then try to find the reason.",
      "With only a compass and straightedge you can bisect an angle. Can you trisect it?",
    ],
    coreQuestions: [
      "Which axioms and theorems does a geometric proof rest on?",
      "How and when is an auxiliary line added?",
      "How are the steps of a compass-and-straightedge construction justified?",
    ],
    learningObjectives: [
      "Proves statements about triangles using congruence and similarity criteria.",
      "Proves the inscribed-angle and tangent–chord theorems and applies them in problems.",
      "Carries out the basic compass-and-straightedge constructions (angle bisector, perpendicular, tangent) and proves they are correct.",
    ],
    commonMisconceptions: [
      "Treating the fact that a figure 'looks that way' in a drawing as a proof.",
      "Concluding congruence from SSA (two sides and a non-included angle), which is not a valid criterion.",
    ],
    competitionApplications: ["Mathematical olympiad geometry problems"],
    links: {
      "gk.phil.intro": "valid argument and deduction",
      "gk.sci-hist.ancient-medieval": "Euclid's Elements and the axiomatic method",
    },
  },
  "math.geo.conics": {
    title: "Conic sections: circle, ellipse, parabola, hyperbola",
    description: "Focus–directrix definitions of the conics, their standard equations, recognising an equation by completing the square, eccentricity and reflective properties.",
    whyItMatters: "Planetary orbits, satellite dishes, headlight reflectors and projectile paths are conics; they appear constantly in physics and astronomy.",
    entryQuestions: [
      "On an elliptical billiard table, where does a ball struck from one focus go after bouncing off the cushion? Guess.",
      "How many different kinds of curve can you get by slicing a cone with a plane?",
    ],
    coreQuestions: [
      "How are the conics defined by a focus and a directrix?",
      "How do you tell the type of conic from a general second-degree equation?",
      "Why are the reflective properties of conics true?",
    ],
    learningObjectives: [
      "Derives the standard equations of the parabola and ellipse from the focus–directrix definition.",
      "Determines which conic an equation represents by completing the square, and sketches its graph.",
      "Solves a problem using the relation between eccentricity and orbit shape.",
    ],
    commonMisconceptions: [
      "Thinking an ellipse is a 'squashed circle' with no foci.",
      "Thinking every parabola has the form y = ax² (orientation and translation).",
    ],
    links: {
      "space.orbits.kepler": "planetary orbits are ellipses; escape trajectories are parabolas or hyperbolas",
      "phys.optics.geometric": "parabolic mirrors and the focus",
    },
  },
  "math.geo.transformations": {
    title: "Transformation geometry: translation, rotation, reflection, similarity",
    description: "Isometries of the plane (translation, rotation, reflection, glide reflection) and similarity transformations; their composition, representation by matrices, symmetry and patterns.",
    whyItMatters: "It gives a precise language for symmetry; computer graphics, crystallography and the groups of abstract algebra grow out of this idea.",
    entryQuestions: [
      "If you reflect in two different lines one after the other, what single transformation is the result? What if the lines are parallel?",
      "In how many different ways can a square be mapped onto itself?",
    ],
    coreQuestions: [
      "Which transformations preserve length and angle?",
      "How is the composition of transformations found?",
      "How are rotations and reflections represented by matrices?",
    ],
    learningObjectives: [
      "Maps points and figures in the coordinate plane under given transformations.",
      "Proves that the composition of two reflections is a translation or a rotation.",
      "Writes rotations, reflections and scalings as 2×2 matrices and calculates their compositions.",
    ],
    commonMisconceptions: [
      "Thinking the composition of transformations does not depend on order.",
      "Thinking a similarity transformation preserves length.",
    ],
    links: {
      "art.elements": "pattern, symmetry and composition",
      "chem.bond.lewis-vsepr": "molecular symmetry",
      "cs.web.basics": "transformation matrices in CSS and graphics",
    },
  },
  "math.geo.solid": {
    title: "Solid figures: surface area and volume",
    description: "Surface area and volume of prisms, pyramids, cylinders, cones and spheres; Cavalieri's principle, cross-sections, and area and volume ratios of similar solids.",
    whyItMatters: "It underpins scaling arguments from engineering to biology: how the surface-to-volume ratio changes as a cell or animal grows explains many phenomena.",
    entryQuestions: [
      "A statue is scaled up so that every dimension doubles. Does it need twice, four times or eight times as much paint? And how much bronze?",
      "Why is a pyramid's volume exactly one third of the prism with the same base and height? Suggest a way to see it.",
    ],
    coreQuestions: [
      "Where do the volume formulas for the basic solids come from?",
      "How does Cavalieri's principle let you compare volumes?",
      "How do area and volume scale for similar solids?",
    ],
    learningObjectives: [
      "Calculates the surface area and volume of composite solids.",
      "Derives the volume of a sphere using Cavalieri's principle.",
      "Calculates area and volume ratios from a similarity ratio and applies them to a scaling problem.",
    ],
    commonMisconceptions: [
      "Thinking volume doubles when the dimensions double.",
      "Thinking surface area and volume scale in the same way.",
    ],
    links: {
      "bio.cell.structure": "the surface-to-volume ratio limits cell size",
      "phys.olymp.estimation": "estimation with scaling laws",
    },
  },
  "math.trig.laws": {
    title: "The laws of sines and cosines",
    description: "The laws of sines and cosines for any triangle, the ambiguous case (SSA), the area formulas ½ab·sinC and Heron's formula, and applications to surveying and navigation.",
    whyItMatters: "It lets you solve any non-right triangle and is used directly for adding force and velocity vectors, in surveying and in astronomy.",
    entryQuestions: [
      "Given two sides and the angle opposite one of them, is the triangle always unique? Try drawing two different triangles.",
      "How should Pythagoras' theorem be 'corrected' for triangles that are not right-angled? Write down a guess.",
    ],
    coreQuestions: [
      "How are the laws of sines and cosines proved?",
      "Which law is used for which given data?",
      "How many triangles can there be in the SSA case?",
    ],
    learningObjectives: [
      "Proves the laws of sines and cosines by dropping an altitude or using coordinates.",
      "Solves a triangle by choosing the appropriate law for the given data and analyses the ambiguous case.",
      "Applies the laws in surveying and navigation problems.",
    ],
    commonMisconceptions: [
      "Thinking the angle found with the law of sines is always unique.",
      "Thinking the law of cosines holds only for obtuse triangles.",
    ],
    links: {
      "phys.mech.newton": "finding the resultant of non-perpendicular forces",
      "space.sky.observation": "angular-position calculations for celestial objects",
    },
  },
  "math.stat.sampling": {
    title: "Sampling methods and bias",
    description: "Simple random, stratified, cluster and systematic sampling; selection bias, non-response bias and response bias; the difference between observational studies and experiments, and how far results generalise.",
    whyItMatters: "It decides how far you can trust the result of a survey or study, and shows that even a huge sample can say nothing if it asks the wrong question of the wrong people.",
    entryQuestions: [
      "A news site polls its readers and gets 100,000 responses. Is that more reliable than a random sample of 1,000?",
      "Why might it be a problem to evaluate the school canteen by asking students sitting in the canteen?",
    ],
    coreQuestions: [
      "When is each sampling method preferred?",
      "Which kinds of bias stop a sample from being representative?",
      "Under what conditions can a study's result be used for causal claims and generalisation?",
    ],
    learningObjectives: [
      "Chooses and justifies a suitable sampling method for a research question.",
      "Identifies sources of bias in a study design and predicts how they affect the result.",
      "Compares the effects of sample size and bias on an estimate using a simulation.",
    ],
    commonMisconceptions: [
      "Thinking a large sample removes bias.",
      "Thinking random sampling means 'picking haphazardly'.",
    ],
    links: {
      "res.method.experimental-design": "randomisation and control in experiments",
      "media.lit.stats-in-news": "evaluating poll results in the news",
      "psy.methods": "sampling and generalisation in psychology",
    },
  },
  "math.stat.chi-square": {
    title: "Chi-square tests and categorical data",
    description: "Observed and expected counts for categorical data; chi-square tests for goodness of fit, independence and homogeneity, degrees of freedom, conditions, and interpreting the results.",
    whyItMatters: "It is the standard tool for testing genetic cross ratios, survey responses or the association between two categorical variables, and is widely used in biology and social-science research.",
    entryQuestions: [
      "You rolled a die 60 times and got a 6 sixteen times. Is the die loaded? How would you put a number on 'too many, or just chance?'",
      "A Mendelian cross expected 3:1 but gave 290:110. Is the difference significant?",
    ],
    coreQuestions: [
      "How is the chi-square statistic calculated, and what does it measure?",
      "Which questions do the goodness-of-fit, independence and homogeneity tests answer?",
      "What conditions must hold for the test to be valid?",
    ],
    learningObjectives: [
      "Calculates the chi-square statistic and degrees of freedom from observed and expected counts.",
      "Chooses the appropriate chi-square test, finds the p-value and interprets the result in context.",
      "Checks the expected-count condition and explains why the result does not imply cause and effect.",
    ],
    commonMisconceptions: [
      "Running a chi-square test on proportions or percentages (it is done on counts).",
      "Thinking a significant test of independence proves causation.",
    ],
    links: {
      "bio.genetics.mendel": "goodness-of-fit tests for cross ratios",
      "res.stats.pitfalls": "common misreadings of p-values",
      "prog.python.pandas": "analysing categorical data with cross-tabulations",
    },
  },
};

export const UNITS_MATH_PLUS: Record<string, string> = {
  "Temeller": "Foundations",
  "Fonksiyonlar ve ön kalkülüs": "Functions and precalculus",
  "Geometri ve trigonometri": "Geometry and trigonometry",
  "Olasılık ve istatistik": "Probability and statistics",
};
