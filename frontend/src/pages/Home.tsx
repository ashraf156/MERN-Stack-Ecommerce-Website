import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchProducts } from "../features/products/productSlice"
import { addToCart } from "../features/cart/cartSlice"
import "./home.css"

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
]

const Home = () => {
  const dispatch = useAppDispatch()
  const { products, isLoading, isError, message } = useAppSelector(
    state => state.product,
  )

  const [sortBy, setSortBy] = useState("newest")
  const [minPrice, setMinPrice] = useState(0)
  const { user } = useAppSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const filteredProducts = useMemo(() => {
    const priceFilter = Number(minPrice) || 0
    return products.filter(product => product.price >= priceFilter)
  }, [products, minPrice])

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]
    switch (sortBy) {
      case "price-low":
        return list.sort((a, b) => a.price - b.price)
      case "price-high":
        return list.sort((a, b) => b.price - a.price)
      case "best-selling":
        return list.sort((a, b) => b.sold - a.sold)
      default:
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }
  }, [filteredProducts, sortBy])

  const bestOfferProducts = useMemo(() => {
    return [...products].sort((a, b) => b.sold - a.sold).slice(0, 3)
  }, [products])

  const discountProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.price - a.price)
      .slice(0, 3)
      .map(product => ({
        ...product,
        discountPercent: 15,
        discountedPrice: Math.round(product.price * 0.85),
      }))
  }, [products])

  const handleAddToCart = (productId: string) => {
    if (!user) {
      navigate("/auth/login")
      return
    }
    dispatch(addToCart({ productId }))
  }

  return (
    <main className="home-page">
      <section className="hero-panel">
        <div>
          <h1>Shop smart with weekly offers and instant discounts.</h1>
          <p>
            Discover new arrivals, best-selling deals, and handpicked discounts
            for the week. Filter by minimum price and sort products the way you
            want.
          </p>
          <div className="hero-cta">
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
            <Link to="/categories" className="btn btn-secondary">
              Explore Categories
            </Link>
          </div>
          <div className="hero-panel__stats">
            <div className="hero-stat">
              <h3>Live products</h3>
              <p>{products.length}</p>
            </div>
            <div className="hero-stat">
              <h3>Best offer</h3>
              <p>{bestOfferProducts.length}</p>
            </div>
            <div className="hero-stat">
              <h3>Min price</h3>
              <p>${minPrice || 0}</p>
            </div>
          </div>
        </div>
        <div className="filters-panel">
          <div className="filter-group">
            <label htmlFor="sort">Sort</label>
            <select
              id="sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="minPrice">Minimum price</label>
            <input
              id="minPrice"
              type="number"
              min="0"
              value={minPrice}
              onChange={e => setMinPrice(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div className="filter-group">
            <label>Showing</label>
            <span>{sortedProducts.length} products</span>
          </div>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>Best Offering This Week</h2>
          <small>Top sellers and trending picks</small>
        </div>
        <div className="best-offers">
          {bestOfferProducts.length === 0 ? (
            <div className="empty-state">No best offers available yet.</div>
          ) : (
            bestOfferProducts.map(product => (
              <article key={product._id} className="offer-card">
                <h3>{product.title}</h3>
                <p>{product.description.slice(0, 120)}...</p>
                <div className="offer-meta">
                  <span>{product.category}</span>
                  <span>{product.sold} sold</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>Discounts</h2>
          <small>Get extra savings on featured products</small>
        </div>
        <div className="discount-grid">
          {discountProducts.length === 0 ? (
            <div className="empty-state">No discount products available.</div>
          ) : (
            discountProducts.map(product => (
              <article key={product._id} className="discount-card">
                <h3>{product.title}</h3>
                <div className="price-block">
                  <span className="discount-price">
                    ${product.discountedPrice}
                  </span>
                  <span className="old-price">${product.price}</span>
                  <span className="discount-badge">
                    -{product.discountPercent}%
                  </span>
                </div>
                <p>{product.description.slice(0, 110)}...</p>
                <div className="offer-meta">
                  <span>{product.category}</span>
                  <span>{product.sold} sold</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>All Products</h2>
          <small>Sorted by your selection</small>
        </div>
        {isLoading ? (
          <div className="empty-state">Loading products...</div>
        ) : isError ? (
          <div className="empty-state">
            {message || "Failed to load products."}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="empty-state">No products match this filter.</div>
        ) : (
          <div className="product-grid">
            {sortedProducts.map(product => (
              <article key={product._id} className="product-card">
                <div className="product-card__image">
                  {product.images?.url ? (
                    <img src={product.images.url} alt={product.title} />
                  ) : (
                    <span className="empty-image">No image</span>
                  )}
                </div>
                <div className="product-card__body">
                  <span className="product-card__category">
                    {product.category}
                  </span>
                  <h3 className="product-card__title">{product.title}</h3>
                  <p className="product-card__description">
                    {product.description.slice(0, 110)}...
                  </p>
                  <div className="price-block">
                    <span className="price">${product.price}</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Home
