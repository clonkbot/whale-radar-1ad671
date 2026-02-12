import { useState, useEffect } from 'react';
import { RadarDisplay } from './components/RadarDisplay';
import { TransactionFeed } from './components/TransactionFeed';
import { WhaleSummary } from './components/WhaleSummary';
import { ExchangeFlows } from './components/ExchangeFlows';
import './styles.css';

export type Transaction = {
  id: string;
  type: 'buy' | 'sell' | 'unusual' | 'exchange';
  wallet: string;
  amount: number;
  token: string;
  timestamp: Date;
  usdValue: number;
  exchange?: string;
  direction?: 'in' | 'out';
};

const generateWallet = () => {
  const chars = '0123456789abcdef';
  let wallet = '0x';
  for (let i = 0; i < 8; i++) wallet += chars[Math.floor(Math.random() * chars.length)];
  wallet += '...';
  for (let i = 0; i < 4; i++) wallet += chars[Math.floor(Math.random() * chars.length)];
  return wallet;
};

const tokens = ['ETH', 'BTC', 'SOL', 'PEPE', 'ARB', 'OP', 'LINK', 'UNI'];
const exchanges = ['Binance', 'Coinbase', 'Kraken', 'OKX', 'Bybit'];

const generateTransaction = (): Transaction => {
  const type = ['buy', 'sell', 'unusual', 'exchange'][Math.floor(Math.random() * 4)] as Transaction['type'];
  const token = tokens[Math.floor(Math.random() * tokens.length)];
  const amount = Math.floor(Math.random() * 10000) + 100;
  const prices: Record<string, number> = { ETH: 3200, BTC: 67000, SOL: 145, PEPE: 0.00001, ARB: 1.2, OP: 2.5, LINK: 14, UNI: 9 };

  return {
    id: Math.random().toString(36).substring(7),
    type,
    wallet: generateWallet(),
    amount,
    token,
    timestamp: new Date(),
    usdValue: amount * (prices[token] || 1),
    exchange: type === 'exchange' ? exchanges[Math.floor(Math.random() * exchanges.length)] : undefined,
    direction: type === 'exchange' ? (Math.random() > 0.5 ? 'in' : 'out') : undefined,
  };
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pingActive, setPingActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'buy' | 'sell' | 'unusual' | 'exchange'>('all');

  useEffect(() => {
    // Initialize with some transactions
    const initial = Array.from({ length: 15 }, generateTransaction);
    setTransactions(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTx = generateTransaction();
      setTransactions(prev => [newTx, ...prev.slice(0, 49)]);
      setPingActive(true);
      setTimeout(() => setPingActive(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredTransactions = activeTab === 'all'
    ? transactions
    : transactions.filter(tx => tx.type === activeTab);

  const stats = {
    totalVolume: transactions.reduce((acc, tx) => acc + tx.usdValue, 0),
    buyCount: transactions.filter(tx => tx.type === 'buy').length,
    sellCount: transactions.filter(tx => tx.type === 'sell').length,
    unusualCount: transactions.filter(tx => tx.type === 'unusual').length,
  };

  return (
    <div className="app-container">
      <div className="ocean-overlay" />
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />

      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="radar-icon">
              <div className="radar-sweep" />
            </div>
            <h1 className="logo-text">
              <span className="logo-whale">WHALE</span>
              <span className="logo-radar">RADAR</span>
            </h1>
          </div>
          <div className="status-indicator">
            <span className={`pulse-dot ${pingActive ? 'active' : ''}`} />
            <span className="status-text">LIVE TRACKING</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="dashboard-grid">
          <section className="radar-section">
            <RadarDisplay transactions={transactions} pingActive={pingActive} />
          </section>

          <section className="summary-section">
            <WhaleSummary stats={stats} />
          </section>

          <section className="feed-section">
            <div className="section-header">
              <h2 className="section-title">TRANSACTION FEED</h2>
              <div className="tab-filters">
                {(['all', 'buy', 'sell', 'unusual', 'exchange'] as const).map(tab => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''} tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <TransactionFeed transactions={filteredTransactions} />
          </section>

          <section className="exchange-section">
            <ExchangeFlows transactions={transactions.filter(tx => tx.type === 'exchange')} />
          </section>
        </div>
      </main>

      <footer className="footer">
        <p className="footer-text">Requested by @trustnoneisakey · Built by @clonkbot</p>
      </footer>
    </div>
  );
}

export default App;
