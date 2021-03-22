import React from 'react';
import axios from 'axios';
import LoginPage from './LoginPage';
import AuthorityLoginPic from '../../assets/Login/authLogin.svg'

const AuthorityLogin = () => {

    const [EmailValues, setEmailValues] = React.useState('');
    const [PasswordValues, setPasswordValues] = React.useState('');

    const [openAlert, setOpenAlert] = React.useState(false);

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            password: PasswordValues,
        }

        axios.post('/authority/auth',body)
        .then((res)=>{
            let data = res.data;
            if(res.status === 200 || res.status === 201){
                alert("Login Successfully")
            }else{
                alert("Failed")
            } 

            localStorage.setItem('key',data.authKey);
            console.log(data.authKey);
        })
        .catch((err)=>{
            if(err.response.status === 400 || err.response.status === 403)
                setOpenAlert(true);
        });
    }

    return (
        <>
            <LoginPage 
                actor="Authority"
                EmailValues={EmailValues} 
                PasswordValues={PasswordValues}
                setEmailValues={setEmailValues}
                setPasswordValues={setPasswordValues}
                submitFunction={submitFunction}
                loginImage={AuthorityLoginPic}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />
        </>
    )
}

export default AuthorityLogin;
