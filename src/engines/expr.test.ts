import { describe, expect, it } from "vitest";
import { compareExpressions, evalNumber, evaluate, parse } from "./expr";

describe("expression engine", () => {
  it("parses implicit multiplication, unicode and functions", () => {
    expect(evaluate(parse("6t+2", ["t"]), { t: 2 })).toBe(14);
    expect(evaluate(parse("2(x+1)^2", ["x"]), { x: 1 })).toBe(8);
    expect(evaluate(parse("3·x² − 1", ["x"]), { x: 2 })).toBe(11);
    expect(evaluate(parse("√(16) + π", []), {})).toBeCloseTo(4 + Math.PI);
    expect(evaluate(parse("-2^2"))).toBe(-4);
    expect(evaluate(parse("2^3^2"))).toBe(512);
    expect(evaluate(parse("mgh", ["m", "g", "h"]), { m: 2, g: 3, h: 4 })).toBe(24);
    expect(() => parse("2+*3")).toThrow();
  });

  it("reads numeric answers with units", () => {
    expect(evalNumber("8.66 N")).toBeCloseTo(8.66);
    expect(evalNumber("-19.97 m/s")).toBeCloseTo(-19.97);
    expect(evalNumber("9,8")).toBeCloseTo(9.8);
    expect(evalNumber("1/4")).toBe(0.25);
    expect(evalNumber("3sqrt(2)")).toBeCloseTo(4.2426);
    expect(evalNumber("1.2e3")).toBe(1200);
    expect(evalNumber("abc")).toBeNull();
    expect(evalNumber("")).toBeNull();
  });

  it("compares expressions by sampling", () => {
    expect(compareExpressions("2*t+6*t-0+2-2*t", "6*t + 2", ["t"]).result).toBe("EQUAL");
    expect(compareExpressions("x tan(th) - g x^2/(2 v^2 cos(th)^2)", "x*tan(th) - g*x^2/(2*v^2*cos(th)^2)", ["x", "v", "th", "g"]).result).toBe("EQUAL");
    expect(compareExpressions("-(6t+2)", "6*t + 2", ["t"]).result).toBe("SIGN");
    const f = compareExpressions("2*m1*m2*g/(m1+m2)/2", "2*m1*m2*g/(m1+m2)", ["m1", "m2", "g"]);
    expect(f.result).toBe("FACTOR");
    expect(f.factor).toBeCloseTo(0.5);
    expect(compareExpressions("6t", "6*t + 2", ["t"]).result).toBe("DIFFERENT");
    expect(compareExpressions("6t +", "6*t + 2", ["t"]).result).toBe("INVALID");
    expect(compareExpressions("2 sin(th) cos(th) v^2/g", "v^2*sin(2*th)/g", ["v", "th", "g"]).result).toBe("EQUAL");
  });
});
