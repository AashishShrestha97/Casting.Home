const createAuthController = require("./authControllerFactory");

module.exports = createAuthController({
  role: "producer",
  table: "producers",
  extraColumn: {
    name: "company",
    required: true,
    requiredMessage: "Company name is required for producers",
  },
});
