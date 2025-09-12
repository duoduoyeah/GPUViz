import React, { Component } from "react";
import type { ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackUI?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to indicate that there was an error
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an external service or console
    console.error("Error caught by Error Boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Render the fallback UI if an error occurred
      return (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
          }}
        >
          <h2>Something went wrong!</h2>
          <p>{this.state.error?.message || "An unexpected error occurred."}</p>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.errorInfo?.componentStack}
          </details>
          {this.props.fallbackUI}
        </div>
      );
    }

    return this.props.children; // Render the children as normal if no error
  }
}

export default ErrorBoundary;
