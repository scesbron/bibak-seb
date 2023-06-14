export const bibakFetch = async (path: string, init?: RequestInit): Promise<Response> => {
  return fetch(import.meta.env.VITE_API_URL + path, init);
};

export const login = async (clientId: string, clientSecret: string) => {
  return fetch("/login", {
    method: "post",
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
  });
};
