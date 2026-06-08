export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-brilliant-black" />
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-40" />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-neon-cyan/5 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-neon-gold/5 blur-3xl" />
      <div className="absolute left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
    </div>
  );
}
