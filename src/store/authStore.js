import { create } from 'zustand'
import axios from '../utils/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create((set)=> ({
    user:null,
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: true,
    message:null,
    pendingVerification: false,

    signup: async(formData)=>{
        set({isLoading: true, error:null})
        try {
           const response = await axios.post(`/auth/signup`, formData)
           set({user: response.data.data.user, error: null, isAuthenticated: true, isLoading: false})
           toast.success(response.data.message)
           return response
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Error Signing In')
        }
    },

    login: async(email, password)=>{
        set({isLoading: true, error:null})
        try {
           const response = await axios.post(`/auth/login`, {email, password})
           set({user: response.data.data.user, error: null, isAuthenticated: true, isLoading: false})
           return toast.success('Logged In Sucessfully')
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Error Logging In')
        }
    },

    logout: async()=>{
        set({isLoading: true, error:null})
        try {
            await axios.post(`/auth/logout`)
            set({user:null, isAuthenticated: false, error:null, isLoading: false})
            toast.success('logged out successfully')
        } catch (error) {
            console.log(error)
            set({ isLoading: false})
            return toast.error(error.response.data.message || 'Error Logging Out')
        }
    },

    verifyPhoneNumber: async(email, code)=>{
        set({isLoading: true, error:null})
        try {
            const response = await axios.post(`/auth/verify-otp`, {email, code})
            set({isLoading: false})
            toast.success('Phone Number Verified Successfully')
            return response
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Error Verifying phone number')
        }
    },

    resendVerificationMessage: async(email)=>{
        set({isLoading: true, error:null})
        try {
            await axios.post(`/auth/resend-otp`, {email})
            set({ isLoading: false})
            toast.success('Code has been resent to your email')
        } catch (error) {
            set({ isLoading: false})
            return toast.error(error.response.data.message || 'Error resending verification message')
        }
    },
    uploadIdVerification: async(verificationDetails)=>{
        set({isLoading: true, error:null})
        try {
            await axios.post(`/settings/verification-request`, verificationDetails)
            set({ isLoading: false})
            toast.success('Verification request submitted successfully')
        } catch (error) {
            set({ isLoading: false})
            return toast.error(error.response.data.message || 'Error resending verification message')
        }
    },
    requestProfileUpdate: async(profileDetails)=>{
        set({isLoading: true, error:null})
        try {
            await axios.post(`/settings/profile-edit`, profileDetails)
            set({ isLoading: false})
            toast.success('Profile update request submitted successfully')
        } catch (error) {
            set({ isLoading: false})
            return toast.error(error.response.data.message || 'Error sending request')
        }
    },
    changePassword: async(passwordDetails)=>{
        set({isLoading: true, error:null})
        try {
            await axios.post(`/settings/change-password`, passwordDetails)
            set({ isLoading: false})
            toast.success('Password changed successfully')
        } catch (error) {
            set({ isLoading: false})
            return toast.error(error.response.data.message || 'Error changing password')
        }
    },

    checkAuth: async()=>{
        set({isCheckingAuth: true, error:null})
        try {
            const response = await axios.get(`/auth/check-auth`)
            set({user: response.data.data, isAuthenticated: true, isCheckingAuth: false})
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false })
        }
    },
}))
