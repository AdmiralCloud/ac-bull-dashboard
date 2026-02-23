import React, { useState, useEffect } from 'react'
import { css, cx } from '@emotion/css'
import IndicatorCircle from '@components/IndicatorCircle/IndicatorCircle'

import { colors } from '../../../../config/colors'

export interface Props {
    className?: string
    progress: string
    status: AllowedStatiTypes
}

const ProgressIndicatorCircle: React.FC<Props> = ( { status, className, progress } ) => {
    const stylez = css``

    return (
        <div className={ cx( className, stylez ) }>
            <IndicatorCircle
              r={ 30 }
              animationDuration={ 0 }
              value={ status === 'finished' ? 100 : progress ? parseInt( progress ) : 0 }
              color={ status === 'failed' ? colors.warning : status === 'finished' ? colors.success : colors.pending }
              circleColor={ colors.unTouched }
              showValue={ ( status === 'finished' || status === 'failed' ) || Number.isInteger( parseInt( progress ) ) }
            />
        </div>
    )
}

export default ProgressIndicatorCircle
