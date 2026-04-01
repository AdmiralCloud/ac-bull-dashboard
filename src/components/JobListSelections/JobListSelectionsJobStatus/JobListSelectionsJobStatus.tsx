import React, { useState, useEffect, useContext } from 'react'

import { statusConfig } from '../../../../config/statusConfig'

import { FilterContext } from '../../../context/FilterContextProvider'
import { DataContext } from '../../../context/DataContextProvider'
import MultiSelect from '../../MultiSelect'
import styles from './JobListSelectionsJobStatus.module.css'

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

    const options = availableStati.map( availableStatiItem => ( {
        label: availableStatiItem,
        value: availableStatiItem,
        count: data.filter( job => job.status === availableStatiItem ).length,
    } ) )

    return (
        <div className={ [ className, styles.wrapper ].filter( Boolean ).join( ' ' ) }>
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
