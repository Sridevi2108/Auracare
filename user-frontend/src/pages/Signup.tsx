import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const avatarOptions = [
  '/placeholder.svg',
  'https://randomuser.me/api/portraits/women/32.jpg',
  'https://randomuser.me/api/portraits/men/54.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
];

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          avatar: selectedAvatar,
        }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
  
        toast({
          title: "Account created",
          description: "Welcome to AuraCare! Let’s complete your profile.",
        });
  
        navigate("/complete-profile"); 
      } else {
        const data = await response.json();
        toast({
          title: "Signup failed",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "Server error. Please check your connection or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <CardTitle className="text-2xl font-bold text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Start your mental wellness journey with AuraCare
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Avatar Section */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-4 border-primary/20 animate-pulse-glow">
                      <AvatarImage src={selectedAvatar} />
                      <AvatarFallback className="bg-plum text-white text-xl">
                        {name ? name[0].toUpperCase() : 'A'}
                      </AvatarFallback>
                    </Avatar>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          setSelectedAvatar(imageUrl);
                        }
                      }}
                    />

                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-background border-plum hover:bg-plum hover:text-white"
                      onClick={() =>
                        document.getElementById('avatar-upload')?.click()
                      }
                      type="button"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Avatar Choices */}
                <div className="flex justify-center gap-2 mb-4">
                  {avatarOptions.map((avatar, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`h-10 w-10 rounded-full overflow-hidden border-2 transition-all ${
                        selectedAvatar === avatar
                          ? 'border-plum scale-110'
                          : 'border-transparent hover:border-plum-light/50'
                      }`}
                      onClick={() => setSelectedAvatar(avatar)}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar option ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-glow"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@auracare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glow"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-glow pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-plum-gradient hover:opacity-90 glow-effect"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Sign Up'
                  )}
                </Button>

                {/* Divider */}
                {/*<div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>*/}

                {/*<div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="glow-effect">
                    Google
                  </Button>
                  <Button variant="outline" className="glow-effect">
                    Facebook
                  </Button>
                </div>*/}
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-plum hover:text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
