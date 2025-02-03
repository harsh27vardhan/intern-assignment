import React from 'react';
import { Provider } from 'react-redux';
import StockSelector from './Components/StockSelector';
import store from './store/store';

const App = () => {
  return (
    <Provider store={store}>
      <StockSelector />
    </Provider>
  );
};

export default App;