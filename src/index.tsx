import React from 'react'
import { createRoot } from 'react-dom/client'

import OptionsContextProvider from './context/OptionsContextProvider'

import App from './APP'
import './AppBaseStyles.css'

const container = document.getElementById( 'root' )
if ( container ) {
    const root = createRoot( container )
    root.render( <OptionsContextProvider><App /></OptionsContextProvider> )
}