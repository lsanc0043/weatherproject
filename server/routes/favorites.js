import db from "../db/db-connection.js";
import Router from "express";

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const faves = await db.any("SELECT * FROM favorites WHERE userId=$1", [
      req.params.id,
    ]);
    res.send(faves);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

router.get("/", async (req, res) => {
  try {
    const faves = await db.any("SELECT * FROM favorites", []);
    res.send(faves);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

router.post("/", async (req, res) => {
  const fave = {
    city: req.body.city,
    userId: req.body.userId,
  };
  console.log(fave);
  try {
    const newFave = await db.many(
      "INSERT INTO favorites(city, userid) VALUES($1, $2) RETURNING *",
      [fave.city, fave.userId]
    );
    res.send(newFave);
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

router.delete("/:id:city", async (req, res) => {
  const id = Number(req.params.id);
  const city = req.params.city;
  console.log(id, city);
  try {
    const deleted = await db.any(
      "DELETE FROM favorites WHERE userid=$1 AND city=$2",
      [id, city]
    );
    res.send(deleted);
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

export default router;
