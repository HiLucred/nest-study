import { Either, left, right } from '@/core/either'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '../storage/uploader'
import { Injectable } from '@nestjs/common'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    const isValidFileType = /^image\/(png|jpeg)$|^application\/pdf$/.test(
      fileType,
    )

    if (!isValidFileType) {
      return left(new InvalidAttachmentTypeError())
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
