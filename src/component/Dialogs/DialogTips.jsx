import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const DialogTips = (props) => {
    return (
        <Dialog
            onClose={props.onClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <DialogTitle>
                Tips
            </DialogTitle>
            <DialogContent dividers>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem tenetur accusantium quasi veritatis impedit reiciendis dolor, ipsam quis iusto et explicabo culpa veniam facilis unde quia animi enim quaerat. Repellat!
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={props.onClose}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogTips