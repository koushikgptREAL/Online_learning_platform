import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Video, 
  Download,
  Award,
  ShoppingCart
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  currency: string;
  level: string;
  duration: number;
  rating: string;
  totalEnrollments: number;
  lessons: Lesson[];
  reviews: Review[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  isPreview: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  };
  createdAt: string;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery<CourseDetail>({
    queryKey: ["/api/courses", id],
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/user/enrollments"],
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => apiRequest("POST", "/api/enrollments", { courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/enrollments"] });
      toast({
        title: "Enrolled Successfully!",
        description: "You can now access all course materials.",
      });
    },
    onError: (error) => {
      toast({
        title: "Enrollment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isEnrolled = enrollments.some((enrollment: any) => enrollment.courseId === id);
  const totalDuration = course?.lessons.reduce((sum, lesson) => sum + lesson.duration, 0) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-gray-100">
        <Navigation isAuthenticated={true} user={user} />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-dark text-gray-100">
        <Navigation isAuthenticated={true} user={user} />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <Card className="glass-effect border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
              <p className="text-gray-300 mb-6">The course you're looking for doesn't exist.</p>
              <Link href="/courses">
                <Button className="glass-effect border-0 bg-primary/20 hover:bg-primary/30">
                  Browse Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Navigation isAuthenticated={true} user={user} />
      
      {/* Course Header */}
      <section className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                  {course.title}
                </h1>
                <p className="text-xl text-gray-300 mb-6">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                    <span>({course.reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>{course.totalEnrollments} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-secondary" />
                    <span>{Math.round(totalDuration / 60)} hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Course Preview Card */}
            <div>
              <Card className="glass-effect border-0 course-card-3d sticky top-24">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button className="glass-effect border-0 bg-white/20 hover:bg-white/30 rounded-full p-4">
                      <Play className="w-8 h-8" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      ₹{course.price}
                    </div>
                    <p className="text-gray-300 text-sm">One-time payment</p>
                  </div>
                  
                  {isEnrolled ? (
                    <div className="space-y-4">
                      <Button className="w-full bg-accent hover:bg-accent/80" asChild>
                        <Link href={`/dashboard`}>
                          <Play className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Link>
                      </Button>
                      <div className="text-center text-sm text-gray-300">
                        ✓ You're enrolled in this course
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/80 animate-glow"
                        onClick={() => enrollMutation.mutate(course.id)}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? (
                          <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 mr-2" />
                        )}
                        Enroll Now
                      </Button>
                      <Link href={`/checkout/${course.id}`}>
                        <Button 
                          variant="outline" 
                          className="w-full glass-effect border-primary/50 hover:bg-primary/20"
                        >
                          Buy with Payment Plan
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Full lifetime access</span>
                      <Award className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Access on mobile and TV</span>
                      <Video className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Certificate of completion</span>
                      <Download className="w-4 h-4 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Course Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Course Curriculum */}
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient">Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <p className="text-sm text-gray-400">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-400">
                            {Math.round(lesson.duration)} min
                          </div>
                          {lesson.isPreview && (
                            <Badge variant="outline" className="border-accent text-accent">
                              Preview
                            </Badge>
                          )}
                          {(isEnrolled || lesson.isPreview) && (
                            <Button size="sm" variant="ghost" className="hover:bg-primary/20">
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Reviews */}
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient">Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {course.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b border-gray-600 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.user.profileImageUrl} />
                            <AvatarFallback>
                              {review.user.firstName[0]}{review.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">
                                {review.user.firstName} {review.user.lastName}
                              </span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-300">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Features */}
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle>This course includes:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Video className="w-4 h-4 text-primary" />
                      <span>{Math.round(totalDuration / 60)} hours on-demand video</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-4 h-4 text-secondary" />
                      <span>{course.lessons.length} lessons</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Download className="w-4 h-4 text-accent" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-4 h-4 text-primary" />
                      <span>Certificate of completion</span>
                    </div>
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
