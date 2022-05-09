import React, { useMemo, useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'

import { Box, SpeedDial, SpeedDialAction, Backdrop } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

import DialogSearch from '../../component/Dialogs/DialogSearch';
import DialogTips from '../../component/Dialogs/DialogTips';

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_APIKEY
  })

  if (!isLoaded) return <div>Loading...</div>
  return <Maps />
}

const actions = [
  { icon: <SearchIcon />, name: 'Search' },
  { icon: <TipsAndUpdatesIcon />, name: 'Tips' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

function Maps() {
  const center = useMemo(() => ({ lat: 6.24788328286821, lng: -75.560914441354 }), [])
  const Markers = [{ lat: 6.24788328286821, lng: -75.560914441354 }, { lat: 44, lng: -80 }]
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openDialogSearch, setOpenDialogSearch] = useState(false)
  const [openDialogTips, setOpenDialogTips] = useState(false)

  const handleOption = (action) => {
    console.log(action);
    switch (action) {
      case 'Search':
        setOpenDialogSearch(true)
        break;
      case 'Tips':
        setOpenDialogTips(true)
        break;

      default:
        break;
    }
  }

  const handleCloseDialog = () => {
    setOpenDialogSearch(false)
    setOpenDialogTips(false)
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
          >
            <Box sx={{
              position: 'absolute',
              top: 20,
              left: 20,
            }}>
              <Backdrop open={open} />
              <SpeedDial
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute' }}
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
            </Box>
            {Markers.map((marker, key) => {
              return (
                <Marker key={key} position={marker} />
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
          <DialogSearch open={openDialogSearch} onClose={handleCloseDialog} />
          <DialogTips open={openDialogTips} onClose={handleCloseDialog} />
        </Box>
      </Box>
    </>
  )
}