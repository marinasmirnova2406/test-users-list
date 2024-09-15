import * as Yup from "yup";

export const usersTableSchema = Yup.object().shape({
  name: Yup.string()
    .max(30)
    .matches(/^[A-Za-z\s]+$/),
  username: Yup.string()
    .max(30)
    .matches(/^[A-Za-z\s._!]*$/),
  email: Yup.string()
    .max(30)
    .matches(/^[A-Za-z0-9@._-]+$/),
  phone: Yup.string()
    .max(12)
    .matches(/^[0-9+]+$/),
});
