require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const skillRoutes = require('./routes/skills');
const portfolioRoutes = require('./routes/portfolio');
const contactRoutes = require('./routes/contact');
const socialRoutes = require('./routes/social');
const siteRoutes = require('./routes/site');
const templateRoutes = require('./routes/templates');
const pageRoutes = require('./routes/pages');
const mediaRoutes = require('./routes/media');
const portfolioV2Routes = require('./routes/portfolioV2');
const resumeRoutes = require('./routes/resume');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/portfolio-v2', portfolioV2Routes);
app.use('/api/resume', resumeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Devid Porto API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
