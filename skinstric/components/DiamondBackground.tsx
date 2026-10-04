type Props = { tone?: 'light' | 'dark'; size?: 'sm' | 'md' | 'lg' };

export default function DiamondBackground({ tone = 'dark', size = 'lg' }: Props) {
  const px = { sm: 200, md: 400, lg: 600 }[size];
  // class not fill attribute — svg attributes can't read the theme's css vars
  const fill = tone === 'light' ? 'fill-bg' : 'fill-fg';
  // absolute + -z-10 — parent needs `relative` or this positions against the nearest positioned ancestor instead
  return (
    <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden" aria-hidden="true">
      {/* inner diamonds stack on the outer ones and get more opacity — center ends up densest, edges fade */}
      {[1, 0.7, 0.4].map((scale, i) => (
        <svg key={i} width={px * scale} height={px * scale} viewBox="0 0 100 100" className="absolute" data-diamond style={{ opacity: 0.12 + i * 0.05 }}>
          <polygon points="50,0 100,50 50,100 0,50" className={fill} />
        </svg>
      ))}
    </div>
  );
}