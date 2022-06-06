import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Tab, Tabs, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import PropTypes from 'prop-types';

import CachedIcon from '@mui/icons-material/Cached';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const DialogTips = (props) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        // event.preventdefault()
        setValue(newValue);
    };

    const classification = {
        blanca: [
            { title: 'Plástico', descripcion: 'Botellas, bolsas, tapas y otros envases o utensilios de plásticos' },
            { title: 'Papel y Cartón', descripcion: 'Cajas, papel limpio, hojas de papel usadas, papel periódico' },
            { title: 'Vidrio', descripcion: 'Botellas y frascos' },
            { title: 'Metales', descripcion: 'Latas de bebidas y conserva, tapas, electrodomésticos, mat. de construcción, otros' },
            { title: 'Envases Compuestos', descripcion: 'Cajas multicapa de jugos, leche o alimentos, envases metalizados' },
            { title: 'Maderas', descripcion: 'Palos, cajas y tablas' },
            { title: 'Textiles', descripcion: 'Ropa y trapos' }
        ],
        negra: [
            { title: 'Restos de alimentos (si separas en BOLSA BLANCA: Reciclables y negra)' },
            { title: 'Restos de polvo y barrido' },
            { title: 'Huesos' },
            { title: 'Colillas de cigarro' },
            { title: 'Pepel higiénico' },
            { title: 'Pañales' },
            { title: 'Toallas higiénicas' },
            { title: 'Servilletas' },
            { title: 'Papel y Cartón con comida o grasas' },
            { title: 'Papel metalizado' },
            { title: 'Céramica o vajillas rota' },
        ],
        verde: [
            { title: 'Restos de frutas y verduras' },
            { title: 'Restos de alimentos no cocinados' },
            { title: 'Hojas secas' },
            { title: 'Ramas' },
            { title: 'Cáscaras de huevos' },
        ],
        roja: [
            { title: 'Residuos hemopatológicos', descripcion: 'Usualmente pacientes diabéticos o con enfermedades que requieren de uso de jeringas, agujas, para ello deben pedir el guardian a la EPS.' },
            { title: 'Residuos domicialiarios peligrosos', descripcion: 'Pilas, aceites usado, bombillos flurescentes, electrodomésticos en desuso, electrónicos.' }
        ],
    }

    return (
        <Dialog
            // onClose={props.onClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            maxWidth={'md'}
        >
            <DialogTitle>
                Consejos de clasificación
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ margin: 1 }}>
                    <Typography variant='subtitle1'>
                        Esta clasificación se basa en la Resolución No. 2184 de 2019, la cual entra en vigencia a partir de enero de 2021.
                    </Typography>
                </Box>
                <Stack spacing={2}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                orientation="horizontal"
                            >
                                <Tab label="Basica" value={0} icon={<CachedIcon />} />
                                <Tab label="Intermedia" value={1} icon={<CachedIcon />} />
                                <Tab label="Avanzada" value={2} icon={<CachedIcon />} />
                            </Tabs>
                        </Box>
                    </Box>
                    <Box>
                        <TabPanel value={value} index={0}>
                            <Box>
                                <Typography variant="h4">
                                    {'Clasificación Basica'}
                                </Typography>
                            </Box>
                            <Box sx={{ marginTop: 2 }}>
                                <Typography variant='subtitle1'>
                                    Separa todos los residuos aprovechables de los que no lo son.
                                </Typography>
                            </Box>
                            <Box>
                                <Stack spacing={1}>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography variant='h6'>
                                                BOLSA BLANCA: Reciclables
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {classification.blanca.length > 0 && classification.blanca.map((item) => {
                                                return (
                                                    <>
                                                        <Box sx={{ marginBottom: 1 }} key={item.title}>
                                                            <Typography variant='subtitle2' sx={{ marginBottom: 0.5, fontWeight: '600', fontSize: '17px' }}>
                                                                {item.title}
                                                            </Typography>
                                                            <Typography variant='body2'>
                                                                {item.descripcion}
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                )
                                            })}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                            sx={{ backgroundColor: 'black', color: 'white' }}
                                        >
                                            <Typography variant='h6'>
                                                BOLSA NEGRA: No reciclables
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ backgroundColor: 'black', color: 'white' }}>
                                            {classification.negra.length > 0 && classification.negra.map((item) => {
                                                return (
                                                    <>
                                                        <Box sx={{ marginBottom: 1 }} key={item.title}>
                                                            <Typography variant='body2' sx={{ marginBottom: 0.5 }}>
                                                                {item.title}
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                )
                                            })}
                                            <Typography sx={{ margin: 2, fontWeight: '450' }}>
                                                Todos los residuos sin alternativa de valorización o de manejo específico.
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Stack>
                            </Box>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Box>
                                <Typography variant="h4">
                                    {'Clasificación Intermedia'}
                                </Typography>
                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant='subtitle1'>
                                        Agregar la clasificación y disposición de residuos compostables, reduciendo significativamente la cantidad de residuos mezclados volcados al sistema de disposición.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Stack spacing={1}>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant='h6'>
                                                    BOLSA BLANCA: Reciclables
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {classification.blanca.length > 0 && classification.blanca.map((item) => {
                                                    return (
                                                        <>
                                                            <Box sx={{ marginBottom: 1 }} key={item.title}>
                                                                <Typography variant='subtitle2' sx={{ marginBottom: 0.5, fontWeight: '600', fontSize: '17px' }}>
                                                                    {item.title}
                                                                </Typography>
                                                                <Typography variant='body2'>
                                                                    {item.descripcion}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )
                                                })}
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                                aria-controls="panel2a-content"
                                                id="panel2a-header"
                                                sx={{ backgroundColor: 'black', color: 'white' }}
                                            >
                                                <Typography variant='h6'>
                                                    BOLSA NEGRA: No reciclables
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ backgroundColor: 'black', color: 'white' }}>
                                                {classification.negra.length > 0 && classification.negra.map((item) => {
                                                    return (
                                                        <>
                                                            <Box sx={{ marginBottom: 1 }} key={item.title}>
                                                                <Typography variant='body2' sx={{ marginBottom: 0.5 }}>
                                                                    {item.title}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )
                                                })}
                                                <Typography sx={{ margin: 2, fontWeight: '450' }}>
                                                    Todos los residuos sin alternativa de valorización o de manejo específico.
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                                aria-controls="panel2a-content"
                                                id="panel2a-header"
                                                sx={{ backgroundColor: '#388e3c', color: 'white' }}
                                            >
                                                <Typography variant='h6'>
                                                    BOLSA VERDE: Residuos compostables
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ backgroundColor: '#388e3c', color: 'white' }}>
                                                <Typography sx={{ marginBottom: 1, fontWeight: '600' }}>
                                                    De acuerdo con la resolución 2184 de 2019 que entra en vigencia a partir de enero de 2021.
                                                </Typography>
                                                {classification.verde.length > 0 && classification.verde.map((item) => {
                                                    return (
                                                        <>
                                                            <Box sx={{ marginBottom: 1 }} key={item.title}>
                                                                <Typography variant='body2' sx={{ marginBottom: 0.5 }}>
                                                                    {item.title}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )
                                                })}
                                            </AccordionDetails>
                                        </Accordion>
                                    </Stack>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Box>
                                <Typography variant="h4">
                                    {'Clasificación Avanzada'}
                                </Typography>
                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant='subtitle1'>
                                        Clasificación y disposición de materiales individualmente, minimizando las pérdidas en el proceso de clasificación secundaria y haciendo más eficiente el camino entre el hogar y el punto de reciclaje.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Stack spacing={1}>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant='h6'>
                                                    BOLSA BLANCA: Reciclables
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {classification.blanca.length > 0 && classification.blanca.map((item) => {
                                                    return (
                                                        <>
                                                            <Box sx={{ marginBottom: 1 }} key={item.title}>
                                                                <Typography variant='subtitle2' sx={{ marginBottom: 0.5, fontWeight: '600', fontSize: '17px' }}>
                                                                    {item.title}
                                                                </Typography>
                                                                <Typography variant='body2'>
                                                                    {item.descripcion}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )
                                                })}
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                                aria-controls="panel2a-content"
                                                id="panel2a-header"
                                                sx={{ backgroundColor: 'black', color: 'white' }}
                                            >
                                                <Typography variant='h6'>
                                                    BOLSA NEGRA: No reciclables
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ backgroundColor: 'black', color: 'white' }}>
                                                {classification.negra.length > 0 && classification.negra.map((item) => {
                                                    return (
                                                        <>
                                                            <Box sx={{ marginBottom: 1 }} key={item.title}>
                                                                <Typography variant='body2' sx={{ marginBottom: 0.5 }}>
                                                                    {item.title}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )
                                                })}
                                                <Typography sx={{ margin: 2, fontWeight: '450' }}>
                                                    Todos los residuos sin alternativa de valorización o de manejo específico.
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                                aria-controls="panel2a-content"
                                                id="panel2a-header"
                                                sx={{ backgroundColor: '#388e3c', color: 'white' }}
                                            >
                                                <Typography variant='h6'>
                                                    BOLSA VERDE: Residuos compostables
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ backgroundColor: '#388e3c', color: 'white' }}>
                                                <Typography sx={{ marginBottom: 1, fontWeight: '600' }}>
                                                    De acuerdo con la resolución 2184 de 2019 que entra en vigencia a partir de enero de 2021.
                                                </Typography>
                                                {classification.verde.length > 0 && classification.verde.map((item) => {
                                                    return (
                                                        <>
                                                            <Box sx={{ marginBottom: 1 }} key={item.title}>
                                                                <Typography variant='body2' sx={{ marginBottom: 0.5 }}>
                                                                    {item.title}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )
                                                })}
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                                sx={{ backgroundColor: '#d32f2f', color: 'white' }}
                                            >
                                                <Typography variant='h6'>
                                                    BOLSA ROJA: Residuos peligrosos
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ backgroundColor: '#d32f2f', color: 'white' }}>
                                                {classification.roja.length > 0 && classification.roja.map((item) => {
                                                    return (
                                                        <>
                                                            <Box sx={{ marginBottom: 1 }} key={item.title}>
                                                                <Typography variant='subtitle2' sx={{ marginBottom: 0.5, fontWeight: '600', fontSize: '17px' }}>
                                                                    {item.title}
                                                                </Typography>
                                                                <Typography variant='body2'>
                                                                    {item.descripcion}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )
                                                })}
                                                <Typography sx={{ margin: 2, fontWeight: '500' }}>
                                                    Los residuos peligrosos (independientemente del tipo de clasificación realizada), SIEMPRE se deben depositar en los puntos de recolección postconsumo ubicados cerca a su lugar de residencia.
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Stack>
                                </Box>
                            </Box>
                        </TabPanel>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} variant="contained" color="error">
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default DialogTips