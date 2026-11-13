import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
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

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Top14dle ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <span className="text-4xl block">🏉</span>
            <h1 className="text-xl font-black uppercase text-slate-900 dark:text-white">
              Oups ! Un petit souci technique
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Une erreur inattendue est survenue lors de l'affichage du jeu.
            </p>
            {this.state.error && (
              <pre className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] text-red-600 dark:text-red-400 overflow-auto text-left max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wide transition-all shadow-md active:scale-95"
            >
              🔄 Réinitialiser et Recharger
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
