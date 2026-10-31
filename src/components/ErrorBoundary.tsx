import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sonora Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-sonora-cream flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-sonora-accent/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-sonora-accent" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-sonora-bark mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-sonora-stone mb-6 leading-relaxed">
              We encountered an unexpected error. Don't worry — your music is safe. 
              Try refreshing the page to continue listening.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-sonora-stone cursor-pointer hover:text-sonora-bark">
                  Error details
                </summary>
                <pre className="mt-2 p-3 bg-sonora-warm rounded-lg text-xs text-sonora-earth overflow-auto">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
