import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh"></div>
      
      {/* Floating Analytics Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BarChart3 className="absolute top-20 left-10 h-8 w-8 text-primary/20 animate-float" style={{ animationDelay: '0s' }} />
        <TrendingUp className="absolute top-32 right-20 h-6 w-6 text-accent/20 animate-float" style={{ animationDelay: '1s' }} />
        <PieChart className="absolute bottom-32 left-20 h-10 w-10 text-primary/15 animate-float" style={{ animationDelay: '2s' }} />
        <Activity className="absolute bottom-20 right-10 h-7 w-7 text-accent/15 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md animate-scale-in">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-primary shadow-glow animate-pulse-glow">
                  <BarChart3 className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              InsightHub
            </h1>
            <p className="text-muted-foreground text-lg">
              Transform your data into actionable insights
            </p>
          </div>

          {/* Auth Card */}
          <Card className="backdrop-blur-md bg-gradient-glass border-border/50 shadow-glass animate-fade-in">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to access your analytics dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/30">
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="animate-slide-in">
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="transition-all duration-300 focus:shadow-glow focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="transition-all duration-300 focus:shadow-glow focus:scale-[1.02]"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-button hover:shadow-glow font-semibold" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In to Dashboard
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="animate-slide-in">
                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground font-medium">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="transition-all duration-300 focus:shadow-glow focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail" className="text-foreground font-medium">Email</Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="transition-all duration-300 focus:shadow-glow focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword" className="text-foreground font-medium">Password</Label>
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="Create a password (min. 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="transition-all duration-300 focus:shadow-glow focus:scale-[1.02]"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-secondary hover:scale-105 transition-all duration-300 shadow-button hover:shadow-glow-accent font-semibold" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Analytics Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Feature Highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Real-time Analytics</p>
            </div>
            <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
              <PieChart className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Advanced Insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;