import React, { useState, useRef } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box, Typography, TextField, Switch } from '@mui/material';

import { registrarUsuario, iniciarSesion } from '../../utils/firebase';

import emailjs from '@emailjs/browser';

const DialogUsers = (props) => {

    const [error, setError] = useState(false)
    const [signIn, setSignIn] = useState(false)
    const [signUp, setSignUp] = useState(false)
    const [data, setData] = useState({ email: '', name: '', password: '', confirmPassword: '', message: '' })
    const [checked, setChecked] = React.useState(true);

    const form = useRef();

    const handleClose = () => {
        setSignUp(false)
        setSignIn(false)
        setError(false)
        setData({ email: '', name: '', password: '', confirmPassword: '', message: '' })
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
            props.handleClickAlert('success', 'Iniciaste Sesion')
            props.onClose()
        } else {
            setError(true)
            setData({ email: '', name: '', password: '', confirmPassword: '' })
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

    return (
        <Dialog
            // onClose={props.onClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            maxWidth={'md'}
        >
            <DialogTitle>
                Users
            </DialogTitle>
            <DialogContent dividers>
                {!signIn && !signUp && (
                    <Typography variant="subtitle1">
                        Elige la opcion para iniciar sesion o registrarte si no tienes una cuenta
                    </Typography>
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
            </DialogContent>
            <DialogActions>
                {/* <Button variant="contained" color="success">
                    Guardar
                </Button> */}
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
            </DialogActions>
        </Dialog>
    )
}

export default DialogUsers