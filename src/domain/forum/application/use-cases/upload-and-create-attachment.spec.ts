import { FakeUploader } from 'test/storage/fake-uploader'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let uploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    uploader = new FakeUploader()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      uploader,
    )
  })

  it('should be able to upload and create attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(uploader.uploads).toHaveLength(1)
    expect(uploader.uploads[0]).toEqual(
      expect.objectContaining({ fileName: 'profile.png' }),
    )
  })

  it('should not be able to upload and create attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'audio/mp3',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
