import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment.use-case'
import { UploaderFake } from 'test/storage/uploader.fake'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type.error'

describe('Upload and Create Attachment', () => {
  let sut: UploadAndCreateAttachmentUseCase
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let uploaderFake: UploaderFake

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    uploaderFake = new UploaderFake()

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      uploaderFake,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(uploaderFake.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
    expect(uploaderFake.uploads).toHaveLength(0)
  })
})
