import { SearchProfiles } from '../../components';
import styles from './search.module.scss';
const Search = () => {
  return (
    <div className={styles.searchPage}>
      <h1 className={styles.searchPageHeading}>Search Page</h1>
      <SearchProfiles />
    </div>
  );
};

export default Search;
