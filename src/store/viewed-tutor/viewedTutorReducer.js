import {
  VIEWED_TUTOR_SET, VIEWED_TUTOR_CLEARED, VIEWED_TUTOR_RATED, VIEWED_TUTOR_AVAILABILITY_UPDATED_REMOTELY,
  VIEWED_TUTOR_AVAILABILITY_UPDATED, VIEWED_TUTOR_APPOINTMENT_BOOKED, VIEWED_TUTOR_APPOINTMENT_CANCELED
} from "./viewedTutorActions";
import moment from 'moment';
import { convertTimeSlotToSingleHours } from "../../util/scheduleFunctions";

export default function viewedTutorReducer(state = { viewedTutor: null }, action) {

  switch (action.type) {
    case VIEWED_TUTOR_SET:
      return { ...state, viewedTutor: action.payload };

    case VIEWED_TUTOR_CLEARED:
      return { viewedTutor: null };

    case VIEWED_TUTOR_RATED:
      return { ...state, viewedTutor: { ...state.viewedTutor, rating: action.payload } }

    case VIEWED_TUTOR_AVAILABILITY_UPDATED_REMOTELY:
      return { ...state, viewedTutor: { ...state.viewedTutor, availableHours: action.payload } }

    case VIEWED_TUTOR_AVAILABILITY_UPDATED:
      let copiedAvailableHours = state.viewedTutor.availableHours.slice();
      copiedAvailableHours = copiedAvailableHours.filter((hour) => !action.payload.some((cancelHour) =>
        moment(hour).isSame(moment(cancelHour))));
      return { ...state, viewedTutor: { ...state.viewedTutor, availableHours: copiedAvailableHours } };

    case VIEWED_TUTOR_APPOINTMENT_BOOKED:
      let copiedNewAppointments = state.viewedTutor.appointments.slice();
      copiedNewAppointments.push(action.payload);
      return { ...state, viewedTutor: { ...state.viewedTutor, appointments: copiedNewAppointments } };

    case VIEWED_TUTOR_APPOINTMENT_CANCELED:
      let updatedOpenHours = state.viewedTutor.availableHours.concat(convertTimeSlotToSingleHours(action.payload));

      let deletedAppointments = state.viewedTutor.appointments.filter((appointment) => !(appointment._id === action.payload._id));
      return {
        ...state, viewedTutor: {
          ...state.viewedTutor,
          availableHours: updatedOpenHours,
          appointments: deletedAppointments
        }
      }

    default:
      return state;
  }

}