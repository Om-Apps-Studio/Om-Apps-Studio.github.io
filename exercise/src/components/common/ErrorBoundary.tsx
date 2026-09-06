import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('runfit_coach_active_tab');
    localStorage.removeItem('runfit_coach_active_workout');
    localStorage.removeItem('runfit_coach_elapsed_sec');
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-on-background flex items-center justify-center p-6">
          <div className="glass-card max-w-lg w-full p-8 rounded-2xl flex flex-col items-center text-center gap-4 border border-outline-variant/30 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center text-error mb-2">
              <span className="material-symbols-outlined text-4xl text-rose-500">warning</span>
            </div>
            <h1 className="font-headline-md text-2xl font-bold text-on-surface">Something went wrong</h1>
            <p className="text-sm text-on-surface-variant">
              An unexpected error occurred while rendering the page. You can recover by resetting the view.
            </p>
            {this.state.error?.message && (
              <pre className="text-xs bg-surface-container-lowest p-3 rounded-lg text-rose-400 max-w-full overflow-x-auto text-left font-mono">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="mt-4 px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:opacity-90 transition-all cursor-pointer shadow-lg"
            >
              Reset & Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
