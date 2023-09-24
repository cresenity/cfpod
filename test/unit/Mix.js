import test from 'ava';
import sinon from 'sinon';
import Task from '../../src/tasks/Task.js';
import { fs } from '../helpers/fs.js';
import PodClass from '../../src/Pod.js';

test('that it knows if it is being executed in a production environment', t => {
    const Pod = new PodClass();

    Pod.config.production = true;

    t.true(Pod.inProduction());
    t.true(Pod.api.inProduction());
});

test('that it can check if a certain config item is truthy', t => {
    const Pod = new PodClass();

    Pod.config.processCssUrls = true;

    t.true(Pod.isUsing('processCssUrls'));
});

test('that it knows if it should watch files for changes', t => {
    const Pod = new PodClass();

    process.argv.push('--watch');

    t.true(Pod.isWatching());
});

test('that it can dispatch events', t => {
    const Pod = new PodClass();

    const callback = sinon.spy();

    Pod.listen('some-event', callback);
    Pod.dispatch('some-event');

    t.true(callback.called);
});

test('that it can dispatch events using a function to determine the data', t => {
    const Pod = new PodClass();

    const callback = sinon.spy();

    Pod.listen('some-event', callback);
    Pod.dispatch('some-event', () => 'foo');

    t.true(callback.calledWith('foo'));
});

test('that it can see if we are using a Laravel app', async t => {
    const Pod = new PodClass();

    t.false(Pod.sees('laravel'));

    await fs(t).stub({
        './artisan': 'all laravel apps have one'
    });

    t.true(Pod.sees('laravel'));
});

test('that it can add a task', t => {
    const Pod = new PodClass();

    Pod.addTask(new Task({ foo: 'bar' }));

    t.is(1, Pod.tasks.length);
});

test('that it can fetch a registered component', t => {
    const Pod = new PodClass();
    const mix = Pod.api;

    let component = {
        register() {}
    };

    mix.extend('foo', component);

    // @ts-ignore - there's no way to do declaration merging with JSDoc afaik
    mix.foo();

    t.truthy(Pod.components.get('foo'));
    t.deepEqual(component, Pod.components.get('foo'));
});

test('that it can check for an installed npm package', t => {
    const Pod = new PodClass();

    t.false(Pod.seesNpmPackage('does-not-exist'));

    t.true(Pod.seesNpmPackage('webpack'));
});

test('that it listens for when the webpack configuration object has been fully generated', t => {
    const Pod = new PodClass();
    const mix = Pod.api;

    const spy = sinon.spy();

    mix.override(spy);

    Pod.dispatch('build');
    Pod.dispatch('configReadyForUser');

    t.true(spy.called);
});
