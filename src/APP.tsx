import React, { useState, useEffect, useContext } from 'react'
import { authStore } from 'ac-app-authenticator'

import { simulateJob } from './api/calls/simulateJob'

import JobList from './components/JobList/JobList'
import DataContextProvider from './context/DataContextProvider'
import { OptionsContext } from './context/OptionsContextProvider'
import FilterContextProvider from './context/FilterContextProvider'
import JobListRequester from './components/JobListRequester/JobListRequester'
import JobListSelectionsJobList from './components/JobListSelections/JobListSelectionsJobList/JobListSelectionsJobList'
import JobListSelectionsJobStatus from './components/JobListSelections/JobListSelectionsJobStatus/JobListSelectionsJobStatus'
import JobResultAmountFromSelection from './components/JobResultAmountFromSelection/JobResultAmountFromSelection'
import ShowSpecialFunctions from './components/ShowSpecialFunctions/ShowSpecialFunctions'
import Search from './components/Search/Search'

import styles from './APP.module.css'

export interface Props {
    className?: string;
}

const App: React.FC<Props> = ( { className } ) => {
    const { env } = useContext( OptionsContext )
    const [ authorized, setAuthorized ] = useState( false )

    useEffect( () => {
        authStore.init( {
            env: env,
            clientId: '7519d0b9-4400-47ec-bd2b-1edfe4414d0a',
            onLoggedIn: () => setAuthorized( true ),
        } )
        authStore.authorize()
    }, [ env ] )

    return (
        <div className={ [ className, styles.app ].filter( Boolean ).join( ' ' ) }>
            {
                authorized && (
                    <DataContextProvider>
                        <FilterContextProvider>
                            <div className={ styles.menu_content }>
                                <div className={ styles.split_content }>
                                    <div className={ styles.filter }>
                                        <JobListSelectionsJobList />
                                        <JobListSelectionsJobStatus />
                                    </div>
                                    <div>
                                        <Search />
                                    </div>
                                </div>
                                <div className={ styles.split_content }>
                                    <JobResultAmountFromSelection />
                                    <ShowSpecialFunctions />
                                </div>
                            </div>
                            <div className={ styles.joblist_content }>
                                <JobList />
                            </div>
                            <JobListRequester />
                        </FilterContextProvider>
                    </DataContextProvider>
                )
            }
        </div>
    )
}

export default App
