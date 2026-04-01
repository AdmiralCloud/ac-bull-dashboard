import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import styles from './Modal.module.css'

export interface Props {
    className?: string;
    escapeable?: boolean;
    children?: React.ReactNode;
}

const Modal: React.FC<Props> = ( { className, children } ) => {
    const [ isVisible, setIsVisible ] = useState( false )

    useEffect( () => {
        setIsVisible( true )
        return () => setIsVisible( false )
    }, [] )

    const root = document.getElementById( 'root' )
    if ( !root ) return null

    return ReactDOM.createPortal( (
        <div
          onClick={ e => e.stopPropagation() }
          className={ [ className, styles.modal ].filter( Boolean ).join( ' ' ) }
          style={ { opacity: isVisible ? 1 : 0 } }
        >
            { children }
        </div>
    ), root )
}

export default Modal
