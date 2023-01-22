import { FilterQuery, ObjectId } from "mongoose";

// Types
import { QueryOptions } from "@customTypes/query";
import { LabelDocument, LabelAttributes } from "@customTypes/Label";

// Models
import Label from "@models/Label";

interface GetUserLabelsQueryOptions extends QueryOptions {
  userId: string | ObjectId;
}

class LabelsService {
  async getUserLabels(options: GetUserLabelsQueryOptions): Promise<LabelDocument[]> {
    const query: FilterQuery<LabelAttributes> = {
      user: options.userId,
    };
    if (options.search) query.name = new RegExp(options.search, "i");
    return await Label.find(query);
  }
}

const labelsService = new LabelsService();

export default labelsService;
