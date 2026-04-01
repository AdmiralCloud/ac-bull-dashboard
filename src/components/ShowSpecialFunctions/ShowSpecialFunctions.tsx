import React, { useState, useRef, useEffect, useContext } from 'react'

import { autoDecideEnv } from '../../api/helper/autoDecideEnv'

import DeleteWholeJobListEntries from '@components/FunctionalityModals/DeleteWholeJobListEntries/DeleteWholeJobListEntries'
import SetRefreshRate from '@components/FunctionalityModals/SetRefreshRate/SetRefreshRate'
import SetEnvironment from '@components/FunctionalityModals/SetEnvironment/SetEnvironment'

import PopUpMessage from '@components/PopUpMessage/PopUpMessage'
import { OptionsContext } from '@root/context/OptionsContextProvider'
import { simulateJob } from '@root/api/calls/simulateJob'

import styles from './ShowSpecialFunctions.module.css'

export interface Props {
    className?: string;
}

const ShowSpecialFunctions: React.FC<Props> = ( { className } ) => {
    const [ isOpen, setIsOpen ] = useState( false )
    const [ showOption, setShowOption ] = useState( '' )
    const { env } = useContext( OptionsContext )
    const containerRef = useRef<HTMLDivElement>( null )

    const toggleOpen = () => setIsOpen( !isOpen )

    useEffect( () => {
        const handleClickOutside = ( event: MouseEvent ) => {
            if ( containerRef.current && !containerRef.current.contains( event.target as Node ) ) {
                setIsOpen( false )
            }
        }
        document.addEventListener( 'mousedown', handleClickOutside )
        return () => document.removeEventListener( 'mousedown', handleClickOutside )
    }, [] )

    return (
        <div ref={ containerRef } className={ [ className, styles.container ].filter( Boolean ).join( ' ' ) }>
            <button className={ styles.button } onClick={ toggleOpen }>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='12' cy='12' r='3' />
                    <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' />
                </svg>
            </button>
            {
                isOpen && (
                    <div className={ styles.dropdown }>
                        <button
                          className={ styles.menu_item }
                          onClick={ () => {
                              setIsOpen( false )
                              setShowOption( 'deleteJobList' )
                          } }
                        >
                            Remove Joblist Entries
                        </button>
                        <button
                          className={ styles.menu_item }
                          onClick={ () => {
                              setIsOpen( false )
                              setShowOption( 'setRefreshRate' )
                          } }
                        >
                            Set Refresh Rate
                        </button>
                        {
                            autoDecideEnv() === 'dev' && (
                                <button
                                  className={ styles.menu_item }
                                  onClick={ () => {
                                      setIsOpen( false )
                                      setShowOption( 'selectEnv' )
                                  } }
                                >
                                    Select Env
                                </button>
                            )
                        }
                        {
                            autoDecideEnv() === 'dev' && (
                                <button
                                  className={ styles.menu_item }
                                  onClick={ () => {
                                      simulateJob( env )
                                      setIsOpen( false )
                                  } }
                                >
                                    Simulate Job
                                </button>
                            )
                        }
                    </div>
                )
            }
            {
                showOption === 'deleteJobList' && (
                    <PopUpMessage
                      message={ <DeleteWholeJobListEntries close={ () => setShowOption( '' ) } /> }
                    />
                )
            }
            {
                showOption === 'setRefreshRate' && (
                    <PopUpMessage
                      message={ <SetRefreshRate close={ () => setShowOption( '' ) } /> }
                    />
                )
            }
            {
                showOption === 'selectEnv' && (
                    <PopUpMessage
                      message={ <SetEnvironment close={ () => setShowOption( '' ) } /> }
                    />
                )
            }
        </div>
    )
}

export default ShowSpecialFunctions
