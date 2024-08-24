import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Notification as PrismaNotification, Prisma } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(prismaNotification: PrismaNotification): Notification {
    return Notification.create(
      {
        title: prismaNotification.title,
        content: prismaNotification.content,
        recipientId: new UniqueEntityId(prismaNotification.receiptId),
        createdAt: prismaNotification.createdAt,
        readAt: prismaNotification.readAt,
      },
      new UniqueEntityId(prismaNotification.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      receiptId: notification.recipientId.toString(),
      content: notification.content,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
