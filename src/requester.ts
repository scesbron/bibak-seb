// We export this key for test purpose
export const TOKENS_KEY = "tokens";

export class AuthenticationError extends Error {
  constructor() {
    super("unauthenticated");
  }
}

// PRIVATE FUNCTIONS
// ~~~~~~~~~~~~~~~~~

const getTokens = () => {
  const storedItem = localStorage.getItem(TOKENS_KEY);
  return storedItem ? JSON.parse(storedItem) : undefined;
};

const setTokens = (tokens: Tokens) => localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));

const handleTokenResponse = async (response: Response) => {
  if (response.ok) {
    const tokens = await response.json();
    setTokens(tokens);
  } else if (response.status === 401) {
    throw new AuthenticationError();
  } else {
    throw Error("unknown error");
  }
};

const getUrl = (path: string) => import.meta.env.VITE_API_URL + path;

const addAuthorizationHeader = (init?: RequestInit) => {
  return {
    ...init,
    headers: {
      ...init?.headers,
      authorization: getTokens()?.main_token,
    },
  };
};

// PUBLIC FUNCTIONS
// ~~~~~~~~~~~~~~~~

export const bibakFetch = async (path: string, init?: RequestInit): Promise<Response> => {
  const response = await fetch(getUrl(path), addAuthorizationHeader(init));
  if (response.status === 401) {
    try {
      await bibakRefresh();
    } catch (error) {
      localStorage.removeItem(TOKENS_KEY);
      throw new AuthenticationError();
    }
    const newResponse = await fetch(getUrl(path), addAuthorizationHeader(init));
    if (newResponse.status === 401) {
      localStorage.removeItem(TOKENS_KEY);
      throw new AuthenticationError();
    }
    return newResponse;
  } else {
    return response;
  }
};

type Tokens = {
  main_token: string;
  refresh_token: string;
};
export const bibakLogin = async (clientId: string, clientSecret: string) => {
  const response = await fetch(getUrl("/login"), {
    method: "post",
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
  });
  await handleTokenResponse(response);
};

export const bibakRefresh = async () => {
  const response = await fetch(getUrl("/refresh"), {
    method: "post",
    body: JSON.stringify({ refresh_token: getTokens()?.refresh_token }),
  });
  await handleTokenResponse(response);
};
