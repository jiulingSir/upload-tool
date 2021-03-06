

import fs from 'fs';
import path from 'path';
import glob from 'glob';

/**
 * 判断文件路径是否为文件夹
 * @param filePath 源文件路径
 */
export const isDirectory = (curPath: string): boolean => {
    return fs.statSync(curPath).isDirectory();
}

/**
 * 判断文件路径是否为文件
 * @param filePath 源文件路径
 */
export const isFile = (curPath: string): boolean => {
    return fs.statSync(curPath).isFile();
}

/**
 * 获取存在的类型信息
 *
 * @param {string[]} list 混合文件夹和文件的路径数组
 * @param {string} remote 路径前缀
 * @param {string} curType 当前类型
 * @return {*} 
 */
export const getTypeInfo = (files: string[], remote: string, UploadFn: any, typeFn: any) => {
    let list: any[] = [];

    files.forEach(file => {
        if (typeFn(file)) {
            list.push(UploadFn(remote, file));
        }
    });

    return list;
}

/**
 * 获取存在的文件目录
 * @param {string[]} list 混合文件夹和文件的路径数组
 * @param {string} remote 路径前缀
 */
export const getDirectorys =  (list: string[], remote: string) => {
    return getTypeInfo(list, remote, (remote, file) => {
        return path.join(remote, path.basename(file));
    }, isDirectory);
}

/**
 * 获取存在的文件
 * @param {string[]} list 混合文件夹和文件的路径数组
 * @param {string} remote 路径前缀
 */
export const getFiles =  (list: string[], remote: string) => {
    return getTypeInfo(list, remote, (remote, file) => {
        let localFile = path.join(remote, file);
        let remoteFile = path.join(remote, path.basename(file));

        return {
            localFile,
            remoteFile
        };
    }, isFile);
}

/**
 * 通过glob获取所有的文件信息
 * @param filePath 源文件路径
 */
export const getAllFilesByGlob = (filePath: string) => {
    return glob.sync(filePath, []);
}