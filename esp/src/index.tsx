import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { RouterProvider, SmartComponent } from 'esp-js-react';
import { Router, observeEvent } from 'esp-js';

const INSTRUMENTS_COUNT = 30;
const INTERVAL = 5;

class WatchlistItem {
  title: string;
  bid = 0;
  ask = 0;
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

interface WatchlistViewProps {
  model: WatchlistViewModel;
}

class WatchlistView extends React.Component<WatchlistViewProps> {
  render() {
    return (
      <div>
        <ul style={{listStyle: 'none'}}>
          {this.props.model.items.map(item => (
            <WatchlistItemView item={item} key={item.title} />
          ))}
        </ul>
      </div>
    );
  }
}

const WatchlistItemView = ({item}: {item: WatchlistItem}) => (
  <li>
    <h4>{item.title}</h4>
    <SpotPriceView item={item} />
  </li>
);

const SpotPriceView = ({item}: {item: WatchlistItem}) => (
  <span>
    {item.bid.toFixed(2)} / {item.ask.toFixed(2)}
  </span>
);

const router = new Router();

export class WatchlistViewModel {
  items: WatchlistItem[] = [];

  @observeEvent('onPriceUpdated')
  onPriceUpdated(e: {idx: string; bid: number; ask: number}) {
    this.items[e.idx].updatePrice(e.bid, e.ask);
  }
}

const vm = new WatchlistViewModel();
router.addModel(WatchlistViewModel.name, vm);
router.observeEventsOn(WatchlistViewModel.name, vm);

for (var index = 0; index < INSTRUMENTS_COUNT + 1; index++) {
  vm.items.push(new WatchlistItem('INSTR' + index, index + 10, index + 11));
}

ReactDOM.render(
  <RouterProvider router={router}>
    <div>
      <h1>ESP</h1>
      <SmartComponent modelId={WatchlistViewModel.name} view={WatchlistView} />
    </div>
  </RouterProvider>,
  document.getElementById('root')
);

setInterval(() => {
  let idx = Math.round(Math.random() * INSTRUMENTS_COUNT);
  router.publishEvent(WatchlistViewModel.name, 'onPriceUpdated', {
    idx,
    bid: Math.random(),
    ask: Math.random()
  });
},          INTERVAL);

registerServiceWorker();
