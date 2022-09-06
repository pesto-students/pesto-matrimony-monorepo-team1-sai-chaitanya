import React from 'react';
import { EditProfile, UserProfileCard, UserProfileCardContent, UserInfoCard } from '../../components';
import { EditProfilePage } from '..';
const Profile = () => {
  return (
    <>
      {/* Temporarily displaying EditProfile Page here */}
      {/* <EditProfilePage /> */}
      <UserInfoCard
        idOfLoggedInUser="abcd"
        profileAboutMe=""
        profileAge="32"
        profileName="Vinit Sharma"
        profileId="abcd"
        profileImages={['https://picsum.photos/700/500?random=1', 'https://picsum.photos/700/500?random=2']}
      />
      <UserProfileCard className="userProfileCard" title="Description">
        <UserProfileCardContent description="Glad you chose my profile and here's a quick introduction. Regarding my education, I have pursued Bachelors. At present, I am working as a Software Developer. By nature, I am a caring, kind and loving person. I am looking for someone who will compliment me on a beautiful journey called life. If you wish to take things forward, feel free to connect with us. " />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Personal Information">
        <UserProfileCardContent field="Age" value="Hindu" />
        <UserProfileCardContent field="Height" value="Brahmin" />
        <UserProfileCardContent field="Weight (in Kg)" value="Bhopal Madhyapradesh" />
        <UserProfileCardContent field="Physique" value="Hindu" />
        <UserProfileCardContent field="Mother Tongue" value="Brahmin" />
        <UserProfileCardContent field="Marriage Status" value="Bhopal Madhyapradesh" />
        <UserProfileCardContent field="Citizenship" value="Hindu" />
        <UserProfileCardContent field="Current Country" value="Brahmin" />
        <UserProfileCardContent field="Current State" value="Bhopal Madhyapradesh" />
        <UserProfileCardContent field="Current Location" value="Hindu" />
        <UserProfileCardContent field="Eating Habits" value="Brahmin" />
        <UserProfileCardContent field="Smoking Habits" value="Bhopal Madhyapradesh" />
        <UserProfileCardContent field="Drinking Habits" value="Hindu" />
        <UserProfileCardContent field="Hobbies" value="Brahmin" />
        <UserProfileCardContent field="Spoken Languages" value="Bhopal Madhyapradesh" />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Education & Career Information">
      <UserProfileCardContent field="Qualification" value="Bsc" />
        <UserProfileCardContent field="Occupation" value="Developer" />
        <UserProfileCardContent field="Employed in" value="Pest" />
        <UserProfileCardContent field="Income (Lakhs/Yr)" value="30" />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="BackGround">
        <UserProfileCardContent field="Religion" value="Hindu" />
        <UserProfileCardContent field="Cast" value="Brahmin" />
        <UserProfileCardContent field="Location" value="Bhopal Madhyapradesh" />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Horoscope">
        <UserProfileCardContent field="Nadi" value="Antya" />
        <UserProfileCardContent field="Manglik" value="No" />
        <UserProfileCardContent field="Rashi" value="Leo" />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Education / Career">
        <UserProfileCardContent field="Degree" value="BCA - Bachelor of Computer Application" />
        <UserProfileCardContent field="Sector" value="Software / IT" />
        <UserProfileCardContent field="Occupation" value=": Software Developer / Programmer with PESTO." />
        <UserProfileCardContent field="Income" value=": Earns INR 20 Lakh to 30 Lakh annually." />
      </UserProfileCard>

      <UserProfileCard className="userProfileCard" title="Partner Preferences">
        <UserProfileCardContent field="Age" value="29 to 33" />
        <UserProfileCardContent field="Height" value="5'0(152cm) to 5'10(177cm)" />
        <UserProfileCardContent field="Marital Status" value="Never Marreid" />
        <UserProfileCardContent field="Region Community" value="Hindu" />
        <UserProfileCardContent field="Mother Tongue" value="Hindi" />
        <UserProfileCardContent field="Country Living in" value="India" />
        <UserProfileCardContent field="State Living in" value="Madhya Pradesh" />
        <UserProfileCardContent field="Annual Income" value="2 lakh" />
      </UserProfileCard>
    </>
  );
};

export default Profile;
