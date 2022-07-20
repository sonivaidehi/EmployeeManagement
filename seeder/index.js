const bcrypt = require("bcrypt");
const User = require("../models/user");
const Department = require("../models/department");
const dbService = require("../utils/dbService");
const { ROLE } = require("../config/constant");
const seedUsers = async () => {
  try {
    let admin = {
      username: "admin",
      name: "Admin User",
      role: ROLE.ADMIN,
      email: "admin@gmail.com",
      phone: "9949932890",
      password: "admin@123",
    };
    admin.password = await bcrypt.hash(admin.password, 8);
    await dbService.updateOne(User, { username: "admin" }, admin, {
      upsert: true,
    });

    const employee = {
      username: "john_doe",
      name: "John Doe",
      role: ROLE.EMPLOYEE,
      email: "john@gmail.com",
      phone: "8977868679",
      password: "user@123",
    };
    employee.password = await bcrypt.hash(employee.password, 8);
    await dbService.updateOne(User, { username: "john_doe" }, employee, {
      upsert: true,
    });
    console.log("Users seeded!");
  } catch (error) {
    throw new Error(error.message);
  }
};

const seedDepartments = async () => {
  try {
    await dbService.updateOne(
      Department,
      { code: "IT" },
      {
        name: "IT Department",
        code: "IT",
        email: "it@gmail.com",
      },
      {
        upsert: true,
      }
    );
    await dbService.updateOne(
      Department,
      { code: "FINANCE" },
      {
        name: "Finance Department",
        code: "FINANCE",
        email: "finance@gmail.com",
      },
      {
        upsert: true,
      }
    );
    console.log("Departments Seeded!");
  } catch (error) {
    throw new Error(error.message);
  }
};

const seedData = async () => {
  // seeding of users
  await seedUsers();
  // seeding of department
  await seedDepartments();
};

module.exports = { seedData };
