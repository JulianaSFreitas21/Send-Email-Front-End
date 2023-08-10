import axios from "axios";

export const api = axios.create({
    baseURL:'https://send-email-backend.vercel.app'
})