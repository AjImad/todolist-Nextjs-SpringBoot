import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session{
        refreshTokenExpires?: number,
        accessTokenExpires?: string,
        refreshToken?: string,
        error?: string,
        user?: User
    }

    interface User {
        id?: number,
        firstname?: string,
        lastname?: string,
        email?: string,
        token?: string,
        exp?: number
    }
}