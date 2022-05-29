import http from "./http-common";

const create= (schedule) => {
  debugger;
  return http.post("/Scheduling/scheduling", schedule);
};

const SchedulingService = {
    create,
};


export default SchedulingService;