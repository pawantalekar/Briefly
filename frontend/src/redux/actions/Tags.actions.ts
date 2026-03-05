/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { Dispatch, AnyAction } from '@reduxjs/toolkit'
import type { Tag } from '../../types'
import requests from '../requests/Tags.request'

const { reqGetAllTags, reqCreateTag } = requests

interface TagsState {
    tags: Tag[]
}

const tagsSlice = createSlice({
    name: 'tags',
    initialState: {
        tags: [],
    } as TagsState,
    reducers: {
        tagsSuccess: (state, action) => {
            state.tags = action.payload
        },
        tagAdded: (state, action) => {
            state.tags.push(action.payload)
        },
    },
})

const { actions, reducer } = tagsSlice

export const { tagsSuccess, tagAdded } = actions

export const fetchTags = () => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqGetAllTags()
    if (!error && data?.data?.data) {
        dispatch(tagsSuccess(data.data.data))
    }
}

export const createTag = (name: string) => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqCreateTag(name)
    if (!error && data?.data?.data) {
        dispatch(tagAdded(data.data.data))
    }
}

export default reducer
