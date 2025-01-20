import React from "react";

// number string both support
export default function usePrevious(value: string | number): number | string | undefined {
    const ref = React.useRef<string | number | undefined>();

    React.useEffect(() => {
        ref.current = value;
    }, [value]); 

    return ref.current;
}
