// POST /auth/login
exports.login = (req, res) => {
    res.send("To-do endpoint");
};

// GET /auth/signUp
exports.signUp = (req, res) => {
    res.send("To-do endpoint");
};

// GET /auth/signin
exports.signIn = (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/",
    })(req, res, next);
};

// GET /auth/signout
exports.signOut = (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/",
    })(req, res, next);
};