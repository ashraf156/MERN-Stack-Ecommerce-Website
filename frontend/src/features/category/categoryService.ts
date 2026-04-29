import axios from "axios"
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types"

const API_URL = "http://localhost:3000/categories"

export const categoryService = {
  getCategories: async () => {
    const response = await axios.get<Category[]>(API_URL)
    return response.data
  },
  getCategory: async (id: string) => {
    const response = await axios.get<Category>(`${API_URL}/${id}`)
    return response.data
  },
  createCategory: async (category: CreateCategoryRequest) => {
    const response = await axios.post<Category>(API_URL, category)
    return response.data
  },
  updateCategory: async (id: string, category: UpdateCategoryRequest) => {
    const response = await axios.patch<Category>(`${API_URL}/${id}`, category)
    return response.data
  },
  deleteCategory: async (id: string) => {
    await axios.delete(`${API_URL}/${id}`)
  },
}
