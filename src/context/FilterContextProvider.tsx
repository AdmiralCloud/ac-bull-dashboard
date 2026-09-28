import React, { useState, useContext, useCallback } from 'react'
import { DataContext } from './DataContextProvider'
import { searchConfig } from '../../config/search'
import { getPath } from '../helper/getPath'

export interface Props {
    className?: string;
    children
}

type FilterKeysType = {
    jobListFilter?: string[],
    statusFilter?: string[],
    customerSearch?: string[],
    mcSearch?: string[],
    search?: string
}

const searchRegExpArray = []

for ( const [ key, val ] of Object.entries( searchConfig ) ) {
    searchRegExpArray.push( { regExp: new RegExp( `^${ val.prefix }\\d+$` ), filterKey: key, prefixRegExp: new RegExp( `^${ val.prefix }` ), dataPath: val.jobDataPath } )
}

export const FilterContext = React.createContext( {
    setFilter: ( () => null ) as ( filterOptions: FilterKeysType ) => void,
} )

const FilterContextProvider: React.FC<Props> = ( { children } ) => {
    const { data, setShownData } = useContext( DataContext )

    const [ jobListFilterState, setJobListFilterState ] = useState( [] )
    const [ statusFilterState, setStatusFilterState ] = useState( [] )
    const [ searchState, setSearchState ] = useState( '' )

    const setFilter = useCallback( ( filterData: FilterKeysType ) => {
        const { jobListFilter, statusFilter, search } = filterData
        // const { jobListFilter, statusFilter, customerSearch, mcSearch, search = '' } = filterData

        let newData = [ ...data ]

        // JOB LIST FILTERING
        if ( jobListFilter ) {
            setJobListFilterState( jobListFilter )
        }

        if ( jobListFilter && jobListFilter.length ) {
            newData = newData.filter( nD => jobListFilter.includes( nD.jobList ) )
        } else if ( !jobListFilter && jobListFilterState.length ) {
            newData = newData.filter( nD => jobListFilterState.includes( nD.jobList ) )
        }

        // STATUS FILTERING
        if ( statusFilter ) {
            setStatusFilterState( statusFilter )
        }

        if ( statusFilter && statusFilter.length ) {
            newData = newData.filter( nD => statusFilter.includes( nD.status ) )
        } else if ( !statusFilter && statusFilterState.length ) {
            newData = newData.filter( nD => statusFilterState.includes( nD.status ) )
        }

        // SEARCH
        if ( search !== undefined ) {
            setSearchState( search.trim() )
            const searchParts = search.split( ',' ).map( s => s.trim() )
            searchParts.forEach( ( searchPart ) => {
                searchRegExpArray.forEach( ( searchRegExp ) => {
                    if ( searchPart.match( searchRegExp.regExp ) ) {
                        newData = newData.filter( ( nD ) => {
                            const targetValue = getPath( nD, searchRegExp.dataPath )
                            return targetValue === searchPart.replace( searchRegExp.prefixRegExp, '' )
                        } )
                    }
                } )
            } )
        } else if ( searchState ) {
            const searchParts = searchState.split( ',' ).map( s => s.trim() )
            searchParts.forEach( ( searchPart ) => {
                searchRegExpArray.forEach( ( searchRegExp ) => {
                    if ( searchPart.match( searchRegExp.regExp ) ) {
                        newData = newData.filter( ( nD ) => {
                            const targetValue = getPath( nD, searchRegExp.dataPath )
                            return `${ targetValue }` === searchPart.replace( searchRegExp.prefixRegExp, '' )
                        } )
                    }
                } )
            } )
        }

        setShownData( newData )
    }, [ data, jobListFilterState, searchState, setShownData, statusFilterState ] )

    return (
        <FilterContext.Provider value={ {
            setFilter,
        } }
        >
            { children }
        </FilterContext.Provider>
    )
}

export default FilterContextProvider
