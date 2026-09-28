import { authStore } from 'ac-app-authenticator'

export interface ApiResponse<T = any> {
    data: T
    status: number
}

const request = async ( method: string, url: string ): Promise<ApiResponse> => {
    const { headers } = authStore.authedApiCallBaseConfig()

    const res = await fetch( url, { method, headers } )

    if ( res.status === 401 ) {
        await authStore.renewToken().catch( () => authStore.authorize() )
        const { headers: retryHeaders } = authStore.authedApiCallBaseConfig()
        const retryRes = await fetch( url, { method, headers: retryHeaders } )
        return { data: await retryRes.json().catch( () => null ), status: retryRes.status }
    }

    if ( !res.ok ) {
        throw new Error( `Request failed with status ${ res.status }` )
    }

    return { data: await res.json().catch( () => null ), status: res.status }
}

export const apiGet = ( url: string ) => request( 'GET', url )
export const apiDelete = ( url: string ) => request( 'DELETE', url )
