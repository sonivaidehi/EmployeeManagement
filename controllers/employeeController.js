const dbService = require("../utils/dbService");
const userSchemaKey = require("../utils/validation/userValidation");
const validator = require("../utils/validation/validator");
const User = require("../models/user");
const Department = require("../models/department")
const { isEmpty } = require("lodash");
const { ROLE} = require('../config/constant')
const authService = require('../services/auth')

/**
 * @description : Method to authenticate Employee user.
 * @param {Object} req : request including body containing username & password
 * @param {Object} res : response of authentication
 * @return {Object} : Validated employee information with JWT token
 */
const login = async (req, res)=>{
  try {
    const params = req.body;
    if(isEmpty(params.username) || isEmpty(params.password)){
      return res.badRequest({message: "username or password is missing."});
    }
    let result = await authService.loginUser(params.username, params.password, ROLE.EMPLOYEE);
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
 * @description : create document of employee in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created employee. {status, message, data}
 */
const addEmployee = async (req, res) => {
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
    dataToCreate.role = ROLE.EMPLOYEE
    dataToCreate = new User(dataToCreate);
    let createdUser = await dbService.create(User, dataToCreate);
    return res.success({ data: createdUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : Method to fetch details of assigned Department.
 * @param {Object} req : request including params containing employeeId
 * @param {Object} res : response with department details
 * @return {Object} : Response with department details
 */
const detailsOfAssignedDepartment = async (req, res)=>{
    try {
        if(isEmpty(req.params.id)){
            return res.badRequest({message: 'employeeId is missing in params.'});
        }
        const filter = {
            _id: req.params.id,
            isActive: true, 
            isDeleted: false
        }
        const employee = await dbService.findOne(User, filter);
        if(isEmpty(employee)) return res.recordNotFound({message: "Employee not found."});
        console.log(employee.departmentId)
        if(!employee.departmentId) return res.success({message: 'Employee has not assigned any department.'})
        const department = await dbService.findOne(Department, {_id: employee.departmentId, isActive: true, isDeleted: false});
        if(isEmpty(department)) return res.recordNotFound({message: "Department not found. "});
        return res.success({data: department})
    } catch (error) {
        return res.internalServerError({message: error.message})
    }
}


/**
 * @description : Method to fetch details of co-workers of employee
 * @param {Object} req : request including params containing employeeId
 * @param {Object} res : response with Array of co-worker employees
 * @return {Object} : Response with Array of co-worker employees
 */
const getEmployeeCoworkers = async (req, res)=>{
    try {
        if(isEmpty(req.params.id)){
            return res.badRequest({message: 'employeeId is missing in params.'});
        }
        const filter = {
            _id: req.params.id,
            isActive: true, 
            isDeleted: false
        }
        const employee = await dbService.findOne(User, filter);
        if(isEmpty(employee)) return res.recordNotFound({message: "Employee not found."});
        if(!employee.departmentId) return res.success({message: 'Employee has not assigned any department, so does not have any co-workers.'})
        const coworkers = await dbService.findMany(User, {
             _id: {$ne: employee.id},
            departmentId: employee.departmentId,
            isActive: true,
            isDeleted: false
        })
        return res.success({data: coworkers})
    } catch (error) {
        return res.internalServerError({message: error.message})
    }
}

module.exports = {
  login,
  addEmployee,
  detailsOfAssignedDepartment,
  getEmployeeCoworkers
};
