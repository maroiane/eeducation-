import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  readUsers, 
  writeUsers, 
  readAdmins,
  getSubjects, 
  getLessons, 
  getLessonById,
  readVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  getAllUsersWithStats,
  updateUserSubscription,
  cancelUserSubscription
} from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, level } = req.body;

    // Validate input
    if (!username || !password || !level) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Updated valid levels to match the new registration options
    const validLevels = [
      '1bac-math', '1bac-exp', '1bac-lit', '1bac-hum', 
      '2bac-math', '2bac-phys', '2bac-svt', '2bac-lit'
    ];
    
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: 'Niveau invalide' });
    }

    // Check if user exists
    const users = readUsers();
    const existingUser = users.find(user => user.username === username);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      level,
      subscriptionStatus: 'Free',
      subjectSubscriptions: {},
      createdAt: new Date().toISOString()
    };

    // Save user
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Find user
    const users = readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    writeUsers(users);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, level: user.level },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        level: user.level,
        subscriptionStatus: user.subscriptionStatus || 'Free',
        subjectSubscriptions: user.subjectSubscriptions || {}
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Find admin
    const admins = readAdmins();
    const admin = admins.find(a => a.username === username);

    if (!admin) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Check password (for demo, password is "admin123")
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get subjects by level
app.get('/api/subjects/:level', (req, res) => {
  try {
    const { level } = req.params;
    
    const validLevels = [
      '1bac-math', '1bac-exp', '1bac-lit', '1bac-hum', 
      '2bac-math', '2bac-phys', '2bac-svt', '2bac-lit'
    ];
    
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: 'Niveau invalide' });
    }

    const subjects = getSubjects(level);
    res.json(subjects);
  } catch (error) {
    console.error('Subjects error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get lessons by subject
app.get('/api/lessons/subject/:subjectId', (req, res) => {
  try {
    const { subjectId } = req.params;
    const lessons = getLessons(subjectId);
    res.json(lessons);
  } catch (error) {
    console.error('Lessons error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get lesson by ID
app.get('/api/lessons/:lessonId', (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = getLessonById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Leçon non trouvée' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Lesson error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// JWT middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token d\'accès requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès administrateur requis' });
    }
    next();
  });
};

// Secure video URL endpoint - only for authenticated users with valid subscriptions
app.get('/api/secure-video/:lessonId', authenticateToken, (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = getLessonById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Leçon non trouvée' });
    }

    // Check if lesson is premium and user has subscription
    if (lesson.isPremium) {
      const users = readUsers();
      const user = users.find(u => u.id === req.user.userId);
      
      if (!user || !user.subjectSubscriptions || !user.subjectSubscriptions[lesson.subjectId]) {
        return res.status(403).json({ message: 'Abonnement requis pour accéder à cette vidéo' });
      }
    }

    // Return the secure video URL only if authorized
    if (lesson.videoUrl) {
      // Generate a temporary token for this specific video access
      const videoToken = jwt.sign(
        { lessonId, userId: req.user.userId, timestamp: Date.now() },
        JWT_SECRET,
        { expiresIn: '2h' } // Video access expires in 2 hours
      );
      
      res.json({ 
        videoUrl: lesson.videoUrl,
        videoToken,
        expiresIn: 7200 // 2 hours in seconds
      });
    } else {
      res.status(404).json({ message: 'Vidéo non disponible' });
    }
  } catch (error) {
    console.error('Secure video error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Admin routes
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  try {
    const users = getAllUsersWithStats();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/admin/videos', authenticateAdmin, (req, res) => {
  try {
    const videos = readVideos();
    res.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/admin/videos', authenticateAdmin, (req, res) => {
  try {
    const videoData = {
      ...req.body,
      createdBy: req.user.userId
    };
    const newVideo = addVideo(videoData);
    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Add video error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/admin/videos/:videoId', authenticateAdmin, (req, res) => {
  try {
    const { videoId } = req.params;
    const updatedVideo = updateVideo(videoId, req.body);
    
    if (!updatedVideo) {
      return res.status(404).json({ message: 'Vidéo non trouvée' });
    }
    
    res.json(updatedVideo);
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/admin/videos/:videoId', authenticateAdmin, (req, res) => {
  try {
    const { videoId } = req.params;
    const deleted = deleteVideo(videoId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Vidéo non trouvée' });
    }
    
    res.json({ message: 'Vidéo supprimée avec succès' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Admin subscription management
app.post('/api/admin/users/:userId/subscription/:subjectId', authenticateAdmin, (req, res) => {
  try {
    const { userId, subjectId } = req.params;
    const { status } = req.body;
    
    const updatedUser = updateUserSubscription(userId, subjectId, status);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({ message: 'Abonnement mis à jour avec succès' });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/admin/users/:userId/subscription/:subjectId', authenticateAdmin, (req, res) => {
  try {
    const { userId, subjectId } = req.params;
    
    const updatedUser = cancelUserSubscription(userId, subjectId);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur ou abonnement non trouvé' });
    }
    
    res.json({ message: 'Abonnement annulé avec succès' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});