import {
  Autocomplete,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CenteredFlexBox } from "../../Common/CenteredFlexBox/CenteredFlexBox";
import { PageTitle } from "../../Common/PageTitle/PageTitle";
import { RoleService } from "../../Services/RoleService";
import { SocketIOService } from "../../Services/SocketIOService";
import { UnitService } from "../../Services/UnitService";
import { UserService } from "../../Services/UserService";
import { Utilities } from "../../Services/Utilities";
import { Role, User } from "../../types/types";

const EditRole = () => {
  const [allUsers, setAllUsers] = useState<User[]>(null!);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  // TODO: Use Yup
  const [cadetError, setCadetError] = useState<string>(null!);
  const [selectedCadet, setSelectedCadet] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchRolesAndCadets = async () => {
      const newRoles = await RoleService.getAll();
      const allUsers = await UserService.getAllWithRoles();

      setAllUsers(allUsers);
      setAllRoles(newRoles);
      setSelectedRole(newRoles[0]);
    };

    fetchRolesAndCadets();
  }, []);

  useEffect(() => {
    if (selectedCadet) {
      setSelectedRole(
        allRoles.find((role) => role.id === selectedCadet.role.id) ?? null
      );
    }
  }, [selectedCadet, allRoles]);

  const handleEditRole = () => {
    if (!selectedCadet) {
      setCadetError("אנא הזן צוער");
    } else if (selectedRole) {
      const promises = [];
      promises.push(UserService.updateRole(selectedCadet.id, selectedRole.id));

      Promise.all(promises)
        .then(() => {
          toast.success("התפקיד שונה בהצלחה");
        })
        .catch(() => {
          toast.error("אירעה שגיאה בשינוי התפקיד");
        });
    }
  };

  return (
    <>
      <PageTitle title="מסך הרשאות" />
      <CenteredFlexBox>
        <Stack
          sx={{ marginTop: theme.spacing(4), width: "50%" }}
          alignItems="center"
          spacing={4}
        >
          <Typography variant="h4" fontWeight="bold">
            שינוי הרשאות
          </Typography>
          <Autocomplete<User>
            sx={{
              width: "100%",
            }}
            options={allUsers}
            value={selectedCadet}
            onChange={(event, user) => {
              setSelectedCadet(user);
            }}
            getOptionLabel={(option) => Utilities.getFullName(option)}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(cadetError)}
                label={Boolean(cadetError) ? cadetError : "צוער"}
              />
            )}
          />
          <Autocomplete<Role>
            sx={{
              width: "100%",
            }}
            options={allRoles}
            value={selectedRole}
            onChange={(event, role) => {
              setSelectedRole(role);
            }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="תפקיד" />}
          />

          <Button
            variant="contained"
            sx={{ width: "90%" }}
            style={{ background: "#37dd93" }}
            onClick={handleEditRole}
          >
            שינוי תפקיד
          </Button>
        </Stack>
      </CenteredFlexBox>
    </>
  );
};

export default EditRole;
