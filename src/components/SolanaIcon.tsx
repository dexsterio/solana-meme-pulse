import solanaLogo from '@/assets/solana-logo.svg';

interface SolanaIconProps {
  size?: number;
  className?: string;
}

const SolanaIcon = ({ size = 14, className = '' }: SolanaIconProps) => (
  <img
    src={solanaLogo}
    alt="SOL"
    width={size}
    height={size}
    className={`inline-block ${className}`}
    style={{ width: size, height: size }}
  />
);

export default SolanaIcon;
