import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calculator, Upload, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeSelector } from '@/components/ModeSelector';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavigationProps {
  mode: 'demo' | 'real';
  onModeChange: (mode: 'demo' | 'real') => void;
  hasUploadedData: boolean;
}

export const Navigation = ({ mode, onModeChange, hasUploadedData }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: BarChart3,
      disabled: mode === 'real' && !hasUploadedData
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: Calculator,
      disabled: mode === 'real' && !hasUploadedData
    },
    {
      to: '/upload',
      label: 'Upload Data',
      icon: Upload,
      disabled: false
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-glass backdrop-blur-md border-b border-border/30 sticky top-0 z-50 shadow-glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary shadow-glow animate-pulse-glow">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              InsightHub
            </h1>
          </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive(item.to)
                    ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-105",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mode Selector & Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ModeSelector mode={mode} onModeChange={onModeChange} />
            </div>
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="hidden md:flex items-center gap-2 hover:bg-destructive/20 hover:text-destructive transition-all duration-300 hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <div className="mb-4 sm:hidden">
              <ModeSelector mode={mode} onModeChange={onModeChange} />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
                  isActive(item.to)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                signOut();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full justify-start px-3 py-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};