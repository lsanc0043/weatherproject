import db from "../db/db-connection.js";
import Router from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
config();

const router = Router();
let COORDINATES = [0, 0];

router.get("/", async (req, res) => {
  try {
    const users = await db.any(
      "SELECT * FROM search_history ORDER BY date_time DESC",
      [true]
    );
    res.send(users);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

router.post("/", async (req, res) => {
  const search = req.body.searchInput;
  const id = req.body.userid;
  // console.log(search);
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${process.env.API_KEY}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      res.send(data);
    });
  try {
    const newSearch = await db.many(
      "INSERT INTO search_history(query, userid) VALUES($1, $2) RETURNING *",
      [search, id]
    );
    // res.send(newSearch);
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

router.post("/weather", (req, res) => {
  const coords = {
    lat: req.body.lat,
    lon: req.body.lon,
  };
  COORDINATES[0] = coords.lat;
  COORDINATES[1] = coords.lon;
  res.send(coords);
});

router.get("/weather", (req, res) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${COORDINATES[0]}&lon=${COORDINATES[1]}&appid=${process.env.API_KEY}`;
  // const url = `https://api.openweathermap.org/data/2.5/forecast?lat=0&lon=0&appid=${process.env.API_KEY}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => res.send(data));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deleted = await db.one("DELETE FROM search_history WHERE id=$1", [
      id,
    ]);
    res.send(deleted);
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

export default router;
