const {PrismaClient} = require("@prisma/client") ;

const db = new PrismaClient();

async function main() {
    try {
        console.log("started seeding db 🟠");
        await db.category.createMany({
            data: [
                {name: "Computer Science"},
                {name: "Music"},
                {name: "Fitness"},
                {name: "Photography"},
                {name: "Accounting"},
                {name: "Engineering"},
                {name: "Filming"},
            ]
        });
        console.log("finished seeding db 🟢");

    } catch (error) {
        console.log("Error seeding the categories table🔴",error);
    } finally {
        await db.$disconnect();
    }
}
main();