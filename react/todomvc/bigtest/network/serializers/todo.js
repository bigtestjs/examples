import { RestSerializer } from "@bigtest/mirage";

export default RestSerializer.extend({
  attrs: ["_id", "title", "completed"],
  root: false,
  embed: true,
  keyForAttribute(attr) {
    return attr;
  }
});
