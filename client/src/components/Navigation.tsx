import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  GraduationCap, 
  Bell, 
  Menu, 
  BookOpen, 
  Video, 
  MessageSquare, 
  BarChart3,
  User,
  Settings,
  LogOut
} from "lucide-react";

interface NavigationProps {
  isAuthenticated: boolean;
  user?: {
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    email?: string;
  } | null;
}

export default function Navigation({ isAuthenticated, user }: NavigationProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "Live Classes", href: "/live-classes", icon: Video },
    { label: "Discussion", href: "/discussion", icon: MessageSquare },
    { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-effect rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient">Learn it</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <button className={`flex items-center space-x-2 transition-colors duration-300 ${
                        isActive ? "text-primary" : "text-gray-300 hover:text-primary"
                      }`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    </Link>
                  );
                })}
              </div>
            )}
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="hidden md:block relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="glass-effect p-2 rounded-lg hover:bg-white/20 transition-all duration-300 relative"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 bg-accent text-xs rounded-full w-5 h-5 flex items-center justify-center text-white">
                        3
                      </span>
                    </Button>
                  </div>
                  
                  {/* User Profile */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-primary/50">
                          <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-effect border-0 bg-dark text-gray-100 w-56" align="end">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="w-[200px] truncate text-sm text-gray-400">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={handleLogin}
                  className="glass-effect border-0 bg-primary/20 hover:bg-primary/30"
                >
                  Sign In
                </Button>
              )}
              
              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden glass-effect p-2 rounded-lg">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="glass-effect border-0 bg-dark text-gray-100">
                  <div className="flex flex-col space-y-4 mt-8">
                    {isAuthenticated ? (
                      <>
                        {/* User Info */}
                        <div className="flex items-center space-x-3 p-4 glass-effect rounded-xl">
                          <Avatar className="h-10 w-10 border-2 border-primary/50">
                            <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                              <User className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                        
                        {/* Navigation Links */}
                        {navItems.map((item) => {
                          const isActive = location === item.href;
                          return (
                            <Link key={item.href} href={item.href}>
                              <button 
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                                  isActive ? "bg-primary/20 text-primary" : "hover:bg-white/10"
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                              </button>
                            </Link>
                          );
                        })}
                        
                        {/* Notifications */}
                        <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                          <Bell className="w-5 h-5" />
                          <span>Notifications</span>
                          <span className="ml-auto bg-accent text-xs rounded-full w-5 h-5 flex items-center justify-center text-white">
                            3
                          </span>
                        </button>
                        
                        {/* Settings */}
                        <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                          <Settings className="w-5 h-5" />
                          <span>Settings</span>
                        </button>
                        
                        {/* Logout */}
                        <button 
                          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-red-400"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <Button 
                        onClick={handleLogin}
                        className="w-full glass-effect border-0 bg-primary/20 hover:bg-primary/30"
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
