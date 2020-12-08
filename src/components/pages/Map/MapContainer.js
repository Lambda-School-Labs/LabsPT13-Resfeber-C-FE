import React, { useState, useEffect, useMemo } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import RenderMapPage from './RenderMapPage';
import { connect } from 'react-redux';
import {
  fetchSearchResults,
  fetchCategoryResults,
} from '../../../state/actions/index';

function MapContainer({
  LoadingComponent,
  fetchSearchResults,
  fetchCategoryResults,
  searchResults,
}) {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  // eslint-disable-next-line
  const [memoAuthService] = useMemo(() => [authService], []);
  const [queryInput, setQueryInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({
    value: '',
    label: '',
  });
  const [viewport, setViewport] = useState({
    latitude: 38.9072,
    longitude: -77.0369,
    width: '100%',
    height: '90vh',
    zoom: 10,
  });
  const [tempMarkers, setTempMarkers] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [mapView, setMapView] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    memoAuthService
      .getUser()
      .then(info => {
        // if user is authenticated we can use the authService to snag some user info.
        // isSubscribed is a boolean toggle that we're using to clean up our useEffect.
        if (isSubscribed) {
          setUserInfo(info);
        }
      })
      .catch(err => {
        isSubscribed = false;
        return setUserInfo(null);
      });
    return () => (isSubscribed = false);
  }, [memoAuthService]);

  useEffect(() => {
    if (searchResults) {
      const newViewport = {
        ...viewport,
        latitude: searchResults[0].venue.location.lat,
        longitude: searchResults[0].venue.location.lng,
      };

      setViewport(newViewport);
    }
    // eslint-disable-next-line
  }, [searchResults]);

  useEffect(() => {
    const listener = e => {
      if (e.key === 'Escape') {
        setSelectedResult(null);
      }
    };
    window.addEventListener('keydown', listener);

    // when component unmounts
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    if (queryInput === '') {
      fetchCategoryResults(locationInput, selectedCategory.value);
    } else {
      fetchSearchResults(locationInput, queryInput);
    }
    setTempMarkers([]);
    setViewport({ ...viewport, zoom: 10 });
    setMapView(false);
  };

  const handleQueryInput = e => {
    const res = e.target.value.split(' ').join('+');
    setQueryInput(res);
  };

  const handleLocationInput = e => {
    const res = e.target.value.split(' ').join('+');
    setLocationInput(res);
  };

  const dropdownOptions = [
    { value: 'topPicks', label: 'Top Picks' },
    { value: 'food', label: 'Food' },
    { value: 'drinks', label: 'Bars' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'shops', label: 'Shops' },
    { value: 'arts', label: 'Arts' },
    { value: 'outdoors', label: 'Outdoors' },
    { value: 'sights', label: 'Sights' },
    { value: 'trending', label: 'Trending' },
  ];

  const onCategorySelect = option => {
    setSelectedCategory(option);
  };

  const addMarkers = newMarker => {
    setTempMarkers([...tempMarkers, newMarker]);
  };

  const removeMarkers = () => {
    setTempMarkers([]);
  };

  const handleMapView = () => {
    setMapView(!mapView);
  };

  return (
    <React.Fragment>
      <RenderMapPage
        userInfo={userInfo}
        authService={authService}
        searchResults={searchResults}
        handleSubmit={handleSubmit}
        handleQueryInput={e => handleQueryInput(e)}
        handleLocationInput={e => handleLocationInput(e)}
        selectedCategory={selectedCategory}
        dropdownOptions={dropdownOptions}
        onCategorySelect={onCategorySelect}
        viewport={viewport}
        setViewport={setViewport}
        selectedResult={selectedResult}
        setSelectedResult={setSelectedResult}
        tempMarkers={tempMarkers}
        addMarkers={addMarkers}
        removeMarkers={removeMarkers}
        mapView={mapView}
        handleMapView={handleMapView}
      />
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
    searchResults: state.searchResults,
  };
};

export default connect(mapStateToProps, {
  fetchSearchResults,
  fetchCategoryResults,
})(MapContainer);