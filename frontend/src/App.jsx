import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import Registration from './pages/Registration';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin.jsx'
import CreateSeller from './pages/CreateSeller';
import AllSellers from './pages/AllSellers';
import UpdateSeller from './pages/UpdateSeller';
import SwitchSidebar from './component/SwitchSidbar'
import CreateBuyer from './pages/CreateBuyer'
import AllBuyers from './pages/AllBuyers'
import UpdateBuyer from './pages/UpdateBuyer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import SellerOrders from "./pages/SellerOrders.jsx"
import Home from './pages/Home.jsx';
import SellerRegister from './pages/SellerRegister.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import MyProfile from './pages/MyPrpfile.jsx';
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import PublicProducts from './pages/PublicProducts.jsx'
import PublicSellers from './pages/PublicSellers.jsx'
import SellerShop from './pages/SellerShop.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Chatbot from './component/Chatbot.jsx';


// har role ka apna home page
function homeFor(role) {
  if (role === "admin") return "/profile"
  if (role === "seller") return "/MyProfile"
  if (role === "buyer") return "/MyProfile"
  return "/login"
}

function ProtectedRoute({ roles, children }) {
  let token = localStorage.getItem("token")
  let userRole = localStorage.getItem("role")

  if (!token) {
    return <Navigate to="/login" />
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to={homeFor(userRole)} />
  }

  return children
}

// In pages par sidebar nahi dikhana
const NO_SIDEBAR = [
  '/', '/home', '/shop', '/sellers', '/how-it-works',
  '/login', '/registration', '/seller-register', '/order-success',
  '/admin-login-mkdev',
]

function Layout() {
  const { pathname } = useLocation()
  const hideSidebar =
    NO_SIDEBAR.includes(pathname.toLowerCase()) ||
    pathname.toLowerCase().startsWith('/product/') ||
    pathname.toLowerCase().startsWith('/sellers/') ||
    pathname.toLowerCase().startsWith('/checkout/')

  return (
    <div className='flex min-h-screen'>
<Chatbot />
      {!hideSidebar && <SwitchSidebar />}

      <div className='flex-1 min-w-0'>
        <Routes>

          {/* public pages */}
          <Route path='/' element={<Home />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/shop' element={<PublicProducts />} />
          <Route path='/sellers' element={<PublicSellers />} />
          <Route path='/sellers/:id' element={<SellerShop />} />
          <Route path='/how-it-works' element={<HowItWorks />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/seller-register' element={<SellerRegister />} />
          <Route path='/product/:id' element={<ProductDetail />} />

          {/* admin ka chhupa hua login (is URL ka link kisi page par na dein) */}
          <Route path='/admin-login-mkdev' element={<AdminLogin />} />

          {/* seller, buyer, admin: apni profile */}
          <Route path='/MyProfile' element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          } />

          {/* sirf admin */}
          <Route path='/profile' element={
            <ProtectedRoute roles={["admin"]}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path='/AllSellers' element={
            <ProtectedRoute roles={["admin"]}>
              <AllSellers />
            </ProtectedRoute>
          } />
          <Route path='/AllBuyers' element={
            <ProtectedRoute roles={["admin"]}>
              <AllBuyers />
            </ProtectedRoute>
          } />

          {/* seller aur admin */}
          <Route path='/CreateSeller' element={
            <ProtectedRoute roles={["admin", "seller"]}>
              <CreateSeller />
            </ProtectedRoute>
          } />
          <Route path='/UpdateSeller/:id' element={
            <ProtectedRoute roles={["admin", "seller"]}>
              <UpdateSeller />
            </ProtectedRoute>
          } />
          <Route path='/SellerOrders' element={
            <ProtectedRoute roles={["seller"]}>
              <SellerOrders />
            </ProtectedRoute>
          } />

          {/* buyer aur admin */}
          <Route path='/CreateBuyer' element={
            <ProtectedRoute roles={["admin", "buyer"]}>
              <CreateBuyer />
            </ProtectedRoute>
          } />
          <Route path='/UpdateBuyer/:id' element={
            <ProtectedRoute roles={["admin", "buyer"]}>
              <UpdateBuyer />
            </ProtectedRoute>
          } />

          {/* sirf buyer: order checkout aur order ke baad ka hisab */}
          <Route path='/checkout/:id' element={
            <ProtectedRoute roles={["buyer"]}>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path='/order-success' element={
            <ProtectedRoute roles={["buyer"]}>
              <OrderSuccess />
            </ProtectedRoute>
          } />

          {/* sab logged-in users */}
          <Route path='/products' element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />

          {/* galat URL */}
          <Route path='*' element={<Navigate to="/" />} />

        </Routes>
      </div>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
export default App