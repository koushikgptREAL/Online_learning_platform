import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "../components/Navigation";
import ChatInterface from "../components/ChatInterface";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Code, 
  BarChart3, 
  Palette, 
  TrendingUp,
  Users,
  Eye,
  Reply,
  Pin
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  courseId?: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  };
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const createDiscussionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  categoryId: z.string().min(1, "Please select a category"),
});

type CreateDiscussionForm = z.infer<typeof createDiscussionSchema>;

export default function Discussion() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);

  const { data: discussions = [], isLoading } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions", selectedCategory],
  });

  const { data: selectedDiscussionData } = useQuery({
    queryKey: ["/api/discussions", selectedDiscussion],
    enabled: !!selectedDiscussion,
  });

  const form = useForm<CreateDiscussionForm>({
    resolver: zodResolver(createDiscussionSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
    },
  });

  const createDiscussionMutation = useMutation({
    mutationFn: (data: CreateDiscussionForm) => 
      apiRequest("POST", "/api/discussions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions"] });
      form.reset();
      toast({
        title: "Discussion Created",
        description: "Your discussion has been posted successfully!",
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

  const forumCategories = [
    { id: "web-dev", name: "Web Development", icon: "code", description: "Frontend, Backend, Full-stack discussions", color: "primary" },
    { id: "data-science", name: "Data Science", icon: "bar-chart", description: "ML, AI, Analytics, Python", color: "secondary" },
    { id: "design", name: "UI/UX Design", icon: "palette", description: "Design principles, tools, portfolios", color: "accent" },
    { id: "career", name: "Career Growth", icon: "trending-up", description: "Job hunting, interviews, networking", color: "primary" },
  ];

  const filteredDiscussions = discussions.filter((discussion) =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: CreateDiscussionForm) => {
    createDiscussionMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Navigation isAuthenticated={true} user={user} />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary/30 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-secondary/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              Discussion Forums
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Connect with peers, ask questions, and share knowledge with the Learn it community
            </p>
          </div>
          
          {/* Search and Create */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-effect border-0 pl-10 bg-white/5 focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="glass-effect border-0 bg-primary/20 hover:bg-primary/30 animate-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-effect border-0 bg-dark text-gray-100">
                <DialogHeader>
                  <DialogTitle className="text-gradient">Start New Discussion</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discussion Title</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="What would you like to discuss?"
                              className="glass-effect border-0 bg-white/5 focus:ring-2 focus:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass-effect border-0 bg-white/5">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {forumCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Share your thoughts, questions, or insights..."
                              className="glass-effect border-0 bg-white/5 focus:ring-2 focus:ring-primary min-h-32"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/80"
                      disabled={createDiscussionMutation.isPending}
                    >
                      {createDiscussionMutation.isPending ? (
                        <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <MessageSquare className="w-4 h-4 mr-2" />
                      )}
                      Post Discussion
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="glass-effect border-0 course-card-3d sticky top-24">
                <CardHeader>
                  <CardTitle className="text-gradient">Forum Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                        selectedCategory === "" ? "bg-primary/20 border border-primary/50" : "hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">All Discussions</div>
                          <div className="text-sm text-gray-400">{discussions.length} discussions</div>
                        </div>
                      </div>
                    </button>
                    
                    {forumCategories.map((category) => {
                      const categoryDiscussions = discussions.filter(d => d.categoryId === category.id);
                      const IconComponent = category.icon === "code" ? Code : 
                                          category.icon === "bar-chart" ? BarChart3 : 
                                          category.icon === "palette" ? Palette : TrendingUp;
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                            selectedCategory === category.id ? "bg-primary/20 border border-primary/50" : "hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-5 h-5 text-${category.color}`} />
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-gray-400">{categoryDiscussions.length} discussions</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Discussions List */}
            <div className="lg:col-span-3">
              {selectedDiscussion ? (
                <div>
                  <Button 
                    onClick={() => setSelectedDiscussion(null)}
                    variant="outline" 
                    className="glass-effect border-primary/50 hover:bg-primary/20 mb-6"
                  >
                    ← Back to Discussions
                  </Button>
                  <ChatInterface discussionId={selectedDiscussion} discussion={selectedDiscussionData} />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      {filteredDiscussions.length} Discussion{filteredDiscussions.length !== 1 ? 's' : ''}
                      {selectedCategory && (
                        <span className="text-primary ml-2">
                          in {forumCategories.find(c => c.id === selectedCategory)?.name}
                        </span>
                      )}
                    </h2>
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="glass-effect border-0 animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-4 bg-gray-600 rounded mb-3"></div>
                            <div className="h-3 bg-gray-600 rounded mb-2"></div>
                            <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredDiscussions.length === 0 ? (
                    <Card className="glass-effect border-0 text-center">
                      <CardContent className="p-12">
                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">No discussions found</h3>
                        <p className="text-gray-300 mb-6">
                          {searchTerm ? "Try adjusting your search terms." : "Be the first to start a discussion!"}
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="glass-effect border-0 bg-primary/20 hover:bg-primary/30">
                              <Plus className="w-4 h-4 mr-2" />
                              Start Discussion
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-effect border-0 bg-dark text-gray-100">
                            <DialogHeader>
                              <DialogTitle className="text-gradient">Start New Discussion</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Discussion Title</FormLabel>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          placeholder="What would you like to discuss?"
                                          className="glass-effect border-0 bg-white/5 focus:ring-2 focus:ring-primary"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="categoryId"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Category</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="glass-effect border-0 bg-white/5">
                                            <SelectValue placeholder="Select a category" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {forumCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                              {category.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="content"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Content</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          {...field} 
                                          placeholder="Share your thoughts, questions, or insights..."
                                          className="glass-effect border-0 bg-white/5 focus:ring-2 focus:ring-primary min-h-32"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <Button 
                                  type="submit" 
                                  className="w-full bg-primary hover:bg-primary/80"
                                  disabled={createDiscussionMutation.isPending}
                                >
                                  {createDiscussionMutation.isPending ? (
                                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                                  ) : (
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                  )}
                                  Post Discussion
                                </Button>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredDiscussions.map((discussion) => (
                        <Card 
                          key={discussion.id} 
                          className="glass-effect border-0 course-card-3d hover:bg-white/10 transition-all duration-300 cursor-pointer"
                          onClick={() => setSelectedDiscussion(discussion.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {discussion.isPinned && (
                                    <Pin className="w-4 h-4 text-primary" />
                                  )}
                                  <h3 className="text-lg font-semibold hover:text-primary transition-colors duration-300">
                                    {discussion.title}
                                  </h3>
                                </div>
                                <p className="text-gray-300 line-clamp-2 mb-3">
                                  {discussion.content}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{discussion.viewCount} views</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Reply className="w-4 h-4" />
                                    <span>{discussion.replyCount} replies</span>
                                  </div>
                                  <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              
                              <div className="ml-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                  <Users className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
