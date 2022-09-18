import styles from './quickLinksCard.module.scss';
import { MyCard, UserItemsList } from '../../molecules';

function QuickLinksCard() {
  return (
    <>

      <MyCard cardTitle="Messages" className="myCard" cardLink="/mailbox">
        <UserItemsList />
      </MyCard>
    </>
  );
}

export default QuickLinksCard;
