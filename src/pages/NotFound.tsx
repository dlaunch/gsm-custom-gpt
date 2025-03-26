import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! Page not found</p>
      <Button asChild>
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
}
