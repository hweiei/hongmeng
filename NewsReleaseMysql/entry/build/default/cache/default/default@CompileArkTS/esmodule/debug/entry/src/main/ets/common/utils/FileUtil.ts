import fileIo from "@ohos:file.fs";
import request from "@ohos:request";
import picker from "@ohos:file.picker";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import type { ContentType, RequestMethod, UploadingState } from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import ResponseResult from "@bundle:com.example.newsrelease/entry/ets/viewmodel/ResponseResult";
import Logger from "@bundle:com.example.newsrelease/entry/ets/common/utils/Logger";
import { showToast } from "@bundle:com.example.newsrelease/entry/ets/common/utils/ToastUtil";
/**
 * PhotoViewPicker
 *
 * @returns uri The uri for the selected file.
 */
export async function fileSelect(): Promise<string> {
    let photoSelectOptions = new picker.PhotoSelectOptions();
    photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
    photoSelectOptions.maxSelectNumber = 1;
    let photoPicker = new picker.PhotoViewPicker();
    try {
        let photoSelectResult = await photoPicker.select(photoSelectOptions);
        if (photoSelectResult && photoSelectResult.photoUris && photoSelectResult.photoUris.length > 0) {
            let imgUri = photoSelectResult.photoUris[0];
            if (imgUri.indexOf('media/Photo') < 0) {
                showToast({ "id": 16777231, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
                return '';
            }
            return photoSelectResult.photoUris[0];
        }
        else {
            return '';
        }
    }
    catch (err) {
        Logger.error('SelectedImage failed', JSON.stringify(err));
        return '';
    }
}
/**
 * Upload file.
 *
 * @param context Indicates the application BaseContext.
 * @param fileUri The local storage path of the file.
 * @returns the promise returned by the function.
 */
export function fileUpload(context: Context, fileUri: string): Promise<ResponseResult> {
    // Obtaining the Application File Path.
    let cacheDir = context.cacheDir;
    let imgName = fileUri.split('/').pop() + '.jpg';
    let dstPath = cacheDir + '/' + imgName;
    let url: string = Constants.SERVER + Constants.UPLOAD_FILE;
    let uploadRequestOptions: request.UploadConfig = {
        url: url,
        header: {
            'Content-Type': "multipart/form-data"
        },
        method: "POST",
        files: [{
                filename: imgName,
                name: 'file',
                uri: 'internal://cache/' + imgName,
                type: 'jpg'
            }],
        data: []
    };
    let serverData = new ResponseResult();
    return new Promise((resolve: Function, reject: Function) => {
        try {
            // Copy the URI to the cacheDir directory and upload the file.
            let srcFile = fileIo.openSync(fileUri);
            let dstFile = fileIo.openSync(dstPath, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE);
            fileIo.copyFileSync(srcFile.fd, dstFile.fd);
            fileIo.closeSync(srcFile);
            fileIo.closeSync(dstFile);
            // Upload the file.
            request.uploadFile(context, uploadRequestOptions).then((data: request.UploadTask) => {
                data.on("complete", (result: Array<request.TaskState>) => {
                    Logger.info('uploadFile success', JSON.stringify(result));
                    if (result && result.length >= 1) {
                        serverData.code = Constants.SERVER_CODE_SUCCESS;
                        serverData.msg = result[0].message;
                        serverData.data = Constants.IMAGE_PREFIX + result[0].path.split('/').pop();
                        resolve(serverData);
                    }
                });
                data.on("fail", (result: Array<request.TaskState>) => {
                    Logger.info('uploadFile failed', JSON.stringify(result));
                    if (result && result.length >= 1) {
                        serverData.msg = { "id": 16777248, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
                        reject(serverData);
                    }
                });
            }).catch((err: Error) => {
                Logger.error('uploadFile failed', JSON.stringify(err));
                reject(serverData);
            });
        }
        catch (err) {
            Logger.error('uploadFile failed', JSON.stringify(err));
            reject(serverData);
        }
    });
}
