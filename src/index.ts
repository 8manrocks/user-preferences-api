import express from "express";
import mongoose from "mongoose";
import User from "./models/user";
import { generateJWT, verifyPassword } from "./auth";
import { UserRequest, authenticateJWT } from "./middlewares/authMiddleware";
import cors from "cors";
import "dotenv/config";
const app = express();
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.wibzfgc.mongodb.net/user?retryWrites=true&w=majority`
);

app.use(express.json());
app.use(cors());
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const userExist = await User.findOne({ username });
  if (userExist) {
    res.status(400).send({ error: "User already exists" });
    return;
  }
  const user = new User({ username, password });
  await user.save();
  res.send({ success: true });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await verifyPassword(user.password, password))) {
    const token = generateJWT(username);
    res.cookie("token", token, { httpOnly: true });
    res.send({ success: true });
  } else {
    res.status(400).send({ error: "Invalid credentials" });
  }
});
app.get("/loggedIn", authenticateJWT, async (req, res) => {
  res.send({ success: true });
});
app.get("/signout", authenticateJWT, async (req, res) => {
  res.clearCookie("token");
  res.send({ success: true });
});
app.get("/preferences", authenticateJWT, async (req: UserRequest, res) => {
  try {
    const user = await User.findOne({ username: req.user?.username });
    if (!user) throw new Error();
    res.send(user.preferences);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error while fetching preferences" });
  }
});

app.put("/preferences", authenticateJWT, async (req: UserRequest, res) => {
  try {
    await User.updateOne(
      { username: req.user?.username },
      { preferences: req.body }
    );
    res.send({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error while saving preferences" });
  }
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
