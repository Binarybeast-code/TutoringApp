import { updateStore } from '../configureStore';

export const VIEWED_TUTEE_SET = "VIEWED_TUTEE_SET";
export const VIEWED_TUTEE_CLEARED = "VIEWED_TUTEE_CLEARED";

export async function setViewedTutee(viewedTUTEE) {
    updateStore(VIEWED_TUTEE_SET, viewedTUTEE);
}

export function clearViewedTutee() {
    updateStore(VIEWED_TUTEE_CLEARED);
}

