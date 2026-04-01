import React, { useState, useEffect, useContext } from 'react'
import { css, cx } from '@emotion/css'

import { DataContext } from '../../context/DataContextProvider'

export interface Props {
    className?: string;
}

const JobResultAmountFromSelection: React.FC<Props> = ( { className } ) => {
    const { shownData } = useContext( DataContext )

    const stylez = css`

        margin: 8px 0 4px;

    `

    return (
        <div className={ cx( className, stylez ) }>
            Results: { shownData.length }
        </div>
    )
}

export default JobResultAmountFromSelection
