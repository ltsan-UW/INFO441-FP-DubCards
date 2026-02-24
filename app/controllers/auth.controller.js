// POST /auth/login
export function login(req, res) {
    res.send("To-do endpoint");
}

// GET /auth/signUp
export function signUp(req, res) {
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