const Workout = require("../models/workout-tracking");
const mongoose = require("mongoose");

//get all workouts
const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({}).sort({ createdAt: -1 });
  res.status(200).json(workouts);
};

// get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no workout found" });
  }
  const workout = await Workout.findById(id);
  if (workout) {
    res.status(200).json(workout);
  } else {
    return res.status(404).json({ error: "workout not found :( " });
  }
};
// create a new workout
const createWorkout = async (req, res) => {
  const { title, load, reps } = req.body;
  try {
    const workout = await Workout.create({ title, load, reps });
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no workout found" });
  }
  const workout = await Workout.findOneAndDelete({ _id: id });
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "no workout found" });
  }
  res.status(200).json(workout);
};
// update workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no workout found" });
  }
  const workout = await Workout.findOneAndUpdate({ _id: id }, { ...req.body });
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "no workout found" });
  }
  res.status(200).json(workout);
};

module.exports = {
  createWorkout,
  getWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
};
