import { beforeEach, describe, expect, it } from "vitest";
import { bibakFetch, bibakLogin, bibakRefresh, TOKENS_KEY } from "./requester.ts";

const getTokens = (main_token: string, refresh_token: string) => JSON.stringify({ main_token, refresh_token });

const setTokens = (main_token: string, refresh_token: string) => {
  localStorage.setItem(TOKENS_KEY, getTokens(main_token, refresh_token));
};

describe("requester", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("fetch", () => {
    it("succeeds when we have the correct authorization token", async () => {
      setTokens("mainToken", "refreshToken");
      const response = await bibakFetch("/posts");
      expect(response.ok).toBe(true);
    });

    it("returns the error if it is not a 401 error", async () => {
      setTokens("errorToken", "refreshToken");
      const response = await bibakFetch("/posts");
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it("returns a valid response if the main token is invalid but the refresh token is valid", async () => {
      setTokens("expiredToken", "refreshToken");
      const response = await bibakFetch("/posts");
      expect(response.ok).toBe(true);
    });

    it("clear the storage and throws an authentication error if the call with the refreshed token returns a 401 error", async () => {
      setTokens("expiredToken", "invalidRefreshToken");
      await expect(() => bibakFetch("/posts")).rejects.toThrowError(/unauthenticated/);
      expect(localStorage.getItem(TOKENS_KEY)).toBeNull();
    });

    it("clear the storage and throws an authentication error if the refresh call returns a 401 error", async () => {
      setTokens("expiredToken", "expiredRefreshToken");
      await expect(() => bibakFetch("/posts")).rejects.toThrowError(/unauthenticated/);
      expect(localStorage.getItem(TOKENS_KEY)).toBeNull();
    });

    it("clear the storage and throws an authentication error if the refresh call returns a 500 error", async () => {
      setTokens("expiredToken", "errorToken");
      await expect(() => bibakFetch("/posts")).rejects.toThrowError(/unauthenticated/);
      expect(localStorage.getItem(TOKENS_KEY)).toBeNull();
    });
  });

  describe("login", () => {
    it("returns the main token and refresh token if id and secret are ok", async () => {
      expect(localStorage.getItem(TOKENS_KEY)).toBeNull();
      await bibakLogin("id", "secret");
      expect(localStorage.getItem(TOKENS_KEY)).toEqual(getTokens("mainToken", "refreshToken"));
    });

    it("throws an AuthenticationError if the id and secret are invalid", async () => {
      await expect(() => bibakLogin("id", "badsecret")).rejects.toThrowError(/unauthenticated/);
    });
  });

  describe("refresh", () => {
    it("update tokens if we have a valid refresh token in the local storage", async () => {
      setTokens("mainToken", "refreshToken");
      await bibakRefresh();
      expect(localStorage.getItem(TOKENS_KEY)).toEqual(getTokens("newMainToken", "newRefreshToken"));
    });

    it("throws an AuthenticationError if refresh token is invalid", async () => {
      await expect(() => bibakRefresh()).rejects.toThrowError(/unauthenticated/);
    });

    it("throws an unknown error if the call returns a 500 error", async () => {
      setTokens("mainToken", "errorToken");
      await expect(() => bibakRefresh()).rejects.toThrowError("unknown error");
    });
  });
});
