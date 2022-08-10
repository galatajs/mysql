const assert = require("node:assert");
const test = require("node:test");
const { createApp, createModule } = require("@istanbul/app");
const { createMySqlModule } = require("../dist");

test("MySql Module Testing", (t) => {
  t.test("Create a mysql module and check connection", () => {
    let res;
    let app;

    class ServiceA {
      mySqlService;

      constructor(params) {
        this.mySqlService = params.mySqlService;
      }

      onAppStarted = () => {
        this.mySqlService.connection.ping((err) => {
          assert.strictEqual(err, undefined);
          process.exit(0);
          t.pass();
        });
      };
    }

    const mainModule = createModule("main", {
      imports: [
        createMySqlModule({
          host: "localhost",
          user: "root",
          database: "test",
          password: "12345",
        }),
      ],
      providers: [ServiceA],
    });

    app = createApp(mainModule);
    app.start();
    app.close();
  });
});
