import { PrismaClient } from "@prisma/client";

// Create a new PrismaClient instance
const db = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://tj@localhost:5432/prosper"
    }
  }
});

async function main() {
  // Clean up existing data
  await db.appointment.deleteMany();
  await db.client.deleteMany();
  await db.clinician.deleteMany();

  console.log("Seeding database...");

  // Create clients
  const client1 = await db.client.create({
    data: {
      name: "Jane Doe",
      email: "jane@example.com",
      age: 32,
      neurotype: "ADHD",
    },
  });

  const client2 = await db.client.create({
    data: {
      name: "John Smith",
      email: "john@example.com",
      age: 28,
      neurotype: "Autistic",
    },
  });

  console.log("Created clients:", client1.id, client2.id);

  // Create clinicians
  const clinician1 = await db.clinician.create({
    data: {
      name: "Dr. Maria Rodriguez",
      email: "maria@prosper.health",
      specialty: "Neurodevelopmental Psychology",
    },
  });

  const clinician2 = await db.clinician.create({
    data: {
      name: "Dr. James Wilson",
      email: "james@prosper.health",
      specialty: "Behavioral Therapy",
    },
  });

  console.log("Created clinicians:", clinician1.id, clinician2.id);

  // Create appointments
  const now = new Date();
  
  const appointment1 = await db.appointment.create({
    data: {
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      clientId: client1.id,
      clinicianId: clinician1.id,
    },
  });

  const appointment2 = await db.appointment.create({
    data: {
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      clientId: client2.id,
      clinicianId: clinician2.id,
    },
  });

  const appointment3 = await db.appointment.create({
    data: {
      date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      clientId: client1.id,
      clinicianId: clinician2.id,
    },
  });

  console.log("Created appointments:", appointment1.id, appointment2.id, appointment3.id);

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  }); 