import { google } from "googleapis";

// Server-only. Reuses the same OAuth client/refresh token as the AIOS
// workspace's google-workspace MCP (calendar + gmail.send scopes already granted).
export function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return client;
}
