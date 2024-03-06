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
          const res = await fetch(
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
          if(res.ok){
            const user = await res.json();
            console.log("user: ", user);
            if(user?.token){
              return user;
            }      
          }
          // If response is not ok or does not contain a user token
          const errorResponse = await res.json();
          return Promise.reject(new Error(errorResponse?.detail));
          // throw new Error(errorResponse?.detail);
       
        } catch (e: any) {
          // throw new Error(e?.message);
          return Promise.reject(new Error(e?.message));
        }
      },
    }),
  ],
  callbacks: {
    async jwt ({token, user}){
      if(Date.now() > (token.exp as number)){
        // Token has expired, remove token
        return {...token, userAuthenticated: false, exp: 0};
      }
      return {...token};
    },
    async session({session, token, user}){
      session.user = token as any;
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
});

export { handler as GET, handler as POST };
