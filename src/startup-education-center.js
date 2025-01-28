import * as cheerio from "cheerio";

const STARTUP_EDUCATION_CENTER_BASE_URL = "https://iac.knu.ac.kr";
const BOARD_CENTER = "/changup/Board?menuId=MENU_CHANGUP0051";
const BOARD_EXTERNAL = "/changup/Board2?menuId=MENU_CHANGUP0053";

export class StartupEductionCenterCrawler {
    constructor(board) {
        this.data = [];
        this.board = board;
    }

    async getUnReadNotices() {
        const response = await fetch(STARTUP_EDUCATION_CENTER_BASE_URL + this.board);

        const html = await response.text();
        const $ = cheerio.load(html);

        for (let i = 0; i < 5; i++) {
            const TABLE = ".bbsTable > table > tbody > ";
            const $index = $(TABLE + `tr:nth-child(${i}) > .td-num:not(.td-notice)`).toArray();
            const $title = $(TABLE + `tr:nth-child(${i}) > .td-subj > a`).toArray();

            const $notices = $index.map((_, i) => ({
                index: $index[i],
                title: $title[i],
            }));

            for (const $notice of $notices) {
                const index = $notice.index.children[0].data.trim();
                const title = $notice.title.children[0].data.trim();
                const link = $notice.title.attribs.href;

                this.data.push({
                    index,
                    title,
                    link: STARTUP_EDUCATION_CENTER_BASE_URL + link,
                });
            }
        }
    }
}
