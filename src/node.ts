import { Movie } from "./movie";

export class Nodo {
  public next!: Nodo;
  public props: Movie;

  get title(): string {
    return this.props.title;
  }

  set title(value: string) {
      this.props.title = value;
  }

  get link(): Array<string> {
      return this.props.link;
  }

  set link(value: Array<string>) {
    this.props.link = value;
  }

  public constructor(props: Movie) {
    this.props = props;
  }
}