import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
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
    console.error('ApexaLith View Error caught by boundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex items-center justify-center p-8 bg-[#080B10] text-[#F5F5F0]">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-sm border border-amber-500/30 bg-[#0D1017] space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-[#B59B6D]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
                {this.props.fallbackTitle || 'Portal View Notice'}
              </h2>
              <p className="text-xs text-slate-400">
                An unexpected state occurred while loading this view. Your session and data remain fully intact.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-sm bg-black/40 border border-white/5 text-[11px] font-mono text-amber-300 text-left overflow-x-auto max-h-28">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider transition flex items-center space-x-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Reload View</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
