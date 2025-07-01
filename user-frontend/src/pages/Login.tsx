import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const { toast }                   = useToast();
  const navigate                    = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: 'Login failed',
          description: data.error || 'Please check your credentials.',
          variant: 'destructive'
        });
        return;
      }

      // store and navigate
      localStorage.setItem('userEmail', data.user.email);
      sessionStorage.setItem('sessionId', uuidv4());

      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.name}!`
      });
      navigate('/dashboard');
    } catch {
      toast({
        title: 'Network error',
        description: 'Unable to reach server. Try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-pastel-purple/10 to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="relative w-10 h-10 rounded-full bg-plum-gradient flex items-center justify-center animate-pulse-glow">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-2xl gradient-text">AuraCare</span>
          </Link>
        </div>

        <Card className="w-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Login to continue your mental wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@auracare.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-plum hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword
                        ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                        : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-plum-gradient hover:opacity-90 glow-effect"
                  disabled={isLoading}
                >
                  {isLoading
                    ? <div className="flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Logging in...
                      </div>
                    : 'Login'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-plum hover:text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
