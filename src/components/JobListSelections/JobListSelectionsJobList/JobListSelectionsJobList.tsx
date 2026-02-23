import React, { useState, useEffect, useContext } from 'react'
import { css, cx } from '@emotion/css'

import { DataContext } from '../../../context/DataContextProvider'
import { FilterContext } from '../../../context/FilterContextProvider'
import MultiSelect from '../../MultiSelect'

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

    const stylez = css`
        width: 260px;
        max-width: 260px;
    `

    const options = availableJobLists.map( availableJobListItem => ( {
        label: availableJobListItem,
        value: availableJobListItem,
        count: data.filter( job => job.jobList === availableJobListItem ).length,
    } ) )

    return (
        <div className={ cx( className, stylez ) }>
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