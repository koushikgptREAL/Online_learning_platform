import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  Users, 
  Clock, 
  Play, 
  ShoppingCart,
  BookOpen,
  Award
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: string;
  currency: string;
  categoryId?: string;
  instructorId?: string;
  level: string;
  rating: string;
  totalEnrollments: number;
  duration?: number;
}

interface CourseCard3DProps {
  course: Course;
  showProgress?: boolean;
  progress?: number;
  isEnrolled?: boolean;
}

export default function CourseCard3D({ 
  course, 
  showProgress = false, 
  progress = 0, 
  isEnrolled = false 
}: CourseCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (categoryId?: string) => {
    switch (categoryId) {
      case 'development':
      case 'web-dev':
        return 'primary';
      case 'data-science':
        return 'secondary';
      case 'design':
        return 'accent';
      default:
        return 'primary';
    }
  };

  const getCategoryName = (categoryId?: string) => {
    switch (categoryId) {
      case 'development':
      case 'web-dev':
        return 'Development';
      case 'data-science':
        return 'Data Science';
      case 'design':
        return 'Design';
      default:
        return 'Course';
    }
  };

  const categoryColor = getCategoryColor(course.categoryId);
  const categoryName = getCategoryName(course.categoryId);

  return (
    <Card 
      className="glass-effect border-0 course-card-3d group overflow-hidden transition-all duration-700 hover:bg-white/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'rotateY(5deg) rotateX(2deg) scale(1.02)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={`bg-${categoryColor}/20 text-${categoryColor} border-${categoryColor}/50`}>
            {categoryName}
          </Badge>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="glass-effect px-3 py-1 rounded-full">
            <span className="text-lg font-bold text-accent">₹{parseFloat(course.price).toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        {/* Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="glass-effect rounded-full p-4 hover:bg-white/30 transition-all duration-300 cursor-pointer">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        {/* Course Title & Description */}
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2 mb-3">
            {course.description}
          </p>
        </div>
        
        {/* Course Meta */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
              <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-secondary text-white">
                IN
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-400">Expert Instructor</span>
          </div>
          
          <Badge className={`bg-${categoryColor}/10 text-${categoryColor} border-${categoryColor}/30`}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </Badge>
        </div>
        
        {/* Rating & Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">{course.rating}</span>
            <span className="text-gray-400">({course.totalEnrollments})</span>
          </div>
          
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{course.totalEnrollments}</span>
            </div>
            {course.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{Math.round(course.duration / 60)}h</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar (if enrolled) */}
        {showProgress && isEnrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2">
              <div 
                className="progress-3d h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {isEnrolled ? (
            <Link href={`/courses/${course.id}`} className="flex-1">
              <Button className="w-full bg-accent hover:bg-accent/80 group-hover:scale-105 transition-all duration-300">
                <Play className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </Link>
          ) : (
            <>
              <Link href={`/courses/${course.id}`} className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full glass-effect border-primary/50 hover:bg-primary/20 group-hover:scale-105 transition-all duration-300"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </Link>
              <Link href={`/checkout/${course.id}`}>
                <Button className="glass-effect border-0 bg-primary/20 hover:bg-primary/30 group-hover:scale-105 transition-all duration-300">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Course Features */}
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 pt-2 border-t border-gray-600">
          <div className="flex items-center space-x-1">
            <Award className="w-3 h-3" />
            <span>Certificate</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Lifetime Access</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
