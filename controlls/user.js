const Review = require("../modules/user.js");
const Listing = require("../modules/listing.js");
const User = require("../modules/user.js");

module.exports.signUp=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
        
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    });
    } catch (err) {
        console.error(err);
        req.flash("error", err.message);
        res.redirect("/signUp");
    }
};

module.exports.renderSignUpForm=(req, res) => {
    res.render("users/user.ejs");
};

module.exports.renderLoginForm = async(req,res)=>{
     res.render("users/login.ejs");
};

module.exports.login =  async(req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        res.redirect(res.locals.redirectUrl || "/listings");
    };

module.exports.logout= (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};    