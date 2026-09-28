import { apiDelete } from '../helper/apiFetch'

import { hosts } from '../../../config/api/hosts'

export const deleteJob = ( env: 'dev' | 'live', jobList, jobId? ) => {
    if ( jobId ) {
        return apiDelete( `${ hosts.jobs[ env ] }/v1/bull/${ jobList }/${ jobId }` )
    }
    else {
        return apiDelete( `${ hosts.jobs[ env ] }/v1/bull/${ jobList }` )
    }
}
