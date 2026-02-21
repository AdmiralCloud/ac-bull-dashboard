import React, { useContext } from 'react'
import { css, cx } from '@emotion/css'

import { OptionsContext } from '../../context/OptionsContextProvider'

import { restartJob } from '../../api/calls/restartJob'

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

    const stylez = css`
        cursor: pointer;
        width: 28px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;

        &.disabled {
            cursor: not-allowed;
            color: rgba( 255,255,255,0.2 );
        }
    `

    return (
        <div className={ cx( className, stylez, status !== 'failed' && 'disabled' ) } onClick={ handleRestart }>
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M23 4v6h-6' />
                <path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
            </svg>
        </div>
    )
}

export default JobListItemRestartJobButton