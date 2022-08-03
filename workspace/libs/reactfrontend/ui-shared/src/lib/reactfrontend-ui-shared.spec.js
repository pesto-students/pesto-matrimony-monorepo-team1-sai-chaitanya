import { render } from '@testing-library/react';
import ReactfrontendUiShared from './reactfrontend-ui-shared';
describe('ReactfrontendUiShared', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactfrontendUiShared />);
    expect(baseElement).toBeTruthy();
  });
});
