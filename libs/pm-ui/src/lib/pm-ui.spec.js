import { render } from '@testing-library/react';
import PmUi from './pm-ui';
describe('PmUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PmUi />);
    expect(baseElement).toBeTruthy();
  });
});
