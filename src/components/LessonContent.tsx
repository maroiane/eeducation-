import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Clock, BookOpen, Shield, Lock, Volume2, VolumeX, Maximize, SkipForward } from 'lucide-react';
import { lessonsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  isPremium: boolean;
  videoUrl?: string;
  content?: string;
  subjectId: string;
}

interface SecureVideoData {
  videoUrl: string;
  videoToken: string;
  expiresIn: number;
}

interface VideoProgress {
  currentTime: number;
  duration: number;
  watchedPercentage: number;
  canSkip: boolean;
}

const LessonContent: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [secureVideoData, setSecureVideoData] = useState<SecureVideoData | null>(null);
  const [videoError, setVideoError] = useState<string>('');
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState<VideoProgress>({
    currentTime: 0,
    duration: 0,
    watchedPercentage: 0,
    canSkip: false
  });
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      if (lessonId) {
        try {
          const lessonData = await lessonsAPI.getById(lessonId);
          setLesson(lessonData);
          
          // If lesson has a video, get secure access
          if (lessonData.videoUrl) {
            setIsLoadingVideo(true);
            try {
              const secureData = await lessonsAPI.getSecureVideo(lessonId);
              setSecureVideoData(secureData);
              setVideoError('');
            } catch (error: any) {
              console.error('Secure video error:', error);
              if (error.response?.status === 403) {
                setVideoError('Abonnement requis pour accéder à cette vidéo');
              } else if (error.response?.status === 404) {
                setVideoError('Vidéo non disponible');
              } else {
                setVideoError('Erreur lors du chargement de la vidéo');
              }
            } finally {
              setIsLoadingVideo(false);
            }
          }
        } catch (error) {
          console.error('Error fetching lesson:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLesson();
  }, [lessonId]);

  // Convert Google Drive URL to direct video stream
  const convertGoogleDriveToDirectUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      // Use Google Drive's direct video streaming endpoint
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return url;
  };

  // Video event handlers
  const handleVideoLoad = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideoProgress(prev => ({ ...prev, duration }));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const watchedPercentage = (currentTime / duration) * 100;
      
      // Update max watched time (prevent skipping ahead)
      if (currentTime > maxWatchedTime) {
        setMaxWatchedTime(currentTime);
      }
      
      // Check if user is trying to skip ahead
      if (currentTime > maxWatchedTime + 5) { // Allow 5 seconds buffer
        videoRef.current.currentTime = maxWatchedTime;
        setShowSkipWarning(true);
        setTimeout(() => setShowSkipWarning(false), 3000);
        return;
      }

      setVideoProgress({
        currentTime,
        duration,
        watchedPercentage,
        canSkip: watchedPercentage > 90 // Allow skipping after 90% watched
      });

      setProgress(watchedPercentage);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setMaxWatchedTime(0);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickPercentage = (clickX / width) * 100;
      const targetTime = (clickPercentage / 100) * videoRef.current.duration;
      
      // Prevent seeking beyond max watched time
      if (targetTime <= maxWatchedTime + 5) {
        videoRef.current.currentTime = targetTime;
      } else {
        setShowSkipWarning(true);
        setTimeout(() => setShowSkipWarning(false), 3000);
      }
    }
  };

  const markAsCompleted = () => {
    if (videoProgress.watchedPercentage >= 90) {
      setProgress(100);
      // Here you would typically save progress to backend
    } else {
      alert('Vous devez regarder au moins 90% de la vidéo pour la marquer comme terminée.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Leçon non trouvée</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/subject/${lesson.subjectId}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Retour aux leçons</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                  <p className="text-sm text-gray-600">{lesson.duration}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{lesson.duration}</span>
              </div>
              {lesson.isPremium && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Contenu sécurisé</span>
                </div>
              )}
              {progress === 100 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Terminé</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Skip Warning */}
      {showSkipWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <SkipForward className="h-5 w-5" />
          <span>Vous devez regarder la vidéo dans l'ordre. Impossible d'avancer.</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Player Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="aspect-video bg-black relative group">
            {isLoadingVideo ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-lg font-medium">Chargement de la vidéo...</p>
                </div>
              </div>
            ) : videoError ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-10 w-10" />
                  </div>
                  <p className="text-lg font-medium mb-2">Accès restreint</p>
                  <p className="text-gray-300">{videoError}</p>
                  {videoError.includes('Abonnement requis') && (
                    <button
                      onClick={() => navigate(`/subject/${lesson.subjectId}`)}
                      className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Voir les options d'abonnement
                    </button>
                  )}
                </div>
              </div>
            ) : secureVideoData?.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  onLoadedMetadata={handleVideoLoad}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onContextMenu={(e) => e.preventDefault()} // Disable right-click
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  playsInline
                >
                  <source src={convertGoogleDriveToDirectUrl(secureVideoData.videoUrl)} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>

                {/* Custom Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-2 bg-gray-600 rounded-full mb-4 cursor-pointer relative"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-full bg-red-600 rounded-full transition-all duration-300"
                      style={{ width: `${videoProgress.watchedPercentage}%` }}
                    ></div>
                    {/* Max watched indicator */}
                    <div 
                      className="absolute top-0 h-full w-1 bg-yellow-400 rounded-full"
                      style={{ left: `${(maxWatchedTime / videoProgress.duration) * 100}%` }}
                    ></div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handlePlayPause}
                        className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                      </button>

                      <button
                        onClick={handleRestart}
                        className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button onClick={toggleMute}>
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-20"
                        />
                      </div>

                      <span className="text-sm">
                        {formatTime(videoProgress.currentTime)} / {formatTime(videoProgress.duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm bg-black/50 px-2 py-1 rounded">
                        Regardé: {Math.round(videoProgress.watchedPercentage)}%
                      </div>
                      <button
                        onClick={toggleFullscreen}
                        className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                      >
                        <Maximize className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-red-700 transition-colors"
                       onClick={handlePlayPause}>
                    {isPlaying ? (
                      <Pause className="h-10 w-10" />
                    ) : (
                      <Play className="h-10 w-10 ml-1" />
                    )}
                  </div>
                  <p className="text-lg font-medium">{lesson.title}</p>
                  <p className="text-gray-300">{lesson.duration}</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Lecture sécurisée - Progression suivie</span>
              </div>
              
              {secureVideoData && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Accès autorisé</span>
                </div>
              )}
            </div>

            <button
              onClick={markAsCompleted}
              disabled={videoProgress.watchedPercentage < 90}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={videoProgress.watchedPercentage < 90 ? 'Regardez au moins 90% de la vidéo' : 'Marquer comme terminé'}
            >
              <CheckCircle className="h-4 w-4" />
              <span>{progress === 100 ? 'Terminé' : 'Marquer comme terminé'}</span>
            </button>
          </div>
        </div>

        {/* Progress Tracking Info */}
        {secureVideoData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Suivi de progression</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{Math.round(videoProgress.watchedPercentage)}%</div>
                <div className="text-sm text-gray-600">Progression actuelle</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{formatTime(maxWatchedTime)}</div>
                <div className="text-sm text-gray-600">Temps maximum regardé</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {videoProgress.watchedPercentage >= 90 ? '✓' : '✗'}
                </div>
                <div className="text-sm text-gray-600">Éligible à la validation</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Vous devez regarder la vidéo dans l'ordre chronologique. 
                Le saut en avant est bloqué pour garantir un apprentissage complet.
              </p>
            </div>
          </div>
        )}

        {/* Lesson Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu de la leçon</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {lesson.content || `Contenu de la leçon "${lesson.title}".

Cette leçon couvre les concepts essentiels de ${lesson.title}. 

Pour accéder au contenu complet avec des exercices interactifs et des évaluations, souscrivez à notre offre Premium.`}
            </div>
          </div>

          {/* Security Notice for Premium Content */}
          {lesson.isPremium && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800">Contenu protégé</h4>
                  <p className="text-sm text-yellow-700">
                    Cette leçon est sécurisée avec suivi de progression obligatoire. 
                    Le contenu est protégé contre le téléchargement et la copie non autorisée.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Lesson Suggestion */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-yellow-50 border border-red-200 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {progress === 100 ? 'Félicitations ! Vous avez terminé cette leçon' : 'Terminez cette leçon pour continuer'}
            </h3>
            <p className="text-gray-600 mb-4">
              {progress === 100 
                ? 'Continuez votre apprentissage avec la prochaine leçon'
                : `Regardez encore ${Math.round(90 - videoProgress.watchedPercentage)}% pour valider cette leçon`
              }
            </p>
            <button
              onClick={() => navigate(`/subject/${lesson.subjectId}`)}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200"
            >
              Voir toutes les leçons
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonContent;