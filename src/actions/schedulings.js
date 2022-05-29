
import { CREATE_SCHEDULE } from "../types/type";
import SchedulingDataService from "../services/SchedulingService.js";

export const createSchedule = (schedule) => async (dispatch) => {
  debugger;
  try {
    const res = await SchedulingDataService.create(schedule);
    dispatch({
      type: CREATE_SCHEDULE,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    return err;
  }
}
