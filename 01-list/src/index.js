import { h, app } from 'hyperapp';
import { location, Link, Route, Switch } from '@hyperapp/router';

import Index, { initialState as initialIndexState, actions as indexActions } from './views/Index.js';
import List, { initialState as initialListState, actions as listActions } from './views/List.js';

import Loading from './components/Loading';

import { initializeApp } from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './app.json';

const initialState = {
  // Router
  location: location.state,

  // Views
  index: initialIndexState,
  list: initialListState,

  // Firebase
  firebase: null,
};

const actions = {
  // Needed for hyperapp/router
  location: location.actions,

  // Woah, what's going on here? Nested actions? What do these do?
  index: indexActions,
  list: listActions,

  // Firebase
  connect: () => state => {
    return {
      firebase: initializeApp(firebaseConfig),
    };
  }
};


const BreadCrumbs = ({ location, list }) => {
  const { pathname } = location;
  const match = pathname.match(/(\/.+)$/)

  if (match) {
    return (
      <div>
        <Link to="/">Lists</Link>
        &nbsp;/&nbsp;
        <Link to={`/${list.id}`}>List {list.id}</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/">Lists</Link>
    </div>
  );
};

const view = (state, actions) => (
  <div oncreate={() => actions.connect()}>
    <Loading loading={state.firebase === null}>
      <div>
        <div>
          <BreadCrumbs location={state.location} list={state.list} />
        </div>

        <hr />

        <Switch>
          <Route
            path="/"
            render={() => (
              <Index
                state={state.index}
                actions={actions.index}
                firebase={state.firebase}
              />
            )}
          />
          <Route
            path="/:id" render={({ match }) => (
              <List
                params={match.params}
                state={state.list}
                actions={actions.list}
                firebase={state.firebase}
              />
            )}
          />
        </Switch>
      </div>
    </Loading>
  </div>
)

const list = app(initialState, actions, view, document.getElementById('root'));

// Subscribe our app to changes in the router
location.subscribe(list.location);
