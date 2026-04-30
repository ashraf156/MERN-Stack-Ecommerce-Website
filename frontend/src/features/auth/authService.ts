import axios from "axios"

const API_URL = "http://localhost:5000/api/users"

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password })
    return response.data
  },
  register: async (name: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    })
    return response.data
  },
  logout: async () => {
    const response = await axios.post(`${API_URL}/logout`)
    return response.data
  },
  getUser: async (token: string) => {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
}
