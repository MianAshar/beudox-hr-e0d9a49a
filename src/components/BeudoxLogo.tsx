interface BeudoxLogoProps {
  variant?: 'default' | 'sidebar';
  showWordmark?: boolean;
  size?: number;
}

const BeudoxLogo = ({ variant = 'default', showWordmark = true, size = 36 }: BeudoxLogoProps) => {
  if (!showWordmark) {
    return <img src="/assets/beudox-icon-256.svg" alt="Beudox" height={size} style={{ height: size }} />;
  }

  const src = variant === 'sidebar'
    ? '/assets/beudox-logo-reversed.svg'
    : '/assets/beudox-logo-primary.svg';

  return <img src={src} alt="Beudox" height={size} style={{ height: size }} />;
};

export default BeudoxLogo;
