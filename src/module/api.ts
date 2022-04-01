const POAP_SERVER = process.env.REACT_APP_POAP_SERVER || 'https://poap-api.decentraland.org/'

export type POAPEvent = {
  id: number
  fancy_id: string
  name: string
  event_url: string
  image_url: string
  country: string
  city: string
  description: string
  year: number
  start_date: string
  end_date: string
  expiry_date: string
  from_admin: boolean
  virtual_event: boolean
  event_template_id: number
  event_host_id: number
  private_event: boolean
}

export type DecentralandEvent = {
  id: number
  uuid: string
  fancy_id: string
  name: string
  event_url: string
  image_url: string
  country: string
  city: string
  description: string
  year: number
  event_start_date: string
  event_end_date: string
  created_at: string
  enabled: boolean
  coordinates: string
  distribution_start_date: null | string
  distribution_end_date: null | string
}

export type DecentralandEventUpdate= Pick<DecentralandEvent, 'coordinates'>
export type DecentralandEventUpdateOptions<K extends keyof DecentralandEventUpdate = keyof DecentralandEventUpdate> = [K, DecentralandEvent[K]][]

export type UpdateEventCodes = {
  url: string,
  body: {
    num: number
  }
}

export async function getDecentralandEvent(idOrUUID: string): Promise<DecentralandEvent> {
  const res = await fetch(new URL(`/event/${idOrUUID}`, POAP_SERVER).toString())
  const body = await res.json()
  if (body.ok) {
    return body.data
  }

  throw new Error(body.error || `Fail to fetch event "${idOrUUID}"`)
}

export async function importEventToDecentraland(id: string, editCode: string, coordinates: string[]): Promise<DecentralandEvent> {
  const res = await fetch(new URL(`/event/${id}`, POAP_SERVER).toString(), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ editCode, coordinates: coordinates.join(';') })
  })

  const body = await res.json()
  if (body.ok) {
    return body.data
  }

  throw new Error(body.error || `Fail to import event "${id}"`)
}

export async function updateEvent(id: string, editCode: string, data: DecentralandEventUpdate): Promise<DecentralandEvent> {
  const options: DecentralandEventUpdateOptions = [['coordinates', data.coordinates]]
  const res = await fetch(new URL(`/event/${id}`, POAP_SERVER).toString(), {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ editCode, options })
  })

  const body = await res.json()
  if (body.ok) {
    return body.data
  }

  throw new Error(body.error || `Fail to update event "${id}"`)
}

export async function importEventCodes(id: string, editCode: string): Promise<UpdateEventCodes> {
  const res = await fetch(new URL(`/addcodes/${id}`, POAP_SERVER).toString(), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ editCode })
  })

  const body = await res.json()
  return body.data
}