/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { Dispatch, AnyAction } from '@reduxjs/toolkit'
import type { Category } from '../../types'
import requests from '../requests/Categories.request'

const { reqGetAllCategories } = requests

interface CategoriesState {
    categories: Category[]
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
    } as CategoriesState,
    reducers: {
        categoriesSuccess: (state, action) => {
            state.categories = action.payload
        },
    },
})

const { actions, reducer } = categoriesSlice

export const { categoriesSuccess } = actions

export const fetchCategories = () => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqGetAllCategories()
    if (!error && data?.data?.data) {
        dispatch(categoriesSuccess(data.data.data))
    }
}

export default reducer
