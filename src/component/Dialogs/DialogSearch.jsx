import React from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';


const DialogSearch = (props) => {
    return (
        <Dialog
            onClose={props.onClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <DialogTitle>
                Search
            </DialogTitle>
            <DialogContent dividers>
                <TextField label="Search..." variant="outlined" />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={props.onClose}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogSearch