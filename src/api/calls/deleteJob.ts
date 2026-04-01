import axios from 'axios'
import { authStore } from 'ac-app-authenticator'

import { hosts } from '../../../config/api/hosts'

export const deleteJob = ( env: 'dev' | 'live', jobList, jobId? ) => {
    if (jobId) {
        return axios.delete( `${ hosts.jobs[ env ] }/v1/bull/${ jobList }/${ jobId }`, authStore.authedApiCallBaseConfig() )
    }
    else {
        return axios.delete( `${ hosts.jobs[ env ] }/v1/bull/${ jobList }`, authStore.authedApiCallBaseConfig() )
    }
}
