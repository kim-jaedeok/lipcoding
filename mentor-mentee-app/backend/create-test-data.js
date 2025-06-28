const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log("🏗️  테스트 데이터 생성 중...\n");

    // 기존 데이터 확인
    const existingUsers = await prisma.user.count();
    console.log(`현재 사용자 수: ${existingUsers}`);

    // 테스트용 멘티 생성 (이미 있으면 건너뛰기)
    const existingMentee = await prisma.user.findFirst({
      where: { email: "mentee@test.com" },
    });

    let mentee;
    if (!existingMentee) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      mentee = await prisma.user.create({
        data: {
          email: "mentee@test.com",
          password: hashedPassword,
          name: "김멘티",
          role: "MENTEE",
          bio: "열심히 배우고 싶은 멘티입니다.",
        },
      });
      console.log("✅ 테스트 멘티 생성:", mentee.name);
    } else {
      mentee = existingMentee;
      console.log("ℹ️  기존 테스트 멘티 사용:", mentee.name);
    }

    // 테스트용 멘토 확인/생성
    let mentor = await prisma.user.findFirst({
      where: { role: "MENTOR" },
    });

    if (!mentor) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      mentor = await prisma.user.create({
        data: {
          email: "mentor@test.com",
          password: hashedPassword,
          name: "박멘토",
          role: "MENTOR",
          bio: "10년 경력의 시니어 개발자입니다.",
          skills: '["JavaScript", "React", "Node.js"]',
        },
      });
      console.log("✅ 테스트 멘토 생성:", mentor.name);
    } else {
      console.log("ℹ️  기존 멘토 사용:", mentor.name);
    }

    // 기존 매칭 요청 삭제 (테스트를 위해)
    await prisma.matchRequest.deleteMany({
      where: {
        mentorId: mentor.id,
        menteeId: mentee.id,
      },
    });

    // 테스트용 매칭 요청 생성
    const matchRequest = await prisma.matchRequest.create({
      data: {
        mentorId: mentor.id,
        menteeId: mentee.id,
        message:
          "안녕하세요! JavaScript와 React를 배우고 싶어서 멘토링을 요청드립니다. 시간이 되실 때 연락 주세요!",
        status: "PENDING",
      },
      include: {
        mentor: { select: { name: true, email: true } },
        mentee: { select: { name: true, email: true } },
      },
    });

    console.log("\n🎉 테스트 매칭 요청 생성 성공!");
    console.log("요청 ID:", matchRequest.id);
    console.log(
      "멘토:",
      matchRequest.mentor.name,
      `(${matchRequest.mentor.email})`
    );
    console.log(
      "멘티:",
      matchRequest.mentee.name,
      `(${matchRequest.mentee.email})`
    );
    console.log("메시지:", matchRequest.message);
    console.log("상태:", matchRequest.status);
    console.log("생성일:", matchRequest.createdAt.toISOString());

    // 최종 데이터베이스 상태 확인
    console.log("\n📊 현재 데이터베이스 상태:");
    const totalUsers = await prisma.user.count();
    const totalMentors = await prisma.user.count({ where: { role: "MENTOR" } });
    const totalMentees = await prisma.user.count({ where: { role: "MENTEE" } });
    const totalRequests = await prisma.matchRequest.count();

    console.log(
      `👥 총 사용자: ${totalUsers} (멘토: ${totalMentors}, 멘티: ${totalMentees})`
    );
    console.log(`🤝 총 매칭 요청: ${totalRequests}`);
  } catch (error) {
    console.error("❌ 테스트 데이터 생성 중 오류:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
