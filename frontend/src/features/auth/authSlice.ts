import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authService } from "./authService"
import {
  AuthState,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiError,
  User,
} from "../types"

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

// ==================== ASYNC THUNKS ====================

/**
 * Login user with email and password
 */
export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  {
    rejectValue: ApiError
  }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await authService.login(email, password)
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token)
    }
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Login failed",
      error: error.message,
    })
  }
})

/**
 * Register a new user
 */
export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  {
    rejectValue: ApiError
  }
>("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const data = await authService.register(name, email, password)
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token)
    }
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Registration failed",
      error: error.message,
    })
  }
})

/**
 * Logout user
 */
export const logoutThunk = createAsyncThunk<
  { message: string },
  void,
  {
    rejectValue: ApiError
  }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const data = await authService.logout()
    // Remove token from localStorage
    localStorage.removeItem("token")
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Logout failed",
      error: error.message,
    })
  }
})

/**
 * Get current user
 */
export const getUserThunk = createAsyncThunk<
  User,
  string,
  {
    rejectValue: ApiError
  }
>("auth/getUser", async (token, { rejectWithValue }) => {
  try {
    const data = await authService.getUser(token)
    return data
  } catch (error: any) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "Failed to fetch user",
      error: error.message,
    })
  }
})

// ==================== SLICE ====================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: state => {
      state.user = null
      state.token = null
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
      localStorage.removeItem("token")
    },
    clearMessage: state => {
      state.message = ""
    },
    clearError: state => {
      state.isError = false
      state.message = ""
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginThunk.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (action.payload.user) {
          state.user = action.payload.user
        }
        if (action.payload.token) {
          state.token = action.payload.token
        }
        state.message = action.payload.message || "Login successful"
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Login failed"
      })

    // Register
    builder
      .addCase(registerThunk.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (action.payload.user) {
          state.user = action.payload.user
        }
        if (action.payload.token) {
          state.token = action.payload.token
        }
        state.message = action.payload.message || "Registration successful"
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Registration failed"
      })

    // Logout
    builder
      .addCase(logoutThunk.pending, state => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isSuccess = true
        state.message = "Logged out successfully"
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Logout failed"
      })

    // Get User
    builder
      .addCase(getUserThunk.pending, state => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
        state.message = "User fetched successfully"
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || "Failed to fetch user"
      })
  },
})

export const { logout, clearMessage, clearError, setUser } = authSlice.actions

export default authSlice.reducer
