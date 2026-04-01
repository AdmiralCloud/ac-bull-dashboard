import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { css, cx } from '@emotion/css'

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
        z-index: 3000;
        opacity: ${ isVisible ? 1 : 0 };
        transition: opacity 0.3s ease;

        .message_box {
            position: relative;
            max-width: 70%;
            width: 500px;
            min-height: 120px;
            background-color: white;
            padding: 16px;
            padding-bottom: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .buttons {
            left: 0;
            height: 70px;
            box-sizing: border-box;
            padding: 16px;
            position: absolute;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 16px;
        }

        .btn {
            min-width: 100px;
            text-align: center;
            padding: 8px 24px;
            background: #2196f3;
            color: white;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
            transition: opacity 0.2s;

            &:hover {
                opacity: 0.8;
            }
        }

        .cancel {
            background-color: transparent;
            color: #2196f3;
            border: 1px solid #2196f3;
        }
    `

    const root = document.getElementById( 'root' )
    if ( !root ) return null

    return ReactDOM.createPortal( (
        <div onClick={ e => e.stopPropagation() } className={ cx( className, stylez ) }>
            <div className='message_box'>
                { message }
                {
                    ( onCancel || onOk ) && (
                        <div className='buttons'>
                            { onCancel && <div className='btn cancel' onClick={ handleCancel }>Cancel</div> }
                            { onOk && <div className='btn ok' onClick={ handleOk }>Ok</div> }
                        </div>
                    )
                }
            </div>
        </div>
    ), root )
}

export default PopUp