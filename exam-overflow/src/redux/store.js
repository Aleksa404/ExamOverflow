import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import userReducer from "./reducers/userReducer";
import examPapersReducer from "./reducers/examPapersReducer";
import questionsReducer from "./reducers/questionsReducer";
import answersReducer from "./reducers/answersReducer";
import profileReducer from "./reducers/profileReducer";
import courseReducer from "./reducers/courseReducer";

const initialState = {};

const middleware = [thunk];

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const reducers = combineReducers({
  user: userReducer,
  examPapers: examPapersReducer,
  questions: questionsReducer,
  answers: answersReducer,
  profile: profileReducer,
  course: courseReducer,
});

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const store = createStore(reducers, initialState, enhancer);

export default store;
