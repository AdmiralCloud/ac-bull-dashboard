import axios from 'axios'
import { authStore } from 'ac-app-authenticator'

import { hosts } from '../../../config/api/hosts'

export const getJobs = ( env: 'local' | 'dev' | 'live' ) => {
    return axios.get( `${ hosts.jobs[ env ] }/v1/bull/getJobs`, authStore.authedApiCallBaseConfig() )
}
