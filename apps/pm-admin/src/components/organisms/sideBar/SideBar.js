import { ProfileSummary } from '../../molecules';
import './sideBar.css';

function SideBar() {
  return (
    <div className="container">
      <div className="profileSummary">
        <ProfileSummary userDetails="Admin is Logged in" userName="Vinit Sharma" />
      </div>
    </div>
  );
}

export default SideBar;
