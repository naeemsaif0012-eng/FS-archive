import { useEffect, type ReactNode } from 'react'
import { Route, Switch, useLocation } from 'wouter'
import { CartProvider } from './context/CartContext'
import { CartDrawer, Footer, MobileDrawer, Navbar, SearchOverlay } from './components/PublicChrome'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ContactPage } from './pages/ContactPage'
import { AdminDashboard, AdminLoginPage, ProductEditor } from './pages/AdminPages'

function ScrollToTop() {
  const [path] = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [path])
  return null
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SearchOverlay />
      <CartDrawer />
      <MobileDrawer />
      <Navbar />
      {children}
      <Footer />
    </CartProvider>
  )
}

function Routes() {
  const [location] = useLocation()
  const admin = location.startsWith('/admin')

  if (admin) {
    return (
      <Switch>
        <Route path="/admin">{() => <AdminLoginPage />}</Route>
        <Route path="/admin/setup">{() => <AdminLoginPage setup />}</Route>
        <Route path="/admin/dashboard">{() => <AdminDashboard />}</Route>
        <Route path="/admin/products/new">{() => <ProductEditor />}</Route>
        <Route path="/admin/products/:id/edit">{(params) => <ProductEditor id={params.id} />}</Route>
      </Switch>
    )
  }

  return (
    <PublicLayout>
      <Switch>
        <Route path="/">{() => <HomePage />}</Route>
        <Route path="/bags">{() => <CatalogPage category="bags" eyebrow="The Leather Edit" />}</Route>
        <Route path="/jewelry">{() => <CatalogPage category="jewelry" eyebrow="Fine Jewelry" />}</Route>
        <Route path="/accessories">{() => <CatalogPage category="accessories" eyebrow="Accessories" />}</Route>
        <Route path="/product/:id">{() => <ProductDetailPage />}</Route>
        <Route path="/contact">{() => <ContactPage />}</Route>
        <Route>{() => <HomePage />}</Route>
      </Switch>
    </PublicLayout>
  )
}

export default function App() { return <><ScrollToTop /><Routes /></> }
