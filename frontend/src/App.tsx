import "./index.css"
import { Route, Routes } from "react-router-dom"
import Layout from "./utils/Layout"
import Home from "./pages/Home"
import Product from "./pages/products/Product"
import Categories from "./pages/categories/Categories"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import Cart from "./pages/cart/Cart"
import NotFound from "./utils/NotFound"

export const App = () => (
  <div className="App">
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </div>
)
