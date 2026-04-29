import { Product, CreateProductRequest, UpdateProductRequest } from "../types"
import axios from "axios"

const API_URL = "http://localhost:3000/products"

export const productsService = {
  getProducts: async () => {
    const response = await axios.get<Product[]>(API_URL)
    return response.data
  },
  getProduct: async (id: string) => {
    const response = await axios.get<Product>(`${API_URL}/${id}`)
    return response.data
  },
  createProduct: async (product: CreateProductRequest) => {
    const response = await axios.post<Product>(API_URL, product)
    return response.data
  },
  updateProduct: async (id: string, product: UpdateProductRequest) => {
    const response = await axios.patch<Product>(`${API_URL}/${id}`, product)
    return response.data
  },
  deleteProduct: async (id: string) => {
    await axios.delete(`${API_URL}/${id}`)
  },
}
