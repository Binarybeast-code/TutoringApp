import { combineReducers } from "redux";
import tutorSearchListReducer from "./tutorSearchList";
import userReducer from "./user/userReducer";
import viewedTutorReducer from "./viewed-tutor/viewedTutorReducer";
import viewedTuteeReducer from "./viewed-tutee/viewedTuteeReducer";

// All reducers must be listed here so that they can be combined and associated with the store
export default combineReducers({
  user: userReducer,
  viewedTutor: viewedTutorReducer,
  viewedTutee: viewedTuteeReducer,
  tutorSearchList: tutorSearchListReducer,
});
