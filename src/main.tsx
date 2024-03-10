import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import HomeScreen from "./screens/HomeScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import { PersistGate } from "redux-persist/integration/react";
import AdminRoute from "./components/AdminRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* public routes */}
      <Route path="" element={<PublicRoute />}>
        <Route path="sign-in" element={<SigninScreen />} />
      </Route>

      {/* private routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route index element={<HomeScreen />} />
        <Route path="profile" element={<HomeScreen />} />
      </Route>

      {/* admin routes */}
      <Route path="" element={<AdminRoute />}>
        <Route path="admins/users" element={<SigninScreen />} />
        <Route path="admins/users/sign-up" element={<SignupScreen />} />
      </Route>
    </Route>
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
