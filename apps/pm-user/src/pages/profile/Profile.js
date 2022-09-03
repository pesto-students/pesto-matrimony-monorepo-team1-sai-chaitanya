import React from 'react';
import { UserProfileCard, UserProfileCardContent, UserInfoCard } from '../../components';

const Profile = () => {
  return (
    <>
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

      <UserProfileCard className="userProfileCard" title="Lifestyle">
        <UserProfileCardContent value="Vagitarian" />
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
}



export default Profile;
