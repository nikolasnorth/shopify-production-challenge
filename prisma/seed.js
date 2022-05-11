const {PrismaClient} = require("@prisma/client");

async function seed() {
    const client = new PrismaClient();
    const items = Array.of(
        {name: "Apple Studio", quantity: 10},
        {name: "Nike Shoes", quantity: 23},
        {name: "Microsoft Surface", quantity: 1},
        {name: "Tesla Model S", quantity: 5},
        {name: "Adidas Shorts", quantity: 45},
        {name: "Bose Headphones", quantity: 23},
    );

    console.log("Clearing database...");
    await client.item.deleteMany({});

    console.log("Inserting items...");
    for (const item of items) {
        await client.item.create({data: item});
    }
}

seed().then(() => console.log("Done."))
