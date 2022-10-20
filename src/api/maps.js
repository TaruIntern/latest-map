import axios from 'axios';

export async function getCollection() {
    try {

        // fetch("https://sender.paplilabs.com/images_api/getImage/cb1ab61f-c2af-4ef0-8223-172f3b01c9f2/", requestOptions)
        //     .then(response => response.text())
        //     .then(result => console.log("result", result))
        //     .catch(error => console.log('error', error));

        var formdata = new FormData();
        formdata.append("date", "2022-10-11T03:33:31+0530");

        // var myHeaders = new Headers();

        // myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk2NTc3Njk2LCJqdGkiOiIwZTFlOTg4OGYyYjc0NTY5OTMxMDI5M2RhMGYyNGFhZiIsInVzZXJfaWQiOiJoaXBwdUBnbWFpbC5jb20ifQ.0CurTAa9fvMQfbmCfg4-Oyo-6M-SLhHXwNrweBdmSn4");
        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
            // headers: myHeaders
            body: formdata
        };
        var response = await fetch("https://sender.paplilabs.com/images_api/getImages/", requestOptions);
        // var response = await fetch("https://receiver.paplilabs.com/receiver/nearby/points/", requestOptions);

        response = await response.json();
        // console.log("response is here...", response);
        // items = items.data;
        var items = response.result;
        const collectionList = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point', coordinates: [73.0938720703125, 19.935564041137695]
                    },
                },
            ],
        };

        // items = JSON.parse(items).result;

        // items = items.result;

        for (let i = 0; i < items.length; i++) {
            let points = items[i].points;
            for (let j = 0; j < points.length; j++) {
                let point = points[j];
                // t.push([point.lng, point.lat, point.imageId])
                collectionList.features.push({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [point.lng, point.lat] },
                    properties: { imageId: point.imageId }
                })
            }

        }

        return [collectionList, items];

    } catch (e) {
        console.log("something went wrong", e);
        return false;
    }
}