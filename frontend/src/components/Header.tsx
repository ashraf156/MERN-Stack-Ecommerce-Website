import { useState } from "react"
import "./header.css"
import Menu from "../assist/icon/menu.svg"
import Close from "../assist/icon/close.svg"
import Cart from "../assist/icon/cart.svg"
import { Link } from "react-router-dom"

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const closeNav = () => setIsNavOpen(false)

  return (
    <header className={isNavOpen ? "header header--open" : "header"}>
      <div className="logo">
        <h1>
          <Link to="/" onClick={closeNav}>
            MyShop
          </Link>
        </h1>
      </div>

      <nav className={isNavOpen ? "nav-links active" : "nav-links"}>
        <button
          className="menu-close"
          onClick={closeNav}
          aria-label="Close menu"
        >
          <img src={Close} alt="Close menu" width={28} />
        </button>
        <ul>
          <li>
            <Link to="/products" onClick={closeNav}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/categories" onClick={closeNav}>
              Categories
            </Link>
          </li>
          <li>
            <Link to="/auth/login" onClick={closeNav}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/auth/register" onClick={closeNav}>
              Register
            </Link>
          </li>
        </ul>
      </nav>

      <button
        className="mobile-menu"
        onClick={() => setIsNavOpen(true)}
        aria-label="Open menu"
      >
        <img src={Menu} alt="Open menu" width={28} />
      </button>

      <div className="cart-icon">
        <span>0</span>
        <Link to="/cart" onClick={closeNav}>
          <img src={Cart} alt="cart" width={30} />
        </Link>
      </div>
    </header>
  )
}

export default Header
