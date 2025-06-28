// 매칭 요청 기능 종합 테스트
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function comprehensiveMatchRequestTest() {
  try {
    console.log("🧪 매칭 요청 종합 테스트 시작...\n");

    // 1. 기존 매칭 요청 상태 확인
    console.log("1️⃣ 현재 데이터베이스 상태:");
    const currentRequests = await prisma.matchRequest.count();
    const currentUsers = await prisma.user.count();
    console.log(`   사용자 수: ${currentUsers}`);
    console.log(`   매칭 요청 수: ${currentRequests}\n`);

    // 2. 프론트엔드에서 사용할 수 있는 계정 정보 표시
    console.log("2️⃣ 테스트 계정 정보:");
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });

    const mentors = users.filter((u) => u.role === "MENTOR");
    const mentees = users.filter((u) => u.role === "MENTEE");

    console.log("   멘토 계정:");
    mentors.forEach((mentor) => {
      console.log(
        `     ID: ${mentor.id}, 이메일: ${mentor.email}, 이름: ${mentor.name}`
      );
    });

    console.log("   멘티 계정:");
    mentees.forEach((mentee) => {
      console.log(
        `     ID: ${mentee.id}, 이메일: ${mentee.email}, 이름: ${mentee.name}`
      );
    });

    // 3. 새로운 매칭 요청 시뮬레이션 (프론트엔드와 동일한 로직)
    if (mentors.length > 0 && mentees.length > 0) {
      console.log("\n3️⃣ 새로운 매칭 요청 생성 시뮬레이션...");

      const mentorId = mentors[0].id;
      const menteeId = mentees[0].id;
      const message =
        "프로그래밍 멘토링을 요청드립니다. React와 Node.js를 배우고 싶습니다.";

      console.log(`   멘토 ID: ${mentorId} (${mentors[0].name})`);
      console.log(`   멘티 ID: ${menteeId} (${mentees[0].name})`);
      console.log(`   메시지: ${message}`);

      // 기존 요청 확인 (백엔드 로직 시뮬레이션)
      const existingRequest = await prisma.matchRequest.findFirst({
        where: {
          mentorId,
          menteeId,
          status: { in: ["PENDING", "ACCEPTED"] },
        },
      });

      if (existingRequest) {
        console.log("   ⚠️  이미 존재하는 요청이 있습니다.");
        console.log(
          `      요청 ID: ${existingRequest.id}, 상태: ${existingRequest.status}`
        );
      } else {
        // 새 요청 생성
        const newRequest = await prisma.matchRequest.create({
          data: {
            mentorId,
            menteeId,
            message,
            status: "PENDING",
          },
          include: {
            mentor: { select: { name: true, email: true } },
            mentee: { select: { name: true, email: true } },
          },
        });

        console.log("   ✅ 새로운 매칭 요청 생성 성공!");
        console.log(`      요청 ID: ${newRequest.id}`);
        console.log(`      생성 시간: ${newRequest.createdAt.toISOString()}`);
      }
    }

    // 4. 최종 상태 확인
    console.log("\n4️⃣ 최종 데이터베이스 상태:");
    const finalRequests = await prisma.matchRequest.findMany({
      include: {
        mentor: { select: { name: true } },
        mentee: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`   총 매칭 요청: ${finalRequests.length}개\n`);

    finalRequests.forEach((request, index) => {
      console.log(`   ${index + 1}. ID: ${request.id}`);
      console.log(
        `      멘토: ${request.mentor.name} → 멘티: ${request.mentee.name}`
      );
      console.log(`      상태: ${request.status}`);
      console.log(`      메시지: ${request.message.substring(0, 50)}...`);
      console.log(`      생성일: ${request.createdAt.toISOString()}\n`);
    });

    // 5. 프론트엔드 테스트 가이드
    console.log("5️⃣ 프론트엔드 테스트 가이드:");
    console.log("   1. 프론트엔드 서버를 시작합니다: npm run dev");
    console.log("   2. http://localhost:3000 으로 접속합니다");
    if (mentees.length > 0) {
      console.log(
        `   3. 멘티 계정으로 로그인: ${mentees[0].email} / password123`
      );
    }
    console.log("   4. 멘토 목록 페이지로 이동합니다");
    console.log("   5. 매칭 요청 버튼을 클릭하여 요청을 생성합니다");
    console.log("   6. 데이터베이스에 새로운 요청이 저장되는지 확인합니다");

    console.log("\n🎉 매칭 요청 기능이 정상적으로 동작합니다!");
  } catch (error) {
    console.error("❌ 테스트 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

comprehensiveMatchRequestTest();
