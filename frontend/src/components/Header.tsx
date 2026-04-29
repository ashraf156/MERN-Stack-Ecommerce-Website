import "./header.css"
import Menu from "../assist/icon/menu.svg"
import Close from "../assist/icon/close.svg"
import Cart from "../assist/icon/cart.svg"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header>
      <div className="menu">
        <img src={Menu} alt="menu" width={30} />
      </div>
      <div className="logo">
        <h1>
          <Link to="/">MyShop</Link>
        </h1>
      </div>
      <ul>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/auth/login">Login</Link>
        </li>
        <li>
          <Link to="/auth/register">Register</Link>
        </li>
        <li>
          <img src={Close} alt="close" width={30} className="menu" />
        </li>
      </ul>
      <div className="cart-icon">
        <span>0</span>
        <Link to="/cart">
          <img src={Cart} alt="cart" width={30} />
        </Link>
      </div>
    </header>
  )
}

export default Header
