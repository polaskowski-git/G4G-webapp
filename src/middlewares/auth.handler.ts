import passport from "passport";
import { ForbiddenException } from "../constants/exceptions";

export const authorize = passport.authenticate('local', {
  failureRedirect: '/auth/login',
  failureFlash: "Invalid username or password."
});

export const authorizeApi = passport.authenticate('local', {
  session: false
});

export function checkAuthenticated(req, res, next) {
    passport.authenticate("headerapikey")(req, res, function() {
      if (req.user) {
         return next();
      }

      next(new ForbiddenException());
    });
}

export function checkNotAuthenticated(req, res, next) {
  if (req.user) {
    next(new ForbiddenException());
  }

  next();
}
