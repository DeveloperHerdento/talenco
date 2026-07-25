"use client";

import { useEffect, useState} from "react";
const MOBILE_BREAKDOWN = 758;

export function useIsMobile() {
    const [ isMobile, setIsMobile ] = useState<boolean>(false);
    const [ mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKDOWN - 1}px)`);

        const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKDOWN);
        onChange();

        mql.addEventListener("change", onChange)
        return() => mql.removeEventListener("change", onChange)
    }, [])

    return mounted ? isMobile : false;
}