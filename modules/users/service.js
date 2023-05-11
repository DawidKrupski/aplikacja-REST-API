import { Users } from "./model.js";

export const emailInUse = (email) => Users.findOne({ email });

export const register = (email, password, avatarURL) =>
  Users.create({ email, password, avatarURL });

export const subscription = (id, { subscription }) =>
  Users.findByIdAndUpdate({ _id: id }, { subscription });
