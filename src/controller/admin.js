const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//XXXXXXXXXXXXXXXXXXXXXXXXXXX- Admin Controllers -XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const generateJwtToken = (_id, email) => {
    return jwt.sign({ _id, email }, process.env.JWT_KEY);   
  };

exports.adminSignUp = (req, res) => {
    Admin.findOne({ email: req.body.email })
        .then(async admin => {
            if (admin) {
                return res.status(400).json({
                    status: 'fail',
                    message: "Admin already registered",
                });
            } else {
                const { firstName, lastName, email, password, gender } = req.body;
                const hash_password = await bcrypt.hash(password, 10);

                const _admin = new Admin({
                    firstName,
                    lastName,
                    email,
                    hash_password,
                    gender
                });

                _admin.save()
                    .then(admin => {
                        return res.status(201).json({
                            status: 'success',
                            message: 'Admin Created Successfully.'
                        });
                    })
                    .catch(error => {
                        res.status(400).json({
                            status: 'fail',
                            message: error.message
                        });
                    }
                    );
            }
        }).catch(error => res.status(400).json({
            status: 'fail', message: error.message
        }));
}



exports.adminSignIn = async (req, res) => {
    try {
        Admin.findOne({ email: req.body.email })
            .then(async admin => {
                if (admin) {
                    const isPassword = await admin.authenticate(req.body.password);
                    if (isPassword) {
                        const { _id, fullName, email } = admin;
                        const token = generateJwtToken(admin._id, admin.email);
                        res.status(200).json({
                            status: "success",
                            message: "Admin Successfully Logged In",
                            admin: { _id, fullName, email },
                            token
                        });
                    }
                    else {
                        return res.status(400).json({
                            status: 'fail',
                            message: "Password Incorrect"
                        });
                    }
                }
                else {
                    return res.status(400).json({
                        status: 'fail',
                        message: "Admin Not Found"
                    });
                }
            })
            .catch(error => res.status(400).json({ status: 'fail', message: error.message }));
    } catch (error) {
        console.log(error.message)
    }
};