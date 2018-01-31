import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';

export const initialState = {
  lists: [],
  loading: false,
};

export const actions = {
  subscribe: firebase => (state, actions) => {
    console.log('TODO: Index.subscribe');

    firebase
      .firestore()
      .collection('list')
      .onSnapshot(snapshot => {
        console.log(snapshot.docs);
        const lists = snapshot.docs.map(docSnap => {
          return { id: docSnap.id };
        })

        actions.setLists(lists);
      });


    return {
      lists: state.lists,
      loading: true,
    }
  },

  unsubscribe: firebase => state => {
    console.log('TODO: Index.unsubscribe');
    return initialState;
  },

  newList: firebase => state => {
    firebase
      .firestore()
      .collection('list')
      .add({
        items: [],
      })
  },

  setLists: lists => state => ({ lists: lists, loading: false }),
};

export default ({ state, actions, firebase }) => {
  return (
    <ul
      oncreate={() => actions.subscribe(firebase)}
      ondestroy={() => actions.unsubscribe(firebase)}
    >
      {state.lists.map(list => (
        <li><Link to={`/${list.id}`}>List {list.id}</Link></li>
      ))}
      <li><button onclick={() => actions.newList(firebase)}>New List</button></li>
    </ul>
  )
};
