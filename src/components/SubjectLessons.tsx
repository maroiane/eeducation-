import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Lock, Star, Clock, BookOpen, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subjectsAPI, lessonsAPI } from '../utils/api';
import * as Icons from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  isPremium: boolean;
  videoUrl?: string;
  content?: string;
}

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subscriptionPrice: number;
}

const SubjectLessons: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.level && subjectId) {
        try {
          const [subjectsData, lessonsData] = await Promise.all([
            subjectsAPI.getByLevel(user.level),
            lessonsAPI.getBySubject(subjectId)
          ]);
          
          const currentSubject = subjectsData.find((s: Subject) => s.id === subjectId);
          setSubject(currentSubject || null);
          setLessons(lessonsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.level, subjectId]);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || BookOpen;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-700';
      case 'Moyen': return 'bg-yellow-100 text-yellow-700';
      case 'Difficile': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isPremium) {
      setSelectedLesson(lesson);
      setShowPaymentModal(true);
    } else {
      // Navigate to free lesson content
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const handlePayment = () => {
    // This would integrate with a real payment system
    alert('Redirection vers le système de paiement...');
    setShowPaymentModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Matière non trouvée</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = getIconComponent(subject.icon);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mr-6"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{subject.name}</h1>
                <p className="text-sm text-gray-600">{subject.description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Cours disponibles</h2>
          <p className="text-gray-600 text-lg">
            Découvrez {lessons.length} leçons pour maîtriser {subject.name}
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleLessonClick(lesson)}
            >
              <div className="relative">
                <div className={`h-2 ${subject.color}`}></div>
                {lesson.isPremium && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Premium
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                      Leçon {index + 1}: {lesson.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.duration}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {lesson.isPremium ? (
                      <Lock className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Play className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {lesson.isPremium ? 'Contenu Premium' : 'Accès Gratuit'}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    {lesson.isPremium ? (
                      <Lock className="h-4 w-4 text-red-600" />
                    ) : (
                      <Play className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Benefits Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Débloquez {subject.name} Premium
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Accédez à tous les cours de {subject.name}, exercices interactifs, corrections détaillées et suivi personnalisé pour exceller dans cette matière.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 justify-center">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Cours complets</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <BookOpen className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Exercices corrigés</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Suivi personnalisé</span>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
              >
                S'abonner à {subject.name} - {subject.subscriptionPrice} DH/mois
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Abonnement {subject.name}
              </h3>
              {selectedLesson && (
                <p className="text-gray-600">
                  Pour accéder à "{selectedLesson.title}" et à tous les cours de {subject.name}, souscrivez à l'abonnement spécialisé.
                </p>
              )}
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{subject.subscriptionPrice} DH</div>
                <div className="text-sm text-gray-600">par mois pour {subject.name}</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700">Accès à tous les cours de {subject.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700">Exercices interactifs spécialisés</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700">Suivi des progrès personnalisé</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700">Support prioritaire pour cette matière</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
              >
                S'abonner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectLessons;