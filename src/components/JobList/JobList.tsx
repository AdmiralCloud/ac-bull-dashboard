import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { css, cx } from '@emotion/css'
import { VariableSizeList as List } from 'react-window'

import { DataContext } from '../../context/DataContextProvider'
import JobListItem from '@components/JobListItem/JobListItem'

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

    const stylez = css`
        height: 100%;
        position: relative;
        overflow: hidden;

        .list_wrapper{
            height: 100%;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }

        .hacky_space {
            opacity: 0;
        }

        .legend {
            flex-shrink: 0;
            background-color: #29282f;
            border-bottom: 1px solid rgba( 255,255,255,0.9 );
            padding: 8px;
            padding-left: 62px;
            padding-right: 132px;
            color: white;

            .upper {
                font-size: 1.3rem;
            }

            .lower, .mid {
                font-size: 0.825rem;
                font-weight: lighter;
            }

            .mid {
                margin-bottom: 8px;
            }

            .title_job_list {
                font-weight: bold;
            }
        }

        .react_window_list {
            flex-grow: 1;
        }
    `

    return (
        <div ref={ listWrapperRef } className={ cx( className, stylez ) }>
            <DataHeightsContext.Provider
              value={ {
                  itemDataState,
                  updateItem,
                  listRef,
              } }
            >
                <div className='list_wrapper'>
                    <div className='legend' ref={ legendRef }>
                        <div className='inline w20pc title_job_list_updated_at'>
                            <div className='upper title_job_list'>Job Type</div>
                            <div className='mid title_job_type'>Job List</div>
                            <div className='lower title_updated_at'>Last Updated At</div>
                        </div>
                        <div className='inline w40pc title_job_list_updated_at'>
                            <div className='upper title_job_id'>Job ID</div>
                            <div className='mid hacky_space'>-</div>
                            <div className='lower title_priority'>Attempts | Priority | Status-Text</div>
                        </div>
                        <div className='inline w20pc title_job_list_updated_at'>
                            <div className='upper title_customer'>Customer</div>
                            <div className='mid hacky_space'>-</div>
                            <div className='lower title_worker'>Worker</div>
                        </div>
                        <div className='inline w20pc title_job_list_updated_at'>
                            <div className='upper title_customer'>MC | Media</div>
                            <div className='mid title_format_id'>Format</div>
                            <div className='lower '>Media Title</div>
                        </div>
                    </div>
                    { listHeight > 0 && (
                        <List
                          className='react_window_list'
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