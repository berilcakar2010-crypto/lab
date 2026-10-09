/**
 * Spaced-repetition reminders.
 *
 * On Android, local notifications are scheduled for the next 14 days at the
 * learner's chosen time, each saying what will be due then (topics + cards).
 * They are re-planned whenever the app goes to the background or the settings
 * change, so they always follow the current schedule. In a browser, a
 * notification is shown on opening the app when something is due (browsers
 * cannot schedule notifications while the page is closed).
 *
 * Exams have their own reminders (ids 7100+): on the chosen days before each
 * exam at the same time, and on the morning of the exam.
 */
import type { LabDB } from "../domain/types";
import { L } from "../i18n";
import { dueCards } from "../study/flashcards";
import { dueTopics, reminderForecast, reminderText } from "../study/topics";
import { examReminders } from "../study/exams";
import { researchReminders } from "../adaptive/research";
import { getGraph } from "../knowledge/graph";
import { isNative } from "./native";

const BASE_ID = 7000;
const DAYS = 14;
const CHANNEL = "lab-review";
const EXAM_ID = 7100;
const EXAM_CHANNEL = "lab-exams";
const RESEARCH_ID = 7300;

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
  const ours = pending.notifications.filter((n) => n.id >= BASE_ID && n.id < BASE_ID + 400);
  if (ours.length) await LocalNotifications.cancel({ notifications: ours.map((n) => ({ id: n.id })) });
  const { enabled, hour, minute, exams, research } = db.preferences.reminders;
  if (!enabled && !exams && !research) return 0;
  if ((await notificationPermission()) !== "granted") return 0;
  try {
    await LocalNotifications.createChannel({ id: CHANNEL, name: L("Review reminders", "Tekrar hatırlatmaları"), importance: 4, description: L("Daily spaced-repetition reminder", "Günlük aralıklı tekrar hatırlatması") });
    await LocalNotifications.createChannel({ id: EXAM_CHANNEL, name: L("Exam reminders", "Sınav hatırlatmaları"), importance: 4, description: L("Upcoming exams and deadlines", "Yaklaşan sınavlar ve teslimler") });
  } catch {
    /* channels exist only on Android 8+ */
  }
  const slots = enabled ? reminderForecast(db, hour, minute, Date.now(), DAYS).filter((s) => s.cards + s.topics > 0) : [];
  const examSlots = exams ? examReminders(db, getGraph(db.knowledge), hour, minute).slice(0, 100) : [];
  const researchSlots = research ? researchReminders(db, hour, minute) : [];
  if (!slots.length && !examSlots.length && !researchSlots.length) return 0;
  await LocalNotifications.schedule({
    notifications: [
      ...slots.map((s, i) => {
        const t = reminderText(s);
        return { id: BASE_ID + i, title: t.title, body: t.body, schedule: { at: new Date(s.at), allowWhileIdle: true }, channelId: CHANNEL, extra: { route: "/study" } };
      }),
      ...examSlots.map((r, i) => ({ id: EXAM_ID + i, title: r.title, body: r.body, schedule: { at: new Date(r.at), allowWhileIdle: true }, channelId: EXAM_CHANNEL, extra: { route: `/study?tab=exams&exam=${r.examId}` } })),
      ...researchSlots.map((r, i) => ({ id: RESEARCH_ID + i, title: r.title, body: r.body, schedule: { at: new Date(r.at), allowWhileIdle: true }, channelId: CHANNEL, extra: { route: `/study?tab=research&res=${r.researchId}` } })),
    ],
  });
  return slots.length + examSlots.length + researchSlots.length;
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

/** Browser: one notification per day on opening the app, if something is due or an exam reminder day has come. */
export function webReminderOnOpen(db: LabDB): void {
  if (isNative() || typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const { enabled, exams, research } = db.preferences.reminders;
  if (!enabled && !exams && !research) return;
  const today = new Date().toDateString();
  try {
    if (localStorage.getItem(WEB_KEY) === today) return;
  } catch {
    return;
  }
  const notes: { title: string; body: string; tag: string }[] = [];
  if (exams) {
    // Any reminder whose day is today (time already passed or later today).
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const r = examReminders(db, getGraph(db.knowledge), db.preferences.reminders.hour, db.preferences.reminders.minute, start.getTime())
      .find((x) => new Date(x.at).toDateString() === today);
    if (r) notes.push({ title: r.title, body: r.body, tag: "lab-exam" });
  }
  if (enabled) {
    const slot = { at: Date.now(), cards: dueCards(db).length, topics: dueTopics(db).length };
    if (slot.cards || slot.topics) notes.push({ ...reminderText(slot), tag: "lab-review" });
  }
  if (research) {
    const r = researchReminders(db, 0, 0, Date.now() - 86_400_000).find((x) => x.at <= Date.now() + 86_400_000);
    if (r) notes.push({ title: r.title, body: r.body, tag: "lab-research" });
  }
  if (!notes.length) return;
  try {
    for (const n of notes) new Notification(n.title, { body: n.body, tag: n.tag });
    localStorage.setItem(WEB_KEY, today);
  } catch {
    /* some browsers only allow notifications from a service worker */
  }
}
