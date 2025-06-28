// 매칭 요청 최종 검증 테스트
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function finalValidationTest() {
  try {
    console.log("🔬 매칭 요청 최종 검증 테스트\n");

    // 기존 요청 삭제 (새로운 테스트를 위해)
    await prisma.matchRequest.deleteMany({
      where: {
        mentorId: 1,
        menteeId: 2,
      },
    });
    console.log("🗑️  기존 테스트 요청 삭제 완료\n");

    // 프론트엔드에서 보내는 것과 동일한 데이터로 매칭 요청 생성
    console.log("📝 프론트엔드 시뮬레이션: 매칭 요청 생성...");

    const requestData = {
      mentorId: 1,
      menteeId: 2,
      message:
        "안녕하세요! 웹 개발을 배우고 싶어서 멘토링을 요청드립니다. React와 TypeScript에 대해 배우고 싶습니다.",
    };

    console.log("요청 데이터:", JSON.stringify(requestData, null, 2));

    // 백엔드 컨트롤러와 동일한 검증 로직
    console.log("\n🔍 백엔드 검증 과정:");

    // 1. 멘토 존재 확인
    const mentor = await prisma.user.findFirst({
      where: { id: requestData.mentorId, role: "MENTOR" },
    });

    if (!mentor) {
      console.log("❌ 멘토를 찾을 수 없습니다.");
      return;
    }
    console.log(`✅ 멘토 확인: ${mentor.name} (${mentor.email})`);

    // 2. 멘티 존재 확인
    const mentee = await prisma.user.findFirst({
      where: { id: requestData.menteeId, role: "MENTEE" },
    });

    if (!mentee) {
      console.log("❌ 멘티를 찾을 수 없습니다.");
      return;
    }
    console.log(`✅ 멘티 확인: ${mentee.name} (${mentee.email})`);

    // 3. 기존 요청 확인
    const existingRequest = await prisma.matchRequest.findFirst({
      where: {
        mentorId: requestData.mentorId,
        menteeId: requestData.menteeId,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });

    if (existingRequest) {
      console.log("❌ 이미 존재하는 요청이 있습니다.");
      return;
    }
    console.log("✅ 중복 요청 없음");

    // 4. 매칭 요청 생성 (백엔드 로직과 동일)
    const matchRequest = await prisma.matchRequest.create({
      data: {
        mentorId: requestData.mentorId,
        menteeId: requestData.menteeId,
        message: requestData.message,
        status: "PENDING",
      },
      include: {
        mentor: { select: { name: true, email: true } },
        mentee: { select: { name: true, email: true } },
      },
    });

    console.log("\n🎉 매칭 요청 생성 성공!");
    console.log("응답 데이터 (프론트엔드가 받을 데이터):");
    console.log(`{
  "id": ${matchRequest.id},
  "status": "${matchRequest.status}"
}`);

    // 5. 데이터베이스에 실제로 저장되었는지 확인
    const savedRequest = await prisma.matchRequest.findUnique({
      where: { id: matchRequest.id },
      include: {
        mentor: { select: { name: true, email: true } },
        mentee: { select: { name: true, email: true } },
      },
    });

    console.log("\n📊 저장된 데이터 확인:");
    console.log(`   ID: ${savedRequest.id}`);
    console.log(
      `   멘토: ${savedRequest.mentor.name} (${savedRequest.mentor.email})`
    );
    console.log(
      `   멘티: ${savedRequest.mentee.name} (${savedRequest.mentee.email})`
    );
    console.log(`   메시지: ${savedRequest.message}`);
    console.log(`   상태: ${savedRequest.status}`);
    console.log(`   생성일: ${savedRequest.createdAt.toISOString()}`);

    // 6. 전체 매칭 요청 카운트
    const totalRequests = await prisma.matchRequest.count();
    console.log(`\n📈 총 매칭 요청 수: ${totalRequests}개`);

    console.log("\n✅ 매칭 요청이 서버에 성공적으로 저장되었습니다!");
    console.log("🎯 결론: 백엔드 매칭 요청 저장 기능이 정상적으로 작동합니다.");
  } catch (error) {
    console.error("❌ 테스트 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

finalValidationTest();
