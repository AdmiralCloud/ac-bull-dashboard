import React, { useState, useEffect, useRef, useCallback } from 'react'
import { css, cx } from '@emotion/css'

export interface Props {
    className?: string;
    r: number
    color?: string
    width?: number
    value: number
    maxValue?: number
    showValue?: boolean
    circleColor?: string
    animationDuration?: number
}

const IndicatorCircle: React.FC<Props> = ( {
    className,
    r,
    color = 'black',
    width = 5,
    value,
    maxValue = 100,
    animationDuration = 300,
    showValue = true,
    circleColor = 'grey',
} ) => {
    const animatedCircleRef = useRef( null )
    const [ dashArray, setDashArray ] = useState( 2 * Math.PI * ( r - width ) )

    const calculateDashOffset = useCallback( () => {
        if ( value >= maxValue ) return 0

        return dashArray - ( value / maxValue ) * dashArray
    }, [ dashArray, maxValue, value ] )

    useEffect( () => {
        setDashArray( 2 * Math.PI * ( r - width ) )
    }, [ width, r ] )

    useEffect( () => {
        if ( animatedCircleRef.current ) {
            animatedCircleRef.current.style.strokeDashoffset = `${ calculateDashOffset() }`
        }
    }, [ calculateDashOffset ] )

    const stylez = css`

        .circle {
            transition: all ${ animationDuration }ms, stroke 300ms;
            fill: transparent;
            transform: rotate(-90deg);
            transform-origin: center;
            stroke: ${ circleColor };
        }

    `

    const circleInlineStyles = {
        strokeDasharray: `${ dashArray }`,
        strokeDashoffset: `${ dashArray }`,
        stroke: color,
        strokeWidth: width,
    }

    const renderText = () => {
        return <text textAnchor='middle' dominantBaseline='central' x={ r } y={ r } fill={ color }>{ value }</text>
    }

    return (
        <div className={ cx( className, stylez ) }>
            <svg height={ r * 2 } width={ r * 2 }>
                <circle strokeWidth={ width } className='circle' cx={ r } cy={ r } r={ r - width } />
                <circle ref={ animatedCircleRef } style={ circleInlineStyles } className='circle' cx={ r } cy={ r } r={ r - width } />
                {showValue && renderText()}
            </svg>
        </div>
    )
}

export default IndicatorCircle
