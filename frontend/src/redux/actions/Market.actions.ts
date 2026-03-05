/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { Dispatch, AnyAction } from '@reduxjs/toolkit'
import type { CryptoCoin } from '../../types'
import requests from '../requests/Market.request'

const { reqGetCryptoData, reqGetStockData } = requests

interface MarketState {
    crypto: CryptoCoin[]
    stocks: unknown[]
}

const marketSlice = createSlice({
    name: 'market',
    initialState: {
        crypto: [],
        stocks: [],
    } as MarketState,
    reducers: {
        cryptoSuccess: (state, action) => {
            state.crypto = action.payload
        },
        stocksSuccess: (state, action) => {
            state.stocks = action.payload
        },
    },
})

const { actions, reducer } = marketSlice

export const { cryptoSuccess, stocksSuccess } = actions

export const fetchCryptoData = () => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqGetCryptoData()
    if (!error && data?.data?.data) {
        dispatch(cryptoSuccess(data.data.data))
    }
}

export const fetchStockData = () => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqGetStockData()
    if (!error && data?.data?.data) {
        dispatch(stocksSuccess(data.data.data))
    }
}

export default reducer
