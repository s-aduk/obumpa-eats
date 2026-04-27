import React, { Component, ErrorInfo } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends (Component as any) {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-12 text-center glass border-red-500/10 rounded-lg">
          <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-6 border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-display font-light tracking-tighter mb-4 text-white">Something went wrong</h2>
          <p className="text-cream/40 font-serif italic max-w-md mb-8">
            An unexpected error occurred in this section. We have been notified and are working on a fix.
          </p>
          <button 
            onClick={this.handleReset}
            className="btn-outline flex items-center gap-3 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Reload Experience
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
