import { useState } from 'react';
import classes from './SignInForm.module.css';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });

    const [errors, setErrors] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const auth = getAuth();
        const { user } = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        if (user) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error signing in:', error.message);
        switch (error.code) {
          case 'auth/invalid-credential':
            setErrors('Invalid email or password');
            break;
          case 'auth/too-many-requests':
            setErrors('Many failed login attempts. Please try again later');
            break;
          case 'auth/invalid-email':
            setErrors('Invalid email');
            break;
          case 'auth/missing-password':
            setErrors('Missing password');
            break;
          default:
            setErrors('An error occurred while signing in');
            break;
        }
      }
    };
  
  
    return (
      <div className={classes.signInContainer}>
        <div className={classes.signInForm}>
          <h2 className={classes.text}>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <input
                className={classes.input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className={classes.formGroup}>
              <input
                className={classes.input}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>

            <button className={classes.myBtn} type="submit">
              Sign In
            </button>
            {errors && <div className={classes.error}>{errors}</div>}
          </form>
        </div>
      </div>
    );
};

  
export default SignInForm;
