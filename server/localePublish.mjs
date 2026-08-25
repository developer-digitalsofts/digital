/**
 * Locale store draft/published snapshot — mirrors CMS publishStore pattern.
 */
const LOCALE_FILE = 'localeRecords.json'
const LOCALE_KEY = 'localeRecords'

export function createLocalePublishHelpers({ localeStorage, publishStore }) {
  async function readDraftStore() {
    return localeStorage.readLocaleStore()
  }

  async function readPublishedStore() {
    const data = await publishStore.readPublished(LOCALE_FILE)
    return data || { schemaVersion: 1, records: [], setupCompleted: {} }
  }

  async function markLocaleDraftSaved(email) {
    return publishStore.markDraftSaved(LOCALE_KEY, email)
  }

  async function syncLocalePublishedSnapshot(email) {
    const draft = await readDraftStore()
    await publishStore.publishFile(LOCALE_FILE, LOCALE_KEY, email)
    return draft
  }

  async function getLocalePublishStatus() {
    return publishStore.getSectionStatus(LOCALE_KEY, LOCALE_FILE)
  }

  return {
    LOCALE_FILE,
    LOCALE_KEY,
    readDraftStore,
    readPublishedStore,
    markLocaleDraftSaved,
    syncLocalePublishedSnapshot,
    getLocalePublishStatus,
  }
}
