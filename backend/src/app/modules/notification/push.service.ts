import webpush from 'web-push';
import { User } from '../user/user.model';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url: string;
}

export const sendPushToUser = async (
  userId: string,
  payload: PushPayload
): Promise<void> => {
  const user = await User.findById(userId).select('pushSubscriptions notificationPreferences');
  if (!user || !user.pushSubscriptions?.length) return;

  const expiredEndpoints: string[] = [];

  for (const sub of user.pushSubscriptions) {
    try {
      await webpush.sendNotification(
        sub as webpush.PushSubscription,
        JSON.stringify(payload)
      );
    } catch (error: any) {
      if (error.statusCode === 410 || error.statusCode === 400) {
        expiredEndpoints.push(sub.endpoint);
      }
    }
  }

  // Remove expired subscriptions
  if (expiredEndpoints.length > 0) {
    await User.findByIdAndUpdate(userId, {
      $pull: { pushSubscriptions: { endpoint: { $in: expiredEndpoints } } }
    });
  }
};