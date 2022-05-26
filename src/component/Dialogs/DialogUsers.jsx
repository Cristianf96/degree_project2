import React, { useState, useRef, useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import axios from 'axios';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box, Typography, TextField, Switch, Chip, Paper, IconButton, Card } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { styled } from '@mui/material/styles';

import { registrarUsuario, iniciarSesion } from '../../utils/firebase';

import emailjs from '@emailjs/browser';


const DialogUsers = (props) => {

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_APIKEY,
        libraries: ['places']
    })

    const rol = localStorage.getItem('rol')
    const [error, setError] = useState(false)
    const [signIn, setSignIn] = useState(false)
    const [signUp, setSignUp] = useState(false)
    const [createUsers, setCreateUsers] = useState(false)
    const [recyclingPoint, setRecyclingPoint] = useState(false)
    const [data, setData] = useState({ email: '', name: '', password: '', confirmPassword: '', message: '' })
    const [dataRecyclingPoint, setDataRecyclingPoint] = useState({ name: '', recibe: '', coords: { lat: 0, lng: 0 }, dias: [], horario: '' })
    const [checked, setChecked] = React.useState(true);
    const [chipData, setChipData] = React.useState([
        { key: 0, label: 'Lunes', state: false },
        { key: 1, label: 'Martes', state: false },
        { key: 2, label: 'Miercoles', state: false },
        { key: 3, label: 'Jueves', state: true },
        { key: 4, label: 'Viernes', state: false },
        { key: 5, label: 'Sabado', state: true },
        { key: 6, label: 'Domingo', state: false },
    ]);
    const [map, setMap] = useState(null)
    const [values, setValues] = useState({});
    const [center, setCenter] = useState(null)
    const [local, setLocal] = useState(false);
    const [location, setLocation] = useState(false);

    useEffect(() => {
        const getInformation = () => {
            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            navigator.geolocation.getCurrentPosition(success, errorr, options)
        }
        getInformation()
    }, [])

    function success(pos) {
        var crd = pos.coords;
        setCenter({
            lat: crd.latitude,
            lng: crd.longitude
        })
        setDataRecyclingPoint(
            dataRecyclingPoint => (
                { ...dataRecyclingPoint, coords: { lat: crd.latitude, lng: crd.longitude } }
            )
        )
        setLocal(true)
        setLocation(false)
    };

    function errorr(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    const form = useRef();

    const handleClose = () => {
        setSignUp(false)
        setSignIn(false)
        setError(false)
        setCreateUsers(false)
        setRecyclingPoint(false)
        setData({ email: '', name: '', password: '', confirmPassword: '', message: '' })
        setDataRecyclingPoint({ name: '', recibe: '', coords: {}, dias: [], horario: '' })
    }

    const addUsers = async (add) => {
        if (add && data.email !== '' && data.name !== '' && data.password !== '' && data.confirmPassword !== '') {
            if (data.password === data.confirmPassword && data.password.length >= 6) {
                setError(false)
                try {
                    await registrarUsuario(data.email, data.name, data.password, 'usuario')
                    handleClose()
                    props.handleClickAlert('success', 'Se creo la cuenta con satisfaccion')
                    props.onClose()
                } catch (error) {
                    console.log(error)
                }
            } else {
                handleClose()
                props.handleClickAlert('error', 'No coincide la password o tiene menos de 6 caracteres')
                props.onClose()
            }
        } else if (!add && data.email !== '' && data.name === '' && data.password !== '' && data.confirmPassword === '') {
            setError(false)
            await iniciarSesion(data.email, data.password)
            handleClose()
            props.setReload(true)
            props.handleClickAlert('success', 'Iniciaste Sesion')
            props.onClose()
        } else {
            setError(true)
            setData({ email: '', name: '', password: '', confirmPassword: '' })
        }
    }

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    const createUsersAndPoint = async () => {
        if (createUsers) {
            if (data.email !== '' && data.name !== '' && data.password !== '' && data.confirmPassword !== '') {
                if (data.password === data.confirmPassword && data.password.length >= 6) {
                    setError(false)
                    console.log('checked :>> ', checked);
                    try {
                        await registrarUsuario(data.email, data.name, data.password, checked ? 'admin' : 'usuario')
                        handleClose()
                        props.handleClickAlert('success', 'Se creo la cuenta con satisfaccion')
                        props.onClose()
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    handleClose()
                    props.handleClickAlert('error', 'No coincide la password o tiene menos de 6 caracteres')
                    props.onClose()
                }
            } else {
                setError(true)
                setData({ email: '', name: '', password: '', confirmPassword: '' })
            }
        }

        if (recyclingPoint) {
            console.log('dataRecyclingPoint', dataRecyclingPoint)
            setDataRecyclingPoint({ name: '', recibe: '', coords: { lat: 0, lng: 0 }, dias: [], horario: '' })
        }
    }

    const sendEmail = () => {
        // e.preventDefault();
        emailjs.sendForm('service_zo4kks8', 'template_hu6jnu2', form.current, 'JVvitlmjjpFFhJ_AX')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
    };

    const handleChangeChecked = (event) => {
        setChecked(event.target.checked);
    }

    const handleSelect = (value) => {
        setLocal(false)
        if (value) {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${value.value.place_id}&key=${process.env.REACT_APP_GOOGLEMAPS_APIKEY}`
            axios.get(url)
                .then((response) => {
                    setCenter(response.data['results'][0].geometry.location)
                    setDataRecyclingPoint(
                        dataRecyclingPoint => (
                            { ...dataRecyclingPoint, coords: response.data['results'][0].geometry.location }
                        )
                    )
                    setLocation(true)
                    setValues({})
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    if (!isLoaded) return <div>Loading...</div>

    return (
        <Dialog
            // onClose={props.onClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            maxWidth={'md'}
        // fullWidth
        >
            <DialogTitle>
                Users
            </DialogTitle>
            <DialogContent dividers>
                {rol !== 'staff' ? (
                    <>
                        {!signIn && !signUp && (
                            <Typography variant="subtitle1">
                                Elige la opcion para iniciar sesion o registrarte si no tienes una cuenta
                            </Typography>
                        )}
                        {!signIn && !signUp && (
                            <Stack direction={'row'} spacing={2} sx={{ marginTop: 5 }}>
                                <Box>
                                    <Button variant="contained" size="small" onClick={() => setSignIn(true)}>Iniciar sesion</Button>
                                </Box>
                                <Box>
                                    <Button variant="contained" size="small" onClick={() => setSignUp(true)}>Registrarse</Button>
                                </Box>
                            </Stack>
                        )}
                        {signIn && (
                            <Box>
                                <Typography variant="h5" align='center'>
                                    Iniciar sesion
                                </Typography>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setData(data => ({ ...data, email: e.target.value }))}
                                    error={error}
                                    helperText={error ? 'Este campo es requerido' : null}
                                />
                                <TextField
                                    // autoFocus
                                    margin="dense"
                                    id="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setData(data => ({ ...data, password: e.target.value }))}
                                    error={error}
                                    helperText={error ? 'Este campo es requerido' : null}
                                />
                            </Box>
                        )}
                        {signUp && (
                            <Box>
                                <form ref={form} onSubmit={sendEmail}>
                                    <Typography variant="h5" align='center'>
                                        Registrarse
                                    </Typography>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="email"
                                        label="Email Address"
                                        name='email'
                                        type="email"
                                        fullWidth
                                        variant="outlined"
                                        onChange={(e) => setData(data => ({ ...data, email: e.target.value }))}
                                        error={error && data.email === ''}
                                        helperText={error && data.email === '' ? 'Este campo es requerido' : null}
                                    />
                                    <TextField
                                        // autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Name"
                                        name='name'
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        onChange={(e) => setData(data => ({ ...data, name: e.target.value }))}
                                        error={error && data.name === ''}
                                        helperText={error && data.name === '' ? 'Este campo es requerido' : null}
                                    />
                                    {!checked && (
                                        <Stack direction={'row'} spacing={1}>
                                            <Box>
                                                <TextField
                                                    // autoFocus
                                                    margin="dense"
                                                    id="password"
                                                    label="Password"
                                                    type="password"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={(e) => setData(data => ({ ...data, password: e.target.value }))}
                                                    error={error && data.password === ''}
                                                    helperText={error && data.password === '' ? 'Este campo es requerido' : null}
                                                />
                                            </Box>
                                            <Box>
                                                <TextField
                                                    // autoFocus
                                                    fullWidth
                                                    margin="dense"
                                                    id="confirmPassword"
                                                    label="Confirm password"
                                                    type="password"
                                                    variant="outlined"
                                                    onChange={(e) => setData(data => ({ ...data, confirmPassword: e.target.value }))}
                                                    error={error && data.confirmPassword === ''}
                                                    helperText={error && data.confirmPassword === '' ? 'Este campo es requerido' : null}
                                                />
                                            </Box>
                                        </Stack>
                                    )}
                                    {checked && (
                                        <TextField
                                            // autoFocus
                                            margin="dense"
                                            id="message"
                                            label="Message"
                                            name='message'
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setData(data => ({ ...data, message: e.target.value }))}
                                            error={error && data.message === ''}
                                            helperText={error && data.message === '' ? 'Este campo es requerido' : null}
                                        />
                                    )}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="subtitle1">Usuario</Typography>
                                        <Switch
                                            checked={checked}
                                            onChange={handleChangeChecked}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                        <Typography variant="subtitle1">Administrador</Typography>
                                    </Stack>
                                    {checked ? (
                                        <Typography variant="caption" color={'red'}>Llena estos datos y se comunicaran via correo para darte acceso como Administrador</Typography>
                                    ) : (
                                        <Typography variant="caption" color={'red'}>El rol de Usuario es para aquellos en busca de donde llevar sus materiales</Typography>
                                    )}
                                </form>
                            </Box>
                        )}
                    </>
                ) : (
                    <>
                        {!createUsers && !recyclingPoint && (
                            <>
                                <Typography variant="subtitle1">
                                    Elige la opcion para Crear un usuario o punto de reciclaje
                                </Typography>
                                <Stack direction={'row'} spacing={2} sx={{ marginTop: 5 }}>
                                    <Box>
                                        <Button variant="contained" size="small" onClick={() => setCreateUsers(true)}>Usuarios</Button>
                                    </Box>
                                    <Box>
                                        <Button variant="contained" size="small" onClick={() => setRecyclingPoint(true)}>Punto de reciclaje</Button>
                                    </Box>
                                </Stack>
                            </>
                        )}
                        {createUsers && (
                            <Box>
                                <Box>
                                    <Stack>
                                        <Typography variant="h5" align='center'>
                                            Registrar
                                        </Typography>
                                        <TextField
                                            margin="dense"
                                            id="email"
                                            label="Email Address"
                                            name='email'
                                            type="email"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setData(data => ({ ...data, email: e.target.value }))}
                                            error={error && data.email === ''}
                                            helperText={error && data.email === '' ? 'Este campo es requerido' : null}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            label="Name"
                                            name='name'
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setData(data => ({ ...data, name: e.target.value }))}
                                            error={error && data.name === ''}
                                            helperText={error && data.name === '' ? 'Este campo es requerido' : null}
                                        />
                                        <Stack direction={'row'} spacing={1}>
                                            <Box>
                                                <TextField
                                                    // autoFocus
                                                    margin="dense"
                                                    id="password"
                                                    label="Password"
                                                    type="password"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={(e) => setData(data => ({ ...data, password: e.target.value }))}
                                                    error={error && data.password === ''}
                                                    helperText={error && data.password === '' ? 'Este campo es requerido' : null}
                                                />
                                            </Box>
                                            <Box>
                                                <TextField
                                                    // autoFocus
                                                    fullWidth
                                                    margin="dense"
                                                    id="confirmPassword"
                                                    label="Confirm password"
                                                    type="password"
                                                    variant="outlined"
                                                    onChange={(e) => setData(data => ({ ...data, confirmPassword: e.target.value }))}
                                                    error={error && data.confirmPassword === ''}
                                                    helperText={error && data.confirmPassword === '' ? 'Este campo es requerido' : null}
                                                />
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="subtitle1">Usuario</Typography>
                                            <Switch
                                                checked={checked}
                                                onChange={handleChangeChecked}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <Typography variant="subtitle1">Administrador</Typography>
                                        </Stack>

                                    </Stack>
                                </Box>
                                {checked ? (
                                    <Typography variant="caption" color={'red'}>El rol de Administrador es para los puntos de recoleccion</Typography>
                                ) : (
                                    <Typography variant="caption" color={'red'}>El rol de Usuario es para aquellos en busca de donde llevar sus materiales</Typography>
                                )}
                            </Box>
                        )}
                        {recyclingPoint && (
                            <Box>
                                <Box margin={1}>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="Name"
                                        name='name'
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={dataRecyclingPoint.name}
                                        onChange={(e) => setDataRecyclingPoint(dataRecyclingPoint => ({ ...dataRecyclingPoint, name: e.target.value }))}
                                        error={error && dataRecyclingPoint.name === ''}
                                        helperText={error && dataRecyclingPoint.name === '' ? 'Este campo es requerido' : null}
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
                                        value={dataRecyclingPoint.recibe}
                                        onChange={(e) => setDataRecyclingPoint(dataRecyclingPoint => ({ ...dataRecyclingPoint, recibe: e.target.value }))}
                                        error={error && dataRecyclingPoint.recibe === ''}
                                        helperText={error && dataRecyclingPoint.recibe === '' ? 'Este campo es requerido' : null}
                                    />
                                </Box>
                                <Box textAlign={'center'} margin={1}>
                                    <Typography variant="subtitle1">
                                        Coordenadas
                                    </Typography>
                                    <GoogleMap
                                        zoom={17}
                                        center={center}
                                        mapContainerStyle={{ width: '100%', height: '35vh' }}
                                        options={{
                                            zoomControl: false,
                                            streetViewControl: false,
                                            mapTypeControl: false,
                                            fullscreenControl: false
                                        }}
                                        onLoad={map => setMap(map)}
                                        onClick={(event) => {
                                            setDataRecyclingPoint(
                                                dataRecyclingPoint => (
                                                    { ...dataRecyclingPoint, coords: { lat: event.latLng.lat(), lng: event.latLng.lng() } }
                                                )
                                            )
                                                ; setLocation(true); setLocal(false)
                                        }}
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
                                                    <IconButton aria-label="location" size="large" color={'inherit'} onClick={() => map.panTo(center)}>
                                                        <MyLocationIcon fontSize="inherit" />
                                                    </IconButton>
                                                </Card>
                                            </Box>
                                        </Stack>
                                        {location && (
                                            <Marker position={dataRecyclingPoint.coords} icon={'/pin.png'} onClick={() => console.log('esta es su ubicacion para crear')} />
                                        )}

                                        {local && (
                                            <Marker position={center} icon={'/pin.png'} onClick={() => console.log('tu ubicacion')} />
                                        )}
                                    </GoogleMap>
                                </Box>
                                <Box textAlign={'center'} margin={1}>
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
                                        {chipData.map((data) => {

                                            return (
                                                <>
                                                    {data.state ? (
                                                        <ListItem key={data.key}>
                                                            <Chip
                                                                // icon={icon}
                                                                label={data.label}
                                                                onDelete={handleDelete(data)}
                                                                color={'success'}
                                                            />
                                                        </ListItem>
                                                    ) : (
                                                        <ListItem key={data.key}>
                                                            <Chip
                                                                // icon={<DoneIcon />}
                                                                label={data.label}
                                                                onDelete={() => console.log('debe entrar al array', data.key, data.label)}
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
                                    <Stack direction={'row'} spacing={1} justifyContent={'center'}>
                                        <Box>
                                            <TextField
                                                label="Inicio"
                                                type="time"
                                                defaultValue="07:30"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                sx={{ width: 150 }}
                                            />
                                        </Box>
                                        <Box>
                                            <TextField
                                                label="Fin"
                                                type="time"
                                                defaultValue="10:30"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                sx={{ width: 150 }}
                                            />
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {rol !== 'staff' ? (
                    <>
                        {signIn || signUp ? (
                            <Box>
                                <Stack direction={'row'} spacing={1}>
                                    {checked && signUp ? (
                                        <Button onClick={() => sendEmail()} variant="contained" color="success" type='submit'>
                                            {'Contacto'}
                                        </Button>
                                    ) : (
                                        <Button onClick={() => signUp ? addUsers(true) : addUsers(false)} variant="contained" color="success">
                                            {signUp ? 'Registrarme' : 'Iniciar sesion'}
                                        </Button>
                                    )}
                                    <Button onClick={handleClose} variant="contained" color="error">
                                        Atras
                                    </Button>
                                </Stack>
                            </Box>
                        ) : (
                            <Button onClick={props.onClose} variant="contained" color="error">
                                Cancelar
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        {createUsers || recyclingPoint ? (
                            <Box>
                                <Stack direction={'row'} spacing={1}>
                                    <Button onClick={() => createUsersAndPoint()} variant="contained" color="success">
                                        {'Crear'}
                                    </Button>
                                    <Button onClick={handleClose} variant="contained" color="error">
                                        Atras
                                    </Button>
                                </Stack>
                            </Box>
                        ) : (
                            <Button onClick={props.onClose} variant="contained" color="error">
                                Cancelar
                            </Button>
                        )}
                    </>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default DialogUsers