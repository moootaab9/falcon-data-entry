const express = require('express');
const path = require('path');
const cors = require('cors');
const falconRouter = require('./routes/falcons');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسارات الملفات الثابتة: واجهة HTML و uploads
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API
app.use('/api/falcons', falconRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
