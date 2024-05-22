import React, { useEffect, useRef } from 'react'

function Translator() {

    const googleTranslateRef = useRef(null);

    useEffect(() => {

        let intervalId;

        const checkGoogleTranslate = () => {
            if (window.google && window.google.translate) {
                clearInterval(intervalId);
                new window.google.translate.TranslateElement({
                    pageLanguage: "en",
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                },
                    googleTranslateRef.current
                )
            }
        };
        intervalId = setInterval(checkGoogleTranslate, 100);

    }, [])
    return (
        <>
            <div className='fixed right-2 top-5' ref={googleTranslateRef}></div>
        </>
    )
}

export default Translator