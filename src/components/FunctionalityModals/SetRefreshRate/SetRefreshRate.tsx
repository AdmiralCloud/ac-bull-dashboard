import React, { useState, useContext } from 'react'
import { css, cx } from '@emotion/css'

import { OptionsContext } from '../../../context/OptionsContextProvider'
import { refreshRates } from '../../../../config/refreshRates'

export interface Props {
    className?: string;
    close: () => void
}

const SetRefreshRate: React.FC<Props> = ( { className, close } ) => {
    const { refreshInterval, setRefreshInterval } = useContext( OptionsContext )
    const [ selectedRefreshRate, setSelectedRefreshRate ] = useState( refreshInterval )

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
        setSelectedRefreshRate( parseInt( event.target.value ) )
    }

    const handleConfirm = () => {
        setRefreshInterval( selectedRefreshRate )
        close()
    }

    return (
        <div className={ cx( className, stylez ) }>
            <div className='description'>
                Refresh list every:
            </div>
            <div className='select_wrapper'>
                <label>Refresh Rate</label>
                <select value={ selectedRefreshRate } onChange={ handleChange }>
                    {
                        refreshRates.map( refreshRate => (
                            <option key={ refreshRate } value={ refreshRate }>{ refreshRate / 1000 } seconds</option>
                        ) )
                    }
                </select>
            </div>
            <div className='buttons'>
                <div className='btn shallow' onClick={ () => close() }>Cancel</div>
                <div className='btn' onClick={ handleConfirm }>Ok</div>
            </div>
        </div>
    )
}

export default SetRefreshRate