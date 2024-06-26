import { Alert, AlertColor, AlertProps, AlertTitle, Snackbar } from "@mui/material";
import { useSelector } from "react-redux";
import { selectAlert, useAppDispatch } from "../../../store/store";
import { alertSlice } from "../../../store/alertSlice";
import { forwardRef } from "react";


const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(function SnackbarAlert(props, ref) {
  return <Alert ref={ref} {...props} />;
});

const CustomAlert: React.FC = () => {
  const { title, severity, open } = useSelector(selectAlert);
  const dispatch = useAppDispatch();
  const { closeAlert } = alertSlice.actions;

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={() => dispatch(closeAlert())}>
      <SnackbarAlert severity={severity as AlertColor}>
        <AlertTitle>{title}</AlertTitle>
      </SnackbarAlert>
    </Snackbar>
  );
};


export default CustomAlert;
