import dotenv from "dotenv";
dotenv.config();

export async function getAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
    if (!clientId || !clientSecret) {
      throw new Error("⚠️ Defina SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET no arquivo .env");
    }
  
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(`Erro ao obter token: ${JSON.stringify(data)}`);
    }
  
    return data.access_token;

    
  }
 
export function getInvalidToken() {
    // Retorna um token aleatório/falso apenas para teste
    return "INVALID_TOKEN";
  }
  