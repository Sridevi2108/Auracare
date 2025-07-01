
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data with proper password match
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin" as const,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("adminUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Attempting login with:", email, password);
      console.log("Available users:", mockUsers);

      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        console.log("No matching user found");
        throw new Error("Invalid credentials");
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("adminUser", JSON.stringify(userWithoutPassword));
      toast.success("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error("User already exists");
      }

      // Create new user with password included
      const newUser = {
        id: (mockUsers.length + 1).toString(),
        name,
        email,
        password, // Include password for login functionality
        role: "admin" as const,
      };

      // Add user to mockUsers array so they can login later
      mockUsers.push(newUser);
      
      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("adminUser", JSON.stringify(userWithoutPassword));
      toast.success("Account created successfully");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminUser");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
