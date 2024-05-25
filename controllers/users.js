const User = require("../models/user");

module.exports.rendersignupform = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.Signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        // req.login(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
                }
                req.flash("Success", "Welcome to Wonderlust");
                res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm =  (req, res ) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res ) => {
    req.flash("Welcome back to Wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
};