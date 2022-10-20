import React, { useState, useEffect, useContext, useRef } from 'react';

import {
    AzureMap,
    AzureMapDataSourceProvider,
    AzureMapFeature,
    AzureMapLayerProvider,
    AzureMapsProvider,
    AzureMapPopup,
    AzureMapHtmlMarker,
} from 'react-azure-maps';

import { AuthenticationType, data, HtmlMarker } from 'azure-maps-control';
import { HtmlMarkerLayer } from './HTMLMarkerLayer';
import { getCollection } from "../api/maps";

import { AiOutlineFullscreen } from 'react-icons/ai';
import { IconContext } from "react-icons";


const key = '3MYI-I1ce7DOOpMSrlGqwbXKSo4PFaPNnTmg1X-QnoM';


export default function MapComponent(props) {


    const [popupVisible, setPopupVisible] = useState(false);
    const [popupOptions, setPopupOptions] = useState({});
    const [imgUrl, setImgUrl] = useState('');

    const [collectionList, setCollectionList] = useState({
        type: 'FeatureCollection',
        features: [
        ],
    });

    const [lines, setLines] = useState([]);
    const [fullView, setFullView] = useState(props.mapFull);
    const [position, setPosition] = useState([]);
    const [temp, setTemp] = useState(0);

    const [linkedList, setLinkedList] = useState({});


    const [option, setOption] = useState({
        authOptions: {
            authType: AuthenticationType.subscriptionKey,
            subscriptionKey: key,
        },
        center: props.position.length > 0 ? props.position : [77.20066434351463, 28.542003845957083],
        zoom: fullView ? 14 : 17,
        view: 'auto',
        style: 'grayscale_light',
        showLogo: false,
        // maxBounds: [28.542003845957083, 22.542003845957083, 90.20066434351463, 20.542003845957083]
    })

    function onClick(properties, e) {

        const pos = [e.target.marker._lngLat.lng, e.target.marker._lngLat.lat]
        var keys = Object.keys(linkedList[pos]);
        var pointInfo = linkedList[pos];

        var imgId = pointInfo.imgId;

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://sender.paplilabs.com/images_api/getImage/" + imgId + "/", requestOptions)
            .then(response => response.json())
            .then(result => {
                let url = result.data;
                setImgUrl(url);
                props.updateImageUrl(url);
            })
            .catch(error => console.log('error', error));

        // axios.get("https://sp-02.paplilabs.com/images_api/getImage/" + imgId, { headers: header }).then((response) => {
        //     console.log("image url", response)
        // }).catch(err => {
        //     console.log("something went wrong while calling the getImage api");
        // let url = "https://source.unsplash.com/random";
        // setImgUrl(url);
        //     props.updateImageUrl(url);
        // })

        props.updatePosition(pos);
        setPosition(pos);
        setPopupOptions({
            ...popupOptions,
            position: new data.Position(
                pos[0],
                pos[1],
            ),
            pixelOffset: [0, -18],
        });
        setPopupVisible(true);

    }
    useEffect(() => {
        // console.log("props", props)
        setFullView(props.mapFull);
        setPosition(props.position);
        setTemp(Math.random() * 100)
    }, [props])

    useEffect(() => {
        getCollection().then((response) => {
            let cl = response[0];
            let items = response[1];

            let lines = [];

            var data = {};

            for (let i = 0; i < items.length; i++) {

                let trip = items[i];
                var tripId = trip.trip;
                let points = trip.points;
                let line = [];

                var prev = [];
                for (let j = 0; j < points.length; j++) {
                    line.push([points[j].lng, points[j].lat]);

                    data[[points[j].lng, points[j].lat]] = { [tripId]: { prev: prev }, imgId: points[j].imageId }
                    if (prev.length > 0) {
                        data[prev.slice(0, 2)][tripId]["next"] = [points[j].lng, points[j].lat, points[j].imageId]
                    }
                    prev = [points[j].lng, points[j].lat, points[j].imageId];
                }
                lines.push(line);

            }

            // props.setPoints(data);
            setLinkedList(data);
            setLines(lines);
            setCollectionList(cl);


        }).catch(e => console.log('something went wrong in useEffect Map.js', e))
    }, [])

    const onMarkerClick = (e) => {
        console.log('You click on: ', e);
    };

    const eventToMarker = [{ eventName: 'click', callback: onMarkerClick }];

    return (
        <div style={{
            height: '40vh', zIndex: '100',
            position: "absolute",
            top: "56vh",
            left: '1vw',
            width: "30vw"
        }}>
            <AzureMap
                options={option}
                events={{
                    zoomstart: () => {
                        setTemp(Math.random() * 100)
                    },
                    zoom: () => {
                        setTemp(Math.random() * 100)
                    },
                    zoomend: () => {
                        setTemp(Math.random() * 100)
                    },
                    click: () => {
                        setTemp(Math.random() * 100)
                    },
                    layeradded: () => {
                        console.log("layer added")
                        setTimeout(() => { setTemp(Math.random() * 100) }, 2000);

                    }
                }}>
                <AzureMapDataSourceProvider
                    events={{
                        dataadded: (e) => {
                            // console.log('Data on source added', e);
                        },
                    }}
                >
                    <AzureMapLayerProvider
                        id={'routeExample AzureMapLayerProvider'}
                        options={{
                            strokeWidth: 2,
                        }}
                        lifecycleEvents={{
                            layeradded: (e) => {
                            },
                        }}
                        type={'LineLayer'}
                    />
                    {lines.map((line, idx) => {
                        return (
                            <AzureMapFeature
                                key={'Line String Feature' + idx.toString()}
                                id={'Line Strign ID'}
                                type={'LineString'}
                                coordinates={line}
                            />
                        )
                    })}

                </AzureMapDataSourceProvider>
                <AzureMapDataSourceProvider
                    id={'HTMLMarkers DataSrouceProvider'}
                    // dataFromUrl="https://raw.githubusercontent.com/Azure-Samples/AzureMapsCodeSamples/master/AzureMapsCodeSamples/Common/data/geojson/SamplePoiDataSet.json"
                    options={{ cluster: true, clusterMaxZoom: 13 }}
                    collection={collectionList}
                >
                    <AzureMapLayerProvider
                        type="custom"
                        onCreateCustomLayer={(dataSourceRef, mapRef) => {
                            const markerLayer = new HtmlMarkerLayer(
                                'HTMLMarkers DataSrouceProvider',
                                'HTMLMarker LayerProvider',
                                // @ts-ignore
                                {
                                    markerRenderCallback: function (id, position, properties) {
                                        //Business logic to define color of marker.
                                        let color = 'red';

                                        //Create an HtmlMarker with a random color.
                                        const marker = new HtmlMarker({
                                            position: position,
                                            color: color,
                                            htmlContent: "<div style='min-height:14px; min-width:14px; background-color: #3d91ff; border-radius: 7px; cursor: pointer;'></div>",
                                        });
                                        // console.log(properties.url)
                                        if (mapRef) {
                                            mapRef.events.add('mousedown', marker, (e) => onClick(properties, e));
                                        }
                                        return marker;
                                    },
                                    clusterRenderCallback: function (id, position, properties) {
                                        return;
                                    },
                                },
                            );
                            return markerLayer;
                        }}
                    />
                </AzureMapDataSourceProvider>

                {position.length > 0 && (
                    <AzureMapDataSourceProvider
                        id={'markersExample AzureMapDataSourceProvider'}
                        options={{ cluster: true, clusterMaxZoom: 18 }}
                    >
                        <AzureMapLayerProvider
                            id={'markersExample AzureMapLayerProvider'}
                            type={'SymbolLayer'}
                        />
                        <AzureMapHtmlMarker
                            key={Math.random()}
                            markerContent={<div className="pulseIcon"></div>}
                            options={{
                                position: new data.Position(
                                    position[0],
                                    position[1],
                                ),
                                visible: true,
                            }}
                            events={eventToMarker}
                        />
                    </AzureMapDataSourceProvider>
                )}


            </AzureMap>
            <IconContext.Provider value={{ color: "black", className: "global-class-name" }} style={{ zIndex: '100' }}>
                <AiOutlineFullscreen className="picon h-8 w-8" onClick={() => {
                    props.changeView();
                    setFullView(!fullView);
                }} />
            </IconContext.Provider>
        </div>
    );
}