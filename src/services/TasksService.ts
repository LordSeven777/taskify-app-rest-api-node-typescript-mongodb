import { Types } from "mongoose";

// Types
import { LabelDocument } from "@customTypes/Label";
import { TaskCreationAttributes } from "@customTypes/Task";

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

  async create(data: TaskCreationAttributes) {
    const payload: TaskCreationAttributes = {
      name: data.name,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      user: data.user,
      checkList: data.checkList,
      description: data.description,
      isCompleted: data.isCompleted,
      labels: data.labels,
    };
    const task = await Task.create(payload);
    return await task.populate<{ labels: LabelDocument[] }>("labels");
  }
}

const tasksService = new TasksService();

export default tasksService;
