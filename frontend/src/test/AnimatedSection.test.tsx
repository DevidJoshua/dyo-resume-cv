import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimatedSection from '../components/common/AnimatedSection';

describe('AnimatedSection', () => {
  it('should render children', () => {
    render(
      <AnimatedSection>
        <p data-testid="child">Hello World</p>
      </AnimatedSection>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should have reveal class', () => {
    const { container } = render(
      <AnimatedSection>
        <p>Content</p>
      </AnimatedSection>
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('reveal');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <AnimatedSection className="custom-class">
        <p>Content</p>
      </AnimatedSection>
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('should render with fade-left animation', () => {
    const { container } = render(
      <AnimatedSection animation="fade-left">
        <p>Content</p>
      </AnimatedSection>
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('reveal-left');
  });

  it('should render with scale animation', () => {
    const { container } = render(
      <AnimatedSection animation="scale">
        <p>Content</p>
      </AnimatedSection>
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('reveal-scale');
  });

  it('should render with custom id', () => {
    render(
      <AnimatedSection id="test-section">
        <p>Content</p>
      </AnimatedSection>
    );
    expect(screen.getByText('Content').closest('section')).toHaveAttribute('id', 'test-section');
  });

  it('should render as a different tag when specified', () => {
    const { container } = render(
      <AnimatedSection as="div">
        <p>Content</p>
      </AnimatedSection>
    );
    const el = container.querySelector('div');
    expect(el).toBeInTheDocument();
    expect(container.querySelector('section')).toBeNull();
  });

  it('should stagger animation', () => {
    const { container } = render(
      <AnimatedSection animation="stagger">
        <p>Content</p>
      </AnimatedSection>
    );
    const el = container.querySelector('section');
    expect(el).toHaveClass('reveal-stagger');
  });
});
