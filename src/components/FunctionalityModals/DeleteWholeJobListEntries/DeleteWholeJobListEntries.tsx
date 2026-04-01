import React, { useState, useContext } from 'react'
import { css, cx } from '@emotion/css'

import { deleteJob } from '../../../api/calls/deleteJob'
import { DataContext } from '../../../context/DataContextProvider'
import { OptionsContext } from '../../../context/OptionsContextProvider'
import PopUpMessage from '@components/PopUpMessage/PopUpMessage'

export interface Props {
    className?: string;
    close: () => void
}

const DeleteWholeJobListEntries: React.FC<Props> = ( { className, close } ) => {
    const { availableJobLists } = useContext( DataContext )
    const { env } = useContext( OptionsContext )
    const [ selectedJobList, setSelectedJobList ] = useState( '' )
    const [ showConfirm, setShowConfirm ] = useState( false )

    const stylez = css`
        background: white;
        padding: 16px 32px;
        text-align: center;
        border-radius: 4px;

        .description {
            margin-bottom: 16px;
            font-size: 1rem;
        }

        .select_wrapper {
            margin-bottom: 24px;
            text-align: left;
        }

        label {
            display: block;
            font-size: 0.75rem;
            color: #666;
            margin-bottom: 4px;
        }

        select {
            width: 100%;
            min-width: 260px;
            padding: 8px 0;
            border: none;
            border-bottom: 1px solid #949494;
            font-size: 1rem;
            background: transparent;
            outline: none;
            cursor: pointer;

            &:hover {
                border-bottom-color: #000;
            }
        }

        .buttons {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 24px;
        }

        .btn {
            padding: 8px 24px;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
            background: #2196f3;
            color: white;
            transition: opacity 0.2s;

            &:hover {
                opacity: 0.8;
            }

            &.shallow {
                background: transparent;
                border: 1px solid #2196f3;
                color: #2196f3;
            }
        }
    `

    const handleChange = ( event: React.ChangeEvent<HTMLSelectElement> ) => {
        setSelectedJobList( event.target.value )
    }

    return (
        <div className={ cx( className, stylez ) }>
            <div className='description'>
                Delete all entries from Joblist:
            </div>
            <div className='select_wrapper'>
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
            <div className='buttons'>
                <div className='btn shallow' onClick={ () => close() }>Cancel</div>
                <div className='btn' onClick={ () => selectedJobList && setShowConfirm( true ) }>Delete</div>
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