import { Types } from "mongoose";

// Types
import { LabelDocument } from "@customTypes/Label";
import { TaskCreationAttributes, TaskUpdateAttributes, TaskDocument } from "@customTypes/Task";

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

  async update(task: TaskDocument, data: TaskUpdateAttributes) {
    task.name = data.name;
    task.description = data.description;
    task.checkList = data.checkList;
    task.startsAt = data.startsAt;
    task.endsAt = data.endsAt;
    task.isCompleted = data.isCompleted;
    task.labels = data.labels;
    await task.save();
    return await task.populate<{ labels: LabelDocument[] }>("labels");
  }

  async delete(id: Types.ObjectId | string) {
    await Task.deleteOne({ _id: id });
  }
}

const tasksService = new TasksService();

export default tasksService;
