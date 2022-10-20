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

import MapController from './MapController';
import { AuthenticationType, data, HtmlMarker } from 'azure-maps-control';
import { HtmlMarkerLayer } from './HTMLMarkerLayer';
import { getCollection } from "../api/maps";

import { AiOutlineFullscreen } from 'react-icons/ai';
import { IconContext } from "react-icons";


const key = '3MYI-I1ce7DOOpMSrlGqwbXKSo4PFaPNnTmg1X-QnoM';


const points1 = [
    [77.28788361173497, 28.74313985530671],
    [77.28816393443265, 28.7415422565047],
    [77.28844425713032, 28.73951449976596],
    [77.28858441847916, 28.737302356621697],
    [77.28872457982794, 28.734598562510698],
    [77.2888647411786, 28.731710341527688],
    [77.28914506387628, 28.728146043908893],
    [77.28935530589956, 28.72476599423959],
    [77.28949546724834, 28.720955625398403],
    [77.2897757899479, 28.71800556705803],
    [77.2897757899479, 28.71499396332665],
    [77.29047659669209, 28.711736416763188],
    [77.29145772613577, 28.708909029961575],
];

const points = [
    [77.11467351004922, 28.464437738952995],
    [77.11077117462304, 28.465493301132753],
    [77.10866991708616, 28.466548852768256],
    [77.10957045603078, 28.46971544441263],
    [77.1104709949754, 28.474992886261745],
    [77.11077117462304, 28.47921464992055],
    [77.11347279145701, 28.480533916458214],
    [77.11977656406765, 28.47868693869144],
    [77.12517979773367, 28.47895079463511],
    [77.12848177386479, 28.48158931782352],
    [77.1320839296414, 28.484755458633046],
    [77.13838770225402, 28.48792150451041],
    [77.14529183416175, 28.49108745544872],
    [77.15189578642003, 28.49346185634529],
    [77.15849973868018, 28.496627641123908],
    [77.16450333164335, 28.499529527087205],
    [77.17170764319866, 28.501903738067924],
    [77.17530979897725, 28.50533305961916],
    [77.17921213440349, 28.508234706178243],
    [77.1834146494773, 28.510344944454403],
    [77.18821752384815, 28.514829060618624],
    [77.19031878138503, 28.519576740515177],
    [77.19061896103256, 28.52142300274589],
    [77.19752309294029, 28.520367999715006],
    [77.2059281230899, 28.519312986128412],
    [77.21073099745877, 28.517994204299995],
    [77.21763512936656, 28.516411644333957],
    [77.22393890197912, 28.515092826220027],
    [77.23084303388691, 28.513773991613505],
    [77.23894788438685, 28.511400047762237],
    [77.24735291453442, 28.510872497428053],
    [77.25665848362866, 28.510344944454403],
    [77.26086099870236, 28.50981738884306],
    [77.26176153764709, 28.50533305961916],
    [77.26206171729461, 28.501903738067924],
    [77.264463154481, 28.499793330944726],
    [77.26596405272085, 28.496891452236284],
    [77.26746495096262, 28.49504476060345],
    [77.26986638814702, 28.490032149018788],
    [77.27316836427616, 28.48739383679049],
    [77.27677052005481, 28.48449161719104],
    [77.28187357407319, 28.486866166433373],
    [77.28757698738877, 28.488976832038688],
    [77.2884775263334, 28.49425331144208],
    [77.29087896351786, 28.498474305059773],
    [77.29838345472268, 28.496627641123908],
    [77.3013852512043, 28.497155262688352]
]

