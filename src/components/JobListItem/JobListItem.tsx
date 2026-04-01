import React, { useState, useEffect, useContext, useRef } from 'react'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import { statusConfig } from '../../../config/statusConfig'

import JobListItemDeleteJobButton from '../JobListItemDeleteJobButton/JobListItemDeleteJobButton'
import JobListItemRestartJobButton from '../JobListItemRestartJobButton/JobListItemRestartJobButton'
import ProgressIndicatorCircle from './Parts/ProgressIndicatorCircle'

import FailedJobMessageBox from './Parts/FailedJobMessageBox'

import { DataContext } from '../../context/DataContextProvider'
import { DataHeightsContext } from '../JobList/JobList'

import styles from './JobListItem.module.css'

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

    const renderStatus = () => {
        return (
            <div style={ { backgroundColor: statusConfig[ status ]?.color } } className={ styles.status_indicator } />
        )
    }

    return (
        <div key={ itemKey } className={ styles.item } style={ style }>
            { renderStatus() }
            <div className='content' ref={ itemRef }>
                <div className={ styles.basic_content } onClick={ handleClick }>
                    <div className={ styles.basic_content_inner }>
                        <div className={ styles.upper_row }>
                            <div className={ `w20pc inline ${ styles.job_title }` }>{ jobdata?.type }</div>
                            <div className='w40pc inline job_id'>{ jobId }</div>
                            <div className='w20pc inline customer_id'>{ jobdata?.customerId || '-' }</div>
                            <div className='w20pc inline customer_id'>{ jobdata?.mediaContainerId || '-' } | { jobdata?.mediaId || '-' }</div>
                        </div>
                        <div className={ styles.mid_row }>
                            <div className='w20pc inline job_type'>{ jobdata?.type !== jobList ? jobList : '' }</div>
                            <div className='w40pc inline' />
                            <div className='w20pc inline worker'>{}</div>
                            <div className='w20pc inline worker'>{ jobdata?.format?.id }</div>
                        </div>
                        <div className={ styles.lower_row }>
                            <div className='w20pc inline last_updated'>{ moment( jobdata?.jobUpdated ).format( 'YYYY-MM-DD HH:mm:ss' ) }</div>
                            <div className='w40pc inline prio'>{ opts?.attempts || '-' } | { priority } | { jobdata?.statusText || '-' }</div>
                            <div className='w20pc inline worker'>{ jobdata?.worker }</div>
                            <div className='w20pc inline worker'>{ JSON.stringify( jobdata?.container_name?.find( i => i.title === 'container_name' )?.content ) }</div>
                        </div>
                    </div>
                    <div className={ styles.progress_overview } onClick={ e => e.stopPropagation() }>
                        <ProgressIndicatorCircle status={ status } progress={ progress } />
                        <div className={ styles.actions }>
                            <JobListItemDeleteJobButton jobList={ jobList } jobId={ jobId } status={ status } />
                            <JobListItemRestartJobButton jobList={ jobList } jobId={ jobId } status={ status } />
                        </div>
                    </div>
                </div>
                <FailedJobMessageBox status={ status } failedReason={ failedReason } />
                {
                    itemDataState[ jobId ]?.isOpen && (
                        <div className={ styles.extra_content }>
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
