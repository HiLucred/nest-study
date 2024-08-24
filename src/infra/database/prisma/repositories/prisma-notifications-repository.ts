import { NotificationsRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { PrismaService } from '../prisma.service'
import { PrismaNotificationMapper } from '../mapppers/prisma-notification-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.create({
      data,
    })
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    })

    if (!notification) {
      throw new Error('Notification not found.')
    }

    return PrismaNotificationMapper.toDomain(notification)
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: {
        id: notification.id.toString(),
      },
      data,
    })
  }
}
