// Models
import User from "@models/User";
import Task from "@models/Task";
import Label from "@models/Label";

function generateDateTime(time: string) {
  const [hour, minutes] = time.split(":") as [string, string];
  const date = new Date();
  date.setHours(parseInt(hour));
  date.setMinutes(parseInt(minutes));
  return date.toISOString();
}

export async function seedDatabase() {
  const user = await User.create({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "johndoe@gmail.com",
    password: "$2b$10$eB1akZ3I7s05AQEJkFiys.szfpFm7yRqq9IXsBGz/Xss1AP80XA2G",
  });
  const labels = await Label.insertMany([
    {
      name: "Courses",
      color: "green",
      user: user._id,
    },
    {
      name: "Frontend mentors",
      color: "#ff0000",
      user: user._id,
    },
    {
      name: "Music",
      color: "#fff",
      user: user._id,
    },
  ]);
  await Task.insertMany([
    {
      name: "Catch up with my missing courses",
      description:
        "I've got to ask for notebooks or lessons pictures of the courses that I have missed so far from my friends to copy.",
      startsAt: generateDateTime("06:30"),
      endsAt: generateDateTime("07:30"),
      checkList: ["GAFI", "Intélligence Artificielle", "Algo avancé", "Cryptographie", "Codage"],
      labels: [labels[0]._id],
      user: [user._id],
    },
    {
      name: "Continue the crowdfund frontend mentors challenge",
      description: "Continue developping further features of the crowdfund frontend mentors challenge.",
      startsAt: generateDateTime("08:00"),
      endsAt: generateDateTime("10:00"),
      checkList: ["About", "Redux", "Modal"],
      labels: [labels[1]._id],
      user: [user._id],
    },
    {
      name: "Learn music fundamentals by playing guitar",
      description:
        "Watching tutorials and reading docs about music basics and trying to practice with my guitar",
      startsAt: generateDateTime("18:00"),
      endsAt: generateDateTime("19:00"),
      labels: [labels[2]._id],
      user: [user._id],
    },
  ]);
  console.log("Seeded database ...");
}

export async function clearDatabase() {
  await Label.deleteMany();
  await Task.deleteMany();
  await User.deleteMany();
  console.log("Cleared database ...");
}
