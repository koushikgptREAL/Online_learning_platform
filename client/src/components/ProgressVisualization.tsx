import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award,
  ChevronRight
} from "lucide-react";

interface Enrollment {
  id: string;
  courseId: string;
  progress: string;
  enrolledAt: string;
  completedAt?: string;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    level: string;
    duration?: number;
  };
}

interface ProgressVisualizationProps {
  enrollments: Enrollment[];
}

export default function ProgressVisualization({ enrollments }: ProgressVisualizationProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'accent';
      case 'intermediate':
        return 'primary';
      case 'advanced':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'accent';
    if (progress >= 60) return 'primary';
    if (progress >= 30) return 'secondary';
    return 'gray-400';
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {enrollments.length === 0 ? (
        <Card className="glass-effect border-0 text-center course-card-3d">
          <CardContent className="p-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No courses enrolled</h3>
            <p className="text-gray-300 mb-6">Start your learning journey by enrolling in a course!</p>
            <Link href="/courses">
              <Button className="glass-effect border-0 bg-primary/20 hover:bg-primary/30">
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const progress = parseFloat(enrollment.progress || "0");
            const levelColor = getLevelColor(enrollment.course.level);
            const progressColor = getProgressColor(progress);
            const isCompleted = !!enrollment.completedAt;
            const isHovered = hoveredCard === enrollment.id;

            return (
              <Card 
                key={enrollment.id}
                className="glass-effect border-0 course-card-3d group hover:bg-white/10 transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredCard(enrollment.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: isHovered ? 'scale(1.02) translateZ(10px)' : 'scale(1) translateZ(0px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    {/* Course Thumbnail */}
                    <div className="relative">
                      <div className="w-20 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                        <img 
                          src={enrollment.course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=160"}
                          alt={enrollment.course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      
                      {/* Progress Ring */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8">
                        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-600"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`text-${progressColor}`}
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={`${progress}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xs font-bold text-${progressColor}`}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                          {enrollment.course.title}
                        </h4>
                        <Badge className={`bg-${levelColor}/20 text-${levelColor} border-${levelColor}/50`}>
                          {enrollment.course.level}
                        </Badge>
                        {isCompleted && (
                          <Badge className="bg-accent/20 text-accent border-accent/50">
                            <Award className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-1">
                        {enrollment.course.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(enrollment.course.duration)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300">Progress</span>
                            <span className={`font-medium text-${progressColor}`}>
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="relative">
                            <Progress 
                              value={progress} 
                              className="h-2 bg-gray-700"
                            />
                            <div 
                              className={`absolute top-0 left-0 h-2 bg-gradient-to-r from-${progressColor} to-${progressColor}/80 rounded-full transition-all duration-1000 progress-3d`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <Link href={`/courses/${enrollment.course.id}`}>
                          <Button 
                            className="glass-effect border-0 bg-primary/20 hover:bg-primary/30 group-hover:scale-105 transition-all duration-300"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {isCompleted ? 'Review' : 'Continue'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Arrow Indicator */}
                    <div className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Progress Summary */}
      {enrollments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="glass-effect border-0 course-card-3d text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {enrollments.length}
              </div>
              <div className="text-gray-300 text-sm">Active Courses</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-0 course-card-3d text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent mb-2">
                {enrollments.filter(e => e.completedAt).length}
              </div>
              <div className="text-gray-300 text-sm">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-0 course-card-3d text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-secondary mb-2">
                {Math.round(
                  enrollments.reduce((sum, e) => sum + parseFloat(e.progress || "0"), 0) / enrollments.length
                )}%
              </div>
              <div className="text-gray-300 text-sm">Average Progress</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
