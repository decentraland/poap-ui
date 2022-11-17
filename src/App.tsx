import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import 'core-js/features/set-immediate'
// import 'semantic-ui-css/semantic.min.css'
import 'balloon-css/balloon.min.css'
import 'decentraland-ui/dist/themes/base-theme.css'
import 'decentraland-ui/dist/themes/alternative/light-theme.css'
import { Back } from 'decentraland-ui/dist/components/Back/Back'
import { Navbar } from 'decentraland-ui/dist/components/Navbar/Navbar'
import { Footer } from 'decentraland-ui/dist/components/Footer/Footer'
import { Container } from 'decentraland-ui/dist/components/Container/Container'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Field } from 'decentraland-ui/dist/components/Field/Field'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { importEvent, requestEvent, resetAction, Step, updateEventCodes, updateEventCoordinates } from './module/event/actions';
import { EventState } from './module/event/reducer';
import { parseCoordinates } from './module/event/utils';
import PositionField from './components/PositionField';
import './App.css'

function toStepClass(current: Step, activeOn: Step) {
  let className = 'step'
  if (current < activeOn) {
    className += ' next'
  } else if (current > activeOn) {
    className += ' prev'
  } else {
    className += ' active'
  }

  return className
}

type AppState = {
  id: string,
  codeEdit: string,
  coordinates: string[],
}

const initialState: AppState = {
  id: '',
  codeEdit: '',
  coordinates: []
}

function canEdit(state: AppState) {
  return Boolean(
    state.id &&
    state.codeEdit &&
    state.coordinates &&
    state.coordinates.length > 0
  )
}

function App() {
  const [state, setState] = useState(initialState)
  const dispatch = useDispatch()
  const globalState = useSelector((state: EventState) => state)

  const handleIdChange = useCallback((_, { value }) => setState((current) => ({ ...current, id: value })), [setState])
  const handleEditCodeChange = useCallback((_, { value }) => setState((current) => ({ ...current, codeEdit: value })), [setState])
  const handleCoordinatesChange = useCallback((_, { value }) => setState((current) => ({ ...current, coordinates: value })), [setState])
  const handleCheckEvent = useCallback(() => {
    if (state.id) {
      dispatch(requestEvent(state.id))
    }
  }, [state.id, dispatch])
  const handleImportEvent = useCallback(() => canEdit(state) && dispatch(importEvent(state.id, state.codeEdit, state.coordinates)), [state, dispatch])
  const handleReset = useCallback(() => dispatch(resetAction()), [ dispatch ])
  const handleUpdateCoordinates = useCallback(() => canEdit(state) && dispatch(updateEventCoordinates(state.id, state.codeEdit, state.coordinates)), [ state, dispatch ])

  const handleUpdateCodes = useCallback(() => {
    if (state.id && state.codeEdit) {
      dispatch(updateEventCodes(state.id, state.codeEdit))
    }
  }, [state.id, state.codeEdit, dispatch])

  const resetCoordinates = useCallback(() => {
    if (globalState.data?.coordinates) {
      const coordinates = parseCoordinates(globalState.data.coordinates.split(';'))
      setState((current) => ({ ...current, coordinates }))
    }
  }, [globalState.data?.coordinates])

  useEffect(() => {
    if (!state.coordinates.length && !!globalState.data?.coordinates) {
      resetCoordinates()
    }
  }, [state.coordinates, globalState.data?.coordinates, resetCoordinates])

  useEffect(() => {
    if (!globalState.id) {
      setState(initialState)
    }
  }, [ globalState.id ])

  return <>
    <Navbar isFullscreen />
    <Container className='step-container' >

      {/* INITIAL */}
      <div className={toStepClass(globalState.step, Step.Init)}>
        <div style={{ margin: '0 1rem 2rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img
            alt="decentraland"
            src="https://decentraland.org/logos/svg/color-dark-text.svg"
            width="863"
            height="144"
            style={{ width: '90%', height: 'auto', maxWidth: '450px' }} />
        </div>
        <div style={{ margin: '1rem' }}>
          <Field label="Event ID" type="number" placeholder="00000" value={state.id} onChange={handleIdChange} />
          <div style={{ textAlign: 'center' }}>
            <Button primary style={{ margin: '1rem' }} disabled={!state.id} onClick={handleCheckEvent}>start</Button>
          </div>
        </div>
      </div>

      {/* IMPORT EVENTS */}
      <div className={toStepClass(globalState.step, Step.ImportEvent)}>
        <Back onClick={handleReset} />
        <Loader active={globalState.loading} />
        {!globalState.data && <>
          <h1>Import a new event from POAP</h1>
          <p style={{ color: 'red', marginBottom: '2rem' }}>{globalState.error?.message || ''}</p>
          <Field disabled={globalState.loading} value={state.codeEdit} label="Edit code" type="password" placeholder="******" onChange={handleEditCodeChange} />
          <PositionField disabled={globalState.loading} value={state.coordinates} label="Coordinates" onChange={handleCoordinatesChange} />
          <Button disabled={globalState.loading || !state.codeEdit || state.coordinates.length === 0} loading={globalState.loading} primary onClick={handleImportEvent}>IMPORT</Button>
        </>}
      </div>

      {/* UPDATE CODES */}
      <div className={toStepClass(globalState.step, Step.UpdateEvent)}>
        <Back onClick={handleReset} />
        <Loader active={globalState.loading} />
        {globalState.data && <>
          <h2>{globalState.data.name}</h2>
          <p style={{ color: globalState.error ? 'red' : 'black', marginBottom: '2rem' }}>
            {globalState.error && globalState.error.message}
            {globalState.newCodes === 0 && 'No new code was added'}
            {typeof globalState.newCodes === 'number' && globalState.newCodes > 0  && `${globalState.newCodes} codes added`}
            {' '}
          </p>
          <Field disabled={globalState.loading} value={state.codeEdit} label="Edit code" type="password" placeholder="******" onChange={handleEditCodeChange} />
          <PositionField disabled={globalState.loading} value={state.coordinates} label="Coordinates" onChange={handleCoordinatesChange} />
          <Button disabled={globalState.loading || globalState.updating || !state.codeEdit || state.coordinates.length === 0} basic style={{ margin: '1rem' }} onClick={handleUpdateCoordinates}>Update coordinates</Button>
          <Button disabled={globalState.loading || globalState.updating || !state.codeEdit || state.coordinates.length === 0} basic style={{ margin: '1rem' }} onClick={handleUpdateCodes}>Update codes</Button>
        </>}
      </div>
    </Container>
    <Footer />
  </>;
}

export default App;
