import React, { useState, useEffect, useCallback } from 'react'
import { css, cx } from '@emotion/css'

export interface Props {
    className?: string;
    children
}

export const DataContext = React.createContext( {
    shownData: [] as ItemDataType[],
    setShownData: ( () => null ) as React.Dispatch<React.SetStateAction<ItemDataType[]>>,
    data: [] as ItemDataType[],
    setData: ( () => null ) as React.Dispatch<React.SetStateAction<ItemDataType[]>>,
    availableJobLists: [] as string[],
} )

const DataContextProvider: React.FC<Props> = ( { children } ) => {
    const [ data, setData ] = useState( [] )
    const [ shownData, setShownData ] = useState( [] )
    const [ availableJobLists, setAvailableJobLists ] = useState( [] )

    const setDataAndHandleData = useCallback( ( newData ) => {
        const availableJobLists = new Set( newData.map( nD => nD.jobList ) )
        setAvailableJobLists( [ ...availableJobLists ] )
        setData( newData )
    }, [] )

    return (
        <DataContext.Provider value={ {
            data,
            setData: setDataAndHandleData,
            shownData,
            setShownData,
            availableJobLists,
        } }
        >
            { children }
        </DataContext.Provider>
    )
}

export default DataContextProvider
