import { rest } from "msw";

// Mock Data
export const posts = [
  {
    userId: 1,
    id: 1,
    title: "first post title",
    body: "first post body",
  },
  {
    userId: 2,
    id: 5,
    title: "second post title",
    body: "second post body",
  },
  {
    userId: 3,
    id: 6,
    title: "third post title",
    body: "third post body",
  },
];

const validMainTokens = ["mainToken", "newMainToken"];

// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers = [
  rest.get("http://localhost/posts", (req, res, ctx) => {
    const authorization = req.headers.get("authorization");
    if (authorization && validMainTokens.includes(authorization)) return res(ctx.status(200), ctx.json(posts));
    if (authorization === "errorToken") return res(ctx.status(500), ctx.json({ error: "Server error" }));
    return res(ctx.status(401), ctx.json({ error: "Invalid credentials" }));
  }),

  rest.post("http://localhost/login", async (req, res, ctx) => {
    const credentials = await req.json();
    if (credentials.client_id === "id" && credentials.client_secret === "secret") {
      return res(ctx.status(200), ctx.json({ main_token: "mainToken", refresh_token: "refreshToken" }));
    }
    return res(ctx.status(401), ctx.json({ error: "Invalid credentials" }));
  }),

  rest.post("http://localhost/refresh", async (req, res, ctx) => {
    const tokens = await req.json();
    if (tokens.refresh_token === "refreshToken") {
      return res(ctx.status(200), ctx.json({ main_token: "newMainToken", refresh_token: "newRefreshToken" }));
    }
    if (tokens.refresh_token === "invalidRefreshToken") {
      return res(ctx.status(200), ctx.json({ main_token: "invalidMainToken", refresh_token: "newRefreshToken" }));
    }
    if (tokens.refresh_token === "errorToken") return res(ctx.status(500), ctx.json({ error: "Server error" }));
    return res(ctx.status(401), ctx.json({ error: "Invalid credentials" }));
  }),
];
