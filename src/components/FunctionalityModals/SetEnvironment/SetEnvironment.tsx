import React, { useState, useContext } from 'react'

import { OptionsContext } from '../../../context/OptionsContextProvider'
import styles from '../ModalForm.module.css'

export interface Props {
    className?: string;
    close: () => void
}

const SetEnvironment: React.FC<Props> = ( { className, close } ) => {
    const { env, setEnv } = useContext( OptionsContext )
    const [ selectedEnv, setSelectedEnv ] = useState( env )

    const handleChange = ( event: React.ChangeEvent<HTMLSelectElement> ) => {
        setSelectedEnv( event.target.value as 'live' | 'dev' )
    }

    const handleConfirm = () => {
        setEnv( selectedEnv )
        close()
    }

    return (
        <div className={ [ className, styles.form ].filter( Boolean ).join( ' ' ) }>
            <div className={ styles.description }>
                Set Environment to:
            </div>
            <div className={ styles.select_wrapper }>
                <label>Environment</label>
                <select value={ selectedEnv } onChange={ handleChange }>
                    <option value='dev'>dev</option>
                    <option value='live'>live</option>
                </select>
            </div>
            <div className={ styles.buttons }>
                <div className={ `${ styles.btn } ${ styles.shallow }` } onClick={ () => close() }>Cancel</div>
                <div className={ styles.btn } onClick={ handleConfirm }>Ok</div>
            </div>
        </div>
    )
}

export default SetEnvironment
