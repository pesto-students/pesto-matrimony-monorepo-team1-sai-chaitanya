import styles from './quickLinksCard.module.scss';
import { MyCard, UserItemsList } from '../../molecules';

function QuickLinksCard() {
  return (
    <>
      <MyCard cardTitle="Messages" className="myCard" cardLink="#">
        <UserItemsList
          userdescription="Ant Design, a design language..."
          userImageSrc="https://joeschmoe.io/api/v1/random"
          userProfileLink="https://ant.design"
        />
      </MyCard>

      <MyCard cardTitle="Matches" className="myCard" cardLink="#">
        <UserItemsList
          userdescription="Ant Design, a design language..."
          userImageSrc="https://joeschmoe.io/api/v1/random"
          userProfileLink="https://ant.design"
        />
      </MyCard>
    </>
  );
}

export default QuickLinksCard;
