export interface ObjWithExpiry {
  value: string;
  expiry?: number;
}

export interface Ttl {
  minutes?: number;
  hours?: number;
  days?: number;
}

export default class LocalCache {

  readonly #namespace: string;

  constructor(namespace: string) {
    this.#namespace = namespace;
  }

  set(key: string, data: any, ttl?: Ttl) {
    const expiry = LocalCache.#ttlToEpoch(ttl);
    let value = data;

    if (typeof value != 'string') {
      value = JSON.stringify(value);
    }

    const cacheString = JSON.stringify({value, expiry});
    try {
      window.localStorage.setItem(this.#fullKey(key), cacheString);
    } catch (error) {
      console.error(`Problem caching value ${cacheString}`, error);
    }
  }

  get(key: string): any | undefined {
    try {
      const fullKey = this.#fullKey(key);
      const cacheString = window.localStorage.getItem(fullKey);
      if (!cacheString) return;

      const cachedObj: ObjWithExpiry = JSON.parse(cacheString);
      if (!cachedObj.expiry || cachedObj.expiry === 0) {
        return cachedObj.value;
      }

      const now = Date.now();
      if(cachedObj.expiry <= now) {
        // cache has expired
        localStorage.removeItem(fullKey);
        return;
      }

      return cachedObj.value;
    } catch (error) {
      console.error(`Problem retrieving cached key ${key}`, error);
    }
  }

  #fullKey(key: string): string {
      return `${this.#namespace}.${key}`;
  }

  static #ttlToEpoch(ttl?: Ttl, now = Date.now()): number {
    if (!ttl) return 0;

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Days to hours
    hours += (ttl.days ?? 0) * 24;

    // Hours to minutes
    minutes += ((ttl.hours ?? 0) + hours) * 60

    // Minutes to seconds
    seconds = ((ttl.minutes ?? 0) + minutes) * 60;

    // Seconds to milliseconds
    return now + (seconds * 1000);
  }
}
