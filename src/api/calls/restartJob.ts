import { apiGet } from '../helper/apiFetch'

import { hosts } from '../../../config/api/hosts'

export const restartJob = ( env: 'dev' | 'live', jobList, jobId ) => {
    return apiGet( `${ hosts.jobs[ env ] }/v1/bull/retryJob/${ jobList }/${ jobId }` )
}
