import fs from 'fs';
import path from 'path';

const USERS_FILE = './server/data/users.json';
const ADMINS_FILE = './server/data/admins.json';
const VIDEOS_FILE = './server/data/videos.json';

// Ensure data directory exists
const dataDir = path.dirname(USERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(ADMINS_FILE)) {
  fs.writeFileSync(ADMINS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(VIDEOS_FILE)) {
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify([], null, 2));
}

// User functions
export const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

export const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
  }
};

// Admin functions
export const readAdmins = () => {
  try {
    const data = fs.readFileSync(ADMINS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading admins:', error);
    return [];
  }
};

export const writeAdmins = (admins) => {
  try {
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2));
  } catch (error) {
    console.error('Error writing admins:', error);
  }
};

// Video functions
export const readVideos = () => {
  try {
    const data = fs.readFileSync(VIDEOS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading videos:', error);
    return [];
  }
};

export const writeVideos = (videos) => {
  try {
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));
  } catch (error) {
    console.error('Error writing videos:', error);
  }
};

export const getSubjects = (level) => {
  const subjects = {
    '1bac-math': [
      {
        id: '1',
        name: 'Mathématiques',
        description: 'Algèbre, Géométrie, Analyse',
        icon: 'Calculator',
        color: 'bg-blue-500',
        subscriptionPrice: 79
      },
      {
        id: '2',
        name: 'Physique-Chimie',
        description: 'Mécanique, Électricité, Chimie',
        icon: 'Atom',
        color: 'bg-green-500',
        subscriptionPrice: 69
      },
      {
        id: '3',
        name: 'Sciences de la Vie et de la Terre',
        description: 'Biologie, Géologie',
        icon: 'Leaf',
        color: 'bg-emerald-500',
        subscriptionPrice: 59
      },
      {
        id: '4',
        name: 'Français',
        description: 'Littérature, Expression écrite',
        icon: 'BookOpen',
        color: 'bg-purple-500',
        subscriptionPrice: 49
      },
      {
        id: '5',
        name: 'Arabe',
        description: 'اللغة العربية وآدابها',
        icon: 'Languages',
        color: 'bg-red-500',
        subscriptionPrice: 49
      },
      {
        id: '6',
        name: 'Anglais',
        description: 'English Language & Literature',
        icon: 'Globe',
        color: 'bg-indigo-500',
        subscriptionPrice: 49
      },
      {
        id: '7',
        name: 'Histoire-Géographie',
        description: 'Histoire du Maroc, Géographie',
        icon: 'Map',
        color: 'bg-orange-500',
        subscriptionPrice: 39
      },
      {
        id: '8',
        name: 'Éducation Islamique',
        description: 'التربية الإسلامية',
        icon: 'Star',
        color: 'bg-yellow-500',
        subscriptionPrice: 39
      }
    ],
    '1bac-exp': [
      {
        id: '1',
        name: 'Mathématiques',
        description: 'Algèbre, Géométrie, Analyse',
        icon: 'Calculator',
        color: 'bg-blue-500',
        subscriptionPrice: 79
      },
      {
        id: '2',
        name: 'Physique-Chimie',
        description: 'Mécanique, Électricité, Chimie',
        icon: 'Atom',
        color: 'bg-green-500',
        subscriptionPrice: 69
      },
      {
        id: '3',
        name: 'Sciences de la Vie et de la Terre',
        description: 'Biologie, Géologie',
        icon: 'Leaf',
        color: 'bg-emerald-500',
        subscriptionPrice: 59
      },
      {
        id: '4',
        name: 'Français',
        description: 'Littérature, Expression écrite',
        icon: 'BookOpen',
        color: 'bg-purple-500',
        subscriptionPrice: 49
      },
      {
        id: '5',
        name: 'Arabe',
        description: 'اللغة العربية وآدابها',
        icon: 'Languages',
        color: 'bg-red-500',
        subscriptionPrice: 49
      },
      {
        id: '6',
        name: 'Anglais',
        description: 'English Language & Literature',
        icon: 'Globe',
        color: 'bg-indigo-500',
        subscriptionPrice: 49
      }
    ],
    '1bac-lit': [
      {
        id: '4',
        name: 'Français',
        description: 'Littérature, Expression écrite',
        icon: 'BookOpen',
        color: 'bg-purple-500',
        subscriptionPrice: 49
      },
      {
        id: '5',
        name: 'Arabe',
        description: 'اللغة العربية وآدابها',
        icon: 'Languages',
        color: 'bg-red-500',
        subscriptionPrice: 49
      },
      {
        id: '6',
        name: 'Anglais',
        description: 'English Language & Literature',
        icon: 'Globe',
        color: 'bg-indigo-500',
        subscriptionPrice: 49
      },
      {
        id: '7',
        name: 'Histoire-Géographie',
        description: 'Histoire du Maroc, Géographie',
        icon: 'Map',
        color: 'bg-orange-500',
        subscriptionPrice: 39
      },
      {
        id: '9',
        name: 'Philosophie',
        description: 'Logique, Éthique, Métaphysique',
        icon: 'Brain',
        color: 'bg-pink-500',
        subscriptionPrice: 59
      },
      {
        id: '8',
        name: 'Éducation Islamique',
        description: 'التربية الإسلامية',
        icon: 'Star',
        color: 'bg-yellow-500',
        subscriptionPrice: 39
      }
    ],
    '1bac-hum': [
      {
        id: '4',
        name: 'Français',
        description: 'Littérature, Expression écrite',
        icon: 'BookOpen',
        color: 'bg-purple-500',
        subscriptionPrice: 49
      },
      {
        id: '5',
        name: 'Arabe',
        description: 'اللغة العربية وآدابها',
        icon: 'Languages',
        color: 'bg-red-500',
        subscriptionPrice: 49
      },
      {
        id: '6',
        name: 'Anglais',
        description: 'English Language & Literature',
        icon: 'Globe',
        color: 'bg-indigo-500',
        subscriptionPrice: 49
      },
      {
        id: '7',
        name: 'Histoire-Géographie',
        description: 'Histoire du Maroc, Géographie',
        icon: 'Map',
        color: 'bg-orange-500',
        subscriptionPrice: 39
      },
      {
        id: '9',
        name: 'Philosophie',
        description: 'Logique, Éthique, Métaphysique',
        icon: 'Brain',
        color: 'bg-pink-500',
        subscriptionPrice: 59
      },
      {
        id: '8',
        name: 'Éducation Islamique',
        description: 'التربية الإسلامية',
        icon: 'Star',
        color: 'bg-yellow-500',
        subscriptionPrice: 39
      }
    ],
    '2bac-math': [
      {
        id: '1',
        name: 'Mathématiques',
        description: 'Analyse, Algèbre, Géométrie avancées',
        icon: 'Calculator',
        color: 'bg-blue-500',
        subscriptionPrice: 89
      },
      {
        id: '2',
        name: 'Physique-Chimie',
        description: 'Mécanique quantique, Chimie organique',
        icon: 'Atom',
        color: 'bg-green-500',
        subscriptionPrice: 79
      },
      {
        id: '3',
        name: 'Sciences de la Vie et de la Terre',
        description: 'Génétique, Écologie, Géologie',
        icon: 'Leaf',
        color: 'bg-emerald-500',
        subscriptionPrice: 69
      },
      {
        id: '4',
        name: 'Français',
        description: 'Analyse littéraire, Dissertation',
        icon: 'BookOpen',
        color: 'bg-purple-500',
        subscriptionPrice: 59
      },
      {
        id: '5',
        name: 'Arabe',
        description: 'الأدب العربي والنقد',
        icon: 'Languages',
        color: 'bg-red-500',
        subscriptionPrice: 59
      },
      {
        id: '6',
        name: 'Anglais',
        description: 'Advanced English Literature',
        icon: 'Globe',
        color: 'bg-indigo-500',
        subscriptionPrice: 59
      }
    ],
    '2bac-phys': [
      {
        id: '1',
        name: 'Mathématiques',
        description: 'Analyse, Algèbre, Géométrie avancées',
        icon: 'Calculator',
        color: 'bg-blue-500',
        subscriptionPrice: 89
      },
      {
        id: '2',
        name: 'Physique-Chimie',
        description: 'Mécanique quantique, Chimie organique',
        icon: 'Atom',
        color: 'bg-green-500',
        subscriptionPrice: 79
      },
      {
        id: '4',
        name: 'Français',
        description: 'Analyse littéraire, Dissertation',
        icon: 'BookOpen',
        color: 'bg-purple-500',
        subscriptionPrice: 59
      },
      {
        id: '5',
        name: 'Arabe',
        description: 'الأدب العربي والنقد',
        icon: 'Languages',
        color: 'bg-red-500',
        subscriptionPrice: 59
      },
      {
        id: '6',
        name: 'Anglais',
        description: 'Advanced English Literature',
        icon: 'Globe',
        color: 'bg-indigo-500',
        subscriptionPrice: 59
      }
    ],
    '2bac-svt': [
      {
        id: '1',
        name: 'Mathématiques',
        description: 'Analyse, Algèbre, Géométrie avancées',
        icon: 'Calculator',
        color: 'bg-blue-500',
        subscriptionPrice: 89
      },
      {
        id: '3',
        name: 'Sciences de la Vie et de la Terre',
        description: 'Génétique, Écologie, Géologie',
        icon: 'Leaf',
        color: 'bg-emerald-500',
        subscriptionPrice: 69
      },
      {
        id: '2',
        name: 'Physique-Chimie',
        description: 'Mécanique quantique, Chimie organique',
        icon: 'Atom',
        color: 'bg-green-500',
        subscriptionPrice: 79
      },
      {
        id: '4',
        name: 'Français',
        description: 'Analyse littéraire, Dissertation',
        icon: 'BookOpen',
        color: 'bg-purple-500',
        subscriptionPrice: 59
      },
      {
        id: '5',
        name: 'Arabe',
        description: 'الأدب العربي والنقد',
        icon: 'Languages',
        color: 'bg-red-500',
        subscriptionPrice: 59
      },
      {
        id: '6',
        name: 'Anglais',
        description: 'Advanced English Literature',
        icon: 'Globe',
        color: 'bg-indigo-500',
        subscriptionPrice: 59
      }
    ],
    '2bac-lit': [
      {
        id: '4',
        name: 'Français',
        description: 'Analyse littéraire, Dissertation',
        icon: 'BookOpen',
        color: 'bg-purple-500',
        subscriptionPrice: 59
      },
      {
        id: '9',
        name: 'Philosophie',
        description: 'Logique, Éthique, Métaphysique',
        icon: 'Brain',
        color: 'bg-pink-500',
        subscriptionPrice: 69
      },
      {
        id: '5',
        name: 'Arabe',
        description: 'الأدب العربي والنقد',
        icon: 'Languages',
        color: 'bg-red-500',
        subscriptionPrice: 59
      },
      {
        id: '6',
        name: 'Anglais',
        description: 'Advanced English Literature',
        icon: 'Globe',
        color: 'bg-indigo-500',
        subscriptionPrice: 59
      },
      {
        id: '7',
        name: 'Histoire-Géographie',
        description: 'Histoire contemporaine, Géopolitique',
        icon: 'Map',
        color: 'bg-orange-500',
        subscriptionPrice: 49
      },
      {
        id: '8',
        name: 'Éducation Islamique',
        description: 'التربية الإسلامية',
        icon: 'Star',
        color: 'bg-yellow-500',
        subscriptionPrice: 39
      }
    ]
  };

  return subjects[level] || [];
};

