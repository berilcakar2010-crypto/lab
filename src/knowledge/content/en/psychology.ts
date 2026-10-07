import type { LOText } from "../../schema";

export const EN_PSYCHOLOGY: Record<string, LOText> = {
  "psy.methods": {
    title: "Research methods in psychology",
    description: "Observation, surveys, correlational studies and experiments; operational definitions, sampling, reliability and validity, and research ethics.",
    whyItMatters: "Every claim in psychology is only as good as its method; this lets you judge a 'studies show that…' sentence and design a small study of your own.",
    entryQuestions: [
      "Students who eat breakfast get higher grades. Should schools make breakfast compulsory? What other explanations could there be?",
      "How would you measure 'happiness'? Say what your proposed measure misses.",
    ],
    coreQuestions: [
      "Which questions can a correlational study answer, and which can only an experiment answer?",
      "How is an abstract concept (anxiety, attention) turned into a measurable variable?",
      "Can a measure be reliable but invalid?",
    ],
    learningObjectives: [
      "Distinguishes correlational from experimental claims and evaluates a causal claim.",
      "Proposes an operational definition and a measure for an abstract psychological concept.",
      "Designs a simple experiment, naming the independent and dependent variables, a control group and likely confounds.",
      "Identifies ethical problems in a study (informed consent, deception, confidentiality).",
    ],
    commonMisconceptions: [
      "Thinking correlation shows causation.",
      "Thinking a large sample automatically fixes a biased selection.",
      "Thinking personal experience or a striking case is stronger evidence than systematic data.",
    ],
    researchApplications: ["Designing a small survey or reaction-time experiment", "Critiquing the methods section of a published study"],
    links: {
      "res.method.causal": "confounds and causation are handled with the same logic",
      "math.stat.inference": "psychology findings are reported with hypothesis tests and confidence intervals",
      "res.ethics": "ethical principles for research with human participants",
    },
  },
  "psy.bio.behavior": {
    title: "Biological bases of behaviour",
    description: "Neurons and neurotransmitters, the main brain regions, the endocrine system, and the joint role of genes and environment in behaviour.",
    whyItMatters: "Every topic in psychology, from emotion to memory, also has a biological level of explanation; this is the bridge between psychology and neuroscience.",
    entryQuestions: [
      "If identical twins grow up in different families, how similar will their personalities be? Guess, then think about what twin studies actually measure.",
      "If damage to one brain region removes an ability, does that ability 'live there'?",
    ],
    coreQuestions: [
      "On what time scales do neurotransmitters and hormones affect behaviour?",
      "How do researchers try to separate the effects of heredity and environment, and where does that separation break down?",
      "What can lesion and imaging studies say about function?",
    ],
    learningObjectives: [
      "Matches the main brain regions to their functions and explains the limits of a one-region-one-function reading.",
      "Compares neural and hormonal communication in speed, range and duration.",
      "Interprets what twin and adoption studies do and do not show about heritability.",
    ],
    commonMisconceptions: [
      "Thinking a heritability figure says how much of a trait in one individual comes from genes.",
      "Believing people use only 10% of their brains.",
      "Thinking there are 'right-brained' and 'left-brained' types of people.",
    ],
    links: {
      "neuro.syn.transmission": "the synaptic transmission underneath behaviour",
      "bio.physiology.endocrine": "how hormones affect behaviour",
      "bio.genetics.mendel": "the basis of inheritance and heritability",
    },
  },
  "psy.sensation-perception": {
    title: "Sensation and perception",
    description: "Sensory thresholds, Weber's law, signal detection theory, bottom-up and top-down processing, Gestalt principles and perceptual illusions.",
    whyItMatters: "It shows that perception is an interpretation, not a copy of the world; this lets you judge the reliability of eyewitnesses, designs and scientific observations.",
    entryQuestions: [
      "In a dark room you can notice a candle's light; in a bright hall you would not notice the same candle. If the threshold is not fixed, what does it depend on?",
      "The same grey square looks lighter on a dark background. Is your eye wrong, or is your brain doing the 'right' calculation?",
    ],
    coreQuestions: [
      "How are absolute and difference thresholds measured, and what does Weber's law say?",
      "How does signal detection theory separate sensitivity from the decision criterion?",
      "How do expectation and context shape perception?",
    ],
    learningObjectives: [
      "Calculates the difference threshold for a stimulus using the Weber fraction.",
      "Interprets hit and false-alarm rates in a signal detection experiment in terms of sensitivity and criterion.",
      "Explains an illusion using bottom-up and top-down processing.",
    ],
    commonMisconceptions: [
      "Thinking perception is a passive recording of the outside world.",
      "Treating sensation and perception as the same process.",
      "Thinking it has been proven that subliminal advertising strongly steers behaviour.",
    ],
    researchApplications: ["Measuring a threshold with an online psychophysics experiment"],
    links: {
      "neuro.comp.bayesian-brain": "modelling perception as prior expectation combined with sensory evidence",
      "math.found.exp-log": "the logarithmic form of the Weber–Fechner relation",
      "art.elements": "Gestalt principles in visual design",
    },
  },
  "psy.states.consciousness": {
    title: "States of consciousness: sleep, dreams, attention",
    description: "Selective attention and its limits, sleep stages and circadian rhythm, theories of dreaming, and the general effects of psychoactive substances on consciousness.",
    whyItMatters: "Sleep and attention are direct conditions for learning; this lets you build your own study routine on evidence.",
    entryQuestions: [
      "At a crowded party you are not listening to anyone, yet you hear it at once when someone says your name. How did you 'hear' a conversation you were not listening to?",
      "Which earns more marks: staying up studying the night before an exam, or sleeping? Justify your prediction.",
    ],
    coreQuestions: [
      "Why is attention limited, and when does multitasking carry a cost?",
      "What are the stages of sleep, and what does the brain do while asleep?",
      "What theories of dreaming exist, and which of them can be tested?",
    ],
    learningObjectives: [
      "Identifies sleep stages on a sleep record (hypnogram) and interprets how they are distributed through the night.",
      "Explains the results of selective attention and inattentional blindness experiments.",
      "Evaluates the effect of sleep deprivation on memory and attention using evidence.",
    ],
    commonMisconceptions: [
      "Thinking that people really do two tasks at the same time when multitasking.",
      "Thinking the brain 'switches off' during sleep.",
      "Thinking lost sleep can be fully made up at the weekend.",
    ],
    links: {
      "neuro.cog.attention": "the neural mechanisms of attention",
      "neuro.methods.electrophysiology": "sleep stages are defined with EEG",
      "gk.phil.mind": "the philosophical side of the problem of consciousness",
    },
  },
  "psy.learning.conditioning": {
    title: "Learning: classical and operant conditioning",
    description: "Classical conditioning (unconditioned and conditioned stimuli and responses, extinction, generalisation), operant conditioning (reinforcement, punishment, reinforcement schedules) and observational learning.",
    whyItMatters: "It explains how habits, fears and the design of games and apps work; it is also the psychological root of reinforcement learning algorithms.",
    entryQuestions: [
      "Why is a slot machine more addictive than a machine that pays out every time? Make a prediction.",
      "When you hear a notification sound your hand goes to your phone. Who taught you that, and when?",
    ],
    coreQuestions: [
      "How do classical and operant conditioning differ?",
      "How is negative reinforcement different from punishment?",
      "Why is a variable-ratio schedule resistant to extinction?",
    ],
    learningObjectives: [
      "Identifies the unconditioned stimulus, conditioned stimulus, unconditioned response and conditioned response in a scenario.",
      "Distinguishes positive and negative reinforcement and punishment with examples.",
      "Predicts and explains the response patterns of reinforcement schedules from a graph.",
      "Designs a behaviour-change plan using operant principles.",
    ],
    commonMisconceptions: [
      "Thinking negative reinforcement is the same as punishment.",
      "Thinking conditioning only happens in animals and simple reflexes.",
    ],
    links: {
      "neuro.comp.reinforcement": "reward prediction error and TD learning are the computational model of conditioning",
      "neuro.syn.neuromodulation": "the role of dopamine in reinforcement",
      "comp.meta.deliberate-practice": "building skills through feedback and reinforcement",
    },
  },
  "psy.cognition.memory": {
    title: "Memory processes and forgetting",
    description: "Encoding, storage and retrieval; sensory, short-term/working and long-term memory; explicit and implicit memory; the forgetting curve, decay, interference and reconstructive memory.",
    whyItMatters: "It gives the scientific basis for how to study: retrieval practice and spaced repetition come from these findings; it also lets you judge how reliable eyewitness testimony is.",
    entryQuestions: [
      "Which helps you remember more a week later: rereading a topic three times, or reading it once and testing yourself twice? Make a prediction.",
      "Can a memory you are vivid and sure about be wrong?",
    ],
    coreQuestions: [
      "Why does the capacity limit of working memory matter?",
      "Why do we forget: trace decay, interference or retrieval failure?",
      "Why is memory a process of reconstruction rather than a recording?",
    ],
    learningObjectives: [
      "Interprets forgetting-curve data and predicts the effect of spaced repetition.",
      "Classifies memory systems (explicit/implicit, episodic/semantic) with examples.",
      "Evaluates misinformation-effect experiments in the context of eyewitness testimony.",
      "Applies retrieval and spacing principles to their own study method.",
    ],
    commonMisconceptions: [
      "Thinking memory works like a video recording.",
      "Thinking that being sure of a memory shows it is accurate.",
      "Thinking rereading is the most effective way to study.",
    ],
    links: {
      "neuro.cog.learning-memory": "the neural basis of the hippocampus and memory systems",
      "comp.meta.learning-to-learn": "spaced repetition and retrieval practice",
      "neuro.syn.plasticity": "the cellular mechanism of long-term memory",
    },
  },
  "psy.cognition.thinking": {
    title: "Thinking, problem solving and cognitive biases",
    description: "Concepts and prototypes, algorithms and heuristics, functional fixedness, framing, and biases such as confirmation bias, availability and anchoring; the distinction between fast and slow thinking.",
    whyItMatters: "It lets you see systematic errors in your own decisions, and explains why the scientific method is designed to guard against biases.",
    entryQuestions: [
      "A bat and a ball cost 1.10 in total; the bat costs 1 more than the ball. How much is the ball? Write down your first answer, then check it.",
      "Plane crashes get a lot of news coverage. How does this affect the feeling that flying is more dangerous than driving?",
    ],
    coreQuestions: [
      "Why do heuristics work, and when do they produce systematic errors?",
      "Which strategies work against confirmation bias?",
      "Can framing make people decide differently with the same information?",
    ],
    learningObjectives: [
      "Names the cognitive bias in a decision scenario and explains its mechanism.",
      "Spots functional fixedness or a mental set in a problem and proposes another representation.",
      "Designs a falsification-based testing strategy against confirmation bias.",
    ],
    commonMisconceptions: [
      "Thinking biases only affect less intelligent or less educated people.",
      "Thinking that knowing about biases automatically protects you from them.",
    ],
    links: {
      "media.lit.persuasion": "persuasion techniques exploit cognitive biases",
      "gk.econ.behavioral": "how biases show up in economic decisions",
      "comp.meta.problem-solving": "problem-solving strategies and breaking a mental set",
    },
  },
  "psy.language": {
    title: "Language development and the language–thought relationship",
    description: "The units of language (phonemes, morphemes, syntax, meaning), stages of language acquisition in children, theories of acquisition, and the debate on how far language shapes thought.",
    whyItMatters: "It explains what is easy and what is hard when learning a foreign language, and lets you judge exaggerated claims about language and thought.",
    entryQuestions: [
      "Children sometimes say 'goed' instead of 'went', a form they have never heard. What does this mistake show about language learning?",
      "Do speakers of a language with no word for a colour find that colour harder to tell apart? How would you test it?",
    ],
    coreQuestions: [
      "Do children acquire language by imitation, by inferring rules, or both?",
      "Is there a sensitive period for language acquisition?",
      "Does language determine thought, influence it, or only express it?",
    ],
    learningObjectives: [
      "Analyses an utterance at the phoneme, morpheme and syntax levels.",
      "Interprets overgeneralisation errors as evidence of rule learning.",
      "Evaluates the strong and weak forms of the linguistic relativity claim against the evidence.",
    ],
    commonMisconceptions: [
      "Thinking children learn language only by imitation.",
      "Thinking growing up bilingual causes lasting language delay.",
    ],
    links: {
      "en.b1.vocab": "vocabulary learning strategies and memory",
      "write.read.close-reading": "analysing the layers of meaning in language",
      "neuro.sys.neuroanatomy": "language areas and the brain",
    },
  },
  "psy.intelligence": {
    title: "Intelligence and measurement",
    description: "Theories of intelligence (general factor g, multiple intelligences, triarchic theory), test standardisation, the normal distribution and standard scores, reliability and validity, test bias, and the heredity–environment debate.",
    whyItMatters: "It shows what a single score can and cannot say about a person, and lets you read exam and measurement systems critically.",
    entryQuestions: [
      "On a test with mean 100 and standard deviation 15, roughly what percentage of people does someone who scores 130 beat? Estimate without looking anything up.",
      "Can an intelligence test be perfectly reliable (same result every time) and still be invalid?",
    ],
    coreQuestions: [
      "Is intelligence a single ability or the sum of several?",
      "How is a test standardised, and how is a standard score interpreted?",
      "What do differences between group averages say about individuals?",
    ],
    learningObjectives: [
      "Converts standard scores to z-scores and turns them into percentiles with the normal distribution.",
      "Distinguishes test–retest reliability from predictive validity using data.",
      "Compares theories of intelligence with their evidence and limitations.",
    ],
    commonMisconceptions: [
      "Thinking high heritability means a trait cannot be changed.",
      "Thinking a test score measures a person's fixed, one-dimensional 'amount of intelligence'.",
    ],
    links: {
      "math.prob.distributions": "test scores are scaled assuming a normal distribution",
      "math.stat.regression": "predictive validity is measured with correlation",
      "res.stats.pitfalls": "misreading group differences",
    },
  },
  "psy.development": {
    title: "Lifespan development",
    description: "Physical, cognitive and social development from before birth to old age; Piaget's stages, Vygotsky's zone of proximal development, attachment research and identity in adolescence.",
    whyItMatters: "It explains how learning and teaching change with age, and helps you make sense of the cognitive and emotional changes of your own adolescence.",
    entryQuestions: [
      "When you pour the same amount of water from a short, wide glass into a tall, thin one, a young child says 'there is more water now'. Why?",
      "Is teenagers' risk-taking explained only by 'hormones'? What else could be involved?",
    ],
    coreQuestions: [
      "Does development proceed in stages or continuously?",
      "What are the strengths and weaknesses of cross-sectional and longitudinal designs in developmental research?",
      "How far do early attachment experiences affect later relationships?",
    ],
    learningObjectives: [
      "Interprets a child's behaviour using Piaget's stages and the concept of conservation.",
      "Applies the idea of the zone of proximal development to a teaching situation.",
      "Compares cross-sectional and longitudinal designs and explains cohort effects.",
    ],
    commonMisconceptions: [
      "Thinking developmental stages happen at the same age for everyone, with sharp transitions.",
      "Thinking cognitive development is complete by adolescence.",
    ],
    links: {
      "neuro.sys.development": "brain development and maturation",
      "res.method.experimental-design": "cross-sectional and longitudinal designs",
      "bio.reproduction": "embryonic development is where lifespan development begins",
    },
  },
  "psy.motivation-emotion": {
    title: "Motivation and emotion",
    description: "Theories of motivation (drive reduction, arousal, hierarchy of needs, self-determination), intrinsic and extrinsic motivation, theories of emotion and the stress response.",
    whyItMatters: "It gives the psychological basis for sustaining long-term study and managing exam anxiety.",
    entryQuestions: [
      "If you started getting paid for a hobby you love, would you want to do it more or less? Make a prediction.",
      "Are you afraid because your heart is racing, or is your heart racing because you are afraid?",
    ],
    coreQuestions: [
      "How is arousal level related to performance?",
      "Under what conditions do external rewards weaken intrinsic motivation?",
      "How do theories of emotion order bodily response and cognitive appraisal?",
    ],
    learningObjectives: [
      "Applies the Yerkes–Dodson relation to a performance situation and predicts the effect of task difficulty.",
      "Compares theories of emotion (James–Lange, Cannon–Bard, two-factor) on a scenario.",
      "Distinguishes intrinsic and extrinsic motivation and evaluates a learning environment with self-determination theory.",
    ],
    commonMisconceptions: [
      "Thinking any reward always increases motivation.",
      "Thinking stress is entirely harmful and never helps performance.",
    ],
    links: {
      "neuro.cog.emotion": "the neural circuits of emotion and stress",
      "comp.meta.stress": "strategies for managing performance anxiety",
      "neuro.cog.decision": "reward and decision making",
    },
  },
  "psy.personality": {
    title: "Personality theories and assessment",
    description: "Psychodynamic, humanistic, trait and social-cognitive approaches; the Big Five model; a scientific evaluation of self-report scales and projective tests.",
    whyItMatters: "It teaches you to test online personality quizzes and 'type' claims against scientific criteria.",
    entryQuestions: [
      "You read a horoscope and say 'that's exactly me'; your friend says the same about the same text. What does that show?",
      "Is a person's behaviour determined by their personality, or by the situation they are in?",
    ],
    coreQuestions: [
      "How do personality theories compare in testability?",
      "What is the Big Five model based on, and how stable is it?",
      "Which biases is personality measurement open to?",
    ],
    learningObjectives: [
      "Compares personality theories in terms of testability and evidence.",
      "Matches the items of a scale to the Big Five dimensions and interprets the scores.",
      "Demonstrates the Barnum effect and social desirability bias on an example test.",
    ],
    commonMisconceptions: [
      "Thinking popular type tests sort personality into scientifically valid categories.",
      "Thinking personality never changes in adulthood.",
    ],
    links: {
      "gk.phil.science": "judging theories by the falsifiability criterion",
      "media.lit.claim-analysis": "testing personality-test claims by level of evidence",
    },
  },
  "psy.social": {
    title: "Social psychology: attitudes, conformity, groups",
    description: "Attribution errors, attitudes and cognitive dissonance, conformity and obedience experiments, group effects (social loafing, groupthink, polarisation), prejudice and helping behaviour.",
    whyItMatters: "It shows how strongly groups and settings shape individual behaviour, and helps you read teamwork, media and public debates more consciously.",
    entryQuestions: [
      "Everyone in class confidently gives an obviously wrong answer. Would you go along? Guess after how many people your chance of going along rises.",
      "If many people witness an accident, does the chance that someone helps go up or down?",
    ],
    coreQuestions: [
      "Why do people put others' behaviour down to personality but their own down to the situation?",
      "What did the conformity and obedience experiments show, and how are they judged ethically?",
      "Why can group discussion make decisions more extreme?",
    ],
    learningObjectives: [
      "Recognises the fundamental attribution error in an explanation of an event and proposes a situational explanation.",
      "Predicts attitude change using cognitive dissonance theory.",
      "Critiques classic social psychology experiments in terms of method, findings and ethics.",
    ],
    commonMisconceptions: [
      "Thinking the behaviour seen in classic experiments is peculiar to 'bad people'.",
      "Thinking all famous experiments are accepted as settled regardless of replication and method critiques.",
    ],
    links: {
      "media.lit.algorithms": "filter bubbles and group polarisation",
      "res.ethics": "the ethics debate around classic experiments",
      "econ.micro.game-theory": "modelling cooperation and social dilemmas",
    },
  },
  "psy.health.disorders": {
    title: "Psychological disorders (definition and classification)",
    description: "The criteria that separate typical from disordered, the logic of diagnostic classification systems, the general features of the main groups of disorders (anxiety, mood, psychotic, etc.) and the biopsychosocial approach — at an educational level only, not for diagnosis.",
    whyItMatters: "It corrects stigmatising and false beliefs about mental health and shows how and why classification systems change. It is not for diagnosing yourself or anyone else; if you are worried, talk to a professional.",
    entryQuestions: [
      "Feeling anxious before an exam is 'normal'. At what point does anxiety start to be seen as a problem? Which criteria would you use?",
      "If a behaviour is ordinary in one culture and seen as odd in another, how universal is the definition of a 'disorder'?",
    ],
    coreQuestions: [
      "Why are the criteria of distress, impairment and deviance not enough on their own?",
      "What are diagnostic classification systems used for, and what criticisms do they face?",
      "How does the biopsychosocial model explain how a disorder arises?",
    ],
    learningObjectives: [
      "Compares the criteria used to separate typical from atypical behaviour and shows the limit of each.",
      "Explains the general features of a group of disorders in terms of biological, psychological and social factors.",
      "Discusses the effects of labelling and stigma using evidence.",
      "Explains how to check the current versions of classification systems and their changes against primary sources.",
    ],
    commonMisconceptions: [
      "Thinking you can diagnose yourself or a friend by reading a list of symptoms.",
      "Thinking psychological disorders are a 'weakness of character'.",
      "Believing people with mental health problems are usually dangerous.",
    ],
    links: {
      "neuro.methods.ethics": "the ethical and social side of brain-based explanations",
      "media.lit.science-news": "reading mental health news critically",
    },
    notes: ["For education only; it contains no diagnosis or treatment advice. If you are concerned, contact a mental health professional."],
  },
  "psy.health.treatment": {
    title: "Treatment approaches and well-being",
    description: "The basic logic of psychotherapy approaches (psychodynamic, humanistic, cognitive-behavioural), the general principle of biomedical approaches, how treatment effectiveness is researched, and evidence-based habits that support well-being — at an educational level, not treatment advice.",
    whyItMatters: "It shows how we decide whether a treatment works (control groups, placebo, meta-analysis), and helps you tell real ways of seeking help from invented 'miracle' fixes.",
    entryQuestions: [
      "Most people who start therapy feel better a few months later. Does that prove the therapy worked? What else might have happened?",
      "Do everyday habits like sleep, exercise and social connection really affect well-being? How would you test it?",
    ],
    coreQuestions: [
      "Where do the different therapy approaches look for the source of a problem?",
      "Which research designs show that a treatment is effective?",
      "How can evidence-based practice be told apart from unsupported claims?",
    ],
    learningObjectives: [
      "Compares therapy approaches in terms of their assumptions and methods.",
      "Evaluates a treatment-effectiveness claim in terms of control groups, placebo and spontaneous recovery.",
      "Researches the level of evidence behind a well-being claim using primary sources.",
    ],
    commonMisconceptions: [
      "Thinking getting help is only for 'severe' cases.",
      "Thinking a method that worked for one person is evidence it works for everyone.",
      "Thinking medication and therapy are fully interchangeable.",
    ],
    links: {
      "res.method.experimental-design": "randomised controlled trials and placebo control",
      "media.lit.claim-analysis": "testing health claims by level of evidence",
      "comp.meta.stress": "evidence-based strategies for managing stress and anxiety",
    },
    notes: ["For education only; not personal treatment advice. For support, contact a professional or your school counselling service."],
  },
  "psy.boss": {
    title: "Boss: Psychology synthesis",
    description: "A research case that brings together memory, development and social psychology: analyse a claim at the levels of method, biology, cognitive process and social context, and design a small study.",
    whyItMatters: "It combines how different areas of psychology answer the same question at different levels, and tests the integrated thinking used in competitions and research projects.",
    entryQuestions: [
      "How would you test the claim 'children form false memories from what they see on screen more easily than teenagers'? Which areas would you need?",
    ],
    coreQuestions: [
      "How is a single behaviour explained at the biological, cognitive, developmental and social levels?",
      "How do you design an ethical, valid study to test a claim?",
    ],
    learningObjectives: [
      "Analyses a complex psychological claim at three or more levels of explanation.",
      "Designs an ethically acceptable study with operationally defined variables.",
      "Analyses a hypothetical data set and writes up the limits of the finding.",
    ],
    competitionApplications: ["Case analysis in Brain Bee and psychology competitions"],
    links: {
      "res.project.mini": "an integrated mini research project",
      "neuro.cog.learning-memory": "connecting memory findings to the neural level",
    },
  },
};

export const UNITS_PSYCHOLOGY: Record<string, string> = {
  "Psikoloji": "Psychology",
  "Yöntem ve biyolojik temeller": "Methods and biological bases",
  "Biliş ve öğrenme": "Cognition and learning",
  "Gelişim, kişilik ve toplum": "Development, personality and society",
};
