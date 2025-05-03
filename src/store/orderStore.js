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
    createSellOrders: async(sellOrderDetails)=>{
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
}))
