const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser'); //

const postRouter = require('./router/post.router');
const globalErrorHandle = require('./controllers/error.coontroller');
const authContext = require('./router/auth.router');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,  // frontend-ის URL
    credentials: true,
}));

// origin: 'http://localhost:5173',
// process.env.CLIENT_URL

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/posts', postRouter);
app.use('/api/auth', authContext);

app.use(express.static(path.join(__dirname, 'dist')));

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
