// tests/api/spotify.api.spec.js
import { test, expect, request } from "@playwright/test";
import { getAccessToken, getInvalidToken } from "./helpers/auth";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

let validToken;

async function createApiContext(token) {
  return await request.newContext({
    extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

test.describe("Spotify API", () => {
  test.beforeAll(async () => {
    validToken = await getAccessToken();
    expect(validToken).toBeTruthy();
  });

  test.describe("Cenários de Token", () => {
    test("Deve retornar dados de artista com token válido", async () => {
      const apiContext = await createApiContext(validToken);

      const response = await apiContext.get(`${SPOTIFY_BASE_URL}/artists/1vCWHaC5f2uS3yhpwWbIA6`); // Avicii
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.name).toBe("Avicii");
    });

    test("Deve retornar 401 ao usar token inválido", async () => {
      const invalidToken = getInvalidToken();
      const apiContext = await createApiContext(invalidToken);

      const response = await apiContext.get(`${SPOTIFY_BASE_URL}/artists/1vCWHaC5f2uS3yhpwWbIA6`);
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.error).toBeDefined();
    });

    test("Deve retornar 401 ao chamar endpoint sem token", async () => {
      const apiContext = await createApiContext();

      const response = await apiContext.get(`${SPOTIFY_BASE_URL}/artists/1vCWHaC5f2uS3yhpwWbIA6`);
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.error).toBeDefined();
    });
  });

  test.describe("Funcionalidades de Busca", () => {
    test("Deve buscar uma música específica pelo nome", async () => {
      const apiContext = await createApiContext(validToken);

      const response = await apiContext.get(`${SPOTIFY_BASE_URL}/search`, {
        params: { q: "Bohemian Rhapsody", type: "track", limit: 1 },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.tracks.items.length).toBeGreaterThan(0);
      expect(body.tracks.items[0].name).toContain("Bohemian Rhapsody");
    });

    test("Deve retornar álbuns do artista Imagine Dragons", async () => {
      const token = await getAccessToken();
    
      const apiContext = await request.newContext({
        extraHTTPHeaders: { Authorization: `Bearer ${token}` },
      });
    
      // Imagine Dragons
      const response = await apiContext.get(
        `${SPOTIFY_BASE_URL}/artists/53XhwfbYqKCa1cC15pYq2q/albums`,
        { params: { limit: 5 } }
      );
    
      expect(response.status()).toBe(200);
    
      const body = await response.json();
      expect(body.items.length).toBeGreaterThan(0);
    
      console.log("Álbuns do Imagine Dragons:", body.items.map(a => a.name));
    });
    
  });
});
