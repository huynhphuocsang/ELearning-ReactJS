import Navbar from "../../component/Navbar/Nabar"
import Container from '@mui/material/Container';
import { Fragment, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setInfor } from "../../actions/action";

import style from "./style.module.scss"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

import AppAvatar from '../../myTool/handleAvatar';
import axios from 'axios'
import EditIcon from '@mui/icons-material/Edit';

function Infor() {
    const [userInfo, setUserInfo] = useState({})
    const inputFile = useRef(null) 
    const [open, setOpen] = useState(false);
    const [openToast, setOpenToast] = useState(false);

    const [oldPass, setOldPass] = useState('');
    const [isValidOldPass, setIsValidOldPass] = useState(false);

    const [newPass, setNewPass] = useState('');
    const [messApi, setMessApi] = useState('');
    const [isValidNewPass, setIsValidNewPass] = useState(false);

    const [confirmPass, setConfirmPass] = useState('');
    const [isValidConfirmPass, setIsValidConfirmPass] = useState(false);
    
    const dispatch = useDispatch();
    const username = useSelector(state => state.infor.username)

    const loadUserInfo=() => {
        const token = localStorage.getItem('accessToken')
        axios.get('/api/user/get-user-info', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            setUserInfo({ ...response.data })
            //console.log(response.data)

        }).catch(error => {

            console.log(error)
        })
    }
    
    useEffect(() => {
        loadUserInfo();
    }, [])

    //HANDLE AVARTAR
    const handleUploadAvatar=()=>{
        inputFile.current.click();
    }
    
    const onChangeFile=(event)=> {
        event.preventDefault()
        handleConfirmAddFile(event.target.files[0]);
    }
    const handleConfirmAddFile=(file)=>{
        const token=localStorage.getItem('accessToken')
        const FormData = require('form-data');
        const formData= new FormData();
        formData.append('file',file);
        console.log(file)
        var config = {
            method: 'post',
            url: axios.defaults.baseURL + '/api/avatar/upload',
            headers: { 
              'Authorization': `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            },
            data : formData
          };
          axios(config)
            .then(function (response) {
              if(response.status===200 || response.status===201){
                window.location.reload();
              }
            })
            .catch(function (error) {
              console.log(error);
            });
    }


    const handleClickOpen = () => {
        setOpen(true);
        setIsValidOldPass(false);
        setIsValidNewPass(false);
        setIsValidConfirmPass(false);
    };

    function verification() {
        var data = JSON.stringify({
            username: username,
            password: oldPass
        });

        var config = {
            method: 'post',
            url: axios.defaults.baseURL + '/api/auth/signin',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                let { accessToken, ...infor } = response.data
                dispatch(setInfor(infor));
                dispatch(setLogin(true));
                localStorage.setItem('accessToken', accessToken)
                setIsValidOldPass(false);
                handleChangePass();
            })
            .catch(function (error) {
                setIsValidOldPass(true);
                console.log(error)
            });


    }
    const handleChangeOldPass = (event) => {
        setOldPass(event.target.value);
        setIsValidOldPass(false);
    };
    const handleChangeNewPass = (event) => {
        setNewPass(event.target.value);
        setIsValidNewPass(false);
    };
    const handleChangeConfirmdPass = (event) => {
        setConfirmPass(event.target.value);
        setIsValidConfirmPass(false)
    };

    function handleChangePass() {
        if (newPass !== confirmPass) {
            setIsValidConfirmPass(true)
            return;
        }

        var data = JSON.stringify({
            password: newPass
        });

        const token = localStorage.getItem('accessToken')
        var config = {
            method: 'put',
            url: axios.defaults.baseURL + '/api/user/update-new-password',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                setOpenToast(true);
                setIsValidNewPass(false);
                handleClose()
                setMessApi(response.data)
            })
            .catch(function (error) {
                setIsValidNewPass(true);
                setOpenToast(false);
                setMessApi(error.response.data)
            });

    }
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Navbar />
            <Container maxWidth="lg">
                <Box sx={{ flexGrow: 1 }} className={style.boxContainer}>
                    <Typography gutterBottom variant="h6" component="div" color="#2980B9">
                        TH??NG TIN C?? NH??N
                    </Typography>
                    <Container maxWidth="md" >
                        <div className={style.styleAvatar}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <IconButton style={{backgroundColor: 'rgb(222 216 213)'}} aria-label="edit" size="medium" color='success'
                                onClick={()=>{handleUploadAvatar()}}>
                                    <EditIcon fontSize="inherit" />
                                </IconButton>  
                              }
                            >
                            <AppAvatar url={userInfo.avatar} imgSize={100} />
                            </Badge>
                        </div>
                        <Grid container rowSpacing={2}>
                            <Grid item={true} container direction='row' columnSpacing={3}>
                                <Grid item={true} md={6}>
                                    <TextField label="M??" color="primary" fullWidth={true}
                                        focused
                                        disabled={true}
                                        value={userInfo.userCode || ''}

                                    />
                                </Grid>
                                <Grid item={true} md={6}>
                                    <TextField label="Thu???c" color="primary" fullWidth={true}
                                        focused
                                        disabled={true}
                                        value={userInfo.userClass || ''}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item={true} container direction='row' columnSpacing={3}>
                                <Grid item={true} md={6}>
                                    <TextField label="H??? t??n" color="primary" fullWidth={true}
                                        focused
                                        disabled={true}
                                        value={userInfo.fullname || ''}
                                    />
                                </Grid>
                                <Grid item={true} md={6}>
                                    <TextField label="Gi???i t??nh" color="primary" fullWidth={true}
                                        focused
                                        disabled={true}
                                        value={userInfo.gender === 1 ? "Nam" : "N???"}
                                    />

                                </Grid>
                            </Grid>
                            <Grid item={true} md={12}>
                                <TextField label="Email" color="primary" fullWidth={true}
                                    focused
                                    disabled={true}
                                    value={userInfo.email || ''}
                                />
                            </Grid>
                            <Grid item={true} md={12}>
                                <TextField label="??i???n tho???i" color="primary" fullWidth={true}
                                    focused
                                    disabled={true}
                                    value={userInfo.phone || ''}
                                />
                            </Grid>
                            <Grid item={true} md={12}>
                                <TextField label="?????a ch???" color="primary" fullWidth={true}
                                    focused
                                    disabled={true}
                                    value={userInfo.address || ''}
                                />
                            </Grid>
                            <Grid item={true} md={12}>
                                <Button variant="contained" onClick={handleClickOpen}>
                                    ?????i m???t kh???u
                                </Button>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                        ?????i m???t kh???u
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            <TextField label="M???t kh???u c??" color="primary" fullWidth={true}
                                                focused
                                                margin="dense"
                                                onChange={handleChangeOldPass}
                                                error={isValidOldPass}
                                                helperText={!isValidOldPass ? '' : "M???t kh???u kh??ng h???p l???"}
                                            />
                                        </DialogContentText>
                                        <Grid item={true} md={12}>
                                            <TextField label="?????a ch???" color="primary" fullWidth={true}
                                                focused
                                                disabled={true}
                                                value={userInfo.address}
                                            />
                                        </Grid>
                                        <Grid item={true} md={12}>
                                            <Button variant="contained" onClick={handleClickOpen}>
                                                ?????i m???t kh???u
                                            </Button>
                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">
                                                    ?????i m???t kh???u
                                                </DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        <TextField label="M???t kh???u c??" color="primary" fullWidth={true}
                                                            focused
                                                            margin="dense"
                                                            onChange={handleChangeOldPass}
                                                            error={isValidOldPass}
                                                            helperText={!isValidOldPass ? '' : "M???t kh???u kh??ng h???p l???"}
                                                        />
                                                        <div className={style.txtNewPass}>
                                                            <TextField label="M???t kh???u m???i" color="success" fullWidth={true}
                                                                focused
                                                                margin="dense"
                                                                onChange={handleChangeNewPass}
                                                                error={isValidNewPass}
                                                                helperText={!isValidNewPass ? '' : messApi}
                                                            />
                                                            <TextField label="Nh???p l???i m???t kh???u m???i" color="success" fullWidth={true}
                                                                focused
                                                                margin="dense"
                                                                onChange={handleChangeConfirmdPass}
                                                                error={isValidConfirmPass}
                                                                helperText={!isValidConfirmPass ? '' : "Nh???p l???i kh??ng h???p l???"}
                                                            /></div>
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleClose}>H???y</Button>
                                                    <Button onClick={verification} autoFocus>
                                                        X??c nh???n
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </Grid>
                                    </DialogContent>
                                </Dialog>
                            </Grid>
                            <Snackbar
                                open={openToast}
                                sx={{ width: '100%' }} spacing={2}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                autoHideDuration={2000}
                                onClose={() => {
                                    setOpenToast(false);
                                }}

                            >
                                <Alert severity="success" action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpenToast(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                    sx={{ mb: 2 }}>
                                    <AlertTitle>Th??nh c??ng</AlertTitle>
                                    {messApi}
                                </Alert>
                            </Snackbar>
                        </Grid>
                    </Container>
                </Box>
            </Container>
            <input type='file' id='file' ref={inputFile} 
                accept="image/png, image/jpeg"
                style={{display: 'none'}} 
                onChange={(event)=>onChangeFile(event)}/>
        </Fragment>
    )
}
export default Infor