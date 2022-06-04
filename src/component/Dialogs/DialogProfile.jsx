import React, { useEffect, useState } from 'react'

import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Box, IconButton, Tooltip } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EditIcon from '@mui/icons-material/Edit';

import { queryData } from '../../utils/firebase';

const DialogProfile = (props) => {

    const uid = localStorage.getItem('user')

    const [isUserLoggedIn, setIsUserLoggedIn] = useState([])

    useEffect(() => {
        const getProfile = async () => {
            if (uid) {
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
    }, [uid])


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
                                <AccountBoxIcon fontSize='large' />
                            </Box>
                        </Stack>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box margin={2}>
                            <Box>
                                <TextField sx={{ marginBottom: 2 }} fullWidth label={'Nombre'} defaultValue={isUserLoggedIn[0].name} InputProps={{ readOnly: true, }} />
                                <TextField sx={{ marginBottom: 2 }} fullWidth label={'Email'} defaultValue={isUserLoggedIn[0].email} InputProps={{ readOnly: true, }} />
                                <TextField sx={{ marginBottom: 2 }} fullWidth label={'Rol'} defaultValue={isUserLoggedIn[0].rol} InputProps={{ readOnly: true, }} />
                                <Stack direction={'row'} spacing={1}>
                                    <TextField fullWidth label={'Password'} defaultValue={isUserLoggedIn[0].password} type={'password'} disabled InputProps={{ readOnly: true, }} />
                                    <Tooltip title="Edit" arrow>
                                        <IconButton>
                                            <EditIcon sx={{ alignSelf: 'center', color: 'black' }} fontSize='medium' />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.onClose} variant="contained" color="error">
                            Cancelar
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
}

export default DialogProfile