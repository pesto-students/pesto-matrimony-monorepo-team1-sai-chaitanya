import { Tooltip } from '../../../atoms';

const RECEIVED = {
  label: (
    <Tooltip title="Interests Received" color="#5c5fee">
      <div>
        <p>42</p>
        <div style={{ fontSize: 12, color: '#a9aab9' }}>Received</div>
      </div>
    </Tooltip>
  ),
  key: 'received',
  value: 'received',
};

const SENT = {
  label: (
    <Tooltip title="Interests Sent" color="#5c5fee">
      <div>
        <p>80</p>
        <div style={{ fontSize: 12, color: '#a9aab9' }}>Sent</div>
      </div>
    </Tooltip>
  ),
  key: 'sent',
  value: 'sent',
};

const ACCEPTED = {
  label: (
    <Tooltip title="Interests Accepted" color="#5c5fee">
      <div>
        <p>8</p>
        <div style={{ fontSize: 12, color: '#a9aab9' }}>Accepted</div>
      </div>
    </Tooltip>
  ),
  key: 'accepted',
  value: 'accepted',
};

const SEGMENT_OPTIONS = [RECEIVED, SENT, ACCEPTED];

export { SEGMENT_OPTIONS };
