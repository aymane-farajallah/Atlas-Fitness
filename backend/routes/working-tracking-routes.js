const express = require("express");
const workoutRouter = express.Router();
const {
  createWorkout,
  getWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workout-tracking-controllers");
//get all workouts
workoutRouter.get("/workout", getWorkouts);
// get a specific workout
workoutRouter.get("/workout:id", getWorkout);
// post a workout
workoutRouter.post("/workout", createWorkout);
// delete a workout
workoutRouter.delete("/workout:id", deleteWorkout);
//update a part of a workout
workoutRouter.patch("/workout:id", updateWorkout);

module.exports = workoutRouter;
