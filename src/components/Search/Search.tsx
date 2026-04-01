import React, { useContext } from 'react'

import { FilterContext } from '../../context/FilterContextProvider'
import styles from './Search.module.css'

export interface Props {
    className?: string;
}

const Search: React.FC<Props> = ( { className } ) => {
    const { setFilter } = useContext( FilterContext )

    const handleSearch = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const currentValue = e.target.value
        setFilter( { search: currentValue } )
    }

    return (
        <div className={ [ className, styles.search ].filter( Boolean ).join( ' ' ) }>
            <div className={ styles.label }>Search</div>
            <div className={ styles.icon }>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='11' cy='11' r='8' />
                    <line x1='21' y1='21' x2='16.65' y2='16.65' />
                </svg>
            </div>
            <input
              type='text'
              placeholder='c147'
              onChange={ handleSearch }
            />
        </div>
    )
}

export default Search
