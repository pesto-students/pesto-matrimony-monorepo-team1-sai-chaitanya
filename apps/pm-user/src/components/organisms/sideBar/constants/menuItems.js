import { HomeFilled } from '../../../atoms';

const RECOMMENDATIONS = {
  key: 'RECOMMENDATIONS',
  icon: <HomeFilled />,
  label: 'Recommendations',
};

const PROFILE = {
  key: 'PROFILE',
  icon: <HomeFilled />,
  label: 'Profile',
};

const MESSAGES = {
  key: 'MESSAGES',
  icon: <HomeFilled />,
  label: 'Messages',
};

const MENU_ITEMS = [RECOMMENDATIONS, PROFILE, MESSAGES];
const DEFAULT_SELECTED_ITEM_KEY = RECOMMENDATIONS.key;

export { DEFAULT_SELECTED_ITEM_KEY, MENU_ITEMS };
