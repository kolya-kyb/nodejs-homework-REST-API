const { Schema, model } = require("mongoose");
const Joi = require("joi");

const {handleMongooseError} = require("../utils");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
},
  {versionKey: false, timestamps: false});

contactSchema.post("save", handleMongooseError);

const addSchema =  Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "any.required": `missing required name`,
      "string.empty": `name cannot be empty`,
    }),
  email: Joi.string()
    .required()
    .email()
    .messages({
      "any.required": `missing required email`,
      "string.empty": `email cannot be empty`,
      "string.email": `email cannot be a valid email address`
    }),
  phone: Joi.string()
    .required()
    .regex(/^[0-9]{10}$/)
    .messages({
      "any.required": `missing required phone`,
      "string.empty": `phone cannot be empty`,
      'string.pattern.base': `Phone number must have 10 digits.`
    }),
  favorite: Joi.boolean(),
})

const updateSchema =  Joi.object({
  name: Joi.string()
    .messages({
      "string.empty": `name cannot be empty`,
    }),
  email: Joi.string()
    .email()
    .messages({
      "string.empty": `email cannot be empty`,
      "string.email": `email cannot be a valid email address`
    }),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`
    }),
  favorite: Joi.boolean()
})

const updateStatusSchema = Joi.object({
  favorite: Joi
    .boolean()
    .required()
    .messages({
      "any.required": `missing field favorite`,
    })
})

const schemas = {
  addSchema,
  updateSchema,
  updateStatusSchema,
}

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas,
}