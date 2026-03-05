/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { Dispatch, AnyAction } from '@reduxjs/toolkit'
import type { User } from '../../types'
import requests from '../requests/Auth.request'

const { reqLogin, reqRegister, reqGetProfile, reqLogout } = requests

interface AuthState {
    user: User | null
    loading: boolean
    error: string | null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
    } as AuthState,
    reducers: {
        authLoading: (state) => {
            state.loading = true
            state.error = null
        },
        authSuccess: (state, action) => {
            state.user = action.payload
            state.loading = false
        },
        authFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        authLogout: (state) => {
            state.user = null
            state.loading = false
            state.error = null
        },
    },
})

const { actions, reducer } = authSlice

export const { authLoading, authSuccess, authFailure, authLogout } = actions

export const loginUser = (email: string, password: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(authLoading())
    const [error, data] = await reqLogin(email, password)
    if (!error && data?.data?.user) {
        dispatch(authSuccess(data.data.user))
    } else {
        dispatch(authFailure('Login failed'))
    }
}

export const registerUser =
    (name: string, email: string, password: string) => async (dispatch: Dispatch<AnyAction>) => {
        dispatch(authLoading())
        const [error, data] = await reqRegister(name, email, password)
        if (!error && data?.data?.user) {
            dispatch(authSuccess(data.data.user))
        } else {
            dispatch(authFailure('Registration failed'))
        }
    }

export const fetchProfile = () => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqGetProfile()
    if (!error && data?.data?.data) {
        dispatch(authSuccess(data.data.data))
    }
}

export const logoutUser = () => async (dispatch: Dispatch<AnyAction>) => {
    await reqLogout()
    dispatch(authLogout())
    localStorage.removeItem('user')
    window.location.href = '/login'
}

export default reducer
