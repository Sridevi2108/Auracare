
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-soft-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-purple-700 dark:text-purple-400">
            Reset Password
          </CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "Check your email for reset instructions" 
              : "Enter your email to receive password reset instructions"}
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Instructions"}
              </Button>
              <div className="text-center text-sm">
                <Link 
                  to="/login" 
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Return to login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <p className="text-center mb-4">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11"
              >
                Return to Login
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
