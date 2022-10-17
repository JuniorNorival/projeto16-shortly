import connection from "../database/db.js";
import { nanoid } from "nanoid";

async function shortenUrl(req, res) {
  const { url } = req.body;
  const { user } = res.locals;
  const shortUrl = nanoid(12);
  const urlExists = await connection.query("SELECT * FROM urls WHERE url=$1", [
    url,
  ]);
  if (urlExists.rowCount > 0) return res.sendStatus(409);

  try {
    await connection.query(
      'INSERT INTO urls ("userId", "shortUrl", url) VALUES ($1,$2,$3)',
      [user.id, shortUrl, url]
    );
    res.status(201).send({ shortUrl: shortUrl });
  } catch (error) {}
}

async function showUrl(req, res) {
  const { id } = req.params;

  try {
    const url = (
      await connection.query(
        'SELECT  id, "shortUrl", url from urls WHERE id=$1',
        [id]
      )
    ).rows[0];

    if (!url) return res.sendStatus(404);

    res.status(200).send(url);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function redirectUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const urlData = (
      await connection.query('SELECT * FROM urls WHERE "shortUrl"=$1', [
        shortUrl,
      ])
    ).rows[0];
    if (!urlData) return res.sendStatus(404);
    const updateVisitants = urlData.visitCount + 1;

    await connection.query('UPDATE urls SET "visitCount"=$1 WHERE id=$2', [
      updateVisitants,
      urlData.id,
    ]);
    res.redirect(urlData.url);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function deleteUrl(req, res) {
  const { user } = res.locals;
  const { id } = req.params;

  try {
    const urlShort = (
      await connection.query("SELECT * FROM urls WHERE id=$1", [id])
    ).rows[0];

    if (!urlShort) return res.sendStatus(404);
    if (urlShort.userId !== user.id) return res.sendStatus(401);

    const deleteUrl = await connection.query("DELETE FROM urls WHERE id=$1", [
      id,
    ]);

    if (deleteUrl.rowCount > 0) return res.sendStatus(204);
    res.sendStatus(404);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function urlsUser(req, res) {
  const { user } = res.locals;
  try {
    const userData = (
      await connection.query("SELECT name, id FROM users WHERE id=$1", [
        user.id,
      ])
    ).rows[0];
    const visitsTotal = (
      await connection.query(
        'SELECT SUM("visitCount") from urls WHERE "userId"=$1',
        [user.id]
      )
    ).rows[0].sum;
    const shortenedUrls = (
      await connection.query(
        'SELECT id,"shortUrl", url, "visitCount" FROM urls WHERE "userId" =$1',
        [user.id]
      )
    ).rows;
    const result = {
      id: userData.id,
      name: userData.name,
      visitCount: Number(visitsTotal),
      shortenedUrls: shortenedUrls,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function ranking(req, res) {
  try {
    const ranking = (
      await connection.query(
        `SELECT users.id, users.name, COUNT(urls.id) AS "linkCount", 
        COALESCE (SUM(urls."visitCount"),0) AS "visitCount" 
        FROM users LEFT JOIN urls 
        ON urls."userId"=users.id 
        GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10`
      )
    ).rows;
    res.status(200).send(ranking);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}
export { shortenUrl, showUrl, redirectUrl, deleteUrl, urlsUser, ranking };