export const getLessons = (subjectId) => {
  const videos = readVideos();
  const subjectVideos = videos.filter(video => video.subjectId === subjectId);
  
  if (subjectVideos.length > 0) {
    return subjectVideos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      duration: video.duration,
      difficulty: video.difficulty,
      isPremium: video.isPremium,
      subjectId: video.subjectId,
      videoUrl: video.googleDriveUrl,
      content: video.isPremium ? undefined : `Ceci est une leçon d'introduction gratuite.

Cette leçon vous donne un aperçu du contenu disponible. Pour accéder à l'ensemble du programme avec des exercices interactifs, des évaluations et un suivi personnalisé, souscrivez à notre offre Premium.

Contenu Premium inclus :
- Cours complets avec exemples détaillés
- Exercices interactifs corrigés
- Évaluations et tests
- Suivi des progrès personnalisé`
    }));
  }

  // Fallback to default lessons if no videos found
  const lessons = {
    '1': [ // Mathématiques
      {
        id: 'math-1-1',
        title: 'Introduction aux fonctions',
        description: 'Découvrez les concepts fondamentaux des fonctions mathématiques',
        duration: '25 min',
        difficulty: 'Facile',
        isPremium: false,
        subjectId: '1',
        content: `Dans cette leçon, nous allons explorer les concepts fondamentaux des fonctions mathématiques.

Une fonction est une relation qui associe à chaque élément d'un ensemble de départ (appelé domaine) un unique élément d'un ensemble d'arrivée.

Points clés à retenir :
- Définition d'une fonction
- Domaine et image d'une fonction
- Représentation graphique
- Notation f(x)

Cette leçon gratuite vous donne un aperçu des concepts de base. Pour accéder aux exercices interactifs et aux exemples détaillés, souscrivez à notre offre Premium.`
      },
      {
        id: 'math-1-2',
        title: 'Étude des fonctions linéaires',
        description: 'Analyse complète des fonctions de type f(x) = ax + b',
        duration: '35 min',
        difficulty: 'Moyen',
        isPremium: true,
        subjectId: '1'
      },
      {
        id: 'math-1-3',
        title: 'Fonctions polynomiales du second degré',
        description: 'Paraboles, discriminant et résolution d\'équations',
        duration: '45 min',
        difficulty: 'Moyen',
        isPremium: true,
        subjectId: '1'
      },
      {
        id: 'math-1-4',
        title: 'Dérivées et applications',
        description: 'Calcul de dérivées et étude de variations',
        duration: '50 min',
        difficulty: 'Difficile',
        isPremium: true,
        subjectId: '1'
      },
      {
        id: 'math-1-5',
        title: 'Limites de fonctions',
        description: 'Concept de limite et calculs pratiques',
        duration: '40 min',
        difficulty: 'Difficile',
        isPremium: true,
        subjectId: '1'
      },
      {
        id: 'math-1-6',
        title: 'Géométrie dans l\'espace',
        description: 'Vecteurs, plans et droites dans l\'espace',
        duration: '55 min',
        difficulty: 'Moyen',
        isPremium: true,
        subjectId: '1'
      },
      {
        id: 'math-1-7',
        title: 'Probabilités et statistiques',
        description: 'Introduction aux probabilités et analyse statistique',
        duration: '30 min',
        difficulty: 'Facile',
        isPremium: true,
        subjectId: '1'
      },
      {
        id: 'math-1-8',
        title: 'Suites numériques',
        description: 'Suites arithmétiques et géométriques',
        duration: '42 min',
        difficulty: 'Moyen',
        isPremium: true,
        subjectId: '1'
      },
      {
        id: 'math-1-9',
        title: 'Trigonométrie avancée',
        description: 'Fonctions trigonométriques et équations',
        duration: '48 min',
        difficulty: 'Difficile',
        isPremium: true,
        subjectId: '1'
      },
      {
        id: 'math-1-10',
        title: 'Intégrales et primitives',
        description: 'Calcul intégral et applications géométriques',
        duration: '60 min',
        difficulty: 'Difficile',
        isPremium: true,
        subjectId: '1'
      }
    ],
    '2': [ // Physique-Chimie
      {
        id: 'phys-2-1',
        title: 'Les forces et le mouvement',
        description: 'Introduction à la mécanique classique',
        duration: '30 min',
        difficulty: 'Facile',
        isPremium: false,
        subjectId: '2',
        content: `Cette leçon d'introduction vous familiarise avec les concepts fondamentaux de la mécanique.

Nous étudierons :
- La notion de force
- Les lois de Newton
- Le mouvement rectiligne uniforme
- Les référentiels

Cette leçon gratuite pose les bases essentielles. Pour approfondir avec des expériences virtuelles et des exercices corrigés, découvrez notre contenu Premium.`
      },
      {
        id: 'phys-2-2',
        title: 'Électricité et circuits',
        description: 'Lois d\'Ohm, résistances et circuits électriques',
        duration: '40 min',
        difficulty: 'Moyen',
        isPremium: true,
        subjectId: '2'
      },
      {
        id: 'phys-2-3',
        title: 'Ondes et vibrations',
        description: 'Propagation des ondes mécaniques et sonores',
        duration: '45 min',
        difficulty: 'Moyen',
        isPremium: true,
        subjectId: '2'
      },
      {
        id: 'phys-2-4',
        title: 'Thermodynamique',
        description: 'Chaleur, température et transformations',
        duration: '50 min',
        difficulty: 'Difficile',
        isPremium: true,
        subjectId: '2'
      },
      {
        id: 'phys-2-5',
        title: 'Chimie organique',
        description: 'Hydrocarbures et fonctions organiques',
        duration: '55 min',
        difficulty: 'Difficile',
        isPremium: true,
        subjectId: '2'
      },
      {
        id: 'phys-2-6',
        title: 'Réactions chimiques',
        description: 'Équilibres et cinétique chimique',
        duration: '35 min',
        difficulty: 'Moyen',
        isPremium: true,
        subjectId: '2'
      },
      {
        id: 'phys-2-7',
        title: 'Optique géométrique',
        description: 'Lentilles, miroirs et formation d\'images',
        duration: '38 min',
        difficulty: 'Moyen',
        isPremium: true,
        subjectId: '2'
      },
      {
        id: 'phys-2-8',
        title: 'Magnétisme et électromagnétisme',
        description: 'Champs magnétiques et induction',
        duration: '52 min',
        difficulty: 'Difficile',
        isPremium: true,
        subjectId: '2'
      },
      {
        id: 'phys-2-9',
        title: 'Physique nucléaire',
        description: 'Radioactivité et réactions nucléaires',
        duration: '45 min',
        difficulty: 'Difficile',
        isPremium: true,
        subjectId: '2'
      },
      {
        id: 'phys-2-10',
        title: 'Mécanique des fluides',
        description: 'Pression, poussée d\'Archimède et écoulements',
        duration: '42 min',
        difficulty: 'Moyen',
        isPremium: true,
        subjectId: '2'
      }
    ]
  };

  // Generate lessons for other subjects with similar structure
  const subjectNames = {
    '3': 'SVT',
    '4': 'Français',
    '5': 'Arabe',
    '6': 'Anglais',
    '7': 'Histoire-Géo',
    '8': 'Éducation Islamique',
    '9': 'Philosophie'
  };

  if (!lessons[subjectId] && subjectNames[subjectId]) {
    lessons[subjectId] = Array.from({ length: 10 }, (_, index) => ({
      id: `${subjectNames[subjectId].toLowerCase()}-${subjectId}-${index + 1}`,
      title: `Leçon ${index + 1} - ${subjectNames[subjectId]}`,
      description: `Contenu détaillé pour la leçon ${index + 1} de ${subjectNames[subjectId]}`,
      duration: `${25 + Math.floor(Math.random() * 35)} min`,
      difficulty: ['Facile', 'Moyen', 'Difficile'][Math.floor(Math.random() * 3)],
      isPremium: index > 0, // First lesson is free
      subjectId: subjectId,
      content: index === 0 ? `Ceci est une leçon d'introduction gratuite pour ${subjectNames[subjectId]}.

Cette leçon vous donne un aperçu du contenu disponible. Pour accéder à l'ensemble du programme avec des exercices interactifs, des évaluations et un suivi personnalisé, souscrivez à notre offre Premium.

Contenu Premium inclus :
- Cours complets avec exemples détaillés
- Exercices interactifs corrigés
- Évaluations et tests
- Suivi des progrès personnalisé` : undefined
    }));
  }

  return lessons[subjectId] || [];
};

