import puppeteer, { Browser, Page, Request, Response } from 'puppeteer';
import { List } from './build';
import { MovieList } from './list';

export class Wrapper {

    public browser!: Browser;
    public page!: Page;

    public constructor(
        public list: List = new MovieList(),
        public args: Array<string> = [],
        public readonly url: string = 'https://links.mega1080p.org/?v='
    ) {
        process.argv.splice(0, 2);
        process.argv.forEach((val: string): void => {
            this.args.push(val);
        });
    }

    public async config(): Promise<void> {
        this.browser = await puppeteer.launch();
        this.page =  await this.browser.newPage();
        this.page.setDefaultNavigationTimeout(0);
    }

    public listeners(page: Page): void {
        page.setMaxListeners(5000);

        page.once('request', (req: Request): void => {
            process.stdout.write(`A request was made to ${req.url()}\n`);
        });
    
        page.once('requestfinished', (req: Request): void => {
            process.stdout.write(`A request was finished\n`);
        });
    
        page.once('load', (): void => {
            process.stdout.write(`Page loaded\n`);
        });
    
        page.once('response', (res: Response): void => {
            if (res.ok()) {
                process.stdout.write(`Status: ${res.status()}\n`);
            }
        });
        
        page.once('requestfailed', (req: Request): void => {
            process.stdout.write(`Request failed: ${req.failure()?.errorText}\n`);
        });
    
        page.once('error', (err: Error): void => {
            process.stdout.write(`Whoops! there was an error: ${err}\n`);
        });
    }

    public async run(): Promise<void> {

        const [start, end]: [number, number] = [+this.args[0], +this.args[1]];

        enum Options {
            Start = start,
            End = end
        }

        await this.config();

        const hrStart: [number, number] = process.hrtime();

        let index: number = Options.Start;
        
        for (; index <= Options.End; index++) {
            
            this.listeners(this.page);
            await this.page.goto(`${this.url}${index}`);
        
            let title: string | boolean | null = await this.page.$eval('.content > h3', (element: Element): string | null => element.textContent)
                .catch((err: Error) => process.stdout.write(`${err}\n`));
            
            let links: Array<string> = await this.page.$$eval('.content > .tab_container > .tab_content > a', (element: Element[]): string[] => element.map((value: any): any => value.textContent));
        
            if (typeof title !== 'string' || title.indexOf('#') != -1) {
                continue;
            }
        
            this.list.append(title, links);
        }

        await this.browser.close();

        this.list.saveAll();

        const hrEnd: [number, number] = process.hrtime(hrStart);
        const [s, ms]: [number, number] = [hrEnd[0], Math.ceil(hrEnd[1] / 1000000)];

        process.stdout.write(`\nExecution time: ${s}s - ${ms}ms\n\n`);

    }

}