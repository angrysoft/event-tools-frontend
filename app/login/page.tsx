"use client";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { MaterialSymbols } from "../components/atoms/MaterialSymbols";

export default function Login() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  const handleSubmit = async (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setErrorMsg("");
    const formElement = ev.target as HTMLFormElement;
    const formData = new FormData(formElement);
    let response;
    try {
      response = await fetch("/api/user/login", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (response.status === 200) {
        router.replace("/");
      } else if (response.status === 401) {
        setErrorMsg("Nieprawidłowy login lub hasło");
      }
    } catch (error) {
      if (error instanceof Error) setErrorMsg(error?.message);
      console.error("error: ", error);
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
            <Typography component={"span"} textAlign={"center"} color={"error"}>
              {errorMsg}
            </Typography>
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
