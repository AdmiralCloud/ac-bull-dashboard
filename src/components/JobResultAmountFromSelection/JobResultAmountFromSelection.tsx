import React, { useContext } from 'react'

import { DataContext } from '../../context/DataContextProvider'
import styles from './JobResultAmountFromSelection.module.css'

export interface Props {
    className?: string;
}

const JobResultAmountFromSelection: React.FC<Props> = ( { className } ) => {
    const { shownData } = useContext( DataContext )

    return (
        <div className={ [ className, styles.wrapper ].filter( Boolean ).join( ' ' ) }>
            Results: { shownData.length }
        </div>
    )
}

export default JobResultAmountFromSelection
