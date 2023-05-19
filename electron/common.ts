import electron from "electron";
import path from "path";
import fs from "fs";

export type UserSettings = Partial<{
  windowBounds: {
    width: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
  };
}>;

export class Config {
  private static data: UserSettings = {};
  private static path: string;

  static load({ configName, defaults }: { configName: string, defaults: UserSettings }) {
    Config.path = path.join(electron.app.getPath("userData"), `${configName}.json`);
    Config.data = readJson(Config.path, defaults);
  }

  // Define a static `get` method that receives a key,
  // which is keyof typeof BoundUserSettings and returns
  // a typed value, which is the value of the keyof typeof BoundUserSettings.
  static get = <T extends keyof UserSettings>(key: T): UserSettings[T] => Config.data[key];

  static set(key: keyof UserSettings, val: any) {
    Config.data[key] = val;
    writeJson(Config.path, Config.data);
  }
}

const readJson = (filePath: string, defaults: UserSettings) => {
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (e) {
    return defaults;
  }
};

const writeJson = (filePath: string, data: UserSettings) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
};
