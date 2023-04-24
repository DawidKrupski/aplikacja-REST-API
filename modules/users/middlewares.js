import dotenv from "dotenv";
import passport from "passport";
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
      .then(([user]) =>
        !user ? done(new Error("User not existing")) : done(null, user)
      )
      .catch(done);
  })
);

export const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user || error)
      return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    next();
  })(req, res, next);
};
