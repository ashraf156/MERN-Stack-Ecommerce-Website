import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { categoryService } from "./categoryService"
import {
  Category,
  CategoryState,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiError,
} from "../types"

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all categories
 */
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  {
    rejectValue: ApiError
  }
>("category/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const data = await categoryService.getCategories()
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to fetch categories",
      error: error.message,
    })
  }
})

/**
 * Fetch a single category by ID
 */
export const fetchCategoryById = createAsyncThunk<
  Category,
  string,
  {
    rejectValue: ApiError
  }
>("category/fetchCategoryById", async (id, { rejectWithValue }) => {
  try {
    const data = await categoryService.getCategory(id)
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to fetch category",
      error: error.message,
    })
  }
})

/**
 * Create a new category
 */
export const createCategoryThunk = createAsyncThunk<
  Category,
  CreateCategoryRequest,
  {
    rejectValue: ApiError
  }
>("category/createCategory", async (category, { rejectWithValue }) => {
  try {
    const data = await categoryService.createCategory(category)
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to create category",
      error: error.message,
    })
  }
})

/**
 * Update an existing category
 */
export const updateCategoryThunk = createAsyncThunk<
  Category,
  { id: string; updates: UpdateCategoryRequest },
  {
    rejectValue: ApiError
  }
>("category/updateCategory", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const data = await categoryService.updateCategory(id, updates)
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to update category",
      error: error.message,
    })
  }
})

/**
 * Delete a category
 */
export const deleteCategoryThunk = createAsyncThunk<
  string,
  string,
  {
    rejectValue: ApiError
  }
>("category/deleteCategory", async (id, { rejectWithValue }) => {
  try {
    await categoryService.deleteCategory(id)
    return id
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to delete category",
      error: error.message,
    })
  }
})

// ==================== SLICE ====================

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = ""
    },
    clearError: state => {
      state.isError = false
      state.message = ""
    },
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
  },
  extraReducers: builder => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to fetch categories"
      })

    // Fetch Category by ID
    builder
      .addCase(fetchCategoryById.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.selectedCategory = action.payload
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to fetch category"
      })

    // Create Category
    builder
      .addCase(createCategoryThunk.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.categories.push(action.payload)
        state.message = "Category created successfully"
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to create category"
      })

    // Update Category
    builder
      .addCase(updateCategoryThunk.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const index = state.categories.findIndex(
          c => c._id === action.payload._id,
        )
        if (index !== -1) {
          state.categories[index] = action.payload
        }
        state.selectedCategory = action.payload
        state.message = "Category updated successfully"
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to update category"
      })

    // Delete Category
    builder
      .addCase(deleteCategoryThunk.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.categories = state.categories.filter(
          c => c._id !== action.payload,
        )
        state.selectedCategory = null
        state.message = "Category deleted successfully"
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to delete category"
      })
  },
})

export const { clearMessage, clearError, selectCategory } =
  categorySlice.actions

export default categorySlice.reducer
