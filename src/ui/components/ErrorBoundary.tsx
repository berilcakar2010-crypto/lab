import { Component, type ReactNode } from "react";

/** Keeps a rendering bug on one screen from taking down the app (data is never touched). */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.warn("Lab screen error:", error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="card stack" role="alert">
        <h2>This screen hit a problem</h2>
        <p className="text-2 small">Your data is safe. {this.state.error.message}</p>
        <div className="row">
          <a className="btn" href="#/">Go home</a>
          <button className="btn" onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      </div>
    );
  }
}
