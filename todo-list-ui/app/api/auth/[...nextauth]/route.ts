import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
          const response = await fetch(
            "http://localhost:8080/api/auth/authenticate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                password: password,
              }),
            }
          );
          const user = await response.json();

          console.log("user: ", { user });
          if (user) {
            return user;
          } else {
            console.log("user: ", { user });
            return null;
          }
        } catch (e) {
          console.log("error from route.ts: ", e);
          return e;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
});

export { handler as GET, handler as POST };
