import React, { useContext } from 'react'

import { OptionsContext } from '../../context/OptionsContextProvider'
import { restartJob } from '../../api/calls/restartJob'
import styles from './JobListItemRestartJobButton.module.css'

export interface Props {
    className?: string;
    jobList: string
    jobId: string
    status: AllowedStatiTypes
}

const JobListItemRestartJobButton: React.FC<Props> = ( { className, jobList, jobId, status } ) => {
    const { env } = useContext( OptionsContext )

    const handleRestart = () => {
        if ( status === 'failed' ) restartJob( env, jobList, jobId )
    }

    return (
        <div
          className={ [ className, styles.button, status !== 'failed' && styles.disabled ].filter( Boolean ).join( ' ' ) }
          onClick={ handleRestart }
        >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M23 4v6h-6' />
                <path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
            </svg>
        </div>
    )
}

export default JobListItemRestartJobButton
