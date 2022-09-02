import { store } from "../store/configureStore";
import {
  userWithProfileLoggedIn,
  userWithoutProfileLoggedIn,
  addToken,
} from "../store/user/userActions";
import { setViewedTutor } from "../store/viewed-tutor/viewedTutorActions";
import { setViewedTutee } from "../store/viewed-tutee/viewedTuteeActions";

export async function checkTokenExpiry() {
  let response = await fetch("api/auth/expiry", {
    method: "GET",
    headers: {
      "x-auth-token": store.getState().user.token,
    },
  });
  console.log("this is the response: " + response);
  response = await response.json();
  console.log(
    "result of the apiCallFunction is: " + response.valid !== undefined
  );
  return response.valid !== undefined;
}

export async function checkURLtokenExpiry(token) {
  let response = await fetch("api/auth/expiry", {
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
  
  response = await response.json();
  console.log("this is the response: " + response);
  console.log(
    "result of the checkURLtokenExpiry is: " + (JSON.stringify(response)));
  return JSON.stringify(response);
}

export async function saveAppointment(appointment) {
  let response = await fetch("api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": store.getState().user.token,
    },
    body: JSON.stringify(appointment),
  });

  response = await response.json();
  return response;
}

export async function deleteAppointment(appointmentId) {
  let response = await fetch(`api/appointments/${appointmentId}`, {
    method: "DELETE",
    headers: {
      "x-auth-token": store.getState().user.token,
    },
  });

  response = await response.json(); // Add response notification later
}

export async function saveTutorAvailableHours(availableHours) {
  fetch("/api/tutors/schedule", {
    method: "POST",
    headers: {
      "X-Auth-Token": store.getState().user.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(availableHours),
  });
}

export async function uploadProfilePicture(imageFile, userType) {
  let formData = new FormData();
  formData.append("image", imageFile);

  let apiRoute =
    userType === "tutor"
      ? "/api/tutors/profile-pic"
      : "/api/tutees/profile-pic";
  console.log(apiRoute);
  let uploadResponse = await fetch(apiRoute, {
    method: "POST",
    headers: { "x-auth-token": store.getState().user.token },
    body: formData,
  });

  uploadResponse = await uploadResponse.json();
  return uploadResponse.profilePic;
}

export async function uploadCoverPicture(imageFile, userType) {
  let formData = new FormData();
  formData.append("image", imageFile);

  let apiRoute =
    userType === "tutor" ? "/api/tutors/cover-pic" : "/api/tutees/cover-pic";
  let uploadResponse = await fetch(apiRoute, {
    method: "POST",
    headers: { "x-auth-token": store.getState().user.token },
    body: formData,
  });

  uploadResponse = await uploadResponse.json();
  return uploadResponse.coverPic;
}

export async function updateUserInformation(updateInfo, userType) {
  let apiRoute = userType === "tutor" ? "/api/tutors" : "/api/tutees";
  let updateResponse = await fetch(apiRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": store.getState().user.token,
    },
    body: JSON.stringify(updateInfo),
  });

  updateResponse = await updateResponse.json();
  return updateResponse;
}

export async function changeForgottenPassword(email) {
  let authResponse = await fetch("/api/users/forgetpswd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });

  authResponse = await authResponse.json();

  return authResponse.errors === undefined ? false : authResponse.errors[0].msg;
}

export async function createAccount(name, email, password, type) {
  let authResponse = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      type: type,
    }),
  });

  authResponse = await authResponse.json();

  return authResponse.errors === undefined ? false : authResponse.errors[0].msg;
}

export async function updateTuteeFavorites(tutorId, shouldAdd) {
  let response = await fetch(`api/tutees/favorites/${tutorId}`, {
    method: shouldAdd ? "PUT" : "DELETE",
    headers: {
      "x-auth-token": store.getState().user.token,
    },
  });

  response = await response.json();
  return response;
}

