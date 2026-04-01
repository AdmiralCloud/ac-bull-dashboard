import React, { useState, useRef, useEffect } from 'react'

import styles from './MultiSelect.module.css'

export interface MultiSelectProps {
    label: string;
    options: { label: string; value: string; count?: number }[];
    value: string[];
    onChange: ( value: string[] ) => void;
    className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ( { label, options, value, onChange, className } ) => {
    const [ isOpen, setIsOpen ] = useState( false )
    const containerRef = useRef<HTMLDivElement>( null )

    const toggleOpen = () => setIsOpen( !isOpen )

    const handleOptionClick = ( optionValue: string ) => {
        const newValue = value.includes( optionValue )
            ? value.filter( v => v !== optionValue )
            : [ ...value, optionValue ]
        onChange( newValue )
    }

    useEffect( () => {
        const handleClickOutside = ( event: MouseEvent ) => {
            if ( containerRef.current && !containerRef.current.contains( event.target as Node ) ) {
                setIsOpen( false )
            }
        }
        document.addEventListener( 'mousedown', handleClickOutside )
        return () => document.removeEventListener( 'mousedown', handleClickOutside )
    }, [] )

    const displayText = value.length > 0 ? value.join( ', ' ) : ''

    return (
        <div ref={ containerRef } className={ [ styles.container, className ].filter( Boolean ).join( ' ' ) }>
            <div className={ styles.label }>{ label }</div>
            <div className={ styles.select_box } onClick={ toggleOpen }>
                <div className={ styles.value_text }>{ displayText }</div>
                <div className={ [ styles.arrow, isOpen && styles.arrow_open ].filter( Boolean ).join( ' ' ) } />
            </div>
            {
                isOpen && (
                    <div className={ styles.dropdown }>
                        {
                            options.map( opt => (
                                <div
                                  key={ opt.value }
                                  className={ [ styles.option, value.includes( opt.value ) && styles.selected ].filter( Boolean ).join( ' ' ) }
                                  onClick={ () => handleOptionClick( opt.value ) }
                                >
                                    <input
                                      type='checkbox'
                                      className={ styles.checkbox }
                                      checked={ value.includes( opt.value ) }
                                      readOnly
                                    />
                                    <span>{ opt.label } { opt.count !== undefined && `(${ opt.count })` }</span>
                                </div>
                            ) )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default MultiSelect
