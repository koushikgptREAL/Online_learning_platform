import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Heart, 
  Reply, 
  MoreVertical,
  Pin,
  Eye,
  MessageSquare,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  isPinned: boolean;
  viewCount: number;
  replyCount: number;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  };
}

interface Reply {
  id: string;
  discussionId: string;
  authorId: string;
  content: string;
  parentReplyId?: string;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  };
}

interface ChatInterfaceProps {
  discussionId: string;
  discussion?: Discussion & { replies?: Reply[] };
}

export default function ChatInterface({ discussionId, discussion }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: discussionData } = useQuery({
    queryKey: ["/api/discussions", discussionId],
    enabled: !!discussionId && !discussion,
  });

  const currentDiscussion = discussion || discussionData;

  const createReplyMutation = useMutation({
    mutationFn: (data: { content: string; parentReplyId?: string }) => 
      apiRequest("POST", `/api/discussions/${discussionId}/replies`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions", discussionId] });
      setReplyText("");
      setReplyingTo(null);
      toast({
        title: "Reply Posted",
        description: "Your reply has been posted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    createReplyMutation.mutate({
      content: replyText,
      parentReplyId: replyingTo || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentDiscussion?.replies]);

  if (!currentDiscussion) {
    return (
      <Card className="glass-effect border-0">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading discussion...</p>
        </CardContent>
      </Card>
    );
  }

  const replies = currentDiscussion.replies || [];
  const parentReplies = replies.filter(reply => !reply.parentReplyId);

  return (
    <div className="space-y-6">
      {/* Discussion Header */}
      <Card className="glass-effect border-0 course-card-3d">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                {currentDiscussion.isPinned && (
                  <Pin className="w-5 h-5 text-primary" />
                )}
                <h1 className="text-2xl font-bold text-gradient">{currentDiscussion.title}</h1>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentDiscussion.author?.profileImageUrl} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                    {currentDiscussion.author?.firstName?.[0]}{currentDiscussion.author?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {currentDiscussion.author?.firstName} {currentDiscussion.author?.lastName}
                  </p>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(currentDiscussion.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{currentDiscussion.viewCount} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{currentDiscussion.replyCount} replies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="glass-effect">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">{currentDiscussion.content}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Replies */}
      <Card className="glass-effect border-0 course-card-3d">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Replies ({replies.length})</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Reply Input */}
          <div className="mb-6">
            {replyingTo && (
              <div className="mb-3">
                <Badge variant="outline" className="border-primary/50 text-primary">
                  Replying to message
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 p-0 h-auto"
                    onClick={() => setReplyingTo(null)}
                  >
                    ×
                  </Button>
                </Badge>
              </div>
            )}
            
            <div className="flex items-end space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your reply..."
                  className="glass-effect border-0 bg-white/5 focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <Button 
                onClick={handleSendReply}
                disabled={!replyText.trim() || createReplyMutation.isPending}
                className="glass-effect border-0 bg-primary/20 hover:bg-primary/30"
              >
                {createReplyMutation.isPending ? (
                  <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {parentReplies.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No replies yet. Be the first to reply!</p>
              </div>
            ) : (
              parentReplies.map((reply) => {
                const childReplies = replies.filter(r => r.parentReplyId === reply.id);
                
                return (
                  <div key={reply.id} className="space-y-4">
                    {/* Parent Reply */}
                    <div className="flex items-start space-x-3 p-4 glass-effect rounded-xl hover:bg-white/10 transition-all duration-300">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reply.author?.profileImageUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-secondary to-accent text-white text-sm">
                          {reply.author?.firstName?.[0]}{reply.author?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-sm">
                            {reply.author?.firstName} {reply.author?.lastName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3">{reply.content}</p>
                        
                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs hover:text-primary"
                            onClick={() => setReplyingTo(reply.id)}
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="text-xs hover:text-red-400">
                            <Heart className="w-3 h-3 mr-1" />
                            Like
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Child Replies */}
                    {childReplies.map((childReply) => (
                      <div key={childReply.id} className="ml-8 flex items-start space-x-3 p-4 glass-effect rounded-xl hover:bg-white/10 transition-all duration-300">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={childReply.author?.profileImageUrl} />
                          <AvatarFallback className="bg-gradient-to-r from-accent to-primary text-white text-xs">
                            {childReply.author?.firstName?.[0]}{childReply.author?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-sm">
                              {childReply.author?.firstName} {childReply.author?.lastName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(childReply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 text-sm">{childReply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
