import { FilterQuery, ObjectId, Types } from "mongoose";

// Types
import { QueryOptions } from "@customTypes/query";
import { LabelDocument, LabelAttributes, LabelCreationAttributes } from "@customTypes/Label";

// Models
import Label from "@models/Label";

interface GetUserLabelsQueryOptions extends QueryOptions {
  userId: string | ObjectId;
}

class LabelsService {
  async getFirst(query: FilterQuery<LabelAttributes>) {
    return await Label.findOne(query);
  }

  async existsForUser(name: string, userId: Types.ObjectId) {
    return !!(await this.getFirst({ name, user: userId }));
  }

  async getUserLabels(options: GetUserLabelsQueryOptions): Promise<LabelDocument[]> {
    const query: FilterQuery<LabelAttributes> = {
      user: options.userId,
    };
    if (options.search) query.name = new RegExp(options.search, "i");
    return await Label.find(query);
  }

  async create(data: LabelCreationAttributes) {
    const payload: LabelCreationAttributes = {
      name: data.name,
      user: data.user,
    };
    if (data.color) payload.color = data.color;
    return await Label.create(payload);
  }

  async update(label: LabelDocument, data: LabelCreationAttributes) {
    label.name = data.name;
    if (data.color) label.color = data.color;
    await label.save();
    return label;
  }

  async delete(id: string | Types.ObjectId) {
    await Label.deleteOne({ _id: id });
  }
}

const labelsService = new LabelsService();

export default labelsService;
