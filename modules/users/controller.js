import * as UsersService from "./service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = async (pwd) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(pwd, salt);

  return hash;
};

const validatePassword = (pwd, hash) => bcrypt.compare(pwd, hash);

export const userRegister = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Validation error" });

  const isEmailExist = await UsersService.emailInUse(email);

  if (isEmailExist) return res.status(409).json({ message: "Email in use" });

  const hashedPassword = await hashPassword(password);

  const user = await UsersService.register(email, hashedPassword);

  return res
    .status(201)
    .json({ email: user.email, subscription: user.subscription });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await UsersService.emailInUse(email);
  const isValidPassword = await validatePassword(password, user.password);

  if (!user || !isValidPassword)
    return res.status(401).json({ message: "Email or password is wrong" });

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
    user: { email: user.email, subscription: user.subscription },
  });
};

export const getSecret = async (req, res) => {
  const { username } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      message: `Authorization was successful: ${username}`,
    },
  });
};
