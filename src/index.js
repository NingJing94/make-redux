function renderApp (newAppState, oldAppState = {}) {
  if(newAppState === oldAppState) return;   //won't render since no change
  console.log('App render');
  renderTitle(newAppState.title, oldAppState.title);
  renderContent(newAppState.content, oldAppState.content);
}

function renderTitle (newTitle, oldTitle = {}) {
  if(newTitle === oldTitle) return;
  console.log('Title render');
  const titleDOM = document.getElementById('title');
  titleDOM.innerHTML = newTitle.text;
  titleDOM.style.color = newTitle.color;
}

function renderContent (newContent, oldContent = {}) {
  if(newContent === oldContent) return;
  console.log('Content render');
  const contentDOM = document.getElementById('content');
  contentDOM.innerHTML = newContent.text;
  contentDOM.style.color = newContent.color;
}

/**
 * 
 * @param {*} state 
 * @param {*} stateChanger describe how state will update according to specific action
 */
function createStore(reducer) {
  let state = null;
  const listeners = [];
  const subscribe = (listener) => listeners.push(listener);
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);  //override old state
    listeners.forEach(listener => listener());
  };
  dispatch({}); //dispatch a dumy action to init state
  return {
    getState,
    dispatch,
    subscribe
  }
}

//pure function
//init state and return new state according to action
function reducer(state, action) {
  if(!state) {
    return {
      title: {
        text: 'React Title',
        color: 'red',
      },
      content: {
        text: 'React Content',
        color: 'blue'
      }
    }
  }
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      return {
        ...state,
        title: {
          ...state.title,
          text: action.text
        }
      };
    case 'UPDATE_TITLE_COLOR':
      return {
        ...state,
        title: {
          ...state.title,
          color: action.color
        }
      };
    default:
      return state;
  }
}

//create store
const store = createStore(reducer);
let oldState = store.getState();

//listen state change then update UI
store.subscribe(() => {
  const newState = store.getState();
  renderApp(newState, oldState);
  oldState = newState;
});

//render for the 1st time
renderApp(store.getState());

//update UI by dispatching actions
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React Title》' }) //change title text
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) //change title text color