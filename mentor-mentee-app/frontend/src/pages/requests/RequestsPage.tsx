import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { matchRequestService } from "../../services/matchRequest";
import { useAuthStore } from "../../store/authStore";
import type { MatchRequest } from "../../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function RequestsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);

  // 받은 요청 (멘토만)
  const { data: incomingRequests, isLoading: incomingLoading } = useQuery({
    queryKey: ["match-requests", "incoming"],
    queryFn: matchRequestService.getIncomingRequests,
    enabled: user?.role === "MENTOR",
  });

  // 보낸 요청 (멘티만)
  const { data: outgoingRequests, isLoading: outgoingLoading } = useQuery({
    queryKey: ["match-requests", "outgoing"],
    queryFn: matchRequestService.getOutgoingRequests,
    enabled: user?.role === "MENTEE",
  });

  // 요청 수락
  const acceptMutation = useMutation({
    mutationFn: matchRequestService.acceptRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-requests"] });
      alert("매칭 요청을 수락했습니다.");
    },
    onError: () => {
      alert("요청 수락 중 오류가 발생했습니다.");
    },
  });

  // 요청 거절
  const rejectMutation = useMutation({
    mutationFn: matchRequestService.rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-requests"] });
      alert("매칭 요청을 거절했습니다.");
    },
    onError: () => {
      alert("요청 거절 중 오류가 발생했습니다.");
    },
  });

  // 요청 취소
  const cancelMutation = useMutation({
    mutationFn: matchRequestService.cancelRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-requests"] });
      alert("매칭 요청을 취소했습니다.");
    },
    onError: () => {
      alert("요청 취소 중 오류가 발생했습니다.");
    },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccept = (requestId: number) => {
    acceptMutation.mutate(requestId);
  };

  const handleReject = (requestId: number) => {
    rejectMutation.mutate(requestId);
  };

  const handleCancel = (requestId: number) => {
    cancelMutation.mutate(requestId);
  };

  const getStatusColor = (
    status: string
  ): "warning" | "success" | "error" | "default" => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "error";
      case "CANCELLED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "ACCEPTED":
        return "수락됨";
      case "REJECTED":
        return "거절됨";
      case "CANCELLED":
        return "취소됨";
      default:
        return status;
    }
  };

  const renderRequestCard = (request: MatchRequest, isIncoming: boolean) => (
    <Card key={request.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" flex={1}>
            <Avatar sx={{ mr: 2 }}>
              {isIncoming ? request.menteeName?.[0] : request.mentorName?.[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6">
                {isIncoming ? request.menteeName : request.mentorName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {isIncoming ? "멘티" : "멘토"}
              </Typography>
              <Typography
                variant="body2"
                className="request-message"
                data-mentee={isIncoming ? request.menteeName : undefined}
              >
                {request.message}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={getStatusText(request.status)}
                  color={getStatusColor(request.status)}
                  size="small"
                  id="request-status"
                />
              </Box>
            </Box>
          </Box>

          {/* 액션 버튼들 */}
          <Box sx={{ ml: 2 }}>
            {isIncoming && request.status === "PENDING" && (
              <Box>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<AcceptIcon />}
                  onClick={() => handleAccept(request.id)}
                  sx={{ mr: 1, mb: 1 }}
                  id="accept"
                  data-testid="accept-button"
                >
                  수락
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<RejectIcon />}
                  onClick={() => handleReject(request.id)}
                  id="reject"
                  data-testid="reject-button"
                >
                  거절
                </Button>
              </Box>
            )}

            {!isIncoming && request.status === "PENDING" && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleCancel(request.id)}
                data-testid="cancel-button"
              >
                취소
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box data-testid="requests-page">
      <Typography variant="h4" component="h1" gutterBottom>
        매칭 요청 관리
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          {user?.role === "MENTOR" && (
            <Tab label="받은 요청" data-testid="incoming-tab" />
          )}
          {user?.role === "MENTEE" && (
            <Tab label="보낸 요청" data-testid="outgoing-tab" />
          )}
        </Tabs>
      </Box>

      {/* 받은 요청 탭 (멘토만) */}
      {user?.role === "MENTOR" && (
        <TabPanel value={tabValue} index={0}>
          {incomingLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : incomingRequests && incomingRequests.length > 0 ? (
            incomingRequests.map((request) => renderRequestCard(request, true))
          ) : (
            <Alert severity="info">받은 매칭 요청이 없습니다.</Alert>
          )}
        </TabPanel>
      )}

      {/* 보낸 요청 탭 (멘티만) */}
      {user?.role === "MENTEE" && (
        <TabPanel value={tabValue} index={0}>
          {outgoingLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : outgoingRequests && outgoingRequests.length > 0 ? (
            outgoingRequests.map((request) => renderRequestCard(request, false))
          ) : (
            <Alert severity="info">보낸 매칭 요청이 없습니다.</Alert>
          )}
        </TabPanel>
      )}
    </Box>
  );
}
