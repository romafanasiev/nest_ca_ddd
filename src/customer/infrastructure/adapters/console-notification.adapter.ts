import { Injectable, Logger } from '@nestjs/common';
import {
  Notification,
  NotificationPort,
} from 'src/customer/application/ports/notification.port';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  // eslint-disable-next-line @typescript-eslint/require-await
  async sendNotification(notification: Notification): Promise<void> {
    this.logger.log(
      `${notification.subject} To: ${notification.recipient} | ${notification.message}`,
    );
  }
}
