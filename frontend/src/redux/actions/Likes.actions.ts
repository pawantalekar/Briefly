/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { Dispatch, AnyAction } from '@reduxjs/toolkit'
import requests from '../requests/Likes.request'

const { reqToggleLike, reqGetLikeStatus } = requests

interface LikeStatus {
    likes_count: number
    user_liked: boolean
}

interface LikesState {
    likeStatus: LikeStatus | null
}

const likesSlice = createSlice({
    name: 'likes',
    initialState: {
        likeStatus: null,
    } as LikesState,
    reducers: {
        likeStatusSuccess: (state, action) => {
            state.likeStatus = action.payload
        },
    },
})

const { actions, reducer } = likesSlice

export const { likeStatusSuccess } = actions

export const fetchLikeStatus = (blogId: string) => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqGetLikeStatus(blogId)
    if (!error && data?.data?.data) {
        dispatch(likeStatusSuccess(data.data.data))
    }
}

export const toggleLike = (blogId: string) => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqToggleLike(blogId)
    if (!error && data?.data?.data) {
        const { liked, likes_count } = data.data.data
        dispatch(likeStatusSuccess({ likes_count, user_liked: liked }))
    }
}

export default reducer
