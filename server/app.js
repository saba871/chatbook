const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const postRouter = require('./router/post.router');
const globalErrorHandle = require('./controllers/error.coontroller');
const authContext = require('./router/auth.router');

dotenv.config();
const app = express();
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/posts', postRouter);
app.use('/api/auth', authContext);

// global error handling
app.use(globalErrorHandle);

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connected to mongoDB');

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`DataBase Connecting error: ${err}`);
        process.exit(1);
    });
