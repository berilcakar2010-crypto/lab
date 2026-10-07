import type { LOText } from "../../schema";

export const EN_CULTURE: Record<string, LOText> = {
  "gk.method.historical-thinking": {
    title: "Historical thinking: source, context and interpretation",
    description: "A way of reading the past not as a series of events to memorise but as an interpretation built from sources and open to debate.",
    whyItMatters: "It underpins every history, history-of-science and media-literacy object; it teaches you to ask whose a claim is, when it was made and for what purpose.",
    entryQuestions: [
      "How would the textbooks of two opposing sides describe the same war? How would you decide which one is 'right'?",
      "Which is more reliable: a book written a hundred years after an event, or a diary kept on the day it happened? Always?",
    ],
    coreQuestions: [
      "How does the difference between primary and secondary sources affect interpretation?",
      "How do a source's author, purpose and audience shape its content?",
      "How do you avoid single-cause explanations when establishing cause and effect?",
    ],
    learningObjectives: [
      "Classifies a source as primary or secondary and interrogates it with questions about author, purpose and audience",
      "Compares two different accounts of the same event and explains where the differences come from",
      "Draws a multi-causal explanation diagram (short- and long-term causes) for an event",
      "Identifies examples of judging the past by today's values (anachronism)",
    ],
    commonMisconceptions: [
      "History is a single, fixed story; historians merely pass it on.",
      "A primary source is always neutral and accurate.",
      "An event has a single 'real cause'.",
    ],
    researchApplications: ["A small source-criticism study of an archival document"],
    links: {
      "media.lit.source-evaluation": "the same habit of questioning sources applied to current information",
      "res.lit.reading": "reading a scientific paper, too, in light of its context and the author's claim",
      "res.method.causal": "causation and confounders apply in history as well",
    },
  },
  "gk.tr-hist.early-turks": {
    title: "The first Turkic states and Central Asia",
    description: "The way of life, idea of the state and relations with neighbours of the early Turkic political formations on the steppes of Central Asia.",
    whyItMatters: "It is the groundwork for understanding the state tradition (the relationship between land, customary law and ruler) of the later Turkic-Islamic and Anatolian periods, and shows the link between steppe ecology and politics.",
    entryQuestions: [
      "If a nomadic community left few written records, what do historians learn about it, and from where? Which kinds of sources would you guess?",
      "How could a small change in climate on the steppe lead to the fall of a state?",
    ],
    coreQuestions: [
      "How did the steppe economy and herding shape political organisation?",
      "What kind of information do early Turkic inscriptions and neighbouring sources (for example Chinese sources) give us, and what are their limits?",
      "How did the tension between central authority and the tribal structure play out?",
    ],
    learningObjectives: [
      "Explains the effect of the nomadic economy on political structure through a chain of cause and effect",
      "Interprets a translation of an inscription in terms of its author's purpose",
      "Compares the reliability limits of different source types (inscriptions, neighbours' chronicles, archaeology)",
    ],
    commonMisconceptions: [
      "Nomadic societies had no state institutions.",
      "All information comes from Turkic sources; neighbouring sources do not matter.",
    ],
    links: {
      "gk.geo.physical": "steppe climate and landforms determine the way of life",
    },
    notes: ["Verify the founding and fall dates of the states and the dating of the inscriptions against primary sources and current scholarship."],
  },
  "gk.tr-hist.islam-turks": {
    title: "Turkic-Islamic states: the Karakhanids, the Ghaznavids and the Great Seljuks",
    description: "The government, culture and scholarly life of the states founded after the Turks adopted Islam.",
    whyItMatters: "It shows the merging of the steppe state tradition with the institutions of the Islamic world, and leads to the origins of Anatolian and Ottoman institutions (iqta, madrasa, vizierate).",
    entryQuestions: [
      "When a community adopts a new religion, do its old state traditions disappear, or do they blend with new institutions? Make a prediction.",
      "Why would poets, scholars and astronomers receive patronage at a sultan's court?",
    ],
    coreQuestions: [
      "How did the adoption of Islam change ideas of political legitimacy?",
      "How did the iqta system tie together the military and economic order?",
      "Thanks to which institutions did the science and literature of this period flourish?",
    ],
    learningObjectives: [
      "Compares the shared and differing features of the steppe and Islamic state traditions in a table",
      "Shows how the iqta system worked with a flow diagram",
      "Explains the effect of madrasas and court patronage on scholarly production with an example",
    ],
    commonMisconceptions: [
      "Islam was adopted in a single moment, by the whole community at once.",
      "These states are an unbroken continuation of one another.",
    ],
    links: {
      "gk.sci-hist.ancient-medieval": "the institutional setting of science in the Islamic world",
    },
    notes: ["Verify rulers' names, battle dates and the definitions of institutional terms against primary sources and scholarly encyclopaedias."],
  },
  "gk.tr-hist.anatolia": {
    title: "The Turkification of Anatolia and the Anatolian Seljuks",
    description: "The settlement of Turkic communities in Anatolia, the institutions of the Anatolian Seljuk state and the transition to the period of the beyliks (principalities).",
    whyItMatters: "It explains how the cultural and demographic fabric of today's Türkiye took shape, and sets up the political environment in which the Ottoman state was born.",
    entryQuestions: [
      "Does a region's language and culture change through 'conquest', or through centuries of migration and settlement? How would you tell the two apart?",
      "What do caravanserais tell us about a state's economy?",
    ],
    coreQuestions: [
      "In what stages, and driven by which factors, did settlement in Anatolia take place?",
      "What were the trade and urban policies of the Anatolian Seljuks?",
      "How did the weakening of central authority lead to the period of the beyliks?",
    ],
    learningObjectives: [
      "Explains the settlement process by separating it into military, demographic and economic factors",
      "Sketches a map relating the caravanserai network to trade routes",
      "Interprets the dissolution of central authority with a multi-causal diagram",
    ],
    commonMisconceptions: [
      "Anatolia became Turkish all at once, through a single battle.",
      "The period of the beyliks was nothing but 'decline and chaos'.",
    ],
    links: {
      "gk.geo.turkey": "landforms and trade routes shape settlement",
      "gk.geo.maps": "reading historical maps",
    },
    notes: ["Verify battle, founding and fall dates and population estimates against scholarly sources."],
  },
  "gk.tr-hist.ottoman-rise": {
    title: "The founding and rise of the Ottoman state",
    description: "The political, military and social reasons why a small frontier principality grew into a vast empire.",
    whyItMatters: "It is a good case for asking under what conditions a state grows rapidly, and prepares the ground for the objects on institutions and modernisation.",
    entryQuestions: [
      "Why did one principality among many become an empire? Geography, leadership, institutions or luck? Rank them first, then justify your ranking.",
    ],
    coreQuestions: [
      "How do we separate legend from documentary evidence in accounts of the founding period?",
      "How did location, settlement policy and military organisation contribute to growth?",
      "How did conquests transform the economic and cultural structure?",
    ],
    learningObjectives: [
      "Classifies the causes of growth as geographical, institutional or circumstantial",
      "Distinguishes the founding legend from the document-based account and explains the reason for the difference",
      "Interprets the long-term consequences of a conquest through a chain of cause and effect",
    ],
    commonMisconceptions: [
      "The rise is explained by military success alone.",
      "Founding legends carry the value of historical documents.",
    ],
    links: {
      "gk.geo.maps": "reading changes in borders from maps",
    },
    notes: ["Verify sultans' reigns, conquest dates and the debates about the founding date against scholarly sources."],
  },
  "gk.tr-hist.ottoman-institutions": {
    title: "Ottoman institutions: government, society and economy",
    description: "How Ottoman institutions such as central government, the land system, the military, the law and the millet system worked.",
    whyItMatters: "It shows how an empire governed a multi-religious, multilingual population, and is a prerequisite for understanding what the reform and modernisation debates were trying to change.",
    entryQuestions: [
      "How does a state feed its soldiers if it lacks the cash to pay salaries? Design a solution, then compare it with the timar system.",
    ],
    coreQuestions: [
      "How did the timar system combine military, fiscal and agricultural functions?",
      "How did institutions such as the imperial council (divan), the office of the kadi and the devshirme work in central government?",
      "How was the legal status of different religious communities regulated?",
    ],
    learningObjectives: [
      "Diagrams the timar system in terms of its flows of resources and obligations",
      "Explains the function of an institution and how it changed over time",
      "Draws a diagram modelling the interdependence of institutions (how the breakdown of one affects another)",
    ],
    commonMisconceptions: [
      "Ottoman institutions remained unchanged for centuries.",
      "The sultan's authority was unlimited; no law or institution bound him.",
    ],
    links: {
      "gk.econ.macro": "the effect of money, taxation and inflation on state finances",
      "gk.civics.law-basics": "legal order and judicial institutions",
    },
    notes: ["Verify when the institutions emerged and changed, and the meanings of the terms, against scholarly sources."],
  },
  "gk.tr-hist.ottoman-reform": {
    title: "Reform and modernisation in the Ottoman Empire",
    description: "The reforms the Ottoman state made in the army, law, education and administration in response to military defeats and the transformation of the wider world.",
    whyItMatters: "It prompts the question of when and why modernisation was carried out 'from above', and forms the background to the reforms of the Republican era.",
    entryQuestions: [
      "If a reform aims only to modernise the army, will that change end up forcing changes in education and law too? Predict the knock-on effects.",
    ],
    coreQuestions: [
      "What internal and external factors set the reforms in motion?",
      "Why did military reform also require reform of education and law?",
      "Which ideas fed the debates on a constitutional order and constitutional monarchy?",
    ],
    learningObjectives: [
      "Classifies the reforms by area (army, education, law, administration) and explains the dependencies between them",
      "Interprets the purpose and intended audience of a reform document",
      "Compares Enlightenment ideas with their Ottoman counterparts",
    ],
    commonMisconceptions: [
      "The reforms were simply an imitation of the West.",
      "The reforms were implemented at the same pace across all of society, without resistance.",
    ],
    links: {
      "gk.civics.state-constitution": "the development of the idea of a constitutional order",
      "gk.sci-hist.turkey": "the effect of modern educational institutions on science",
    },
    notes: ["Verify the dates of the imperial edicts, constitutional documents and reform steps against primary sources."],
  },
  "gk.tr-hist.ww1-independence": {
    title: "The First World War and the Turkish War of Independence",
    description: "The Ottoman entry into the First World War, the fronts, the post-war occupations and the organisation of the National Struggle.",
    whyItMatters: "It is essential for understanding the process that led to the founding of the Republic of Türkiye and the emergence of the idea of the nation-state.",
    entryQuestions: [
      "How does a single central movement arise from the remnants of a defeated army and scattered local resistance? What conditions are needed?",
    ],
    coreQuestions: [
      "Under what conditions, and with what expectations, did the Ottoman Empire enter the war?",
      "What reactions did the post-war treaties and occupations provoke?",
      "What basis of legitimacy did the congresses and the assembly establish during the National Struggle?",
    ],
    learningObjectives: [
      "Explains the decision to enter the war in terms of internal and external factors",
      "Shows the stages in the organisation of the National Struggle with a timeline and a flow chart",
      "Interprets the text of a circular or congress resolution in terms of its purpose and legitimacy",
    ],
    commonMisconceptions: [
      "The National Struggle was a purely military process; diplomacy and organisation were secondary.",
      "Entering the war was one person's decision, with no structural causes.",
    ],
    links: {
      "gk.civics.international": "treaties and the international order",
    },
    notes: ["Verify the dates of fronts, congresses and treaties, and casualty figures, against primary sources and scholarly studies."],
  },
  "gk.tr-hist.republic": {
    title: "The founding of the Republic: Atatürk's principles and reforms",
    description: "The proclamation of the Republic and the aims and content of the reforms in law, education, society and the economy.",
    whyItMatters: "It explains the origins of today's state structure, secularism and legal system, and connects directly to the citizenship and constitution objects.",
    entryQuestions: [
      "What happens when a country changes its alphabet? Predict the effects on literacy, book printing and communication between generations.",
    ],
    coreQuestions: [
      "Which problems were the reforms designed to solve?",
      "How do the principles (republicanism, secularism, etc.) complement one another?",
      "What are the long-term social effects of the legal and educational reforms?",
    ],
    learningObjectives: [
      "Prepares a table matching each reform with the problem and area it targeted",
      "Shows the relationships between the principles with a concept map",
      "Interprets the short- and long-term effects of a reform on the basis of sources",
    ],
    commonMisconceptions: [
      "The reforms were independent decisions taken one by one.",
      "All the reforms were made at the same time.",
    ],
    links: {
      "gk.civics.state-constitution": "the establishment of the constitutional order",
      "gk.sci-hist.turkey": "university reform and scientific institutions",
    },
    notes: ["Verify the dates of the reforms and the texts of the legal provisions against official and scholarly sources."],
  },
  "gk.tr-hist.modern-turkey": {
    title: "Türkiye from the multi-party era to the present",
    description: "The main trends in Türkiye's political, economic and social transformation since the transition to a multi-party system.",
    whyItMatters: "It places today's institutions and debates in historical context and connects to the objects on economics, democracy and international relations.",
    entryQuestions: [
      "How is a country's foreign policy shaped in an environment of global rivalry (for example, a bipolar world)? Predict the options and their costs.",
    ],
    coreQuestions: [
      "Which internal and external factors accelerated the transition to a multi-party system?",
      "What justifications lay behind the shifts in economic policy (statism, opening up to the world)?",
      "How did urbanisation and migration change the social structure?",
    ],
    learningObjectives: [
      "Builds a timeline summarising the periods by their main trends (political, economic, social)",
      "Interprets the rationale and consequences of an economic policy on the basis of data",
      "Explains the historical origins of a present-day institutional structure, citing sources",
    ],
    commonMisconceptions: [
      "Recent history doesn't count as 'history'; it is merely a matter of opinion.",
      "A single event explains all the features of a period.",
    ],
    links: {
      "gk.econ.macro": "reading growth and inflation data",
      "gk.geo.human": "urbanisation and internal migration",
    },
    notes: [
      "Recent history is contested: compare scholarly sources from different perspectives, and verify dates and data against official statistics.",
    ],
  },
  "gk.world.ancient": {
    title: "The first civilisations and the ancient world",
    description: "The rise of agriculture, settled life, writing and city-states; the civilisations of Mesopotamia, Egypt, Anatolia, India, China and the Mediterranean.",
    whyItMatters: "It reveals the origins of the state, law, writing and science, and is the groundwork for the objects on ancient science and philosophy.",
    entryQuestions: [
      "Did agriculture make people happier or healthier? Predict first, then consider what skeletal remains might tell us.",
      "Why might writing have appeared first for accounting rather than for poetry?",
    ],
    coreQuestions: [
      "How did the emergence of agriculture change social structure?",
      "Why did writing, law and bureaucracy develop together?",
      "How were different civilisations influenced by their geography?",
    ],
    learningObjectives: [
      "Shows the agriculture–surplus–specialisation–state chain with a cause-and-effect diagram",
      "Compares two ancient civilisations in terms of geography, government and belief",
      "Distinguishes what can and cannot be inferred from an archaeological find",
    ],
    commonMisconceptions: [
      "Civilisation was born in a single centre and spread from there.",
      "Ancient people were less intelligent than people today.",
    ],
    links: {
      "gk.geo.physical": "river basins and climate determined settlement",
      "math.found.arithmetic": "the origins of number systems and measurement",
    },
    notes: ["Verify the chronology of the civilisations and archaeological dating against current scholarly sources."],
  },
  "gk.world.medieval": {
    title: "The Middle Ages: Europe, the Islamic world and Asia",
    description: "A comparative view of feudal Europe, the political and cultural structure of the Islamic world, Byzantium, and developments in East Asia.",
    whyItMatters: "It teaches you to question the 'Dark Ages' cliché and shows how knowledge was transmitted between civilisations.",
    entryQuestions: [
      "Would the statement 'the Middle Ages were a dark age' have been true for someone living in Baghdad, Córdoba or China? Why?",
    ],
    coreQuestions: [
      "How did feudalism bind together land, military service and loyalty?",
      "Along which routes were knowledge and technology passed between civilisations?",
      "How did trade routes and epidemics transform societies?",
    ],
    learningObjectives: [
      "Compares the feudal order with the iqta system in terms of function",
      "Traces the journey of a piece of knowledge or a technology between civilisations on a map",
      "Explains which point of view the concept of the 'Dark Ages' reflects",
    ],
    commonMisconceptions: [
      "There was no scientific progress at all in the Middle Ages.",
      "People in the Middle Ages believed the Earth was flat.",
    ],
    links: {
      "gk.sci-hist.ancient-medieval": "science in the Islamic world and in Europe",
      "bio.immune": "the biology of epidemic disease",
    },
    notes: ["Verify the dates of states and events, and figures on the impact of epidemics, against scholarly sources."],
  },
  "gk.world.renaissance": {
    title: "The Renaissance, the Reformation and the Age of Exploration",
    description: "The renewal of art and thought in Europe, the impact of the printing press, the religious reform movements and the consequences of overseas voyages of exploration.",
    whyItMatters: "It sets out the background to the Scientific Revolution and the modern world, and offers a case comparable with today of how an information technology (the printing press) changed society.",
    entryQuestions: [
      "What parallel can you draw between the printing press and the internet? What good and bad consequences follow when information becomes cheap?",
    ],
    coreQuestions: [
      "How did the printing press change the spread of information and the nature of authority?",
      "How did the reform movements affect the political order?",
      "What were the economic and human consequences of the voyages of exploration (including colonialism)?",
    ],
    learningObjectives: [
      "Classifies the effects of the printing press as short- or long-term and compares them with digital media",
      "Interprets the consequences of the voyages of exploration from the perspectives of different societies",
      "Explains the limits of seeing the Renaissance as a single moment of 'rebirth'",
    ],
    commonMisconceptions: [
      "The voyages of exploration are a 'success' story that can be told from Europe's perspective alone.",
      "The Renaissance was a sudden break with no continuity with the Middle Ages.",
    ],
    links: {
      "media.lit.algorithms": "technologies for spreading information transform society",
      "gk.art.visual": "perspective in Renaissance art",
    },
    notes: ["Verify the dates of events and people against scholarly sources."],
  },
  "gk.world.enlightenment": {
    title: "The Enlightenment and the age of revolutions",
    description: "The spread of ideas about reason, rights and the social contract, and how they were reflected in the political order through the American and French revolutions.",
    whyItMatters: "It forms the intellectual background to modern constitutions, the idea of human rights and the Ottoman reforms.",
    entryQuestions: [
      "If nature runs according to laws, can society also be designed 'by laws'? Could the Scientific Revolution have influenced politics in this way?",
    ],
    coreQuestions: [
      "What assumptions did Enlightenment thinkers share?",
      "How did the idea of the social contract redefine legitimacy?",
      "What contradictions did the revolutions face in putting ideas into practice?",
    ],
    learningObjectives: [
      "Compares different versions of the idea of the social contract",
      "Interprets a short passage from a declaration of rights in its context",
      "Explains the interaction between the Scientific Revolution and political thought with an example",
    ],
    commonMisconceptions: [
      "Enlightenment thinkers all shared a single view.",
      "The rights proclaimed by the revolutions covered everyone from the start.",
    ],
    links: {
      "gk.phil.political": "theories of the social contract",
      "gk.civics.state-constitution": "the origins of constitutional rights",
    },
    notes: ["Verify the thinkers' works and dates, and the chronology of the revolutions, against primary sources."],
  },
  "gk.world.industrial": {
    title: "The Industrial Revolution and imperialism",
    description: "The transformation brought by steam power, factory production and urbanisation; how the search for raw materials and markets led to imperialism.",
    whyItMatters: "It shows the relationship between energy, technology and society, and explains the historical context of thermodynamics and the origins of today's climate debate.",
    entryQuestions: [
      "Did the steam engine grow out of scientific theory first, or did the theory develop while trying to understand the engine? Make a prediction.",
    ],
    coreQuestions: [
      "What technological, economic and geographical conditions set off industrialisation?",
      "How did the factory system change working life and cities?",
      "What is the link between industrialisation and imperialism?",
    ],
    learningObjectives: [
      "Shows the preconditions of industrialisation with a cause-and-effect network",
      "Explains the mutual influence between the steam engine and thermodynamics",
      "Interprets the economic rationale and human costs of imperialism from different perspectives",
    ],
    commonMisconceptions: [
      "The Industrial Revolution was a single event completed in a short time.",
      "Technology is always the application of science; influence never runs the other way.",
    ],
    links: {
      "phys.thermo.laws": "the question of heat-engine efficiency gave rise to thermodynamics",
      "gk.geo.climate-change": "the beginning of fossil-fuel use",
      "gk.econ.macro": "growth and productivity",
    },
    notes: ["Verify the dates of inventions and economic data against scholarly sources."],
  },
  "gk.world.ww1": {
    title: "The First World War",
    description: "The global war brought about by rivalry among the great powers, alliance systems and nationalism, and its consequences.",
    whyItMatters: "It is the classic example of a multi-causal explanation; the end of the Ottoman Empire and the birth of new nation-states are tied to this war.",
    entryQuestions: [
      "Why did a single assassination turn into a world war? Explain the difference between the 'spark' and the 'gunpowder' with an example of your own.",
    ],
    coreQuestions: [
      "How did the long-term causes of the war (alliances, the arms race, imperialism, nationalism) interact?",
      "How did industrial technology change the nature of war?",
      "Why did the peace treaties fail to bring lasting peace?",
    ],
    learningObjectives: [
      "Draws a diagram classifying the causes of the war as short- or long-term",
      "Represents the alliance system as a network model and explains the chain reaction",
      "Interprets the effect of the peace settlements on later conflicts",
    ],
    commonMisconceptions: [
      "The assassination was the only cause of the war.",
      "All sides went to war even though they knew it would be short.",
    ],
    links: {
      "math.discrete.graph-theory": "modelling alliances as a graph",
    },
    notes: ["Verify dates, fronts and casualty figures against scholarly sources."],
  },
  "gk.world.ww2": {
    title: "The interwar period and the Second World War",
    description: "Economic crisis, the rise of totalitarian regimes, the Second World War, genocide and the founding of the post-war international order.",
    whyItMatters: "It shows the political consequences of economic crises, the power of propaganda and the use of science in war, and connects directly to research ethics and media literacy.",
    entryQuestions: [
      "How could an economic crisis make it easier for extremist movements to rise in a democratic society? Predict the mechanism step by step.",
    ],
    coreQuestions: [
      "How did the economic depression shake political stability?",
      "How did totalitarian regimes use propaganda and mass communication?",
      "What lessons did the institutions founded after the war try to institutionalise?",
    ],
    learningObjectives: [
      "Explains the crisis–radicalisation–war chain with a source-based cause-and-effect diagram",
      "Analyses an example of propaganda in terms of persuasion techniques",
      "Discusses the ethical questions arising from the use of science in wartime",
    ],
    commonMisconceptions: [
      "Totalitarian regimes came to power by force alone; they had no social support.",
      "The war can be explained entirely by the personal decisions of a single leader.",
    ],
    links: {
      "media.lit.persuasion": "analysing propaganda techniques",
      "res.ethics": "human experimentation and the birth of research-ethics principles",
      "gk.sci-hist.modern-physics": "the conversion of physics into military technology",
    },
    notes: ["Verify dates and casualty figures against scholarly sources and archives; use several reliable sources on sensitive topics."],
  },
  "gk.world.cold-war": {
    title: "The Cold War and decolonisation",
    description: "The bipolar world order, nuclear deterrence, the science and space race, and the independence processes of colonised countries.",
    whyItMatters: "It is the key to understanding today's international institutions and blocs, and shows how science policy relates to politics.",
    entryQuestions: [
      "If both sides have weapons of mass destruction, does war become more likely or less likely? Make a prediction, thinking like a game theorist.",
    ],
    coreQuestions: [
      "How does the logic of deterrence work, and what risks does it carry?",
      "How did the space and science race affect education and research policy?",
      "Why did decolonisation processes differ from region to region?",
    ],
    learningObjectives: [
      "Models deterrence with a simple decision matrix",
      "Explains the effect of the science race on research institutions with an example",
      "Compares two different decolonisation processes",
    ],
    commonMisconceptions: [
      "There was never any armed conflict during the Cold War.",
      "The world consisted of only two blocs; the non-aligned countries did not matter.",
    ],
    links: {
      "gk.econ.behavioral": "strategic decision-making and game theory",
      "gk.sci-hist.modern-physics": "the political consequences of nuclear physics",
    },
    notes: ["Verify the dates of crises and treaties, and the independence processes, against scholarly sources."],
  },
  "gk.world.globalization": {
    title: "Globalisation and the contemporary world",
    description: "The integration of trade, finance, technology and communication on a global scale, and its effects on inequality, migration and culture.",
    whyItMatters: "It lets you read today's problems, such as the economy, the media and the climate, as part of a historical process.",
    entryQuestions: [
      "Through how many countries might the raw materials, production and sale of the T-shirt you are wearing have passed? Guess the chain; what happens if the chain breaks?",
    ],
    coreQuestions: [
      "What are the driving forces of globalisation (technology, trade, policy)?",
      "Who are the winners and losers of globalisation, and how is this measured?",
      "Why do global problems (climate, pandemics) require global cooperation?",
    ],
    learningObjectives: [
      "Diagrams the global supply chain of a product and identifies its weak points",
      "Interprets a data graph on the effects of globalisation and states its limits",
      "Compares national and international options for solving a global problem",
    ],
    commonMisconceptions: [
      "Globalisation is a new phenomenon with no precedent in history.",
      "Globalisation has the same outcomes for everyone.",
    ],
    links: {
      "media.lit.stats-in-news": "reading economic graphs correctly",
      "gk.geo.climate-change": "a shared global problem",
    },
    notes: ["Verify trade and inequality data against official statistics from international organisations; avoid commentary on current events."],
  },
  "gk.geo.physical": {
    title: "Physical geography: climate and landforms",
    description: "Atmospheric circulation, climate types, plate tectonics and the internal and external forces that create landforms.",
    whyItMatters: "It is the physical groundwork for climate change, history and human geography, and applies the physics concepts of heat and energy at the planetary scale.",
    entryQuestions: [
      "Why might a city closer to the equator be colder than a city further north? Guess at least three reasons.",
      "If mountains are constantly being worn down, why are there still mountains?",
    ],
    coreQuestions: [
      "How does the uneven distribution of solar energy create atmospheric circulation?",
      "How do the factors that determine climate (latitude, altitude, distance from the sea, ocean currents) interact?",
      "How do plate movements and erosion balance each other in shaping landforms?",
    ],
    learningObjectives: [
      "Predicts the climate of a place from its latitude, altitude and distance from the sea, and justifies the prediction",
      "Explains atmospheric circulation with a simple energy-balance diagram",
      "Reads a climate graph (temperature and precipitation) and interprets the climate type",
    ],
    commonMisconceptions: [
      "The seasons are caused by changes in the Earth's distance from the Sun.",
      "Weather and climate are the same thing.",
    ],
    researchApplications: ["Drawing a climate graph from local meteorological data"],
    links: {
      "phys.thermo.temperature-heat": "heat transfer and specific heat explain the maritime effect",
      "phys.mech.fluids": "atmospheric and ocean circulation are fluid motion",
    },
  },
  "gk.geo.maps": {
    title: "Map reading and spatial thinking",
    description: "Reading scale, projections, coordinates and thematic maps; questioning spatial patterns.",
    whyItMatters: "In history, geography and data visualisation, maps are a tool of argument; this teaches you to see what a map shows and what it hides.",
    entryQuestions: [
      "Why does Greenland look as big as Africa on world maps? How would you try to spread a globe out onto a flat sheet of paper?",
    ],
    coreQuestions: [
      "How does the choice of scale and projection change how a map is perceived?",
      "How can thematic maps (density, ratio) mislead?",
      "How is a location defined with a coordinate system?",
    ],
    learningObjectives: [
      "Calculates real distances from a map's scale",
      "Compares which property two projections preserve and which they distort",
      "Identifies the points at which a thematic map could mislead",
    ],
    commonMisconceptions: [
      "Every map shows the world in correct proportions.",
      "A map of absolute numbers and a map of rates tell the same story.",
    ],
    links: {
      "math.geo.analytic": "coordinate systems",
      "res.data.visualization": "maps are a form of data visualisation too",
      "media.lit.stats-in-news": "misleading maps and graphs",
    },
  },
  "gk.geo.human": {
    title: "Human geography: population, migration and urbanisation",
    description: "Population distribution and structure, the causes of migration, and the economic and social consequences of urbanisation.",
    whyItMatters: "It teaches you to read social change through data and connects directly to the objects on economics and recent history.",
    entryQuestions: [
      "Could you predict a country's education and health needs 30 years from now by looking at its population pyramid? How?",
    ],
    coreQuestions: [
      "What does a population pyramid tell us about a society?",
      "What are the push and pull factors of migration?",
      "What opportunities and problems does urbanisation bring?",
    ],
    learningObjectives: [
      "Interprets a population pyramid and makes a justified prediction about future needs",
      "Analyses an example of migration using the push–pull model",
      "Graphs urbanisation data and interprets the trend",
    ],
    commonMisconceptions: [
      "Migration happens only for economic reasons.",
      "Population growth always continues in a straight line.",
    ],
    researchApplications: ["A small data analysis with open population data"],
    links: {
      "math.stat.descriptive": "summarising and visualising population data",
      "bio.ecology": "models of population dynamics also apply to human populations",
    },
  },
  "gk.geo.turkey": {
    title: "The geography of Türkiye",
    description: "Türkiye's location, landforms, climate regions and natural resources, and the distribution of its population and economic activity.",
    whyItMatters: "It brings the concepts of physical and human geography together in a familiar example and puts vital topics such as earthquake risk on a scientific footing.",
    entryQuestions: [
      "Why does the Black Sea coast get abundant rainfall while Central Anatolia has a dry climate? Explain by thinking about where the mountains are.",
    ],
    coreQuestions: [
      "How does Türkiye's geological setting explain its earthquake risk?",
      "How do landforms determine climate regions?",
      "Why are population and economic activity concentrated in particular regions?",
    ],
    learningObjectives: [
      "Explains the climate of a region on the basis of its landforms and location",
      "Relates fault lines to earthquake risk on a map",
      "Interprets a population-density map in terms of economic factors",
    ],
    commonMisconceptions: [
      "Earthquakes can be predicted; only their timing is unknown.",
      "All of Türkiye has the same climate type.",
    ],
    links: {
      "phys.waves.basics": "seismic waves are wave physics",
    },
    notes: ["Verify population, area and economic statistics against the official statistics institute and current sources."],
  },
  "gk.geo.climate-change": {
    title: "The science of climate change",
    description: "The physics of the greenhouse effect, how temperature records are measured, climate models and how uncertainty is expressed.",
    whyItMatters: "It brings physics, statistics and media literacy together in a single real-world question and shows how scientific consensus forms.",
    entryQuestions: [
      "Does a very cold week in winter refute the claim of global warming? Why or why not?",
      "If a climate model cannot tell what the weather will be like tomorrow, how can it say anything about 50 years from now?",
    ],
    coreQuestions: [
      "How does the greenhouse effect change the energy balance?",
      "How is a long-term temperature trend extracted from noisy data?",
      "How is the uncertainty of climate models expressed, and how should it be read?",
    ],
    learningObjectives: [
      "Explains the greenhouse effect with a simple energy-balance model",
      "Distinguishes and interprets trend and variability in a temperature time series",
      "Evaluates a claim in a climate news story in terms of the level of evidence and uncertainty",
    ],
    commonMisconceptions: [
      "Weather and climate are the same; a single cold day refutes the trend.",
      "The ozone hole and the greenhouse effect are the same phenomenon.",
      "Scientific uncertainty means 'nothing is known'.",
    ],
    researchApplications: [
      "Trend analysis with open temperature data",
      "Coding a simple zero-dimensional energy-balance model",
    ],
    links: {
      "phys.thermo.laws": "radiation and energy balance",
      "math.stat.regression": "estimating the trend in a time series",
      "media.lit.science-news": "evaluating climate news",
    },
    notes: ["Verify numerical values and scenarios against international climate assessment reports."],
  },
  "gk.civics.state-constitution": {
    title: "The state, the constitution and fundamental rights",
    description: "The elements of the state, the function of a constitution, the separation of powers and the guarantee of fundamental rights and freedoms.",
    whyItMatters: "It enables you to read rights and institutions as a citizen, and is the concrete counterpart of the history and political-philosophy objects.",
    entryQuestions: [
      "If anything could be changed by majority vote, how would the rights of minorities be protected? Design a solution.",
    ],
    coreQuestions: [
      "Why is a constitution harder to change than ordinary laws?",
      "How does the separation of powers limit the abuse of power?",
      "In what circumstances, and by what criteria, can fundamental rights be restricted?",
    ],
    learningObjectives: [
      "Diagrams the separation of powers through the relationships between the legislature, executive and judiciary",
      "Interprets a constitutional article in terms of rights and restrictions",
      "Compares two different models of government",
    ],
    commonMisconceptions: [
      "Democracy is simply majority rule.",
      "Fundamental rights are either unlimited or entirely at the state's discretion.",
    ],
    links: {
      "gk.phil.political": "theories of legitimacy and rights",
    },
    notes: ["Verify constitutional articles and the current structure of institutions against official texts."],
  },
  "gk.civics.law-basics": {
    title: "Basic concepts of law",
    description: "The features of a legal rule, the branches of law, rights and obligations, judicial processes and the general principles of law.",
    whyItMatters: "It supports informed decisions on matters such as contracts, copyright, privacy and research ethics.",
    entryQuestions: [
      "Can you think of an action that is immoral but legal, or illegal but moral? What does this difference tell us?",
    ],
    coreQuestions: [
      "How does a legal rule differ from moral rules and rules of etiquette?",
      "What is the distinction between public law and private law?",
      "Why do the presumption of innocence and the principle of legal certainty matter?",
    ],
    learningObjectives: [
      "Classifies a given situation by the relevant branch of law",
      "Distinguishes legal, moral and etiquette rules by their types of sanction",
      "Applies concepts such as copyright and personal data to a student project",
    ],
    commonMisconceptions: [
      "Everything that is legal is moral.",
      "Any content on the internet can be used freely.",
    ],
    links: {
      "res.ethics": "research ethics and legal obligations",
      "media.lit.privacy": "the protection of personal data",
    },
  },
  "gk.civics.democracy": {
    title: "Democracy, elections and institutions",
    description: "Representative democracy, electoral systems, political parties, civil society and mechanisms of accountability.",
    whyItMatters: "It enables you to analyse collective decision-making; the mathematics of electoral systems reveals the unexpected results of aggregating votes.",
    entryQuestions: [
      "Can the same distribution of votes produce a different parliament under different electoral systems? Try it by building a small example.",
    ],
    coreQuestions: [
      "How do electoral systems (majoritarian, proportional representation) affect outcomes?",
      "What function do independent institutions and a free press serve in a democracy?",
      "What forms does civic participation take beyond elections?",
    ],
    learningObjectives: [
      "Converts a simple set of votes into seats under two different electoral systems and compares the results",
      "Shows the mechanisms of accountability (judiciary, press, parliament) with a diagram",
      "Evaluates the impact of an example of civic participation",
    ],
    commonMisconceptions: [
      "Democracy consists only of voting on election day.",
      "Every electoral system translates votes into seats in the same proportion.",
    ],
    links: {
      "math.found.arithmetic": "allocating seats with ratio and proportion",
      "media.lit.current-events-method": "following political news methodically",
    },
  },
  "gk.civics.international": {
    title: "International relations and organisations",
    description: "The main approaches that explain relations between states, and the structure and limits of international organisations.",
    whyItMatters: "It helps you understand why global problems (climate, pandemics, migration) require cooperation, and why cooperation is hard.",
    entryQuestions: [
      "Why might not every country want to comply with an agreement that benefits everyone (for example, cutting emissions)? Explain the 'free-rider' problem with an example of your own.",
    ],
    coreQuestions: [
      "How do approaches such as realism and liberalism explain state behaviour?",
      "Why is the enforcement power of international organisations limited?",
      "How are cooperation problems modelled with game theory?",
    ],
    learningObjectives: [
      "Applies two theoretical approaches to the same case and compares them",
      "Shows the structure and decision-making process of an international organisation with a diagram",
      "Explains a cooperation problem with a simple model such as the prisoner's dilemma",
    ],
    commonMisconceptions: [
      "International organisations are a world government standing above states.",
      "States always act solely on their short-term interests.",
    ],
    links: {
      "gk.geo.climate-change": "shared global problems",
      "neuro.cog.decision": "strategic decision-making",
    },
    notes: ["Verify information on the organisations' membership and structure against their official sources."],
  },
  "gk.econ.micro": {
    title: "Microeconomics: supply, demand and markets",
    description: "Scarcity, opportunity cost, supply and demand, price formation, elasticity and market failures.",
    whyItMatters: "It teaches you to think in trade-offs, from everyday decisions to public policy, and is a direct application of knowledge about functions and graphs.",
    entryQuestions: [
      "If a price ceiling is placed on concert tickets, does everyone come out ahead? Predict what happens in the queue, on the black market and to the seller.",
    ],
    coreQuestions: [
      "How is a price formed where the supply and demand curves intersect?",
      "How does elasticity determine the effect of tax and price policies?",
      "Why do externalities and public goods lead to market failure?",
    ],
    learningObjectives: [
      "Calculates the equilibrium price and quantity from linear supply and demand functions",
      "Shows the effect of a shock (a tax, a price ceiling) on a graph and interprets it",
      "Analyses an example of an externality and compares possible policy tools",
    ],
    commonMisconceptions: [
      "If demand rises, only the price rises; the quantity does not change.",
      "A price ceiling always benefits consumers.",
    ],
    links: {
      "math.found.functions": "supply and demand functions and where they intersect",
      "math.calc.derivative-def": "the idea of 'marginal' is the derivative",
    },
  },
  "gk.econ.macro": {
    title: "Macroeconomics: inflation, growth and unemployment",
    description: "Economy-wide aggregates such as national income, inflation, unemployment, interest rates, and monetary and fiscal policy.",
    whyItMatters: "It enables you to read the economic indicators in the news correctly, and is the real-life counterpart of compound growth and exponential functions.",
    entryQuestions: [
      "If your salary rises by 10% a year but prices rise by 15%, are you getting richer or poorer? Calculate it.",
    ],
    coreQuestions: [
      "What is the difference between nominal and real quantities?",
      "How does a central bank try to influence inflation through the interest rate?",
      "How is economic growth measured, and what does it fail to measure?",
    ],
    learningObjectives: [
      "Adjusts nominal values for inflation and calculates the real change",
      "Estimates the doubling time from a compound growth rate",
      "Interprets the graph of a macroeconomic indicator and states its limits",
    ],
    commonMisconceptions: [
      "A fall in inflation means prices are falling.",
      "GDP is a complete measure of a country's well-being.",
    ],
    links: {
      "math.found.exp-log": "compound growth and doubling time",
      "media.lit.stats-in-news": "reading economic data and graphs correctly",
    },
  },
  "gk.econ.personal-finance": {
    title: "Personal finance: budgeting, interest and risk",
    description: "Budgeting, saving, compound interest, debt, the value of money in the face of inflation, and the relationship between risk and return.",
    whyItMatters: "It builds the mathematical foundation for financial decisions made over a lifetime, applying probability and exponential functions directly.",
    entryQuestions: [
      "Does starting to save a small amount every month at 15 rather than at 25 make a bigger difference? Guess intuitively first, then calculate.",
    ],
    coreQuestions: [
      "Why does compound interest make such a big difference over time?",
      "What is the relationship between risk and return, and why does diversification reduce risk?",
      "How is the real cost of debts such as credit cards and consumer loans calculated?",
    ],
    learningObjectives: [
      "Prepares a simple monthly budget and classifies the spending items",
      "Calculates the future value of savings with compound interest and shows it on a graph",
      "Compares two investment options in terms of expected return and risk",
    ],
    commonMisconceptions: [
      "Any investment that promises a high return is good; risk can be thought about later.",
      "Holding money as cash preserves its value when there is inflation.",
    ],
    links: {
      "math.found.exp-log": "compound interest is exponential growth",
      "math.prob.random-vars": "expected value and variance as measures of risk",
      "prog.python.basics": "coding a savings simulation",
    },
  },
  "gk.econ.behavioral": {
    title: "Behavioural economics",
    description: "Situations in which people systematically depart from the 'rational economic agent' model when making decisions: loss aversion, framing, present bias.",
    whyItMatters: "It brings economics and neuroscience together, and helps you recognise advertising, persuasion and errors in personal decisions.",
    entryQuestions: [
      "A 90% survival rate and a 10% mortality rate are the same information. Which one, said by a doctor, do you think would lead more people to accept surgery? Why?",
    ],
    coreQuestions: [
      "How do loss aversion and framing change decisions?",
      "How does present bias affect saving and study habits?",
      "How are these biases related to the brain's reward system?",
    ],
    learningObjectives: [
      "Names the cognitive bias in a decision scenario and explains its mechanism",
      "Designs a small survey experiment and tests the framing effect",
      "Turns a behavioural finding into a proposal for a public policy or a personal strategy",
    ],
    commonMisconceptions: [
      "People are either completely rational or completely irrational.",
      "Knowing about biases automatically protects you from them.",
    ],
    researchApplications: ["A classroom survey on the framing effect"],
    links: {
      "neuro.cog.decision": "the neuroscience of reward and decision-making systems",
      "neuro.comp.reinforcement": "reward prediction error and learning",
      "media.lit.persuasion": "persuasion techniques exploit biases",
    },
  },
  "gk.phil.intro": {
    title: "Introduction to philosophy and argument analysis",
    description: "The nature of philosophical questions, breaking an argument down into premises and conclusion, and assessing validity and soundness.",
    whyItMatters: "It is the basic tool for evaluating claims in every field and is used directly in scientific debate, media analysis and writing proofs.",
    entryQuestions: [
      "Can you build an argument whose premises are all false but which is logically valid? And could its conclusion be true?",
    ],
    coreQuestions: [
      "What is the difference between a valid argument and a sound argument?",
      "How do you bring out the implicit premises in a text?",
      "How do you recognise common logical fallacies?",
    ],
    learningObjectives: [
      "Rewrites the argument in a paragraph as numbered premises and a conclusion",
      "Evaluates an argument's validity and soundness separately",
      "Names at least three fallacies in a given text and explains why each is faulty",
    ],
    commonMisconceptions: [
      "Every argument with a true conclusion is a good argument.",
      "Philosophy is just stating personal opinions; there are no right or wrong arguments.",
    ],
    competitionApplications: ["Philosophy olympiad essay writing"],
    links: {
      "math.found.logic": "propositional logic and rules of inference",
      "media.lit.claim-analysis": "argument analysis is the basis of claim evaluation",
      "res.peer-review": "critically evaluating a paper's argument",
    },
  },
  "gk.phil.epistemology": {
    title: "Epistemology",
    description: "Debates about the definition of knowledge, justification, scepticism, rationalism and empiricism.",
    whyItMatters: "It prompts you to ask why scientific knowledge is reliable and where its limits lie, and is a prerequisite for the philosophy of science and philosophy of mind.",
    entryQuestions: [
      "If you look at a stopped clock and by chance tell the right time, did you 'know' the time? Is true belief enough for knowledge?",
    ],
    coreQuestions: [
      "Is knowledge 'justified true belief', and what do Gettier-style cases show?",
      "How do reason and experience compare as sources of knowledge?",
      "How can one respond to radical scepticism?",
    ],
    learningObjectives: [
      "Constructs their own Gettier-style counter-example and explains what it shows",
      "Compares rationalist and empiricist approaches through one mathematics example and one physics example",
      "Writes a reasoned response to a sceptical argument",
    ],
    commonMisconceptions: [
      "Nothing that is not certain counts as knowledge.",
      "Scientific knowledge comes directly from observation, without interpretation.",
    ],
    links: {
      "math.prob.bayes": "updating beliefs in light of evidence",
      "neuro.comp.bayesian-brain": "perception as a process of inference",
    },
  },
  "gk.phil.ethics": {
    title: "Ethical theories",
    description: "The main theories, such as consequentialism, deontology and virtue ethics, and their application to concrete dilemmas.",
    whyItMatters: "It supports reasoned decisions in areas such as research ethics, AI ethics and neuroethics.",
    entryQuestions: [
      "A trolley is about to hit five people; if you switch the points, it will hit one person instead. Would you switch? What if you could achieve the same result by pushing someone off a bridge?",
    ],
    coreQuestions: [
      "Why do consequentialism and deontology give different answers to the same dilemma?",
      "Instead of 'what should I do?', what question does virtue ethics ask?",
      "How are ethical theories applied to new technologies?",
    ],
    learningObjectives: [
      "Analyses a dilemma separately with each of the three theories",
      "Compares the strengths and weaknesses of the theories using counter-examples",
      "Writes a reasoned ethical assessment of a research or technology scenario",
    ],
    commonMisconceptions: [
      "Ethics is entirely relative; no justification is better than any other.",
      "Whatever is legal is ethical.",
    ],
    competitionApplications: ["Ethics bowl and philosophy debate competitions"],
    links: {
      "res.ethics": "principles of research ethics",
      "neuro.methods.ethics": "ethical questions in neuroscience",
      "prog.ml.basics": "algorithmic fairness and bias",
    },
  },
  "gk.phil.science": {
    title: "Philosophy of science: Popper, Kuhn and beyond",
    description: "What makes science science: falsifiability, paradigms, research programmes and the relationship between evidence and theory.",
    whyItMatters: "It turns the scientific method from a list of rules into something to think about critically, and is the basis for recognising pseudoscience.",
    entryQuestions: [
      "'All the swans I have seen were white, so all swans are white.' How reliable is this inference? What would a single black swan change?",
    ],
    coreQuestions: [
      "What is the problem of induction, and how does science respond to it?",
      "How does the falsifiability criterion separate science from pseudoscience, and what are its limits?",
      "How do paradigm shifts redefine scientific progress?",
    ],
    learningObjectives: [
      "Assesses whether a claim is falsifiable and recasts it in falsifiable form",
      "Interprets an example from the history of science comparatively through Popper's and Kuhn's approaches",
      "Explains the idea of Bayesian confirmation with a simple example",
    ],
    commonMisconceptions: [
      "Science proves absolute truths.",
      "A theory is abandoned immediately after a single anomalous observation.",
      "The phrase 'just a theory' means a scientific theory is a guess without evidence.",
    ],
    links: {
      "res.method.hypothesis": "forming a testable hypothesis",
      "math.stat.bayesian": "updating theories in light of evidence",
      "media.lit.science-news": "telling science from pseudoscience",
    },
  },
  "gk.phil.mind": {
    title: "Philosophy of mind and consciousness",
    description: "Debates on the mind–body problem, functionalism, the 'hard problem' of consciousness and whether artificial intelligence could have a mind.",
    whyItMatters: "It clarifies the deepest questions of neuroscience conceptually, and prompts you to ask what experimental findings can and cannot show.",
    entryQuestions: [
      "If we replaced every neuron in your brain, one by one, with a silicon chip that does the same job, would you stop being 'you' at some point? When?",
    ],
    coreQuestions: [
      "Are mental states identical to brain states?",
      "How does functionalism argue that artificial systems could have minds?",
      "Would finding the neural correlates of consciousness solve the 'hard problem'?",
    ],
    learningObjectives: [
      "Compares identity theory, functionalism and dualism through a thought experiment",
      "Assesses how far a neuroscience finding counts as evidence for a philosophical claim",
      "Writes a short, reasoned essay on whether artificial neural networks can 'understand'",
    ],
    commonMisconceptions: [
      "A region 'lighting up' in a brain scan proves that the region produces a thought.",
      "The problem of consciousness will solve itself once we have more data.",
    ],
    links: {
      "neuro.sys.neuroanatomy": "how mental functions relate to brain regions",
      "neuro.comp.ann-bridge": "comparing artificial networks with the brain",
      "neuro.methods.imaging": "the limits of interpreting imaging data",
    },
  },
  "gk.phil.political": {
    title: "Political philosophy",
    description: "The main theories of justice, liberty, equality and legitimate authority.",
    whyItMatters: "It puts debates on democracy and rights on a conceptual footing and enables you to evaluate public policies by their justifications.",
    entryQuestions: [
      "If you did not know what position in society you would be born into, what kind of tax and education system would you choose? Where does this 'veil of ignorance' lead you?",
    ],
    coreQuestions: [
      "On what does the authority of the state rest?",
      "How is the tension between liberty and equality balanced?",
      "What do different theories of justice say about the distribution of resources?",
    ],
    learningObjectives: [
      "Applies two theories of justice to the same policy problem and compares them",
      "Reconstructs the argument for legitimacy in a political text",
      "Writes a reasoned position on a public policy and addresses the counter-argument",
    ],
    commonMisconceptions: [
      "Liberty is simply the absence of state interference.",
      "Equality means giving everyone the same amount of resources.",
    ],
    links: {
      "gk.econ.micro": "resource allocation and efficiency",
      "media.lit.persuasion": "analysing political rhetoric",
    },
  },
  "gk.sci-hist.ancient-medieval": {
    title: "Ancient and medieval science (including science in the Islamic world)",
    description: "Mathematics and astronomy in ancient civilisations, Greek natural philosophy, and developments in optics, algebra, medicine and astronomy in the Islamic world.",
    whyItMatters: "It shows that science is not the product of a single culture, and leads to the origins of the ideas of algebra, algorithms and the experimental method that we use today.",
    entryQuestions: [
      "Without telescopes, how might people have measured the size of the Earth? Design a method using a shadow and two cities.",
      "Why might the words 'algorithm' and 'algebra' have Arabic roots?",
    ],
    coreQuestions: [
      "Out of what practical needs did mathematics and astronomy arise in antiquity?",
      "How did translation movements and institutions preserve and advance knowledge?",
      "How did medieval scholars approach experiment and observation?",
    ],
    learningObjectives: [
      "Recalculates an ancient measurement method (for example, the Earth's circumference from a shadow angle) using geometry",
      "Traces the route by which a scientific idea passed between civilisations",
      "Explains the experimental side of medieval work in optics with an example",
    ],
    commonMisconceptions: [
      "Science began only in Europe, after the Renaissance.",
      "Scholars in the Islamic world merely translated and preserved Greek works and made no original contributions.",
    ],
    links: {
      "math.geo.euclid": "ancient measurements with similar triangles and angles",
      "math.found.algebra": "the historical origins of algebra",
      "phys.optics.geometric": "medieval work in optics",
    },
    notes: ["Verify when the scholars lived and which discovery belongs to whom against scholarly history-of-science sources."],
  },
  "gk.sci-hist.scientific-revolution": {
    title: "The Scientific Revolution: from Copernicus to Newton",
    description: "How observation, mathematics and experiment came together in the scientific method, in the process running from the heliocentric model to Newtonian mechanics.",
    whyItMatters: "It shows how today's physics and scientific method were born, and explains which questions the laws in physics lessons were developed to answer.",
    entryQuestions: [
      "If the Earth really turns, why don't we feel it, and why does a stone thrown into the air fall back at our feet? How would you have answered this objection of the time?",
    ],
    coreQuestions: [
      "Why did the heliocentric model not give better predictions straight away when it first appeared?",
      "How was observational data turned into mathematical law?",
      "Why is Newton's synthesis considered a turning point?",
    ],
    learningObjectives: [
      "Compares the geocentric and heliocentric models in terms of explanatory power and simplicity",
      "Explains the chain observation → empirical law → theory with an example",
      "Answers an objection of the period using modern physics concepts",
    ],
    commonMisconceptions: [
      "When the heliocentric model first appeared it explained the observations better, so it was accepted at once.",
      "The Scientific Revolution was the work of a single genius.",
    ],
    links: {
      "phys.mech.gravitation": "the law of universal gravitation and orbits",
      "phys.mech.newton": "the historical context of the laws of motion",
      "math.calc.derivative-def": "the birth of calculus",
    },
    notes: ["Verify the publication dates of works and debates over priority against scholarly history-of-science sources."],
  },
  "gk.sci-hist.modern-physics": {
    title: "The birth of modern physics",
    description: "The transition from experimental problems that classical physics could not explain (black-body radiation, the speed of light, atomic spectra) to relativity and quantum theory.",
    whyItMatters: "It shows what a paradigm shift looks like from the inside, and provides historical motivation for modern physics lessons.",
    entryQuestions: [
      "If a theory explains almost everything but does not fit a few small experimental results, what do you do: change the theory, or question the experiments?",
    ],
    coreQuestions: [
      "Which experimental anomalies shook classical physics?",
      "How were quantum and relativistic ideas received when they were first put forward?",
      "By what criteria did the scientific community accept the new theories?",
    ],
    learningObjectives: [
      "Explains an anomaly and the theoretical idea that resolved it in terms of cause and effect",
      "Interprets this transition using Kuhn's concept of a paradigm",
      "Summarises the main argument of a historical paper or conference debate",
    ],
    commonMisconceptions: [
      "Modern physics made classical physics completely invalid.",
      "Quantum theory is a single discovery by a single person.",
    ],
    links: {
      "phys.modern.quantum-intro": "the historical origins of quantum concepts",
      "phys.modern.relativity": "the motivation for the theory of relativity",
      "gk.phil.science": "an example of a paradigm shift",
    },
    notes: ["Verify the dates of people, experiments and publications against scholarly history-of-science sources."],
  },
  "gk.sci-hist.neuroscience": {
    title: "The history of neuroscience: from Cajal to Hodgkin–Huxley",
    description: "The debate over the neuron doctrine, the discovery of electrical excitability and the road to a quantitative model of the action potential.",
    whyItMatters: "It shows through which experiments and debates the basic concepts of neuroscience were established, and illustrates how methods and technology shape scientific progress.",
    entryQuestions: [
      "How would you prove that nerve cells which seem to touch each other under the microscope are in fact separate cells?",
      "How could you show that a nerve conducts electricity before there were instruments to measure it?",
    ],
    coreQuestions: [
      "How was the debate between the neuron doctrine and the network (reticular) theory resolved?",
      "Which technical innovations (staining methods, the giant axon, the voltage clamp) made progress possible?",
      "Why is the Hodgkin–Huxley model regarded as a model example of quantitative modelling in biology?",
    ],
    learningObjectives: [
      "Reconstructs a historical debate with the evidence of both sides",
      "Explains which question an experimental technique made answerable",
      "Reinterprets the logic of a historical experiment using modern concepts",
    ],
    commonMisconceptions: [
      "Important discoveries come from a single brilliant idea; developing methods and instruments plays no role.",
      "In the debate between Golgi and Cajal, the 'wrong' side made no contribution at all.",
    ],
    links: {
      "neuro.cell.neuron-anatomy": "the neuron doctrine and cell structure",
      "neuro.comp.hh-model": "the model itself and its mathematics",
      "neuro.methods.electrophysiology": "the evolution of recording techniques",
    },
    notes: ["Verify the dates of experiments, prizes and publications against scholarly history-of-science sources and the original papers."],
  },
  "gk.sci-hist.turkey": {
    title: "Science and scientists in Türkiye",
    description: "An overview of scientific institutions, educational reforms and the contributions of scientists from the Ottoman period to the present.",
    whyItMatters: "It shows how science became institutionalised in a local context and how students can connect their own research path to this tradition.",
    entryQuestions: [
      "To increase a country's scientific output, what would you invest in first: universities, laboratories, journals or scholarships? Why?",
    ],
    coreQuestions: [
      "Out of what needs were scientific institutions (observatories, engineering schools, universities) founded?",
      "How did educational reforms affect scientific output?",
      "From which sources can the contributions of scientists be researched reliably?",
    ],
    learningObjectives: [
      "Explains the founding purpose and impact of a scientific institution, citing sources",
      "Researches a scientist's contribution in scholarly sources and writes a short profile",
      "Compares science-policy choices in terms of their outcomes",
    ],
    commonMisconceptions: [
      "The history of science in Türkiye begins with the Republic.",
      "The 'firsts' and claims in popular internet lists are verified information.",
    ],
    links: {
      "res.lit.search": "researching reliable sources",
      "res.career.academic": "planning a path in science",
    },
    notes: ["Verify the dates of people and institutions, and claims of contribution, against scholarly history-of-science sources; do not rely on popular lists."],
  },
  "gk.lit.reading-analysis": {
    title: "Analysing literary texts",
    description: "Analysing a poem, short story or novel in terms of theme, narrator, structure, imagery and language.",
    whyItMatters: "It teaches careful, multi-layered reading, a skill that transfers to reading scientific texts and understanding foreign languages.",
    entryQuestions: [
      "How does reading the same event through a first-person narrator and through an omniscient narrator change whom you trust? Rewrite a paragraph both ways.",
    ],
    coreQuestions: [
      "How do the narrator and point of view steer the reader?",
      "How do imagery, symbols and structure carry meaning?",
      "How do you support an interpretation with evidence from the text?",
    ],
    learningObjectives: [
      "Identifies the theme of a text and supports it with at least three pieces of evidence from the text",
      "Explains the type of narrator and its effect on the reader",
      "Writes a reasoned analytical paragraph on a short text",
    ],
    commonMisconceptions: [
      "A text has a single correct interpretation, and that is the author's intention.",
      "Every interpretation is equally valid; no evidence from the text is needed.",
    ],
    links: {
      "res.lit.reading": "reading a scientific paper in multiple layers too",
      "en.b2.reading": "inference strategies apply in every language",
    },
  },
  "gk.lit.turkish": {
    title: "Periods of Turkish literature",
    description: "The main currents of Turkish literature, from the oral tradition to divan and folk literature, and from the Tanzimat to the Republican era.",
    whyItMatters: "It enables you to read literature as a mirror of historical and social change, and it and the history objects shed light on each other.",
    entryQuestions: [
      "If the poems of a period seem to be only about love, what can you still learn about the society of that period?",
    ],
    coreQuestions: [
      "With which historical and social changes are literary periods connected?",
      "What do choices of form (aruz quantitative metre, syllabic metre, free verse) reflect?",
      "How do we situate a work within its period?",
    ],
    learningObjectives: [
      "Places a work in its period on the basis of its formal and thematic features, and justifies the placement",
      "Compares texts from two different periods in terms of theme and language",
      "Relates a literary change to a historical development",
    ],
    commonMisconceptions: [
      "Periods are separated from one another by sharp boundaries.",
      "Divan literature was completely cut off from ordinary people and never interacted with folk literature.",
    ],
    links: {
      "gk.tr-hist.ottoman-reform": "Tanzimat literature and modernisation",
    },
    notes: ["Verify the dates of authors and works, and the boundaries of periods, against scholarly sources on literary history."],
  },
  "gk.lit.world": {
    title: "Key works of world literature",
    description: "A comparative reading of influential works from different cultures and periods.",
    whyItMatters: "It shows how different cultures narrate human experience, and enriches foreign-language learning with cultural context.",
    entryQuestions: [
      "If an epic written thousands of years ago is still read today, which human experience might it be touching?",
    ],
    coreQuestions: [
      "What themes are shared by works from different cultures?",
      "How does translation transform a work?",
      "How is a work read differently in its own time and today?",
    ],
    learningObjectives: [
      "Compares works from two different cultures through a shared theme",
      "Compares two translations of the same passage and interprets how the differences affect the meaning",
      "Writes a short, reasoned critique of a work they have read",
    ],
    commonMisconceptions: [
      "A translation reproduces a work exactly; the translator's choices do not matter.",
      "'Classic' works come only from European literature.",
    ],
    links: {
      "en.c2.style": "style and fine shades of meaning",
      "de.c1.fluency": "reading authentic texts from German literature",
      "ja.culture": "Japanese literature and culture",
    },
    notes: ["Verify information on works and authors, and publication dates, against reliable literary sources."],
  },
  "gk.art.visual": {
    title: "Art history and visual reading",
    description: "The main movements in painting, sculpture and architecture, and reading an image in terms of composition, colour, perspective and context.",
    whyItMatters: "It is directly useful in visual literacy, scientific visualisation and media analysis, and teaches how an image produces meaning.",
    entryQuestions: [
      "How does a painter control where your eye goes first in a picture? Look at a painting, trace the path of your eye, then explain why.",
    ],
    coreQuestions: [
      "How do composition, colour and light direct the viewer's attention?",
      "Why did ideas of perspective and realism change from period to period?",
      "How is a work of art read as a historical document?",
    ],
    learningObjectives: [
      "Analyses an image under the headings of composition, colour and context",
      "Shows the geometry of linear perspective with a simple drawing",
      "Compares works from two different movements in terms of purpose and technique",
    ],
    commonMisconceptions: [
      "Non-realistic art is the result of a 'lack of skill'.",
      "The meaning of an image is the same for everyone, independent of context.",
    ],
    links: {
      "math.geo.euclid": "the geometry of perspective",
      "neuro.sys.sensory": "visual perception and attention",
      "res.data.visualization": "principles of visual design",
    },
    notes: ["Verify the dates of works, artists and movements against museum and scholarly art-history sources."],
  },
  "gk.art.music": {
    title: "Musical culture",
    description: "The basic structures of different musical traditions, the concepts of interval and metre, and the physical and perceptual foundations of music.",
    whyItMatters: "It brings the physics of sound, the neuroscience of hearing and cultural history together in a single experience.",
    entryQuestions: [
      "Is the reason two notes sound 'consonant' or 'dissonant' to be found in physics, in the brain or in culture? Form a hypothesis.",
    ],
    coreQuestions: [
      "How are intervals and harmony related to frequency ratios?",
      "How do different traditions, such as makam and tonal systems, organise sound?",
      "How are music perception and emotion processed in the brain?",
    ],
    learningObjectives: [
      "Relates the basic intervals to frequency ratios and calculates them",
      "Compares two different musical traditions in terms of structure and use",
      "Analyses a piece of music in terms of form and rhythm",
    ],
    commonMisconceptions: [
      "The perception of consonance is entirely universal; culture plays no part.",
      "An instrument's timbre is determined by its fundamental frequency alone.",
    ],
    links: {
      "phys.waves.sound": "frequency, harmonics and timbre",
      "math.fourier": "decomposing a sound into its harmonics",
      "neuro.sys.sensory": "the auditory system",
    },
    notes: ["Verify historical claims and terms about musical traditions against scholarly musicology sources."],
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_CULTURE: Record<string, string> = {
  "Tarih": "History",
  "Yöntem": "Method",
  "Türk tarihi": "Turkish history",
  "Dünya tarihi": "World history",
  "Coğrafya": "Geography",
  "Toplum": "Society",
  "Vatandaşlık, hukuk ve ekonomi": "Citizenship, law and economics",
  "Düşünce": "Thought",
  "Felsefe": "Philosophy",
  "Bilim tarihi": "History of science",
  "Kültür": "Culture",
  "Edebiyat ve sanat": "Literature and art",
};
