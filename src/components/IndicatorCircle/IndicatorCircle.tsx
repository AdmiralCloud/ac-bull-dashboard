import React, { useState, useEffect, useRef, useCallback } from 'react'

import styles from './IndicatorCircle.module.css'

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
        <div
          className={ [ className, styles.wrapper ].filter( Boolean ).join( ' ' ) }
          style={ { '--animation-duration': `${ animationDuration }ms`, '--circle-color': circleColor } as React.CSSProperties }
        >
            <svg height={ r * 2 } width={ r * 2 }>
                <circle strokeWidth={ width } className={ styles.circle } cx={ r } cy={ r } r={ r - width } />
                <circle ref={ animatedCircleRef } style={ circleInlineStyles } className={ styles.circle } cx={ r } cy={ r } r={ r - width } />
                {showValue && renderText()}
            </svg>
        </div>
    )
}

export default IndicatorCircle
