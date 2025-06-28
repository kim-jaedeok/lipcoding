import { Typography, Box, Card, CardContent, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

export function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <Box data-testid="dashboard-page">
      <Typography variant="h4" component="h1" gutterBottom>
        안녕하세요, {user?.name}님!
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        {user?.role === "MENTOR" ? "멘토" : "멘티"}로 로그인하셨습니다.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
          mt: 2,
        }}
      >
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">프로필 관리</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              프로필 정보를 수정하고 관리하세요.
            </Typography>
            <Button
              component={Link}
              to="/profile"
              variant="outlined"
              fullWidth
              data-testid="goto-profile"
            >
              프로필 수정
            </Button>
          </CardContent>
        </Card>

        {user?.role === "MENTEE" && (
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">멘토 찾기</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                다양한 분야의 멘토를 찾아보세요.
              </Typography>
              <Button
                component={Link}
                to="/mentors"
                variant="outlined"
                fullWidth
                data-testid="goto-mentors"
              >
                멘토 찾기
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AssignmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">매칭 요청</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {user?.role === "MENTOR"
                ? "받은 매칭 요청을 확인하고 관리하세요."
                : "보낸 매칭 요청을 확인하고 관리하세요."}
            </Typography>
            <Button
              component={Link}
              to="/requests"
              variant="outlined"
              fullWidth
              data-testid="goto-requests"
            >
              매칭 요청 관리
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
