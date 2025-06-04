import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import LetterGlitch from './LetterGlitch';

describe('LetterGlitch', () => {
  beforeAll(() => {
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.stubGlobal('requestAnimationFrame', () => 1);
    HTMLCanvasElement.prototype.getContext = vi.fn();
  });
  it('renders a canvas element', () => {
    const { container } = render(
      <LetterGlitch glitchColors={['#000000']} glitchSpeed={50} centerVignette={false} outerVignette={false} smooth={true} />,
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });
});
