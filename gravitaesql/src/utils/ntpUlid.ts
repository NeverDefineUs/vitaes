import { NTPClient } from 'ntpclient'
import { ulid as originalUlid} from 'ulid'

export interface ntpUlidConfig {
  /** Enables recurring NTP sync */
  ntpRecurringUpdates?: boolean
  /** Interval between NTP sync (only used if NTP recurring updates are enabled ) */
  ntpSyncIntervalMs?: number
  /** IP/Hostname of the remote NTP Server */
  ntpServerAddress?: string
  /** Remote NTP Server port number */
  ntpServerPort?: number
  /** Amount of acceptable time (ms) to await for a response from the remote server. */
  ntpReplyTimeoutMs?: number

  /** Display initial offset on console */
  debugInitialOffsetUpdate?: boolean
  /** Display every offset after updates on console (overrides initial debug) */
  debugEveryOffsetUpdate?: boolean
}

const defaultConfig: Required<ntpUlidConfig> = {
  ntpRecurringUpdates: true,
  ntpSyncIntervalMs: 12 * 60 * 1000,
  ntpServerAddress: 'time.google.com',
  ntpServerPort: 123,
  ntpReplyTimeoutMs: 20 * 1000,
  debugInitialOffsetUpdate: false,
  debugEveryOffsetUpdate: false,
}

let ntpUlidConfig: ntpUlidConfig
let recurringUpdateTaskId: number
let offset = 0

let minimumTimestamp = 0

const ulid = () => {
  let timestamp = Date.now() + offset
  if (timestamp < minimumTimestamp) {
    timestamp = minimumTimestamp
  }
  return originalUlid(timestamp)
}

const updateOffset = async () => {
  const ntpTime = await new NTPClient(
    ntpUlidConfig.ntpServerAddress,
    ntpUlidConfig.ntpServerPort,
    ntpUlidConfig.ntpReplyTimeoutMs
  ).getNetworkTime()
  const newOffset = ntpTime.getTime() - Date.now()

  if (newOffset < offset) {
    minimumTimestamp = Date.now() + offset
  }
  offset = newOffset

  if (ntpUlidConfig.debugEveryOffsetUpdate) {
    console.log('new time offset in milliseconds is:', offset)
  }
}

const initNtpUlidSync = async (config?: ntpUlidConfig) => {
  if (recurringUpdateTaskId) {
    throw new Error('Already initialized')
  }

  ntpUlidConfig = {
    ...defaultConfig,
    ...config,
  }

  await updateOffset()
  if (!ntpUlidConfig.debugEveryOffsetUpdate && ntpUlidConfig.debugInitialOffsetUpdate) {
    console.log('time offset in milliseconds is:', offset)
  }

  if (ntpUlidConfig.ntpRecurringUpdates) {
    recurringUpdateTaskId = setInterval(updateOffset, ntpUlidConfig.ntpSyncIntervalMs)
  }
}

const stopNtpUlidSync = () => {
  if (recurringUpdateTaskId) {
    clearInterval(recurringUpdateTaskId)
    recurringUpdateTaskId = 0
  }
}

export {
  ulid,
  initNtpUlidSync,
  stopNtpUlidSync,
}
