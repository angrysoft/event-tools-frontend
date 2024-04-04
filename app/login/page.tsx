"use client";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MaterialSymbols } from "../components/atoms/MaterialSymbols";
import { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const formElement = ev.target as HTMLFormElement;
    const data = new FormData(formElement);
    const req = await fetch("/api/user/signin", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    console.log(req);
    if (req.ok) {
      const data = await req.json();
      console.log(data);
      // router.replace("/");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          padding: "2rem",
        }}
      >
        <Box p={2}>
          <Typography
            component={"h1"}
            textAlign={"center"}
            fontWeight={500}
            fontSize={"1.5rem"}
          >
            Logowanie
          </Typography>
        </Box>
        <Box p={2}>
          <Stack
            component="form"
            spacing={2}
            useFlexGap
            onSubmit={(ev) => handleSubmit(ev)}
          >
            <TextField required id="username" label="Login" name="username" />
            <TextField
              required
              id="password"
              label="hasło"
              type="password"
              name="password"
            />
            <Button
              variant={"contained"}
              startIcon={<MaterialSymbols name="login" />}
              type="submit"
            >
              Logowanie
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
