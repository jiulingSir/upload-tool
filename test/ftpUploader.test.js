/**
 * 单元测试——ftp功能基类
 */
import ftp from 'ftp';
import ftpUploader from '../src/widgets/ftpUploader/index.ts';

import {
    ERROR_CODE,
    SUCCESS_CODE
} from '../src/widgets/util/const-code';

let opt = {
    host: '127.0.0.1',
    port: 21,
    username: 'test',
    password: 'test',
    root: '.'
};
let file = './src/index.ts';
let dir = '../test/';
const mockFn = jest.fn();

jest.mock('ftp', () => {
    return jest.fn().mockImplementation(() => {
        return {
            connect: mockFn,
            delete: jest.fn((file, cb) => {
                if (!file) {
                    return cb({ code: 1 });
                }
                
                cb();
            }),
            put: jest.fn((file, remoteFile, cb) => {
                if (!remoteFile) {

                    cb({ code: 1 });
                }
                cb();
            }),
            mkdir: jest.fn((dir, cb) => {
                if (dir === 'otherError') {
                    return cb({ code: 1 });
                }
                cb();
            }),
            list: jest.fn((dir, cb) => {
                let list = [];

                if (!dir) {
                    cb({ code: 1 }, list);
                }

                cb('', list);
            }),
            end: mockFn
        };
    });
});

beforeEach(() => {
    // 每次实例化的时候清除实例引用
    ftp.mockClear();
});

describe('Test FTP function', () => {

    it('Test the Class was called', () => {
        new ftpUploader(opt);

        expect(ftp).toHaveBeenCalledTimes(1);
    });

    it('Test connect server successfully', async () => {
        let client = new ftpUploader(opt);

        client.connect();
        expect(mockFn).toBeCalled();
    });

    it('Test delete file successfully', async () => {
        let client = new ftpUploader(opt);
        let result = await client.delete(file);

        expect(result.code).toEqual(SUCCESS_CODE);
    });

    it('Test delete file failed', async () => {
        let client = new ftpUploader(opt);
        client.delete('').catch(err => {
            expect(err.code).toEqual(ERROR_CODE);
        })
    });

    it('Test upload file successfully', async () => {
        let client = new ftpUploader(opt);
        let result = await client.put(file, file);

        expect(result.code).toEqual(SUCCESS_CODE);
    });


    it('Test upload file failed', async () => {
        let client = new ftpUploader(opt);

        await client.put('', '').catch(res => {
            expect(res.code).toEqual(ERROR_CODE);
        });

        await client.put(file, '').catch(err => {
            expect(err.code).toEqual(ERROR_CODE);
        });
    });

    it('Test upload folder successfully', async () => {
        let client = new ftpUploader(opt);
        let result = await client.upload(dir);

        expect(result).toBeInstanceOf(Array);
    });

    it('Test create folder successfully', async () => {

        let client = new ftpUploader(opt);
        client.mkdir(dir).then(res => {
            expect(res.code).toEqual(SUCCESS_CODE);
        });
    });

    it('Test create folder failed', async () => {

        let client = new ftpUploader(opt);
        client.mkdir('otherError').catch(res => {
            expect(res.code).toEqual(ERROR_CODE);
        });;
    });

    it('Test view info', async () => {

        let client = new ftpUploader(opt);
        let result = await client.list('root');

        expect(result.code).toEqual(SUCCESS_CODE);
    });

    it('Test view info not there', async () => {

        let client = new ftpUploader(opt);

        await client.list('').catch(err => {

            expect(err.code).toEqual(ERROR_CODE);
        });

    });

    it('Test shutdown service successfully', () => {
        let client = new ftpUploader(opt);
        client.close();

        expect(mockFn).toBeCalled();
    });
});