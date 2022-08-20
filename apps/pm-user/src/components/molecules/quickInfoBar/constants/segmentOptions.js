const RECEIVED = {
  label: (
    <div>
      <p>42</p>
      <div style={{ fontSize: 12, color: '#a9aab9' }}>Received</div>
    </div>
  ),
  key: 'received',
  value: 'received',
};

const SENT = {
  label: (
    <div>
      <p>80</p>
      <div style={{ fontSize: 12, color: '#a9aab9' }}>Sent</div>
    </div>
  ),
  key: 'sent',
  value: 'sent',
};

const ACCEPTED = {
  label: (
    <div>
      <p>8</p>
      <div style={{ fontSize: 12, color: '#a9aab9' }}>Accepted</div>
    </div>
  ),
  key: 'accepted',
  value: 'accepted',
};

const SEGMENT_OPTIONS = [RECEIVED, SENT, ACCEPTED];

export { SEGMENT_OPTIONS };
