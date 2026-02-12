type WhaleSummaryProps = {
  stats: {
    totalVolume: number;
    buyCount: number;
    sellCount: number;
    unusualCount: number;
  };
};

const formatVolume = (value: number) => {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

export function WhaleSummary({ stats }: WhaleSummaryProps) {
  const buyPressure = stats.buyCount + stats.sellCount > 0
    ? (stats.buyCount / (stats.buyCount + stats.sellCount)) * 100
    : 50;

  return (
    <div className="summary-container">
      <h2 className="summary-title">WHALE ACTIVITY</h2>

      <div className="stats-grid">
        <div className="stat-card volume-card">
          <div className="stat-label">24H VOLUME TRACKED</div>
          <div className="stat-value volume-value">{formatVolume(stats.totalVolume)}</div>
          <div className="stat-glow" />
        </div>

        <div className="stat-card buy-card">
          <div className="stat-icon buy-icon">{'\u2191'}</div>
          <div className="stat-info">
            <div className="stat-label">BUYING</div>
            <div className="stat-value">{stats.buyCount}</div>
          </div>
        </div>

        <div className="stat-card sell-card">
          <div className="stat-icon sell-icon">{'\u2193'}</div>
          <div className="stat-info">
            <div className="stat-label">SELLING</div>
            <div className="stat-value">{stats.sellCount}</div>
          </div>
        </div>

        <div className="stat-card unusual-card">
          <div className="stat-icon unusual-icon">{'\u26A0'}</div>
          <div className="stat-info">
            <div className="stat-label">UNUSUAL</div>
            <div className="stat-value">{stats.unusualCount}</div>
          </div>
        </div>
      </div>

      <div className="pressure-gauge">
        <div className="pressure-header">
          <span className="pressure-label">MARKET PRESSURE</span>
          <span className="pressure-value">{buyPressure.toFixed(0)}% BUY</span>
        </div>
        <div className="pressure-bar">
          <div
            className="pressure-fill"
            style={{ width: `${buyPressure}%` }}
          />
          <div className="pressure-markers">
            {[0, 25, 50, 75, 100].map(mark => (
              <div key={mark} className="pressure-marker" style={{ left: `${mark}%` }} />
            ))}
          </div>
        </div>
        <div className="pressure-labels">
          <span className="sell-label">SELL</span>
          <span className="neutral-label">NEUTRAL</span>
          <span className="buy-label">BUY</span>
        </div>
      </div>

      <div className="depth-indicator">
        <div className="depth-line" />
        <div className="depth-text">SCANNING DEPTH: 10,000 BLOCKS</div>
        <div className="depth-line" />
      </div>
    </div>
  );
}
