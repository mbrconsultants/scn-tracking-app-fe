import { createContext, useEffect, useReducer, useState } from "react";
import LoginReducer from "./LoginReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(LoginReducer, INITIAL_STATE);

  // 👇 New: refresh trigger for tracking-related pages
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);
  return (
    <Context.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </Context.Provider>
  );
};
