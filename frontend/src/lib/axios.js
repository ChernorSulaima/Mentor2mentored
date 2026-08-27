import axios from "axios"

// In development: use local backend
// In production: use VITE_API_URL (set on Vercel dashboard pointing to your Render backend)
const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000/api'
  : import.meta.env.VITE_API_URL || '/api'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies with requests
})