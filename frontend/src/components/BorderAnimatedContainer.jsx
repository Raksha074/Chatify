function BorderAnimatedContainer({ children }) {
  return (
    <div
      style={{
        background: `var(--container-bg-gradient) padding-box, conic-gradient(from var(--border-angle), var(--border-glow-outer) 80%, #06b6d4 86%, #67e8f9 90%, #06b6d4 94%, var(--border-glow-outer)) border-box`,
      }}
      className="w-full h-full rounded-2xl border border-transparent animate-border flex overflow-hidden shadow-2xl transition-colors duration-300"
    >
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;
