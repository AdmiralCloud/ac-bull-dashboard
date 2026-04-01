import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import styles from './PopUpMessage.module.css'

export interface Props {
    className?: string;
    onOk?: () => void
    onCancel?: () => void
    message: string | React.ReactNode
}

const PopUp: React.FC<Props> = ( {
    className,
    message,
    onOk,
    onCancel,
} ) => {
    const [ isVisible, setIsVisible ] = useState( false )

    useEffect( () => {
        setIsVisible( true )
        return () => setIsVisible( false )
    }, [] )

    const handleCancel = () => {
        if ( onCancel ) onCancel()
    }

    const handleOk = () => {
        if ( onOk ) onOk()
    }

    const root = document.getElementById( 'root' )
    if ( !root ) return null

    return ReactDOM.createPortal( (
        <div
          onClick={ e => e.stopPropagation() }
          className={ [ className, styles.popup ].filter( Boolean ).join( ' ' ) }
          style={ { opacity: isVisible ? 1 : 0 } }
        >
            <div className={ styles.message_box }>
                { message }
                {
                    ( onCancel || onOk ) && (
                        <div className={ styles.buttons }>
                            { onCancel && <div className={ `${ styles.btn } ${ styles.cancel }` } onClick={ handleCancel }>Cancel</div> }
                            { onOk && <div className={ styles.btn } onClick={ handleOk }>Ok</div> }
                        </div>
                    )
                }
            </div>
        </div>
    ), root )
}

export default PopUp
