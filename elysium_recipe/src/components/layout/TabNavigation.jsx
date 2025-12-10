export function TabNavigation({ currentTab, onTabChange, onShowTutorial, onEndDay }) {
  const tabs = [
    { id: 'lab', icon: '🔬', label: '실험실' },
    { id: 'shop', icon: '🛒', label: '상점' },
    { id: 'archive', icon: '📚', label: '도서관' },
    { id: 'grimoire', icon: '📖', label: '비망록' },
    { id: 'upgrades', icon: '🔧', label: '업그레이드' },
  ];

  return (
      <div className="tab-rail">
        <div className="flex gap-2 flex-wrap items-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={currentTab === tab.id ? 'btn-primary' : 'btn-secondary'}
          >
            <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span> {tab.label}
          </button>
        ))}

        <button onClick={onShowTutorial} className="btn-secondary">
          <span style={{ fontSize: '1.1rem' }}>❓</span> 도움말
        </button>

        <button onClick={onEndDay} className="btn-danger ml-auto">
          <span style={{ fontSize: '1.1rem' }}>🌙</span> 하루 종료
        </button>
      </div>
      <div className="tab-rail-hint">
        <span className="hint-dot" /> 탭 버튼으로 다른 공간으로 이동하세요.
      </div>
    </div>
  );
}
