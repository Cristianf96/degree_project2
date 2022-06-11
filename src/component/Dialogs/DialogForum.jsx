import React, { useEffect, useState } from 'react'

import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Badge, Stack, Popover, Typography, Box, Card, CardContent, CardActions, Slide, Tooltip, IconButton } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import LinearProgress from '@mui/material/LinearProgress';
import GiteIcon from '@mui/icons-material/Gite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { addDocs, queryData, updateData } from '../../utils/firebase';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogForum = (props) => {

    const [load, setLoad] = useState(false)
    const [value, setValue] = useState({ material: '', descripcion: '', movil: '', email: '' })
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [error, setError] = React.useState(false);
    const [openInformation, setOpenInformation] = React.useState(false);
    const [reload, setReload] = React.useState(false);
    const [dataUSer, setDataUSer] = useState({})
    const [dataForum, setDataForum] = useState([])
    const rol = localStorage.getItem('rol') ?? ""
    const uid = localStorage.getItem('user') ?? ""
    const [count, setCount] = useState(0)

    useEffect(() => {
        const getInformation = async () => {
            if (reload) {
                setReload(false)
            }
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
                let count = 0
                dataF.forEach((doc) => {
                    if (rol === 'staff') {
                        if (doc.data().state) {
                            objForum.push({ data: doc.data(), id: doc.id })
                            count++
                        }
                    } else {
                        if (!doc.data().state) {
                            objForum.push({ data: doc.data(), id: doc.id })
                        }
                    }
                })
                setCount(count)
                setDataForum(objForum)
            }
            setLoad(true)
        }
        getInformation()
    }, [reload, rol, uid])

    const handlePost = async () => {
        if (value && value.material !== '' && value.descripcion !== '' && value.movil !== '' && value.email !== '') {
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
            props.setReload(true)
            setReload(true)
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

    const handleCloseDialog = () => {
        setOpenInformation(false);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleChangeOpenInformation = (data) => {
        setOpenInformation(true)
    }

    const aceptarSAolicitud = async (data) => {
        // await DeleteDoc('forum', data)
        await updateData('forum', data, { state: true, adminId: uid })
        props.setReload(true)
        setReload(true)
    }

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
                        {rol === 'staff' ? 'Solicitudes aceptadas' : 'Solicitudes'}
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
                    {rol === 'staff' && (
                        <Badge badgeContent={count} color="primary">
                            <GiteIcon fontSize='large' />
                        </Badge>
                    )}
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                {!load ? (
                    <>
                        <Box>
                            <LinearProgress variant='indeterminate' />
                        </Box>
                    </>
                ) : (
                    <>
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
                                                <Button size="large" onClick={() => handleChangeOpenInformation(item.data)}>Contactar</Button>
                                                <Button size="large" onClick={() => aceptarSAolicitud(item.id)} endIcon={<RestoreFromTrashIcon />}>Aceptar</Button>
                                            </CardActions>

                                        )}
                                    </Card>

                                    <Dialog
                                        open={openInformation}
                                        TransitionComponent={Transition}
                                        keepMounted
                                        onClose={handleCloseDialog}
                                        aria-describedby="alert-dialog-slide-description"
                                    >
                                        <DialogTitle>
                                            <Stack direction={'row'} spacing={1} justifyContent={'space-between'} alignItems={'center'}>
                                                <Stack direction={'row'} spacing={1} >
                                                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                        {'Solicitante: '}
                                                    </Typography>
                                                    <Typography variant='subtitle1' sx={{ textAlign: 'center' }}>
                                                        {item.data.name}
                                                    </Typography>
                                                </Stack>
                                                <Box>
                                                    <Tooltip title="Atras">
                                                        <IconButton onClick={handleCloseDialog}>
                                                            <ArrowBackIcon sx={{ color: 'black' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Stack>
                                        </DialogTitle>
                                        <DialogContent>
                                            <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
                                                {item.data.material}
                                            </Typography>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                Descripcion de la solicitud:
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                {item.data.descripcion}
                                            </Typography>
                                            <Stack direction={'row'} spacing={1}>
                                                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                    {'Celular: '}
                                                </Typography>
                                                <Typography variant='subtitle1' sx={{ textAlign: 'center' }}>
                                                    {item.data.movil}
                                                </Typography>
                                            </Stack>
                                            <Stack direction={'row'} spacing={1}>
                                                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                    {'Email: '}
                                                </Typography>
                                                <Typography variant='subtitle1' sx={{ textAlign: 'center' }}>
                                                    {item.data.emailUser}
                                                </Typography>
                                            </Stack>
                                            <Stack direction={'row'} spacing={1}>
                                                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                    {'Contacto: '}
                                                </Typography>
                                                <Typography variant='subtitle1' sx={{ textAlign: 'center' }}>
                                                    {item.data.emailForum}
                                                </Typography>
                                            </Stack>
                                        </DialogContent>
                                        <DialogActions>
                                            {/* <Button onClick={handleClose}>Disagree</Button>
                                            <Button onClick={handleClose}>Agree</Button> */}
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            )
                        })}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} variant="contained" color="error">
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default DialogForum