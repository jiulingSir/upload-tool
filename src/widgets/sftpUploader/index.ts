import Client from 'ssh2-sftp-client';
import { Status } from '../util/interface/upload';
import { SUCCESS_CODE,  ERROR_CODE } from '../util/const-code/index';
import logger from '../../widgets/util/log';
import Uploader from '../util/class';

export default class SftpUploader extends Uploader {
    protected client: Client;
  
    constructor (opt) {
      super(opt);
      this.client = new Client();
    }

    public connect(): Promise<Client> {
        return this.client.connect(this.options)
            .then(() => {
                logger.info('连接成功');
                return {
                    code: SUCCESS_CODE,
                    data: this.client
                };
            }).catch((err) => {
                logger.error(`连接失败：${err}`);
            });
    }

    public mkdir(remoteDir: string): Promise<Status> {
        return this.client.mkdir(remoteDir)
            .then(() => {
                logger.info(`${remoteDir} 目录创建成功`);
                return {
                    code: SUCCESS_CODE,
                    data: remoteDir
                };
            }).catch((err) => {
                logger.error(`${remoteDir} 目录创建失败`);
                return {
                    code: ERROR_CODE,
                    error: err
                }
            });
    }

    public async put(currentFile: string, remoteFile: string): Promise<Status> {
        return this.client.put(currentFile, remoteFile)
            .then(() => {
                logger.info(`上传成功：${currentFile}`);
                return {
                    code: SUCCESS_CODE,
                    data: currentFile
                };
            }).catch((err) => {
                logger.error(`${currentFile}文件上传失败, err：${err}`);
                return {
                    code: ERROR_CODE,
                    error: err
                }
            });
    }

    public async delete(file: string): Promise<Status> {
        return this.client.delete(file)
            .then(() => {
                logger.info(`${file} 删除成功`);
                return {
                    code: SUCCESS_CODE,
                    data: file
                };
            }).catch((err) => {
                logger.error(`${file} 目录删除失败, err：${err}`);
                return {
                    code: ERROR_CODE,
                    error: err
                }
            });
    }
    
    public async list(root?: string): Promise<Status> {
        root = root || '/xyx';

        return this.client.list(root)
            .then((list) => {
                logger.info(`查看${root}：`);
                return {
                    code: SUCCESS_CODE,
                    data: list
                };
            }).catch((err) => {
                logger.error(`${err}查看失败`);
            });
    }

    public async close() {
        this.client.end();
    }
}