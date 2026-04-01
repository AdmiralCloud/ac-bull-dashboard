import React, { useState, useContext } from 'react'

import { OptionsContext } from '../../../context/OptionsContextProvider'
import { refreshRates } from '../../../../config/refreshRates'
import styles from '../ModalForm.module.css'

export interface Props {
    className?: string;
    close: () => void
}

const SetRefreshRate: React.FC<Props> = ( { className, close } ) => {
    const { refreshInterval, setRefreshInterval } = useContext( OptionsContext )
    const [ selectedRefreshRate, setSelectedRefreshRate ] = useState( refreshInterval )

    const handleChange = ( event: React.ChangeEvent<HTMLSelectElement> ) => {
        setSelectedRefreshRate( parseInt( event.target.value ) )
    }

    const handleConfirm = () => {
        setRefreshInterval( selectedRefreshRate )
        close()
    }

    return (
        <div className={ [ className, styles.form ].filter( Boolean ).join( ' ' ) }>
            <div className={ styles.description }>
                Refresh list every:
            </div>
            <div className={ styles.select_wrapper }>
                <label>Refresh Rate</label>
                <select value={ selectedRefreshRate } onChange={ handleChange }>
                    {
                        refreshRates.map( refreshRate => (
                            <option key={ refreshRate } value={ refreshRate }>{ refreshRate / 1000 } seconds</option>
                        ) )
                    }
                </select>
            </div>
            <div className={ styles.buttons }>
                <div className={ `${ styles.btn } ${ styles.shallow }` } onClick={ () => close() }>Cancel</div>
                <div className={ styles.btn } onClick={ handleConfirm }>Ok</div>
            </div>
        </div>
    )
}

export default SetRefreshRate
