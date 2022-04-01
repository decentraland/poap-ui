
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { action } from 'typesafe-actions'
import { DecentralandEvent, getDecentralandEvent, importEventCodes, importEventToDecentraland, updateEvent } from '../api'
import { EventState } from './reducer'

export const enum Step {
  Init,
  ImportEvent,
  UpdateEvent,
}

export const ResetAction = 'Reset'
export const resetAction = () => action(ResetAction, {})

export const EventAction = {
  Request: '[request] event',
  Create: '[create] event',
  Success: '[success] event',
  Failed: '[failed] event',
} as const
export const requestEventAction = (id: string) => action(EventAction.Request, { id })
export const importEventAction = (id: string, editCode: string, coordinates: string[]) => action(EventAction.Create, { id, editCode, coordinates })
export const successEventAction = (id: string, data: DecentralandEvent) => action(EventAction.Success, { id, data })
export const failedEventAction = (error: Error) => action(EventAction.Failed, {error })

export const UpdateEventAction = {
  Request: '[request] event update',
  Success: '[success] event update',
  Failed: '[failed] event update',
} as const
export const updateEventRequestAction = (id: string, editCode: string, coordinates: string[]) => action(UpdateEventAction.Request, { id, editCode, coordinates })
export const updateEventSuccessAction = (id: string, data: DecentralandEvent) => action(UpdateEventAction.Success, { id, data })
export const updateEventFailedAction = (error: Error) => action(UpdateEventAction.Failed, { error })

export const UpdateEventCodesAction = {
  Request: '[request] event codes',
  Success: '[success] event codes',
  Failed: '[failed] event codes',
} as const
export const updateEventCodesRequestAction = (id: string, editCode: string) => action(UpdateEventCodesAction.Request, { id, editCode })
export const updateEventCodeSuccessAction = (id: string, newCodes: number) => action(UpdateEventCodesAction.Success, { id, newCodes })
export const updateEventCodeFailedAction = (error: Error) => action(UpdateEventCodesAction.Failed, { error })

function createThunk<T extends (...args: any[]) => ThunkAction<void, EventState, unknown, AnyAction>>(callback: T): T {
  return callback
}

export const requestEvent = createThunk((id: string) => async (dispatch) => {
  await dispatch(requestEventAction(id))
  try {
    const event = await getDecentralandEvent(id)
    await dispatch(successEventAction(id, event))
  } catch (err) {
    await dispatch(failedEventAction(err as Error))
  }
})

// export const importEvent = (id: string, coordinates: string[]) => action(EventAction..Requst, { id, coordinates })
export const importEvent = createThunk((id: string, editCode: string, coordinates: string[]) => async (dispatch) => {
  await dispatch(importEventAction(id, editCode, coordinates))
  try {
    const event = await importEventToDecentraland(id, editCode, coordinates)
    await dispatch(successEventAction(id, event))
  } catch (err) {
    await failedEventAction(err as Error)
  }
})

export const updateEventCoordinates = createThunk((id: string , editCode: string, coordinates: string[]) => async (dispatch) => {
  await dispatch(updateEventRequestAction(id, editCode, coordinates))
  try {
    const data = await updateEvent(id, editCode, { coordinates: coordinates.join(';') })
    await dispatch(updateEventSuccessAction(id, data))
  } catch (err) {
    await dispatch(updateEventFailedAction(err as Error))
  }
})

export const updateEventCodes = createThunk((id: string, editCode: string) => async (dispatch) => {
  await dispatch(updateEventCodesRequestAction(id, editCode))
  try {
    const data = await importEventCodes(id, editCode)
    await dispatch(updateEventCodeSuccessAction(id, data.body.num))
  } catch (err) {
    await dispatch(updateEventCodeFailedAction(err as Error))
  }
})