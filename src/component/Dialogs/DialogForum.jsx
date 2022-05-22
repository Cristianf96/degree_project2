import React, { useEffect, useState } from 'react'

import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Popover, Typography, Box, Card, CardContent, CardActions } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';

const DialogForum = (props) => {

    // const [disabled, setDisabled] = useState(true)
    const [value, setValue] = useState({ material: '', descripcion: '', movil: '', email: '' })
    const [anchorEl, setAnchorEl] = React.useState(null);
    const rol = localStorage.getItem('rol') ?? ""

    useEffect(() => {

    }, [])

    const dataFake = [
        { id: 1, name: 'Juanito', material: 'Pilas', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pulvinar erat nec neque imperdiet convallis. Suspendisse metus massa, faucibus sit amet vulputate vehicula, pretium at est. Fusce ut sapien suscipit.', movil: '3112974183', email: 'test@gmail.com' },
        { id: 2, name: 'Andres', material: 'Botellas', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pulvinar erat nec neque imperdiet convallis. Suspendisse metus massa, faucibus sit amet vulputate vehicula, pretium at est. Fusce ut sapien suscipit.', movil: '3112974183', email: 'test@gmail.com' },
        { id: 3, name: 'Cristian', material: 'Agujas', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pulvinar erat nec neque imperdiet convallis. Suspendisse metus massa, faucibus sit amet vulputate vehicula, pretium at est. Fusce ut sapien suscipit.', movil: '3112974183', email: 'test@gmail.com' },
        { id: 4, name: 'Sara', material: 'Medicamentos', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pulvinar erat nec neque imperdiet convallis. Suspendisse metus massa, faucibus sit amet vulputate vehicula, pretium at est. Fusce ut sapien suscipit.', movil: '3112974183', email: 'test@gmail.com' },
        { id: 5, name: 'Angie', material: 'Cobre', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pulvinar erat nec neque imperdiet convallis. Suspendisse metus massa, faucibus sit amet vulputate vehicula, pretium at est. Fusce ut sapien suscipit.', movil: '3112974183', email: 'test@gmail.com' },
        { id: 6, name: 'Giovanni', material: 'Teclados', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pulvinar erat nec neque imperdiet convallis. Suspendisse metus massa, faucibus sit amet vulputate vehicula, pretium at est. Fusce ut sapien suscipit.', movil: '3112974183', email: 'test@gmail.com' },
        { id: 7, name: 'Zulima', material: 'Portatiles', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pulvinar erat nec neque imperdiet convallis. Suspendisse metus massa, faucibus sit amet vulputate vehicula, pretium at est. Fusce ut sapien suscipit.', movil: '3112974183', email: 'test@gmail.com' },
        { id: 8, name: 'Ra', material: 'Agujas', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pulvinar erat nec neque imperdiet convallis. Suspendisse metus massa, faucibus sit amet vulputate vehicula, pretium at est. Fusce ut sapien suscipit.', movil: '3112974183', email: 'test@gmail.com' },
    ]

    const handlePost = () => {
        if (value && value.material !== '' && value.descripcion !== '' && value.movil !== '' && value.email !== '') {
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
                                        <TextField fullWidth label="Material" variant="outlined" onChange={(e) => setValue(value => ({ ...value, material: e.target.value }))} />
                                        <TextField fullWidth label="Descripcion" variant="outlined" onChange={(e) => setValue(value => ({ ...value, descripcion: e.target.value }))} />
                                        <Stack direction={'row'} spacing={1}>
                                            <TextField fullWidth label="Numero de contacto" variant="outlined" onChange={(e) => setValue(value => ({ ...value, movil: e.target.value }))} />
                                            <TextField fullWidth label="Correo" variant="outlined" type={'email'} onChange={(e) => setValue(value => ({ ...value, email: e.target.value }))} />
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
                {dataFake && dataFake.map((item) => {
                    return (
                        <Box sx={{ marginBottom: 1, marginTop: 1 }} key={item.id}>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        {item.material}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {item.descripcion}
                                    </Typography>
                                    {/* <Typography variant="body2">
                                        well meaning and kindly.
                                        <br />
                                        {'"a benevolent smile"'}
                                    </Typography> */}
                                </CardContent>
                                <CardActions>
                                    {/* <Button size="small">Learn More</Button> */}
                                </CardActions>
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