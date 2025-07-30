import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Hand, 
  Users, 
  MessageSquare, 
  Settings,
  PhoneOff,
  Clock,
  Calendar,
  ExternalLink,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface LiveClass {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  maxAttendees: number;
  isActive: boolean;
  meetingUrl?: string;
  instructor?: {
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  };
}

interface LiveClassInterfaceProps {
  liveClass?: LiveClass;
}

export default function LiveClassInterface({ liveClass }: LiveClassInterfaceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const { data: upcomingClasses = [] } = useQuery({
    queryKey: ["/api/live-classes"],
  });

  const joinClassMutation = useMutation({
    mutationFn: (classId: string) => apiRequest("POST", `/api/live-classes/${classId}/join`, {}),
    onSuccess: () => {
      toast({
        title: "Joined Successfully",
        description: "You've joined the live class!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/live-classes"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Join",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleJoinClass = (classId: string, meetingUrl?: string) => {
    joinClassMutation.mutate(classId);
    if (meetingUrl) {
      window.open(meetingUrl, '_blank');
    }
  };

  // If no live class is provided, show upcoming classes
  if (!liveClass) {
    const todayClasses = upcomingClasses
      .filter((cls: LiveClass) => {
        const classDate = new Date(cls.scheduledAt);
        const today = new Date();
        return classDate.toDateString() === today.toDateString();
      })
      .slice(0, 3);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gradient mb-4">Today's Live Sessions</h3>
          <p className="text-gray-300">Join interactive live classes with expert instructors</p>
        </div>
        
        {todayClasses.length === 0 ? (
          <Card className="glass-effect border-0 text-center">
            <CardContent className="p-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No live classes today</h3>
              <p className="text-gray-300 mb-6">Check back tomorrow or explore our upcoming sessions</p>
              <Button className="glass-effect border-0 bg-primary/20 hover:bg-primary/30">
                View All Classes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayClasses.map((cls: LiveClass) => {
              const scheduledDate = new Date(cls.scheduledAt);
              const now = new Date();
              const isStartingSoon = scheduledDate.getTime() - now.getTime() < 30 * 60 * 1000; // 30 minutes
              const canJoin = scheduledDate.getTime() - now.getTime() < 15 * 60 * 1000; // 15 minutes before
              
              return (
                <Card key={cls.id} className="glass-effect border-0 course-card-3d group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${isStartingSoon ? 'bg-red-500' : 'bg-primary/20'} text-white border-0`}>
                        {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Badge>
                      {isStartingSoon && (
                        <div className="flex items-center space-x-1 text-red-400 text-sm">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <span>Starting Soon</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                      {cls.title}
                    </CardTitle>
                    <p className="text-gray-300 text-sm line-clamp-2">{cls.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={cls.instructor?.profileImageUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                          {cls.instructor?.firstName?.[0]}{cls.instructor?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {cls.instructor?.firstName} {cls.instructor?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">Instructor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{cls.duration} mins</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{cls.maxAttendees} max</span>
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${canJoin ? 'bg-green-600 hover:bg-green-700 animate-glow' : 'glass-effect border-0 bg-primary/20 hover:bg-primary/30'} group-hover:scale-105 transition-all duration-300`}
                      onClick={() => handleJoinClass(cls.id, cls.meetingUrl)}
                      disabled={joinClassMutation.isPending}
                    >
                      {joinClassMutation.isPending ? (
                        <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                      ) : canJoin ? (
                        <ExternalLink className="w-4 h-4 mr-2" />
                      ) : (
                        <Calendar className="w-4 h-4 mr-2" />
                      )}
                      {canJoin ? 'Join Now' : 'Set Reminder'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Live class interface for active sessions
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Video Interface */}
      <div className="lg:col-span-3">
        <Card className="glass-effect border-0 course-card-3d">
          <CardContent className="p-0">
            {/* Video Area */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450" 
                alt="Live Class Session"
                className="w-full h-full object-cover"
              />
              
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                LIVE
              </div>
              
              {/* Viewer Count */}
              <div className="absolute top-4 right-4 glass-effect px-3 py-1 rounded-full text-sm">
                <Users className="w-4 h-4 inline mr-2" />
                234 viewers
              </div>
              
              {/* Instructor Info */}
              <div className="absolute bottom-4 left-4 glass-effect px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={liveClass.instructor?.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                      {liveClass.instructor?.firstName?.[0]}{liveClass.instructor?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {liveClass.instructor?.firstName} {liveClass.instructor?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">Instructor</p>
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={isVideoOn ? "default" : "secondary"}
                  className="glass-effect border-0 hover:bg-white/20"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant={isAudioOn ? "default" : "secondary"}
                  className="glass-effect border-0 hover:bg-white/20"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant={isHandRaised ? "default" : "secondary"}
                  className="glass-effect border-0 hover:bg-white/20"
                  onClick={() => setIsHandRaised(!isHandRaised)}
                >
                  <Hand className={`w-4 h-4 ${isHandRaised ? 'text-yellow-400' : ''}`} />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="glass-effect border-red-500/50 hover:bg-red-500/20 text-red-400"
                >
                  <PhoneOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Class Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{liveClass.title}</h3>
                  <p className="text-gray-300">{liveClass.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Duration</div>
                  <div className="text-lg font-semibold">{liveClass.duration} mins</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Started {new Date(liveClass.scheduledAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>234 attendees</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chat Sidebar */}
      <div className="lg:col-span-1">
        <Card className="glass-effect border-0 course-card-3d h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Live Chat</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {showChat && (
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 space-y-3 mb-4 max-h-96 overflow-y-auto">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" />
                    <AvatarFallback className="text-xs">AP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium">Arjun Patel</span>
                      <span className="text-xs text-gray-400">2m</span>
                    </div>
                    <div className="glass-effect p-2 rounded-lg text-sm">
                      Great explanation! Could you show the code example again?
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                    <AvatarFallback className="text-xs bg-primary">IN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium">Instructor</span>
                      <Badge className="bg-primary text-white text-xs px-1 py-0">HOST</Badge>
                      <span className="text-xs text-gray-400">1m</span>
                    </div>
                    <div className="glass-effect p-2 rounded-lg text-sm">
                      Sure! Let me share the screen again. You can also find the code in the resources section.
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" />
                    <AvatarFallback className="text-xs">KS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium">Kavya Singh</span>
                      <span className="text-xs text-gray-400">30s</span>
                    </div>
                    <div className="glass-effect p-2 rounded-lg text-sm">
                      Thank you! This is really helpful. 👍
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="flex items-center space-x-2">
                <input 
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 glass-effect rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-0 bg-white/5"
                />
                <Button size="sm" className="glass-effect border-0 bg-primary/20 hover:bg-primary/30">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
