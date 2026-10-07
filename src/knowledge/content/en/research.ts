import type { LOText } from "../../schema";

export const EN_RESEARCH: Record<string, LOText> = {
  "res.method.scientific-method": {
    title: "The scientific method and the research question",
    description: "Turning curiosity into a testable, well-scoped, answerable research question; the cycle of observation, explanation and testing.",
    whyItMatters: "A badly posed question leads nowhere meaningful even with the best method; every project, competition entry and personal experiment begins with a good question.",
    entryQuestions: [
      "Why is \"Does listening to music help you study?\" not yet a research question? Turn it into one you could answer in a week.",
      "If a claim cannot be refuted by any possible observation, does that make it strong or weak?",
    ],
    coreQuestions: [
      "What makes a good research question?",
      "How are observation, hypothesis, prediction and testing connected?",
      "How is the scope of a question narrowed to fit the available resources?",
    ],
    learningObjectives: [
      "Turns a general curiosity into a research question with a limited scope and measurable variables.",
      "Distinguishes whether a claim is falsifiable and justifies the judgement.",
      "Plans in advance what data will be needed to answer a research question.",
    ],
    commonMisconceptions: [
      "Believing that the scientific method is a rigid list of steps followed in the same order in every field.",
      "Thinking that science produces definitive \"proof\"; science produces tested, provisional explanations.",
    ],
    researchApplications: ["The first paragraph of every project proposal"],
    links: {
      "gk.phil.science": "falsifiability and the philosophical foundations of the scientific method",
      "media.lit.claim-analysis": "breaking a claim down into testable parts",
      "gk.sci-hist.scientific-revolution": "how the method took shape historically",
    },
  },
  "res.method.hypothesis": {
    title: "Hypotheses and variable design",
    description: "Defining independent, dependent and control variables; making abstract concepts measurable (operationalisation) and writing directional hypotheses.",
    whyItMatters: "How you define concepts such as \"focus\" or \"learning\" before measuring them determines what your result means.",
    entryQuestions: [
      "In the hypothesis \"Sleep improves learning\", in how many different ways could you measure \"learning\"? Could each measure give a different result?",
      "What is lost if a hypothesis is written after the results are in?",
    ],
    coreQuestions: [
      "How are variables defined and measured?",
      "What makes a hypothesis testable?",
      "How is the null hypothesis related to the research hypothesis?",
    ],
    learningObjectives: [
      "Extracts the independent, dependent and control variables from a research question.",
      "Proposes and compares at least two operational definitions for an abstract concept.",
      "Writes a directional, falsifiable hypothesis and the expected result before any data are collected.",
    ],
    commonMisconceptions: [
      "Believing that a hypothesis is just a \"guess\" that can be adjusted afterwards to fit the result.",
      "Thinking that a variable has only one correct way to be measured.",
    ],
    links: {
      "math.stat.inference": "the statistical counterpart of null and alternative hypotheses",
      "bio.methods.lab": "controlling variables in biology experiments",
      "neuro.cog.learning-memory": "operational definitions of concepts such as \"learning\" and \"memory\"",
    },
  },
  "res.method.experimental-design": {
    title: "Experimental design: control, randomisation, power",
    description: "Control groups, randomisation, blinding, within-subject and between-subject designs, and planning sample size and statistical power.",
    whyItMatters: "From learning experiments on yourself to laboratory studies, good design is the only way to show that a difference really comes from the intervention.",
    entryQuestions: [
      "You want to test on yourself whether spaced repetition works. Why might studying normally for one week and with spacing the next be a misleading design?",
      "Seven of the 10 people who took a drug recovered. What can you say about this result, and what can't you say?",
    ],
    coreQuestions: [
      "Which errors do control groups and randomisation prevent?",
      "What are the advantages and pitfalls of a within-subject design?",
      "How many measurements are enough, and how does statistical power determine this?",
    ],
    learningObjectives: [
      "Designs an experiment for an intervention that includes a control condition, randomisation and blinding.",
      "Identifies confounds such as order effects and practice effects and proposes counterbalancing.",
      "Estimates the approximate sample size from an expected effect size by simulation.",
      "Runs a personal learning experiment (n=1) under a pre-registered plan and reports its limitations.",
    ],
    commonMisconceptions: [
      "Believing that randomisation is needed only in large studies.",
      "Thinking that a non-significant result means \"no effect\"; low power can hide an effect.",
      "Assuming that the placebo effect appears only in drug studies.",
    ],
    researchApplications: [
      "Personal learning experiments (spaced repetition, sleep, study time)",
      "A controlled experiment in the school laboratory",
    ],
    links: {
      "math.stat.inference": "power, significance level and effect size",
      "comp.meta.learning-to-learn": "testing learning strategies with personal experiments",
      "bio.methods.lab": "controls and replication in laboratory experiments",
      "phys.lab.experimental": "separating systematic from random error",
    },
  },
  "res.method.causal": {
    title: "Causality and confounding variables",
    description: "The conditions for moving from correlation to causation; confounders, mediators and colliders, reverse causation and simple causal diagrams.",
    whyItMatters: "From news claims that \"X increases the risk of Y\" to observational neuroscience data, reading correctly what causes what prevents the most common mistake.",
    entryQuestions: [
      "As ice-cream sales rise, so do drownings. Would banning ice cream save lives?",
      "Children from homes with many books do better in exams. Would giving books to every home raise achievement by the same amount?",
    ],
    coreQuestions: [
      "What does it take to claim that a correlation is causal?",
      "How is a confounding variable detected and controlled for?",
      "How is causal inference done when an experiment is impossible?",
    ],
    learningObjectives: [
      "Lists possible confounders, reverse causation and selection bias for a causal claim.",
      "Draws a simple causal diagram (DAG) and determines which variable should be controlled for.",
      "Demonstrates and interprets Simpson's paradox in a data example.",
    ],
    commonMisconceptions: [
      "Believing that adding more variables to a regression is always better; controlling for a collider creates bias.",
      "Thinking that correlation says nothing at all about causation; with the right design it can provide evidence.",
    ],
    researchApplications: ["Evaluating causal claims in observational data"],
    links: {
      "media.lit.science-news": "testing causal claims in the news",
      "math.stat.regression": "what control variables mean in a regression",
      "neuro.methods.imaging": "the limits of drawing causal conclusions from fMRI correlations",
    },
  },
  "res.lit.search": {
    title: "Literature search",
    description: "Searching academic search engines and databases with effective keywords; following the citation chain backwards and forwards; starting from review articles.",
    whyItMatters: "Starting a project without knowing whether the question has already been answered wastes time; a good search also makes your original contribution visible.",
    entryQuestions: [
      "There are thousands of papers on sleep and memory. By what criteria would you choose the first five to read?",
      "A paper's reference list looks into the past, and the papers citing it look into the future. How would you use both directions?",
    ],
    coreQuestions: [
      "Which search tools suit which purpose?",
      "How do you tell a review article from an original research article?",
      "How are search results recorded and organised?",
    ],
    learningObjectives: [
      "Runs a systematic search on a topic using a keyword list with synonyms.",
      "Finds the key studies by tracing citations backwards and forwards from a review article.",
      "Records the sources found in a table with columns for question, method and finding.",
    ],
    commonMisconceptions: [
      "Believing that the results on the first page of a search are the most important studies.",
      "Thinking that the newest paper always gives the most accurate information.",
    ],
    links: {
      "media.lit.source-evaluation": "assessing the reliability of a source",
      "en.c1.sci-reading": "most of the literature is in English",
    },
  },
  "res.lit.reading": {
    title: "Reading scientific papers",
    description: "Reading a paper in several passes: starting from the abstract and figures, questioning the methods, and judging the gap between claim and evidence.",
    whyItMatters: "It gives you direct access to the raw material of science, lets you see for yourself where second-hand summaries distort, and lets you connect your own project to existing knowledge.",
    entryQuestions: [
      "Why is reading a paper straight through from beginning to end often the least efficient approach?",
      "The abstract says \"X significantly improved Y\". Which part of the paper would you check before believing that sentence?",
    ],
    coreQuestions: [
      "How does the structure of a paper (IMRaD) guide reading?",
      "How are figures and methods read critically?",
      "How do you compare what the authors claim with what the data show?",
    ],
    learningObjectives: [
      "Summarises a paper's main question, method, finding and limitation in five sentences.",
      "Interprets a figure without looking at the text and compares that interpretation with the authors'.",
      "Identifies the weakest assumption in a paper and proposes a follow-up experiment to test it.",
    ],
    commonMisconceptions: [
      "Believing that every result published in a peer-reviewed journal is definitive.",
      "Thinking that nothing can be gained from a paper without understanding every term and equation.",
    ],
    researchApplications: ["A journal club presentation", "Dissecting the key papers for a project"],
    links: {
      "en.c1.sci-reading": "strategies for reading scientific texts in English",
      "media.lit.science-news": "checking a news story by going to the primary source",
      "neuro.methods.data-analysis": "understanding the analyses in neuroscience papers",
    },
  },
  "res.lit.citation": {
    title: "Citing sources and managing references",
    description: "Citing sources correctly and consistently, distinguishing quotation from summary, and automating the bibliography with reference management tools.",
    whyItMatters: "Correct citation lets readers trace a claim back, and prevents carelessness, the most common source of plagiarism.",
    entryQuestions: [
      "You wrote an idea in your own words. Do you still need to cite a source?",
      "Can you report a result you read in one paper by citing the original study that paper cites, without having read it?",
    ],
    coreQuestions: [
      "When and how should sources be cited?",
      "How do direct quotation, summary and paraphrase differ?",
      "How are reference management tools used?",
    ],
    learningObjectives: [
      "Identifies the claims in a text that need a source and cites them correctly.",
      "Paraphrases a paragraph without plagiarising and acknowledges its source.",
      "Produces a consistent bibliography with a reference management tool.",
    ],
    commonMisconceptions: [
      "Believing that you do not need to cite a source for an idea you have written in your own words.",
      "Thinking that content freely available on the internet can be used without citation.",
    ],
    links: {
      "prog.tools.latex": "automatic bibliographies with BibTeX",
      "en.c1.academic-writing": "using sources in academic English",
    },
  },
  "res.data.management": {
    title: "Data management and documentation",
    description: "Keeping raw data unaltered, naming files and folders meaningfully, and maintaining a data dictionary and a lab notebook.",
    whyItMatters: "Not being able to make sense of your own data six months later is the most common research accident; good organisation ensures both reproducibility and a trustworthy analysis.",
    entryQuestions: [
      "A table has a \"condition\" column containing the values 1 and 2. How will you know what they mean three months from now?",
      "Why can saving over the original file while cleaning raw data be an irreversible mistake?",
    ],
    coreQuestions: [
      "Why are raw, processed and analysed data kept separate?",
      "What should a data dictionary contain?",
      "How is personal data protected?",
    ],
    learningObjectives: [
      "Sets up a folder structure and naming convention for a project that separates raw, processed and results data.",
      "Writes a data dictionary for a data set describing the variables, units and codings.",
      "Keeps a research log during an experiment that records dates, conditions and deviations.",
    ],
    commonMisconceptions: [
      "Believing that documentation can be written all at once at the end of the project.",
      "Thinking that keeping a single copy of the data is enough.",
    ],
    links: {
      "prog.tools.git": "version history of code and text files",
      "media.lit.privacy": "protecting personal data",
    },
  },
  "res.data.analysis-pipeline": {
    title: "The data analysis pipeline",
    description: "Breaking the analysis from raw data to conclusion into reading, cleaning, exploration, modelling and reporting steps, and making it re-runnable with scripts.",
    whyItMatters: "Having every step that produces the result written in code makes it possible to find mistakes, update the analysis and defend the conclusion.",
    entryQuestions: [
      "You have finished your analysis, then you find an error in the data. How long will it take to regenerate every figure and number: five minutes or two days?",
      "Why might it matter to write down the analysis plan before looking at the data?",
    ],
    coreQuestions: [
      "What stages make up an analysis pipeline?",
      "How are exploratory and confirmatory analyses kept apart?",
      "Why are manual steps risky?",
    ],
    learningObjectives: [
      "Builds an analysis pipeline that runs from raw data to the final figure with a single command.",
      "States exploratory and pre-planned analyses separately in the report.",
      "Finds and fixes an error in an analysis step by checking intermediate outputs.",
    ],
    commonMisconceptions: [
      "Believing that small manual fixes do not need to be documented.",
      "Thinking that a pattern found in exploratory analysis can be confirmed with the same data.",
    ],
    researchApplications: ["The analysis section of the mini project"],
    links: {
      "prog.python.pandas": "tools for cleaning and transforming data",
      "neuro.methods.data-analysis": "the same pipeline principles for neural data",
      "math.stat.inference": "the inference step of the analysis",
    },
  },
  "res.data.visualization": {
    title: "Scientific visualisation",
    description: "Designing figures that show a finding honestly and clearly: showing uncertainty, choosing an appropriate chart type and scale, and focusing on a single message.",
    whyItMatters: "Most readers look at the figures of a paper first; a good figure makes a finding convincing, while a bad one can hide or distort even a correct finding.",
    entryQuestions: [
      "The means of two groups look very different in a bar chart. Could that impression change if you add the individual data points?",
      "Do the error bars show the standard deviation, the standard error or a confidence interval? How does that difference change the interpretation?",
    ],
    coreQuestions: [
      "Which chart suits which data and question?",
      "How are uncertainty and distribution shown?",
      "How are a figure title and caption written?",
    ],
    learningObjectives: [
      "Shows the same data with three different charts and justifies which one best answers the question.",
      "Produces a self-explanatory figure that states what its error bars represent.",
      "Spots a misleading chart and draws a corrected version.",
    ],
    commonMisconceptions: [
      "Believing that a bar chart is suitable for every comparison; it can hide the distribution.",
      "Thinking that overlapping or non-overlapping error bars say something definitive about significance.",
    ],
    links: {
      "media.lit.stats-in-news": "recognising misleading charts",
      "math.stat.descriptive": "distribution, centre and spread",
      "neuro.methods.data-analysis": "raster plots, PSTHs and heat maps",
    },
  },
  "res.stats.pitfalls": {
    title: "Statistical pitfalls: p-hacking and multiple comparisons",
    description: "P-hacking, multiple comparisons, selective reporting, hypothesising after the results are known (HARKing) and the inflated effects of small samples.",
    whyItMatters: "These are major reasons why some published findings fail to replicate; knowing them protects your own analysis and lets you critique other people's.",
    entryQuestions: [
      "You test the effect of 20 different jelly-bean colours on acne, one at a time. If no colour has a real effect, how many tests do you expect to come out \"significant\"?",
      "A researcher keeps collecting data until the result becomes significant. What is wrong with that?",
    ],
    coreQuestions: [
      "What does a p-value tell you, and what does it not?",
      "Why do multiple comparisons increase false positives, and how is this corrected?",
      "Which problems does preregistration solve?",
    ],
    learningObjectives: [
      "Shows by simulation the false-positive rate of multiple testing on data with no real effect.",
      "Derives the rationale for a correction such as Bonferroni and applies it.",
      "Lists the possible researcher degrees of freedom (analysis choices) in a study.",
    ],
    commonMisconceptions: [
      "Believing that p = 0.03 means the hypothesis is true with 97% probability.",
      "Thinking that a significant result is a large or important effect.",
      "Assuming that p-hacking happens only through deliberate fraud; it is usually well-meant flexibility.",
    ],
    researchApplications: ["Planning your own analysis with preregistration"],
    links: {
      "math.stat.inference": "p-values, type I error and power",
      "math.stat.bayesian": "the Bayesian alternative to p-values",
      "media.lit.science-news": "treating news based on a single study with caution",
    },
  },
  "res.write.report": {
    title: "Writing scientific reports and papers",
    description: "Writing clear, cautious, evidence-based scientific text structured as introduction, methods, results and discussion.",
    whyItMatters: "Research that is not written up does not exist for anyone else; competition reports, applications and papers all demand the same writing discipline.",
    entryQuestions: [
      "In the results section you wrote, \"This result proves that sleep strengthens memory.\" How many problems are there in that sentence?",
      "What must you add to the methods section so that someone else could repeat your experiment exactly?",
    ],
    coreQuestions: [
      "What is the function of each section?",
      "How are results kept separate from interpretation?",
      "How are limitations written honestly?",
    ],
    learningObjectives: [
      "Writes a short IMRaD-structured report using their own data.",
      "Separates observations from interpretations by putting only observations in the results and interpretations in the discussion.",
      "Calibrates the strength of their claims to the strength of the evidence with appropriately cautious language.",
    ],
    commonMisconceptions: [
      "Believing that complex sentences and jargon make a text more scientific.",
      "Thinking that negative or unexpected results should be left out of the report.",
    ],
    researchApplications: ["Mini project report", "Competition project report"],
    links: {
      "en.c1.academic-writing": "patterns of academic writing in English",
      "prog.tools.latex": "typesetting the report",
      "de.c1.academic-writing": "the German academic writing tradition",
    },
  },
  "res.write.presentation": {
    title: "Scientific talks and posters",
    description: "Presenting research in limited time or on a single page, tailored to the audience and built around one main message; answering questions.",
    whyItMatters: "At competitions, summer schools and conferences, work is judged largely through its presentation.",
    entryQuestions: [
      "A judge will stop in front of your poster for 30 seconds. What single sentence do you want them to remember?",
      "Six charts on one slide, or one chart on each of six slides? Why?",
    ],
    coreQuestions: [
      "How does the structure of a talk differ from a written report?",
      "How is a poster laid out?",
      "How do you answer difficult questions?",
    ],
    learningObjectives: [
      "Turns a project into a talk with a single main message that fits the time limit.",
      "Designs a visually driven poster that can be read from a distance.",
      "Answers critical questions in a rehearsal talk with evidence-based responses.",
    ],
    commonMisconceptions: [
      "Believing that the more text on the slides, the more complete the talk.",
      "Thinking that saying \"I don't know\" is a sign of weakness in a presentation.",
    ],
    competitionApplications: ["Jury presentations at project competitions"],
    links: {
      "en.c1.sci-communication": "giving scientific talks in English",
      "de.b2.science-communication": "giving scientific talks in German",
      "media.lit.production": "explaining science to a wide audience",
    },
  },
  "res.ethics": {
    title: "Research ethics",
    description: "Avoiding fabrication, falsification and plagiarism; consent, harmlessness and confidentiality in research with human and animal participants; authorship and conflicts of interest.",
    whyItMatters: "The scientific value of a study depends on its ethical foundation; even small experiments on yourself or with friends require consent and confidentiality.",
    entryQuestions: [
      "You want to collect your friends' sleep times and use them in a project. Is getting their permission enough, or what else should you watch out for?",
      "An outlier is spoiling your result. When is removing it legitimate, and when is it falsification?",
    ],
    coreQuestions: [
      "What kinds of research misconduct are there?",
      "What should informed consent include?",
      "How is authorship decided?",
    ],
    learningObjectives: [
      "Identifies the ethical risks in a project plan and proposes safeguards.",
      "Writes a clear informed-consent text for participants.",
      "Justifies data-exclusion decisions with criteria set in advance.",
    ],
    commonMisconceptions: [
      "Believing that ethical rules apply only to medical research.",
      "Thinking that anonymisation just means deleting names.",
    ],
    researchApplications: ["Every project with human participants"],
    links: {
      "neuro.methods.ethics": "ethical questions specific to neuroscience",
      "gk.phil.ethics": "applying ethical theories to research",
      "media.lit.privacy": "personal data and privacy",
    },
  },
  "res.peer-review": {
    title: "Peer review and critical evaluation",
    description: "Evaluating a study constructively and systematically: questioning whether the claims are supported by the evidence, whether the method is appropriate and what alternative explanations exist.",
    whyItMatters: "Someone who can evaluate other people's work also spots the weaknesses in their own in advance; it shows how scientific quality control works.",
    entryQuestions: [
      "You are reviewing a friend's project report. What is the difference between saying \"Nice work\" and \"Could the effect in Figure 2 be explained by confounder X?\"",
      "Can a paper that has passed peer review still contain serious errors? How?",
    ],
    coreQuestions: [
      "What does a good review report contain?",
      "How is criticism made constructive and evidence-based?",
      "What are the limits of peer review?",
    ],
    learningObjectives: [
      "Evaluates a paper or report against a checklist and writes a structured review.",
      "Proposes at least two alternative explanations for a finding and specifies the analysis that would distinguish them.",
      "Rereads their own report through a reviewer's eyes and fixes its weak points.",
    ],
    commonMisconceptions: [
      "Believing that peer review guarantees that the results are correct.",
      "Thinking that criticism is a personal attack or merely fault-finding.",
    ],
    researchApplications: ["Peer feedback and journal clubs"],
    links: {
      "media.lit.claim-analysis": "assessing claims and levels of evidence",
      "gk.phil.intro": "argument analysis",
    },
  },
  "res.project.mini": {
    title: "Mini research project",
    description: "Carrying out your own research question from start to finish: question, literature, pre-registered plan, data collection, analysis and report.",
    whyItMatters: "It brings all the research skills together on a real question; it is the core experience for competition projects, summer school applications and real research later on.",
    entryQuestions: [
      "In one month, with your own resources, which question whose answer you genuinely want to know could you answer?",
      "If your result shows the opposite of your hypothesis, has your project failed?",
    ],
    coreQuestions: [
      "How is a project with a manageable scope chosen?",
      "How are deviations between the plan and what actually happened documented?",
      "How are results presented together with their limitations?",
    ],
    learningObjectives: [
      "Chooses a research question with a limited scope and writes the analysis plan before collecting data.",
      "Collects the data, analyses it with a documented pipeline and reports deviations.",
      "Prepares a report and a short talk covering the findings, limitations and next steps.",
    ],
    commonMisconceptions: [
      "Believing that a good project needs a big, original question; a small question carried out well is worth more.",
      "Thinking that an unexpected result means the project has failed.",
    ],
    researchApplications: [
      "A personal learning experiment",
      "Analysis of an open data set",
      "An experiment in the school laboratory",
    ],
    competitionApplications: ["A foundation for project competitions"],
    links: {
      "comp.meta.learning-to-learn": "an n=1 experiment testing your own learning strategies is a natural mini project",
      "neuro.cog.sleep": "a small-scale personal study on sleep and memory",
      "neuro.methods.data-analysis": "an analysis project with an open neural data set",
    },
  },
  "res.project.modeling": {
    title: "Modelling project",
    description: "Expressing a real system with differential equations or stochastic models, solving it numerically, comparing parameters with data and discussing the limits of the model.",
    whyItMatters: "It is the basic form of research that brings theory and data together in physics, biology and neuroscience, and direct preparation for computational neuroscience.",
    entryQuestions: [
      "You can model the spread of an epidemic with three equations. How do you find out whether this model is really \"right\"?",
      "If a model fits the data perfectly, does that show it has captured the right mechanism?",
    ],
    coreQuestions: [
      "How are a model's assumptions chosen and stated explicitly?",
      "How are parameters estimated from data?",
      "How is a model's predictive power tested?",
    ],
    learningObjectives: [
      "Models a system with differential equations, stating its assumptions explicitly, and derives the model.",
      "Solves the model numerically, runs a parameter sweep and compares it with data.",
      "States the model's prediction for a new situation and discusses the conditions under which it would fail.",
    ],
    commonMisconceptions: [
      "Believing that a model with more parameters is always better.",
      "Thinking that a model must include every detail to be useful.",
    ],
    researchApplications: ["A population, epidemic, neuron or climate model"],
    links: {
      "math.ode.numerical": "numerical solution of the model",
      "bio.ecology": "models of population dynamics",
      "neuro.comp.hh-model": "neuron models are a classic modelling project",
      "phys.comp.simulation": "simulating physical systems",
    },
  },
  "res.career.academic": {
    title: "Academic pathways: summer schools, mentors and applications",
    description: "Exploring ways to gain research experience during high school: summer schools, research programmes, finding a mentor and preparing an application file.",
    whyItMatters: "The right programme and mentor speed up turning what you have learned into real research; writing applications also forces you to clarify your own interests.",
    entryQuestions: [
      "You are going to email a researcher to say you would like to work in their lab. What should your first two sentences be so that they keep reading?",
      "From which source would you verify a programme's application deadline, eligibility requirements and fees?",
    ],
    coreQuestions: [
      "What kinds of programmes and opportunities exist, and how are they researched?",
      "How do you approach a mentor?",
      "What does a strong application file contain?",
    ],
    learningObjectives: [
      "Lists programmes that match their interests and verifies dates, requirements and fees from official sources.",
      "Writes a short, specific and respectful first email to a researcher.",
      "Drafts an application text describing their own research experience.",
    ],
    commonMisconceptions: [
      "Believing that only the best-known programmes are worthwhile.",
      "Thinking that it is inappropriate for a student to write to researchers.",
    ],
    links: {
      "en.app.personal-statement": "writing personal statements and application essays",
      "de.culture": "researching scientific institutions in German-speaking countries",
      "ja.culture": "researching Japan's scientific tradition and programmes",
    },
    notes: ["Programme names, dates and requirements change often; verify every detail from an official source."],
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_RESEARCH: Record<string, string> = {
  "Yöntem": "Method",
  "Bilimsel yöntem": "Scientific method",
  "Literatür": "Literature",
  "Veri": "Data",
  "İletişim ve etik": "Communication and ethics",
  "Projeler": "Projects",
};
