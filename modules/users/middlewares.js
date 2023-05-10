import dotenv from "dotenv";
import passport from "passport";
import multer from "multer";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Users } from "./model.js";

dotenv.config();

const strategyOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(strategyOptions, (payload, done) => {
    Users.findOne({ _id: payload.id })
      .then((user) =>
        !user ? done(new Error("User not existing")) : done(null, user)
      )
      .catch(done);
  })
);

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user || error)
      return res.status(401).json({ message: "Not authorized" });

    if (token !== user.token)
      return res.status(401).json({ message: "Not authorized" });

    req.user = user;
    next();
  })(req, res, next);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}_avatar.jpg`);
  },
});

export const upload = multer({ storage: storage });
