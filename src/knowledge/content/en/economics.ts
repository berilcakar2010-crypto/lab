import type { LOText } from "../../schema";

export const EN_ECONOMICS: Record<string, LOText> = {
  "econ.micro.scarcity": {
    title: "Scarcity, opportunity cost and production possibilities",
    description: "Scarcity and choice, opportunity cost, the production possibilities curve (PPC), increasing opportunity cost, absolute and comparative advantage, and the gains from specialisation.",
    whyItMatters: "It is the starting point of every model in economics; you use the same opportunity-cost logic when you split your time between classes and projects.",
    entryQuestions: [
      "You got a 'free' concert ticket, but that evening you had a student you would have tutored for 200 an hour. Is the concert really free?",
      "If a country produces both wheat and cloth more efficiently than its neighbour, can trade still benefit it? Make a prediction.",
    ],
    coreQuestions: [
      "Why is the PPC usually bowed outwards?",
      "How does comparative advantage make trade profitable even without absolute advantage?",
      "What do points on, inside and outside the curve represent?",
    ],
    learningObjectives: [
      "Calculates opportunity costs from a production table and draws the PPC.",
      "Determines comparative advantage for two countries or two people and finds the range of mutually beneficial terms of trade.",
      "Explains how changes in technology and resources shift the PPC.",
    ],
    commonMisconceptions: [
      "Thinking opportunity cost is only the money paid.",
      "Thinking the side that produces everything better gains nothing from trade.",
    ],
    competitionApplications: ["Comparative advantage questions in economics olympiads"],
    links: {
      "math.found.functions": "the PPC is a function between two goods and its slope is the opportunity cost",
      "comp.meta.exam-strategy": "opportunity cost when sharing limited time between questions",
    },
  },
  "econ.micro.elasticity": {
    title: "Elasticity",
    description: "Price, income and cross elasticity of demand; price elasticity of supply; the midpoint method; the link between elasticity and total revenue, and how the burden of a tax is shared.",
    whyItMatters: "It lets you predict whether a price rise will raise a seller's revenue and who will actually bear a tax.",
    entryQuestions: [
      "A museum doubled its ticket price and visitor numbers fell by 30%. Did its ticket revenue go up or down?",
      "Who really pays a tax on cigarettes: producers or consumers? What does it depend on?",
    ],
    coreQuestions: [
      "Why is elasticity different from slope, and why is it unit-free?",
      "How is price elasticity of demand related to total revenue?",
      "What makes demand for a good elastic or inelastic?",
    ],
    learningObjectives: [
      "Calculates price, income and cross elasticities with the midpoint method and classifies goods accordingly.",
      "Derives why elasticity changes along a linear demand curve and finds the point of maximum total revenue.",
      "Predicts how a tax burden is shared from the elasticities of supply and demand.",
    ],
    commonMisconceptions: [
      "Thinking a linear demand curve has the same elasticity at every point.",
      "Treating elasticity as the same thing as slope.",
      "Thinking a tax always stays with the side that legally pays it.",
    ],
    competitionApplications: ["AP Microeconomics questions on elasticity and tax incidence"],
    links: {
      "math.calc.derivative-def": "point elasticity is the derivative times a ratio",
      "math.found.exp-log": "constant-elasticity demand is a straight line on a log–log plot",
    },
  },
  "econ.micro.consumer": {
    title: "Consumer choice and marginal utility",
    description: "Total and marginal utility, diminishing marginal utility, the budget constraint, the rule of equalising marginal utility per unit of money, income and substitution effects, and consumer surplus.",
    whyItMatters: "It derives why the demand curve slopes downwards from individual choices; it is the first example of constrained optimisation in economics.",
    entryQuestions: [
      "Water is vital and diamonds are ornaments, yet diamonds cost far more than water. How do you resolve this 'paradox'?",
      "If the second slice of pizza gives you less pleasure than the first, after how many slices should you stop?",
    ],
    coreQuestions: [
      "How is utility maximised under a limited budget?",
      "How is the effect of a price change split into income and substitution effects?",
      "What does consumer surplus measure?",
    ],
    learningObjectives: [
      "Finds the best consumption bundle from a utility table and a budget constraint by equalising marginal utility per unit of money.",
      "Derives a demand curve from individual preferences and calculates consumer surplus.",
      "Distinguishes the income and substitution effects of a price change.",
    ],
    commonMisconceptions: [
      "Thinking that consuming where total utility peaks is also the best choice under a budget constraint.",
      "Thinking marginal utility is the same as total utility.",
    ],
    links: {
      "math.calc.applications": "constrained optimisation and marginal analysis",
      "gk.econ.behavioral": "the behavioural limits of the rational choice model",
    },
  },
  "econ.micro.production-costs": {
    title: "Production and costs",
    description: "Short and long run, diminishing marginal returns, fixed/variable/total cost, average and marginal cost curves, economies of scale, and profit maximisation (MR = MC).",
    whyItMatters: "It explains how firms decide how much to produce; it is the cleanest example of marginal thinking and of relationships between curves.",
    entryQuestions: [
      "Hiring one more worker at a bakery raises output; by the tenth worker it hardly rises at all. Why? When should it stop hiring?",
      "Why does the marginal cost curve cut the average cost curve exactly at its minimum? Think first about a class grade average.",
    ],
    coreQuestions: [
      "How do diminishing marginal returns shape the cost curves?",
      "How are marginal cost and average cost related?",
      "When does it make sense to keep producing at a loss in the short run?",
    ],
    learningObjectives: [
      "Calculates marginal product and average and marginal costs from a production table and plots them.",
      "Derives that the MC curve crosses the AC curve at its minimum.",
      "Determines the profit-maximising output and the shutdown point with the MR = MC rule.",
    ],
    commonMisconceptions: [
      "Thinking fixed costs affect the production decision in the short run.",
      "Thinking profit is highest where average cost is lowest.",
    ],
    competitionApplications: ["AP Microeconomics cost-curve graphs"],
    links: {
      "math.calc.derivative-def": "marginal cost is the derivative of total cost",
      "math.calc.applications": "maximising the profit function",
    },
  },
  "econ.micro.market-structures": {
    title: "Market structures: perfect competition, monopoly, oligopoly",
    description: "Price-taking and long-run equilibrium under perfect competition, price setting and deadweight loss under monopoly, monopolistic competition, strategic interaction in oligopoly, and price discrimination.",
    whyItMatters: "It shows how market power changes prices and social welfare; it underlies debates on competition policy.",
    entryQuestions: [
      "A single drug company sells a patented medicine. Does it sell it as expensively as possible? At what price does it stop?",
      "How can the passenger next to you on a plane have paid far less than you, and why is that profitable?",
    ],
    coreQuestions: [
      "Why does economic profit fall to zero in the long run under perfect competition?",
      "Why does a monopolist face a marginal revenue curve that lies below price?",
      "What is deadweight loss and how is it measured?",
    ],
    learningObjectives: [
      "Finds equilibrium price, quantity and profit for perfect competition and monopoly, graphically and by calculation.",
      "Derives a monopolist's marginal revenue curve from linear demand and calculates the deadweight loss.",
      "Compares market structures by number of firms, barriers to entry and pricing power.",
    ],
    commonMisconceptions: [
      "Thinking a monopolist can charge any price it likes and demand does not limit it.",
      "Thinking firms in perfect competition earn nothing (confusing accounting profit with economic profit).",
    ],
    competitionApplications: ["AP Microeconomics free-response graphing questions", "Market-structure problems in economics olympiads"],
    links: {
      "math.calc.applications": "finding where marginal revenue is zero and where MR = MC",
      "cs.impact.ethics": "market power and network effects on digital platforms",
    },
  },
  "econ.micro.game-theory": {
    title: "Introduction to game theory",
    description: "Normal-form games, dominant strategies, Nash equilibrium, the prisoner's dilemma, coordination games, mixed strategies and cooperation in repeated games.",
    whyItMatters: "It lets you model strategic interaction, from oligopoly and arms races to evolutionary biology and teamwork.",
    entryQuestions: [
      "Two firms set prices at the same time; if both set a high price, both win. Why do they still so often start price wars?",
      "What is the 'best strategy' in rock–paper–scissors? Does your answer change if your opponent always plays rock?",
    ],
    coreQuestions: [
      "What is a Nash equilibrium, and why is it not always the best outcome for everyone?",
      "How do you find a mixed strategy in a game with no pure-strategy equilibrium?",
      "How do repeated games make cooperation sustainable?",
    ],
    learningObjectives: [
      "Finds dominant strategies and pure-strategy Nash equilibria in a payoff matrix.",
      "Derives the mixed-strategy equilibrium of a two-player, two-strategy game from the indifference condition.",
      "Applies the prisoner's dilemma to an oligopoly, environmental or social situation and explains the mechanisms that support cooperation.",
    ],
    commonMisconceptions: [
      "Thinking a Nash equilibrium always maximises total payoff.",
      "Thinking a mixed strategy means 'playing randomly without thinking'.",
    ],
    competitionApplications: ["Game theory problems in mathematics and economics olympiads"],
    links: {
      "math.prob.random-vars": "expected payoff calculations for mixed strategies",
      "bio.evolution": "evolutionarily stable strategies",
      "psy.social": "cooperation behaviour in social dilemmas",
    },
  },
  "econ.micro.factor-markets": {
    title: "Factor markets and income distribution",
    description: "Derived demand, the value of the marginal product of labour, labour supply, wage determination, monopsony, the minimum wage debate, and measuring income inequality (Lorenz curve, Gini coefficient).",
    whyItMatters: "It explains why wages differ and how inequality is measured, so you can read the numbers in public debates correctly.",
    entryQuestions: [
      "A nurse saves lives and a footballer scores goals, yet the footballer earns far more. What determines wages?",
      "Does raising the minimum wage reduce employment? Could the answer depend on how many employers there are in the market?",
    ],
    coreQuestions: [
      "How does a firm decide how many workers to hire?",
      "How does the effect of a minimum wage in a monopsony differ from a competitive market?",
      "How is income inequality measured, and what are the limits of those measures?",
    ],
    learningObjectives: [
      "Calculates a firm's labour demand by setting the value of the marginal product equal to the wage.",
      "Draws a Lorenz curve from income distribution data and calculates the Gini coefficient.",
      "Compares the effect of a minimum wage in competitive and monopsony models.",
    ],
    commonMisconceptions: [
      "Thinking wages are set by how important a job is to society.",
      "Thinking the Gini coefficient alone sums up a society's welfare.",
    ],
    links: {
      "math.calc.integral-apps": "the Gini coefficient is the area between the Lorenz curve and the line of equality",
      "gk.geo.human": "population, migration and labour movements",
    },
  },
  "econ.micro.market-failure": {
    title: "Market failure and public policy",
    description: "Externalities, public goods and free-riding, common resources, asymmetric information; Pigouvian taxes, subsidies, emissions trading and regulation; government failure.",
    whyItMatters: "It shows why markets can fall short on problems such as pollution, vaccines and climate, and which policy tools work when.",
    entryQuestions: [
      "A factory dumps waste into a river and fishers downstream suffer. Is the amount the factory produces the 'right' amount for society? Why?",
      "A lighthouse helps everyone, but nobody wants to pay for it. How can this be solved?",
    ],
    coreQuestions: [
      "How does a negative externality drive a wedge between private and social cost?",
      "Which two properties separate a public good from a private good?",
      "In what different ways do taxes, quotas and emissions trading reach the same goal?",
    ],
    learningObjectives: [
      "Finds the socially optimal quantity and the deadweight loss in a market with an externality, using a graph.",
      "Classifies a good by rivalry and excludability and explains the free-rider problem.",
      "Compares taxes, regulation and emissions trading for an environmental problem.",
    ],
    commonMisconceptions: [
      "Thinking the optimal level of pollution is always zero.",
      "Thinking government intervention always improves things when there is a market failure.",
    ],
    links: {
      "env.sustainability": "the economic tools of environmental policy",
      "env.pollution.air": "air pollution is the textbook negative externality",
      "psy.social": "free-riding and social loafing",
    },
  },
  "econ.macro.gdp": {
    title: "National income accounts and GDP",
    description: "Measuring GDP by the expenditure, income and output methods; nominal and real GDP, the GDP deflator, GDP per capita and its limits as a measure of welfare.",
    whyItMatters: "It lets you decode growth figures in the news and compare countries correctly.",
    entryQuestions: [
      "In a country everyone produces the same amount, but prices double. Does GDP double? Did the country get richer?",
      "If you mow your neighbour's lawn for money, GDP rises; if you mow your own, it does not. Is that a problem?",
    ],
    coreQuestions: [
      "Why should the three measurement methods give the same result?",
      "How are nominal and real GDP separated?",
      "Which aspects of welfare does GDP miss?",
    ],
    learningObjectives: [
      "Calculates GDP from given expenditure items while avoiding double-counting intermediate goods.",
      "Calculates real GDP, the deflator and the growth rate from price and quantity data.",
      "Interprets the limits of cross-country comparisons of GDP per capita.",
    ],
    commonMisconceptions: [
      "Thinking second-hand sales and financial transactions count in GDP.",
      "Thinking a rise in nominal GDP always means output has grown.",
    ],
    links: {
      "media.lit.stats-in-news": "reading growth figures in the news correctly",
      "math.found.arithmetic": "percentage change and index calculations",
    },
  },
  "econ.macro.inflation-unemployment": {
    title: "Measuring inflation and unemployment",
    description: "The consumer price index and the basket method, the costs of inflation, real and nominal interest, the unemployment rate and labour-force participation, types of unemployment and the natural rate.",
    whyItMatters: "It lets you work out what your wage, savings and interest rates are really worth, and introduces the two main indicators of macro policy.",
    entryQuestions: [
      "Your pay rose 20% and prices rose 30%. Are you richer or poorer? By how many percent?",
      "Does someone who stops looking for work raise or lower the unemployment rate?",
    ],
    coreQuestions: [
      "How is a price index calculated, and which biases is it open to?",
      "Who gains and who loses from inflation?",
      "How is the unemployment rate defined, and when can it mislead?",
    ],
    learningObjectives: [
      "Calculates a price index and an inflation rate from basket data.",
      "Calculates the real interest rate with the Fisher relation and explains how unexpected inflation affects borrowers and lenders.",
      "Calculates unemployment and participation rates from labour data and distinguishes types of unemployment.",
    ],
    commonMisconceptions: [
      "Thinking inflation just means 'everything getting more expensive' and not separating it from changes in relative prices.",
      "Thinking the natural rate of unemployment should be zero.",
    ],
    links: {
      "gk.econ.personal-finance": "real interest and the purchasing power of savings",
      "math.found.exp-log": "compound inflation and annualising",
      "media.lit.stats-in-news": "evaluating news about indices and rates",
    },
  },
  "econ.macro.ad-as": {
    title: "The aggregate demand–aggregate supply model",
    description: "The components of aggregate demand and the slope of the curve, short- and long-run aggregate supply, macroeconomic equilibrium, demand and supply shocks, inflationary and recessionary gaps, and the short-run Phillips curve.",
    whyItMatters: "It is the core macro model that explains recession, inflation and stagflation with a single graph; it is the shared language of policy debates.",
    entryQuestions: [
      "If oil prices suddenly double, can both prices and unemployment rise? What happens to the textbook rule that 'when one rises the other falls'?",
      "If everyone saves more at the same time, does the economy grow or shrink?",
    ],
    coreQuestions: [
      "Why does the aggregate demand curve slope downwards?",
      "What is the difference between short-run and long-run aggregate supply?",
      "How does the economy return to long-run equilibrium on its own after a shock?",
    ],
    learningObjectives: [
      "Shows with a diagram the short- and long-run effect of a demand or supply shock on the price level and real output.",
      "Identifies inflationary and recessionary gaps and explains the self-correction process.",
      "Relates the AD–AS model to the short-run Phillips curve.",
    ],
    commonMisconceptions: [
      "Thinking the aggregate demand curve slopes down for the same reason as the demand curve for a single good.",
      "Thinking long-run aggregate supply depends on the price level.",
    ],
    competitionApplications: ["AP Macroeconomics AD–AS free-response questions"],
    links: {
      "math.dyn.stability": "equilibrium and returning to it after a shock",
      "econ.micro.elasticity": "the macro counterpart of supply and demand diagrams",
    },
  },
  "econ.macro.money-banking": {
    title: "Money, banking and the central bank",
    description: "The functions of money, definitions of the money supply, fractional-reserve banking and the money multiplier, the bank balance sheet, the central bank's tools and the money market.",
    whyItMatters: "It explains how banks 'create money' and how central bank decisions reach everyday life.",
    entryQuestions: [
      "You deposit 1000 in a bank. If the bank lends part of it out, does the total amount of money in the economy change?",
      "If a country can print as much money as it likes, why doesn't everyone become rich?",
    ],
    coreQuestions: [
      "How does a fractional-reserve system multiply the money supply?",
      "Which tools does the central bank use to influence the money supply and interest rates?",
      "What does the value of money rest on?",
    ],
    learningObjectives: [
      "Tracks deposits and loans on a bank balance sheet and calculates the simple money multiplier.",
      "Shows the effect of a change in the money supply on the interest rate with a money-market diagram.",
      "Explains how the central bank's tools work and states how to check current practice in official sources.",
    ],
    commonMisconceptions: [
      "Thinking banks only pass deposited money on to others and never create new money.",
      "Thinking the simple money multiplier always works exactly in the real economy.",
    ],
    links: {
      "math.found.sequences": "the money multiplier is the sum of a geometric series",
      "gk.econ.personal-finance": "deposits, loans and interest",
    },
  },
  "econ.macro.monetary-fiscal": {
    title: "Monetary and fiscal policy",
    description: "Expansionary and contractionary monetary and fiscal policy, spending and tax multipliers, budget deficits and public debt, crowding out, policy lags and the role of expectations.",
    whyItMatters: "It lets you judge how each tool works against recession and inflation, and which trade-offs it brings.",
    entryQuestions: [
      "If the government spends 100 units in the economy, can GDP rise by more than 100? How?",
      "When both unemployment and inflation are high, should the central bank raise or cut interest rates?",
    ],
    coreQuestions: [
      "How is the spending multiplier derived, and why is it larger than the tax multiplier?",
      "Through which transmission channels does monetary policy affect aggregate demand?",
      "Why can budget deficits crowd out private investment?",
    ],
    learningObjectives: [
      "Derives and calculates the spending and tax multipliers from the marginal propensity to consume.",
      "Shows the appropriate monetary and fiscal policy for a recession or inflation scenario using AD–AS and money-market diagrams.",
      "Evaluates crowding out and policy lags as limits on a policy proposal.",
    ],
    commonMisconceptions: [
      "Thinking monetary and fiscal policy are run by the same institution.",
      "Thinking the multiplier effect happens instantly and without limit.",
    ],
    competitionApplications: ["AP Macroeconomics policy-analysis questions"],
    links: {
      "math.found.sequences": "the multiplier is a geometric series of spending rounds",
      "gk.civics.state-constitution": "the constitutional and institutional framework of the budget and public finance",
    },
  },
  "econ.macro.growth": {
    title: "Economic growth",
    description: "The sources of long-run growth (physical and human capital, technology, institutions), the production function, the idea of convergence, the rule of 70 and compound growth.",
    whyItMatters: "It shows where the huge income gaps between countries come from and how small differences in growth add up over decades.",
    entryQuestions: [
      "How big is the gap after 35 years between an economy growing 2% a year and one growing 4%? Guess first.",
      "Can a country grow forever just by buying more machines?",
    ],
    coreQuestions: [
      "What separates long-run growth from short-run fluctuations?",
      "Why does capital accumulation run into diminishing returns, and how does technology overcome this?",
      "What role do institutions play in growth?",
    ],
    learningObjectives: [
      "Derives the rule of 70 from the compound growth formula and calculates doubling times.",
      "Distinguishes the contributions of capital and technology to growth with a per-worker production function.",
      "Interprets growth data on a logarithmic-scale graph.",
    ],
    commonMisconceptions: [
      "Thinking a one-percentage-point difference in growth is unimportant in the long run.",
      "Thinking growth comes only from accumulating more capital.",
    ],
    links: {
      "math.found.exp-log": "compound growth and doubling time",
      "env.population.human": "population growth and resource use",
      "gk.world.industrial": "the Industrial Revolution and the historical start of growth",
    },
  },
  "econ.intl.trade": {
    title: "International trade and exchange rates",
    description: "Gains from trade, the effects of tariffs and quotas, the balance of payments (current and financial account), supply and demand in the foreign exchange market, appreciation/depreciation and exchange-rate regimes.",
    whyItMatters: "It explains why exchange rates change and how that affects imports, exports and prices; it lets you judge trade-policy debates.",
    entryQuestions: [
      "If the home currency loses value, who is pleased: exporters or importers? How do you feel if you want a holiday abroad?",
      "If a country puts a tariff on imported shoes, who wins and who loses? What is the overall effect?",
    ],
    coreQuestions: [
      "How does a tariff redistribute welfare between groups?",
      "What factors determine the exchange rate?",
      "How are the current account and the financial account related?",
    ],
    learningObjectives: [
      "Calculates the effect of a tariff on consumer and producer surplus, government revenue and deadweight loss using a graph.",
      "Shows the effect of an interest-rate differential or a change in demand on the exchange rate with a foreign-exchange-market diagram.",
      "Classifies balance-of-payments items and explains why the balance sums to zero overall.",
    ],
    commonMisconceptions: [
      "Thinking a current account deficit always shows a country is 'losing'.",
      "Thinking trade is always zero-sum, so one side's gain is the other's loss.",
    ],
    competitionApplications: ["AP Macroeconomics open-economy questions"],
    links: {
      "gk.civics.international": "international trade organisations and agreements",
      "gk.world.globalization": "globalisation and trade networks",
      "gk.geo.political": "borders and economic integration",
    },
  },
  "econ.boss": {
    title: "Boss: Economics synthesis",
    description: "A policy case joining micro and macro: analyse an environmental externality, a recession and an exchange-rate shock in the same economy, and defend a policy proposal along with its trade-offs.",
    whyItMatters: "It tests the idea that economics rarely has a single right answer and that models must be used together with their assumptions; it is the integrated form of olympiad and AP free-response questions.",
    entryQuestions: [
      "A country in recession is considering both a carbon tax and defending its currency. In what order, and with which tools, should it act? List the trade-offs.",
    ],
    coreQuestions: [
      "How do micro and macro tools affect each other in the same economy?",
      "How sensitive is a policy proposal to the model's assumptions?",
    ],
    learningObjectives: [
      "Analyses a multi-part scenario with the appropriate micro and macro diagrams.",
      "Compares two or more policy options by their short- and long-run effects and their distributional consequences.",
      "Writes out the assumptions a policy proposal rests on and predicts how the conclusion changes if they change.",
    ],
    competitionApplications: ["Economics olympiads and AP Micro/Macro free-response questions"],
    links: {
      "env.sustainability": "the economic and environmental side of climate policy",
      "res.project.modeling": "a modelling project with explicit assumptions",
    },
  },
};

export const UNITS_ECONOMICS: Record<string, string> = {
  "Mikroekonomi": "Microeconomics",
  "Piyasalar": "Markets",
  "Makroekonomi": "Macroeconomics",
  "Ulusal ekonomi": "The national economy",
};
