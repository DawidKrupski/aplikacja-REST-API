// const { beforeEach, describe, expect, test } = require("@jest/globals");
// const { userLogin, userRegister } = require("./controller.js");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();

// beforeAll(async () => {
//   await mongoose.connect(process.env.SECRET_URL, {
//     dbName: "db-contacts",
//   });
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("userRegister", () => {
//   let users = {};
//   it("should add a new user to the users array", () => {
//     const user = userRegister("Alice", "alice@example.com", "password");
//     expect(users).toContain(user);
//   });

//   it("should throw an error if a user with the same email already exists", () => {
//     expect(() => userRegister("Bob", "alice@example.com", "password")).toThrow(
//       "User already exists"
//     );
//   });
// });

// describe("userLogin", () => {
//   let users = {};
//   beforeEach(() => {
//     userRegister("Alice", "alice@example.com", "password");
//   });

//   it("should return the user if email and password match", () => {
//     const user = userLogin("alice@example.com", "password");
//     expect(user.name).toBe("Alice");
//   });

//   it("should throw an error if user does not exist", () => {
//     expect(() => userLogin("bob@example.com", "password")).toThrow(
//       "User not found"
//     );
//   });

//   it("should throw an error if password is incorrect", () => {
//     expect(() => userLogin("alice@example.com", "wrongpassword")).toThrow(
//       "Incorrect password"
//     );
//   });
// });
