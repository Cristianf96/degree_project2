import React, { useEffect, useState } from 'react'

import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Popover, Typography, Box, Card, CardContent, CardActions } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import { addDocs, queryData } from '../../utils/firebase';

const DialogForum = (props) => {

    // const [disabled, setDisabled] = useState(true)
    const [value, setValue] = useState({ material: '', descripcion: '', movil: '', email: '' })
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [error, setError] = React.useState(false);
    // const [reload, setReload] = React.useState(false);
    const [dataUSer, setDataUSer] = useState({})
    const [dataForum, setDataForum] = useState([])
    const rol = localStorage.getItem('rol') ?? ""
    const uid = localStorage.getItem('user') ?? ""

    useEffect(() => {
        const getInformation = async () => {
            const dataUsers = await queryData('users')
            const data = dataUsers.docs
            if (data) {
                const objUSer = []
                data.forEach((doc) => {
                    if (doc.data().uid === uid) {
                        objUSer.push(doc.data())
                    }
                })
                setDataUSer(objUSer[0])
            }
            const dataForum = await queryData('forum')
            const dataF = dataForum.docs
            if (dataF) {
                const objForum = []
                dataF.forEach((doc) => {
                    objForum.push({ data: doc.data(), id: doc.id })
                })
                setDataForum(objForum)
            }
        }
        getInformation()
    }, [uid])

    const handlePost = async () => {
        if (value && value.material !== '' && value.descripcion !== '' && value.movil !== '' && value.email !== '') {
            console.log('value', value)
            console.log('dataUSer', dataUSer)
            await addDocs('forum', {
                name: dataUSer.name,
                emailUser: dataUSer.email,
                material: value.material,
                descripcion: value.descripcion,
                movil: value.movil,
                emailForum: value.email,
            })
            setError(false)
            setAnchorEl(null);
        } else {
            setError(true)
        }
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            open={props.open}
            maxWidth={'md'}
            fullWidth
        >
            <DialogTitle>
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <Box>
                        Forum
                    </Box>
                    {rol && rol === 'usuario' && (
                        <div>
                            <Button aria-describedby={id} variant="contained" onClick={handleClick} endIcon={<ForumIcon />}>
                                Publicar
                            </Button>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Box sx={{ padding: 2 }}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            label="Material"
                                            variant="outlined"
                                            onChange={(e) => setValue(value => ({ ...value, material: e.target.value }))}
                                            error={error && value.material === ''}
                                            helperText={error && value.material === '' ? 'Este campo es requerido' : null} />
                                        <TextField
                                            fullWidth
                                            label="Descripcion"
                                            variant="outlined"
                                            onChange={(e) => setValue(value => ({ ...value, descripcion: e.target.value }))} error={error && value.descripcion === ''}
                                            helperText={error && value.descripcion === '' ? 'Este campo es requerido' : null} />
                                        <Stack direction={'row'} spacing={1}>
                                            <TextField
                                                fullWidth
                                                label="Numero de contacto"
                                                variant="outlined"
                                                type={'number'}
                                                onChange={(e) => setValue(value => ({ ...value, movil: e.target.value }))} error={error && value.movil === ''}
                                                helperText={error && value.movil === '' ? 'Este campo es requerido' : null} />
                                            <TextField
                                                fullWidth
                                                label="Correo"
                                                variant="outlined"
                                                type={'email'}
                                                onChange={(e) => setValue(value => ({ ...value, email: e.target.value }))} error={error && value.email === ''}
                                                helperText={error && value.email === '' ? 'Este campo es requerido' : null} />
                                        </Stack>
                                        <Button variant="contained" color="success" onClick={handlePost}>
                                            Publicar
                                        </Button>
                                    </Stack>
                                </Box>
                            </Popover>
                        </div>
                    )}
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                {dataForum.length > 0 && dataForum.map((item) => {
                    return (
                        <Box sx={{ marginBottom: 1, marginTop: 1 }} key={item.id}>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        {item.data.name}
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        {item.data.material}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {item.data.descripcion}
                                    </Typography>
                                </CardContent>
                                {rol === 'admin' && (
                                    <CardActions>
                                        <Button size="large">Contactar</Button>
                                    </CardActions>
                                )}
                            </Card>
                        </Box>
                    )
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} variant="contained" color="error">
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogForum