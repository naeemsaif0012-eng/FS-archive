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
        <Route path="/bags">{() => <CatalogPage category="bags" eyebrow="Bags" heading="The Bag Edit" description="From everyday totes to cute statement bags, discover pieces that instantly elevate your outfit — whether you’re heading to university, work, coffee or a day out." />}</Route>
        <Route path="/jewelry">{() => <CatalogPage category="jewelry" eyebrow="Jewelry" heading="The Jewelry Edit" description="Dainty, feminine and effortlessly wearable — discover jewellery pieces that add just the right amount of sparkle to your everyday style." />}</Route>
        <Route path="/accessories">{() => <CatalogPage category="accessories" eyebrow="Accessories" heading="The Accessory Edit" description="All the little things you didn’t know you needed. A fun mix of cute, useful & aesthetic finds — from everyday essentials to those little pieces that instantly make life a bit prettier." />}</Route>
        <Route path="/home">{() => <CatalogPage category="home" eyebrow="Home" heading="The Home Edit" description="Little things that make home feel even prettier. Discover a mix of cute, practical & aesthetic home essentials — from everyday must-haves to those little finds that make your space feel more you." />}</Route>
        <Route path="/product/:id">{() => <ProductDetailPage />}</Route>
        <Route path="/contact">{() => <ContactPage />}</Route>
        <Route>{() => <HomePage />}</Route>
      </Switch>
    </PublicLayout>
  )
}

export default function App() { return <><ScrollToTop /><Routes /></> }
