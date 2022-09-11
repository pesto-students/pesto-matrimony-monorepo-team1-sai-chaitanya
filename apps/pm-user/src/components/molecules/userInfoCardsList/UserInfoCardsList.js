import { UserInfoCard } from '../';
import PropTypes from 'prop-types';

const UserInfoCardsList = ({ matchesData }) => {
  console.log(matchesData);
  const renderUserInfoCardsList = matchesData?.map((match) => {
    return (
      <div key={Math.random()}>
        <UserInfoCard
          profileAboutMe={match?.aboutMe}
          profileAge={match?.age}
          profileId={match?.oktaUserId}
          profileLocation={match?.location}
          profileImages={match?.images}
          profileName={match?.name}
        />
      </div>
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
