import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { productsService } from "./productsService"
import {
  ProductState,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ApiError,
} from "../types"

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  total: 0,
  currentPage: 1,
  pages: 1,
}

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all products
 */
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  {
    rejectValue: ApiError
  }
>("product/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const data = await productsService.getProducts()
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to fetch products",
      error: error.message,
    })
  }
})

/**
 * Fetch a single product by ID
 */
export const fetchProductById = createAsyncThunk<
  Product,
  string,
  {
    rejectValue: ApiError
  }
>("product/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    const data = await productsService.getProduct(id)
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to fetch product",
      error: error.message,
    })
  }
})

/**
 * Create a new product
 */
export const createProductThunk = createAsyncThunk<
  Product,
  CreateProductRequest,
  {
    rejectValue: ApiError
  }
>("product/createProduct", async (product, { rejectWithValue }) => {
  try {
    const data = await productsService.createProduct(product)
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to create product",
      error: error.message,
    })
  }
})

/**
 * Update an existing product
 */
export const updateProductThunk = createAsyncThunk<
  Product,
  { id: string; updates: UpdateProductRequest },
  {
    rejectValue: ApiError
  }
>("product/updateProduct", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const data = await productsService.updateProduct(id, updates)
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to update product",
      error: error.message,
    })
  }
})

/**
 * Delete a product
 */
export const deleteProductThunk = createAsyncThunk<
  string,
  string,
  {
    rejectValue: ApiError
  }
>("product/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await productsService.deleteProduct(id)
    return id
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to delete product",
      error: error.message,
    })
  }
})

// ==================== SLICE ====================

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = ""
    },
    clearError: state => {
      state.isError = false
      state.message = ""
    },
  },
  extraReducers: builder => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to fetch products"
      })

    // Fetch Product by ID
    builder
      .addCase(fetchProductById.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to fetch product"
      })

    // Create Product
    builder
      .addCase(createProductThunk.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.products.push(action.payload)
        state.message = "Product created successfully"
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to create product"
      })

    // Update Product
    builder
      .addCase(updateProductThunk.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const index = state.products.findIndex(
          p => p._id === action.payload._id,
        )
        if (index !== -1) {
          state.products[index] = action.payload
        }
        state.selectedProduct = action.payload
        state.message = "Product updated successfully"
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to update product"
      })

    // Delete Product
    builder
      .addCase(deleteProductThunk.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.products = state.products.filter(p => p._id !== action.payload)
        state.selectedProduct = null
        state.message = "Product deleted successfully"
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to delete product"
      })
  },
})

export const { clearMessage, clearError } = productSlice.actions

export default productSlice.reducer
