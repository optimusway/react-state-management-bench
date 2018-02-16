import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const INSTRUMENTS_COUNT = 30;
const INTERVAL = 5;

class WatchlistItem {
  title: string;
  @observable bid = 0;
  @observable ask = 0;
  constructor(title: string, bid: number, ask: number) {
    this.title = title;
    this.bid = bid;
    this.ask = ask;
  }

  updatePrice(bid: number, ask: number) {
    this.bid = bid;
    this.ask = ask;
  }
}

class Watchlist {
  items: WatchlistItem[] = [];
}

interface WatchlistViewProps {
  watchlist: Watchlist;
}

class WatchlistView extends React.Component<WatchlistViewProps> {
  render() {
    return (
      <ul style={{listStyle: 'none'}}>
        {this.props.watchlist.items.map(item => (
          <WatchlistItemView item={item} key={item.title} />
        ))}
      </ul>
    );
  }
}

const WatchlistItemView = ({item}: {item: WatchlistItem}) => (
  <li>
    <h4>{item.title}</h4>
    <SpotPriceView item={item} />
  </li>
);

const SpotPriceView = observer(({item}: {item: WatchlistItem}) => (
  <span>
    {item.bid.toFixed(2)} / {item.ask.toFixed(2)}
  </span>
));

const store = new Watchlist();
for (let index = 0; index < INSTRUMENTS_COUNT + 1; index++) {
  store.items.push(new WatchlistItem('INSTR' + index, index + 10, index + 11));
}

ReactDOM.render(
  <div>
    <h1>Mobx</h1>
    <WatchlistView watchlist={store} />
  </div>,
  document.getElementById('root')
);

setInterval(() => {
  const idx = Math.round(Math.random() * INSTRUMENTS_COUNT);
  const item = store.items[idx];
  item.updatePrice(Math.random(), Math.random());
}, INTERVAL);

registerServiceWorker();
