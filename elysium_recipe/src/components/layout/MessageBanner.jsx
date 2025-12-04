export function MessageBanner({ message, onClose }) {
  if (!message) return null;

  const getMessageStyle = (type) => {
    if (type === 'success') {
      return {
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.15) 100%)',
        border: '2px solid #22C55E',
        boxShadow: '0 0 15px rgba(34, 197, 94, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
        color: '#D1FAE5'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.15) 100%)',
        border: '2px solid #DC2626',
        boxShadow: '0 0 15px rgba(220, 38, 38, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
        color: '#FEE2E2'
      };
    }
  };

  const style = getMessageStyle(message.type);

  return (
    <div className="p-4 rounded flex justify-between items-center" style={style}>
      <span style={{
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
        fontSize: '1rem'
      }}>
        {message.text}
      </span>
      <button
        onClick={onClose}
        className="ml-4 text-sm transition-all"
        style={{
          color: style.color,
          opacity: 0.8
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '1';
          e.target.style.textDecoration = 'underline';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '0.8';
          e.target.style.textDecoration = 'none';
        }}
      >
        닫기
      </button>
    </div>
  );
}
