import * as dotenv from "dotenv";
dotenv.config();
import { getUsers, addUser, deleteUser, editUser } from "./services/user.js";
import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

const options = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await addUser(req.body);
  console.log(user);
  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  await deleteUser(req.params.id);
  res.send("success");
});

app.put("/users/:id", async (req, res) => {
  await editUser(req.params.id, req.body);
  res.send("success");
});

app.listen(3000);
