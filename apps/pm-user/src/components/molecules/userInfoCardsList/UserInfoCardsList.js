import React from 'react';
import { UserInfoCard } from '../';
import PropTypes from 'prop-types';

const UserInfoCardsList = ({ matchesData }) => {
  const renderUserInfoCardsList = matchesData?.map((match) => {
    return (
      <UserInfoCard
        profileAboutMe={match.profileAboutMe}
        profileAge={match.profileAge}
        profileId={match.profileId}
        profileLocation={match.profileLocation}
        profileImages={match.profileImages}
        profileName={match.profileName}
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
