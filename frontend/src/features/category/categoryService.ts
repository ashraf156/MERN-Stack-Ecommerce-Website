import axios from "axios"
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types"

const API_URL = "http://localhost:5000/api/category"

export const categoryService = {
  getCategories: async () => {
    const response = await axios.get<Category[]>(`${API_URL}/getAll`)
    return response.data
  },
  getCategory: async (id: string) => {
    const response = await axios.get<Category>(`${API_URL}/get/${id}`)
    return response.data
  },
  createCategory: async (category: CreateCategoryRequest) => {
    const response = await axios.post<Category>(`${API_URL}/create`, category)
    return response.data
  },
  updateCategory: async (id: string, category: UpdateCategoryRequest) => {
    const response = await axios.put<Category>(
      `${API_URL}/update/${id}`,
      category,
    )
    return response.data
  },
  deleteCategory: async (id: string) => {
    await axios.delete(`${API_URL}/delete/${id}`)
  },
}
