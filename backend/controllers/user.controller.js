// const userModel = require('../models/user.model');
// const userService = require('../services/user.service');
// const { validationResult } = require('express-validator');
// const blackListTokenModel = require('../models/blackListToken.model');

// module.exports.registerUser = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { firstname,lastname, email, password } = req.body;

//     const isUserAlready = await userModel.findOne({ email });

//     if (isUserAlready) {
//         return res.status(400).json({ message: 'User already exist' });
//     }

//     const hashedPassword = await userModel.hashPassword(password);

//     const user = await userService.createUser({
//         firstname: fullname.firstname,
//         lastname: fullname.lastname,
//         email,
//         password: hashedPassword
//     });

//     const token = user.generateAuthToken();

//     res.status(201).json({ token, user });


// }




const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract from req.body.fullname
        const { fullname, email, password } = req.body;
        const { firstname, lastname } = fullname || {};

        // Check if user already exists
        const isUserAlready = await userModel.findOne({ email });
        if (isUserAlready) {
            return res.status(400).json({ message: 'User already exist' });
        }

        // Hash the password
        const hashedPassword = await userModel.hashPassword(password);

        // Create the user
        const user = await userService.createUser({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        // Generate JWT token
        const token = user.generateAuthToken();

        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}


module.exports.loginUser = async (req, res, next) => {  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const token = user.generateAuthToken();
    res.status(200).json({token, user});
//4937
}