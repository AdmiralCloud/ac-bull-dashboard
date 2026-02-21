import React, { useState } from 'react'
import { autoDecideEnv } from '@root/api/helper/autoDecideEnv'

export interface Props {
    className?: string;
    children
}

export const OptionsContext = React.createContext( {
    env: autoDecideEnv() as ( 'dev' | 'live' ),
    setEnv: ( () => null ) as React.Dispatch<React.SetStateAction<string>>,
    refreshInterval: 30000 as number,
    setRefreshInterval: ( () => null ) as React.Dispatch<React.SetStateAction<number>>,
} )

const OptionsContextProvider: React.FC<Props> = ( { children } ) => {
    const [ env, setEnv ] = useState( autoDecideEnv() as 'dev' | 'live' )
    const [ refreshInterval, setRefreshInterval ] = useState( 30000 )

    return (
        <OptionsContext.Provider value={ {
            env,
            setEnv,
            refreshInterval,
            setRefreshInterval,
        } }
        >
            { children }
        </OptionsContext.Provider>
    )
}

export default OptionsContextProvider
