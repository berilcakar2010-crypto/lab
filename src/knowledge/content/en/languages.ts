import type { LOText } from "../../schema";

/** English overlay for the ENGLISH, GERMAN and JAPANESE builders in languages.ts. */
export const EN_LANGUAGES: Record<string, LOText> = {
  // ═════════════════════════════════════════════ ENGLISH
  "en.b1.grammar-review": {
    title: "B1: Consolidating grammar (tenses, conditionals, the passive)",
    description: "Consolidation aimed at using the tense system, conditional sentences and the passive deliberately and accurately.",
    whyItMatters: "It is the load-bearing skeleton of academic reading and writing: in scientific texts you constantly meet the passive and conditionals ('if the temperature increases…').",
    entryQuestions: [
      "Of two people, one saying 'I have lived here for five years' and the other 'I lived here for five years', which one still lives there? How can you tell?",
      "Why do scientific papers so often write 'The sample was heated' instead of 'We heated the sample'? Make a guess.",
    ],
    coreQuestions: [
      "What decides the choice between the present perfect and the past simple?",
      "How do the types of conditional sentence express degrees of reality?",
      "When is the passive the better choice, and when does it make a text vague?",
    ],
    learningObjectives: [
      "Writes a short paragraph about an experience, choosing the tense that fits the context",
      "Expresses the result of an experiment with real and hypothetical conditionals",
      "Turns an active methods paragraph into the passive and justifies which version is more appropriate",
    ],
    commonMisconceptions: [
      "The Turkish past tense '-di' always corresponds to the past simple.",
      "The passive is always more 'academic' and always better.",
    ],
    links: {
      "res.write.report": "choosing tense and voice in scientific writing",
    },
  },
  "en.b1.vocab": {
    title: "B1: Vocabulary-learning strategies and vocabulary",
    description: "Building a lasting vocabulary by learning high-frequency words in context, analysing roots and affixes, learning collocations and using spaced repetition.",
    whyItMatters: "How much you understand when reading and listening depends largely on your vocabulary; most scientific terms can be guessed from their Latin and Greek roots.",
    entryQuestions: [
      "Even if you have never seen the word 'neuroplasticity', can you guess its meaning from its parts? Try it.",
      "Which sticks better: repeating a word 20 times from a list, or meeting it in 5 different sentences? Make a guess.",
    ],
    coreQuestions: [
      "Which words should be learned first (the frequency principle)?",
      "How do roots and affixes help you guess the meaning of an unknown word?",
      "How do spaced repetition and retrieval make vocabulary learning stick?",
    ],
    learningObjectives: [
      "Builds a personal deck of word cards, with their collocations, from the texts they read",
      "Guesses the meaning of unknown words from roots, affixes and context and checks the guess in a dictionary",
      "Sets up a spaced-repetition schedule, follows it for a month and records the recall rate",
    ],
    commonMisconceptions: [
      "Knowing a word means knowing its Turkish equivalent.",
      "The more word lists I memorise, the better I will speak.",
    ],
    links: {
      "neuro.cog.learning-memory": "spaced repetition and the retrieval effect",
      "comp.meta.learning-to-learn": "learning strategies",
    },
  },
  "en.b2.reading": {
    title: "B2: Reading strategies (skimming, scanning, inference)",
    description: "Adjusting reading speed and strategy to your purpose: skimming for the main idea, scanning for information, and inferring implied meaning.",
    whyItMatters: "Most sources are in English; with the right strategy you can efficiently pull the information you need out of a paper or a textbook chapter.",
    entryQuestions: [
      "Can you grasp the main idea of a text without understanding every word? Make a guess from the headings and the first sentences of the paragraphs alone, then read the text and compare.",
    ],
    coreQuestions: [
      "For what purposes are skimming and scanning used?",
      "How do connectives and signal words reveal the structure of an argument?",
      "How do you infer an attitude that the writer does not state openly?",
    ],
    learningObjectives: [
      "Identifies the main idea of a long text quickly by skimming and checks it",
      "Finds specific information in a text by scanning",
      "Infers the writer's attitude using evidence from the text",
    ],
    commonMisconceptions: [
      "Reading well means looking up every word in the dictionary.",
      "Reading fast always means reading superficially.",
    ],
    links: {
      "gk.lit.reading-analysis": "skills of inference and interpretation",
      "res.lit.reading": "strategies for reading papers",
    },
  },
  "en.b2.listening": {
    title: "B2: Listening to lectures and talks, and taking notes",
    description: "Following long talks such as lectures, seminars and podcasts, telling the main idea from detail and taking structured notes.",
    whyItMatters: "Online courses, summer schools and conference talks are in English; the ability to take notes while listening directly determines how efficiently you learn.",
    entryQuestions: [
      "When a speaker says 'There are three reasons…', how do you organise your notes? How do signals like this make listening easier?",
    ],
    coreQuestions: [
      "How do you catch a speaker's structural signals (first, however, in summary)?",
      "How do you distinguish the main idea from examples and detail?",
      "Which note-taking methods (Cornell, mind maps) suit which kind of listening?",
    ],
    learningObjectives: [
      "Listens to a science lecture in English and produces structured notes",
      "Reconstructs the main argument of a talk from their notes in a short summary",
      "Tracks their comprehension of speakers with different accents and reports where they struggle",
    ],
    commonMisconceptions: [
      "Watching with subtitles develops listening skills just as much.",
      "It is impossible to understand a talk without hearing every word.",
    ],
    links: {
      "neuro.cog.attention": "managing attention during long listening",
      "neuro.sys.sensory": "auditory perception",
    },
  },
  "en.b2.speaking": {
    title: "B2: Fluent speaking and discussion",
    description: "Giving an opinion on a topic, justifying it, responding to an opposing view and keeping a discussion going.",
    whyItMatters: "It is needed for interviews, summer-school discussions and international collaborations, and teaches you to put your thoughts into words in real time.",
    entryQuestions: [
      "If you can't remember a word while speaking, what can you do instead of falling silent? Suggest three different strategies.",
    ],
    coreQuestions: [
      "How do you give an opinion and disagree politely but clearly?",
      "How do you strike a balance between fluency and accuracy?",
      "How do you use paraphrase when you don't know a word?",
    ],
    learningObjectives: [
      "Gives an unprepared two-minute talk stating an opinion on a science topic",
      "Summarises the opposing view in a discussion and gives a reasoned reply",
      "Listens to a recording of their own speech, identifies recurring errors and makes a plan to correct them",
    ],
    commonMisconceptions: [
      "If I can't speak without mistakes, I shouldn't speak at all.",
      "If my accent doesn't sound 'native', I'm not speaking well.",
    ],
    links: {
      "comp.meta.stress": "managing speaking anxiety",
      "gk.phil.intro": "building an argument",
    },
  },
  "en.b2.writing": {
    title: "B2: Writing paragraphs and essays",
    description: "Writing coherent paragraphs and short essays with a topic sentence, supporting detail and linking expressions.",
    whyItMatters: "It is the foundation of academic writing and is used directly in writing emails, application statements and reports.",
    entryQuestions: [
      "If you shuffled the sentences of a paragraph, what clues would let a reader find the right order? What do those clues tell you about writing?",
    ],
    coreQuestions: [
      "What is the structure of a good paragraph?",
      "How do linking expressions (however, therefore, in contrast) show logical relationships?",
      "How do you plan and revise an essay?",
    ],
    learningObjectives: [
      "Writes a coherent paragraph supported by a topic sentence and evidence",
      "Writes a formal email to a teacher or a researcher",
      "Revises a draft essay in response to feedback",
    ],
    commonMisconceptions: [
      "Long, complex sentences improve the quality of writing.",
      "Thinking in Turkish and translating word for word is a good method.",
    ],
    links: {
      "res.write.report": "structured writing",
    },
  },
  "en.c2.style": {
    title: "C2: Style, tone and fine shades of meaning",
    description: "Advanced language use such as the fine differences between synonyms, adjusting tone and register, irony and implication.",
    whyItMatters: "It brings reading and writing close to native level, allowing full understanding of literary texts, subtle critical writing and persuasive texts.",
    entryQuestions: [
      "Do 'slim', 'skinny' and 'thin' say the same thing? What would you think about the attitude of a speaker who uses each one?",
    ],
    coreQuestions: [
      "What does the choice of register (formal, neutral, informal) communicate to the reader?",
      "How do you notice differences in connotation between synonyms?",
      "How are irony and implication built into a text, and how are they decoded?",
    ],
    learningObjectives: [
      "Rewrites the same content in three different registers",
      "Analyses the shifts in tone in a text and the word choices that create them",
      "Makes stylistic revisions to their own writing that sharpen its meaning",
    ],
    commonMisconceptions: [
      "Writing at an advanced level means using rare, ornate words.",
      "Synonyms in the dictionary can replace one another in every context.",
    ],
    links: {
      "gk.lit.world": "style in literary texts",
      "media.lit.persuasion": "tone and persuasion",
    },
  },
  "en.c1.academic-vocab": {
    title: "C1: Academic vocabulary and collocations",
    description: "Cross-disciplinary academic words (analyse, significant, hypothesis, consistent with) and their correct collocations.",
    whyItMatters: "The language of scientific papers and academic writing rests largely on this shared vocabulary; correct collocations make writing sound natural.",
    entryQuestions: [
      "In a scientific text, does the word 'significant' mean the same as 'important' in everyday language? What does a statistician think on reading this word?",
    ],
    coreQuestions: [
      "How do academic words differ from their everyday counterparts?",
      "Why do collocations (conduct an experiment, draw a conclusion) matter more than knowing individual words?",
      "Which words change meaning in a scientific context (significant, theory, error)?",
    ],
    learningObjectives: [
      "Compiles a glossary of academic collocations from the papers they read",
      "Rewrites an everyday text using academic vocabulary",
      "Uses words that change meaning in a scientific context correctly and explains the difference",
    ],
    commonMisconceptions: [
      "'Significant' means 'large' or 'important' in every context.",
      "Academic language means using words that are hard to understand.",
    ],
    links: {
      "math.stat.inference": "the statistical meaning of the term 'significant'",
      "gk.phil.science": "the scientific meaning of the word 'theory'",
    },
  },
  "en.c1.academic-writing": {
    title: "C1: Academic writing: argument, hedging and sources",
    description: "Writing academic texts with a thesis statement, evidence-based argument, hedging language (may, suggests, appears to) and the integration of sources.",
    whyItMatters: "It is the basis for writing research reports, application statements and scientific papers, and teaches you to state claims in proportion to the evidence.",
    entryQuestions: [
      "What is the difference between 'This proves that…' and 'These results suggest that…'? When would you use each? Which one would a reviewer object to?",
    ],
    coreQuestions: [
      "How does hedging bring the strength of a claim into line with the evidence?",
      "How is another source's idea integrated by summarising, paraphrasing and quoting?",
      "How is the argument structure of an academic paragraph built?",
    ],
    learningObjectives: [
      "States a finding in hedged language appropriate to the level of evidence",
      "Summarises a source and integrates it into their own text without plagiarising",
      "Writes a short academic text containing a thesis statement, evidence and a counter-argument",
    ],
    commonMisconceptions: [
      "Hedging is a sign of weakness or indecision.",
      "Changing a few words in a sentence is enough to avoid plagiarism.",
    ],
    links: {
      "res.write.report": "the structure of a scientific report",
      "res.lit.citation": "citing sources",
      "media.lit.claim-analysis": "proportion between claim and evidence",
    },
  },
  "en.c1.sci-reading": {
    title: "C1: Reading scientific papers in English",
    description: "Reading the abstract, introduction, methods, results and discussion according to your purpose; decoding figure captions and technical terms.",
    whyItMatters: "It is a prerequisite for doing research: almost all of the literature is in English, and reading papers efficiently sets the pace of research.",
    entryQuestions: [
      "Do you have to read a paper from start to finish in order? If you read only the abstract, the figures and the conclusion, what would you miss, and what would you gain?",
    ],
    coreQuestions: [
      "Which question does each section of the IMRaD structure answer?",
      "How do you read figure and table captions?",
      "What do the authors' hedged statements say about the strength of a claim?",
    ],
    learningObjectives: [
      "Conveys the main claim, method and limitation of an English-language paper in a short summary in Turkish",
      "Reads a figure caption and explains what the figure shows",
      "Identifies hedged statements in a paper and assesses the strength of the claim",
    ],
    commonMisconceptions: [
      "To understand a paper you need to know every word.",
      "The abstract contains all the important information in the paper.",
    ],
    researchApplications: ["Writing a Turkish summary of a chosen neuroscience or physics paper"],
    links: {
      "res.lit.reading": "a method for reading papers",
      "neuro.methods.data-analysis": "the methods language of neuroscience papers",
      "media.lit.science-news": "going to the original paper, not the news story",
    },
  },
  // @@CONTINUE@@
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_LANGUAGES: Record<string, string> = {
  "İngilizce": "English",
  "Genel İngilizce": "General English",
  "Akademik ve bilimsel İngilizce": "Academic and scientific English",
};
