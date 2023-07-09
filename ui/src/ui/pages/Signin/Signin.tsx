// Import packges
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BiError } from 'react-icons/bi';

// Import react icons
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

// Import components
import SimpleLink from '../../components/SimpleLink/SimpleLink';
import SpecialButton from '../../components/SpecialButton/SpecialButton';
import IconButton from '../../components/IconButton/IconButton';
import InputField from '../../components/InputField/InputField';
import PasswordField from '../../components/PasswordField/PasswordField';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';

// Import services
import { validateInputField } from '../../../services/formValidation';

// Import rtk query
import { useSignInUserMutation } from '../../../store/api';

// Import css
import './Signin.css';
import '../../../App.css';

// Defining Signin page
const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);

  const [signInUser] = useSignInUserMutation();

  /**
   * Function to signin user
   */
  const onSignIn = async () => {
    const emailError = validateInputField('email', email);
    setEmailErrorMessage(emailError);
    const passwordError = validateInputField('password', password);
    setPasswordErrorMessage(passwordError);
    if (emailError || passwordError) {
      return;
    }
    const res = await signInUser(formData);
    const response = (
      'data' in res ? res.data : 'data' in res.error ? res.error.data : null
    );

    if (response.success) {
      toast.success(`${response.message}`, {
        duration: 3000,
        position: 'bottom-center',
        ariaProps: {
          'role': 'status',
          'aria-live': 'polite',
        },
      });
      navigate('/dashboard');
    } else {
      toast.error(`${response.message}`, {
        duration: 3000,
        position: 'bottom-center',
        ariaProps: {
          'role': 'status',
          'aria-live': 'polite',
        },
      });
    }
  };

  return (
    <div className="container signin-position-relative">
      {isModalOpen && <ForgotPassword setisModalOpen={setIsModalOpen}/>}
      <div className="form-container signin-gap">
        <div className='flex-column-between'>
          <img src="/assets/logo.png" alt="" width={150}/>
          <h2 className='form-title'>Welcome Back!</h2>
        </div>
        <form className='flex-column-center w-full signin-gap-1rem'>
          <div className='w-full'>
            <InputField
              title={'Email Address'}
              id={'email'}
              type={'text'}
              value={email}
              placeHolder={'Your Email Address'}
              Icon={AiOutlineUser}
              disabled={false}
              onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
            />
            <div className={`error-message-container ${emailErrorMessage ? 'visible' : 'hidden'}`}>
              <BiError className="error-message-icon" />
              <p className="error-message">{emailErrorMessage}</p>
            </div>
          </div>
          <div className='w-full'>
            <PasswordField
              title={'Password'}
              id={'password'}
              onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
              value={password}
              placeHolder={'Your Password'}
              Icon={AiOutlineLock}
              disabled={false}
            />
            <div className={`error-message-container ${passwordErrorMessage ? 'visible' : 'hidden'}`}>
              <BiError className="error-message-icon" />
              <p className="error-message">{passwordErrorMessage}</p>
            </div>
          </div>
          <div className='flex-row-between'>
            <SimpleLink link={'/signup'} title={'Dont have an account? Signup!'} color='blue' />
            {/* <SimpleLink link={'/forgotpassword'} title={'Forgot Password?'} color='red'/> */}
            <button onClick={() => setIsModalOpen(!isModalOpen)} className='signin-text-btn' type='button'>
              Forgot Password?
            </button>
          </div>
          <div className='w-full'>
            <SpecialButton
              onClick={onSignIn}
              title={'Sign In'}
              id="signInBtn"
            />
          </div>
        </form>
        <div className='w-full'>
          <div>
            <p className="signin-para">
            Or
            </p>
          </div>
          <div className='flex-row-between  '>
            <IconButton
              id="googleSignInBtn"
              title='google'
              Icon={FcGoogle}
              color={'#922724'}
              borderColor={'#922724'}
              onClick={() =>
                (window.location.href = 'http://localhost:4000/api/auth/google')
              }
            />
            <IconButton
              id="githubSignInBtn"
              title='github'
              Icon={FaGithub}
              color={'black'}
              borderColor={'black'}
              onClick={() =>
                (window.location.href = 'http://localhost:4000/api/auth/github')
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporting page
export default Signin;
