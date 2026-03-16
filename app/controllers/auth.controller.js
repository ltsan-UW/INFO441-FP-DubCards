import UserModel from "../models/User.model.js";

// GET /auth/signin
export function signIn(req, res, next) {
    return req.authContext.login({
        postLoginRedirectUri: "/auth/callback",
    })(req, res, next);
}

// GET /auth/callback
export async function callback(req, res) {
    try {
        if (!req.authContext?.isAuthenticated()) {
            return res.status(401).send({ status: "error", error: "not logged in" });
        }
        const account = req.authContext.getAccount();
        const username = account.username.split("@")[0];
        let user = await UserModel.findOne({ email: account.username });
        if (!user) {
            user = new UserModel({
                username: username,
                email: account.username,
                password: "",
                currency:  500,
                createdAt: Date.now(),
                inventory: [],
                favorites: [],
            });
            await user.save();
            //console.log(`Created new user: ${username}`);
        }
        res.redirect("/")
    } catch (error) {
        console.error("Error connecting to DB:", error);
        res.status(500).send({ status: "error", error });
    }
}

// GET /auth/signout
export function signOut(req, res, next) {
    return req.authContext.logout({
        postLogoutRedirectUri: "/",
    })(req, res, next);
}

// GET /auth/user
export function getUser(req, res, next) {
  if (req.authContext?.isAuthenticated()) {
    const account = req.authContext?.getAccount();
    res.json({
      status: "loggedin",
      userInfo: {
        name: account.name,
        username: account.username,
      }
    });
  } else res.json({ status: "loggedout" });
}