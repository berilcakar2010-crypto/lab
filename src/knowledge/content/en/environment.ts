import type { LOText } from "../../schema";

export const EN_ENVIRONMENT: Record<string, LOText> = {
  "env.ecosystems.energy": {
    title: "Energy flow and matter cycles in ecosystems",
    description: "Food chains and webs, energy transfer and loss between trophic levels (the rough 10% rule), primary production; the carbon, nitrogen, phosphorus and water cycles.",
    whyItMatters: "Distinguishing one-way energy flow from cycling matter lets you trace what goes where in every question about farming, climate and pollution.",
    entryQuestions: [
      "Does wheat from a field feed more people if they eat it directly, or if it is fed to animals and people eat the meat? Why?",
      "Where does most of a tree's mass come from: the soil, water or the air? Guess.",
    ],
    coreQuestions: [
      "Why does energy decrease along the trophic levels?",
      "Between which reservoirs, and by which processes, do carbon and nitrogen cycle?",
      "How do human activities alter these cycles?",
    ],
    learningObjectives: [
      "Calculates energy transfer between trophic levels in a food web and draws the energy pyramid.",
      "Represents the carbon and nitrogen cycles as reservoir-and-flux diagrams.",
      "Predicts how burning fossil fuels or applying fertiliser changes the fluxes in a cycle.",
    ],
    commonMisconceptions: [
      "Thinking plants get their mass from the soil (most of the carbon comes from CO₂ in the air).",
      "Thinking energy cycles through an ecosystem the way matter does.",
    ],
    links: {
      "phys.thermo.laws": "losses in energy conversions and the second law",
      "chem.react.types": "oxidation–reduction reactions within the cycles",
    },
  },
  "env.biodiversity": {
    title: "Biodiversity and conservation biology",
    description: "Genetic, species and ecosystem diversity; diversity indices, island biogeography and habitat fragmentation, invasive species and conservation strategies.",
    whyItMatters: "It shows why losing one species can trigger a cascade and how protected areas are designed; it teaches you to think quantitatively about ecosystem services.",
    entryQuestions: [
      "Two forests have the same number of species; in one a single species dominates, in the other species are evenly spread. Which is more 'diverse'? How would you measure it?",
      "Is protecting a forest as many small patches the same for species as protecting one large patch?",
    ],
    coreQuestions: [
      "At what levels, and how, is biodiversity measured?",
      "How do habitat fragmentation and invasive species lead to species loss?",
      "By what principles are conservation efforts prioritised?",
    ],
    learningObjectives: [
      "Calculates species richness and the Simpson or Shannon diversity index for a sample data set.",
      "Predicts how species numbers change in fragmented habitats using island-biogeography reasoning.",
      "Evaluates a conservation plan in terms of keystone species, corridors and the needs of local communities.",
    ],
    commonMisconceptions: [
      "Thinking biodiversity just means the number of species.",
      "Thinking the best way to save a species is always to put it in a zoo.",
    ],
    researchApplications: ["Computing diversity indices from field counts"],
    links: {
      "bio.evolution.popgen": "genetic drift and loss of diversity in small populations",
      "math.info.entropy": "the Shannon index is information entropy",
    },
  },
  "env.population.human": {
    title: "Human population and carrying capacity",
    description: "Exponential and logistic growth, doubling time, the demographic transition model, age pyramids and the limits of the carrying-capacity idea for humans; the ecological footprint.",
    whyItMatters: "It lets you judge population news and projections with numbers and gives you a feel for how counter-intuitively fast exponential growth is.",
    entryQuestions: [
      "How many years does a population growing 2% a year take to double? Guess in your head first, then calculate.",
      "Why can a country's population keep growing for years after its fertility rate has fallen?",
    ],
    coreQuestions: [
      "When are exponential and logistic growth models appropriate for populations?",
      "How are the stages of the demographic transition explained by birth and death rates?",
      "Why is carrying capacity not a fixed number for humans?",
    ],
    learningObjectives: [
      "Calculates doubling time from a growth rate both with the rule of 70 and with the exact formula.",
      "Predicts a population's future change by interpreting an age pyramid.",
      "Critiques the assumptions of the logistic model in the context of human population.",
    ],
    commonMisconceptions: [
      "Thinking population stops growing as soon as fertility reaches replacement level (population momentum).",
      "Thinking carrying capacity is a fixed number independent of technology and consumption.",
    ],
    links: {
      "math.found.exp-log": "exponential growth and doubling time",
      "gk.geo.human": "population distribution and migration",
      "math.ode.first-order": "the logistic equation",
    },
  },
  "env.land.water": {
    title: "Land and water use",
    description: "Agricultural, forest and urban land use; soil erosion and desertification; the human share of the water cycle, groundwater, irrigation and the water footprint.",
    whyItMatters: "It reveals the environmental cost of decisions about food, water and urbanisation, and matters directly for water-stressed regions such as Turkey.",
    entryQuestions: [
      "Does a kilo of rice need more water, or a kilo of tomatoes? Justify your guess without using the term 'water footprint'.",
      "What happens if you pump water from an aquifer faster than rain refills it? Would anyone notice right away?",
    ],
    coreQuestions: [
      "How do land-use changes affect soil and water?",
      "How is groundwater recharged, and how is it depleted?",
      "What do the water footprint and virtual-water trade describe?",
    ],
    learningObjectives: [
      "Builds a simple water budget (inputs, outputs, change in storage) for a catchment.",
      "Calculates the water impact of a dietary choice by comparing the water footprints of different crops.",
      "Evaluates methods for preventing erosion and desertification by relating them to their causes.",
    ],
    commonMisconceptions: [
      "Thinking groundwater is large underground rivers or lakes.",
      "Thinking water can't run out because it is never lost from the cycle (local and seasonal scarcity).",
    ],
    links: {
      "gk.geo.turkey": "water resources and agriculture in Turkey",
      "phys.mech.fluids": "groundwater flow through porous media",
    },
  },
  "env.energy.resources": {
    title: "Energy resources and efficiency",
    description: "Fossil fuels, nuclear and renewable sources (solar, wind, hydro, geothermal); conversion efficiencies, capacity factor, the storage problem and life-cycle emissions.",
    whyItMatters: "It lets you judge energy-policy debates with real numbers such as kWh and efficiency; it is where physics enters social decisions most directly.",
    entryQuestions: [
      "If you covered a house roof with solar panels, could they supply the home's yearly electricity? What numbers do you need? Make a rough estimate.",
      "If an electric car is charged from a coal power plant, is it still cleaner than a petrol car?",
    ],
    coreQuestions: [
      "How do energy sources compare in efficiency, cost, reliability and emissions?",
      "Why must power and energy, and installed capacity and energy produced, not be confused?",
      "What storage and grid solutions does the variability of renewables require?",
    ],
    learningObjectives: [
      "Calculates the overall efficiency of an energy-conversion chain from the efficiencies of its steps.",
      "Estimates annual output from installed capacity and capacity factor.",
      "Compares one energy option with another on life-cycle emissions and cost and makes a justified recommendation.",
    ],
    commonMisconceptions: [
      "Confusing kilowatts with kilowatt-hours.",
      "Thinking renewable energy has no environmental impact at all.",
    ],
    links: {
      "phys.olymp.estimation": "Fermi estimates of energy demand",
      "phys.em.induction": "generating electricity in generators",
      "gk.econ.micro": "energy costs and prices",
    },
  },
  "env.pollution.air": {
    title: "Air pollution",
    description: "Primary and secondary pollutants (particulate matter, NOₓ, SO₂, ozone), photochemical smog, acid rain, temperature inversions, indoor air quality and health effects.",
    whyItMatters: "It explains why air pollution rises in winter in some cities and what an air-quality index measures; it brings together chemistry, meteorology and public health.",
    entryQuestions: [
      "Ozone at ground level is harmful; ozone in the stratosphere is protective. How can the same molecule be both good and bad?",
      "On a clear, windless winter night, why is the air of a city in a valley dirtier towards morning?",
    ],
    coreQuestions: [
      "How do primary and secondary pollutants form?",
      "How do meteorological conditions affect the build-up of pollutants?",
      "Why does particle size determine health effects?",
    ],
    learningObjectives: [
      "Writes the reactions that form acid rain and ground-level ozone.",
      "Explains with a diagram how a temperature inversion traps pollutants.",
      "Analyses air-quality monitoring data and relates pollution levels to meteorological conditions.",
    ],
    commonMisconceptions: [
      "Thinking air pollution is only outdoors and indoor air is always clean.",
      "Thinking air you can't see is clean (fine particles and gases are invisible).",
    ],
    links: {
      "chem.acid-base": "the pH of acid rain and buffering",
      "chem.kinetics": "rates of photochemical reactions",
      "bio.anatomy.respiratory": "how particles are deposited in the airways",
    },
  },
  "env.pollution.water-soil": {
    title: "Water and soil pollution",
    description: "Point and non-point pollution sources; eutrophication, oxygen depletion, heavy metals, bioaccumulation and biomagnification, microplastics, wastewater treatment and solid-waste management.",
    whyItMatters: "It explains why a lake turns green or why toxins pile up in animals at the top of a food chain, and shows the logic behind treatment technologies.",
    entryQuestions: [
      "If fertiliser running into a lake boosts plant growth, why do the fish die? Predict the chain of events.",
      "Why can a toxin present at very low concentration in water reach dangerous levels in birds of prey?",
    ],
    coreQuestions: [
      "Through which steps does eutrophication lead to oxygen depletion?",
      "How do bioaccumulation and biomagnification work?",
      "Which pollutants does each stage of wastewater treatment target?",
    ],
    learningObjectives: [
      "Shows eutrophication as a cause-and-effect chain in a diagram.",
      "Calculates the pollutant concentration at the top of a food chain using a magnification factor per trophic level.",
      "Makes a justified inference about a pollution source by interpreting dissolved-oxygen, nitrate and pH data for a water sample.",
    ],
    commonMisconceptions: [
      "Thinking clear-looking water is clean.",
      "Thinking dilution always solves pollution (biomagnification concentrates it again).",
    ],
    links: {
      "chem.solutions": "concentration units (ppm, mg/L) and solubility",
      "bio.micro.microbes": "the role of microorganisms in treatment and eutrophication",
      "chem.lab.techniques": "analysing water samples by titration",
    },
  },
  "env.climate.impacts": {
    title: "Global change: impacts and adaptation",
    description: "Impacts such as sea-level rise, extreme weather, ocean acidification and shifting ecosystems; the difference between mitigation and adaptation, and risk assessment.",
    whyItMatters: "It shows what climate science means for society and under what uncertainties decisions are made.",
    entryQuestions: [
      "If floating sea ice melts, does sea level rise? What if Greenland's ice melts? Think of a glass of iced water.",
      "The ocean slows warming by absorbing extra CO₂. Could that come at a cost?",
    ],
    coreQuestions: [
      "What are the main physical and biological impacts of climate change?",
      "Which questions do mitigation and adaptation answer?",
      "How should the uncertainty in an impact projection be read?",
    ],
    learningObjectives: [
      "Explains sea-level rise by separating the contributions of thermal expansion and land ice.",
      "Predicts how ocean acidification affects shell-building organisms through the carbonate equilibrium.",
      "Assesses climate risk for a region in terms of hazard, exposure and vulnerability and proposes an adaptation.",
    ],
    commonMisconceptions: [
      "Thinking melting sea ice directly raises sea level.",
      "Thinking uncertainty means 'scientists don't know'.",
    ],
    links: {
      "chem.equilibrium": "carbonate equilibrium and ocean acidification",
      "media.lit.science-news": "how climate projections are presented in the news",
      "gk.geo.climate-change": "the scientific basis of climate change",
    },
  },
  "env.sustainability": {
    title: "Sustainability and environmental policy",
    description: "Competing definitions of sustainability, the tragedy of the commons, externalities and the tools for them (taxes, emissions trading, regulation), the structure of international environmental agreements, and policy evaluation.",
    whyItMatters: "It shows how scientific knowledge turns into decisions and why that is often contested; it brings economics, law and science together.",
    entryQuestions: [
      "There is a common pasture where anyone may graze animals. For each herder, adding one more animal makes sense; but what happens if everyone does it?",
      "To cut pollution, is a ban more effective, or a tax paid by the polluter? Under what conditions?",
    ],
    coreQuestions: [
      "Under what conditions does the tragedy of the commons arise, and how can it be prevented?",
      "How are environmental-policy tools compared?",
      "By what criteria would you judge the success of an international environmental agreement?",
    ],
    learningObjectives: [
      "Models the tragedy of the commons with a simple game or numerical example.",
      "Compares taxes, quotas and regulation in terms of efficiency and fairness.",
      "Evaluates an environmental agreement's goals and outcomes by researching primary sources.",
    ],
    commonMisconceptions: [
      "Thinking sustainability means only environmental protection (it has economic and social dimensions).",
      "Quoting the contents and dates of international agreements without checking a source.",
    ],
    links: {
      "econ.micro.market-failure": "externalities and market failure",
      "econ.micro.game-theory": "commons and cooperation games",
      "gk.civics.international": "international organisations and agreements",
    },
    notes: ["Check the names, dates and targets of agreements against the official texts."],
  },
  "env.methods.fieldwork": {
    title: "Environmental fieldwork and data",
    description: "Sampling design (quadrats, transects), population estimation by mark–recapture, water and soil measurements, data recording, uncertainty and simple statistical comparison.",
    whyItMatters: "It lets you test environmental claims with your own measurements; knowing how good field data is collected is also the basis for critiquing other people's data.",
    entryQuestions: [
      "How would you estimate the number of fish in a lake without catching them all? Propose a method.",
      "How do you decide where to place a 1 m² frame to count plant species in a meadow? What's wrong with always picking the most interesting spot?",
    ],
    coreQuestions: [
      "How is field sampling designed to reduce bias?",
      "What assumptions does mark–recapture rest on?",
      "How is the uncertainty of field data reported?",
    ],
    learningObjectives: [
      "Designs and justifies a random or systematic sampling plan for a site.",
      "Calculates the Lincoln–Petersen estimate from mark–recapture data and tests its assumptions.",
      "Compares data from two sites using descriptive statistics and graphs and reports them with their uncertainty.",
    ],
    commonMisconceptions: [
      "Thinking more measurements will fix a biased sample.",
      "Generalising about a whole area from a single measurement point.",
    ],
    researchApplications: ["Monitoring species diversity in a local habitat"],
    links: {
      "math.stat.sampling": "sampling methods and bias",
      "res.data.management": "recording and documenting field data",
      "bio.methods.lab": "designing experiments and observations in biology",
    },
  },
  "env.proj.local-study": {
    title: "Project: a local environmental study",
    description: "Choosing a research question in your surroundings (school grounds, a stream, a park), collecting and analysing field data, and presenting the findings as a scientific report or poster.",
    whyItMatters: "It takes you through the whole cycle of the scientific method on a real question of your own choosing, and is a solid start for research-project competitions.",
    entryQuestions: [
      "Write an environmental question near your school that you could measure and genuinely want answered. Could it be answered in a week?",
    ],
    coreQuestions: [
      "How do you frame a research question that can be tested at a local scale?",
      "Which conclusions can honestly be drawn from limited data?",
    ],
    learningObjectives: [
      "Writes a measurable research question and hypothesis and defines the variables.",
      "Plans and carries out a field study, recording the data systematically.",
      "Analyses the data and presents the findings, with their limitations, as a report or poster.",
    ],
    commonMisconceptions: [
      "Thinking the purpose of a project is to confirm a result 'expected' in advance.",
    ],
    researchApplications: ["A local water-quality, air-quality or biodiversity monitoring project"],
    competitionApplications: ["Environmental-science categories in research-project competitions (check categories and rules against official sources)"],
    links: {
      "res.project.mini": "the stages of a mini research project",
      "comp.research.science-fair": "preparing for research-project competitions",
      "res.write.presentation": "sharing findings through posters and talks",
    },
  },
  "env.boss": {
    title: "Boss: environmental systems synthesis",
    description: "A synthesis task combining climate impacts, energy choices and pollution in one scenario: for example, quantitatively comparing the environmental impacts of a city's energy and water plan.",
    whyItMatters: "It requires applying the parts of environmental science together to a real decision problem and teaches you to defend trade-offs explicitly.",
    entryQuestions: [
      "A city will build a new power plant: coal, natural gas, solar plus storage, or wind. Which would you recommend for climate, air, water and cost, and what information could change your decision?",
    ],
    coreQuestions: [
      "How are different environmental impacts compared within one decision framework?",
      "What is the weakest assumption behind a recommendation?",
    ],
    learningObjectives: [
      "Compares the options quantitatively on emissions, water use and pollution.",
      "Builds a multi-criteria decision table and tests its sensitivity to changes in the weights.",
      "Defends the recommendation, with its assumptions and trade-offs, in a short policy brief.",
    ],
    commonMisconceptions: [
      "Thinking the 'best' option can be chosen by looking at a single criterion (for example cost alone).",
    ],
    links: {
      "res.project.modeling": "a modelling study with explicit assumptions",
      "math.opt.optimization": "choosing under constraints",
    },
  },
};

export const UNITS_ENVIRONMENT: Record<string, string> = {
  "Çevre bilimi": "Environmental science",
  "Sistemler ve kaynaklar": "Systems and resources",
};
