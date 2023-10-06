const jwt = require("jsonwebtoken");

const signToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRATION_DATE,
    });

    return token;
};

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    cookieOptions = {
        expires: new Date(
            Date.now() +
                process.env.COOKIE_EXPIRATION_DATE * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
    }

    res.cookie("jwt", token, cookieOptions);

    // Remove sensitive data
    user.role = undefined;
    user.password = undefined;
    user.createdAt = undefined;
    user.active = undefined;
    user.email = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

module.exports = createAndSendToken;
