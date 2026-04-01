import React, { useState, useEffect, useContext } from 'react'

import { DataContext } from '../../../context/DataContextProvider'
import { FilterContext } from '../../../context/FilterContextProvider'
import MultiSelect from '../../MultiSelect'
import styles from './JobListSelectionsJobList.module.css'

export interface Props {
    className?: string;
}

const JobListSelectionsJobList: React.FC<Props> = ( { className } ) => {
    const [ curValue, setCurValue ] = useState<string[]>( [] )
    const { availableJobLists, data } = useContext( DataContext )
    const { setFilter } = useContext( FilterContext )

    const handleSelect = ( newValue: string[] ) => {
        setCurValue( newValue )
    }

    useEffect( () => {
        if ( curValue.filter( cV => availableJobLists.includes( cV ) ).length !== curValue.length ) {
            setCurValue( curValue.filter( cV => availableJobLists.includes( cV ) ) )
        }
    }, [ availableJobLists, curValue ] )

    useEffect( () => {
        setFilter( {
            jobListFilter: curValue,
        } )
    }, [ curValue, setFilter ] )

    const options = availableJobLists.map( availableJobListItem => ( {
        label: availableJobListItem,
        value: availableJobListItem,
        count: data.filter( job => job.jobList === availableJobListItem ).length,
    } ) )

    return (
        <div className={ [ className, styles.wrapper ].filter( Boolean ).join( ' ' ) }>
            <MultiSelect
              label='JobLists'
              options={ options }
              value={ curValue }
              onChange={ handleSelect }
            />
        </div>
    )
}

export default JobListSelectionsJobList
