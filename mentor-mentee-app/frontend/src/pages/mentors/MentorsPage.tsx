import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { mentorService } from "../../services/mentor";
import { matchRequestService } from "../../services/matchRequest";
import { useAuthStore } from "../../store/authStore";
import type { Mentor } from "../../types";

export function MentorsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "skill">("name");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [message, setMessage] = useState("");

  const createMatchRequestMutation = useMutation({
    mutationFn: ({
      mentorId,
      message,
    }: {
      mentorId: number;
      message: string;
    }) => matchRequestService.createRequest({ mentorId, message }),
    onSuccess: () => {
      // 매칭 요청 목록 업데이트를 위해 올바른 쿼리 키 사용
      queryClient.invalidateQueries({ queryKey: ["match-requests"] });
      setDialogOpen(false);
      setSelectedMentor(null);
      setMessage("");
      alert("매칭 요청을 성공적으로 보냈습니다!");
    },
    onError: () => {
      alert("매칭 요청 전송 중 오류가 발생했습니다.");
    },
  });

  const {
    data: mentors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mentors", searchQuery, sortBy],
    queryFn: () =>
      mentorService.getMentors({
        skill: searchQuery || undefined,
        order_by: sortBy,
      }),
  });

  // 멘티만 접근 가능
  if (user?.role !== "MENTEE") {
    return (
      <Alert severity="warning" data-testid="access-denied">
        멘티만 접근할 수 있는 페이지입니다.
      </Alert>
    );
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSortChange = (event: any) => {
    setSortBy(event.target.value as "name" | "skill");
  };

  const handleRequestMatch = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMentor(null);
    setMessage("");
  };

  const handleSubmitRequest = () => {
    if (selectedMentor && message.trim()) {
      createMatchRequestMutation.mutate({
        mentorId: selectedMentor.id,
        message: message.trim(),
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress data-testid="loading-spinner" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" data-testid="error-message">
        멘토 목록을 불러오는 중 오류가 발생했습니다.
      </Alert>
    );
  }

  return (
    <Box data-testid="mentors-page">
      <Typography variant="h4" component="h1" gutterBottom>
        멘토 찾기
      </Typography>

      {/* 검색 및 정렬 */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="이름이나 기술 스택으로 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, minWidth: 300 }}
          data-testid="search-input"
          id="search"
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>정렬</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="정렬"
            data-testid="sort-select"
          >
            <MenuItem value="name" data-testid="sort-name" id="name">
              이름순
            </MenuItem>
            <MenuItem value="skill" data-testid="sort-skill" id="skill">
              기술 스택순
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 멘토 목록 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {mentors?.map((mentor: Mentor) => (
          <Card key={mentor.id} className="mentor" data-mentor-id={mentor.id}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                >
                  {mentor.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" component="h2">
                    {mentor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    멘토
                  </Typography>
                </Box>
              </Box>

              {mentor.bio && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {mentor.bio}
                </Typography>
              )}

              {mentor.skills && mentor.skills.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    기술 스택
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {mentor.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={() => handleRequestMatch(mentor)}
                data-testid="request-button"
                id="request"
                data-mentor-id={mentor.id}
              >
                매칭 요청
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {mentors && mentors.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            검색 조건에 맞는 멘토가 없습니다.
          </Typography>
        </Box>
      )}

      {/* 매칭 요청 다이얼로그 */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedMentor && `${selectedMentor.name} 멘토에게 매칭 요청`}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="message"
            data-testid="message-input"
            data-mentor-id={selectedMentor?.id}
            label="요청 메시지"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="멘토에게 전달할 메시지를 작성해주세요..."
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            취소
          </Button>
          <Button
            onClick={handleSubmitRequest}
            variant="contained"
            disabled={!message.trim() || createMatchRequestMutation.isPending}
            data-testid="submit-request"
          >
            {createMatchRequestMutation.isPending
              ? "전송 중..."
              : "요청 보내기"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
