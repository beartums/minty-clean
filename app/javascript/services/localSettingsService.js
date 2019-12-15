
  const Settings = window.localStorage;

  export function getAll() {
    return Settings;
  }

  export function get(key, deflt) {
    if (Settings[key]) {
      return JSON.parse(Settings[key]);
    } else {
      return deflt;
    }
  }

  export function set(key, value) {
    Settings[key] = JSON.stringify(value);
  }

