import { combineReducers, configureStore } from '@reduxjs/toolkit'
import BlogsReducer from './actions/Blogs.actions'
import AuthReducer from './actions/Auth.actions'
import CategoriesReducer from './actions/Categories.actions'
import CommentsReducer from './actions/Comments.actions'
import LikesReducer from './actions/Likes.actions'
import MarketReducer from './actions/Market.actions'
import TagsReducer from './actions/Tags.actions'

/** Combined root reducer — typed separately to avoid circular RootState inference */
const rootReducer = combineReducers({
    blogs: BlogsReducer,
    auth: AuthReducer,
    categories: CategoriesReducer,
    comments: CommentsReducer,
    likes: LikesReducer,
    market: MarketReducer,
    tags: TagsReducer,
})

/** Inferred root state type from all reducers */
export type RootState = ReturnType<typeof rootReducer>

/** Typed dispatch that supports thunks */
export type AppDispatch = ReturnType<typeof newStore>['dispatch']

export function newStore(preloadedState?: Partial<RootState>) {
    return configureStore({ reducer: rootReducer, preloadedState })
}

const store = newStore()

export default store
