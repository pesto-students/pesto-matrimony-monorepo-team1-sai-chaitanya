import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, getUserProfile } from '../../redux/actions/Actions';
import { useOktaAuth } from '@okta/okta-react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { EditProfile, UserProfileCard, UserProfileCardContent, UserInfoCard } from '../../components';
import { EditProfilePage } from '..';

const Profile = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const { profileId } = useParams();

  const dispatch = useDispatch();
  const [fillData, setFillData] = useState([]);

  // getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    dispatch(updateUserProfile(oktaUserId));
  }, []);

  //condition when userId comes from pramams.
  let userIdToGetData = profileId || oktaUserId;

  var bool;
  if(profileId === oktaUserId){
    bool = true
  }else if(profileId !== oktaUserId){
    bool = false
  }

  useEffect(() => {
    dispatch(getUserProfile(userIdToGetData));
  }, []);

  //data from redux
  const userProfileInfo = useSelector((state) => state.getUserProfileResponse.data || {});

  const forHobbies = userProfileInfo.hobbies || ['Not Specified'];
  const forSpokenLanguages = userProfileInfo.spokenLanguages || ['Not Specified'];

  const { partnerAgeRange, partnerHeightRange, partnerIncomeRange } = userProfileInfo;

  const forPartnerAge = partnerAgeRange || [];
  const showAgeRange = forPartnerAge.length !== 0 ? `${partnerAgeRange[0]} to ${partnerAgeRange[1]}` : 'Not Specified';

  const forPartnerHeight = partnerHeightRange || [];
  const showHeightRange =
    forPartnerHeight.length !== 0 ? `${partnerHeightRange[0]} to ${partnerHeightRange[1]}` : 'Not Specified';

  const forPartnerIncome = partnerHeightRange || [];
  const showIncomRange =
    forPartnerIncome.length !== 0 ? `${partnerIncomeRange[0]} to ${partnerIncomeRange[1]}` : 'Not Specified';

  const sisters = String(userProfileInfo?.sisters);

  // console.log(sisters);

  // console.log(userProfileInfo);

  let defaultImageArray = [];
  let imageArray = [];
  let userImagesArray = userProfileInfo?.images || [];

  if (userProfileInfo?.gender === 'female') {
    defaultImageArray[0] =
      'https://res.cloudinary.com/pesto-matrimony/image/upload/v1662458482/tufqrbcs4pnkwcukvynw.png';
  } else {
    defaultImageArray[0] =
      'https://res.cloudinary.com/pesto-matrimony/image/upload/v1662374871/e0kfqgvenrb2mhpzya4a.png';
  }

  if (userImagesArray.length === 0) {
    imageArray = defaultImageArray;
  } else {
    imageArray = userProfileInfo?.images;
  }

  // console.log(userProfileInfo?.images);

  // let ageRange =

  // let heightRange = `${userProfileInfo?.partnerHeightRange[0]} to ${userProfileInfo?.partnerHeightRange[1]}`
  // let showHeightRange = userProfileInfo?.partnerHeightRange.length !== 0 ? heightRange : "Not Specified";

  // ['https://picsum.photos/700/500?random=1', 'https://picsum.photos/700/500?random=2']

  return (
    <>
      {/* Temporarily displaying EditProfile Page here */}
      {/* <EditProfilePage /> */}
      <UserInfoCard
        profileLocation={userProfileInfo?.location || 'Not Specified'}
        idOfLoggedInUser={oktaUserId}
        profileAboutMe=""
        profileAge={userProfileInfo?.age || 'Not Specified'}
        profileName={userProfileInfo?.name}
        profileId={profileId}
        profileImages={imageArray}
      />
      <UserProfileCard className="userProfileCard" title="Description" button={bool}>
        <UserProfileCardContent description={userProfileInfo?.aboutMe || 'Not Specified'} />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Personal Information" button={bool}>
        <UserProfileCardContent field="Age" value={userProfileInfo?.age || 'Not Specified'} />
        <UserProfileCardContent field="Height" value={userProfileInfo?.height || 'Not Specified'} />
        <UserProfileCardContent field="Weight (in Kg)" value={userProfileInfo?.weight || 'Not Specified'} />
        <UserProfileCardContent field="Physique" value={userProfileInfo?.physique || 'Not Specified'} />
        <UserProfileCardContent field="Mother Tongue" value={userProfileInfo?.motherTongue || 'Not Specified'} />
        <UserProfileCardContent field="Marriage Status" value={userProfileInfo?.marriageStatus || 'Not Specified'} />
        <UserProfileCardContent field="Citizenship" value={userProfileInfo?.citizenship || 'Not Specified'} />
        <UserProfileCardContent field="Current Country" value={userProfileInfo?.country || 'Not Specified'} />
        <UserProfileCardContent field="Current State" value={userProfileInfo?.state || 'Not Specified'} />
        <UserProfileCardContent field="Current Location" value={userProfileInfo?.location || 'Not Specified'} />
        <UserProfileCardContent field="Eating Habits" value={userProfileInfo?.eatingHabits || 'Not Specified'} />
        <UserProfileCardContent field="Smoking Habits" value={userProfileInfo?.smokingHabits || 'Not Specified'} />
        <UserProfileCardContent field="Drinking Habits" value={userProfileInfo?.drinkingHabits || 'Not Specified'} />
        <UserProfileCardContent field="Hobbies" value={forHobbies.map((hobby) => `${hobby},   `)} />
        <UserProfileCardContent
          field="Spoken Languages"
          value={forSpokenLanguages.map((language) => `${language},  `)}
        />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Education & Career Information" button={bool}>
        <UserProfileCardContent field="Qualification" value={userProfileInfo?.qualification || 'Not Specified'} />
        <UserProfileCardContent field="Occupation" value={userProfileInfo?.occupation || 'Not Specified'} />
        <UserProfileCardContent field="Employed in" value={userProfileInfo?.employer || 'Not Specified'} />
        <UserProfileCardContent field="Income (Lakhs/Yr)" value={userProfileInfo?.income || 'Not Specified'} />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Family Details" button={bool}>
        <UserProfileCardContent field="About Family" value={userProfileInfo?.aboutFamily || 'Not Specified'} />
        <UserProfileCardContent field="Brother(s)" value={String(userProfileInfo?.brothers) || 'Not Specified'} />
        <UserProfileCardContent
          field="Married Brother(s)"
          value={String(userProfileInfo?.marriedBrothers) || 'Not Specified'}
        />
        <UserProfileCardContent field="Sister(s)" value={String(userProfileInfo?.sisters) || 'Not Specified'} />
        <UserProfileCardContent
          field="Married Sister(s)"
          value={String(userProfileInfo?.marriedSisters) || 'Not Specified'}
        />
        <UserProfileCardContent field="Family Status" value={userProfileInfo?.familyStatus || 'Not Specified'} />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Religious and Horoscope Details" button={bool}>
        <UserProfileCardContent field="Religion" value={userProfileInfo?.religion || 'Not Specified'} />
        <UserProfileCardContent field="Zodiac sign" value={userProfileInfo?.zodiacSign || 'Not Specified'} />
        <UserProfileCardContent field="Gothram" value={userProfileInfo?.gothram || 'Not Specified'} />
        {/* <UserProfileCardContent field="Date of Birth" value={userProfileInfo?.dateOfBirth || 'Not Specified'} /> */}
        <UserProfileCardContent field="Place of birth" value={userProfileInfo?.placeOfBirth || 'Not Specified'} />
        {/* <UserProfileCardContent field="Time of Birth" value={userProfileInfo?.timeOfBirth || 'Not Specified'} /> */}
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Partner Preferences" button={bool}>
        <UserProfileCardContent field="Age Range" value={showAgeRange} />
        <UserProfileCardContent field="Height Range" value={showHeightRange} />
        <UserProfileCardContent
          field="Marital Status"
          value={userProfileInfo?.partnerMaritalStatus || 'Not Specified'}
        />
        <UserProfileCardContent field="Mother Tongue" value={userProfileInfo?.partnerMotherTongue || 'Not Specified'} />
        <UserProfileCardContent field="Country Living In" value={userProfileInfo?.partnerCountry || 'Not Specified'} />
        <UserProfileCardContent field="Religion" value={userProfileInfo?.partnerReligion || 'Not Specified'} />
        <UserProfileCardContent
          field="Income (Lakhs/Yr)"
          value={userProfileInfo?.partnerIncomeRange || 'Not Specified'}
        />
        <UserProfileCardContent field="Eating Habits" value={userProfileInfo?.partnerEatingHabits || 'Not Specified'} />
      </UserProfileCard>
    </>
  );
};

export default Profile;
