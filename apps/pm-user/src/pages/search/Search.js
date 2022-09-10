import { SearchProfiles } from '../../components';
import styles from './search.module.scss';
const Search = () => {
  return (
    <div className={styles.searchPage}>
      <h2>Search Profiles based on Criteria</h2>
      <SearchProfiles />
    </div>
  );
};

export default Search;
