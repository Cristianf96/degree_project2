import React, { useEffect, useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import axios from 'axios';

import { Box, SpeedDial, SpeedDialAction, Backdrop, Snackbar, IconButton, Card, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
// import SearchIcon from '@mui/icons-material/Search';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import DialogTips from '../../component/Dialogs/DialogTips';
import DialogUsers from '../../component/Dialogs/DialogUsers';
import DialogForum from '../../component/Dialogs/DialogForum';

import { logout, queryData } from '../../utils/firebase';

let actions = [
  { icon: <TipsAndUpdatesIcon />, name: 'Tips' },
  { icon: <PersonIcon />, name: 'Users' },
  { icon: <ForumIcon />, name: 'Forum' },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Maps() {

  const session = localStorage.getItem('user') ?? ""
  const rol = localStorage.getItem('rol') ?? ""
  const [center, setCenter] = useState(null)
  const [markers, setMarkers] = useState([]);
  const [position, setPosition] = useState(null)
  const [map, setMap] = useState(null)
  const [local, setLocal] = useState(false);
  const [location, setLocation] = useState(false);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [openDialogTips, setOpenDialogTips] = useState(false)
  const [openDialogUsers, setOpenDialogUsers] = useState(false)
  const [openDialogForum, setOpenDialogForum] = useState(false)
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [message, setMessage] = useState('');
  const [values, setValues] = useState({});

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_APIKEY,
    libraries: ['places']
  })

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  function success(pos) {
    var crd = pos.coords;
    setCenter({
      lat: crd.latitude,
      lng: crd.longitude
    })
    setPosition({
      lat: crd.latitude,
      lng: crd.longitude
    })
    setLocal(true)
    setLocation(false)
  };

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  };

  useEffect(() => {
    const getInformation = async () => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(success, error, options)
      const found = actions.find(element => element.name === 'Logout');
      if (session && !found && rol) {
        if (rol === 'staff') {
          actions = [
            { icon: <PersonIcon />, name: 'Profile' },
            { icon: <TipsAndUpdatesIcon />, name: 'Tips' },
            { icon: <ForumIcon />, name: 'Forum' },
            { icon: <GroupAddIcon />, name: 'Create' },
            { icon: <LogoutIcon />, name: 'Logout' },
          ]
        }
        if (rol === 'usuario') {
          actions = [
            { icon: <PersonIcon />, name: 'Profile' },
            { icon: <TipsAndUpdatesIcon />, name: 'Tips' },
            { icon: <ForumIcon />, name: 'Forum' },
            { icon: <LogoutIcon />, name: 'Logout' }
          ]
        }
      }
      const dataUsers = await queryData('locations')
      const positions = dataUsers.docs
      if (positions) {
        let Markers = []
        positions.forEach((doc) => {
          Markers.push(doc.data())
        })
        console.log('Markers', Markers)
        setMarkers(Markers)
      }
      if (reload) {
        setReload(false)
      }
    }
    getInformation()
  }, [reload, rol, session])

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const handleClickAlert = (sev, mes) => {
    setMessage(mes)
    setSeverity(sev)
    setOpenAlert(true);
  };

  const handleOption = (action) => {
    switch (action) {
      case 'Tips':
        setOpenDialogTips(true)
        break;
      case 'Users':
        setOpenDialogUsers(true)
        break;
      case 'Logout':
        logout()
        window.location.reload()
        break;
      case 'Forum':
        setOpenDialogForum(true)
        break;
      case 'Create':
        setOpenDialogUsers(true)
        break
      default:
        break;
    }
  }

  const handleCloseDialog = () => {
    setOpenDialogTips(false)
    setOpenDialogUsers(false)
    setOpenDialogForum(false)
    setValues({})
    handleClose()
    // setReload(true)
  }

  const handleSelect = (value) => {
    setLocal(false)
    if (value) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${value.value.place_id}&key=${process.env.REACT_APP_GOOGLEMAPS_APIKEY}`
      axios.get(url)
        .then((response) => {
          setCenter(response.data['results'][0].geometry.location)
          setLocation(true)
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  if (!isLoaded) return <div>Loading...</div>

  return (
    <>
      <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1, height: '100vh' }}>
        <Box sx={{ zIndex: 'modal' }}>
          <GoogleMap
            zoom={17}
            center={center}
            mapContainerStyle={{ width: '100%', height: '100vh' }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false
            }}
            onLoad={map => setMap(map)}
          >
            <Box sx={{
              position: 'absolute',
              top: 20,
              left: 10,
            }}>
              <Backdrop open={open} />
              <SpeedDial
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', color: 'green' }}
                icon={<SpeedDialIcon />}
                direction='down'
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    tooltipPlacement='right'
                    onClick={() => handleOption(action.name)}
                  />
                ))}
              </SpeedDial>
              <Box sx={{ marginLeft: 8, padding: 1, minWidth: 100 }}>
                <Stack direction={'row'} spacing={1}>
                  <Box sx={{ width: '250px', fontFamily: 'monospace', fontSize: 15 }}>
                    <GooglePlacesAutocomplete
                      apiKey={process.env.REACT_APP_GOOGLEMAPS_APIKEY ?? ""}
                      selectProps={{
                        values,
                        isClearable: true,
                        onChange: (value) => {
                          handleSelect(value)
                        },
                        placeholder: 'Buscar...'
                      }}
                      onLoadFailed={(error) => (
                        console.error("Could not inject Google script", error)
                      )}
                    />
                  </Box>
                </Stack>
              </Box>
            </Box>
            {local && (
              <Marker position={position} icon={'/pin.png'} onClick={() => console.log('esta es su ubicacion')} />
            )}
            {location && (
              <Marker position={center} icon={'/pin.png'} onClick={() => console.log('esta es su ubicacion')} />
            )}
            {markers.map((marker, key) => {
              return (
                <Marker key={key} position={marker.Coords} icon={'/centro-de-reciclaje-3d-30.png'} onClick={() => console.log(marker)} />
              )
            })}
          </GoogleMap>
        </Box>
        <Box sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
        }}>
          {/* <DialogSearch open={openDialogSearch} onClose={handleCloseDialog} setReload={setReload} /> */}
          <DialogTips open={openDialogTips} onClose={handleCloseDialog} setReload={setReload} />
          <DialogUsers open={openDialogUsers} onClose={handleCloseDialog} setReload={setReload} handleClickAlert={handleClickAlert} />
          <Card sx={{ marginTop: '85vh', borderRadius: 20 }}>
            <Stack>
              {/* <IconButton aria-label="navigate" size="large" color={'inherit'}>
                <NavigationIcon fontSize="inherit" />
              </IconButton> */}
              <IconButton aria-label="location" size="large" color={'inherit'} onClick={() => local ? map.panTo(center) : setReload(true)}>
                <MyLocationIcon fontSize="inherit" />
              </IconButton>
            </Stack>
          </Card>
          <DialogForum open={openDialogForum} onClose={handleCloseDialog} setReload={setReload} />
        </Box>
        <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleCloseAlert} sx={{ zIndex: 10 }}>
          <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  )
}

export default Maps