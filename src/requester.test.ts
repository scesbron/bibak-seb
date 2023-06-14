import { describe, expect, it } from "vitest";
import { bibakFetch } from "./requester.ts";

describe("requester", () => {
  describe("fetch", () => {
    it("returns todo when we call fetch", async () => {
      const response = await bibakFetch("/posts");
      expect(response.ok).toBe(true);
    });
  });
});
