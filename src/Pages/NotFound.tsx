import React from 'react';
import EmptyPage from '../Components/EmptyPage';
import { STRINGS } from '../lang/language';

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