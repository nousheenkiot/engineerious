import { Component, type ComponentType, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Here you would typically log the error to an external service like Sentry or LogRocket
        console.error('Uncaught error:', error, errorInfo);

        // Mocking a service call
        this.logToService(error, errorInfo);
    }

    private logToService(error: Error, errorInfo: ErrorInfo) {
        // Implementation for sending logs to a server
        const logData = {
            error: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        console.log('[ErrorLogger] Sending log to service:', logData);
        // fetch('/api/logs/error', { method: 'POST', body: JSON.stringify(logData) });
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-5 m-3 border border-danger rounded bg-danger-subtle text-danger">
                    <h4 className="fw-bold">Something went wrong.</h4>
                    <p>The application encountered an unexpected error. This has been logged.</p>
                    <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * HOC that wraps a component with an Error Boundary for logging and fallback UI.
 */
export function withErrorLogging<P extends object>(
    WrappedComponent: ComponentType<P>,
    fallback?: ReactNode
) {
    return (props: P) => (
        <ErrorBoundary fallback={fallback}>
            <WrappedComponent {...props} />
        </ErrorBoundary>
    );
}
