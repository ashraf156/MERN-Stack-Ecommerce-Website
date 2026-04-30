import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchProducts,
  fetchProductById,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
  clearMessage,
  clearError,
} from "../../features/products/productSlice"
import { fetchCategories } from "../../features/category/categorySlice"
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "../../features/types"
import { uploadService } from "../../features/upload/uploadService"
import "./product.css"

const initialFormState = {
  title: "",
  price: "",
  description: "",
  content: "",
  category: "",
}

const Product = () => {
  const { id } = useParams<{ id?: string }>()
  const dispatch = useAppDispatch()
  const { products, selectedProduct, isError, message } = useAppSelector(
    state => state.product,
  )
  const { categories } = useAppSelector(state => state.category)
  const { token } = useAppSelector(state => state.auth)

  const [formState, setFormState] = useState(initialFormState)
  const [imageData, setImageData] = useState<{
    url: string
    public_id: string
  } | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (selectedProduct && id) {
      setFormState({
        title: selectedProduct.title,
        price: String(selectedProduct.price),
        description: selectedProduct.description,
        content: String(selectedProduct.content),
        category: selectedProduct.category,
      })
      setImageData({
        url: selectedProduct.images?.url || "",
        public_id: selectedProduct.images?.public_id || "",
      })
      setPreviewUrl(selectedProduct.images?.url || "")
      setIsCreating(false)
    }
  }, [selectedProduct, id])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearMessage()), 3000)
      return () => clearTimeout(timer)
    }
  }, [message, dispatch])

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => dispatch(clearError()), 3000)
      return () => clearTimeout(timer)
    }
  }, [isError, dispatch])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError("")
    setUploading(true)

    try {
      const data = await uploadService.uploadFile(file, token ?? undefined)
      setImageData({ url: data.url, public_id: data.public_id })
      setPreviewUrl(data.url)
    } catch (error: any) {
      setUploadError(
        error.response?.data?.msg || error.message || "Upload failed",
      )
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formState.title.trim() ||
      !formState.price.trim() ||
      !formState.description.trim() ||
      !formState.content.trim() ||
      !formState.category.trim()
    ) {
      alert("Please fill in all required fields.")
      return
    }

    if (!imageData?.url) {
      alert("Please upload a product image.")
      return
    }

    const requestData: CreateProductRequest = {
      title: formState.title.trim(),
      price: Number(formState.price),
      description: formState.description.trim(),
      content: Number(formState.content),
      category: formState.category.trim(),
      images: imageData,
    }

    if (id) {
      const updateData: UpdateProductRequest = {
        ...requestData,
      }
      await dispatch(updateProductThunk({ id, updates: updateData }))
    } else {
      await dispatch(createProductThunk(requestData))
      setIsCreating(false)
    }

    setFormState(initialFormState)
    setImageData(null)
    setPreviewUrl("")
  }

  const handleEdit = (productId: string) => {
    setIsCreating(false)
    dispatch(fetchProductById(productId))
  }

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    await dispatch(deleteProductThunk(productId))
  }

  const resetForm = () => {
    setFormState(initialFormState)
    setImageData(null)
    setPreviewUrl("")
    setIsCreating(false)
  }

  return (
    <div className="product-page">
      <div className="product-page__header">
        <h1>{id ? "Edit Product" : "Product Management"}</h1>
        {!id && (
          <button
            className="btn btn-primary"
            onClick={() => setIsCreating(true)}
          >
            + Add Product
          </button>
        )}
      </div>

      {message && (
        <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
          {message}
        </div>
      )}

      {(id || isCreating) && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Title
              <input
                name="title"
                value={formState.title}
                onChange={handleChange}
                placeholder="Product title"
              />
            </label>
            <label>
              Price
              <input
                name="price"
                type="number"
                value={formState.price}
                onChange={handleChange}
                placeholder="Product price"
              />
            </label>
            <label>
              Category
              <select
                name="category"
                value={formState.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Quantity
              <input
                name="content"
                type="number"
                value={formState.content}
                onChange={handleChange}
                placeholder="Available quantity"
              />
            </label>
          </div>

          <label className="full-width">
            Description
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              rows={4}
              placeholder="Product description"
            />
          </label>

          <div className="upload-row">
            <label className="upload-label">
              Product image
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleUpload}
              />
            </label>
            <div className="image-preview">
              {uploading ? (
                <div className="uploading">Uploading...</div>
              ) : previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <div className="empty-preview">Upload an image</div>
              )}
            </div>
          </div>

          {uploadError && <div className="upload-error">{uploadError}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {id ? "Update Product" : "Save Product"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!id && !isCreating && (
        <div className="products-grid">
          {products.length === 0 ? (
            <div className="empty-state">
              No products found. Add your first product.
            </div>
          ) : (
            products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-card__image">
                  {product.images?.url ? (
                    <img src={product.images.url} alt={product.title} />
                  ) : (
                    <div className="empty-image">No image</div>
                  )}
                </div>
                <div className="product-card__content">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <div className="product-meta">
                    <span>Category: {product.category}</span>
                    <span>Price: ${product.price}</span>
                  </div>
                </div>
                <div className="product-card__actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Product
