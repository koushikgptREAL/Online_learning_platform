import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const courseCategories = [
    { name: "Web Development", href: "/courses?category=web-dev" },
    { name: "Data Science", href: "/courses?category=data-science" },
    { name: "UI/UX Design", href: "/courses?category=design" },
    { name: "Mobile Development", href: "/courses?category=mobile" },
    { name: "Digital Marketing", href: "/courses?category=marketing" },
    { name: "Cloud Computing", href: "/courses?category=cloud" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Support", href: "/support" },
    { name: "Technical Support", href: "/tech-support" },
    { name: "Community Forum", href: "/discussion" },
    { name: "Instructor Support", href: "/instructor-help" },
    { name: "System Status", href: "/status" },
  ];

  const companyLinks = [
    { name: "About Learn it", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press & Media", href: "/press" },
    { name: "Partnerships", href: "/partners" },
    { name: "Become an Instructor", href: "/teach" },
    { name: "Enterprise Solutions", href: "/business" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Refund Policy", href: "/refunds" },
    { name: "Accessibility", href: "/accessibility" },
    { name: "Code of Conduct", href: "/conduct" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/learnit", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/learnit", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/learnit", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/learnit", label: "Instagram" },
  ];

  return (
    <footer className="relative py-16 mt-20 bg-gradient-to-b from-transparent to-dark/50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-secondary/5 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-accent/5 rounded-full animate-float" style={{animationDelay: '6s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="flex items-center space-x-3 mb-6 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-glow">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-gradient">Learn it</span>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Empowering learners worldwide with cutting-edge online education and immersive 3D learning experiences. 
              Transform your career with India's most innovative learning platform.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@learnit.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-effect p-3 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-110 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Popular Courses */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gradient">Popular Courses</h3>
            <ul className="space-y-3">
              {courseCategories.map((category) => (
                <li key={category.name}>
                  <Link href={category.href}>
                    <button className="text-gray-300 hover:text-primary transition-colors duration-300 text-left">
                      {category.name}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gradient">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <button className="text-gray-300 hover:text-primary transition-colors duration-300 text-left">
                      {link.name}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gradient">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <button className="text-gray-300 hover:text-primary transition-colors duration-300 text-left">
                      {link.name}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <Card className="glass-effect border-0 course-card-3d mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gradient mb-3">Stay Updated</h3>
                <p className="text-gray-300">
                  Get the latest course updates, learning tips, and exclusive offers delivered to your inbox.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 glass-effect rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary border-0 bg-white/5"
                />
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-6 py-3 rounded-xl font-semibold animate-glow">
                  Subscribe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Awards and Recognition */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass-effect border-0 text-center course-card-3d">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-300 text-sm">Happy Learners</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-0 text-center course-card-3d">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-secondary mb-2">1.2K+</div>
              <div className="text-gray-300 text-sm">Expert Courses</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-0 text-center course-card-3d">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent mb-2">95%</div>
              <div className="text-gray-300 text-sm">Success Rate</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-0 text-center course-card-3d">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Support</div>
            </CardContent>
          </Card>
        </div>
        
        <Separator className="mb-8 border-gray-600" />
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-400">
            <div className="flex items-center space-x-2">
              <span>© {currentYear} Learn it. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>in India</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {legalLinks.map((link, index) => (
              <div key={link.name} className="flex items-center space-x-4">
                <Link href={link.href}>
                  <button className="text-gray-400 hover:text-primary transition-colors duration-300">
                    {link.name}
                  </button>
                </Link>
                {index < legalLinks.length - 1 && (
                  <span className="text-gray-600">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Language and Region */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-8 border-t border-gray-600">
          <div className="flex items-center space-x-6 text-gray-400 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🇮🇳</span>
              <span>India</span>
            </div>
            <span>•</span>
            <span>Available in Hindi & English</span>
            <span>•</span>
            <span>Prices in Indian Rupees (₹)</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Trusted Payment Partners:</span>
            <div className="flex items-center space-x-3">
              <div className="glass-effect px-3 py-1 rounded text-xs">Stripe</div>
              <div className="glass-effect px-3 py-1 rounded text-xs">Razorpay</div>
              <div className="glass-effect px-3 py-1 rounded text-xs">UPI</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent pointer-events-none"></div>
    </footer>
  );
}
