import React from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
} from "@material-ui/core";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loginTC } from "./auth-reducer";
import { AppRootStateType } from "../../app/store";
import { Redirect } from "react-router-dom";

type FormikErrorsType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export const Login = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    // validate() is called on each form fields' change !
    validate: (values) => {
      const errors: FormikErrorsType = {};
      if (!values.email) {
        errors.email = "Required field";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required field";
      } else if (values.password.length <= 2) {
        errors.password = "Password must contain at least 3 characters";
      }

      return errors;
    },
    onSubmit: (values) => {
      dispatch(loginTC(values));
      formik.resetForm(); // clearing all form fields on form submitting
    },
  });

  if (isLoggedIn) {
    /* redirecting to todolists if isLoggedIn === true */
    return <Redirect to={"/"} />;
  } else {
    return (
      <Grid container justify="center">
        <Grid item xs={4}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl>
              <FormLabel>
                <p>
                  {"Sign up to log in "}
                  <a
                    href={"https://social-network.samuraijs.com/"}
                    target={"_blank"}
                    rel={"noreferrer"}
                  >
                    here
                  </a>
                </p>
                <p>or use common test account credentials:</p>
                <p>Email: free@samuraijs.com</p>
                <p>Password: free</p>
              </FormLabel>
              <FormGroup>
                <TextField
                  label="Email"
                  margin="normal"
                  {...formik.getFieldProps(
                    "email"
                  )} /* reducing boilerplate code from above by ...formik.getFieldProps() ! */
                />
                {formik.touched.email && formik.errors.email && (
                  <div style={{ color: "red" }}>{formik.errors.email}</div>
                )}
                <TextField
                  type="password"
                  label="Password"
                  margin="normal"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password && (
                  <div style={{ color: "red" }}>{formik.errors.password}</div>
                )}
                <FormControlLabel
                  label={"Remember me"}
                  control={<Checkbox {...formik.getFieldProps("rememberMe")} />}
                />
                <Button type={"submit"} variant={"contained"} color={"primary"}>
                  Login
                </Button>
              </FormGroup>
            </FormControl>
          </form>
        </Grid>
      </Grid>
    );
  }
};
