import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { authService } from "../../services/auth";

const signupSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  name: z.string().min(1, "이름을 입력해주세요"),
  role: z.enum(["mentor", "mentee"], {
    required_error: "역할을 선택해주세요",
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      await authService.signup(data);
      setSuccess("회원가입이 완료되었습니다. 로그인해주세요.");

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" data-testid="signup-page">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          회원가입
        </Typography>

        <Card sx={{ width: "100%", mt: 3 }}>
          <CardContent>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                data-testid="error-message"
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{ mb: 2 }}
                data-testid="success-message"
              >
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="이메일"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                data-testid="email-input"
                {...register("email")}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="비밀번호"
                type="password"
                id="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                data-testid="password-input"
                {...register("password")}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="이름"
                autoComplete="name"
                error={!!errors.name}
                helperText={errors.name?.message}
                data-testid="name-input"
                {...register("name")}
              />

              <FormControl
                component="fieldset"
                sx={{ mt: 2, mb: 2 }}
                error={!!errors.role}
              >
                <FormLabel component="legend">역할 선택</FormLabel>
                <RadioGroup row id="role" data-testid="role-selector">
                  <FormControlLabel
                    value="mentor"
                    control={<Radio {...register("role")} />}
                    label="멘토"
                    data-testid="role-mentor"
                  />
                  <FormControlLabel
                    value="mentee"
                    control={<Radio {...register("role")} />}
                    label="멘티"
                    data-testid="role-mentee"
                  />
                </RadioGroup>
                {errors.role && (
                  <Typography variant="caption" color="error">
                    {errors.role.message}
                  </Typography>
                )}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
                data-testid="signup-button"
              >
                {isLoading ? "가입 중..." : "가입하기"}
              </Button>

              <Box textAlign="center">
                <Link to="/login">
                  <Typography
                    variant="body2"
                    color="primary"
                    data-testid="login-link"
                  >
                    이미 계정이 있으신가요? 로그인
                  </Typography>
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
