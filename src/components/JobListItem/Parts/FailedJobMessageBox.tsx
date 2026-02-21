import React from 'react'
import { css, cx } from '@emotion/css'

import { colors } from '../../../../config/colors'

export interface Props {
    className?: string;
    status: AllowedStatiTypes
    failedReason: string
}

const FailedJobMessageBox: React.FC<Props> = ( { className, failedReason, status } ) => {
    const stylez = css`
        background-color: ${ colors.warning };
        color: ${ colors.basicBackground };
        padding: 8px 132px 8px 32px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .reason {
            display: inline-block;
            padding-left: 8px;
        }
    `

    return (
        status === 'failed' && failedReason ? (
            <div className={ cx( className, stylez ) }>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
                    <line x1='12' y1='9' x2='12' y2='13' />
                    <line x1='12' y1='17' x2='12.01' y2='17' />
                </svg>
                <div className='reason'>{ failedReason }</div>
            </div>
        ) : null
    )
}

export default FailedJobMessageBox