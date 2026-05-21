export default function Grainient({
  color1 = "#e1591e",
  color2 = "#b70000",
  color3 = "#EF4444",
}: any) {
  return (
    <div className="absolute inset-0 overflow-hidden w-full h-full">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-[-50%] w-[200%] h-[200%] opacity-80"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${color1} 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${color2} 0%, transparent 50%),
                       radial-gradient(circle at 50% 80%, ${color3} 0%, transparent 50%),
                       radial-gradient(circle at 10% 90%, ${color1} 0%, transparent 50%)`,
          filter: "blur(60px)",
          animation: "spin 20s linear infinite",
        }}
      />
      {/* Grain Overlay */}
      <div
        className="absolute inset-0 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.15,
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `,
        }}
      />
    </div>
  );
}
