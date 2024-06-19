import { NotificationsRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async findById(notificationId: string) {
    const notification = this.items.find(
      (item) => item.id.toString() === notificationId,
    )

    if (!notification) {
      return null
    }

    return notification
  }
}
