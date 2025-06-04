import { describe, it, expect } from "vitest";
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import SkillsList from './SkillsList';

describe('SkillsList', () => {
  it('opens and closes a category', () => {
    render(<SkillsList />);
    const header = screen.getByText('Web Development');
    const details = header.parentElement!.parentElement!.parentElement!.nextElementSibling as HTMLElement;
    expect(details.className).toContain('max-h-0');
    fireEvent.click(header);
    expect(details.className).toContain('max-h-[500px]');
    fireEvent.click(header);
    expect(details.className).toContain('max-h-0');
  });
});
