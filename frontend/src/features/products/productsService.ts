import { Product, CreateProductRequest, UpdateProductRequest } from "../types"
import axios from "axios"

const API_URL = "http://localhost:5000/api/product"

export const productsService = {
  getProducts: async () => {
    const response = await axios.get<{ products: Product[] }>(
      `${API_URL}/getAllProducts`,
    )
    return response.data.products
  },
  getProduct: async (id: string) => {
    const response = await axios.get<{ product: Product }>(
      `${API_URL}/getProduct/${id}`,
    )
    return response.data.product
  },
  createProduct: async (product: CreateProductRequest) => {
    const response = await axios.post<{ product: Product }>(
      `${API_URL}/create`,
      product,
    )
    return response.data.product
  },
  updateProduct: async (id: string, product: UpdateProductRequest) => {
    const response = await axios.put<{ product: Product }>(
      `${API_URL}/updateProduct/${id}`,
      product,
    )
    return response.data.product
  },
  deleteProduct: async (id: string) => {
    await axios.delete(`${API_URL}/deleteProduct/${id}`)
  },
}
