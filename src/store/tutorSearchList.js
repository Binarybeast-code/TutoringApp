import { createAction } from "@reduxjs/toolkit";
import { produce } from "immer";

//Actions
export const addTutors = createAction("ADD_TUTOR");
export const deleteTutors = createAction("CLEAR_TUTORS");

//Reducer
export default function tutorSearchListReducer(state = { tutors: [] }, action) {
  switch (action.type) {
    //when dispatched, this action simply assigns the object (action.payload) to the global state
    case addTutors.type:
      return produce(state, (draftState) => {
        draftState.tutors = action.payload;
      });

    case deleteTutors.type:
      return produce(state, (draftState) => {
        draftState.tutors.length = 0; //clear the array
      });

    default:
      return state;
  }
}
