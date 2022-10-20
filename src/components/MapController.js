import React, { useContext, useEffect, useState } from 'react';
import { AzureMapsContext } from 'react-azure-maps';
import { data, layer, source } from 'azure-maps-control';
import MapComponent from './MapComponent';

const dataSourceRef = new source.DataSource();
const layerRef = new layer.SymbolLayer(dataSourceRef);

const MapController = (props) => {
    // Here you use mapRef from context
    const { mapRef, isMapReady } = useContext(AzureMapsContext);
    const [showTileBoundaries, setShowTileBoundaries] = useState(true);

    useEffect(() => {
        if (isMapReady && mapRef) {
            // Need to add source and layer to map on init and ready
            mapRef.sources.add(dataSourceRef);
            mapRef.layers.add(layerRef);
        }
    }, [isMapReady]);

    useEffect(() => {
        if (mapRef) {
            // Simple Style modification
            mapRef.setStyle({ showTileBoundaries: !showTileBoundaries });
        }
    }, [showTileBoundaries]);

    const changeMapCenter = () => {
        if (mapRef) {
            // Simple Camera options modification
            mapRef.setCamera({ center: getRandomPosition() });
        }
    };

    const toggleTitleBoundaries = () => {
        setShowTileBoundaries((prev) => !prev);
    };

    const addRandomMarker = () => {
        const randomLongitude = Math.floor(Math.random() * (180 - -180) + -180);
        const randomLatitude = Math.floor(Math.random() * (-90 - 90) + 90);
        const newPoint = new data.Position(randomLongitude, randomLatitude);

        dataSourceRef.add(new data.Feature(new data.Point(newPoint)));
    };

    useEffect(() => {

        if (mapRef) {
            // Simple Camera options modification
            mapRef.setCamera({ center: props.position });
        }

    }, [props.position])

    return (
        <>
            <div>Map Controller</div>
            <MapComponent
                updateImageUrl={(url) => { props.updateImageUrl(url); }}
                changeView={() => props.changeView(true)}
                mapFull={props.mapFull}
                position={props.position}
                updatePosition={(pos) => {
                    props.updatePosition(pos);
                }}
                setPoints={(data) => props.setPoints(data)}
            />
        </>
    );
};

const getRandomPosition = () => {
    const randomLongitude = Math.floor(Math.random() * (180 - -180) + -180);
    const randomLatitude = Math.floor(Math.random() * (-90 - 90) + 90);
    return [randomLatitude, randomLongitude];
};

export default MapController;
