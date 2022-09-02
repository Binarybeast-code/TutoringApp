import React from "react";
import ReactDOM from "react-dom/client";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./store/configureStore";
import "bootstrap/dist/css/bootstrap.css"; // Bootstrap styles
import NavigationBar from "./components/navigation-bar/NavigationBar";
import "./styles/index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={<h1>Loading...</h1>} persistor={persistor}>
      <App />
        <NavigationBar />

    </PersistGate>
  </Provider>
  </React.StrictMode>

);

reportWebVitals();