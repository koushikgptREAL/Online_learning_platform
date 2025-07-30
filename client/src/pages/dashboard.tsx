import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/Navigation";
import ProgressVisualization from "../components/ProgressVisualization";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Star, 
  Play,
  Calendar,
  Bell,
  Award
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

interface UserProgress {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  overallProgress: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress"],
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/user/enrollments"],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const recentEnrollments = enrollments.slice(0, 3);
  const unreadNotifications = notifications.filter(n => !n.isRead).slice(0, 3);

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Navigation isAuthenticated={true} user={user} />
      
      {/* Dashboard Header */}
      <section className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Learning Dashboard
            </h1>
            <p className="text-xl text-gray-300">
              Track your progress and continue your learning journey
            </p>
          </div>
          
          {/* Progress Overview */}
          {userProgress && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass-effect border-0 course-card-3d">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Courses</p>
                      <p className="text-3xl font-bold text-primary">{userProgress.totalCourses}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-0 course-card-3d">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Completed</p>
                      <p className="text-3xl font-bold text-secondary">{userProgress.completedCourses}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-0 course-card-3d">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Learning Hours</p>
                      <p className="text-3xl font-bold text-accent">{userProgress.totalHours}</p>
                    </div>
                    <Clock className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-0 course-card-3d">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Overall Progress</p>
                      <p className="text-3xl font-bold text-primary">{userProgress.overallProgress}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Overall Progress Bar */}
          {userProgress && (
            <Card className="glass-effect border-0 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Overall Learning Progress</h3>
                  <span className="text-lg font-semibold text-primary">{userProgress.overallProgress}%</span>
                </div>
                <Progress value={userProgress.overallProgress} className="h-3 progress-3d" />
                <p className="text-gray-400 text-sm mt-2">
                  Keep going! You're doing great on your learning journey.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      
      {/* Main Dashboard Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Courses */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gradient">Continue Learning</h2>
                <Link href="/courses">
                  <Button variant="outline" className="glass-effect border-primary/50 hover:bg-primary/20">
                    Browse More
                  </Button>
                </Link>
              </div>
              
              {recentEnrollments.length === 0 ? (
                <Card className="glass-effect border-0 text-center">
                  <CardContent className="p-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No courses yet</h3>
                    <p className="text-gray-300 mb-6">Start your learning journey by enrolling in a course!</p>
                    <Link href="/courses">
                      <Button className="glass-effect border-0 bg-primary/20 hover:bg-primary/30">
                        Explore Courses
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <ProgressVisualization enrollments={recentEnrollments} />
              )}
              
              {/* Achievements */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gradient mb-6">Recent Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="glass-effect border-0 course-card-3d">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-1">First Course</h4>
                      <p className="text-sm text-gray-400">Completed your first course</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-effect border-0 course-card-3d">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-1">Learning Streak</h4>
                      <p className="text-sm text-gray-400">7 days in a row</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-effect border-0 course-card-3d">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-1">Quick Learner</h4>
                      <p className="text-sm text-gray-400">Completed 3 lessons today</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                    {unreadNotifications.length > 0 && (
                      <Badge className="bg-red-500 text-white ml-auto">
                        {unreadNotifications.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {unreadNotifications.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No new notifications</p>
                  ) : (
                    <div className="space-y-4">
                      {unreadNotifications.map((notification) => (
                        <div key={notification.id} className="p-3 glass-effect rounded-xl">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Learning Calendar */}
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>This Week</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Monday</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Tuesday</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Today</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    • Complete 2 more lessons to maintain your streak
                  </p>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/courses">
                      <Button className="w-full glass-effect border-0 bg-primary/20 hover:bg-primary/30 justify-start">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Browse Courses
                      </Button>
                    </Link>
                    <Link href="/live-classes">
                      <Button className="w-full glass-effect border-0 bg-secondary/20 hover:bg-secondary/30 justify-start">
                        <Play className="w-4 h-4 mr-2" />
                        Join Live Class
                      </Button>
                    </Link>
                    <Link href="/discussion">
                      <Button className="w-full glass-effect border-0 bg-accent/20 hover:bg-accent/30 justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Ask Question
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
