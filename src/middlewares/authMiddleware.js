import { signUpSchema, signInSchema } from "../schemas/authSchema.js";
import connection from "../database/db.js";
import bcrypt from "bcrypt";
async function signUpValidation(req, res, next) {
  const validation = signUpSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(erros);
  }
  const user = await connection.query("SELECT * FROM users WHERE email=$1", [
    req.body.email,
  ]);

  if (user.rowCount > 0) {
    return res.sendStatus(409);
  }
  next();
}

async function signInValidation(req, res, next) {
  const { email, password } = req.body;

  const validation = signInSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(erros);
  }

  const user = (
    await connection.query("SELECT * FROM users WHERE email=$1", [email])
  ).rows;

  const comparePassword = bcrypt.compareSync(password, user[0]?.password);
  if (!user || !comparePassword)
    return res.status(401).send("Email or password invalid");
  res.locals.user = user;
  next();
}
export { signUpValidation, signInValidation };
