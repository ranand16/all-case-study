import { useEffect, useRef } from "react";

// number string both support
export default function usePrevious(value: string | number): number | string | undefined {
    const ref = useRef<string | number | undefined>();

    useEffect(() => {
        ref.current = value;
    }, [value]); 

    return ref.current;
}
