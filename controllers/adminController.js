const dbService = require("../utils/dbService");
const departmentSchemaKey = require("../utils/validation/departmentValidation");
const validator = require("../utils/validation/validator");
const Department = require("../models/department");
const User = require("../models/user");
const userSchemaKey = require("../utils/validation/userValidation")
const { isEmpty } = require("lodash");
const { ROLE } = require("../config/constant");
const authService = require("../services/auth")

/**
 * @description : Method to authenticate Admin user.
 * @param {Object} req : request including body containing username & password
 * @param {Object} res : response of authentication
 * @return {Object} : Validated admin information with JWT token
 */
const login = async (req, res)=>{
  try {
    const params = req.body;
    if(isEmpty(params.username) || isEmpty(params.password)){
      return res.badRequest({message: "username or password is missing."});
    }
    let result = await authService.loginUser(params.username, params.password, ROLE.ADMIN);
    if(result.errorFlag){
      return res.badRequest({ message: result.data})
    }
    return res.success({
      data: result.data,
      message: "Login Successful"
    })
  } catch (error) {
    return res.internalServerError({message: error.message})
  }
}

/**
 * @description : Create document of User with "ADMIN" as a role in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document.
 * @return {Object} : created user of role "ADMIN". {status, message, data}
 */
const addAdmin = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };
    let validateRequest = validator.validateParamsWithJoi(
      dataToCreate,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    if(!dataToCreate.password){
      dataToCreate.password = 'Test@123'
    }
    dataToCreate.role = ROLE.ADMIN;
    dataToCreate = new User(dataToCreate);
    let createdUser = await dbService.create(User, dataToCreate);
    return res.success({ data: createdUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : create document of Department in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Department. {status, message, data}
 */
const addDepartment = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };
    let validateRequest = validator.validateParamsWithJoi(
      dataToCreate,
      departmentSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    //   dataToCreate.addedBy = req.user.id;
    dataToCreate = new Department(dataToCreate);
    let createdDepartment = await dbService.create(Department, dataToCreate);
    return res.success({ data: createdDepartment });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : To assign Department to an employee.
 * @param {Object} req : request including body with employeeUsername & departmentCode.
 * @param {Object} res : response of assigned department to employee
 * @return {Object} : updated employee with assigned department. {status, message, data}
 */
const assignDepartmentToEmployee = async (req, res) => {
  try {
    const params = req.body;
    if (isEmpty(params.employeeUsername) || isEmpty(params.departmentCode)) {
      return res.badRequest({
        message: `Request body requires 'employeeUsername' & 'departmentCode'.`,
      });
    }
    const department = await dbService.findOne(Department, {
      code: params.departmentCode,
      isActive: true,
      isDeleted: false,
    });
    if (!department) {
      return res.recordNotFound({ message: "Department not found. " });
    }
    const { ROLE } = require("../config/constant");
    const filter = {
      $or:[{username: params.employeeUsername},{ email: params.employeeUsername}],
      role: ROLE.EMPLOYEE,
      isActive: true,
      isDeleted: false,
    };
    const user = await dbService.findOne(User, filter);
    if (!user) {
      return res.recordNotFound({ message: "User not found. " });
    }
    const updatedUser = await dbService.updateOne(User, filter, {
      departmentId: department.id,
    });
    return res.success({ data: updatedUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  login,
  addAdmin,
  addDepartment,
  assignDepartmentToEmployee,
};
