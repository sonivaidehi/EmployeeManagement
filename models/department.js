/**
 * department.js
 * @description :: model of a database collection Department
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    code: {
      type: String,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date },

    updatedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

departmentSchema.pre("save", async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  next();
});

departmentSchema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object.password;
  return object;
});

const department = mongoose.model('department', departmentSchema);
module.exports = department;