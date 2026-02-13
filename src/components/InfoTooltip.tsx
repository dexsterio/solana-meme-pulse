import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  text: string;
  className?: string;
  iconSize?: number;
}

const InfoTooltip = ({ text, className = '', iconSize = 12 }: InfoTooltipProps) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex items-center cursor-help ${className}`}>
          <Info className="text-muted-foreground/50 hover:text-muted-foreground transition-colors" style={{ width: iconSize, height: iconSize }} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[250px] text-[12px] leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default InfoTooltip;
