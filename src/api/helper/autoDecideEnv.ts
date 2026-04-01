import { isDev } from '../../../config/api/envDecision'

export const autoDecideEnv = () => {
    const dev = isDev.find( devOrigins => window.location.origin.indexOf( devOrigins ) !== -1 )
    if ( dev ) {
        if (window.location.search === '?env=local') {
            return 'local'
        }
        return 'dev'
    }
    return 'live'
}
