const express = require("express");
const {isAuthenticated} = require('../middlewares/protectRoute');
const workoutRouter = express.Router();
const {
  createWorkout,
  getWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workout-tracking-controllers");

//get all workouts
workoutRouter.get("/workouts", isAuthenticated, getWorkouts);
// get a specific workout
workoutRouter.get("/workout:id", isAuthenticated, getWorkout);
// post a workout
workoutRouter.post("/postworkout", isAuthenticated, createWorkout);
// delete a workout
workoutRouter.delete("/workout:id", isAuthenticated, deleteWorkout);
//update a part of a workout
workoutRouter.patch("/workout:id", isAuthenticated, updateWorkout);

module.exports = workoutRouter;
