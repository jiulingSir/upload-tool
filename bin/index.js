const readline = require('readline');
const glob = require('glob');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const uploaderTool = require('../src/index.ts');

let ftp;

const start = async () => {
    askFtpOrSftp();
}

const askFtpOrSftp = async () => {
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
                    ftp = new uploaderTool[remoteSystem]({
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
    rl.question('Action? (ls|file|del) > ', (res) => {
        const ACTION_TYPE = {
            ['ls']: ls,
            ['file']: uploadFile,
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
        const remote = `./xyx/`;
        try {
            await ftp.upload(file, remote);
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