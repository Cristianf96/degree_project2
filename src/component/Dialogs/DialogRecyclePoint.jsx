import React from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Box, Paper, Chip, Badge, Divider } from '@mui/material';
import GiteIcon from '@mui/icons-material/Gite';
// import NavigationIcon from '@mui/icons-material/Navigation';

const DialogRecyclePoint = (props) => {
    const isRecoleccionTitle = 'Horario de recoleccion'
    const isRecibeTitle = 'Recibe'
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
                        <Badge badgeContent={0} color="primary">
                            <GiteIcon fontSize='large' />
                        </Badge>
                    </Box>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
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
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={props.calculateRoute} variant="contained" color="info" endIcon={<NavigationIcon />}>
                    Como llegar
                </Button> */}
                <Button onClick={props.onClose} variant="contained" color="error">
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogRecyclePoint