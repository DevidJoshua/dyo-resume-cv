const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner" />
    <style>{`
      .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 60px;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border);
        border-top: 3px solid var(--a-1);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
);

export default LoadingSpinner;
