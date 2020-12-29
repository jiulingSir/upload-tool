import Client from 'ftp';
import { Status } from '../util/interface/upload';
import { SUCCESS_CODE,  ERROR_CODE } from '../util/const-code/index';
import logger from '../../widgets/util/log';
import Uploader from '../util/class';

export default class FtpUploader extends Uploader {
    protected client: Client;
  
    constructor (opt) {
      super(opt);
      this.client = new Client();
    }

    public async connect(): Promise<Client> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.options);

            this.client.on('ready', () => {
                logger.info('ftp 连接成功');
                resolve(this.client);
            });
            this.client.on('error', (err) => {
                reject(`ftp:error:${err}`);
            });
        })
    }

    public mkdir(remoteDir: string): Promise<Status> {
        return new Promise((resolve, reject) => {
            this.client.mkdir(remoteDir, (err) => {
                if (err) {
                    logger.error(err);
                    return reject({
                        code: ERROR_CODE,
                        msg: `${remoteDir} 目录创建失败`,
                        error: err
                    });
                }

                logger.info(`${remoteDir} 目录创建成功`);
                resolve({
                    code: SUCCESS_CODE,
                    data: remoteDir
                });
            });
        });
    }

    public async put(currentFile: string, remoteFile: string): Promise<Status> {
        return new Promise((resolve, reject) => {
            this.client.put(currentFile, remoteFile, (err) => {
                if (err) {
                    logger.error(`上传失败：${err}`);
                    return reject({
                        code: ERROR_CODE,
                        error: err,
                        msg: `${currentFile} 文件上传失败`
                    });
                }

                logger.info(`上传成功：${remoteFile}`);
                resolve({
                    code: SUCCESS_CODE,
                    data: currentFile
                });
            })
        })
    }

    public async delete(file: string): Promise<Status> {
        return new Promise((resolve, reject) => {
            this.client.delete(file, err => {
                if (err) {
                    logger.error(err);
                    return reject({
                        code: ERROR_CODE,
                        error: err
                    });
                }

                logger.info(`${file} 删除成功`);
                resolve({
                    code: SUCCESS_CODE,
                    data: file
                });
            });
        })
    }
    
    public async list(root?: string): Promise<Status> {
        root = root || '/xyx';

        return new Promise((resolve, reject) => {
            this.client.list(root, (err, list) => {
                if (err) {
                    logger.error(err);
                    return reject({
                        code: ERROR_CODE,
                        error: err
                    });
                }

                logger.info(`查看目录：${root}`);
                resolve({
                    code: SUCCESS_CODE,
                    data: list
                });
            });
        });
    }

    public async close() {
        this.client.end();
    }
}