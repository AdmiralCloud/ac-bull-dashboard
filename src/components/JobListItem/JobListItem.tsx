import React, { useState, useEffect, useContext, useRef } from 'react'
import { css, cx } from '@emotion/css'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import { statusConfig } from '../../../config/statusConfig'

import JobListItemDeleteJobButton from '../JobListItemDeleteJobButton/JobListItemDeleteJobButton'
import JobListItemRestartJobButton from '../JobListItemRestartJobButton/JobListItemRestartJobButton'
import ProgressIndicatorCircle from './Parts/ProgressIndicatorCircle'

import FailedJobMessageBox from './Parts/FailedJobMessageBox'

import { DataContext } from '../../context/DataContextProvider'
import { DataHeightsContext } from '../JobList/JobList'

export interface Props {
    index: number
    style: any
}

const JobListItem: React.FC<Props> = ( {
    index,
    style,
} ) => {
    const { shownData } = useContext( DataContext )
    const job = shownData[ index ]
    if ( !job ) return null

    const {
        status,
        jobList,
        jobId,
        priority,
        progress,
        timestamp,
        processedOn,
        finishedOn,
        data: jobdata,
        opts,
        failedReason,
    } = job

    const itemRef = useRef<HTMLDivElement>( null )
    const { listRef, itemDataState, updateItem } = useContext( DataHeightsContext )
    const [ itemKey ] = useState( uuidv4() )

    useEffect( () => {
        if ( itemRef.current && itemDataState[ jobId ]?.height !== itemRef.current.offsetHeight ) {
            updateItem( jobId, {
                height: itemRef.current.offsetHeight,
            } )
            if ( listRef.current ) listRef.current.resetAfterIndex( 0 )
        }
    }, [ jobId, listRef, itemDataState, updateItem ] )

    const handleClick = () => {
        if ( itemDataState[ jobId ]?.isOpen ) {
            handleClose()
        } else {
            handleOpen()
        }
    }

    const handleOpen = () => {
        updateItem( jobId, { isOpen: true } )
    }

    const handleClose = () => {
        updateItem( jobId, { isOpen: false } )
    }

    const stylez = css`
        box-sizing: border-box;
        position: relative;
        padding-left: 30px;
        transition: 0.0s;
        overflow: hidden;
        border-bottom: 2px solid rgba( 0,0,0,0.3 );

        .basic_content {
            position: relative;
            height: 90px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            color: #ceecff;
            background-color: #414248;
            cursor: pointer;

            .basic_content_inner {
                width: 100%;
            }
        }

        .status_indicator {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 30px;
            transition: background-color 300ms;
            border-right: 1px solid black;
        }

        .job_title {
            font-weight: bold;
        }

        .upper_row {
            position: relative;
            box-sizing: content-box;
            font-size: 1.3em;
            padding: 0 132px 0 32px;
            text-align: left;
        }

        .lower_row, .mid_row {
            text-align: left;
            padding: 0 132px 0 32px;
            font-weight: lighter;
            font-size: 0.825em;
        }

        .mid_row {
            margin-bottom: 8px;
        }

        .extra_content {
            border-top: 2px solid rgba( 0,0,0,0.3 );
            padding: 16px 32px;
            box-shadow: inset 0px 1px 3px 0px rgba( 0,0,0,0.3 );
            background: #fff;
            color: #333;
        }

        .progress_overview {
            display: flex;
            align-items: center;
            justify-content: space-around;
            position: absolute;
            right: 0;
            top: 0;
            width: 120px;
            padding-right: 10px;
            padding-left: 2px;
            height: 70px;
            border-left: 1px solid rgba( 0,0,0,0.3 );

            .actions {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 0.9rem;

            th {
                text-align: left;
                border-bottom: 1px solid #ddd;
                padding: 8px;
                color: #666;
            }

            td {
                padding: 8px;
                border-bottom: 1px solid #eee;
            }
        }

        pre {
            background: #f8f8f8;
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 0.85rem;
            border: 1px solid #ddd;
        }
    `

    const renderStatus = () => {
        return (
            <div style={ { backgroundColor: statusConfig[ status ]?.color } } className={ cx( 'status_indicator' ) } />
        )
    }

    return (
        <div key={ itemKey } className={ cx( stylez ) } style={ style }>
            { renderStatus() }
            <div className='content' ref={ itemRef }>
                <div className='basic_content' onClick={ handleClick }>
                    <div className='basic_content_inner'>
                        <div className='upper_row'>
                            <div className='w20pc inline job_title'>{ jobdata?.type }</div>
                            <div className='w40pc inline job_id'>{ jobId }</div>
                            <div className='w20pc inline customer_id'>{ jobdata?.customerId || '-' }</div>
                            <div className='w20pc inline customer_id'>{ jobdata?.mediaContainerId || '-' } | { jobdata?.mediaId || '-' }</div>
                        </div>
                        <div className='mid_row'>
                            <div className='w20pc inline job_type'>{ jobdata?.type !== jobList ? jobList : '' }</div>
                            <div className='w40pc inline' />
                            <div className='w20pc inline worker'>{}</div>
                            <div className='w20pc inline worker'>{ jobdata?.format?.id }</div>
                        </div>
                        <div className='lower_row'>
                            <div className='w20pc inline last_updated'>{ moment( jobdata?.jobUpdated ).format( 'YYYY-MM-DD HH:mm:ss' ) }</div>
                            <div className='w40pc inline prio'>{ opts?.attempts || '-' } | { priority } | { jobdata?.statusText || '-' }</div>
                            <div className='w20pc inline worker'>{ jobdata?.worker }</div>
                            <div className='w20pc inline worker'>{ JSON.stringify( jobdata?.container_name?.find( i => i.title === 'container_name' )?.content ) }</div>
                        </div>
                    </div>
                    <div className='progress_overview' onClick={ e => e.stopPropagation() }>
                        <ProgressIndicatorCircle status={ status } progress={ progress } />
                        <div className='actions'>
                            <JobListItemDeleteJobButton jobList={ jobList } jobId={ jobId } status={ status } />
                            <JobListItemRestartJobButton jobList={ jobList } jobId={ jobId } status={ status } />
                        </div>
                    </div>
                </div>
                <FailedJobMessageBox status={ status } failedReason={ failedReason } />
                {
                    itemDataState[ jobId ]?.isOpen && (
                        <div className='extra_content'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Created</th>
                                        <th>Waited</th>
                                        <th>Processed</th>
                                        <th>Finished</th>
                                        <th>Run</th>
                                        <th>Attempts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{ timestamp && moment( timestamp ).fromNow() }</td>
                                        <td>{ processedOn && timestamp && ( `${ processedOn - timestamp }ms` ) }</td>
                                        <td>{ processedOn && moment( processedOn ).format( 'HH:mm:ss - DD.MM.YY' ) }</td>
                                        <td>{ finishedOn && moment( finishedOn ).format( 'HH:mm:ss - DD.MM.YY' ) }</td>
                                        <td>{ finishedOn && processedOn && ( `${ finishedOn - processedOn }ms` ) }</td>
                                        <td>{ opts?.attempts }</td>
                                    </tr>
                                </tbody>
                            </table>
                            <pre>
                                { JSON.stringify( job, null, 4 ) }
                            </pre>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default React.memo( JobListItem )