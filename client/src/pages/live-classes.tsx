import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/Navigation";
import LiveClassInterface from "../components/LiveClassInterface";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LiveClass {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  maxAttendees: number;
  isActive: boolean;
  meetingUrl: string;
  instructor: {
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  };
}

export default function LiveClasses() {
  const { user } = useAuth();

  const { data: liveClasses = [], isLoading } = useQuery<LiveClass[]>({
    queryKey: ["/api/live-classes"],
  });

  const activeLiveClasses = liveClasses.filter(lc => lc.isActive);
  const upcomingLiveClasses = liveClasses.filter(lc => !lc.isActive && new Date(lc.scheduledAt) > new Date());

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Navigation isAuthenticated={true} user={user} />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary/30 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-secondary/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
            Live Virtual Classes
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join interactive live sessions with expert instructors from around the world
          </p>
        </div>
      </section>
      
      {/* Active Live Classes */}
      {activeLiveClasses.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gradient mb-8">🔴 Live Now</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activeLiveClasses.map((liveClass) => (
                <LiveClassInterface key={liveClass.id} liveClass={liveClass} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Upcoming Live Classes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gradient">Upcoming Sessions</h2>
            <Button className="glass-effect border-0 bg-primary/20 hover:bg-primary/30">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="glass-effect border-0 animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-gray-600 rounded mb-4"></div>
                    <div className="h-8 bg-gray-600 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingLiveClasses.length === 0 ? (
            <Card className="glass-effect border-0 text-center">
              <CardContent className="p-12">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No upcoming live classes</h3>
                <p className="text-gray-300 mb-6">
                  Check back later for new live sessions or explore our recorded courses.
                </p>
                <Button className="glass-effect border-0 bg-primary/20 hover:bg-primary/30">
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingLiveClasses.map((liveClass) => {
                const scheduledDate = new Date(liveClass.scheduledAt);
                const isToday = scheduledDate.toDateString() === new Date().toDateString();
                const timeUntil = scheduledDate.getTime() - new Date().getTime();
                const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
                const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
                
                return (
                  <Card key={liveClass.id} className="glass-effect border-0 course-card-3d group hover:bg-white/10 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${isToday ? 'bg-red-500' : 'bg-primary/20'} text-white border-0`}>
                          {isToday ? 'Today' : scheduledDate.toLocaleDateString()}
                        </Badge>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {timeUntil > 0 && timeUntil < 24 * 60 * 60 * 1000 && (
                            <div className="text-xs text-gray-400">
                              {hoursUntil > 0 ? `${hoursUntil}h ` : ''}{minutesUntil}m
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">
                        {liveClass.title}
                      </CardTitle>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {liveClass.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={liveClass.instructor.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                            alt={`${liveClass.instructor.firstName} ${liveClass.instructor.lastName}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-300">
                            {liveClass.instructor.firstName} {liveClass.instructor.lastName}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{liveClass.duration} mins</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{liveClass.maxAttendees} max</span>
                        </div>
                      </div>
                      
                      {timeUntil > 0 ? (
                        <Button className="w-full glass-effect border-0 bg-primary/20 hover:bg-primary/30 group-hover:scale-105 transition-all duration-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          Set Reminder
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 animate-glow"
                          onClick={() => window.open(liveClass.meetingUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Join Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">Interactive Learning Experience</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our live classes feature cutting-edge technology for an immersive learning experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-effect border-0 text-center">
              <CardContent className="p-6">
                <Video className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">HD Video Quality</h3>
                <p className="text-sm text-gray-300">Crystal clear video streaming for the best learning experience</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Interactive Chat</h3>
                <p className="text-sm text-gray-300">Real-time Q&A and discussions with instructors and peers</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 text-center">
              <CardContent className="p-6">
                <ExternalLink className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-bold mb-2">Screen Sharing</h3>
                <p className="text-sm text-gray-300">Interactive demos and collaborative coding sessions</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 text-center">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Session Recording</h3>
                <p className="text-sm text-gray-300">Access recordings later for review and practice</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
