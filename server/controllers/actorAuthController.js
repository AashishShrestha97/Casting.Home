const createAuthController = require("./authControllerFactory");

module.exports = createAuthController({
  role: "actor",
  table: "actors",
  extraColumn: {
    name: "age",
    required: false,
    validate: (v) => {
      if (v === undefined || v === null || v === "") return null;
      const n = Number(v);
      if (Number.isNaN(n) || n < 5 || n > 90) return "Enter a valid age";
      return null;
    },
  },
});
