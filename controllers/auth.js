const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
require('dotenv').config();


exports.signup = async (req, res) => {
    const userExsists = await User.findOne({email: req.body.email});
    if (userExsists) return res.status(403).json({
        error: "Email is taken!"
    });
    
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ user });
}

exports.signin = (req, res) => {
    // find the user based on email
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if (err || !user){
            return res.status(401).json({
                error: "User with that email does not exsist. Please signin."
            })
        }

        // if user is found make sure email and password match
        // create Authenticate method in model and use here
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "email and password do not match"
            })
        }
        // generate token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie("t", token, {expire: new Date() + 9999});
        // return response with user and token to frontend client
        const {_id, name, email} = user;
        return res.json({token, user: {_id, email, name}})

    });
    
};


exports.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({
        message: "Signout success!"
    })
};

exports.requireSignin = expressJwt({
    // if the token is valid, express jwt appends the verified users id
    // in any auth key to request object
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'] ,
    userProperty: "auth"
});