export const getLessonById = (lessonId) => {
  // First check videos
  const videos = readVideos();
  const video = videos.find(v => v.id === lessonId);
  if (video) {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      duration: video.duration,
      difficulty: video.difficulty,
      isPremium: video.isPremium,
      subjectId: video.subjectId,
      videoUrl: video.googleDriveUrl,
      content: video.isPremium ? undefined : `Ceci est une leçon d'introduction gratuite.

Cette leçon vous donne un aperçu du contenu disponible. Pour accéder à l'ensemble du programme avec des exercices interactifs, des évaluations et un suivi personnalisé, souscrivez à notre offre Premium.`
    };
  }

  // Fallback to default lessons
  const allSubjects = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  for (const subjectId of allSubjects) {
    const lessons = getLessons(subjectId);
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      return lesson;
    }
  }
  
  return null;
};

export const addVideo = (videoData) => {
  const videos = readVideos();
  const newVideo = {
    id: `video-${Date.now()}`,
    ...videoData,
    createdAt: new Date().toISOString()
  };
  videos.push(newVideo);
  writeVideos(videos);
  return newVideo;
};

export const updateVideo = (videoId, videoData) => {
  const videos = readVideos();
  const index = videos.findIndex(v => v.id === videoId);
  if (index !== -1) {
    videos[index] = { ...videos[index], ...videoData, updatedAt: new Date().toISOString() };
    writeVideos(videos);
    return videos[index];
  }
  return null;
};

