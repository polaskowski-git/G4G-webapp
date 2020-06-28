import * as passport from "passport";
import { Request, Response } from "express";

export const authorize = passport.authenticate('local', { 
  failureRedirect: '/auth/login',
  failureFlash: "Invalid username or password." 
});

export function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/auth/login');
}

export function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}
