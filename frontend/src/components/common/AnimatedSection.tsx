import { ReactNode, ElementType, CSSProperties } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface Props {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'stagger';
  id?: string;
  as?: ElementType;
  style?: CSSProperties;
}

const ANIM_MAP: Record<string, string> = {
  'fade-up': 'reveal',
  'fade-left': 'reveal-left',
  'fade-right': 'reveal-right',
  scale: 'reveal-scale',
  stagger: 'reveal-stagger',
};

const AnimatedSection = ({ children, className = '', animation = 'fade-up', id, as: Tag = 'section', style }: Props) => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const baseClass = ANIM_MAP[animation] || 'reveal';
  return (
    <Tag ref={ref} id={id} style={style} className={`${baseClass} ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </Tag>
  );
};

export default AnimatedSection;
