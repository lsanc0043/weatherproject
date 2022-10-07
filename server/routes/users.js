import db from "../db/db-connection.js";
import Router from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await db.any("SELECT * FROM users ORDER BY name", [true]);
    res.send(users);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

router.put("/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body.last_log);
  try {
    const updateUser = await db.one(
      "UPDATE users SET last_log=CURRENT_TIMESTAMP WHERE id=$1",
      [Number(req.params.id)]
    );
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

router.post("/", async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.username,
    log_in: req.body.log_in,
  };
  console.log(user);
  try {
    const newUser = await db.many(
      "INSERT INTO users(email, password, name, last_log) VALUES($1, $2, $3) RETURNING *",
      [user.email, user.password, user.name]
    );
    res.send(newUser);
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deleted = await db.one("DELETE FROM users WHERE id=$1", [id]);
    await db.many("DELETE FROM favorites WHERE userid=$1", [id]);
    res.send(deleted);
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

export default router;
