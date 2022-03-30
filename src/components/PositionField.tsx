import React, { useCallback } from 'react'
import { TagField, TagFieldProps } from 'decentraland-ui/dist/components/TagField/TagField'
import { DropdownProps } from 'decentraland-ui/dist/components/Dropdown/Dropdown'
import { parseCoordinates } from '../module/event/utils'

export default function PositionField(props: TagFieldProps) {

  const handleChange = useCallback(function (e: React.ChangeEvent<any>, data: DropdownProps) {
    if (props.onChange) {
      const value = parseCoordinates(data.value as string[])
      props.onChange(e, { ...data, value })
    }
  }, [ props.onChange ])

  return <TagField  {...props} placeholder={props.placeholder ?? ['-1,-1', '0,0', '1,1'].join(';')} onChange={handleChange}/>
}