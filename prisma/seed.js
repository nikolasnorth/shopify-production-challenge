const {PrismaClient} = require("@prisma/client");

async function seed() {
    const client = new PrismaClient();

    console.log("Clearing database...");
    await client.item.deleteMany({});

    console.log("Inserting cities...");
    const cities = Array.of(
        {
            name: "Toronto, Canada",
            latitude: 43.7001,
            longitude: -79.4163,
            openWeatherId: 6167865,
        },
        {
            name: "New York City, United States",
            latitude: 40.741895,
            longitude: -73.989308,
            openWeatherId: 5128581,
        },
        {
            name: "London, England",
            latitude: 51.5085,
            longitude: -0.1257,
            openWeatherId: 2643743,
        },
        {
            name: "Paris, France",
            latitude: 48.8534,
            longitude: 2.3488,
            openWeatherId: 2988507,
        },
        {
            name: "Lisbon, Portugal",
            latitude: 38.7167,
            longitude: -9.1333,
            openWeatherId: 2267057,
        },
    )
    for (const city of cities) {
        await client.city.create({data: city});
    }

    console.log("Inserting items...");
    const items = Array.of(
        {
            name: "Apple Studio",
            quantity: 10,
            city: {
                connect: {
                    id: 1
                }
            }
        },
        {
            name: "Nike Shoes",
            quantity: 23,
            city: {
                connect: {
                    id: 1
                }
            }
        },
        {
            name: "Microsoft Surface",
            quantity: 1,
            city: {
                connect: {
                    id: 2
                }
            }
        },
        {
            name: "Tesla Model S",
            quantity: 5,
            city: {
                connect: {
                    id: 3
                }
            }
        },
        {
            name: "Adidas Shorts",
            quantity: 45,
            city: {
                connect: {
                    id: 4
                }
            }
        },
        {
            name: "Bose Headphones",
            quantity: 23,
            city: {
                connect: {
                    id: 5
                }
            }
        },
    );
    for (const item of items) {
        await client.item.create({data: item});
    }
}

seed().then(() => console.log("Done."))
