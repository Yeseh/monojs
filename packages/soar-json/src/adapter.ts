import {Result, Option} from "@yeseh/result";
import { IAdapter } from "@yeseh/soar-core";
import { open, opendir, mkdir } from 'fs/promises';
import { existsSync } from 'fs'
import path from 'path';

export class AdapterError extends Error {
  inner?: Error;
  
  constructor(msg: string, inner?: Error) { 
    super(msg); 
    this.inner = inner;
  }
}

export class Adapter implements IAdapter<Option<AdapterError, null>> {
  initialized: boolean;
  _basePath: string; 

  constructor(path: string) {
    this._basePath = path ?? "./repository";
    this.initialized = false;
  }

  async init() {
    this.initialized = true;
    if (!existsSync(this._basePath)) {
      await mkdir(this._basePath);
    }
  }

  async getAll<T>(collection: string): Promise<Result<T[] | null>> {
    let bExists = await this._collectionExists(collection);
    if (!bExists) {
      return Result.fromError(
        new AdapterError(`Collection '${collection}' not found.`)
      );
    } 

    let result = new Result(this._getCollection<T>(collection));
    return result;
  };

  async getByKey<T extends Record<string, any>, K extends keyof T>(
    collection: string,
    value: T[K], key: K
  )  : Promise<Result<T | null>> {
    let exists = await this._collectionExists(collection);

    if (!exists) {
      return Result.fromError(
        new AdapterError(`Collection '${collection}' not found.`)
      )
    }

    let result = new Result(this._getSingleItemFromCollection<T>(collection,value,key));
    return result;
  }

  _getFilePath(collection: string) {
    let p = path.join(this._basePath, collection, 'collection.json');
    return p;
  }
  
  _getFolderPath(collection: string) {
    let p = path.join(this._basePath, collection);
    return p;
  }

  async _collectionExists(collection: string) {
    let exists = false;
    let dir;
    
    dir = await opendir(this._getFolderPath(collection)).catch()

    if (dir) {
      exists = true
      await dir.close()
    } 

    return exists;
  }

  private async _createCollection<T>(
    collection: string, content: T | T[]
  ): Promise<AdapterError | void> {
    let fd;
    let path = this._getFolderPath(collection);
    let exists = await this._collectionExists(collection);
    
    if (exists) {
      return new AdapterError(`Collection '${collection}' already exists`);
    }

    try {
      await mkdir(path);

      let fileContent = Array.isArray(content) ? content : [content]
      let fileStr = JSON.stringify(fileContent);
      fd = await open(this._getFilePath(collection), 'r');

      await fd.writeFile(fileStr);
    }
    catch(e) {
      console.log(e)
    }

    if (fd) await fd.close();
  }

  private async _getCollection<T>(collection: string) : Promise<T[]> {
    let fd;
    let result;

    try {
      let path = this._getFilePath(collection);
      fd = await open(path, 'r');

      let file = await fd.readFile();
      result = JSON.parse(file.toString());
    }
    catch (e) {
      console.log(e);
    }
  
    if (fd) await fd.close();
    return result ?? [];
  }

  private async _getSingleItemFromCollection<T>(
    collection: string, 
    value: T[keyof T], 
    key: keyof T
  ): Promise<Option<T, null>> {
    let col = await this._getCollection<T>(collection);
    let item = col.find(d => d[key] === value);

    return item ?? null;
  }
}