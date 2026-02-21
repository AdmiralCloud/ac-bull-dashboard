import React, { useState, useEffect, useContext } from 'react'
import { css, cx, injectGlobal } from '@emotion/css'
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

// @ts-ignore
import * as nunitoLight from '../assets/fonts/NunitoSans-Light.ttf'
// @ts-ignore
import * as nunitoRegular from '../assets/fonts/NunitoSans-Regular.ttf'
// @ts-ignore
import * as nunitoBold from '../assets/fonts/NunitoSans-Bold.ttf'

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

    injectGlobal`

    @font-face{
        font-family: NunitoSans;
        src: url(${ nunitoRegular.default });
    }
    @font-face {
        font-family: NunitoSans;
        src: url(${ nunitoBold.default });
        font-weight: bold;
    }
    @font-face {
        font-family: NunitoSans;
        src: url(${ nunitoLight.default });
        font-weight: 100;
    }

    html, body {
        font-family: NunitoSans, Arial, Helvetica, sans-serif !important;
        font-size: 14px;
    }

`

    const stylez = css`

        /* font-family: Avenir, Arial, Helvetica, sans-serif; */
        margin: 0 auto;
        max-width: 1400px;
        /* display: flex;
        flex-direction: column; */
        height: 100%;

        .menu_content {
            height: 114px;
            padding: 8px 0;
            box-sizing: border-box;
        }

        .joblist_content {
            height: calc( 100% - 114px );
            position: relative;
        }

        .split_content {
            display: flex;
            justify-content: space-between;
        }

        .filter {
            display: flex;
            margin-bottom: 16px;

            > div {
                margin-right: 32px;
            }
        }

    `

    return (
        <div className={ cx( className, stylez ) }>
            {
                authorized && (
                    <DataContextProvider>
                        <FilterContextProvider>
                            <div className='menu_content'>
                                <div className='split_content'>
                                    <div className='filter'>
                                        <JobListSelectionsJobList />
                                        <JobListSelectionsJobStatus />
                                    </div>
                                    <div className='search'>
                                        <Search />
                                    </div>
                                </div>
                                <div className='split_content'>
                                    <JobResultAmountFromSelection />
                                    <ShowSpecialFunctions />
                                </div>
                            </div>
                            <div className='joblist_content'>
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
