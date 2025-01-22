import { STRINGS } from '@src/lang/language';
import React from 'react';
import EmptyPage from './EmptyPage';

const NotFound: React.FC = () => {
    return (
        <EmptyPage
            heading={STRINGS["404pagenotfound"]}
            message={STRINGS["pagedoesnotexists"]}
            toPage={"/"}
            linktext={STRINGS["gohome"]}
        />
    )
};

export default NotFound;