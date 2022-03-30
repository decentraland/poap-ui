import React, { useCallback } from 'react'
import { TagField, TagFieldProps } from 'decentraland-ui/dist/components/TagField/TagField'
import { DropdownProps } from 'decentraland-ui/dist/components/Dropdown/Dropdown'
import { parseCoordinates } from '../module/event/utils'

export default function PositionField({ onChange, ...props }: TagFieldProps) {

  const handleChange = useCallback(function (e: React.ChangeEvent<any>, data: DropdownProps) {
    if (onChange) {
      const value = parseCoordinates(data.value as string[])
      onChange(e, { ...data, value })
    }
  }, [ onChange ])

  return <TagField  {...props} placeholder={props.placeholder ?? ['-1,-1', '0,0', '1,1'].join(';')} onChange={handleChange}/>
}