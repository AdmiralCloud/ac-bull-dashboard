import React, { useState, useEffect, useContext, useCallback } from 'react'
import { css, cx } from '@emotion/css'

import { getJobs } from '../../api/calls/getJobs';

import { DataContext } from '../../context/DataContextProvider';
import { OptionsContext } from '../../context/OptionsContextProvider';

export interface Props {
    className?: string;
}

const JobListRequester: React.FC<Props> = ({ className }) => {
    const { env, refreshInterval } = useContext(OptionsContext);
    const { setData } = useContext(DataContext);
    const [isRequesting, setIsRequesting] = useState(false); // State to track if request is in progress

    const requestJobs = useCallback(() => {
        // Only proceed if no request is currently in progress
        if (!isRequesting) {
            setIsRequesting(true); // Mark that a request is in progress
            getJobs(env)
                .then((res) => {
                    const sortedData = [...res.data].sort((a, b) => {
                        return b.timestamp - a.timestamp;
                    });

                    setData(sortedData);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setIsRequesting(false); // Reset the requesting state
                });
        }
    }, [env, setData, isRequesting]);

    useEffect(() => {
        requestJobs();
        const interval = setInterval(() => {
            requestJobs();
        }, refreshInterval);
        return () => clearInterval(interval);
    }, [refreshInterval, requestJobs]);

    const stylez = css``;

    return (
        <div className={cx(className, stylez)} />
    );
}

export default JobListRequester;
