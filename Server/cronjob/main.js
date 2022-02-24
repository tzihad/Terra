import { CronJob } from "cron";
import { dlrd_map } from "./dlrd_map.mjs";
import { dns_map } from "./dns_map.mjs";
import { generate_dlrd } from "./generate_dlrd.mjs";
import { generate_dns } from "./generate_dns.mjs";
import { generate_dlrd_full } from "./geo_dlrd_full.mjs";
import { generate_dns_full } from "./geo_dns_full.mjs";
import { help_map } from "./help_map.mjs";

dlrd_map()
dns_map()
generate_dlrd()
generate_dns()
generate_dlrd_full()
generate_dns_full()
help_map()

new CronJob('0 */6 * * *', function() {
    dlrd_map()
    dns_map()
    generate_dlrd()
    generate_dns()
    generate_dlrd_full()
    generate_dns_full()
}).start()

new CronJob('*/5 * * * *', function() {
    help_map()
})