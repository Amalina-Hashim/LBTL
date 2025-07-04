import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Leaf, User, Menu } from "lucide-react";
import { useState } from "react";

export default function NavigationHeader() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="text-white w-5 h-5" />
              </div>
              <span className="ml-2 text-xl font-bold text-primary">NEAR</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
              Home
            </Link>
            <Link href="/event" className={`transition-colors ${isActive('/event') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
              Events
            </Link>
            <Link href="/community" className={`transition-colors ${isActive('/community') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
              Community
            </Link>
            <Link href="/admin" className={`transition-colors ${isActive('/admin') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
              Admin
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-primary text-white hover:bg-primary/90">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/" className={`block py-2 px-4 rounded ${isActive('/') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Home
              </Link>
              <Link href="/event" className={`block py-2 px-4 rounded ${isActive('/event') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Events
              </Link>
              <Link href="/community" className={`block py-2 px-4 rounded ${isActive('/community') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Community
              </Link>
              <Link href="/admin" className={`block py-2 px-4 rounded ${isActive('/admin') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
