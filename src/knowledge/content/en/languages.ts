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
  "en.c1.sci-communication": {
    title: "C1: Scientific presentations and posters in English",
    description: "Presenting a piece of research in English as a talk and as a poster; handling the question-and-answer session.",
    whyItMatters: "It is needed for international competitions, summer schools and conferences, and teaches you to convey scientific thinking clearly in a short time.",
    entryQuestions: [
      "If a judge asks a question you don't understand during your presentation, what do you say? Which phrases would you prepare in advance so as not to be caught off guard?",
    ],
    coreQuestions: [
      "What is the structure of a scientific presentation, and which transition phrases does it use?",
      "How do you describe a graph step by step in English?",
      "How do you state uncertainty and limitations honestly during questions and answers?",
    ],
    learningObjectives: [
      "Prepares and delivers a five-minute presentation in English on their own project",
      "Describes a graph in English in the order axes, trend, interpretation",
      "Answers a difficult question using phrases for asking for clarification, rephrasing and honestly stating limits",
    ],
    commonMisconceptions: [
      "Writing the full script on the slides and reading it out is a safe method.",
      "Saying 'I don't know' in answer to a question makes the presentation a failure.",
    ],
    competitionApplications: ["Presenting in English at international science fairs and project competitions"],
    links: {
      "res.write.presentation": "presentation and poster design",
      "comp.research.science-fair": "international project competitions",
      "media.lit.production": "science communication",
    },
  },
  "en.c1.math-physics-language": {
    title: "The English of mathematics and physics: reading symbols and the language of problems",
    description: "Reading mathematical expressions aloud ('the derivative of f with respect to x'), the set phrases of problem statements and the language of proof ('suppose', 'it follows that', 'without loss of generality').",
    whyItMatters: "Olympiad problems, English-language textbooks and online courses use this language; a single misread phrase (at least, at most) changes the problem.",
    entryQuestions: [
      "How would you read '∫₀¹ x² dx' aloud in English? How can the difference between 'at most two' and 'at least two' change the answer to an olympiad problem?",
    ],
    coreQuestions: [
      "How are the basic mathematical symbols and operations read in English?",
      "How are the quantifiers in problem statements (at least, exactly, for all, there exists) interpreted?",
      "Which set phrases signal logical steps in written proofs?",
    ],
    learningObjectives: [
      "Reads calculus and algebra expressions aloud correctly in English",
      "Renders an English-language olympiad problem into Turkish, interpreting the quantifiers correctly",
      "Writes a short proof using English proof phrases",
    ],
    commonMisconceptions: [
      "Mathematics is a universal language; the English details of a problem statement don't matter.",
      "'If' and 'if and only if' mean the same thing.",
    ],
    competitionApplications: ["English-language problem statements at international olympiads"],
    links: {
      "math.found.logic": "quantifiers and conditional statements",
      "math.comp.olympiad-methods": "olympiad problems in English",
      "phys.mech.newton": "the language of physics problems in English",
    },
  },
  "en.exam.prep": {
    title: "Preparing for English proficiency exams (IELTS, TOEFL)",
    description: "Planned preparation for the section structure, task types and strategies of international proficiency exams.",
    whyItMatters: "They may be required for summer schools abroad and university applications; the preparation process ties every skill to measurable goals.",
    entryQuestions: [
      "Are scoring well on an exam and using the language well the same thing? If there is a gap between them, how would you balance your preparation?",
    ],
    coreQuestions: [
      "Which skill does each section of the exam measure, and how?",
      "What strategies are specific to each task type?",
      "How do you turn mock-exam results into a plan that targets weak points?",
    ],
    learningObjectives: [
      "Researches the exam structure in official sources and sets up a preparation schedule",
      "Takes a timed mock exam and analyses the results section by section",
      "Scores their own output on the writing and speaking tasks against the assessment criteria",
    ],
    commonMisconceptions: [
      "Just doing mock exams is enough to improve language skills.",
      "All universities require the same exam and the same score.",
    ],
    links: {
      "comp.meta.exam-strategy": "time management and exam strategy",
      "res.career.academic": "application requirements",
    },
    notes: [
      "Exam sections, timings, scoring and validity periods may change; verify the current information on the exam bodies' official websites and with the institution you are applying to.",
    ],
  },
  "en.app.personal-statement": {
    title: "Writing application letters and personal statements",
    description: "Writing motivation letters and personal statements for summer-school, programme and university applications.",
    whyItMatters: "These are the texts that open the doors of an academic path; they teach you to present your own experience with concrete evidence and an original narrative.",
    entryQuestions: [
      "What does an assessor think on reading the sentence 'I am passionate about science'? What could be a more effective way of showing the same thing rather than saying it?",
    ],
    coreQuestions: [
      "What structure does an effective personal statement follow?",
      "How is the principle 'show, don't tell' applied in an application text?",
      "How is the text adapted for different programmes?",
    ],
    learningObjectives: [
      "Writes a draft that describes one of their own research or learning experiences in concrete detail",
      "Revises the text by replacing generic, clichéd sentences with concrete evidence",
      "Adapts the same text to the expectations of two different programmes",
    ],
    commonMisconceptions: [
      "The longer the list of achievements, the stronger the text.",
      "A single text can be used unchanged for every application.",
    ],
    links: {
      "res.career.academic": "academic application processes",
      "en.c2.style": "tone and style",
    },
    notes: ["Verify each programme's expectations for length, format and content on the official page of the institution you are applying to."],
  },

  // ═════════════════════════════════════════════ GERMAN
  "de.a1.basics": {
    title: "A1: Pronunciation, greetings and introducing yourself",
    description: "The German sound system (ü, ö, ch, sch, long and short vowels), greetings, and introducing yourself and others.",
    whyItMatters: "If correct pronunciation isn't learned from the start it is hard to fix later; because German spelling largely predicts pronunciation, reading speeds up.",
    entryQuestions: [
      "Since Turkish already has the sounds 'ü' and 'ö', which sounds give a Turkish speaker learning German an advantage, and which are a struggle? Make a guess.",
      "How does the position of your tongue in your mouth change when you produce the sounds in 'ich', 'Bach' and 'sch'? Try it.",
    ],
    coreQuestions: [
      "What are the basic rules of the relationship between spelling and sound in German?",
      "When is the formal (Sie) and when the informal (du) form of address used?",
      "Which basic phrases do you need to introduce yourself?",
    ],
    learningObjectives: [
      "Introduces themselves in German with their name, age, city and interests",
      "Pronounces new words correctly on the basis of the spelling rules",
      "Builds a short dialogue, choosing 'du' or 'Sie' according to the context",
    ],
    commonMisconceptions: [
      "German pronunciation cannot be predicted from spelling.",
      "'Sie' is used only to address older people.",
    ],
    links: {
      "phys.waves.sound": "sound production and frequency",
    },
  },
  "de.a1.grammar": {
    title: "A1: Articles, verb conjugation and word order",
    description: "The articles der/die/das, present-tense conjugation of regular and basic irregular verbs, and the basic word order with the verb in second position.",
    whyItMatters: "The whole structure of German rests on the article system and verb position; building them solidly early on makes every later level easier.",
    entryQuestions: [
      "Why does 'das Mädchen' (the girl) take the neuter article rather than the feminine? Does the article depend on biological sex or on the form of the word? Form a hypothesis.",
    ],
    coreQuestions: [
      "Which suffix clues (-ung, -chen, -heit) help in guessing the article?",
      "Why is the verb in second position in a main clause, and how does this rule change in a question?",
      "What pattern does regular verb conjugation follow?",
    ],
    learningObjectives: [
      "Guesses articles from word endings and checks them in a dictionary",
      "Builds simple sentences and questions that follow the verb-second rule",
      "Conjugates regular and common irregular verbs correctly",
    ],
    commonMisconceptions: [
      "Articles are completely random and follow no pattern.",
      "German word order puts the verb at the end, as in Turkish.",
    ],
    links: {
      "math.found.logic": "patterns of rules and exceptions",
    },
  },
  "de.a2.everyday": {
    title: "A2: Everyday communication and the past tense (Perfekt)",
    description: "Everyday situations such as shopping, asking the way and making appointments, and talking about past events in the Perfekt.",
    whyItMatters: "It lets you get by on your own in a German-speaking environment; the Perfekt is the main way of talking about the past in spoken German.",
    entryQuestions: [
      "Why do you say 'Ich habe gegessen' but 'Ich bin gegangen'? Could there be a logic to the choice between 'haben' and 'sein'? Look at verbs of motion and guess.",
    ],
    coreQuestions: [
      "How is the Perfekt formed, and how is the auxiliary verb chosen?",
      "Which set phrases are most useful in everyday situations?",
      "How do separable verbs behave in a sentence?",
    ],
    learningObjectives: [
      "Describes their weekend in a few sentences using the Perfekt",
      "Keeps a shopping or appointment dialogue going in a role play",
      "Places separable verbs correctly in a sentence",
    ],
    commonMisconceptions: [
      "Every verb forms the Perfekt with 'haben'.",
      "The prefix of a separable verb always stays attached to the verb.",
    ],
    links: {
      "neuro.cog.learning-memory": "learning chunks and automatisation",
    },
  },
  "de.a2.grammar": {
    title: "A2: Cases (Akkusativ, Dativ) and prepositions",
    description: "How articles change in the Nominativ, Akkusativ and Dativ, and prepositions that govern a case (including two-way prepositions).",
    whyItMatters: "Much of the meaning in German is carried by case endings; this is a prerequisite for decoding the long noun phrases in scientific texts.",
    entryQuestions: [
      "In Turkish, when we say 'kitabı', 'kitaba', 'kitapta', we add the case ending to the end of the word. Where might German put it? Look at the examples 'den Hund' and 'dem Hund'.",
    ],
    coreQuestions: [
      "How do cases show a word's role in the sentence (subject, object, indirect object)?",
      "Which prepositions govern which case?",
      "With two-way prepositions (in, auf, an), how do motion and location determine the choice of case?",
    ],
    learningObjectives: [
      "Determines the case of the elements in a sentence and declines the article correctly",
      "Builds pairs of sentences expressing motion and location with two-way prepositions",
      "Builds an article–case table with their own examples and explains it",
    ],
    commonMisconceptions: [
      "Case can be worked out from meaning alone; articles don't matter.",
      "The Turkish dative ('-e hali') always corresponds to the Dativ.",
    ],
    links: {
      "math.found.functions": "the declension table as a mapping that changes form according to its input",
    },
  },
  "de.b1.communication": {
    title: "B1: Giving opinions and telling stories",
    description: "Giving an opinion on a topic, describing experiences and plans, and writing short texts and letters.",
    whyItMatters: "It marks the move to independent-user level, allowing you to manage daily life and simple academic conversations on a student exchange or at a summer school.",
    entryQuestions: [
      "In a German sentence beginning 'Ich finde, dass…', why does the verb go to the very end? Compare a few examples to discover the rule.",
    ],
    coreQuestions: [
      "Which set phrases express opinion, agreement and disagreement?",
      "How do you turn an experience into a coherent narrative?",
      "How do you write a semi-formal email or letter?",
    ],
    learningObjectives: [
      "States a reasoned opinion orally on a familiar topic",
      "Narrates an experience with a beginning–middle–end structure",
      "Writes an email asking for information about a language course or summer school",
    ],
    commonMisconceptions: [
      "At B1 level grammatical mistakes block communication; I shouldn't speak until I'm perfect.",
    ],
    links: {
      "gk.phil.intro": "justifying an opinion",
    },
  },
  "de.b1.grammar": {
    title: "B1: Subordinate clauses, the Präteritum and the passive",
    description: "Subordinate clauses with the verb at the end (dass, weil, wenn, obwohl), the Präteritum as the past tense of written German, and the passive with werden.",
    whyItMatters: "Written German, especially scientific text, is full of subordinate clauses, the Präteritum and the passive; without them reading cannot get beyond B1.",
    entryQuestions: [
      "If you see the sentence 'Die Lösung wurde erhitzt' in a scientific German text, who did the heating? Why might this information be left out?",
    ],
    coreQuestions: [
      "Why does the verb go to the end of a subordinate clause, and how does the choice of conjunction change the meaning?",
      "In which contexts is the Präteritum preferred, and in which the Perfekt?",
      "What is the difference between the Vorgangspassiv and the Zustandspassiv?",
    ],
    learningObjectives: [
      "Builds subordinate clauses expressing cause, condition and contrast with the correct verb position",
      "Writes up an experimental method using the Präteritum and the passive",
      "Converts active sentences into passive ones and vice versa",
    ],
    commonMisconceptions: [
      "The Präteritum is used only in fairy tales.",
      "The position of the verb in a subordinate clause can vary from speaker to speaker.",
    ],
    links: {
      "res.write.report": "the passive in the methods section",
    },
  },
  "de.b2.argumentation": {
    title: "B2: Discussion and written argument",
    description: "Structured oral discussion weighing the pros and cons of an issue, and the written opinion essay (Erörterung).",
    whyItMatters: "It is the foundation for taking part in discussions and writing opinion pieces at German-speaking universities and in academic settings.",
    entryQuestions: [
      "What does using the phrase 'einerseits… andererseits…' in a German discussion force you to do in your thinking? Choose a topic and try it.",
    ],
    coreQuestions: [
      "What is the classic structure of a written argument in German?",
      "How do you acknowledge and rebut an opposing view?",
      "How do conjunctions and transition phrases steer the flow of an argument?",
    ],
    learningObjectives: [
      "Writes an Erörterung with a pros-and-cons structure on a debate topic related to science",
      "Summarises the opposing view in an oral discussion and gives a reasoned reply",
      "Reviews the flow of argument in their own text in terms of transition phrases",
    ],
    commonMisconceptions: [
      "A strong argument should never mention the opposing view.",
      "Turkish argument structure can be transferred to German one-to-one.",
    ],
    links: {
      "gk.phil.intro": "argument structure",
      "gk.phil.ethics": "debates in the ethics of science",
    },
  },
  "de.b2.grammar": {
    title: "B2: Konjunktiv II and Nominalstil",
    description: "Konjunktiv II for hypotheticals and polite requests; the nominalising style (Nominalstil) characteristic of scientific and official texts.",
    whyItMatters: "Much of the density of scientific German comes from Nominalstil; being able to decode it is the key to reading scientific texts.",
    entryQuestions: [
      "'Nach der Erhitzung der Probe' and 'Nachdem die Probe erhitzt wurde' say the same thing. Which is shorter, and which is easier to understand? Why do scientists like the first one?",
    ],
    coreQuestions: [
      "How does Konjunktiv II express unreal conditions and politeness?",
      "How are verbal constructions turned into noun constructions (Nominalisierung)?",
      "How do you analyse long noun phrases and participial adjectives?",
    ],
    learningObjectives: [
      "Expresses an unreal condition with Konjunktiv II",
      "Converts sentences in verbal style into Nominalstil and back",
      "Analyses a long scientific noun phrase by breaking it into its parts",
    ],
    commonMisconceptions: [
      "Nominalstil is always a better, more 'academic' style.",
      "Konjunktiv II is used only for politeness.",
    ],
    links: {
      "en.c1.academic-writing": "choices of academic style",
    },
  },
  "de.c1.fluency": {
    title: "C1: Fluency, idioms and style",
    description: "Fluent, spontaneous expression on complex topics, idioms and set phrases, and adjusting style to context.",
    whyItMatters: "It allows full participation in a German-speaking academic environment and comfortable reading of authentic texts (literature, essays, newspapers).",
    entryQuestions: [
      "What do you get if you translate 'Das ist nicht mein Bier' word for word? What strategy do you use to understand idioms?",
    ],
    coreQuestions: [
      "How are idioms and set phrases learned and used in the right context?",
      "How do you switch between formal and informal style?",
      "How do you maintain fluency in long, complex conversations?",
    ],
    learningObjectives: [
      "Speaks fluently and without preparation for a few minutes on an abstract topic",
      "Interprets the idioms in a text from context and explains their meaning",
      "Writes the same content in a formal and an informal style",
    ],
    commonMisconceptions: [
      "C1 level means speaking without errors, like a native speaker.",
      "Idioms can be used correctly by memorising them from a vocabulary list.",
    ],
    links: {
      "gk.lit.world": "authentic texts from German literature",
    },
  },
  "de.c1.exam": {
    title: "Preparing for C1 exams (Goethe-Zertifikat C1, TestDaF)",
    description: "Planned preparation for the structure and task types of exams that certify proficiency in German at C1 level.",
    whyItMatters: "A certificate of language proficiency may be required for university study and research programmes in German-speaking countries.",
    entryQuestions: [
      "If two different proficiency exams measure the same level with different tasks, how do you decide which one to prepare for? What information do you need to research?",
    ],
    coreQuestions: [
      "Which skills do the sections of the exams measure?",
      "Which institutions accept which exam and which results?",
      "How do you turn mock-exam results into a targeted plan?",
    ],
    learningObjectives: [
      "Researches the exam structures and admission requirements in official sources and prepares a comparison table",
      "Takes a timed mock exam and analyses the results section by section",
      "Scores their own output on the writing and speaking tasks against the assessment criteria",
    ],
    commonMisconceptions: [
      "All German proficiency exams have the same structure and are accepted in the same way everywhere.",
    ],
    links: {
      "comp.meta.exam-strategy": "exam strategy",
      "res.career.academic": "applying to programmes abroad",
    },
    notes: [
      "Exam sections, timings, scoring and admission requirements may change; verify the current information on the official websites of the exam bodies and the university you are applying to.",
    ],
  },
  "de.culture": {
    title: "German-speaking countries: culture and scientific tradition",
    description: "The cultural diversity of the German-speaking countries, the structure of their universities and research institutions, and their place in the history of science.",
    whyItMatters: "It places language learning in a meaningful context and makes you aware that an important part of the history of physics, chemistry and neuroscience was written in German.",
    entryQuestions: [
      "Which terms in physics and chemistry might be of German origin? Where does the first half of the word 'eigenvalue' come from?",
    ],
    coreQuestions: [
      "What linguistic and cultural differences are there between the German-speaking countries?",
      "How are universities and research institutions organised?",
      "How has the historical importance of German as a language of science changed?",
    ],
    learningObjectives: [
      "Compares two German-speaking countries in terms of language use and education system",
      "Compiles scientific terms of German origin and explains their etymology",
      "Researches a research institution in its official sources and writes a short introduction to it",
    ],
    commonMisconceptions: [
      "The same German is spoken everywhere German is spoken.",
      "German has never played an important role in science.",
    ],
    links: {
      "gk.sci-hist.modern-physics": "the German-speaking scientific milieu at the birth of modern physics",
      "math.linalg.eigen": "the origin of the term 'eigen'",
    },
    notes: ["Verify claims about institutions, education systems and history against official and scholarly sources."],
  },
  "de.b1.science-vocab": {
    title: "B1: Basic scientific vocabulary",
    description: "Numbers, units, mathematical operations, laboratory materials and basic terms in physics, chemistry and biology; analysing compound words.",
    whyItMatters: "It is a prerequisite for reading scientific texts and communicating in the laboratory; German compound words can be understood from their parts.",
    entryQuestions: [
      "Starting from the words 'Geschwindigkeit', 'Beschleunigung' and 'Kraft', what might 'Erdbeschleunigung' mean? Break the compound apart.",
    ],
    coreQuestions: [
      "How are compound words broken down, and which part determines the meaning?",
      "How are mathematical expressions read in German?",
      "Which basic expressions are needed in a laboratory setting?",
    ],
    learningObjectives: [
      "Guesses the meaning of scientific compound words by breaking them into parts, and checks the guess",
      "Reads simple equations and units aloud in German",
      "Describes an experiment, with its materials and steps, in a few German sentences",
    ],
    commonMisconceptions: [
      "Scientific terms are the same in every language, so there is no need to learn them separately.",
      "Long compound words should be memorised as single units, just as they appear in the dictionary.",
    ],
    links: {
      "phys.measure.units": "units and the language of measurement",
      "chem.react.types": "terms for reactions",
      "bio.cell.structure": "terms in cell biology",
    },
  },
  "de.b2.science-reading": {
    title: "B2: Reading scientific texts",
    description: "Understanding German scientific texts such as textbook chapters, popular-science writing and simple paper abstracts.",
    whyItMatters: "It gives direct access to German-language sources and puts Nominalstil and passive constructions to use in a real context.",
    entryQuestions: [
      "If you read a paragraph in a German physics text explaining Newton's second law, which words and formulas would help you understand it? How would you use the physics you already know as 'scaffolding'?",
    ],
    coreQuestions: [
      "How does subject knowledge make reading in a foreign language easier?",
      "How do you systematically analyse long sentences and noun phrases?",
      "How do you tell a definition, an example and a conclusion apart in a text?",
    ],
    learningObjectives: [
      "Reads a chapter of a German physics or chemistry textbook and summarises the main concepts in Turkish",
      "Analyses a complex sentence by breaking it into verb and noun phrases",
      "Restates a definition and a formula from the text in German in their own words",
    ],
    commonMisconceptions: [
      "You need to reach C1 level before you can read scientific texts.",
      "Looking up every unknown word in the dictionary speeds up reading.",
    ],
    researchApplications: ["Compiling a glossary of terms from a chapter of a German textbook"],
    links: {
      "phys.mech.newton": "familiar physics content acts as scaffolding for reading",
      "chem.equilibrium": "the concept of equilibrium in German chemistry texts",
      "phys.thermo.laws": "the German terminology of thermodynamics",
    },
  },
  "de.b2.science-communication": {
    title: "B2: Scientific presentation and discussion",
    description: "Presenting an experiment or project in German, explaining a graph and answering questions after the presentation.",
    whyItMatters: "It is needed for exchange programmes and for collaboration in German-speaking laboratories.",
    entryQuestions: [
      "When describing a graph, are verbs like 'steigt', 'sinkt' and 'bleibt konstant' enough? What else do you need to tell the whole story of a curve?",
    ],
    coreQuestions: [
      "What is the structure of a German presentation, and which transition phrases does it use?",
      "Which set phrases are used to describe graphs and data?",
      "How do you express uncertainty during questions and answers?",
    ],
    learningObjectives: [
      "Gives a presentation of a few minutes in German on their own project",
      "Describes a graph in German in the order axes, trend, interpretation",
      "Gives reasoned, honest answers to questions after the presentation",
    ],
    commonMisconceptions: [
      "Memorising the presentation is a substitute for fluency.",
    ],
    links: {
      "res.write.presentation": "presentation design",
      "res.data.visualization": "describing graphs",
    },
  },
  "de.c1.academic-writing": {
    title: "C1: Academic writing (wissenschaftliches Schreiben)",
    description: "German academic text types (Hausarbeit, Bericht), quotation, hedging and the conventions of academic style.",
    whyItMatters: "It is the foundation for writing assignments, reports and theses at a German-speaking university, and connects directly to the writing sections of C1 exams.",
    entryQuestions: [
      "Why is using 'ich' usually avoided in German academic writing? How would you express the same thought impersonally? Does this come at a cost?",
    ],
    coreQuestions: [
      "What are the structure and stylistic expectations of a German academic text?",
      "How do you quote directly and report indirectly (including with Konjunktiv I)?",
      "With what means is hedging built in German?",
    ],
    learningObjectives: [
      "Writes a short academic text on a scientific topic consisting of an introduction, a main part and a conclusion",
      "Reports a source's view correctly using indirect speech",
      "Revises their own text against the criteria of academic style",
    ],
    commonMisconceptions: [
      "Academic writing means building the longest sentences possible.",
      "The rules of English academic writing carry over to German one-to-one.",
    ],
    links: {
      "res.write.report": "the structure of a scientific report",
      "res.lit.citation": "citing sources",
      "en.c1.academic-writing": "academic writing compared across languages",
    },
  },

  // ═════════════════════════════════════════════ JAPANESE
  "ja.n5.kana": {
    title: "N5: Hiragana and katakana",
    description: "Reading and writing the two syllabaries, long vowels, double consonants and writing foreign words in katakana.",
    whyItMatters: "It is the first gateway to reading Japanese; you meet katakana in a large share of scientific and technical terms.",
    entryQuestions: [
      "Can you decode the word 'コンピューター' using a katakana chart? Guess how an English word is adapted to Japanese sounds.",
    ],
    coreQuestions: [
      "For what functions are hiragana and katakana used?",
      "What systematic order is the syllable chart built on?",
      "How are foreign words adapted to the Japanese sound structure?",
    ],
    learningObjectives: [
      "Reads and writes all hiragana and katakana characters fluently",
      "Decodes words of foreign origin written in katakana",
      "Writes their own name and a few scientific terms in katakana",
    ],
    commonMisconceptions: [
      "It is easier to learn with romaji (Latin letters) first and switch to kana later.",
      "Katakana is used only for foreign names.",
    ],
    links: {
      "neuro.cog.learning-memory": "visual–auditory pairing and spaced repetition",
      "comp.meta.learning-to-learn": "mnemonic techniques",
    },
  },
  "ja.n5.grammar": {
    title: "N5: Basic grammar (です/ます, particles)",
    description: "The polite です/ます forms, the basic particles (は, が, を, に, で, の) and subject–object–verb word order.",
    whyItMatters: "Japanese word order is very similar to Turkish; using this similarity deliberately speeds up learning.",
    entryQuestions: [
      "How closely does the order of '私は学生です' resemble the Turkish 'Ben öğrenciyim'? What other structures might Japanese and Turkish share? Make a guess.",
    ],
    coreQuestions: [
      "How do particles mark the roles of words in a sentence?",
      "What is the basic difference between は and が?",
      "When are the polite and plain forms used?",
    ],
    learningObjectives: [
      "Builds sentences describing themselves and their daily routine with です/ます forms",
      "Fills in the gaps in a sentence by choosing the right particles",
      "Explains the similarities and differences between Japanese and Turkish sentence structure by comparing them",
    ],
    commonMisconceptions: [
      "は and が can always be used interchangeably.",
      "Japanese grammar is completely alien to a Turkish speaker.",
    ],
    links: {
      "math.found.logic": "analysing sentence structure with rules",
    },
  },
  "ja.n5.kanji-vocab": {
    title: "N5: Basic kanji and vocabulary",
    description: "The first kanji, used in numbers, days of the week, basic nouns and verbs; the relationship between a kanji's meaning and its readings.",
    whyItMatters: "Kanji are the cornerstone of reading Japanese; the components (radicals) of the basic kanji make learning every later kanji easier.",
    entryQuestions: [
      "If you know the character '木' (tree), what might '林' and '森' mean? Guess other examples of this kind of logical structure in kanji.",
    ],
    coreQuestions: [
      "What components (radicals) are kanji made of?",
      "How do the on'yomi and kun'yomi readings differ?",
      "Which strategies (mnemonics, component analysis, spaced repetition) work for learning kanji?",
    ],
    learningObjectives: [
      "Recognises the basic kanji with their meanings and common readings",
      "Breaks a kanji down into its radicals and builds a mnemonic for its meaning",
      "Reads basic words in sentences that mix kanji and kana",
    ],
    commonMisconceptions: [
      "Every kanji has a single reading.",
      "Kanji are entirely random pictures with no structure.",
    ],
    links: {
      "neuro.cog.learning-memory": "meaningful encoding and spaced repetition",
    },
    notes: ["The kanji and vocabulary lists recommended for N5 are not an official syllabus; compare current sources."],
  },
  "ja.n4.grammar": {
    title: "N4: Verb forms (て-form, ない-form, potential)",
    description: "Verb groups, the て-form and its uses, the negative ない-form, the potential form and plain speech forms.",
    whyItMatters: "The て-form is the basis for linking clauses and for many constructions in Japanese; this level is the threshold for understanding everyday conversation.",
    entryQuestions: [
      "'食べる → 食べて' but '書く → 書いて'. Can you sense a rule in this change that depends on the verb ending? Try to work out the rule yourself from a few examples.",
    ],
    coreQuestions: [
      "How do verb groups determine conjugation?",
      "In which constructions (requests, continuous action, sequencing) is the て-form used?",
      "How do you switch between plain and polite forms?",
    ],
    learningObjectives: [
      "Converts verbs into their て-, ない- and potential forms according to their group",
      "Builds sentences describing consecutive actions with the て-form",
      "Converts a polite dialogue into the plain form",
    ],
    commonMisconceptions: [
      "All verbs conjugate in the same way.",
      "The plain form is rude and should always be avoided.",
    ],
    links: {
      "prog.python.functions": "conjugation as a transformation that applies rules according to its input",
    },
  },
  "ja.n4.kanji-vocab": {
    title: "N4: Kanji and vocabulary",
    description: "Kanji and words related to daily life, school and nature; kanji compound words (熟語).",
    whyItMatters: "Compound words are the building blocks of scientific terms; the kanji learned at this level reappear in scientific vocabulary.",
    entryQuestions: [
      "From the kanji '電' (electricity) and '車' (vehicle), what might '電車' mean? And '電気' and '電話'? Discover how a shared kanji builds a family of meanings.",
    ],
    coreQuestions: [
      "How do kanji compound words create meaning?",
      "How can words that share a kanji be grouped and learned together?",
      "Which patterns help in guessing readings?",
    ],
    learningObjectives: [
      "Guesses the meaning of new compound words from known kanji and checks the guess",
      "Prepares a map of word families built around a shared kanji",
      "Reads the kanji words in an N4-level text",
    ],
    commonMisconceptions: [
      "The meaning of a compound word is always the sum of its parts.",
    ],
    links: {
      "neuro.cog.learning-memory": "semantic networks and memory",
    },
    notes: ["The numbers of kanji and words per level are not officially fixed; compare with current sources."],
  },
  "ja.n4.listening": {
    title: "N4: Listening and everyday conversation",
    description: "Understanding everyday conversations, announcements and short, slowly spoken narratives; taking part in simple dialogues.",
    whyItMatters: "Most real communication in Japanese is spoken; if listening doesn't develop as fast as reading, communication breaks down.",
    entryQuestions: [
      "What do the sentence-final 'ね' and 'よ' in Japanese say about the speaker's attitude? Listen to the same sentence with each and guess the difference.",
    ],
    coreQuestions: [
      "How do you recognise contractions and plain forms in spoken language?",
      "How do sentence-final particles convey emotion and attitude?",
      "How do you catch the key information while listening?",
    ],
    learningObjectives: [
      "Listens to a short everyday dialogue and answers who, what and where questions",
      "Introduces themselves and answers questions in a simple dialogue",
      "Practises shadowing regularly and tracks their progress with recordings",
    ],
    commonMisconceptions: [
      "I will understand everything I can read when I hear it, too.",
      "The spoken language in anime and TV series is appropriate in every situation.",
    ],
    links: {
      "neuro.sys.sensory": "auditory perception",
      "neuro.cog.attention": "selective attention while listening",
    },
  },
  "ja.n3.grammar": {
    title: "N3: Intermediate grammar",
    description: "Intermediate structures such as the passive, the causative, conditional forms (と, ば, たら, なら), and expressions of hearsay and conjecture.",
    whyItMatters: "It is the bridge from everyday and simple written texts to authentic texts, and includes the conditional and passive structures common in scientific writing.",
    entryQuestions: [
      "Why does Japanese have four different structures (と, ば, たら, なら) meaning 'if'? Form a hypothesis about which is used in which situation.",
    ],
    coreQuestions: [
      "What are the differences in meaning between the conditional forms?",
      "How are the passive and causative formed, and when are they used?",
      "How do you tell apart the expressions of conjecture and hearsay (らしい, そうだ, ようだ)?",
    ],
    learningObjectives: [
      "Builds sentences choosing the conditional form that fits the context",
      "Converts passive and causative sentences into active ones",
      "Explains the differences between the expressions of conjecture with examples",
    ],
    commonMisconceptions: [
      "All the conditional forms can be used interchangeably in every context.",
    ],
    links: {
      "math.found.logic": "conditional statements and differences in meaning",
    },
  },
  "ja.n3.kanji-vocab": {
    title: "N3: Kanji and vocabulary",
    description: "Kanji and words relating to society, nature, emotions and abstract concepts; reading patterns and homophones.",
    whyItMatters: "It covers a large share of the kanji that appear frequently in newspaper headlines, simple articles and scientific texts.",
    entryQuestions: [
      "Japanese has many words that are pronounced the same but written with different kanji. How might this confusion be resolved in speech? Make a guess.",
    ],
    coreQuestions: [
      "How do phonetic components help in guessing readings?",
      "How are homophones distinguished from context?",
      "How do you analyse compound words that express abstract concepts?",
    ],
    learningObjectives: [
      "Guesses the readings of kanji whose phonetic component is known, and checks the guess",
      "Distinguishes homophones from context",
      "Reads and makes sense of the kanji words in N3-level texts",
    ],
    commonMisconceptions: [
      "Learning kanji simply means memorising the characters one by one.",
    ],
    links: {
      "neuro.cog.learning-memory": "learning large bodies of information so that it lasts",
    },
    notes: ["Kanji lists by level are not officially fixed; compare current sources."],
  },
  "ja.n3.reading": {
    title: "N3: Reading comprehension",
    description: "Understanding texts on everyday topics, such as short articles, informative texts and narratives.",
    whyItMatters: "It marks the beginning of independent access to Japanese sources and prepares for reading scientific texts.",
    entryQuestions: [
      "Japanese texts have no spaces between words. How do you tell where one word ends and the next begins in a sentence? Look at the switches between kanji and kana.",
    ],
    coreQuestions: [
      "How are word boundaries identified in text without spaces?",
      "How do you find the main structure of a long sentence?",
      "How do you infer the main idea of a text and the writer's attitude?",
    ],
    learningObjectives: [
      "Summarises the main idea and details of an N3-level text in Turkish",
      "Identifies the main predicate and the constituents of a long sentence",
      "Guesses unknown words from their kanji and checks the guess",
    ],
    commonMisconceptions: [
      "A text cannot be understood without knowing the reading of every kanji.",
    ],
    links: {
      "gk.lit.reading-analysis": "strategies for inference and interpretation",
    },
  },
  "ja.n3.exam": {
    title: "Preparing for the JLPT N3",
    description: "Planned preparation for the sections and task types of the N3 level of the Japanese-Language Proficiency Test.",
    whyItMatters: "It lets you demonstrate your level of Japanese with an internationally recognised certificate; the preparation process ties skills to measurable goals.",
    entryQuestions: [
      "What does an exam with no speaking or writing section show about your Japanese, and what does it not show? How, then, would you balance your preparation?",
    ],
    coreQuestions: [
      "Which skills do the sections of the exam measure?",
      "What strategies are specific to each task type?",
      "How do you turn mock-exam results into a targeted plan?",
    ],
    learningObjectives: [
      "Researches the exam structure, dates and registration process in official sources",
      "Takes a timed mock exam and analyses the results section by section",
      "Sets up and follows a weekly study plan for the weak sections",
    ],
    commonMisconceptions: [
      "Passing the exam means I speak fluently at that level.",
    ],
    links: {
      "comp.meta.exam-strategy": "exam strategy and time management",
    },
    notes: [
      "Exam sections, timings, scoring and session periods may change; verify the current information on the exam's official website and with your local test centre.",
    ],
  },
  "ja.culture": {
    title: "Japanese culture and scientific tradition",
    description: "Language and politeness (keigo) in Japanese society, the culture of education and research, and how scientific terms were brought into Japanese.",
    whyItMatters: "It places language learning in its cultural context and offers a comparative example of how a language of science is built within a society.",
    entryQuestions: [
      "For scientific concepts arriving from the West, did Japanese coin new kanji compounds or borrow foreign words? Guess the advantages of each route.",
    ],
    coreQuestions: [
      "How do levels of politeness shape language use?",
      "By what routes were scientific terms brought into Japanese?",
      "How are research and educational institutions in Japan organised?",
    ],
    learningObjectives: [
      "Compares examples of polite, plain and honorific language and explains their contexts of use",
      "Compiles and compares examples of scientific terms coined as kanji compounds and borrowed in katakana",
      "Researches a Japanese research institution in its official sources and writes a short introduction to it",
    ],
    commonMisconceptions: [
      "Japanese culture is uniform and unchanging.",
      "All Japanese scientific terms are borrowed from English.",
    ],
    links: {
      "gk.lit.world": "works of Japanese literature",
      "gk.sci-hist.modern-physics": "the international spread of science",
    },
    notes: ["Verify historical and institutional claims against scholarly and official sources; avoid stereotypes."],
  },
  "ja.sci.vocab": {
    title: "Scientific Japanese vocabulary (数学・物理・脳科学)",
    description: "Basic terms in mathematics, physics and brain science; working out a term's meaning from its kanji components.",
    whyItMatters: "Most scientific terms are made of kanji with transparent meanings, so Japanese scientific words can be decoded logically from their parts.",
    entryQuestions: [
      "If you know the words '神経' (nerve) and '細胞' (cell), what might '神経細胞' be? Which mathematical concept do the kanji '微' (very small) and '分' (divide) in the word '微分' suggest?",
    ],
    coreQuestions: [
      "From which kanji components are scientific terms built?",
      "Which terms occur most often in mathematics, physics and neuroscience?",
      "In which fields are scientific terms written in katakana common?",
    ],
    learningObjectives: [
      "Builds a three-field glossary of basic terms from mathematics, physics and neuroscience",
      "Guesses the meaning of unknown scientific terms from their kanji components and checks the guess",
      "Reads simple equations and units in Japanese",
    ],
    commonMisconceptions: [
      "All Japanese scientific terms are written in katakana.",
      "You need to reach N1 level before you can understand scientific terms.",
    ],
    links: {
      "neuro.cell.neuron-anatomy": "the terms for neuron, axon and synapse",
      "math.calc.derivative-def": "the term 微分 and the concept of the derivative",
      "phys.mech.newton": "the terms for force and acceleration",
    },
  },
  "ja.sci.reading": {
    title: "Reading simple scientific texts",
    description: "Reading Japanese scientific content such as popular-science articles, textbook chapters and simple explanatory texts.",
    whyItMatters: "It gives access to Japanese scientific sources and teaches you to use scientific content you already know as scaffolding for language learning.",
    entryQuestions: [
      "If you read a Japanese text on a physics or neuroscience topic you already know, how many of the unknown words could you guess from context? Estimate a proportion first, then try it.",
    ],
    coreQuestions: [
      "How does subject knowledge make scientific reading in a foreign language easier?",
      "With which structures are definitions, explanations and conclusions given in scientific texts?",
      "How are formulas and figure captions read in Japanese?",
    ],
    learningObjectives: [
      "Reads a simple Japanese text on a scientific topic they know and summarises it in Turkish",
      "Identifies the patterns used for definitions and explanations in the text",
      "Adds new terms from the text to their own glossary",
    ],
    commonMisconceptions: [
      "Scientific texts are always harder than everyday texts.",
    ],
    researchApplications: ["Compiling a glossary of terms from a Japanese popular-science article"],
    links: {
      "neuro.cell.action-potential": "familiar neuroscience content acts as scaffolding for reading",
      "phys.mech.newton": "basic concepts in Japanese physics texts",
      "res.lit.reading": "strategies for reading scientific texts",
    },
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_LANGUAGES: Record<string, string> = {
  "İngilizce": "English",
  "Genel İngilizce": "General English",
  "Akademik ve bilimsel İngilizce": "Academic and scientific English",
  "Almanca": "German",
  "Genel Almanca": "General German",
  "Bilimsel Almanca": "Scientific German",
  "Japonca": "Japanese",
  "Genel Japonca": "General Japanese",
  "Bilimsel Japonca": "Scientific Japanese",
};
