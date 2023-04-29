const { Schema, model } = require("mongoose");
const Joi = require("joi");

const {handleMongooseError} = require("../utils");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  avatarURL: String,
  token: String,
}, {versionKey: false, timestamps: false});

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      "any.required": `missing required email`,
      "string.empty": `email cannot be empty`,
      "string.email": `email cannot be a valid email address`
    }),
  password: Joi
    .string()
    .min(6)
    .required(),
  subscription: Joi
    .string()
    .valid('starter', 'pro', 'business')
    .default('starter'),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      "any.required": `missing required email`,
      "string.empty": `email cannot be empty`,
      "string.email": `email cannot be a valid email address`
    }),
  password: Joi.string().min(6).required(),
});

const updateSubscription = Joi.object({
  subscription: Joi
    .string()
    .valid('starter', 'pro', 'business')

})

const schemas = {
  registerSchema,
  loginSchema,
  updateSubscription,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
}
