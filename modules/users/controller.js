import * as UsersService from "./service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";

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

  const url = gravatar.url(email);

  const user = await UsersService.register(email, hashedPassword, url);

  return res.status(201).json({
    email: user.email,
    subscription: user.subscription,
  });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await UsersService.emailInUse(email);
  if (!user)
    return res.status(401).json({ message: "Email or password is wrong" });

  const isValidPassword = await validatePassword(password, user.password);
  if (!isValidPassword)
    return res.status(401).json({ message: "Email or password is wrong" });

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  user.token = token;
  await user.save();

  res.status(200).json({
    data: {
      token,
    },
    user: { email: user.email, subscription: user.subscription },
  });
};

export const userLogout = async (req, res) => {
  req.user.token = null;
  await req.user.save();
  res.status(204).json("No Content");
};

export const userCurrent = async (req, res) => {
  res.status(200).json({
    message: "Authorization was successful",
    user: {
      avatar: req.user.avatarURL,
      email: req.user.email,
      subscription: req.user.subscription,
    },
  });
};

export const userSubscription = async (req, res) => {
  const id = req.user._id;
  const { subscription } = req.body;

  const updateUserSubscription = await UsersService.subscription(id, {
    subscription,
  });

  const validSubscriptions = ["starter", "pro", "business"];
  const value = req.body.subscription;

  if (!validSubscriptions.includes(value))
    return res.status(404).json({ message: "Invalid subscription value" });

  if (!updateUserSubscription)
    return res.status(404).json({ message: "Not found" });

  return res.status(200).json(updateUserSubscription);
};

export const userAvatar = async (req, res) => {
  const { avatarURL } = req.body;
  const id = req.user._id;

  if (!avatarURL) {
    return res.status(400).send("avatarURL is required in the request body");
  }

  Jimp.read(avatarURL, (err, avatar) => {
    if (err) {
      return res.status(500).send(err);
    }

    const avatarName = `${id}_userAvatar.jpg`;
    const avatarDest = "./public/avatars/" + avatarName;

    avatar.resize(250, 250).write(avatarDest, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      const newAvatarURL = `/avatars/${id}_userAvatar.jpg`;
      return res.send({ avatarURL: newAvatarURL });
    });
  });
};
