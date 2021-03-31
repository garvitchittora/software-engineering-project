import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import {
  Button,
  Grid,
  makeStyles,
  TextField,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import TopBar from "../TopBar/TopBar";
import { useCookies } from "react-cookie";
// import UpdatePhoto from "../../assets/Profile/updatesred.svg";
import ProfileDetails from "../../assets/Profile/prof_details.svg";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: 0,
  },
  container: {
    margin: "2% 0",
  },
  appeals: {
    width: "95vw",
    maxWidth: "1000px",
    margin: "5% auto",
  },
  submitButton: {
    background:
      "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
    width: "200px",
    fontWeight: "800",
    padding: "1%",
    fontSize: "16px",
    border: "none",
    "&:hover": {
      cursor: "pointer",
    },
  },
  updatePhoto: {
    maxWidth: "30vw",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "40vw",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  form__items: {
    width: "60%",
    margin: ".8rem",
    [theme.breakpoints.down("sm")]: {
      width: "80%",
      margin: ".5rem",
    },
  },
  updateForm: {
    margin: 0,
    marginTop: "2rem",
    padding: "2rem",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
  },
  loader: {
    position: "absolute",
    top: "-.8rem",
  },
}));

const UpdateProfile = () => {
  const classes = useStyles();
  const [cookies] = useCookies(["user"]);
  const [key, setKey] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({});
  const section = [
    {
      value: "A",
      label: "A",
    },
    {
      value: "B",
      label: "B",
    },
    {
      value: "C",
      label: "C",
    },
    {
      value: "D",
      label: "D",
    },
    {
      value: "E",
      label: "E",
    },
  ];

  const branch = [
    {
      value: "IT",
      label: "IT",
    },
    {
      value: "ECE",
      label: "ECE",
    },
    {
      value: "IT-BI",
      label: "IT-BI",
    },
  ];

  useEffect(() => {
    setKey(cookies.user["key"]);
  }, []);

  useEffect(() => {
    if (key) {
      const exec = async () => {
        const config = {
          headers: {
            authorization: key,
          },
        };
        const res = await axios.get("/student/profile", config);
        setUserData(res.data);
      };
      exec();
    }
  }, [key]);

  const updateUserData = async () => {
    setError("");
    setFailure(false);
    setSuccess(false);
    if (!userData.semester || !userData.branch || !userData.section) {
      setError("Please fill all the required fields");
      setFailure(true);
      return;
    }

    if (userData.semester > 8) {
      setError("Please enter a value between 1-8 for semester");
      setFailure(true);
      return;
    }
    const config = {
      headers: {
        authorization: key,
      },
    };
    const student = await axios.put("/student/profile", userData, config);

    student.status === 200 ? setSuccess("true") : setFailure("true");
    failure && setError(student.data.error);
  };

  return (
    <>
      {key !== null ? (
        <div className={`${classes.root} ${classes.container}`}>
          <TopBar actor="STUDENT" useCase="Update Profile" />
          {success && (
            <Alert severity="success" onClose={() => setSuccess(false)}>
              Your information has been updated
            </Alert>
          )}
          {failure && (
            <Alert severity="error" onClose={() => setFailure(false)}>
              {error}
            </Alert>
          )}
          <Grid container spacing={3} className={classes.updateForm}>
            <Grid
              container
              item
              xs={12}
              sm={6}
              direction="column"
              alignItems="center"
            >
              <h3>{userData.email}</h3>
              <TextField
                className={classes.form__items}
                InputLabelProps={{ shrink: true }}
                label="Name"
                fullWidth
                variant="filled"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
              <TextField
                required
                type="number"
                className={classes.form__items}
                InputLabelProps={{ shrink: true }}
                InputProps={{ inputProps: { min: 1, max: 8 } }}
                label="Semester"
                variant="filled"
                value={userData.semester}
                onChange={(e) =>
                  setUserData({ ...userData, semester: e.target.value })
                }
              />
              <TextField
                required
                className={classes.form__items}
                InputLabelProps={{ shrink: true }}
                select
                label="Branch"
                variant="filled"
                value={userData.branch}
                onChange={(e) =>
                  setUserData({ ...userData, branch: e.target.value })
                }
              >
                {branch.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                className={classes.form__items}
                InputLabelProps={{ shrink: true }}
                label="Section"
                select
                variant="filled"
                value={userData.section}
                onChange={(e) =>
                  setUserData({ ...userData, section: e.target.value })
                }
              >
                {section.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                className={`${classes.submitButton} ${classes.form__items}`}
                onClick={updateUserData}
                variant="contained"
              >
                Update Details
              </Button>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sm={6}
              justify="center"
              alignItems="center"
            >
              <img
                src={ProfileDetails}
                alt="task update"
                className={classes.updatePhoto}
              />
            </Grid>
          </Grid>
        </div>
      ) : (
        <Redirect to="/login/student" />
      )}
    </>
  );
};

export default UpdateProfile;