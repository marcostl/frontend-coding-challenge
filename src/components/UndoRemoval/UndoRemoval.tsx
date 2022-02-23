import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import Toast from "../../components/Toast";
import { UNDO_TOAST_TIMEOUT_MS } from "../../constants";
import { Data, useCreateDataMutation } from "../../lib/fakeApollo";
import {
  initialUndoRemovalState,
  undoRemovalReducer,
  UNDO_TOAST_STATES,
} from "./undoRemovalReducer";

const UndoRemovalContext = createContext<{
  removeData: (data: Data) => void;
  undoRemoval: () => void;
}>({ removeData: () => {}, undoRemoval: () => {} });

const UndoRemovalProvider = ({ children }: { children: React.ReactNode }) => {
  const [removalState, dispatch] = useReducer(
    undoRemovalReducer,
    initialUndoRemovalState
  );
  const [create, { loading: loadingCreate }] = useCreateDataMutation();
  const currentUndoState = useRef<"UNDOING" | "IDLE">("IDLE");

  const { toast, removedIdList, removedData } = removalState;

  useEffect(() => {
    if (toast === null || toast === "UNDO_STARTED") return;
    const timeoutId = setTimeout(() => {
      dispatch({ type: "HIDE_TOAST" });
    }, UNDO_TOAST_TIMEOUT_MS);
    return () => clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    if (currentUndoState.current === "UNDOING" && loadingCreate === false) {
      dispatch({ type: "HIDE_TOAST" });
      currentUndoState.current = "IDLE";
    }
  }, [loadingCreate]);

  const removeData = (data: Data) => {
    dispatch({ type: "REMOVE", payload: data });
  };

  const undoRemoval = () => {
    if (removedIdList.length === 0) return;

    const lastRemovedId = removedIdList[removedIdList.length - 1];
    const data = removedData.get(lastRemovedId);

    if (data === undefined) return;

    create({ data: { ...data } });
    dispatch({ type: "START_UNDO" });
    currentUndoState.current = "UNDOING";
  };

  return (
    <UndoRemovalContext.Provider value={{ removeData, undoRemoval }}>
      {children}
      {toast !== null && (
        <Toast
          icon={UNDO_TOAST_STATES[toast].icon}
          message={UNDO_TOAST_STATES[toast].message}
          onClick={undoRemoval}
        />
      )}
    </UndoRemovalContext.Provider>
  );
};

export const useUndoRemoval = () => {
  return useContext(UndoRemovalContext);
};

export default UndoRemovalProvider;
