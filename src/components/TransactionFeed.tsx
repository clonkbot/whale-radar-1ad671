import type { Transaction } from '../App';

type TransactionFeedProps = {
  transactions: Transaction[];
};

const formatUSD = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

const typeIcons: Record<Transaction['type'], string> = {
  buy: '\u2191',
  sell: '\u2193',
  unusual: '\u26A0',
  exchange: '\u21C4',
};

const typeLabels: Record<Transaction['type'], string> = {
  buy: 'BUY',
  sell: 'SELL',
  unusual: 'UNUSUAL',
  exchange: 'EXCHANGE',
};

export function TransactionFeed({ transactions }: TransactionFeedProps) {
  return (
    <div className="feed-container">
      <div className="feed-list">
        {transactions.map((tx, index) => (
          <div
            key={tx.id}
            className={`feed-item feed-item-${tx.type}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="feed-item-icon">
              <span className={`icon-${tx.type}`}>{typeIcons[tx.type]}</span>
            </div>

            <div className="feed-item-content">
              <div className="feed-item-main">
                <span className="feed-wallet">{tx.wallet}</span>
                <span className={`feed-type type-${tx.type}`}>
                  {typeLabels[tx.type]}
                </span>
              </div>
              <div className="feed-item-details">
                <span className="feed-amount">
                  {tx.amount.toLocaleString()} {tx.token}
                </span>
                {tx.exchange && (
                  <span className="feed-exchange">
                    {tx.direction === 'in' ? '\u2192' : '\u2190'} {tx.exchange}
                  </span>
                )}
              </div>
            </div>

            <div className="feed-item-meta">
              <span className="feed-value">{formatUSD(tx.usdValue)}</span>
              <span className="feed-time">{formatTime(tx.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
