import './App.css';
import Header from './comonents/Header/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ScrollToTop from './comonents/ScrollToTop/ScrollToTop';
import Graph from './comonents/Graph/Graph';
import TestGraph from './comonents/TestGraph/TestGraph';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/graphtest">
            <ScrollToTop />
            <Header />
            <TestGraph />
          </Route>
          <Route path="/">
            <ScrollToTop />
            <Header />
            <Graph />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
