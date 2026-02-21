import React, { useState, useEffect, useContext } from 'react'
import { css, cx } from '@emotion/css'

import { statusConfig } from '../../../../config/statusConfig'

import { FilterContext } from '../../../context/FilterContextProvider'
import { DataContext } from '../../../context/DataContextProvider'
import MultiSelect from '../../MultiSelect'

export interface Props {
    className?: string;
}

const JobListSelectionsJobStatus: React.FC<Props> = ( { className } ) => {
    const [ curValue, setCurValue ] = useState<string[]>( [] )
    const { setFilter } = useContext( FilterContext )
    const { data } = useContext( DataContext )
    const availableStati = Object.keys( statusConfig )

    const handleSelect = ( newValue: string[] ) => {
        setCurValue( newValue )
    }

    useEffect( () => {
        if ( curValue.filter( cV => availableStati.includes( cV ) ).length !== curValue.length ) {
            setCurValue( curValue.filter( cV => availableStati.includes( cV ) ) )
        }
    }, [ availableStati, curValue ] )

    useEffect( () => {
        setFilter( {
            statusFilter: curValue,
        } )
    }, [ curValue, setFilter ] )

    const stylez = css`
        min-width: 260px;
    `

    const options = availableStati.map( availableStatiItem => ( {
        label: availableStatiItem,
        value: availableStatiItem,
        count: data.filter( job => job.status === availableStatiItem ).length,
    } ) )

    return (
        <div className={ cx( className, stylez ) }>
            <MultiSelect
              label='Status'
              options={ options }
              value={ curValue }
              onChange={ handleSelect }
            />
        </div>
    )
}

export default JobListSelectionsJobStatus