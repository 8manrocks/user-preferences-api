import express from 'express';
import mongoose from 'mongoose';
import User from './models/user';
import { generateJWT, generateRefreshToken, verifyPassword } from './auth';
import jwt from 'jsonwebtoken';
import { UserRequest, authenticateJWT } from './middlewares/authMiddleware';
const app = express();
mongoose.connect(
  'mongodb+srv://8manrocks:cXVac3BwKhrpDZSO@cluster0.rbfwlcj.mongodb.net/userPreferences?retryWrites=true&w=majority'
);

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.send({ success: true });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await verifyPassword(user.password, password))) {
    const token = generateJWT(username);
    res.send({ token });
  } else {
    res.status(400).send({ error: 'Invalid credentials' });
  }
});

app.get('/preferences', authenticateJWT, async (req: UserRequest, res) => {
  try {
    const user = await User.findOne(req.user);
    if (!user) throw new Error();
    res.send(user.preferences);
  } catch {
    res.status(401).send({ error: 'Invalid token' });
  }
});

app.put('/preferences', authenticateJWT, async (req: UserRequest, res) => {
    try {
      const user = await User.findOne(req.user);
      if (!user) throw new Error();
      user.preferences = [...req.body.preferences];
      await user.save();
      res.send(user.preferences);
    } catch {
      res.status(401).send({ error: 'Invalid token' });
    }
  });

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
