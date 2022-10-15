import joi from "joi";

const signUpSchema = joi.object({
  name: joi.string().required().trim().min(3),
  email: joi.string().email().required(),
  password: joi.string().required().min(5),
  confirmPassword: joi.ref("password"),
});

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(5),
});

export { signUpSchema, signInSchema };
