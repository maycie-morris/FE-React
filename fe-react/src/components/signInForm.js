import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';
import styled from 'styled-components'
import { useHistory } from 'react-router-dom';
import { login } from '../store/actions'
import { connect } from 'react-redux'
import { ToastsContainer, ToastsStore} from 'react-toasts'

const MainDiv = styled.div`
    
`

const FormDiv = styled.div`
    margin: 0 auto;
    width: 500px;
    height: 500px;
    background: white;
    border-radius: 500px;
    border: 8px solid rgba(245,245,245, 0.5);
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
`

const Header = styled.h1`
    margin:0 0 50px 0;
    padding:10px;
    text-align:center;
    font-size:30px;
    color:darken(#e5e5e5, 50%);
    border-bottom:solid 1px #e5e5e5;
`

const SubHeader = styled.span`
    display:block;
    background: #F9A5A5;
    padding: 2px 5px;
    color: #666;
`

const FormInputs = styled.p`
    margin: 0 0 3em 0;
    position: relative;
`

const Inputs = styled.input`
    display: block;
    box-sizing: border-box;
    width: 100%;
    outline: none;
    margin:0;
`

const Submit = styled.button`
    background: $button;
    box-shadow: 0 3px 0 0
`


const formSchema = yup.object().shape({
    username: yup
        .string()
        .min(3, "Must be a valid username")
        .required("username is a required field"),
    password: yup
        .string()
        .min(5, "Password must be at least 5 characters")
        .required("Must include a password"),
})

// Form Function

function SignInForm(props) {
    const history = useHistory()
    const [userList, setUserList] = useState([]);

    const [formState, setFormState] = useState({
        username: "",
        password: "",
    });

const [buttonDisabled, setButtonDisabled] = useState(true);

useEffect(() => {
    formSchema.isValid(formState).then(valid => {
        setButtonDisabled(!valid);
    });
}, [formState]);

const [errorState, setErrorState] = useState({
    username: "",
    password: ""
});

const validate = e => {
    let value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
    yup
      .reach(formSchema, e.target.name)
      .validate(value)
      .then(valid => {
          setErrorState({
              ...errorState,
              [e.target.name]: ""
          })
      })
      .catch(err => {
          setErrorState({
              ...errorState,
              [e.target.name]: err.errors[0]
          });
      });
};

// onChange function

const inputChange = e => {
    e.persist();
    validate(e);
    let value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormState({...formState, [e.target.name]: value});
};

const formSubmit = e => {
    e.preventDefault();
    props.login(formState)
    .then((res) => {
        if (res) {
            history.push("/signIn")
           alert("not valid") 
        } else {
            history.push('/protected')
        }
    })
    
};

return (
    <MainDiv>
    <form onSubmit={formSubmit}>
    <FormDiv>
    <Header>
            Sign In
    </Header>
        <FormInputs>
        <label htmlFor="username">
            Username
            <Inputs
                type="username"
                name="username"
                id="username"
                value={formState.username}
                onChange={inputChange}
                />
                {errorState.username.length > 0 ? (
                    <p className="error">{errorState.username}</p>
                ) : null}
        </label>
        </FormInputs>
        <FormInputs>
        <label htmlFor="password">
            Password
            <Inputs
                type="password"
                name="password"
                id="password"
                value={formState.password}
                onChange={inputChange}
            />
            {errorState.password.length < 0 ? (
                    <p className="error">{errorState.password}</p>
                ) : null}
        </label>
        </FormInputs>
            <div className="button-div">
        <button disabled={buttonDisabled}>Submit</button>
        </div>
    </FormDiv>
    </form>
    </MainDiv>
);

};

const mapStateToProps = (state) => {
    return {
        data: state.LoginReducer.data
    }
}

export default connect(mapStateToProps, {login})(SignInForm);
