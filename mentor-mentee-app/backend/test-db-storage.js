// 데이터베이스에서 매칭 요청 상태 확인
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testMatchRequestStorage() {
  try {
    console.log("📊 매칭 요청 저장 테스트...\n");

    // 1. 현재 저장된 매칭 요청들 확인
    const requests = await prisma.matchRequest.findMany({
      include: {
        mentor: { select: { name: true, email: true, role: true } },
        mentee: { select: { name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`📋 총 매칭 요청 수: ${requests.length}\n`);

    if (requests.length === 0) {
      console.log("❌ 저장된 매칭 요청이 없습니다.");
      return;
    }

    // 각 요청 상세 정보 출력
    requests.forEach((request, index) => {
      console.log(`${index + 1}. 매칭 요청 세부 정보:`);
      console.log(`   🆔 ID: ${request.id}`);
      console.log(
        `   👨‍🏫 멘토: ${request.mentor.name} (${request.mentor.email}) [${request.mentor.role}]`
      );
      console.log(
        `   👨‍🎓 멘티: ${request.mentee.name} (${request.mentee.email}) [${request.mentee.role}]`
      );
      console.log(`   💬 메시지: ${request.message}`);
      console.log(`   📊 상태: ${request.status}`);
      console.log(`   📅 생성일: ${request.createdAt.toISOString()}`);
      console.log(`   🔄 수정일: ${request.updatedAt.toISOString()}\n`);
    });

    // 2. 각 상태별 요청 수 확인
    const statusCounts = await Promise.all([
      prisma.matchRequest.count({ where: { status: "PENDING" } }),
      prisma.matchRequest.count({ where: { status: "ACCEPTED" } }),
      prisma.matchRequest.count({ where: { status: "REJECTED" } }),
      prisma.matchRequest.count({ where: { status: "CANCELLED" } }),
    ]);

    console.log("📊 상태별 요청 수:");
    console.log(`   ⏳ PENDING: ${statusCounts[0]}개`);
    console.log(`   ✅ ACCEPTED: ${statusCounts[1]}개`);
    console.log(`   ❌ REJECTED: ${statusCounts[2]}개`);
    console.log(`   🚫 CANCELLED: ${statusCounts[3]}개\n`);

    // 3. 사용자별 요청 수 확인
    const users = await prisma.user.findMany({
      include: {
        sentRequests: true,
        receivedRequests: true,
      },
    });

    console.log("👥 사용자별 요청 현황:");
    users.forEach((user) => {
      console.log(`   ${user.name} (${user.role}):`);
      console.log(`     보낸 요청: ${user.sentRequests.length}개`);
      console.log(`     받은 요청: ${user.receivedRequests.length}개`);
    });

    console.log(
      "\n✅ 매칭 요청이 데이터베이스에 정상적으로 저장되고 있습니다!"
    );
    console.log(
      "🎯 다음 단계: 프론트엔드에서 매칭 요청 생성을 테스트해보세요."
    );
  } catch (error) {
    console.error("❌ 테스트 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testMatchRequestStorage();
