import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkillsList from './SkillsList';

describe('SkillsList', () => {
  it('opens and closes a category', async () => {
    const user = userEvent.setup();
    render(<SkillsList />);
    const header = screen.getByText('Web Development');
    const details = header.parentElement!.parentElement!.parentElement!.nextElementSibling as HTMLElement;
    expect(details.className).toContain('max-h-0');
    await user.click(header);
    expect(details.className).toContain('max-h-[500px]');
    await user.click(header);
    expect(details.className).toContain('max-h-0');
  });
});
