let EventEmitter = require('events');

import PromiseLimit from 'p-limit';
import logger from '../log';
import { Status } from '../interface/upload';
import { REMOTE_TYPE } from '../const-code/index';
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
            password: '',
            concurrency: 5
        }, opt);
        logger.info(this.options);
    }

    public async upload (curPath: string, remote: string) {
        let files = getAllFilesByGlob(curPath);
        let dirList: string[] = getDirectorys(files, remote);
        let fileList: string[] = getFiles(files, remote);
        
        if(dirList.length) {
            await this.batchMkdir(dirList);
        }

        await this.batchPut(fileList);

        return Promise.all(fileList);
    }

    public async batchMkdir (list: string[]) {
        let getMkMap = list.map(async (dir) => {
            return await this.mkdir(dir);
        });

        return Promise.all(getMkMap);
    }

    public async batchPut (list: any[]) {
        // 并发控制
        const concurrentLimit = PromiseLimit(this.options.concurrency);
        let uploadList: Record<string, any>[] = [];
        // 功能实现上传方式： ftp串行；ftp并行
        for(let file of list) {
            if (this.options.type === REMOTE_TYPE.ftp) {
                uploadList.push(await this.put(file.localFile, file.remoteFile));
            } else {
                uploadList.push(concurrentLimit(() => this.put(file.localFile, file.remoteFile)));
            }
        }

        return Promise.all(uploadList);
    }

    public put (curPath: string, remote: string): Promise<Status> {
        throw new Error('用于子类重写');
    }

    public mkdir (curPath: string) {
        throw new Error('用于子类重写');
    }
}
