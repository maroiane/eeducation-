import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, BookOpen, Star } from 'lucide-react';
import { subjectsAPI } from '../utils/api';
import * as Icons from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (user?.level) {
        try {
          const data = await subjectsAPI.getByLevel(user.level);
          setSubjects(data);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSubjects();
  }, [user?.level]);

  const handleLogout = () => {
    logout();
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subject/${subjectId}`);
  };

  const getLevelDisplayName = (level: string) => {
    return level === '1bac' ? '1ère Baccalauréat' : '2ème Baccalauréat';
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || BookOpen;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Plateforme Éducative</h1>
                <p className="text-sm text-gray-600">Excellence Marocaine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  {getLevelDisplayName(user?.level || '')}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.username?.split('@')[0]}!
          </h2>
          <p className="text-gray-600 text-lg">
            Explorez vos matières pour le niveau {getLevelDisplayName(user?.level || '')}
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject) => {
            const IconComponent = getIconComponent(subject.icon);
            return (
              <div
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
              >
                <div className={`h-2 ${subject.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {subject.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {subject.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {getLevelDisplayName(user?.level || '')}
                    </span>
                    <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <BookOpen className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Commencez votre apprentissage
            </h3>
            <p className="text-gray-600">
              Cliquez sur une matière pour découvrir les cours disponibles. Chaque matière contient des leçons gratuites et premium !
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;