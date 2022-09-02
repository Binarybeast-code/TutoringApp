import { updateStore, store } from "../configureStore";
import { cancelViewedTutorAppointment, clearViewedTutor } from "../viewed-tutor/viewedTutorActions";
import { clearViewedTutee } from "../viewed-tutee/viewedTuteeActions";
import { isViewedTutorSet } from "../../util/authenticationFunctions";

// General user actions
export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const USER_WITHOUT_PROFILE_LOGGED_IN = "USER_WITHOUT_PROFILE_LOGGED_IN";
export const TOKEN_ACQUIRED = "TOKEN_ACQUIRED";
export const USER_INFO_UPDATED = "USER_INFO_UPDATED";
export const USER_UPDATED_PROFILE_AND_COVER = "USER_UPDATED_PROFILE_AND_COVER";
export const USER_IMAGE_UPDATED = "USER_IMAGE_UPDATED";
export const USER_COVER_UPDATED = "USER_COVER_UPDATED";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";
export const USER_ADDED_TO_FAVORITES = "USER_ADDED_TO_FAVORITES";
export const USER_REMOVED_FAVORITE = "USER_REMOVED_FAVORITE";
export const USER_RATED_TUTOR = "USER_RATED_TUTOR";
export const USER_REMOVED_RATING = "USER_REMOVED_RATING";
export const USER_BLOCKED_SOMEONE = "USER_BLOCKED_SOMEONE";
export const USER_UNBLOCKED_SOMEONE = "USER_UNBLOCKED_SOMEONE";
// Schedule specific actions
export const AVAILABILITY_OPENED = "AVAILABILITY_OPENED";
export const AVAILABILITY_CANCELED = "AVAILABILITY_CANCELED";
export const APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED";
export const APPOINTMENT_CANCELED = "APPOINTMENT_CANCELED";
export const AVAILABILITY_UPDATED = "AVAILABILITY_UPDATED";
export const APPOINTMENTS_UPDATED = "APPOINTMENTS_UPDATED";

export function updateAvailability(availability) {
  updateStore(AVAILABILITY_UPDATED, availability);
}

export function updateAppointments(appointments) {
  updateStore(APPOINTMENTS_UPDATED, appointments);
}

export function addRatingToTutor(rating) {
  updateStore(USER_RATED_TUTOR, rating);
}

export function addToBlockList(id) {
  updateStore(USER_BLOCKED_SOMEONE, id);
}

export function removeFromBlockList(id) {
  updateStore(USER_UNBLOCKED_SOMEONE, id);
}

export function removeRating(rating) {
  updateStore(USER_REMOVED_RATING, rating);
}

export function addTutorToFavorites(tutor) {
  updateStore(USER_ADDED_TO_FAVORITES, tutor);
}

export function removeTutorFromFavorites(tutorId) {
  updateStore(USER_REMOVED_FAVORITE, tutorId);
}

export function userWithProfileLoggedIn(user) {
  updateStore(USER_LOGGED_IN, { user: user });
}

export function userWithoutProfileLoggedIn(userType) {
  updateStore(USER_WITHOUT_PROFILE_LOGGED_IN, { type: userType });
}

export function addToken(token) {
  updateStore(TOKEN_ACQUIRED, { token: token });
}

export function logout() {
  updateStore(USER_LOGGED_OUT);
  clearViewedTutee();
  clearViewedTutor();
}

export function changeProfileAndCoverImage(profilePic, coverPic) {
  updateStore(USER_UPDATED_PROFILE_AND_COVER, { profilePic, coverPic });
}

export function changeUserImage(profilePic) {
  updateStore(USER_IMAGE_UPDATED, profilePic);
}

export function changeUserCoverImage(coverPic) {
  updateStore(USER_COVER_UPDATED, coverPic);
}

export function cancelAppointment(appointment) {
  updateStore(APPOINTMENT_CANCELED, appointment);

  if (isViewedTutorSet() && store.getState().viewedTutor.viewedTutor._id === appointment.tutor.id)
    cancelViewedTutorAppointment(appointment); // Clear the viewed tutor appointment to keep page responsive
}

export function updateUser(updateInfo) {
  updateStore(USER_INFO_UPDATED, updateInfo);
}

export function openAvailabilityHour(availabilityDate) {
  updateStore(AVAILABILITY_OPENED, availabilityDate);
}

export function bookAppointment(appointment) {
  updateStore(APPOINTMENT_BOOKED, appointment);
}
