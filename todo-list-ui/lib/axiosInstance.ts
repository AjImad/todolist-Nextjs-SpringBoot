"use client"
import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
});

axiosInstance.interceptors.request.use(
    async (config) => {
        try{
            const session = await getSession();
            const token = session?.user?.token;

            if(token){
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch(error){
            console.log("Error fetching session: ", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;