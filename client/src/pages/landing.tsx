import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Play, Video, Users, BookOpen, Trophy } from "lucide-react";
import Navigation from "../components/Navigation";
import HeroSection3D from "../components/HeroSection3D";
import Footer from "../components/Footer";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Navigation isAuthenticated={false} />
      
      <HeroSection3D />
      
      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gradient mb-6">Why Choose Learn it?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Experience the future of online learning with our cutting-edge platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect border-0 course-card-3d group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Expert-Led Courses</h3>
                <p className="text-gray-300">Learn from industry experts with real-world experience and cutting-edge knowledge.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 course-card-3d group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-secondary transition-colors duration-300">Live Interactive Classes</h3>
                <p className="text-gray-300">Join real-time virtual classrooms with interactive features and instant feedback.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 course-card-3d group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">Certified Learning</h3>
                <p className="text-gray-300">Earn industry-recognized certificates to boost your career prospects.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="glass-effect border-0 course-card-3d">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-gradient mb-6">Ready to Transform Your Career?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of learners who have accelerated their careers with Learn it. Start your journey today!
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <Button 
                  onClick={handleLogin}
                  className="glass-effect px-8 py-4 text-lg font-semibold hover:bg-primary/20 transition-all duration-300 transform hover:scale-105 animate-glow border-0"
                >
                  <Play className="w-5 h-5 mr-3" />
                  Start Learning Now
                </Button>
                
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>50,000+ Learners</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                    <span>1,200+ Courses</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
