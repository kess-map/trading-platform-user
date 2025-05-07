import { create } from 'zustand'
import axios from '../utils/axios'
import toast from 'react-hot-toast'

export const useOrderStore = create((set)=> ({
    isLoading: false,
    pendingBuyOrders: [],
    pendingSellOrders: [],
    isLive: false, 

    setIsLive: (value)=>{
        set({isLive: value})
    },

    getPendingBuyOrders: async()=>{
        set({isLoading: true, error:null})
        try {
           const response = await axios.get(`/buy-orders/pending`)
           set({pendingBuyOrders: response.data.data, isLoading: false})
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Error Fetching Buy Orders')
        }
    },
    getPendingSellOrders: async()=>{
        set({isLoading: true, error:null})
        try {
           const response = await axios.get(`/sell-orders/pending`)
           set({pendingSellOrders: response.data.data, isLoading: false})
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Error Fetching Sell Orders')
        }
    },
    createSellOrder: async(sellOrderDetails)=>{
        set({isLoading: true, error:null})
        try {
           await axios.post(`/sell-orders/create`, sellOrderDetails)
           set({ isLoading: false})
           return toast.success('Sell Order Created Successfully')
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Error Creating Sell Order')
        }
    },
    createBuyOrder: async(buyOrderDetails)=>{
        set({isLoading: true, error:null})
        try {
           await axios.post(`/buy-orders/create`, buyOrderDetails)
           set({ isLoading: false})
           return toast.success('Buy Order Created Successfully')
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Error Creating Buy Order')
        }
    },
    createInvestment: async(investmentDetails)=>{
        set({isLoading: true, error:null})
        try {
           await axios.post(`/investments/create`, investmentDetails)
           set({ isLoading: false})
           return toast.success('Investment Created Successfully')
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Error Creating Investment')
        }
    },
    cancelBuyOrder: async(id)=>{
        set({isLoading: true, error:null})
        try {
            await axios.put(`/buy-orders/cancel/${id}`)
           set({ isLoading: false})
           return toast.success('Buy order canceled successfully') 
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Something went wrong')
        }
    },
    cancelSellOrder: async(id)=>{
        set({isLoading: true, error:null})
        try {
            await axios.put(`/sell-orders/cancel/${id}`)
           set({ isLoading: false})
           return toast.success('Sell order canceled successfully') 
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Something went wrong')
        }
    },
    reinvestInvestment: async(id)=>{
        set({isLoading: true, error:null})
        try {
            await axios.post(`/investments/reinvest`, {investmentId: id})
           set({ isLoading: false})
           return toast.success('Reinvestment successful') 
        } catch (error) {
            set({isLoading: false})
            return toast.error(error.response.data.message || 'Something went wrong')
        }
    },
}))
