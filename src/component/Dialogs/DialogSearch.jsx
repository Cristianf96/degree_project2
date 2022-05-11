import React from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';


const DialogSearch = (props) => {
    return (
        <Dialog
            // onClose={props.onClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            maxWidth={'md'}
        >
            <DialogTitle>
                Search
            </DialogTitle>
            <DialogContent dividers>
                <TextField fullWidth label="Search..." variant="outlined" />
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores pariatur amet totam temporibus animi placeat illum, quaerat explicabo a consectetur soluta deleniti, ut corrupti molestiae odit adipisci, labore esse asperiores?
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

export default DialogSearch