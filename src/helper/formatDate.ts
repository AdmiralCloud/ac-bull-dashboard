const pad = ( n: number ) => `${ n }`.padStart( 2, '0' )

export const formatDateTime = ( input: number | string | Date, pattern: 'YYYY-MM-DD HH:mm:ss' | 'HH:mm:ss - DD.MM.YY' ) => {
    const d = new Date( input )

    const yyyy = d.getFullYear()
    const MM = pad( d.getMonth() + 1 )
    const DD = pad( d.getDate() )
    const HH = pad( d.getHours() )
    const mm = pad( d.getMinutes() )
    const ss = pad( d.getSeconds() )

    if ( pattern === 'YYYY-MM-DD HH:mm:ss' ) return `${ yyyy }-${ MM }-${ DD } ${ HH }:${ mm }:${ ss }`
    return `${ HH }:${ mm }:${ ss } - ${ DD }.${ MM }.${ `${ yyyy }`.slice( 2 ) }`
}

const RTF = new Intl.RelativeTimeFormat( 'en', { numeric: 'auto' } )

const UNITS: [ Intl.RelativeTimeFormatUnit, number ][] = [
    [ 'year', 1000 * 60 * 60 * 24 * 365 ],
    [ 'month', 1000 * 60 * 60 * 24 * 30 ],
    [ 'day', 1000 * 60 * 60 * 24 ],
    [ 'hour', 1000 * 60 * 60 ],
    [ 'minute', 1000 * 60 ],
    [ 'second', 1000 ],
]

export const fromNow = ( input: number | string | Date ) => {
    const diff = new Date( input ).getTime() - Date.now()

    for ( const [ unit, ms ] of UNITS ) {
        if ( Math.abs( diff ) >= ms || unit === 'second' ) {
            return RTF.format( Math.round( diff / ms ), unit )
        }
    }
    return RTF.format( 0, 'second' )
}
