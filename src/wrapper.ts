import puppeteer, { Browser, Page, Request, Response } from "puppeteer";
import { List } from "./build";
import { MovieList } from "./list";

export class Wrapper {
  public browser!: Browser;
  public page!: Page;

  public constructor(
    public list: List = new MovieList(),
    public args: Array<string> = [],
    public readonly url: string = "https://links.mega1080p.org/?v="
  ) {
    process.argv.splice(0, 2);
    process.argv.forEach((val: string): void => {
      this.args.push(val);
    });
  }

  public async config(): Promise<void> {
    this.browser = await puppeteer.launch({
      ignoreDefaultArgs: ["--disable-extensions"],
    });
    this.page =  await this.browser.newPage();
    this.page.setDefaultNavigationTimeout(0);
    const headers = { 
      "Accept": "text/html", 
      "Content-Type": "text/html;charset=UTF-8",
      "Accept-Encoding": "gzip, deflate", 
      "Accept-Language": "es-ES", 
      "Referer": "https://links.mega1080p.org/" ,
    };
    await this.page.setExtraHTTPHeaders(headers);
  }

  public listeners(page: Page): void {
    page.once("request", (req: Request): void => {
      process.stdout.write(`A request was made to ${req.url()}\n`);
    });
    page.once("requestfinished", (req: Request): void => {
      process.stdout.write("A request was finished\n");
    });
    page.once("load", (): void => {
      process.stdout.write("Page loaded\n");
    });
    page.once("response", (res: Response): void => {
      if (res.ok()) {
        process.stdout.write(`Status: ${res.status()}\n`);
      }
    });
    page.once("requestfailed", (req: Request): void => {
      process.stdout.write(`Request failed: ${req.failure()?.errorText}\n`);
    });
    page.once("error", (err: Error): void => {
      process.stdout.write(`Whoops! there was an error: ${err}\n`);
    });
  }

  public async run(): Promise<void> {
    const [start, end] = [+this.args[0], +this.args[1]];

    enum Options {
      Start = start,
      End = end
    }

    await this.config();
    const hrStart = process.hrtime();
    let index = Options.Start;
        
    for (; index <= Options.End; index++) {
      this.listeners(this.page);
      await this.page.goto(`${this.url}${index}`);

      try {
        let title = await this.page.$eval(".content > h3", (element) => {
          return element.textContent
        });
        if (typeof title !== "string") {
          throw new Error("error");
        }
        let encode = new TextEncoder().encode(title);
        let decode = new TextDecoder("utf-8").decode(encode);
        let html = ".content > .tab_container > .tab_content > a";
        let links: Array<string> = await this.page.$$eval(html, (element) => {
          return element.map((value: any) => value.textContent);
        });

        if (typeof title !== "string" || title.indexOf("#") != -1) {
          continue;
        }
        this.list.append(decode, links);
      } catch (error) {
        process.stdout.write(error);
      }
    }

    await this.browser.close();
    this.list.saveAll();
    const hrEnd = process.hrtime(hrStart);
    const [s, ms] = [hrEnd[0], Math.ceil(hrEnd[1] / 1000000)];

    process.stdout.write(`\nExecution time: ${s}s - ${ms}ms\n\n`);
  }
}