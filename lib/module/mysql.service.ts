import { OnAppFinished, OnModuleInstalled } from "@istanbul/app";
import { createConnection, ConnectionOptions, Connection } from "mysql2";
import { MySqlEnum } from "./mysql.enum";

export class MySqlService implements OnAppFinished, OnModuleInstalled {
  connection!: Connection;
  private keepAliveInterval?: NodeJS.Timeout;

  public onAppFinished(): void {
    this.clearKeepMySqlConnectionAlive();
    this.closeMySqlConnection();
  }

  public onModuleInstalled(params: {
    [MySqlEnum.CLIENT_OPTIONS]: ConnectionOptions | string;
  }): void {
    this.connectToMySql(params[MySqlEnum.CLIENT_OPTIONS]);
  }

  private async connectToMySql(
    options: ConnectionOptions | string
  ): Promise<void> {
    // @ts-ignore
    this.connection = createConnection(options);
    this.connection.connect();
    this.keepMySqlConnectionAlive();
  }

  private keepMySqlConnectionAlive(): void {
    this.keepAliveInterval = setInterval(() => {
      this.connection.ping();
    }, 5000);
  }

  private clearKeepMySqlConnectionAlive(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
  }

  private closeMySqlConnection(): void {
    this.connection.destroy();
  }
}
