import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee, createClient } from "../../redux/action/user";
import { useLocation } from "react-router-dom";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { useUserFormValidation } from "../../hooks";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateUser = ({ open, setOpen, scroll }) => {
  //////////////////////////////////////// VARIABLES /////////////////////////////////////
  const { pathname } = useLocation();
  const isEmployee = pathname.includes("employees");
  const userType = isEmployee ? "Employee" : "Client";
  const dispatchAction = isEmployee ? createEmployee : createClient;

  const { isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const initialUserState = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
  }

  // Form validation hook
  const {
    values: userData,
    errors,
    handleChange,
    validateForm,
    resetForm
  } = useUserFormValidation(initialUserState, { includePassword: true });

  //////////////////////////////////////// FUNCTIONS /////////////////////////////////////
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(dispatchAction(userData, setOpen));
    resetForm();
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <div>
      <Dialog
        scroll={scroll}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth="sm"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">Add New {userType}</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>{userType} Detials</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tr>
                <td className="pb-4 text-lg">First Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={userData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Last Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={userData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">User Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={userData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Email </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Optional"
                    value={userData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Password </td>
                <td className="pb-4">
                  <TextField
                    type="password"
                    value={userData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    size="small"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Phone </td>
                <td className="pb-4">
                  <TextField
                    type="number"
                    size="small"
                    value={userData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </td>
              </tr>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            variant="contained"
            type="reset"
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            variant="contained"
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin">
            {isFetching ? 'Submitting...' : 'Submit'}
          </button>
        </DialogActions>
      </Dialog>
    </div>

  );
};

export default CreateUser;
