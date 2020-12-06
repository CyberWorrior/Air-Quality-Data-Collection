import './App.css';
import Header from './comonents/Header/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ScrollToTop from './comonents/ScrollToTop/ScrollToTop';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/">
            <ScrollToTop />
            <Header />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
