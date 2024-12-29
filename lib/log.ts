import { Log, LogCollector, LogFunction, LogLevel, LogLevels } from "@/types/log";

export function createLogCollector(): LogCollector {
    const logs: Log[] = []
    const getAll = () => logs
    const logFuntions = {} as Record<LogLevel, LogFunction>

    LogLevels.forEach(
        (level) => (logFuntions[level] = (message: string) => {
            logs.push({ message, level, timestamp: new Date() })
        })
    )

    return {
        getAll,
        ...logFuntions,
    }
}