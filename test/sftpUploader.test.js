/**
 * 单元测试——sftp功能基类
 */
import sftp from 'ssh2-sftp-client';
import sftpUploader from '../src/widgets/sftpUploader/index.ts';

import {
    ERROR_CODE,
    SUCCESS_CODE
} from '../src/widgets/util/const-code';

let opt = {
    host: '127.0.0.1',
    port: 21,
    username: 'test',
    password: 'test'
};
let file = './src/index.ts';
let dir = '../test/';
global.initMock = jest.fn((opt) => {
    if (!opt) {
        return Promise.reject({
            code: ERROR_CODE
        });
    }

    return Promise.resolve({
        data: opt,
        code: SUCCESS_CODE
    });
});

jest.mock('ssh2-sftp-client', () => {
    return jest.fn().mockImplementation(() => {
        return {
            connect: global.initMock,
            delete: global.initMock,
            put: global.initMock,
            mkdir: global.initMock,
            list: global.initMock,
            end: global.initMock
        };
    });
});

beforeEach(() => {
    // 每次实例化的时候清除实例引用
    sftp.mockClear();
});

describe('Test SFTP function', () => {

    it('Test the Class was called', () => {
        new sftpUploader(opt);

        expect(sftp).toHaveBeenCalledTimes(1);
    });

    it('Test connect server successfully', async () => {
        let client = new sftpUploader(opt);

        client.connect();
        expect(global.initMock).toBeCalled();
    });

    it('Test delete file successfully', async () => {
        let client = new sftpUploader(opt);
        let result = await client.delete(file);

        expect(result.code).toEqual(SUCCESS_CODE);
    });

    it('Test delete file failed', async () => {
        let client = new sftpUploader(opt);
        client.delete('').catch(err => {
            expect(err.code).toEqual(ERROR_CODE);
        })
    });

    it('Test upload file successfully', async () => {
        let client = new sftpUploader(opt);
        let result = await client.put(file, file);

        expect(result.code).toEqual(SUCCESS_CODE);
    });


    it('Test upload file failed', async () => {
        let client = new sftpUploader(opt);

        await client.put('', '').catch(res => {
            expect(res.code).toEqual(ERROR_CODE);
        });

        await client.put(file, '').catch(err => {
            expect(err.code).toEqual(ERROR_CODE);
        });
    });

    it('Test upload folder successfully', async () => {
        let client = new sftpUploader(opt);
        let result = await client.upload(dir);

        expect(result).toBeInstanceOf(Array);
    });

    it('Test create folder successfully', async () => {

        let client = new sftpUploader(opt);
        client.mkdir(dir).then(res => {
            expect(res.code).toEqual(SUCCESS_CODE);
        });
    });

    it('Test create folder failed', async () => {
        let client = new sftpUploader(opt);

        client.mkdir('').catch(res => {
            expect(res.code).toEqual(ERROR_CODE);
        });;
    });

    it('Test view info', async () => {
        let client = new sftpUploader(opt);
        
        await client.list('root');
        expect(global.initMock).toBeCalled();
    });

    it('Test shutdown service successfully', () => {
        let client = new sftpUploader(opt);
        client.close();

        expect(global.initMock).toBeCalled();
    });
});