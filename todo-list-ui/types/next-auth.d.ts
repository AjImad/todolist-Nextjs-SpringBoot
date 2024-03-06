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
        access_token?: string,
        refresh_token?: string,
        exp?: number
    }
}