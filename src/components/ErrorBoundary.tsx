"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[300px] w-full flex-col items-center justify-center p-8 text-center bg-stone-950/60 border border-white/10 rounded-2xl backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400 mb-4 border border-red-500/20">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {this.props.fallbackTitle || "حدث خطأ غير متوقع"}
          </h3>
          <p className="text-sm text-stone-400 max-w-md mb-6 leading-relaxed">
            نعتذر، حدثت مشكلة أثناء عرض هذا الجزء من الصفحة. يمكنك محاولة إعادة التحميل.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-gold-soft hover:shadow-lg hover:shadow-gold/20 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            <span>إعادة تحميل الصفحة</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

