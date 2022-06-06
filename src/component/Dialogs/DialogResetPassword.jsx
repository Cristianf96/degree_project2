import React, { useState } from 'react'

import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Snackbar
} from '@mui/material';
import { sendReset } from '../../utils/firebase';
// import { styled } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
// import { auth } from '../../utils/firebase';
// import { sendPasswordResetEmail } from "firebase/auth";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DialogResetPassword = (props) => {

    const [emailReset, setEmailReset] = useState('')
    const [error, setError] = useState(false)
    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const send = async () => {
        // console.log('emailReset', emailReset)
        if (emailReset === '') return setError(true)

        if (!props.validateEmail(emailReset)) return setError(true);

        const flag = await sendReset(emailReset)
        if (flag) {
            handleClickAlert('success', 'Se envio el email')
            setDisabled(true)
        } else {
            handleClickAlert('error', 'No se encontró el usuario')
        }
        // props.handleClose()
    }

    const handleClickAlert = (sev, mes) => {
        setMessage(mes)
        setSeverity(sev)
        setOpenAlert(true);
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    return (
        <Dialog
            open={props.open}
            // onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Restablecer contraseña"}
            </DialogTitle>
            <DialogContent >
                <TextField
                    sx={{ margin: 1 }}
                    label={'Email'}
                    type="email"
                    onChange={(e) => setEmailReset(e.target.value)}
                    error={error}
                    disabled={disabled}
                    helperText={error && emailReset === '' ? 'error' : null}
                />
                {/* <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>
                    {!disabled ? 'Cancelar' : 'Atras'}
                </Button>
                {!disabled && (
                    <Button onClick={send}>
                        {'Enviar'}
                    </Button>
                )}
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

export default DialogResetPassword