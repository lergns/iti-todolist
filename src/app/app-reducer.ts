export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"; // if "loading" - show Preloader
export type ErrorType = string | null;
type ActionsType =
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppErrorAC>;
type InitialStateType = typeof initialState;
// TYPES

export const setAppStatusAC = (status: RequestStatusType) =>
  ({
    type: "APP/SET-STATUS",
    status,
  } as const);
export const setAppErrorAC = (error: ErrorType) =>
  ({
    type: "APP/SET-ERROR",
    error,
  } as const);
// ACs

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as ErrorType,
};

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };

    case "APP/SET-ERROR":
      return { ...state, error: action.error };

    default:
      return state;
  }
};
