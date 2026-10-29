import { Component } from 'react';

/**
 * Last line of defence. React unmounts the whole tree when a component throws,
 * which is what a visitor sees as "the page goes completely white". This keeps a
 * readable, on-brand screen with a way out instead, and logs the error so it can
 * be diagnosed rather than guessed at.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Console only: no third-party telemetry is loaded on this site.
    console.error('[Care Clinic] render error', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="wash min-h-dvh px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-7 shadow-lift sm:p-10">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden />
            Care Clinic
          </p>
          <h1 className="mt-4 title-md">This page hit a problem</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-mute">
            Something on the page failed to render. Reloading usually clears it. If it keeps happening,
            please call the clinic on{' '}
            <a href="tel:+918275573300" className="font-bold text-brand-800 underline underline-offset-2">
              082755 73300
            </a>{' '}
            and we will book your visit by phone.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => window.location.reload()} className="btn-primary">
              Reload the page
            </button>
            <a href="/" className="btn-ghost">
              Back to home
            </a>
          </div>
          {import.meta.env.DEV && (
            <pre className="mt-6 overflow-x-auto rounded-xl bg-sand p-4 text-xs text-ink-soft">
              {String(error?.message || error)}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
