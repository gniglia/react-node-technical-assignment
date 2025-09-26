import { TextField } from "@mui/material";
import { useEffect } from "react";
import React from "react";
import { updateUser } from "../../redux/action/user";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  PiNotepad,
  PiXLight,
} from "react-icons/pi";
import { Divider, Dialog, DialogContent, DialogTitle, Slide, DialogActions } from "@mui/material";
import { useUserFormValidation } from "../../hooks";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EditUser = ({ open, setOpen }) => {
  /////////////////////////////////////// VARIABLES ///////////////////////////////////////
  const { pathname } = useLocation();
  const isEmployee = pathname.includes("employees");
  const userType = isEmployee ? "Employee" : "Client";

  const dispatch = useDispatch();
  const { currentEmployee, isFetching, error } = useSelector((state) => state.user);
  const initialUserState = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
  };

  /////////////////////////////////////// STATES ///////////////////////////////////////
  // Form validation hook
  const {
    values: userData,
    errors,
    handleChange,
    validateForm,
    resetForm,
    setFieldValue
  } = useUserFormValidation(currentEmployee || initialUserState, { includePassword: false });

  /////////////////////////////////////// USE EFFECT ///////////////////////////////////////
  useEffect(() => {
    // Update form values when currentEmployee changes
    if (currentEmployee) {
      Object.entries(currentEmployee).forEach(([key, value]) => {
        setFieldValue(key, value);
      });
    }
  }, [currentEmployee, setFieldValue]);

  /////////////////////////////////////// FUNCTIONS ///////////////////////////////////////
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Exclude password from update payload for security
    const { password, ...updateData } = userData;
    dispatch(updateUser(currentEmployee._id, updateData, userData?.role));
    resetForm();
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog
      scroll={"paper"}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth="sm"
      maxWidth="sm"
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle className="flex items-center justify-between">
        <div className="text-sky-400 font-primary">Edit {userType}</div>
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
                  value={userData?.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
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
                  value={userData?.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
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
                    value={userData?.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </td>
              </tr>
            <tr>
              <td className="pb-4 text-lg">User Name </td>
              <td className="pb-4">
                {userData?.username}
              </td>
            </tr>
            <tr>
              <td className="flex items-start pt-2 text-lg">Phone </td>
              <td className="pb-4">
                <TextField
                  type="number"
                  size="small"
                  value={userData?.phone}
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
          {isFetching ? "Submitting..." : "Submit"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;
