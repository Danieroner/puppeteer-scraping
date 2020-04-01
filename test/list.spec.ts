import { assert } from 'chai';
import { MovieList } from '../src/list';
import { Nodo } from '../src/node';
import { Movie } from '../src/movie';


describe('test Movie Linked List', (): void => {
    let movieList: MovieList;
    let movieValues: Movie;
    let current: Nodo;

    beforeEach((): void =>  {
        movieList = new MovieList();
        movieValues = {
            title: 'avengers',
            link: ['mega']
        }
    });

    it('it is string and array', (): void => {
        assert.isObject(movieList, 'it is object');
        assert.isString(movieValues.title, 'it is string');
        assert.isArray(movieValues.link, 'it is array');
    });

    it('append to linked list', (): void => {
        movieList.append('avengers',  ['mega']);
        current = movieList.head;
        assert.equal(current.title, 'avengers');
        assert.deepEqual(current.link, ['mega']);
    });
});