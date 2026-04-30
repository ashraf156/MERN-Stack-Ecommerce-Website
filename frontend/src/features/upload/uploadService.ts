import axios from "axios"

const API_URL = "http://localhost:5000/api/upload"

export const uploadService = {
  uploadFile: async (file: File, token?: string) => {
    const formData = new FormData()
    formData.append("file", file)

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers,
    })
    return response.data
  },
  destroyFile: async (public_id: string, token?: string) => {
    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    const response = await axios.post(
      `${API_URL}/destroy`,
      { public_id },
      { headers },
    )
    return response.data
  },
}
