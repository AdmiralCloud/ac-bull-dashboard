import React, { useState, useRef, useEffect } from 'react'
import { css, cx } from '@emotion/css'

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

    const styles = {
        container: css`
            position: relative;
            width: 260px;
            font-family: inherit;
        `,
        label: css`
            display: block;
            font-size: 0.75rem;
            color: #666;
            margin-bottom: 4px;
        `,
        selectBox: css`
            background: #fff;
            border-bottom: 1px solid #949494;
            padding: 6px 0;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 24px;
            font-size: 1rem;

            &:hover {
                border-bottom-color: #000;
            }
        `,
        valueText: css`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 20px;
        `,
        arrow: css`
            border: solid #666;
            border-width: 0 2px 2px 0;
            display: inline-block;
            padding: 3px;
            transform: ${ isOpen ? 'rotate(-135deg)' : 'rotate(45deg)' };
            margin-top: ${ isOpen ? '4px' : '-2px' };
            transition: transform 0.2s;
        `,
        dropdown: css`
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-height: 300px;
            overflow-y: auto;
            margin-top: 4px;
            border-radius: 4px;
        `,
        option: css`
            padding: 10px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 0.9rem;

            &:hover {
                background: #f5f5f5;
            }

            &.selected {
                background: #e3f2fd;
                color: #1976d2;
                font-weight: bold;
            }
        `,
        checkbox: css`
            margin-right: 12px;
        `,
    }

    const displayText = value.length > 0 ? value.join( ', ' ) : ''

    return (
        <div ref={ containerRef } className={ cx( styles.container, className ) }>
            <div className={ styles.label }>{ label }</div>
            <div className={ styles.selectBox } onClick={ toggleOpen }>
                <div className={ styles.valueText }>{ displayText }</div>
                <div className={ styles.arrow } />
            </div>
            {
                isOpen && (
                    <div className={ styles.dropdown }>
                        {
                            options.map( opt => (
                                <div
                                  key={ opt.value }
                                  className={ cx( styles.option, { selected: value.includes( opt.value ) } ) }
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
