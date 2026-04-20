import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Chip,
  Fade,
  useTheme,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import signinAnimation from "../../assets/signin.json";
import { useAuth } from "../../context/AuthContext";

// Floating Tab Component
const FloatingTab = ({ label, position, delay, color }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Fade in={isVisible} timeout={1000}>
      <Chip
        label={label}
        sx={{
          position: "absolute",
          ...position,
          fontWeight: 600,
          fontSize: "0.85rem",
          px: 1.5,
          py: 2,
          backgroundColor: color,
          color: "white",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          animation: "float 4s ease-in-out infinite",
          animationDelay: `${delay}ms`,
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-15px)" },
          },
          zIndex: 10,
          cursor: "default",
          display: { xs: "none", md: "inline-flex" }, // Hide on mobile
          "&:hover": {
            transform: "scale(1.05)",
            transition: "transform 0.3s ease",
          },
        }}
      />
    </Fade>
  );
};

const Signin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      await login(formData);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signin failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Floating tabs - repositioned to be above/around Lottie at left
  const floatingTabs = [
    { label: "Campus", position: { top: "15%", left: "10%" }, delay: 200, color: theme.palette.primary.main },
    { label: "Market", position: { top: "35%", left: "5%" }, delay: 400, color: theme.palette.secondary.main },
    { label: "Place", position: { bottom: "25%", left: "15%" }, delay: 600, color: theme.palette.info.main },
  ];

  return (
    <Box
      sx={{
        height: { md: "calc(100vh - 64px)", xs: "auto" }, // Fit inside DashboardLayout (header is approx 64px)
        minHeight: { xs: "calc(100vh - 64px)" },
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: { md: "hidden", xs: "auto" },
        p: { xs: 2, md: 4 },
        transition: "background-color 0.3s ease",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 20 }}>
        <Grid container spacing={{ xs: 2, md: 8 }} alignItems="center" justifyContent="center">
          {/* Left Side - Lottie Animation + Floating Tabs */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: { xs: "none", md: "flex" }, 
              justifyContent: "center",
              order: { xs: 2, md: 1 },
              position: "relative"
            }}
          >
            {/* Floating Tabs nested here or positioned relative to this grid */}
            {floatingTabs.map((tab, index) => (
              <FloatingTab key={index} {...tab} />
            ))}
            <Box
              sx={{
                width: "100%",
                maxWidth: { md: 400, lg: 450 },
                filter: theme.palette.mode === "dark" 
                  ? "drop-shadow(0 20px 40px rgba(0,0,0,0.4)) brightness(0.9)" 
                  : "drop-shadow(0 20px 40px rgba(0,0,0,0.1))",
              }}
            >
              <Lottie animationData={signinAnimation} loop={true} />
            </Box>
          </Grid>

          {/* Right Side - Signin Form */}
          <Grid 
            item 
            xs={12} 
            md={5} 
            sx={{ order: { xs: 1, md: 2 } }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: theme.palette.mode === "dark" 
                  ? "0 25px 50px -12px rgba(0,0,0,0.5)" 
                  : "0 25px 50px -12px rgba(0,0,0,0.08)",
                maxWidth: { xs: "100%", sm: 480 },
                mx: "auto",
                transition: "all 0.3s ease",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                align="center"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: "1.75rem", sm: "2.25rem" },
                  color: "text.primary",
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Sign in to your account
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Email Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Password Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Sign Up Link */}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Signin;
