/**
 * Spaced-repetition reminders.
 *
 * On Android, local notifications are scheduled for the next 14 days at the
 * learner's chosen time, each saying what will be due then (topics + cards).
 * They are re-planned whenever the app goes to the background or the settings
 * change, so they always follow the current schedule. In a browser, a
 * notification is shown on opening the app when something is due (browsers
 * cannot schedule notifications while the page is closed).
 */
import type { LabDB } from "../domain/types";
import { L } from "../i18n";
import { dueCards } from "../study/flashcards";
import { dueTopics, reminderForecast, reminderText } from "../study/topics";
import { isNative } from "./native";

const BASE_ID = 7000;
const DAYS = 14;
const CHANNEL = "lab-review";

export type PermissionState = "granted" | "denied" | "prompt" | "unsupported";

export async function notificationPermission(request = false): Promise<PermissionState> {
  if (isNative()) {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const p = request ? await LocalNotifications.requestPermissions() : await LocalNotifications.checkPermissions();
    return p.display === "granted" ? "granted" : p.display === "denied" ? "denied" : "prompt";
  }
  if (typeof Notification === "undefined") return "unsupported";
  if (request && Notification.permission === "default") await Notification.requestPermission();
  return Notification.permission === "default" ? "prompt" : (Notification.permission as PermissionState);
}

/** Re-plan the native notifications from the current schedule. Returns how many were scheduled. */
export async function refreshReminders(db: LabDB): Promise<number> {
  if (!isNative()) return 0;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const pending = await LocalNotifications.getPending();
  const ours = pending.notifications.filter((n) => n.id >= BASE_ID && n.id < BASE_ID + 100);
  if (ours.length) await LocalNotifications.cancel({ notifications: ours.map((n) => ({ id: n.id })) });
  const { enabled, hour, minute } = db.preferences.reminders;
  if (!enabled) return 0;
  if ((await notificationPermission()) !== "granted") return 0;
  try {
    await LocalNotifications.createChannel({ id: CHANNEL, name: L("Review reminders", "Tekrar hatırlatmaları"), importance: 4, description: L("Daily spaced-repetition reminder", "Günlük aralıklı tekrar hatırlatması") });
  } catch {
    /* channels exist only on Android 8+ */
  }
  const slots = reminderForecast(db, hour, minute, Date.now(), DAYS).filter((s) => s.cards + s.topics > 0);
  if (!slots.length) return 0;
  await LocalNotifications.schedule({
    notifications: slots.map((s, i) => {
      const t = reminderText(s);
      return { id: BASE_ID + i, title: t.title, body: t.body, schedule: { at: new Date(s.at), allowWhileIdle: true }, channelId: CHANNEL, extra: { route: "/study" } };
    }),
  });
  return slots.length;
}

/** Open the Study page when a reminder is tapped (native). */
export async function listenForReminderTaps(): Promise<void> {
  if (!isNative()) return;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  await LocalNotifications.addListener("localNotificationActionPerformed", (a) => {
    const route = a.notification.extra?.route;
    if (typeof route === "string") window.location.hash = route;
  });
}

const WEB_KEY = "lab-last-web-reminder";

/** Browser: one notification per day on opening the app, if something is due. */
export function webReminderOnOpen(db: LabDB): void {
  if (isNative() || !db.preferences.reminders.enabled || typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const today = new Date().toDateString();
  try {
    if (localStorage.getItem(WEB_KEY) === today) return;
  } catch {
    return;
  }
  const slot = { at: Date.now(), cards: dueCards(db).length, topics: dueTopics(db).length };
  if (!slot.cards && !slot.topics) return;
  const t = reminderText(slot);
  try {
    new Notification(t.title, { body: t.body, tag: "lab-review" });
    localStorage.setItem(WEB_KEY, today);
  } catch {
    /* some browsers only allow notifications from a service worker */
  }
}
