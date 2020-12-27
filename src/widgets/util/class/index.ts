/** 
 * @file 实现上传的基类
 */

let EventEmitter = require('events');

import logger from '../log';
import { Status } from '../interface/upload';
import { getAllFilesByGlob, getDirectorys, getFiles } from '../index';

export interface IUploader {
    connect();
    delete(remoteFile?: string): Promise<Status>;
    list(): Promise<Status>;
    close();
    mkdir(remote: string): Promise<Status>;
}

export default class Uploader extends EventEmitter {
    protected options;

    constructor(opt) {
        super();
        this.initOption(opt);
    }

    public initOption (opt) {
        this.options = Object.assign({
            port: 21,
            host: '',
            username: '',
            password: ''
        }, opt);
        logger.info(this.options);
    }

    public async upload (curPath: string) {
        let files = getAllFilesByGlob(curPath);
        let remote = './xyx/';
        let dirList: string[] = getDirectorys(files, remote);
        let fileList: string[] = getFiles(files, remote);
        let uploadList = [];

        await this.batchMkdir(dirList);
    }

    public async batchMkdir (list: string[]) {
        let getMkMap = list.map(async (dir) => {
            return await this.mkdir(dir);
        });

        return Promise.all(getMkMap);
    }

    public put (curPath: string): Promise<Status> {
        throw new Error('用于子类重写');
    }

    public mkdir (curPath: string): Promise<Status> {
        throw new Error('用于子类重写');
    }
}
