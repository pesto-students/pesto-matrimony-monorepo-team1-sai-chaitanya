import { UserInfoCard } from '../';
import PropTypes from 'prop-types';

const UserInfoCardsList = ({ matchesData }) => {
  console.log(matchesData);
  const renderUserInfoCardsList = matchesData?.map((match) => {
    return (
      <UserInfoCard
        profileAboutMe={match.aboutMe}
        profileAge={match.age}
        profileId={match.oktaUserId}
        profileLocation={match.location}
        profileImages={match.images}
        profileName={match.name}
      />
    );
  });
  return <>{renderUserInfoCardsList}</>;
};

UserInfoCardsList.propTypes = {
  matchesData: PropTypes.array,
};
UserInfoCardsList.defaultProps = {
  matchesData: [],
};

export default UserInfoCardsList;
