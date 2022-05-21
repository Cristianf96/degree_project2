import React, { useEffect, useMemo, useState } from 'react'
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api'

import { Box, SpeedDial, SpeedDialAction, Backdrop, Snackbar, IconButton, Card, TextField, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
// import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import MyLocationIcon from '@mui/icons-material/MyLocation';

import DialogSearch from '../../component/Dialogs/DialogSearch';
import DialogTips from '../../component/Dialogs/DialogTips';
import DialogUsers from '../../component/Dialogs/DialogUsers';
import DialogForum from '../../component/Dialogs/DialogForum';

import { logout, queryData } from '../../utils/firebase';

let actions = [
  { icon: <SearchIcon />, name: 'Search' },
  { icon: <TipsAndUpdatesIcon />, name: 'Tips' },
  { icon: <PersonIcon />, name: 'Users' },
  { icon: <ForumIcon />, name: 'Forum' },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Maps() {
  const session = localStorage.getItem('user') ?? ""
  const center = useMemo(() => ({ lat: 6.24788328286821, lng: -75.560914441354 }), [])
  const Markers = [{ lat: 6.24788328286821, lng: -75.560914441354 }, { lat: 44, lng: -80 }]
  const [map, setMap] = useState(null)
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [openDialogSearch, setOpenDialogSearch] = useState(false)
  const [openDialogTips, setOpenDialogTips] = useState(false)
  const [openDialogUsers, setOpenDialogUsers] = useState(false)
  const [openDialogForum, setOpenDialogForum] = useState(false)
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [message, setMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_APIKEY,
    libraries: ['places']
  })

  useEffect(() => {
    const getInformation = async () => {
      const found = actions.find(element => element.name === 'Logout');
      if (reload) {
        setReload(false)
      }
      if (session && !found) {
        actions = [
          { icon: <PersonIcon />, name: 'Profile' },
          { icon: <SearchIcon />, name: 'Search' },
          { icon: <TipsAndUpdatesIcon />, name: 'Tips' },
          { icon: <ForumIcon />, name: 'Forum' },
          { icon: <LogoutIcon />, name: 'Logout' }
        ]
        const dataUsers = await queryData('users')
        const users = dataUsers.docs
        const user = users.find(doc => doc?.data().uid === session)?.data()
        console.log(user)
      }
    }
    getInformation()
  }, [reload, session])

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
      case 'Search':
        setOpenDialogSearch(true)
        break;
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

      default:
        break;
    }
  }

  const handleCloseDialog = () => {
    setOpenDialogSearch(false)
    setOpenDialogTips(false)
    setOpenDialogUsers(false)
    setOpenDialogForum(false)
    handleClose()
    setReload(true)
  }

  if (!isLoaded) return <div>Loading...</div>

  const onPlaceChanged = () => {
    if (this.autocomplete !== null) {
      console.log(this.autocomplete.getPlace())
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  return (
    <>
      <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1, height: '100vh' }}>
        <Box sx={{ zIndex: 'modal' }}>
          <GoogleMap
            zoom={15}
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
              <Card sx={{ marginLeft: 8, padding: 1, minWidth: 100 }} elevation={3}>
                <Stack direction={'row'} spacing={1}>
                  <Autocomplete onPlaceChanged={onPlaceChanged}>
                    <TextField
                      fullWidth
                      label={'Ubicacion'}
                      size={'small'}
                      variant="outlined"
                    // onChange={(e) => console.log('coord', e.target.value)}
                    />
                  </Autocomplete>
                  <IconButton aria-label="delete" size="medium" color={'inherit'} onClick={() => map.panTo(center)}>
                    <MyLocationIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
              </Card>
            </Box>
            {Markers.map((marker, key) => {
              return (
                <Marker key={key} position={marker} onClick={() => console.log(marker.lat, marker.lng)} />
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
          <DialogSearch open={openDialogSearch} onClose={handleCloseDialog} setReload={setReload} />
          <DialogTips open={openDialogTips} onClose={handleCloseDialog} setReload={setReload} />
          <DialogUsers open={openDialogUsers} onClose={handleCloseDialog} setReload={setReload} handleClickAlert={handleClickAlert} />
          <DialogForum open={openDialogForum} onClose={handleCloseDialog} setReload={setReload} />
        </Box>
        <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  )
}

export default Maps