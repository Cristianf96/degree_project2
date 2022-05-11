import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Tab, Tabs, Stack } from '@mui/material';

import CachedIcon from '@mui/icons-material/Cached';

const DialogTips = (props) => {
    const [value, setValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        // event.preventdefault()
        setValue(newValue);
    };

    return (
        <Dialog
            // onClose={props.onClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <DialogTitle>
                Tips
            </DialogTitle>
            <DialogContent dividers>
                <Stack direction={'row'} spacing={2}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                orientation="vertical"
                            >
                                <Tab label="Item One" value={0} icon={<CachedIcon />} />
                                <Tab label="Item Two" value={1} icon={<CachedIcon />} />
                                <Tab label="Item Three" value={2} icon={<CachedIcon />} />
                                <Tab label="Item Four" value={3} icon={<CachedIcon />} />
                                <Tab label="Item Five" value={4} icon={<CachedIcon />} />
                                <Tab label="Item Six" value={5} icon={<CachedIcon />} />
                                <Tab label="Item Seven" value={6} icon={<CachedIcon />} />
                                <Tab label="Item Eight" value={7} icon={<CachedIcon />} />
                                <Tab label="Item Nine" value={8} icon={<CachedIcon />} />
                            </Tabs>
                        </Box>
                    </Box>
                    <Box>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo, molestiae? Exercitationem temporibus ex, porro corporis est illum vel aperiam aut nihil totam quia nulla libero ducimus omnis explicabo nobis voluptatibus.
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                {/* <Button variant="contained" color="success">
                    Guardar
                </Button> */}
                <Button onClick={props.onClose} variant="contained" color="error">
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogTips