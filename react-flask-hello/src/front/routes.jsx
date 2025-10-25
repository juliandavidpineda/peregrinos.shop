// Import necessary components and functions from react-router-dom.
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import SantoralPage from "./pages/SantoralPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";

// Nuevas importaciones para el panel admin
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders/AdminOrders";
// IMPORTAR NUEVA RUTA
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import ProtectedRoute from "./components/ProtectedRoute";

import PaymentSuccess from './components/checkout/PaymentSuccess';

import UserLoginPage from './pages/UserLoginPage';
import TerminosPage from './pages/TerminosPage';
import PrivacidadPage from './pages/PrivacidadPage';
import AdminClientUsers from './pages/admin/AdminClientUsers';

export const router = createBrowserRouter(
  createRoutesFromElements(
    // Envolver todas las rutas en un fragmento
    <>
      {/* Ruta principal con Layout */}
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route path="/" element={<Home />} />
        <Route path="/single/:theId" element={<Single />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/shop-page" element={<ShopPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
        <Route path="/santoral" element={<SantoralPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/login" element={<UserLoginPage  />} />
        <Route path="/terminos" element={<TerminosPage />} />
        <Route path="/privacidad" element={<PrivacidadPage />} />
      </Route>

      {/* Rutas del Panel Administrativo */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<AdminLogin />} />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="products" element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        } />
        <Route path="categories" element={
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="users" element={
          <ProtectedRoute requiredRole="superadmin">
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="client-users" element={
          <ProtectedRoute requiredRole="superadmin">
            <AdminClientUsers />
          </ProtectedRoute>
        } />
        <Route path="reviews" element={
          <ProtectedRoute allowedRoles={['editor', 'content_manager', 'superadmin']}>
            <AdminReviews />
          </ProtectedRoute>
        } />
      </Route>
    </>
  )
);