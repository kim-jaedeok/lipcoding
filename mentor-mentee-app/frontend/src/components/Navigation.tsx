import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { Button } from "@mui/material";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useState } from "react";

export function Navigation() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar position="static" data-testid="navigation">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 3 }}>
          멘토링 앱
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            startIcon={<HomeIcon />}
            data-testid="nav-dashboard"
          >
            대시보드
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/mentors"
            startIcon={<PeopleIcon />}
            data-testid="nav-mentors"
          >
            멘토 찾기
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/requests"
            startIcon={<AssignmentIcon />}
            data-testid="nav-requests"
          >
            매칭 요청
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/profile"
            startIcon={<PersonIcon />}
            data-testid="nav-profile"
          >
            프로필
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            data-testid="theme-toggle"
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            data-testid="user-menu"
          >
            <AccountCircle />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Typography textAlign="center">
                {user.fullName} ({user.role === "MENTOR" ? "멘토" : "멘티"})
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout} data-testid="logout-button">
              로그아웃
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