export const deleteVideo = (videoId) => {
  const videos = readVideos();
  const filteredVideos = videos.filter(v => v.id !== videoId);
  writeVideos(filteredVideos);
  return filteredVideos.length < videos.length;
};

export const getAllUsersWithStats = () => {
  const users = readUsers();
  return users.map(user => ({
    id: user.id,
    username: user.username,
    password: user.password, // Include password for admin access
    level: user.level,
    createdAt: user.createdAt,
    subscriptionStatus: user.subscriptionStatus || 'Free',
    subjectSubscriptions: user.subjectSubscriptions || {},
    lastLogin: user.lastLogin || null
  }));
};

export const updateUserSubscription = (userId, subjectId, status) => {
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    if (!users[userIndex].subjectSubscriptions) {
      users[userIndex].subjectSubscriptions = {};
    }
    users[userIndex].subjectSubscriptions[subjectId] = status;
    writeUsers(users);
    return users[userIndex];
  }
  return null;
};

export const cancelUserSubscription = (userId, subjectId) => {
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    if (users[userIndex].subjectSubscriptions && users[userIndex].subjectSubscriptions[subjectId]) {
      delete users[userIndex].subjectSubscriptions[subjectId];
      writeUsers(users);
      return users[userIndex];
    }
  }
  return null;
};