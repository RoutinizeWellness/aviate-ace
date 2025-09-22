import React from 'react';
import { useAuth } from '@/hooks/useConvexAuth';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  User, 
  Bell,
  Plane,
  AlertTriangle,
  Settings,
  Award
} from 'lucide-react';

interface DashboardProps {
  className?: string;
}

export default function ImprovedDashboard({ className }: DashboardProps) {
  const { user, isLoading } = useAuth();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Brain, label: 'Practice Exams' },
    { icon: BookOpen, label: 'Study Modules' },
    { icon: TrendingUp, label: 'Progress' },
    { icon: Award, label: 'Resources' },
  ];

  const moduleCards = [
    { 
      icon: Plane, 
      title: 'Manuales de vuelo',
      description: 'Flight Manuals'
    },
    { 
      icon: AlertTriangle, 
      title: 'Procedimientos de emergencia',
      description: 'Emergency Procedures'
    },
    { 
      icon: Settings, 
      title: 'Sistemas de aeronaves',
      description: 'Aircraft Systems'
    },
    { 
      icon: Award, 
      title: 'Regulaciones de aviación',
      description: 'Aviation Regulations'
    },
  ];

  const courses = [
    {
      title: 'Curso de preparación B737',
      progress: 60,
      image: '/src/assets/hero-cockpit.jpg'
    },
    {
      title: 'Curso de preparación A320',
      progress: 90,
      image: '/src/assets/hero-cockpit.jpg'
    }
  ];

  const topicScores = [
    { name: 'Aerodynamics', score: 92 },
    { name: 'Navigation', score: 85 },
    { name: 'Meteorology', score: 78 },
    { name: 'Aircraft Systems', score: 88 },
    { name: 'Regulations', score: 80 },
  ];

  const timelineEvents = [
    {
      title: 'Completed: Aerodynamics Exam',
      subtitle: 'Score: 92%',
      time: '2 days ago',
      active: true
    },
    {
      title: 'Studied: Navigation Module',
      subtitle: 'Duration: 2 hours', 
      time: '4 days ago',
      active: true
    },
    {
      title: 'Passed: Meteorology Exam',
      subtitle: 'Score: 78%',
      time: '1 week ago',
      active: true
    },
    {
      title: 'Started: Aircraft Systems',
      subtitle: '',
      time: '2 weeks ago',
      active: false
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121A18] text-white font-[Lexend,_'Noto_Sans',_sans-serif]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#2A3C32] px-10 py-3">
        <div className="flex items-center gap-4">
          <div className="size-6 text-[#36E27B]">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
              <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold">PilotPrep</h2>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#A8B5AF]">
          {navigationItems.map((item) => (
            <a 
              key={item.label}
              href="#" 
              className={`hover:text-white transition-colors ${item.active ? 'text-white font-semibold' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-[#A8B5AF] hover:text-white hover:bg-[#1C2923]">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="size-10 border-2 border-[#2A3C32]">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-[#2A3C32] text-white">
              {user?.displayName?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-10 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Panel de Control</h1>
            <p className="text-[#A8B5AF] mt-2">Una visión completa de tu progreso de aprendizaje.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overall Progress */}
              <Card className="bg-[#1C2923] border-[#2A3C32] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Progreso General</h3>
                  <span className="text-[#36E27B] font-bold text-lg">75%</span>
                </div>
                <Progress value={75} className="h-3 mb-3 bg-[#2A3C32]" />
                <p className="text-[#A8B5AF] text-sm">¡Sigue así! Estás a punto de completar todos los materiales.</p>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-[#1C2923] border-[#2A3C32] p-6 text-center">
                  <p className="text-[#A8B5AF] text-sm font-medium mb-2">Módulos Completados</p>
                  <p className="text-5xl font-bold text-white mb-2">
                    18 <span className="text-3xl text-[#A8B5AF]">/ 24</span>
                  </p>
                  <Progress value={75} className="w-24 h-1 mx-auto bg-[#2A3C32]" />
                </Card>

                <Card className="bg-[#1C2923] border-[#2A3C32] p-6 text-center">
                  <p className="text-[#A8B5AF] text-sm font-medium mb-2">Exámenes Aprobados</p>
                  <p className="text-5xl font-bold text-white mb-2">
                    5 <span className="text-3xl text-[#A8B5AF]">/ 7</span>
                  </p>
                  <Progress value={71.4} className="w-24 h-1 mx-auto bg-[#2A3C32]" />
                </Card>
              </div>

              {/* Courses */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Mis Cursos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course, index) => (
                    <Card key={index} className="bg-[#1C2923] border-[#2A3C32] overflow-hidden group cursor-pointer">
                      <div 
                        className="w-full h-48 bg-center bg-cover transition-transform duration-300 group-hover:scale-105" 
                        style={{backgroundImage: `url(${course.image})`}}
                      />
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[#A8B5AF] text-sm">Progreso:</span>
                          <Progress value={course.progress} className="flex-1 h-2 bg-[#2A3C32]" />
                          <span className="text-[#36E27B] text-sm font-semibold">{course.progress}%</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Score Breakdown */}
              <Card className="bg-[#1C2923] border-[#2A3C32] p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Puntuación por Tema</h3>
                <div className="space-y-6">
                  {topicScores.map((topic, index) => (
                    <div key={index} className="grid grid-cols-[150px_1fr_50px] items-center gap-4">
                      <span className="text-white font-medium text-sm">{topic.name}</span>
                      <Progress value={topic.score} className="bg-[#2A3C32]" />
                      <span className="text-white font-semibold text-sm text-right">{topic.score}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Timeline */}
            <div className="lg:col-span-1">
              <Card className="bg-[#1C2923] border-[#2A3C32] p-6 h-fit">
                <h3 className="text-lg font-semibold text-white mb-6">Cronología de Estudio</h3>
                <div className="relative border-l-2 border-[#2A3C32] pl-6 space-y-10">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="relative">
                      <div className={`absolute -left-[34px] top-1.5 size-4 rounded-full border-4 border-[#1C2923] ${
                        event.active ? 'bg-[#36E27B]' : 'bg-[#A8B5AF]'
                      }`} />
                      <div>
                        <p className="text-white font-semibold">{event.title}</p>
                        {event.subtitle && <p className="text-[#A8B5AF] text-sm">{event.subtitle}</p>}
                        <p className="text-[#A8B5AF] text-xs mt-1">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Access Modules */}
              <Card className="bg-[#1C2923] border-[#2A3C32] p-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-6">Acceso Rápido a Módulos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {moduleCards.map((module, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="flex flex-col items-center justify-center gap-2 h-auto p-4 bg-transparent border-transparent hover:border-[#36E27B] hover:bg-[#264532] text-center"
                    >
                      <module.icon className="h-8 w-8 text-[#36E27B]" />
                      <div>
                        <h4 className="text-white text-xs font-semibold leading-tight">{module.title}</h4>
                        <p className="text-[#A8B5AF] text-xs">{module.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#2A3C32] px-10 py-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <p className="text-[#A8B5AF] text-sm">© 2024 PilotPrep. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-[#A8B5AF] hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="text-[#A8B5AF] hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="text-[#A8B5AF] hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}