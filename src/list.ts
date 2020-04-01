import fs from 'fs';
import path from 'path';
import { List } from './build';
import { Nodo } from './node';
import { Movie } from './movie';

export class MovieList implements List {

    public head!: Nodo;

    public append(title: string, link: Array<string>): void {
        const movie: Movie = { title, link };

        if (this.head == null) {
            this.head = new Nodo(movie);
            return;
        }

        let current: Nodo = this.head;

        while (current.next != null) {
            current = current.next;
        }

        current.next = new Nodo(movie);
    }

    public* saveIntoFile(current: Nodo): Generator {
        const filePath: string = path.resolve('./', 'movies.txt');
        const data: string = `${current.title}: \n${current.link} \n\n`;
        
        yield new Promise ((resolve, reject): void => {
            fs.appendFile(filePath, data, (err: NodeJS.ErrnoException | null): void => {
                if (err) throw reject(err);
                resolve(process.stdout.write(`Movie ${current.title} --> Saved! \n`));
            });
        });

    }

    public saveAll(): void {
        if (this.head == null) return;

        let current: Nodo = this.head;
        
        do {
            this.saveIntoFile(current).next();
            current = current.next;
        } while (current != null);
    }

}