import { createModule, Module } from "@istanbul/app";
import { ConnectionOptions } from "mysql2";
import { MySqlModuleOptions } from "../types/mysql.types";
import { MySqlEnum } from "./mysql.enum";
import { MySqlService } from "./mysql.service";

export const createMySqlModule = (
  options: ConnectionOptions | string,
  moduleOptions: MySqlModuleOptions = {}
): Module => {
  return createModule(moduleOptions.name || MySqlEnum.DEFAULT_NAME, {
    global: moduleOptions.global || true,
    providers: [
      {
        name: MySqlEnum.CLIENT_OPTIONS,
        value: options,
      },
      MySqlService,
    ],
    exports: [MySqlService],
  });
};
