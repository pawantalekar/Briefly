/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { Dispatch, AnyAction } from '@reduxjs/toolkit'
import type { Blog, CreateBlogDTO } from '../../types'
import requests from '../requests/Blogs.request'

const { reqGetAllBlogs, reqGetBlogBySlug, reqGetMyBlogs, reqCreateBlog, reqUpdateBlog, reqSearchBlogs } = requests

interface BlogsState {
    blogs: Blog[]
    blogDetail: Blog | null
    myBlogs: Blog[]
    searchResults: Blog[]
}

const blogsSlice = createSlice({
    name: 'blogs',
    initialState: {
        blogs: [],
        blogDetail: null,
        myBlogs: [],
        searchResults: [],
    } as BlogsState,
    reducers: {
        blogsSuccess: (state, action) => {
            state.blogs = action.payload
        },
        blogDetailSuccess: (state, action) => {
            state.blogDetail = action.payload
        },
        myBlogsSuccess: (state, action) => {
            state.myBlogs = action.payload
        },
        searchResultsSuccess: (state, action) => {
            state.searchResults = action.payload
        },
    },
})

const { actions, reducer } = blogsSlice

export const { blogsSuccess, blogDetailSuccess, myBlogsSuccess, searchResultsSuccess } = actions

export const fetchBlogs =
    (params?: { category_id?: string; tag_id?: string; limit?: number; offset?: number }) =>
        async (dispatch: Dispatch<AnyAction>) => {
            const [error, data] = await reqGetAllBlogs(params)
            if (!error && data?.data?.data) {
                dispatch(blogsSuccess(data.data.data))
            }
        }

export const fetchBlogBySlug = (slug: string) => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqGetBlogBySlug(slug)
    if (!error && data?.data?.data) {
        dispatch(blogDetailSuccess(data.data.data))
    }
}

export const fetchMyBlogs = () => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqGetMyBlogs()
    if (!error && data?.data?.data) {
        dispatch(myBlogsSuccess(data.data.data))
    }
}

export const createBlog = (payload: CreateBlogDTO) => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqCreateBlog(payload)
    if (!error && data?.data?.data) {
        dispatch(blogDetailSuccess(data.data.data))
    }
}

export const updateBlog = (id: string, payload: Partial<CreateBlogDTO>) => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqUpdateBlog(id, payload)
    if (!error && data?.data?.data) {
        dispatch(blogDetailSuccess(data.data.data))
    }
}

export const searchBlogs = (query: string) => async (dispatch: Dispatch<AnyAction>) => {
    const [error, data] = await reqSearchBlogs(query)
    if (!error && data?.data?.data) {
        dispatch(searchResultsSuccess(data.data.data))
    }
}

export default reducer
