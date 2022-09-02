import { store } from "../store/configureStore";
//import { logout } from "../store/user/userActions";
//import { checkTokenExpiry } from "./apiCallFunctions";

export const isLoggedIn = () => store.getState().user.isLoggedIn;


export const isTutee = () => store.getState().user.user.user.type === "tutee";

export const isViewedTutorSet = () => store.getState().viewedTutor.viewedTutor !== null;

export const isViewedTuteeSet = () => store.getState().viewedTutee.viewedTutee !== null;

export const isProfileSetUp = () => store.getState().user.hasSetupUpProfile;