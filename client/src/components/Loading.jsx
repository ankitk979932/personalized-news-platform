const Loading = ({ label = "Loading" }) => {
  return (
    <div className="loading-state" aria-live="polite">
      <span className="loading-ring" />
      <span>{label}</span>
    </div>
  );
};

export default Loading;
