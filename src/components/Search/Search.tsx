import React, { useContext } from 'react'
import { css, cx } from '@emotion/css'

import { FilterContext } from '../../context/FilterContextProvider'

export interface Props {
    className?: string;
}

const Search: React.FC<Props> = ( { className } ) => {
    const { setFilter } = useContext( FilterContext )

    const handleSearch = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const currentValue = e.target.value
        setFilter( { search: currentValue } )
    }

    const stylez = css`
        position: relative;
        display: flex;
        align-items: flex-end;
        gap: 8px;
        width: 260px;
        padding-top: 20px;
        padding-bottom: 6px;
        border-bottom: 1px solid #949494;
        margin-right: 16px;

        &:hover {
            border-bottom-color: #000;
        }

        input {
            border: none;
            outline: none;
            font-size: 1rem;
            width: 100%;
            padding: 0;
            font-family: inherit;

            &::placeholder {
                color: #aaa;
            }
        }

        .label {
            position: absolute;
            transform: translateY(-20px);
            font-size: 0.75rem;
            color: #666;
        }

        .icon {
            color: #666;
            display: flex;
            align-items: center;
        }
    `

    return (
        <div className={ cx( className, stylez ) }>
            <div className='label'>Search</div>
            <div className='icon'>
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