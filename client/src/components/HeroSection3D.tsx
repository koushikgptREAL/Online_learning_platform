import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Video, Users, BookOpen, TrendingUp } from "lucide-react";

export default function HeroSection3D() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth - 0.5) * 20;
      const yPos = (clientY / innerHeight - 0.5) * 20;
      
      const floatingElements = heroRef.current.querySelectorAll('.floating-element');
      floatingElements.forEach((element, index) => {
        const factor = (index + 1) * 0.5;
        (element as HTMLElement).style.transform = `translate(${xPos * factor}px, ${yPos * factor}px)`;
      });
    };

    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const scrollY = window.scrollY;
      const parallaxElements = heroRef.current.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.1;
        (element as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden"
    >
      {/* 3D Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-element parallax-element absolute top-1/4 left-1/4 w-20 h-20 bg-primary/30 rounded-full animate-float transition-transform duration-300 ease-out" style={{animationDelay: '0s'}}></div>
        <div className="floating-element parallax-element absolute top-1/3 right-1/4 w-16 h-16 bg-secondary/30 rounded-lg animate-float transition-transform duration-300 ease-out" style={{animationDelay: '2s', transform: 'rotate(45deg)'}}></div>
        <div className="floating-element parallax-element absolute bottom-1/4 left-1/3 w-12 h-12 bg-accent/30 rounded-full animate-float transition-transform duration-300 ease-out" style={{animationDelay: '4s'}}></div>
        <div className="floating-element parallax-element absolute top-1/2 right-1/3 w-8 h-8 bg-primary/40 rounded-lg animate-float transition-transform duration-300 ease-out" style={{animationDelay: '1s', transform: 'rotate(30deg)'}}></div>
        <div className="floating-element parallax-element absolute bottom-1/3 left-1/2 w-14 h-14 bg-secondary/25 rounded-full animate-float transition-transform duration-300 ease-out" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold text-gradient leading-tight animate-fade-in">
              Transform Your
              <br />
              <span className="block bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-delayed">
              Discover thousands of courses, join live classes, and accelerate your career with India's most immersive 3D learning platform.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 animate-fade-in-delayed-2">
            <Button className="glass-effect px-8 py-4 text-lg font-semibold hover:bg-primary/20 transition-all duration-300 transform hover:scale-105 animate-glow border-0 group">
              <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              Start Learning Now
            </Button>
            <Button 
              variant="outline" 
              className="glass-effect px-8 py-4 text-lg font-semibold hover:bg-secondary/20 transition-all duration-300 transform hover:scale-105 border-secondary/50 group"
            >
              <Video className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              Join Live Class
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto animate-fade-in-delayed-3">
            <Card className="glass-effect border-0 course-card-3d group hover:bg-white/10 transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors duration-300">50,000+</div>
                <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Active Learners</div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 course-card-3d group hover:bg-white/10 transition-all duration-500" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-2 group-hover:text-accent transition-colors duration-300">1,200+</div>
                <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Expert Courses</div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 course-card-3d group hover:bg-white/10 transition-all duration-500" style={{animationDelay: '0.4s'}}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-accent mb-2 group-hover:text-primary transition-colors duration-300">95%</div>
                <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Success Rate</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Floating Achievement Badges */}
          <div className="absolute top-20 left-10 hidden lg:block">
            <div className="floating-element glass-effect rounded-full p-4 animate-bounce-slow">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
          </div>
          
          <div className="absolute bottom-20 right-10 hidden lg:block">
            <div className="floating-element glass-effect rounded-full p-4 animate-bounce-slow" style={{animationDelay: '1s'}}>
              <Play className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent pointer-events-none"></div>
    </section>
  );
}
