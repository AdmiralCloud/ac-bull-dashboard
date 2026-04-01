import React, { useState, useContext } from 'react'

import { OptionsContext } from '../../context/OptionsContextProvider'
import { deleteJob } from '../../api/calls/deleteJob'
import { colors } from '../../../config/colors'

import PopUp from '@components/PopUpMessage/PopUpMessage'
import styles from './JobListItemDeleteJobButton.module.css'

export interface Props {
    className?: string;
    status: AllowedStatiTypes
    jobId: string
    jobList: string
}

const JobListItemDeleteJobButton: React.FC<Props> = ( { className, status, jobId, jobList } ) => {
    const [ deletionPending, setDeletionPending ] = useState( false )
    const [ deletionError, setDeletionError ] = useState( false )
    const { env } = useContext( OptionsContext )
    const [ showPop, setShowPop ] = useState( false )

    const handleConfirmDeletion = () => {
        setDeletionPending( true )
        deleteJob( env, jobList, jobId )
            .then( () => { } )
            .catch( () => setDeletionError( true ) )
        if ( showPop ) setShowPop( false )
    }

    const handleClick = () => {
        if ( status !== 'active' ) {
            handleConfirmDeletion()
        } else {
            setShowPop( true )
        }
    }

    return (
        <div
          style={ {
              backgroundColor: deletionError
                  ? colors.warning : deletionPending
                      ? colors.pending : colors.warning,
          } }
          className={ [ className, styles.button ].filter( Boolean ).join( ' ' ) }
          onClick={ handleClick }
        >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
            {
                showPop && (
                    <PopUp
                      onOk={ handleConfirmDeletion }
                      onCancel={ () => {
                          setShowPop( false )
                      } }
                      message='Are you sure?'
                    />
                )
            }
        </div>
    )
}

export default JobListItemDeleteJobButton
