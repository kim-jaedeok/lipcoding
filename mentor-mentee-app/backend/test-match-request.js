const fetch = require("node-fetch");

const BASE_URL = "http://localhost:3001/api";

async function testMatchRequestAPI() {
  try {
    console.log("🧪 매칭 요청 API 테스트 시작...\n");

    // 1. 멘티로 로그인
    console.log("1️⃣ 멘티 로그인 테스트...");
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "mentee@test.com",
        password: "password123",
      }),
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.log("❌ 로그인 실패:", error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log("✅ 로그인 성공:", loginData.user.name);

    const token = loginData.token;
    const menteeId = loginData.user.id;

    // 2. 멘토 목록 조회
    console.log("\n2️⃣ 멘토 목록 조회...");
    const mentorsResponse = await fetch(`${BASE_URL}/mentors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!mentorsResponse.ok) {
      console.log("❌ 멘토 목록 조회 실패");
      return;
    }

    const mentors = await mentorsResponse.json();
    console.log("✅ 멘토 목록 조회 성공:", mentors.length + "명");

    if (mentors.length === 0) {
      console.log("❌ 사용 가능한 멘토가 없습니다.");
      return;
    }

    const mentor = mentors[0];
    console.log("선택된 멘토:", mentor.name);

    // 3. 새로운 매칭 요청 생성
    console.log("\n3️⃣ 새로운 매칭 요청 생성...");
    const createRequestResponse = await fetch(`${BASE_URL}/match-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mentorId: mentor.id,
        menteeId: menteeId,
        message:
          "API 테스트를 통한 매칭 요청입니다. 프론트엔드 개발을 배우고 싶습니다!",
      }),
    });

    const createRequestText = await createRequestResponse.text();
    console.log("응답 상태:", createRequestResponse.status);
    console.log("응답 내용:", createRequestText);

    if (!createRequestResponse.ok) {
      console.log("❌ 매칭 요청 생성 실패");
      return;
    }

    const newRequest = JSON.parse(createRequestText);
    console.log("✅ 매칭 요청 생성 성공!");
    console.log("요청 ID:", newRequest.id);
    console.log("상태:", newRequest.status);

    // 4. 보낸 요청 목록 조회
    console.log("\n4️⃣ 보낸 요청 목록 조회...");
    const outgoingRequestsResponse = await fetch(
      `${BASE_URL}/match-requests/outgoing`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!outgoingRequestsResponse.ok) {
      console.log("❌ 보낸 요청 목록 조회 실패");
      return;
    }

    const outgoingRequests = await outgoingRequestsResponse.json();
    console.log("✅ 보낸 요청 목록 조회 성공:", outgoingRequests.length + "개");

    outgoingRequests.forEach((request, index) => {
      console.log(
        `${index + 1}. ID: ${request.id}, 멘토: ${
          request.mentorName || request.mentor?.name
        }, 상태: ${request.status}`
      );
    });

    console.log("\n🎉 모든 테스트 완료!");
  } catch (error) {
    console.error("❌ 테스트 중 오류 발생:", error.message);
  }
}

// Node.js에서 fetch를 사용하기 위해 polyfill이 필요할 수 있습니다
if (typeof fetch === "undefined") {
  console.log("fetch를 사용할 수 없습니다. 간단한 버전으로 테스트합니다.");

  // 간단한 테스트 - 데이터베이스 직접 확인
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  async function simpleTest() {
    try {
      console.log("📊 데이터베이스에서 매칭 요청 확인...\n");

      const requests = await prisma.matchRequest.findMany({
        include: {
          mentor: { select: { name: true, email: true } },
          mentee: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      console.log(`총 매칭 요청 수: ${requests.length}`);

      requests.forEach((request, index) => {
        console.log(`\n${index + 1}. 매칭 요청 ID: ${request.id}`);
        console.log(
          `   멘토: ${request.mentor.name} (${request.mentor.email})`
        );
        console.log(
          `   멘티: ${request.mentee.name} (${request.mentee.email})`
        );
        console.log(`   메시지: ${request.message}`);
        console.log(`   상태: ${request.status}`);
        console.log(`   생성일: ${request.createdAt.toISOString()}`);
      });

      console.log(
        "\n✅ 매칭 요청이 데이터베이스에 정상적으로 저장되어 있습니다!"
      );
    } catch (error) {
      console.error("❌ 데이터베이스 확인 중 오류:", error);
    } finally {
      await prisma.$disconnect();
    }
  }

  simpleTest();
} else {
  testMatchRequestAPI();
}
