const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    async login(_, { username, password }) {
      const user = await User.findOne({
        $or: [{ username: username }, { email: username }]
      });
      if (!user) {
        throw new Error('User not found');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const tokenExpiration = 1; // token expires in 1 hour
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: `${tokenExpiration}h` }
      );

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token,
        tokenExpiration
      };
    },
    async getAllEmployees() {
      try {
        const employees = await Employee.find();
        return employees;
      } catch (err) {
        throw new Error('Failed to fetch employees');
      }
    },
  },
  Mutation: {
    async signup(_, { username, email, password }) {
      const existingUser = await User.findOne({
        $or: [{ username: username }, { email: email }]
      });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });
      const result = await newUser.save();

      // Don't return the password
      return {
        id: result.id,
        username: result.username,
        email: result.email
      };
    },
    async addNewEmployee(_, { first_name, last_name, email, gender, salary }) {
      const existingEmployee = await Employee.findOne({ email: email });
      if (existingEmployee) {
        throw new Error('Employee with this email already exists');
      }
      const newEmployee = new Employee({
        first_name,
        last_name,
        email,
        gender,
        salary
      });
      const result = await newEmployee.save();

      return {
        id: result.id,
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
        gender: result.gender,
        salary: result.salary
      };
    },
  },
};

module.exports = resolvers;