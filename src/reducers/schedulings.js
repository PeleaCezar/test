import { CREATE_SCHEDULE, DELETE_SCHEDULE, UPDATE_SCHEDULE} from "../types/type";

const initialState = [];
function schedulingReducer(schedulings = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_SCHEDULE:
      return [...schedulings, payload];
    case UPDATE_SCHEDULE:
      return schedulings.map((scheduling) => {
        if (scheduling.id === payload.id) {
          return {
            ...scheduling,
            ...payload,
          };
        } else {
          return scheduling;
        }
      });
    case DELETE_SCHEDULE:
      return schedulings.filter(({ id }) => id !== payload.id);
    default:
      return schedulings;
  }
}
export default schedulingReducer;