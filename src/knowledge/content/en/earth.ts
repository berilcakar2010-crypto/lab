import type { LOText } from "../../schema";

export const EN_EARTH: Record<string, LOText> = {
  "earth.geo.structure": {
    title: "Earth's interior and plate tectonics",
    description: "Earth's layers (crust, mantle, outer and inner core), the lithosphere–asthenosphere distinction, and plate motion at divergent, convergent and transform boundaries.",
    whyItMatters: "It explains earthquakes, volcanoes, mountain belts and the arrangement of the continents in a single framework; most other Earth-science topics build on this model.",
    entryQuestions: [
      "Nobody has drilled deeper than about 100 km. So how do we know the core has a liquid outer layer? Propose a method.",
      "The west coast of Africa and the east coast of South America fit like a jigsaw. Does that alone prove the continents move?",
    ],
    coreQuestions: [
      "How do Earth's layers differ when divided by chemical composition versus mechanical behaviour?",
      "What processes drive the plates, and what evidence supports their motion?",
      "What landforms and events are expected at each of the three types of plate boundary?",
    ],
    learningObjectives: [
      "Classifies Earth's layers separately by composition and by mechanical properties.",
      "Evaluates the palaeomagnetic, seismic and fossil evidence for plate tectonics.",
      "Identifies a plate boundary on a map by type and predicts the expected landforms.",
    ],
    commonMisconceptions: [
      "Thinking the mantle is entirely molten magma (it is mostly solid and flows over long timescales).",
      "Thinking plates consist only of continents.",
    ],
    researchApplications: ["Measuring plate velocities with GPS"],
    links: {
      "phys.mech.fluids": "mantle convection is the behaviour of a fluid with enormous viscosity",
      "gk.geo.turkey": "Anatolia's active tectonic setting",
    },
  },
  "earth.geo.rocks": {
    title: "Minerals, rocks and the rock cycle",
    description: "What a mineral is and its crystal structure; how igneous, sedimentary and metamorphic rocks form, and the rock cycle that turns them into one another.",
    whyItMatters: "Reading a rock lets you reconstruct past environments (sea floor, volcano, mountain root); resource exploration and geological dating rely on it too.",
    entryQuestions: [
      "Could the large crystals in granite and the tiny crystals in basalt come from the same kind of magma? What controls crystal size?",
      "Limestone containing seashell fossils sits on a mountain top. Tell the story of this rock step by step.",
    ],
    coreQuestions: [
      "What distinguishes a mineral from a rock?",
      "Under what conditions do the three rock types form, and how do they turn into one another?",
      "What does texture (crystal size, layering) reveal about a rock's history?",
    ],
    learningObjectives: [
      "Distinguishes minerals by properties such as hardness, cleavage and lustre.",
      "Classifies a rock as igneous, sedimentary or metamorphic from its texture and justifies the choice.",
      "Draws the rock cycle as a diagram together with its energy sources.",
    ],
    commonMisconceptions: [
      "Thinking the rock cycle runs in a fixed order (igneous → sedimentary → metamorphic).",
      "Thinking metamorphic rocks have melted (metamorphism happens in the solid state).",
    ],
    links: {
      "chem.bond.bonding": "crystal structure and bond types of minerals",
      "chem.solutions": "dissolution and precipitation in sedimentary rocks",
    },
  },
  "earth.geo.earthquakes": {
    title: "Earthquakes, seismic waves and earthquake risk",
    description: "Fault mechanics and elastic rebound; P, S and surface waves, locating an epicentre from three stations, magnitude (a logarithmic scale) versus intensity, and the concept of risk.",
    whyItMatters: "In a seismically active region such as Turkey it lets you think about earthquake risk with numbers; seismic waves are also our main tool for knowing Earth's interior.",
    entryQuestions: [
      "At a station the P wave arrives 20 seconds before the S wave. What else do you need to find how far away the earthquake was?",
      "When magnitude goes up by 1, by roughly what factor does the released energy increase? Guess first.",
    ],
    coreQuestions: [
      "Why do P and S waves travel at different speeds, and why can't S waves pass through the liquid outer core?",
      "How is an epicentre located by triangulation?",
      "How do hazard, exposure and vulnerability combine in a risk estimate?",
    ],
    learningObjectives: [
      "Calculates the station–epicentre distance from the P–S arrival-time difference.",
      "Locates the epicentre on a map by triangulation using data from three stations.",
      "Calculates energy ratios on the logarithmic magnitude scale and distinguishes magnitude from intensity.",
      "Evaluates, with justification, the factors that shape earthquake risk for a settlement.",
    ],
    commonMisconceptions: [
      "Thinking magnitude and intensity are the same thing (intensity depends on place and damage).",
      "Thinking earthquakes can be predicted to an exact date (hazard is forecast probabilistically).",
    ],
    researchApplications: ["Locating earthquakes with seismic-network data"],
    competitionApplications: ["Epicentre and wave questions in Earth-science olympiads"],
    links: {
      "math.found.exp-log": "the magnitude scale is logarithmic",
      "math.prob.distributions": "probabilistic modelling of earthquake occurrence",
      "gk.geo.turkey": "fault lines and earthquake hazard in Turkey",
    },
  },
  "earth.geo.volcanoes": {
    title: "Volcanism and mountain building",
    description: "How magma forms (decompression, addition of water, heating), how magma viscosity sets the eruption style, hot spots, and mountain building (orogeny) by plate collision.",
    whyItMatters: "It explains why some volcanoes are explosive and why mountain belts line up where they do; it is the basis of volcanic hazard assessment.",
    entryQuestions: [
      "If the mantle is mostly solid, where does magma come from? Is there a way to melt a rock without raising its temperature?",
      "Hawaiian volcanoes pour out runny lava, so why do some volcanoes explode violently?",
    ],
    coreQuestions: [
      "What are the three ways magma forms, and which plate setting does each correspond to?",
      "How do silica content and gas content affect eruption style?",
      "How do mountains rise in plate collisions, and why do they wear down over time?",
    ],
    learningObjectives: [
      "Matches magma-generation mechanisms to plate settings.",
      "Predicts a volcano's eruption style from magma composition and justifies the prediction.",
      "Estimates the direction and speed of plate motion from the age pattern along a hot-spot chain.",
    ],
    commonMisconceptions: [
      "Thinking all volcanoes lie on plate boundaries (hot spots are within plates).",
      "Thinking lava temperature alone determines eruption style.",
    ],
    links: {
      "chem.gas.laws": "expansion of gases in magma as pressure drops",
      "phys.mech.fluids": "how viscosity shapes flow and eruption behaviour",
    },
  },
  "earth.geo.deep-time": {
    title: "Geological time, fossils and radiometric dating",
    description: "Principles of relative dating (superposition, cross-cutting), how fossils form and are used for correlation, absolute ages from radioactive decay, and the geological time scale.",
    whyItMatters: "It makes millions of years measurable; it ties evolution, climate history and the rock cycle onto one time axis.",
    entryQuestions: [
      "Only a quarter of the parent isotope remains in a rock. If you know the half-life, can you say how many half-lives have passed before calculating the age?",
      "Why doesn't carbon-14 work for dating a dinosaur bone?",
    ],
    coreQuestions: [
      "What logical principles does relative dating rest on?",
      "How is the age formula obtained from exponential decay, and what assumptions does it need?",
      "Which isotope system suits which age range?",
    ],
    learningObjectives: [
      "Orders the events in a geological cross-section using the principles of relative dating.",
      "Derives and applies the age relation t = (t½/ln2)·ln(1 + D/P) from the exponential decay law.",
      "Chooses an isotope system to suit a sample's age and type and critiques the closed-system assumption.",
    ],
    commonMisconceptions: [
      "Thinking carbon-14 is used to date every fossil.",
      "Thinking that after one half-life each individual atom has 'half' decayed.",
    ],
    links: {
      "math.found.exp-log": "radioactive decay is an exponential function",
      "bio.evolution": "the fossil record and the timescale of evolution",
      "phys.modern.atomic-nuclear": "decay modes and half-life",
    },
  },
  "earth.atm.structure": {
    title: "Structure and energy balance of the atmosphere",
    description: "The layers and temperature profile of the atmosphere, its composition, absorption and reflection of sunlight (albedo), the greenhouse effect and Earth's radiation balance.",
    whyItMatters: "Weather, climate and air pollution all follow from this energy budget; explaining the greenhouse effect with numbers lets you evaluate climate debates.",
    entryQuestions: [
      "Without an atmosphere, would Earth's average temperature be colder or warmer than today? Guess a number.",
      "Air gets colder as you go up; yet in the stratosphere it gets warmer with height. What could cause that?",
    ],
    coreQuestions: [
      "How are the atmospheric layers distinguished by their temperature profile?",
      "How does the balance between incoming and outgoing radiation set Earth's temperature?",
      "Which wavelengths do greenhouse gases absorb, and why does that matter?",
    ],
    learningObjectives: [
      "Derives the equilibrium temperature of an airless Earth using the Stefan–Boltzmann law and albedo.",
      "Identifies the atmospheric layers from a temperature profile and explains the cause of heating in each.",
      "Builds a simple single-layer greenhouse model and discusses its limits.",
    ],
    commonMisconceptions: [
      "Thinking the greenhouse effect is caused by the hole in the ozone layer.",
      "Thinking greenhouse gases trap incoming sunlight (what they mainly absorb is the infrared Earth emits).",
    ],
    links: {
      "phys.thermo.laws": "energy conservation and radiative balance",
      "chem.bond.bonding": "molecular vibrations and infrared absorption",
      "gk.geo.climate-change": "the greenhouse effect's place in the climate debate",
    },
  },
  "earth.atm.weather": {
    title: "Weather: pressure, wind and fronts",
    description: "Wind from pressure differences, the Coriolis effect and friction; humidity, adiabatic cooling and cloud formation; air masses, fronts, and low- and high-pressure systems.",
    whyItMatters: "It lets you read a weather map and roughly forecast the next day; the atmosphere is fluid mechanics' biggest everyday laboratory.",
    entryQuestions: [
      "Why doesn't wind blow straight from high to low pressure, but instead circle a low anticlockwise in the northern hemisphere?",
      "Why does a rising parcel of air cool without giving off any heat?",
    ],
    coreQuestions: [
      "Which forces determine the wind?",
      "What conditions are needed for clouds and precipitation to form?",
      "How does the weather change as a cold or warm front passes?",
    ],
    learningObjectives: [
      "Sketches the balance of pressure-gradient and Coriolis forces on a synoptic chart.",
      "Roughly calculates the condensation level using the dry adiabatic lapse rate.",
      "Predicts a front's passage and the expected weather from a weather map.",
    ],
    commonMisconceptions: [
      "Thinking the Coriolis effect sets the direction water swirls down a sink.",
      "Thinking clouds are water vapour (they are condensed droplets and ice crystals).",
    ],
    links: {
      "phys.mech.circular": "Coriolis acceleration in a rotating reference frame",
      "phys.thermo.kinetic-theory": "adiabatic expansion and temperature",
      "math.ode.numerical": "numerical weather prediction models",
    },
  },
  "earth.ocean.circulation": {
    title: "Ocean currents and their interaction with climate",
    description: "Wind-driven surface currents and gyres, the thermohaline circulation driven by density (temperature–salinity) differences, upwelling, and El Niño as an example of ocean–atmosphere interaction.",
    whyItMatters: "The ocean carries heat from the equator to the poles and stores carbon; it is needed to understand coastal climates and fisheries.",
    entryQuestions: [
      "Why are the coasts of western Europe noticeably milder than Canada's east coast at the same latitude?",
      "Cold, salty water sinks. As sea ice forms near the poles, what happens to the density of the surrounding water?",
    ],
    coreQuestions: [
      "How do different processes drive surface currents and the deep circulation?",
      "How does the ocean transport and store heat and carbon?",
      "How do ocean and atmosphere influence each other during El Niño?",
    ],
    learningObjectives: [
      "Explains surface currents on a map by relating them to wind belts and continent positions.",
      "Explains what drives the thermohaline circulation using the effect of temperature and salinity on density.",
      "Identifies El Niño conditions by interpreting sea-surface-temperature data.",
    ],
    commonMisconceptions: [
      "Thinking ocean currents are produced only by wind.",
      "Thinking the ocean is a passive 'water tank' in climate change.",
    ],
    links: {
      "phys.thermo.temperature-heat": "water's high heat capacity and heat transport",
      "chem.solutions": "salinity and density; CO₂ dissolving in water",
      "bio.ecology": "productivity in upwelling zones",
    },
  },
  "earth.atm.climate-system": {
    title: "The climate system and feedbacks",
    description: "Weather versus climate; the interaction of atmosphere, ocean, ice, land and life; feedbacks such as ice–albedo and water vapour, climate sensitivity, and reading past climates from proxies (ice cores, sediments).",
    whyItMatters: "It lets you assess climate-change debates at the level of mechanisms; the idea of feedback recurs in every system from biology to economics.",
    entryQuestions: [
      "If weather forecasts become unreliable after a few days, how can the climate a hundred years from now be projected? Is that a contradiction?",
      "If polar ice melts, Earth absorbs more heat. Does this process speed itself up forever?",
    ],
    coreQuestions: [
      "How do positive and negative feedbacks work in the climate system?",
      "From which proxies, and how, are past climates inferred?",
      "What can climate models predict, and what can't they?",
    ],
    learningObjectives: [
      "Finds the equilibrium points of a simple energy-balance model after adding ice–albedo feedback.",
      "Shows positive and negative feedbacks in a system diagram and predicts their consequences.",
      "Analyses an ice-core or temperature time series to separate trend from variability.",
    ],
    commonMisconceptions: [
      "Confusing weather with climate (one cold winter does not refute warming).",
      "Thinking positive feedback is always 'good' or always 'runaway'.",
    ],
    researchApplications: ["Sensitivity experiments with a zero-dimensional energy-balance model"],
    links: {
      "math.dyn.stability": "equilibrium points and stability analysis",
      "math.stat.regression": "estimating trends in temperature series",
      "media.lit.science-news": "judging climate news by the evidence",
    },
  },
  "space.sky.observation": {
    title: "Observing the sky: coordinates, seasons and lunar phases",
    description: "The celestial sphere, horizon and equatorial coordinates, the apparent daily motion of the stars, seasons from axial tilt, lunar phases and the geometry of eclipses.",
    whyItMatters: "It is the language for finding things in the sky and planning observations; it is trigonometry's first application on a real sphere.",
    entryQuestions: [
      "Is Earth closer to the Sun in summer? Which season is the southern hemisphere having then, and what does that tell you?",
      "If there is a new moon every month, why isn't there a solar eclipse every month?",
    ],
    coreQuestions: [
      "Which coordinates specify a star's position in the sky?",
      "What actually causes the seasons?",
      "Which geometric arrangements produce lunar phases and eclipses?",
    ],
    learningObjectives: [
      "Finds the latitude of an observing site from the altitude of Polaris.",
      "Calculates the Sun's noon altitude for a given latitude and date.",
      "Explains lunar phases with a Sun–Earth–Moon diagram and states the conditions for eclipses.",
    ],
    commonMisconceptions: [
      "Thinking the seasons come from changes in Earth's distance from the Sun.",
      "Thinking the lunar phases are caused by Earth's shadow.",
    ],
    competitionApplications: ["Celestial-sphere and timekeeping questions in astronomy olympiads"],
    links: {
      "math.trig.basics": "angle and altitude calculations",
      "gk.sci-hist.ancient-medieval": "astronomical observation in antiquity and the Islamic world",
      "gk.geo.maps": "latitude–longitude and coordinate systems",
    },
  },
  "space.solar.system": {
    title: "The Solar System and planetary science",
    description: "Formation of the Solar System (the nebular model), terrestrial versus giant planets, moons, dwarf planets, comets and a comparison of planetary atmospheres; a short introduction to exoplanets.",
    whyItMatters: "Comparing Earth with other planets lets you ask why it is habitable; planetary science is Earth science extended into space.",
    entryQuestions: [
      "Venus is farther from the Sun than Mercury, yet its surface is hotter. How would you explain that?",
      "Why are the inner planets rocky and the outer ones gas giants? Guess the role of temperature during formation.",
    ],
    coreQuestions: [
      "How does the nebular model explain the arrangement of the planets?",
      "What determines whether a planet can hold on to an atmosphere?",
      "By what methods are exoplanets found?",
    ],
    learningObjectives: [
      "Groups the planets by comparing their mass, density and distance data.",
      "Predicts whether a planet can retain an atmosphere by comparing escape speed with the thermal speed of gas molecules.",
      "Calculates an exoplanet's relative size from a transit light curve.",
    ],
    commonMisconceptions: [
      "Thinking gas giants are made entirely of gas and have a 'surface'.",
      "Thinking the Solar System is as compact as scale-less drawings suggest.",
    ],
    links: {
      "phys.thermo.kinetic-theory": "mean molecular speeds and atmospheric escape",
      "chem.gas.laws": "pressure and temperature in planetary atmospheres",
      "bio.evolution": "questions of habitability and the origin of life",
    },
  },
  "space.orbits.kepler": {
    title: "Kepler's laws and orbital mechanics",
    description: "Kepler's three laws and their derivation from Newton's law of gravitation, orbital energy, escape speed, circular and elliptical orbits, and the Hohmann transfer orbit.",
    whyItMatters: "It is central to quantitative reasoning in astronomy, from launching satellites to weighing exoplanets, and one of the most frequent olympiad topics.",
    entryQuestions: [
      "To raise a satellite to a higher orbit you push it forward, yet in the new orbit it moves more slowly. How is that possible?",
      "Earth is closest to the Sun in early January. Is it moving faster or slower in its orbit then?",
    ],
    coreQuestions: [
      "How does Kepler's third law follow from Newton's laws?",
      "What is the relation between orbital energy and the semi-major axis?",
      "What velocity changes are needed to move from one orbit to another?",
    ],
    learningObjectives: [
      "Derives Kepler's third law for a circular orbit from Newton's law of gravitation.",
      "Relates the second law (equal areas) to conservation of angular momentum and calculates perihelion and aphelion speeds.",
      "Calculates the velocity changes needed for a Hohmann transfer using the vis-viva equation.",
      "Finds the mass of a central body from a satellite's period.",
    ],
    commonMisconceptions: [
      "Thinking astronauts in orbit are weightless because there is no gravity.",
      "Thinking that pushing forward in orbit always makes you go faster.",
    ],
    competitionApplications: ["Orbit and escape-speed questions in astronomy and physics olympiads"],
    links: {
      "math.geo.analytic": "the ellipse and its focal properties",
      "phys.mech.angular-momentum": "the law of equal areas is conservation of angular momentum",
      "gk.sci-hist.scientific-revolution": "Kepler's and Newton's theories of orbits",
    },
  },
  "space.light.spectra": {
    title: "Light, spectra and telescopes",
    description: "The electromagnetic spectrum, black-body radiation (Wien and Stefan–Boltzmann), absorption and emission lines, Doppler shift, and the light-gathering and resolving power of telescopes.",
    whyItMatters: "We cannot visit the stars; almost everything we know about them comes from their light. Reading spectra is how temperature, composition and velocity are measured from afar.",
    entryQuestions: [
      "Is a star that looks red hotter, or one that looks blue? Think of heating an iron bar and guess.",
      "If you double the diameter of a telescope's mirror, how much better do you see a faint galaxy?",
    ],
    coreQuestions: [
      "How are a star's temperature and composition inferred from its spectrum?",
      "How does Doppler shift give an object's velocity?",
      "How does telescope diameter affect light-gathering and resolving power?",
    ],
    learningObjectives: [
      "Calculates surface temperature from the peak wavelength using Wien's law.",
      "Explains how absorption and emission lines arise from energy levels and identifies an element in a spectrum.",
      "Calculates line-of-sight velocity from a wavelength shift.",
      "Compares telescopes by calculating their light-gathering power and diffraction-limited resolution.",
    ],
    commonMisconceptions: [
      "Thinking the main purpose of large telescopes is 'magnification'.",
      "Thinking redshift means the object looks red.",
    ],
    links: {
      "chem.atoms.electron-config": "energy levels and spectral lines",
      "phys.waves.sound": "the Doppler effect for sound and light",
      "phys.thermo.stat-mech": "the statistical origin of black-body radiation",
    },
  },
  "space.stars.life": {
    title: "Stellar structure and life cycle",
    description: "Hydrostatic equilibrium, hydrogen fusion in the core, the Hertzsprung–Russell diagram, the mass–luminosity relation and mass-dependent evolution: white dwarf, neutron star and black hole.",
    whyItMatters: "It explains how the carbon and oxygen in your body formed in stars; the HR diagram is astrophysics' most-used tool for reading data.",
    entryQuestions: [
      "A more massive star has more fuel, so why does it live shorter? Guess first, then look at the luminosity–mass relation.",
      "Why doesn't the Sun collapse under its own gravity, and why doesn't it blow itself apart?",
    ],
    coreQuestions: [
      "Which forces keep a star in equilibrium?",
      "What does a star's position on the HR diagram say about it?",
      "Which property mainly determines a star's fate?",
    ],
    learningObjectives: [
      "Derives and uses the relation L = 4πR²σT⁴ between luminosity, radius and temperature.",
      "Interprets the HR diagram of a star cluster to identify stars that have left the main sequence.",
      "Derives how main-sequence lifetime scales with mass from the mass–luminosity relation.",
      "Shows the evolutionary paths of stars of different masses in a diagram.",
    ],
    commonMisconceptions: [
      "Thinking the Sun is a 'burning' fireball undergoing chemical combustion.",
      "Thinking every star ends up as a black hole.",
    ],
    researchApplications: ["Plotting an HR diagram from open stellar catalogues"],
    links: {
      "phys.modern.atomic-nuclear": "mass–energy equivalence in fusion",
      "chem.atoms.structure": "how the elements form in stars",
      "phys.thermo.laws": "energy transport and equilibrium in stars",
    },
  },
  "space.galaxies.cosmology": {
    title: "Galaxies and an introduction to cosmology",
    description: "The structure of the Milky Way, types of galaxies, the distance ladder (parallax, variable stars), the Hubble–Lemaître law, the expanding universe, the cosmic microwave background and the evidence for dark matter.",
    whyItMatters: "It shows how the biggest questions, such as the age and size of the universe, are measured, and trains you to think about the uncertainty in each step of a measurement chain.",
    entryQuestions: [
      "If every galaxy is moving away from us, does that mean we are at the centre of the universe?",
      "Stars in the outer parts of a galaxy orbit as fast as those in the inner parts. What would Kepler's laws lead you to expect?",
    ],
    coreQuestions: [
      "By what step-by-step methods are cosmic distances measured?",
      "What does the Hubble–Lemaître law tell us about an expanding universe?",
      "What is the observational evidence for dark matter?",
    ],
    learningObjectives: [
      "Calculates distances from parallax and standard candles and explains the logic of the distance ladder.",
      "Estimates the Hubble constant from velocity–distance data and derives a rough estimate of the age of the universe.",
      "Interprets the inference of dark matter by comparing a galaxy rotation curve with the Keplerian expectation.",
    ],
    commonMisconceptions: [
      "Thinking the Big Bang was an explosion at a particular point in space.",
      "Treating it as settled that dark matter is black holes or ordinary dark dust.",
    ],
    links: {
      "math.stat.regression": "fitting a line to velocity–distance data",
      "gk.phil.science": "unobservable entities and evidence",
      "gk.sci-hist.modern-physics": "the birth of modern cosmology",
    },
  },
  "space.astro.olympiad": {
    title: "Astronomy olympiad problems",
    description: "Multi-step olympiad-style problems combining the celestial sphere, orbital mechanics, photometry (the magnitude system) and stellar physics; Fermi estimation and observational data analysis.",
    whyItMatters: "It trains you to use what you know in this field under time pressure and in unfamiliar contexts; it is the core of preparation for national and international astronomy olympiads.",
    entryQuestions: [
      "A star's apparent magnitude drops by 5. By what factor has the incoming flux increased? Discuss why the scale is 'backwards'.",
      "Would an observer on the Moon see phases of Earth? How long is 'one day' on the Moon?",
    ],
    coreQuestions: [
      "How are the magnitude system, flux and distance related?",
      "Which approximations can safely be made in a multi-step astronomy problem?",
      "How is observational data (a light curve, a spectrum) turned into a problem?",
    ],
    learningObjectives: [
      "Derives and applies the distance-modulus relation between apparent and absolute magnitude.",
      "Solves multi-step problems combining orbits, photometry and stellar physics.",
      "Extracts a physical quantity from a light curve or spectrum and estimates its uncertainty.",
    ],
    commonMisconceptions: [
      "Thinking a star gets brighter as its magnitude increases.",
      "Applying every approximation (small angle, circular orbit) without checking it.",
    ],
    competitionApplications: ["National and international astronomy olympiads (check formats and rules against official sources)"],
    links: {
      "comp.meta.problem-solving": "strategy in multi-step problems",
      "math.found.exp-log": "the magnitude system is logarithmic",
      "phys.olymp.boss": "problem-solving skills shared with the physics olympiad",
    },
  },
  "space.boss": {
    title: "Boss: Earth and space science synthesis",
    description: "A synthesis task combining Earth's climate system, stellar physics and orbital mechanics: for example, assessing an exoplanet's habitability from its star's properties, its orbit and its possible atmosphere.",
    whyItMatters: "It requires using all the tools of this field together around one realistic question, and lets you defend a scientific argument along with its assumptions.",
    entryQuestions: [
      "A planet has been found in the 'habitable zone' of a red dwarf. What else do you need to know before saying it has liquid water?",
    ],
    coreQuestions: [
      "How do star, orbit and atmosphere jointly determine a planet's surface temperature?",
      "Which assumptions change the result most?",
    ],
    learningObjectives: [
      "Derives the planet's equilibrium temperature from the star's luminosity and the orbital radius.",
      "Re-evaluates the result after adding greenhouse and albedo feedbacks and analyses its sensitivity.",
      "Defends the findings, with assumptions and uncertainties, in a short scientific report.",
    ],
    commonMisconceptions: [
      "Thinking being in the 'habitable zone' guarantees life or water.",
    ],
    links: {
      "res.project.modeling": "a modelling study with explicit assumptions",
      "bio.evolution": "the conditions for life to arise",
    },
  },
};

export const UNITS_EARTH: Record<string, string> = {
  "Yer bilimleri": "Earth science",
  "Katı yer": "Solid Earth",
  "Atmosfer ve okyanus": "Atmosphere and ocean",
  "Uzay bilimleri": "Space science",
  "Gökbilim": "Astronomy",
};
