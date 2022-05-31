const { tokenVerify } = require("./handleJWT");

const isAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        let error = new Error();
        error.status = 403;
        error.message = "Forbidden. Missing token";
        return next(error);
    }
    // headers.authorization = Bearer + {token}
    const token = req.headers.authorization.split(" ").pop();
    const isValidToken = await tokenVerify(token);
    // if Error: invalid or expired token
    if (isValidToken instanceof Error) {
        let error = new Error();
        error.status = 403;
        error.message = "Forbidden. Invalid token";
        return next(error);
    }
    req.userInfo = isValidToken;
    next();
};

module.exports = isAuth;
