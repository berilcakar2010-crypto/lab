import type { LOText } from "../../schema";

export const EN_PROGRAMMING_PLUS: Record<string, LOText> = {
  "cs.data.representation": {
    title: "Data representation: binary, text, images, compression",
    description: "Turning numbers into binary and hexadecimal, text into character encodings, and images and sound into bits through sampling and quantisation; lossy and lossless compression.",
    whyItMatters: "Everything in a computer is a string of bits; everyday problems such as overflow, rounding error, garbled characters and file size come from choices of representation.",
    entryQuestions: [
      "How many different numbers can you write with 8 bits? What happens if you add 1 to 255? Predict, then try it in Python with a bytearray.",
      "Compressing a photo cuts its size to a tenth, yet your eye sees no difference. What information might have been thrown away?",
    ],
    coreQuestions: [
      "How are integers and negative numbers (two's complement) represented in bits?",
      "How are text, images and sound turned into bits, and what does resolution mean?",
      "Why can't lossless compression make every file smaller?",
    ],
    learningObjectives: [
      "Converts numbers between binary, decimal and hexadecimal and performs arithmetic in two's complement",
      "Calculates the size of an image or audio file from resolution, colour depth and sampling rate",
      "Codes a simple lossless compression algorithm (e.g. run-length encoding) and measures its compression ratio",
      "Distinguishes, with reasons, when lossy and when lossless compression is appropriate",
    ],
    commonMisconceptions: [
      "A computer stores decimals such as 0.1 exactly.",
      "Every file can be compressed further without loss.",
      "A file's extension determines what its contents are.",
    ],
    links: {
      "math.info.entropy": "entropy is the lower bound that lossless compression can reach",
      "math.found.exp-log": "n bits give 2^n states; the logarithm gives the number of bits needed",
      "phys.waves.sound": "sampling sound and its frequency content",
    },
  },
  "cs.systems.computer": {
    title: "Computer systems: hardware and operating systems",
    description: "How the processor, memory hierarchy and storage work together and the fetch–decode–execute cycle; process, memory and file management by the operating system.",
    whyItMatters: "To understand why a program runs slowly, why memory runs out, or why parallel computing does not always speed things up, you need a model of the hardware and operating system.",
    entryQuestions: [
      "If a computer's memory is thousands of times faster than its disk, why don't we keep everything in memory? Propose a design and find its cost.",
    ],
    coreQuestions: [
      "How does a processor fetch, decode and execute an instruction?",
      "Why does the memory hierarchy (cache, RAM, disk) exist and how does it affect performance?",
      "How does the operating system run several programs at once?",
    ],
    learningObjectives: [
      "Traces the fetch–decode–execute cycle step by step on a simple machine-language example",
      "Compares access times in the memory hierarchy and predicts a program's performance",
      "Explains processes, threads and scheduling with an example",
    ],
    commonMisconceptions: [
      "More cores speed up every program proportionally.",
      "RAM and storage are the same thing.",
    ],
    links: {
      "phys.em.circuits-dc": "a computer's hardware is built from electrical circuits",
      "neuro.cog.learning-memory": "similarities and differences between computer and brain memory systems",
    },
  },
  "cs.systems.internet": {
    title: "How the internet works: packets and protocols",
    description: "Splitting data into packets and carrying them through routers; IP addresses, DNS and layered protocols such as TCP/UDP and HTTP; the network's fault tolerance.",
    whyItMatters: "It explains what happens behind the scenes when you use the web, email and cloud services, and it is a prerequisite for security, privacy and web development.",
    entryQuestions: [
      "You split a message into pieces and send each piece by a different route. What should you do if the pieces arrive out of order, or one is lost? Design your own protocol.",
    ],
    coreQuestions: [
      "Why is packet switching more robust than a single fixed line?",
      "Why are protocol layers (link, network, transport, application) kept separate?",
      "What steps happen between typing a domain name and the page appearing on screen?",
    ],
    learningObjectives: [
      "Diagrams a web request's journey from the DNS lookup to the page response",
      "Compares the reliability–speed trade-off of TCP and UDP with examples",
      "Calculates a transfer time from bandwidth and latency",
    ],
    commonMisconceptions: [
      "The internet and the web are the same thing.",
      "Data travels from sender to receiver in one piece along a single path.",
    ],
    links: {
      "math.discrete.graph-theory": "a network is a graph of nodes and links; routing is a shortest-path problem",
      "media.lit.privacy": "where data passes through the network determines privacy",
    },
  },
  "cs.security": {
    title: "Cybersecurity basics and encryption",
    description: "The principles of confidentiality, integrity and availability; passwords and hash functions, symmetric and public-key encryption, digital signatures and common types of attack.",
    whyItMatters: "It is the basis for protecting your own data and writing secure software; public-key cryptography is one of the most striking applications of number theory.",
    entryQuestions: [
      "Can you agree on a secret key with someone you have never met, over a channel everyone is listening to? If it seems impossible, why?",
      "If a site stores your password in plain text, what happens in a breach? Is it possible to check a password without storing it at all?",
    ],
    coreQuestions: [
      "Which problems do symmetric and public-key encryption each solve?",
      "How do hash functions and salting protect passwords?",
      "Why can phishing and social engineering be more effective than technical attacks?",
    ],
    learningObjectives: [
      "Codes the Caesar and Vigenère ciphers and breaks them with frequency analysis",
      "Calculates RSA key generation, encryption and decryption with small numbers using modular arithmetic",
      "Draws up a threat model for a system and proposes measures in terms of confidentiality, integrity and availability",
      "Identifies the warning signs in a phishing message",
    ],
    commonMisconceptions: [
      "Keeping the encryption algorithm secret is what makes it secure.",
      "A long but predictable password is safe.",
      "The padlock icon (HTTPS) shows that a site is trustworthy.",
    ],
    competitionApplications: ["Cryptography and networking tasks in cybersecurity competitions (CTFs)"],
    links: {
      "math.discrete.number-theory": "RSA rests on modular arithmetic and the difficulty of factoring",
      "media.lit.privacy": "personal data security and password management",
      "math.prob.basics": "the size of the password space and the probability of a brute-force attack",
    },
  },
  "cs.impact.ethics": {
    title: "Social impacts and ethics of computing",
    description: "Ethical and legal questions about the digital divide, algorithmic bias, the effect of automation on work, intellectual property, open source, and the collection and use of data.",
    whyItMatters: "Thinking ahead about how your code will affect people is the responsibility of a good engineer and an informed citizen.",
    entryQuestions: [
      "A hiring algorithm learns from past hiring decisions. If those decisions were biased, can the algorithm be \"neutral\"?",
    ],
    coreQuestions: [
      "How are the benefits and harms of a technology distributed across different parts of society?",
      "How does algorithmic bias arise from data, design and use?",
      "How do copyright, licences and open source govern the sharing of software?",
    ],
    learningObjectives: [
      "Analyses the impact of a computing innovation on different stakeholders with an impact table",
      "Identifies the source of bias in an example of algorithmic bias and proposes ways to reduce it",
      "Compares the conditions of use and sharing under different software licences",
    ],
    commonMisconceptions: [
      "Algorithms are neutral because they are mathematics.",
      "Anything found on the internet can be used freely.",
    ],
    links: {
      "gk.phil.ethics": "evaluating technology decisions with ethical theories",
      "media.lit.algorithms": "recommender systems and filter bubbles",
      "res.ethics": "data collection and consent",
    },
  },
  "cs.data.databases": {
    title: "Databases and an introduction to SQL",
    description: "Organising data with tables, keys and relationships; selecting, filtering, grouping and joining with SQL queries; data integrity.",
    whyItMatters: "From apps to scientific data sets, structured data is stored everywhere in relational tables; SQL reinforces the way of thinking used in pandas through another language.",
    entryQuestions: [
      "If you keep students and the courses they take in a single table, what happens when a student's name changes? How would you split the table to fix this?",
    ],
    coreQuestions: [
      "How do primary and foreign keys create relationships?",
      "What do SELECT, WHERE, GROUP BY and JOIN queries compute?",
      "Why does duplicated data lead to inconsistency?",
    ],
    learningObjectives: [
      "Designs a simple schema of tables, keys and relationships for a problem",
      "Writes SQL queries involving filtering, grouping and joins and checks their results",
      "Writes the same query in SQL and in pandas and compares them",
    ],
    commonMisconceptions: [
      "A database is a big spreadsheet.",
      "A JOIN always reduces the number of rows.",
    ],
    links: {
      "math.found.logic": "SQL queries are set operations and predicate logic",
      "res.data.management": "storing research data in an organised, queryable form",
    },
  },
  "cs.web.basics": {
    title: "Web basics: HTML, CSS, JavaScript",
    description: "Building the structure of web pages with HTML, their appearance with CSS and their behaviour with JavaScript; how the browser processes a page, and principles of accessibility.",
    whyItMatters: "It is the most direct way to share your project, your data or an interactive simulation with anyone; separating content, presentation and behaviour is an example of good software design.",
    entryQuestions: [
      "If you right-click a web page and choose \"view source\", what do you expect to find? Guess how a page can look so rich when it comes from a plain-text file.",
    ],
    coreQuestions: [
      "Why are the responsibilities of HTML, CSS and JavaScript kept separate?",
      "How does the browser load a page and build the DOM?",
      "What makes a page accessible?",
    ],
    learningObjectives: [
      "Writes a page structured with semantic HTML and styled with CSS",
      "Adds a simple JavaScript function that responds to user interaction",
      "Audits a page for accessibility (alt text, contrast, keyboard use) and fixes it",
    ],
    commonMisconceptions: [
      "HTML is a programming language and controls appearance.",
      "JavaScript and Java are the same language.",
    ],
    links: {
      "art.elements": "emphasis, hierarchy and contrast in page design",
      "media.lit.production": "producing interactive content for science communication",
    },
  },
  "cs.algo.logic-gates": {
    title: "Logic gates and Boolean algebra",
    description: "AND, OR, NOT and XOR gates, truth tables, simplification with Boolean algebra, and building arithmetic circuits such as adders from gates.",
    whyItMatters: "It is the bridge between software and hardware: a computer's \"thinking\" ultimately reduces to gate circuits; Boolean algebra has the same structure as logic and set theory.",
    entryQuestions: [
      "Using only NAND gates, can you build a NOT, an AND and an OR gate? Try it, and assess the claim that a computer can be built from a single kind of gate.",
    ],
    coreQuestions: [
      "How do you go from a truth table to a Boolean expression and a circuit?",
      "How are De Morgan's laws used to simplify circuits?",
      "How do you build a circuit that adds two binary numbers?",
    ],
    learningObjectives: [
      "Writes a Boolean expression from a truth table and simplifies it algebraically",
      "Proves De Morgan's laws with a truth table",
      "Designs half and full adders from gates and extends them to multi-bit addition",
      "Tests a circuit in a simulator or in code",
    ],
    commonMisconceptions: [
      "XOR is the same as OR.",
      "Computer arithmetic needs special hardware separate from logic operations.",
    ],
    links: {
      "math.found.logic": "propositional logic and set operations have the same structure as Boolean algebra",
      "phys.em.circuits-dc": "gates are realised with transistor circuits",
      "neuro.comp.lif": "threshold neurons can behave like logic gates",
    },
  },
  "cs.proj.app": {
    title: "Project: Build a small application",
    description: "Developing a small application (command-line, web or data tool) that solves a real user's real problem, through requirements, design, implementation, testing and presentation.",
    whyItMatters: "It turns separately learned programming skills into a complete product that serves a user, and it creates concrete evidence for a portfolio and applications.",
    entryQuestions: [
      "Is there a task around you that repeats every week and is boring or error-prone? What would be the smallest useful version of a program that automates it?",
    ],
    coreQuestions: [
      "How do you turn a user's problem into measurable requirements?",
      "How do you keep the scope small and reach a working first version?",
      "How do you test that the application works correctly and is usable?",
    ],
    learningObjectives: [
      "Interviews a user and writes down requirements and success criteria",
      "Develops the application in small, tested steps under version control",
      "Tries the application with at least one real user and improves it with their feedback",
      "Documents the project with a README and a short demo",
    ],
    commonMisconceptions: [
      "A project should be designed with all its features from day one.",
      "If the code runs, the project is finished; documentation and tests are unnecessary.",
    ],
    competitionApplications: ["Software and app development competitions"],
    links: {
      "res.data.management": "documenting the project and making it reproducible",
      "write.compose.revision": "the draft–feedback–rewrite cycle also applies to software",
      "comp.research.science-fair": "presenting a software project at a competition",
    },
  },
};

export const UNITS_PROGRAMMING_PLUS: Record<string, string> = {
  "Bilgisayar bilimi": "Computer science",
  "Bilgisayar bilimi ilkeleri": "Computer science principles",
};
