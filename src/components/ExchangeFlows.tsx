import type { Transaction } from '../App';

type ExchangeFlowsProps = {
  transactions: Transaction[];
};

const exchanges = ['Binance', 'Coinbase', 'Kraken', 'OKX', 'Bybit'];

export function ExchangeFlows({ transactions }: ExchangeFlowsProps) {
  const flowData = exchanges.map(exchange => {
    const exchangeTxs = transactions.filter(tx => tx.exchange === exchange);
    const inflow = exchangeTxs.filter(tx => tx.direction === 'in').reduce((acc, tx) => acc + tx.usdValue, 0);
    const outflow = exchangeTxs.filter(tx => tx.direction === 'out').reduce((acc, tx) => acc + tx.usdValue, 0);
    return { exchange, inflow, outflow, net: inflow - outflow };
  });

  const maxFlow = Math.max(...flowData.map(d => Math.max(d.inflow, d.outflow)), 1);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="exchange-container">
      <h2 className="exchange-title">EXCHANGE WALLET FLOWS</h2>
      <p className="exchange-subtitle">Tracking whale movements in/out of major exchanges</p>

      <div className="flow-list">
        {flowData.map((data, index) => (
          <div
            key={data.exchange}
            className="flow-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flow-header">
              <span className="flow-exchange">{data.exchange}</span>
              <span className={`flow-net ${data.net > 0 ? 'positive' : data.net < 0 ? 'negative' : 'neutral'}`}>
                {data.net > 0 ? '+' : ''}{formatValue(data.net)}
              </span>
            </div>

            <div className="flow-bars">
              <div className="flow-bar-group">
                <div className="flow-bar-label">IN</div>
                <div className="flow-bar-track">
                  <div
                    className="flow-bar inflow-bar"
                    style={{ width: `${(data.inflow / maxFlow) * 100}%` }}
                  />
                </div>
                <div className="flow-bar-value">{formatValue(data.inflow)}</div>
              </div>

              <div className="flow-bar-group">
                <div className="flow-bar-label">OUT</div>
                <div className="flow-bar-track">
                  <div
                    className="flow-bar outflow-bar"
                    style={{ width: `${(data.outflow / maxFlow) * 100}%` }}
                  />
                </div>
                <div className="flow-bar-value">{formatValue(data.outflow)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="exchange-legend">
        <div className="legend-note">
          <span className="inflow-dot" />
          <span>Inflow = potential selling pressure</span>
        </div>
        <div className="legend-note">
          <span className="outflow-dot" />
          <span>Outflow = accumulation signal</span>
        </div>
      </div>
    </div>
  );
}
