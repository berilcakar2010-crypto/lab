import type { LOText } from "../../schema";

export const EN_PROGRAMMING: Record<string, LOText> = {
  "prog.python.basics": {
    title: "Python basics: variables, conditions, loops",
    description: "Writing small but complete programs with variables, basic data types, conditional statements and loops.",
    whyItMatters: "Scientific computing, data analysis and neuron simulations are all built from these building blocks; it is the first step towards having a computer evaluate a formula thousands of times instead of doing it by hand.",
    entryQuestions: [
      "x = x + 1 is a contradiction in mathematics, yet programmers write it every day. What exactly does this line tell the computer?",
      "How long would it take by hand to add up the numbers from 1 to 1000 that are divisible by 3 or 5? How would you get a three-line loop to do it?",
    ],
    coreQuestions: [
      "What does a variable represent in memory, and when does assignment happen?",
      "How do conditions and loops change the flow of a computation?",
      "How do the int, float, str and bool types interact?",
    ],
    learningObjectives: [
      "Turns a word problem into a working program that uses variables, conditions and loops.",
      "Predicts how many times a loop will run before executing it and checks the prediction with a trace table.",
      "Diagnoses and fixes type errors and infinite loops starting from the error message.",
    ],
    commonMisconceptions: [
      "Believing that the = sign means the same as equality in mathematics; in fact the value on the right is assigned to the name on the left.",
      "Thinking that the expression 0.1 + 0.2 == 0.3 always returns True.",
      "Assuming that range(1, 10) includes 10.",
    ],
    links: {
      "math.found.algebra": "the concept of a variable is shared, but assignment and equations are different things",
      "math.found.sequences": "computes the terms and partial sums of sequences with loops",
    },
  },
  "prog.python.functions": {
    title: "Functions and modularity",
    description: "Splitting code into reusable functions and modules that take parameters and return values; the concepts of scope and side effects.",
    whyItMatters: "Writing each step of a simulation as a separate function localises bugs, makes testing possible and lets you reuse the same code across different experiments.",
    entryQuestions: [
      "You notice that a list you modified inside a function has also changed outside it after the function returns, yet when you change a number it doesn't. Why?",
      "What could be the difference between f(x) = x² in mathematics and def f(x): return x**2 in Python? Can one of them create a \"side effect\"?",
    ],
    coreQuestions: [
      "When should I move a task into a separate function?",
      "How does the difference between local and global scope affect a program's behaviour?",
      "How do you tell a pure function from one with side effects?",
    ],
    learningObjectives: [
      "Turns repeated pieces of code into parameterised functions and gives them meaningful names.",
      "Predicts how a function call will affect variables before running it.",
      "Splits their code into several modules and brings them together with import.",
    ],
    commonMisconceptions: [
      "Believing that print and return are the same thing.",
      "Assuming that a list given as a default argument creates a new list on every call.",
    ],
    links: {
      "math.found.functions": "the program counterpart of the mathematical function concept; a pure function is the closest to a mathematical function",
    },
  },
  "prog.python.data-structures": {
    title: "Data structures: lists, dictionaries, sets",
    description: "Choosing among lists, tuples, dictionaries and sets with an understanding of their differences in performance and use.",
    whyItMatters: "The right data structure can cut a program's running time from hours to seconds; graph algorithms, data analysis and experiment records are all built on these structures.",
    entryQuestions: [
      "Among a million student numbers, would you check whether a given number is present faster in a list or in a set? Predict, then measure.",
      "After a = [1, 2, 3]; b = a; b.append(4), what is the value of a?",
    ],
    coreQuestions: [
      "Which data structure best answers which question?",
      "Why does the difference between mutable and immutable objects matter?",
      "How do dictionaries make lookup by key fast?",
    ],
    learningObjectives: [
      "Chooses a suitable data structure for a problem and justifies the choice in terms of time cost.",
      "Models a realistic data record with nested dictionaries and lists.",
      "Identifies bugs caused by aliasing and fixes them by copying.",
    ],
    commonMisconceptions: [
      "Believing that b = a creates a copy of the list.",
      "Assuming that elements in dictionaries and sets always carry a meaningful order in which they were added; sets have no order.",
    ],
    links: {
      "math.found.logic": "set operations (union, intersection, difference) map directly onto Python sets",
      "math.discrete.graph-theory": "an adjacency list is a dictionary-of-lists structure",
    },
  },
  "prog.python.oop": {
    title: "Object-oriented programming",
    description: "Packaging state and behaviour together with classes, objects, inheritance and encapsulation.",
    whyItMatters: "It is a natural language for modelling entities that carry state, such as a neuron, a particle or an experimental setup; most large scientific libraries are written this way.",
    entryQuestions: [
      "In a simulation, each of 1000 neurons has its own membrane potential. Would you keep these in separate lists or make each neuron an \"object\"? What does each choice cost?",
    ],
    coreQuestions: [
      "What is the relationship between a class and an object?",
      "When is inheritance useful, and when is it needless complexity?",
    ],
    learningObjectives: [
      "Designs and codes an entity with state and behaviour as a class.",
      "Justifies a design choice between inheritance and composition.",
      "Restructures a simple particle or neuron simulation using objects.",
    ],
    commonMisconceptions: [
      "Thinking that making everything a class always makes code better.",
      "Believing that the self parameter is a magic keyword; it is simply the name given to the object itself.",
    ],
    links: {
      "neuro.comp.lif": "each neuron as an object carries a state (V) and an update rule",
      "phys.comp.simulation": "modelling particle systems with objects",
    },
  },
  "prog.python.files-debug": {
    title: "Debugging, testing and files",
    description: "Reading error messages, debugging systematically, writing unit tests, and reading data from and writing data to files.",
    whyItMatters: "In scientific code, a silent bug means publishing a wrong result; testing and systematic debugging are prerequisites for trusting your results.",
    entryQuestions: [
      "Your code ran without errors and produced a number. How do you know that number is correct?",
      "Instead of scattering print statements through your code at random to find a bug, how could you apply a strategy like binary search?",
    ],
    coreQuestions: [
      "How is an error message (traceback) read?",
      "Which cases should a good test cover?",
      "How is the format of data read from a file validated?",
    ],
    learningObjectives: [
      "Reads a traceback and locates the source of the error down to the line.",
      "Writes unit tests for a function that also cover edge cases.",
      "Reads a CSV or text file, processes it and writes the result to a new file.",
      "Narrows down a bug systematically with a hypothesise-and-test cycle.",
    ],
    commonMisconceptions: [
      "Believing that a program that runs without errors is running correctly.",
      "Thinking that tests are only needed for large software projects.",
    ],
    links: {
      "res.method.hypothesis": "debugging is a small-scale application of forming and testing hypotheses",
      "phys.lab.experimental": "validating against a known result resembles experimental calibration",
    },
  },
  "prog.algo.complexity": {
    title: "Algorithmic complexity (Big-O)",
    description: "Analysing asymptotically how an algorithm's running time and memory use grow with the size of the input.",
    whyItMatters: "It lets you say in advance whether a method will work not just on 100 data points but on 10 million spike records; in contest problems it is the first filter for choosing the right idea.",
    entryQuestions: [
      "Doubling the input size makes an algorithm take four times as long. What can you say about the algorithm?",
      "The difference between O(n log n) and O(n²) is negligible for n = 10. How many times larger is it for n = 10⁶? Estimate.",
    ],
    coreQuestions: [
      "What does Big-O measure, and what does it ignore?",
      "How do nested loops and halving affect complexity?",
      "Why are the worst, average and best cases considered separately?",
    ],
    learningObjectives: [
      "Derives the time complexity of a given piece of code from its loop structure.",
      "Interprets measured running times on a log-log plot and estimates the complexity class.",
      "Compares two algorithms for the same problem by their complexity and chooses between them.",
    ],
    commonMisconceptions: [
      "Believing that an O(n) algorithm is always faster than an O(n²) one; for small n the constants can dominate.",
      "Thinking that Big-O gives the running time in seconds.",
    ],
    competitionApplications: ["Working backwards from the input limits in a contest to the permitted complexity"],
    links: {
      "math.found.exp-log": "logarithmic and exponential growth are the language of complexity classes",
      "math.calc.lhopital": "comparing growth rates of functions with limits",
      "math.discrete.recurrences": "the running time of recursive algorithms is expressed as a recurrence relation",
    },
  },
  "prog.algo.sorting-search": {
    title: "Sorting and searching",
    description: "Selection, insertion, merge and quick sort, together with linear and binary search; analysis of correctness and efficiency.",
    whyItMatters: "Sorting is a preliminary step in countless algorithms, and binary search, on sorted data and in the \"binary search on the answer\" technique, comes up constantly in contests and scientific computing.",
    entryQuestions: [
      "In how many looks at most can you find a name in a phone book? What if the phone book listed a million people?",
      "No comparison-based sorting algorithm can beat n log n. Why does this claim strike you as surprising or natural?",
    ],
    coreQuestions: [
      "How does divide and conquer speed up sorting?",
      "Under what condition does binary search work correctly?",
      "How is an algorithm's correctness shown with a loop invariant?",
    ],
    learningObjectives: [
      "Codes merge sort and binary search from scratch and tests them.",
      "Justifies the correctness of binary search with a loop invariant.",
      "Measures the running time of sorting algorithms on different inputs and compares it with theory.",
    ],
    commonMisconceptions: [
      "Believing that binary search also works on unsorted data.",
      "Thinking that quicksort is O(n log n) on every input.",
    ],
    competitionApplications: ["Binary search on the answer; sorting plus a greedy approach"],
    links: {
      "math.found.proof-techniques": "a loop invariant is the program counterpart of proof by induction",
      "prog.sci.numerical-methods": "bisection root finding is the continuous version of binary search",
    },
  },
  "prog.algo.recursion": {
    title: "Recursion and divide and conquer",
    description: "Solving a problem by reducing it to smaller instances of itself; base cases, the call stack and the divide-and-conquer strategy.",
    whyItMatters: "Tree and graph traversal, dynamic programming and many mathematical definitions are recursive; it is how inductive thinking is put into code.",
    entryQuestions: [
      "The Tower of Hanoi has 64 discs. If you move one disc per second, when will you finish? Make an intuitive guess first.",
      "Why is naive recursive code that computes fib(40) so slow? How many times is fib(2) called?",
    ],
    coreQuestions: [
      "What two parts does every recursive solution need?",
      "What parallel is there between recursion and proof by induction?",
      "How is the running time of divide-and-conquer algorithms calculated?",
    ],
    learningObjectives: [
      "Formulates a problem recursively and identifies the base case correctly.",
      "Derives the running time of a recursive algorithm by setting up a recurrence relation.",
      "Justifies the correctness of a recursive solution by induction.",
    ],
    commonMisconceptions: [
      "Thinking that recursion is always slower, or always more \"elegant\", than a loop.",
      "Believing that the base case is merely a safety measure; it is part of the algorithm's correctness.",
    ],
    competitionApplications: ["Search problems with backtracking"],
    links: {
      "math.found.proof-techniques": "recursive thinking is the computational twin of proof by induction",
      "math.discrete.recurrences": "running times and outputs are expressed as recurrence relations",
    },
  },
  "prog.algo.graphs": {
    title: "Graph algorithms: BFS, DFS, shortest paths",
    description: "Representing graphs; breadth-first and depth-first search, connected components and shortest paths with Dijkstra's algorithm.",
    whyItMatters: "From social networks to connectome analysis, from solving mazes to route planning, any data with a structure of relationships is a graph.",
    entryQuestions: [
      "To find the shortest path to the exit of a maze, which doors should you open in which order? \"Go deep first\" or \"look around first\"?",
      "Why can the idea of a shortest path break down if edge weights can be negative?",
    ],
    coreQuestions: [
      "Which questions do BFS and DFS answer differently?",
      "Why does Dijkstra's algorithm work correctly?",
      "How do you choose between an adjacency matrix and an adjacency list?",
    ],
    learningObjectives: [
      "Models a problem as a graph and chooses a suitable representation.",
      "Codes BFS, DFS and Dijkstra's algorithm and traces them step by step on small graphs.",
      "Justifies the correctness of Dijkstra's algorithm with a greedy-choice argument.",
    ],
    commonMisconceptions: [
      "Believing that BFS also finds shortest paths in weighted graphs.",
      "Thinking that DFS must always be written recursively.",
    ],
    competitionApplications: ["Shortest-path, component-counting and topological-sort problems"],
    links: {
      "math.discrete.graph-theory": "the algorithmic side of graph theory",
      "neuro.comp.networks": "networks of neuronal connections are analysed as graphs",
      "math.prob.markov": "reachability and random walks on a transition graph",
    },
  },
  "prog.algo.dp": {
    title: "Dynamic programming",
    description: "Reducing exponential searches to polynomial time by solving overlapping subproblems once and storing the results; designing states, transitions and tables.",
    whyItMatters: "Sequence alignment, optimal decision sequences and the Bellman equation in reinforcement learning rest on the same idea; it is one of the most frequent techniques in competitive programming.",
    entryQuestions: [
      "With coins worth 1, 3 and 4 lira, what is the fewest number of coins needed to pay 6 lira? Does the greedy approach (take the largest coin first) give the right answer here?",
      "A single dictionary is enough to compute fib(40) in a thousandth of a second. How?",
    ],
    coreQuestions: [
      "How do I tell whether a problem is suited to dynamic programming?",
      "How are the state and the transition equation defined?",
      "How do the top-down (memoisation) and bottom-up (tabulation) approaches compare?",
    ],
    learningObjectives: [
      "Derives the state definition and transition relation for a problem.",
      "Codes the same problem with both memoisation and tabulation.",
      "Calculates the time and memory complexity of a DP solution.",
    ],
    commonMisconceptions: [
      "Thinking that a greedy choice is sufficient for every optimisation problem.",
      "Believing that DP is a particular type of problem rather than an algorithm; it is a design technique.",
    ],
    competitionApplications: ["Knapsack, longest common subsequence and path-counting problems"],
    links: {
      "neuro.comp.reinforcement": "the Bellman equation and value function are a direct application of dynamic programming",
      "math.prob.counting": "most counting problems are solved with a recurrence plus a table",
      "bio.evolution": "DNA sequence alignment is a DP problem",
    },
  },
  "prog.python.numpy": {
    title: "Scientific computing with NumPy",
    description: "Fast numerical computation with multidimensional arrays, vectorised operations, broadcasting and linear algebra functions.",
    whyItMatters: "Almost all scientific code in Python is built on NumPy arrays; turning a loop into a vector operation can speed up a simulation by orders of magnitude.",
    entryQuestions: [
      "Compare squaring a million numbers with a Python loop and with NumPy. How many times faster do you think NumPy will be?",
      "When you add an array of shape (3, 1) to an array of shape (1, 4), what shape is the result? Predict first.",
    ],
    coreQuestions: [
      "Why is vectorisation so fast?",
      "How do the broadcasting rules work?",
      "How do I express a matrix operation in NumPy?",
    ],
    learningObjectives: [
      "Converts a loop-based computation into vectorised NumPy code and measures the speed-up.",
      "Works out in advance the array shape that broadcasting will produce.",
      "Performs matrix multiplication, linear solves and eigenvalue computations with NumPy and checks the result by hand on a small example.",
    ],
    commonMisconceptions: [
      "Believing that A * B is matrix multiplication; it is element-wise multiplication, and matrix multiplication is A @ B.",
      "Thinking that slicing always creates a copy; it usually returns a view.",
    ],
    links: {
      "math.linalg.matrices": "the numerical counterpart of matrix operations",
      "math.linalg.eigen": "computing eigenvalues and eigenvectors numerically",
      "neuro.methods.data-analysis": "neural recordings are processed as NumPy arrays",
    },
  },
  "prog.python.plotting": {
    title: "Visualisation with Matplotlib",
    description: "Creating line, scatter, histogram and multi-panel plots; making deliberate choices about axes, scales, labels and colours.",
    whyItMatters: "You cannot trust a result you have not seen; a plot is both a debugging tool and the main way of communicating a finding to others.",
    entryQuestions: [
      "The same data look exponential on a linear axis and like a straight line on a log axis. Which plot is \"wrong\"?",
      "If a plot's y-axis does not start at zero, what changes in the viewer's mind?",
    ],
    coreQuestions: [
      "Which type of plot suits which type of data?",
      "When is a log scale needed?",
      "What makes a plot readable on its own?",
    ],
    learningObjectives: [
      "Turns a simulation's output into a complete plot with axis labels and units.",
      "Distinguishes exponential and power-law relationships using the appropriate log scale.",
      "Creates a multi-panel figure and ties the panels together into a common narrative.",
    ],
    commonMisconceptions: [
      "Believing that plots are only for presenting results; they are also a basic tool for exploration and debugging.",
      "Thinking that more colours and effects make a better plot.",
    ],
    links: {
      "math.stat.descriptive": "describing distributions and relationships visually",
      "phys.lab.experimental": "plotting measurements with error bars",
      "media.lit.stats-in-news": "seeing first-hand how misleading charts are made",
    },
  },
  "prog.python.pandas": {
    title: "Data processing with pandas",
    description: "Reading tabular data into a DataFrame, cleaning, filtering, grouping and merging it.",
    whyItMatters: "Real data are messy; dealing with missing values, wrong types and inconsistent labels makes up most of an analysis.",
    entryQuestions: [
      "An age column contains '17', 17 and 'seventeen'. What do you need to do before computing the mean?",
      "Delete missing values or fill them in? Predict how each choice could distort the result.",
    ],
    coreQuestions: [
      "Which checks should be done on a data set before analysing it?",
      "What question does a groupby operation answer?",
      "On which key, and with which type of join, are two tables merged?",
    ],
    learningObjectives: [
      "Reads a raw CSV file and reports its types, missing values and outliers.",
      "Produces a numerical answer to a research question with groupby and merge operations.",
      "Documents data-cleaning decisions and compares their effect on the result.",
    ],
    commonMisconceptions: [
      "Assuming that silently dropping missing values will not affect the result.",
      "Believing that an assignment made through chained indexing always modifies the original table.",
    ],
    researchApplications: ["Cleaning and analysing your own study records or an open data set"],
    links: {
      "math.stat.descriptive": "group means, distributions and summary statistics",
      "res.data.management": "a clean, documented layout for data tables",
    },
  },
  "prog.sci.numerical-methods": {
    title: "Numerical methods: root finding, numerical integration, floating point",
    description: "The limits of floating-point arithmetic; root finding with bisection and Newton's method; numerical integration with the trapezoidal and Simpson's rules, and error analysis.",
    whyItMatters: "Most equations without a closed-form solution are solved this way in science; someone who cannot tell method error from rounding error cannot trust their result.",
    entryQuestions: [
      "Why can the computation 1e16 + 1 - 1e16 come out as 0 on a computer?",
      "If you halve the step size, by what factor does the error of the trapezoidal rule shrink? Predict, then check by experiment.",
    ],
    coreQuestions: [
      "How do floating-point numbers approximate real numbers?",
      "Why does Newton's method converge quickly, and when does it fail?",
      "How does the error in numerical integration depend on the step size?",
    ],
    learningObjectives: [
      "Derives Newton's method from the Taylor expansion and codes it.",
      "Derives the order of the trapezoidal rule's error and confirms it with a numerical experiment.",
      "Distinguishes rounding error from truncation (method) error on a log-log error plot.",
    ],
    commonMisconceptions: [
      "Believing that the error always decreases as the step size gets smaller; beyond a certain point rounding error grows.",
      "Thinking that Newton's method converges to the root from any starting point.",
    ],
    links: {
      "math.calc.taylor": "Newton's method and the error analyses rest on the Taylor expansion",
      "math.calc.integral-def": "the computational counterpart of the Riemann sum",
      "math.ode.numerical": "the same error analysis carries over to differential equation solvers",
    },
  },
  "prog.sci.simulation": {
    title: "Simulation and Monte Carlo",
    description: "Estimating probabilities and integrals with random numbers; simulating deterministic and stochastic systems in time steps.",
    whyItMatters: "It lets you explore by experiment any system that is hard to solve analytically, from a random walk to a population of spiking neurons.",
    entryQuestions: [
      "You can estimate π by throwing random points into a square and counting how many land inside the inscribed circle. How many times more points do you need for a result 10 times more accurate?",
      "How would you verify the birthday paradox using only simulation, without a formula?",
    ],
    coreQuestions: [
      "How does the error of a Monte Carlo estimate shrink with the number of samples?",
      "How do the random number generator and the seed affect reproducibility?",
      "How do I check that a simulation is correct?",
    ],
    learningObjectives: [
      "Solves a probability problem with Monte Carlo and compares the result with the analytical one.",
      "Derives from the central limit theorem that Monte Carlo error shrinks as 1/√N and demonstrates it experimentally.",
      "Simulates a stochastic process such as a random walk or a Poisson spike generator.",
    ],
    commonMisconceptions: [
      "Believing that random number generators are truly random; they are pseudo-random.",
      "Thinking that a longer simulation will also fix a systematic model error.",
    ],
    researchApplications: ["A parameter sweep of a model with no known analytical solution"],
    links: {
      "math.prob.limit-theorems": "Monte Carlo error is explained by the central limit theorem",
      "math.prob.stochastic": "simulating random walks and Poisson processes",
      "neuro.comp.spike-stats": "generating Poisson spike trains and examining their statistics",
    },
  },
  "prog.ml.basics": {
    title: "Introduction to machine learning: regression and classification",
    description: "Learning models from data: linear and logistic regression, train/test splits, overfitting, regularisation and cross-validation.",
    whyItMatters: "Much of modern science, from neural decoding to finding patterns in experimental data, is done with these tools; misused, they easily produce spurious success.",
    entryQuestions: [
      "A model achieves 100% accuracy on its training data. Is that good news or a cause for concern?",
      "If 95% of the students in a class pass an exam, a model that says \"everyone passes\" is 95% accurate. Is it a good model?",
    ],
    coreQuestions: [
      "What does a model learn from data, and how?",
      "How is overfitting detected and prevented?",
      "By which metrics should a classifier's performance be judged?",
    ],
    learningObjectives: [
      "Splits a data set into training and test sets and trains linear and logistic regression models.",
      "Plots training and test error against model complexity and interprets overfitting.",
      "Chooses and justifies appropriate metrics instead of accuracy for imbalanced classes.",
    ],
    commonMisconceptions: [
      "Believing that using the test data repeatedly for model selection does not affect the result (data leakage).",
      "Thinking that high accuracy means the model has found a causal relationship.",
    ],
    researchApplications: ["Decoding models for neural or behavioural data"],
    links: {
      "math.stat.regression": "least-squares regression is the simplest machine-learning model",
      "neuro.comp.neural-coding": "decoding a stimulus from spike data is a classification problem",
      "res.stats.pitfalls": "data leakage and repeated trials are the machine-learning counterpart of p-hacking",
    },
  },
  "prog.ml.neural-nets": {
    title: "Artificial neural networks and backpropagation",
    description: "Multilayer perceptrons, activation functions, the loss function and backpropagation via the chain rule; training by gradient descent.",
    whyItMatters: "It is the foundation of modern artificial intelligence and, when compared with the brain, raises deep questions about learning rules.",
    entryQuestions: [
      "A single linear neuron cannot solve the XOR problem. Why does adding a hidden layer change that?",
      "Does backpropagation resemble the way synapses in the brain learn? In what ways is it similar, and in what ways definitely not?",
    ],
    coreQuestions: [
      "Why is a nonlinear activation essential?",
      "How does backpropagation apply the chain rule efficiently?",
      "How do the learning rate and initialisation affect training?",
    ],
    learningObjectives: [
      "Derives the backpropagation equations for a two-layer network from the chain rule.",
      "Codes a small network from scratch using only NumPy and trains it on XOR or a simple data set.",
      "Validates backpropagation code by comparing numerical gradients with analytical gradients.",
    ],
    commonMisconceptions: [
      "Believing that artificial neurons are realistic models of biological neurons.",
      "Thinking that more layers always give better results.",
    ],
    researchApplications: ["Network models that explain neural data"],
    links: {
      "math.calc.multivar": "backpropagation is an application of the multivariable chain rule",
      "neuro.comp.ann-bridge": "comparing artificial and biological networks",
      "neuro.syn.plasticity": "the contrast between backpropagation and local synaptic learning rules",
    },
  },
  "prog.tools.git": {
    title: "Git and version control",
    description: "Recording changes as commits, branching, merging, working with a remote repository and going back in history.",
    whyItMatters: "Being able to go back when today's change breaks code that worked yesterday, and to prove which code produced a result, is the infrastructure of reproducible science.",
    entryQuestions: [
      "'analysis_final.py', 'analysis_final_REALLYFINAL.py', 'analysis_final2_fixed.py'... What is wrong with this way of organising files, and how is it solved?",
      "You notice a plot looked different three weeks ago. How do you find which code change caused it?",
    ],
    coreQuestions: [
      "What does a commit record, and how is a good commit message written?",
      "Why are branches used?",
      "How is a merge conflict resolved?",
    ],
    learningObjectives: [
      "Turns a project into a git repository and advances it with small, meaningful commits.",
      "Creates a branch for an experiment, merges it back into the main branch and resolves a resulting conflict.",
      "Finds a past version and reproduces a result with that version.",
    ],
    commonMisconceptions: [
      "Believing that Git is only a backup tool.",
      "Thinking there is no problem in adding large data files and passwords to the repository.",
    ],
    links: {
      "res.data.management": "documenting the history of code and analysis",
    },
  },
  "prog.tools.reproducible": {
    title: "Reproducible computing: notebooks and environments",
    description: "Using Jupyter notebooks with discipline, and making an analysis exactly reproducible on another computer with virtual environments and dependency files.",
    whyItMatters: "A result is only scientifically valuable if you or someone else can reproduce it a year later.",
    entryQuestions: [
      "Running a notebook's cells in a different order gives you a different result. Which one is the \"real\" result?",
      "Your code fails on a friend's computer but works on yours. What could be different?",
    ],
    coreQuestions: [
      "Which components make an analysis reproducible?",
      "How is the hidden-state problem of notebooks prevented?",
      "How are dependencies and random seeds pinned?",
    ],
    learningObjectives: [
      "Packages an analysis project reproducibly with an environment file, a fixed seed and a README.",
      "Runs a notebook from top to bottom on a clean kernel and confirms it gets the same result.",
      "Attempts to reproduce an analysis published by someone else and reports the obstacles encountered.",
    ],
    commonMisconceptions: [
      "Believing that sharing the code is enough on its own for reproducibility; versions, data and environment are needed too.",
      "Assuming that the output in a notebook always belongs to the current state of the code above it.",
    ],
    researchApplications: ["Reproducing a figure from a published paper with open code and data"],
    links: {
      "res.data.management": "documenting data and code together",
      "res.ethics": "reproducibility is the technical dimension of research integrity",
    },
  },
  "prog.tools.latex": {
    title: "Scientific writing with LaTeX",
    description: "Typesetting equations, figures, tables and bibliographies with LaTeX; document structure and automatic numbering.",
    whyItMatters: "It is the standard tool for writing mathematics and physics; it lets you write equations cleanly and consistently in reports, olympiad solutions and papers.",
    entryQuestions: [
      "When you add a new equation to a report, will you update all the following equation numbers and the references to them by hand?",
      "How would you type ∫₀^∞ e^{-x²} dx = √π/2 on a keyboard so that it renders properly?",
    ],
    coreQuestions: [
      "What is the basic structure of a LaTeX document?",
      "How are equations, figures and sources cross-referenced automatically?",
    ],
    learningObjectives: [
      "Typesets a short report with equations, a figure, a table and a bibliography in LaTeX.",
      "Fixes compilation errors by reading the log file.",
      "Writes a physics solution readably with aligned multi-line equations.",
    ],
    commonMisconceptions: [
      "Believing that LaTeX works like a word processor on a \"what you see is what you get\" basis.",
      "Thinking that figures must stay exactly where they are written; floats handle placement automatically.",
    ],
    links: {
      "res.write.report": "the typesetting tool for scientific reports",
      "res.lit.citation": "reference management with BibTeX",
    },
  },
  "prog.comp.competitive": {
    title: "Competitive programming",
    description: "Solving algorithmic problems under time and memory limits: reading the problem, budgeting complexity, handling edge cases and implementing quickly and correctly.",
    whyItMatters: "It turns algorithmic knowledge into correct, fast application under pressure, and is direct preparation for olympiads and programming contests.",
    entryQuestions: [
      "A problem says n ≤ 2·10⁵. Which algorithms does this single fact let you rule out without further thought?",
      "Your code passed the sample tests but got \"Wrong Answer\" on the hidden tests. Which three things do you check first?",
    ],
    coreQuestions: [
      "How is the class of algorithm inferred from the input limits?",
      "How is a solution's correctness tested before submitting?",
      "How are problems prioritised during a contest?",
    ],
    learningObjectives: [
      "Derives the appropriate complexity from the input limits and chooses an algorithm to match.",
      "Finds a bug in their own solution with randomised tests against a brute-force solution (stress testing).",
      "Solves a timed problem set and classifies their mistakes afterwards.",
    ],
    commonMisconceptions: [
      "Believing that memorising more algorithms means solving more problems; modelling skill is what decides.",
      "Thinking that overflow and edge cases can be ignored.",
    ],
    competitionApplications: ["Preparation for programming contests and the informatics olympiad"],
    links: {
      "math.comp.olympiad-methods": "invariants, the pigeonhole principle and counting ideas are also used in algorithmic problems",
      "comp.meta.deliberate-practice": "the error log and deliberate practice are the engine of contest improvement",
    },
  },
};

/** Turkish field/unit names used in this file's b.unit(field, unit) calls → English. */
export const UNITS_PROGRAMMING: Record<string, string> = {
  "Python": "Python",
  "Temeller": "Foundations",
  "Algoritmalar": "Algorithms",
  "Bilimsel hesaplama": "Scientific computing",
  "Makine öğrenmesi": "Machine learning",
  "Araçlar": "Tools",
};
