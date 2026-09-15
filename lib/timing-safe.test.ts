import { describe, it, expect } from "vitest";
import { timingSafeStringEqual } from "./timing-safe";

describe("timingSafeStringEqual", () => {
  it("returns true for identical strings", () => {
    expect(timingSafeStringEqual("secret-token", "secret-token")).toBe(true);
  });

  it("returns false for different strings of the same length", () => {
    expect(timingSafeStringEqual("secret-token", "secret-tokeX")).toBe(false);
  });

  it("returns false for strings of different length, without throwing", () => {
    expect(() => timingSafeStringEqual("short", "a-much-longer-string")).not.toThrow();
    expect(timingSafeStringEqual("short", "a-much-longer-string")).toBe(false);
  });

  it("returns false when compared against an empty string", () => {
    expect(timingSafeStringEqual("", "")).toBe(true);
    expect(timingSafeStringEqual("non-empty", "")).toBe(false);
  });
});
