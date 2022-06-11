import React, { useState, useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import axios from 'axios';
import moment from 'moment';
import { queryData, updateData } from '../../utils/firebase';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Box, Paper, Chip, Badge, Divider, IconButton, Tooltip, TextField, Card, Snackbar } from '@mui/material';
import GiteIcon from '@mui/icons-material/Gite';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DoneIcon from '@mui/icons-material/Done';
import { styled } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';

// import NavigationIcon from '@mui/icons-material/Navigation';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DialogRecyclePoint = (props) => {

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_APIKEY,
        libraries: ['places']
    })

    const rol = localStorage.getItem('rol')
    const [edit, setEdit] = useState(true)
    const isRecoleccionTitle = 'Horario de recoleccion'
    const isRecibeTitle = 'Recibe'
    const [error, setError] = useState(false)
    const [load, setLoad] = useState(false)
    const [dataEdit, setDataEdit] = useState({
        Coords: {},
        Dias: [],
        Name: '',
        Recibe: '',
        dateInicial: '',
        dateFinal: '',
    })
    const [map, setMap] = useState(null)
    const [values, setValues] = useState({});
    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [count, setCount] = useState(0)

    useEffect(() => {
        const getInformation = async () => {
            // console.log('props.pointId :>> ', props.pointId);
            // console.log('props.dataRecyclePoint :>> ', props.dataRecyclePoint);
            if (load) {
                setLoad(false)
            }
            if (rol === 'admin') {
                console.log('props.pointIdClik :>> ', props.pointIdClik);
                const uid = localStorage.getItem('user')
                console.log('uid :>> ', uid);
                const dataForum = await queryData('forum')
                const dataF = dataForum.docs
                let count = 0
                if (dataF) {
                    dataF.forEach((doc) => {
                        if (doc.data().adminId && doc.data().adminId === uid) {
                            count++
                        }
                    })
                    setCount(count)
                }
            }
        }
        getInformation()
    }, [load, props, rol])


    const handleSelect = (value) => {
        if (value) {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${value.value.place_id}&key=${process.env.REACT_APP_GOOGLEMAPS_APIKEY}`
            axios.get(url)
                .then((response) => {
                    // setCenter(response.data['results'][0].geometry.location)
                    setDataEdit(dataEdit => ({ ...dataEdit, Coords: response.data['results'][0].geometry.location }))
                    // setLocation(true)
                    setValues({})
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    const handleChangeDays = (chipToDelete) => () => {
        dataEdit.Dias.forEach(item => {
            if (item.key === chipToDelete.key) {
                item.state = !item.state
            }
        })
        setDataEdit(dataEdit => ({ ...dataEdit, Dias: dataEdit.Dias }))
        // setDataRecyclingPoint(dataRecyclingPoint => ({ ...dataRecyclingPoint, dias: chipData }))
    };

    const handleOpenEdit = (data) => {
        // console.log('data :>> ', data);
        setDataEdit(data)
        setEdit(!edit)
    }

    const handleClickAlert = (sev, mes) => {
        setMessage(mes)
        setSeverity(sev)
        setOpenAlert(true);
    };

    const updateDataUser = async (status) => {
        if (status) {
            await updateData('locations', props.pointId, dataEdit)
            handleClickAlert('success', 'El perfil se a actualizado satisfactoriamente')
            props.setDataRecyclePoint(dataEdit)
            setLoad(true)
            setEdit(!edit)
        } else {
            setError(true)
        }
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    if (!isLoaded) return <div>Loading...</div>

    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            open={props.open}
            fullWidth
        >
            <DialogTitle>
                <Stack direction={'row'} justifyContent={'space-between'} sx={{ margin: 1 }}>
                    <Typography variant='h6'>
                        {props.dataRecyclePoint.Name}
                    </Typography>
                    <Box>
                        <Stack direction={'row'} spacing={1}>
                            {rol === 'admin' && props.pointIdClik === props.pointId && (
                                <>
                                    <Tooltip title={edit ? "Edit" : 'Save'}>
                                        {edit ? (
                                            <IconButton onClick={() => handleOpenEdit(props.dataRecyclePoint)}>
                                                <EditIcon sx={{ color: 'black' }} />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => updateDataUser(true)}>
                                                <SaveIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        )}
                                    </Tooltip>
                                </>
                            )}
                            {rol === 'staff' && (
                                <>
                                    <Tooltip title={edit ? "Edit" : 'Save'}>
                                        {edit ? (
                                            <IconButton onClick={() => handleOpenEdit(props.dataRecyclePoint)}>
                                                <EditIcon sx={{ color: 'black' }} />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => updateDataUser(true)}>
                                                <SaveIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        )}
                                    </Tooltip>
                                </>
                            )}
                            <Badge badgeContent={rol === 'admin' && props.pointIdClik === props.pointId ? count : 0} color="primary">
                                <GiteIcon fontSize='large' />
                            </Badge>
                        </Stack>
                    </Box>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                {edit ? (
                    <Box margin={2}>
                        <Stack>
                            <Box textAlign={'center'} margin={0.2}>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    {isRecoleccionTitle.toUpperCase()}
                                </Typography>
                            </Box>
                            <Stack direction={'row'}>
                                <Box textAlign={'center'} margin={1}>
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                            listStyle: 'none',
                                            p: 0.5,
                                            m: 0,
                                        }}
                                        component="ul"
                                    >
                                        {props.dataRecyclePoint.Dias && props.dataRecyclePoint.Dias.map((data) => {

                                            return (
                                                <>
                                                    <Box margin={0.2}>
                                                        <Chip
                                                            label={data.label}
                                                            color={data.state ? 'success' : 'error'}
                                                        />
                                                    </Box>
                                                </>
                                            );
                                        })}
                                    </Paper>
                                </Box>
                            </Stack>
                            <Box marginBottom={1}>
                                <Stack direction={'row'} spacing={1} justifyContent={'center'}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {props.dataRecyclePoint.dateInicial}{' - '}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {props.dataRecyclePoint.dateFinal}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Divider textAlign="center">| |</Divider>
                            <Box textAlign={'center'} margin={1}>
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                    {isRecibeTitle.toUpperCase()}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                <Paper sx={{ padding: 1, borderRadius: 20 }} elevation={2}>
                                    <Typography variant="h6" sx={{ fontWeight: 400 }}>
                                        {props.dataRecyclePoint.Recibe}
                                    </Typography>
                                </Paper>
                            </Box>
                        </Stack>
                    </Box>
                ) : (
                    <>
                        <Box>
                            <Box margin={1}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Nombre del punto"
                                    name='name'
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={dataEdit.Name}
                                    onChange={(e) => setDataEdit(dataEdit => ({ ...dataEdit, Name: e.target.value }))}
                                    error={error && dataEdit.Name === ''}
                                    helperText={error && dataEdit.Name === '' ? 'Este campo es requerido' : null}
                                />
                            </Box>
                            <Box margin={1}>
                                <TextField
                                    margin="dense"
                                    id="recibe"
                                    label="Material que recibe"
                                    name='recibe'
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={dataEdit.Recibe}
                                    onChange={(e) => setDataEdit(dataEdit => ({ ...dataEdit, Recibe: e.target.value }))}
                                    error={error && dataEdit.Recibe === ''}
                                    helperText={error && dataEdit.Recibe === '' ? 'Este campo es requerido' : null}
                                />
                            </Box>
                            <Box textAlign={'center'} margin={1}>
                                <Typography variant="subtitle1">
                                    Coordenadas
                                </Typography>
                                <GoogleMap
                                    zoom={17}
                                    center={dataEdit.Coords}
                                    mapContainerStyle={{ width: '100%', height: '35vh' }}
                                    options={{
                                        zoomControl: false,
                                        streetViewControl: false,
                                        mapTypeControl: false,
                                        fullscreenControl: false
                                    }}
                                    onLoad={map => setMap(map)}
                                >
                                    <Stack direction={'row'}>
                                        <Box sx={{ width: '230px', fontFamily: 'monospace', fontSize: 15, zIndex: 10, margin: 1 }}>
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
                                            <Card sx={{ marginTop: '10px', borderRadius: 20, zIndex: 20, width: '51px', marginLeft: 0.5 }}>
                                                <IconButton aria-label="location" size="large" color={'inherit'} onClick={() => map.panTo(dataEdit.Coords)}>
                                                    <MyLocationIcon fontSize="inherit" />
                                                </IconButton>
                                            </Card>
                                        </Box>
                                    </Stack>
                                    <Marker position={dataEdit.Coords} icon={'/pin.png'} />
                                </GoogleMap>
                            </Box>
                            <Stack direction={'row'}>
                                <Box textAlign={'center'} margin={1} width={'90%'}>
                                    <Typography variant="subtitle1">
                                        Dias
                                    </Typography>
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                            listStyle: 'none',
                                            p: 0.5,
                                            m: 0,
                                        }}
                                        component="ul"
                                    >
                                        {dataEdit.Dias && dataEdit.Dias.map((data) => {

                                            return (
                                                <>
                                                    {data.state ? (
                                                        <ListItem key={data.key}>
                                                            <Chip
                                                                label={data.label}
                                                                onDelete={handleChangeDays(data)}
                                                                color={'success'}
                                                            />
                                                        </ListItem>
                                                    ) : (
                                                        <ListItem key={data.key}>
                                                            <Chip
                                                                label={data.label}
                                                                onDelete={handleChangeDays(data)}
                                                                deleteIcon={<DoneIcon />}
                                                                color={'error'}
                                                            />
                                                        </ListItem>
                                                    )}
                                                </>
                                            );
                                        })}
                                    </Paper>
                                </Box>
                                <Box textAlign={'center'} margin={1}>
                                    <Typography variant="subtitle1">
                                        Horario
                                    </Typography>
                                    <Stack spacing={3} justifyContent={'center'}>
                                        <Box>
                                            <TextField
                                                label="Abre"
                                                type="time"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={dataEdit.dateInicial}
                                                onChange={(e) => setDataEdit(dataEdit => ({ ...dataEdit, dateInicial: moment(e.target.value, 'HH:mm').format('HH:mm') }))}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                sx={{ width: 120 }}
                                                error={error && dataEdit.dateInicial === ''}
                                                helperText={error && dataEdit.dateInicial === '' ? 'Este campo es requerido' : null}
                                            />
                                        </Box>
                                        <Box>
                                            <TextField
                                                label="Cierra"
                                                type="time"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={dataEdit.dateFinal}
                                                onChange={(e) => setDataEdit(dataEdit => ({ ...dataEdit, dateFinal: moment(e.target.value, 'HH:mm').format('HH:mm') }))}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                sx={{ width: 120 }}
                                                error={error && dataEdit.dateFinal === ''}
                                                helperText={error && dataEdit.dateFinal === '' ? 'Este campo es requerido' : null}
                                            />
                                        </Box>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} variant="contained" color="error">
                    Cancelar
                </Button>
            </DialogActions>
            <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleCloseAlert} sx={{ zIndex: 10 }} anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}>
                <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Dialog>
    )
}

export default DialogRecyclePoint