export async function authenticateAndLoginUser(email, password, userType) {
  let authResponse = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
      type: userType,
    }),
  });

  const status = authResponse.status;
  const responseToken = await authResponse.json();

  if (status === 200) {
    // Valid token is acquired
    addToken(responseToken.token);

    if (responseToken.hasProfile) {
      let user = await logIn(responseToken.token, userType);
      userWithProfileLoggedIn(user);
      return user.msg; // This will be false if there are no errors otherwise it will return the error message
    } else {
      userWithoutProfileLoggedIn(userType);
      return false;
    }
  } else {
    return responseToken.errors[0].message;
  }
}

export async function logIn(token, userType) {
  let apiRoute = userType === "tutor" ? "/api/tutors/me" : "/api/tutees/me";

  let userResponse = await fetch(apiRoute, {
    method: "GET",
    headers: { "x-auth-token": token },
  });

  let user = await userResponse.json();
  user.user.type = userType; // Set user type
  console.log(user);
  return user;
}

export async function addRating(tutorId, rating, currentRatingId) {
  let response = await fetch("api/ratings", {
    method: "POST",
    headers: {
      "x-auth-token": store.getState().user.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tutorId: tutorId,
      rate: rating,
      currentRatingId: currentRatingId,
    }),
  });

  response = await response.json();
  return response;
}

export async function deleteRating(ratingId) {
  let response = await fetch(`api/ratings/${ratingId}`, {
    method: "DELETE",
    headers: { "x-auth-token": store.getState().user.token },
  });

  response = await response.json();
  console.log(response);
  return response;
}

export async function deleteUser(userType) {
  let apiRoute = userType === "tutor" ? "/api/tutors" : "/api/tutees";
  let response = await fetch(apiRoute, {
    method: "DELETE",
    headers: { "x-auth-token": store.getState().user.token },
  });

  response = await response.json();
}

export async function updateEmail(newEmail, password) {
  let response = await fetch("api/users/changeemail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": store.getState().user.token,
    },
    body: JSON.stringify({
      email: newEmail,
      password: password,
    }),
  });

  response = await response.json();
  console.log(response);
  return response;
}

export async function changePassword(currentPassword, newPassword) {
  let response = await fetch("api/users/changepassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": store.getState().user.token,
    },
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
    }),
  });

  response = await response.json();
  console.log(response);
  return response;
}
//function to reset forgotten password
export async function resetForgottenPassword(password, token) {
  let response = await fetch("api/users/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
    body: JSON.stringify({
      password: password,
    }),
  });

  response = await response.json();
  console.log(
    "resetForgottenPassword says that this is the response: " + response
  );
  console.log("resetForgottenPassword says: this is the token: " + token);
  console.log("resetForgottenPassword says: this is the password:" + password);
  return JSON.stringify(response);
}

export async function resetPassword(newPassword) {
  let response = await fetch("api/users/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": store.getState().user.token,
    },
    body: JSON.stringify({
      password: newPassword,
    }),
  });

  response = await response.json();
  console.log("resetPassword says: " + response);
  return response;
}

export async function getAndSetViewedTutor(id) {
  let response = await fetch(`/api/tutors/user/${id}`, {
    method: "GET",
  });

  let viewedTutor = await response.json();
  setViewedTutor(viewedTutor);
}

export async function getAndSetViewedTutee(id) {
  let response = await fetch(`api/tutees/user/${id}`, {
    method: "GET",
  });

  let viewedTutee = await response.json();
  console.log(viewedTutee);
  setViewedTutee(viewedTutee);
}

export async function blockUser(id) {
  console.log(id);
  let response = await fetch(`api/users/block/${id}`, {
    method: "PUT",
    headers: { "x-auth-token": store.getState().user.token },
  });

  response = await response.json();
  console.log(response);
}

export async function unBlockUser(id) {
  let response = await fetch(`api/users/block/${id}`, {
    method: "DELETE",
    headers: { "x-auth-token": store.getState().user.token },
  });

  response = await response.json();
  console.log(response);
}
