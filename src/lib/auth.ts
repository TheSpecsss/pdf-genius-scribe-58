
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: Date;
}

// In a real implementation, these would connect to Supabase Auth
// For now, we'll create mock functions that simulate the behavior

let currentUser: User | null = null;

const mockUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@example.com",
    name: "Admin User",
    isAdmin: true,
    createdAt: new Date(),
  },
  {
    id: "user-1",
    email: "user@example.com",
    name: "Regular User",
    isAdmin: false,
    createdAt: new Date(),
  },
];

export const login = async (email: string, password: string): Promise<User> => {
  // In a real implementation, this would validate with Supabase Auth
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  
  const user = mockUsers.find(u => u.email === email);
  
  if (!user || password !== "password") { // Simple mock password
    toast.error("Invalid email or password");
    throw new Error("Invalid email or password");
  }
  
  // Set the current user
  currentUser = user;
  
  toast.success(`Welcome back, ${user.name}!`);
  return user;
};

export const logout = async (): Promise<void> => {
  // In a real implementation, this would sign out with Supabase Auth
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
  
  currentUser = null;
  toast.success("Logged out successfully");
};

export const getCurrentUser = (): User | null => {
  // In a real implementation, this would check the Supabase session
  return currentUser;
};

export const createUser = async (email: string, name: string, isAdmin: boolean): Promise<User> => {
  // In a real implementation, this would create a user in Supabase Auth
  // Only admins should be able to call this function
  
  if (!currentUser?.isAdmin) {
    toast.error("Only admins can create users");
    throw new Error("Only admins can create users");
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  
  // Check if email already exists
  if (mockUsers.some(u => u.email === email)) {
    toast.error("Email already in use");
    throw new Error("Email already in use");
  }
  
  const newUser: User = {
    id: `user-${mockUsers.length + 1}`,
    email,
    name,
    isAdmin,
    createdAt: new Date(),
  };
  
  mockUsers.push(newUser);
  
  toast.success(`User ${name} created successfully`);
  return newUser;
};

export const getAllUsers = async (): Promise<User[]> => {
  // In a real implementation, this would fetch users from Supabase
  // Only admins should be able to call this function
  
  if (!currentUser?.isAdmin) {
    toast.error("Only admins can view all users");
    throw new Error("Only admins can view all users");
  }
  
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
  
  return [...mockUsers];
};

// For demo purposes, let's initialize with a current user
// In a real implementation, this would be handled by Supabase Auth session
currentUser = mockUsers[0]; // Logged in as admin by default
