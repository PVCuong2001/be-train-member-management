const express = require('express');
require('dotenv').config();

const app = express();
const port = 3000;

const userRouter = require('./users/router');
const authRouter = require('./auth/router');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