const roads = [
    points1, points,
    [
        [77.06703552013005, 28.68086276836692],
        [77.06745874470545, 28.681651772955377],
        [77.06825229078134, 28.68193024374429],
        [77.06936325529011, 28.68193024374429],
        [77.07126776587478, 28.68188383199731],
        [77.07296066417268, 28.681744596633706],
        [77.07544710854648, 28.681419713399322],
        [77.0790974205002, 28.68109482915709],
        [77.08205999252067, 28.680677119364205],
        [77.08401740617842, 28.680491470033132],
        [77.08634514133655, 28.680166582910758],
        [77.08883158571223, 28.679934520063966],
        [77.09152964237273, 28.67947039282788],
        [77.09406898981962, 28.679331154255863],
        [77.09486253589733, 28.679331154255863],
        [77.09512705125536, 28.681837420229755],
        [77.09533866354212, 28.68299770824153],
        [77.09570898504626, 28.68494696316141],
        [77.09592059733308, 28.68698900082778],
        [77.0963438219066, 28.688798955466538],
        [77.09703156183997, 28.69019120697618]
    ],
    [[77.12923094688489, 28.56641759664896],
    [77.13204479221685, 28.567748286813924],
    [77.13550798647219, 28.56983933736096],
    [77.13832183180409, 28.572120436018437],
    [77.14221792534039, 28.574211399675434],
    [77.14438242174896, 28.574781655278002],
    [77.14524822031285, 28.580103891834582],
    [77.14697981744041, 28.584665594534272],
    [77.15368975630867, 28.58770661973405],
    [77.15823519876818, 28.5905575009797],
    [77.16364643978977, 28.591887885771285],
    [77.16689318440456, 28.593218253726462],
    [77.17078927794074, 28.596259031542544],
    [77.17641696860471, 28.598349515261347],
    [77.18096241106429, 28.601200107864983],
    [77.18550785352198, 28.604050623143067],
    [77.18918749741778, 28.606521007165085],
    [77.19135199382634, 28.608991333099524],
    [77.19048619526444, 28.61469186354293],
    [77.19156844346873, 28.61849204528555],
    [77.19481518808163, 28.62096208967273],
    [77.19871128161793, 28.622482088106167],
    [77.203040274437, 28.62514203241487],
    [77.20780216653714, 28.627041951371822],
    [77.21191470971382, 28.629131822507617],
    [77.21516145432673, 28.63027173468015],
    [77.21884109822247, 28.62894183594237],
    [77.22252074211826, 28.626851961023846],
    [77.22511813780972, 28.621722091639683],
    [77.22836488242262, 28.61773201993833],
    [77.23009647955024, 28.614311837805275],
    [77.22858133206307, 28.61222167166919],
    [77.22879778170551, 28.60994144299083],
    [77.22944713062697, 28.608041214614857],
    [77.2264168356545, 28.60481074749046],
    [77.22403588960549, 28.600629995530355],
    [77.21927399750535, 28.597779387461244],
    [77.21689305145435, 28.594168506244003],
    [77.21321340755861, 28.59131772292244],
    [77.21278050827766, 28.5865662455914],
    [77.21299695791811, 28.582194696800727],
    [77.21169826007332, 28.578203123979065],
    [77.21039956222671, 28.574591570420864],
    [77.20996666294565, 28.571360075294024],
    [77.20866796510091, 28.56812848091333],
    [77.20823506581803, 28.563375955942675],
    [77.2073692672542, 28.558623216360388],
    [77.2060705694094, 28.554060384474994],
    [77.20368962335846, 28.548736830681904],
    [77.20260737515412, 28.545314403986552],
    [77.20671991833274, 28.543032724406217],]
]

function mouseOverLineString(e) {
    console.log('lineString moved', e);
}

var coordinates = [];

function getCoordinates(e) {
    console.log('Clicked on:', e.position);
}

function getZoom(e) {
    console.log('zoom', e)
}


export default function Map(props) {

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
        center: [77.20066434351463, 28.542003845957083],
        zoom: fullView ? 14 : 17,
        view: 'auto',
        style: 'grayscale_light',
        showLogo: false,
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

    function onHover(properties, e) {

        const position = [e.target.marker._lngLat.lng, e.target.marker._lngLat.lat]

        var pointInfo = linkedList[position];

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
            })
            .catch(error => console.log('error', error));

        // })

        setPopupOptions({
            ...popupOptions,
            position: new data.Position(
                position[0],
                position[1],
            ),
            pixelOffset: [0, -18],
        });
        setPopupVisible(true);
    }

    useEffect(() => {
        setFullView(props.mapFull);
        setPosition(props.position);
        setOption({ ...option, center: props.position.length > 0 ? props.position : [77.1992536, 28.7219451], zoom: props.mapFull ? 14 : 17 });
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

            // console.log("data", data)
            props.setPoints(data);
            setLinkedList(data);
            setLines(lines);
            setCollectionList(cl);


        }).catch(e => console.log('something went wrong in useEffect Map.js', e))
    }, [])

    const onMarkerClick = (e) => {
        console.log('You click on: ', e);
    };

    const eventToMarker = [{ eventName: 'click', callback: onMarkerClick }];

    if (!fullView) {
        return (
            <AzureMapsProvider>
                <MapController
                    updateImageUrl={(url) => { props.updateImageUrl(url); }}
                    changeView={() => props.changeView(true)}
                    mapFull={props.mapFull}
                    position={props.position}
                    updatePosition={(pos) => props.updatePosition(pos)}
                    setPoints={(data) => props.setPoints(data)}
                />
            </AzureMapsProvider>
        )
    }


    return (
        <>
            {fullView && (
                <div>

                    {collectionList.features.length != 0 && (
                        <>
                            <AzureMapsProvider>
                                <div className="mapFull">
                                    <AzureMap options={option} events={{
                                        zoomstart: () => {
                                            setTemp(Math.random() * 100)
                                        },
                                        zoom: () => {
                                            setTemp(Math.random() * 100)
                                        },
                                        zoomend: () => {
                                            setTemp(Math.random() * 100)
                                        },
                                        click: (e) => {
                                            setTemp(Math.random() * 100);
                                            console.log("cliked", e.position);
                                        },
                                        layeradded: () => {
                                            console.log("layer added")
                                            setTimeout(() => { setTemp(Math.random() * 100) }, 1000);
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
                                                        // console.log('LAYER ADDED TO MAP', e);
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
                                                id={'custom layer'}
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
                                                                    mapRef.events.add('mouseover', marker, (e) => onHover(properties, e));
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



                                        <AzureMapPopup
                                            isVisible={popupVisible}
                                            options={popupOptions}
                                            popupContent={
                                                <>
                                                    <img
                                                        className="h-28 w-36 rounded-lg"
                                                        src={imgUrl}
                                                    />
                                                </>
                                            }
                                            events={[{ eventName: 'close', callback: () => setPopupVisible(false) }, { eventName: 'open', callback: () => setPopupVisible(true) }]}
                                        />
                                    </AzureMap>
                                </div>
                            </AzureMapsProvider>
                        </>
                    )}


                </div>
            )}
        </>

    )
}