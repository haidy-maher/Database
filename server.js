const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
app.use(express.json());
// MongoDB connection URI and database name
const uri = 'mongodb://localhost:27017';
const dbName = 'MCPC';

// Connect to MongoDB using Mongoose
mongoose.connect(`${uri}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
// Define a user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const sessionsSchema = new mongoose.Schema({
  topicName: { type: String, required: true, unique: false },
  date: { type: Date, required: true, unique: false },
  attendanceNumber: { type: Number, required: false, unique: false },
});

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  mediaType: { type: String, enum: ['image', 'video', 'pdf'] },
  uploadedAt: { type: Date, default: Date.now },
  mediaType: { type: String, enum: ['image', 'video', 'pdf'] },
});

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileType: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

const Material = mongoose.model('Material', materialSchema);
const User = mongoose.model('User', userSchema);
const Sessions = mongoose.model('Sessions', sessionsSchema);


// Initialize GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Set up storage engine for multer and GridFS
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to connect to MongoDB using Mongoose
app.use((req, res, next) => {
  req.db = mongoose.connection;
  next();
});

// Serve static files
app.use(express.static('public'));

app.post('/materialUpload', upload.single('pdfFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const { originalname, mimetype, buffer } = req.file;

  // Check if the file is a PDF
  if (mimetype !== 'application/pdf') {
    return res.status(400).send('Only PDF files are allowed');
  }

  // Include handling for PDFs
  if (mimetype !== 'application/pdf') {
    return res.status(400).send('Only PDF files are allowed');
  }


  // Save file details in Material collection
  const newMaterial = new Material({
    title: originalname,
    fileType: mimetype
  });
  if(req.file.mimetype !== 'application/pdf') {
    return res.status(400).send('Only PDF files are allowed');
  }
  if(req.file.mimetype === 'application/pdf') {
    // PDF specific handling
  }
  await newMaterial.save();
  res.redirect('/material');

});


app.get('/materialDownload/:id', async (req, res) => {
  try {
    const materialId = req.params.id;
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).send('Material not found');
    }

    // Find the file in GridFS by filename
    gfs.files.findOne({ filename: material.title }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).send('File not found');
      }

      // Create read stream from GridFS
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
    });
  } catch (error) {
    console.error('Error downloading material:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
  const { originalname, buffer } = req.file;

  // Create a GridFS stream for writing
  const writeStream = gfs.createWriteStream({
    filename: originalname,
  });

  // Write the buffer to GridFS
  writeStream.write(buffer);
  writeStream.end();

  writeStream.on('close', () => {
    console.log(`File ${originalname} uploaded successfully`);
    res.json({ success: true, file: req.file });
  });
});
// Route to handle user login
app.post('/login', async (req, res) => {
  // Ensure req.body is not undefined and contains required fields
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).send('Invalid request body');
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // You might want to implement a session or token mechanism for authentication
    // For simplicity, just sending a success message for now
    res.status(200).send('Login successful');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle user signup
app.post('/signup', async (req, res) => {
  console.log('Request Body:', req.body);
  // Ensure req.body is not undefined and contains required fields
  if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).send('Invalid request body');

  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).send('User already exists');
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/createSession', async (req, res) => {
  console.log('Request Body:', req.body);

  if (!req.body || !req.body.topicName || !req.body.date) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { topicName, date } = req.body;

  try {
    const newSession = new Sessions({ topicName, date });
    await newSession.save();

    res.redirect('/sessions');
    // res.status(201).json({ message: 'Session created successfully' });
    
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assuming you have an endpoint to handle session deletion by ID
app.delete('/deleteSession/:id', async (req, res) => {
  const sessionId = req.params.id;

  try {
    const deletedSession = await Sessions.findByIdAndDelete(sessionId);

    if (!deletedSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Respond with a success message indicating the deletion
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/updateSession/:id', async (req, res) => {
  const sessionId = req.params.id;

  const { topicName, date, attendanceNumber } = req.body;

  try {
    const session = await Sessions.findByIdAndUpdate(
      sessionId,
      { topicName, date, attendanceNumber },
      { new: true } // Return the updated session
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Redirect to /sessions upon successful update
    res.redirect('/sessions');
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get session details by ID
// Assuming this is your server setup and the Sessions model is defined properly

app.get('/getSession/:id', async (req, res) => {
  const sessionId = req.params.id;

  try {
    const session = await Sessions.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session); // Send the session details as JSON response
  } catch (error) {
    console.error('Error fetching session details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Route to handle editing a session by ID
app.get('/editSession/:id', async (req, res) => {
  const sessionId = req.params.id;

  try {
    // Fetch the session details from the database based on the session ID
    const session = await Sessions.findById(sessionId);

    if (!session) {
      return res.status(404).send('Session not found');
    }

    // Render the 'editSession' view and pass the session data to it
    res.render('editSession', { session });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).send('Internal Server Error');
  }
});




// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('home'); // Render the 'home.ejs' view
});

app.get('/about', (req, res) => {
  res.render('about'); // Render the 'about.ejs' view
});

app.get('/contact', (req, res) => {
  res.render('contact'); // Render the 'contact.ejs' view
});

app.get('/login', (req, res) => {
  res.render('login'); // Render the 'login.ejs' view
});

app.get('/material', async (req, res) => {
  try {
    // Fetch data from the "Material" collection
    const materials = await Material.find();

    res.render('material', { materials }); // Pass the data to "material.ejs" for rendering
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/addmaterial', (req, res) => {
  res.render('addmaterial'); // Render the 'login.ejs' view
});


// FOR ALL PAGES IN NAV
app.get('/sessions', async (req, res) => {
  try {
    const sessions = await Sessions.find(); // Fetch sessions from the database

    res.render('sessions', { sessions }); // Pass fetched sessions to the 'sessions.ejs' view
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).send('Internal Server Error');
  }
});




app.get('/createSession', (req, res) => {
  res.render('createSession'); // Render the 'createSession.ejs' view
});

app.get('/editSession', (req, res) => {
  res.render('editSession'); // Render the 'editSession.ejs' view
});

// END




// media

const MediaSchema = new mongoose.Schema({
  title: String,
  description: String,
  mediaType: { type: String, enum: ['image', 'video'] },
  uploadedAt: { type: Date, default: Date.now },
});

const Media = mongoose.model('Media', mediaSchema);

app.get('/media', async (req, res) => {
  try {
    const media = await Media.find(); // Fetch media from the database

    res.render('media', { media }); // Pass fetched media to the view
  } catch (error) {
    console.error('Error fetching media:', error); // Log the specific error
    res.status(500).send('Error fetching media'); // Send a more descriptive error message
  }
});

// Route to handle GET requests to /addMedia
app.get('/addMedia', (req, res) => {
  // Logic to handle rendering addMedia.ejs
  // You might pass any necessary data to the template here
  res.render('addMedia'); // Render addMedia.ejs
});


// Media End

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
