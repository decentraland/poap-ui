import {
  Step,
  ResetAction,
  EventAction,
  UpdateEventAction,
  UpdateEventCodesAction,
  resetAction,
  importEventAction,
  failedEventAction,
  requestEventAction,
  successEventAction,
  updateEventRequestAction,
  updateEventSuccessAction,
  updateEventFailedAction,
  updateEventCodesRequestAction,
  updateEventCodeSuccessAction,
  updateEventCodeFailedAction,
 } from "./actions"
import { DecentralandEvent } from "../api"

export type EventState = {
  step: Step,
  loading: boolean,
  updating: boolean,
  id: null | string,
  code: null | string,
  error: null | Error,
  data: null | DecentralandEvent,
  newCodes: null | number;
}

export const initialState: EventState = {
  step: Step.Init,
  loading: false,
  updating: false,
  id: null,
  code: null,
  error: null,
  data: null,
  newCodes: null,
}

export type Action =
  | ReturnType<typeof resetAction>
  | ReturnType<typeof requestEventAction>
  | ReturnType<typeof importEventAction>
  | ReturnType<typeof successEventAction>
  | ReturnType<typeof failedEventAction>
  | ReturnType<typeof updateEventRequestAction>
  | ReturnType<typeof updateEventSuccessAction>
  | ReturnType<typeof updateEventFailedAction>
  | ReturnType<typeof updateEventCodesRequestAction>
  | ReturnType<typeof updateEventCodeSuccessAction>
  | ReturnType<typeof updateEventCodeFailedAction>

export default function reducer(state: EventState = initialState, action: Action): EventState {
  switch (action.type) {
    case ResetAction:
      return initialState

    case EventAction.Request:
    case EventAction.Create:
      return {
        ...state,
        loading: true,
        updating: false,
        id: action.payload.id,
        code: (action as ReturnType<typeof importEventAction>).payload.editCode || null,
        step: Step.ImportEvent,
        error: null
      }

    case EventAction.Success:
      return {
        ...state,
        loading: false,
        updating: false,
        data: action.payload.data,
        step: Step.UpdateEvent
      }

    case EventAction.Failed:
      return {
        ...state,
        loading: false,
        updating: false,
        data: null,
        step: Step.ImportEvent,
        error: action.payload.error,
      }

    case UpdateEventAction.Request:
    case UpdateEventCodesAction.Request:
      return {
        ...state,
        updating: true,
        newCodes: null,
      }

    case UpdateEventAction.Success:
      return {
        ...state,
        updating: false,
        newCodes: null,
        data: action.payload.data,
        error: null,
      }

    case UpdateEventCodesAction.Success:
      return {
        ...state,
        updating: false,
        newCodes: action.payload.newCodes,
        error: null
      }

    case UpdateEventAction.Failed:
    case UpdateEventCodesAction.Failed:
      return {
        ...state,
        updating: false,
        error: action.payload.error
      }

    default:
      return state
  }
}