/**
 * index.js
 * @description :: route file of department
 */

const express = require("express");
const router = express.Router();
const { ROLE } = require("../config/constant");
const employeeController = require("../controllers/employeeController");
const auth = require("../middleware/auth");

// route for employee login
router.route("/employee/login").post(employeeController.login);

// route for creating a new employee user
router.route("/employee/create").post(employeeController.addEmployee);

// route for fetching department information of an employee
router
  .route("/employee/get-department/:id")
  .get(auth(ROLE.EMPLOYEE), employeeController.detailsOfAssignedDepartment);

// route for fetching co-workers of an employee
router
  .route("/employee/get-coworker/:id")
  .get(auth(ROLE.EMPLOYEE), employeeController.getEmployeeCoworkers);

module.exports = router;
