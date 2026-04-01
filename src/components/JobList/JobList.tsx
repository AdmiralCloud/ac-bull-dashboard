import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { VariableSizeList as List } from 'react-window'

import { DataContext } from '../../context/DataContextProvider'
import JobListItem from '@components/JobListItem/JobListItem'
import styles from './JobList.module.css'

export const DataHeightsContext = React.createContext( {
    updateItem: ( ( jobId, options ) => null ) as ( ( jobId: string, options: { height?: number, isOpen?: boolean } ) => void ),
    itemDataState: {},
    listRef: null,
} )

export interface Props {
    className?: string;
}

const JobList: React.FC<Props> = ( { className } ) => {
    const listWrapperRef = useRef<HTMLDivElement>( null )
    const listRef = useRef<any>( null )
    const legendRef = useRef<HTMLDivElement>( null )
    const { shownData } = useContext( DataContext )
    const [ itemDataState, setItemDataState ] = useState<any>( {} )
    const [ listHeight, setListHeight ] = useState( 0 )

    const setListHeightLocale = useCallback( () => {
        if ( listWrapperRef.current && legendRef.current ) {
            // Subtracting 1px to be safe against sub-pixel rounding that causes scrollbars
            const calculatedHeight = listWrapperRef.current.offsetHeight - legendRef.current.offsetHeight - 1
            setListHeight( Math.max( 0, calculatedHeight ) )
        }
    }, [] )

    useEffect( () => {
        if ( listRef.current ) {
            listRef.current.resetAfterIndex( 0 )
        }
    }, [ shownData ] )

    useEffect( () => {
        setListHeightLocale()
        const observer = new ResizeObserver( setListHeightLocale )
        if ( listWrapperRef.current ) {
            observer.observe( listWrapperRef.current )
        }
        return () => observer.disconnect()
    }, [ setListHeightLocale ] )

    const getSize = ( index: number ) => {
        const jobId = shownData[ index ]?.jobId
        return itemDataState[ jobId ]?.height || 90
    }

    const updateItem = useCallback( ( jobId: string, options: any ) => {
        setItemDataState( ( prevState: any ) => {
            const newState = { ...prevState[ jobId ] }
            const { height, isOpen } = options
            if ( height ) newState.height = height
            if ( isOpen !== undefined ) newState.isOpen = isOpen
            return {
                ...prevState,
                [ jobId ]: newState,
            }
        } )
    }, [] )

    return (
        <div ref={ listWrapperRef } className={ [ className, styles.list ].filter( Boolean ).join( ' ' ) }>
            <DataHeightsContext.Provider
              value={ {
                  itemDataState,
                  updateItem,
                  listRef,
              } }
            >
                <div className={ styles.list_wrapper }>
                    <div className={ styles.legend } ref={ legendRef }>
                        <div className='inline w20pc title_job_list_updated_at'>
                            <div className={ `${ styles.upper } ${ styles.title_job_list }` }>Job Type</div>
                            <div className={ `${ styles.mid } ${ styles.hacky_space }` }>-</div>
                            <div className={ styles.lower }>Last Updated At</div>
                        </div>
                        <div className='inline w40pc title_job_list_updated_at'>
                            <div className={ styles.upper }>Job ID</div>
                            <div className={ `${ styles.mid } ${ styles.hacky_space }` }>-</div>
                            <div className={ styles.lower }>Attempts | Priority | Status-Text</div>
                        </div>
                        <div className='inline w20pc title_job_list_updated_at'>
                            <div className={ styles.upper }>Customer</div>
                            <div className={ `${ styles.mid } ${ styles.hacky_space }` }>-</div>
                            <div className={ styles.lower }>Worker</div>
                        </div>
                        <div className='inline w20pc title_job_list_updated_at'>
                            <div className={ styles.upper }>MC | Media</div>
                            <div className={ styles.mid }>Format</div>
                            <div className={ styles.lower }>Media Title</div>
                        </div>
                    </div>
                    { listHeight > 0 && (
                        <List
                          className={ styles.react_window_list }
                          height={ listHeight }
                          itemCount={ shownData.length }
                          itemSize={ getSize }
                          width='100%'
                          ref={ listRef }
                        >
                            { JobListItem }
                        </List>
                    ) }
                </div>
            </DataHeightsContext.Provider>
        </div>
    )
}

export default JobList
