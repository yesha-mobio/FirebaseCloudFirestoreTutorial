import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider, useSelector } from "react-redux";
import thunk from "redux-thunk";
import {
  createFirestoreInstance,
  reduxFirestore,
  getFirestore,
} from "redux-firestore";
import {
  ReactReduxFirebaseProvider,
  getFirebase,
  isLoaded,
} from "react-redux-firebase";
import firebase from "firebase/app";

import rootReducer from "./store/reducers/rootReducer";
import fbConfig from "./config/fbConfig";

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  attachAuthIsReady: true, // attaches auth is ready promise to store
};

const enhancers = [];
// const devToolsExtension = window.devToolsExtension;
const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
if (typeof devToolsExtension === "function") {
  enhancers.push(devToolsExtension());
}

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    reduxFirestore(fbConfig),
    ...enhancers
  )
);

const rffProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

const AuthIsLoaded = ({ children }) => {
  const auth = useSelector((state) => state.firebase.auth);
  if (!isLoaded(auth))
    return (
      <div className="center red-text">
        <h2>Loding...!!</h2>
      </div>
    );
  return children;
};

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rffProps}>
      <AuthIsLoaded>
        <App />
      </AuthIsLoaded>
    </ReactReduxFirebaseProvider>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
