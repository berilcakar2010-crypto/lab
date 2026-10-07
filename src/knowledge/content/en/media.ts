import type { LOText } from "../../schema";

export const EN_MEDIA: Record<string, LOText> = {
  "media.lit.source-evaluation": {
    title: "Evaluating sources: lateral reading and SIFT",
    description: "Evaluating a source not by looking only at its own pages but by checking what other sources say about it (lateral reading); the Stop–Investigate the source–Find better coverage–Trace claims (SIFT) steps.",
    whyItMatters: "It is the first filter for every piece of information met online; it is used directly in choosing sources for research projects and in everyday information consumption.",
    entryQuestions: [
      "Is a professional-looking, well-designed site with a reference list trustworthy? How could you tell without looking at the site itself?",
    ],
    coreQuestions: [
      "Why is a site's 'about us' page not enough to judge its reliability?",
      "Why is lateral reading faster and more accurate than vertical reading?",
      "How do you trace a claim back to its original source?",
    ],
    learningObjectives: [
      "Evaluates an unfamiliar source within a few minutes using lateral reading and writes down the reasoning",
      "Traces a claim back to its original source",
      "Applies the SIFT steps to a given post and reports what was found at each step",
    ],
    commonMisconceptions: [
      "Professional design and an official-looking domain name are signs of reliability.",
      "To evaluate a source you have to read it carefully from start to finish.",
    ],
    links: {
      "gk.method.historical-thinking": "source criticism is a core method of historians",
      "res.lit.search": "choosing academic sources",
    },
  },
  "media.lit.claim-analysis": {
    title: "Claim analysis and levels of evidence",
    description: "Breaking a claim down by its content, the type of evidence and the level of evidence: anecdote, observational study, experiment, systematic review.",
    whyItMatters: "It helps decide how far to trust a claim in health, science and social news, carrying knowledge of research design into everyday life.",
    entryQuestions: [
      "A friend says they took a supplement and felt better. Does this show the supplement works? What other explanations could there be?",
    ],
    coreQuestions: [
      "Into which components can a claim be broken down (who, what, on what evidence, how certain)?",
      "Why do levels of evidence form a hierarchy, and what are the limits of that hierarchy?",
      "When can a correlation be turned into a causal claim?",
    ],
    learningObjectives: [
      "Extracts the claims in a news article and classifies the type of evidence each one rests on",
      "Proposes at least two alternative explanations (confounding, reverse causation, chance) for a causal claim",
      "Detects exaggeration by comparing the strength of the claim with the strength of the evidence",
    ],
    commonMisconceptions: [
      "Many personal experiences add up to scientific evidence.",
      "The phrase 'a study showed' means the claim has been proven.",
    ],
    links: {
      "res.method.causal": "correlation and causation",
      "res.method.experimental-design": "the evidential value of a controlled experiment",
      "gk.phil.intro": "argument structure and fallacies",
    },
  },
  "media.lit.stats-in-news": {
    title: "Reading numbers and graphs in the news",
    description: "Recognising common numerical deceptions such as absolute versus relative risk, percent versus percentage points, axis manipulation, cherry-picked time windows and numbers without a denominator.",
    whyItMatters: "Most numbers in the news are correct but presented misleadingly; this turns statistical knowledge into a tool of self-defence in real life.",
    entryQuestions: [
      "Is the headline 'This drug cuts risk by 50%' still impressive if the risk falls from 2 in 1,000 to 1 in 1,000? What information is missing?",
      "How does a small change look on a graph whose y-axis does not start at zero? Draw it and try.",
    ],
    coreQuestions: [
      "How does the difference between relative and absolute risk change perception?",
      "How does graph design (axis, scale, time window) steer interpretation?",
      "What context (denominator, comparison, uncertainty) does a number need to be meaningful?",
    ],
    learningObjectives: [
      "Calculates absolute risk and the number needed to treat from a stated relative risk",
      "Detects a misleading graph and redraws the same data honestly",
      "Identifies the missing context of a number in a news story and formulates the right question",
    ],
    commonMisconceptions: [
      "A percentage increase and a percentage-point increase are the same thing.",
      "A steep slope on a graph always means a large change.",
      "Large absolute numbers always indicate a large problem.",
    ],
    links: {
      "math.stat.descriptive": "summary statistics and visualisation",
      "math.prob.basics": "conditional probability and base rates",
      "res.data.visualization": "honest graph design",
    },
  },
  "media.lit.science-news": {
    title: "Evaluating science news",
    description: "Tracing a science news story back to the original paper; assessing the sample, model organism, preprint status, peer review and press-release hype.",
    whyItMatters: "Neuroscience and health are the most hyped fields in the news; this brings research literacy into contact with public information.",
    entryQuestions: [
      "If the study behind the headline 'Scientists discover X boosts the brain' was done in mice, how accurate is the headline? How would you rewrite it?",
    ],
    coreQuestions: [
      "How does a claim change between the news story, the press release and the original paper?",
      "Which factors limit a study's external validity (mouse → human, lab → life)?",
      "How can you tell the difference between a single study and a scientific consensus?",
    ],
    learningObjectives: [
      "Locates the original paper behind a science news story and compares the claims of the two texts",
      "Lists a study's limitations (sample, design, model) and assesses how much the story exaggerates",
      "Rewrites an exaggerated headline in proportion to the evidence",
    ],
    commonMisconceptions: [
      "Every result published in a peer-reviewed journal is settled knowledge.",
      "Results from animal experiments apply directly to humans.",
      "A single new study overturns all previous evidence.",
    ],
    researchApplications: ["A short report comparing a science news story with the original paper"],
    links: {
      "res.lit.reading": "reading the methods and results sections of a paper",
      "res.stats.pitfalls": "p-hacking and small-sample problems",
      "neuro.methods.imaging": "the limits of brain-imaging findings",
    },
  },
  "media.lit.image-video": {
    title: "Verifying images and video",
    description: "Methods such as spotting images taken out of context, reverse image search, metadata, and verifying location and time.",
    whyItMatters: "Most misleading content is not fake but real footage in the wrong context; telling them apart calls for a fast, systematic method.",
    entryQuestions: [
      "Can a real photograph lie without being altered? How? Build an example scenario.",
    ],
    coreQuestions: [
      "How do you find when and where an image was first published?",
      "How do clues in an image, such as shadows, signs and weather, verify location and time?",
      "How do cropping and a false caption change the context?",
    ],
    learningObjectives: [
      "Finds the earliest source of an image using reverse image search",
      "Draws a justified inference about location and time from clues in an image",
      "Explains how an image taken out of context misleads",
    ],
    commonMisconceptions: [
      "An unaltered photograph always shows the truth.",
      "A video that has been shared widely must be genuine.",
    ],
    links: {
      "phys.optics.geometric": "inferring time from the direction and length of shadows",
      "gk.geo.maps": "using maps to verify location",
    },
  },
  "media.lit.algorithms": {
    title: "Algorithms, recommender systems and filter bubbles",
    description: "What recommendation algorithms measure in order to maximise engagement, and how this shapes the content we see.",
    whyItMatters: "It shows that the information environment is not neutral, and makes the social impact of machine-learning concepts concrete.",
    entryQuestions: [
      "Why is the feed you see in an app different from your friend's in the same app? Guess what the algorithm might treat as a 'reward'.",
    ],
    coreQuestions: [
      "Which signals (clicks, watch time, likes) do recommender systems optimise?",
      "How can feedback loops strengthen filter bubbles and polarisation?",
      "How can a user deliberately diversify their feed?",
    ],
    learningObjectives: [
      "Diagrams a simple recommender system with its objective function and feedback loop",
      "Observes their own feed for a week and reports the patterns",
      "Explains the possible side effects of engagement-driven optimisation",
    ],
    commonMisconceptions: [
      "What I see in my feed is, neutrally, the 'most important' content.",
      "Algorithms are just rules picked by hand by a single person.",
    ],
    links: {
      "prog.ml.basics": "classification and the objective function",
      "neuro.comp.reinforcement": "systems that learn from a reward signal",
      "math.opt.optimization": "side effects of optimising a single metric",
    },
  },
  "media.lit.ai-content": {
    title: "Recognising AI-generated content",
    description: "How generative AI produces text, images, audio and video; the limits of detection methods and the importance of verifying the source.",
    whyItMatters: "As synthetic content grows, the question 'what is its source?' matters more than 'does it look real?'; this carries verification skills into a new context.",
    entryQuestions: [
      "If an AI-detection tool says a text was 'written by a human', how far can you trust it? How could the tool be wrong?",
    ],
    coreQuestions: [
      "How do generative models produce content, and why can they give 'plausible but wrong' output?",
      "Why is detection based on visual clues becoming less and less reliable?",
      "How does source and provenance verification approach this problem?",
    ],
    learningObjectives: [
      "Explains why a generative model fabricates (hallucinates) using the idea of probabilistic prediction",
      "Applies a verification plan to suspicious content that relies on its source rather than only its appearance",
      "Checks the factual claims in an AI output against independent sources",
    ],
    commonMisconceptions: [
      "AI content can always be recognised by obvious errors.",
      "Detection tools give reliable, definitive results.",
      "A fluent, confident text is correct.",
    ],
    links: {
      "prog.ml.neural-nets": "the basis of generative models",
      "neuro.comp.ann-bridge": "artificial networks and human perception",
      "math.prob.distributions": "probabilistic next-word prediction",
    },
  },
  "media.lit.persuasion": {
    title: "Persuasion, propaganda and cognitive biases",
    description: "Persuasion techniques such as emotional appeal, repetition, the enemy image and false consensus, and the cognitive biases they exploit.",
    whyItMatters: "It helps you notice your own thought processes in advertising, political rhetoric and social media, connecting neuroscience and psychology to everyday life.",
    entryQuestions: [
      "Does a claim feel truer the more often you hear it? Design a small experiment to test this on yourself.",
    ],
    coreQuestions: [
      "How do confirmation bias and the repetition effect reinforce beliefs?",
      "Which emotional and cognitive processes do propaganda techniques target?",
      "Which practical safeguards work against our own biases?",
    ],
    learningObjectives: [
      "Names the techniques used in a persuasive text and explains their effect",
      "Relates the mechanism of a bias to decision-making processes",
      "Builds a concrete checklist against biases for their own information consumption",
    ],
    commonMisconceptions: [
      "Only poorly educated people are influenced by propaganda.",
      "Knowing about biases makes you immune to them.",
    ],
    links: {
      "neuro.cog.decision": "decision-making and reward systems",
      "neuro.cog.emotion": "the effect of emotion on judgement",
      "gk.econ.behavioral": "framing and loss aversion",
    },
  },
  "media.lit.current-events-method": {
    title: "A method for following current events",
    description: "A method for accepting the uncertainty of early reports on developing events, comparing several sources and building an information diet.",
    whyItMatters: "It builds a patient, systematic attitude towards information that spreads quickly and is later corrected; it is a lasting habit independent of any particular event.",
    entryQuestions: [
      "What share of the reports in the first hours of an event do you think get corrected later? When, then, should you share something?",
    ],
    coreQuestions: [
      "How do you tell news, opinion and analysis apart?",
      "In a developing event, which information is reliable and which should wait?",
      "How do you build a balanced information diet?",
    ],
    learningObjectives: [
      "Classifies a text as news, opinion or analysis and states the reasoning",
      "Creates a personal information-diet plan that includes sources from different perspectives",
      "Follows a topic over several days and records how the information changes",
    ],
    commonMisconceptions: [
      "The first report to appear is usually the most accurate.",
      "Following a single reliable source is enough.",
    ],
    links: {
      "gk.method.historical-thinking": "how narratives change over time",
      "gk.civics.democracy": "informed citizenship",
    },
  },
  "media.lit.privacy": {
    title: "Digital privacy and data security",
    description: "How personal data is collected and used, consent mechanisms, strong passwords, two-factor authentication and recognising phishing attacks.",
    whyItMatters: "It protects personal safety and research data, and makes concrete what data algorithms are fed.",
    entryQuestions: [
      "If an app is free, where does the company make its money? Who might the 'product' be?",
    ],
    coreQuestions: [
      "What personal data is collected, and what can be inferred from it?",
      "Which clues give away a phishing message?",
      "Why does password security depend on length and uniqueness?",
    ],
    learningObjectives: [
      "Reviews an app's permissions and privacy settings and carries out a risk assessment",
      "Calculates the effect of password length on the number of possible combinations",
      "Identifies phishing attempts among sample messages and explains the reasoning",
    ],
    commonMisconceptions: [
      "If I have nothing to hide, privacy doesn't matter.",
      "A complex but short password is safer than a long one.",
    ],
    links: {
      "math.prob.counting": "counting password combinations",
      "res.data.management": "securing research data",
      "gk.civics.law-basics": "legal protection of personal data",
    },
  },
  "media.lit.production": {
    title: "Responsible content creation and science communication",
    description: "Producing content that explains a scientific finding to a wide audience clearly, with sources, and in proportion to the evidence.",
    whyItMatters: "It turns literacy into production, letting students share their own research and what they have learned with society responsibly.",
    entryQuestions: [
      "Could you explain a complex scientific finding in a 60-second video without saying anything wrong? What would you cut, and what would you keep at all costs?",
    ],
    coreQuestions: [
      "Where is the line between simplifying and distorting?",
      "How do you convey uncertainty and limitations to a wide audience?",
      "Why do citing sources and publishing corrections build trust?",
    ],
    learningObjectives: [
      "Turns a scientific paper into a short popular text or video in proportion to the evidence",
      "States the uncertainty and limitations clearly in the content produced",
      "Gathers feedback from peers and revises the content for accuracy",
    ],
    commonMisconceptions: [
      "Good science communication means giving every detail.",
      "A little exaggeration to impress the audience is harmless.",
    ],
    researchApplications: ["A popular-science summary of their own research project"],
    competitionApplications: ["Science communication and presentation competitions"],
    links: {
      "res.write.presentation": "scientific presentation skills",
      "en.c1.sci-communication": "science communication in English",
      "neuro.cog.learning-memory": "the memory basis of clear explanation",
    },
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_MEDIA: Record<string, string> = {
  "Medya okuryazarlığı": "Media literacy",
  "Doğrulama": "Verification",
  "Dijital ekosistem": "Digital ecosystem",
};
