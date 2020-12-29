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

describe('ftp功能测试', () => {

    it('检查是否调用了类构造函数', () => {
        new ftpUploader(opt);

        expect(ftp).toHaveBeenCalledTimes(1);
    });

    it('测试连接成功', async () => {
        let client = new ftpUploader(opt);

        client.connect();
        expect(mockFn).toBeCalled();
    });

    it('测试删除成功', async () => {
        let client = new ftpUploader(opt);
        let result = await client.delete(file);

        expect(result.code).toEqual(SUCCESS_CODE);
    });

    it('测试删除失败', async () => {
        let client = new ftpUploader(opt);
        client.delete('').catch(err => {
            expect(err.code).toEqual(ERROR_CODE);
        })
    });

    it('测试上传成功', async () => {
        let client = new ftpUploader(opt);
        let result = await client.put(file, file);

        expect(result.code).toEqual(SUCCESS_CODE);
    });


    it('测试上传失败', async () => {
        let client = new ftpUploader(opt);

        await client.put('', '').catch(res => {
            expect(res.code).toEqual(ERROR_CODE);
        });

        await client.put(file, '').catch(err => {
            expect(err.code).toEqual(ERROR_CODE);
        });
    });

    it('测试上传文件夹', async () => {
        let client = new ftpUploader(opt);
        let result = await client.upload(dir);

        expect(result).toBeInstanceOf(Array);
    });

    it('测试创建文件夹成功', async () => {

        let client = new ftpUploader(opt);
        client.mkdir(dir).then(res => {
            expect(res.code).toEqual(SUCCESS_CODE);
        });
    });

    it('测试创建文件夹失败', async () => {

        let client = new ftpUploader(opt);
        client.mkdir('otherError').catch(res => {
            expect(res.code).toEqual(ERROR_CODE);
        });;
    });

    it('测试查看目录', async () => {

        let client = new ftpUploader(opt);
        let result = await client.list('root');

        expect(result.code).toEqual(SUCCESS_CODE);
    });

    it('测试查看不存在目录', async () => {

        let client = new ftpUploader(opt);

        await client.list('').catch(err => {

            expect(err.code).toEqual(ERROR_CODE);
        });

    });

    it('测试关闭服务', () => {
        let client = new ftpUploader(opt);
        client.close();

        expect(mockFn).toBeCalled();
    });
});