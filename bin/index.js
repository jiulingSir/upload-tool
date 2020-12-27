const readline = require('readline');
const path = require('path');
const glob = require('glob');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const { FtpUploader } = require('../src/index.ts');

let ftp;

const start = async () => {
    askFtpOrSftp();
}

const askFtpOrSftp = async () => {
    ftp = new FtpUploader({
        host: '47.107.157.97',
        user: 'ftp',
        port: 21,
        password: 'Admin@123',
        remoteSystem: 'ftp'
    });

    await ftp.connect();
    askAction();
    return;
    rl.question('Which file system would you like to use? (ftp|sftp) > ', res => {
        if (res == 'ftp' || res == 'sftp') {
            askLoginData(res);
        } else {
            console.log("Invalid remote system.");
            askFtpOrSftp();
        }
    });
}

const askLoginData = async (remoteSystem) => {
    rl.question('Host? > ', host => {
        rl.question('Port? > ', port => {
            rl.question('User? > ', user => {
                rl.question('Password? (Warning, visible in console) > ', async (password) => {
                    ftp = new FtpUploader({
                        host: host,
                        port: port,
                        user: user,
                        password: password,
                        type : remoteSystem
                    });

                    await ftp.connect();
                    askAction();
                });
            });
        });
    });
};

const askAction = async () => {
    rl.question('Action? (ls|cd|file|dir|del) > ', (res) => {
        const ACTION_TYPE = {
            ['ls']: ls,
            ['file']: uploadFile,
            ['dir']: uploadDir,
            ['del']: del
        };

        if (ACTION_TYPE[res]) {
            return ACTION_TYPE[res]();
        }

        console.log("UNKNOWN ACTION!");
        askAction();
    });
};

const ls = async () => {
    rl.question('查看文件列表? > ', async (root) => {
        await ftp.list(root).then((res) => {
            console.log(res.data);
        });
        
        askAction();
    });
};

const uploadFile = async () => {
    rl.question('接收文件的目的地路径? > ', async(file) => {
        const local = glob.sync(file, []);
        const remote = `./xyx/3.jpg`;
        try {
            await ftp.put(...local, remote).then((res) => {
                console.log(res.data);
            });
        
            askAction();
        } catch(e) {
            console.log(e);
            askAction();
        }
    });
};

const uploadDir = async () => {
    rl.question('接收文件夹目的地路径? > ', async (dir) => {
        try {
            await ftp.put(...local, remote).then((res) => {
                console.log(res.data);
            });
        
            askAction();
        } catch(e) {
            console.log(e);
            askAction();
        }
    });
};

const del = async () => {
    rl.question('删除指定文件? > ', async (file) => {
        try {
            await ftp.delete(file).then((res) => {
                console.log(res.data);
            });
        
            askAction();
        } catch(e) {
            console.log(e);
            askAction();
        }
    });
};

start();