import React, { useEffect, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import { getBins, resetBinData } from '../../actions/bins';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import Supercluster from 'supercluster';
import './cluster.css';
import { Avatar, Paper, Tooltip } from '@mui/material';
import PopupBin from './PopupBin';
import bbox from '@turf/bbox';

const supercluster = new Supercluster({
  radius: 75,
  maxZoom: 20,
});

const ClusterMap = () => {
  const {
    state: { filteredBins, selectedBin, currentUser },
    dispatch,
    mapRef,
  } = useValue();
  const [binPoints, setBinPoints] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [bounds, setBounds] = useState([-180, -85, 180, 85]);
  const [zoom, setZoom] = useState(0);
  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    getBins(currentUser?.grouptag, dispatch);
  }, []);

  useEffect(() => {
    const binPoints = filteredBins.map((bin) => ({
      type: 'Feature',
      properties: bin,
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(bin.longitude), parseFloat(bin.latitude)],
      },
    }));
    setBinPoints(binPoints);
  }, [filteredBins]);

  useEffect(() => {
    supercluster.load(binPoints);
    const currentClusters = supercluster.getClusters(bounds, zoom);
    const extendedClusters = currentClusters.map((cl) => {
      const { cluster: isCluster, point_count } = cl.properties;
      const { id } = cl;
      let hasDataCount = point_count;
      if (isCluster) {
        const leaves = supercluster.getLeaves(id)
        let sum = 0;
        const names = [];

        leaves.forEach(leave => {
          if (leave.properties.fuellstand) {
            sum += parseFloat(leave.properties.fuellstand);
          } else {
            hasDataCount -= 1;
          }
          names.push(leave.properties.name);
        });
        const avg = sum / hasDataCount;
        cl.properties.avg = avg;
        cl.properties.leaveNames = names;
      }
      return cl
    })
    setClusters(extendedClusters);
  }, [binPoints, zoom, bounds]);

  useEffect(() => {
    if (selectedBin !== popupInfo) {
      setPopupInfo(null);
    }
  }, [selectedBin]);


  useEffect(() => {
    if (mapRef.current) {
      setBounds(mapRef.current.getMap().getBounds().toArray().flat());
    }
  }, [mapRef]);


  useEffect(() => {
    if (binPoints.length > 0) {
      const geojson = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'properties': {},
              'coordinates': binPoints.map((bin) => {
                return bin.geometry.coordinates
              })
            }
          }
        ]
      }
      const [minLng, minLat, maxLng, maxLat] = bbox(geojson);
      mapRef?.current.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 100, duration: 1500 });
    }
  }, [binPoints]);

  return (
    <ReactMapGL
      initialViewState={{ latitude: 52.05, longitude: 7.36, zoom: 8 }}
      mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      ref={mapRef}
      onZoomEnd={(e) => setZoom(Math.round(e.viewState.zoom))}
      style={{ position: 'absolute' }}
    >
      {clusters.map((cluster) => {
        const { cluster: isCluster, point_count } = cluster.properties;
        const [longitude, latitude] = cluster.geometry.coordinates;
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <div
                className="cluster-marker"
                style={{
                  width: `${10 + (point_count / binPoints.length) * 20}px`,
                  height: `${10 + (point_count / binPoints.length) * 20}px`,
                  backgroundColor:
                    cluster.properties.avg > 0 ||
                      cluster.properties.avg < 100 ?
                      `rgba(
                          ${255 * Math.sqrt(Math.sin(cluster.properties.avg * Math.PI / 200))},
                          ${255 * Math.sqrt(Math.cos(cluster.properties.avg * Math.PI / 200))}
                        , 0, 0.7)`
                      : 'white',
                  outlineStyle: (cluster.properties.leaveNames?.some(ln => selectedBin?.name === ln)) ? 'auto' : 'none',
                  outlineColor: '#0066CC'

                }}
                onClick={() => {
                  const zoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom,
                    speed: 1.5,
                  });
                }}
              >
                {point_count}
              </div>
            </Marker>
          );
        }

        return (
          <Marker
            key={`bin-${cluster.properties.name}`}
            longitude={longitude}
            latitude={latitude}
          >
            <Tooltip title={cluster.properties.name}>
              <Avatar
                src="../../bin.png"
                component={Paper}
                elevation={2}
                style={{
                  backgroundColor:
                    cluster.properties.fuellstand > 0 ||
                      cluster.properties.fuellstand < 100 ?
                      `rgba(
                        ${255 * Math.sqrt(Math.sin(cluster.properties.fuellstand * Math.PI / 200))},
                        ${255 * Math.sqrt(Math.cos(cluster.properties.fuellstand * Math.PI / 200))}
                      , 0)`
                      : 'white',
                  outlineStyle: selectedBin?.name === cluster.properties.name ? 'auto' : 'none',
                  outlineColor: '#0066CC'
                }}
                onClick={() => {
                  if (cluster.properties !== popupInfo) { resetBinData(dispatch); }
                  dispatch({ type: 'UPDATE_SELECTED_BIN', payload: cluster.properties });
                  setPopupInfo(cluster.properties);
                }}
              />
            </Tooltip>
          </Marker>
        );
      })}
      {/* <GeocoderInput /> */}
      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          maxWidth="auto"
          closeOnClick={false}
          focusAfterOpen={false}
          onClose={() => {
            setPopupInfo(null);
            dispatch({ type: 'UPDATE_SELECTED_BIN', payload: null });
          }
          }
        >
          <PopupBin {...{ popupInfo }} />
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default ClusterMap;
