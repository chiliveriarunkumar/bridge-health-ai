import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';
import { toast } from '@/hooks/use-toast';
import type { UserRole } from '@/types';

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    email: 'patient@uhb.com',
    password: 'password',
    name: 'Sarah Johnson',
    role: 'patient' as UserRole,
    pin: 'UHB1234',
    phone: '+1 (555) 123-4567',
  },
  {
    id: '2',
    email: 'doctor@uhb.com',
    password: 'password',
    name: 'Dr. Michael Chen',
    role: 'doctor' as UserRole,
    phone: '+1 (555) 234-5678',
  },
  {
    id: '3',
    email: 'lab@uhb.com',
    password: 'password',
    name: 'MedLab Services',
    role: 'lab' as UserRole,
    phone: '+1 (555) 345-6789',
  },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Login successful
      const { password: _, ...userWithoutPassword } = user;
      login(userWithoutPassword, 'mock-access-token');
      
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.role}`,
      });

      // Redirect to appropriate dashboard
      navigate(`/${user.role}`);
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="inline-flex p-4 gradient-brand rounded-2xl mb-4"
          >
            <Stethoscope className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your Unified Health Bridge account
          </p>
        </div>

        {/* Login Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus-brand"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus-brand pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/20 rounded-xl">
              <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials:</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Patient: patient@uhb.com / password</div>
                <div>Doctor: doctor@uhb.com / password</div>
                <div>Lab: lab@uhb.com / password</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/auth/register"
                className="text-sm text-brand hover:text-brand/80 transition-colors"
              >
                Don't have an account? Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}