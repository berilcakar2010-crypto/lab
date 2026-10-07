import type { LOText } from "../../schema";

export const EN_COMPETITION: Record<string, LOText> = {
  "comp.meta.learning-to-learn": {
    title: "Learning to learn: spaced repetition, retrieval, metacognition",
    description: "Planning, monitoring and improving one's own learning with evidence-based strategies such as spaced repetition, active retrieval, interleaving and metacognition, and refining them through personal experiments.",
    whyItMatters: "It lets you learn every object in this curriculum more durably and in less time; this app's review schedule, evidence-based mastery criteria and personal learning experiments are built directly on these principles.",
    entryQuestions: [
      "Which sticks better: reading a topic three times in a row, or reading it once and then twice trying to recall it with the book closed? Make a prediction, then test yourself a week later.",
      "Why is the feeling \"I know this\" right after studying a topic a poor predictor of how you will perform a week later?",
    ],
    coreQuestions: [
      "What is the forgetting curve, and how does spaced repetition change it?",
      "Why is retrieval a stronger learning event than rereading?",
      "How can I reliably measure what I know and what I don't?",
    ],
    learningObjectives: [
      "Sets up a spaced-repetition schedule for a topic and adjusts the review intervals according to recall success.",
      "Converts passive study habits into activities built on retrieval and interleaved practice.",
      "Tests one of their own learning strategies with a controlled personal experiment (n=1) and interprets the result.",
      "Measures their metacognitive calibration by comparing confidence estimates with actual test results.",
    ],
    commonMisconceptions: [
      "Believing that fluent rereading and highlighting are good signs of learning (the illusion of fluency).",
      "Thinking that one long study session (massed, blocked study) beats spreading the same total time out over spaced sessions.",
      "Assuming that teaching to \"learning styles\" such as visual or auditory learners improves achievement.",
    ],
    researchApplications: [
      "Personal learning experiments: spaced repetition, sleep duration, interleaved practice",
      "Extracting a forgetting curve from your own review data",
    ],
    competitionApplications: ["Long-term retention during olympiad preparation"],
    links: {
      "neuro.cog.learning-memory": "the basis of the spacing and retrieval effects in memory systems",
      "neuro.cog.sleep": "memory consolidation during sleep; the cost of studying at the expense of sleep",
      "neuro.syn.plasticity": "LTP as the cellular basis of lasting learning, and the effect of spaced stimulation",
      "res.method.experimental-design": "testing learning strategies with controlled personal experiments",
      "neuro.cog.attention": "how distraction and multitasking affect encoding",
      "neuro.syn.neuromodulation": "curiosity, reward and dopamine strengthening encoding",
      "neuro.cog.emotion": "the two-way effect of stress on memory encoding and retrieval",
      "math.prob.stochastic": "probabilistic modelling of forgetting and review timing",
    },
  },
  "comp.meta.deliberate-practice": {
    title: "Deliberate practice and the error log",
    description: "Practice that targets weak points, gives immediate feedback and is tuned in difficulty; keeping an error log that classifies mistakes by type.",
    whyItMatters: "It is how you improve much faster in the same amount of time; in olympiads and programming contests, progress depends less on how many problems you solve than on the lessons you draw from your mistakes.",
    entryQuestions: [
      "Which makes you better: solving 100 problems you can already do comfortably, or studying 10 problems you struggle with in depth?",
      "Why is calling a mistake in an exam \"carelessness\" usually an inadequate diagnosis?",
    ],
    coreQuestions: [
      "What separates deliberate practice from ordinary repetition?",
      "How are mistakes classified, and how do you learn from them?",
      "How is the difficulty of practice tuned?",
    ],
    learningObjectives: [
      "Keeps an error log that sorts mistakes into types such as conceptual, strategic, computational and misreading errors.",
      "Derives a targeted practice plan from the patterns in the error log.",
      "Measures progress by re-solving a problem they could not solve a week later, without looking at the solution.",
    ],
    commonMisconceptions: [
      "Believing that many hours of study automatically lead to expertise.",
      "Thinking that reading and understanding a solution is the same as being able to solve the problem.",
    ],
    competitionApplications: ["Preparation for every olympiad and contest"],
    links: {
      "neuro.comp.reinforcement": "learning from error signals and feedback",
      "neuro.cog.learning-memory": "how procedural and declarative learning develop with practice",
      "prog.python.files-debug": "searching for the root cause of a mistake, as in debugging",
    },
  },
  "comp.meta.problem-solving": {
    title: "Problem-solving strategies (Pólya)",
    description: "The cycle of understanding the problem, devising a plan, carrying it out and looking back; heuristics such as examining special cases, working backwards, looking for symmetry and changing the problem.",
    whyItMatters: "It is the common language for tackling problems you have never seen before in mathematics, physics and programming olympiads.",
    entryQuestions: [
      "You are stuck on a problem and have made no progress for 20 minutes. Name three ways to change the problem (smaller numbers, a simpler figure, dropping a condition).",
      "Why does \"looking back\" after finishing a solution make you more likely to solve the next problem?",
    ],
    coreQuestions: [
      "How do I check that I have really understood a problem?",
      "Which strategies can I try, in order, when I am stuck?",
      "What generalisable lesson can be drawn from a solution?",
    ],
    learningObjectives: [
      "Restates a problem in their own words and separates what is given from what is asked.",
      "Deliberately tries at least three strategies when stuck, such as special cases, working backwards and symmetry.",
      "Checks a solution by another route or with limiting cases, and transfers the method to a new problem.",
    ],
    commonMisconceptions: [
      "Believing that good problem solvers \"see\" the solution immediately.",
      "Thinking that the work on a problem is over once the correct answer is reached.",
    ],
    competitionApplications: ["Approaching new problems in every olympiad discipline"],
    links: {
      "math.comp.olympiad-methods": "concrete forms of Pólya's strategies in mathematical olympiads",
      "phys.olymp.estimation": "dimensional analysis and limiting-case checks in physics problems",
      "prog.algo.recursion": "reducing a problem to smaller instances of itself",
    },
  },
  "comp.meta.exam-strategy": {
    title: "Exam strategy and time management",
    description: "Prioritising questions in an exam, budgeting time, knowing when to move on when stuck, collecting partial credit and reserving time for checking.",
    whyItMatters: "It is how you score higher with the same knowledge; in olympiad exams, deliberate use of time often decides the result.",
    entryQuestions: [
      "You spent 40 minutes on a hard question in an exam and did not solve it. When, and on what signal, should you have changed that decision?",
      "On a question you cannot solve, is it wiser to leave the page blank or to write up your partial results neatly?",
    ],
    coreQuestions: [
      "How are questions scanned and prioritised at the start of an exam?",
      "How do you decide to abandon a question?",
      "How is partial credit collected?",
    ],
    learningObjectives: [
      "Draws up and follows a per-question time budget for a timed mock exam.",
      "Analyses their use of time after an exam and corrects their strategy accordingly.",
      "Writes up partial results on a question they could not fully solve in a readable, gradable form.",
    ],
    commonMisconceptions: [
      "Believing that questions must always be solved in order.",
      "Thinking that setting aside time for checking is a waste of time.",
    ],
    competitionApplications: ["Time management in olympiads and qualifying exams"],
    links: {
      "neuro.cog.decision": "decision-making under uncertainty and opportunity cost",
      "neuro.cog.attention": "sustaining attention through a long exam",
    },
  },
  "comp.meta.stress": {
    title: "Performance anxiety and resilience",
    description: "Recognising the bodily and cognitive effects of exam and competition anxiety; reappraisal, breathing and preparation routines, and recovering from failure.",
    whyItMatters: "Anxiety narrows working memory and can make even well-known material inaccessible; managing it lets your preparation pay off in the exam.",
    entryQuestions: [
      "You notice your heart racing before an exam. Does it change the outcome whether you read this as \"I'm too nervous, I'll fail\" or as \"My body is getting ready to perform\"?",
      "Why does a little stress improve performance while too much of it impairs it?",
    ],
    coreQuestions: [
      "What does stress do in the body and the brain?",
      "By what route does anxiety disrupt performance?",
      "How do you rebuild after a failure?",
    ],
    learningObjectives: [
      "Tracks their own anxiety symptoms and triggers in a journal and identifies patterns.",
      "Designs a short calming and reappraisal routine to use before and during an exam.",
      "Analyses a competition that went badly with a learning-focused review rather than blame.",
    ],
    commonMisconceptions: [
      "Believing that all stress is harmful to performance.",
      "Thinking that anxiety is a character weakness that must be suppressed by willpower.",
    ],
    links: {
      "neuro.cog.emotion": "the stress response and the interplay of the amygdala and prefrontal cortex",
      "bio.physiology.endocrine": "the role of cortisol and adrenaline in the stress response",
      "neuro.cog.sleep": "how sleep deprivation weakens emotion regulation",
    },
    notes: ["If anxiety seriously affects daily life, seek support from a professional; this object is not medical guidance."],
  },
  "comp.phys.olympiad-path": {
    title: "Physics olympiad roadmap",
    description: "Researching the general structure of national and international physics olympiads, their theoretical and experimental components, and which topics can be studied in which order, then drawing up a personal roadmap.",
    whyItMatters: "It turns preparation from random problem-solving into deliberate management of topic gaps and priorities.",
    entryQuestions: [
      "Once you have found an olympiad's official syllabus and past papers, how do you decide how much time to give each topic?",
      "Is the difference between school physics and olympiad physics in the topic list or in the structure of the problems? Justify your answer by looking at past problems.",
    ],
    coreQuestions: [
      "From which official sources are the olympiad stages and exam formats verified?",
      "How does the official syllabus compare with my current level of knowledge?",
      "How is long-term preparation divided into phases?",
    ],
    learningObjectives: [
      "Finds and verifies the stages, dates and scope of the target olympiad from official sources.",
      "Maps the official syllabus onto this curriculum's physics objects and identifies missing topics.",
      "Classifies past problems by topic and difficulty and writes a realistic preparation plan.",
    ],
    commonMisconceptions: [
      "Believing that olympiad preparation is only about learning advanced topics early; depth and problem-solving matter more.",
      "Thinking that forum posts or second-hand information about the exam structure and dates are reliable enough.",
    ],
    competitionApplications: ["A physics olympiad preparation plan"],
    links: {
      "phys.mech.boss": "mechanics is the backbone of olympiad physics",
      "phys.olymp.estimation": "olympiad-style reasoning",
      "phys.lab.experimental": "preparing for the experimental part of the exam",
    },
    notes: ["Exam stages, dates and scope can change; verify every detail against the official source of the organising body."],
  },
  "comp.phys.theory-practice": {
    title: "Olympiad theory problem practice",
    description: "Solving multi-step olympiad theory problems that combine several areas of physics, and writing clean solutions with modelling, approximation and limiting-case checks.",
    whyItMatters: "It is the toughest test of the ability to carry physics knowledge into new situations, and the main factor in olympiad success.",
    entryQuestions: [
      "A problem does not say \"for small angles\" or \"friction is negligible\", yet the solution requires an approximation. How do you decide which approximation is legitimate?",
      "What does checking the units and limiting cases (m → 0, θ → 90°) of your result tell you about whether the solution is correct?",
    ],
    coreQuestions: [
      "How is a complicated physical situation reduced to a solvable model?",
      "Which conservation law or symmetry simplifies the problem?",
      "Which independent checks confirm a result?",
    ],
    learningObjectives: [
      "Models a problem that combines several topics and derives the result symbolically.",
      "Checks every result with dimensional analysis, limiting cases and an order-of-magnitude estimate.",
      "Solves timed problem sets and updates the study plan according to the error log.",
    ],
    commonMisconceptions: [
      "Believing that memorising formulas and finding the right one is the same as solving the problem.",
      "Thinking that checking the numerical result is unnecessary.",
    ],
    competitionApplications: ["Physics olympiad theory exams"],
    links: {
      "math.calc.applications": "optimisation and approximation techniques",
      "math.ode.linear-second": "oscillations and solutions of differential equations",
      "phys.mech.lagrangian": "solving complicated mechanical systems more systematically",
    },
  },
  "comp.phys.experimental": {
    title: "Olympiad experimental exam practice",
    description: "Planning a measurement with limited time and equipment, collecting data, linearising and plotting it, calculating uncertainties and reporting the result.",
    whyItMatters: "It prepares you for the experimental part of physics olympiads and, at the same time, puts the essence of real laboratory work (measurement, error, model) into practice.",
    entryQuestions: [
      "You are asked to measure g with a pendulum, and you have only a ruler and a stopwatch. Where does the largest uncertainty come from, and how do you reduce it?",
      "If you expect a relation like T ∝ √L between two measured quantities, what do you plot against what to get a straight line?",
    ],
    coreQuestions: [
      "How is a measurement planned under time pressure?",
      "How are data linearised, and how is a quantity extracted from the slope?",
      "How is uncertainty propagated and reported?",
    ],
    learningObjectives: [
      "Plans a measurement with the given apparatus and budgets its time in advance.",
      "Linearises and plots the data and calculates a quantity from the slope together with its uncertainty.",
      "Identifies sources of systematic error and proposes ways to reduce them.",
    ],
    commonMisconceptions: [
      "Believing that more data points also reduce systematic error.",
      "Thinking that reporting uncertainty is an optional detail.",
    ],
    competitionApplications: ["Physics olympiad experimental exams"],
    links: {
      "math.stat.regression": "fitting a line with uncertainties on slope and intercept",
      "res.data.visualization": "readable graphs with error bars",
      "phys.measure.units": "dimensional analysis and propagation of uncertainty",
    },
  },
  "comp.math.olympiad": {
    title: "Mathematical olympiad practice",
    description: "Solving olympiad problems in algebra, combinatorics, geometry and number theory, and writing the solutions up as complete proofs.",
    whyItMatters: "It develops mathematical maturity, proof-writing and creative problem-solving; these skills carry over into physics and computer science.",
    entryQuestions: [
      "If you cut off two opposite corners of a chessboard, can the remaining 62 squares be tiled exactly with 31 dominoes? Find an idea for a proof before you start experimenting.",
      "What is the difference between a solution that has found \"the right idea\" and one that earns full marks?",
    ],
    coreQuestions: [
      "Which problem points to which family of techniques?",
      "How is a proof written completely and readably?",
      "How is time balanced among the four main areas?",
    ],
    learningObjectives: [
      "Solves olympiad problems in the four main areas and writes them up as complete proofs.",
      "Finds gaps in a solution both independently and through peer review.",
      "Builds a personal catalogue of methods by classifying solved problems by technique.",
    ],
    commonMisconceptions: [
      "Believing that olympiad mathematics is school mathematics with harder numbers.",
      "Thinking that finding the right answer is enough for a proof.",
    ],
    competitionApplications: ["Mathematical olympiads"],
    links: {
      "math.found.proof-techniques": "induction, contradiction and direct proof",
      "math.discrete.number-theory": "modular arithmetic and divisibility",
      "prog.comp.competitive": "algorithmic counterparts of combinatorial ideas",
    },
  },
  "comp.bio-neuro.brain-bee": {
    title: "Brain Bee preparation",
    description: "Researching the structure of neuroscience competitions from official sources, and studying neuroanatomy, neural function and neurological disorders systematically.",
    whyItMatters: "It requires organising neuroscience knowledge in an integrated and lasting way, and it is also a gateway to student communities in the field.",
    entryQuestions: [
      "What is the difference between memorising the name of a brain region and being able to predict which function will fail when it is damaged? Which one might they ask?",
      "Which learning strategies would you combine to learn hundreds of neuroanatomy terms for the long term?",
    ],
    coreQuestions: [
      "From which official sources are the competition's stages, scope and recommended resources verified?",
      "How is neuroanatomy learned by linking structure to function?",
      "How is a large body of knowledge retained over a long period?",
    ],
    learningObjectives: [
      "Finds and verifies the competition's stages, scope and recommended resources on its official website.",
      "Draws a concept map linking brain regions to their functions and to the consequences of damage.",
      "Tracks long-term recall of neuroanatomy terms with a spaced-repetition system.",
    ],
    commonMisconceptions: [
      "Believing that such competitions are nothing more than memorising terms.",
      "Assuming that the competition format is the same in every country and every year.",
    ],
    competitionApplications: ["Neuroscience competitions"],
    links: {
      "neuro.sys.neuroanatomy": "the core content of the competition",
      "neuro.cog.learning-memory": "using memory principles for lasting memorisation",
      "comp.meta.learning-to-learn": "preparing with spaced repetition and retrieval",
      "gk.sci-hist.neuroscience": "key findings from the history of neuroscience",
    },
    notes: ["The competition's national organiser, stages and format may change; verify them against official sources."],
  },
  "comp.research.science-fair": {
    title: "Research project competitions",
    description: "Planning, reporting and presenting a research project to a jury in line with the judging criteria of project competitions, and researching the competitions' requirements from official sources.",
    whyItMatters: "It is the most accessible way to carry out real research from start to finish and receive external evaluation; it is also strong evidence in application files.",
    entryQuestions: [
      "When a judge asks, \"How else could you explain this result?\", your answer can be the strongest or the weakest moment of your project. How would you prepare for it now?",
      "Should you read the competition's judging criteria and rules at the start of the project or at the end? Why?",
    ],
    coreQuestions: [
      "From which official sources are the competition's rules, categories and judging criteria verified?",
      "How is a project self-assessed against the jury's criteria?",
      "How are ethical approval and safety requirements met?",
    ],
    learningObjectives: [
      "Verifies the target competition's rules, timeline and judging criteria from an official source.",
      "Self-assesses their project against the judging criteria and closes the gaps.",
      "Gives a rehearsal jury presentation and answers critical questions with evidence.",
    ],
    commonMisconceptions: [
      "Believing that juries reward flashy results most; a sound method and the student's understanding matter more.",
      "Thinking that ethical approval and safety rules can be sorted out after the project is finished.",
    ],
    competitionApplications: ["National and international project competitions"],
    links: {
      "res.write.presentation": "jury presentation and poster",
      "res.ethics": "consent and ethical approval in projects with human participants",
      "res.peer-review": "evaluating the project through a reviewer's eyes",
    },
    notes: ["Competition names, categories and timelines may change; verify every detail against the official announcement of the organising body."],
  },
  "comp.prog.contests": {
    title: "Programming contests",
    description: "Taking part regularly in online and on-site programming contests; timed contest practice, post-contest analysis and learning the solutions to problems you could not solve.",
    whyItMatters: "It develops algorithmic knowledge measurably under time pressure and prepares you for competitions such as the informatics olympiad.",
    entryQuestions: [
      "After a contest, is it more instructive to read the official solution to a problem you could not solve, or to keep working on it for another day? When is each the better choice?",
      "Your rating fluctuates from contest to contest. How do you measure your real progress?",
    ],
    coreQuestions: [
      "How is regular contest practice planned?",
      "How is post-contest analysis done?",
      "How is progress measured?",
    ],
    learningObjectives: [
      "Takes part in regular timed contests and solves the problems they missed after each one.",
      "Analyses contest performance by time, error type and topic.",
      "Derives a targeted topic study plan from the analysis and carries it out.",
    ],
    commonMisconceptions: [
      "Believing that rating fluctuations directly reflect real progress.",
      "Thinking that simply taking part in contests leads to improvement even without analysis afterwards.",
    ],
    competitionApplications: ["Programming contests and the informatics olympiad"],
    links: {
      "prog.algo.dp": "one of the most frequent techniques in contests",
      "prog.algo.graphs": "graph problems",
      "math.stat.descriptive": "telling rating fluctuations apart from noise",
    },
  },
  "comp.boss.mock": {
    title: "Boss: Full mock exam simulation",
    description: "Sitting a complete olympiad mock exam under real exam conditions (time, setting, rules), then analysing time use, error types and anxiety management in detail.",
    whyItMatters: "It combines knowledge, problem-solving, time management and stress management in one realistic setting, so you can find the weak link before the real exam.",
    entryQuestions: [
      "Problems you solved comfortably at home went unsolved in the mock exam. Is the difference in knowledge, time or setting? How do you tell?",
      "Should the analysis after a mock exam take longer than the exam itself?",
    ],
    coreQuestions: [
      "How are real exam conditions simulated?",
      "How are the results of a mock exam analysed?",
      "What changes follow from the analysis?",
    ],
    learningObjectives: [
      "Sits a complete mock exam under real time limits and conditions and records a timeline.",
      "Classifies every lost point as caused by knowledge, strategy, time or anxiety.",
      "Derives a prioritised action list for the next preparation period from the analysis.",
      "Adapts their strategy to conditions during the exam and writes partial results in a gradable form.",
    ],
    commonMisconceptions: [
      "Believing that the only purpose of a mock exam is to get a score.",
      "Thinking that a bad mock exam is a sign of poor preparation; its real value is showing the gaps early.",
    ],
    competitionApplications: ["Final-stage preparation for every olympiad"],
    links: {
      "phys.olymp.boss": "a full physics olympiad problem set",
      "neuro.cog.emotion": "the effect of exam stress on performance",
      "res.method.experimental-design": "repeating mock exams under comparable conditions",
    },
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_COMPETITION: Record<string, string> = {
  "Meta beceriler": "Meta-skills",
  "Öğrenmeyi öğrenme": "Learning to learn",
  "Olimpiyatlar": "Olympiads",
};
