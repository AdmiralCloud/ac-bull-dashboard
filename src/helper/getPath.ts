export const getPath = ( obj: any, path: string ) => {
    return path.split( '.' ).reduce( ( acc, key ) => ( acc == null ? undefined : acc[ key ] ), obj )
}
