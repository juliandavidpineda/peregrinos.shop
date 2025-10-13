import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useCart } from "../context/CartContext"
import CartModal from "../components/cart/CartModal"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {

    const {cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();

    return (
        <ScrollToTop>
            <Navbar />
                <Outlet />
            <Footer />

            <CartModal 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
            />

        </ScrollToTop>
    )
}