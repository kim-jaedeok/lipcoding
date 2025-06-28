const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("📊 데이터베이스 상태 확인...\n");

    // 사용자 수 확인
    const userCount = await prisma.user.count();
    console.log(`👥 총 사용자 수: ${userCount}`);

    // 멘토 수 확인
    const mentorCount = await prisma.user.count({
      where: { role: "MENTOR" },
    });
    console.log(`👨‍🏫 멘토 수: ${mentorCount}`);

    // 멘티 수 확인
    const menteeCount = await prisma.user.count({
      where: { role: "MENTEE" },
    });
    console.log(`👨‍🎓 멘티 수: ${menteeCount}`);

    // 매칭 요청 수 확인
    const matchRequestCount = await prisma.matchRequest.count();
    console.log(`🤝 매칭 요청 수: ${matchRequestCount}`);

    // 최근 매칭 요청들 조회
    const recentRequests = await prisma.matchRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        mentor: { select: { name: true, email: true } },
        mentee: { select: { name: true, email: true } },
      },
    });

    console.log("\n📋 최근 매칭 요청들:");
    recentRequests.forEach((request, index) => {
      console.log(`${index + 1}. ID: ${request.id}, 상태: ${request.status}`);
      console.log(`   멘토: ${request.mentor.name} (${request.mentor.email})`);
      console.log(`   멘티: ${request.mentee.name} (${request.mentee.email})`);
      console.log(`   메시지: ${request.message}`);
      console.log(`   생성일: ${request.createdAt.toISOString()}\n`);
    });
  } catch (error) {
    console.error("❌ 데이터베이스 확인 중 오류:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
