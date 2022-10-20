import React, { useState } from 'react';

import Map from "../components/Map";
import ImagePopup from "../components/ImagePopup";

function HomeScreen() {

    const [imgUrl, setImgUrl] = useState('');
    const [mapView, setMapView] = useState(true);
    const [position, setPosition] = useState([]);

    const [pointData, setPointData] = useState({});
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <Map
                updateImageUrl={(url) => { setImgUrl(url); console.log('updates', url) }}
                changeView={() => setMapView(!mapView)}
                mapFull={mapView}
                position={position}
                updatePosition={(pos) => setPosition(pos)}
                setPoints={(data) => setPointData(data)}
            />

            {imgUrl.length != 0 && (
                <ImagePopup
                    loading={loading}
                    imgUrl={imgUrl}
                    changeView={() => setMapView(!mapView)}
                    imgFull={!mapView}
                    goBack={() => {
                        console.log('going back');
                        let pointInfo = pointData[position];
                        let keys = Object.keys(pointInfo);
                        let thisPoint = pointInfo[keys[0]];
                        let prev = thisPoint.prev;
                        // setImgUrl(prev.)
                        var prevPoint = pointData[prev.slice(0, 2)];

                        var imgId = prevPoint.imgId;

                        var requestOptions = {
                            method: 'GET',
                            redirect: 'follow'
                        };
                        setLoading(true)
                        fetch("https://sender.paplilabs.com/images_api/getImage/" + imgId + "/", requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                let url = result.data;
                                setImgUrl(url);
                                setLoading(false);
                            })
                            .catch(error => console.log('error', error));
                        setPosition(prev.slice(0, 2));
                    }}
                    goAhead={() => {
                        console.log('going ahead');
                        let pointInfo = pointData[position];
                        let keys = Object.keys(pointInfo);
                        let thisPoint = pointInfo[keys[0]];
                        let next = thisPoint.next;

                        var nextPoint = pointData[next.slice(0, 2)];
                        var imgId = nextPoint.imgId;

                        var requestOptions = {
                            method: 'GET',
                            redirect: 'follow'
                        };
                        setLoading(true)
                        fetch("https://sender.paplilabs.com/images_api/getImage/" + imgId + "/", requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                let url = result.data;
                                setImgUrl(url);
                                setLoading(false);
                            })
                            .catch(error => console.log('error', error));

                        setPosition(next.slice(0, 2));
                    }}
                />
            )}

        </div>
    );
}

export default HomeScreen;
