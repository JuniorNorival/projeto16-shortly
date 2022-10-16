import connection from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

async function signUp(req, res) {
  const { name, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 12);
  try {
    await connection.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3)",
      [name, email, passwordHash]
    );
    return res.sendStatus(201);
  } catch (error) {
    console.log(error.message);

    res.sendStatus(500);
  }
}

async function signIn(req, res) {
  const { user } = res.locals;

  try {
    const token = uuidv4();
    await connection.query(
      'INSERT INTO sessions ("userId", token) VALUES ($1,$2)',
      [user.id, token]
    );
    res.status(200).send({ token: token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}
export { signUp, signIn };
