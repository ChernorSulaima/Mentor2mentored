import axios from "axios"

// Vite automatically sets import.meta.env.MODE to 'development' or 'production'
const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000/api' : '/api'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies with requests
})