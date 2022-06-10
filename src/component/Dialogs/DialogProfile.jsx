import React, { useEffect, useState } from 'react'

import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Box, IconButton, Tooltip, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import { queryData, updateData } from '../../utils/firebase';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DialogProfile = (props) => {

    const uid = localStorage.getItem('user')

    const [isUserLoggedIn, setIsUserLoggedIn] = useState([])
    const [readOnly, setReadOnly] = useState(true)
    const [dataEdit, setDataEdit] = useState({
        name: '',
        email: '',
        rol: '',
        password: '',
        cPassword: '',
    })
    const [openAlert, setOpenAlert] = useState(false);
    const [load, setLoad] = useState(false);
    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');
    const [idUser, setIdUser] = useState('');

    const handleClickAlert = (sev, mes) => {
        setMessage(mes)
        setSeverity(sev)
        setOpenAlert(true);
    };

    useEffect(() => {
        const getProfile = async () => {
            if (uid) {
                if (load) {
                    setLoad(false)
                }
                const isDataUsers = await queryData('users')
                const isDataUser = isDataUsers.docs
                let isUser = []
                if (isDataUser) {
                    isDataUser.forEach((doc) => {
                        if (doc.data().uid === uid) {
                            isUser.push(doc.data())
                        }
                    })
                    setIsUserLoggedIn(isUser)
                }
            }
        }
        getProfile()
    }, [load, uid])

    const updateDataUser = async (status) => {
        if (!status) {
            const isDataUsers = await queryData('users')
            const isDataUser = isDataUsers.docs
            let isUser = []
            if (isDataUser) {
                isDataUser.forEach((doc) => {
                    if (doc.data().uid === uid) {
                        isUser.push({ data: doc.data(), id: doc.id })
                    }
                })
                setDataEdit(isUser[0].data)
                setIdUser(isUser[0].id)
                setReadOnly(!readOnly)
            }
        } else {
            // if (dataEdit.cPassword || dataEdit.password !== isUserLoggedIn[0].password) {
            //     if (dataEdit.password === dataEdit.cPassword && dataEdit.password.length > 6) {
            //         console.log('dataEditUpdatePassword :>> ', dataEdit);
            //         await updateData('users', idUser, dataEdit)
            //         setReadOnly(!readOnly)
            //         handleClickAlert('success', 'El perfil se a actualizado satisfactoriamente')
            //         props.setReload(true)
            //         setLoad(true)
            //     } else {
            //         handleClickAlert('error', 'Confirme la contraseña o no coincide la contraseña o tiene menos de 7 caracteres')
            //     }
            // } else {
            await updateData('users', idUser, dataEdit)
            setReadOnly(!readOnly)
            handleClickAlert('success', 'El perfil se a actualizado satisfactoriamente')
            props.setReload(true)
            setLoad(true)
            // } 
        }
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <>
            {isUserLoggedIn.length > 0 && (
                <Dialog
                    aria-labelledby="customized-dialog-title"
                    open={props.open}
                    // maxWidth={'md'}
                    fullWidth
                >
                    <DialogTitle>
                        <Stack direction={'row'} justifyContent={'space-between'} sx={{ margin: 2 }}>
                            <Typography variant='h5'>
                                Bienvenido: {isUserLoggedIn[0].name}
                            </Typography>
                            <Box>
                                <Stack direction={'row'} spacing={1}>
                                    <Tooltip title={readOnly ? "Edit" : 'Save'}>
                                        {readOnly ? (
                                            <IconButton onClick={() => updateDataUser(false)}>
                                                <EditIcon sx={{ color: 'black' }} />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => updateDataUser(true)}>
                                                <SaveIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        )}
                                    </Tooltip>
                                    <AccountBoxIcon fontSize='large' />
                                </Stack>
                            </Box>
                        </Stack>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box margin={2}>
                            <Box>
                                <TextField
                                    sx={{ marginBottom: 2 }}
                                    fullWidth
                                    label={'Nombre'}
                                    value={!readOnly ? dataEdit.name : isUserLoggedIn[0].name}
                                    // defaultValue={isUserLoggedIn[0].name}
                                    onChange={(e) => setDataEdit(dataEdit => ({ ...dataEdit, name: e.target.value }))}
                                    InputProps={{ readOnly: readOnly, }}
                                />
                                <TextField
                                    sx={{ marginBottom: 2 }}
                                    fullWidth
                                    type={'email'}
                                    label={'Email'}
                                    value={!readOnly ? dataEdit.email : isUserLoggedIn[0].email}
                                    onChange={(e) => setDataEdit(dataEdit => ({ ...dataEdit, email: e.target.value }))}
                                    InputProps={{ readOnly: true, }}
                                    // required
                                />
                                <TextField
                                    sx={{ marginBottom: 2 }}
                                    fullWidth
                                    label={'Rol'}
                                    value={!readOnly ? dataEdit.rol : isUserLoggedIn[0].rol}
                                    onChange={(e) => setDataEdit(dataEdit => ({ ...dataEdit, rol: e.target.value }))}
                                    InputProps={{ readOnly: true, }}
                                />
                                {!readOnly && (
                                    <Typography variant='body2' color={'error'} marginBottom={2}>
                                        Si quiere cambiar su contraseña debe hacer click en la opcion de restablecer contraseña desde la ventana de inicio de sesion
                                    </Typography>
                                )}
                                <TextField
                                    fullWidth
                                    label={'Contraseña'}
                                    value={!readOnly ? dataEdit.password : isUserLoggedIn[0].password}
                                    onChange={(e) => setDataEdit(dataEdit => ({ ...dataEdit, password: e.target.value }))}
                                    type={'password'}
                                    disabled
                                    InputProps={{ readOnly: readOnly, }}
                                />
                                <TextField
                                    fullWidth
                                    label={'Confirmar contraseña'}
                                    value={!readOnly ? dataEdit.cPassword : isUserLoggedIn[0].password}
                                    onChange={(e) => setDataEdit(dataEdit => ({ ...dataEdit, cPassword: e.target.value }))}
                                    type={'password'}
                                    disabled
                                    sx={{ display: readOnly ? 'none' : 'block', marginTop: 2 }}
                                    InputProps={{ readOnly: readOnly, }}
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.onClose} variant="contained" color="error">
                            Cancelar
                        </Button>
                    </DialogActions>
                    <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleCloseAlert} sx={{ zIndex: 10 }} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }} >
                        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                </Dialog>
            )}
        </>
    )
}

export default DialogProfile