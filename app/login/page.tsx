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
    const req = await fetch("/api/v1/user/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (req.ok) {
      router.replace("/");
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
            onSubmit={handleSubmit}
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
