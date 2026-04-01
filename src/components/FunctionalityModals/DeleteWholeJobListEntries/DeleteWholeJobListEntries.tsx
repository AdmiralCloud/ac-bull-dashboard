import React, { useState, useContext } from 'react'

import { deleteJob } from '../../../api/calls/deleteJob'
import { DataContext } from '../../../context/DataContextProvider'
import { OptionsContext } from '../../../context/OptionsContextProvider'
import PopUpMessage from '@components/PopUpMessage/PopUpMessage'
import styles from '../ModalForm.module.css'

export interface Props {
    className?: string;
    close: () => void
}

const DeleteWholeJobListEntries: React.FC<Props> = ( { className, close } ) => {
    const { availableJobLists } = useContext( DataContext )
    const { env } = useContext( OptionsContext )
    const [ selectedJobList, setSelectedJobList ] = useState( '' )
    const [ showConfirm, setShowConfirm ] = useState( false )

    const handleChange = ( event: React.ChangeEvent<HTMLSelectElement> ) => {
        setSelectedJobList( event.target.value )
    }

    return (
        <div className={ [ className, styles.form ].filter( Boolean ).join( ' ' ) }>
            <div className={ styles.description }>
                Delete all entries from Joblist:
            </div>
            <div className={ styles.select_wrapper }>
                <label>Job List</label>
                <select value={ selectedJobList } onChange={ handleChange }>
                    <option value='' disabled>Select a Joblist</option>
                    {
                        availableJobLists.map( availableJobList => (
                            <option key={ availableJobList } value={ availableJobList }>{ availableJobList }</option>
                        ) )
                    }
                </select>
            </div>
            <div className={ styles.buttons }>
                <div className={ `${ styles.btn } ${ styles.shallow }` } onClick={ () => close() }>Cancel</div>
                <div className={ styles.btn } onClick={ () => selectedJobList && setShowConfirm( true ) }>Delete</div>
            </div>
            {
                showConfirm && (
                    <PopUpMessage
                      message={ `Are you sure to remove all items from Joblist: "${ selectedJobList }"?` }
                      onCancel={ () => {
                          setShowConfirm( false )
                          close()
                      } }
                      onOk={ () => {
                          deleteJob( env, selectedJobList, '' )
                              .then( () => {
                                  setShowConfirm( false )
                                  close()
                              } )
                      } }
                    />
                )
            }
        </div>
    )
}

export default DeleteWholeJobListEntries
