import type { LOText } from "../../schema";

export const EN_ARTS: Record<string, LOText> = {
  "music.theory.notation": {
    title: "Notation and rhythm",
    description: "Writing and reading pitch and duration with the staff, clefs, note and rest values, time signatures, ties and dotted values.",
    whyItMatters: "Representing music on paper is a prerequisite for analysing, sharing and performing it; rhythm is a concrete exercise in thinking with fractions.",
    entryQuestions: [
      "How many dotted quavers fit in a 4/4 bar? Predict with fractions first, then try it by clapping.",
      "If you played a song only by clapping, could a friend recognise it? How much information does rhythm carry on its own?",
    ],
    coreQuestions: [
      "How do the staff and clef encode pitch?",
      "How do note values, the time signature and stress determine rhythm?",
      "How are irregularities such as syncopation and triplets written, and why are they interesting?",
    ],
    learningObjectives: [
      "Names notes written in treble and bass clef and finds them on a keyboard or instrument",
      "Writes rhythms that fit a given time signature and corrects faulty bars",
      "Transcribes a short rhythm they hear into note values",
    ],
    commonMisconceptions: [
      "Reading notation is only needed for classical music.",
      "The bottom number of a time signature gives the number of beats in a bar.",
    ],
    links: {
      "math.found.arithmetic": "note values mean adding fractions and working with ratios",
      "write.lit.poetry": "metre and stress in poetry resemble rhythmic structure in music",
    },
  },
  "music.theory.scales": {
    title: "Scales, intervals and tonality",
    description: "Major and minor scales, naming intervals, key signatures, tonality and the circle of fifths, with a brief look at non-Western modes and maqams.",
    whyItMatters: "Intervals and scales are the building blocks of melody and harmony; the circle of fifths gathers the relationships between keys into a single diagram and connects directly to the physics of tuning.",
    entryQuestions: [
      "If you start the major-scale pattern of tones and semitones (T-T-S-T-T-T-S) on another note, how many sharps or flats do you need? Do you see a pattern?",
      "Why can't some of the pitches of Turkish makam music be found on a piano?",
    ],
    coreQuestions: [
      "How is an interval named (number and quality)?",
      "How do major and minor scales differ in structure and effect?",
      "What does the circle of fifths tell us about key signatures and how closely keys are related?",
    ],
    learningObjectives: [
      "Writes major and natural/harmonic/melodic minor scales from any tonic",
      "Names the interval between two notes by number and quality",
      "Works out the key of a piece from its key signature and its opening and closing notes",
      "Identifies related keys using the circle of fifths",
    ],
    commonMisconceptions: [
      "Minor means \"sad\" and major means \"happy\", with no other factors involved.",
      "All musical cultures use the same twelve pitches.",
    ],
    links: {
      "math.discrete.number-theory": "the twelve pitches and the circle of fifths are arithmetic mod 12",
      "math.adv.abstract-algebra": "transposition and inversion form a group structure",
    },
  },
  "music.theory.chords": {
    title: "Chords and harmony",
    description: "Building triads and seventh chords, inversions, chord functions by scale degree, cadences and basic principles of voice leading.",
    whyItMatters: "Harmony is the key to accompanying a melody, writing songs and seeing the tension–resolution logic of a piece.",
    entryQuestions: [
      "Why does a song sometimes leave you feeling it \"hasn't finished\"? Try creating and removing that feeling by changing the final chord.",
    ],
    coreQuestions: [
      "How are triads built, and how do major, minor, augmented and diminished chords differ?",
      "How do the tonic, dominant and subdominant functions create tension and resolution?",
      "How do the types of cadence mark the end of a phrase?",
    ],
    learningObjectives: [
      "Writes the triads on every degree of a given key and labels them with Roman numerals",
      "Analyses the functions and cadences in a chord progression",
      "Harmonises a simple melody following basic voice-leading rules",
    ],
    commonMisconceptions: [
      "The rules of harmony are laws composers must obey.",
      "A chord is any random set of notes played together.",
    ],
    links: {
      "phys.waves.basics": "how consonant and dissonant intervals relate to wave interference and beats",
      "prog.python.basics": "writing a small program that generates chords and scales",
    },
  },
  "music.theory.ear": {
    title: "Ear training: recognising intervals and chords",
    description: "Practice in recognising, singing and transcribing intervals, chord types, cadences and short melodies by ear.",
    whyItMatters: "Theory becomes musical only when it is matched to sound; ear training also shows concretely how auditory perception sharpens with practice.",
    entryQuestions: [
      "Can you find the interval between the first two notes of a song you know? Could you use that song as a \"key\" for recognising the interval?",
    ],
    coreQuestions: [
      "What cues help you tell intervals apart by ear?",
      "How do you recognise the character of major, minor, augmented and diminished chords?",
      "Which strategy works when taking melodic dictation (rhythm first, then pitch)?",
    ],
    learningObjectives: [
      "Names simple intervals and the four basic triads by ear",
      "Notates a short melody after hearing it",
      "Tracks their own recognition accuracy with a regular log and follows a practice plan targeting weak intervals",
    ],
    commonMisconceptions: [
      "You either have an ear or you don't; it cannot be trained.",
      "Someone without perfect pitch cannot recognise intervals.",
    ],
    links: {
      "neuro.sys.sensory": "the auditory system and pitch perception",
      "comp.meta.deliberate-practice": "error logs and targeted repetition",
      "psy.sensation-perception": "perceptual learning and thresholds",
    },
  },
  "music.theory.form": {
    title: "Musical form and analysis",
    description: "Analysing the structure of a work through motif, phrase and period, binary and ternary form, rondo, theme and variations, sonata form and popular song forms.",
    whyItMatters: "Form lets you know where you are while listening to a long work; the principle of repetition and contrast can be compared with ideas of structure in literature, architecture and programming.",
    entryQuestions: [
      "Why does the chorus of a song repeat? What would a five-minute piece with no repetition at all be like for a listener?",
    ],
    coreQuestions: [
      "How do repetition, variation and contrast build a work's structure?",
      "How do the key plan and arrangement of themes work in sonata form?",
      "How do you extract a work's formal outline from a recording?",
    ],
    learningObjectives: [
      "Produces a time-stamped formal outline from a recording or score",
      "Traces and interprets the transformations of a motif within a work",
      "Compares the formal choices of works from two different periods",
    ],
    commonMisconceptions: [
      "Form is a rigid mould that exists before the composer.",
      "Popular music has no formal structure.",
    ],
    links: {
      "write.lit.fiction": "the parallel between structure and repetition in narrative and musical form",
      "prog.algo.recursion": "self-similar, nested structures in theme and variations",
    },
  },
  "music.physics": {
    title: "The physics of music: harmonics and tuning",
    description: "Standing waves on vibrating strings and in air columns, the harmonic series, timbre and spectra, consonance and beats, Pythagorean tuning, just intonation and equal temperament.",
    whyItMatters: "It uses physics and mathematics to explain why an instrument makes the sound it does and why a \"perfect\" tuning cannot exist; it is the most intuitive application of wave physics and Fourier analysis.",
    entryQuestions: [
      "If you stack twelve pure fifths, do you return exactly to the note you started on (seven octaves up)? Compare (3/2)^12 with 2^7.",
      "A violin and a flute play the same A. If the frequency is the same, why do they sound different?",
    ],
    coreQuestions: [
      "How is the harmonic series derived for strings and pipes?",
      "How is timbre related to the relative strengths of the harmonics?",
      "What is the Pythagorean comma, and at what cost does equal temperament solve the problem?",
    ],
    learningObjectives: [
      "Derives the allowed frequencies of a string fixed at both ends and of open and closed pipes from the standing-wave condition",
      "Calculates that a scale built from pure fifths does not close the octave and finds the size of the comma in cents",
      "Plots the frequency spectrum (FFT) of an instrument recording and interprets its harmonics",
      "Calculates a beat frequency and explains how it is used in tuning",
    ],
    commonMisconceptions: [
      "A note consists of a single frequency.",
      "Intervals in equal temperament are \"pure\"; a piano is perfectly in tune.",
      "Louder means higher frequency.",
    ],
    researchApplications: ["A small data analysis recording and comparing the spectra of different instruments"],
    competitionApplications: ["String, pipe and beat problems in physics olympiads"],
    links: {
      "phys.waves.basics": "standing waves and harmonics",
      "math.fourier": "timbre is a sound's Fourier spectrum",
      "phys.waves.sound": "loudness, pitch and beats",
    },
  },
  "art.elements": {
    title: "Elements and principles of visual art",
    description: "Formal analysis of a work through the elements of line, shape, colour, value, texture and space and the principles of balance, emphasis, rhythm, proportion and unity.",
    whyItMatters: "It is the shared language for going beyond calling a painting \"beautiful\" to explaining how it works; the same principles apply in design, scientific visualisation and photography.",
    entryQuestions: [
      "Where does your eye go first when you look at a painting? And then where? How might the painter have drawn that path?",
    ],
    coreQuestions: [
      "How do colour, value and contrast create emphasis?",
      "How are balance and rhythm built in a composition?",
      "How do you combine formal analysis with contextual interpretation?",
    ],
    learningObjectives: [
      "Writes a formal analysis of a work using the vocabulary of elements and principles",
      "Shows the path of the viewer's gaze across a work with a diagram and justifies it",
      "Compares the formal choices of two works on the same subject",
    ],
    commonMisconceptions: [
      "Talking about art is entirely a matter of personal taste.",
      "Colour is only used for realism.",
    ],
    links: {
      "res.data.visualization": "emphasis, contrast and hierarchy also apply to scientific charts",
      "phys.optics.geometric": "perspective and light and shadow rest on geometric optics",
      "psy.sensation-perception": "perception of colour and shape, figure–ground relations",
    },
  },
  "art.history.ancient-medieval": {
    title: "Ancient and medieval art",
    description: "The function, materials, iconography and stylistic change of art from the ancient Mediterranean and Near Eastern civilisations through Byzantine, Romanesque and Gothic art.",
    whyItMatters: "Understanding art's religious, political and social functions lets you see what later periods continued and what they rejected; Anatolia's place in this history can be studied first-hand.",
    entryQuestions: [
      "Can a statue's eyes and posture tell you what the society that made it thought about people? Pick an example from two periods and make a prediction.",
    ],
    coreQuestions: [
      "How did works of art represent religious and political authority?",
      "What might explain the swings between naturalism and stylisation?",
      "How did architectural techniques (arch, dome, buttress) shape style?",
    ],
    learningObjectives: [
      "Analyses a work in terms of material, function and iconography, relating it to its period",
      "Compares works from two periods by their stylistic features",
      "Explains the structural logic and visual result of an architectural innovation",
    ],
    commonMisconceptions: [
      "Medieval art is not \"realistic\" because artists lacked skill.",
      "Ancient statues were always white marble.",
    ],
    links: {
      "gk.world.medieval": "medieval social and religious structures",
      "phys.mech.torque": "load and equilibrium in arches and domes",
    },
    notes: ["Verify the dates, locations and attributions of works using museum catalogues and academic sources."],
  },
  "art.history.renaissance-baroque": {
    title: "Renaissance and Baroque art",
    description: "The Renaissance's new way of seeing through linear perspective and studies of anatomy and light; movement, chiaroscuro and emotional intensity in the Baroque.",
    whyItMatters: "It is one of the periods when art and science were closest (the geometry of perspective, anatomy, optics); it shows how patronage and religious conflict shaped art.",
    entryQuestions: [
      "If you had to find a rule for drawing depth on a flat surface, what would you do? Where do the lines in a photo of a corridor meet?",
    ],
    coreQuestions: [
      "What geometric principle does linear perspective rest on?",
      "How did patronage and religious conflict affect the subjects and style of art?",
      "How does the Baroque depart from the Renaissance ideal of balance?",
    ],
    learningObjectives: [
      "Finds the vanishing point and horizon line in a painting and draws its perspective structure",
      "Compares a Renaissance and a Baroque work in terms of composition, light and movement",
      "Brings a work's patronage and religious context into its interpretation",
    ],
    commonMisconceptions: [
      "The Renaissance was a sudden break from the \"darkness\" of the Middle Ages.",
      "Perspective is drawn by talent alone, with no rules.",
    ],
    links: {
      "math.geo.transformations": "central projection and the geometry of perspective",
      "gk.sci-hist.scientific-revolution": "artist-engineers and knowledge based on observation",
      "gk.world.europe-reformation": "the effect of the Reformation and Counter-Reformation on art",
    },
    notes: ["Verify attributions to artists and the dates of works in current academic sources."],
  },
  "art.history.modern": {
    title: "Modern and contemporary art",
    description: "Movements that moved away from representation under the influence of photography, abstraction, the readymade and conceptual art; the roles of material, space and viewer in contemporary art.",
    whyItMatters: "It teaches you to turn the reaction \"I could have done that\" into a question: what is the art questioning, and why? It lets you follow the effect of technology and social change on visual culture.",
    entryQuestions: [
      "Once the camera was invented, why would a painter still paint realistically? What would you have done as a painter?",
      "Does putting an object in a museum make it a work of art? Who decides?",
    ],
    coreQuestions: [
      "How did photography and industrialisation change the purpose of painting?",
      "How did abstraction and conceptual art redefine the question \"what is art?\"",
      "What questions should you ask when evaluating a contemporary work?",
    ],
    learningObjectives: [
      "Explains, with reasons, how a modern movement broke with the tradition before it",
      "Interprets a conceptual work in terms of the relationship between idea, material and viewer",
      "Writes a short, evidence-based critique of a contemporary work",
    ],
    commonMisconceptions: [
      "Abstract art is made by people who cannot draw.",
      "Contemporary art has no meaning, or a meaning only the artist knows.",
    ],
    links: {
      "gk.world.industrial": "industrialisation, urbanisation and a new visual culture",
      "media.lit.image-video": "image manipulation and claims to reality",
      "write.compose.evidence": "writing an evidence-based critique of a work",
    },
    notes: ["Use museum and academic sources for movement names, artists and dates; do not rely on a single online summary."],
  },
  "art.history.global": {
    title: "Art traditions beyond Europe (Islamic, Asian, African, American)",
    description: "Studying the art traditions of the Islamic world, South and East Asia, Africa and Indigenous America through their own functions, materials and aesthetic principles; cross-cultural exchange.",
    whyItMatters: "It shows the limits of reading art history as a single European line and follows how forms and techniques travelled along trade routes and across empires.",
    entryQuestions: [
      "Is a mask in a museum display case the same object as when it is used in a ceremony? What is lost?",
    ],
    coreQuestions: [
      "How does the function of art (ritual, political, everyday) differ across traditions?",
      "How did trade and conquest affect the spread of forms and techniques?",
      "What ethical questions does the origin of museum collections raise?",
    ],
    learningObjectives: [
      "Analyses a non-European work through its function and material in its own context",
      "Shows the journey of a form or technique between cultures with a map or diagram",
      "Writes a short piece discussing the ethical questions raised by a museum object's acquisition history",
    ],
    commonMisconceptions: [
      "Non-European art is \"primitive\" or merely \"craft\".",
      "Each culture's art has stayed unchanged throughout history.",
    ],
    links: {
      "gk.world.ap-1200-1450": "exchange of forms and techniques along trade networks",
      "gk.geo.human-culture": "cultural diffusion and interaction",
    },
    notes: ["Verify the naming of cultures and works, their dates and collection histories with reliable museum and academic sources."],
  },
  "art.islamic-ottoman": {
    title: "Islamic and Ottoman art: calligraphy, illumination, architecture",
    description: "Geometric and vegetal ornament in Islamic art, the traditions of calligraphy and illumination, the miniature; the dome, the külliye complex and spatial organisation in Ottoman architecture.",
    whyItMatters: "It introduces a tradition in which geometry, script and architecture intertwine; it helps you read buildings nearby and relate art to mathematical symmetry.",
    entryQuestions: [
      "Can you redraw a tile pattern with a ruler and compass? Which symmetries do you notice, and how could the pattern continue forever?",
    ],
    coreQuestions: [
      "How are symmetry and repetition built in geometric ornament?",
      "How does script become a visual element in calligraphy and illumination?",
      "How do the architectural and social functions of an Ottoman külliye come together?",
    ],
    learningObjectives: [
      "Draws a simple geometric pattern with compass-and-straightedge construction and identifies its types of symmetry",
      "Analyses the plan of a mosque or külliye in terms of spatial organisation and function",
      "Interprets the relationship between script, ornament and page layout in a work of calligraphy and illumination",
    ],
    commonMisconceptions: [
      "Figures were never used in Islamic art.",
      "Geometric patterns are only decoration with no mathematical structure.",
    ],
    researchApplications: ["Documenting the ornament and plan of a nearby historic building"],
    links: {
      "math.geo.transformations": "translation, rotation and reflection symmetries in patterns",
      "math.adv.abstract-algebra": "wallpaper symmetry groups",
      "gk.tr-hist.ottoman-institutions": "the social function of the waqf and külliye system",
    },
    notes: ["Verify attributions to architects and artists, construction dates and restoration histories in academic sources."],
  },
};

export const UNITS_ARTS: Record<string, string> = {
  "Müzik": "Music",
  "Müzik kuramı": "Music theory",
  "Sanat": "Art",
  "Sanat tarihi": "Art history",
};
