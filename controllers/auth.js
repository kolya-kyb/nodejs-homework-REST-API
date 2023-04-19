const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { ctrlWrapper } = require("../utils");

const {User} = require("../models/users");

const { HttpError } = require("../helpers");

const {SECRET_KEY} = process.env;

const register = async(req, res)=> {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if(user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({...req.body, password: hashPassword});

  res.status(201).json({
    name: result.name,
    email: result.email,
  })
}

const login = async(req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if(!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if(!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  }

  const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
  await User.findByIdAndUpdate(user._id, {token});

  res.json({
    token,
  })
}

const getCurrent = async(req, res)=> {
  const { email, subscription} = req.user;

  res.json({
    email,
    subscription,

  })
}

const logout = async(req, res)=> {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ""});

  res.status(204).json({message: "No Content"});
}

const updateSubscription= async (req, res) => {
  const {_id} = req.user;
  if (Object.keys(req.body).length === 0 || req.body === null || req.body === undefined) {

    throw HttpError(400);
  }
  try {
    const result = await User.findByIdAndUpdate(_id, req.body, {new: true});
    res.json(result);
  } catch (err) {
    if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
      throw HttpError(404);
    }
  }
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
}