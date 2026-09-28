import { apiGet } from '../helper/apiFetch'

import { hosts } from '../../../config/api/hosts'

const randomDuration = ( min: number, max: number ) => Math.floor( Math.random() * ( max - min + 1 ) ) + min

export const simulateJob = ( env: 'dev' | 'live' ) => {
    return apiGet( `${ hosts.jobs[ env ] }/v1/bull/simulateJob/miscActivities?duration=${ randomDuration( 10, 120 ) }` )
}
