import React from 'react';

declare global {
    type AllowedStatiTypes = 'waiting' | 'active' | 'finished' | 'failed' | 'delayed'

    type StatusConfigType = {
        [ statusTitle in AllowedStatiTypes ]: {
            color: string
        }
    }

    type ItemDataType = {
        jobList: string,
        jobId: string,
        status: AllowedStatiTypes,
        processedOn: number
        delay: number
        finishedOn: number
        timestamp: number
        progress: null
        priority: number
        failedReason?: string
        attemptsMade: number
        environment: string
        opts?: {
            attempts: number,
            delay: number,
            timestamp: number
        }
        data?: {
            mediaContainerId?: number
            mediaId?: number
            container_name?: { content: string, title: string }[] //eslint-disable-line
            format: {
                id: number
            }
            type?: string
            userId: number
            statusText: string
            customerId: number
            encoderSettings?: {
                height: number
            },
            jobUpdated: number,
            statusText: string,
            worker: string
        }
    }

    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
        interface Element extends React.ReactElement<any, any> { }
        interface ElementClass extends React.Component<any> {
            render(): React.ReactNode;
        }
        interface ElementAttributesProperty { props: {}; }
        interface ElementChildrenAttribute { children: {}; }
    }
}

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        [key: string]: any;
    }
}
