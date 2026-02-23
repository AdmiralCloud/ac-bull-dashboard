import React, { useState, useEffect, useContext, useCallback } from 'react'
import { css, cx } from '@emotion/css'

import { getJobs } from '../../api/calls/getJobs'

import { DataContext } from '../../context/DataContextProvider'
import { OptionsContext } from '../../context/OptionsContextProvider'

export interface Props {
    className?: string;
}

const JobListRequester: React.FC<Props> = ( { className } ) => {
    const { env, refreshInterval } = useContext( OptionsContext )
    const { setData } = useContext( DataContext )

    const requestJobs = useCallback( () => {
        getJobs( env )
            .then( ( res ) => {
                const sortedData = [ ...res.data ].sort( ( a, b ) => {
                    return b.timestamp - a.timestamp
                } )

                setData( sortedData )
            } )
            .catch( ( err ) => {
                console.error( err )
            } )
    }, [ env, setData ] )

    useEffect( () => {
        requestJobs()
        const interval = setInterval( () => {
            requestJobs()
        }, refreshInterval )
        return () => clearInterval( interval )
    }, [ refreshInterval, requestJobs, setData ] )

    const stylez = css``

    return (
        <div className={ cx( className, stylez ) } />
    )
}

export default JobListRequester
