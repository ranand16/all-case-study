import { STRINGS } from '@src/lang/language';
import React from 'react';

const NotFound: React.FC = () => (
    <div>
        <h2>{STRINGS["404pagenotfound"]}</h2>
        <p>{STRINGS["pagedoesnotexists"]}</p>
    </div>
);

export default NotFound;