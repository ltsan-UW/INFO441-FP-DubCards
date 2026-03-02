// GET /auth/register
export function register(req, res) {
    res.send("To-do endpoint");
}

// GET /auth/signin
export function signIn(req, res, next) {
    return req.authContext.login({
        postLoginRedirectUri: "/",
    })(req, res, next);
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
        username: account.username
      }
    });
  } else res.json({ status: "loggedout" });
}