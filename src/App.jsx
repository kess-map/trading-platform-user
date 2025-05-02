import {Navigate, Route, Routes, useLocation} from 'react-router-dom'
import LoginPage from './pages/LogInPage'
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import LoadingSpinner from './components/LoadingSpinner'
import NavbarAuth from './components/NavbarAuth'
import NavbarMain from './components/NavbarMain'
import { useAuthStore } from './store/authStore'
import SignUpPage from './pages/SignUpPage'
import VerifyPhoneNumberPage from './pages/VerifyPhoneNumberPage'
import VerificationSuccessPage from './pages/VerificationSuccessPage'
import OrdersPage from './pages/OrdersPage'
import CreateBuyOrderForm from './pages/CreateBuyOrderPage'
import CreateSellOrderForm from './pages/CreateSellOrderPage'

function App() {
  const ProtectedRoute = ({children})=>{
    const {isAuthenticated, user} = useAuthStore()
  
    if(!isAuthenticated && !user){
      return <Navigate to={'/login'} replace/>
    }
  
    return children
  }
  const {isCheckingAuth, checkAuth} = useAuthStore()
  
  const RedirectAuthenticatedUser = ({children}) =>{
    const {isAuthenticated, user} = useAuthStore()
  
    if(isAuthenticated && user.isPhoneVerified){
      return <Navigate to={'/'} replace/>
    }
    return children
  }

  const location = useLocation();

  const showAuthNavbarRoutes = ['/login', '/signup'];
  const isShowAuthNavbarPage = showAuthNavbarRoutes.includes(location.pathname.toLowerCase());
  const isProtectedPage = !['/login', '/signup', '/verify-phone', '/verify-success'].includes(location.pathname.toLowerCase());

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth) return <LoadingSpinner/>
  return (
    <>
      <div className={`min-h-screen w-full`}>
      {isShowAuthNavbarPage && <NavbarAuth />}
      {isProtectedPage && <NavbarMain />}
      <Routes>
          <Route path='/login' element={
            <RedirectAuthenticatedUser>
              <LoginPage/>
            </RedirectAuthenticatedUser>}/>
            <Route path='/signup' element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>}/>
            <Route path='/verify-phone' element={
              <RedirectAuthenticatedUser>
                <VerifyPhoneNumberPage />
              </RedirectAuthenticatedUser>}/>
            <Route path='/verify-success' element={
              <RedirectAuthenticatedUser>
                <VerificationSuccessPage />
              </RedirectAuthenticatedUser>}/>
          
          <Route index element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>} />
          <Route path={'/orders'} element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>} />
          <Route path={'/create-sell-order'} element={
            <ProtectedRoute>
              <CreateSellOrderForm />
            </ProtectedRoute>} />
          <Route path={'/create-buy-order'} element={
            <ProtectedRoute>
              <CreateBuyOrderForm />
            </ProtectedRoute>} />
      </Routes>
      <Toaster/>
      </div>
    </>
  )
}

export default App
