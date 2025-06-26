import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Users, 
  Video, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Calendar,
  Crown,
  UserCheck,
  BookOpen,
  Eye,
  Key,
  UserX,
  DollarSign
} from 'lucide-react';
import { adminAPI } from '../utils/api';
import * as Icons from 'lucide-react';

interface User {
  id: string;
  username: string;
  password: string;
  level: string;
  createdAt: string;
  subscriptionStatus: string;
  subjectSubscriptions: { [key: string]: string };
  lastLogin?: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  level: string;
  googleDriveUrl: string;
  duration: string;
  difficulty: string;
  isPremium: boolean;
  createdAt: string;
  createdBy: string;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'videos'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    subjectId: '1',
    level: '1bac-math',
    googleDriveUrl: '',
    duration: '',
    difficulty: 'Facile',
    isPremium: false
  });

  const subjects = {
    '1': 'Mathématiques',
    '2': 'Physique-Chimie',
    '3': 'Sciences de la Vie et de la Terre',
    '4': 'Français',
    '5': 'Arabe',
    '6': 'Anglais',
    '7': 'Histoire-Géographie',
    '8': 'Éducation Islamique',
    '9': 'Philosophie'
  };

  const levelOptions = [
    { value: '1bac-math', label: '1ère Bac - Sciences Mathématiques' },
    { value: '1bac-exp', label: '1ère Bac - Sciences Expérimentales' },
    { value: '1bac-lit', label: '1ère Bac - Lettres' },
    { value: '1bac-hum', label: '1ère Bac - Sciences Humaines' },
    { value: '2bac-math', label: '2ème Bac - Sciences Mathématiques' },
    { value: '2bac-phys', label: '2ème Bac - Sciences Physiques' },
    { value: '2bac-svt', label: '2ème Bac - Sciences de la Vie et de la Terre' },
    { value: '2bac-lit', label: '2ème Bac - Lettres et Sciences Humaines' }
  ];

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [usersData, videosData] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getVideos()
      ]);
      setUsers(usersData);
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVideo) {
        await adminAPI.updateVideo(editingVideo.id, videoForm);
      } else {
        await adminAPI.addVideo(videoForm);
      }
      setShowVideoModal(false);
      setEditingVideo(null);
      setVideoForm({
        title: '',
        description: '',
        subjectId: '1',
        level: '1bac-math',
        googleDriveUrl: '',
        duration: '',
        difficulty: 'Facile',
        isPremium: false
      });
      fetchData();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      subjectId: video.subjectId,
      level: video.level,
      googleDriveUrl: video.googleDriveUrl,
      duration: video.duration,
      difficulty: video.difficulty,
      isPremium: video.isPremium
    });
    setShowVideoModal(true);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      try {
        await adminAPI.deleteVideo(videoId);
        fetchData();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleShowPassword = (user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const handleCancelSubscription = async (userId: string, subjectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cet abonnement ?')) {
      try {
        await adminAPI.cancelUserSubscription(userId, subjectId);
        fetchData();
      } catch (error) {
        console.error('Error canceling subscription:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLevelDisplayName = (level: string) => {
    const option = levelOptions.find(opt => opt.value === level);
    return option ? option.label : level;
  };

  const getSubscriptionBadge = (status: string) => {
    if (status === 'Premium') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
          <Crown className="h-3 w-3" />
          Premium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
        <UserCheck className="h-3 w-3" />
        Gratuit
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-black rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panneau d'Administration</h1>
                <p className="text-sm text-gray-600">Gestion de la plateforme éducative</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Shield className="h-4 w-4" />
                <span>{user?.username}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  Administrateur
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Utilisateurs</h3>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vidéos</h3>
                <p className="text-2xl font-bold text-green-600">{videos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Abonnements</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {users.reduce((total, user) => {
                    return total + Object.keys(user.subjectSubscriptions || {}).length;
                  }, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'text-gray-900 border-b-2 border-gray-900 bg-gray-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="h-5 w-5" />
                Utilisateurs ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'videos'
                    ? 'text-gray-900 border-b-2 border-gray-900 bg-gray-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Video className="h-5 w-5" />
                Vidéos ({videos.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Gestion des Utilisateurs
                  </h3>
                  <p className="text-gray-600">
                    Liste de tous les comptes utilisateurs avec leurs informations et abonnements
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Utilisateur</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Niveau</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Abonnements</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Inscription</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-gray-600" />
                              </div>
                              <span className="font-medium text-gray-900">{user.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {getLevelDisplayName(user.level)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {user.subjectSubscriptions && Object.keys(user.subjectSubscriptions).length > 0 ? (
                                Object.entries(user.subjectSubscriptions).map(([subjectId, status]) => (
                                  <div key={subjectId} className="flex items-center gap-1">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                      {subjects[subjectId as keyof typeof subjects]}
                                    </span>
                                    <button
                                      onClick={() => handleCancelSubscription(user.id, subjectId)}
                                      className="text-red-500 hover:text-red-700"
                                      title="Annuler l'abonnement"
                                    >
                                      <UserX className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-500 text-sm">Aucun abonnement</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleShowPassword(user)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                            >
                              <Key className="h-3 w-3" />
                              Mot de passe
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'videos' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Gestion des Vidéos
                    </h3>
                    <p className="text-gray-600">
                      Ajoutez et gérez les vidéos de cours avec liens Google Drive
                    </p>
                  </div>
                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-lg hover:from-gray-900 hover:to-gray-800 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une vidéo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{video.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                        </div>
                        {video.isPremium && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            <Crown className="h-3 w-3" />
                            Premium
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="h-4 w-4" />
                          <span>{subjects[video.subjectId as keyof typeof subjects]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{getLevelDisplayName(video.level)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Eye className="h-4 w-4" />
                          <span>{video.duration} • {video.difficulty}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditVideo(video)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingVideo ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
            </h3>

            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de la vidéo
                </label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={videoForm.description}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matière
                  </label>
                  <select
                    value={videoForm.subjectId}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, subjectId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    {Object.entries(subjects).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau
                  </label>
                  <select
                    value={videoForm.level}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    {levelOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien Google Drive
                </label>
                <input
                  type="url"
                  value={videoForm.googleDriveUrl}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, googleDriveUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="25 min"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulté
                  </label>
                  <select
                    value={videoForm.difficulty}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="Facile">Facile</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={videoForm.isPremium}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, isPremium: e.target.checked }))}
                  className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                />
                <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
                  Contenu Premium (payant)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoModal(false);
                    setEditingVideo(null);
                    setVideoForm({
                      title: '',
                      description: '',
                      subjectId: '1',
                      level: '1bac-math',
                      googleDriveUrl: '',
                      duration: '',
                      difficulty: 'Facile',
                      isPremium: false
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-lg hover:from-gray-900 hover:to-gray-800 transition-all duration-200"
                >
                  {editingVideo ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Mot de passe de l'utilisateur
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={selectedUser.username}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe (hashé)
                </label>
                <textarea
                  value={selectedUser.password}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs font-mono"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;