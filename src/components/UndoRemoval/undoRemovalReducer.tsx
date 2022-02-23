import { ClockIcon, PencilIcon } from "@heroicons/react/outline";
import { Data } from "../../lib/fakeApollo";

const UNDO_TOAST = {
  icon: <PencilIcon className="w-4 h-4" />,
  message: "Undo data removal",
};

const UNDO_STARTED_TOAST = {
  icon: <ClockIcon className="w-4 h-4" />,
  message: "Undoing removal",
};

export const UNDO_TOAST_STATES = {
  UNDO: UNDO_TOAST,
  UNDO_STARTED: UNDO_STARTED_TOAST,
};

type UndoRemovalState = {
  toast: keyof typeof UNDO_TOAST_STATES | null;
  removedIdList: string[];
  removedData: Map<string, Data>;
};

export const initialUndoRemovalState: UndoRemovalState = {
  toast: null,
  removedIdList: [],
  removedData: new Map(),
};

type UndoRemovalAction =
  | { type: "REMOVE"; payload: Data }
  | { type: "START_UNDO" }
  | { type: "HIDE_TOAST" };

const addDataToMap = (newData: Data, map: Map<string, Data>) => {
  const newMap = new Map(map);
  newMap.set(newData.id, newData);
  return newMap;
};

const startUndoRemoval = (state: UndoRemovalState): UndoRemovalState => {
  const { removedData, removedIdList } = state;

  if (removedIdList.length === 0) return { ...state };

  const removedIdListCopy = [...removedIdList];
  const lastRemovedId = removedIdListCopy.pop() as string;

  const removedDataCopy = new Map(removedData);
  removedDataCopy.delete(lastRemovedId);

  return {
    ...state,
    toast: "UNDO_STARTED",
    removedData: removedDataCopy,
    removedIdList: removedIdListCopy,
  };
};

export const undoRemovalReducer = (
  state: UndoRemovalState,
  action: UndoRemovalAction
): UndoRemovalState => {
  switch (action.type) {
    case "REMOVE":
      return {
        ...state,
        toast: "UNDO",
        removedIdList: [...state.removedIdList, action.payload.id],
        removedData: addDataToMap(action.payload, state.removedData),
      };
    case "START_UNDO":
      return startUndoRemoval(state);
    case "HIDE_TOAST":
      return { ...state, toast: null };
    default:
      return { ...state };
  }
};
