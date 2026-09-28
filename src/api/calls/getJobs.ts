import { apiGet } from '../helper/apiFetch'

import { hosts } from '../../../config/api/hosts'

export const getJobs = ( env: 'local' | 'dev' | 'live' ) => {
    return apiGet( `${ hosts.jobs[ env ] }/v1/bull/getJobs` )
}
