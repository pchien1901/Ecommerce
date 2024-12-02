import React, { useState } from 'react';
import { InputField } from '../../components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
    const [payload, setPayload] = useState({
      
    });

    const validationSchema = Yup.object({
      email: Yup.string()
                .email("Email is not valid.")
                .required("Email is required."),
      password: Yup.string()
                    .required("Password is required.")
    });
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
          <section className='login-container p-8 border border-basic rounded-lg shadow-md'>
              <h1 className='text-[20px] font-semibold text-pure-black'>Login</h1>
              <div>
                <Formik
                  initialValues={{ email: "", password: ""}}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    console.log(values);
                  }}
                >
                  {
                    props => (
                      <Form onSubmit={props.handleSubmit} >
                        <div>
                          {props.values.email.trim() !== '' && 
                          <label className='text-[10px] animate-slide-top-sm absolute top-0 left-[12px] block bg-inherit px-2'>Email</label>
                          }
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="px-4 py-2 rounded-sm border border-basic outline-none w-full my-2 placeholder:text-sm placeholder:capitalize"
                          />
                          <ErrorMessage name="email" component='div' className='error-message'/>
                        </div>
                        
                      </Form>
                    )
                  }
                </Formik>
              </div>
          </section>
        </div>
    )
}

export default Login;