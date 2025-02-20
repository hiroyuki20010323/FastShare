import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
	const startDate = new Date("2025-01-01")
	const endDate = new Date("2025-12-31")

	let currentDate = new Date(startDate)

	const data = []
	while (currentDate <= endDate) {
		data.push({
			id: data.length + 1,
			date: new Date(currentDate.setHours(0, 0, 0, 0))
		})
		currentDate.setDate(currentDate.getDate() + 1)
	}

	console.log(`インサート中・・・${data.length} `)

	await prisma.calendar.createMany({
		data,
		skipDuplicates: true
	})

	console.log("シード完了！！！")
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
