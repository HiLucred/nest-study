import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read notification', async () => {
    const newNotification = makeNotification()
    await inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      recipientId: newNotification.recipientId.toString(),
      notificationId: newNotification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
    if (result.isRight()) {
      expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
        expect.any(Date),
      )
    }
  })

  it('should not be able to read notification from another user', async () => {
    const newNotification = makeNotification()
    await inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      recipientId: 'another-recipient-id',
      notificationId: newNotification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(undefined)
  })
})
