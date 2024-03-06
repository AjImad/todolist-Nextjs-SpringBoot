"use client";


import axios from "@/lib/axios";
import { signIn, useSession, signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";


export const useRefreshToken = () => {
    const {data: session} = useSession();
    const router = useRouter();
    const refreshToken = async () => {
        try{
            const res = await axios.post("/auth/refresh-token", null, {
                headers: {
                    Authorization: `Bearer ${session?.user?.refresh_token}`
                }
            })
            if(session?.user){
                session.user.access_token = res.data.access_token;
            } else signOut();
        } catch(error: any){
            throw new Error(error?.response?.data.message);
        }
    }
    return refreshToken;
}