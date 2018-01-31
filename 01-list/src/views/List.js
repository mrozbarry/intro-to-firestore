import { h } from 'hyperapp';
import Loading from '../components/Loading';

export const initialState = {
  id: null,
  items: [],
  loading: false,
  newItem: '',
};

export const actions = {
  subscribe: ({ params, firebase }) => (state, actions) => {
    console.log('TODO: List.subscribe', params.id);

    firebase
      .firestore()
      .collection('list')
      .doc(params.id)
      .onSnapshot(snapshot => {
        actions.setItems(snapshot.data().items);
      })

    return {
      id: params.id,
      items: [],
      loading: true,
    };
  },

  unsubscribe: firebase => (state) => {
    console.log('TODO: List.unsubscribe', state.id);

    return initialState;
  },

  setItems: items => state => {
    console.log('setItems', items);
    return {
      items: items,
      loading: false,
    }
  },

  setNewItem: newItem => state => ({ newItem: newItem }),

  addNewItemToItems: ({ newItem, firebase }) => state => {
    console.log('TODO: List.addNewItemToItems', newItem);

    firebase
      .firestore()
      .collection('list')
      .doc(state.id)
      .update({ items: state.items.concat(newItem) });

    return {
      newItem: '',
    };
  },
};

export default ({ params, state, actions, firebase }) => (
  <div
    oncreate={() => actions.subscribe({ params: params, firebase: firebase })}
    ondestroy={() => actions.unsubscribe(firebase)}
  >
    <Loading loading={state.loading}>
      <ul>
        {state.items.map((item, iter) => (
          <li key={[iter, item].join('')}>
            {item}
          </li>
        ))}

        <li key="newItem">
          <input
            type="text"
            oninput={e => actions.setNewItem(e.target.value)}
            onkeydown={e => {
              if (e.which === 13) {
                e.preventDefault();
                actions.addNewItemToItems({
                  newItem: state.newItem,
                  firebase: firebase,
                });
              }
            }}
            value={state.newItem}
          />
        </li>

      </ul>
    </Loading>
  </div>
);
