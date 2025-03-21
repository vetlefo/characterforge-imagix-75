
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { HeartHandshake } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Signed in successfully!');
      navigate('/');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Signed up successfully! Please check your email for verification.');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F23] p-4">
      <Card className="w-full max-w-md bg-[#1a1a40] border border-[#333370]/50 text-white">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="h-6 w-6 text-blue-400" />
            <CardTitle className="text-2xl font-bold">AI Access Initiative</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Join our mission to provide AI tools to underdeveloped regions
          </CardDescription>
        </CardHeader>
        
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-300 mb-4">
            This project aims to democratize access to powerful AI tools for communities with limited resources. 
            By joining, you're supporting our work to create high-quality prompts, workflows, and base projects 
            that can help bridge the digital divide.
          </p>
        </div>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#0f0f23]">
            <TabsTrigger value="signin" className="data-[state=active]:bg-[#333370]">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-[#333370]">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#0f0f23] border-[#333370]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#0f0f23] border-[#333370]"
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-[#333370] hover:bg-[#4a4a8c]"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="email-signup" className="text-sm">Email</label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#0f0f23] border-[#333370]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password-signup" className="text-sm">Password</label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#0f0f23] border-[#333370]"
                  />
                </div>
                <p className="text-xs text-gray-400 italic">
                  By signing up, you're supporting our mission to provide AI access to underserved communities. 
                  We're fundraising API credits to donate and create resources for those who need it most.
                </p>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-[#333370] hover:bg-[#4a4a8c]"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Join the Initiative"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
