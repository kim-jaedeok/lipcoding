import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  Chip,
  Autocomplete,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { authService } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";

const profileSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// 일반적인 기술 스택 목록
const commonSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring",
  "C++",
  "C#",
  ".NET",
  "PHP",
  "Laravel",
  "Ruby",
  "Rails",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "HTML",
  "CSS",
  "Sass",
  "TailwindCSS",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Redis",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Git",
  "CI/CD",
  "Jest",
  "Cypress",
];

export function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      skills: user?.skills || [],
    },
  });

  const skillsValue = watch("skills") || [];

  // 현재 프로필 정보 조회
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getMe,
  });

  // 프로필 데이터가 변경될 때 사용자 정보 및 폼 업데이트
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      // 폼 데이터도 업데이트 (새로운 파일을 선택하지 않은 경우에만)
      if (!selectedFile) {
        setValue("name", profileData.name);
        setValue("bio", profileData.bio || "");
        setValue("skills", profileData.skills || []);
      }
    }
  }, [profileData, setUser, setValue, selectedFile]);

  // 프로필 업데이트 뮤테이션
  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      console.log("프로필 업데이트 성공:", data);
      console.log("업데이트된 이미지 URL:", data.imageUrl);
      console.log("hasImage:", data.hasImage);
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // 폼 데이터도 업데이트
      setValue("name", data.name);
      setValue("bio", data.bio || "");
      setValue("skills", data.skills || []);
      // 이미지 업로드가 성공한 경우에만 선택된 파일과 미리보기 초기화
      if (selectedFile) {
        setSelectedFile(null);
        setPreviewUrl("");
      }
      alert("프로필이 성공적으로 업데이트되었습니다.");
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let imageBase64: string | undefined = undefined;

      if (selectedFile) {
        // 새 파일이 선택된 경우에만 Base64로 변환
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onload = () => {
            const result = reader.result as string;
            // 전체 data URL을 그대로 사용 (data:image/jpeg;base64,... 형태)
            console.log(
              "Base64 이미지 생성됨:",
              result.substring(0, 50) + "..."
            );
            resolve(result);
          };
          reader.readAsDataURL(selectedFile);
        });
      }

      const requestData = {
        name: data.name,
        bio: data.bio,
        skills: user?.role === "MENTOR" ? data.skills : undefined,
        ...(imageBase64 && { image: imageBase64 }), // 이미지가 있을 때만 포함
      };

      console.log("프로필 업데이트 요청 데이터:", {
        ...requestData,
        image: imageBase64
          ? `[Base64 데이터, 길이: ${imageBase64.length}]`
          : "이미지 없음",
      });

      await updateProfileMutation.mutateAsync(requestData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleSkillsChange = (_: React.SyntheticEvent, newValue: string[]) => {
    setValue("skills", newValue);
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

  return (
    <Box data-testid="profile-page">
      <Typography variant="h4" component="h1" gutterBottom>
        프로필 관리
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* 프로필 사진 */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={(() => {
                  const imageUrl = previewUrl || user?.imageUrl;
                  console.log("Avatar image URL:", imageUrl);
                  console.log("previewUrl:", previewUrl);
                  console.log("user?.imageUrl:", user?.imageUrl);
                  return imageUrl;
                })()}
                alt={user?.name}
                sx={{ width: 100, height: 100, mr: 2 }}
                id="profile-photo"
                data-testid="profile-photo"
              >
                {user?.name?.charAt(0)}
              </Avatar>

              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    data-testid="upload-button"
                    id="profile"
                  >
                    사진 선택
                  </Button>
                </label>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  JPG, PNG 형식 (최대 1MB)
                </Typography>
              </Box>
            </Box>

            {/* 이름 */}
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

            {/* 자기소개 */}
            <TextField
              margin="normal"
              fullWidth
              id="bio"
              label="자기소개"
              multiline
              rows={4}
              error={!!errors.bio}
              helperText={errors.bio?.message}
              data-testid="bio-input"
              {...register("bio")}
            />

            {/* 기술 스택 (멘토만) */}
            {user?.role === "MENTOR" && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  기술 스택
                </Typography>
                <Autocomplete
                  multiple
                  id="skillsets"
                  data-testid="skills-input"
                  options={commonSkills}
                  value={skillsValue}
                  onChange={handleSkillsChange}
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={index}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="기술 스택을 선택하거나 직접 입력하세요"
                      helperText="멘토링 가능한 기술 스택을 입력해주세요"
                    />
                  )}
                />
              </Box>
            )}

            {/* 저장 버튼 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={updateProfileMutation.isPending}
              data-testid="save-button"
              id="save"
            >
              {updateProfileMutation.isPending ? "저장 중..." : "저장"}
            </Button>

            {updateProfileMutation.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                프로필 업데이트 중 오류가 발생했습니다.
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
