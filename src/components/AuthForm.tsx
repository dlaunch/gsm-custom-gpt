import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState({
    email: true,
    password: true
  });
  const { signIn, signUp, loading } = useAuth();
  
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };
  
  const handleValidation = () => {
    setIsValid({
      email: validateEmail(email),
      password: validatePassword(password)
    });
    
    return validateEmail(email) && validatePassword(password);
  };
  
  const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    if (!handleValidation()) return;
    
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">GSM Custom GPT</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={(e) => handleSubmit(e, true)}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`focus:ring-primary ${!isValid.email ? 'border-red-500' : ''}`}
                  />
                  {!isValid.email && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`focus:ring-primary ${!isValid.password ? 'border-red-500' : ''}`}
                  />
                  {!isValid.password && <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full transition-all duration-300" type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`focus:ring-primary ${!isValid.email ? 'border-red-500' : ''}`}
                  />
                  {!isValid.email && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`focus:ring-primary ${!isValid.password ? 'border-red-500' : ''}`}
                  />
                  {!isValid.password && <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full transition-all duration-300" type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
