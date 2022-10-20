import React, { useState, useEffect } from 'react';
import "./styles.css";
import { AiOutlineFullscreen } from 'react-icons/ai';
import { IconContext } from "react-icons";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai"

function ImagePopup(props) {

    const imgUrl = props.imgUrl;
    const [fullView, setFullView] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFullView(props.imgFull);
        setLoading(props.loading);
    }, [props])

    return (
        <div>

            {loading && (
                <h3 style={{ position: 'absolute', top: '50vh', left: '50vw' }}>Loading</h3>
            )}

            {fullView && (
                <div className={`imgPopupLarge`} style={loading ? { opacity: 0.7 } : null}>
                    <div className="absolute left-1/2 top-4 flex gap-4">
                        <div className="bg-blue-400 px-4 py-2 rounded-lg" onClick={() => {
                            // Move to previous point
                            props.goBack();
                        }}>
                            <AiOutlineLeft className="h-6 w-6 border-r-2 " />
                        </div>
                        <div className="bg-blue-400 px-4 py-2 rounded-lg" onClick={() => {
                            // Move to next point
                            props.goAhead();
                        }}>
                            <AiOutlineRight className="h-6 w-6 border-l-2" />
                        </div>
                    </div>
                    <img src={imgUrl} className="img" />
                </div>
            )}
            {!fullView && (
                <div className={`rounded-lg imgPopupSmall`} style={loading ? { opacity: 0.7 } : null}>
                    <IconContext.Provider value={{ color: "white", className: "global-class-name" }}>
                        <AiOutlineFullscreen className="icon h-8 w-8" onClick={() => {
                            props.changeView();
                            setFullView(!fullView);
                        }} />
                    </IconContext.Provider>
                    <img src={imgUrl} className="img rounded-lg" />
                </div>
            )}
        </div>

    );
}

export default ImagePopup;