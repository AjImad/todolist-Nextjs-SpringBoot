"use client"
import { signOut, useSession } from "next-auth/react";
import { axiosAuth } from "../axios";
import { useRefreshToken } from "./useRefreshToken";

const useAxiosAuth = () => {
    const {data: session} = useSession();
    const refreshToken = useRefreshToken();

    axiosAuth.interceptors.request.use(
        async (config: any) => {
            try{
                const token = session?.user?.access_token;
                if(token){
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch(error){
            }
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    axiosAuth.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const prevRequest = error?.config;
            if(error?.response?.status === 403 && !prevRequest?.sent){
                prevRequest.sent = true;
                try{
                    await refreshToken();
                } catch(error){
                    signOut();
                }
                prevRequest.headers["Authorization"] = `Bearer ${session?.user?.access_token}`;
                return axiosAuth(prevRequest);
            }
            return Promise.reject(error);
        }
    );
    return axiosAuth;
};

export default useAxiosAuth;
