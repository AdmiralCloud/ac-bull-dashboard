import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { css, cx } from '@emotion/css'

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

    const stylez = css`
        top: 0;
        left: 0;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba( 0, 0, 0, 0.6 );
        z-index: 2000;
        opacity: ${ isVisible ? 1 : 0 };
        transition: opacity 0.3s ease;
    `

    const root = document.getElementById( 'root' )
    if ( !root ) return null

    return ReactDOM.createPortal( (
        <div onClick={ e => e.stopPropagation() } className={ cx( className, stylez ) }>
            { children }
        </div>
    ), root )
}

export default Modal