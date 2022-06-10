import React, { useEffect, useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import axios from 'axios';

import { Box, SpeedDial, SpeedDialAction, Backdrop, Snackbar, IconButton, Card, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GiteIcon from '@mui/icons-material/Gite';

import DialogTips from '../../component/Dialogs/DialogTips';
import DialogUsers from '../../component/Dialogs/DialogUsers';
import DialogForum from '../../component/Dialogs/DialogForum';
import DialogProfile from '../../component/Dialogs/DialogProfile';
import DialogRecyclePoint from '../../component/Dialogs/DialogRecyclePoint';

import { logout, queryData } from '../../utils/firebase';

let actions = [
  { icon: <TipsAndUpdatesIcon />, name: 'Consejos' },
  { icon: <PersonIcon />, name: 'Usuarios' },
  { icon: <ForumIcon />, name: 'Foro' },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// const libraries = [`places`];

function Maps() {

  const session = localStorage.getItem('user') ?? ""
  const rol = localStorage.getItem('rol') ?? ""
  const [center, setCenter] = useState(null)
  const [markers, setMarkers] = useState([]);
  const [position, setPosition] = useState(null)
  // const [destino, setDestino] = useState(null)
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [local, setLocal] = useState(false);
  const [location, setLocation] = useState(false);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [openDialogTips, setOpenDialogTips] = useState(false)
  const [openDialogUsers, setOpenDialogUsers] = useState(false)
  const [openDialogForum, setOpenDialogForum] = useState(false)
  const [openDialogProfile, setOpenDialogProfile] = useState(false)
  const [openDialogRecyclePoint, setOpenDialogRecyclePoint] = useState(false)
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [message, setMessage] = useState('');
  const [pointId, setpointId] = useState('');
  const [pointIdClik, setpointIdClick] = useState('');
  const [values, setValues] = useState({});
  const [dataRecyclePoint, setDataRecyclePoint] = useState({});
  // const [directionResponse, setDirectionResponse] = useState(null)
  // const [distance, setDistance] = useState('')
  // const [duration, setDuration] = useState('')

  // const originRef = useRef()
  // const destinationRef = useRef()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_APIKEY,
    libraries: ['places']
  })

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const calculateRoute = async () => {
  //   // if(directionResponse){
  //   //   clearRoute()
  //   //   calculateRoute()
  //   // }
  //   const arrayPosition = []
  //   const arrayDestino = []
  //   Object.keys(position).forEach((item) => {
  //     if (item === 'lat') {
  //       arrayPosition.push(position[item])
  //     } else {
  //       arrayPosition.push(position[item])
  //     }
  //   })
  //   Object.keys(destino).forEach((item) => {
  //     if (item === 'lat') {
  //       arrayDestino.push(destino[item])
  //     } else {
  //       arrayDestino.push(destino[item])
  //     }
  //   })
  //   const stringPosition = arrayPosition.toString()
  //   const stringDestino = arrayDestino.toString()
  //   if (stringDestino === '' || stringPosition === '') return

  //   // eslint-disable-next-line no-undef
  //   const directionsService = new google.maps.DirectionsService()
  //   const results = await directionsService.route({
  //     origin: stringPosition,
  //     destination: stringDestino,
  //     // eslint-disable-next-line no-undef
  //     travelMode: google.maps.TravelMode.DRIVING,
  //   })
  //   if (results) {
  //     setDirectionResponse(results)
  //     handleCloseDialog()
  //   }
  //   // console.log('results.routes[0].legs[0].distance.text :>> ', results.routes[0].legs[0].distance.text);
  //   // console.log('results.routes[0].legs[0].duration.text :>> ', results.routes[0].legs[0].duration.text);
  // }

  // const clearRoute = () => {
  //   setDirectionResponse(null)
  //   // setDistance('')
  //   // setDuration('')
  //   // originRef.current.value = ''
  //   // destinationRef.current.value = ''
  // }

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
    // console.log('crd :>> ', crd);
    setLocal(true)
    setLocation(false)
  };

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  };

  useEffect(() => {
    const getInformation = async () => {
      if (reload) {
        setReload(false)
      }
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(success, error, options)
      const found = actions.find(element => element.name === 'Cerrar sesion');
      let userPositionId = []
      if (session && !found && rol) {
        if (rol === 'staff') {
          actions = [
            { icon: <PersonIcon />, name: 'Perfil' },
            { icon: <TipsAndUpdatesIcon />, name: 'Consejos' },
            { icon: <ForumIcon />, name: 'Foro' },
            { icon: <GroupAddIcon />, name: 'Crear' },
            { icon: <LogoutIcon />, name: 'Cerrar sesion' },
          ]
        }
        if (rol === 'usuario') {
          actions = [
            { icon: <PersonIcon />, name: 'Perfil' },
            { icon: <TipsAndUpdatesIcon />, name: 'Consejos' },
            { icon: <ForumIcon />, name: 'Foro' },
            { icon: <LogoutIcon />, name: 'Cerrar sesion' }
          ]
        }
        if (rol === 'admin') {
          actions = [
            { icon: <PersonIcon />, name: 'Perfil' },
            { icon: <TipsAndUpdatesIcon />, name: 'Consejos' },
            { icon: <ForumIcon />, name: 'Foro' },
            { icon: <GiteIcon />, name: 'Punto' },
            { icon: <LogoutIcon />, name: 'Cerrar sesion' }
          ]
          const dataUsers = await queryData('users')
          const user = dataUsers.docs
          if (user) {
            user.forEach((doc) => {
              if (doc.data().uid === session) {
                userPositionId.push({ data: doc.data(), idUser: doc.id })
              }
            })
          }
        }
      }
      const dataLocations = await queryData('locations')
      const positions = dataLocations.docs
      if (positions) {
        let Markers = []
        let pointAdmin = []
        let pointId = []
        positions.forEach((doc) => {
          Markers.push({ data: doc.data(), id: doc.id })
          if (rol === 'admin' && doc.id === userPositionId[0].data.recyclePoint) {
            pointAdmin.push(doc.data())
            pointId.push(doc.id)
          }
        })
        if (rol === 'admin') {
          setCenter(pointAdmin[0].Coords)
          setDataRecyclePoint(pointAdmin[0])
          setpointId(pointId[0])
        }
        setMarkers(Markers)
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
      case 'Consejos':
        setOpenDialogTips(true)
        break;
      case 'Usuarios':
        setOpenDialogUsers(true)
        break;
      case 'Cerrar sesion':
        logout()
        window.location.reload()
        break;
      case 'Foro':
        setOpenDialogForum(true)
        break;
      case 'Crear':
        setOpenDialogUsers(true)
        break
      case 'Perfil':
        setOpenDialogProfile(true)
        break;
      case 'Punto':
        handleOpenRecyclePoint(dataRecyclePoint)
        break;
      default:
        break;
    }
  }

  const handleCloseDialog = () => {
    setOpenDialogTips(false)
    setOpenDialogUsers(false)
    setOpenDialogForum(false)
    setOpenDialogProfile(false)
    setOpenDialogRecyclePoint(false)
    setValues({})
    handleClose()
    // setDataRecyclePoint(null)
  }

  const handleSelect = (value) => {
    setLocal(false)
    if (value) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${value.value.place_id}&key=${process.env.REACT_APP_GOOGLEMAPS_APIKEY}`
      axios.get(url)
        .then((response) => {
          setCenter(response.data['results'][0].geometry.location)
          setLocation(true)
          setValues({})
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  const handleOpenRecyclePoint = (recyclePoint, id) => {
    // console.log('recyclePoint', recyclePoint)
    // console.log('id :>> ', id);
    setDataRecyclePoint(recyclePoint)
    setpointIdClick(id)
    setOpenDialogRecyclePoint(true)
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
              <Marker position={position} icon={'/pin.png'} onCLick={() => console.log('este es su ubicacion 1')} />
            )}
            {location && (
              <Marker position={center} icon={'/pin.png'} onCLick={() => console.log('este es su ubicacion 2')} />
            )}
            {markers.map((marker, key) => {
              return (
                <Marker key={key} position={marker.data.Coords} icon={'/centro-de-reciclaje-3d-30.png'} onClick={() => { handleOpenRecyclePoint(marker.data, marker.id); }} />
              )
            })}
            {/* {directionResponse && <DirectionsRenderer directions={directionResponse} />} */}
          </GoogleMap>
        </Box>
        <Box sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
        }}>
          {/* <DialogSearch open={openDialogSearch} onClose={handleCloseDialog} setReload={setReload} /> */}
          {openDialogProfile && (
            <DialogProfile open={openDialogProfile} onClose={handleCloseDialog} setReload={setReload} />
          )}
          {openDialogTips && (
            <DialogTips open={openDialogTips} onClose={handleCloseDialog} setReload={setReload} />
          )}
          {openDialogUsers && (
            <DialogUsers open={openDialogUsers} onClose={handleCloseDialog} setReload={setReload} handleClickAlert={handleClickAlert} />
          )}
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
          {openDialogForum && (
            <DialogForum open={openDialogForum} onClose={handleCloseDialog} setReload={setReload} />
          )}
          {openDialogRecyclePoint && (
            <DialogRecyclePoint
              open={openDialogRecyclePoint}
              onClose={handleCloseDialog}
              setReload={setReload}
              dataRecyclePoint={dataRecyclePoint}
              pointId={pointId}
              setDataRecyclePoint={setDataRecyclePoint}
              pointIdClik={pointIdClik}
            />
          )}
        </Box>
        <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleCloseAlert} sx={{ zIndex: 10 }} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  )
}

export default Maps