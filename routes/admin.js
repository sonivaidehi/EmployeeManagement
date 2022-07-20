/**
 * index.js
 * @description :: route file of department
 */

const express = require("express");
const router = express.Router();
const { ROLE } = require("../config/constant");
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
// route for admin login
router.route("/admin/login").post(adminController.login);

// route for creating new admin user
router.route("/admin/create").post(adminController.addAdmin);

// route for creating a new department
router
  .route("/admin/department/create")
  .post(auth(ROLE.ADMIN), adminController.addDepartment);

// route for assigning a department
router
  .route("/admin/assign-department")
  .put(auth(ROLE.ADMIN), adminController.assignDepartmentToEmployee);

module.exports = router;
