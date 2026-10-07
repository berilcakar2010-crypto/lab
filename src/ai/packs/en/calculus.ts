import type { CurriculumSpec } from "../../../engines/curriculumSpec";
import { expr, mc, num, open } from "../helpers";

/** Built-in, hand-written pack: single-variable Calculus 1. */
export const calculusPackEn: CurriculumSpec = {
  title: "Calculus 1",
  subject: "Mathematics",
  goal: "Understand and use limits, derivatives and integrals to model and solve problems of change and accumulation.",
  description: "Limits → derivatives (rules, meaning, applications) and a parallel route into integration, joined by the Fundamental Theorem.",
  units: [
    {
      title: "Limits",
      summary: "What a function approaches, and why that matters.",
      topics: [
        {
          title: "The idea of a limit",
          milestones: [
            {
              key: "lim1", type: "CONCEPT", difficulty: 1, estimatedMinutes: 10,
              title: "Estimate a limit from a graph and a table",
              learningObjective: "Explain what lim f(x) means and estimate it from numerical or graphical evidence, even where f is undefined.",
              interaction: "GRAPH_INTERPRETATION",
              questions: [
                { kind: "GRAPH_INTERPRETATION", purpose: "MASTERY", prompt: "The graph shows f(x) = (x² − 1)/(x − 1), which is undefined at x = 1. What is lim f(x) as x → 1?",
                  graph: { expression: "(x^2-1)/(x-1)", xMin: -1, xMax: 3, xLabel: "x", yLabel: "f(x)" }, numeric: { value: 2, tolerance: 0.01 },
                  hints: ["Look at the values close to x = 1 from both sides.", "The hole does not matter; the trend does.", "Factor the numerator.", "(x−1)(x+1)/(x−1) = x + 1 → 2."], solution: "f(x) = x + 1 for x ≠ 1, so the limit is 2." },
                mc("MASTERY", "Which statement best describes lim f(x) = L as x → a?",
                  ["f(x) can be made as close to L as we like by taking x close enough to a (x ≠ a)", "f(a) = L", "f(x) reaches L at some x near a", "L is the largest value of f near a"], 0,
                  ["Does the definition need f(a) to exist?", "It is about behaviour near a, not at a.", "Closeness, not equality.", "First option."], "Limits describe approach, not the value at a."),
                num("RETENTION", "Estimate lim (sin x)/x as x → 0.", 1, undefined,
                  ["Try x = 0.1, 0.01.", "sin(0.01)/0.01 ≈ 0.99998.", "The values approach…", "1."], "The limit is 1."),
                num("TRANSFER", "A tank's volume is V(t) = (t² − 4)/(t − 2) litres for t ≠ 2. What value should V(2) be given so the function is continuous?", 4, "L",
                  ["Continuity requires V(2) = lim V(t).", "Factor the numerator.", "(t − 2)(t + 2)/(t − 2).", "t + 2 at t = 2."], "V(2) = 4."),
              ],
            },
            {
              key: "lim2", type: "PRACTICE", difficulty: 2, estimatedMinutes: 15, prerequisites: ["lim1"],
              title: "Compute limits algebraically",
              learningObjective: "Use factoring, rationalising and dominant-term reasoning to evaluate limits, including at infinity.",
              questions: [
                num("MASTERY", "lim (x² − 9)/(x − 3) as x → 3", 6, undefined,
                  ["Direct substitution gives 0/0.", "Factor the numerator.", "(x − 3)(x + 3).", "x + 3 → 6."], "6."),
                num("MASTERY", "lim (3x² + 2)/(x² − 5x) as x → ∞", 3, undefined,
                  ["Compare the highest powers.", "Divide top and bottom by x².", "(3 + 2/x²)/(1 − 5/x).", "→ 3/1."], "3."),
                num("MASTERY", "lim (√(x + 4) − 2)/x as x → 0", 0.25, undefined,
                  ["0/0 with a root: rationalise.", "Multiply by (√(x+4) + 2).", "x / (x(√(x+4) + 2)).", "1/4."], "1/4."),
                num("RETENTION", "lim (x² − 4x)/(x − 4) as x → 4", 4, undefined,
                  ["Factor x.", "x(x − 4)/(x − 4).", "x → 4.", "4."], "4."),
                num("TRANSFER", "A drug concentration is C(t) = 8t/(2t + 1) mg/L. What value does it approach in the long run?", 4, "mg/L",
                  ["Long run means t → ∞.", "Dominant terms.", "8t/2t.", "4."], "C → 4 mg/L."),
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Derivatives",
      summary: "Instantaneous rate of change.",
      topics: [
        {
          title: "Meaning and rules",
          milestones: [
            {
              key: "d1", type: "CONCEPT", difficulty: 2, estimatedMinutes: 15, prerequisites: ["lim2"],
              title: "Interpret the derivative as a limit of slopes",
              learningObjective: "Compute f'(a) from the limit definition and interpret it as a tangent slope and an instantaneous rate.",
              questions: [
                num("MASTERY", "Using the definition, f(x) = x². What is f'(3)?", 6, undefined,
                  ["f'(a) = lim [f(a+h) − f(a)]/h.", "(9 + 6h + h² − 9)/h.", "6 + h.", "h → 0."], "6."),
                open("CONCEPT_EXPLANATION", "MASTERY", "Explain in your own words why the derivative is defined as a limit, not just a difference quotient.",
                  ["secant slope over an interval", "shrinking the interval h → 0", "gives slope at a single point / instantaneous rate"],
                  ["What does (f(a+h) − f(a))/h measure?", "It is an average over an interval.", "We want the rate at one instant.", "Let the interval shrink."], "The difference quotient is an average rate; the limit as h → 0 turns it into the instantaneous rate (tangent slope)."),
                num("RETENTION", "f(x) = 3x. f'(5)?", 3, undefined, ["Linear function.", "Slope constant.", "3.", "3."], "3."),
                num("TRANSFER", "The position of a particle is s(t) = t² + t metres. Using the definition, what is its velocity at t = 2 s?", 5, "m/s",
                  ["Velocity is the derivative of position.", "[(2+h)² + (2+h) − 6]/h.", "(5h + h²)/h.", "5."], "5 m/s."),
              ],
            },
            {
              key: "d2", type: "PRACTICE", difficulty: 2, estimatedMinutes: 15, prerequisites: ["d1"],
              title: "Differentiate with the power, sum and constant rules",
              learningObjective: "Differentiate polynomials and power functions fluently.",
              questions: [
                expr("MASTERY", "d/dx [4x³ − 5x + 7]", ["12*x^2 - 5"], ["x"],
                  ["Differentiate term by term.", "Power rule: n·xⁿ⁻¹.", "Constants vanish.", "12x² − 5."], "12x² − 5."),
                expr("MASTERY", "d/dx [√x + 1/x]", ["1/(2*sqrt(x)) - 1/x^2"], ["x"],
                  ["Rewrite as powers.", "x^(1/2) + x^(−1).", "Apply the power rule.", "½x^(−1/2) − x^(−2)."], "1/(2√x) − 1/x²."),
                expr("RETENTION", "d/dx [x⁵ + 2x²]", ["5*x^4 + 4*x"], ["x"], ["Power rule.", "5x⁴ …", "+ 4x.", "5x⁴ + 4x."], "5x⁴ + 4x."),
                num("TRANSFER", "The cost of producing q items is C(q) = 0.02q² + 3q + 500. What is the marginal cost C'(q) at q = 100?", 7, undefined,
                  ["Marginal cost is the derivative.", "C'(q) = 0.04q + 3.", "Substitute 100.", "7."], "7 per item."),
              ],
            },
            {
              key: "d3", type: "PRACTICE", difficulty: 3, estimatedMinutes: 20, prerequisites: ["d2"],
              title: "Apply the product, quotient and chain rules",
              learningObjective: "Decompose a function's structure and choose the correct rule (or combination).",
              questions: [
                expr("MASTERY", "d/dx [sin(3x²)]", ["6*x*cos(3*x^2)"], ["x"],
                  ["Outer function sin, inner 3x².", "Chain rule: outer' (inner) · inner'.", "cos(3x²) · 6x.", "6x cos(3x²)."], "6x·cos(3x²)."),
                expr("MASTERY", "d/dx [x² · e^x]", ["2*x*exp(x) + x^2*exp(x)"], ["x"],
                  ["Product of two functions.", "(uv)' = u'v + uv'.", "u = x², v = eˣ.", "2x eˣ + x² eˣ."], "eˣ(2x + x²)."),
                expr("RETENTION", "d/dx [(2x + 1)^5]", ["10*(2*x+1)^4"], ["x"], ["Chain rule.", "5(2x+1)⁴ · 2.", "10(2x+1)⁴.", "Done."], "10(2x + 1)⁴."),
                expr("TRANSFER", "A balloon's radius grows as r(t) = 1 + 0.5t. Volume V = (4/3)π r³. Write dV/dt in terms of t.",
                  ["2*pi*(1+0.5*t)^2"], ["t"],
                  ["V depends on t through r.", "dV/dt = dV/dr · dr/dt.", "4πr² · 0.5.", "2π(1 + 0.5t)²."], "dV/dt = 2π(1 + 0.5t)²."),
              ],
            },
            {
              key: "d4", type: "CONCEPT", difficulty: 2, estimatedMinutes: 12, prerequisites: ["d2"],
              title: "Read f' from the graph of f",
              learningObjective: "Connect increasing/decreasing, extrema and concavity of f to the sign and behaviour of f'.",
              interaction: "GRAPH_INTERPRETATION",
              questions: [
                { kind: "GRAPH_INTERPRETATION", purpose: "MASTERY", prompt: "The graph shows f(x) = x³ − 3x. On which interval is f'(x) < 0?",
                  graph: { expression: "x^3 - 3*x", xMin: -2.5, xMax: 2.5 }, choices: ["−1 < x < 1", "x < −1", "x > 1", "everywhere"], correctChoice: 0,
                  hints: ["f' < 0 where f decreases.", "Find where the curve goes downhill.", "Between the two turning points.", "f'(x) = 3x² − 3 < 0 for |x| < 1."], solution: "f decreases on (−1, 1)." },
                { kind: "GRAPH_INTERPRETATION", purpose: "MASTERY", prompt: "For the same f(x) = x³ − 3x, at what positive x does f have a local minimum?",
                  graph: { expression: "x^3 - 3*x", xMin: -2.5, xMax: 2.5 }, numeric: { value: 1, tolerance: 0.03 },
                  hints: ["Local minimum: f' changes from − to +.", "Turning points where f' = 0.", "3x² − 3 = 0.", "x = 1."], solution: "x = 1." },
                mc("TRANSFER", "A company's profit P(t) is increasing but the rate of increase is slowing. What is true?",
                  ["P' > 0 and P'' < 0", "P' < 0 and P'' > 0", "P' > 0 and P'' > 0", "P' = 0"], 0,
                  ["Increasing ⇒ sign of P'.", "Slowing ⇒ P' is decreasing.", "P' decreasing ⇒ P'' < 0.", "First option."], "Increasing (P' > 0), concave down (P'' < 0)."),
              ],
            },
          ],
        },
        {
          title: "Applications",
          milestones: [
            {
              key: "d5", type: "APPLICATION", difficulty: 3, estimatedMinutes: 30, prerequisites: ["d3", "d4"],
              title: "Solve optimisation problems",
              learningObjective: "Translate a word problem into a function on a domain, find critical points, and justify the optimum.",
              interaction: "PROBLEM_SOLVING",
              questions: [
                num("MASTERY", "A rectangle has perimeter 40 m. What is its maximum possible area (m²)?", 100, "m²",
                  ["Write area in one variable.", "w = 20 − l, A = l(20 − l).", "A'(l) = 20 − 2l = 0.", "l = 10, A = 100."], "A_max = 100 m² (a square)."),
                num("MASTERY", "An open box is made from a 12 × 12 cm sheet by cutting squares of side x from the corners. Which x (cm) maximises the volume?", 2, "cm",
                  ["V(x) = x(12 − 2x)².", "Differentiate: V' = (12 − 2x)(12 − 6x).", "Critical points x = 6 or x = 2.", "x = 6 gives zero volume."], "x = 2 cm."),
                num("TRANSFER", "A farmer fences a rectangular field along a river (no fence on the river side) with 600 m of fence. Maximum area (m²)?", 45000, "m²",
                  ["Only three sides need fence.", "2w + l = 600.", "A = w(600 − 2w).", "w = 150, l = 300."], "45 000 m²."),
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Integrals",
      summary: "Accumulation — reachable from limits, completed with the Fundamental Theorem.",
      topics: [
        {
          title: "Accumulation",
          milestones: [
            {
              key: "i1", type: "CONCEPT", difficulty: 2, estimatedMinutes: 15, prerequisites: ["lim2"],
              title: "Interpret a definite integral as accumulated area",
              learningObjective: "Approximate accumulation with Riemann sums and interpret signed area.",
              questions: [
                num("MASTERY", "Using a left Riemann sum with 4 equal intervals, approximate ∫₀⁴ x dx.", 6, undefined,
                  ["Interval width 1.", "Left endpoints: 0, 1, 2, 3.", "Sum f values × width.", "0 + 1 + 2 + 3."], "6 (the exact value is 8)."),
                mc("MASTERY", "A velocity graph is negative on [0, 2] and positive on [2, 5]. ∫₀⁵ v dt represents…",
                  ["Net displacement", "Total distance travelled", "Average velocity", "Final velocity"], 0,
                  ["Signed area.", "Negative parts subtract.", "That is net change in position.", "Displacement."], "Net displacement."),
                num("TRANSFER", "Water flows into a tank at a constant 3 L/min for 10 min, then at 5 L/min for 4 min. Total volume added (L)?", 50, "L",
                  ["Accumulation = rate × time per piece.", "30 + 20.", "Area under the rate graph.", "50."], "50 L."),
              ],
            },
            {
              key: "i2", type: "PRACTICE", difficulty: 3, estimatedMinutes: 20, prerequisites: ["i1", "d2"],
              title: "Evaluate integrals with the Fundamental Theorem",
              learningObjective: "Find antiderivatives and use F(b) − F(a) to evaluate definite integrals.",
              questions: [
                num("MASTERY", "∫₀² (3x² + 1) dx", 10, undefined,
                  ["Find an antiderivative.", "x³ + x.", "Evaluate at 2 and 0.", "8 + 2 − 0."], "10."),
                num("MASTERY", "∫₁^e (1/x) dx", 1, undefined, ["Antiderivative of 1/x.", "ln|x|.", "ln e − ln 1.", "1."], "1."),
                num("RETENTION", "∫₀³ 2x dx", 9, undefined, ["x².", "9 − 0.", "9.", "9."], "9."),
                num("TRANSFER", "A particle's velocity is v(t) = 6t − t² m/s. How far does it travel between t = 0 and t = 6 s?", 36, "m",
                  ["v ≥ 0 on [0, 6], so distance = ∫v dt.", "Antiderivative 3t² − t³/3.", "At 6: 108 − 72.", "36."], "36 m."),
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Synthesis",
      topics: [
        {
          title: "Review and challenge",
          milestones: [
            {
              key: "rev", type: "REVIEW", difficulty: 2, estimatedMinutes: 10, prerequisites: ["d2", "i1"],
              title: "Review: rate or accumulation?",
              learningObjective: "Decide from a problem's wording whether it asks for a derivative (rate) or an integral (accumulation).",
              questions: [
                mc("MASTERY", "\"How much total rainfall fell between 2 pm and 5 pm, given the rainfall rate?\" This needs…",
                  ["An integral of the rate", "A derivative of the rate", "The rate at 5 pm", "A limit at infinity"], 0,
                  ["Is the question about a rate or a total?", "Total from a rate = accumulation.", "Accumulation is an integral.", "First option."], "A total from a rate is an integral."),
                mc("MASTERY", "\"How fast is the temperature changing at noon, given T(t)?\" This needs…",
                  ["T'(12)", "∫ T dt", "T(12)", "lim T(t) as t → ∞"], 0,
                  ["Rate at one instant.", "Instantaneous rate = derivative.", "Evaluate at noon.", "T'(12)."], "An instantaneous rate is a derivative."),
              ],
            },
            {
              key: "mvt", type: "CHALLENGE", difficulty: 4, estimatedMinutes: 40, optional: true, prerequisites: ["d4"],
              title: "Challenge: prove a consequence of the Mean Value Theorem",
              learningObjective: "Write a rigorous proof that a function with zero derivative on an interval is constant.",
              interaction: "PROOF",
              questions: [
                open("PROOF", "MASTERY", "Prove: if f is differentiable on (a, b), continuous on [a, b], and f'(x) = 0 for all x in (a, b), then f is constant on [a, b].",
                  ["Takes arbitrary x₁ < x₂ in [a, b]", "Checks the MVT hypotheses on [x₁, x₂]", "Applies MVT: f(x₂) − f(x₁) = f'(c)(x₂ − x₁)", "Concludes f(x₂) = f(x₁) because f'(c) = 0, hence constant"],
                  ["You need to compare two arbitrary values of f.", "Which theorem links values of f to f'?", "Apply the Mean Value Theorem on [x₁, x₂].", "f(x₂) − f(x₁) = f'(c)(x₂ − x₁) and f'(c) = 0."],
                  "For any x₁ < x₂ in [a, b], f is continuous on [x₁, x₂] and differentiable on (x₁, x₂). By the MVT there is c with f(x₂) − f(x₁) = f'(c)(x₂ − x₁) = 0. So all values are equal: f is constant."),
              ],
            },
          ],
        },
        {
          title: "Boss",
          milestones: [
            {
              key: "boss", type: "BOSS", difficulty: 5, estimatedMinutes: 60, prerequisites: ["d5", "i2"],
              title: "Boss: related rates and accumulation",
              learningObjective: "Model a changing system using derivatives and integrals together, in a context you have not seen.",
              requiredCorrect: 2,
              questions: [
                num("MASTERY", "A 5 m ladder slides down a wall. When its base is 3 m from the wall, the base moves away at 0.4 m/s. How fast (m/s) is the top sliding down?", 0.3, "m/s",
                  ["x² + y² = 25.", "Differentiate: 2x x' + 2y y' = 0.", "At x = 3, y = 4.", "y' = −(3·0.4)/4."], "The top slides down at 0.3 m/s."),
                num("MASTERY", "Water leaks from a tank at r(t) = 2e^(−0.5t) L/min. How much leaks in the first 4 minutes?", 3.459, "L",
                  ["Total = ∫₀⁴ r dt.", "Antiderivative −4e^(−0.5t).", "−4e^(−2) + 4.", "4(1 − e^(−2))."], "4(1 − e⁻²) ≈ 3.46 L."),
                num("TRANSFER", "A cone-shaped funnel (radius = height) drains so that dV/dt = −2 cm³/s. How fast is the height falling when h = 4 cm? (V = πh³/3)", 0.0398, "cm/s",
                  ["V = πh³/3.", "dV/dt = πh² dh/dt.", "−2 = 16π dh/dt.", "dh/dt = −1/(8π)."], "|dh/dt| = 1/(8π) ≈ 0.040 cm/s."),
              ],
            },
          ],
        },
      ],
    },
  ],
};
