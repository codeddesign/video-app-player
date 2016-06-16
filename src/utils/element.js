export default function(source) {
    var element = function(source) {
        this.source = source || document;

        this.source.find = function(selector, stopWarning) {
            var found = this.querySelector(selector);

            stopWarning = stopWarning || false;
            if (!found) {
                if (!stopWarning) {
                    console.warn('failed to find: ' + selector);
                }

                return false;
            }

            return new element(found);
        }

        this.source.findAll = function(selector) {
            var els = this.querySelectorAll(selector),
                i,
                list = [];

            for (i = 0; i < els.length; i++) {
                list.push(new element(els[i]));
            }

            return list;
        }

        this.source.data = function() {
            return this.dataset;
        }

        this.source.html = function(html) {
            if (html) {
                this.innerHTML = html.trim();
                return this;
            }

            return this.innerHTML;
        }

        this.source.css = function(property, value) {
            this.style[property] = value;
            return this;
        }

        this.source.hide = function() {
            this.addClass('hidden');
            return this;
        }

        this.source.show = function() {
            this.removeClass('hidden');
            return this;
        }

        this.source.removeClass = function(class_) {
            this.classList.remove(class_);
            return this;
        }

        this.source.addClass = function(class_) {
            this.classList.add(class_);
            return this;
        }

        this.source.hasClass = function(class_) {
            return this.classList.contains(class_);
        }

        this.source.toggleClasses = function(add, remove) {
            var classlist = this.classList,
                temp;

            if (classlist.contains(add)) {
                temp = add;
                add = remove;
                remove = temp;
            }

            this.addClass(add);
            this.removeClass(remove);

            return this;
        }

        this.source.attr = function(name, value) {
            if (name && !value) {
                return this.getAttribute(name);
            }

            if (name && value) {
                this.setAttribute(name, value);
            }
        }

        this.source.replaceElement = function(html) {
            var virtual = document.createElement('div');

            virtual.innerHTML = html.trim();

            this.parentNode.replaceChild(virtual.firstChild, this);

            return this;
        }

        this.source.insertElement = function(tag, properties, chain) {
            chain = chain || false;

            var node = document.createElement(tag);

            Object.keys(properties).forEach(function(key) {
                node[key] = properties[key];
            });

            this.appendChild(node);

            if (chain) {
                return new element(node);
            }

            return this;
        }

        this.source.insertAfter = function(tag, properties, chain) {
            chain = chain || false;

            var node = document.createElement(tag);

            Object.keys(properties).forEach(function(key) {
                node[key] = properties[key];
            });

            this.parentNode.insertBefore(node, this.nextSibling);

            if (chain) {
                return new element(node);
            }

            return this;
        }

        this.source.remove = function() {
            this.parentNode.removeChild(this);

            return this;
        }

        return this.source;
    }

    return new element(source);
};
