export interface UploaderParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload({
    fileName,
    body,
    fileType,
  }: UploaderParams): Promise<{ url: string }>
}
