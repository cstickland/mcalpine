
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Archive = factory());
})(this, (function () { 'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function init_binding_group(group) {
        let _inputs;
        return {
            /* push */ p(...inputs) {
                _inputs = inputs;
                _inputs.forEach(input => group.push(input));
            },
            /* remove */ r() {
                _inputs.forEach(input => group.splice(group.indexOf(input), 1));
            }
        };
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                /** #7364  target for <template> may be provided as #document-fragment(11) */
                else
                    this.e = element((target.nodeType === 11 ? 'TEMPLATE' : target.nodeName));
                this.t = target.tagName !== 'TEMPLATE' ? target : target.content;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut, axis = 'y' } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const primary_property = axis === 'y' ? 'height' : 'width';
        const primary_property_value = parseFloat(style[primary_property]);
        const secondary_properties = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
        const capitalized_secondary_properties = secondary_properties.map((e) => `${e[0].toUpperCase()}${e.slice(1)}`);
        const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
        const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
        const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
        const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
        const border_width_start_value = parseFloat(style[`border${capitalized_secondary_properties[0]}Width`]);
        const border_width_end_value = parseFloat(style[`border${capitalized_secondary_properties[1]}Width`]);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `${primary_property}: ${t * primary_property_value}px;` +
                `padding-${secondary_properties[0]}: ${t * padding_start_value}px;` +
                `padding-${secondary_properties[1]}: ${t * padding_end_value}px;` +
                `margin-${secondary_properties[0]}: ${t * margin_start_value}px;` +
                `margin-${secondary_properties[1]}: ${t * margin_end_value}px;` +
                `border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;` +
                `border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
        };
    }

    /* src/ProductCard.svelte generated by Svelte v3.59.2 */
    const file$6 = "src/ProductCard.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (15:12) {#if product.skus.length == 1}
    function create_if_block_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SKU");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(15:12) {#if product.skus.length == 1}",
    		ctx
    	});

    	return block;
    }

    // (15:51) {#if product.skus.length > 1}
    function create_if_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SKUs");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(15:51) {#if product.skus.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (22:12) {#each product.skus as sku}
    function create_each_block$2(ctx) {
    	let span;
    	let t0_value = /*sku*/ ctx[5] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(span, file$6, 22, 16, 782);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*product*/ 1 && t0_value !== (t0_value = /*sku*/ ctx[5] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(22:12) {#each product.skus as sku}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div7;
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let raw0_value = /*product*/ ctx[0].title + "";
    	let t1;
    	let div1;
    	let t2_value = /*product*/ ctx[0].skus.length + "";
    	let t2;
    	let t3;
    	let if_block0_anchor;
    	let t4;
    	let a0;
    	let t5;
    	let a0_href_value;
    	let t6;
    	let div6;
    	let div3;
    	let t7;
    	let div4;
    	let raw1_value = /*product*/ ctx[0].title + "";
    	let t8;
    	let div5;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let t9;
    	let a1;
    	let t10;
    	let a1_href_value;
    	let div7_class_value;
    	let div7_intro;
    	let mounted;
    	let dispose;
    	let if_block0 = /*product*/ ctx[0].skus.length == 1 && create_if_block_1$4(ctx);
    	let if_block1 = /*product*/ ctx[0].skus.length > 1 && create_if_block$5(ctx);
    	let each_value = /*product*/ ctx[0].skus;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			a0 = element("a");
    			t5 = text(">");
    			t6 = space();
    			div6 = element("div");
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			div4 = element("div");
    			t8 = space();
    			div5 = element("div");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			t9 = space();
    			a1 = element("a");
    			t10 = text(">");
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[0].image_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$6, 10, 8, 278);
    			attr_dev(div0, "class", "product-title");
    			add_location(div0, file$6, 11, 8, 325);
    			attr_dev(div1, "class", "sku-count");
    			add_location(div1, file$6, 12, 8, 388);
    			attr_dev(a0, "class", "product-card-link");
    			attr_dev(a0, "href", a0_href_value = /*product*/ ctx[0].link);
    			add_location(a0, file$6, 17, 8, 592);
    			attr_dev(div2, "class", "product-block-image");
    			add_location(div2, file$6, 9, 4, 236);
    			attr_dev(div3, "class", "sku-list");
    			add_location(div3, file$6, 20, 8, 703);
    			attr_dev(div4, "class", "product-title");
    			add_location(div4, file$6, 28, 8, 888);
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(180 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$6, 30, 116, 1123);
    			attr_dev(path, "d", "M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z");
    			add_location(path, file$6, 30, 188, 1195);
    			attr_dev(g0, "data-name", "close");
    			add_location(g0, file$6, 30, 95, 1102);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$6, 30, 72, 1079);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$6, 30, 12, 1019);
    			attr_dev(div5, "class", "sku-close");
    			add_location(div5, file$6, 29, 8, 951);
    			attr_dev(a1, "class", "product-card-link");
    			attr_dev(a1, "href", a1_href_value = /*product*/ ctx[0].link);
    			add_location(a1, file$6, 32, 8, 1427);
    			attr_dev(div6, "class", "sku-list-container");
    			add_location(div6, file$6, 19, 4, 662);
    			attr_dev(div7, "class", div7_class_value = "product-card " + /*openClass*/ ctx[2]);
    			add_location(div7, file$6, 8, 0, 166);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div2);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			div0.innerHTML = raw0_value;
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, if_block0_anchor);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div2, t4);
    			append_dev(div2, a0);
    			append_dev(a0, t5);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div6, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div3, null);
    				}
    			}

    			append_dev(div6, t7);
    			append_dev(div6, div4);
    			div4.innerHTML = raw1_value;
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div5, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    			append_dev(div6, t9);
    			append_dev(div6, a1);
    			append_dev(a1, t10);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[3], false, false, false, false),
    					listen_dev(div5, "click", /*click_handler_1*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*product*/ 1 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[0].image_url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*product*/ 1 && raw0_value !== (raw0_value = /*product*/ ctx[0].title + "")) div0.innerHTML = raw0_value;			if (dirty & /*product*/ 1 && t2_value !== (t2_value = /*product*/ ctx[0].skus.length + "")) set_data_dev(t2, t2_value);

    			if (/*product*/ ctx[0].skus.length == 1) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					if_block0.m(div1, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*product*/ ctx[0].skus.length > 1) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*product*/ 1 && a0_href_value !== (a0_href_value = /*product*/ ctx[0].link)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*product*/ 1) {
    				each_value = /*product*/ ctx[0].skus;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*product*/ 1 && raw1_value !== (raw1_value = /*product*/ ctx[0].title + "")) div4.innerHTML = raw1_value;
    			if (dirty & /*product*/ 1 && a1_href_value !== (a1_href_value = /*product*/ ctx[0].link)) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if (dirty & /*openClass*/ 4 && div7_class_value !== (div7_class_value = "product-card " + /*openClass*/ ctx[2])) {
    				attr_dev(div7, "class", div7_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (!div7_intro) {
    				add_render_callback(() => {
    					div7_intro = create_in_transition(div7, fade, { duration: 300 });
    					div7_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let openClass;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductCard', slots, []);
    	let { product = [] } = $$props;
    	let open = false;
    	const writable_props = ['product'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductCard> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, open = true);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(1, open = false);
    	};

    	$$self.$$set = $$props => {
    		if ('product' in $$props) $$invalidate(0, product = $$props.product);
    	};

    	$$self.$capture_state = () => ({ product, fade, open, openClass });

    	$$self.$inject_state = $$props => {
    		if ('product' in $$props) $$invalidate(0, product = $$props.product);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    		if ('openClass' in $$props) $$invalidate(2, openClass = $$props.openClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 2) {
    			$$invalidate(2, openClass = open ? 'open' : 'closed');
    		}
    	};

    	return [product, open, openClass, click_handler, click_handler_1];
    }

    class ProductCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { product: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductCard",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get product() {
    		throw new Error("<ProductCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set product(value) {
    		throw new Error("<ProductCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Pagination.svelte generated by Svelte v3.59.2 */

    const file$5 = "src/Pagination.svelte";

    // (17:0) {:else}
    function create_else_block_1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Prev";
    			attr_dev(button, "class", "prev-next-button");
    			button.disabled = true;
    			add_location(button, file$5, 17, 4, 339);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(17:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:0) {#if currentPage > 1}
    function create_if_block_6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Prev";
    			attr_dev(button, "class", "prev-next-button");
    			add_location(button, file$5, 11, 4, 186);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(11:0) {#if currentPage > 1}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#if currentPage == totalPages && totalPages > 2}
    function create_if_block_5(ctx) {
    	let button;
    	let t_value = /*currentPage*/ ctx[0] - 2 + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$5, 22, 8, 498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPage*/ 1 && t_value !== (t_value = /*currentPage*/ ctx[0] - 2 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(22:4) {#if currentPage == totalPages && totalPages > 2}",
    		ctx
    	});

    	return block;
    }

    // (29:4) {#if currentPage > 1}
    function create_if_block_4$1(ctx) {
    	let button;
    	let t_value = /*currentPage*/ ctx[0] - 1 + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$5, 29, 8, 712);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPage*/ 1 && t_value !== (t_value = /*currentPage*/ ctx[0] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(29:4) {#if currentPage > 1}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {#if currentPage < totalPages}
    function create_if_block_3$1(ctx) {
    	let button;
    	let t_value = /*currentPage*/ ctx[0] + 1 + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$5, 39, 8, 1029);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPage*/ 1 && t_value !== (t_value = /*currentPage*/ ctx[0] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(39:4) {#if currentPage < totalPages}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if currentPage == 1 && totalPages > 2}
    function create_if_block_2$1(ctx) {
    	let button;
    	let t_value = /*currentPage*/ ctx[0] + 2 + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$5, 45, 8, 1247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPage*/ 1 && t_value !== (t_value = /*currentPage*/ ctx[0] + 2 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(45:4) {#if currentPage == 1 && totalPages > 2}",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#if currentPage < totalPages - 1 && totalPages > 3}
    function create_if_block_1$3(ctx) {
    	let div;
    	let span;
    	let t1;
    	let button;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "...";
    			t1 = space();
    			button = element("button");
    			t2 = text(/*totalPages*/ ctx[1]);
    			add_location(span, file$5, 53, 47, 1532);
    			attr_dev(div, "class", "pagination-seperator-dots");
    			add_location(div, file$5, 53, 8, 1493);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$5, 54, 8, 1563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_5*/ ctx[8], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*totalPages*/ 2) set_data_dev(t2, /*totalPages*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(53:4) {#if currentPage < totalPages - 1 && totalPages > 3}",
    		ctx
    	});

    	return block;
    }

    // (73:0) {:else}
    function create_else_block$2(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(button, "class", "prev-next-button");
    			button.disabled = true;
    			add_location(button, file$5, 73, 4, 1945);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(73:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (65:0) {#if currentPage < totalPages}
    function create_if_block$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(button, "class", "prev-next-button");
    			add_location(button, file$5, 65, 4, 1778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[9], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(65:0) {#if currentPage < totalPages}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let t0;
    	let div;
    	let t1;
    	let t2;
    	let button;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let if_block6_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*currentPage*/ ctx[0] > 1) return create_if_block_6;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*currentPage*/ ctx[0] == /*totalPages*/ ctx[1] && /*totalPages*/ ctx[1] > 2 && create_if_block_5(ctx);
    	let if_block2 = /*currentPage*/ ctx[0] > 1 && create_if_block_4$1(ctx);
    	let if_block3 = /*currentPage*/ ctx[0] < /*totalPages*/ ctx[1] && create_if_block_3$1(ctx);
    	let if_block4 = /*currentPage*/ ctx[0] == 1 && /*totalPages*/ ctx[1] > 2 && create_if_block_2$1(ctx);
    	let if_block5 = /*currentPage*/ ctx[0] < /*totalPages*/ ctx[1] - 1 && /*totalPages*/ ctx[1] > 3 && create_if_block_1$3(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*currentPage*/ ctx[0] < /*totalPages*/ ctx[1]) return create_if_block$4;
    		return create_else_block$2;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block6 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t0 = space();
    			div = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			button = element("button");
    			t3 = text(/*currentPage*/ ctx[0]);
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			if_block6.c();
    			if_block6_anchor = empty();
    			attr_dev(button, "class", "pagination-button pagination-button__current");
    			add_location(button, file$5, 36, 4, 897);
    			attr_dev(div, "class", "page-number-buttons");
    			add_location(div, file$5, 20, 0, 402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			append_dev(div, button);
    			append_dev(button, t3);
    			append_dev(div, t4);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t5);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t6);
    			if (if_block5) if_block5.m(div, null);
    			insert_dev(target, t7, anchor);
    			if_block6.m(target, anchor);
    			insert_dev(target, if_block6_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			}

    			if (/*currentPage*/ ctx[0] == /*totalPages*/ ctx[1] && /*totalPages*/ ctx[1] > 2) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*currentPage*/ ctx[0] > 1) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_4$1(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*currentPage*/ 1) set_data_dev(t3, /*currentPage*/ ctx[0]);

    			if (/*currentPage*/ ctx[0] < /*totalPages*/ ctx[1]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_3$1(ctx);
    					if_block3.c();
    					if_block3.m(div, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*currentPage*/ ctx[0] == 1 && /*totalPages*/ ctx[1] > 2) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2$1(ctx);
    					if_block4.c();
    					if_block4.m(div, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*currentPage*/ ctx[0] < /*totalPages*/ ctx[1] - 1 && /*totalPages*/ ctx[1] > 3) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_1$3(ctx);
    					if_block5.c();
    					if_block5.m(div, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block6) {
    				if_block6.p(ctx, dirty);
    			} else {
    				if_block6.d(1);
    				if_block6 = current_block_type_1(ctx);

    				if (if_block6) {
    					if_block6.c();
    					if_block6.m(if_block6_anchor.parentNode, if_block6_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (detaching) detach_dev(t7);
    			if_block6.d(detaching);
    			if (detaching) detach_dev(if_block6_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pagination', slots, []);
    	let { currentPage } = $$props;
    	let { totalPages } = $$props;

    	function setCurrentcurrentPage(newPage) {
    		$$invalidate(0, currentPage = newPage);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (currentPage === undefined && !('currentPage' in $$props || $$self.$$.bound[$$self.$$.props['currentPage']])) {
    			console.warn("<Pagination> was created without expected prop 'currentPage'");
    		}

    		if (totalPages === undefined && !('totalPages' in $$props || $$self.$$.bound[$$self.$$.props['totalPages']])) {
    			console.warn("<Pagination> was created without expected prop 'totalPages'");
    		}
    	});

    	const writable_props = ['currentPage', 'totalPages'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pagination> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		setCurrentcurrentPage(currentPage - 1);
    	};

    	const click_handler_1 = () => {
    		setCurrentcurrentPage(currentPage - 2);
    	};

    	const click_handler_2 = () => {
    		setCurrentcurrentPage(currentPage - 1);
    	};

    	const click_handler_3 = () => {
    		setCurrentcurrentPage(currentPage + 1);
    	};

    	const click_handler_4 = () => {
    		setCurrentcurrentPage(currentPage + 2);
    	};

    	const click_handler_5 = () => {
    		setCurrentcurrentPage(totalPages);
    	};

    	const click_handler_6 = () => {
    		setCurrentcurrentPage(currentPage + 1);
    	};

    	$$self.$$set = $$props => {
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('totalPages' in $$props) $$invalidate(1, totalPages = $$props.totalPages);
    	};

    	$$self.$capture_state = () => ({
    		currentPage,
    		totalPages,
    		setCurrentcurrentPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('totalPages' in $$props) $$invalidate(1, totalPages = $$props.totalPages);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentPage,
    		totalPages,
    		setCurrentcurrentPage,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { currentPage: 0, totalPages: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get currentPage() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalPages() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalPages(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/CardsPerPage.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/CardsPerPage.svelte";

    function create_fragment$4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", "144");
    			add_location(input, file$4, 5, 0, 51);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*postsPerPage*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*postsPerPage*/ 1 && to_number(input.value) !== /*postsPerPage*/ ctx[0]) {
    				set_input_value(input, /*postsPerPage*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardsPerPage', slots, []);
    	let { postsPerPage = 12 } = $$props;
    	const writable_props = ['postsPerPage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardsPerPage> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		postsPerPage = to_number(this.value);
    		$$invalidate(0, postsPerPage);
    	}

    	$$self.$$set = $$props => {
    		if ('postsPerPage' in $$props) $$invalidate(0, postsPerPage = $$props.postsPerPage);
    	};

    	$$self.$capture_state = () => ({ postsPerPage });

    	$$self.$inject_state = $$props => {
    		if ('postsPerPage' in $$props) $$invalidate(0, postsPerPage = $$props.postsPerPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [postsPerPage, input_input_handler];
    }

    class CardsPerPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { postsPerPage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardsPerPage",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get postsPerPage() {
    		throw new Error("<CardsPerPage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set postsPerPage(value) {
    		throw new Error("<CardsPerPage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/GridToggleButtons.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/GridToggleButtons.svelte";

    // (15:0) {:else}
    function create_else_block$1(ctx) {
    	let button0;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let t7;
    	let div8;
    	let t8;
    	let button1;
    	let div9;
    	let t9;
    	let div10;
    	let t10;
    	let div11;
    	let t11;
    	let div12;
    	let t12;
    	let div13;
    	let t13;
    	let div14;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			t8 = space();
    			button1 = element("button");
    			div9 = element("div");
    			t9 = space();
    			div10 = element("div");
    			t10 = space();
    			div11 = element("div");
    			t11 = space();
    			div12 = element("div");
    			t12 = space();
    			div13 = element("div");
    			t13 = space();
    			div14 = element("div");
    			attr_dev(div0, "class", "square");
    			add_location(div0, file$3, 17, 4, 395);
    			attr_dev(div1, "class", "square");
    			add_location(div1, file$3, 18, 4, 422);
    			attr_dev(div2, "class", "square");
    			add_location(div2, file$3, 19, 4, 449);
    			attr_dev(div3, "class", "square");
    			add_location(div3, file$3, 20, 4, 476);
    			attr_dev(div4, "class", "square");
    			add_location(div4, file$3, 21, 4, 503);
    			attr_dev(div5, "class", "square");
    			add_location(div5, file$3, 22, 4, 530);
    			attr_dev(div6, "class", "square");
    			add_location(div6, file$3, 23, 4, 557);
    			attr_dev(div7, "class", "square");
    			add_location(div7, file$3, 24, 4, 584);
    			attr_dev(div8, "class", "square");
    			add_location(div8, file$3, 25, 4, 611);
    			attr_dev(button0, "class", "layout-button grid-layout-button");
    			add_location(button0, file$3, 15, 0, 304);
    			attr_dev(div9, "class", "square");
    			add_location(div9, file$3, 28, 4, 734);
    			attr_dev(div10, "class", "square");
    			add_location(div10, file$3, 29, 4, 761);
    			attr_dev(div11, "class", "square");
    			add_location(div11, file$3, 30, 4, 788);
    			attr_dev(div12, "class", "square");
    			add_location(div12, file$3, 31, 4, 815);
    			attr_dev(div13, "class", "square");
    			add_location(div13, file$3, 32, 4, 842);
    			attr_dev(div14, "class", "square");
    			add_location(div14, file$3, 33, 4, 869);
    			attr_dev(button1, "class", "layout-button row-layout-button");
    			add_location(button1, file$3, 27, 0, 644);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, div0);
    			append_dev(button0, t0);
    			append_dev(button0, div1);
    			append_dev(button0, t1);
    			append_dev(button0, div2);
    			append_dev(button0, t2);
    			append_dev(button0, div3);
    			append_dev(button0, t3);
    			append_dev(button0, div4);
    			append_dev(button0, t4);
    			append_dev(button0, div5);
    			append_dev(button0, t5);
    			append_dev(button0, div6);
    			append_dev(button0, t6);
    			append_dev(button0, div7);
    			append_dev(button0, t7);
    			append_dev(button0, div8);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, div9);
    			append_dev(button1, t9);
    			append_dev(button1, div10);
    			append_dev(button1, t10);
    			append_dev(button1, div11);
    			append_dev(button1, t11);
    			append_dev(button1, div12);
    			append_dev(button1, t12);
    			append_dev(button1, div13);
    			append_dev(button1, t13);
    			append_dev(button1, div14);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[4], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(15:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#if innerWidth < 650}
    function create_if_block$3(ctx) {
    	let button;
    	let div0;
    	let t;
    	let div1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "square");
    			add_location(div0, file$3, 11, 4, 236);
    			attr_dev(div1, "class", "square");
    			add_location(div1, file$3, 12, 4, 263);
    			attr_dev(button, "class", "layout-button grid-layout-button-mobile");
    			add_location(button, file$3, 9, 0, 132);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div0);
    			append_dev(button, t);
    			append_dev(button, div1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(9:0) {#if innerWidth < 650}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[2]);

    	function select_block_type(ctx, dirty) {
    		if (/*innerWidth*/ ctx[1] < 650) return create_if_block$3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GridToggleButtons', slots, []);
    	let { gridStyle } = $$props;
    	let innerWidth;

    	$$self.$$.on_mount.push(function () {
    		if (gridStyle === undefined && !('gridStyle' in $$props || $$self.$$.bound[$$self.$$.props['gridStyle']])) {
    			console.warn("<GridToggleButtons> was created without expected prop 'gridStyle'");
    		}
    	});

    	const writable_props = ['gridStyle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GridToggleButtons> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, innerWidth = window.innerWidth);
    	}

    	const click_handler = () => $$invalidate(0, gridStyle = !gridStyle);
    	const click_handler_1 = () => $$invalidate(0, gridStyle = true);
    	const click_handler_2 = () => $$invalidate(0, gridStyle = false);

    	$$self.$$set = $$props => {
    		if ('gridStyle' in $$props) $$invalidate(0, gridStyle = $$props.gridStyle);
    	};

    	$$self.$capture_state = () => ({ gridStyle, innerWidth });

    	$$self.$inject_state = $$props => {
    		if ('gridStyle' in $$props) $$invalidate(0, gridStyle = $$props.gridStyle);
    		if ('innerWidth' in $$props) $$invalidate(1, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		gridStyle,
    		innerWidth,
    		onwindowresize,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class GridToggleButtons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { gridStyle: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GridToggleButtons",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get gridStyle() {
    		throw new Error("<GridToggleButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridStyle(value) {
    		throw new Error("<GridToggleButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FilterSection.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/FilterSection.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (33:7) {:else}
    function create_else_block(ctx) {
    	let span;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			span = element("span");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$2, 37, 28, 1253);
    			attr_dev(path, "d", "M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z");
    			add_location(path, file$2, 38, 28, 1324);
    			attr_dev(g0, "data-name", "chevron-down");
    			add_location(g0, file$2, 36, 24, 1196);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$2, 35, 20, 1148);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$2, 34, 16, 1067);
    			add_location(span, file$2, 33, 12, 1044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(33:7) {:else}",
    		ctx
    	});

    	return block;
    }

    // (30:8) {#if openCategory}
    function create_if_block_1$2(ctx) {
    	let span;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			span = element("span");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(180 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$2, 30, 127, 769);
    			attr_dev(path, "d", "M16 14.5a1 1 0 0 1-.71-.29L12 10.9l-3.3 3.18a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42l4-3.86a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.42 1 1 0 0 1-.69.28z");
    			add_location(path, file$2, 30, 199, 841);
    			attr_dev(g0, "data-name", "chevron-up");
    			add_location(g0, file$2, 30, 101, 743);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$2, 30, 78, 720);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$2, 30, 18, 660);
    			add_location(span, file$2, 30, 12, 654);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(30:8) {#if openCategory}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if openCategory}
    function create_if_block$2(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let each_value = /*categories*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(div, file$2, 46, 4, 1603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories, filters*/ 3) {
    				each_value = /*categories*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { axis: "y", duration: 300 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { axis: "y", duration: 300 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(46:4) {#if openCategory}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#each categories as category}
    function create_each_block$1(ctx) {
    	let li;
    	let input;
    	let input_name_value;
    	let input_value_value;
    	let value_has_changed = false;
    	let t0;
    	let html_tag;
    	let raw_value = /*category*/ ctx[10].name + "";
    	let t1;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[9][0]);

    	const block = {
    		c: function create() {
    			li = element("li");
    			input = element("input");
    			t0 = space();
    			html_tag = new HtmlTag(false);
    			t1 = space();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", input_name_value = /*category*/ ctx[10].name);
    			input.__value = input_value_value = /*category*/ ctx[10].id;
    			input.value = input.__value;
    			add_location(input, file$2, 49, 16, 1727);
    			html_tag.a = t1;
    			add_location(li, file$2, 48, 12, 1706);
    			binding_group.p(input);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, input);
    			input.checked = ~(/*filters*/ ctx[0] || []).indexOf(input.__value);
    			append_dev(li, t0);
    			html_tag.m(raw_value, li);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories*/ 2 && input_name_value !== (input_name_value = /*category*/ ctx[10].name)) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (dirty & /*categories*/ 2 && input_value_value !== (input_value_value = /*category*/ ctx[10].id)) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    				value_has_changed = true;
    			}

    			if (value_has_changed || dirty & /*filters, categories*/ 3) {
    				input.checked = ~(/*filters*/ ctx[0] || []).indexOf(input.__value);
    			}

    			if (dirty & /*categories*/ 2 && raw_value !== (raw_value = /*category*/ ctx[10].name + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			binding_group.r();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(48:8) {#each categories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let ul;
    	let button;
    	let h4;
    	let t0;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*openCategory*/ ctx[3]) return create_if_block_1$2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*openCategory*/ ctx[3] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			button = element("button");
    			h4 = element("h4");
    			t0 = text(/*title*/ ctx[2]);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			add_location(h4, file$2, 28, 8, 598);
    			attr_dev(button, "class", "filter-category-title");
    			add_location(button, file$2, 22, 4, 459);
    			attr_dev(ul, "class", "product-archive-filters-section");
    			add_location(ul, file$2, 21, 0, 410);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, button);
    			append_dev(button, h4);
    			append_dev(h4, t0);
    			append_dev(button, t1);
    			if_block0.m(button, null);
    			append_dev(ul, t2);
    			if (if_block1) if_block1.m(ul, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 4) set_data_dev(t0, /*title*/ ctx[2]);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button, null);
    				}
    			}

    			if (/*openCategory*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*openCategory*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(ul, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FilterSection', slots, []);
    	let { categories = [] } = $$props;
    	let { filters = [] } = $$props;
    	let { title = "title" } = $$props;
    	let { currentPage } = $$props;
    	let { isParent } = $$props;
    	let { childFilters } = $$props;
    	let openCategory = false;

    	$$self.$$.on_mount.push(function () {
    		if (currentPage === undefined && !('currentPage' in $$props || $$self.$$.bound[$$self.$$.props['currentPage']])) {
    			console.warn("<FilterSection> was created without expected prop 'currentPage'");
    		}

    		if (isParent === undefined && !('isParent' in $$props || $$self.$$.bound[$$self.$$.props['isParent']])) {
    			console.warn("<FilterSection> was created without expected prop 'isParent'");
    		}

    		if (childFilters === undefined && !('childFilters' in $$props || $$self.$$.bound[$$self.$$.props['childFilters']])) {
    			console.warn("<FilterSection> was created without expected prop 'childFilters'");
    		}
    	});

    	const writable_props = ['categories', 'filters', 'title', 'currentPage', 'isParent', 'childFilters'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FilterSection> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	const click_handler = () => {
    		$$invalidate(3, openCategory = !openCategory);
    	};

    	function input_change_handler() {
    		filters = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(0, filters);
    	}

    	$$self.$$set = $$props => {
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    		if ('filters' in $$props) $$invalidate(0, filters = $$props.filters);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('currentPage' in $$props) $$invalidate(4, currentPage = $$props.currentPage);
    		if ('isParent' in $$props) $$invalidate(6, isParent = $$props.isParent);
    		if ('childFilters' in $$props) $$invalidate(5, childFilters = $$props.childFilters);
    	};

    	$$self.$capture_state = () => ({
    		slide,
    		categories,
    		filters,
    		title,
    		currentPage,
    		isParent,
    		childFilters,
    		openCategory
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    		if ('filters' in $$props) $$invalidate(0, filters = $$props.filters);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('currentPage' in $$props) $$invalidate(4, currentPage = $$props.currentPage);
    		if ('isParent' in $$props) $$invalidate(6, isParent = $$props.isParent);
    		if ('childFilters' in $$props) $$invalidate(5, childFilters = $$props.childFilters);
    		if ('openCategory' in $$props) $$invalidate(3, openCategory = $$props.openCategory);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*filters*/ 1) {
    			if (filters.length) {
    				$$invalidate(4, currentPage = 1);
    			}
    		}

    		if ($$self.$$.dirty & /*isParent, filters*/ 65) {
    			if (isParent && filters.length) {
    				$$invalidate(5, childFilters = []);
    			}
    		}
    	};

    	return [
    		filters,
    		categories,
    		title,
    		openCategory,
    		currentPage,
    		childFilters,
    		isParent,
    		click_handler,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class FilterSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			categories: 1,
    			filters: 0,
    			title: 2,
    			currentPage: 4,
    			isParent: 6,
    			childFilters: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FilterSection",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get categories() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filters() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filters(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPage() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isParent() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isParent(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get childFilters() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set childFilters(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Filters.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/Filters.svelte";

    // (33:4) {#if parentFilters.length == 0}
    function create_if_block_1$1(ctx) {
    	let filtersection;
    	let updating_filters;
    	let updating_currentPage;
    	let current;

    	function filtersection_filters_binding_1(value) {
    		/*filtersection_filters_binding_1*/ ctx[9](value);
    	}

    	function filtersection_currentPage_binding_1(value) {
    		/*filtersection_currentPage_binding_1*/ ctx[10](value);
    	}

    	let filtersection_props = {
    		title: "Subcategory",
    		categories: /*childCategories*/ ctx[5],
    		isParent: false
    	};

    	if (/*childFilters*/ ctx[2] !== void 0) {
    		filtersection_props.filters = /*childFilters*/ ctx[2];
    	}

    	if (/*currentPage*/ ctx[3] !== void 0) {
    		filtersection_props.currentPage = /*currentPage*/ ctx[3];
    	}

    	filtersection = new FilterSection({
    			props: filtersection_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(filtersection, 'filters', filtersection_filters_binding_1));
    	binding_callbacks.push(() => bind(filtersection, 'currentPage', filtersection_currentPage_binding_1));

    	const block = {
    		c: function create() {
    			create_component(filtersection.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filtersection, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filtersection_changes = {};
    			if (dirty & /*childCategories*/ 32) filtersection_changes.categories = /*childCategories*/ ctx[5];

    			if (!updating_filters && dirty & /*childFilters*/ 4) {
    				updating_filters = true;
    				filtersection_changes.filters = /*childFilters*/ ctx[2];
    				add_flush_callback(() => updating_filters = false);
    			}

    			if (!updating_currentPage && dirty & /*currentPage*/ 8) {
    				updating_currentPage = true;
    				filtersection_changes.currentPage = /*currentPage*/ ctx[3];
    				add_flush_callback(() => updating_currentPage = false);
    			}

    			filtersection.$set(filtersection_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filtersection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filtersection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filtersection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(33:4) {#if parentFilters.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#if parentFilters.length > 0}
    function create_if_block$1(ctx) {
    	let filtersection;
    	let updating_filters;
    	let updating_currentPage;
    	let current;

    	function filtersection_filters_binding_2(value) {
    		/*filtersection_filters_binding_2*/ ctx[11](value);
    	}

    	function filtersection_currentPage_binding_2(value) {
    		/*filtersection_currentPage_binding_2*/ ctx[12](value);
    	}

    	let filtersection_props = {
    		title: "Subcategory",
    		categories: /*currentChildCategories*/ ctx[1],
    		isParent: false
    	};

    	if (/*childFilters*/ ctx[2] !== void 0) {
    		filtersection_props.filters = /*childFilters*/ ctx[2];
    	}

    	if (/*currentPage*/ ctx[3] !== void 0) {
    		filtersection_props.currentPage = /*currentPage*/ ctx[3];
    	}

    	filtersection = new FilterSection({
    			props: filtersection_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(filtersection, 'filters', filtersection_filters_binding_2));
    	binding_callbacks.push(() => bind(filtersection, 'currentPage', filtersection_currentPage_binding_2));

    	const block = {
    		c: function create() {
    			create_component(filtersection.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filtersection, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filtersection_changes = {};
    			if (dirty & /*currentChildCategories*/ 2) filtersection_changes.categories = /*currentChildCategories*/ ctx[1];

    			if (!updating_filters && dirty & /*childFilters*/ 4) {
    				updating_filters = true;
    				filtersection_changes.filters = /*childFilters*/ ctx[2];
    				add_flush_callback(() => updating_filters = false);
    			}

    			if (!updating_currentPage && dirty & /*currentPage*/ 8) {
    				updating_currentPage = true;
    				filtersection_changes.currentPage = /*currentPage*/ ctx[3];
    				add_flush_callback(() => updating_currentPage = false);
    			}

    			filtersection.$set(filtersection_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filtersection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filtersection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filtersection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(42:4) {#if parentFilters.length > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let filtersection;
    	let updating_filters;
    	let updating_currentPage;
    	let updating_childFilters;
    	let t0;
    	let t1;
    	let div_intro;
    	let div_outro;
    	let current;

    	function filtersection_filters_binding(value) {
    		/*filtersection_filters_binding*/ ctx[6](value);
    	}

    	function filtersection_currentPage_binding(value) {
    		/*filtersection_currentPage_binding*/ ctx[7](value);
    	}

    	function filtersection_childFilters_binding(value) {
    		/*filtersection_childFilters_binding*/ ctx[8](value);
    	}

    	let filtersection_props = {
    		title: "Category",
    		categories: /*parentCategories*/ ctx[4],
    		isParent: true
    	};

    	if (/*parentFilters*/ ctx[0] !== void 0) {
    		filtersection_props.filters = /*parentFilters*/ ctx[0];
    	}

    	if (/*currentPage*/ ctx[3] !== void 0) {
    		filtersection_props.currentPage = /*currentPage*/ ctx[3];
    	}

    	if (/*childFilters*/ ctx[2] !== void 0) {
    		filtersection_props.childFilters = /*childFilters*/ ctx[2];
    	}

    	filtersection = new FilterSection({
    			props: filtersection_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(filtersection, 'filters', filtersection_filters_binding));
    	binding_callbacks.push(() => bind(filtersection, 'currentPage', filtersection_currentPage_binding));
    	binding_callbacks.push(() => bind(filtersection, 'childFilters', filtersection_childFilters_binding));
    	let if_block0 = /*parentFilters*/ ctx[0].length == 0 && create_if_block_1$1(ctx);
    	let if_block1 = /*parentFilters*/ ctx[0].length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(filtersection.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "product-archive-filters");
    			add_location(div, file$1, 23, 0, 631);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(filtersection, div, null);
    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const filtersection_changes = {};
    			if (dirty & /*parentCategories*/ 16) filtersection_changes.categories = /*parentCategories*/ ctx[4];

    			if (!updating_filters && dirty & /*parentFilters*/ 1) {
    				updating_filters = true;
    				filtersection_changes.filters = /*parentFilters*/ ctx[0];
    				add_flush_callback(() => updating_filters = false);
    			}

    			if (!updating_currentPage && dirty & /*currentPage*/ 8) {
    				updating_currentPage = true;
    				filtersection_changes.currentPage = /*currentPage*/ ctx[3];
    				add_flush_callback(() => updating_currentPage = false);
    			}

    			if (!updating_childFilters && dirty & /*childFilters*/ 4) {
    				updating_childFilters = true;
    				filtersection_changes.childFilters = /*childFilters*/ ctx[2];
    				add_flush_callback(() => updating_childFilters = false);
    			}

    			filtersection.$set(filtersection_changes);

    			if (/*parentFilters*/ ctx[0].length == 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*parentFilters*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*parentFilters*/ ctx[0].length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*parentFilters*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filtersection.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fade, { duration: 300 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filtersection.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 300 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(filtersection);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filters', slots, []);
    	let { parentCategories = [] } = $$props;
    	let { childCategories = [] } = $$props;
    	let { childFilters = [] } = $$props;
    	let { parentFilters = [] } = $$props;
    	let { currentPage } = $$props;
    	let { currentChildCategories = [] } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (currentPage === undefined && !('currentPage' in $$props || $$self.$$.bound[$$self.$$.props['currentPage']])) {
    			console.warn("<Filters> was created without expected prop 'currentPage'");
    		}
    	});

    	const writable_props = [
    		'parentCategories',
    		'childCategories',
    		'childFilters',
    		'parentFilters',
    		'currentPage',
    		'currentChildCategories'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filters> was created with unknown prop '${key}'`);
    	});

    	function filtersection_filters_binding(value) {
    		parentFilters = value;
    		$$invalidate(0, parentFilters);
    	}

    	function filtersection_currentPage_binding(value) {
    		currentPage = value;
    		$$invalidate(3, currentPage);
    	}

    	function filtersection_childFilters_binding(value) {
    		childFilters = value;
    		$$invalidate(2, childFilters);
    	}

    	function filtersection_filters_binding_1(value) {
    		childFilters = value;
    		$$invalidate(2, childFilters);
    	}

    	function filtersection_currentPage_binding_1(value) {
    		currentPage = value;
    		$$invalidate(3, currentPage);
    	}

    	function filtersection_filters_binding_2(value) {
    		childFilters = value;
    		$$invalidate(2, childFilters);
    	}

    	function filtersection_currentPage_binding_2(value) {
    		currentPage = value;
    		$$invalidate(3, currentPage);
    	}

    	$$self.$$set = $$props => {
    		if ('parentCategories' in $$props) $$invalidate(4, parentCategories = $$props.parentCategories);
    		if ('childCategories' in $$props) $$invalidate(5, childCategories = $$props.childCategories);
    		if ('childFilters' in $$props) $$invalidate(2, childFilters = $$props.childFilters);
    		if ('parentFilters' in $$props) $$invalidate(0, parentFilters = $$props.parentFilters);
    		if ('currentPage' in $$props) $$invalidate(3, currentPage = $$props.currentPage);
    		if ('currentChildCategories' in $$props) $$invalidate(1, currentChildCategories = $$props.currentChildCategories);
    	};

    	$$self.$capture_state = () => ({
    		FilterSection,
    		fade,
    		parentCategories,
    		childCategories,
    		childFilters,
    		parentFilters,
    		currentPage,
    		currentChildCategories
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentCategories' in $$props) $$invalidate(4, parentCategories = $$props.parentCategories);
    		if ('childCategories' in $$props) $$invalidate(5, childCategories = $$props.childCategories);
    		if ('childFilters' in $$props) $$invalidate(2, childFilters = $$props.childFilters);
    		if ('parentFilters' in $$props) $$invalidate(0, parentFilters = $$props.parentFilters);
    		if ('currentPage' in $$props) $$invalidate(3, currentPage = $$props.currentPage);
    		if ('currentChildCategories' in $$props) $$invalidate(1, currentChildCategories = $$props.currentChildCategories);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentFilters, childCategories, currentChildCategories*/ 35) {
    			if (parentFilters.length > 0) {
    				$$invalidate(1, currentChildCategories = []);

    				childCategories.forEach(category => {
    					if (parentFilters.find(id => id == category.parent)) {
    						currentChildCategories.push(category);
    					}
    				});
    			}
    		}
    	};

    	return [
    		parentFilters,
    		currentChildCategories,
    		childFilters,
    		currentPage,
    		parentCategories,
    		childCategories,
    		filtersection_filters_binding,
    		filtersection_currentPage_binding,
    		filtersection_childFilters_binding,
    		filtersection_filters_binding_1,
    		filtersection_currentPage_binding_1,
    		filtersection_filters_binding_2,
    		filtersection_currentPage_binding_2
    	];
    }

    class Filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			parentCategories: 4,
    			childCategories: 5,
    			childFilters: 2,
    			parentFilters: 0,
    			currentPage: 3,
    			currentChildCategories: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filters",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get parentCategories() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentCategories(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get childCategories() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set childCategories(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get childFilters() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set childFilters(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parentFilters() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentFilters(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPage() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentChildCategories() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentChildCategories(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    // (57:4) {#if showFilters}
    function create_if_block_3(ctx) {
    	let button;
    	let div9;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div5;
    	let div3;
    	let t2;
    	let div4;
    	let t3;
    	let div8;
    	let div6;
    	let t4;
    	let div7;
    	let t5;
    	let t6;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*openFilters*/ ctx[11] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			div9 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t2 = space();
    			div4 = element("div");
    			t3 = space();
    			div8 = element("div");
    			div6 = element("div");
    			t4 = space();
    			div7 = element("div");
    			t5 = text("\n        Filters");
    			t6 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div0, "class", "filter-line-black");
    			add_location(div0, file, 60, 16, 1836);
    			attr_dev(div1, "class", "filter-line-red");
    			add_location(div1, file, 61, 16, 1890);
    			attr_dev(div2, "class", "filter-line line-one");
    			add_location(div2, file, 59, 12, 1785);
    			attr_dev(div3, "class", "filter-line-black");
    			add_location(div3, file, 64, 16, 2008);
    			attr_dev(div4, "class", "filter-line-red");
    			add_location(div4, file, 65, 16, 2062);
    			attr_dev(div5, "class", "filter-line line-two");
    			add_location(div5, file, 63, 12, 1957);
    			attr_dev(div6, "class", "filter-line-black");
    			add_location(div6, file, 68, 16, 2182);
    			attr_dev(div7, "class", "filter-line-red");
    			add_location(div7, file, 69, 16, 2236);
    			attr_dev(div8, "class", "filter-line line-three");
    			add_location(div8, file, 67, 12, 2129);
    			attr_dev(div9, "class", "filters-icon");
    			add_location(div9, file, 58, 8, 1746);
    			attr_dev(button, "class", "filters-heading");
    			add_location(button, file, 57, 4, 1659);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div9);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div9, t1);
    			append_dev(div9, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div9, t3);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div8, t4);
    			append_dev(div8, div7);
    			append_dev(button, t5);
    			insert_dev(target, t6, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[17], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*openFilters*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*openFilters*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t6);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(57:4) {#if showFilters}",
    		ctx
    	});

    	return block;
    }

    // (75:4) {#if openFilters}
    function create_if_block_4(ctx) {
    	let filters;
    	let updating_childCategories;
    	let updating_parentCategories;
    	let updating_parentFilters;
    	let updating_childFilters;
    	let updating_currentPage;
    	let current;

    	function filters_childCategories_binding(value) {
    		/*filters_childCategories_binding*/ ctx[18](value);
    	}

    	function filters_parentCategories_binding(value) {
    		/*filters_parentCategories_binding*/ ctx[19](value);
    	}

    	function filters_parentFilters_binding(value) {
    		/*filters_parentFilters_binding*/ ctx[20](value);
    	}

    	function filters_childFilters_binding(value) {
    		/*filters_childFilters_binding*/ ctx[21](value);
    	}

    	function filters_currentPage_binding(value) {
    		/*filters_currentPage_binding*/ ctx[22](value);
    	}

    	let filters_props = {};

    	if (/*childCategories*/ ctx[0] !== void 0) {
    		filters_props.childCategories = /*childCategories*/ ctx[0];
    	}

    	if (/*parentCategories*/ ctx[1] !== void 0) {
    		filters_props.parentCategories = /*parentCategories*/ ctx[1];
    	}

    	if (/*parentFilters*/ ctx[5] !== void 0) {
    		filters_props.parentFilters = /*parentFilters*/ ctx[5];
    	}

    	if (/*childFilters*/ ctx[6] !== void 0) {
    		filters_props.childFilters = /*childFilters*/ ctx[6];
    	}

    	if (/*currentPage*/ ctx[3] !== void 0) {
    		filters_props.currentPage = /*currentPage*/ ctx[3];
    	}

    	filters = new Filters({ props: filters_props, $$inline: true });
    	binding_callbacks.push(() => bind(filters, 'childCategories', filters_childCategories_binding));
    	binding_callbacks.push(() => bind(filters, 'parentCategories', filters_parentCategories_binding));
    	binding_callbacks.push(() => bind(filters, 'parentFilters', filters_parentFilters_binding));
    	binding_callbacks.push(() => bind(filters, 'childFilters', filters_childFilters_binding));
    	binding_callbacks.push(() => bind(filters, 'currentPage', filters_currentPage_binding));

    	const block = {
    		c: function create() {
    			create_component(filters.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filters, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filters_changes = {};

    			if (!updating_childCategories && dirty & /*childCategories*/ 1) {
    				updating_childCategories = true;
    				filters_changes.childCategories = /*childCategories*/ ctx[0];
    				add_flush_callback(() => updating_childCategories = false);
    			}

    			if (!updating_parentCategories && dirty & /*parentCategories*/ 2) {
    				updating_parentCategories = true;
    				filters_changes.parentCategories = /*parentCategories*/ ctx[1];
    				add_flush_callback(() => updating_parentCategories = false);
    			}

    			if (!updating_parentFilters && dirty & /*parentFilters*/ 32) {
    				updating_parentFilters = true;
    				filters_changes.parentFilters = /*parentFilters*/ ctx[5];
    				add_flush_callback(() => updating_parentFilters = false);
    			}

    			if (!updating_childFilters && dirty & /*childFilters*/ 64) {
    				updating_childFilters = true;
    				filters_changes.childFilters = /*childFilters*/ ctx[6];
    				add_flush_callback(() => updating_childFilters = false);
    			}

    			if (!updating_currentPage && dirty & /*currentPage*/ 8) {
    				updating_currentPage = true;
    				filters_changes.currentPage = /*currentPage*/ ctx[3];
    				add_flush_callback(() => updating_currentPage = false);
    			}

    			filters.$set(filters_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filters.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filters.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filters, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(75:4) {#if openFilters}",
    		ctx
    	});

    	return block;
    }

    // (85:8) {#if parentFilters.length > 0 || childFilters.length > 0}
    function create_if_block_2(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*totalProducts*/ ctx[9]);
    			t1 = text(" Results matching your selection.\n                ");
    			button = element("button");
    			button.textContent = "x";
    			add_location(button, file, 87, 16, 2768);
    			attr_dev(div, "class", "product-archive-total-results");
    			add_location(div, file, 85, 12, 2643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*resetFilters*/ ctx[15], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*totalProducts*/ 512) set_data_dev(t0, /*totalProducts*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(85:8) {#if parentFilters.length > 0 || childFilters.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (97:12) {#if i >= postRangeLow && i < postRangeHigh}
    function create_if_block_1(ctx) {
    	let productcard;
    	let current;

    	productcard = new ProductCard({
    			props: { product: /*product*/ ctx[26] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(productcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(productcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const productcard_changes = {};
    			if (dirty & /*allProductsList*/ 128) productcard_changes.product = /*product*/ ctx[26];
    			productcard.$set(productcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(productcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(97:12) {#if i >= postRangeLow && i < postRangeHigh}",
    		ctx
    	});

    	return block;
    }

    // (96:8) {#each allProductsList as product, i}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*i*/ ctx[28] >= /*postRangeLow*/ ctx[13] && /*i*/ ctx[28] < /*postRangeHigh*/ ctx[8] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[28] >= /*postRangeLow*/ ctx[13] && /*i*/ ctx[28] < /*postRangeHigh*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*postRangeLow, postRangeHigh*/ 8448) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(96:8) {#each allProductsList as product, i}",
    		ctx
    	});

    	return block;
    }

    // (104:8) {#if totalPages > 1}
    function create_if_block(ctx) {
    	let pagination;
    	let updating_currentPage;
    	let current;

    	function pagination_currentPage_binding(value) {
    		/*pagination_currentPage_binding*/ ctx[25](value);
    	}

    	let pagination_props = { totalPages: /*totalPages*/ ctx[14] };

    	if (/*currentPage*/ ctx[3] !== void 0) {
    		pagination_props.currentPage = /*currentPage*/ ctx[3];
    	}

    	pagination = new Pagination({ props: pagination_props, $$inline: true });
    	binding_callbacks.push(() => bind(pagination, 'currentPage', pagination_currentPage_binding));

    	const block = {
    		c: function create() {
    			create_component(pagination.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pagination_changes = {};
    			if (dirty & /*totalPages*/ 16384) pagination_changes.totalPages = /*totalPages*/ ctx[14];

    			if (!updating_currentPage && dirty & /*currentPage*/ 8) {
    				updating_currentPage = true;
    				pagination_changes.currentPage = /*currentPage*/ ctx[3];
    				add_flush_callback(() => updating_currentPage = false);
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(104:8) {#if totalPages > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let section;
    	let t0;
    	let div0;
    	let t1;
    	let cardsperpage;
    	let updating_postsPerPage;
    	let t2;
    	let gridtogglebuttons;
    	let updating_gridStyle;
    	let t3;
    	let div1;
    	let ul;
    	let ul_class_value;
    	let t4;
    	let div2;
    	let section_class_value;
    	let current;
    	let if_block0 = /*showFilters*/ ctx[2] && create_if_block_3(ctx);
    	let if_block1 = (/*parentFilters*/ ctx[5].length > 0 || /*childFilters*/ ctx[6].length > 0) && create_if_block_2(ctx);

    	function cardsperpage_postsPerPage_binding(value) {
    		/*cardsperpage_postsPerPage_binding*/ ctx[23](value);
    	}

    	let cardsperpage_props = {};

    	if (/*postsPerPage*/ ctx[4] !== void 0) {
    		cardsperpage_props.postsPerPage = /*postsPerPage*/ ctx[4];
    	}

    	cardsperpage = new CardsPerPage({
    			props: cardsperpage_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(cardsperpage, 'postsPerPage', cardsperpage_postsPerPage_binding));

    	function gridtogglebuttons_gridStyle_binding(value) {
    		/*gridtogglebuttons_gridStyle_binding*/ ctx[24](value);
    	}

    	let gridtogglebuttons_props = {};

    	if (/*gridStyle*/ ctx[10] !== void 0) {
    		gridtogglebuttons_props.gridStyle = /*gridStyle*/ ctx[10];
    	}

    	gridtogglebuttons = new GridToggleButtons({
    			props: gridtogglebuttons_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(gridtogglebuttons, 'gridStyle', gridtogglebuttons_gridStyle_binding));
    	let each_value = /*allProductsList*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block2 = /*totalPages*/ ctx[14] > 1 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			create_component(cardsperpage.$$.fragment);
    			t2 = space();
    			create_component(gridtogglebuttons.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div2 = element("div");
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "archive-controls");
    			add_location(div0, file, 83, 4, 2534);

    			attr_dev(ul, "class", ul_class_value = /*gridStyle*/ ctx[10]
    			? 'product-archive-grid columns'
    			: 'product-archive-grid rows');

    			add_location(ul, file, 94, 4, 2996);
    			attr_dev(div1, "class", "product-archive-grid-container");
    			add_location(div1, file, 93, 4, 2947);
    			attr_dev(div2, "class", "pagination-container");
    			add_location(div2, file, 102, 4, 3286);
    			attr_dev(section, "class", section_class_value = "product-archive " + /*filtersClass*/ ctx[12]);
    			add_location(section, file, 55, 0, 1584);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			append_dev(section, div0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			mount_component(cardsperpage, div0, null);
    			append_dev(div0, t2);
    			mount_component(gridtogglebuttons, div0, null);
    			append_dev(section, t3);
    			append_dev(section, div1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(section, t4);
    			append_dev(section, div2);
    			if (if_block2) if_block2.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showFilters*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*showFilters*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*parentFilters*/ ctx[5].length > 0 || /*childFilters*/ ctx[6].length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const cardsperpage_changes = {};

    			if (!updating_postsPerPage && dirty & /*postsPerPage*/ 16) {
    				updating_postsPerPage = true;
    				cardsperpage_changes.postsPerPage = /*postsPerPage*/ ctx[4];
    				add_flush_callback(() => updating_postsPerPage = false);
    			}

    			cardsperpage.$set(cardsperpage_changes);
    			const gridtogglebuttons_changes = {};

    			if (!updating_gridStyle && dirty & /*gridStyle*/ 1024) {
    				updating_gridStyle = true;
    				gridtogglebuttons_changes.gridStyle = /*gridStyle*/ ctx[10];
    				add_flush_callback(() => updating_gridStyle = false);
    			}

    			gridtogglebuttons.$set(gridtogglebuttons_changes);

    			if (dirty & /*allProductsList, postRangeLow, postRangeHigh*/ 8576) {
    				each_value = /*allProductsList*/ ctx[7];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*gridStyle*/ 1024 && ul_class_value !== (ul_class_value = /*gridStyle*/ ctx[10]
    			? 'product-archive-grid columns'
    			: 'product-archive-grid rows')) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (/*totalPages*/ ctx[14] > 1) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*totalPages*/ 16384) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*filtersClass*/ 4096 && section_class_value !== (section_class_value = "product-archive " + /*filtersClass*/ ctx[12])) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(cardsperpage.$$.fragment, local);
    			transition_in(gridtogglebuttons.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(cardsperpage.$$.fragment, local);
    			transition_out(gridtogglebuttons.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(cardsperpage);
    			destroy_component(gridtogglebuttons);
    			destroy_each(each_blocks, detaching);
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let totalProducts;
    	let totalPages;
    	let postRangeHigh;
    	let postRangeLow;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { allProducts = [] } = $$props;
    	let { childCategories = [] } = $$props;
    	let { parentCategories = [] } = $$props;
    	let { showFilters = true } = $$props;
    	let currentPage = 1;
    	let postsPerPage;
    	let parentFilters = [];
    	let childFilters = [];
    	let allProductsList;
    	let gridStyle = true;
    	let openFilters = false;
    	let filtersClass;

    	if (showFilters) {
    		filtersClass = "";
    	} else {
    		filtersClass = "hide-filters";
    	}

    	function resetFilters() {
    		$$invalidate(5, parentFilters = []);
    		$$invalidate(6, childFilters = []);
    	}

    	const writable_props = ['allProducts', 'childCategories', 'parentCategories', 'showFilters'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(11, openFilters = !openFilters);
    	};

    	function filters_childCategories_binding(value) {
    		childCategories = value;
    		$$invalidate(0, childCategories);
    	}

    	function filters_parentCategories_binding(value) {
    		parentCategories = value;
    		$$invalidate(1, parentCategories);
    	}

    	function filters_parentFilters_binding(value) {
    		parentFilters = value;
    		$$invalidate(5, parentFilters);
    	}

    	function filters_childFilters_binding(value) {
    		childFilters = value;
    		$$invalidate(6, childFilters);
    	}

    	function filters_currentPage_binding(value) {
    		currentPage = value;
    		$$invalidate(3, currentPage);
    	}

    	function cardsperpage_postsPerPage_binding(value) {
    		postsPerPage = value;
    		$$invalidate(4, postsPerPage);
    	}

    	function gridtogglebuttons_gridStyle_binding(value) {
    		gridStyle = value;
    		$$invalidate(10, gridStyle);
    	}

    	function pagination_currentPage_binding(value) {
    		currentPage = value;
    		$$invalidate(3, currentPage);
    	}

    	$$self.$$set = $$props => {
    		if ('allProducts' in $$props) $$invalidate(16, allProducts = $$props.allProducts);
    		if ('childCategories' in $$props) $$invalidate(0, childCategories = $$props.childCategories);
    		if ('parentCategories' in $$props) $$invalidate(1, parentCategories = $$props.parentCategories);
    		if ('showFilters' in $$props) $$invalidate(2, showFilters = $$props.showFilters);
    	};

    	$$self.$capture_state = () => ({
    		allProducts,
    		childCategories,
    		parentCategories,
    		showFilters,
    		ProductCard,
    		Pagination,
    		CardsPerPage,
    		GridToggleButtons,
    		Filters,
    		currentPage,
    		postsPerPage,
    		parentFilters,
    		childFilters,
    		allProductsList,
    		gridStyle,
    		openFilters,
    		filtersClass,
    		resetFilters,
    		postRangeHigh,
    		postRangeLow,
    		totalProducts,
    		totalPages
    	});

    	$$self.$inject_state = $$props => {
    		if ('allProducts' in $$props) $$invalidate(16, allProducts = $$props.allProducts);
    		if ('childCategories' in $$props) $$invalidate(0, childCategories = $$props.childCategories);
    		if ('parentCategories' in $$props) $$invalidate(1, parentCategories = $$props.parentCategories);
    		if ('showFilters' in $$props) $$invalidate(2, showFilters = $$props.showFilters);
    		if ('currentPage' in $$props) $$invalidate(3, currentPage = $$props.currentPage);
    		if ('postsPerPage' in $$props) $$invalidate(4, postsPerPage = $$props.postsPerPage);
    		if ('parentFilters' in $$props) $$invalidate(5, parentFilters = $$props.parentFilters);
    		if ('childFilters' in $$props) $$invalidate(6, childFilters = $$props.childFilters);
    		if ('allProductsList' in $$props) $$invalidate(7, allProductsList = $$props.allProductsList);
    		if ('gridStyle' in $$props) $$invalidate(10, gridStyle = $$props.gridStyle);
    		if ('openFilters' in $$props) $$invalidate(11, openFilters = $$props.openFilters);
    		if ('filtersClass' in $$props) $$invalidate(12, filtersClass = $$props.filtersClass);
    		if ('postRangeHigh' in $$props) $$invalidate(8, postRangeHigh = $$props.postRangeHigh);
    		if ('postRangeLow' in $$props) $$invalidate(13, postRangeLow = $$props.postRangeLow);
    		if ('totalProducts' in $$props) $$invalidate(9, totalProducts = $$props.totalProducts);
    		if ('totalPages' in $$props) $$invalidate(14, totalPages = $$props.totalPages);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*childFilters, parentFilters, allProducts*/ 65632) {
    			if (childFilters.length == 0 && parentFilters.length == 0) {
    				$$invalidate(7, allProductsList = [...allProducts]);
    			}
    		}

    		if ($$self.$$.dirty & /*childFilters, allProducts*/ 65600) {
    			if (childFilters.length > 0) {
    				$$invalidate(7, allProductsList = allProducts.filter(function (product) {
    					return childFilters.indexOf(product.subcategoryId) !== -1;
    				}));
    			}
    		}

    		if ($$self.$$.dirty & /*parentFilters, childFilters, allProducts*/ 65632) {
    			if (parentFilters.length > 0 && childFilters.length == 0) {
    				$$invalidate(7, allProductsList = allProducts.filter(function (product) {
    					return parentFilters.indexOf(product.categoryId) !== -1;
    				}));
    			}
    		}

    		if ($$self.$$.dirty & /*allProductsList*/ 128) {
    			$$invalidate(9, totalProducts = allProductsList.length);
    		}

    		if ($$self.$$.dirty & /*totalProducts, postsPerPage*/ 528) {
    			$$invalidate(14, totalPages = Math.ceil(totalProducts / postsPerPage));
    		}

    		if ($$self.$$.dirty & /*currentPage, postsPerPage*/ 24) {
    			$$invalidate(8, postRangeHigh = currentPage * postsPerPage);
    		}

    		if ($$self.$$.dirty & /*postRangeHigh, postsPerPage*/ 272) {
    			$$invalidate(13, postRangeLow = postRangeHigh - postsPerPage);
    		}
    	};

    	return [
    		childCategories,
    		parentCategories,
    		showFilters,
    		currentPage,
    		postsPerPage,
    		parentFilters,
    		childFilters,
    		allProductsList,
    		postRangeHigh,
    		totalProducts,
    		gridStyle,
    		openFilters,
    		filtersClass,
    		postRangeLow,
    		totalPages,
    		resetFilters,
    		allProducts,
    		click_handler,
    		filters_childCategories_binding,
    		filters_parentCategories_binding,
    		filters_parentFilters_binding,
    		filters_childFilters_binding,
    		filters_currentPage_binding,
    		cardsperpage_postsPerPage_binding,
    		gridtogglebuttons_gridStyle_binding,
    		pagination_currentPage_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			allProducts: 16,
    			childCategories: 0,
    			parentCategories: 1,
    			showFilters: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get allProducts() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allProducts(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get childCategories() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set childCategories(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parentCategories() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentCategories(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showFilters() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showFilters(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    return App;

}));
//# sourceMappingURL=bundle.js.map
