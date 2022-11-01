import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import db from "./db/db-connection.js";
import usersRouter from "./routes/users.js";
import searchRouter from "./routes/search_history.js";
import favesRouter from "./routes/favorites.js";

const app = express();
const PORT = 2010;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", usersRouter);
app.use("/search", searchRouter);
app.use("/faves", favesRouter);

app.get("/", async (req, res) => {
  res.send("hello from server.js in the backend");
});

app.listen(PORT, () => console.log(`you are listening to ${PORT}`));
