import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Stethoscope, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import type { UserRole } from '@/types';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');
  const [pinCopied, setPinCopied] = useState(false);
  const navigate = useNavigate();

  const generatePin = () => {
    return 'UHB' + Math.random().toString().slice(2, 6);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate PIN for patients
      let pin = '';
      if (formData.role === 'patient') {
        pin = generatePin();
        setGeneratedPin(pin);
      }

      toast({
        title: 'Registration successful!',
        description: formData.role === 'patient' 
          ? 'Your account has been created. Please save your PIN securely.'
          : 'Your account has been created successfully.',
      });

      // For non-patients, redirect to login immediately
      if (formData.role !== 'patient') {
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyPin = async () => {
    if (generatedPin) {
      await navigator.clipboard.writeText(generatedPin);
      setPinCopied(true);
      toast({
        title: 'PIN copied!',
        description: 'Your PIN has been copied to clipboard.',
      });
      setTimeout(() => setPinCopied(false), 2000);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Show PIN display after successful registration
  if (generatedPin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card">
            <CardHeader className="text-center">
              <div className="inline-flex p-4 gradient-brand rounded-2xl mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Registration Complete!</CardTitle>
              <CardDescription>
                Your unique Patient Identification Number (PIN)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-muted/20 rounded-xl text-center">
                <Label className="text-sm font-medium text-muted-foreground">Your PIN</Label>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <code className="text-2xl font-bold text-brand px-4 py-2 bg-brand/10 rounded-lg">
                    {generatedPin}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyPin}
                    className="p-2"
                  >
                    {pinCopied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                  <p>Save this PIN securely - you'll need it to access your medical records</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                  <p>Share this PIN only with authorized healthcare providers</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                  <p>Never share this PIN via email or unsecured channels</p>
                </div>
              </div>

              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full btn-primary"
              >
                Continue to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join the Unified Health Bridge platform
          </p>
        </div>

        {/* Registration Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger className="focus-brand">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="lab">Laboratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="focus-brand"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="focus-brand"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                  className="focus-brand"
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/auth/login"
                className="text-sm text-brand hover:text-brand/80 transition-colors"
              >
                Already have an account? Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}