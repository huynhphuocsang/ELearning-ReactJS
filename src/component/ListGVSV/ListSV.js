import clsx from 'clsx'
import axios from 'axios'

import style from './listSV.module.scss'
import { useSelector } from 'react-redux'

import AppToast from '../../myTool/AppToast'
import teacher from '../../assets/image/teacher.png'
import student from '../../assets/image/student.png'

import { useParams } from 'react-router-dom';
import { useEffect, useState, Fragment, useRef } from 'react'


import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



function Member({ value }) {

    let svCount = useRef(0)
    let gvCount = useRef(0)
    const listStudentCode = [];
    const { id } = useParams();
    const array = useRef([value])
    const [studentNameFocus, setStudentNameFocus] = useState('')
    const [studentCodeFocus, setStudentCodeFocus] = useState(0)

    const [openAdd, setOpenAdd] = useState(false);
    const [isError, setIsError] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [contentError, setContentError] = useState(false);
    const [openToastError, setOpenToastError] = useState(false);
    const [openToastDelete, setOpenToastDelete] = useState(false);
    const [openToastAddFail, setOpenToastAddFail] = useState(false);
    const [openToastAddSuccess, setOpenToastAddSuccess] = useState(false);

    const userRoles = useSelector(state => state.infor.roles || [])
    const isTeacherModer = userRoles.some(role => role === 'ROLE_TEACHER' || role === 'ROLE_MODERATOR')

    if (value.students !== undefined) {
        value.students.map((index) => {
            listStudentCode.push(index.studentCode);
        });
    }

    const checkStudentCodeExist = (value) => {
        return listStudentCode.some((studentCode) => studentCode === value)
    }

    const handleAdd = () => {
        setOpenAdd(true);
    };

    const handleDelete = (id, name) => {
        setStudentCodeFocus(id)
        setStudentNameFocus(name)
        setOpenDelete(true);
    };

    const handleFillStudentCode = (e) => {

        if (e.target.value === "") {
            setIsError(true);
            setContentError("M?? h???c sinh kh??ng ???????c ????? tr???ng")
        }
        else {
            if (checkStudentCodeExist(e.target.value)) {
                setIsError(true);
                setContentError("H???c sinh n??y ???? c?? trong l???p r???i!!")
            }
            else {
                setIsError(false);
                setStudentCodeFocus(parseInt(e.target.value))
            }

        }
    }

    const handleConfirmAdd = () => {
        if (isError) {
            setOpenToastError(true);
        }
        else {
            const token = localStorage.getItem('accessToken');
            var config = {
                method: 'post',
                url: axios.defaults.baseURL + `/api/admin/creditclass/add-student-to-credit-class?credit-class-id=${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ studentCode: [studentCodeFocus] })
            };
            axios(config)
                .then(function (response) {
                    if (response.status === 200) {
                        setOpenToastAddSuccess(true);
                        window.location.reload();
                    }
                })
                .catch(function (error) {
                    setOpenToastAddFail(true);
                });
        }

    }

    const handleComfirmDelete = () => {

        const token = localStorage.getItem('accessToken');
        var config = {
            method: 'put',
            url: axios.defaults.baseURL + `/api/admin/creditclass/remove-student-from-credit-class?credit-class-id=${id}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ studentCode: [studentCodeFocus] })
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setOpenToastDelete(true)
                    window.location.reload();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    return (
        <Typography component='div'>
            {array.current.map((value) => {
                if (value.teacherInfos === undefined || value.students === undefined) {
                }
                else {
                    gvCount = value.teacherInfos.length
                    svCount = value.students.length
                    return (
                        <Fragment key={value}>
                            <div className={clsx(style.headingContainer, style.flex, style.spaceBetween, style.mt50)}>
                                <Typography variant='h6' component='div' className={style.bold}> GI???NG VI??N </Typography>
                                <Typography component='div' className={clsx(style.grayText, style.bold)}> {gvCount} gi???ng vi??n </Typography>
                            </div>

                            {value.teacherInfos.map((info) => {
                                return (
                                    <Typography key={value.teacherInfos.phones} className={clsx(style.listMember, style.flex)}>
                                        <img className={style.imgTeacher} src={teacher} alt='teacher img' />
                                        <span>{info.fullname}</span>
                                    </Typography>
                                )
                            })}
                            <div className={clsx(style.headingContainer, style.flex, style.spaceBetween, style.mt50)}>
                                <Typography variant='h6' component='div' className={style.bold}>SINH VI??N</Typography>
                                <div className={clsx(style.flex, style.spaceBetween)}>
                                    <Button onClick={() => { handleAdd() }} variant="contained" startIcon={<AddCircleOutlineIcon />} component="span" size="small"
                                        color='success' style={{ fontWeight: "bold", padding: "3px 20px", marginRight: 16, display: isTeacherModer ? "inherit" : "none" }}>
                                        Th??m sinh vi??n
                                    </Button>
                                    <Typography component='div' className={clsx(style.grayText, style.bold)}> {svCount} sinh vi??n </Typography>
                                </div>
                            </div>
                            {value.students.map((info) => {
                                return (
                                    <Typography component="div" key={value.students.studentCode} className={clsx(style.listMember, style.flex, style.spaceBetween)}>
                                        <div className={clsx(style.flex, style.spaceBetween)}>
                                            <img style={{ width: 24, height: 24, marginRight: 16 }} src={student} alt='student img' />
                                            <span>{info.studentCode} - {info.fullnanme}</span>
                                        </div>
                                        <IconButton aria-label="delete" size="large" color='error' sx={{ marginRight: 4 }} style={{ display: isTeacherModer ? "inherit" : "none" }}
                                            onClick={() => (handleDelete(info.studentCode, info.fullnanme))}
                                        >
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </Typography>
                                )
                            })}
                            <AppToast content={"X??a h???c sinh " + studentNameFocus + " c?? m?? " + studentCodeFocus + " th??nh c??ng"} type={0} isOpen={openToastDelete} callback={() => {
                                setOpenToastDelete(false);
                            }} />
                            <AppToast content={"Th??m h???c sinh c?? m?? " + studentCodeFocus + " th???t b???i. Kh??ng c?? m?? sinh vi??n n??y"} type={1} isOpen={openToastAddFail} callback={() => {
                                setOpenToastAddFail(false);
                            }} />
                            <AppToast content={"Th??m h???c sinh " + studentNameFocus + " c?? m?? " + studentCodeFocus + " th??nh c??ng"} type={0} isOpen={openToastAddSuccess} callback={() => {
                                setOpenToastAddSuccess(false);
                            }} />
                            <AppToast content={contentError} type={1} isOpen={openToastError} callback={() => {
                                setOpenToastError(false);
                            }} />
                            <Dialog
                                open={openDelete}
                                onClose={handleCloseDelete}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title" className={style.bold}>
                                    {"X??a h???c sinh?"}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description" >
                                        B???n c?? ch???c ch???n x??a h???c sinh {studentNameFocus} m?? s??? {studentCodeFocus} kh??ng?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDelete} className={style.bold}>H???y b???</Button>
                                    <Button onClick={handleComfirmDelete} autoFocus className={style.bold}>
                                        ?????ng ??
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog open={openAdd} onClose={handleCloseAdd}>
                                <DialogTitle className={style.bold}>Th??m sinh vi??n</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                    </DialogContentText>
                                    <TextField
                                        margin="dense"
                                        id="textField"
                                        label="M?? sinh vi??n"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        required
                                        onChange={(e) => handleFillStudentCode(e)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseAdd} className={style.bold}>H???y b???</Button>
                                    <Button onClick={handleConfirmAdd} className={style.bold}>?????ng ??</Button>
                                </DialogActions>
                            </Dialog>
                        </Fragment>
                    )
                }
            })}
        </Typography >
    )
}


export default function ListSV(listSV) {
    const list = [listSV.listSV]
    return (
        <div>
            {list.map((value) => {
                return <Member key={value} value={value} />
            })}
        </div>
    )

}
