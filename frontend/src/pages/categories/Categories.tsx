import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchCategories,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
  clearMessage,
  clearError,
} from "../../features/category/categorySlice"
import { CreateCategoryRequest } from "../../features/types"
import "./categories.css"

const Categories = () => {
  const dispatch = useAppDispatch()
  const { categories, isLoading, isError, isSuccess, message } = useAppSelector(
    state => state.category,
  )

  const [isCreateForm, setIsCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "" })

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  useEffect(() => {
    if (isSuccess && message) {
      const timer = setTimeout(() => dispatch(clearMessage()), 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, message, dispatch])

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => dispatch(clearError()), 3000)
      return () => clearTimeout(timer)
    }
  }, [isError, dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert("Please enter a category name")
      return
    }
    const categoryData: CreateCategoryRequest = { name: formData.name.trim() }
    await dispatch(createCategoryThunk(categoryData))
    setFormData({ name: "" })
    setIsCreateForm(false)
  }

  const handleEditCategory = (id: string, name: string) => {
    setEditingId(id)
    setFormData({ name })
    setIsCreateForm(false)
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    if (!formData.name.trim()) {
      alert("Please enter a category name")
      return
    }
    await dispatch(
      updateCategoryThunk({
        id: editingId,
        updates: { name: formData.name.trim() },
      }),
    )
    setEditingId(null)
    setFormData({ name: "" })
    dispatch(fetchCategories())
  }

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await dispatch(deleteCategoryThunk(id))
      dispatch(fetchCategories())
    }
  }

  const handleCancel = () => {
    setIsCreateForm(false)
    setEditingId(null)
    setFormData({ name: "" })
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>Categories Management</h1>
        {!isCreateForm && editingId === null && (
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateForm(true)}
          >
            + Create Category
          </button>
        )}
      </div>

      {message && (
        <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
          {message}
        </div>
      )}

      {isLoading && categories.length === 0 && (
        <div className="loading">Loading categories...</div>
      )}

      {isCreateForm && (
        <form className="category-form" onSubmit={handleCreateCategory}>
          <h2>Create New Category</h2>
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              Create
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingId && (
        <form className="category-form" onSubmit={handleUpdateCategory}>
          <h2>Edit Category</h2>
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="categories-list">
        {categories.length === 0 && !isLoading && (
          <div className="no-data">
            No categories found. Create one to get started!
          </div>
        )}

        {categories.map(category => (
          <div key={category._id} className="category-card">
            <div className="category-info">
              <h3>{category.name}</h3>
              <p className="category-date">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="category-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleEditCategory(category._id, category.name)}
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDeleteCategory(category._id)}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
