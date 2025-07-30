import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "../components/Navigation";
import CourseCard3D from "../components/CourseCard3D";
import LiveClassInterface from "../components/LiveClassInterface";
import ProgressVisualization from "../components/ProgressVisualization";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  currency: string;
  instructorId: string;
  rating: string;
  totalEnrollments: number;
}

interface UserProgress {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  overallProgress: number;
}

export default function Home() {
  const { user } = useAuth();
  
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress"],
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/user/enrollments"],
  });

  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Navigation isAuthenticated={true} user={user} />
      
      {/* Welcome Hero */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary/30 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-secondary/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-accent/30 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              Welcome back, {user?.firstName || 'Learner'}!
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Continue your learning journey and unlock new possibilities
            </p>
          </div>
          
          {/* Quick Stats */}
          {userProgress && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="glass-effect border-0 course-card-3d">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary">{userProgress.totalCourses}</div>
                  <div className="text-gray-300 text-sm">Enrolled Courses</div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-0 course-card-3d">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-secondary">{userProgress.completedCourses}</div>
                  <div className="text-gray-300 text-sm">Completed</div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-0 course-card-3d">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
                  <div className="text-2xl font-bold text-accent">{userProgress.totalHours}h</div>
                  <div className="text-gray-300 text-sm">Learning Time</div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-0 course-card-3d">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary">{userProgress.overallProgress}%</div>
                  <div className="text-gray-300 text-sm">Overall Progress</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
      
      {/* Continue Learning */}
      {enrollments.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gradient">Continue Learning</h2>
              <Link href="/dashboard">
                <Button variant="outline" className="glass-effect border-primary/50 hover:bg-primary/20">
                  View All Progress
                </Button>
              </Link>
            </div>
            
            <ProgressVisualization enrollments={enrollments.slice(0, 3)} />
          </div>
        </section>
      )}
      
      {/* Featured Courses */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gradient">Featured Courses</h2>
            <Link href="/courses">
              <Button variant="outline" className="glass-effect border-primary/50 hover:bg-primary/20">
                Browse All Courses
              </Button>
            </Link>
          </div>
          
          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="glass-effect border-0 animate-pulse">
                  <div className="h-48 bg-gray-600 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-600 rounded mb-3"></div>
                    <div className="h-3 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard3D key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Live Classes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gradient">Live Classes Today</h2>
            <Link href="/live-classes">
              <Button variant="outline" className="glass-effect border-primary/50 hover:bg-primary/20">
                View All Classes
              </Button>
            </Link>
          </div>
          
          <LiveClassInterface />
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
