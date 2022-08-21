import {
  SearchOutlined,
  UserOutlined,
  HomeOutlined,
  UnorderedListOutlined,
} from '../../../atoms';

const RECOMMENDATIONS = {
  key: 'recommendations',
  icon: <HomeOutlined />,
  label: 'Recommendations',
};

const MYPROFILE = {
  key: 'profile',
  icon: <UserOutlined />,
  label: 'MyProfile',
};

const SHORTLISTED = {
  key: 'shortlisted',
  icon: <UnorderedListOutlined />,
  label: 'Shortlisted',
};

const SEARCH = {
  key: 'search',
  icon: <SearchOutlined />,
  label: 'Search',
};

const MENU_ITEMS = [RECOMMENDATIONS, MYPROFILE, SHORTLISTED, SEARCH];
const DEFAULT_SELECTED_ITEM_KEY = RECOMMENDATIONS.key;

export { DEFAULT_SELECTED_ITEM_KEY, MENU_ITEMS };
