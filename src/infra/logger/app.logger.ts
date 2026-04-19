import { LoggerService } from '@nestjs/common'

export class AppLogger implements LoggerService {
    log(message: string, context?: string) {
        this.print('log', message, context)
    }

    error(message: string, trace?: string, context?: string) {
        this.print('error', message, context, trace)
    }

    warn(message: string, context?: string) {
        this.print('warn', message, context)
    }

    debug(message: string, context?: string) {
        this.print('debug', message, context)
    }

    private print(
        level: string,
        message: string,
        context?: string,
        trace?: string
    ) {
        const log = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            trace,
        }

        process.stdout.write(JSON.stringify(log) + '\n')
    }
}