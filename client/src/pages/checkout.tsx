import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Users, 
  Award, 
  Video, 
  Download,
  CheckCircle,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

// Stripe configuration - will be enabled once API keys are provided
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface Course {
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
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
}

const CheckoutForm = ({ course }: { course: Course }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Payment succeeded
        await apiRequest("POST", "/api/payment/success", { courseId: course.id });
        
        queryClient.invalidateQueries({ queryKey: ["/api/user/enrollments"] });
        
        toast({
          title: "Payment Successful!",
          description: "You have been enrolled in the course. Redirecting...",
        });
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error: any) {
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
        title: "Payment Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const basePrice = parseFloat(course.price);
  const gstRate = 0.18; // 18% GST
  const gstAmount = basePrice * gstRate;
  const totalAmount = basePrice + gstAmount;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gradient">Payment Details</h3>
        
        <div className="glass-effect rounded-xl p-4">
          <PaymentElement 
            options={{
              layout: "tabs",
              defaultValues: {
                billingDetails: {
                  address: {
                    country: "IN",
                  },
                },
              },
            }}
          />
        </div>
        
        <div className="glass-effect rounded-xl p-4 space-y-3">
          <div className="flex justify-between">
            <span>Course Price</span>
            <span className="font-semibold">₹{basePrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span className="font-semibold">₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-primary">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 py-4 text-lg font-semibold animate-glow"
          disabled={!stripe || processing}
        >
          {processing ? (
            <>
              <div className="w-5 h-5 mr-3 animate-spin border-2 border-white border-t-transparent rounded-full" />
              Processing Payment...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 mr-3" />
              Pay ₹{totalAmount.toLocaleString('en-IN')} Securely
            </>
          )}
        </Button>
        
        <div className="text-center text-sm text-gray-400">
          <ShieldCheck className="w-4 h-4 inline mr-2" />
          Secured by 256-bit SSL encryption
        </div>
      </div>
    </form>
  );
};

export default function Checkout() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ["/api/courses", courseId],
  });

  useEffect(() => {
    if (course) {
      const basePrice = parseFloat(course.price);
      const gstAmount = basePrice * 0.18;
      const totalAmount = basePrice + gstAmount;
      
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: totalAmount,
        courseId: course.id 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
        });
    }
  }, [course]);

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
              <p className="text-gray-300">The course you're trying to purchase doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-dark text-gray-100">
        <Navigation isAuthenticated={true} user={user} />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <Card className="glass-effect border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Payment System Unavailable</h2>
              <p className="text-gray-300 mb-4">
                Payment processing is currently being configured. Please contact support to complete your enrollment.
              </p>
              <Button 
                onClick={() => window.history.back()} 
                className="glass-effect border-0 bg-primary/20 hover:bg-primary/30"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-dark text-gray-100">
        <Navigation isAuthenticated={true} user={user} />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-300">Setting up secure payment...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalDuration = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Navigation isAuthenticated={true} user={user} />
      
      {/* Header */}
      <section className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Secure Checkout
          </h1>
          <p className="text-xl text-gray-300">
            Complete your enrollment with our secure payment gateway
          </p>
        </div>
      </section>
      
      {/* Checkout Content */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Summary */}
            <div>
              <Card className="glass-effect border-0 course-card-3d">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient">Course Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150" 
                      alt={course.title}
                      className="w-24 h-18 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{course.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <Badge className="bg-primary/20 text-primary border-primary/50">
                          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.round(totalDuration / 60)} hours</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{course.totalEnrollments} students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-accent">What's Included:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>{Math.round(totalDuration / 60)} hours of video content</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Downloadable resources</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Lifetime access</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Community support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Mobile & TV access</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Course Features:</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-3">
                        <Video className="w-4 h-4 text-primary" />
                        <span>Full lifetime access</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-4 h-4 text-secondary" />
                        <span>Access on mobile and TV</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Award className="w-4 h-4 text-accent" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Download className="w-4 h-4 text-primary" />
                        <span>Downloadable resources</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Payment Form */}
            <div>
              <Card className="glass-effect border-0 course-card-3d">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient flex items-center">
                    <CreditCard className="w-6 h-6 mr-3" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret,
                      appearance: {
                        theme: 'night',
                        variables: {
                          colorPrimary: '#6366F1',
                          colorBackground: 'rgba(255, 255, 255, 0.05)',
                          colorText: '#ffffff',
                          colorDanger: '#df1b41',
                          borderRadius: '12px',
                        },
                      },
                    }}
                  >
                    <CheckoutForm course={course} />
                  </Elements>
                </CardContent>
              </Card>
              
              {/* Security Notice */}
              <Card className="glass-effect border-0 mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-300">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">Your payment is secure</p>
                      <p className="text-xs text-gray-400">
                        All transactions are encrypted and processed securely through Stripe.
                      </p>
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
