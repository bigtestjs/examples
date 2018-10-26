import { Factory, faker } from "@bigtest/mirage";

export default Factory.extend({
  completed: false,
  title: () => faker.lorem.sentence(),
  _id: index => ({ $oid: index + 1 })
});
