/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { Dispatch, AnyAction } from '@reduxjs/toolkit'
import type { Comment } from '../../types'
import requests from '../requests/Comments.request'

const { reqGetCommentsByBlog, reqCreateComment } = requests

interface CommentsState {
    comments: Comment[]
}

const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
    } as CommentsState,
    reducers: {
        commentsSuccess: (state, action) => {
            state.comments = action.payload
        },
        commentAdded: (state, action) => {
            state.comments.push(action.payload)
        },
    },
})

const { actions, reducer } = commentsSlice

export const { commentsSuccess, commentAdded } = actions

export const fetchComments = (blogId: string) => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqGetCommentsByBlog(blogId)
    if (!error && data?.data?.data) {
        dispatch(commentsSuccess(data.data.data))
    }
}

export const addComment =
    (payload: { blog_id: string; content: string; parent_id?: string }) =>
        async (dispatch: Dispatch<AnyAction>) => {
            const [error, data] = await reqCreateComment(payload)
            if (!error && data?.data?.data) {
                dispatch(commentAdded(data.data.data))
            }
        }

export default reducer
