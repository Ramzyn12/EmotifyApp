import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token) {
  console.log("Attempting to refresh access token"); // Added log
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", token.refreshToken);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    body: params,
  });

  if (!response.ok) {
    console.error("Failed to refresh access token", response);
    throw new Error("Token refresh failed");
  }

  const data = await response.json();

  console.log("Refresh token response data:", data); // Log the response data

  if (!data.access_token || !data.expires_in) {
    console.error(
      "Refresh token response data is missing required fields",
      data
    );
    throw new Error("Token refresh response is missing required fields");
  }

  const newToken = {
    ...token,
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? token.refreshToken,
    accessTokenExpires: Date.now() + data.expires_in * 1000,
  };
  console.log("Newly refreshed token:", newToken); // Added log
  return newToken;
}

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-currently-playing",
  "user-top-read"
].join(",")

const params = {
  scope: scopes,
  show_dialog: "true" 
}

const LOGIN_URL = "https://accounts.spotify.com/authorize?" + new URLSearchParams(params).toString()

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
        return token;
      }

      //access token not expired
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires * 1000
      ) {
        return token;
      }

      //access token expired

      return await refreshAccessToken(token);
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
