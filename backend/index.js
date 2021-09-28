const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = express();
const HttpError = require('./models/http-error');
var cors = require('cors')
const multer = require('multer');
const path = require('path');


//Import Routes
const usersRoutes = require('./routes/users-routes');
const recordsRoutes = require('./routes/records-routes');
const tagsRoutes = require('./routes/tags-routes');
const reportsRoutes = require('./routes/reports-routes');
const mediaRoutes = require('./routes/medias-routes');
const pendingRoutes = require('./routes/pendingReports-routes');
const customRoutes = require('./routes/custom-routes');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    
    () => console.log('Connected to db!')

);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'videos');
    }, 
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/*') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(cors());

//Middleware

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('file'));






//Route Middlewares
app.use('/api/users', usersRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/medias', mediaRoutes);
app.use('/api/pendingReports', pendingRoutes);
app.use('/api/custom', customRoutes);

app.use('/api/videos', express.static( 'videos'))
app.use('/api/images', express.static( 'uploads/images'))

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' })
})

app.listen(4000, () => console.log('Server up and running!'))


