import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronJobsService {


    private readonly logger = new Logger(CronJobsService.name);

    @Cron('0 */14 * * * *')
    handleCron() {
        fetch("https://book-store-api-nestjs.onrender.com/books/search?title=War")
            .then(res => res.json())
            .catch(err => this.logger.error(err));
    }
}

