import { Injectable, LoggerService } from '@nestjs/common'

@Injectable()
export class AppLoggerService implements LoggerService {
    log(message: string, context?: string) {
        this.print('info', message, context)
    }

    error(message: string, trace?: string, context?: string) {
        this.print('error', message, context, trace)
    }

    warn(message: string, context?: string) {
        this.print('warn', message, context)
    }

    private print(level: string, message: string, context?: string, trace?: string) {
        process.stdout.write(
            JSON.stringify({
                timestamp: new Date().toISOString(),
                level,
                message,
                context,
                trace,
            }) + '\n',
        )
    }
}