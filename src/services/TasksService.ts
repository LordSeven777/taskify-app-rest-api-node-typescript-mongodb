import { Types } from "mongoose";

// Types
import { LabelDocument } from "@customTypes/Label";

// Utils
import { getDateEdgeTimes } from "@utils/dates";

// Models
import Task from "@models/Task";

interface GetUserTasksOptions {
  date?: string;
  sort?: string;
  userId: string | Types.ObjectId;
}

class TasksService {
  async getUserTasks(options: GetUserTasksOptions) {
    const sort = options.sort || "-startsAt";
    const date = options.date || new Date().toISOString();
    const [dateStart, dateEnd] = getDateEdgeTimes(date);
    const tasks = await Task.find({
      $or: [
        {
          startsAt: {
            $gt: dateStart,
            $lte: dateEnd,
          },
        },
        {
          startsAt: {
            $lt: dateStart,
          },
          endsAt: {
            $gte: dateStart,
          },
        },
      ],
      user: options.userId,
    })
      .sort(sort)
      .select("-description -checkList")
      .populate<{ labels: LabelDocument[] }>("labels");
    return tasks;
  }
}

const tasksService = new TasksService();

export default tasksService;
