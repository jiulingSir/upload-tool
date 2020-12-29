import FtpUploader from './widgets/ftpUploader/index';
import SftpUploader from './widgets/sftpUploader/index';
import { REMOTE_TYPE } from './widgets/util/const-code/index';

module.exports = {
    [REMOTE_TYPE.ftp]: FtpUploader,
    [REMOTE_TYPE.sftp]: SftpUploader
};

