import { Box, CircularProgress } from "@mui/material";

interface LoaderProps {
  size? :number
}

export function Loader(props: LoaderProps) {
  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100dvh",
    }}>
      <CircularProgress size={props.size ?? 40}/>
    </Box>
  )
}