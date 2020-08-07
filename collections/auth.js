import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Auth = mongoose.model("auth");

export const signup = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res
      .status(422)
      .json({
        message: "Please input all fields",
        status: "Unprocessable Entity",
      });
  Auth.findOne({ email })
    .then((selectedUser) => {
      if (selectedUser)
        return res
          .status(422)
          .json({
            message: "User already exists with the same email",
            status: "Unprocessable Entity",
          });
      bcryptjs
        .hash(password, 10)
        .then((bcryptedPassword) => {
          Auth.create({ name, email, password: bcryptedPassword })
            .then((newUser) => {
              sgMail
                .send({
                  to: newUser.email,
                  from: process.env.SENDER,
                  subject: "Registration",
                  html: "<h1 style='color:red'>Resgistration Successful</h1>",
                })
                .then(() => {
                  console.log("Email sent");
                })
                .catch((err) => console.error(err));

              res.send(
                `Hi ${newUser.name}, you have been successfully registered and Email is sent`
              );
            })
            .catch((err) => res.send(`Error while saving : ${err}`));
        })
        .catch((err) => res.send(`Error while hashing the password : ${err}`));
    })
    .catch((err) =>
      res.send(`Error while processing your information with database : ${err}`)
    );
};

export const signin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(422)
      .json({
        message: "Please input all fields",
        status: "Unprocessable Entity",
      });
  Auth.findOne({ email })
    .then((selectedUser) => {
      if (!selectedUser)
        return res
          .status(422)
          .json({
            message: "Invalid username or password",
            status: "Unprocessable Entity",
          });
      bcryptjs
        .compare(password, selectedUser.password)
        .then((isMatch) => {
          if (!isMatch)
            return res
              .status(422)
              .json({
                message: "Invalid username or password",
                status: "Unprocessable Entity",
              });
          const token = jwt.sign(
            { _id: selectedUser._id },
            process.env.JWT_SECRET
          );
          res.json({ token });
        })
        .catch((err) => res.send(`Error while matching the password : ${err}`));
    })
    .catch((err) =>
      res.send(`Error while getting your information from database : ${err}`)
    );
};

export const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res
      .status(401)
      .json({ message: "You must be logged in", status: "Unauthorized" });
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err)
      return res
        .status(401)
        .json({ message: "You must be logged in", status: "Unauthorized" });
    const { _id } = payload;
    Auth.findById(_id).then((selectedUser) => {
      req.userData = selectedUser;
      next();
    });
  });
};
