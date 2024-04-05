"use client";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { use } from "react";
import { AuthContext } from "../../../context/authContext";
import { useLogout } from "../../../hooks/useLogout";
import { MaterialSymbols } from "../../atoms/MaterialSymbols";

const drawerWidth = 240;

interface IUserMenu {
  actions?: any[];
  actionView?: React.ReactNode;
}

function UserMenu(props: IUserMenu) {
  // const auth = use(AuthContext);
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // console.log(auth);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            {/* {auth?.user?.username} */}
          </Typography>
          <IconButton onClick={handleClick}>
          <Avatar ></Avatar>
          </IconButton>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={handleClose}>Ustawienia</MenuItem>
            <MenuItem onClick={()=> logout()}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton href="/calendar">
                <ListItemIcon>
                  <MaterialSymbols name="calendar_month" />
                </ListItemIcon>
                <ListItemText primary={"Kalendarz imprez"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MaterialSymbols name="perm_contact_calendar" />
                </ListItemIcon>
                <ListItemText primary={"Grafik"} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List></List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {props.actions}
      </Box>
    </Box>
  );
}

export { UserMenu };
