const express = require("express");

const app = express();

const PORT = 3000;

const tasksData = require("../task.json");
const tasks = tasksData?.tasks;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is home page of Assignment 1");
});

//Get All tasks
app.get("/tasks", (req, res) => {
  const allTasks = tasks;

  // Handle case where tasks are undefined or empty
  if (!allTasks || allTasks.length === 0) {
    return res.status(404).json({ message: "No tasks found" });
  }

  const { completed, sort } = req.query;
  let filteredTasks = allTasks;

  // Check if the 'completed' query parameter is provided
  if (completed === "true" || completed === "false") {
    const isCompleted = completed === "true"; // Convert to boolean
    filteredTasks = allTasks.filter((task) => task.completed === isCompleted);
    // return res.status(200).json(filteredTasks);
  }

  // Sort tasks by 'createdAt' if the 'sort' query parameter is provided
  if (sort === "asc") {
    filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === "desc") {
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return res.status(200).json(filteredTasks);
});

// Get Single Task
app.get("/tasks/:id", (req, res) => {
  const reqId = req.params.id;
  const taskReq = tasks?.filter((task) => {
    if (task.id == reqId) return task;
  });
  res.send(taskReq);
});

app.get("/tasks/priority/:level", (req, res) => {
  const reqLevel = req.params.level;
  const taskReq = tasks?.filter((task) => {
    if (task.priority === reqLevel) return task;
  });

  if (!taskReq || taskReq.length === 0) {
    return res.status(404).json({ message: "No tasks found" });
  }

  res.send(taskReq);
});

// Create Task
app.post("/tasks", (req, res) => {
  const { title, description, completed, priority } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "Completed must be a boolean" });
  }

  if(priority && !["low", "medium", "high", ""].includes(priority)) {
    return res.status(400).json({ message: "Priority must be low, medium, or high" });
  }

  const newId = tasks?.length + 1;

  const newObj = {
    id: newId,
    title: title,
    description: description,
    completed: completed,
    createdAt: new Date().toISOString(),
    priority: priority || "low", // Default to 'low' if not provided
  };
  tasks?.push(newObj);
  res.status(201).json(newObj);
});

// Update Task
app.put("/tasks/:id", (req, res) => {
  const reqId = parseInt(req.params.id);
  const taskIndex = tasks?.findIndex((task) => task.id === reqId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const data = req.body;

  if (!data?.title || !data?.description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  if (typeof data?.completed !== "boolean") {
    return res.status(400).json({ message: "Completed must be a boolean" });
  }
  const task = tasks[taskIndex];
  task.title = data.title || task.title;
  task.description = data.description || task.description;
  task.completed =
    data.completed !== undefined ? data.completed : task.completed;
  task.priority = data.priority || task.priority; // Update priority if provided
  res.status(200).json(task);
});

// Delete Task
app.delete("/tasks/:id", (req, res) => {
  const reqId = parseInt(req.params.id);
  const taskIndex = tasks?.findIndex((task) => task.id === reqId);


  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  // const removedTask = tasksData.tasks[taskIndex];
  // console.log("Removed Task", removedTask);
  tasks?.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
