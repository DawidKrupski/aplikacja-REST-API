import { userAvatar } from "./controller.js";
import { Users } from "./model.js";

export const emailInUse = (email) => Users.findOne({ email });

export const register = (email, password, avatarURL, verificationToken) =>
  Users.create({ email, password, avatarURL, verificationToken });

export const subscription = (id, { subscription }) =>
  Users.findByIdAndUpdate({ _id: id }, { subscription });

export const verify = (verificationToken) =>
  Users.findOne({ verificationToken });

export const emailConfig = (email, verificationURL) => ({
  from: "dawid.krupski323@gmail.com",
  to: email,
  subject: "Account verification",
  text: "Please click the following link to verify your email address:",
  html: `<p>Please click <a href="${verificationURL}">here</a> to verify your email address.</p>`,
});
