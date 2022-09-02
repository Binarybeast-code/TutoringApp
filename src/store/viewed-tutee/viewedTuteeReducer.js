import { VIEWED_TUTEE_SET, VIEWED_TUTEE_CLEARED } from "./viewedTuteeActions";

export default function viewedTuteeReducer(state = { viewedTutee: null }, action) {

  switch (action.type) {

    case VIEWED_TUTEE_SET:
      return { ...state, viewedTutee: action.payload };

    case VIEWED_TUTEE_CLEARED:
      return { viewedTutee: null };

    default:
      return state;

  }

}