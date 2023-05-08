import { Users } from "./model.js";

export const emailInUse = (email) => Users.findOne({ email });

export const register = (email, password) => Users.create({ email, password });

export const subscription = (id, { subscription }) =>
  Users.findByIdAndUpdate({ _id: id }, { subscription });
