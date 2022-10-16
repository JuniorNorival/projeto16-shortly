import { nanoid } from "nanoid";

async function urlIsValid(req, res, next) {
  const { url } = req.body;

  const urlVerify = new RegExp(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
  );

  if (!urlVerify.test(url))
    return res.status(422).send({ message: "URL invalid" });

  next();
}
export { urlIsValid };
