import { notification } from 'antd';

function showNotification(type, title, description, duration = 5) {
  // For 'type' use any 1 of => "success", "error", "info" or "warn"
  notification[`${type}`]({ message: title, description, duration });
}

export default showNotification;
