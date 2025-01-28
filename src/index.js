import path from "path";
import dotenv from "dotenv";
import { JsonDatabase } from "./utils/JsonDatabase.js";
import { StartupEductionCenterCrawler } from "./startup-education-center.js";

dotenv.config();

const __dirname = path.resolve();
const WEB_HOOK_URL = process.env.DISCORD_WEB_HOOK_URL;

async function notify(message) {
    fetch(WEB_HOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: message,
            username: "창업공지 봇",
        }),
    });
}

async function notifyRecentContents() {
    const db = new JsonDatabase(path.resolve(__dirname, "./metadata.json"));
    const { lastCrawledIndex } = await db.read();

    const BOARD_CENTER = "/changup/Board?menuId=MENU_CHANGUP0051";
    const crawler = new StartupEductionCenterCrawler(BOARD_CENTER);
    await crawler.getUnReadNotices();

    const recentContents = crawler.data.filter(
        (notice) => parseInt(notice.index) > lastCrawledIndex
    );

    await db.update("lastCrawledIndex", parseInt(crawler.data[0].index));

    for (const notice of recentContents) {
        notify(`## 경북대학교 창업교육센터 공지사항\n[${notice.title}](${notice.link})`);
    }
}

async function main() {
    notifyRecentContents();
}

main();
