import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  clearCart,
} from "../../features/cart/cartSlice"
import "./cart.css"

const Cart = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items } = useAppSelector(state => state.cart)
  const { products } = useAppSelector(state => state.product)
  const { user } = useAppSelector(state => state.auth)

  const cartItems = useMemo(
    () =>
      items
        .map(item => ({
          ...item,
          product: products.find(product => product._id === item.productId),
        }))
        .filter(item => item.product),
    [items, products],
  )

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
        0,
      ),
    [cartItems],
  )

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth/login")
      return
    }
    alert("Proceeding to checkout...")
  }

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          Your cart is empty. Add products to continue shopping.
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.productId}>
              <div className="cart-item__image">
                {item.product?.images?.url ? (
                  <img src={item.product.images.url} alt={item.product.title} />
                ) : (
                  <span>No image</span>
                )}
              </div>
              <div className="cart-item__details">
                <h2 className="cart-item__title">{item.product?.title}</h2>
                <div className="cart-item__meta">
                  <span>${item.product?.price.toFixed(2)}</span>
                  <span>{item.product?.category}</span>
                </div>
                <div className="cart-item__quantity">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item.productId))}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => dispatch(increaseQuantity(item.productId))}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-button"
                  onClick={() => dispatch(removeFromCart(item.productId))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <strong>{cartItems.length}</strong>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Estimated shipping</span>
            <strong>$5.00</strong>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <strong>${(subtotal * 0.08).toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong>${(subtotal + 5 + subtotal * 0.08).toFixed(2)}</strong>
          </div>
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
          <button
            className="checkout-button"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </button>
        </aside>
      </div>
    </main>
  )
}

export default Cart
