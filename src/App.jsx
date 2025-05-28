import {Navigate, Route, Routes, useLocation, Link} from 'react-router-dom'
import LoginPage from './pages/LogInPage'
import {Toaster} from 'react-hot-toast'
import { useEffect, useState } from 'react'
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
import InvestmentsPage from './pages/InvestmentsPage'
import CreateInvestmentPage from './pages/CreateInvestmentPage'
import AffiliatePage from './pages/AfffiliatePage'
import Sidebar from './components/Sidebar'
import SettingsPage from './pages/SettingsPage'
import LandingPage from './pages/LandingPage'
import NotificationsPage from './pages/NotificationsPage'
import SupportPage from './pages/SupportPage'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const ProtectedRoute = ({children})=>{
    const {isAuthenticated, user} = useAuthStore()
  
    if(!isAuthenticated && !user){
      return <Navigate to={'/login'} replace/>
    }

    if(!user.isPhoneVerified){
      return <Navigate to={'/verify-phone'} replace/>
    }
  
    return children
  }
  const {isCheckingAuth, checkAuth} = useAuthStore()
  
  const RedirectAuthenticatedUser = ({children}) =>{
    const {isAuthenticated, user} = useAuthStore()
  
    if(isAuthenticated && user.isPhoneVerified){
      return <Navigate to={'/home'} replace/>
    }
    return children
  }

  const location = useLocation();

  const isLandingPage = location.pathname === '/'
  const showAuthNavbarRoutes = ['/login', '/signup'];
  const isShowAuthNavbarPage = showAuthNavbarRoutes.includes(location.pathname.toLowerCase());
  const isProtectedPage = !['/login', '/signup', '/verify-phone', '/verify-success'].includes(location.pathname.toLowerCase());

  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  return (
    <>
      <div className={`min-h-screen w-full bg-gradient-to-b from-[#EEDDFF] via-[#FCFAFF] to-[#FCFAFF]`}>
    {isProtectedPage && isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar}/>}
      {isShowAuthNavbarPage && !isLandingPage && <NavbarAuth />}
      {isProtectedPage && !isLandingPage && <NavbarMain onMenuClick={toggleSidebar} />}
      <Routes>
          <Route index element={
              <LandingPage/>}/>
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
          
          {isCheckingAuth ? 
          <Route path='*' element={
            <LoadingSpinner/>
            } /> : <>
          <Route path={'/home'} element={
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
          <Route path={'/investment'} element={
            <ProtectedRoute>
              <InvestmentsPage />
            </ProtectedRoute>} />
          <Route path={'/create-investment'} element={
            <ProtectedRoute>
              <CreateInvestmentPage />
            </ProtectedRoute>} />
          <Route path={'/affiliate'} element={
            <ProtectedRoute>
              <AffiliatePage />
            </ProtectedRoute>} />
          <Route path={'/settings'} element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>} />
          <Route path={'/notifications'} element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>} />
          <Route path={'/support'} element={
            <ProtectedRoute>
              <SupportPage />
            </ProtectedRoute>} />
          <Route path={'*'} element={<Navigate to={'/'}/>} />
          </>}
      </Routes>
      <Toaster/>
      </div>
    </>
  )
}

export default App
