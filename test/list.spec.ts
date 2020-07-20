import { assert } from "chai";
import { MovieList } from "../src/list";
import { Nodo } from "../src/node";
import { Movie } from "../src/movie";

describe("test Movie Linked List", (): void => {
  let movieList: MovieList;
  let movieValues: Movie;
  let current: Nodo;

  beforeEach((): void =>  {
    movieList = new MovieList();
    movieValues = {
        title: "example video",
        link: ["mega"],
      }
  });

  it("it is string and array", (): void => {
    assert.isObject(movieList, "it is object");
    assert.isString(movieValues.title, "it is string");
    assert.isArray(movieValues.link, "it is array");
  });

  it("append to linked list", (): void => {
    movieList.append(movieValues.title,  movieValues.link);
    current = movieList.head;
    assert.equal(current.title, movieValues.title);
    assert.deepEqual(current.link, movieValues.link);
  });
});